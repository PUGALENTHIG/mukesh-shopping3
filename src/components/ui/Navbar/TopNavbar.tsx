import { Avatar } from "@nextui-org/react";
import * as Tabs from "@radix-ui/react-tabs";
import { useSession } from "next-auth/react";

import Link from "next/link";
import React from "react";

import { debounce } from "@/utils/debounce";
import SearchBar from "../SearchBar/SearchBar";
import Logo from "../Logo";

type TopNavbarProps = {
  setTab: React.Dispatch<React.SetStateAction<string>>;
  nav: string;
};

const TopNavbar = ({ setTab, nav }: TopNavbarProps) => {
  const session = useSession();
  const user = session.data?.user;

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
        !visible && "-translate-y-40 md:translate-y-0"
      } top-0 z-50 flex w-full flex-col border-y  transition-transform duration-200`}
    >
      <div className="glass border-b">
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
                <Logo width={32} />
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
                className=" flex h-[45px] flex-1 select-none items-center justify-center transition-all duration-100 data-[state=active]:border-b-5 data-[state=active]:border-violet-500 data-[state=active]:font-bold"
                value="recent"
              >
                Recent
              </Tabs.Trigger>
              <Tabs.Trigger
                className=" flex h-[45px] flex-1 select-none items-center justify-center transition-all duration-100 data-[state=active]:border-b-4 data-[state=active]:border-violet-500 data-[state=active]:font-bold"
                value="following"
              >
                Following
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
