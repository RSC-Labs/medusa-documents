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

function formatCurrency(cents, currencyCode) {
  return `${(cents / 100).toFixed(2)} ${currencyCode}`;
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

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");
  
  for (i = 0; i < items.length; i++) {
    const item = items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.title,
      item.description,
      formatCurrency(item.total / item.quantity, order.currency_code),
      item.quantity,
      formatCurrency(item.total, order.currency_code)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Shipping",
    "",
    formatCurrency(order.shipping_total, order.currency_code)
  );

  const taxPosition = subtotalPosition + 30;
  generateTableRow(
    doc,
    taxPosition,
    "",
    "",
    "Tax",
    "",
    formatCurrency(order.tax_total, order.currency_code)
  );

  const duePosition = taxPosition + 45;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Total",
    "",
    formatCurrency(order.total, order.currency_code)
  );
  doc.font("Helvetica");
}