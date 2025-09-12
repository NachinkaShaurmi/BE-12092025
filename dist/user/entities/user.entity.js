"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
let User = class User {
    id;
    login;
    password;
    version;
    createdAt;
    updatedAt;
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.User = User;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User login', example: 'john_doe' }),
    (0, typeorm_1.Column)("varchar", { length: 255 }),
    __metadata("design:type", String)
], User.prototype, "login", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 255 }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User version', example: 1 }),
    (0, typeorm_1.Column)("int", { default: 1 }),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", Number)
], User.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp', example: 1640995200000 }),
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    (0, class_transformer_1.Transform)(({ value }) => Number(new Date(value).getTime())),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Update timestamp', example: 1640995200000 }),
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    (0, class_transformer_1.Transform)(({ value }) => Number(new Date(value).getTime())),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)("users"),
    __metadata("design:paramtypes", [Object])
], User);
//# sourceMappingURL=user.entity.js.map