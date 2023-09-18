import React from "react";
import { useSession } from "next-auth/react";

type EchoButtonProps = {
  onClick: unknown;
  EchoCount: number;
};

function EchoButton({ onClick, EchoCount }: EchoButtonProps) {
  const session = useSession();

  if (session.status !== "authenticated") {
    return (
      <div className="m-1 flex items-center gap-3 self-start text-gray-500">
        <div className="w-5 fill-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            data-name="Layer 1"
            viewBox="10 10 75 75"
            className={`flex w-4 items-center justify-center fill-gray-500 transition-colors duration-75 group-hover:fill-green-500 group-focus-visible:fill-green-500 lg:w-5`}
          >
            <path d="M71,18h0a4,4,0,0,0-3.46,5.92,55.67,55.67,0,0,1,0,52.15A4,4,0,0,0,71,82h0a4,4,0,0,0,3.52-2.07,63.41,63.41,0,0,0,0-59.87A4,4,0,0,0,71,18Z" />
            <path d="M34.23,23.73A4,4,0,0,0,28,27v0a4.1,4.1,0,0,0,1.82,3.32,23.93,23.93,0,0,1,0,39.17A4.1,4.1,0,0,0,28,72.91v0a4,4,0,0,0,6.23,3.32,31.93,31.93,0,0,0,0-52.53Z" />
            <path d="M50.82,18a4,4,0,0,0-3.12,6.43,39.77,39.77,0,0,1,0,51.13,4,4,0,0,0,6.2,5,47.68,47.68,0,0,0,0-61.19A4,4,0,0,0,50.82,18Z" />
            <path d="M25.68,38.15a4,4,0,0,0-6.68,3v0a3.89,3.89,0,0,0,1.3,2.92,7.9,7.9,0,0,1,0,11.89A3.89,3.89,0,0,0,19,58.86v0a4,4,0,0,0,6.68,3,15.86,15.86,0,0,0,0-23.7Z" />
          </svg>
        </div>
        <span className="text ml-2 text-sm lg:text-base">{EchoCount}</span>
      </div>
    );
  }

  return (
    <div className="z-10 flex flex-row">
      <button
        type="button"
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        className={`group flex flex-row items-center text-gray-500 transition-all duration-75 hover:text-green-500 focus-visible:text-green-500`}
      >
        <div
          className={`duration-10 rounded-full p-2 outline-green-500 transition-colors focus-visible:bg-green-500 group-hover:bg-green-500 group-hover:bg-opacity-20 group-focus-visible:bg-green-500`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            data-name="Layer 1"
            viewBox="10 10 75 75"
            className={`flex w-4 items-center justify-center fill-gray-500 transition-colors duration-75 group-hover:fill-green-500 group-focus-visible:fill-green-500 lg:w-5`}
          >
            <path d="M71,18h0a4,4,0,0,0-3.46,5.92,55.67,55.67,0,0,1,0,52.15A4,4,0,0,0,71,82h0a4,4,0,0,0,3.52-2.07,63.41,63.41,0,0,0,0-59.87A4,4,0,0,0,71,18Z" />
            <path d="M34.23,23.73A4,4,0,0,0,28,27v0a4.1,4.1,0,0,0,1.82,3.32,23.93,23.93,0,0,1,0,39.17A4.1,4.1,0,0,0,28,72.91v0a4,4,0,0,0,6.23,3.32,31.93,31.93,0,0,0,0-52.53Z" />
            <path d="M50.82,18a4,4,0,0,0-3.12,6.43,39.77,39.77,0,0,1,0,51.13,4,4,0,0,0,6.2,5,47.68,47.68,0,0,0,0-61.19A4,4,0,0,0,50.82,18Z" />
            <path d="M25.68,38.15a4,4,0,0,0-6.68,3v0a3.89,3.89,0,0,0,1.3,2.92,7.9,7.9,0,0,1,0,11.89A3.89,3.89,0,0,0,19,58.86v0a4,4,0,0,0,6.68,3,15.86,15.86,0,0,0,0-23.7Z" />
          </svg>
        </div>
        <span className="text ml-2 text-sm lg:text-base">{EchoCount}</span>
      </button>
    </div>
  );
}

export default EchoButton;
