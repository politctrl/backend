import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Embed {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name?: string;

  @Column()
  url: string;

  @Column()
  type: string;
}
