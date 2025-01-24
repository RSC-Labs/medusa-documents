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
import InvoiceService from "../../../services/invoice";
import { InvoiceResult } from "../../../services/types/api";

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const invoiceService: InvoiceService = req.scope.resolve('invoiceService');

  try {
    const body: any = req.body as any;
    const result: InvoiceResult = await invoiceService.generateInvoiceForOrder(body.orderId);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const invoiceService: InvoiceService = req.scope.resolve('invoiceService');

  const invoiceId = req.query.invoiceId;
  const includeBuffer = req.query.includeBuffer;
  try {
    const result: InvoiceResult = await invoiceService.getInvoice(invoiceId as string, includeBuffer !== undefined);
    res.status(200).json(result);
    
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}