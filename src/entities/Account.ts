import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Post } from './Post';
import { Group } from './Group';
import { AccountOwner } from './AccountOwner';

@Entity()
export class Account {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  externalId: string;

  @Column()
  displayName: string;

  @Column()
  active: boolean;

  @Column()
  service: string;

  @ManyToMany(type => Group, group => group.accounts)
  @JoinTable()
  groups: Group[];

  @OneToMany(type => Post, post => post.author)
  posts: Post[];

  @ManyToOne(type => AccountOwner, owner => owner.accounts)
  owner: AccountOwner;
}
