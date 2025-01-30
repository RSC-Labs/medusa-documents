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
import { DocumentInvoiceDTO, DocumentSettingsDTO } from "../../types/dto";
import { InvoiceTemplateKind } from "../../types/template-kind";
import basicTemplate, { validateInput as validateInputBasic} from '../templates/invoices/basic/basic'
import basicLogoTemplate, { validateInput as validateInputBasicLogo} from '../templates/invoices/basic/basic-logo'

export function validateInputForProvidedKind(templateKind: InvoiceTemplateKind, documentSettings: any) : ([boolean, string]) {
  switch (templateKind) {
    case InvoiceTemplateKind.BASIC:
      return validateInputBasic(documentSettings);
    case InvoiceTemplateKind.BASIC_LOGO:
      return validateInputBasicLogo(documentSettings);
    default:
      return [false, 'Not supported template'];
  }
}

export function generateInvoice(kind: InvoiceTemplateKind, documentSettings: DocumentSettingsDTO, invoice: DocumentInvoiceDTO, order: OrderDTO): Promise<Buffer> | undefined {
  switch (kind) {
    case InvoiceTemplateKind.BASIC:
      return basicTemplate(documentSettings, invoice, order);
    case InvoiceTemplateKind.BASIC_LOGO:
      return basicLogoTemplate(documentSettings, invoice, order);
    default:
      return Promise.resolve(Buffer.from('Not supported template'));
  }
};