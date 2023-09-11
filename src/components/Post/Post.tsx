import React from "react";
import Link from "next/link";
import LikeButton from "./LikeButton";
import { api } from "@/utils/api";
import { Avatar } from "@nextui-org/react";
import { timeAgo } from "@/utils/dateFormat";

type PostProps = {
  id: string;
  author: {
    id: string;
    image: string | null;
    name: string | null;
    username: string | null;
  };
  content: string;
  mediaUrls?: string[];
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
};

function Post({
  id,
  author,
  content,
  createdAt,
  likeCount,
  likedByMe,
}: PostProps) {
  const trpcUtils = api.useContext();
  const toggleLike = api.post.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      const updateData: Parameters<
        typeof trpcUtils.post.feed.setInfiniteData
      >[1] = (oldData) => {
        if (oldData == null) return;

        const countModifier = addedLike ? 1 : -1;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              posts: page.posts.map((post) => {
                if (post.id === id) {
                  return {
                    ...post,
                    likeCount: post.likeCount + countModifier,
                    likedByMe: addedLike,
                  };
                }

                return post;
              }),
            };
          }),
        };
      };

      trpcUtils.post.feed.setInfiniteData({}, updateData);
      trpcUtils.post.feed.setInfiniteData({ onlyFollowing: true }, updateData);
    },
  });

  const handleToggleLike = () => {
    try {
      toggleLike.mutate({ id });
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div className="flex cursor-pointer flex-row border-b p-4">
      <div className="h-full pr-4">
        <Link href={`/${author.username}`}>
          <Avatar src={author.image ?? ""} />
        </Link>
      </div>
      <div className="flex flex-grow flex-col">
        <div className="flex flex-row gap-1">
          <Link href={`/${author.username}`}>
            <span className=" font-bold outline-none hover:underline">
              {author.name}
            </span>
          </Link>
          <span className="px-[2px]">@{author.username}</span>
          <span>·</span>
          <span>{timeAgo(createdAt)}</span>
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
}

export default Post;
