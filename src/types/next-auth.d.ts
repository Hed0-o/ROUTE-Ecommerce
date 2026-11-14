import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
      backendToken?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    backendToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    role?: string;
    id?: string;
  }
}
