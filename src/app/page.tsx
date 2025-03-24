"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Hero from "./hero";
import Carousel from "./carousel";

export default function Home() {
  const { ref, inView } = useInView({
    triggerOnce: false, // ✅ Keeps checking until user actually sees the section
    threshold: 0.5, // ✅ Triggers only when at least 50% of the section is visible
  });

  console.log("Projects Section Visible:", inView); // ✅ Debugging log

  return (
    <div className="bg-black text-white flex flex-col min-h-screen">
      {/* Header */}
      <motion.header
        className="w-full bg-black text-white pt-6 pb-0 px-6 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-lg"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-bold">KS</h1>
        <nav>
          <ul className="flex space-x-6 text-lg">
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="#about" className="hover:text-gray-400">About</a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="#projects" className="hover:text-gray-400">Projects</a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <a href="#contact" className="hover:text-gray-400">Contact</a>
            </motion.li>
          </ul>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <Hero />

      {/* Projects Section (Only Appears When Scrolled) */}
      <div ref={ref} id="projects" className="min-h-screen flex items-center justify-center">
        {inView && <Carousel isVisible={inView} />} {/* ✅ Starts only when inView is true */}
      </div>

      {/* Contact Section */}
      <motion.section
        id="contact"
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold">Contact Me</h2>
        <p className="text-gray-400 mt-4">Feel free to reach out!</p>
        <motion.a
          href="mailto:your.email@example.com"
          className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          whileHover={{ scale: 1.1 }}
        >
          Say Hello 👋
        </motion.a>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="w-full bg-black text-gray-500 text-sm py-4 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        © {new Date().getFullYear()} Kiran. All Rights Reserved.
      </motion.footer>
    </div>
  );
}
