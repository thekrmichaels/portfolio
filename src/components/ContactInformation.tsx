import { useEffect, useState } from "react";
import { Auth } from "../../BoundedContext/Users/Domain/User";
import getUserInformationUseCase from "../../BoundedContext/Users/Application/getUserInformationUseCase";
import GitHubAPIUserRepository from "../../BoundedContext/Users/Infrastructure/GitHubAPIUserRepository";
import { CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EnvelopeClosed, GitHubLogo } from "./icons";

const LoadingAnimation = () => {
  return (
    <div className="my-6 ml-6">
      <Skeleton className="mb-2 h-4 w-[250px]" />
      <Skeleton className="mb-2 h-4 w-[250px]" />
    </div>
  );
};

type Link = {
  text: string;
  href: string;
  icon: JSX.Element;
};

function createLinks(email: string, htmlUrl: string): Link[] {
  return [
    {
      text: email,
      href: `mailto:${email}`,
      icon: <EnvelopeClosed />,
    },
    {
      text: htmlUrl.replace(/^https?:\/\//, ""),
      href: htmlUrl,
      icon: <GitHubLogo className="" />,
    },
  ];
}

export default function ContactInformation({
  className,
}: Readonly<{
  className?: string;
}>) {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  function processContactInformation(contactInformation: {
    html_url: string;
    email: string;
  }) {
    const { email = "", html_url = "" } = contactInformation;
    const newLinks = createLinks(email, html_url);

    setLinks(newLinks);
    setLoading(false);
  }

  async function getContactInformation() {
    const localStorageKey = "ContactInformation";
    const storedContactInformation = localStorage.getItem(localStorageKey);

    try {
      if (storedContactInformation) {
        const contactInformation = JSON.parse(storedContactInformation);

        processContactInformation(contactInformation);
      } else {
        const repository = new GitHubAPIUserRepository();
        const contactInformation = await getUserInformationUseCase(
          repository,
          Auth.username,
        );

        if (contactInformation) {
          const { html_url, email } = contactInformation;

          processContactInformation({ html_url, email });
          localStorage.setItem(
            localStorageKey,
            JSON.stringify({ html_url, email }),
          );
        }
      }
    } catch (error) {
      console.error("Error fetching user information:", error);

      setLinks([]);
      setLoading(false);
    }
  }

  useEffect(() => {
    getContactInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${className}`}>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <ul className="my-2">
          {links.map((link) => (
            <li key={link.href} className="flex items-center">
              <a
                href={link.href}
                className="istok-web-regular group inline-block p-1 hover:text-blue-600 hover:underline"
              >
                <div className="flex items-center text-inherit group-hover:text-blue-600">
                  <div className="text-inherit">{link.icon}</div>
                  <span className="ml-2 text-inherit">
                    <CardDescription className="text-inherit">
                      {link.text}
                    </CardDescription>
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
