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
import { PackingSlip } from "../models/packing-slip";
import { DocumentSettings } from "../models/document-settings";
import { DocumentPackingSlipSettings } from "../models/document-packing-slip-settings";
import { DocumentAddress, PackingSlipResult } from "./types/api";
import { PackingSlipTemplateKind } from "./types/template-kind";
import { generate, validateInputForProvidedKind } from "./generators/packing-slip-generator";
import DocumentPackingSlipSettingsService from "./document-packing-slip-settings";
import { PACKING_SLIP_NUMBER_PLACEHOLDER } from "./types/constants";

export default class PackingSlipService extends TransactionBaseService {

  private readonly orderService: OrderService;
  private readonly documentPackingSlipSettingsService: DocumentPackingSlipSettingsService

  constructor(
    container,
  ) {
    super(container)
    this.orderService = container.orderService;
    this.documentPackingSlipSettingsService = container.documentPackingSlipSettingsService;
  }

  private calculateFormatNumber(documentPackingSlipSettings: DocumentPackingSlipSettings) : string | undefined {
    if (documentPackingSlipSettings && documentPackingSlipSettings.number_format) {
      return documentPackingSlipSettings.number_format;
    }

    return undefined;
  }

  private calculateTemplateKind(documentPackingSlipSettings: DocumentPackingSlipSettings) : PackingSlipTemplateKind {
    if (documentPackingSlipSettings && documentPackingSlipSettings.template) {
      return documentPackingSlipSettings.template as PackingSlipTemplateKind;
    }
    return PackingSlipTemplateKind.BASIC;
  }

  private async getNextNumber() {
    const lastPackingSlip: PackingSlip | undefined = await this.activeManager_
      .getRepository(PackingSlip)
      .createQueryBuilder('packs')
      .orderBy('created_at', 'DESC')
      .getOne()
    if (lastPackingSlip !== null && lastPackingSlip !== undefined) {
      return (parseInt(lastPackingSlip.number) + 1).toString();
    }
    return '1';
  }

  async getLastDocumentSettings() : Promise<DocumentSettings> | undefined {
    const documentSettingsRepository = this.activeManager_.getRepository(DocumentSettings);
    const lastDocumentSettings = await documentSettingsRepository.createQueryBuilder('documentSettings')
      .leftJoinAndSelect("documentSettings.store_address", "store_address")
      .orderBy('documentSettings.created_at', 'DESC')
      .getOne()

    return lastDocumentSettings;
  }

  async getPackingSlip(packingSlipId: string, includeBuffer: boolean = false): Promise<PackingSlipResult> {

    if (includeBuffer) {
      const packingSlip: PackingSlip | undefined = await this.activeManager_
      .getRepository(PackingSlip)
      .createQueryBuilder('packslip')
      .leftJoinAndSelect("packslip.document_settings", "document_settings")
      .leftJoinAndSelect("document_settings.store_address", "store_address")
      .leftJoinAndSelect("packslip.document_packing_slip_settings", "document_packing_slip_settings")
      .leftJoinAndSelect("packslip.order", "order")
      .where("packslip.id = :packingSlipId", { packingSlipId: packingSlipId })
      .getOne();

      if (packingSlip && packingSlip.document_settings) {
        const order = await this.orderService.retrieveWithTotals(
          packingSlip.order.id,
          {
            relations: ['billing_address', 'shipping_address', 'shipping_methods', 'shipping_methods.shipping_option']
          }
        );
        const calculatedTemplateKind = this.calculateTemplateKind(packingSlip.document_packing_slip_settings);
        const buffer = await generate(calculatedTemplateKind, packingSlip.document_settings, packingSlip, order);
        return {
          packingSlip: packingSlip,
          buffer: buffer
        }
      }
    }

    const packingSlip: PackingSlip | undefined = await this.activeManager_
      .getRepository(PackingSlip)
      .createQueryBuilder('packslip')
      .where("packslip.id = :packingSlipId", { packingSlipId: packingSlipId })
      .getOne();

    if (packingSlip) {
      return {
        packingSlip: packingSlip
      }
    }
    return {
      packingSlip: undefined,
      buffer: undefined
    }
  }

  async create(orderId: string) : Promise<PackingSlipResult> { 

    const order = await this.orderService.retrieveWithTotals(
      orderId,
      {
        relations: ['billing_address', 'shipping_address', 'shipping_methods', 'shipping_methods.shipping_option']
      }
    );
    if (order) {
      const settings = await this.getLastDocumentSettings();
      if (settings) {
        const packingSlipSettings: DocumentPackingSlipSettings = await this.documentPackingSlipSettingsService.getLastDocumentPackingSlipSettings();
        if (packingSlipSettings) {
          const calculatedTemplateKind = this.calculateTemplateKind(packingSlipSettings);
          const [validationPassed, info] = validateInputForProvidedKind(calculatedTemplateKind, settings);
          if (validationPassed) {
            const nextNumber: string = await this.getNextNumber();
            const newEntry = this.activeManager_.create(PackingSlip);
            newEntry.number = nextNumber;
  
            const packingSlipFormatNumber = this.calculateFormatNumber(packingSlipSettings);
  
            newEntry.display_number = packingSlipFormatNumber ? packingSlipFormatNumber.replace(PACKING_SLIP_NUMBER_PLACEHOLDER, newEntry.number) : newEntry.number;
            newEntry.order = order;
            newEntry.document_settings = settings;
            newEntry.document_packing_slip_settings = packingSlipSettings;
  
            const resultInvoice = await this.activeManager_.getRepository(PackingSlip).save(newEntry);
  
            const metaDataUpdate = setMetadata(order, {
              packing_slip_id: resultInvoice.id
            });
  
            order.metadata = metaDataUpdate;
  
            await this.activeManager_.getRepository(Order).save(order);
  
            const buffer = await generate(calculatedTemplateKind, settings, resultInvoice, order);
  
            return {
              packingSlip: newEntry,
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
            'Retrieve packing slip settings failed. Please check if they are set - e.g. if you set template or other settings.'
          );
        }
      } else {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          'Retrieve document settings failed. Please check if they are set.'
        );
      }
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'Cant retrieve order'
      );
    }
  }

  async generatePreview(templateKind: PackingSlipTemplateKind) : Promise<PackingSlipResult> {
    const lastOrder = await this.activeManager_.getRepository(Order).find({
      skip: 0,
      take: 1,
      order: { created_at: "DESC"},
    })

    if (lastOrder && lastOrder.length > 0) {
      const lastOrderWithTotals = await this.orderService.retrieveWithTotals(
        lastOrder[0].id,
        {
          relations: ['billing_address', 'shipping_address', 'shipping_methods', 'shipping_methods.shipping_option']
        }
      );
      const settings = await this.getLastDocumentSettings();
      if (settings) {
        const previewPackingSlip = this.activeManager_.create(PackingSlip);
        const nextNumber: string = await this.getNextNumber();
        previewPackingSlip.number = nextNumber;
        previewPackingSlip.display_number = nextNumber;
        previewPackingSlip.created_at = new Date(Date.now());
        const [validationPassed, info] = validateInputForProvidedKind(templateKind, settings);
        if (validationPassed) {
          const buffer = await generate(templateKind, settings, previewPackingSlip, lastOrderWithTotals);
          return {
            packingSlip: previewPackingSlip,
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
          'Document settings are not defined'
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