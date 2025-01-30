import { EllipsisHorizontal } from "@medusajs/icons"
import { DropdownMenu, IconButton } from "@medusajs/ui"
import GenerateInvoiceDropdownButton from "./invoice/button-generate-invoice";
import GeneratePackingSlipDropdownButton from "./packing-slip/button-generate-packing-slip";

export function ActionsDropdown({order, updateInvoiceNumber, updatePackingSlipNumber} : {order: any, updateInvoiceNumber: any, updatePackingSlipNumber: any}) {

  return (
    <>
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton>
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <GenerateInvoiceDropdownButton order={order} updateInvoiceNumber={updateInvoiceNumber}/>
        <DropdownMenu.Separator />
        <GeneratePackingSlipDropdownButton order={order} updatePackingSlipNumber={updatePackingSlipNumber}/>
      </DropdownMenu.Content>
    </DropdownMenu>
    </>
  )
}