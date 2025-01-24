import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class DocumentPackingSlipSettings1714903066794 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'document_packing_slip_settings',
                columns: [
                { name: 'id', type: 'character varying', isPrimary: true },
                { name: 'forced_number', type: 'int', isNullable: true },
                { name: 'number_format', type: 'character varying', isNullable: true },
                { name: 'template', type: 'character varying', isNullable: true },
                { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()'},
                { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()'},
                { name: 'deleted_at', type: 'TIMESTAMP WITH TIME ZONE', isNullable: true}
                ]
            }),
            true
            );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('document_packing_slip_settings', true);
    }

}
