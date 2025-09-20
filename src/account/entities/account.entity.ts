import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { User } from "../../user/entities/user.entity";
import { Transaction } from "../../transaction/entities/transaction.entity";

export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
}

@Entity("accounts")
@Exclude()
export class Account {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  id: string;

  @ApiProperty()
  @Column("uuid")
  @Expose()
  userId: string;

  @ApiProperty()
  @Column("varchar", { length: 255, default: "" })
  @Expose({ groups: ['account'] })
  name: string;

  @ApiProperty({ enum: Currency })
  @Column({ type: "enum", enum: Currency })
  @Expose({ groups: ['account'] })
  currency: Currency;

  @ApiProperty()
  @Column("decimal", { precision: 10, scale: 2 })
  @Expose({ groups: ['account'] })
  balance: number;

  @ApiProperty()
  @CreateDateColumn()
  @Expose({ groups: ['account'] })
  createdAt: Date;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, user => user.accounts)
  @JoinColumn({ name: "userId" })
  @Expose({ groups: ['account'] })
  user: User;

  @OneToMany(() => Transaction, transaction => transaction.fromAccount)
  @Expose({ groups: ['account'] })
  outgoingTransactions: Transaction[];

  @OneToMany(() => Transaction, transaction => transaction.toAccount)
  @Expose({ groups: ['account'] })
  incomingTransactions: Transaction[];

  get history(): Transaction[] {
    const outgoing = this.outgoingTransactions || [];
    const incoming = this.incomingTransactions || [];
    return [...outgoing, ...incoming].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
}