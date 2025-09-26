import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Account, Currency } from "./entities/account.entity";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const currency = createAccountDto.currency || this.getRandomCurrency();
    const balance = createAccountDto.balance ?? this.getRandomBalance();
    const name = createAccountDto.name || "";

    const account = this.accountRepository.create({
      ...createAccountDto,
      currency,
      balance,
      name,
    });

    return this.accountRepository.save(account);
  }

  async findAll(): Promise<Account[]> {
    return this.accountRepository.find();
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!account) throw new NotFoundException("Account not found");
    return account;
  }

  async findByUserId(userId: string): Promise<Account[]> {
    return this.accountRepository.find({
      where: { userId },
    });
  }

  async findByUserIdWithTransactions(userId: string): Promise<Account[]> {
    return this.accountRepository.find({
      where: { userId },
      relations: [
        "outgoingTransactions",
        "incomingTransactions",
        "outgoingTransactions.toAccount",
        "incomingTransactions.fromAccount",
        "outgoingTransactions.toAccount.user",
        "incomingTransactions.fromAccount.user",
      ],
    });
  }

  async findOneWithHistory(id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id },
      relations: [
        "user",
        "outgoingTransactions",
        "incomingTransactions",
        "outgoingTransactions.toAccount",
        "incomingTransactions.fromAccount",
        "outgoingTransactions.toAccount.user",
        "incomingTransactions.fromAccount.user",
      ],
    });

    if (!account) throw new NotFoundException("Account not found");
    return account;
  }

  private getRandomCurrency(): Currency {
    const currencies = Object.values(Currency);
    return currencies[Math.floor(Math.random() * currencies.length)];
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto
  ): Promise<Account> {
    const account = await this.accountRepository.findOneBy({ id });
    if (!account) throw new NotFoundException("Account not found");

    if (updateAccountDto.name !== undefined) {
      account.name = updateAccountDto.name;
    }

    return this.accountRepository.save(account);
  }

  private getRandomBalance(): number {
    return Math.round((Math.random() * (8000 - 2000) + 2000) * 100) / 100;
  }
}
