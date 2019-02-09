import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Account } from './Account';

@Entity()
export class Group {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName: string;

  /*
  @ManyToMany(type => Group, group => group.children)
  @JoinTable()
  parents: Group[];

  @ManyToMany(type => Group, group => group.parents)
  children: Group[];
  */

  @ManyToMany(type => Account, account => account.groups)
  accounts: Account[];
}
