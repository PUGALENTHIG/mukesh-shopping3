import React from "react";
import { api } from "@/utils/api";
import { Avatar, Button, Image } from "@nextui-org/react";
import pluralize from "@/utils/pluralize";
import { useSession } from "next-auth/react";
const profileFallback = "./default-profile.jpg";

type ProfileProps = {
  id: string;
  name: string | null;
  username: string;
  banner: string | null;
  image: string | null;
  bio: string | null;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
};

const ProfileCard = ({
  id,
  banner,
  image,
  name,
  username,
  bio,
  followingCount,
  followersCount,
  isFollowing,
}: ProfileProps) => {
  const trpcUtils = api.useContext();
  const toggleFollow = api.user.toggleFollow.useMutation({
    onSuccess: ({ addedFollow }) => {
      trpcUtils.user.getUser.setData({ username }, (oldData) => {
        if (oldData == null) return;

        const countModifier = addedFollow ? 1 : -1;
        return {
          ...oldData,
          isFollowing: addedFollow,
          followersCount: oldData.followersCount + countModifier,
        };
      });
    },
  });

  return (
    <div className="border-b">
      <div className="banner h-64 w-full">
        {banner ? (
          <Image
            removeWrapper
            src={banner ?? ""}
            alt="profile banner"
            className="aspect-video h-full w-full object-fill"
            radius="none"
          />
        ) : (
          <div className="fallback h-full w-full bg-gray-600"></div>
        )}
      </div>
      <div className="mx-6 flex flex-row justify-between">
        <Avatar
          className="-mt-16  h-32 w-32"
          isBordered
          src={image ?? profileFallback}
        />
        <FollowButton
          userId={id}
          isFollowing={isFollowing}
          isLoading={toggleFollow.isLoading}
          onClick={() =>
            toggleFollow.mutate({ userId: id, username: username })
          }
        />
      </div>
      <div className="mx-6 my-4">
        <div className="pfp text-xl font-bold">{name}</div>
        <div className="username ">@{username}</div>
        <div className="bio mt-3">{bio}</div>
        <div className="my-1 flex flex-row">
          <div>
            <span className="font-semibold">{followingCount}</span>
            <span className="ml-1">Following</span>
          </div>
          <div className="pl-4">
            <span className="font-semibold">{followersCount}</span>
            <span className="ml-1">
              {pluralize(followersCount, "Follower", "Followers")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function FollowButton({
  userId,
  isFollowing,
  isLoading,
  onClick,
}: {
  userId: string;
  isFollowing: boolean;
  isLoading: boolean;
  onClick: () => void;
}) {
  const session = useSession();

  if (session.status !== "authenticated" || session.data?.user.id === userId)
    return null;

  return (
    <Button
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
}

export default ProfileCard;
