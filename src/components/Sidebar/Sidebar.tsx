import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import Link from "next/link";
import Image from "next/image";

import { Button } from "@nextui-org/react";
import {
  HomeIcon,
  UserIcon,
  BellIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import UserCard from "./UserCard";

const Sidebar = () => {
  const session = useSession();
  const user = session.data?.user;

  const SidebarButtons = [
    { text: "Home", icon: <HomeIcon />, link: "/" },
    { text: "Messages", icon: <EnvelopeIcon />, link: "/messages" },
    { text: "Notifications", icon: <BellIcon />, link: "/notifications" },
    {
      text: "Profile",
      icon: <UserIcon />,
      link: `/${user?.username ?? "login"}`,
    },
  ];

  return (
    <div
      className="sticky top-0 hidden h-full flex-col items-center
    p-2 sm:flex xl:w-[300px] xl:items-start"
    >
      <div
        className="hoverAnimation flex h-14 w-14 items-center
        justify-center p-0 xl:ml-4"
      >
        <Link href="/">
          <Image alt="branding" src="/echo.png" width={30} height={30} />
        </Link>
      </div>
      <div className="my-8 flex flex-col space-y-6 xl:ml-4">
        {SidebarButtons.map((SidebarButton, i) => (
          <Link key={i} href={SidebarButton.link}>
            <Button
              variant="light"
              className="flex justify-start"
              startContent={
                <div className="mr-3 h-8 w-8">{SidebarButton.icon}</div>
              }
            >
              {SidebarButton.text}
            </Button>
          </Link>
        ))}
        <Button
          aria-label="Write a post"
          className="hidden p-2
       xl:block"
        >
          Post
        </Button>
        {user != null ? (
          <UserCard user={user} />
        ) : (
          <Button
            onClick={() => void signIn()}
            variant="light"
            className="flex justify-start"
            startContent={
              <div className="h-8 w-8">
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

export default Sidebar;
