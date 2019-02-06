import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Group {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName: string;

  @Column('json')
  masterGroups: number[];
}
