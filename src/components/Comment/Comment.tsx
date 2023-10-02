import React from "react";
import LikeButton from "@/components/ui/Button/LikeButton";
import CommentButton from "@/components/ui/Button/CommentButton";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import Link from "next/link";
import { timeAgo } from "@/utils/dateFormat";
import MasonryGrid from "../MasonryGrid/MasonryGrid";
import EchoButton from "../ui/Button/EchoButton";
import LinkRenderer from "@/utils/LinkRenderer";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { TrashIcon, FlagIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

type CommentProps = {
  id: string;
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
  id,
  createdAt,
  author,
  content,
  mediaUrls,
}: CommentProps) => {
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;

  const deleteComment = api.post.deleteComment.useMutation();

  const handleCommentDelete = () => {
    if (author.id === user?.id && session.status === "authenticated") {
      deleteComment.mutate({ postId: id });
      router.reload();
    }
  };

  return (
    <div className="border-b  px-2 py-4 lg:px-6">
      <div className={`flex`}>
        <div className="z-10 flex h-full flex-col pr-[10px] md:pr-3 lg:pr-4">
          <Link
            onClick={(e) => e.stopPropagation()}
            href={`/user/${author.username}`}
          >
            <Avatar src={author.image ?? ""} />
          </Link>
        </div>
        <div className="flex flex-grow flex-col">
          <div className="flex flex-row justify-between gap-1">
            <div>
              <Link
                onClick={(e) => e.stopPropagation()}
                href={`/user/${author.username}`}
              >
                <span className="font-bold outline-none hover:underline">
                  {author.name}
                </span>
              </Link>
              <span className="px-1 text-gray-400">@{author.username}</span>
              <span className=" text-gray-400">·</span>
              <span className="px-1 text-gray-400">{timeAgo(createdAt)}</span>
            </div>
            <div>
              <Dropdown className="elevation-1 z-10">
                <DropdownTrigger>
                  <EllipsisHorizontalIcon className="w-5" />
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  {author.id === user?.id &&
                  session.status === "authenticated" ? (
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      startContent={<TrashIcon className="w-4" />}
                      onClick={handleCommentDelete}
                    >
                      Delete Comment
                    </DropdownItem>
                  ) : (
                    <DropdownItem startContent={<FlagIcon className="w-5" />}>
                      Report Comment
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <LinkRenderer
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              e.stopPropagation()
            }
            className="text-base font-semibold text-violet-500 hover:underline md:text-lg"
            text={content}
          />
          <MasonryGrid
            mediaUrls={mediaUrls ?? []}
            setMediaUrls={() => undefined}
            showClose={false}
          />
        </div>
      </div>
      <div className="z-10 mx-2 ml-14 flex flex-row justify-start gap-6 md:gap-10 lg:gap-20">
        <LikeButton onClick={() => null} likedByMe={false} likeCount={0} />
        <CommentButton onClick={() => null} commentCount={0} />
        <EchoButton EchoCount={0} />
      </div>
    </div>
  );
};

export default Comment;
