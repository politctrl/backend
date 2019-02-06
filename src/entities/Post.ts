import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column()
  author: number;

  @Column('bigint')
  createTimestamp: number;

  @Column()
  deleted: boolean;

  @Column('bigint', { nullable: true })
  deleteTimestamp?: number;

  @Column('json')
  embeds: Embed[];
}
