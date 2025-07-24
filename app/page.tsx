'use client';

import { motion } from 'framer-motion';
import FeatureBentoGrid from './_components/FeatureBentoGrid';
import Navbar from './_components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col items-center justify-start overflow-hidden">
      <Navbar />

      {/* Grid Glow Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-y-0 left-0 w-px bg-neutral-700/50">
          <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-y-0 right-0 w-px bg-neutral-700/50">
          <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-neutral-700/50">
          <div className="absolute mx-auto w-40 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="z-10 px-6 pt-24 pb-16 text-center max-w-4xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white tracking-tight">
          {"Elevate healthcare delivery using AI-driven voice technology"
            .split(" ")
            .map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-lg text-neutral-400"
        >
          Speak your symptoms, and receive instant recommendations based on global health standards.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link href="/sign-in">
            <button className="w-60 transform rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-blue-700">
              🎙️ Start Voice Session
            </button>
          </Link>
          <button className="w-60 transform rounded-xl border border-gray-600 bg-transparent px-6 py-3 font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-gray-700">
            Contact Support
          </button>
        </motion.div>
      </div>

      <FeatureBentoGrid />
    </div>
  );
}
