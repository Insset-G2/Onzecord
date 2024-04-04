
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";


export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/sign-in",
  },
  ...authConfig,
});