import { Auth, User, type UserRepository } from "../Domain";

export default async function getUserInformationUseCase(
  repository: UserRepository,
  username: typeof Auth.username,
  personal_access_token?: typeof Auth.personal_access_token,
): Promise<typeof User | null> {
  return await repository.get(username, personal_access_token);
}
