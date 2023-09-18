import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React from "react";

type FollowButtonProps = {
  userId: string;
  isFollowing: boolean;
  isLoading: boolean;
  onClick: () => void;
};

const FollowButton = ({
  userId,
  isFollowing,
  isLoading,
  onClick,
}: FollowButtonProps) => {
  const session = useSession();

  if (session.status !== "authenticated" || session.data?.user.id === userId)
    return null;

  return (
    <Button
      variant="ghost"
      disabled={isLoading}
      spinner={isLoading}
      onClick={onClick}
      radius="full"
      size="lg"
      className={`mt-4`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
