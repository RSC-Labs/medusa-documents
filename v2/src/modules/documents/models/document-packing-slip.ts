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

import { model } from "@medusajs/framework/utils"
import DocumentPackingSlipSettings from "./document-packing-slip-settings"
import DocumentSettings from "./document-settings"

const DocumentPackingSlip = model.define("document_packing_slip", {
  id: model.id().primaryKey(),
  number: model.number(),
  displayNumber: model.text(),
  packingSlipSettings: model.belongsTo(() => DocumentPackingSlipSettings, {
    mappedBy: 'documentPackingSlip'
  }),
  settings: model.belongsTo(() => DocumentSettings, {
    mappedBy: 'documentPackingSlip'
  })
}) 

export default DocumentPackingSlip