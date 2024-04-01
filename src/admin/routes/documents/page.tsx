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

import { RouteConfig } from "@medusajs/admin"
import { Tabs, Text, Toaster } from "@medusajs/ui"
import { DocumentText } from "@medusajs/icons"
import { Box, Grid } from "@mui/material";
import Link from '@mui/material/Link';
import { OrdersTab } from "../../../ui-components/tabs/orders-tab";
import { TemplatesTab } from "../../../ui-components/tabs/templates-tab";
import { SettingsTab } from "../../../ui-components/tabs/settings-tab";

const DocumentsPage = () => {
  return (
    <Tabs defaultValue='orders'>
      <Toaster/>
      <Tabs.List >
        <Tabs.Trigger value='orders'>Orders</Tabs.Trigger>
        <Tabs.Trigger value='templates'>Templates</Tabs.Trigger>
        <Tabs.Trigger value='settings'>Settings</Tabs.Trigger>
        <Grid container justifyContent={'end'}>
          <Grid item>
            <Text size="small">We do not store documents. </Text>
            <Link fontSize={12} href='/'>Learn more what it means. </Link>
          </Grid>
        </Grid>
      </Tabs.List>
      <Tabs.Content value='orders'>
        <Box height={20}></Box>
        <OrdersTab/>
      </Tabs.Content>
      <Tabs.Content value='templates'>
        <Box height={20}></Box>
        <TemplatesTab/>
      </Tabs.Content>
      <Tabs.Content value='settings'>
        <Box height={20}></Box>
        <SettingsTab/>
      </Tabs.Content>
    </Tabs>
  )
}
export const config: RouteConfig = {
  link: {
    label: "Documents",
    icon: DocumentText,
  },
}

export default DocumentsPage