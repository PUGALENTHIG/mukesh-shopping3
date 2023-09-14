"use client";
import React from "react";
import { useTheme } from "next-themes";
import { Button } from "@nextui-org/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      {theme === "dark" ? (
        <Button
          variant="light"
          aria-label="light-mode"
          type="button"
          fullWidth
          onClick={() => setTheme("light")}
          endContent={<SunIcon width={24} />}
        >
          Toggle Theme
        </Button>
      ) : (
        <Button
          variant="light"
          aria-label="dark-mode"
          type="button"
          fullWidth
          onClick={() => setTheme("dark")}
          endContent={<MoonIcon width={24} />}
        >
          Toggle Theme
        </Button>
      )}
    </div>
  );
};
