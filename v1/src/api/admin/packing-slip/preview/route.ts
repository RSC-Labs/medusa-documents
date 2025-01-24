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

import type { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/medusa"
import { PackingSlipTemplateKind } from "../../../../services/types/template-kind";
import PackingSlipService from "../../../../services/packing-slip";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const packingSlipService: PackingSlipService = req.scope.resolve('packingSlipService');

  try {
    const chosenTemplate = req.query.template;
    const packingSlipResult = await packingSlipService.generatePreview(chosenTemplate as PackingSlipTemplateKind)
    res.status(201).json(packingSlipResult)
    
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}