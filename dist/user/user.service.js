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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./entities/user.entity");
let UserService = class UserService {
    userRepository;
    configService;
    constructor(userRepository, configService) {
        this.userRepository = userRepository;
        this.configService = configService;
    }
    async hashPassword(password) {
        const salt = this.configService.get("CRYPT_SALT");
        return bcrypt.hash(password, parseInt(salt, 10));
    }
    async create(createUserDto) {
        const hashedPassword = await this.hashPassword(createUserDto.password);
        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
        return this.userRepository.save(user);
    }
    async findAll() {
        return this.userRepository.find();
    }
    async findOne(id) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        return user;
    }
    async update(id, updateUserDto) {
        return this.userRepository.manager.transaction(async (manager) => {
            const user = await manager.findOneBy(user_entity_1.User, { id });
            if (!user)
                throw new common_1.NotFoundException("User not found");
            const isPasswordValid = await bcrypt.compare(updateUserDto.oldPassword, user.password);
            if (!isPasswordValid) {
                throw new common_1.ForbiddenException("Old password is incorrect");
            }
            const hashedPassword = await this.hashPassword(updateUserDto.newPassword);
            const result = await manager
                .createQueryBuilder()
                .update(user_entity_1.User)
                .set({ password: hashedPassword, version: () => "version + 1" })
                .where("id = :id AND version = :version", {
                id,
                version: user.version,
            })
                .execute();
            if (result.affected === 0) {
                throw new common_1.NotFoundException("User not found or version conflict");
            }
            return manager.findOneBy(user_entity_1.User, { id });
        });
    }
    async remove(id) {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException("User not found");
        }
        return { id };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], UserService);
//# sourceMappingURL=user.service.js.map