// src/components/ApproachSection.tsx
import React from 'react';
import { defaultTherapistConfig } from '../config/therapist';
import { CheckCircle2, Brain } from 'lucide-react';

export default function ApproachSection() {
  const { approach } = defaultTherapistConfig;

  return (
    <section className="py-8 md:py-10 bg-emerald-50/50 border-y border-emerald-100/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 md:p-6">
          
          {/* Cabeçalho do Card */}
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-100/80 text-emerald-800 rounded-xl">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">
                Metodologia de Atendimento
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                {approach.title}
              </h2>
            </div>
          </div>

          {/* Descrição Principal */}
          <p className="text-slate-650 leading-relaxed text-xs sm:text-sm mb-4">
            {approach.description}
          </p>

          {/* Tópicos em Destaque */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
            {approach.topics.map((topic, index) => (
              <div key={index} className="flex items-start gap-2 bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium text-xs leading-snug">
                  {topic}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}