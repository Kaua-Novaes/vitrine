import React from "react";
import { TestimonialResponse } from "@/types/api";
import { Quote, Star } from "lucide-react";

interface TestimonialSectionProps {
  testimonials: TestimonialResponse[];
}

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            Depoimentos
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
            O que nossos clientes dizem
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-8 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-blue-400/40 mb-3" />
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between">
                <span className="font-bold text-sm text-white">{t.name}</span>
                <span className="text-xs text-blue-400">Cliente Verificado</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
