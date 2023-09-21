import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import LogoDark from "/public/echo.png";
import LogoWhite from "/public/echo-white.png";

const Logo = () => {
  const { resolvedTheme } = useTheme();
  let src;

  switch (resolvedTheme) {
    case "dark":
      src = LogoWhite;
      break;
    case "light":
      src = LogoDark;
      break;
    default:
      src = LogoWhite;
      break;
  }

  return (
    <div>
      <Image alt="branding" src={src} width={40} height={40} />
    </div>
  );
};

export default Logo;
