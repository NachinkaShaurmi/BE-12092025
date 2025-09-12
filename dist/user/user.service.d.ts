import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
export declare class UserService {
    private userRepository;
    private configService;
    constructor(userRepository: Repository<User>, configService: ConfigService);
    private hashPassword;
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User | null>;
    remove(id: string): Promise<{
        id: string;
    }>;
}
