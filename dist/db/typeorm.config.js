"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const configService = new config_1.ConfigService();
exports.default = new typeorm_1.DataSource({
    type: "postgres",
    host: configService.get("POSTGRES_HOST"),
    port: parseInt(configService.get("POSTGRES_PORT") ?? "", 10),
    username: configService.get("POSTGRES_USER"),
    password: configService.get("POSTGRES_PASSWORD"),
    database: configService.get("POSTGRES_DB"),
    entities: [(0, path_1.join)(__dirname, "../**/*.entity{.ts,.js}")],
    migrations: [(0, path_1.join)(__dirname, "../migrations/*{.ts,.js}")],
    synchronize: false,
    ssl: {
        rejectUnauthorized: false,
    },
});
//# sourceMappingURL=typeorm.config.js.map