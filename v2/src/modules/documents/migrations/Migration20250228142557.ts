import { Migration } from '@mikro-orm/migrations';

export class Migration20250228142557 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "document_invoice_settings" ("id" text not null, "forcedNumber" integer null, "numberFormat" text null, "template" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "document_invoice_settings_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_document_invoice_settings_deleted_at" ON "document_invoice_settings" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "document_packing_slip_settings" ("id" text not null, "forcedNumber" integer null, "numberFormat" text null, "template" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "document_packing_slip_settings_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_document_packing_slip_settings_deleted_at" ON "document_packing_slip_settings" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "document_settings" ("id" text not null, "storeAddress" jsonb null, "storeLogoSource" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "document_settings_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_document_settings_deleted_at" ON "document_settings" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "document_packing_slip" ("id" text not null, "number" integer not null, "displayNumber" text not null, "packing_slip_settings_id" text not null, "settings_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "document_packing_slip_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_document_packing_slip_packing_slip_settings_id" ON "document_packing_slip" (packing_slip_settings_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_document_packing_slip_settings_id" ON "document_packing_slip" (settings_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_document_packing_slip_deleted_at" ON "document_packing_slip" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "document_invoice" ("id" text not null, "number" integer not null, "displayNumber" text not null, "invoice_settings_id" text not null, "settings_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "document_invoice_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_document_invoice_invoice_settings_id" ON "document_invoice" (invoice_settings_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_document_invoice_settings_id" ON "document_invoice" (settings_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_document_invoice_deleted_at" ON "document_invoice" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "document_packing_slip" add constraint "document_packing_slip_packing_slip_settings_id_foreign" foreign key ("packing_slip_settings_id") references "document_packing_slip_settings" ("id") on update cascade;`);
    this.addSql(`alter table if exists "document_packing_slip" add constraint "document_packing_slip_settings_id_foreign" foreign key ("settings_id") references "document_settings" ("id") on update cascade;`);

    this.addSql(`alter table if exists "document_invoice" add constraint "document_invoice_invoice_settings_id_foreign" foreign key ("invoice_settings_id") references "document_invoice_settings" ("id") on update cascade;`);
    this.addSql(`alter table if exists "document_invoice" add constraint "document_invoice_settings_id_foreign" foreign key ("settings_id") references "document_settings" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "document_invoice" drop constraint if exists "document_invoice_invoice_settings_id_foreign";`);

    this.addSql(`alter table if exists "document_packing_slip" drop constraint if exists "document_packing_slip_packing_slip_settings_id_foreign";`);

    this.addSql(`alter table if exists "document_packing_slip" drop constraint if exists "document_packing_slip_settings_id_foreign";`);

    this.addSql(`alter table if exists "document_invoice" drop constraint if exists "document_invoice_settings_id_foreign";`);

    this.addSql(`drop table if exists "document_invoice_settings" cascade;`);

    this.addSql(`drop table if exists "document_packing_slip_settings" cascade;`);

    this.addSql(`drop table if exists "document_settings" cascade;`);

    this.addSql(`drop table if exists "document_packing_slip" cascade;`);

    this.addSql(`drop table if exists "document_invoice" cascade;`);
  }

}
