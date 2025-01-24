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

  const heightCompany = doc.heightOfString(documentSettings.store_address.company, { width: 250 });
  doc
    .text(documentSettings.store_address.company, 50, y, { align: "left", width: 250 })
    .fontSize(10)
    .text(documentSettings.store_address.company, 200, y, { align: "right" })
    .text(`${documentSettings.store_address.city} ${documentSettings.store_address.postal_code}`, 200, y + 15, { align: "right" })

  const heightAddress = doc.heightOfString(documentSettings.store_address.address_1, {width: 150});
  
  doc
    .text(`${documentSettings.store_address.address_1}`, 390, y + 30, { align: "right", width: 150})


  if (heightCompany > heightAddress + 30) {
    return heightCompany + y;
  } else {
    return heightAddress + y + 30;
  }
}