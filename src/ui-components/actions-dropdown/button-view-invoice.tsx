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

import { DocumentText } from "@medusajs/icons"
import { Order } from "@medusajs/medusa"
import { DropdownMenu, useToast } from "@medusajs/ui"
import { useAdminCustomQuery } from "medusa-react";
import { InvoiceResult } from "../types/api";

type AdminGenerateInvoiceQueryReq = {
  invoiceId: string,
  includeBuffer: boolean
}

const ViewInvoiceDropdownButton = ({ order } : {order : Order}) => {
  const toast = useToast()

  const { data, refetch } = useAdminCustomQuery
    <AdminGenerateInvoiceQueryReq, InvoiceResult>(
      "/invoice",
      [],
      {
        invoiceId: order.metadata['invoice_id'] as string,
        includeBuffer: true
      },
      {
        enabled: false
      }
    )
  const handleClick = async () => {
    const { id } = toast.toast({
      title: "Invoice",
      description: "Preparing invoice...",
      variant: "loading",
      duration: Infinity
    })
    try {
      const result = await refetch();
      if (result.data && result.data.buffer) {
        toast.dismiss(id);
        openPdf(result.data);
      } else {
        toast.dismiss(id);
        toast.toast({
          title: "Invoice",
          description: 'Problem happened when preparing invoice',
          variant: "error",
        })
      }
    } catch (error) {
      toast.dismiss(id);
      toast.toast({
        title: "Invoice",
        description: error,
        variant: "error",
      })
    } finally {
      toast.dismiss(id);
    }
  };

  const openPdf = (invoiceResult?: InvoiceResult) => {
    if (invoiceResult && invoiceResult.buffer) {
      const anyBuffer = invoiceResult.buffer as any;
      const blob = new Blob([ new Uint8Array(anyBuffer.data)  ], { type : 'application/pdf'});
      const pdfURL = URL.createObjectURL(blob);
      window.open(pdfURL, '_blank');
    }
  };

  return (
    <DropdownMenu.Item className="gap-x-2" 
      onClick={handleClick}
      disabled={(order.metadata['invoice_id'] == undefined)}>
      <DocumentText />
        View invoice
    </DropdownMenu.Item>
  )
}

export default ViewInvoiceDropdownButton