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
import { DOCUMENTS_MODULE } from "../../../../../modules/documents"
import DocumentsModuleService from "../../../../../modules/documents/service"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const rawRequest = req as unknown as any;
  const formatNumber: string | undefined = rawRequest.query.formatNumber;
  const forcedNumber: string | undefined = rawRequest.query.forcedNumber;

  const documentsModuleService: DocumentsModuleService = req.scope.resolve(DOCUMENTS_MODULE)

  try {
    const nextDisplayNumber = await documentsModuleService.getTestDisplayNumber(formatNumber, forcedNumber)
    res.status(201).json({
      displayNumber: nextDisplayNumber
    })
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}