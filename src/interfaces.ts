import { User } from "./entity/User";

export interface IContext {
  token: string | null;
  user: User;
}
