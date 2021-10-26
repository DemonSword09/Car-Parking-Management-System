import { Slot } from "../entities/Slots";
import { MyContext } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/Users";

@Resolver()
export default class SlotResolver {
  @Mutation(() => Boolean)
  async bookSlot(@Arg("id") id: number, @Ctx() { em, req }: MyContext) {
    const slot = await em.findOne(Slot, { id });
    if (slot?.booked) {
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
    if (req.session.userId) {
      const user = await em.findOne(User, { _id: req.session.userId });
      if (user) slot.bookedby = user.username;
    }
    slot.booked = true;
    slot.cost = 0;
    await em.persistAndFlush(slot);
    return true;
  }
  // @Mutation(() => Slot)
  // async addSlot(@Ctx() { em }: MyContext) {
  //   const slot = em.create(Slot, {
  //     booked: false,
  //     cost: 0,
  //     bookedby: "",
  //   });
  //   await em.persistAndFlush(slot);
  //   return slot;
  // }
  @Query(() => [Slot])
  getSlots(@Ctx() { em }: MyContext): Promise<Slot[]> {
    return em.find(Slot, {});
  }
}
