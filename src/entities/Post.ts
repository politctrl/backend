import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Account } from './Account';
import { Embed } from './Embed';

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

  @ManyToOne(type => Account, account => account.posts)
  author: Account;

  @Column('bigint')
  createTimestamp: number;

  @Column()
  deleted: boolean;

  @Column('bigint', { nullable: true })
  deleteTimestamp?: number;

  @OneToMany(type => Embed, embed => embed.origin, { nullable: true })
  embeds: Embed[];

  @Column({ nullable: true })
  replyToId?: string;
}
