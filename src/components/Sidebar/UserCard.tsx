import React from "react";
import { signOut } from "next-auth/react";
import { Card, CardHeader, Avatar, Button } from "@nextui-org/react";
import {
  EllipsisHorizontalIcon,
  ArrowLeftOnRectangleIcon,
  WrenchIcon,
} from "@heroicons/react/24/solid";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { ThemeSwitcher } from "../ThemeSwitcher";

interface User {
  id: string;
  name?: string | null;
  username?: string | null;
  email?: string | null;
  image?: string | null;
}

const UserCard = ({ user }: { user: User }) => {
  return (
    <Dropdown>
      <Card className="flex px-1">
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            <Avatar radius="full" size="md" src={user.image ?? ""} />
            <div className="flex flex-col items-start justify-center gap-1">
              <h4 className="text-small font-semibold leading-none text-default-600">
                {user.name}
              </h4>
              <h5 className="text-small tracking-tight text-default-400">
                {user.username ?? "username"}
              </h5>
            </div>
          </div>
          <DropdownTrigger>
            <EllipsisHorizontalIcon className="ml-6 h-6 w-6" />
          </DropdownTrigger>
        </CardHeader>
      </Card>
      <DropdownMenu className="flex text-center" aria-label="Static Actions">
        <DropdownItem key="logout">
          <Button
            variant="light"
            onClick={() => void signOut()}
            endContent={<ArrowLeftOnRectangleIcon width={24} />}
          >
            Logout<b>{user.name}</b>
          </Button>
        </DropdownItem>
        <DropdownItem className="" key="preferences">
          <Button
            variant="light"
            fullWidth
            onClick={() => void signOut()}
            endContent={<WrenchIcon width={24} />}
          >
            Preferences
          </Button>
        </DropdownItem>
        <DropdownItem key="theme-toggle">
          <ThemeSwitcher />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserCard;
