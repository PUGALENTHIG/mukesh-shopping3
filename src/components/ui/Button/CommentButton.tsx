import React from "react";
import { useSession } from "next-auth/react";

import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

type CommentButtonProps = {
  onClick: () => void;
  commentCount: number;
};

function CommentButton({ onClick, commentCount }: CommentButtonProps) {
  const session = useSession();

  if (session.status !== "authenticated") {
    return (
      <div className="m-1 flex items-center gap-3 self-start text-gray-500">
        <ChatBubbleLeftIcon className="w-5" />
        <span>{commentCount}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-row">
      <button
        type="button"
        onClick={onClick}
        className={`flex flex-row items-center text-gray-500 transition-all duration-75 hover:text-blue-500 focus-visible:text-blue-500`}
      >
        <div
          className={`group-hover-bg-blue-500 rounded-full p-2 outline-blue-500 transition-colors duration-100 hover:bg-blue-500 hover:bg-opacity-20 focus-visible:bg-blue-500 group-focus-visible:bg-blue-500`}
        >
          <ChatBubbleLeftIcon
            className={`w-5 transition-colors duration-75 group-hover:text-blue-500 group-focus-visible:fill-blue-500`}
          />
        </div>
        <span className="ml-2">{commentCount}</span>
      </button>
    </div>
  );
}

export default CommentButton;
