import { Auth, User } from ".";
import APIRepository from "../Shared/APIRepository";

export async function getUser(
  repository: APIRepository<typeof User>,
  username: (typeof Auth.username)[0]
): Promise<typeof User | null> {
  return (await repository.getOne?.(username)) ?? null;
}
