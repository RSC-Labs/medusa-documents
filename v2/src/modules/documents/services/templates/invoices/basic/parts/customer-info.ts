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

import { generateHr } from "./hr";
import { t } from "i18next";
import { OrderDTO } from "@medusajs/framework/types"

export function generateCustomerInformation(doc, y, order: OrderDTO) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text(`${t("invoice-customer-details", "Details")}`, 50, y + 30);
    
  generateHr(doc, y + 55);

  const customerInformationTop = y + 70;

  let heightOfBillToAddress: number | undefined;

  if (order.billing_address) {
    doc
      .fontSize(10)
      .font("Bold")
      
      .text(`${t("invoice-bill-to", "Bill to")}:`, 50, customerInformationTop, {align: 'left'})
      .font("Regular")
      .text(`${order.billing_address.first_name} ${order.billing_address.last_name}`, 50, customerInformationTop + 15, {align: 'left'})
      .text(`${order.billing_address.city} ${order.billing_address.postal_code}`, 50, customerInformationTop + 30, {align: 'left'})
      const billAddress = order.billing_address.address_1;
      heightOfBillToAddress = doc.heightOfString(billAddress, { width: 150 })
      doc.text(billAddress, 50, customerInformationTop + 45 , {align: 'left', width: 150 })
      .moveDown();
  }

  let heightOfShipToAddress: number | undefined;

  if (order.shipping_address) {
    doc
      .fontSize(10)
      .font("Bold")
      .text(`${t("invoice-ship-to", "Ship to")}:`, 50, customerInformationTop, {align: 'right'})
      .font("Regular")
      .text(`${order.shipping_address.first_name} ${order.shipping_address.last_name}`, 50, customerInformationTop + 15, {align: 'right'})
      .text(`${order.shipping_address.city} ${order.shipping_address.postal_code}`, 50, customerInformationTop + 30, {align: 'right'})
      .moveDown();
      const shipAddress = order.shipping_address.address_1;
      heightOfShipToAddress = doc.heightOfString(shipAddress, { width: 150 })
      doc.text(shipAddress, 360, customerInformationTop + 45 , {align: 'right', widdth: 150 })
      .moveDown();
  }


  if (heightOfBillToAddress && heightOfShipToAddress) {
    if (heightOfShipToAddress > heightOfBillToAddress) {
      return customerInformationTop + 45 + heightOfShipToAddress;
    } else {
      return customerInformationTop + 45 + heightOfBillToAddress;
    } 
  }
  if (heightOfBillToAddress) {
    return customerInformationTop + 45 + heightOfBillToAddress;
  }
  if (heightOfShipToAddress) {
    return customerInformationTop + 45 + heightOfShipToAddress;
  }

  return customerInformationTop;
}