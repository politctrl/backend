import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('json')
  groups: number[];
}
