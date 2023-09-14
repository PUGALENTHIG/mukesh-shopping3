import React from "react";
import SearchBar from "@/components/ui/SearchBar/SearchBar";

const RightSidebar = () => {
  return (
    <div
      className="sticky top-0 hidden h-full flex-col items-center
    p-2 sm:flex xl:w-[320px] xl:items-end"
    >
      <div className="my-4 w-full">
        <SearchBar />
      </div>
    </div>
  );
};

export default RightSidebar;
