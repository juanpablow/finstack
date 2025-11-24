import { AuthLeftSide } from "./AuthLeftSide"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden grid lg:grid-cols-2">
        <AuthLeftSide />

        {/* Right Side - Form */}
        <div className="p-6 lg:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">{children}</div>
        </div>
      </div>
    </div>
  )
}
