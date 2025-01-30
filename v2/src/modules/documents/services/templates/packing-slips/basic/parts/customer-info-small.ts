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

import { OrderDTO } from "@medusajs/framework/types"
import { generateHrInA7 } from "./hr";
import { t } from "i18next";

export function generateCustomerInformation(doc, y, order: OrderDTO) {

  generateHrInA7(doc, y + 15);

  const customerInformationTop = y + 25;

  let heightOfBillToAddress: number | undefined;

  if (order.billing_address) {
    doc
    .fontSize(6)
    .font("Bold")
    .text(`${t("packing-slip-bill-to", "Bill to")}:`, 25, customerInformationTop, {align: 'left'})
    .font("Regular")
    .text(`${order.billing_address.first_name} ${order.billing_address.last_name}`, 25, customerInformationTop + 10, {align: 'left'})
    .text(`${order.billing_address.city} ${order.billing_address.postal_code}`, 25, customerInformationTop + 20, {align: 'left'})
    const billAddress = order.billing_address.address_1;
    heightOfBillToAddress = doc.heightOfString(billAddress)
    doc.text(billAddress, 25, customerInformationTop + 30 , {align: 'left'})
    .moveDown();
  }

  let heightOfShipToAddress: number | undefined;

  if (order.shipping_address) {
    const RIGHT_MARGIN = 90;
    const RIGHT_WIDTH = 100;
    doc
      .fontSize(6)
      .font("Bold")

    doc
      .text(`${t("packing-slip-ship-to", "Ship to")}:`, RIGHT_MARGIN, customerInformationTop, {align: 'right', width: RIGHT_WIDTH})
      .font("Regular")

    doc
      .text(`${order.shipping_address.first_name} ${order.shipping_address.last_name}`, RIGHT_MARGIN, customerInformationTop + 10, {align: 'right', width: RIGHT_WIDTH})
      .text(`${order.shipping_address.city} ${order.shipping_address.postal_code}`, RIGHT_MARGIN, customerInformationTop + 20, {align: 'right', width: RIGHT_WIDTH})
      .moveDown();
      const shipAddress = order.shipping_address.address_1;
      heightOfShipToAddress = doc.heightOfString(shipAddress, { width: RIGHT_WIDTH })
      doc.text(shipAddress, RIGHT_MARGIN, customerInformationTop + 30 , {align: 'right', width: RIGHT_WIDTH })
      .moveDown();
  }
    
  if (heightOfBillToAddress && heightOfShipToAddress) {
    if (heightOfShipToAddress > heightOfBillToAddress) {
      return customerInformationTop + 30 + heightOfShipToAddress;
    } else {
      return customerInformationTop + 30 + heightOfBillToAddress;
    } 
  }
  if (heightOfBillToAddress) {
    return customerInformationTop + 30 + heightOfBillToAddress;
  }
  if (heightOfShipToAddress) {
    return customerInformationTop + 30 + heightOfShipToAddress;
  }

  return customerInformationTop;

}