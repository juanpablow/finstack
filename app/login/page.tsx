"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { AuthTabs } from "@/components/auth/AuthTabs"
import { SocialButtons } from "@/components/auth/SocialButtons"
import { AuthDivider } from "@/components/auth/AuthDivider"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login submitted:", { email, password })
  }

  return (
    <AuthLayout>
      <AuthTabs activeTab="login" />
      <SocialButtons />
      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          label="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-center">
          <Button
            type="submit"
            className="w-full max-w-[370px] h-12 text-sm font-semibold bg-primary hover:bg-blue-500 text-white rounded-xl shadow-lg mt-6"
          >
            ENTRAR
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
