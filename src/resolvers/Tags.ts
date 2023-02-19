import dataSource from "../utils";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Tag, TagInput } from "../entity/Tag";
import { IContext } from "../interfaces";

const repository = dataSource.getRepository(Tag);

@Resolver()
export class TagsResolver {
  @Authorized()
  @Mutation(() => Tag)
  async createTag(
    @Ctx() context: IContext,
    @Arg("data", () => TagInput) data: TagInput
  ): Promise<Tag> {
    data.createdAt = new Date();
    data.createdBy = context.user;
    return await repository.save(data);
  }

  // only user connected
  @Authorized()
  @Query(() => [Tag])
  async readTags(): Promise<Tag[]> {
    const tags = await repository.find({
      relations: ["createdBy"],
    });
    return tags;
  }
}
