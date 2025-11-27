import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || 
                       req.nextUrl.pathname.startsWith("/signup");

    // Se está logado e tentando acessar login/signup, redireciona para dashboard
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Se não está logado e tentando acessar página protegida, redireciona para login
    if (!isAuthPage && !isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => {
        // Esta callback é necessária mas o controle real está no middleware acima
        return true;
      },
    },
  }
);

// Proteger todas as rotas exceto as públicas
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
