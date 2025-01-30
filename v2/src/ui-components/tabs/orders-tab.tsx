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

import { Container } from "@medusajs/ui"
import { useState} from 'react'
import { Grid } from "@mui/material";
import OrderTable from "../orders/order-table";

export const OrdersTab = () => {
  const [contextFilters, setContextFilters] =
    useState<Record<string, { filter: string[] }>>()

  return (
    <Grid container spacing={2}  >
      <Grid item xs={12} md={12} xl={12}>
        <Container>
          <OrderTable setContextFilters={setContextFilters} />
        </Container>
      </Grid>
    </Grid>
  )
}