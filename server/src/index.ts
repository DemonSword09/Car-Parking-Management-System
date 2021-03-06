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
    url: POSTGRES_URL,
    host: POSTGRES_HOSTNAME,
    logging: true,
    synchronize: true,
    entities: [Slot, User],
  });

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis({
    host: REDIS_URI,
    port: 17973,
    password: REDIS_PASSWORD,
  });
  app.use(
    cors({
      origin: ["https://parkathon.herokuapp.com", "http://localhost:3000"],
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
        httpOnly: false,
        sameSite: "lax",
        secure: false, //false in production
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
    playground: {
      endpoint: `https://warm-hamlet-33828.herokuapp.com/graphql`,
      settings: {
        "editor.theme": "dark",
        "request.credentials": "include",
      },
    },
    introspection: true,
  });

  apolloServer.applyMiddleware({ app, cors: false });
  app.set("port", process.env.PORT || 5000);
  //For avoidong Heroku $PORT error
  app.listen(app.get("port"), function () {
    console.log(
      "App is running, server is listening on port ",
      app.get("port")
    );
  });
};

main().catch((err) => console.error(err));
