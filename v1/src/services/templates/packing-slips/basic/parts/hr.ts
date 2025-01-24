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

export function generateHr(doc, y: number, moveTo?: number, lineTo?: number) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(moveTo ? moveTo: 50, y)
    .lineTo(lineTo ? lineTo: 550, y)
    .stroke();
}

export function generateHrInA7(doc, y: number) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(25, y)
    .lineTo(190, y)
    .stroke();
}
