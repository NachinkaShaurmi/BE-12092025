import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { TransactionService } from "./transaction.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { Transaction } from "./entities/transaction.entity";

@ApiTags('transactions')
@Controller("transaction")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create transaction' })
  @ApiResponse({ status: 201, type: Transaction })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ status: 200, type: [Transaction] })
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, type: Transaction })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.transactionService.findOne(id);
  }

  @Get("user/:userId")
  @ApiOperation({ summary: 'Get transactions by user ID' })
  @ApiResponse({ status: 200, type: [Transaction] })
  findByUserId(@Param("userId", ParseUUIDPipe) userId: string) {
    return this.transactionService.findByUserId(userId);
  }
}