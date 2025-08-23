import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware() {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        const publicPaths = ["/", "/login", "/register"]
        const isPublic =
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/api/videos") ||
          publicPaths.includes(pathname)

        return isPublic || !!token
      }
    }
  } 
)

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)"
  ]
}
