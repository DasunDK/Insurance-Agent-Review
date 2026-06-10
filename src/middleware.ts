import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  matcher: [
    "/admin/((?!login).*)",
    "/api/admin/((?!generate-link).*)", // Depending on who generates the link, if admin calls it it's fine
  ],
};
