import Image from "next/image"

export function AuthLeftSide() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8 flex flex-col justify-center items-center">
      <div className="max-w-sm w-full">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight text-balance">
          SEU FUTURO FINANCEIRO COMEÇA AGORA
        </h1>

        <div className="relative w-full aspect-square mb-6">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/main-image-bmB1U7LRaYTQJ5sPRK1UMW3OTV3t5r.png"
            alt="Pessoas economizando dinheiro"
            fill
            className="object-contain"
            priority
          />
        </div>

        <p className="text-sm lg:text-base text-gray-600 text-center leading-relaxed">
          Estamos aqui para te ajudar a organizar, planejar e alcançar seus objetivos financeiros com segurança e
          confiança.
        </p>
      </div>
    </div>
  )
}
