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

import { Input } from "@medusajs/ui"
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";

const InvoiceSettingsDisplayNumber = ({ formatNumber, forcedNumber } : {formatNumber?: string, forcedNumber?: number}) => {

  const result: URLSearchParams = new URLSearchParams()

  if (formatNumber) {
    result.append('formatNumber', formatNumber);
  }
  if (forcedNumber) {
    result.append('forcedNumber', forcedNumber.toString());
  }

  const [data, setData] = useState<any | undefined>(undefined)

  const [error, setError] = useState<any>(undefined);

  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true);
  }, [formatNumber, forcedNumber])

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    fetch(`/admin/documents/invoice/display-number?${result.toString()}`, {
      credentials: "include",
    })
    .then((res) => res.json())
    .then((result) => {
      setData(result)
      setLoading(false)
    })
    .catch((error) => {
      setError(error);
      console.error(error);
    }) 
  }, [isLoading])


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