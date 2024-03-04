import { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }: any) {
      let isLoggedIn = !!auth?.user;
      let isOnDashboard = nextUrl.pathname.startsWith( "/protected" );

      if ( isOnDashboard ) {
        // Redirect unauthenticated users to login page
        return isLoggedIn;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/protected', nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;