import { EllipsisHorizontal } from "@medusajs/icons"
import { DropdownMenu, IconButton, Toaster } from "@medusajs/ui"
import { Order } from "@medusajs/medusa";
import GenerateInvoiceDropdownButton from "./button-generate-invoice";
import ViewInvoiceDropdownButton from "./button-view-invoice";

export function ActionsDropdown({order} : {order: Order}) {
  return (
    <>
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton>
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {order && order.metadata && order.metadata['invoice_id'] && <ViewInvoiceDropdownButton order={order}/>}
        <GenerateInvoiceDropdownButton order={order}/>
      </DropdownMenu.Content>
    </DropdownMenu>
    </>
  )
}