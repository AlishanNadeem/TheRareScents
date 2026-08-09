import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Protects every /admin/** route except the login page itself. Runs on the
// edge before any admin page/layout renders, so unauthenticated visitors
// never even reach the Server Component that would otherwise 401/redirect.
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
