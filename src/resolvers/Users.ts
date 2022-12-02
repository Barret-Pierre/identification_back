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

  @Mutation(() => User, { nullable: true })
  async signin(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User | null> {
    try {
      // Aller chercher l'utilisateur par son email
      const user = await repository.findOne({
        where: { email },
      });
      // Si aucun utilisateur ne correspond on retourn null
      if (user === null) {
        return null;
      }
      // On compare le mot de passe hasher avec le mot de passe transmis
      if (await argon2.verify(user.password, password)) {
        return user;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }

  // @Mutation(() => User)
  // async createUser(@Arg("data") data: WilderInput): Promise<Wilder> {
  //   return await repository.save(data);
  // }

  @Query(() => [User])
  async readUser(): Promise<User[]> {
    const wilders = await repository.find({});
    return wilders;
  }
}
