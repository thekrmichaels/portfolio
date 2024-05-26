import { Auth } from "../../Users/Domain";
import { Article, ArticleRepository } from "../Domain";

export default async function getUserArticlesUseCase(
  repository: ArticleRepository,
  username: typeof Auth.username,
): Promise<(typeof Article)[] | null> {
  return await repository.get(username);
}
