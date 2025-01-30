import DocumentsModule from "../modules/documents"
import OrderModule from "@medusajs/medusa/order"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  OrderModule.linkable.order,
  {
    linkable: DocumentsModule.linkable.documentPackingSlip,
    deleteCascade: true
  }
)