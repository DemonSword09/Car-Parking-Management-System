import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./constants";
import { Slot } from "./entities/Slots";
import { User } from "./entities/Users";
export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [User, Slot],
  dbName: "carparking",
  type: "postgresql",
  debug: !__prod__,
  password: "postgres",
} as Parameters<typeof MikroORM.init>[0];
