import React from "react";
import { Image } from "@nextui-org/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Lightbox } from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

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
  const removeMedia = (indexToRemove: number) => {
    const updatedMediaUrls = mediaUrls.filter(
      (_, index) => index !== indexToRemove,
    );
    setMediaUrls(updatedMediaUrls);
  };

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = React.useState(0);
  const lightboxMedia = mediaUrls.map((imageUrl) => ({ src: imageUrl }));

  const openLightbox = (index: React.SetStateAction<number>) => {
    setSelectedMediaIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
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
                  ? `h-[450px] max-w-[800px] md:h-[600px]`
                  : `h-full w-fit min-w-fit max-w-[10rem] md:max-w-[15rem] lg:max-w-[15rem] xl:max-w-[15rem] 2xl:max-w-[20rem]`
              }` +
              `${
                mediaUrls.length === 3 && index !== 1
                  ? " max-w-[10rem] md:max-w-[15rem] lg:max-w-[15rem] xl:max-w-[15rem] 2xl:max-w-[20rem] "
                  : ""
              }`
            }
            key={index}
            onClick={() => openLightbox(index)}
          >
            {showClose && (
              <div className="flex justify-end">
                <button
                  aria-label="close"
                  type="button"
                  className="absolute z-40 rounded-full bg-black bg-opacity-70 p-1 text-white"
                  onClick={
                    removeMedia
                      ? (e) => {
                          e.stopPropagation();
                          removeMedia(index);
                        }
                      : undefined
                  }
                >
                  <XMarkIcon width={26} />
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

      {isOpen && (
        <Lightbox
          styles={{ root: { "--yarl__color_backdrop": "rgba(0, 0, 0, .6)" } }}
          className="backdrop-blur-sm"
          open={isOpen}
          close={closeLightbox}
          slides={lightboxMedia}
          carousel={{ finite: true }}
          controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
          index={selectedMediaIndex}
          render={
            mediaUrls.length === 1
              ? { buttonNext: () => null, buttonPrev: () => null }
              : {}
          }
          plugins={[Thumbnails]}
        />
      )}
    </div>
  );
};

export default MasonryGrid;
