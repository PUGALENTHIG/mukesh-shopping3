import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import Link from "next/link";
import Image from "next/image";

import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import {
  HomeIcon,
  UserIcon,
  BellIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Logo from "/public/echo.png";
import LogoWhite from "/public/echo-white.png";
import UserCard from "./UserCard";

const LeftSidebar = () => {
  const session = useSession();
  const user = session.data?.user;
  const { resolvedTheme } = useTheme();
  let LogoSrc;

  switch (resolvedTheme) {
    case "light":
      LogoSrc = Logo;
      break;
    case "dark":
      LogoSrc = LogoWhite;
      break;
    default:
      LogoSrc = LogoWhite;
      break;
  }

  const SidebarButtons = [
    { text: "Home", icon: <HomeIcon />, link: "/" },
    { text: "Messages", icon: <EnvelopeIcon />, link: "/messages" },
    { text: "Notifications", icon: <BellIcon />, link: "/notifications" },
    {
      text: "Profile",
      icon: <UserIcon />,
      link: `/${user?.username ?? "auth/login"}`,
    },
  ];

  return (
    <div
      className="sticky top-0 hidden h-full flex-col items-center
    p-2 sm:flex xl:w-[320px] xl:items-start"
    >
      <div
        className=" flex h-14 w-14 items-center
        justify-center p-0 xl:ml-4"
      >
        <Link href="/">
          <Image alt="branding" src={LogoSrc} width={30} height={30} />
        </Link>
      </div>
      <div className="my-8 flex flex-col space-y-6 xl:ml-4">
        {SidebarButtons.map((SidebarButton, i) => (
          <Link replace key={i} href={SidebarButton.link}>
            <Button
              variant="light"
              className="flex justify-start px-8 py-6"
              startContent={
                <div className="mr-3 h-8 w-8">{SidebarButton.icon}</div>
              }
            >
              {SidebarButton.text}
            </Button>
          </Link>
        ))}

        {user != null ? (
          <UserCard user={user} />
        ) : (
          <Button
            onClick={() => void signIn()}
            variant="light"
            className="flex justify-start px-8 py-6"
            startContent={
              <div className="mr-3 h-8 w-8 ">
                <ArrowRightOnRectangleIcon />
              </div>
            }
          >
            Sign-In
          </Button>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
