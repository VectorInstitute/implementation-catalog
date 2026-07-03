"use client";

import { motion } from "framer-motion";
import { ArrowDown, TrendingUp, Layers } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { getAssetPath } from "@/lib/utils";

interface HeroProps {
  totalImplementations: number;
  yearsOfResearch: number;
}

/** CSS custom property consumed by the `.reveal` animation in globals.css. */
function revealDelay(seconds: number): CSSProperties {
  return { "--reveal-delay": `${seconds}s` } as CSSProperties;
}

export default function Hero({ totalImplementations, yearsOfResearch }: HeroProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Sophisticated gradient background with layered blobs */}
      {/* Large ambient blob - top left */}
      <motion.div
        className="absolute -top-48 -left-48 w-[900px] h-[900px]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(235, 8, 138, 0.12) 0%, rgba(235, 8, 138, 0.08) 35%, rgba(235, 8, 138, 0.04) 60%, transparent 80%)',
          filter: 'blur(60px)',
          borderRadius: '63% 37% 54% 46% / 55% 48% 52% 45%',
        }}
        animate={{
          borderRadius: [
            '63% 37% 54% 46% / 55% 48% 52% 45%',
            '40% 60% 48% 52% / 45% 55% 45% 55%',
            '58% 42% 55% 45% / 48% 52% 45% 55%',
            '63% 37% 54% 46% / 55% 48% 52% 45%',
          ],
          x: [0, 40, -20, 0],
          y: [0, 30, -15, 0],
          scale: [1, 1.08, 0.98, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: [0.45, 0.05, 0.55, 0.95],
        }}
      />

      {/* Medium accent blob - bottom right */}
      <motion.div
        className="absolute -bottom-32 -right-32 w-[800px] h-[800px]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(49, 60, 255, 0.10) 0%, rgba(49, 60, 255, 0.06) 35%, rgba(49, 60, 255, 0.03) 60%, transparent 80%)',
          filter: 'blur(65px)',
          borderRadius: '45% 55% 52% 48% / 48% 55% 45% 52%',
        }}
        animate={{
          borderRadius: [
            '45% 55% 52% 48% / 48% 55% 45% 52%',
            '55% 45% 48% 52% / 52% 48% 52% 48%',
            '48% 52% 58% 42% / 55% 45% 48% 52%',
            '45% 55% 52% 48% / 48% 55% 45% 52%',
          ],
          x: [0, -35, 20, 0],
          y: [0, 25, -30, 0],
          scale: [1, 0.96, 1.06, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: [0.45, 0.05, 0.55, 0.95],
          delay: 0.5,
        }}
      />

      {/* Central flowing blob */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(235, 8, 138, 0.08) 0%, rgba(49, 60, 255, 0.06) 40%, rgba(235, 8, 138, 0.03) 60%, transparent 80%)',
          filter: 'blur(70px)',
          borderRadius: '52% 48% 45% 55% / 55% 45% 55% 45%',
        }}
        animate={{
          borderRadius: [
            '52% 48% 45% 55% / 55% 45% 55% 45%',
            '48% 52% 55% 45% / 45% 55% 48% 52%',
            '55% 45% 50% 50% / 52% 48% 45% 55%',
            '52% 48% 45% 55% / 55% 45% 55% 45%',
          ],
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.05, 0.98, 1.02, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: [0.42, 0, 0.58, 1],
        }}
      />

      {/* Subtle accent blob - top right */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(49, 60, 255, 0.08) 0%, rgba(49, 60, 255, 0.04) 50%, transparent 75%)',
          filter: 'blur(50px)',
          borderRadius: '58% 42% 48% 52% / 52% 55% 45% 48%',
        }}
        animate={{
          borderRadius: [
            '58% 42% 48% 52% / 52% 55% 45% 48%',
            '45% 55% 55% 45% / 48% 52% 55% 45%',
            '58% 42% 48% 52% / 52% 55% 45% 48%',
          ],
          x: [0, 25, 0],
          y: [0, -20, 0],
          scale: [1, 1.04, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: [0.65, 0, 0.35, 1],
          delay: 1,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Logo */}
        <div className="reveal reveal-down mb-8 flex justify-center" style={revealDelay(0)}>
          <Image
            src={getAssetPath("vector-logo.svg")}
            alt="Vector Institute"
            width={140}
            height={46}
            className="object-contain"
          />
        </div>

        {/* Title */}
        <h1
          className="reveal reveal-up text-5xl md:text-7xl font-bold mb-6 text-gray-900 leading-tight"
          style={revealDelay(0.2)}
        >
          Implementation <span className="bg-gradient-to-r from-vector-magenta to-vector-cobalt bg-clip-text text-transparent">Catalog</span>
        </h1>

        {/* Subtitle */}
        <p
          className="reveal reveal-up text-lg md:text-xl mb-12 text-gray-800 max-w-3xl mx-auto leading-relaxed font-medium"
          style={revealDelay(0.4)}
        >
          Explore cutting-edge AI implementations from Vector Institute researchers and engineers
        </p>

        {/* Stats */}
        <div
          className="reveal reveal-up flex flex-wrap justify-center gap-8 md:gap-16 mb-12"
          style={revealDelay(0.6)}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-vector-magenta/10 rounded-xl border border-vector-magenta/30">
              <Layers className="w-6 h-6 text-vector-magenta" />
            </div>
            <div className="text-left">
              <div className="text-3xl md:text-4xl font-bold text-gray-900">{totalImplementations}</div>
              <div className="text-sm text-gray-700 uppercase tracking-wide font-semibold">Implementations</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-vector-cobalt/10 rounded-xl border border-vector-cobalt/30">
              <TrendingUp className="w-6 h-6 text-vector-cobalt" />
            </div>
            <div className="text-left">
              <div className="text-3xl md:text-4xl font-bold text-gray-900">{yearsOfResearch}</div>
              <div className="text-sm text-gray-700 uppercase tracking-wide font-semibold">Years of Research</div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <a
          href="#browse"
          className="reveal reveal-scale inline-flex items-center gap-2 bg-gradient-to-r from-vector-magenta to-vector-cobalt hover:from-vector-magenta/90 hover:to-vector-cobalt/90 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg shadow-vector-magenta/25 transition-all hover:scale-105 active:scale-95 mb-8"
          style={revealDelay(0.8)}
        >
          Browse Implementations
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </a>

        {/* Search Bar in Hero */}
        <div className="reveal reveal-up max-w-2xl mx-auto" style={revealDelay(1)}>
          <div id="hero-search" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="reveal absolute bottom-8 left-1/2 -translate-x-1/2" style={revealDelay(1.2)}>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-400"
        >
          <ArrowDown className="w-6 h-6" />
        </motion.div>
      </div>
    </div>
  );
}
