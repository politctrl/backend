import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from './User';

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

  @ManyToMany(type => User, user => user.groups)
  users: User[];
}
