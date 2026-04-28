import middleware from "next-auth/middleware";

// In Next.js 16, proxy.ts replaces middleware.ts
// It can export a named 'proxy' function or a default export
export const proxy = middleware;
export default middleware;

export const config = {
  matcher: ["/dashboard/:path*"],
};
