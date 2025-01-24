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

export function generateHeaderForLogo(doc, y: number, documentSettings: DocumentSettings) : number {
  doc
    .fillColor("#444444")
    .fontSize(20)

  const heightCompany = doc.heightOfString(documentSettings.store_address.company, { width: 250 });

  doc
    .fillColor("#444444")
    .fontSize(20)
    .text(documentSettings.store_address.company, 50, 50, { align: "left", width: 250 })
    .moveDown()
    .fontSize(10)
    .text(documentSettings.store_address.company, 50, heightCompany + 65, { align: "left" })
    .text(`${documentSettings.store_address.city} ${documentSettings.store_address.postal_code}`, 50, heightCompany + 80, { align: "left" })
    const heightOfAddress = doc.heightOfString(documentSettings.store_address.address_1, { width: 250 })
    doc.text(documentSettings.store_address.address_1, 50, heightCompany + 95, { align: "left", width: 250 })
    
    return heightOfAddress + heightCompany + 95;
}