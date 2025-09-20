import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAccountNameField1758372882707 implements MigrationInterface {
    name = 'AddAccountNameField1758372882707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ADD "name" character varying(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "name"`);
    }

}
