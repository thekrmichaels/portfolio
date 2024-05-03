import { Auth, User } from "./User";

export default interface UserRepository {
  get(
    username: typeof Auth.username,
    personal_access_token?: typeof Auth.personal_access_token,
  ): Promise<typeof User | null>;
}
