import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class PackingSlip1714903539447 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'packing_slip',
                columns: [
                { name: 'id', type: 'character varying', isPrimary: true },
                { name: 'number', type: 'character varying' },
                { name: 'display_number', type: 'character varying' },
                { name: 'order_id', type: 'character varying' },
                { name: 'document_settings_id', type: 'character varying' },
                { name: 'document_packing_slip_settings_id', type: 'character varying' },
                { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()'},
                { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()'},
                { name: 'deleted_at', type: 'TIMESTAMP WITH TIME ZONE', isNullable: true}
                ],
                foreignKeys: [
                    {
                        columnNames: ['order_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'public.order',
                    },
                    {
                        columnNames: ['document_settings_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'public.document_settings',
                    },
                    {
                        columnNames: ['document_packing_slip_settings_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'public.document_packing_slip_settings',
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('packing_slip', true);
        await queryRunner.query(`UPDATE "order" SET metadata = metadata #- '{packing_slip_id}'`);
    }
}
