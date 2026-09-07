import type { Metadata } from "next";
import { AuthShell, AuthLink } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Вход | Ученическо хранене - Дупница" };

export default async function LoginPage({
  searchParams,
}: PageProps<"/vhod">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;

  return (
    <AuthShell
      title="Вход"
      subtitle="Влезте в профила си, за да поръчате храна за детето си."
      footer={
        <>
          Нямате профил? <AuthLink href="/registracia">Регистрирайте се</AuthLink>
        </>
      }
    >
      <LoginForm next={next} />
    </AuthShell>
  );
}
