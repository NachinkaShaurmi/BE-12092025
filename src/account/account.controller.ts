import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  SerializeOptions,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { AccountService } from "./account.service";
import { CreateAccountDto } from "./dto/create-account.dto";
import { Account } from "./entities/account.entity";

@ApiTags("accounts")
@ApiBearerAuth()
@Controller("account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: "Create account" })
  @ApiResponse({ status: 201, type: Account })
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  @SerializeOptions({ groups: ["account"] })
  @ApiOperation({ summary: "Get all accounts" })
  @ApiResponse({ status: 200, type: [Account] })
  findAll() {
    return this.accountService.findAll();
  }

  @Get(":id")
  @SerializeOptions({ groups: ["account"] })
  @ApiOperation({ summary: "Get account by ID" })
  @ApiResponse({ status: 200, type: Account })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.accountService.findOneWithHistory(id);
  }

  @Get("user/:userId")
  @SerializeOptions({ groups: ["account"] })
  @ApiOperation({ summary: "Get accounts by user ID" })
  @ApiResponse({ status: 200, type: [Account] })
  findByUserId(@Param("userId", ParseUUIDPipe) userId: string) {
    return this.accountService.findByUserId(userId);
  }
}
