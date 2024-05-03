import { Auth, User } from ".";
import APIRepository from "../Shared/APIRepository";
import {
  GITHUB_API_BASE_URL,
  handleRequest,
} from "../Shared/APIRequestHandler";

export class UserAPIRepository implements APIRepository<typeof User> {
  async getOne(
    username: (typeof Auth.username)[0]
  ): Promise<typeof User | null> {
    const url = `${GITHUB_API_BASE_URL}/users/${username}`;

    const response = await handleRequest(url);
    const { avatar_url, html_url, name, email } = await response.json();

    return {
      avatar_url,
      html_url,
      name: name || User.name,
      email: email || User.email,
    };
  }
}
