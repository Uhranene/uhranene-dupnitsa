import type { Metadata } from "next";
import { AuthShell, AuthLink } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Регистрация | Ученическо хранене - Дупница" };

export default function RegisterPage() {
  return (
    <AuthShell
      title="Регистрация на родител"
      subtitle="Създайте профил, за да поръчвате храна за детето си."
      footer={
        <>
          Вече имате профил? <AuthLink href="/vhod">Вход</AuthLink>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
