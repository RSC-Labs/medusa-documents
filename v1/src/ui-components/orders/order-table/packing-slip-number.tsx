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

import { useAdminCustomQuery } from "medusa-react";
import { PackingSlipResult } from "../../types/api";
import { CircularProgress } from "@mui/material";

type AdminPackingSlipGetReq = {
  id: string
}

const PackingSlipNumber = ({ packingSlipId } : {packingSlipId: string}) => {

  const { data, isLoading } = useAdminCustomQuery
    <AdminPackingSlipGetReq, PackingSlipResult>(
      "/packing-slip",
      [''],
      {
        id: packingSlipId
      }
    )

  if (isLoading) {
    return (
      <CircularProgress size={8}/>
    )
  };

  if (data && data.packingSlip) {
    return (
      <p className="text-grey-90 group-hover:text-violet-60 pl-2">
        {`Packing slip: ${data.packingSlip.display_number}`}
      </p>
    )
  }
}

export default PackingSlipNumber