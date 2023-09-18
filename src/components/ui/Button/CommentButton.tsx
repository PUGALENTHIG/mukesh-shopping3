import React from "react";
import { useSession } from "next-auth/react";

import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

type CommentButtonProps = {
  onClick: unknown;
  commentCount: number;
};

function CommentButton({ onClick, commentCount }: CommentButtonProps) {
  const session = useSession();

  if (session.status !== "authenticated") {
    return (
      <div className="m-1 flex items-center gap-3 self-start text-gray-500">
        <ChatBubbleLeftIcon className="w-4 lg:w-5" />
        <span className="text ml-2 text-sm lg:text-base">{commentCount}</span>
      </div>
    );
  }

  return (
    <div className="z-10 flex flex-row">
      <button
        type="button"
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        className={`group flex flex-row items-center text-gray-500 transition-all duration-75 hover:text-blue-500 focus-visible:text-blue-500`}
      >
        <div
          className={`group-hover-bg-blue-500 rounded-full p-2 outline-blue-500 transition-colors duration-100 focus-visible:bg-blue-500 group-hover:bg-blue-500 group-hover:bg-opacity-20 group-focus-visible:bg-blue-500`}
        >
          <ChatBubbleLeftIcon
            className={`w-4 transition-colors duration-75 group-hover:text-blue-500 group-focus-visible:fill-blue-500 lg:w-5`}
          />
        </div>
        <span className="text ml-2 text-sm lg:text-base">{commentCount}</span>
      </button>
    </div>
  );
}

export default CommentButton;
