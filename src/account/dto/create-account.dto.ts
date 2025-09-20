import { IsEnum, IsUUID, IsOptional, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Currency } from "../entities/account.entity";

export class CreateAccountDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ enum: Currency, required: false })
  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  balance?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;
}