import { Auth } from "../Users/User";

export default interface APIRepository<T> {
  getOne?(username: (typeof Auth.username)[number]): Promise<T | null>;

  getMany?(username: (typeof Auth.username)[number]): Promise<T[] | null>;
}
