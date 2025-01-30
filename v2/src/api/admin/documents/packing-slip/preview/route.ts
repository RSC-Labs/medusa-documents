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
import { MedusaError } from "@medusajs/utils"
import { IOrderModuleService, OrderDTO } from "@medusajs/framework/types"
import { PackingSlipTemplateKind } from "../../../../../modules/documents/types/template-kind";
import { DOCUMENTS_MODULE } from "../../../../../modules/documents"
import DocumentsModuleService from "../../../../../modules/documents/service"
import { Modules } from "@medusajs/framework/utils";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const documentsModuleService: DocumentsModuleService = req.scope.resolve(DOCUMENTS_MODULE)

  const orderModuleService: IOrderModuleService  = req.scope.resolve(
    Modules.ORDER
  );

  const lastOrders: OrderDTO[] = await orderModuleService.listOrders({}, {
    order: {
      created_at: "DESC"
    },
    take: 1,
    select: ['*', 'item_total', 'shipping_total', 'tax_total'],
    relations: ['shipping_address', 'billing_address', 'items']
  })
  try {
    if (lastOrders && lastOrders.length) {
        const rawRequest = req as unknown as any;
        const templateKind = rawRequest.query.template;
        const result = await documentsModuleService.generateTestPackingSlip(lastOrders[0], templateKind as PackingSlipTemplateKind)
        res.status(201).json(result);
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'You need to have at least one order to see preview'
      );
    }
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}