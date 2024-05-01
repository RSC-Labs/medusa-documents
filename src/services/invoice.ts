/*
 * Copyright 2024 RSC-Labs, https://rsoftcon.com/
 *
 * MIT License
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Address, TransactionBaseService, setMetadata } from "@medusajs/medusa"
import { Order, OrderService, } from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils"
import { Invoice } from "../models/invoice";
import { DocumentSettings } from "../models/document-settings";
import { DocumentInvoiceSettings } from "../models/document-invoice-settings";
import { DocumentAddress, InvoiceResult } from "./types/api";
import { TemplateKind } from "./types/template-kind";
import { generateInvoice, validateInputForProvidedKind } from "./generators/invoice-generator";
import { INVOICE_NUMBER_PLACEHOLDER } from "./types/constants";
import DocumentInvoiceSettingsService from "./document-invoice-settings";

export default class InvoiceService extends TransactionBaseService {

  private readonly orderService: OrderService;
  private readonly documentInvoiceSettingsService: DocumentInvoiceSettingsService

  constructor(
    container,
  ) {
    super(container)
    this.orderService = container.orderService;
    this.documentInvoiceSettingsService = container.documentInvoiceSettingsService;
  }

  private calculateTemplateKind(documentSettings: DocumentSettings, documentInvoiceSettings: DocumentInvoiceSettings) : TemplateKind {
    if (documentInvoiceSettings && documentInvoiceSettings.invoice_template) {
      return documentInvoiceSettings.invoice_template as TemplateKind;
    }
    // Legacy
    if (documentSettings && documentSettings.invoice_template) {
      return documentSettings.invoice_template as TemplateKind;
    }
    return TemplateKind.BASIC;
  }

  private calculateFormatNumber(documentSettings: DocumentSettings, documentInvoiceSettings: DocumentInvoiceSettings) : string | undefined {
    if (documentInvoiceSettings && documentInvoiceSettings.invoice_number_format) {
      return documentInvoiceSettings.invoice_number_format;
    }
    // Legacy
    if (documentSettings && documentSettings.invoice_number_format) {
      return documentSettings.invoice_number_format;
    }

    return undefined;
  }

  private async getNextInvoiceNumber(resetForcedNumber?: boolean) {
    const forcedNumber: string | undefined = await this.documentInvoiceSettingsService.getInvoiceForcedNumber();

    if (forcedNumber !== undefined) {
      if (resetForcedNumber) {
        await this.documentInvoiceSettingsService.resetForcedNumberByCreatingNewSettings();
      }
      return forcedNumber;
    }

    const lastInvoice: Invoice | undefined = await this.activeManager_
      .getRepository(Invoice)
      .createQueryBuilder('invoice')
      .orderBy('created_at', 'DESC')
      .getOne()
    if (lastInvoice !== null && lastInvoice !== undefined) {
      return (parseInt(lastInvoice.number) + 1).toString();
    }
    return '1';
  }

  private copySettingsIfPossible(newSettings: DocumentSettings, lastSettings?: DocumentSettings) {
    if (lastSettings) {
      newSettings.invoice_number_format = lastSettings.invoice_number_format;
      newSettings.invoice_template = lastSettings.invoice_template;
      newSettings.store_address = lastSettings.store_address;
      newSettings.store_logo_source = lastSettings.store_logo_source;
    }
  }

  async getTestDisplayNumber(formatNumber?: string, forcedNumber?: string) : Promise<string> | undefined {
    const nextNumber: string | undefined = forcedNumber !== undefined ? forcedNumber : await this.getNextInvoiceNumber();
    if (nextNumber) {
      return formatNumber ? formatNumber.replace(INVOICE_NUMBER_PLACEHOLDER, nextNumber) : nextNumber;
    }
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      'Neither forced number is set or any order present'
    );
  }

  async getInvoiceTemplate() : Promise<string> | undefined {

    const documentSettingsRepository = this.activeManager_.getRepository(DocumentSettings);
    const lastDocumentSettings = await documentSettingsRepository.createQueryBuilder('documentSettings')
      .orderBy('created_at', 'DESC')
      .getOne()
    
    if (lastDocumentSettings) {
      return lastDocumentSettings.invoice_template;
    }
    return undefined;
  }

  async getStoreLogo() : Promise<string> | undefined {

    const documentSettingsRepository = this.activeManager_.getRepository(DocumentSettings);
    const lastDocumentSettings = await documentSettingsRepository.createQueryBuilder('documentSettings')
      .orderBy('created_at', 'DESC')
      .getOne()
    
    if (lastDocumentSettings) {
      return lastDocumentSettings.store_logo_source;
    }
    return undefined;
  }

  
  async updateStoreLogo( newLogoSource: string ) : Promise<DocumentSettings> | undefined {
    const documentSettingsRepository = this.activeManager_.getRepository(DocumentSettings);
    const lastDocumentSettings = await documentSettingsRepository.createQueryBuilder('documentSettings')
      .leftJoinAndSelect("documentSettings.store_address", "store_address")
      .orderBy('documentSettings.created_at', 'DESC')
      .getOne()
    const newDocumentSettings = this.activeManager_.create(DocumentSettings);
    this.copySettingsIfPossible(newDocumentSettings, lastDocumentSettings);
    newDocumentSettings.store_logo_source = newLogoSource;

    const result = await documentSettingsRepository.save(newDocumentSettings);

    return result;
  }

  async updateStoreDocumentAddress( newAddress: DocumentAddress ) : Promise<DocumentSettings> | undefined {
    const newEntry = this.activeManager_.create(Address);
    newEntry.company = newAddress.company;
    newEntry.first_name = newAddress.first_name;
    newEntry.last_name = newAddress.last_name;
    newEntry.city = newAddress.city;
    newEntry.address_1 = newAddress.address_1;
    newEntry.postal_code = newAddress.postal_code;
    newEntry.phone = newAddress.phone;

    const resultAddress = await this.activeManager_.getRepository(Address).save(newEntry);

    const documentSettingsRepository = this.activeManager_.getRepository(DocumentSettings);
    const lastDocumentSettings = await documentSettingsRepository.createQueryBuilder('documentSettings')
      .leftJoinAndSelect("documentSettings.store_address", "store_address")
      .orderBy('documentSettings.created_at', 'DESC')
      .getOne()

    
    const newDocumentSettings = this.activeManager_.create(DocumentSettings);
    this.copySettingsIfPossible(newDocumentSettings, lastDocumentSettings);
    newDocumentSettings.store_address = resultAddress;

    const result = await documentSettingsRepository.save(newDocumentSettings);

    return result;
  }

  async getLastDocumentSettings() : Promise<DocumentSettings> | undefined {
    const documentSettingsRepository = this.activeManager_.getRepository(DocumentSettings);
    const lastDocumentSettings = await documentSettingsRepository.createQueryBuilder('documentSettings')
      .leftJoinAndSelect("documentSettings.store_address", "store_address")
      .orderBy('documentSettings.created_at', 'DESC')
      .getOne()

    return lastDocumentSettings;
  }

  async getInvoice(invoiceId: string, includeBuffer: boolean = false): Promise<InvoiceResult> {

    if (includeBuffer) {
      const invoice: Invoice | undefined = await this.activeManager_
      .getRepository(Invoice)
      .createQueryBuilder('invoice')
      .leftJoinAndSelect("invoice.document_settings", "document_settings")
      .leftJoinAndSelect("document_settings.store_address", "store_address")
      .leftJoinAndSelect("invoice.document_invoice_settings", "document_invoice_settings")
      .leftJoinAndSelect("invoice.order", "order")
      .where("invoice.id = :invoiceId", { invoiceId: invoiceId })
      .getOne();

      if (invoice && invoice.document_settings) {
        const order = await this.orderService.retrieveWithTotals(
          invoice.order.id,
          {
            relations: ['billing_address', 'shipping_address']
          }
        );
        const calculatedTemplateKind = this.calculateTemplateKind(invoice.document_settings, invoice.document_invoice_settings);
        const buffer = await generateInvoice(calculatedTemplateKind, invoice.document_settings, invoice, order);
        return {
          invoice: invoice,
          buffer: buffer
        }
      }
    }

    const invoice: Invoice | undefined = await this.activeManager_
      .getRepository(Invoice)
      .createQueryBuilder('invoice')
      .where("invoice.id = :invoiceId", { invoiceId: invoiceId })
      .getOne();

    if (invoice) {
      return {
        invoice: invoice
      }
    }
    return {
      invoice: undefined,
      buffer: undefined
    }
  }

  async generateInvoiceForOrder(orderId: string) : Promise<InvoiceResult> { 

    const order = await this.orderService.retrieveWithTotals(
      orderId,
      {
        relations: ['billing_address', 'shipping_address']
      }
    );
    if (order) {
      const settings = await this.getLastDocumentSettings();
      if (settings) {
        const invoiceSettings: DocumentInvoiceSettings = await this.documentInvoiceSettingsService.getLastDocumentInvoiceSettings();
        const calculatedTemplateKind = this.calculateTemplateKind(settings, invoiceSettings);
        const [validationPassed, info] = validateInputForProvidedKind(calculatedTemplateKind, settings);
        if (validationPassed) {
          const RESET_FORCED_NUMBER = true;
          const nextNumber: string = await this.getNextInvoiceNumber(RESET_FORCED_NUMBER);
          const newEntry = this.activeManager_.create(Invoice);
          newEntry.number = nextNumber;

          const invoiceFormatNumber = this.calculateFormatNumber(settings, invoiceSettings);

          newEntry.display_number = invoiceFormatNumber ? invoiceFormatNumber.replace(INVOICE_NUMBER_PLACEHOLDER, newEntry.number) : newEntry.number;
          newEntry.order = order;
          newEntry.document_settings = settings;
          newEntry.document_invoice_settings = invoiceSettings;

          const resultInvoice = await this.activeManager_.getRepository(Invoice).save(newEntry);

          const metaDataUpdate = setMetadata(order, {
            invoice_id: resultInvoice.id
          });

          order.metadata = metaDataUpdate;

          await this.activeManager_.getRepository(Order).save(order);

          const buffer = await generateInvoice(calculatedTemplateKind, settings, resultInvoice, order);

          return {
            invoice: newEntry,
            buffer: buffer
          };
        } else {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            info
          );
        }
      } else {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          'Retrieve invoice settings failed. Please check if they are set.'
        );
      }
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'Cant retrieve order'
      );
    }
  }

  async generateTestInvoice(templateKind: TemplateKind) : Promise<InvoiceResult> {

    const lastOrder = await this.activeManager_.getRepository(Order).find({
      skip: 0,
      take: 1,
      order: { created_at: "DESC"},
    })

    if (lastOrder.length > 0) {
      const lastOrderWithTotals = await this.orderService.retrieveWithTotals(
        lastOrder[0].id,
        {
          relations: ['billing_address', 'shipping_address']
        }
      );
      const settings = await this.getLastDocumentSettings();
      if (settings) {
        const invoiceSettings: DocumentInvoiceSettings = await this.documentInvoiceSettingsService.getLastDocumentInvoiceSettings();
        const testInvoice = this.activeManager_.create(Invoice);
        const nextNumber: string = await this.getNextInvoiceNumber();
        testInvoice.number = nextNumber;
        testInvoice.display_number = invoiceSettings.invoice_number_format ? invoiceSettings.invoice_number_format.replace(INVOICE_NUMBER_PLACEHOLDER, testInvoice.number) : testInvoice.number;
        testInvoice.created_at = new Date(Date.now());
        const [validationPassed, info] = validateInputForProvidedKind(templateKind, settings);
        if (validationPassed) {
          const buffer = await generateInvoice(templateKind, settings, testInvoice, lastOrderWithTotals);
          return {
            invoice: testInvoice,
            buffer: buffer
          }
        } else {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            info
          );
        }
      } else {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          'Invoice settings are not defined'
        );
      }
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'You need to have at least one order to see preview'
      );
    }
  }
}