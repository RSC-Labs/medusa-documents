import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class DocumentInvoiceSettings1712753213091 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'document_invoice_settings',
              columns: [
                { name: 'id', type: 'character varying', isPrimary: true },
                { name: 'invoice_forced_number', type: 'int', isNullable: true },
                { name: 'invoice_number_format', type: 'character varying', isNullable: true },
                { name: 'invoice_template', type: 'character varying', isNullable: true },
                { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()'},
                { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()'},
                { name: 'deleted_at', type: 'TIMESTAMP WITH TIME ZONE', isNullable: true}
              ]
            }),
            true
          );
        const latestDocumentSettings = await queryRunner.query(`
            SELECT *
            FROM document_settings
            ORDER BY created_at DESC
            LIMIT 1
        `);

        if (latestDocumentSettings.length > 0) {
          const latestDocumentSetting = latestDocumentSettings[0];
          await queryRunner.query(`
              INSERT INTO document_invoice_settings (id, invoice_forced_number, created_at, updated_at, deleted_at, invoice_number_format, invoice_template)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [
              latestDocumentSetting.id.replace('docset', 'docinvset'),
              null,
              new Date(),
              new Date(), 
              null,
              latestDocumentSetting.invoice_number_format,
              latestDocumentSetting.invoice_template
          ]);
      }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('document_invoice_settings', true);
    }

}
