import React from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

import { Button } from "@nextui-org/react";
import {
  HomeIcon,
  UserIcon,
  BellIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import UserCard from "./UserCard";
import Logo from "../ui/Logo";

const LeftSidebar = () => {
  const session = useSession();
  const user = session.data?.user;

  const SidebarButtons = [
    { text: "Home", icon: <HomeIcon />, link: "/" },
    { text: "Messages", icon: <EnvelopeIcon />, link: "/messages" },
    { text: "Notifications", icon: <BellIcon />, link: "/notifications" },
    {
      text: "Profile",
      icon: <UserIcon />,
      link: user?.username ? `/user/${user.username}` : "/api/auth/signin",
    },
  ];

  return (
    <div
      className="sticky top-0 hidden h-full flex-col items-center
    p-2 sm:flex xl:w-[320px] xl:items-start"
    >
      <div
        className=" m-2 flex h-14 w-14
        items-center justify-center pl-8 xl:ml-4"
      >
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <div className="my-8 flex flex-col space-y-6 xl:ml-4">
        {SidebarButtons.map((SidebarButton, i) => (
          <Link replace key={i} href={SidebarButton.link}>
            <Button
              fullWidth
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
