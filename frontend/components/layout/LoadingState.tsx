"use client";

import { Header } from "@/components/layout/Header";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Carregando..." }: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-gray-600">{message}</p>
        </div>
      </main>
    </div>
  );
}
