import React from "react";
import { Image } from "@nextui-org/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

type MasonryMedia = {
  index: number;
  mediaUrls?: string[];
  imageUrl: string;
  removeImage: ((index: number) => void) | undefined;
  showClose: boolean;
};

const MasonryMedia = ({
  mediaUrls,
  imageUrl,
  index,
  removeImage,
  showClose = false,
}: MasonryMedia) => {
  return (
    <div
      style={
        mediaUrls?.length === 3 && index === 1
          ? { gridArea: "1 / 1 / 3 / 2" }
          : { gridArea: "auto" }
      }
      className={mediaUrls?.length === 1 ? `h-fit max-w-[750px]` : `w-fit`}
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
        className="my-2 h-full w-full object-cover"
        shadow="none"
      />
    </div>
  );
};

export default MasonryMedia;
