import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    // Obtener token de localStorage en lugar de Next-Auth
    const token = localStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Inject idempotency key for specific routes
    const idempotentRoutes = ['/sets/matches-with-sets', '/sets/matches/admin'];
    
    if (config.url && idempotentRoutes.some(route => config.url!.includes(route))) {
      // Ensure headers object exists
      config.headers = config.headers || {};
      config.headers['X-Idempotency-Key'] = uuidv4();
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas 401 (token expirado)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido, limpiar localStorage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_photo");
      // Opcional: redirigir a login
      if (typeof window !== "undefined") {
        window.location.href = "/iniciar-sesion";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;