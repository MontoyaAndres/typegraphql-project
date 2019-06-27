import {
  ClassType,
  Resolver,
  Mutation,
  UseMiddleware,
  Arg,
  InputType,
  Field
} from "type-graphql";
import { Middleware } from "type-graphql/dist/interfaces/Middleware";

import { RegisterInput } from "./register/registerInput";
import { User } from "../../entity/User";
import { Product } from "../../entity/Product";

// Re-use logic
// Video: https://www.youtube.com/watch?v=fYBlg9oOvQM&list=PLN3n1USn4xlma1bBu3Tloe4NyYn9Ko8Gs&index=11
function createResolver<T extends ClassType, X extends ClassType>(
  suffix: string,
  returnType: T,
  inputType: X,
  entity: any,
  middleware?: Middleware<any>[]
) {
  @Resolver()
  class BaseResolver {
    @Mutation(() => returnType, { name: `create${suffix}` })
    @UseMiddleware(...(middleware || []))
    async create(@Arg("data", () => inputType) data: any) {
      return entity.create(data).save();
    }
  }

  return BaseResolver;
}

@InputType()
class ProductInput {
  @Field()
  name: string;
}

export const CreateUserResolver = createResolver(
  "User",
  User,
  RegisterInput,
  User
);

export const CreateProductResolver = createResolver(
  "Product",
  Product,
  ProductInput,
  Product
);
