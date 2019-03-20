import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Group } from './Group';
import { Account } from './Account';

@Entity()
export class AccountOwner {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName: string;

  @Column()
  photo: string;

  @Column()
  type: 'personal' | 'clerkship' | 'official';

  @Column()
  active: boolean;

  @ManyToMany(type => Group, group => group.accounts)
  @JoinTable()
  groups: Group[];

  @OneToMany(type => Account, account => account.owner)
  accounts: Account[];
}
