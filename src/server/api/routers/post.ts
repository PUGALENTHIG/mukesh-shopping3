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
      _count: { select: { likes: true } },
      likes:
        currentAuthorId == null
          ? false
          : { where: { userId: currentAuthorId } },
      author: {
        select: { name: true, id: true, image: true, username: true },
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
        author: post.author,
        likedByMe: post.likes?.length > 0,
      };
    }),
    nextCursor,
  };
}
