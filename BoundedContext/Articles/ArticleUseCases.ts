import { Auth } from "../Users/User";
import { Article } from ".";
import APIRepository from "../Shared/APIRepository";

export async function getArticles(
  repository: APIRepository<typeof Article>,
  username: (typeof Auth.username)[0]
): Promise<(typeof Article)[] | null> {
  return (await repository.getMany?.(username)) ?? null;
}
