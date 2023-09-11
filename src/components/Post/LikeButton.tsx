import React from "react";
import { useSession } from "next-auth/react";

import { Button } from "@nextui-org/react";

import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";

type LikeButtonProps = {
  onClick: () => void;
  likedByMe: boolean;
  likeCount: number;
};

function LikeButton({ onClick, likedByMe, likeCount }: LikeButtonProps) {
  const session = useSession();
  const LikeIcon = likedByMe ? HeartSolid : HeartOutline;

  if (session.status !== "authenticated") {
    return (
      <div className="m-1 flex items-center gap-3 self-start text-gray-500">
        <LikeIcon />
        <span>{likeCount}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-1">
      <button
        onClick={onClick}
        className={`flex flex-row items-center transition-all duration-75 ${
          likedByMe
            ? "text-red-500"
            : "text-gray-500 hover:text-red-500 focus-visible:text-red-500"
        }`}
      >
        <LikeIcon
          className={`w-5 transition-colors duration-75 ${
            likedByMe
              ? "fill-red-500"
              : " group-hover:text-red-500 group-focus-visible:fill-red-500"
          }`}
        />

        <span className="ml-2">{likeCount}</span>
      </button>
    </div>
  );
}

export default LikeButton;
