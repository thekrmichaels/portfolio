import { JSX, useEffect, useState } from "react";
import {
  Auth,
  User,
  getUser,
  UserAPIRepository,
} from "../../BoundedContext/Users";
import { CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EnvelopeClosed, GitHubLogo } from "./icons";
import TemporaryLocalStorage from "../Shared/TemporaryLocalStorage";

type Link = {
  text: string;
  href: string;
  icon: JSX.Element;
};

export default function ContactInformation({
  className,
}: Readonly<{
  className?: string;
}>) {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function getContactInformation() {
      const localStorageKey = "ContactInformation";
      const storedContactInformation =
        TemporaryLocalStorage.getItemTemporarily<typeof User>(localStorageKey);

      try {
        if (storedContactInformation) {
          processContactInformation(storedContactInformation);
        } else {
          const repository = new UserAPIRepository();
          const contactInformation = await getUser(
            repository,
            Auth.username[0]
          );

          if (contactInformation) {
            const { html_url, email } = contactInformation;

            processContactInformation({ html_url, email });
            TemporaryLocalStorage.setItemTemporarily(localStorageKey, {
              html_url,
              email,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user information:", error);

        setLinks([]);
        setLoading(false);
      }
    })();
  }, []);

  function processContactInformation(contactInformation: {
    html_url: string;
    email: string;
  }) {
    const { email = "", html_url = "" } = contactInformation;
    const newLinks = createLinks(email, html_url);

    setLinks(newLinks);
    setLoading(false);
  }

  return (
    <div className={`${className}`}>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <ul className="my-2">
          {links.map(({ text, href, icon }) => (
            <li key={href} className="flex items-center">
              <a
                href={href}
                className="istok-web-regular group inline-block p-1 hover:text-blue-600 hover:underline"
              >
                <div className="flex items-center text-inherit group-hover:text-blue-600">
                  <div className="text-inherit">{icon}</div>
                  <span className="ml-2 text-inherit">
                    <CardDescription className="text-inherit">
                      {text}
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

const LoadingAnimation = () => {
  return (
    <div className="my-6 ml-6">
      <Skeleton className="mb-2 h-4 w-[250px]" />
      <Skeleton className="mb-2 h-4 w-[250px]" />
    </div>
  );
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
