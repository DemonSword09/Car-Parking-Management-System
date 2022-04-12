import { Slot } from "../entities/Slots";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { createQueryBuilder, getConnection } from "typeorm";
import { MyContext } from "../types";
import { User } from "../entities/Users";
@ObjectType()
class ARR {
  @Field()
  time: string;
  @Field()
  id: number;
}

@Resolver()
export default class SlotResolver {
  @Query(() => [Slot])
  getSlots(): Promise<Slot[]> {
    return Slot.find();
  }
  @Mutation(() => Slot)
  async addSlot() {
    const timings = [
      { time: "08:00" },
      { time: "09:00" },
      { time: "10:00" },
      { time: "11:00" },
      { time: "12:00" },
      { time: "13:00" },
      { time: "14:00" },
      { time: "15:00" },
      { time: "16:00" },
      { time: "17:00" },
      { time: "18:00" },
      { time: "19:00" },
      { time: "20:00" },
    ];
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Slot)
      .values({
        timings: timings,
      })
      .returning("*")
      .execute();
    const slot = result.raw[0];
    return slot;
  }
  @Mutation(() => Boolean)
  async deleteBooking(
    @Arg("id") id: number,
    @Arg("n") n: number,
    @Ctx() { req, instance, res }: MyContext
  ) {
    const slot = await Slot.findOne(id);
    if (slot) {
      slot.timings[n].bookedby = undefined;
      await Slot.update({ id }, { timings: slot.timings });
      return true;
    }
    return false;
  }
  @Mutation(() => Boolean)
  async bookSlot(
    @Arg("id") id: number,
    @Arg("n") n: number,
    @Ctx() { req, instance, res }: MyContext
  ) {
    const slot = await Slot.findOne(id);
    if (slot?.timings[n].bookedby) {
      return false;
    }
    if (!slot) {
      return {
        errors: [
          {
            field: "slot",
            message: "user no longer exists",
          },
        ],
      };
    }
    if (!req.session.userId) {
      return false;
    }
    // try {
    //   const options = {
    //     amount: 20 * 1, // amount == Rs 10
    //     currency: "INR",
    //     receipt: "receipt#1",
    //     payment_capture: 0,
    //     // 1 for automatic capture // 0 for manual capture
    //   };
    //   instance.orders.create(options, async function (err: any, order: any) {
    //     if (err) {
    //       return res.status(500).json({
    //         message: "Something Went Wrong",
    //       });
    //     }
    //     return res.status(200).json(order);
    //   });
    // } catch (err) {
    //   return res.status(500).json({
    //     message: "Something Went Wrong",
    //   });
    // }
    slot.timings[n].bookedby = req.session.userId;
    await Slot.update({ id }, { timings: slot.timings });
    return true;
  }

  @Query(() => [ARR], { nullable: true })
  async getUserSlots(@Ctx() { req, instance, res }: MyContext) {
    const user = await User.findOne(req.session.userId);
    if (user) {
      const slots = await Slot.find({});
      let arr: [{ id: number; time: string }] = [{ id: 0, time: "" }];
      arr.pop();
      slots.forEach((element) => {
        element.timings.forEach((val) => {
          if (val.bookedby === user.id) {
            arr.push({ id: element.id, time: val.time });
          }
        });
      });
      console.log(arr);

      return arr;
    }
    return null;
  }
}
