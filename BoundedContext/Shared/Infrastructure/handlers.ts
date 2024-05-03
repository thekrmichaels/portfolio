/* eslint-disable @typescript-eslint/no-explicit-any */
import { Auth } from "../../Users/Domain";

export const devCommunityBaseUrl = "https://dev.to/api/articles?username=";
export const githubBaseUrl = "https://api.github.com";

function setGitHubHeaders(
  headers: Headers,
  token?: typeof Auth.personal_access_token,
) {
  headers.append("Accept", "application/vnd.github+json");
  token && headers.append("Authorization", `Bearer ${token}`);
  headers.append("X-GitHub-Api-Version", "2022-11-28");
}

export async function handleRequest(
  url: string,
  token?: typeof Auth.personal_access_token,
): Promise<any> {
  const headers = new Headers();

  url.startsWith(githubBaseUrl) && setGitHubHeaders(headers, token);

  return await fetch(url, { headers });
}
