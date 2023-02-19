import dataSource from "../utils";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Comment, CommentInput } from "../entity/Comment";
import { IContext } from "../interfaces";

const repository = dataSource.getRepository(Comment);

@Resolver()
export class CommentsResolver {
  @Authorized()
  @Mutation(() => Comment)
  async createComment(
    @Ctx() context: IContext,
    @Arg("data", () => CommentInput) data: CommentInput
  ): Promise<Comment> {
    data.createdAt = new Date();
    data.createdBy = context.user;
    return await repository.save(data);
  }

  // only user connected
  @Authorized()
  @Query(() => [Comment])
  async readComments(): Promise<Comment[]> {
    const comments = await repository.find({
      relations: ["createdBy"],
    });
    return comments;
  }

  // @Authorized()
  // @Query(() => User, { nullable: true })
  // // La query me prend en parametre le context: "context" qui retrounera null ou un user
  // async me(@Ctx() context: IContext): Promise<User | null> {
  //   return context.user;
  // }

  // @Mutation(() => String, { nullable: true })
  // async signin(
  //   @Arg("email") email: string,
  //   @Arg("password") password: string
  // ): Promise<string | null> {
  //   try {
  //     // Aller chercher l'utilisateur par son email
  //     const user = await repository.findOne({
  //       where: { email },
  //     });
  //     // Si aucun utilisateur ne correspond on retourn null
  //     if (user === null) {
  //       return null;
  //     }
  //     // On compare le mot de passe hasher avec le mot de passe transmis
  //     if (await argon2.verify(user.password, password)) {
  //       const token = jwt.sign({ userId: user.id }, "mdpsecret!");
  //       return token;
  //     } else {
  //       return null;
  //     }
  //   } catch {
  //     return null;
  //   }
  // }

  // @Mutation(() => User)
  // async createUser(@Arg("data") data: WilderInput): Promise<Wilder> {
  //   return await repository.save(data);
  // }
}
