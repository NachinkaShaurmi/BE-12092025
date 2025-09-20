import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Exclude, Transform, Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { Account } from "../../account/entities/account.entity";

@Entity("users")
export class User {
  @ApiProperty({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ description: 'User name', example: 'John Doe' })
  @Column("varchar", { length: 255 })
  name: string;

  @ApiProperty({ description: 'User email', example: 'john@example.com' })
  @Column("varchar", { length: 255, unique: true })
  email: string;

  @ApiProperty({ description: 'User login', example: 'john_doe' })
  @Column("varchar", { length: 255 })
  login: string;

  @Column("varchar", { length: 255 })
  @Exclude()
  password: string;

  @ApiProperty({ description: 'User version', example: 1 })
  @Column("int", { default: 1 })
  @Transform(({ value }) => Number(value))
  version: number;

  @ApiProperty({ description: 'Creation timestamp', example: 1640995200000 })
  @CreateDateColumn({ name: "created_at" })
  @Transform(({ value }) => Number(new Date(value).getTime()))
  createdAt: Date;

  @ApiProperty({ description: 'Update timestamp', example: 1640995200000 })
  @UpdateDateColumn({ name: "updated_at" })
  @Transform(({ value }) => Number(new Date(value).getTime()))
  updatedAt: Date;

  @OneToMany(() => Account, account => account.user)
  @Expose()
  accounts: Account[];

  @ApiProperty({ description: 'Total balance across all accounts', example: 5000.50 })
  @Expose()
  get balance(): number {
    if (!this.accounts || this.accounts.length === 0) return 0;
    return this.accounts.reduce((sum, account) => sum + Number(account.balance), 0);
  }

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
