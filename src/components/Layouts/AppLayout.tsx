import React, { type PropsWithChildren } from "react";
import { useSession } from "next-auth/react";

import LeftSidebar from "@/components/Sidebar/LeftSidebar";
import RightSidebar from "../Sidebar/RightSidebar";
import EditProfileModal from "@/components/ui/Modal/EditProfileModal";
import { useDisclosure } from "@nextui-org/react";

const AppLayout = ({ children }: PropsWithChildren) => {
  const session = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const user = session.data?.user;

  React.useEffect(() => {
    const hasMissingInfo =
      (session.status === "authenticated" &&
        user &&
        user.username === undefined) ??
      user?.email === undefined ??
      user?.name === undefined;

    if (hasMissingInfo) {
      onOpen();
    }
  }, [session.status, user, onOpen]);

  return (
    <div className="container mx-auto flex flex-row items-start">
      <LeftSidebar />
      <div className="min-h-screen max-w-[100vw] flex-grow border-x">
        <EditProfileModal
          activity="complete"
          {...user}
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
        />

        {children}
      </div>
      <RightSidebar />
    </div>
  );
};

export default AppLayout;
