import React from "react";
import { api } from "@/utils/api";
import { Avatar, Button, Image, Chip, useDisclosure } from "@nextui-org/react";
import pluralize from "@/utils/pluralize";
import { useSession } from "next-auth/react";
import FollowButton from "../ui/Button/FollowButton";
import EditProfileModal from "@/components/ui/Modal/EditProfileModal";
import Link from "next/link";
const fallbackImage = "./default-profile.jpg";

type ProfileProps = {
  id: string;
  name: string | null;
  username: string;
  banner: string | null;
  image: string | null;
  bio: string | null;
  links: string[] | null;
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
  links,
  followingCount,
  followersCount,
  isFollowing,
}: ProfileProps) => {
  const session = useSession();
  const user = session.data?.user;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
          src={image ?? fallbackImage}
        />

        <FollowButton
          userId={id}
          isFollowing={isFollowing}
          isLoading={toggleFollow.isLoading}
          onClick={() =>
            toggleFollow.mutate({ userId: id, username: username })
          }
        />
        {user?.id === id && session.status === "authenticated" ? (
          <Button className="mt-2" onClick={onOpen}>
            Edit Profile
          </Button>
        ) : (
          ""
        )}
      </div>
      <div className="mx-6 my-4">
        <div className="pfp text-xl font-bold">{name}</div>

        <div className="username text-medium text-gray-400">@{username}</div>

        <div className="bio my-3">{bio}</div>

        <div className="my-2 flex flex-row">
          <div>
            <span className="font-semibold">{followingCount}</span>
            <span className="ml-1 text-gray-400">Following</span>
          </div>
          <div className="pl-4">
            <span className="font-semibold">{followersCount}</span>
            <span className="ml-1 text-gray-400">
              {pluralize(followersCount, "Follower", "Followers")}
            </span>
          </div>
        </div>
        <div className="links ml-[-4px] grid w-fit grid-cols-2 md:grid-cols-4">
          {links?.map((link, i) => {
            return (
              <Link key={i} href={link} locale={false} className="w-fit">
                <Chip
                  className=" mx-1 mt-1 border dark:bg-zinc-800"
                  startContent={
                    <Image
                      removeWrapper
                      className="w-4"
                      src={`https://www.google.com/s2/favicons?domain=${link}&size=256`}
                      alt={`${link} favicon`}
                    ></Image>
                  }
                >
                  <span className="text-xs md:text-base">
                    {link.match(/([^/]*)$/)?.[0]}
                  </span>
                </Chip>
              </Link>
            );
          })}
        </div>

        <EditProfileModal
          {...user}
          bio={bio}
          activity="update"
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
        />
      </div>
    </div>
  );
};

export default ProfileCard;
