/* eslint-disable @typescript-eslint/no-misused-promises */
import React from "react";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { api } from "@/utils/api";
import type { IRegister } from "@/validation/auth";

const RegisterForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegister>();

  const [error, setError] = React.useState<string | undefined>();
  const [loading, setLoading] = React.useState<boolean>(false);

  const registerUser = api.auth.register.useMutation({
    onError: (e) => setError(e.message),
    onSuccess: () => router.push("auth/login"),
  });

  const onSubmit: SubmitHandler<IRegister> = async (data) => {
    setError(undefined);
    await registerUser.mutateAsync(data);
  };

  return (
    <div className="container mx-auto flex max-w-md items-center justify-center px-6">
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto flex justify-center">Logo</div>
        <div className=" mt-8 flex w-full flex-col items-center gap-4 ">
          <span className="absolute"></span>
          {error && <p className="text-center text-red-600">{error}</p>}
          <Input
            type="text"
            label="Name"
            {...register("name", { required: true })}
          />
          {error && <p className="text-center text-red-600">{error}</p>}
          <Input
            type="username"
            label="Username"
            pattern="^[a-zA-Z]\w{3,14}$"
            startContent="@"
            {...register("username", { required: true })}
          />
          {error && <p className="text-center text-red-600">{error}</p>}
          <Input
            type="email"
            label="Email"
            {...register("email", { required: true })}
          />
          {error && <p className="text-center text-red-600">{error}</p>}
          <Input
            type="password"
            label="Password"
            autoComplete="new-password"
            {...register("password", { required: true })}
          />
        </div>

        <div className="mt-6">
          <Button
            isLoading={loading}
            disabled={loading}
            type="submit"
            className="w-full transform rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          >
            Sign Up
          </Button>

          <div className="mt-6 text-center ">
            <a
              href="#"
              className="text-sm text-blue-500 hover:underline dark:text-blue-400"
            >
              Already have an account?
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
