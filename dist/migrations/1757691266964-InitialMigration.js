"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1757691266964 = void 0;
class InitialMigration1757691266964 {
    name = 'InitialMigration1757691266964';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "version" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
exports.InitialMigration1757691266964 = InitialMigration1757691266964;
//# sourceMappingURL=1757691266964-InitialMigration.js.map