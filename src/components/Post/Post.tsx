import React from "react";
import Link from "next/link";
import LikeButton from "@/components/ui/Button/LikeButton";
import { api } from "@/utils/api";
import {
  Avatar,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { timeAgo } from "@/utils/dateFormat";
import { useRouter } from "next/router";
import CommentButton from "@/components/ui/Button/CommentButton";
import CreateComment from "./CreateComment";
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
  commentCount: number;
  clickable: boolean;
  comments?: {
    id: string;
    postId: string;
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
};

function Post({
  id,
  author,
  content,
  createdAt,
  likeCount,
  likedByMe,
  commentCount,
  clickable,
}: PostProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();
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
      trpcUtils.post.profileFeed.setInfiniteData(
        { username: author.username ?? "" },
        updateData,
      );
      trpcUtils.post.singlePost.setInfiniteData({ postId: id }, updateData);
    },
  });

  const handleToggleLike = () => {
    try {
      toggleLike.mutate({ id });
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleComment = () => {
    return;
  };

  const handleClick = () => {
    void router.push(`/${author.username}/${id}`);
  };

  return (
    <>
      <div className="flex-col border-b px-6 py-4">
        <div
          onClick={clickable ? handleClick : () => null}
          className={`flex ${clickable ? "cursor-pointer" : "cursor-default"} `}
        >
          <div className="flex h-full flex-col pr-4">
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
          </div>
        </div>
        <div className="ml-14 flex flex-row  justify-start gap-10 pt-3">
          <LikeButton
            onClick={handleToggleLike}
            likedByMe={likedByMe}
            likeCount={likeCount}
          />
          <CommentButton onClick={onOpen} commentCount={commentCount} />
        </div>
      </div>
      <Modal size="4xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="mt-8 flex">
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
                      <span className="px-1 text-gray-400">
                        @{author.username}
                      </span>
                      <span className=" text-gray-400">·</span>
                      <span className="px-1 text-gray-400">
                        {timeAgo(createdAt)}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap py-2">{content}</p>
                    <div className="py-2 text-gray-400">
                      replying to{" "}
                      <Link className="text-blue-500" href={`/${author.name}`}>
                        @{author.name}
                      </Link>
                    </div>
                  </div>
                </div>
                <CreateComment postId={id} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Post;
