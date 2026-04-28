import middleware from "next-auth/middleware";

// Using middleware.ts for compatibility across Next.js 15 and 16
export default middleware;
export { middleware };

export const config = {
  matcher: ["/dashboard/:path*"],
};
