import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HashService } from "./services/hash.service";

@Module({
  imports: [ConfigModule],
  providers: [HashService],
  exports: [HashService],
})
export class CommonModule {}