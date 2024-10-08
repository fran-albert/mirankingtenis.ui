import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      token: string;
      id: number;
      roles: string[];
      photo: string;
    };
  }
}
