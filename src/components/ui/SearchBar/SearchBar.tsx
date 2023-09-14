import React from "react";
import { Input } from "@nextui-org/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

const SearchBar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    router.push(`/search?term=${searchTerm}`).catch((error) => {
      console.error("Error navigating to search page:", error);
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input
          fullWidth
          placeholder="Search..."
          className="ml-4"
          type="search"
          autoComplete="off"
          startContent={<MagnifyingGlassIcon width={20} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
    </>
  );
};

export default SearchBar;
