import { Entity, Column } from 'typeorm';

@Entity()
export class Embed {

  @Column()
  name?: string;

  @Column()
  url: string;

  @Column()
  type: string;
}
