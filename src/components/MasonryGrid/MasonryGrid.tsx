import React from "react";
import { Image } from "@nextui-org/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

type MasonryProps = {
  mediaUrls: string[];
  setMediaUrls: (updatedMediaUrls: string[]) => void | undefined;
  showClose: boolean;
};

const MasonryGrid = ({
  mediaUrls,
  setMediaUrls,
  showClose = false,
}: MasonryProps) => {
  const removeImage = (indexToRemove: number) => {
    const updatedMediaUrls = mediaUrls.filter(
      (_, index) => index !== indexToRemove,
    );
    setMediaUrls(updatedMediaUrls);
  };

  return (
    <div
      className={`my-2 grid w-fit place-items-center ${
        mediaUrls.length % 2 === 0 ? "grid-cols-2" : "grid-cols-1"
      } grid-rows-${mediaUrls && mediaUrls.length > 2 ? 2 : 1} gap-1`}
    >
      {mediaUrls.map((imageUrl, index) => {
        return (
          <div
            style={{
              gridArea:
                mediaUrls.length === 3 && index === 1
                  ? "1 / 1 / 3 / 2"
                  : mediaUrls.length === 3 && index === 2
                  ? "1 / 2 / 2 / 3"
                  : mediaUrls.length === 3 && index === 3
                  ? "2 / 2 / 3 / 3"
                  : mediaUrls.length === 2 && index === 1
                  ? "1 / 1 / 2 / 2"
                  : mediaUrls.length === 2 && index === 2
                  ? "1 / 2 / 2 / 3"
                  : "auto",
            }}
            className={
              `${
                mediaUrls?.length === 1
                  ? `h-fit max-w-[800px]`
                  : `h-full w-fit min-w-fit max-w-[10rem] md:max-w-[15rem] lg:max-w-[15rem] xl:max-w-[15rem] 2xl:max-w-[20rem]`
              }` +
              `${
                mediaUrls.length === 3 && index !== 1
                  ? " max-w-[10rem] md:max-w-[15rem] lg:max-w-[15rem] xl:max-w-[15rem] 2xl:max-w-[20rem] "
                  : ""
              }`
            }
            key={index}
          >
            {showClose && (
              <div className="flex justify-end">
                <button
                  aria-label="close"
                  type="button"
                  className="absolute z-40 mt-3 rounded-full bg-black bg-opacity-50 p-1 text-white"
                  onClick={removeImage ? () => removeImage(index) : undefined}
                >
                  <XMarkIcon width={24} />
                </button>
              </div>
            )}
            <Image
              removeWrapper
              src={imageUrl}
              alt={`Image ${index}`}
              className="h-full w-fit object-cover"
              shadow="none"
            />
          </div>
        );
      })}
    </div>
  );
};

export default MasonryGrid;
