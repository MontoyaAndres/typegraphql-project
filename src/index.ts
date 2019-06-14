import "reflect-metadata";
import Express from "express";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import ms from "ms";

import { RegisterResolver } from "./modules/user/Register";
import { redis } from "./redis";
import { MeResolver } from "./modules/user/Me";
import { LoginResolver } from "./modules/user/Login";

async function main() {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [RegisterResolver, MeResolver, LoginResolver],
    authChecker: ({ context: { req } }) => {
      // You use it with `@Authorized`
      // https://typegraphql.ml/docs/authorization.html
      return !!req.session.userId;
    }
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req })
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

  app.use(
    session({
      store: new RedisStore({ client: redis as any }),
      name: "qid",
      secret: "dsdasda",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: ms("7 days")
      }
    })
  );

  apolloServer.applyMiddleware({ app });

  app.listen(3000);
}

main();
