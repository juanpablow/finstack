import Link from "next/link"
import { cn } from "@/lib/utils"

interface AuthTabsProps {
  activeTab: "login" | "signup"
}

export function AuthTabs({ activeTab }: AuthTabsProps) {
  return (
    <div className="flex mb-6 border-b border-gray-200">
      <Link
        href="/login"
        className={cn(
          "flex-1 pb-3 text-base font-semibold transition-colors relative text-center",
          activeTab === "login" ? "text-[#1B1B1B]" : "text-gray-500 hover:text-gray-700",
        )}
      >
        ENTRAR
        {activeTab === "login" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
      </Link>
      <Link
        href="/signup"
        className={cn(
          "flex-1 pb-3 text-base font-semibold transition-colors relative text-center",
          activeTab === "signup" ? "text-[#1B1B1B]" : "text-gray-500 hover:text-gray-700",
        )}
      >
        CADASTRAR
        {activeTab === "signup" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
      </Link>
    </div>
  )
}
