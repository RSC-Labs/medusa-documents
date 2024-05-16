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
import { generateHeader } from "./parts/header-small"
import { generateCustomerInformation } from "./parts/customer-info-small";
import { generateItemsTable } from "./parts/table-items-small";
import { generateOrderInfoTable } from "./parts/table-order-info-small";
import path from "path";


export function validateInput(settings?: DocumentSettings) : ([boolean, string]) { 
  if (settings && settings.store_address && settings.store_address.company &&
    settings.store_address.address_1 &&
    settings.store_address.city &&
    settings.store_address.postal_code
  ) return [true, ''];
  return [false, `Not all settings are defined to generate template. Following settings are checked: company, address, city, postal_code`];
}

export default async (settings: DocumentSettings, packingSlip: PackingSlip, order: Order): Promise<Buffer> => { 
  var doc = new PDFDocument({size: 'A7'});
  doc.registerFont('Regular', path.resolve(__dirname, '../../../../assets/fonts/IBMPlexSans-Regular.ttf'))
  doc.registerFont('Bold', path.resolve(__dirname, '../../../../assets/fonts/IBMPlexSans-Bold.ttf'))
  doc.font('Regular');

  const buffers = []
  doc.on("data", buffers.push.bind(buffers))

  const endHeader = generateHeader(doc, 30, settings);
  const endY = generateCustomerInformation(doc, endHeader, order);
  const endTable = generateOrderInfoTable(doc, endY, order, order.items);
  doc = doc.addPage();
  generateItemsTable(doc, 0, order, order.items);
 
  doc.end();

  const bufferPromise = new Promise<Buffer>(resolve => {
    doc.on("end", () => {
        const pdfData = Buffer.concat(buffers)
        resolve(pdfData)
    })
  })
  
  return await bufferPromise;
};