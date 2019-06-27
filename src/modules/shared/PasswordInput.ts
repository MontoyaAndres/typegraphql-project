import { InputType, Field, ClassType } from "type-graphql";
import { MinLength } from "class-validator";

// This is when I want to extend an input field from others input fields

// Example:

/*
  // I cannot do that.
  class SomewhereInput extends Input1, Input2, Input3 {
    ...
  }

  // In that case I can use this functionality:
*/

// Video reference: https://www.youtube.com/watch?v=j9dOdjBzARo&list=PLN3n1USn4xlma1bBu3Tloe4NyYn9Ko8Gs&index=8 (7:24)

export const PasswordMixin = <T extends ClassType>(BaseClass: T) => {
  @InputType({ isAbstract: true })
  class PasswordInput extends BaseClass {
    @Field()
    @MinLength(5)
    password: string;
  }

  return PasswordInput;
};
