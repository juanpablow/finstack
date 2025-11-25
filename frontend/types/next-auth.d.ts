import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      token?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    token?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    token?: string;
  }
}
