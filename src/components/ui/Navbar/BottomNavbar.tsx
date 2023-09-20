import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { debounce } from "@/utils/debounce";

import {
  HomeIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useSession, signOut, signIn } from "next-auth/react";

type BottomNavbarProps = {
  nav: string;
  setNav: React.Dispatch<React.SetStateAction<string>>;
};

export const BottomNavbar = ({ /* nav, */ setNav }: BottomNavbarProps) => {
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;
  const [prevScrollPos, setPrevScrollPos] = React.useState(0);
  const [visible, setVisible] = React.useState(true);

  const BottomNavButtons = [
    { value: "home", icon: <HomeIcon />, onclick: () => router.push("/") },
    {
      value: "profile",
      icon: <UserIcon />,
      onclick: () => (user ? router.push(`/user/${user?.username}`) : signIn()),
    },
    { value: "search", icon: <MagnifyingGlassIcon /> },
    {
      value: "logout",
      icon: user ? <ArrowLeftOnRectangleIcon /> : <ArrowRightOnRectangleIcon />,
      onclick: () => (user ? signOut() : signIn()),
    },
  ];

  React.useEffect(() => {
    const handleScroll = debounce(() => {
      const currentScrollPos = window.scrollY;

      setVisible(
        (prevScrollPos > currentScrollPos &&
          prevScrollPos - currentScrollPos > 50) ||
          currentScrollPos < 10,
      );

      setPrevScrollPos(currentScrollPos);
    }, 200);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible]);
  return (
    <nav
      className={`sticky md:hidden ${
        !visible && "translate-y-40"
      } bottom-0 z-50 flex w-full flex-col border-y bg-background px-1 py-2 transition-transform duration-200`}
    >
      <Tabs.Root
        className="w-full"
        defaultValue="recent"
        onValueChange={(value) => setNav(value)}
      >
        <Tabs.List className="flex shrink-0 ">
          {BottomNavButtons.map((button, i) => {
            return (
              <Tabs.Trigger
                className=" flex w-full flex-1 select-none items-center justify-center transition-all duration-100 data-[state=active]:text-violet-500"
                value={button.value}
                key={i}
                onClick={button.onclick}
              >
                <div className="w-6">{button.icon}</div>
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>
      </Tabs.Root>
    </nav>
  );
};
