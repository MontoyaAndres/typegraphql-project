import "reflect-metadata";
import { Resolver, Query, buildSchema, Arg } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";

@Resolver()
class HelloResolver {
  @Query(() => String)
  async helloWorld() {
    return "hello world";
  }

  @Query(() => String)
  async myNameIs(@Arg("name") name: string, @Arg("lastname") lastname: string) {
    return {
      name,
      lastname
    };
  }
}

async function main() {
  const schema = await buildSchema({
    resolvers: [HelloResolver]
  });

  const apolloServer = new ApolloServer({ schema });

  const app = Express();

  apolloServer.applyMiddleware({ app });

  app.listen(3000);
}

main();
