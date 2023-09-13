import React from "react";
import { useRouter } from "next/router";
/* import { ssgHelper } from "@/server/api/ssgHelper"; */
import { api } from "@/utils/api";
/* import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next"; */
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import PostsList from "@/components/PostsList/PostsList";
import Comment from "@/components/Comment/Comment";

const SinglePost = () => {
  const router = useRouter();
  const postId = router.query?.postId as string;
  const posts = api.post.singlePost.useInfiniteQuery({ postId: postId });
  const getComments = api.post.getComments.useQuery({ postId: postId });
  const comments = getComments.data;

  return (
    <>
      <div>
        <nav className="sticky top-0 z-50 flex w-full flex-col border-y backdrop-blur-xl">
          <div className="flex flex-row items-center py-2 pl-4">
            <Link href="..">
              <Button variant="light" radius="full" isIconOnly>
                <ArrowLeftIcon width={20} />
              </Button>
            </Link>

            <span className="ml-6 text-lg font-bold">Post</span>
          </div>
        </nav>
        <PostsList
          posts={posts.data?.pages.flatMap((page) => page.posts)}
          isError={posts.isError}
          isLoading={posts.isLoading}
          hasMore={posts.hasNextPage ?? false}
          fetchNewPosts={posts.fetchNextPage}
          clickable={false}
        />
      </div>
      {console.log(router.query)}
      <div>
        {comments?.flatMap((comment) => {
          return <Comment key={comment.id} {...comment} />;
        })}
      </div>
    </>
  );
};

/* export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
}; */

/* export async function getStaticProps(
  context: GetStaticPropsContext<{
    username: string;
    id: string | undefined;
    postId: string;
  }>,
) {
  const postId = context.params?.postId;

  if (postId == null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const ssg = ssgHelper();
  await ssg.post.singlePost.prefetch({ postId });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      postId,
    },
  };
} */

export default SinglePost;
