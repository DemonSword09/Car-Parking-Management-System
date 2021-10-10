import { User } from "../entities/Users";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

import argon2 from "argon2";
import { sendEmail } from "../utils/sendEmails";
import { v4 } from "uuid";
import { FORGOT_PASSWORD_PREFIX } from "../constants";

declare module "express-session" {
  export interface SessionData {
    userId: number;
  }
}
function validateEmail(email:UserInput["email"]) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
@InputType()
class UserInput {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;
}
@InputType()
class UserLogin {
  @Field()
  emailOrUsername: string;
  @Field()
  password!: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}
@Resolver()
export default class UserResolver {
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token:string,
    @Arg("newPassword") newPassword:string,
    @Ctx() {em,req,redis}:MyContext
  ):Promise<UserResponse>{
    if (newPassword.length < 4) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "password must be greater than 3 chars",
          },
        ],
      }
    }
    const userId = await redis.get(FORGOT_PASSWORD_PREFIX + token)
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      }
    }
    const user = await em.findOne(User, { _id:parseInt(userId) });
    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      }
    }
    user.password = await argon2.hash(newPassword);
    await em.persistAndFlush(user)

    req.session.userId = parseInt(userId);
    return {user};
  }
  /*-------------------Forgot password--------------------*/
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { em, redis }: MyContext
  ) {
    const user = await em.findOne(User, { email });
    if (!user) {
      //no email in db
      return true;
    }
    const token = v4();
    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user._id,
      "ex",
      1000 * 60 * 60 * 5
    ); //5hrs
    await sendEmail(
      email,
      `<a href='http://localhost:3000/change-password/${token}'>Reset Password</a> `
    );
    return true;
  }
  /*-------------------getUsers--------------------*/
  @Query(() => [User])
  getUsers(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext) {
    // console.log(req.session);
    if (!req.session.userId) {
      return null;
    }
    const user = await em.findOne(User, { _id: req.session.userId });
    return user;
  }
  // /*-------------------getUser--------------------*/
  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UserLogin,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    let user;
    if (options.emailOrUsername.includes("@")) {
      user = await em.findOne(User, {
        email: options.emailOrUsername,
      });
    } else {
      user = await em.findOne(User, {
        username: options.emailOrUsername,
      });
    }
    if (!user) {
      return {
        errors: [
          {
            field: "emailOrUsername",
            message: "Email Or Username does not exists",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }
    req.session.userId = user._id;

    return { user };
  }

  /*-------------------addUser--------------------*/
  @Mutation(() => UserResponse)
  async addUser(
    @Arg("options") options: UserInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {

    if (!validateEmail(options.email)) {
      return {
        errors: [
          {
            field: "email",
            message: "email must be valid",
          },
        ],
      };
    }
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "username must be greater than 2 chars",
          },
        ],
      };
    }
    if (options.password.length < 4) {
      return {
        errors: [
          {
            field: "password",
            message: "password must be greater than 3 chars",
          },
        ],
      };
    }
    const hashedpass = await argon2.hash(options.password);
    const user = em.create(User, {
      email: options.email,
      username: options.username,
      password: hashedpass,
    });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      // duplicat username error
      // || err.detail.includes("already exists")
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username is already taken",
            },
          ],
        };
      }
    }
    req.session.userId = user._id;
    return { user };
  }
  /*-------------------deleteUser--------------------*/
  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie("qid");
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }
}
