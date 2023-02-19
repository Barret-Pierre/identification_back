import dataSource from "../utils";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Post, PostInput } from "../entity/Post";
import { IContext } from "../interfaces";

const repository = dataSource.getRepository(Post);

@Resolver()
export class PostsResolver {
  @Authorized()
  @Mutation(() => Post)
  async createPost(
    @Ctx() context: IContext,
    @Arg("data", () => PostInput) data: PostInput
  ): Promise<Post> {
    data.createdAt = new Date();
    data.createdBy = context.user;
    return await repository.save(data);
  }

  // only user connected
  @Authorized()
  @Query(() => [Post])
  async readPosts(): Promise<Post[]> {
    const posts = await repository.find({
      relations: ["createdBy", "comments", "image"],
    });
    return posts;
  }
}
