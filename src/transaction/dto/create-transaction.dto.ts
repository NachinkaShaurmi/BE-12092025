import { IsUUID, IsPositive, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTransactionDto {
  @ApiProperty()
  @IsUUID()
  fromAccountId: string;

  @ApiProperty()
  @IsUUID()
  toAccountId: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  amount: number;
}