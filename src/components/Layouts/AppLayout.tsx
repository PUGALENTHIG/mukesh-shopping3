import React, { type PropsWithChildren } from "react";

import LeftSidebar from "@/components/Sidebar/LeftSidebar";
import RightSidebar from "../Sidebar/RightSidebar";

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="container mx-auto flex flex-row items-start">
      <LeftSidebar />
      <div className="min-h-screen flex-grow border-x">{children}</div>
      <RightSidebar />
    </div>
  );
};

export default AppLayout;
