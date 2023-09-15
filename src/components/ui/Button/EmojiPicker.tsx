import React, { type Dispatch, type SetStateAction } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { FaceSmileIcon } from "@heroicons/react/24/outline";

interface Emoji {
  id: string;
  native: string;
  name: string;
  shortcodes: string;
  keywords: string[];
}

type EmojiPicker = {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
};

const EmojiPicker = ({ content, setContent }: EmojiPicker) => {
  const appendEmoji = (emoji: string) => {
    setContent(content + emoji);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <div className="cursor-pointer rounded-full px-2">
            <FaceSmileIcon className="text-violet-500" width={24} />
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <Picker
            data={data}
            onEmojiSelect={(emoji: Emoji) => appendEmoji(emoji.native)}
          />
        </PopoverContent>
      </Popover>
    </>
  );
};

export default EmojiPicker;
