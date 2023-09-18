import React from "react";
import { api } from "@/utils/api";
import CreatePost from "@/components/Post/CreatePost";
import PostsList from "@/components/PostsList/PostsList";
import TopNavbar from "@/components/ui/Navbar/TopNavbar";
import { BottomNavbar } from "@/components/ui/Navbar/BottomNavbar";

export default function Home() {
  const [tab, setTab] = React.useState<string>("recent");
  const [nav, setNav] = React.useState<string>("home");
  return (
    <>
      <main className="flex w-full flex-col items-center justify-center">
        <TopNavbar nav={nav} setTab={setTab} />
        <CreatePost />
        {tab === "recent" ? <RecentPosts /> : <FollowingPosts />}
        <BottomNavbar nav={nav} setNav={setNav} />
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
      clickable={true}
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
      clickable={true}
    />
  );
}
