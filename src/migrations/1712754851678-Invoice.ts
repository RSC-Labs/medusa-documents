import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class Invoice1712754851678 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.addColumn('invoice', 
            new TableColumn(
                { name: 'document_invoice_settings_id', type: 'character varying', isNullable: true }
            )
        )

        const foreignKey = new TableForeignKey({
            columnNames: ['document_invoice_settings_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'public.document_invoice_settings',
        })
        await queryRunner.createForeignKey("invoice", foreignKey);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("invoice")
        const foreignKey = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("document_invoice_settings_id") !== -1,
        )
        await queryRunner.dropForeignKey("invoice", foreignKey)
        await queryRunner.dropColumn("invoice", "document_invoice_settings_id")
    }
}