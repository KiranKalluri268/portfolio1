"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const projects = [
  {
    id: 1,
    title: "Project 1",
    description: "A brief description of Project 1.",
    image: "/images/project1.png",
    github: "https://cms-pro-kiran-kalluris-projects.vercel.app/",
  },
  {
    id: 2,
    title: "Project 2",
    description: "A brief description of Project 2.",
    image: "/images/project2.jpg",
  },
  {
    id: 3,
    title: "Project 3",
    description: "A brief description of Project 3.",
    image: "/images/project3.jpg",
    github: "https://github.com/yourusername/project3",
  },
  {
    id: 4,
    title: "Project 4",
    description: "A brief description of Project 4.",
    image: "/images/project4.jpg",
  },
  {
    id: 5,
    title: "Project 5",
    description: "A brief description of Project 5.",
    image: "/images/project5.jpg",
    github: "https://github.com/yourusername/project5",
  },
];

export default function Carousel({ isVisible }: { isVisible: boolean }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isVisible || isPaused) return; // Stop when section is not visible OR hovered

    console.log("🚀 Carousel started after scrolling!");

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % projects.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible, isPaused]); // ✅ Stop scrolling when `isPaused` is true

  return (
    <motion.section
      className="h-screen w-full flex flex-col justify-center items-center text-white overflow-hidden relative mt-[-15rem]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h2 className="text-5xl font-bold text-center mb-16 relative z-10">Projects</h2>

      <div className="relative w-full flex justify-center items-center h-[60vh]">
        {projects.map((project, i) => {
          const offset = (i - index + projects.length) % projects.length;

          const xTranslate =
            offset === 0 ? "0%"
            : offset === 1 ? "34vw"
            : offset === projects.length - 1 ? "-34vw"
            : "-34vw";

          const scale = offset === 0 ? 1.15 : 1;
          const opacity = offset === 0 || offset === 1 ? 1 : offset === projects.length - 1 ? 1 : 0;
          const zIndex = offset === 0 ? 10 : offset === 1 ? 2 : offset === projects.length - 1 ? 3 : 1;

          return (
            <motion.a
              key={project.id}
              href={project.github ? project.github : "#"}
              target={project.github ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className={`absolute transition-transform duration-[600ms] ease-in-out w-[30vw] min-h-[55vh] p-10 bg-gray-900 rounded-xl text-center shadow-xl ${
                project.github ? "hover:shadow-[0_0_20px_white]" : ""
              }`}
              animate={{ opacity, scale, x: xTranslate }}
              style={{
                zIndex,
                backgroundImage: `url(${project.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              onMouseEnter={() => setIsPaused(true)}  // ✅ Pause on hover
              onMouseLeave={() => setIsPaused(false)} // ✅ Resume when leaving
            >

              <div className="relative z-10 p-5 text-white">
                <h3 className="text-3xl font-semibold drop-shadow-md">{project.title}</h3>
                <p className="mt-4 drop-shadow-md">{project.description}</p>
              </div>
            </motion.a>
          );
        })}
      </div>
    </motion.section>
  );
}
