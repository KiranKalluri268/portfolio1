'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import AudioToggle from './AudioToggle';

export default function NavBar() {

  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  return (
    <motion.header
      className="w-full text-white pt-15 pb-0 px-20 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-lg"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      role="banner"
    >
      <h1 className="text-3xl font-bold" id="site-title">
        <a href="#main-content" aria-label="Kiran Kalluri Portfolio - Home" className="outline-none">
          KS
        </a>
      </h1>
      <nav aria-label="Main navigation" role="navigation">
        <ul className="flex space-x-6 text-lg items-center" role="list">
          <motion.li whileHover={{ scale: 1.1 }} role="listitem">
            <a
              href="#main-content"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-gray-400 outline-none px-2 py-1"
              aria-label="Navigate to about section"
            >
              About
            </a>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1 }} role="listitem">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                projectsRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-gray-400 outline-none px-2 py-1"
              aria-label="Navigate to projects section"
            >
              Projects
            </a>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1 }} role="listitem">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                contactRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-gray-400 outline-none px-2 py-1"
              aria-label="Navigate to contact section"
            >
              Contact
            </a>
          </motion.li>

          {/* 👉 Add audio toggle right next to Contact */}
          <li role="listitem">
            <AudioToggle />
          </li>
        </ul>
      </nav>
    </motion.header>
  );
}
