import React from "react";
import LikeButton from "@/components/ui/Button/LikeButton";
import CommentButton from "@/components/ui/Button/CommentButton";
import { Avatar } from "@nextui-org/react";
import Link from "next/link";
import { timeAgo } from "@/utils/dateFormat";
import MasonryGrid from "../MasonryGrid/MasonryGrid";
import EchoButton from "../ui/Button/EchoButton";

type CommentProps = {
  createdAt: Date;
  content: string;
  mediaUrls?: string[];
  author: {
    id: string;
    image: string | null;
    name: string | null;
    username: string | null;
  };
};

const Comment = ({
  /* mediaUrls,  */
  createdAt,
  author,
  content,
  mediaUrls,
}: CommentProps) => {
  return (
    <div className="border-b p-4">
      <div className={`flex cursor-default`}>
        <div className="z-10 flex h-full flex-col pr-4">
          <Link href={`/${author.username}`}>
            <Avatar src={author.image ?? ""} />
          </Link>
        </div>
        <div className="flex flex-grow flex-col">
          <div className="flex flex-row gap-1">
            <Link href={`/${author.username}`}>
              <span className="font-bold outline-none hover:underline">
                {author.name}
              </span>
            </Link>
            <span className="px-1 text-gray-400">@{author.username}</span>
            <span className=" text-gray-400">·</span>
            <span className="px-1 text-gray-400">{timeAgo(createdAt)}</span>
          </div>
          <p className="whitespace-pre-wrap py-2">{content}</p>
          <MasonryGrid
            mediaUrls={mediaUrls ?? []}
            setMediaUrls={() => undefined}
            showClose={false}
          />
        </div>
      </div>
      <div className="ml-14 flex flex-row  justify-start gap-20 px-2 pt-3">
        <LikeButton onClick={() => null} likedByMe={false} likeCount={0} />
        <CommentButton onClick={() => null} commentCount={0} />
        <EchoButton onClick={() => null} EchoCount={0} />
      </div>
    </div>
  );
};

export default Comment;
