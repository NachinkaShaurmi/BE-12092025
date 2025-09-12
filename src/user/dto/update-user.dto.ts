import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsString, IsNotEmpty } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'Current password', example: 'oldpassword123' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ description: 'New password', example: 'newpassword123' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
