import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
var jwt = require("jsonwebtoken");

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "test@test.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/login`,
          {
            method: "POST",
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );
        const user = await res.json();
        if (user.error) throw user;

        const decoded = jwt.decode(user.token);

        if (!decoded) {
          throw new Error("Error al decodificar el token");
        }

        return {
          email: user.email,
          token: user.token,
          id: decoded.id,
          name: decoded.name,
          lastname: decoded.lastname,
          roles: decoded.roles,
          photo: user.photo,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl + "/api/auth/signout")) {
        return process.env.NEXT_PUBLIC_BASE_URL || baseUrl;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  pages: {
    signIn: "/iniciar-sesion",
  },
});

export { handler as GET, handler as POST };
