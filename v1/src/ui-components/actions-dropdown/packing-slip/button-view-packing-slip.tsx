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
import { DropdownMenu, toast } from "@medusajs/ui"
import { useAdminCustomQuery } from "medusa-react";
import { PackingSlipResult } from "../../types/api";

type AdminGeneratePackingSlipQueryReq = {
  id: string,
  includeBuffer: boolean
}

const ViewPackingSlipDropdownButton = ({ order } : {order : Order}) => {

  const { data, refetch } = useAdminCustomQuery
    <AdminGeneratePackingSlipQueryReq, PackingSlipResult>(
      "/packing-slip",
      [],
      {
        id: order.metadata['packing_slip_id'] as string,
        includeBuffer: true
      },
      {
        enabled: false
      }
    )
  const handleClick = async () => {
    const id = toast.loading("Packing slip", {
      description: "Preparing...",
      duration: Infinity
    })
    try {
      const result = await refetch();
      if (result.data && result.data.buffer) {
        toast.dismiss();
        openPdf(result.data);
      } else {
        toast.dismiss();
        toast.error("Packing slip", {
          description: 'Problem happened when preparing',
        })
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Packing slip", {
        description: error,
      })
    } finally {
      toast.dismiss();
    }
  };

  const openPdf = (packingSlipResult?: PackingSlipResult) => {
    if (packingSlipResult && packingSlipResult.buffer) {
      const anyBuffer = packingSlipResult.buffer as any;
      const blob = new Blob([ new Uint8Array(anyBuffer.data)  ], { type : 'application/pdf'});
      const pdfURL = URL.createObjectURL(blob);
      window.open(pdfURL, '_blank');
    }
  };

  return (
    <DropdownMenu.Item className="gap-x-2" 
      onClick={handleClick}
      disabled={(order.metadata['packing_slip_id'] == undefined)}>
      <DocumentText />
        View packing slip
    </DropdownMenu.Item>
  )
}

export default ViewPackingSlipDropdownButton