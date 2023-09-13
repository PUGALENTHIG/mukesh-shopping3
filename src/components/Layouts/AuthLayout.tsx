import React, { type PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return <div className="h-screen">{children}</div>;
};

export default AuthLayout;
