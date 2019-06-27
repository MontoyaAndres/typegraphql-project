import { Resolver, Mutation, Arg } from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import { createWriteStream } from "fs";

import { Upload } from "../../types/Upload";

// test code with postman -> https://www.youtube.com/watch?v=s35EmAn9Zl8&list=PLN3n1USn4xlma1bBu3Tloe4NyYn9Ko8Gs&index=12
@Resolver()
export class ProfilePictureResolver {
  @Mutation(() => Boolean)
  async addProfilePicture(@Arg("picture", () => GraphQLUpload)
  {
    createReadStream,
    filename
  }: Upload) {
    return new Promise(async (resolve, reject) =>
      createReadStream().pipe(
        createWriteStream(__dirname + `/../../../images/${filename}`)
          .on("finish", () => resolve(true))
          .on("error", () => reject(false))
      )
    );
  }
}
