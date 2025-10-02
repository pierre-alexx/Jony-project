"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";

function StepCard({ title, desc, icon }: { title: string; desc: string; icon?: React.ReactNode }) {
  return (
    <div className="relative p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm shadow-lg text-white w-[18rem] text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-white/80 border border-white/30 shadow-sm mb-4 mx-auto text-neutral-700">
        {icon}
      </div>
      <h3 className="font-semibold text-lg" style={{ fontFamily: 'SentinelMedium, ui-sans-serif, system-ui' }}>{title}</h3>
      <p className="mt-2 text-sm text-white/70" style={{ fontFamily: 'SentinelBook, ui-sans-serif, system-ui' }}>{desc}</p>
    </div>
  );
}

function Arrow({ onComplete, active = false }: { onComplete?: () => void; active?: boolean }) {
  // Use a visible default path immediately; swap to fetched path if available
  const defaultPath = "M8 30 H120 L108 20 M120 30 L108 40";
  const [pathD, setPathD] = useState<string>(defaultPath);
  const [viewBox, setViewBox] = useState<string>("0 0 140 60");

  useEffect(() => {
    let isActive = true;
    fetch("/rotated-right-arrow.svg")
      .then((res) => res.text())
      .then((svg) => {
        if (!isActive) return;
        const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
        const vb = doc.documentElement.getAttribute("viewBox");
        const path = doc.querySelector("path");
        if (vb) setViewBox(vb);
        if (path) {
          const d = path.getAttribute("d");
          if (d) setPathD(d);
        }
      })
      .catch(() => {
        // fallback to a simple arrow if fetch fails
        setPathD("M8 30 H120 L108 20 M120 30 L108 40");
      });
    return () => {
      isActive = false;
    };
  }, []);

  return (
    <motion.svg
      width="140"
      height="60"
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      <motion.path
        d={pathD}
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: active ? 0 : 1, opacity: active ? 1 : 0.9 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={active ? { duration: 0.6, ease: "easeInOut" } : { duration: 0 }}
        onAnimationComplete={() => { if (active && onComplete) onComplete(); }}
      />
    </motion.svg>
  );
}

export default function Workflow() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const [sequenceStep, setSequenceStep] = useState<number>(0);
  const [sequenceDone, setSequenceDone] = useState<boolean>(false);

  useEffect(() => {
    if (!inView || sequenceDone || sequenceStep !== 0) return;

    const previousOverflow = document.body.style.overflow;
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };

    // Lock scroll
    document.body.style.overflow = "hidden";
    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });

    // Kick off sequence
    setSequenceStep(1);

    return () => {
      // Safety unlock on unmount
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("wheel", preventDefault as any);
      window.removeEventListener("touchmove", preventDefault as any);
    };
  }, [inView, sequenceDone, sequenceStep]);

  useEffect(() => {
    if (!sequenceDone) return;
    // Unlock scroll at the end
    document.body.style.overflow = "";
    // Remove any lingering handlers just in case
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };
    window.removeEventListener("wheel", preventDefault as any);
    window.removeEventListener("touchmove", preventDefault as any);
  }, [sequenceDone]);

  const stepCommon = {
    transition: { duration: 0.4, ease: "easeOut" },
  } as const;

  return (
    <div ref={ref} className="w-full">
      <div ref={containerRef} className="flex items-center justify-center gap-6 md:gap-10">
        {/* Step 1 */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={sequenceStep >= 1 ? { opacity: 1, x: 0 } : {}}
          transition={stepCommon.transition}
          onUpdate={() => {}}
          onAnimationComplete={() => {
            if (sequenceStep === 1) setSequenceStep(2);
          }}
        >
          <StepCard
            title="Start your project"
            desc="Create from scratch or begin with an existing project. Jony adapts to your workflow."
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>}
          />
        </motion.div>

        {/* Arrow 1 */}
        <Arrow
          key={`arrow1-${sequenceStep === 2 ? 'active' : 'idle'}`}
          active={sequenceStep === 2}
          onComplete={() => {
            if (sequenceStep === 2) setSequenceStep(3);
          }}
        />

        {/* Step 2 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={sequenceStep >= 3 ? { opacity: 1, y: 0 } : {}}
          transition={stepCommon.transition}
          onAnimationComplete={() => {
            if (sequenceStep === 3) setSequenceStep(4);
          }}
        >
          <StepCard
            title="Share your inspiration"
            desc="Upload images, files, or URLs. Jony learns from your references to understand your taste."
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>}
          />
        </motion.div>

        {/* Arrow 2 */}
        <Arrow
          key={`arrow2-${sequenceStep === 4 ? 'active' : 'idle'}`}
          active={sequenceStep === 4}
          onComplete={() => {
            if (sequenceStep === 4) setSequenceStep(5);
          }}
        />

        {/* Step 3 */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={sequenceStep >= 5 ? { opacity: 1, x: 0 } : {}}
          transition={stepCommon.transition}
          onAnimationComplete={() => {
            if (sequenceStep === 5) {
              setSequenceStep(6);
              setSequenceDone(true);
            }
          }}
        >
          <StepCard
            title="Create something beautiful"
            desc="Ask Jony to design or improve your UI. Iterate in chat until it matches your vision perfectly."
            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
          />
        </motion.div>
      </div>
    </div>
  );
}

function ArrowScroll({ pathLengthMV, opacityMV }: { pathLengthMV?: any; opacityMV?: any }) {
  // Deprecated in this refactor (kept to avoid breaking imports elsewhere if any)
  return <div style={{ width: 140, height: 60, opacity: 0 }} />;
}


