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
import PackingSlipService from "../../../services/packing-slip";
import { PackingSlipResult } from "../../../services/types/api";

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const packingSlipService: PackingSlipService = req.scope.resolve('packingSlipService');

  try {
    const result: PackingSlipResult = await packingSlipService.create(req.body.orderId);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const packingSlipService: PackingSlipService = req.scope.resolve('packingSlipService');

  const id = req.query.id;
  const includeBuffer = req.query.includeBuffer;
  try {
    const result: PackingSlipResult = await packingSlipService.getPackingSlip(id as string, includeBuffer !== undefined);
    res.status(200).json(result);
    
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}