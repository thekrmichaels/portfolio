# Portfolio template made with React

Display your user information and repositories from GitHub and Dev Community posts using their APIs.

## Getting Started

⚠️ I use it with Node 22.13.0 and pnpm (check `.nvmrc`).

1. Clone the repository: `git clone https://github.com/thekrmichaels/portfolio.git`
2. Install dependencies: `pnpm install`
3. Start the development server: `pnpm run dev`
4. Open the app in your browser: `http://localhost:5173/portfolio/`
5. Go to `BoundedContext\Users\User.ts` and replace the username, name and email fields with your own data.

```ts
/**
 * * GitHub and DEV Community usernames in that order
 * * (don't repeat the username if they are the same).
 */
const Auth = {
  username: ["thekrmichaels"],
};

/**
 * * GitHub user info.
 */
const User = {
  avatar_url: "",
  html_url: "",
  name: "Amilkar Díaz",
  email: "amilkarjdiazh@outlook.com",
};
```
