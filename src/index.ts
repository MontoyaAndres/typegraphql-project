import "reflect-metadata";
import Express from "express";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import ms from "ms";

import { redis } from "./redis";
import { createSchema } from "./lib/createSchema";

async function main() {
  await createConnection();

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res })
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
