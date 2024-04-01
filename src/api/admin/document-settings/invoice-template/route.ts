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
import { TemplateKind } from "../../../../services/types/template-kind";


export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const invoiceService: InvoiceService = req.scope.resolve('invoiceService');

  try {
    const invoiceTemplate: string = await invoiceService.getInvoiceTemplate();
    res.status(200).json({
      invoiceTemplate: invoiceTemplate 
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

  const invoiceService: InvoiceService = req.scope.resolve('invoiceService');
  const invoiceTemplate: string | undefined = req.body.invoiceTemplate;

  try {
    const newSettings: DocumentSettings = await invoiceService.updateInvoiceTemplate(invoiceTemplate as TemplateKind);
    if (newSettings !== undefined) {
      res.status(201).json({
        settings: newSettings
      }); 
    } else {
      res.status(400).json({
        message: 'Cant update invoice template'
    })
    }
    
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}