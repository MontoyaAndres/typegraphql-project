import { InputType, Field } from "type-graphql";
import { Length, IsEmail } from "class-validator";

import { IsEmailAlreadyExist } from "./isEmailAlreadyExist";
import { PasswordMixin } from "../../shared/PasswordInput";

@InputType()
export class RegisterInput extends PasswordMixin(class {}) {
  @Field()
  @Length(1, 255, { message: "mensaje de ejemplo" })
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: "Email already exists" })
  email: string;
}
