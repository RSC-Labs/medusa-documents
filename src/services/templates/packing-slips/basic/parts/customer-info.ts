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
import { generateHr } from "./hr";

export function generateCustomerInformation(doc, y, order: Order) {

  generateHr(doc, y + 35);

  const customerInformationTop = y + 50;

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text('Bill to:', 50, customerInformationTop, {align: 'left'})
    .font("Helvetica")
    .text(`${order.billing_address.first_name} ${order.billing_address.last_name}`, 50, customerInformationTop + 15, {align: 'left'})
    .text(`${order.billing_address.city} ${order.billing_address.postal_code}`, 50, customerInformationTop + 30, {align: 'left'})
    const billAddress = order.billing_address.address_1;
    const heightOfBillToAddress = doc.heightOfString(billAddress, { width: 150 })
    doc.text(billAddress, 50, customerInformationTop + 45 , {align: 'left', width: 150 })
    .moveDown();
    
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text('Ship to:', 50, customerInformationTop, {align: 'right'})
    .font("Helvetica")
    .text(`${order.shipping_address.first_name} ${order.shipping_address.last_name}`, 50, customerInformationTop + 15, {align: 'right'})
    .text(`${order.shipping_address.city} ${order.shipping_address.postal_code}`, 50, customerInformationTop + 30, {align: 'right'})
    .moveDown();
    const shipAddress = order.shipping_address.address_1;
    const heightOfShipToAddress = doc.heightOfString(shipAddress, { width: 150 })
    doc.text(shipAddress, 360, customerInformationTop + 45 , {align: 'right', widdth: 150 })
    .moveDown();
    
  if (heightOfShipToAddress > heightOfBillToAddress) {
    return customerInformationTop + 45 + heightOfShipToAddress;
  } else {
    return customerInformationTop + 45 + heightOfBillToAddress;
  }
}