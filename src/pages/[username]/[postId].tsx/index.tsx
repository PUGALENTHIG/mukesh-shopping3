import React from "react";
import { ssgHelper } from "@/server/api/ssgHelper";
import InfiniteScroll from "react-infinite-scroll-component";
import { api } from "@/utils/api";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import PostsList from "@/components/PostsList/PostsList";
import Comment from "@/components/Comment/Comment";

const singlePost: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  postId,
}) => {
  const posts = api.post.singlePost.useInfiniteQuery({ postId: postId });
  const getComments = api.post.getComments.useQuery({ postId: postId });
  const comments = getComments.data;

  return (
    <>
      <div>
        <PostsList
          posts={posts.data?.pages.flatMap((page) => page.posts)}
          isError={posts.isError}
          isLoading={posts.isLoading}
          hasMore={posts.hasNextPage ?? false}
          fetchNewPosts={posts.fetchNextPage}
          clickable={false}
        />
      </div>
      <div>
        {comments?.flatMap((comment) => {
          return <Comment key={comment.id} {...comment} />;
        })}
      </div>
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
}

export default singlePost;
