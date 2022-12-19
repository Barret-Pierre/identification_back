import { AuthChecker } from "type-graphql";
import jwt from "jsonwebtoken";
import dataSource from "./utils";
import { User } from "./entity/User";
import { IContext } from "./interfaces";

export const customAuthChecker: AuthChecker<IContext> = async (
  { root, args, context, info },
  roles
) => {
  const token = context.token;
  if (token === null || token === "") {
    return false;
  }
  try {
    const decodedToken: { userId: number } = jwt.verify(
      token,
      "mdpsecret!"
    ) as any;
    const userId = decodedToken.userId;

    // return true stateless

    const user = await dataSource
      .getRepository(User)
      .findOne({ where: { id: userId } });

    if (user === null) {
      return false;
    }
    context.user = user;
    return true;
  } catch {
    return false;
  }
};
