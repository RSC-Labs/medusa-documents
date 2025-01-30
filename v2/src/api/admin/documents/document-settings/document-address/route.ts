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
} from "@medusajs/framework/http"

import DocumentsModuleService from "../../../../../modules/documents/service"
import { DOCUMENTS_MODULE } from "../../../../../modules/documents"
import { DocumentAddress } from "../../../../../modules/documents/types/api"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const body: any = req.body as any;
  const address: DocumentAddress | undefined = body.address;
  const documentsModuleService: DocumentsModuleService = req.scope.resolve(DOCUMENTS_MODULE)

  try {
    if (address !== undefined) {
      const newSettings = await documentsModuleService.updateStoreDocumentAddress(address);
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