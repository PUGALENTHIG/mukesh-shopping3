/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { Avatar, Button } from "@nextui-org/react";
import React, { type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { PhotoIcon, FaceSmileIcon } from "@heroicons/react/24/solid";
import { api } from "@/utils/api";
import PostMedia from "./PostMedia";

const CreatePost = () => {
  const [draft, setDraft] = React.useState<string>("");
  const [mediaUrls, setMediaUrls] = React.useState<string[]>([]);

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
              posts: [newCachedPost, ...firstPage.posts],
            },
            ...restPages,
          ],
        };
      });
    },
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const draftRef = React.useRef<HTMLTextAreaElement>(null);

  const AutoSizeDraft = (
    draftRef: HTMLTextAreaElement | null,
    draft: string,
  ) => {
    React.useEffect(() => {
      if (draftRef) {
        draftRef.style.height = "0px";
        const scrollHeight = draftRef.scrollHeight;

        draftRef.style.height = scrollHeight + "px";
      }
    }, [draftRef, draft]);
  };

  AutoSizeDraft(draftRef.current, draft);

  const handleMediaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return Promise.resolve();

    const selectedImages = Array.from(files).map((file) =>
      encodeImageToBase64(file),
    );

    e.target.value = "";

    return Promise.all(selectedImages).then((encodedImages) => {
      setMediaUrls([...mediaUrls, ...encodedImages]);
    });
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

  const removeImage = (indexToRemove: number) => {
    const updatedMediaUrls = mediaUrls.filter(
      (_, index) => index !== indexToRemove,
    );
    setMediaUrls(updatedMediaUrls);
  };

  function handlePost(e: FormEvent) {
    e.preventDefault();

    createPost.mutate({ content: draft, mediaUrls: mediaUrls });
    setMediaUrls([]);
  }

  return (
    <div className="flex w-full flex-row border-b-1 px-6 py-4">
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
            className="my-2 w-full resize-none bg-inherit px-2 py-2"
            ref={draftRef}
            rows={1}
            maxLength={280}
          />
          <div
            className={`grid grid-cols-${
              mediaUrls.length % 2 === 0 ? 2 : mediaUrls.length === 1 ? 1 : 2
            } grid-rows-${
              mediaUrls.length < 3 ? 1 : 2
            } place-content-center gap-2`}
          >
            {mediaUrls.map((imageUrl, index) => (
              <PostMedia
                key={index}
                index={index}
                imageUrl={imageUrl}
                mediaUrls={mediaUrls}
                removeImage={removeImage}
                showClose={true}
              />
            ))}
          </div>
          <div className="mt-4 flex flex-row justify-between border-y-1 border-b-0">
            <div className="mt-2 flex w-full flex-row justify-between">
              <div className="flex flex-row">
                <label
                  className="cursor-pointer rounded-full px-2"
                  htmlFor="fileInput"
                >
                  <PhotoIcon width={24} />
                  <input
                    aria-label="add image"
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => handleMediaInput(e)}
                    disabled={mediaUrls.length === 4 ? true : false}
                  />
                </label>
                <div className="cursor-pointer rounded-full px-2">
                  <FaceSmileIcon width={24} />
                </div>
              </div>
              <Button type="submit" className="w-8">
                Post
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
