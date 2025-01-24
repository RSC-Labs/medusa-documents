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


export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const invoiceService: InvoiceService = req.scope.resolve('invoiceService');

  try {
    const logoSource: string | undefined = await invoiceService.getStoreLogo();
    res.status(200).json({
      logoSource: logoSource
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
  const invoiceService: InvoiceService = req.scope.resolve('invoiceService');
  const logoSource: string | undefined = body.logoSource;

  try {
    if (logoSource) {
      const newSettings: DocumentSettings | undefined = await invoiceService.updateStoreLogo(logoSource);
      if (newSettings !== undefined) {
        res.status(201).json({
          settings: newSettings
        }); 
      } else {
        res.status(400).json({
          message: 'Cant update logo'
        })
      }
    } else {
      res.status(400).json({
        message: 'Logo source not passed'
      })
    }
    
    
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}