import { User } from "./User";

export type GetUserResult = {
  user: User;
  error: Error | null;
};