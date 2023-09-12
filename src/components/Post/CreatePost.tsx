"use client";
import { Avatar, Button, Image } from "@nextui-org/react";
import React, { type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { PhotoIcon, FaceSmileIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { api } from "@/utils/api";

const CreatePost = () => {
  const [draft, setDraft] = React.useState("");
  const [mediaUrls, setMediaUrls] = React.useState<string[]>([]);
  const [fileInputKey, setFileInputKey] = React.useState(0);

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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedImages = Array.from(files).map((file) =>
      URL.createObjectURL(file),
    );
    setMediaUrls([...mediaUrls, ...selectedImages]);
    e.target.value = ""; // Clear the file input
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
          <div>
            {mediaUrls.map((imageUrl, index) => (
              <div key={index} className="relative inline-block">
                <Image
                  src={imageUrl}
                  alt={`Image ${index}`}
                  className="m-2 h-52 object-cover"
                />
                <button
                  aria-label="close"
                  type="button"
                  className="absolute right-0 top-0 z-40 rounded-full p-1 text-white"
                  onClick={() => removeImage(index)}
                >
                  <XMarkIcon width={24} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-row justify-between border-y-1 border-b-0 pt-4">
            <div className="flex flex-row">
              <label
                className="cursor-pointer rounded-full px-2"
                htmlFor="fileInput"
              >
                <PhotoIcon width={20} />
                <input
                  aria-label="add image"
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileInputChange}
                />
              </label>
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
