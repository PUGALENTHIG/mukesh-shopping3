import { z } from "zod";

import {
  type createTRPCContext,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { type inferAsyncReturnType } from "@trpc/server";
import { type Prisma } from "@prisma/client";

export const postRouter = createTRPCRouter({
  feed: publicProcedure
    .input(
      z.object({
        onlyFollowing: z.boolean().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(
      async ({ input: { limit = 10, onlyFollowing = false, cursor }, ctx }) => {
        const currentUserId = ctx.session?.user.id;
        return await getPosts({
          limit,
          ctx,
          cursor,
          whereClause:
            currentUserId == null || !onlyFollowing
              ? undefined
              : {
                  author: {
                    followers: { some: { id: currentUserId } },
                  },
                },
        });
      },
    ),
  profileFeed: publicProcedure
    .input(
      z.object({
        username: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(async ({ input: { limit = 10, username, cursor }, ctx }) => {
      return await getPosts({
        limit,
        ctx,
        cursor,
        whereClause: { author: { username } },
      });
    }),
  singlePost: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(async ({ input: { limit = 1, postId, cursor }, ctx }) => {
      return await getPosts({
        limit,
        ctx,
        cursor,
        whereClause: {
          id: postId,
        },
      });
    }),
  create: protectedProcedure
    .input(z.object({ content: z.string(), mediaUrls: z.array(z.string()) }))
    .mutation(async ({ input: { content, mediaUrls }, ctx }) => {
      const post = await ctx.prisma.post.create({
        data: { content, mediaUrls, authorId: ctx.session.user.id },
      });

      void ctx.revalidateSSG?.(`/${ctx.session.user.username}`);

      return post;
    }),
  toggleLike: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const data = { postId: id, userId: ctx.session?.user.id };

      const existingLike = await ctx.prisma.like.findUnique({
        where: { userId_postId: data },
      });

      if (existingLike == null) {
        await ctx.prisma.like.create({ data });
        return { addedLike: true };
      } else {
        await ctx.prisma.like.delete({ where: { userId_postId: data } });
        return { addedLike: false };
      }
    }),
  createComment: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string(),
        mediaUrls: z.array(z.string()),
      }),
    )
    .mutation(async ({ input: { postId, content, mediaUrls }, ctx }) => {
      const comment = await ctx.prisma.comment.create({
        data: {
          content,
          postId,
          mediaUrls,
          authorId: ctx.session.user.id,
        },
      });

      //notification?

      return comment;
    }),
  searchPosts: publicProcedure
    .input(
      z.object({
        searchTerm: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(async ({ input: { searchTerm, cursor, limit = 10 }, ctx }) => {
      return await getSearchedPost({ searchTerm, cursor, limit, ctx });
    }),
  getComments: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ input: { postId }, ctx }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: { postId },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: {
            select: { name: true, id: true, image: true, username: true },
          },
        },
      });

      return comments;
    }),
});

async function getPosts({
  whereClause,
  ctx,
  limit,
  cursor,
}: {
  whereClause?: Prisma.PostWhereInput;
  limit: number;
  cursor: { id: string; createdAt: Date } | undefined;
  ctx: inferAsyncReturnType<typeof createTRPCContext>;
}) {
  const currentAuthorId = ctx.session?.user.id;
  const data = await ctx.prisma.post.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    where: whereClause,
    select: {
      id: true,
      content: true,
      mediaUrls: true,
      createdAt: true,
      _count: { select: { likes: true, comments: true, echoes: true } },
      likes:
        currentAuthorId == null
          ? false
          : { where: { userId: currentAuthorId } },
      author: {
        select: { name: true, id: true, image: true, username: true },
      },
      comments: {
        select: {
          id: true,
          createdAt: true,
          content: true,
          mediaUrls: true,
          postId: true,
          authorId: true,
          author: {
            select: { name: true, id: true, image: true, username: true },
          },
        },
      },
    },
  });
  let nextCursor: typeof cursor | undefined;
  if (data.length > limit) {
    const nextItem = data.pop();
    if (nextItem != null) {
      nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
    }
  }
  return {
    posts: data.map((post) => {
      return {
        id: post.id,
        content: post.content,
        mediaUrls: post.mediaUrls,
        createdAt: post.createdAt,
        likeCount: post._count.likes,
        commentCount: post._count.comments,
        author: post.author,
        likedByMe: post.likes?.length > 0,
        comments: post.comments,
      };
    }),
    nextCursor,
  };
}

async function getSearchedPost({
  searchTerm,
  cursor,
  limit,
  ctx,
}: {
  searchTerm: string | undefined;
  cursor: { id: string; createdAt: Date } | undefined;
  limit: number;
  ctx: inferAsyncReturnType<typeof createTRPCContext>;
}) {
  const currentAuthorId = ctx.session?.user.id;
  const data = await ctx.prisma.post.findMany({
    where: {
      content: {
        contains: searchTerm?.toLowerCase(),
        mode: "insensitive",
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    select: {
      id: true,
      content: true,
      mediaUrls: true,
      createdAt: true,
      _count: { select: { likes: true, comments: true, echoes: true } },
      likes:
        currentAuthorId == null
          ? false
          : { where: { userId: currentAuthorId } },
      author: {
        select: { name: true, id: true, image: true, username: true },
      },
      comments: {
        select: {
          id: true,
          createdAt: true,
          content: true,
          mediaUrls: true,
          postId: true,
          authorId: true,
          author: {
            select: { name: true, id: true, image: true, username: true },
          },
        },
      },
    },
  });
  let nextCursor: typeof cursor | undefined;
  if (data.length > limit) {
    const nextItem = data.pop();
    if (nextItem != null) {
      nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
    }
  }
  return {
    posts: data.map((post) => {
      return {
        id: post.id,
        content: post.content,
        mediaUrls: post.mediaUrls,
        createdAt: post.createdAt,
        likeCount: post._count.likes,
        commentCount: post._count.comments,
        author: post.author,
        likedByMe: post.likes?.length > 0,
        comments: post.comments,
      };
    }),
    nextCursor,
  };
}
