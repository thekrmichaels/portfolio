import Repo from "./Repo";
import { Auth } from "../../Users/Domain";

export default interface RepoRepository {
  get(username: typeof Auth.username): Promise<(typeof Repo)[] | null>;
}
