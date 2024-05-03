import { Repo, RepoRepository } from "../Domain";
import { Auth } from "../../Users/Domain";
import {
  githubBaseUrl,
  handleRequest,
} from "../../Shared/Infrastructure/handlers";

async function getRepoLanguages(
  repoName: string,
  username: string,
): Promise<Array<{ language: string }>> {
  const url = `${githubBaseUrl}/repos/${username}/${repoName}/languages`;

  const response = await handleRequest(url);
  const languagesInformation = await response.json();

  const languages = Object.entries(languagesInformation)
    .map(([language, bytes]) => ({ language, bytes: bytes as number }))
    .sort((a, b) => b.bytes - a.bytes)
    .map(({ language }) => ({ language }));

  return languages;
}

export default class GitHubAPIRepoRepository implements RepoRepository {
  async get(username: typeof Auth.username): Promise<(typeof Repo)[] | null> {
    const url = `${githubBaseUrl}/users/${username}/repos`;

    const response = await handleRequest(url);
    const reposInformation = await response.json();

    const repos: (typeof Repo)[] = [];

    for (const repoData of reposInformation) {
      const repo: typeof Repo = {
        name: repoData.name,
        homepage: repoData.homepage,
        html_url: repoData.html_url,
        description: repoData.description,
        languages: await getRepoLanguages(repoData.name, username),
      };

      repos.push(repo);
    }

    return repos;
  }
}
