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


import { BeforeInsert, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, Column } from "typeorm";
import { generateEntityId } from "@medusajs/utils";
import { Address, BaseEntity } from "@medusajs/medusa";

@Entity()
export class DocumentSettings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToOne(() => Address, { eager: true })
  @JoinColumn({ name: 'store_address' })
  store_address: Address;

  @Column()
  store_logo_source: string

  @Column()
  invoice_number_format: string

  @Column()
  invoice_template: string

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
      this.id = generateEntityId(this.id, "docset")
  }
}