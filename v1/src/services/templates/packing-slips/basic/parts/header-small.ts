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

import { DocumentSettings } from "../../../../../models/document-settings";
import { t } from "i18next";

export function generateHeader(doc, y: number, documentSettings: DocumentSettings) : number {
  doc
    .fillColor("#444444")
    .fontSize(12)

  doc
    .text(t("packing-slip", "Packing Slip"), 25, y, { align: "left" })

  const heightCompany = doc.heightOfString(documentSettings.store_address.company, { align: "left" });
  doc
    .fontSize(6)
    .text(documentSettings.store_address.company, 25, y + 25, { align: "left" })
    .text(`${documentSettings.store_address.city} ${documentSettings.store_address.postal_code}`, 25, y + 35, { align: "left" })

  const heightAddress = doc.heightOfString(documentSettings.store_address.address_1, {width: 150});
  
  doc
    .text(`${documentSettings.store_address.address_1}`, 25, y + 45, { align: "left" })


  if (heightCompany > heightAddress + 45) {
    return heightCompany + y;
  } else {
    return heightAddress + y + 45;
  }
}