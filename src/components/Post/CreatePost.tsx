"use client";
import { Avatar, Button } from "@nextui-org/react";
import React, { type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { api } from "@/utils/api";
import MasonryGrid from "../MasonryGrid/MasonryGrid";
import EmojiPicker from "../ui/Button/EmojiPicker";
import { useToast } from "../ContextProviders/ToastContext";

const CreatePost = () => {
  const [draft, setDraft] = React.useState<string>("");
  const [mediaUrls, setMediaUrls] = React.useState<string[]>([]);

  const session = useSession();
  const user = session.data?.user;

  const { showErrorToast } = useToast();

  const trpcUtils = api.useContext();
  const createPost = api.post.create.useMutation({
    onSuccess: (newPost) => {
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

  const PostMediaInputRef = React.useRef<HTMLInputElement>(null);
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
    if (!draft && mediaUrls.length === 0) {
      showErrorToast("Post cannot be empty");
    } else {
      createPost.mutate({ content: draft, mediaUrls: mediaUrls });
      setMediaUrls([]);
    }
  }

  return (
    <div className="flex w-full flex-row border-b-1 px-3 py-4 md:px-6">
      <div className="h-full pr-[10px] md:pr-3 lg:pr-4">
        <Avatar radius="full" size="md" src={user?.image ?? ""} />
      </div>
      <div className="flex w-full flex-col text-xl">
        <form
          onSubmit={
            session.status === "authenticated"
              ? handlePost
              : (e) => {
                  e.preventDefault();
                  showErrorToast("Login to create posts");
                }
          }
        >
          <div className="flex flex-row">
            <textarea
              id="draft-input"
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
              }}
              placeholder="What's on your mind?"
              className="w-full resize-none bg-inherit px-2 py-2 outline-none"
              ref={draftRef}
              rows={1}
              maxLength={280}
            />
          </div>

          <MasonryGrid
            mediaUrls={mediaUrls ?? []}
            setMediaUrls={setMediaUrls}
            showClose={true}
          />

          <div className="mt-4 flex flex-row justify-between border-y-1 border-b-0">
            <div className="mt-2 flex w-full flex-row justify-between">
              <div className="flex flex-row">
                <label
                  className="cursor-pointer rounded-full px-2"
                  htmlFor="PostMediaInput"
                >
                  <PhotoIcon className="text-violet-500" width={24} />
                  <input
                    aria-label="add image"
                    id="PostMediaInput"
                    type="file"
                    accept="image/*"
                    multiple
                    ref={PostMediaInputRef}
                    className="hidden"
                    onChange={(e) => void handleMediaInput(e)}
                    disabled={mediaUrls.length === 4 ? true : false}
                  />
                </label>
                <EmojiPicker content={draft} setContent={setDraft} />
              </div>
              <Button type="submit" className="w-8 bg-violet-500 font-semibold">
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
