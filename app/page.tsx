"use client";

import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-sans bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center justify-center gap-8">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
          Bem-vindo ao StackFindOver
        </h1>
        
        {session?.user && (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
            <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-4">
              Olá, <span className="font-semibold">{session.user.name || session.user.email}</span>!
            </p>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
            >
              Sair
            </button>
          </div>
        )}
        
        <div className="text-center text-zinc-600 dark:text-zinc-400 max-w-2xl">
          <p className="mb-4">
            Esta é uma página protegida. Você só pode acessá-la se estiver autenticado.
          </p>
          <p>
            Para começar a desenvolver, edite o arquivo <code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">app/page.tsx</code>
          </p>
        </div>
      </main>
    </div>
  );
}
