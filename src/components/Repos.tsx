import { useEffect, useState } from "react";
import { Auth } from "../../BoundedContext/Users/Domain";
import { Repo } from "../../BoundedContext/Repos/Domain";
import getReposInformationUseCase from "../../BoundedContext/Repos/Application/getReposUseCase";
import GitHubAPIRepoRepository from "../../BoundedContext/Repos/Infrastructure/GitHubAPIRepoRepository";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, GitHubLogo } from "./icons";
import useLightMode from "../hooks/useLightMode";

interface RepoItemProps {
  repo: typeof Repo;
}

const RepoItem = ({ repo }: RepoItemProps) => {
  return (
    <div className="w-64">
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle className="istok-web-bold flex items-center">
            {repo.name}
            {repo.homepage && (
              <a
                href={repo.homepage}
                title={`Go to ${repo.homepage.replace(/^https?:\/\//, "")}`}
                className="ml-4 hover:text-blue-600"
              >
                <ExternalLink className="h-6 w-6" />
              </a>
            )}
            <a
              href={repo.html_url}
              title={`Go to ${repo.html_url.replace(/^https?:\/\//, "")}`}
              className="ml-4 hover:text-blue-600"
            >
              <GitHubLogo className="h-6 w-6" />
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="istok-web-regular">{repo.description}</p>
        </CardContent>
        <CardFooter className="mt-auto">
          <div className="flex flex-wrap gap-2">
            {repo.languages.map((language) => (
              <Badge
                key={language.language}
                className="istok-web-bold text-inherit"
                variant="outline"
              >
                {language.language}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

const LoadingAnimation = () => {
  const isLightMode = useLightMode();

  return (
    <div className="w-64 justify-center">
      <div
        className={`rounded-md ${isLightMode ? "bg-[#E2E8F0]" : "bg-gray-900"} p-4`}
      >
        <div className="flex flex-wrap gap-2">
          <Skeleton className="mb-4 h-4 w-[50%]" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <Skeleton className="mb-4 h-12 w-full" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-4 w-[50px] rounded-full" />
          <Skeleton className="h-4 w-[50px] rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default function Repos({ className }: Readonly<{ className: string }>) {
  const [repos, setRepos] = useState<(typeof Repo)[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function getReposInformation() {
    const localStorageKey = "Repos";
    const storedRepos = localStorage.getItem(localStorageKey);

    try {
      if (storedRepos) {
        const repos = JSON.parse(storedRepos);

        setRepos(repos);
      } else {
        const repository = new GitHubAPIRepoRepository();
        const reposInformation = await getReposInformationUseCase(
          repository,
          Auth.username,
        );

        reposInformation && setRepos(reposInformation);
        localStorage.setItem(localStorageKey, JSON.stringify(reposInformation));
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching repos information:", error);

      setLoading(false);
    }
  }

  useEffect(() => {
    getReposInformation();
  }, []);

  return (
    <div className={`${className}`}>
      {loading ? (
        <LoadingAnimation />
      ) : (
        repos.map((repo) => <RepoItem key={repo.html_url} repo={repo} />)
      )}
    </div>
  );
}
