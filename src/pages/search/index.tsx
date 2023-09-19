import React from "react";
import Head from "next/head";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import PostsList from "@/components/PostsList/PostsList";

const SearchResult = () => {
  const router = useRouter();
  const term = router.query.term as string;
  const searchResults = api.post.searchPosts.useInfiniteQuery({
    searchTerm: term,
  });

  return (
    <div>
      <Head>
        <title>{term ? term + ` - Echo` : "Echo"}</title>
      </Head>
      <nav className="sticky top-0 z-50 flex w-full flex-row items-center border-y backdrop-blur-xl">
        <Link href="..">
          <Button variant="light" radius="full" isIconOnly>
            <ArrowLeftIcon width={20} />
          </Button>
        </Link>
        <div className="w-full py-3 pl-4 text-lg">
          Search results for: {term}
        </div>
      </nav>
      <PostsList
        posts={searchResults.data?.pages.flatMap((page) => page.posts)}
        isError={searchResults.isError}
        isLoading={searchResults.isLoading}
        hasMore={searchResults.hasNextPage ?? false}
        fetchNewPosts={searchResults.fetchNextPage}
        clickable={true}
      />
    </div>
  );
};

export default SearchResult;
