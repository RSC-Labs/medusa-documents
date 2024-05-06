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

import { Order } from "@medusajs/medusa";
import { generateHr, generateHrInA7 } from "./hr";

export function generateCustomerInformation(doc, y, order: Order) {

  generateHrInA7(doc, y + 15);

  const customerInformationTop = y + 25;

  doc
    .fontSize(6)
    .font("Helvetica-Bold")
    .text('Bill to:', 25, customerInformationTop, {align: 'left'})
    .font("Helvetica")
    .text(`${order.billing_address.first_name} ${order.billing_address.last_name}`, 25, customerInformationTop + 10, {align: 'left'})
    .text(`${order.billing_address.city} ${order.billing_address.postal_code}`, 25, customerInformationTop + 20, {align: 'left'})
    const billAddress = order.billing_address.address_1;
    const heightOfBillToAddress = doc.heightOfString(billAddress)
    doc.text(billAddress, 25, customerInformationTop + 30 , {align: 'left'})
    .moveDown();
    
  const RIGHT_MARGIN = 90;
  const RIGHT_WIDTH = 100;
  doc
    .fontSize(6)
    .font("Helvetica-Bold")

  doc
    .text('Ship to:', RIGHT_MARGIN, customerInformationTop, {align: 'right', width: RIGHT_WIDTH})
    .font("Helvetica")

  doc
    .text(`${order.shipping_address.first_name} ${order.shipping_address.last_name}`, RIGHT_MARGIN, customerInformationTop + 10, {align: 'right', width: RIGHT_WIDTH})
    .text(`${order.shipping_address.city} ${order.shipping_address.postal_code}`, RIGHT_MARGIN, customerInformationTop + 20, {align: 'right', width: RIGHT_WIDTH})
    .moveDown();
    const shipAddress = order.shipping_address.address_1;
    const heightOfShipToAddress = doc.heightOfString(shipAddress, { width: RIGHT_WIDTH })
    doc.text(shipAddress, RIGHT_MARGIN, customerInformationTop + 30 , {align: 'right', width: RIGHT_WIDTH })
    .moveDown();
    
  if (heightOfShipToAddress > heightOfBillToAddress) {
    return customerInformationTop + 30 + heightOfShipToAddress;
  } else {
    return customerInformationTop + 30 + heightOfBillToAddress;
  }
}