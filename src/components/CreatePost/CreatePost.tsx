"use client";
import { Avatar, Button, image } from "@nextui-org/react";
import React, { type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { PhotoIcon, FaceSmileIcon } from "@heroicons/react/24/solid";
import { api } from "@/utils/api";

const CreatePost = () => {
  const [draft, setDraft] = React.useState("");
  const [mediaUrls, setMediaUrls] = React.useState([""]);

  const session = useSession();
  const user = session.data?.user;

  const trpcUtils = api.useContext();
  const createPost = api.post.create.useMutation({
    onSuccess: (newPost) => {
      console.log(newPost);
      setDraft("");

      if (session.status !== "authenticated") return;

      trpcUtils.post.feed.setInfiniteData({}, (oldData) => {
        if (!oldData?.pages[0]) return oldData;

        const newCachedPost = {
          ...newPost,
          likeCount: 0,
          likedByMe: false,
          author: {
            id: session.data.user.id,
            name: session.data.user.name ?? "Echo User",
            image: session.data.user.image ?? null,
            username: session.data.user.username ?? null,
          },
        };

        const [firstPage, ...restPages] = oldData.pages;

        return {
          ...oldData,
          pages: [
            {
              ...firstPage,
              posts: [newCachedPost, ...firstPage.posts],
            },
            ...restPages,
          ],
        };
      });
    },
  });

  const draftRef = React.useRef<HTMLTextAreaElement>(null);
  const AutoSizeDraft = (
    draftRef: HTMLTextAreaElement | null,
    draft: string,
  ) => {
    React.useLayoutEffect(() => {
      if (draftRef) {
        draftRef.style.height = "0px";
        const scrollHeight = draftRef.scrollHeight;

        draftRef.style.height = scrollHeight + "px";
      }
    }, [draftRef, draft]);
  };

  AutoSizeDraft(draftRef.current, draft);

  function handlePost(e: FormEvent) {
    e.preventDefault();

    createPost.mutate({ content: draft, mediaUrls: mediaUrls });
  }

  return (
    <div className="flex w-full flex-row border-b-1 p-4">
      <div className="h-full pr-4">
        <Avatar radius="full" size="md" src={user?.image ?? ""} />
      </div>
      <div className="flex w-full flex-col text-xl">
        <form onSubmit={handlePost}>
          <textarea
            id="draft-input"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
            }}
            placeholder="What's on your mind?"
            className="w-full resize-none bg-inherit px-2 py-2"
            ref={draftRef}
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
              Post
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
