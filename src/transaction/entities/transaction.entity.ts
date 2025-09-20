import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Expose } from "class-transformer";
import { Account } from "../../account/entities/account.entity";

@Entity("transactions")
export class Transaction {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column("uuid")
  fromAccountId: string;

  @ApiProperty()
  @Column("uuid")
  toAccountId: string;

  @ApiProperty()
  @Column("uuid")
  userId: string;

  @ApiProperty()
  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @ApiProperty()
  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => Account, (account) => account.outgoingTransactions)
  @JoinColumn({ name: "fromAccountId" })
  fromAccount: Account;

  @ManyToOne(() => Account, (account) => account.incomingTransactions)
  @JoinColumn({ name: "toAccountId" })
  toAccount: Account;
}
