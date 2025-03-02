import {
  createWorkflow,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createRemoteLinkStep, dismissRemoteLinkStep } from "@medusajs/medusa/core-flows";
import { Modules } from "@medusajs/framework/utils";
import { DOCUMENTS_MODULE } from "../modules/documents";

type AssignInvoiceToOrderInput = {
  orderId: string,
  newInvoiceId: string,
  oldInvoiceId?: string
}

const assignInvoiceToOrderWorkflow = createWorkflow(
  "assign-invoice-to-order",
  function (input: AssignInvoiceToOrderInput) {

    when(
      input,
      (input) => {
        return input.oldInvoiceId !== undefined;
      }
    ).then(() => {
      dismissRemoteLinkStep([{
        [Modules.ORDER]: {
          order_id: input.orderId
        },
        [DOCUMENTS_MODULE]: {
          document_invoice_id: input.oldInvoiceId
        }
      }])
    })

    createRemoteLinkStep([{
      [Modules.ORDER]: {
        order_id: input.orderId
      },
      [DOCUMENTS_MODULE]: {
        document_invoice_id: input.newInvoiceId
      }
    }])

    return new WorkflowResponse({})
  }
)

export default assignInvoiceToOrderWorkflow