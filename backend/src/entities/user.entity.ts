import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Monitoring } from './monitoring.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Monitoring, (monitoring) => monitoring.user)
  monitorings: Monitoring[];
}
