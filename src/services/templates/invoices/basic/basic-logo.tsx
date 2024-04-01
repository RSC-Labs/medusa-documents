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
import { Invoice } from "../../../../models/invoice";
import { DocumentSettings } from "../../../../models/document-settings";
import PDFDocument from 'pdfkit';
import { generateCustomerInformation } from "./parts/customer-info";
import { generateInvoiceTable } from "./parts/table";
import { generateInvoiceInformation } from "./parts/invoice-info";
import { generateHeaderForLogo } from "./parts/header-for-logo";
import { generateHeaderLogo } from "./parts/header-logo";

export function validateInput(settings?: DocumentSettings) : ([boolean, string]) { 
  if (settings && settings.store_address && settings.store_address.company &&
    settings.store_address.address_1 &&
    settings.store_address.city &&
    settings.store_address.postal_code &&
    settings.store_logo_source
  ) return [true, ''];
  return [false, `Not all settings are defined to generate template. Following settings are checked: company, address, city, postal code, logo`];
}

export default async (settings: DocumentSettings, invoice: Invoice, order: Order): Promise<Buffer> => { 
  var doc = new PDFDocument();
  const endHeader = generateHeaderForLogo(doc, 50, settings);
  await generateHeaderLogo(doc, 50, settings.store_logo_source);
  const endInvoice = generateInvoiceInformation(doc, endHeader, invoice);
  const endDetails = generateCustomerInformation(doc, endInvoice, order);
  generateInvoiceTable(doc, endDetails, order, order.items);
 
  // end and display the document in the iframe to the right
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