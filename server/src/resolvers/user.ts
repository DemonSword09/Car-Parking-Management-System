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
import { validateEmail, validateRegister } from "../utils/validateRegister";
import { getConnection } from "typeorm";

declare module "express-session" {
  export interface SessionData {
    userId: number;
  }
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
  /*-------------------Change password--------------------*/

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { req, redis }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length < 4) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "password must be greater than 3 chars",
          },
        ],
      };
    }
    const key = FORGOT_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }
    const userIdnum = parseInt(userId);
    const user = await User.findOne(userIdnum);
    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }
    await User.update(
      { id: userIdnum },
      { password: await argon2.hash(newPassword) }
    );
    await redis.del(key);
    // log in user after change password
    req.session.userId = user.id;
    return { user };
  }

  /*-------------------Forgot password--------------------*/

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    if (!validateEmail(email)) {
      return false;
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      //no email in db
      return true;
    }
    const token = v4();
    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
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
  getUsers(): Promise<User[]> {
    return User.find();
  }
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    // console.log(req.session);
    if (!req.session.userId) {
      return null;
    }
    return User.findOne(req.session.userId);
  }
  @Query(() => User, { nullable: true })
  async getUser(@Arg("id") id: number) {
    const user = await User.findOne(id);
    if (!user) {
      return null;
    }
    return user;
  }
  // /*-------------------getUser--------------------*/
  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UserLogin,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      options.emailOrUsername.includes("@")
        ? { where: { email: options.emailOrUsername } }
        : { where: { username: options.emailOrUsername } }
    );
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
    // console.log(user);
    req.session.userId = user.id;
    return { user };
  }

  /*-------------------addUser--------------------*/
  @Mutation(() => UserResponse)
  async addUser(
    @Arg("options") options: UserInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }
    const hashedpass = await argon2.hash(options.password);
    let user;
    try {
      // User.create({}).save()
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: options.username,
          email: options.email,
          password: hashedpass,
        })
        .returning("*")
        .execute();
      user = result.raw[0];
    } catch (err) {
      //|| err.detail.includes("already exists")) {
      // duplicate username error
      let errors;
      if (err.code === "23505") {
        if (err.length == 227) {
          errors = [
            {
              field: "username",
              message: "username already taken",
            },
          ];
        } else {
          errors = [
            {
              field: "email",
              message: "account with this email already exists",
            },
          ];
        }
        return { errors };
      }
    }
    req.session.userId = user.id;
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
  @Mutation(() => UserResponse)
  async updateUser(
    @Arg("mobileno") mobileno: number,
    @Arg("vehicles") vehicles: string,
    @Ctx() { req, redis }: MyContext
  ): Promise<UserResponse> {
    if (!req.session.userId) {
      return {
        errors: [
          {
            field: "user",
            message: "user not logged in",
          },
        ],
      };
    }
    let user = await User.findOne(req.session.userId);
    if (!user) {
      return {
        errors: [
          {
            field: "user",
            message: "user does not exist",
          },
        ],
      };
    }

    await User.update({ id: user.id }, { mobileno, vehicles });
    return { user };
  }
}
