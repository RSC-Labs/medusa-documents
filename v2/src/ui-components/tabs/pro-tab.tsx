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

import { Container, Heading, Text } from "@medusajs/ui"
import { Grid, Link } from "@mui/material";

const HEIGHT = 330;

export const ProTab = () => {
  return (
    <Grid container spacing={2} justifyContent={"center"} >
      <Grid container justifyContent={"center"} marginTop={6}>
        <Grid item>
          <Heading level='h1' style={ { color: 'purple'}}>
            Manage documents on the next level
          </Heading>
        </Grid>
      </Grid>
      <Grid container justifyContent={"center"} marginTop={1} spacing={5}>
        <Grid item xs={3} md={3} xl={3}>
          <Container style={ { borderColor: 'purple', borderWidth: 1, height: HEIGHT}}>
            <Grid container rowSpacing={3}>
              <Grid item>
                <Heading level='h1'>Automation</Heading>
              </Grid>
              <Grid item>
                <ul style={ { listStyleType: 'circle'}}>
                  <li>
                    <Text>Automatically send invoices to customers</Text>
                  </li>
                  <li style={ { marginTop: 3}}>
                    <Text>Automatically send packing slips to fulfillment providers</Text>
                  </li>
                  <li style={ { marginTop: 3}}>
                    <Text>Automatically detect the language of your customer</Text>
                  </li>
                </ul>
                </Grid>
            </Grid>
          </Container>
        </Grid>
        <Grid item xs={3} md={3} xl={3}>
          <Container style={ { borderColor: 'purple', borderWidth: 1, height: HEIGHT}}>
            <Grid container rowSpacing={3}>
              <Grid item>
                <Heading level='h1'>New templates</Heading>
              </Grid>
              <Grid item>
                <ul style={ { listStyleType: 'circle'}}>
                  <li>
                    <Text>Access new premium templates for invoices and other documents</Text>
                  </li>
                  <li style={ { marginTop: 3}}>
                    <Text>Send us your custom template, and we will create it for you</Text>
                  </li>
                </ul>
                </Grid>
            </Grid>
          </Container>
        </Grid>
        <Grid item xs={3} md={3} xl={3}>
          <Container style={ { borderColor: 'purple', borderWidth: 1, height: HEIGHT}}>
            <Grid container rowSpacing={3}>
              <Grid item>
                <Heading level='h1'>Advanced configuration</Heading>
              </Grid>
              <Grid item>
                <ul style={ { listStyleType: 'circle'}}>
                  <li>
                    <Text>Set different addresses for various document types</Text>
                  </li>
                  <li style={ { marginTop: 3}}>
                    <Text>Customize settings for sending invoices to customers</Text>
                  </li>
                  <li style={ { marginTop: 3}}>
                    <Text>Tailor settings for sending packing slips to fulfillment providers</Text>
                  </li>
                </ul>
                </Grid>
            </Grid>
          </Container>
        </Grid>
        <Grid item xs={3} md={3} xl={3}>
          <Container style={ { borderColor: 'purple', borderWidth: 1, height: HEIGHT}}>
            <Grid container rowSpacing={3}>
              <Grid item>
                <Heading level='h1'>Professional support</Heading>
              </Grid>
              <Grid item>
                <ul style={ { listStyleType: 'circle'}}>
                  <li>
                    <Text>Priority bug resolution</Text>
                  </li>
                  <li style={ { marginTop: 3}}>
                    <Text>Dedicated channel for evaluating your feature requests</Text>
                  </li>
                  <li style={ { marginTop: 3}}>
                    <Text>Long-term cooperation, including support for other plugins</Text>
                  </li>
                </ul>
                </Grid>
            </Grid>
          </Container>
        </Grid>
      </Grid>
      <Grid container spacing={3} direction={'column'} alignContent={"center"} marginTop={6}>
        <Grid container direction={'row'} justifyContent={'center'} columnSpacing={1}>
          <Grid item>
            <Heading level='h1' color="purple">
              Contact:
            </Heading>
          </Grid>
          <Grid item>
            <Link href="mailto:labs@rsoftcon.com">
              <Heading level='h1' color="purple">
                labs@rsoftcon.com
              </Heading>
            </Link>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={3} direction={'column'} alignContent={"center"} marginTop={6}>
        <Grid container direction={'row'} justifyContent={'center'} columnSpacing={1}>
          <Grid item>
            <Text>
              You can hide this tab if you feel it is intruisive. See: 
            </Text>
          </Grid>
          <Grid item>
            <Link href="https://github.com/RSC-Labs/medusa-documents?tab=readme-ov-file#hide-pro-version-tab">
              <Text>
                How to hide this tab?
              </Text>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}