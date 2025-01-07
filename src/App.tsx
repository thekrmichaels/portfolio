import { useEffect, useState } from "react";
import {
  Auth,
  User,
  getUser,
  UserAPIRepository,
} from "../BoundedContext/Users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContactInformation from "@/components/ContactInformation";
import Articles from "@/components/Articles";
import Repos from "@/components/Repos";
import TemporaryLocalStorage from "./Shared/TemporaryLocalStorage";
import useLightMode from "./hooks/useLightMode";

function App() {
  const isLightMode = useLightMode();
  const lightModeTextColor = "text-[#4B4B4B]";

  return (
    <div className="flex min-h-screen justify-center items-center">
      <Card className="relative flex w-full flex-col border border-none">
        <Header className="flex items-center" />
        <Content className="flex-1">
          <Tabs defaultValue="projects" className="w-full">
            <div className="flex justify-center">
              <TabsList className="inline-flex justify-center">
                <TabsTrigger
                  value="articles"
                  className={`istok-web-bold ${
                    isLightMode && lightModeTextColor
                  }`}
                >
                  Articles
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className={`istok-web-bold ${
                    isLightMode && lightModeTextColor
                  }`}
                >
                  Projects
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="articles">
              <Articles className="flex flex-wrap justify-center gap-2" />
            </TabsContent>
            <TabsContent value="projects">
              <Repos className="flex flex-wrap justify-center gap-2" />
            </TabsContent>
          </Tabs>
        </Content>
        <Footer className="flex justify-center" />
      </Card>
    </div>
  );
}

const Header = ({ className }: Readonly<{ className: string }>) => {
  const [user, setUser] = useState<{ avatar_url: string; name: string } | null>(
    null
  );

  useEffect(() => {
    (async function getUserInformation() {
      const localStorageKey = "User";
      const storedUser =
        TemporaryLocalStorage.getItemTemporarily<typeof User>(localStorageKey);

      try {
        if (storedUser) {
          setUser(storedUser);
        } else {
          const repository = new UserAPIRepository();
          const userInformation = await getUser(repository, Auth.username[0]);

          if (userInformation) {
            const { avatar_url, name } = userInformation;

            setUser({ avatar_url, name });
            TemporaryLocalStorage.setItemTemporarily(localStorageKey, {
              avatar_url,
              name,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    })();
  }, []);

  function getInitials(name: string) {
    const fullName = name.split(" ");
    const initials = fullName.map((name) => name.charAt(0));

    return initials.join("");
  }

  return (
    <CardHeader className={`${className}`}>
      {user && (
        <Avatar>
          <AvatarImage src={user.avatar_url} alt="Profile Photo" />
          <AvatarFallback>
            {getInitials(user?.name || User.name)}
          </AvatarFallback>
        </Avatar>
      )}
      <CardTitle className="istok-web-bold">
        {user ? user.name : User.name}
      </CardTitle>
      <ContactInformation className="mt-4" />
    </CardHeader>
  );
};

const Content = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => {
  return <CardContent className={`${className}`}>{children}</CardContent>;
};

const Footer = ({ className }: Readonly<{ className: string }>) => {
  return (
    <CardFooter className={`${className}`}>
      <ContactInformation />
    </CardFooter>
  );
};

export default App;
