import { Auth } from "../../Users/Domain";
import { Repo, RepoRepository } from "../Domain";

export default async function getReposInformationUseCase(
  repository: RepoRepository,
  username: typeof Auth.username,
): Promise<(typeof Repo)[] | null> {
  const repos = await repository.get(username);

  if (!repos) return null;

  const filteredRepos = repos.filter((repo) => repo.description !== null);

  return filteredRepos.length > 0 ? filteredRepos : null;
}
