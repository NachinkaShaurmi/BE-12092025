import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Account, Currency } from "./entities/account.entity";
import { CreateAccountDto } from "./dto/create-account.dto";

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const currency = createAccountDto.currency || this.getRandomCurrency();
    const balance = createAccountDto.balance ?? this.getRandomBalance();
    
    const account = this.accountRepository.create({
      ...createAccountDto,
      currency,
      balance,
    });

    return this.accountRepository.save(account);
  }

  async findAll(): Promise<Account[]> {
    return this.accountRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id },
      relations: ['user', 'outgoingTransactions', 'incomingTransactions'],
    });

    if (!account) throw new NotFoundException("Account not found");
    return account;
  }

  async findByUserId(userId: string): Promise<Account[]> {
    return this.accountRepository.find({
      where: { userId },
      relations: ['user', 'outgoingTransactions', 'incomingTransactions'],
    });
  }

  async findOneWithHistory(id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id },
      relations: ['user', 'outgoingTransactions', 'incomingTransactions', 'outgoingTransactions.toAccount', 'incomingTransactions.fromAccount'],
    });

    if (!account) throw new NotFoundException("Account not found");
    return account;
  }

  async updateBalance(id: string, newBalance: number): Promise<Account> {
    await this.accountRepository.update(id, { balance: newBalance });
    return this.findOne(id);
  }

  private getRandomCurrency(): Currency {
    const currencies = Object.values(Currency);
    return currencies[Math.floor(Math.random() * currencies.length)];
  }

  private getRandomBalance(): number {
    return Math.round((Math.random() * (8000 - 2000) + 2000) * 100) / 100;
  }
}