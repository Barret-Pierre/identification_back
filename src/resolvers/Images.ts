import dataSource from "../utils";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Image, ImageInput } from "../entity/Image";
import { IContext } from "../interfaces";

const repository = dataSource.getRepository(Image);

@Resolver()
export class ImagesResolver {
  @Authorized()
  @Mutation(() => Image)
  async createImage(
    @Ctx() context: IContext,
    @Arg("data", () => ImageInput) data: ImageInput
  ): Promise<Image> {
    data.createdAt = new Date();
    data.createdBy = context.user;
    return await repository.save(data);
  }

  // only user connected
  @Authorized()
  @Query(() => [Image])
  async readImages(): Promise<Image[]> {
    const images = await repository.find({
      relations: ["createdBy"],
    });
    return images;
  }
}
