import React from "react";
import { api } from "@/utils/api";
import { Avatar, Button, Image, Skeleton } from "@nextui-org/react";
import pluralize from "@/utils/pluralize";
import { useSession } from "next-auth/react";
import FollowButton from "../ui/Button/FollowButton";
import EditProfileModal from "@/components/ui/Modal/EditProfileModal";

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
  const session = useSession();

  const [openEditModal, setOpenEditModal] = React.useState(false);

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
          <Skeleton className="fallback h-full w-full bg-gray-600"></Skeleton>
        )}
      </div>
      <div className="mx-6 flex flex-row justify-between">
        {image ? (
          <Avatar className="-mt-16  h-32 w-32" isBordered src={image} />
        ) : (
          <Skeleton className="-mt-16 h-32 w-32 rounded-full"></Skeleton>
        )}

        <FollowButton
          userId={id}
          isFollowing={isFollowing}
          isLoading={toggleFollow.isLoading}
          onClick={() =>
            toggleFollow.mutate({ userId: id, username: username })
          }
        />
        {/* {user?.id === id && session.status === "authenticated" ? (
          <Button className="mt-2" onClick={() => setOpenEditModal(true)}>
            Edit Profile
          </Button>
        ) : (
          ""
        )} */}
      </div>
      <div className="mx-6 my-4">
        {name ? (
          <div className="pfp text-xl font-bold">{name}</div>
        ) : (
          <Skeleton className="mt-2 w-fit text-xl">
            Echo User Full Name
          </Skeleton>
        )}
        {username ? (
          <div className="username text-medium text-gray-400">@{username}</div>
        ) : (
          <Skeleton className="username mt-3 w-fit text-medium">
            Echo Username
          </Skeleton>
        )}
        {bio ? (
          <div className="bio my-3">{bio}</div>
        ) : (
          <Skeleton className="bio my-3 h-6 w-48"></Skeleton>
        )}
        <Skeleton className="bio my-3 w-fit"></Skeleton>
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

        <EditProfileModal {...user} activity="update" isOpen={openEditModal} />
      </div>
    </div>
  );
};

export default ProfileCard;
