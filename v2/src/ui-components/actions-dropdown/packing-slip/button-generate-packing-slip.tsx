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

import { FlyingBox } from "@medusajs/icons"
import { DropdownMenu, toast } from "@medusajs/ui"
import { useEffect, useState } from "react";

const GeneratePackingSlipDropdownButton = ({ order, updatePackingSlipNumber } : {order : any, updatePackingSlipNumber: any}) => {

  const [isLoading, setLoading] = useState(false)

  const [error, setError] = useState<any>(undefined);

  useEffect(() => {
    if (!isLoading) {
      return;
    }
    fetch(`/admin/documents/packing-slip`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: order.id
      })
    })
    .then((res) => res.json())
    .then((responseJson) => {
      if (responseJson && responseJson.message) {
        toast.error("Packing slip", {
          description: `Problem happened when generating packing slip. ${responseJson.message}`,
        })
      } else {
        if (responseJson.buffer) {
          updatePackingSlipNumber(order.id, responseJson.packingSlip.displayNumber)
          const anyBuffer = responseJson.buffer as any;
          const blob = new Blob([ new Uint8Array(anyBuffer.data)  ], { type : 'application/pdf'});
          toast.dismiss();
          const pdfURL = URL.createObjectURL(blob);
          window.open(pdfURL, '_blank');
        } else {
          toast.dismiss();
          toast.error("Packing slip", {
            description: 'Problem happened when generating packing slip',
          })
        }
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error(error);
      toast.dismiss();
      const trueError = error as any;
      toast.error("Packing slip", {
        description: trueError?.response?.data?.message,
      })
    }) 
  }, [isLoading])

  return (
    <DropdownMenu.Item className="gap-x-2" onClick={() => setLoading(true)}>
      <FlyingBox/>
        Generate new packing slip
    </DropdownMenu.Item>
  )
}

export default GeneratePackingSlipDropdownButton