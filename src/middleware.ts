import { NextResponse } from "next/server";
import { auth } from "../auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Rutas protegidas
  const protectedRoutes = ["/mis-partidos", "/mi-perfil"];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !isLoggedIn) {
    const newUrl = new URL("/iniciar-sesion", req.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/mis-partidos", "/mi-perfil"]
};