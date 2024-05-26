import { Auth } from "../Users/User";
import { Article } from ".";
import APIRepository from "../Shared/APIRepository";
import {
  DEV_COMMUNITY_BASE_URL,
  handleRequest,
} from "../Shared/APIRequestHandler";

export class ArticleAPIRepository implements APIRepository<typeof Article> {
  async getMany(
    username: (typeof Auth.username)[0]
  ): Promise<(typeof Article)[] | null> {
    const url = `${DEV_COMMUNITY_BASE_URL}${username}`;

    const response = await handleRequest(url);
    const articlesInformation = await response.json();

    const articles: (typeof Article)[] = [];

    for (const { cover_image, url, title } of articlesInformation) {
      const article: typeof Article = {
        cover_image,
        url,
        title,
      };

      articles.push(article);
    }

    return articles;
  }
}
