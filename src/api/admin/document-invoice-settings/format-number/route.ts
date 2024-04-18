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
import DocumentInvoiceSettingsService from "../../../../services/document-invoice-settings";
import { DocumentInvoiceSettings } from "../../../../models/document-invoice-settings";

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const documentInvoiceSettingsService: DocumentInvoiceSettingsService = req.scope.resolve('documentInvoiceSettingsService');
  const formatNumber: string | undefined = req.body.formatNumber;

  try {
    const newSettings: DocumentInvoiceSettings = await documentInvoiceSettingsService.updateFormatNumber(formatNumber);
    if (newSettings !== undefined) {
      res.status(201).json({
        settings: newSettings
      }); 
    } else {
      res.status(400).json({
        message: 'Cant update forced number'
    })
    }
    
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}