import { EllipsisHorizontal } from "@medusajs/icons"
import { DropdownMenu, IconButton } from "@medusajs/ui"
import { Order } from "@medusajs/medusa";
import GenerateInvoiceDropdownButton from "./invoice/button-generate-invoice";
import ViewInvoiceDropdownButton from "./invoice/button-view-invoice";
import ViewPackingSlipDropdownButton from "./packing-slip/button-view-packing-slip";
import GeneratePackingSlipDropdownButton from "./packing-slip/button-generate-packing-slip";

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
        <DropdownMenu.Separator />
        {order && order.metadata && order.metadata['packing_slip_id'] && <ViewPackingSlipDropdownButton order={order}/>}
        <GeneratePackingSlipDropdownButton order={order}/>
      </DropdownMenu.Content>
    </DropdownMenu>
    </>
  )
}