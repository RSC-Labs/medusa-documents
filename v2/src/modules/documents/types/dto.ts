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

export type DocumentSettingsDTO = {
  storeAddress?: Record<string, unknown>,
  storeLogoSource?: string,
}

export type DocumentInvoiceSettingsDTO = {
  forcedNumber?: number,
  numberFormat?: string,
  template?: string,
}

export type DocumentPackingSlipSettingsDTO = {
  forcedNumber?: number,
  numberFormat?: string,
  template?: string,
}

export type DocumentInvoiceDTO = {
  number: number,
  displayNumber: string,
  created_at: Date
}

export type DocumentPackingSlipDTO = {
  number: number,
  displayNumber: string,
  created_at: Date
}