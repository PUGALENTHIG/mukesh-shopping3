import React from "react";
import SearchBar from "@/components/ui/SearchBar/SearchBar";

const RightSidebar = () => {
  return (
    <div
      className="sticky top-0 hidden h-full flex-col items-start
    p-2 sm:flex xl:w-[320px] xl:items-start"
    >
      <div className="my-4 w-max">
        <SearchBar />
      </div>
    </div>
  );
};

export default RightSidebar;
