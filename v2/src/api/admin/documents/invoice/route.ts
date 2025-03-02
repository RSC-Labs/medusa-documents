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
import assignInvoiceToOrderWorkflow from "../../../../workflows/assign-invoice"


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
      const result = await documentsModuleService.generateInvoiceForOrder(order)
      if (result.invoice) {
        const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
        const { 
          data: [orderWithInvoice],
        } = await query.graph({
          entity: "order",
          filters: {
            id: [
              order.id
            ]
          },
          fields: [
            "document_invoice.*",
          ],
        });
        await assignInvoiceToOrderWorkflow(req.scope)
          .run({
            input: {
              orderId: order.id,
              newInvoiceId: result.invoice.id,
              oldInvoiceId: orderWithInvoice.document_invoice ? orderWithInvoice.document_invoice.id : undefined
            }
          })

        res.status(201).json(result);
      } else {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          'Invoice not generated'
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
      data: [orderWithInvoice],
    } = await query.graph({
      entity: "order",
      filters: {
        id: [
          orderId
        ]
      },
      fields: [
        "document_invoice.*",
      ],
    });
    if (orderWithInvoice.document_invoice && orderId) {
      const orderModuleService: IOrderModuleService  = req.scope.resolve(
        Modules.ORDER
      );
      const orderDto = await orderModuleService.retrieveOrder(orderId, 
        {
          select: ['*', 'item_total', 'shipping_total', 'tax_total'],
          relations: ['shipping_address', 'billing_address', 'items']
        }
      );
      const result = await documentsModuleService.getInvoice(orderDto, orderWithInvoice.document_invoice.id, includeBuffer !== undefined);
      res.status(200).json(result);
    } else {
      const result = {
        invoice: undefined
      }
      res.status(200).json(result);
    }
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}