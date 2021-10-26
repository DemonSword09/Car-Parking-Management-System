import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import UserResolver from "./resolvers/user";
import { SECRECT, __prod__ } from "./constants";
import { MyContext } from "./types";
import cors from "cors";
import SlotResolver from "./resolvers/slot";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
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
      em: orm.em,
      req,
      res,
      redis,
    }),
  });

  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(4000, () =>
    console.log("server running on http://localhost:4000/graphql")
  );
};

main().catch((err) => console.error(err));
