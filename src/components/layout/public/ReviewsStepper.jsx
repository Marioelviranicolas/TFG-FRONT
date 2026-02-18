"use client";
import './ReviewsStepper.css';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperTrigger,
} from "@/components/ui/stepper";

const reviews = [
  {
    user: "Carlos Martinez.",
    text: "He descubierto más música en una semana que en todo el año. La forma de explorar y conectar con otros melómanos es increíble.",
    rating: 5,
    album: "Random Access Memories",
    artist: "Daft Punk",
    avatar: "CM"
  },
  {
    user: "Lucía Rueda.",
    text: "Me encanta poder guardar todo lo que escucho y ver las recomendaciones de mis amigos. Es como tener mi propia revista musical.",
    rating: 5,
    album: "Currents",
    artist: "Tame Impala",
    avatar: "LR"
  },
  {
    user: "David Castro.",
    text: "Las listas son adictivas. Siempre acabo explorando algo nuevo y descubriendo joyas ocultas que nunca habría encontrado solo.",
    rating: 4,
    album: "In Rainbows",
    artist: "Radiohead",
    avatar: "DK"
  },
  {
    user: "Ana Tamariz.",
    text: "Por fin encuentro una app donde puedo escribir lo que pienso de la música sin sentir presión, la seguire usando cada día. Mi voz, mi estilo.",
    rating: 4,
    album: "Melodrama",
    artist: "Lorde",
    avatar: "AT"
  },
];

export default function ReviewsStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const currentReview = reviews[currentStep - 1];

  return (

    <div className="w-full max-w-4xl mx-auto py-20 px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 title-stepper title-stepper">
          Lo que dice nuestra comunidad
        </h2>
      </div>

      {/* CARD */}
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
        
        <div className="relative bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 rounded-2xl p-8 md:p-12 shadow-2xl">
          {/* Avatar and user info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {currentReview.avatar}
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg">
                {currentReview.user}
              </h3>
              <p className="text-neutral-500 text-sm">
              </p>
            </div>
            {/* Rating stars */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  size={18}
                  className={
                    i < currentReview.rating
                      ? "fill-amber-500 text-amber-500"
                      : "text-neutral-700"
                  }
                />
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="relative">
            <svg
              className="absolute -top-2 -left-2 w-8 h-8 text-orange-500/20"
              fill="currentColor"
              viewBox="0 0 32 32"
            >
              <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
            </svg>
            <p className="text-xl md:text-2xl text-white leading-relaxed pl-6 italic">
              {currentReview.text}
            </p>
          </div>

          {/* Album info */}
          <div className="mt-6 pt-6 border-t border-neutral-800">
            <div className="flex items-center gap-3 text-sm">
              
            </div>
          </div>
        </div>
      </div>

      {/* STEPPER CONTROLS */}
      <div className="flex items-center gap-3 mt-8 max-w-md mx-auto">
        <Button
          aria-label="Review anterior"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep((prev) => prev - 1)}
          size="icon"
          variant="ghost"
          className="rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 transition-all"
        >
          <ChevronLeftIcon size={20} />
        </Button>

        <Stepper
          className="gap-2 w-full"
          value={currentStep}
          onValueChange={setCurrentStep}
        >
          {reviews.map((_, index) => (
            <StepperItem key={index} step={index + 1} className="flex-1">
              <StepperTrigger asChild className="w-full">
                <button className="w-full">
                  <StepperIndicator className="h-8 w-full bg-neutral-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-black-500 data-[state=active]:to-amber-500 data-[state=completed]:bg-orange-500/50 rounded-full transition-all duration-300 hover:bg-neutral-700" />
                </button>
              </StepperTrigger>
            </StepperItem>
          ))}
        </Stepper>

        <Button
          aria-label="Siguiente review"
          disabled={currentStep === reviews.length}
          onClick={() => setCurrentStep((prev) => prev + 1)}
          size="icon"
          variant="ghost"
          className="rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 transition-all"
        >
          <ChevronRightIcon size={20} />
        </Button>
      </div>

      {/* Counter */}
      <div className="text-center mt-6">
        <p className="text-neutral-500 text-sm">
          {currentStep} de {reviews.length}
        </p>
      </div>
    </div>
  );
}