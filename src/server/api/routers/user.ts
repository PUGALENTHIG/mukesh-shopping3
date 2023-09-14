import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input: { username }, ctx }) => {
      const currentUserId = ctx.session?.user.id;
      const profile = await ctx.prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          name: true,
          image: true,
          username: true,
          banner: true,
          bio: true,
          _count: { select: { followers: true, following: true, posts: true } },
          followers:
            currentUserId == null
              ? undefined
              : { where: { id: currentUserId } },
          following: true,
        },
      });
      if (profile == null) return;

      return {
        id: profile.id,
        name: profile.name,
        image: profile.image,
        username: profile.username,
        banner: profile.banner,
        bio: profile.bio,
        followersCount: profile._count.followers,
        followingCount: profile._count.following,
        postsCount: profile._count.posts,
        isFollowing: profile.followers.length > 0,
      };
    }),
  updateUser: protectedProcedure
    .input(
      z.object({
        username: z.string().optional(),
        email: z.string().optional(),
        name: z.string().optional(),
        image: z.string().optional(),
        banner: z.string().optional(),
        bio: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const currentUserId = ctx.session.user.id;
      const currentUserEmail = ctx.session.user.email;
      const currentUserUname = ctx.session.user.username;

      const { username, name, image, banner, bio } = input;
      const updateData = {
        ...(username ? { username } : {}),
        ...(name ? { name } : {}),
        ...(image ? { image } : {}),
        ...(banner ? { banner } : {}),
        ...(bio ? { bio } : {}),
      };

      await ctx.prisma.user.update({
        where: {
          id: currentUserId,
          email: currentUserEmail!,
          username: currentUserUname!,
        },
        data: updateData,
      });

      void ctx.revalidateSSG?.(`/${currentUserUname}`);

      return { success: true };
    }),
  toggleFollow: protectedProcedure
    .input(z.object({ userId: z.string(), username: z.string() }))
    .mutation(async ({ input: { userId, username }, ctx }) => {
      const currentUserId = ctx.session.user.id;
      const currentUserUname = ctx.session.user.username;

      const existingFollow = await ctx.prisma.user.findFirst({
        where: {
          id: userId,
          username: username,
          followers: { some: { id: currentUserId } },
        },
      });
      let addedFollow;
      if (existingFollow == null) {
        await ctx.prisma.user.update({
          where: { id: userId, username: username },
          data: { followers: { connect: { id: currentUserId } } },
        });
        addedFollow = true;
      } else {
        await ctx.prisma.user.update({
          where: { id: userId, username: username },
          data: { followers: { disconnect: { id: currentUserId } } },
        });
        addedFollow = false;
      }

      void ctx.revalidateSSG?.(`/${currentUserUname}`);
      void ctx.revalidateSSG?.(`/${username}`);

      return { addedFollow };
    }),
});
