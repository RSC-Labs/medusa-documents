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

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const invoiceService: InvoiceService = req.scope.resolve('invoiceService');

  const formatNumber: string | undefined = req.query.formatNumber as string;
  const forcedNumber: string | undefined = req.query.forcedNumber as string;

  try {
    const nextDisplayNumber = await invoiceService.getTestDisplayNumber(formatNumber, forcedNumber);
    res.status(201).json({
      displayNumber: nextDisplayNumber
    })
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}