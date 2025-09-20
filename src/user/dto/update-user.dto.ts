import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: "Current password",
    example: "oldpassword123",
    required: false,
  })
  @IsString()
  @IsOptional()
  oldPassword: string;

  @ApiProperty({
    description: "New password",
    example: "newpassword123",
    required: false,
  })
  @IsString()
  @IsOptional()
  newPassword: string;

  @ApiProperty({ description: "Name", example: "TestName", required: false })
  @IsString()
  @IsOptional()
  name?: string;
}
