"use client";
import './ReviewsStepper.css';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import avatarLucia from "@/assets/images/Home-CrateDiggin2.jpg";
import avatarCarlos from "@/assets/images/Home-CrateDiggin3.jpg";
import avatarDavid from "@/assets/images/avatar.png";
import avatarAna from "@/assets/images/images.jpg";

const reviews = [
  {
    user: "Carlos Martinez.",
    text: "He descubierto más música en una semana que en todo el año. La forma de explorar y conectar con otros melómanos es increíble.",
    rating: 5,
    avatar: avatarCarlos
  },
  {
    user: "Lucía Rueda.",
    text: "Me encanta poder guardar todo lo que escucho y ver las recomendaciones de mis amigos.",
    rating: 5,
    avatar: avatarLucia
  },
  {
    user: "David Castro.",
    text: "Las listas son adictivas. Siempre acabo explorando algo nuevo y descubriendo joyas ocultas que nunca habría encontrado solo.",
    rating: 4,
    avatar: avatarDavid
  },
  {
    user: "Ana Tamariz.",
    text: "Por fin encuentro una app donde puedo escribir lo que pienso de la música sin sentir presión, la seguire usando cada día. Mi voz, mi estilo.",
    rating: 4,
    avatar: avatarAna
  },
];

export default function ReviewsStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const currentReview = reviews[currentStep - 1];

  return (
    <div className="w-full max-w-6xl mx-auto py-20 px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 title-stepper">
          Lo que dice nuestra comunidad
        </h2>
      </div>

      {/* CARD CON NAVEGACIÓN A LOS LADOS */}
      <div className="relative flex items-center gap-6">
        {/* Flecha Izquierda */}
        <Button
          aria-label="Review anterior"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep((prev) => prev - 1)}
          size="icon"
          variant="ghost"
          className="shrink-0 rounded-full hover:bg-neutral-900 text-neutral-400 hover:text-white disabled:opacity-30 transition-colors h-12 w-12"
        >
          <ChevronLeftIcon size={28} />
        </Button>

        {/* CARD */}
        <div className="relative flex-1">
          <div className="relative bg-black border border-neutral-800 rounded-2xl p-8 md:p-12 shadow-xl">
            {/* Avatar and user info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full overflow-hidden border border-orange-400/25">
                {currentReview.avatar && currentReview.avatar.length > 2 ? (
                  <img
                    src={currentReview.avatar}
                    alt={currentReview.user}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-orange-400/15 text-orange-300 font-bold text-lg">
                    {currentReview.avatar}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg">
                  {currentReview.user}
                </h3>
              </div>
              {/* Rating stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    size={18}
                    className={
                      i < currentReview.rating
                        ? "fill-amber-300/70 text-amber-300/70"
                        : "text-neutral-700"
                    }
                  />
                ))}
              </div>
            </div>

            {/* Quote */}
            <div className="relative">
              <svg
                className="absolute -top-2 -left-2 w-8 h-8 text-orange-300/8"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
              </svg>
              <p className="text-xl md:text-2xl text-neutral-200 leading-relaxed pl-6 italic">
                {currentReview.text}
              </p>
            </div>
          </div>
        </div>

        {/* Flecha Derecha */}
        <Button
          aria-label="Siguiente review"
          disabled={currentStep === reviews.length}
          onClick={() => setCurrentStep((prev) => prev + 1)}
          size="icon"
          variant=""
          className="shrink-0 rounded-full hover:bg-neutral-900 text-neutral-400 hover:text-white disabled:opacity-30 transition-colors h-12 w-12"
        >
          <ChevronRightIcon size={20} />
        </Button>
      </div>

      {/* Counter */}
      <div className="text-center mt-10">
        <p className="text-neutral-800 text-sm">
          {currentStep} de {reviews.length}
        </p>
      </div>
    </div>
  );
}