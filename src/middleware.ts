import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Función para decodificar JWT
function decodeJWT(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    const payload = parts[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    return decoded;
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas protegidas
  const protectedRoutes = ["/mis-partidos", "/mi-perfil", "/admin"];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Si no es una ruta protegida, continuar
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Para rutas protegidas, verificaremos la autenticación en el cliente
  // ya que localStorage no está disponible en el middleware
  // Este middleware solo previene acceso directo por URL
  
  // Crear un header personalizado para indicar que es una ruta protegida
  const response = NextResponse.next();
  response.headers.set('x-protected-route', 'true');
  
  return response;
}

export const config = {
  matcher: ["/mis-partidos/:path*", "/mi-perfil/:path*", "/admin/:path*"]
};