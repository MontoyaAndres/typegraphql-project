import "reflect-metadata";
import Express from "express";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import ms from "ms";
import queryComplexity, {
  fieldConfigEstimator,
  simpleEstimator
} from "graphql-query-complexity";

import { redis } from "./redis";
import { createSchema } from "./lib/createSchema";

async function main() {
  await createConnection();

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
    validationRules: [
      queryComplexity({
        // The maximum allowed query complexity, queries above this threshold will be rejected
        maximumComplexity: 8,
        // The query variables. This is needed because the variables are not available
        // in the visitor of the graphql-js library
        variables: {},
        // Optional callback function to retrieve the determined query complexity
        // Will be invoked weather the query is rejected or not
        // This can be used for logging or to implement rate limiting
        onComplete: (complexity: number) => {
          console.log("Query Complexity:", complexity);
        },
        estimators: [
          // Using fieldConfigEstimator is mandatory to make it work with type-graphql
          fieldConfigEstimator(),
          // This will assign each field a complexity of 1 if no other estimator
          // returned a value. We can define the default value for field not explicitly annotated
          simpleEstimator({
            defaultComplexity: 1
          })
        ]
      }) as any
    ]
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
