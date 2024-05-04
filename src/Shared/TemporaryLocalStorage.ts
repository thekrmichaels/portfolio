export default class TemporaryLocalStorage {
  static getItemTemporarily<T>(key: string): T | null {
    const itemString = localStorage.getItem(key);

    if (!itemString) return null;

    const item = JSON.parse(itemString);
    const now = new Date();

    if (new Date(item.expiry) <= now) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value as T;
  }

  static setItemTemporarily(
    key: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    expiryInHours: number = 24
  ): void {
    const now = new Date();
    const expiry = new Date(now.getTime() + expiryInHours * 60 * 60 * 1000);

    const item = {
      value,
      expiry: expiry.toISOString(),
    };

    localStorage.setItem(key, JSON.stringify(item));
  }
}
