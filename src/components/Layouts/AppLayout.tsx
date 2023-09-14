import React, { type PropsWithChildren } from "react";
import { useSession } from "next-auth/react";

import LeftSidebar from "@/components/Sidebar/LeftSidebar";
import RightSidebar from "../Sidebar/RightSidebar";
import WelcomeModal from "@/components/ui/Modal/WelcomeModal";

const AppLayout = ({ children }: PropsWithChildren) => {
  const session = useSession();
  const [welcomeModal, setWelcomeModal] = React.useState<boolean>(false);
  const user = session.data?.user;

  React.useEffect(() => {
    const hasMissingInfo =
      (session.status === "authenticated" &&
        user &&
        user.username === undefined) ??
      user?.email === undefined ??
      user?.name === undefined;

    if (hasMissingInfo) {
      setWelcomeModal(true);
    }
  }, [session.status, user]);

  return (
    <div className="container mx-auto flex flex-row items-start">
      <LeftSidebar />
      <div className="min-h-screen flex-grow border-x">
        {welcomeModal && <WelcomeModal {...user} isOpen={welcomeModal} />}
        {children}
      </div>
      <RightSidebar />
    </div>
  );
};

export default AppLayout;
