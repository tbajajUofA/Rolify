"use client";

import { motion } from "framer-motion";
import { ALIEN_FORMS, type FormId } from "./omnitrixForms";

type Props = {
  active: FormId;
  onSelect: (id: FormId) => void;
};

const COUNT = ALIEN_FORMS.length;

function hexPosition(index: number, activeIndex: number, radius: number) {
  const angle = ((index - activeIndex) / COUNT) * Math.PI * 2 - Math.PI / 2;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius
  };
}

export function OmnitrixDial({ active, onSelect }: Props) {
  const activeIndex = ALIEN_FORMS.findIndex((f) => f.id === active);
  const activeForm = ALIEN_FORMS[activeIndex];

  return (
    <div className="omnitrix-dial relative flex flex-col items-center gap-4">
      <div className="relative h-[220px] w-[220px] sm:h-[260px] sm:w-[260px]">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-omnitrix-green/40"
          animate={{ rotate: -activeIndex * (360 / COUNT) }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <div className="absolute inset-3 rounded-full border border-omnitrix-green/20" />
          <div className="absolute inset-8 rounded-full border border-omnitrix-hourglass/30" />

          {ALIEN_FORMS.map((form, i) => {
            const pos = hexPosition(i, activeIndex, 88);
            const isActive = form.id === active;

            return (
              <motion.button
                key={form.id}
                type="button"
                onClick={() => onSelect(form.id)}
                className={`omnitrix-slot absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 spotify-focus-ring ${
                  isActive ? "z-10" : "z-0"
                }`}
                style={{ transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))` }}
                animate={{ scale: isActive ? 1.15 : 0.82, opacity: isActive ? 1 : 0.55 }}
                whileHover={{ scale: isActive ? 1.18 : 0.92, opacity: 1 }}
                aria-label={`Transform into ${form.name}`}
                aria-pressed={isActive}
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center clip-hex text-[0.55rem] font-mono uppercase tracking-wider sm:h-12 sm:w-12 sm:text-[0.6rem] ${
                    isActive
                      ? "bg-omnitrix-green text-black shadow-omnitrix-glow"
                      : "bg-omnitrix-panel text-omnitrix-green/80 border border-omnitrix-green/30"
                  }`}
                >
                  {form.codename.split("-")[0]}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-2 border-omnitrix-hourglass/50 bg-black/80 sm:h-20 sm:w-20">
            <span className="font-display text-[0.5rem] uppercase tracking-[0.3em] text-omnitrix-hourglass sm:text-[0.55rem]">
              ◷
            </span>
            <span className="font-mono text-[0.45rem] uppercase tracking-widest text-omnitrix-green/70 sm:text-[0.5rem]">
              dial
            </span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-omnitrix-green/60">
          {activeForm.codename}
        </p>
        <h2 className="font-display text-xl uppercase tracking-wide text-omnitrix-green sm:text-2xl">
          {activeForm.name}
        </h2>
        <p className="mt-1 font-sans text-sm text-white/55">{activeForm.subtitle}</p>
      </div>
    </div>
  );
}
