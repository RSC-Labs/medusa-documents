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
import { InvoiceResult } from "../../types/api";
import { CircularProgress } from "@mui/material";

type AdminInvoiceGetReq = {
  invoiceId: string
}

const InvoiceNumberFromOrder = ({ invoiceId } : {invoiceId: string}) => {

  const { data, isLoading } = useAdminCustomQuery
    <AdminInvoiceGetReq, InvoiceResult>(
      "/invoice",
      [''],
      {
        invoiceId: invoiceId
      }
    )

  if (isLoading) {
    return (
      <CircularProgress size={8}/>
    )
  };

  if (data && data.invoice) {
    return (
      <p className="text-grey-90 group-hover:text-violet-60 pl-2">
        {`${data.invoice.display_number}`}
      </p>
    )
  }
}

export default InvoiceNumberFromOrder