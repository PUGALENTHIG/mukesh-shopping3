import React from "react";
/* import { useSession } from "next-auth/react"; */
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "@nextui-org/react";
/* import Link from "next/link";
import { Avatar, Button } from "@nextui-org/react";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { api } from "@/utils/api"; */
import Post from "@/components/Post/Post";

type Post = {
  id: string;
  content: string;
  mediaUrls?: string[];
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  commentCount: number;
  author: {
    id: string;
    image: string | null;
    name: string | null;
    username: string | null;
  };
};

type PostsListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  fetchNewPosts: () => Promise<unknown>;
  posts?: Post[];
  clickable: boolean;
};

const PostsList = ({
  posts,
  isError,
  isLoading,
  fetchNewPosts,
  hasMore = false,
  clickable,
}: PostsListProps) => {
  if (isLoading) return <Spinner />;
  if (isError) return <h2>Error!</h2>;
  if (posts == null) return null;

  if (posts == null || posts.length === 0) {
    return <h2> No posts to show</h2>;
  }

  return (
    <>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchNewPosts}
        hasMore={hasMore}
        loader={<Spinner />}
      >
        {posts.map((post) => {
          return <Post key={post.id} {...post} clickable={clickable} />;
        })}
      </InfiniteScroll>
    </>
  );
};

export default PostsList;
