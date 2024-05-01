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

import { PackingSlipTemplateKind } from "../types/template-kind";
import basicTemplate, { validateInput as validateInputBasic} from '../templates/packing-slips/basic/basic'
import { Order } from "@medusajs/medusa";
import { PackingSlip } from "../../models/packing-slip";
import { DocumentSettings } from "../../models/document-settings";

export function validateInputForProvidedKind(templateKind: PackingSlipTemplateKind, documentSettings: DocumentSettings) : ([boolean, string]) {
  switch (templateKind) {
    case PackingSlipTemplateKind.BASIC:
      return validateInputBasic(documentSettings);
    default:
      return [false, 'Not supported template'];
  }
  
}

export function generate(kind: PackingSlipTemplateKind, documentSettings: DocumentSettings, packingSlip: PackingSlip, order: Order): Promise<Buffer> | undefined {
  switch (kind) {
    case PackingSlipTemplateKind.BASIC:
      return basicTemplate(documentSettings, packingSlip, order);
    default:
      return Promise.resolve(Buffer.from('Not supported template'));
  }
};