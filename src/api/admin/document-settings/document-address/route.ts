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
import InvoiceService from "../../../../services/invoice";
import { DocumentSettings } from "../../../../models/document-settings";
import { DocumentAddress } from "../../../../services/types/api";

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const body: any = req.body as any;
  const invoiceService: InvoiceService = req.scope.resolve('invoiceService');
  const address: DocumentAddress | undefined = body.address;

  try {
    if (address !== undefined) {
      const newSettings: DocumentSettings | undefined = await invoiceService.updateStoreDocumentAddress(address);
      if (newSettings !== undefined) {
        res.status(201).json({
          settings: newSettings
        }); 
      } else {
        res.status(400).json({
          message: 'Cant update address'
        })
      }
    } else {
      res.status(400).json({
        message: 'Address not passed'
      })
    }
    
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}