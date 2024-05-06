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
import { PackingSlip } from "../../../../models/packing-slip";
import { DocumentSettings } from "../../../../models/document-settings";
import PDFDocument from 'pdfkit';
import { generateHeader } from "./parts/header"
import { generateCustomerInformation } from "./parts/customer-info";
import { generateItemsTable } from "./parts/table-items";
import { generateOrderInfoTable } from "./parts/table-order-info";

export function validateInput(settings?: DocumentSettings) : ([boolean, string]) { 
  if (settings && settings.store_address && settings.store_address.company &&
    settings.store_address.address_1 &&
    settings.store_address.city &&
    settings.store_address.postal_code
  ) return [true, ''];
  return [false, `Not all settings are defined to generate template. Following settings are checked: company, address, city, postal_code`];
}

export default async (settings: DocumentSettings, packingSlip: PackingSlip, order: Order): Promise<Buffer> => { 
  var doc = new PDFDocument();
  const endHeader = generateHeader(doc, 30, settings);
  const endY = generateCustomerInformation(doc, endHeader, order);
  const endTable = generateOrderInfoTable(doc, endY, order, order.items);
  generateItemsTable(doc, endTable, order, order.items);
 
  doc.end();

  const bufferPromise = new Promise<Buffer>(resolve => {
    const buffers = []
    doc.on("data", buffers.push.bind(buffers))
    doc.on("end", () => {
        const pdfData = Buffer.concat(buffers)
        resolve(pdfData)
    })
  })
  
  return await bufferPromise;
};