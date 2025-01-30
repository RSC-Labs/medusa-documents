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

import { DOCUMENTS_MODULE } from "../../../../modules/documents"
import DocumentsModuleService from "../../../../modules/documents/service"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const documentsModuleService: DocumentsModuleService = req.scope.resolve(DOCUMENTS_MODULE)

  try {
    const lastDocumentSettings = await documentsModuleService.listDocumentSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })
    res.status(200).json({
      settings: lastDocumentSettings && lastDocumentSettings.length ? lastDocumentSettings[0] : undefined
    });
    
  } catch (e) {
    res.status(400).json({
      message: e.message
    })
  }
}