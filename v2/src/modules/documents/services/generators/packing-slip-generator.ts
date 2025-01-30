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
import { DocumentPackingSlipDTO, DocumentSettingsDTO } from "../../types/dto";
import { PackingSlipTemplateKind } from "../../types/template-kind";
import basicTemplate, { validateInput as validateInputBasic} from '../templates/packing-slips/basic/basic'
import smallTemplate, { validateInput as validateInputSmall} from '../templates/packing-slips/basic/small'

export function validateInputForProvidedKind(templateKind: PackingSlipTemplateKind, documentSettings: DocumentSettingsDTO) : ([boolean, string]) {
  switch (templateKind) {
    case PackingSlipTemplateKind.BASIC:
      return validateInputBasic(documentSettings);
    case PackingSlipTemplateKind.BASIC_SMALL:
      return validateInputSmall(documentSettings);
    default:
      return [false, 'Not supported template'];
  }
}

export function generatePackingSlip(kind: PackingSlipTemplateKind, documentSettings: DocumentSettingsDTO, invoice: DocumentPackingSlipDTO, order: OrderDTO): Promise<Buffer> | undefined {
  switch (kind) {
    case PackingSlipTemplateKind.BASIC:
      return basicTemplate(documentSettings, invoice, order);
    case PackingSlipTemplateKind.BASIC_SMALL:
      return smallTemplate(documentSettings, invoice, order);
    default:
      return Promise.resolve(Buffer.from('Not supported template'));
  }
};