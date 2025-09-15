import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { AccountService } from "../account/account.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private accountService: AccountService
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = this.configService.get("CRYPT_SALT");

    return bcrypt.hash(password, parseInt(salt, 10));
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    await this.accountService.create({ userId: savedUser.id });
    
    return savedUser;
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.manager.transaction(
      async (manager: EntityManager) => {
        const user = await manager.findOneBy(User, { id });
        if (!user) throw new NotFoundException("User not found");

        const isPasswordValid = await bcrypt.compare(
          updateUserDto.oldPassword,
          user.password
        );

        if (!isPasswordValid) {
          throw new ForbiddenException("Old password is incorrect");
        }

        const hashedPassword = await this.hashPassword(
          updateUserDto.newPassword
        );

        const result = await manager
          .createQueryBuilder()
          .update(User)
          .set({ password: hashedPassword, version: () => "version + 1" })
          .where("id = :id AND version = :version", {
            id,
            version: user.version,
          })
          .execute();

        if (result.affected === 0) {
          throw new NotFoundException("User not found or version conflict");
        }

        return manager.findOneBy(User, { id });
      }
    );
  }

  async remove(id: string) {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException("User not found");
    }

    return { id };
  }
}
