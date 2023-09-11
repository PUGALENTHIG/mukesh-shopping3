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
};

const PostsList = ({
  posts,
  isError,
  isLoading,
  fetchNewPosts,
  hasMore = false,
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
          return <Post key={post.id} {...post} />;
        })}
      </InfiniteScroll>
    </>
  );
};

/* function Post({ id, author, content, createdAt, likeCount, likedByMe }: Post) {
  const toggleLike = api.post.toggleLike.useMutation();

  function handleToggleLike() {
    toggleLike.mutate({ id });
  }

  return (
    <div className="flex cursor-pointer flex-row border-b p-4">
      <div className="h-full  pr-4">
        <Link href={`/${author.name}`}>
          <Avatar src={author.image ?? ""} />
        </Link>
      </div>
      <div className="flex flex-grow flex-col">
        <div className="flex flex-row gap-1">
          <Link href={`/${author.name}`}>
            <span className="font-bold outline-none hover:underline">
              {author.name}
            </span>
          </Link>
          <span>{author.username}</span>
          <span>·</span>
          <span>{JSON.stringify(createdAt)}</span>
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
        <div className="flex flex-row pt-3">
          <LikeButton
            onClick={handleToggleLike}
            likedByMe={likedByMe}
            likeCount={likeCount}
          />
        </div>
      </div>
    </div>
  );
} */

/* type LikeButtonProps = {
  onClick: () => void;
  likedByMe: boolean;
  likeCount: number;
}; */

/* function LikeButton({ onClick, likedByMe, likeCount }: LikeButtonProps) {
  const session = useSession();
  const LikeIcon = likedByMe ? HeartSolid : HeartOutline;

  if (session.status !== "authenticated") {
    return (
      <div className="m-1 flex items-center gap-3 self-start text-gray-500">
        <LikeIcon />
        <span>{likeCount}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-1">
      <button
        onClick={onClick}
        className={`flex flex-row items-center transition-colors duration-75 ${
          likedByMe
            ? "text-red-500"
            : "text-gray-500 hover:text-red-500 focus-visible:text-red-500"
        }`}
      >
        <LikeIcon
          className={`mr-2 w-5 transition-colors duration-75 ${
            likedByMe
              ? "fill-red-500"
              : " group-hover:text-red-500 group-focus-visible:fill-red-500"
          }`}
        />
        <span>{likeCount}</span>
      </button>
    </div>
  );
} */

export default PostsList;
