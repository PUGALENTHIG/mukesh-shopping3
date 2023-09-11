import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import * as Tabs from "@radix-ui/react-tabs";

import { api } from "@/utils/api";
import CreatePost from "@/components/CreatePost/CreatePost";
import PostsList from "@/components/PostsList/PostsList";

export default function Home() {
  /* const hello = api.example.hello.useQuery({ text: "from tRPC" }); */
  const [tab, setTab] = React.useState("recent");
  return (
    <>
      <main className="flex flex-col items-center justify-center">
        <header className="flex w-full flex-col border-y">
          <h1 className=" px-4 py-4 text-2xl font-bold">Home</h1>
          <div className="flex justify-center">
            <Tabs.Root
              className="w-full"
              defaultValue="recent"
              onValueChange={(value) => setTab(value)}
            >
              <Tabs.List className="flex shrink-0 ">
                <Tabs.Trigger
                  className=" flex h-[45px] flex-1 select-none items-center justify-center border-black transition-all duration-100 data-[state=active]:border-b-4"
                  value="recent"
                >
                  Recent
                </Tabs.Trigger>
                <Tabs.Trigger
                  className=" flex h-[45px] flex-1 select-none items-center justify-center border-black transition-all duration-100 data-[state=active]:border-b-4 "
                  value="following"
                >
                  Following
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </div>
        </header>
        <CreatePost />

        {tab === "recent" ? <RecentPosts /> : <FollowingPosts />}
      </main>
    </>
  );
}

function RecentPosts() {
  const feed = api.post.feed.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  return (
    <PostsList
      posts={feed.data?.pages.flatMap((page) => page.posts)}
      isLoading={feed.isLoading}
      isError={feed.isError}
      hasMore={feed.hasNextPage ?? false}
      fetchNewPosts={feed.fetchNextPage}
    />
  );
}

function FollowingPosts() {
  const feed = api.post.feed.useInfiniteQuery(
    { onlyFollowing: true },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  return (
    <PostsList
      posts={feed.data?.pages.flatMap((page) => page.posts)}
      isLoading={feed.isLoading}
      isError={feed.isError}
      hasMore={feed.hasNextPage ?? false}
      fetchNewPosts={feed.fetchNextPage}
    />
  );
}
