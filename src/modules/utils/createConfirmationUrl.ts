import { v4 } from "uuid";
import ms from "ms";

import { redis } from "../../redis";
import { confirmUserPrefix } from "../constants/redisPrefixes";

export async function createConfirmationUrl(userId: number) {
  const token = v4();

  await redis.set(confirmUserPrefix + token, userId, "ex", ms("1d")); // 1 day expiration

  return `http://localhost:3000/user/confirm/${token}`;
}
