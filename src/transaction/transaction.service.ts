import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";
import { Transaction } from "./entities/transaction.entity";
import { Account } from "../account/entities/account.entity";
import { CreateTransactionDto } from "./dto/create-transaction.dto";

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto
  ): Promise<Transaction> {
    return this.transactionRepository.manager.transaction(
      async (manager: EntityManager) => {
        const fromAccount = await manager.findOne(Account, {
          where: { id: createTransactionDto.fromAccountId },
          relations: ["user"],
        });
        const toAccount = await manager.findOne(Account, {
          where: { id: createTransactionDto.toAccountId },
          relations: ["user"],
        });

        if (!fromAccount) throw new NotFoundException("From account not found");
        if (!toAccount) throw new NotFoundException("To account not found");

        if (fromAccount.currency !== toAccount.currency) {
          throw new BadRequestException(
            "Currency mismatch: both accounts must have the same currency"
          );
        }

        if (Number(fromAccount.balance) < Number(createTransactionDto.amount)) {
          throw new BadRequestException("Insufficient balance");
        }

        await manager.update(Account, fromAccount.id, {
          balance:
            Number(fromAccount.balance) - Number(createTransactionDto.amount),
        });

        await manager.update(Account, toAccount.id, {
          balance:
            Number(toAccount.balance) + Number(createTransactionDto.amount),
        });

        const transaction = manager.create(Transaction, {
          ...createTransactionDto,
          userId: fromAccount.userId,
        });
        return manager.save(transaction);
      }
    );
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find({
      relations: {
        fromAccount: { user: true },
        toAccount: { user: true },
      },
    });
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: {
        fromAccount: { user: true },
        toAccount: { user: true },
      },
    });

    if (!transaction) throw new NotFoundException("Transaction not found");
    return transaction;
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { userId },
      relations: {
        fromAccount: { user: true },
        toAccount: { user: true },
      },
    });
  }
}
