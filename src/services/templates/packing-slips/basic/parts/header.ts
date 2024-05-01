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

export function generateHeader(doc, y: number, documentSettings: DocumentSettings) : number {
  doc
    .fillColor("#444444")
    .fontSize(20)

  doc
    .text('Packing Slip', 50, y, { align: "left" })

  const heightCompany = doc.heightOfString(documentSettings.store_address.company, { align: "left" });
  doc
    .fontSize(10)
    .text(documentSettings.store_address.company, 50, y + 30, { align: "left" })
    .text(`${documentSettings.store_address.city} ${documentSettings.store_address.postal_code}`, 50, y + 45, { align: "left" })

  const heightAddress = doc.heightOfString(documentSettings.store_address.address_1, {width: 150});
  
  doc
    .text(`${documentSettings.store_address.address_1}`, 50, y + 60, { align: "left" })


  if (heightCompany > heightAddress + 60) {
    return heightCompany + y;
  } else {
    return heightAddress + y + 60;
  }
}