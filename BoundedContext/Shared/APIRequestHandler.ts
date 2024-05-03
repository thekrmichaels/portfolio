export const DEV_COMMUNITY_BASE_URL = "https://dev.to/api/articles?username=";
export const GITHUB_API_BASE_URL = "https://api.github.com";

export async function handleRequest(url: string): Promise<Response> {
  const headers = new Headers();

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  url.startsWith(GITHUB_API_BASE_URL) && setGitHubHeaders(headers);

  return await fetch(url, { headers });
}

function setGitHubHeaders(headers: Headers) {
  headers.append("Accept", "application/vnd.github+json");
  headers.append("X-GitHub-Api-Version", "2022-11-28");
}
