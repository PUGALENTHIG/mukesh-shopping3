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
import { Button } from "@nextui-org/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import ProfileCard from "@/components/Profile/ProfileCard";
import PostsList from "@/components/PostsList/PostsList";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  username,
}) => {
  const { data: profile } = api.profile.getUser.useQuery({ username });
  const posts = api.post.profileFeed.useInfiniteQuery(
    { username: username },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  if (!profile?.name) return <ErrorPage statusCode={404} />;
  return (
    <>
      <Head>
        <title>@{profile.username} - Echo</title>
      </Head>
      <header className="ml-4 flex w-full flex-row items-center justify-start">
        <Link href="..">
          <Button variant="light" radius="full" isIconOnly>
            <ArrowLeftIcon width={20} />
          </Button>
        </Link>
        <div className="flex flex-col py-2 pl-6">
          <span className="font-bold">{profile.name}</span>
          <span>
            {profile.postsCount}{" "}
            {pluralize(profile.postsCount, "Post", "Posts")}
          </span>
        </div>
      </header>
      <ProfileCard {...profile} username={profile.username ?? ""} />
      <main>
        <PostsList
          posts={posts.data?.pages.flatMap((page) => page.posts)}
          isError={posts.isError}
          isLoading={posts.isLoading}
          hasMore={posts.hasNextPage ?? false}
          fetchNewPosts={posts.fetchNextPage}
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
  await ssg.profile.getUser.prefetch({ username });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
}

export default ProfilePage;
