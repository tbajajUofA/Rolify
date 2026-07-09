"use client";

import { useEffect, useRef } from "react";

export function useD3Chart<T>(
  render: (container: SVGSVGElement, width: number, height: number) => T | void,
  deps: unknown[]
) {
  const ref = useRef<SVGSVGElement>(null);
  const cleanupRef = useRef<(() => void) | void>();

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    const parent = svg.parentElement;
    if (!parent) return;

    const width = parent.clientWidth;
    const height = parent.clientHeight;

    svg.innerHTML = "";
    cleanupRef.current?.();
    cleanupRef.current = render(svg, width, height) as (() => void) | void;

    return () => {
      cleanupRef.current?.();
      cleanupRef.current = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
