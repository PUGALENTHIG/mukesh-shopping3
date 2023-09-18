import React, { type PropsWithChildren } from "react";
import { useSession } from "next-auth/react";

import LeftSidebar from "@/components/Sidebar/LeftSidebar";
import RightSidebar from "../Sidebar/RightSidebar";
import EditProfileModal from "@/components/ui/Modal/EditProfileModal";

const AppLayout = ({ children }: PropsWithChildren) => {
  const session = useSession();
  const [editProfileModal, setEditProfileModal] =
    React.useState<boolean>(false);
  const user = session.data?.user;

  React.useEffect(() => {
    const hasMissingInfo =
      (session.status === "authenticated" &&
        user &&
        user.username === undefined) ??
      user?.email === undefined ??
      user?.name === undefined;

    if (hasMissingInfo) {
      setEditProfileModal(true);
    }
  }, [session.status, user]);

  return (
    <div className="container mx-auto flex flex-row items-start">
      <LeftSidebar />
      <div className="min-h-screen max-w-[100vw] flex-grow border-x">
        {editProfileModal && (
          <EditProfileModal
            activity="complete"
            {...user}
            isOpen={editProfileModal}
          />
        )}
        {children}
      </div>
      <RightSidebar />
    </div>
  );
};

export default AppLayout;
