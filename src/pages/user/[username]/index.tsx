"use client";
import React from "react";
import { ssgHelper } from "@/server/api/ssgHelper";
import { api } from "@/utils/api";
import pluralize from "@/utils/pluralize";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import ErrorPage from "next/error";
import Link from "next/link";
import { Button, Spinner } from "@nextui-org/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import ProfileCard from "@/components/Profile/ProfileCard";
import PostsList from "@/components/PostsList/PostsList";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  username,
}) => {
  const posts = api.post.profileFeed.useInfiniteQuery(
    { username: username },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );
  const { data: user } = api.user.getUser.useQuery({ username });

  const [profileData, setProfileData] = React.useState<typeof user>({
    id: "",
    name: "",
    image: "",
    username: "",
    banner: "",
    bio: "",
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    isFollowing: false,
  });

  React.useEffect(() => {
    if (user) setProfileData({ ...user });
  }, [user]);

  if (!profileData) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (profileData.name === null) return <ErrorPage statusCode={404} />;

  return (
    <>
      <Head>
        <title>@{profileData.username} - Echo</title>
      </Head>
      <nav className="sticky top-0 z-50 flex w-full border-y backdrop-blur-xl">
        <Link href="..">
          <Button variant="light" radius="full" isIconOnly>
            <ArrowLeftIcon width={20} />
          </Button>
        </Link>
        <div className="flex flex-col py-2 pl-6">
          <span className="font-bold">{profileData.name}</span>
          <span className="text-sm text-gray-400">
            {profileData.postsCount}{" "}
            {pluralize(profileData.postsCount ?? 0, "Post", "Posts")}
          </span>
        </div>
      </nav>
      <ProfileCard {...profileData} username={profileData.username ?? ""} />
      <main>
        <PostsList
          posts={posts.data?.pages.flatMap((page) => page.posts)}
          isError={posts.isError}
          isLoading={posts.isLoading}
          hasMore={posts.hasNextPage ?? false}
          fetchNewPosts={posts.fetchNextPage}
          clickable={true}
        />
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ username: string; id: string | undefined }>,
) {
  const username = context.params?.username;

  if (username == null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const ssg = ssgHelper();
  await ssg.user.getUser.prefetch({ username });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
}

export default ProfilePage;
