import { buildSchema } from "type-graphql";
import { ChangePasswordResolver } from "../modules/user/ChangePassword";
import { ConfirmUserResolver } from "../modules/user/ConfirmUser";
import { ForgotPasswordResolver } from "../modules/user/ForgotPassword";
import { LoginResolver } from "../modules/user/Login";
import { LogoutResolver } from "../modules/user/Logout";
import { MeResolver } from "../modules/user/Me";
import { RegisterResolver } from "../modules/user/Register";
import {
  CreateUserResolver,
  CreateProductResolver
} from "../modules/user/CreateHighOrder";
import { ProfilePictureResolver } from "../modules/user/ProfilePicture";

export const createSchema = () =>
  buildSchema({
    resolvers: [
      ChangePasswordResolver,
      ConfirmUserResolver,
      ForgotPasswordResolver,
      LoginResolver,
      LogoutResolver,
      MeResolver,
      RegisterResolver,
      CreateUserResolver,
      CreateProductResolver,
      ProfilePictureResolver
    ],
    // resolvers: [`${__dirname}/../modules/**/!(*.test).?(ts|js)`],
    authChecker: ({ context: { req } }) => {
      // This is from the middleware `@Authorized` (something like this)
      return !!req.session.userId;
    }
  });
