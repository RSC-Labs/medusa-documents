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
import { generateHrInA7 } from "./hr";
import { t } from "i18next";

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

export function generateItemsTable(doc, y, order: OrderDTO, items: OrderLineItemDTO[]) {
  let i;
  const invoiceTableTop = y + 25;

  let totalQuantity = 0;

  doc.font("Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    t("packing-slip-table-header-item", "Item"),
    t("packing-slip-table-header-description", "Description"),
    t("packing-slip-table-header-quantity", "Quantity"),
  );
  generateHrInA7(doc, invoiceTableTop + 10);
  doc.font("Regular");
  
  for (i = 0; i < items.length; i++) {
    const item = items[i];
    totalQuantity += item.quantity;
    const position = invoiceTableTop + (i + 1) * 20;
    generateTableRow(
      doc,
      position,
      item.title,
      item.subtitle,
      item.quantity,
    );

    generateHrInA7(doc, position + 10);
  }

  const totalQuantityPosition = invoiceTableTop + (i + 1) * 20;
  doc.font("Bold");
  generateTableRow(
    doc,
    totalQuantityPosition,
    "",
    t("packing-slip-table-header-total", "Total"),
    totalQuantity
  );
  doc.font("Regular");
}