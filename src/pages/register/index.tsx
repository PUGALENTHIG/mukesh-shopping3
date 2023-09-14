import React from "react";

import type { GetServerSideProps, NextPage } from "next";
import { getServerAuthSession as getServerAuthSession } from "@/server/common/get-server-auth-session";
import RegisterForm from "@/components/Forms/RegisterForm";

const Register: NextPage = () => {
  return (
    <section className="flex h-full w-full justify-center">
      <RegisterForm />
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
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
    };
  }

  return { props: {} };
};

export default Register;
