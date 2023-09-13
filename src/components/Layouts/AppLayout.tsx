import React, { type PropsWithChildren } from "react";

import LeftSidebar from "@/components/Sidebar/LeftSidebar";

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="container mx-auto flex items-start">
      <LeftSidebar />
      <div className="min-h-screen flex-grow border-x">{children}</div>
    </div>
  );
};

export default AppLayout;
