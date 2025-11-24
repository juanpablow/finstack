"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { AuthTabs } from "@/components/auth/AuthTabs"
import { SocialButtons } from "@/components/auth/SocialButtons"
import { AuthDivider } from "@/components/auth/AuthDivider"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [confirmEmail, setConfirmEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Signup submitted:", { email, confirmEmail, password })
  }

  return (
    <AuthLayout>
      <AuthTabs activeTab="signup" />
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
          type="email"
          label="Confirmar Email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
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
            CADASTRAR
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
