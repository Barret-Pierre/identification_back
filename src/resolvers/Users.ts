import dataSource from "../utils";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User, UserInput } from "../entity/User";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { IContext } from "../interfaces";

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

  @Mutation(() => String, { nullable: true })
  async signin(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<string | null> {
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
        const token = jwt.sign({ userId: user.id }, "mdpsecret!");
        return token;
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
  @Authorized()
  @Query(() => User, { nullable: true })
  // La query me prend en parametre le context: "context" qui retrounera null ou un user
  async me(@Ctx() context: IContext): Promise<User | null> {
    return context.user;
  }

  // only user connected
  @Authorized()
  @Query(() => [User])
  async readUsers(): Promise<User[]> {
    const users = await repository.find({});
    return users;
  }
}
