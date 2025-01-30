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
import DocumentPackingSlip from "./document-packing-slip"

const DocumentPackingSlipSettings = model.define("document_packing_slip_settings", {
  id: model.id().primaryKey(),
  forcedNumber: model.number().nullable(),
  numberFormat: model.text().nullable(),
  template: model.text().nullable(),
  documentPackingSlip: model.hasMany(() => DocumentPackingSlip, {
    mappedBy: 'packingSlipSettings'
  })
}) 

export default DocumentPackingSlipSettings