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

import type { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/medusa"
import DocumentPackingSlipSettingsService from "../../../services/document-packing-slip-settings";
import { DocumentPackingSlipSettings } from "../../..//models/document-packing-slip-settings";
import { PackingSlipTemplateKind } from "../../../services/types/template-kind";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const documentPackingSlipSettingsService: DocumentPackingSlipSettingsService = req.scope.resolve('documentPackingSlipSettingsService');

  try {
    const lastDocumentPackingSlipSettings: DocumentPackingSlipSettings = await documentPackingSlipSettingsService.getLastDocumentPackingSlipSettings();
    res.status(200).json({
      settings: lastDocumentPackingSlipSettings
    });
    
  } catch (e) {
    res.status(400).json({
      message: e.message
    })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const documentPackingSlipSettingsService: DocumentPackingSlipSettingsService = req.scope.resolve('documentPackingSlipSettingsService');
  const formatNumber: string | undefined = req.body.formatNumber;
  const forcedNumber: string | undefined = req.body.forcedNumber;
  const template: string | undefined = req.body.template;

  try {
    const newSettings: DocumentPackingSlipSettings = await documentPackingSlipSettingsService.updateSettings(formatNumber, forcedNumber, template as PackingSlipTemplateKind);
    if (newSettings !== undefined) {
      res.status(201).json({
        settings: newSettings
      }); 
    } else {
      res.status(400).json({
        message: 'Cant update settings'
    })
    }
    
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}