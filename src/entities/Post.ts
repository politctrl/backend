import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Embed } from './Embed';
import { User } from './User';

@Entity()
export class Post {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  service: string;

  @Column()
  externalId: string;

  @Column('text')
  content: string;

  @ManyToOne(type => User, user => user.posts)
  author: User;

  @Column('bigint')
  createTimestamp: number;

  @Column()
  deleted: boolean;

  @Column('bigint', { nullable: true })
  deleteTimestamp?: number;

  @Column('json')
  embeds: Embed[];

  @Column({ nullable: true })
  replyToId?: string;
}
