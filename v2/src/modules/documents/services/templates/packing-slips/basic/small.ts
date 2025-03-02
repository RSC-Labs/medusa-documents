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

import PDFDocument from 'pdfkit';
import { OrderDTO } from "@medusajs/framework/types"
import { generateHeader } from "./parts/header"
import { generateCustomerInformation } from "./parts/customer-info";
import { generateItemsTable } from "./parts/table-items";
import { generateOrderInfoTable } from "./parts/table-order-info";
import path from "path";
import { DocumentPackingSlipDTO, DocumentSettingsDTO } from '../../../../types/dto';


export function validateInput(settings?: DocumentSettingsDTO) : ([boolean, string]) { 
  if (settings && settings.storeAddress && settings.storeAddress.company &&
    settings.storeAddress.address_1 &&
    settings.storeAddress.city &&
    settings.storeAddress.postal_code
  ) return [true, ''];
  return [false, `Not all settings are defined to generate template. Following settings are checked: company, address, city, postal_code`];
}

export default async (settings: DocumentSettingsDTO, packingSlip: DocumentPackingSlipDTO, order: OrderDTO): Promise<Buffer> => { 
  var doc = new PDFDocument({size: 'A7'});
  doc.registerFont('Regular', path.resolve(__dirname, '../../../../assets/fonts/IBMPlexSans-Regular.ttf'))
  doc.registerFont('Bold', path.resolve(__dirname, '../../../../assets/fonts/IBMPlexSans-Bold.ttf'))
  doc.font('Regular');

  const buffers = []
  doc.on("data", buffers.push.bind(buffers))

  const endHeader = generateHeader(doc, 30, settings);
  const endY = generateCustomerInformation(doc, endHeader, order);
  const endTable = generateOrderInfoTable(doc, endY, order, order.items || []);
  doc = doc.addPage();
  generateItemsTable(doc, 0, order, order.items || []);
 
  doc.end();

  const bufferPromise = new Promise<Buffer>(resolve => {
    doc.on("end", () => {
        const pdfData = Buffer.concat(buffers)
        resolve(pdfData)
    })
  })
  
  return await bufferPromise;
};