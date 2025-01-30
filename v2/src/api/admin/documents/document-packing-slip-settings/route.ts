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
import { InvoiceTemplateKind, PackingSlipTemplateKind } from "../../../../modules/documents/types/template-kind"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const documentsModuleService: DocumentsModuleService = req.scope.resolve(DOCUMENTS_MODULE)

  try {
    const lastDocumentPackingSlipSettings = await documentsModuleService.listDocumentPackingSlipSettings({}, {
      order: {
        created_at: "DESC"
      },
      take: 1
    })
    res.status(200).json({
      settings: lastDocumentPackingSlipSettings && lastDocumentPackingSlipSettings.length ? lastDocumentPackingSlipSettings[0] : undefined
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

  const body: any = req.body as any;
  const formatNumber: string | undefined = body.formatNumber;
  const forcedNumber: string | undefined = body.forcedNumber;
  const template: string | undefined = body.template;
  const documentsModuleService: DocumentsModuleService = req.scope.resolve(DOCUMENTS_MODULE)

  try {
    const newSettings = await documentsModuleService.updatePackingSlipSettings(formatNumber, forcedNumber, template as PackingSlipTemplateKind)
    if (newSettings !== undefined) {
      res.status(201).json({
        settings: newSettings
      }); 
    } else {
      res.status(400).json({
        message: 'Cant update invoice settings'
      })
    }
   
    
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}