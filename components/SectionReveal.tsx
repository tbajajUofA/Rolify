"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type SectionRevealProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionReveal({
  eyebrow,
  title,
  description,
  children,
  className = ""
}: SectionRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0.25, 1, 1, 0.35]);
  const y = useTransform(scrollYProgress, [0, 0.22, 1], [70, 0, -35]);

  return (
    <motion.section ref={ref} style={{ opacity }} className={`section-shell ${className}`}>
      <motion.div style={{ y }} className="section-inner">
        <div className="mb-10 max-w-3xl">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-normal text-white sm:text-6xl">
            {title}
          </h2>
          <p className="mt-5 text-base leading-8 text-white/68 sm:text-lg">{description}</p>
        </div>
        {children}
      </motion.div>
    </motion.section>
  );
}
