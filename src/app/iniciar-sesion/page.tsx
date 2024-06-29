import { Login } from "@/components/component/login";
import LoginForm from "@/sections/Auth/Login/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión",
};

function LoginPage() {
  return <Login />;
}

export default LoginPage;
