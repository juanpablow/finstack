"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User } from "lucide-react"

export function Header() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Visão geral" },
    { href: "/reports", label: "Relatórios" },
  ]

  return (
    <header className="bg-[#2196F3] text-white shadow-md">
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative py-4 font-semibold hover:text-gray-200 transition-colors"
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-white" />
                )}
              </Link>
            ))}
          </div>

          <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <User className="w-6 h-6" />
          </button>
        </nav>
      </div>
    </header>
  )
}
