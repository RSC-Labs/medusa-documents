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

import { Heading, Text, FocusModal, Button, Input, Label, Toaster, Alert } from "@medusajs/ui"
import { CircularProgress, Grid } from "@mui/material";
import { useAdminCustomQuery } from "medusa-react"

type AdminStoreDocumentInvoiceSettingsDisplayNumberQueryReq = {
  formatNumber: string,
  forcedNumber: number
}

type StoreDocumentInvoiceSettingsDisplayNumberResult = {
  displayNumber: string
}

const InvoiceSettingsDisplayNumber = ({ formatNumber, forcedNumber } : {formatNumber?: string, forcedNumber?: number}) => {

  const { data, isLoading } = useAdminCustomQuery
  <AdminStoreDocumentInvoiceSettingsDisplayNumberQueryReq, StoreDocumentInvoiceSettingsDisplayNumberResult>(
    "/invoice/display-number",
    [formatNumber, forcedNumber],
    {
      formatNumber: formatNumber,
      forcedNumber: forcedNumber
    }
  )

  if (isLoading) {
    return (
      <Grid item>
        <Input
          readOnly={true}
        />
      </Grid>
    )
  }

  return (
    <Grid item>
      <Input key={`display-number-${data.displayNumber}`}
        defaultValue={data.displayNumber}
        readOnly={true}
      />
    </Grid>
  )
}


export default InvoiceSettingsDisplayNumber