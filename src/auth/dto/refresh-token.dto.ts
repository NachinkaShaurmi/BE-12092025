import { IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto {
  @ApiProperty({ description: "Refresh token", example: "", required: false })
  @IsString()
  @IsOptional()
  refreshToken?: string;
}
