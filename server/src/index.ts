import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import UserResolver from "./resolvers/user";
import {
  RAZOR_PAY_KEY_ID,
  RAZOR_PAY_KEY_SECRET,
  SECRECT,
  __prod__,
} from "./constants";
import { MyContext } from "./types";
import cors from "cors";
import SlotResolver from "./resolvers/slot";
import { createConnection } from "typeorm";
import { Slot } from "./entities/Slots";
import { User } from "./entities/Users";
import Razorpay from "razorpay";
const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    url: "postgres://rgjybwzdfsabdv:979282d3f6b2bcf4736e3078fe10f62412d14630229af3c9edc6a94d5d7603dd@ec2-44-194-4-127.compute-1.amazonaws.com:5432/dc8mp4lsdel7tt",
    database: "dc8mp4lsdel7tt",
    username: "rgjybwzdfsabdv",
    password:
      "979282d3f6b2bcf4736e3078fe10f62412d14630229af3c9edc6a94d5d7603dd",
    logging: true,
    synchronize: true,
    entities: [Slot, User],
  });

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(
    cors({
      origin: "https://parkathon.herokuapp.com/",
      credentials: true,
    })
  );
  const instance = new Razorpay({
    key_id: RAZOR_PAY_KEY_ID,
    key_secret: RAZOR_PAY_KEY_SECRET,
  });

  app.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years,
        httpOnly: true,
        sameSite: "lax",
        secure: !__prod__, //false in production
      },
      saveUninitialized: false,
      secret: SECRECT,
      resave: false,
    })
  );
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, SlotResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
      instance,
    }),
  });

  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(4000, () => {
    console.log("server running on http://localhost:4000/graphql");
  });
};

main().catch((err) => console.error(err));
