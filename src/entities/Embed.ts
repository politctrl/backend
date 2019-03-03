import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Post } from './Post';

@Entity()
export class Embed {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name?: string;

  @Column()
  url: string;

  @Column()
  type: string;

  @ManyToOne(type => Post, post => post.embeds)
  origin: Post;
}
