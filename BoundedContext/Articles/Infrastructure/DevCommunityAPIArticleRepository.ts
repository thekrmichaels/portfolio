import { Article, ArticleRepository } from "../Domain";
import { Auth } from "../../Users/Domain";
import {
  devCommunityBaseUrl,
  handleRequest,
} from "../../Shared/Infrastructure/handlers";

export default class DevCommunityAPIArticleRepository
  implements ArticleRepository
{
  async get(
    username: typeof Auth.username,
  ): Promise<(typeof Article)[] | null> {
    const url = `${devCommunityBaseUrl}${username}`;

    const response = await handleRequest(url);
    const articlesInformation = await response.json();

    const articles: (typeof Article)[] = [];

    for (const articleData of articlesInformation) {
      const article: typeof Article = {
        cover_image: articleData.cover_image,
        url: articleData.url,
        title: articleData.title,
      };

      articles.push(article);
    }

    return articles;
  }
}
