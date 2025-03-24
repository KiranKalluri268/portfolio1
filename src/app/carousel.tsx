"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const projects = [
  { id: 1, title: "Project 1", description: "A brief description of Project 1." },
  { id: 2, title: "Project 2", description: "A brief description of Project 2." },
  { id: 3, title: "Project 3", description: "A brief description of Project 3." },
  { id: 4, title: "Project 4", description: "A brief description of Project 4." },
  { id: 5, title: "Project 5", description: "A brief description of Project 5." },
];

export default function Carousel({ isVisible }: { isVisible: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return; // ✅ Start only when section is visible

    console.log("🚀 Carousel started after scrolling!");

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % projects.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible]); // ✅ Only runs when `isVisible` changes

  return (
    <motion.section 
      className="h-screen w-full flex flex-col justify-center items-center bg-black text-white overflow-hidden relative mt-[-15rem]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h2 className="text-5xl font-bold text-center mb-16 relative z-10">Projects</h2>

      <div className="relative w-full flex justify-center items-center h-[60vh]">
        {projects.map((project, i) => {
          const offset = (i - index + projects.length) % projects.length;

          let xTranslate =
            offset === 0 ? "0%"       
            : offset === 1 ? "34vw"   
            : offset === projects.length - 1 ? "-34vw"  
            : "-34vw";  

          let scale = offset === 0 ? 1.15 : 1;
          let opacity = offset === 0 || offset === 1 ? 1 : offset === projects.length - 1 ? 1 : 0;
          let zIndex = offset === 0 ? 10 : offset === 1 ? 2 : offset === projects.length - 1 ? 3 : 1;

          return (
            <motion.div
              key={project.id}
              className="absolute transition-transform duration-[600ms] ease-in-out"
              animate={{ opacity, scale, x: xTranslate }}
              style={{ zIndex }}
            >
              <div className="w-[30vw] min-h-[55vh] p-10 bg-gray-900 rounded-xl text-center shadow-xl">
                <h3 className="text-3xl font-semibold">{project.title}</h3>
                <p className="text-gray-400 mt-4">{project.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
