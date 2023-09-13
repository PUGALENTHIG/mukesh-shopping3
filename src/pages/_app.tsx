import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import { api } from "@/utils/api";
import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";

import AppLayout from "@/components/Layouts/AppLayout";
import AuthLayout from "@/components/Layouts/AuthLayout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Echo</title>
        <meta charSet="UTF-8"></meta>
        <meta name="description" content="Social Networking App" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Sarvesh Patil"></meta>
      </Head>
      <NextUIProvider>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {router.pathname.includes("/auth") ? (
            <AuthLayout>
              <Component {...pageProps} />
            </AuthLayout>
          ) : (
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
          )}
        </ThemeProvider>
      </NextUIProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
