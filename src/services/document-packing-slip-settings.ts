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

import { TransactionBaseService } from "@medusajs/medusa"
import { DocumentPackingSlipSettings } from "../models/document-packing-slip-settings";
import { MedusaError } from "@medusajs/utils"
import { PackingSlipTemplateKind } from "./types/template-kind";

export default class DocumentPackingSlipSettingsService extends TransactionBaseService {

  private copySettingsIfPossible(newSettings: DocumentPackingSlipSettings, lastSettings?: DocumentPackingSlipSettings) {
    if (lastSettings) {
      newSettings.forced_number = lastSettings.forced_number;
      newSettings.number_format = lastSettings.number_format;
      newSettings.template = lastSettings.template;
    }
  }

  async getPackingSlipForcedNumber() : Promise<string> | undefined {
    const lastDocumentPackingSlipSettings = await this.getLastDocumentPackingSlipSettings();
    if (lastDocumentPackingSlipSettings && lastDocumentPackingSlipSettings.forced_number) {
      const nextNumber: string = lastDocumentPackingSlipSettings.forced_number.toString();
      return nextNumber;
    }
    return undefined;
  }

  async resetForcedNumberByCreatingNewSettings() : Promise<DocumentPackingSlipSettings> {
    const documentPackingSlipSettingsRepository = this.activeManager_.getRepository(DocumentPackingSlipSettings);
    const newDocumentPackingSlipSettings = this.activeManager_.create(DocumentPackingSlipSettings);
    const lastDocumentPackingSlipSettings = await this.getLastDocumentPackingSlipSettings();
    this.copySettingsIfPossible(newDocumentPackingSlipSettings, lastDocumentPackingSlipSettings);

    newDocumentPackingSlipSettings.forced_number = undefined;

    const result = await documentPackingSlipSettingsRepository.save(newDocumentPackingSlipSettings);
    return result;
  }

  async getLastDocumentPackingSlipSettings() : Promise<DocumentPackingSlipSettings> | undefined {
    const documentPackingSlipSettingsRepository = this.activeManager_.getRepository(DocumentPackingSlipSettings);
    const lastDocumentPackingSlipSettings = await documentPackingSlipSettingsRepository.createQueryBuilder('documentPackingSlipSettings')
      .orderBy('documentPackingSlipSettings.created_at', 'DESC')
      .getOne()

    return lastDocumentPackingSlipSettings;
  }

  async getPackingSlipTemplate() : Promise<string> | undefined {
    const lastDocumentPackingSlipSettings = await this.getLastDocumentPackingSlipSettings();
    if (lastDocumentPackingSlipSettings) {
      return lastDocumentPackingSlipSettings.template;
    }
    return undefined;
  }

  async updatePackingSlipForcedNumber(forcedNumber: string | undefined) : Promise<DocumentPackingSlipSettings> | undefined {
    if (forcedNumber && !isNaN(Number(forcedNumber))) {
      const documentPackingSlipSettingsRepository = this.activeManager_.getRepository(DocumentPackingSlipSettings);
      const lastDocumentPackingSlipSettings = await this.getLastDocumentPackingSlipSettings();
      const newDocumentPackingSlipSettings = this.activeManager_.create(DocumentPackingSlipSettings);
      this.copySettingsIfPossible(newDocumentPackingSlipSettings, lastDocumentPackingSlipSettings);
      newDocumentPackingSlipSettings.forced_number = parseInt(forcedNumber);
      const result = await documentPackingSlipSettingsRepository.save(newDocumentPackingSlipSettings);

      return result;
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'You need to set proper number'
      );
    }
  }

  async updatePackingSlipTemplate(packingSlipTemplate: PackingSlipTemplateKind | undefined) : Promise<DocumentPackingSlipSettings> | undefined {
    const documentPackingSlipSettingsRepository = this.activeManager_.getRepository(DocumentPackingSlipSettings);
    const lastDocumentPackingSlipSettings = await this.getLastDocumentPackingSlipSettings();
    const newDocumentPackingSlipSettings = this.activeManager_.create(DocumentPackingSlipSettings);
    this.copySettingsIfPossible(newDocumentPackingSlipSettings, lastDocumentPackingSlipSettings);
    newDocumentPackingSlipSettings.template = packingSlipTemplate;
    const result = await documentPackingSlipSettingsRepository.save(newDocumentPackingSlipSettings);

    return result;
  }

  async updateFormatNumber(newFormatNumber: string | undefined) : Promise<DocumentPackingSlipSettings> | undefined {
    const documentPackingSlipSettingsRepository = this.activeManager_.getRepository(DocumentPackingSlipSettings);
    const lastDocumentPackingSlipSettings = await this.getLastDocumentPackingSlipSettings();
    const newDocumentPackingSlipSettings = this.activeManager_.create(DocumentPackingSlipSettings);
    this.copySettingsIfPossible(newDocumentPackingSlipSettings, lastDocumentPackingSlipSettings);
    newDocumentPackingSlipSettings.number_format = newFormatNumber;
    const result = await documentPackingSlipSettingsRepository.save(newDocumentPackingSlipSettings);

    return result;
  }

  async updateSettings(newFormatNumber?: string, forcedNumber?: string, packingSlipTemplate?: PackingSlipTemplateKind) : Promise<DocumentPackingSlipSettings> | undefined {
    const documentPackingSlipSettingsRepository = this.activeManager_.getRepository(DocumentPackingSlipSettings);
    const newDocumentPackingSlipSettings = this.activeManager_.create(DocumentPackingSlipSettings);
    const lastDocumentPackingSlipSettings = await this.getLastDocumentPackingSlipSettings();
    this.copySettingsIfPossible(newDocumentPackingSlipSettings, lastDocumentPackingSlipSettings);
    if (newFormatNumber) {
      newDocumentPackingSlipSettings.number_format = newFormatNumber;
    }
    if (forcedNumber !== undefined && !isNaN(Number(forcedNumber))) {
      newDocumentPackingSlipSettings.forced_number = parseInt(forcedNumber);
    }
    if (packingSlipTemplate) {
      newDocumentPackingSlipSettings.template = packingSlipTemplate;
    }
    const result = await documentPackingSlipSettingsRepository.save(newDocumentPackingSlipSettings);
    return result;
  }
}