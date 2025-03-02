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
import { DocumentInvoiceDTO, DocumentSettingsDTO } from '../../../../types/dto';
import PDFDocument from 'pdfkit';
import { generateCustomerInformation } from "./parts/customer-info";
import { generateInvoiceTable } from "./parts/table";
import { generateInvoiceInformation } from "./parts/invoice-info";
import { generateHeaderForLogo } from "./parts/header-for-logo";
import { generateHeaderLogo } from "./parts/header-logo";
import path from "path";

export function validateInput(settings?: DocumentSettingsDTO) : ([boolean, string]) { 
  if (settings && settings.storeAddress && settings.storeAddress.company &&
    settings.storeAddress.address_1 &&
    settings.storeAddress.city &&
    settings.storeAddress.postal_code && 
    settings.storeLogoSource
  ) return [true, ''];
  return [false, `Not all settings are defined to generate template. Following settings are checked: logo, company, address, city, postal_code`];
}

export default async (settings: DocumentSettingsDTO, invoice: DocumentInvoiceDTO, order: OrderDTO): Promise<Buffer> => { 
  var doc = new PDFDocument();
  doc.registerFont('Regular', path.resolve(__dirname, '../../../../assets/fonts/IBMPlexSans-Regular.ttf'))
  doc.registerFont('Bold', path.resolve(__dirname, '../../../../assets/fonts/IBMPlexSans-Bold.ttf'))
  doc.font('Regular');

  const buffers = []
  doc.on("data", buffers.push.bind(buffers))

  const endHeader = generateHeaderForLogo(doc, 50, settings);
  await generateHeaderLogo(doc, 50, settings.storeLogoSource!);
  const endInvoice = generateInvoiceInformation(doc, endHeader, invoice);
  const endDetails = generateCustomerInformation(doc, endInvoice, order);
  generateInvoiceTable(doc, endDetails, order, order.items || []);
 
  doc.end();

  const bufferPromise = new Promise<Buffer>(resolve => {
    doc.on("end", () => {
        const pdfData = Buffer.concat(buffers)
        resolve(pdfData)
    })
  })
  
  return await bufferPromise;
};