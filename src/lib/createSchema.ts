import { buildSchema } from "type-graphql";

export const createSchema = () =>
  buildSchema({
    resolvers: [`${__dirname}/../modules/**/!(*.test).?(ts|js)`],
    authChecker: ({ context: { req } }) => {
      // This is from the middleware `@Authorized` (something like this)
      return !!req.session.userId;
    }
  });
