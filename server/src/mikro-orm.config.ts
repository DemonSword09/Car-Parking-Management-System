import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./constants";
import { User } from "./entities/Users";
export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [User],
  dbName: "carparking",
  type: "postgresql",
  debug: !__prod__,
  password: "123",
} as Parameters<typeof MikroORM.init>[0];
