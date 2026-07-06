import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token

    if (req.nextUrl.pathname.startsWith("/admin") && (token as any)?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    return NextResponse.next()
  },
  {
    pages: { signIn: "/auth/signin" },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/submit",
    "/admin",
    "/admin/:path*",
    "/proofs/:path*/edit",
  ],
}
