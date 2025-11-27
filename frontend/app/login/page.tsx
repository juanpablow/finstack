"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { AuthTabs } from "@/components/auth/AuthTabs"
import { SocialButtons } from "@/components/auth/SocialButtons"
import { AuthDivider } from "@/components/auth/AuthDivider"

export default function LoginPage() {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/")
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email ou senha inválidos")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch {
      setError("Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <AuthTabs activeTab="login" />
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
            {isLoading ? "ENTRANDO..." : "ENTRAR"}
          </Button>
        </div>
      </form>

      <div className="text-center mt-4">
        <button type="button" className="text-blue-600 hover:text-blue-700 font-medium text-xs">
          Esqueceu a senha?
        </button>
      </div>
    </AuthLayout>
  )
}
