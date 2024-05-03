import { Auth } from "../Users/User";
import { Repo } from ".";
import APIRepository from "../Shared/APIRepository";
import {
  GITHUB_API_BASE_URL,
  handleRequest,
} from "../Shared/APIRequestHandler";

export class RepoAPIRepository implements APIRepository<typeof Repo> {
  async getMany(
    username: (typeof Auth.username)[0]
  ): Promise<(typeof Repo)[] | null> {
    const url = `${GITHUB_API_BASE_URL}/users/${username}/repos`;

    const response = await handleRequest(url);
    const reposInformation = await response.json();

    const repos: (typeof Repo)[] = [];

    for (const { name, homepage, html_url, description } of reposInformation) {
      const repo: typeof Repo = {
        name,
        homepage,
        html_url,
        description,
        languages: await getRepoLanguages(name, username),
      };

      repos.push(repo);
    }

    return repos;
  }
}

async function getRepoLanguages(
  repoName: typeof Repo.name,
  username: (typeof Auth.username)[0]
): Promise<Array<{ language: string }>> {
  const url = `${GITHUB_API_BASE_URL}/repos/${username}/${repoName}/languages`;

  const response = await handleRequest(url);
  const languagesInformation = await response.json();

  const languages = Object.entries(languagesInformation)
    .map(([language, bytes]) => ({ language, bytes: bytes as number }))
    .sort((a, b) => b.bytes - a.bytes)
    .map(({ language }) => ({ language }));

  return languages;
}
