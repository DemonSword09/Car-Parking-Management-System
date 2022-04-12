import { Request, Response } from "express";
import { Redis } from "ioredis";
export type MyContext = {
  req: Request & { session: Request["session"] };
  res: Response;
  redis: Redis;
  instance: any;
};
