'use client';

import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const menu = [
    { id: 1, name: 'Home', path: '/home' },
    { id: 2, name: 'About', path: '/about' },
    { id: 3, name: 'My History', path: '/history' },
    { id: 4, name: 'Features', path: '/features' },
    { id: 5, name: 'Contact', path: '/contact' },
    { id: 6, name: 'Profile', path: '/profile' }
  ];

  const desktopNavVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: 'easeOut'
      }
    })
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-16 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <h1 className="text-lg font-bold md:text-2xl tracking-wide">Health Voice</h1>
        </div>

        {/* Desktop Nav with framer-motion */}
        <nav className="hidden md:flex gap-8 items-center">
          {menu.map((item, index) => (
            <motion.div
              key={item.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={desktopNavVariants}
            >
              <Link href={item.path}>
                <span
                  className={`text-sm md:text-base font-medium transition-colors duration-200 cursor-pointer
                  ${pathname === item.path ? 'text-purple-400' : 'text-zinc-300 hover:text-purple-400'}`}
                >
                  {item.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* User + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
          <button
            className="md:hidden text-zinc-300 hover:text-purple-400 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-zinc-900 border-t border-zinc-800"
          >
            <div className="flex flex-col px-6 py-4 space-y-3">
              {menu.map((item) => (
                <Link key={item.id} href={item.path}>
                  <span
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-sm font-medium transition-colors duration-200 cursor-pointer
                    ${pathname === item.path ? 'text-purple-400' : 'text-zinc-300 hover:text-purple-400'}`}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
