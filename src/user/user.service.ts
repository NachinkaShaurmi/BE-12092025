import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { AccountService } from "../account/account.service";
import { HashService } from "../common/services/hash.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private accountService: AccountService,
    private hashService: HashService
  ) {}



  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashService.hashPassword(createUserDto.password);
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
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['accounts']
    });

    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.manager.transaction(
      async (manager: EntityManager) => {
        const user = await manager.findOneBy(User, { id });
        if (!user) throw new NotFoundException("User not found");

        const updateData: {
          name?: string;
          password?: string;
          version: () => string;
        } = { version: () => "version + 1" };

        if (updateUserDto.name) {
          updateData.name = updateUserDto.name;
        }

        if (updateUserDto.oldPassword && updateUserDto.newPassword) {
          const isPasswordValid = await this.hashService.comparePassword(
            updateUserDto.oldPassword,
            user.password
          );

          if (!isPasswordValid) {
            throw new ForbiddenException("Old password is incorrect");
          }

          updateData.password = await this.hashService.hashPassword(
            updateUserDto.newPassword
          );
        }

        const result = await manager
          .createQueryBuilder()
          .update(User)
          .set(updateData)
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
