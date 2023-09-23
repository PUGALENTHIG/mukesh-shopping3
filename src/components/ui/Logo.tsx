import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import LogoDark from "/public/echo.png";
import LogoWhite from "/public/echo-white.png";

type LogoProps = {
  width: number;
  height?: number;
};

const Logo = ({ width, height = width }: LogoProps) => {
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
      <Image alt="branding" src={src} width={width} height={height} />
    </div>
  );
};

export default Logo;
