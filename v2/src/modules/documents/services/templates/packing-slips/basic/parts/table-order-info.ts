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

import { OrderDTO, OrderLineItemDTO } from "@medusajs/framework/types"
import { generateHr } from "./hr";
import { t } from "i18next";

function generateTableRow(
  doc,
  y,
  orderNumber,
  orderDate,
  shippingMethod,
) {
  doc
    .fontSize(10)
    .text(orderNumber, 50, y)
    .text(orderDate, 200, y)
    .text(shippingMethod, 0, y, { align: "right" });
}

export function generateOrderInfoTable(doc, y, order: OrderDTO, items: OrderLineItemDTO[]) : number {
  let i;
  const invoiceTableTop = y + 35;

  doc.font("Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    t("packing-slip-table-header-order-number", "Order #"),
    t("packing-slip-table-header-order-date", "Order date"),
    t("packing-slip-table-header-shipping-method", "Shipping method"),
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Regular");

  const position = invoiceTableTop + 30;

  generateTableRow(
    doc,
    position,
    order.display_id,
    order.created_at.toLocaleString(),
    order.shipping_methods ? order.shipping_methods[0].name : 'N/A'
  );

  generateHr(doc, position + 20);

  return position + 20;
}