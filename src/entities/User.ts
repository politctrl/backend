import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Post } from './Post';
import { Group } from './Group';

@Entity()
export class User {

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

  @ManyToMany(type => Group, group => group.users)
  @JoinTable()
  groups: Group[];

  @OneToMany(type => Post, post => post.author)
  posts: Post[];
}
