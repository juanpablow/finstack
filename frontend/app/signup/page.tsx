"use client";

import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email !== confirmEmail) {
      setError("Os emails não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      // Register user
      const registerResponse = await authApi.register({ email, password });
      console.log("Registration successful:", registerResponse);

      // Auto login after registration
      console.log("Attempting auto-login with email:", email);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("SignIn result:", result);

      if (result?.error) {
        console.error("SignIn error:", result.error);
        setError(
          "Erro ao fazer login após cadastro. Por favor, faça login manualmente."
        );
      } else {
        console.log("Login successful, redirecting...");
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthTabs activeTab="signup" />
      <SocialButtons />
      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />

        <Input
          type="email"
          label="Confirmar Email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          required
          disabled={isLoading}
        />

        <Input
          type="password"
          label="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />

        <div className="flex items-center justify-center">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full max-w-[370px] h-12 text-sm font-semibold bg-primary hover:bg-blue-500 text-white rounded-xl shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "CADASTRANDO..." : "CADASTRAR"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
