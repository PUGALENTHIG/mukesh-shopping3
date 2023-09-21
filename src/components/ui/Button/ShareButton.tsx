import React from "react";
import { ShareIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/components/ContextProviders/ToastContext";

type ShareButtonProps = {
  postUrl: string;
};

const ShareButton = ({ postUrl }: ShareButtonProps) => {
  const { showSuccessToast, showErrorToast } = useToast();

  const handleShare = () => {
    let hostname;
    try {
      if (typeof window !== "undefined") {
        hostname = window.location.hostname + postUrl;
      }

      navigator.clipboard
        .writeText(hostname ?? postUrl)
        .then(() => {
          showSuccessToast("Post URL copied to clipboard!");
        })
        .catch((err) => {
          console.error("Error copying to clipboard:", err);
          showErrorToast("Unable to copy the URL to clipboard.");
        });
    } catch (err) {
      console.error("Clipboard API not supported:", err);
      showErrorToast("Clipboard API not supported in this browser.");
    }
  };

  return (
    <div className="z-10 flex flex-row">
      <button
        aria-label="share"
        type="button"
        onClick={handleShare as React.MouseEventHandler<HTMLButtonElement>}
        className={`flex flex-row items-center text-gray-500 transition-all duration-75 hover:text-white focus-visible:text-white`}
      >
        <div
          className={`group-hover-bg-white rounded-full p-2 outline-white transition-colors duration-100 hover:bg-white hover:bg-opacity-20 focus-visible:bg-white group-focus-visible:bg-white`}
        >
          <ShareIcon
            className={`w-4 transition-colors duration-75  group-hover:text-white group-focus-visible:fill-white lg:w-5`}
          />
        </div>
      </button>
    </div>
  );
};

export default ShareButton;
