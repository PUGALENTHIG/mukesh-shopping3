"use client";
import { Avatar, Button, image } from "@nextui-org/react";
import React, { type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { PhotoIcon, FaceSmileIcon } from "@heroicons/react/24/solid";
import { api } from "@/utils/api";

type CreateCommentProps = {
  postId: string;
};

const CreateComment = ({ postId }: CreateCommentProps) => {
  const [reply, setReply] = React.useState("");
  const [mediaUrls, setMediaUrls] = React.useState([""]);

  const session = useSession();
  const user = session.data?.user;

  const trpcUtils = api.useContext();
  const createComment = api.post.createComment.useMutation({
    onSuccess: (newComment) => {
      console.log(newComment);
      setReply("");

      if (session.status !== "authenticated") return;

      trpcUtils.post.feed.setInfiniteData({}, (oldData) => {
        if (!oldData?.pages[0]) return oldData;

        const newCachedComment = {
          ...newComment,
          likeCount: 0,
          commentCount: 0,
          likedByMe: false,
          author: {
            id: session.data.user.id,
            name: session.data.user.name ?? "Echo User",
            image: session.data.user.image ?? null,
            username: session.data.user.username ?? null,
          },
          comments: [],
        };

        const [firstPage, ...restPages] = oldData.pages;

        return {
          ...oldData,
          pages: [
            {
              ...firstPage,
              posts: [newCachedComment, ...firstPage.posts],
            },
            ...restPages,
          ],
        };
      });
    },
  });

  const replyRef = React.useRef<HTMLTextAreaElement>(null);
  const AutoSizeReply = (
    replyRef: HTMLTextAreaElement | null,
    reply: string,
  ) => {
    React.useEffect(() => {
      if (replyRef) {
        replyRef.style.height = "0px";
        const scrollHeight = replyRef.scrollHeight;

        replyRef.style.height = scrollHeight + "px";
      }
    }, [replyRef, reply]);
  };

  AutoSizeReply(replyRef.current, reply);

  function handlePost(e: FormEvent) {
    e.preventDefault();

    createComment.mutate({
      postId: postId,
      content: reply,
      mediaUrls: mediaUrls,
    });
  }

  return (
    <div className="flex w-full flex-row border-b-1 p-4">
      <div className="h-full pr-4">
        <Avatar radius="full" size="md" src={user?.image ?? ""} />
      </div>
      <div className="flex w-full flex-col text-xl">
        <form onSubmit={handlePost}>
          <textarea
            id="reply-input"
            value={reply}
            onChange={(e) => {
              setReply(e.target.value);
            }}
            placeholder="Post your reply!"
            className="w-full resize-none bg-inherit px-2 py-2"
            ref={replyRef}
            rows={1}
            maxLength={280}
          />
          <div className="flex flex-row justify-between border-y-1 border-b-0 pt-2">
            <div className="flex flex-row">
              <div className="cursor-pointer rounded-full px-2">
                <PhotoIcon width={20} />
              </div>
              <div className="cursor-pointer rounded-full px-2">
                <FaceSmileIcon width={20} />
              </div>
            </div>
            <Button type="submit" className="w-8">
              Reply
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComment;
