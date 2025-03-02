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

import { DocumentSettingsDTO } from '../../../../../types/dto';

export function generateHeader(doc, y: number, documentSettings: DocumentSettingsDTO) : number {
  doc
    .fillColor("#444444")
    .fontSize(20)

  const heightCompany = doc.heightOfString(documentSettings.storeAddress?.company, { width: 250 });
  doc
    .text(documentSettings.storeAddress?.company, 50, y, { align: "left", width: 250 })
    .fontSize(10)
    .text(documentSettings.storeAddress?.company, 200, y, { align: "right" })
    .text(`${documentSettings.storeAddress?.city} ${documentSettings.storeAddress?.postal_code}`, 200, y + 15, { align: "right" })

  const heightAddress = doc.heightOfString(documentSettings.storeAddress?.address_1, {width: 150});
  
  doc
    .text(`${documentSettings.storeAddress?.address_1}`, 390, y + 30, { align: "right", width: 150})


  if (heightCompany > heightAddress + 30) {
    return heightCompany + y;
  } else {
    return heightAddress + y + 30;
  }
}