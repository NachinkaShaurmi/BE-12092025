import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../user/entities/user.entity";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { AccountService } from "../account/account.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private accountService: AccountService
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    await this.accountService.create({ userId: savedUser.id });

    return savedUser;
  }

  async login(loginDto: LoginUserDto) {
    const user = await this.userRepository.findOneBy({ login: loginDto.login });
    if (!user) {
      throw new ForbiddenException("User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ForbiddenException("Invalid password");
    }

    return this.generateTokens(user.id, user.login);
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token is missing");
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get("JWT_SECRET_REFRESH_KEY"),
      });

      const user = await this.userRepository.findOneBy({ id: payload.userId });
      if (!user) {
        throw new ForbiddenException("User not found");
      }

      return this.generateTokens(user.id, user.login);
    } catch (error) {
      throw new ForbiddenException("Invalid or expired refresh token");
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = this.configService.get("CRYPT_SALT");

    if (!salt) throw new Error("CRYPT_SALT is not configured");

    return bcrypt.hash(password, parseInt(salt, 10));
  }

  private async generateTokens(userId: string, login: string) {
    const payload: JwtPayload = { userId, login };

    const jwtSecret = this.configService.get("JWT_SECRET_KEY");
    const refreshSecret = this.configService.get("JWT_SECRET_REFRESH_KEY");
    const tokenExpire = this.configService.get("TOKEN_EXPIRE_TIME");
    const refreshExpire = this.configService.get("TOKEN_REFRESH_EXPIRE_TIME");

    if (!jwtSecret || !refreshSecret || !tokenExpire || !refreshExpire) {
      throw new Error("JWT configuration is incomplete");
    }

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: tokenExpire,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpire,
    });

    return { accessToken, refreshToken };
  }
}
