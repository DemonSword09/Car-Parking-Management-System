import { ObjectType, Field, Int, InputType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
@ObjectType()
class SlotTimings {
  @Field()
  time: string;
  @Field({ nullable: true })
  bookedby?: number;
}
@ObjectType()
@Entity()
export class Slot extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt = Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = Date;

  @Field(() => [SlotTimings])
  @Column("simple-json")
  timings!: SlotTimings[];
}
