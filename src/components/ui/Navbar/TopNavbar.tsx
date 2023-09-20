import { Avatar } from "@nextui-org/react";
import Image from "next/image";
import * as Tabs from "@radix-ui/react-tabs";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";

import Logo from "/public/echo.png";
import LogoWhite from "/public/echo-white.png";
import { debounce } from "@/utils/debounce";
import SearchBar from "../SearchBar/SearchBar";

type TopNavbarProps = {
  setTab: React.Dispatch<React.SetStateAction<string>>;
  nav: string;
};

const TopNavbar = ({ setTab, nav }: TopNavbarProps) => {
  const { resolvedTheme } = useTheme();
  const session = useSession();
  const user = session.data?.user;

  let src;

  switch (resolvedTheme) {
    case "dark":
      src = LogoWhite;
      break;
    case "light":
      src = Logo;
      break;
    default:
      src = LogoWhite;
      break;
  }

  const [prevScrollPos, setPrevScrollPos] = React.useState(0);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const handleScroll = debounce(() => {
      const currentScrollPos = window.scrollY;

      setVisible(
        (prevScrollPos > currentScrollPos &&
          prevScrollPos - currentScrollPos > 50) ||
          currentScrollPos < 10,
      );

      setPrevScrollPos(currentScrollPos);
    }, 100);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible]);

  return (
    <nav
      className={`sticky ${
        !visible && "-translate-y-40"
      } top-0 z-50 flex w-full flex-col border-y bg-background bg-opacity-50 backdrop-blur-xl transition-transform duration-200`}
    >
      <h1 className=" hidden px-4 py-3 text-2xl font-bold md:block">Home</h1>
      <div className="mb-1 flex flex-row px-3 pb-1 pt-3 md:hidden">
        <Avatar
          className="absolute"
          radius="full"
          size="sm"
          src={user?.image ?? ""}
        />
        <div className="flex w-full justify-center">
          {nav === "search" ? (
            <SearchBar />
          ) : (
            <Link href="/">
              <Image alt="branding" src={src} width={30} />
            </Link>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <Tabs.Root
          className="w-full"
          defaultValue="recent"
          onValueChange={(value) => setTab(value)}
        >
          <Tabs.List className="flex shrink-0 ">
            <Tabs.Trigger
              className=" flex h-[45px] flex-1 select-none items-center justify-center transition-all duration-100 data-[state=active]:border-b-5 data-[state=active]:border-violet-500"
              value="recent"
            >
              Recent
            </Tabs.Trigger>
            <Tabs.Trigger
              className=" flex h-[45px] flex-1 select-none items-center justify-center transition-all duration-100 data-[state=active]:border-b-4 data-[state=active]:border-violet-500 "
              value="following"
            >
              Following
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </div>
    </nav>
  );
};

export default TopNavbar;
