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


import { BeforeInsert, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { generateEntityId } from "@medusajs/utils";
import { BaseEntity } from "@medusajs/medusa";

@Entity()
export class DocumentInvoiceSettings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  invoice_forced_number: number

  @Column()
  invoice_number_format: string

  @Column()
  invoice_template: string

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
      this.id = generateEntityId(this.id, "docinvset")
  }
}