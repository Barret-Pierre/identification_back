import dataSource from "../utils";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User, UserInput } from "../entity/User";
import * as argon2 from "argon2";

const repository = dataSource.getRepository(User);

@Resolver()
export class UsersResolver {
  @Mutation(() => User)
  async createUser(
    @Arg("data", () => UserInput) data: UserInput
  ): Promise<User> {
    data.password = await argon2.hash(data.password);
    return await repository.save(data);
  }

  // @Mutation(() => User)
  // async createUser(@Arg("data") data: WilderInput): Promise<Wilder> {
  //   return await repository.save(data);
  // }

  @Query(() => [User])
  async readUser(): Promise<User[]> {
    const wilder = await repository.find({});
    return wilder;
  }
}
