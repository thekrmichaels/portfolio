import { useEffect, useState } from "react";
import { Auth } from "../../BoundedContext/Users/Domain";
import { Article } from "../../BoundedContext/Articles/Domain";
import getUserArticlesUseCase from "../../BoundedContext/Articles/Application/getUserArticlesUseCase";
import DevCommunityAPIArticleRepository from "../../BoundedContext/Articles/Infrastructure/DevCommunityAPIArticleRepository";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "./icons";
import useLightMode from "../hooks/useLightMode";

interface ArticleItemProps {
  article: typeof Article;
}

const ArticleItem = ({ article }: ArticleItemProps) => {
  return (
    <div className="h-64 w-64">
      <Card className="flex h-full flex-col">
        <CardHeader className="relative h-1/2">
          <img
            src={article.cover_image}
            alt="Article's Cover"
            className="absolute inset-0 h-full w-full rounded-t-lg object-cover"
          />
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="istok-web-bold">{article.title}</CardTitle>
        </CardContent>
        <CardFooter className="mt-auto flex justify-center p-4">
          <a
            href={article.url}
            title={`Go to ${article.url.replace(/^https?:\/\//, "")}`}
            className="hover:text-blue-600"
          >
            <ExternalLink className="h-6 w-6" />
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

const LoadingAnimation = () => {
  const isLightMode = useLightMode();

  return (
    <div className="w-64">
      <div
        className={`rounded-md ${isLightMode ? "bg-[#E2E8F0]" : "bg-gray-900"} flex flex-col`}
      >
        <Skeleton className="mb-2 h-24 w-full rounded-b-none rounded-t-md" />
        <div className="ml-2">
          <Skeleton className="mb-2 h-6 w-[50%]" />
        </div>
        <Skeleton className="mb-2 h-6 w-6 self-center rounded-full" />
      </div>
    </div>
  );
};

export default function Articles({
  className,
}: Readonly<{ className: string }>) {
  const [articles, setArticles] = useState<(typeof Article)[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function getArticlesInformation() {
    const localStorageKey = "Articles";
    const storedArticles = localStorage.getItem(localStorageKey);

    try {
      if (storedArticles) {
        const articles = JSON.parse(storedArticles);

        setArticles(articles);
      } else {
        const repository = new DevCommunityAPIArticleRepository();
        const articlesInformation = await getUserArticlesUseCase(
          repository,
          Auth.username,
        );

        articlesInformation && setArticles(articlesInformation);
        localStorage.setItem(
          localStorageKey,
          JSON.stringify(articlesInformation),
        );
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching articles information:", error);

      setLoading(false);
    }
  }

  useEffect(() => {
    getArticlesInformation();
  }, []);

  return (
    <div className={`${className}`}>
      {loading ? (
        <LoadingAnimation />
      ) : (
        articles.map((article) => (
          <ArticleItem key={article.url} article={article} />
        ))
      )}
    </div>
  );
}
