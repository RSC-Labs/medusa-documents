import {
  createWorkflow,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createRemoteLinkStep, dismissRemoteLinkStep } from "@medusajs/medusa/core-flows";
import { Modules } from "@medusajs/framework/utils";
import { DOCUMENTS_MODULE } from "../modules/documents";

type AssignPackingSlipToOrderInput = {
  orderId: string,
  newPackingSlipId: string,
  oldPackingSlipId?: string
}

const assignPackingSlipToOrderWorkflow = createWorkflow(
  "assign-packing-slip-to-order",
  function (input: AssignPackingSlipToOrderInput) {

    when(
      input,
      (input) => {
        return input.oldPackingSlipId !== undefined;
      }
    ).then(() => {
      dismissRemoteLinkStep([{
        [Modules.ORDER]: {
          order_id: input.orderId
        },
        [DOCUMENTS_MODULE]: {
          document_packing_slip_id: input.oldPackingSlipId
        }
      }])
    })

    createRemoteLinkStep([{
      [Modules.ORDER]: {
        order_id: input.orderId
      },
      [DOCUMENTS_MODULE]: {
        document_packing_slip_id: input.newPackingSlipId
      }
    }])

    return new WorkflowResponse({})
  }
)

export default assignPackingSlipToOrderWorkflow