"use client";
import { Avatar, Button } from "@nextui-org/react";
import React, { type FormEvent } from "react";
import { useSession } from "next-auth/react";
import MasonryGrid from "../MasonryGrid/MasonryGrid";
import { PhotoIcon, FaceSmileIcon } from "@heroicons/react/24/solid";
import { api } from "@/utils/api";

type CreateCommentProps = {
  postId: string;
};

const CreateComment = ({ postId }: CreateCommentProps) => {
  const [reply, setReply] = React.useState<string>("");
  const [mediaUrls, setMediaUrls] = React.useState<string[]>([]);

  const session = useSession();
  const user = session.data?.user;

  const trpcUtils = api.useContext();
  const createComment = api.post.createComment.useMutation({
    onSuccess: (newComment) => {
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

  const ReplyMediaInputRef = React.useRef<HTMLInputElement>(null);
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

  const handleMediaInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return Promise.resolve();

    const selectedImages = Array.from(files).map((file) =>
      encodeImageToBase64(file),
    );

    e.target.value = "";

    const encodedImages = await Promise.all(selectedImages);
    setMediaUrls([...mediaUrls, ...encodedImages]);
  };

  const encodeImageToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          resolve(e.target.result);
        } else {
          reject(new Error("Failed to read image as base64."));
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

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
          <MasonryGrid
            mediaUrls={mediaUrls ?? []}
            setMediaUrls={setMediaUrls}
            showClose={true}
          />
          <div className="flex flex-row justify-between border-y-1 border-b-0 pt-2">
            <div className="flex flex-row">
              <div className="cursor-pointer rounded-full px-2">
                <label
                  className="cursor-pointer rounded-full px-2"
                  htmlFor="ReplyMediaInputRef"
                >
                  <PhotoIcon width={24} />
                  <input
                    aria-label="add image"
                    id="ReplyMediaInputRef"
                    type="file"
                    accept="image/*"
                    multiple
                    ref={ReplyMediaInputRef}
                    className="hidden"
                    onChange={(e) => void handleMediaInput(e)}
                    disabled={mediaUrls.length === 4 ? true : false}
                  />
                </label>
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
