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
import { generateHrInA7 } from "./hr";

function generateTableRow(
  doc,
  y,
  item,
  description,
  quantity,
) {
  doc
    .fontSize(6)
    .text(item, 25, y)
    .text(description, 80, y)
    .text(quantity, 90, y, { align: "right", width: 100 });
}

export function generateItemsTable(doc, y, order: Order, items: LineItem[]) {
  let i;
  const invoiceTableTop = y + 25;

  let totalQuantity = 0;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "Quantity",
  );
  generateHrInA7(doc, invoiceTableTop + 10);
  doc.font("Helvetica");
  
  for (i = 0; i < items.length; i++) {
    const item = items[i];
    totalQuantity += item.quantity;
    const position = invoiceTableTop + (i + 1) * 20;
    generateTableRow(
      doc,
      position,
      item.title,
      item.description,
      item.quantity,
    );

    generateHrInA7(doc, position + 10);
  }

  const totalQuantityPosition = invoiceTableTop + (i + 1) * 20;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    totalQuantityPosition,
    "",
    "Total",
    totalQuantity
  );
  doc.font("Helvetica");
}