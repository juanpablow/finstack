import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Protege todas as rotas exceto login, signup e api
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /login (public route)
     * - /signup (public route)
     * - /api/auth (auth endpoints)
     * - /_next/static (static files)
     * - /_next/image (image optimization files)
     * - /favicon.ico (favicon file)
     */
    "/((?!login|signup|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
