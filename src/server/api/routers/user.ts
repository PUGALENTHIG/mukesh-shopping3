import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

interface UserProfile {
  id: string;
  name: string;
  image: string | null;
  username: string | null;
  banner: string | null;
  bio: string | null;
  links: string[] | null;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
}

const userCache = new Map<string, UserProfile>();

export const userRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input: { username }, ctx }) => {
      // Check if user profile is in the cache
      if (userCache.has(username)) {
        return userCache.get(username);
      }

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
          links: true,
          _count: { select: { followers: true, following: true, posts: true } },
          followers:
            currentUserId == null || undefined
              ? undefined
              : { where: { id: currentUserId } },
          following: true,
        },
      });

      if (profile == null) {
        return null;
      }

      userCache.set(username, {
        id: profile.id,
        name: profile.name,
        image: profile.image,
        username: profile.username,
        banner: profile.banner,
        bio: profile.bio,
        links: profile.links,
        followersCount: profile._count.followers,
        followingCount: profile._count.following,
        postsCount: profile._count.posts,
        isFollowing: profile.followers ? profile.followers.length > 0 : false,
      });

      console.log(userCache.get(username));
      return userCache.get(username);
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
