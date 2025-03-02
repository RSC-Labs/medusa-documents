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
import { IOrderModuleService, OrderDTO } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/utils"
import DocumentsModuleService from "../../../../modules/documents/service"
import { DOCUMENTS_MODULE } from "../../../../modules/documents"
import { Modules } from "@medusajs/framework/utils";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import assignPackingSlipToOrderWorkflow from "./../../../../workflows/assign-packing-slip"


export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const documentsModuleService: DocumentsModuleService = req.scope.resolve(DOCUMENTS_MODULE)
  const orderModuleService: IOrderModuleService  = req.scope.resolve(
    Modules.ORDER
  );

  try {
    const body: any = req.body as any;
    const order: OrderDTO = await orderModuleService.retrieveOrder(body.order_id, {
      select: ['*', 'item_total', 'shipping_total', 'tax_total'],
      relations: ['shipping_address', 'billing_address', 'items']
    })
    if (order) {
      const result = await documentsModuleService.generatePackingSlipForOrder(order)
      if (result.packingSlip) {
        const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
        const { 
          data: [orderWithPackingSlip],
        } = await query.graph({
          entity: "order",
          filters: {
            id: [
              order.id
            ]
          },
          fields: [
            "document_packing_slip.*",
          ],
        });
        await assignPackingSlipToOrderWorkflow(req.scope)
          .run({
            input: {
              orderId: order.id,
              newPackingSlipId: result.packingSlip.id,
              oldPackingSlipId: orderWithPackingSlip.document_packing_slip ? orderWithPackingSlip.document_packing_slip.id : undefined
            }
          })
        res.status(201).json(result);
      } else {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          'Packing slip not generated'
        );
      }
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'Invalid order id'
      );
    }
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

  const documentsModuleService: DocumentsModuleService = req.scope.resolve(DOCUMENTS_MODULE)

  const orderId = req.query.orderId as string;
  const includeBuffer = req.query.includeBuffer;

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const { 
      data: [orderWithPackingSlip],
    } = await query.graph({
      entity: "order",
      filters: {
        id: [
          orderId
        ]
      },
      fields: [
        "document_packing_slip.*",
      ],
    });
    if (orderWithPackingSlip.document_packing_slip && orderId) {
      const orderModuleService: IOrderModuleService  = req.scope.resolve(
        Modules.ORDER
      );
      const orderDto = await orderModuleService.retrieveOrder(orderId,
        {
          select: ['*', 'item_total', 'shipping_total', 'tax_total'],
          relations: ['shipping_address', 'billing_address', 'items']
        }
      );
      const result = await documentsModuleService.getPackingSlip(orderDto, orderWithPackingSlip.document_packing_slip.id, includeBuffer !== undefined);
      res.status(200).json(result);
    } else {
      const result = {
        packingSlip: undefined
      }
      res.status(200).json(result);
    }
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}