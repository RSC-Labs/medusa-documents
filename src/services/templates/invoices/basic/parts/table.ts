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

import { LineItem, Order } from "@medusajs/medusa";
import { generateHr } from "./hr";
import { getDecimalDigits } from "../../../../utils/currency";
import { t } from "i18next";

function amountToDisplay(amount: number, currencyCode: string) : string {
  const decimalDigits = getDecimalDigits(currencyCode);
  return `${(amount / Math.pow(10, decimalDigits)).toFixed(decimalDigits)} ${currencyCode.toUpperCase()}`;
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

export function generateInvoiceTable(doc, y, order: Order, items: LineItem[]) {
  let i;
  const invoiceTableTop = y + 35;

  doc.font("Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    t("invoice-table-header-item", "Item"),
    t("invoice-table-header-description", "Description"),
    t("invoice-table-header-unit-cost", "Unit Cost"),
    t("invoice-table-header-quantity", "Quantity"),
    t("invoice-table-header-line-total", "Line Total")
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Regular");
  
  for (i = 0; i < items.length; i++) {
    const item = items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.title,
      item.description,
      amountToDisplay(item.total / item.quantity, order.currency_code),
      item.quantity,
      amountToDisplay(item.total, order.currency_code)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    t("invoice-table-shipping", "Shipping"),
    "",
    amountToDisplay(order.shipping_total, order.currency_code)
  );

  const taxPosition = subtotalPosition + 30;
  generateTableRow(
    doc,
    taxPosition,
    "",
    "",
    t("invoice-table-tax", "Tax"),
    "",
    amountToDisplay(order.tax_total, order.currency_code)
  );

  const duePosition = taxPosition + 45;
  doc.font("Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    t("invoice-table-total", "Total"),
    "",
    amountToDisplay(order.total, order.currency_code)
  );
  doc.font("Regular");
}