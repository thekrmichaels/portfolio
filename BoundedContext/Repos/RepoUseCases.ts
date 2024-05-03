import { Auth } from "../Users/User";
import { Repo } from ".";
import APIRepository from "../Shared/APIRepository";

export async function getRepos(
  repository: APIRepository<typeof Repo>,
  username: (typeof Auth.username)[0]
): Promise<(typeof Repo)[] | null> {
  const repos = await repository.getMany?.(username);

  if (!repos) return null;

  const filteredRepos = repos.filter((repo) => repo.description !== null);

  return filteredRepos.length > 0 ? filteredRepos : null;
}
