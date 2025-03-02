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

import { DocumentInvoiceDTO } from "../../../../../../../modules/documents/types/dto";
import { generateHr } from "./hr";
import { t } from "i18next";

export function generateInvoiceInformation(doc, y: number, invoice: DocumentInvoiceDTO) : number {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text(t("invoice", "Invoice"), 50, y + 40);

  generateHr(doc, y + 65);

  const invoiceInformationTop = y + 80;

  doc
    .fontSize(10)
    .text(`${t("invoice-number", "Invoice number")}:`, 50, invoiceInformationTop)
    .font("Bold")
    .text(invoice.displayNumber, 150, invoiceInformationTop)
    .font("Regular")
    .text(`${t("invoice-date", "Invoice date")}:`, 50, invoiceInformationTop + 15)
    .text(invoice.created_at.toLocaleDateString(), 150, invoiceInformationTop + 15)
    .moveDown();

  return invoiceInformationTop + 15;
}