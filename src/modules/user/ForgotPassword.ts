import { Resolver, Mutation, Arg } from "type-graphql";
import { v4 } from "uuid";
import ms from "ms";

import { User } from "../../entity/User";
import { redis } from "../../redis";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";
import { sendEmail } from "../utils/sendEmail";

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return false;
    }

    const token = v4();

    await redis.set(forgotPasswordPrefix + token, user.id, "ex", ms("1d"));

    await sendEmail(
      email,
      `http://localhost:3000/user/change-password/${token}`
    );

    return true;
  }
}
