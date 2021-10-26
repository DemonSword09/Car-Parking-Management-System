import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field, Int } from "type-graphql";
function diff_minutes(dt2: Date, dt1: Date) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  return Math.abs(Math.round(diff));
}
@ObjectType()
@Entity()
export class Slot {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => Int)
  @Property({
    onUpdate: (slot: Slot) => {
      slot.booked ? diff_minutes(new Date(), slot.updatedAt) : 0;
    },
  })
  cost: number;

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field(() => String)
  @Property()
  bookedby: string;

  @Field(() => Boolean)
  @Property()
  booked!: boolean;
}
