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

import { MedusaError, MedusaErrorTypes } from "@medusajs/utils"
import { MedusaService } from "@medusajs/framework/utils"
import { ModulesSdkUtils } from "@medusajs/framework/utils"
import { Logger, OrderDTO } from "@medusajs/framework/types"
import DocumentInvoice from "./models/document-invoice";
import DocumentPackingSlip from "./models/document-packing-slip";
import DocumentSettings from "./models/document-settings";
import DocumentInvoiceSettings from "./models/document-invoice-settings";
import DocumentPackingSlipSettings from "./models/document-packing-slip-settings";
import { DocumentAddress } from "./types/api";
import { InvoiceTemplateKind, PackingSlipTemplateKind } from "./types/template-kind";
import { INVOICE_NUMBER_PLACEHOLDER, PACKING_SLIP_NUMBER_PLACEHOLDER } from "./types/constants";
import { generateInvoice, validateInputForProvidedKind } from "./services/generators/invoice-generator";
import { generatePackingSlip, validateInputForProvidedKind as validatePackingSlipInputForProvidedKind } from "./services/generators/packing-slip-generator";
import { DocumentInvoiceDTO, DocumentInvoiceSettingsDTO, DocumentPackingSlipDTO } from "./types/dto";

type ModuleOptions = {
}

type PgConnectionType = ReturnType<typeof ModulesSdkUtils.createPgConnection>;

type InjectedDependencies = {
}

class DocumentsModuleService extends MedusaService({
  DocumentInvoice,
  DocumentPackingSlip,
  DocumentSettings,
  DocumentInvoiceSettings,
  DocumentPackingSlipSettings
}) {

  protected options_?: ModuleOptions
  protected logger_: Logger;
  protected pgConnection: PgConnectionType;

  constructor({
  }: InjectedDependencies, options?: ModuleOptions) {
    super(...arguments)
    this.options_ = options;
  }

  private async resetForcedNumberByCreatingNewSettings() : Promise<any> {
    const lastDocumentInvoiceSettings = await this.listDocumentInvoiceSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })
    if (lastDocumentInvoiceSettings && lastDocumentInvoiceSettings.length) {
      const result = await this.createDocumentInvoiceSettings({
        forcedNumber: undefined,
        numberFormat: lastDocumentInvoiceSettings[0].numberFormat,
        template: lastDocumentInvoiceSettings[0].template
      });
      return result;
    } else {
      const result = await this.createDocumentInvoiceSettings({
        forcedNumber: undefined
      })
      return result;
    }
  }

  private async getInvoiceForcedNumber() : Promise<string | undefined> {
    const lastDocumentInvoiceSettings = await this.listDocumentInvoiceSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    });
    if (lastDocumentInvoiceSettings && lastDocumentInvoiceSettings.length && lastDocumentInvoiceSettings[0].forcedNumber) {
      const nextNumber: string = lastDocumentInvoiceSettings[0].forcedNumber.toString();
      return nextNumber;
    }
    return undefined;
  }

  private async getNextInvoiceNumber(resetForcedNumber?: boolean) {
    const forcedNumber: string | undefined = await this.getInvoiceForcedNumber();

    if (forcedNumber !== undefined) {
      if (resetForcedNumber) {
        await this.resetForcedNumberByCreatingNewSettings();
      }
      return forcedNumber;
    }

    const lastInvoice = await this.listDocumentInvoices({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    });

    if (lastInvoice && lastInvoice.length) {
      return (lastInvoice[0].number + 1).toString();
    }
    return '1';
  }

  private async getNextPackingSlipNumber() {
    const lastPackingSlip = await this.listDocumentPackingSlips({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    });

    if (lastPackingSlip && lastPackingSlip.length) {
      return (lastPackingSlip[0].number + 1).toString();
    }
    return '1';
  }

  async getInvoice(order: OrderDTO, invoiceId: string, includeBuffer: boolean = false) : Promise<any> {
    if (includeBuffer) {
      const invoice = await this.retrieveDocumentInvoice(invoiceId,
        {
          relations: ['invoiceSettings', 'settings']
        }
      );
      if (invoice) {
        const calculatedTemplateKind = this.calculateTemplateKind(invoice.invoiceSettings);
        const buffer = await generateInvoice(calculatedTemplateKind, invoice.settings, invoice, order);
        return {
          invoice: invoice,
          buffer: buffer
        }
      }
    } else {
      const invoice = await this.retrieveDocumentInvoice(invoiceId);
      return {
        invoice: invoice,
        buffer: undefined
      }
    }
  }

  async getPackingSlip(order: OrderDTO, packingSlipId: string, includeBuffer: boolean = false) : Promise<any> {
    if (includeBuffer) {
      const packingSlip = await this.retrieveDocumentPackingSlip(packingSlipId,
        {
          relations: ['packingSlipSettings', 'settings']
        }
      );
      if (packingSlip) {
        const calculatedTemplateKind = this.calculatePackingSlipTemplateKind(packingSlip.packingSlipSettings);
        const buffer = await generatePackingSlip(calculatedTemplateKind, packingSlip.settings, packingSlip, order);
        return {
          packingSlip: packingSlip,
          buffer: buffer
        }
      }
    } else {
      const packingSlip = await this.retrieveDocumentPackingSlip(packingSlipId);
      return {
        packingSlip: packingSlip,
        buffer: undefined
      }
    }
  }

  async generateTestPackingSlip(order: OrderDTO, templateKind: PackingSlipTemplateKind) : Promise<any> {
    const lastDocumentSettings = await this.listDocumentSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })

    if (lastDocumentSettings && lastDocumentSettings.length) {
      const nextNumber: string = await this.getNextPackingSlipNumber();
      
      const [validationPassed, info] = validatePackingSlipInputForProvidedKind(templateKind, lastDocumentSettings[0]);
      if (validationPassed) {
        const testPackingSlip: DocumentPackingSlipDTO = {
          number: parseInt(nextNumber),
          displayNumber: nextNumber,
          created_at: new Date(Date.now())
        }

        const buffer = await generatePackingSlip(templateKind, lastDocumentSettings[0], testPackingSlip, order);

        return {
          packingSlip: testPackingSlip,
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
  }

  async generateTestInvoice(order: OrderDTO, templateKind: InvoiceTemplateKind) : Promise<any> {
    const lastDocumentSettings = await this.listDocumentSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })

    if (lastDocumentSettings && lastDocumentSettings.length) {
      const lastInvoiceSettings = await this.listDocumentInvoiceSettings({}, {
          order: {
            created_at: "DESC"
          },
          take: 1
        });
      if (lastInvoiceSettings && lastInvoiceSettings.length) {
        const invoiceSettings: any = lastInvoiceSettings[0];
        const nextNumber: string = await this.getNextInvoiceNumber();
        
        const [validationPassed, info] = validateInputForProvidedKind(templateKind, lastDocumentSettings[0]);
        if (validationPassed) {
          const testInvoice: DocumentInvoiceDTO = {
            number: parseInt(nextNumber),
            displayNumber: invoiceSettings.numberFormat ? invoiceSettings.numberFormat.replace(INVOICE_NUMBER_PLACEHOLDER, nextNumber) : nextNumber,
            created_at: new Date(Date.now())
          }

          const buffer = await generateInvoice(templateKind, lastDocumentSettings[0], testInvoice, order);

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
        'Document settings are not defined'
      );
    }
  }

  private calculateTemplateKind(documentInvoiceSettings: any) : InvoiceTemplateKind {
    if (documentInvoiceSettings && documentInvoiceSettings.template) {
      return documentInvoiceSettings.template as InvoiceTemplateKind;
    }
    return InvoiceTemplateKind.BASIC;
  }

  async generateInvoiceForOrder(order?: OrderDTO) : Promise<any> { 
    if (order) {
      const lastDocumentSettings = await this.listDocumentSettings({}, {
        order: {
          created_at: "DESC"
        },
        take: 1
      })
      if (lastDocumentSettings && lastDocumentSettings.length) {
        const lastDocumentInvoiceSettings = await this.listDocumentInvoiceSettings({}, {
          order: {
            created_at: "DESC"
          },
          take: 1
        })
        if (lastDocumentInvoiceSettings && lastDocumentInvoiceSettings.length) {
          const invoiceSettings: any = lastDocumentInvoiceSettings[0];
          const calculatedTemplateKind = this.calculateTemplateKind(lastDocumentInvoiceSettings[0]);
          const [validationPassed, info] = validateInputForProvidedKind(calculatedTemplateKind, lastDocumentSettings[0]);
          if (validationPassed) {
            const RESET_FORCED_NUMBER = true;
            const nextNumber: string = await this.getNextInvoiceNumber(RESET_FORCED_NUMBER);

            const entryInvoice: any = {
              number: parseInt(nextNumber),
              displayNumber: invoiceSettings.numberFormat ? invoiceSettings.numberFormat.replace(INVOICE_NUMBER_PLACEHOLDER, nextNumber) : nextNumber,
              created_at: new Date(Date.now()),
              invoice_settings_id: invoiceSettings.id,
              settings_id: lastDocumentSettings[0].id
            }

            const invoiceResult = await this.createDocumentInvoices(entryInvoice)

            const buffer = await generateInvoice(calculatedTemplateKind, lastDocumentSettings[0], invoiceResult, order);
            return {
              invoice: invoiceResult,
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
          'Document settings are not defined'
        );
      }
    }
    return undefined;
  }

  private calculatePackingSlipTemplateKind(documentPackingSlipSettings: any) : PackingSlipTemplateKind {
    if (documentPackingSlipSettings && documentPackingSlipSettings.template) {
      return documentPackingSlipSettings.template as PackingSlipTemplateKind;
    }
    return PackingSlipTemplateKind.BASIC;
  }

  async generatePackingSlipForOrder(order: OrderDTO) : Promise<any> { 
    const lastDocumentSettings = await this.listDocumentSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })
    if (lastDocumentSettings && lastDocumentSettings.length) {
      const lastDocumentPackingSlipSettings = await this.listDocumentPackingSlipSettings({}, {
        order: {
          created_at: "DESC"
        },
        take: 1
      })

      if (lastDocumentPackingSlipSettings && lastDocumentPackingSlipSettings.length) {
        const packingSlipSettings: any = lastDocumentPackingSlipSettings[0];
        const calculatedTemplateKind = this.calculatePackingSlipTemplateKind(lastDocumentPackingSlipSettings[0]);
        const [validationPassed, info] = validatePackingSlipInputForProvidedKind(calculatedTemplateKind, lastDocumentSettings[0]);
        
        if (validationPassed) {
          const nextNumber: string = await this.getNextPackingSlipNumber();

          const entryPackingSlip: any = {
            number: parseInt(nextNumber),
            displayNumber: packingSlipSettings.numberFormat ? packingSlipSettings.numberFormat.replace(PACKING_SLIP_NUMBER_PLACEHOLDER, nextNumber) : nextNumber,
            created_at: new Date(Date.now()),
            packing_slip_settings_id: packingSlipSettings.id,
            settings_id: lastDocumentSettings[0].id
          }

          const packingSlipResult = await this.createDocumentPackingSlips(entryPackingSlip)

          const buffer = await generatePackingSlip(calculatedTemplateKind, lastDocumentSettings[0], packingSlipResult, order);
          return {
            packingSlip: packingSlipResult,
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
          'Retrieve packing slip settings failed. Please check if they are set - e.g. if you set template or other settings.'
        );
      }
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'Document settings are not defined'
      );
    }
  }

  async updateInvoiceTemplate(invoiceTemplate?: InvoiceTemplateKind) : Promise<any> {
    const lastDocumentInvoiceSettings = await this.listDocumentInvoiceSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })
    if (lastDocumentInvoiceSettings && lastDocumentInvoiceSettings.length) {
      const newDocumentSettings = {
        template : invoiceTemplate ?? lastDocumentInvoiceSettings[0].template,
      }
      const result = await this.createDocumentInvoiceSettings(newDocumentSettings)
      return result;
    } else {
      const result = await this.createDocumentInvoiceSettings({
        template : invoiceTemplate
      })
      return result;
    }
  }

  async updatePackingSlipTemplate(packingSlipTemplate?: PackingSlipTemplateKind) : Promise<any> {
    const lastDocumentPackingSlipSettings = await this.listDocumentPackingSlipSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })
    if (lastDocumentPackingSlipSettings && lastDocumentPackingSlipSettings.length) {
      const newDocumentSettings = {
        template : packingSlipTemplate ?? lastDocumentPackingSlipSettings[0].template,
      }
      const result = await this.createDocumentPackingSlipSettings(newDocumentSettings)
      return result;
    } else {
      const result = await this.createDocumentPackingSlipSettings({
        template : packingSlipTemplate
      })
      return result;
    }
  }

  async updatePackingSlipSettings(newFormatNumber?: string, forcedNumber?: string, template?: PackingSlipTemplateKind) : Promise<any> {
    const lastDocumentPackingSlipSettings = await this.listDocumentPackingSlipSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })
    if (lastDocumentPackingSlipSettings && lastDocumentPackingSlipSettings.length) {
      const result = await this.createDocumentPackingSlipSettings({
        numberFormat: newFormatNumber ?? lastDocumentPackingSlipSettings[0].numberFormat,
        forcedNumber : forcedNumber ? parseInt(forcedNumber) : lastDocumentPackingSlipSettings[0].forcedNumber,
        template : template ?? lastDocumentPackingSlipSettings[0].template,
      })
      return result;
    } else {
      const result = await this.createDocumentPackingSlipSettings({
        numberFormat: newFormatNumber,
        forcedNumber : forcedNumber ? parseInt(forcedNumber) : undefined,
        template : template
      })
      return result;
    }
  }

  async updateInvoiceSettings(newFormatNumber?: string, forcedNumber?: string, invoiceTemplate?: InvoiceTemplateKind) : Promise<any> {
    const lastDocumentInvoiceSettings = await this.listDocumentInvoiceSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })
    if (lastDocumentInvoiceSettings && lastDocumentInvoiceSettings.length) {
      const result = await this.createDocumentInvoiceSettings({
        numberFormat: newFormatNumber ?? lastDocumentInvoiceSettings[0].numberFormat,
        forcedNumber : forcedNumber ? parseInt(forcedNumber) : lastDocumentInvoiceSettings[0].forcedNumber,
        template : invoiceTemplate ?? lastDocumentInvoiceSettings[0].template,
      })
      return result;
    } else {
      const result = await this.createDocumentInvoiceSettings({
        numberFormat: newFormatNumber,
        forcedNumber : forcedNumber ? parseInt(forcedNumber) : undefined,
        template : invoiceTemplate
      })
      return result;
    }
  }

  async updateStoreLogo(logoSource: string) : Promise<any> {
    const lastDocumentSettings = await this.listDocumentSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })
    if (lastDocumentSettings && lastDocumentSettings.length) {
      const result = await this.createDocumentSettings({
        storeLogoSource: logoSource,
        storeAddress: lastDocumentSettings[0].storeAddress
      });
      return result;
    } else {
      const result = await this.createDocumentSettings({
        storeLogoSource: logoSource
      })
      return result;
    }
  }

  async updateStoreDocumentAddress(address: DocumentAddress) : Promise<any> {
    const lastDocumentSettings = await this.listDocumentSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1,
      relations: ["documentInvoice", "documentPackingSlip"]
    })
    if (lastDocumentSettings && lastDocumentSettings.length) {
      const result = await this.createDocumentSettings({
        id: undefined,
        // created_at: undefined,
        // updated_at: undefined,
        // deleted_at: undefined,
        storeAddress: address,
        storeLogoSource: lastDocumentSettings[0].storeLogoSource,
        // documentInvoice: lastDocumentSettings[0].documentInvoice,
        // documentInvoice: lastDocumentSettings[0].documentInvoice,
        // documentPackingSlip: lastDocumentSettings[0].documentPackingSlip
      });
      return result;
    } else {
      const result = await this.createDocumentSettings({
        storeAddress: address,
      })
      return result;
    }
  }

  async getTestDisplayNumber(formatNumber?: string, forcedNumber?: string) : Promise<string | undefined> {
    const nextNumber: string | undefined = forcedNumber !== undefined ? forcedNumber : await this.getNextInvoiceNumber();
    if (nextNumber) {
      return formatNumber ? formatNumber.replace(INVOICE_NUMBER_PLACEHOLDER, nextNumber) : nextNumber;
    }
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      'Neither forced number is set or any order present'
    );
  }
}

export default DocumentsModuleService