import { Auth, User, type UserRepository } from "../Domain";
import {
  githubBaseUrl,
  handleRequest,
} from "../../Shared/Infrastructure/handlers";

export default class GitHubAPIUserRepository implements UserRepository {
  async get(
    username: typeof Auth.username,
    personal_access_token?: typeof Auth.personal_access_token,
  ): Promise<typeof User | null> {
    const url = `${githubBaseUrl}/users/${username}`;

    const response = await handleRequest(url, personal_access_token);
    const userInformation = await response.json();
    const { avatar_url, html_url, name, email } = userInformation;

    return {
      avatar_url,
      html_url,
      name: name || User.name,
      email: email || User.email,
    };
  }
}
