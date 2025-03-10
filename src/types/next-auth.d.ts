import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      token: string;
      id: number;
      name: string;
      lastname: string;
      roles: string[];
      photo: string;
    };
  }
}
