/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React from "react";
import type {
  GetServerSideProps,
  NextPage,
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from "next";
import type { ILogin } from "@/validation/auth";

import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { getCsrfToken } from "next-auth/react";

import { useForm, type SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

import Image from "next/image";
import { Button, Input } from "@nextui-org/react";

import LogoWhite from "/public/echo-white.png";

const Login: NextPage = ({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { error } = router.query;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();

  /*  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    await signIn("credentials", { ...data, callbackUrl: "/" });
  }; */

  return (
    <section className="flex h-full w-full justify-center">
      <div className="bg-elevation-1 m-auto mx-auto w-full max-w-sm rounded-lg border p-6 shadow-lg">
        <div className="container mx-auto flex items-center justify-center pt-4">
          <Image alt="branding" src={LogoWhite} width={40} height={40} />
        </div>
        <form
          method="post"
          action="/api/auth/callback/credentials"
          /* onSubmit={handleSubmit(onSubmit)} */
          className="mt-6"
        >
          <div>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          </div>
          <div>
            <Input
              label="Email"
              title="Email"
              id="email"
              type="email"
              {...register("email", { required: true })}
            />
          </div>

          <div className="mt-4">
            <Input
              label="Password"
              title="Password"
              type="password"
              {...register("password", { required: true })}
            />
            <div className="flex justify-end px-2 pt-2">
              <a href="#" className="text-xs">
                Forget Password?
              </a>
            </div>
          </div>

          <div className="mt-6">
            <Button type="submit" className="w-full transform rounded-lg ">
              Login
            </Button>
          </div>
        </form>

        <div className="mt-4 flex items-center justify-between">
          <span className="w-1/5 border-b"></span>

          <a href="#" className="text-center text-xs uppercase">
            or login with Social Media
          </a>

          <span className="w-1/5 border-b "></span>
        </div>

        <div className="-mx-2 mt-6 flex flex-col items-center gap-y-3">
          <Button
            type="button"
            className="mx-2 flex w-full transform items-center justify-center rounded-lg"
            startContent={
              <svg className="mx-2 h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"></path>
              </svg>
            }
          >
            <span className=" hidden sm:inline">Sign in with Google</span>
          </Button>
          <Button
            type="button"
            className="mx-2 flex w-full transform items-center justify-center rounded-lg"
            startContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 50 50"
                fill="white"
                className="p-[2px]"
              >
                <path d="M 41.625 10.769531 C 37.644531 7.566406 31.347656 7.023438 31.078125 7.003906 C 30.660156 6.96875 30.261719 7.203125 30.089844 7.589844 C 30.074219 7.613281 29.9375 7.929688 29.785156 8.421875 C 32.417969 8.867188 35.652344 9.761719 38.578125 11.578125 C 39.046875 11.867188 39.191406 12.484375 38.902344 12.953125 C 38.710938 13.261719 38.386719 13.429688 38.050781 13.429688 C 37.871094 13.429688 37.6875 13.378906 37.523438 13.277344 C 32.492188 10.15625 26.210938 10 25 10 C 23.789063 10 17.503906 10.15625 12.476563 13.277344 C 12.007813 13.570313 11.390625 13.425781 11.101563 12.957031 C 10.808594 12.484375 10.953125 11.871094 11.421875 11.578125 C 14.347656 9.765625 17.582031 8.867188 20.214844 8.425781 C 20.0625 7.929688 19.925781 7.617188 19.914063 7.589844 C 19.738281 7.203125 19.34375 6.960938 18.921875 7.003906 C 18.652344 7.023438 12.355469 7.566406 8.320313 10.8125 C 6.214844 12.761719 2 24.152344 2 34 C 2 34.175781 2.046875 34.34375 2.132813 34.496094 C 5.039063 39.605469 12.972656 40.941406 14.78125 41 C 14.789063 41 14.800781 41 14.8125 41 C 15.132813 41 15.433594 40.847656 15.621094 40.589844 L 17.449219 38.074219 C 12.515625 36.800781 9.996094 34.636719 9.851563 34.507813 C 9.4375 34.144531 9.398438 33.511719 9.765625 33.097656 C 10.128906 32.683594 10.761719 32.644531 11.175781 33.007813 C 11.234375 33.0625 15.875 37 25 37 C 34.140625 37 38.78125 33.046875 38.828125 33.007813 C 39.242188 32.648438 39.871094 32.683594 40.238281 33.101563 C 40.601563 33.515625 40.5625 34.144531 40.148438 34.507813 C 40.003906 34.636719 37.484375 36.800781 32.550781 38.074219 L 34.378906 40.589844 C 34.566406 40.847656 34.867188 41 35.1875 41 C 35.199219 41 35.210938 41 35.21875 41 C 37.027344 40.941406 44.960938 39.605469 47.867188 34.496094 C 47.953125 34.34375 48 34.175781 48 34 C 48 24.152344 43.785156 12.761719 41.625 10.769531 Z M 18.5 30 C 16.566406 30 15 28.210938 15 26 C 15 23.789063 16.566406 22 18.5 22 C 20.433594 22 22 23.789063 22 26 C 22 28.210938 20.433594 30 18.5 30 Z M 31.5 30 C 29.566406 30 28 28.210938 28 26 C 28 23.789063 29.566406 22 31.5 22 C 33.433594 22 35 23.789063 35 26 C 35 28.210938 33.433594 30 31.5 30 Z"></path>
              </svg>
            }
          >
            <span className="ml-1 hidden sm:inline">Sign in with Discord</span>
          </Button>
        </div>

        <p className="mt-8 text-center text-xs font-light">
          {` Don't have an account?`}
          <a href="#" className="font-medium">
            Create One
          </a>
        </p>
      </div>
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getServerAuthSession({
    req: context.req,
    res: context.res,
  });

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {
        csrfToken: await getCsrfToken(context),
      },
    };
  }

  return { props: {} };
};

export default Login;
