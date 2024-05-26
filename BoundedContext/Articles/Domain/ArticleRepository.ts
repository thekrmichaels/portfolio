import Article from "./Article";
import { Auth } from "../../Users/Domain";

export default interface ArticleRepository {
  get(username: typeof Auth.username): Promise<(typeof Article)[] | null>;
}
