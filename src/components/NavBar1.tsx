'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import AudioToggle from './AudioToggle';
import Tooltip from './Tooltip';

export default function NavBar() {

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <motion.header
      className="w-full text-white pt-12 pb-0 px-12 sm:pt-15 sm:pb-0 sm:px-20 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-lg"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      role="banner"
    >
      <h1 className="text-3xl font-bold" id="site-title">
        <a href="#main-content" aria-label="Saikiran Kalluri Portfolio - Home" className="outline-none">
          KS
        </a>
      </h1>
      <nav aria-label="Main navigation" role="navigation">
        <ul className="flex space-x-6 text-lg items-center" role="list">


          {/* 👉 Add audio toggle right next to Contact */}
          <li role="listitem">
            <div
              onMouseEnter={() => setHoveredItem("Audio")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <AudioToggle />
            </div>
          </li>
        </ul>
      </nav>
      <Tooltip text="Audio" isVisible={hoveredItem === "Audio"} />
    </motion.header>
  );
}
