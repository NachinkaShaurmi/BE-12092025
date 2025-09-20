import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";

@Injectable()
export class HashService {
  constructor(private configService: ConfigService) {}

  async hashPassword(password: string): Promise<string> {
    const salt = this.configService.get("CRYPT_SALT");
    if (!salt) throw new Error("CRYPT_SALT is not configured");
    return bcrypt.hash(password, parseInt(salt, 10));
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}