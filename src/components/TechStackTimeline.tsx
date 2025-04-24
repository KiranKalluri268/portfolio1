"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FaReact, FaNodeJs, FaAws } from "react-icons/fa";
import { SiMongodb, SiTailwindcss, SiTypescript } from "react-icons/si";

const skills = [
  {
    icon: <FaReact className="text-sky-400" />,
    name: "React",
    description: "Frontend library for building UIs.",
  },
  {
    icon: <SiTypescript className="text-blue-500" />,
    name: "TypeScript",
    description: "Typed superset of JavaScript.",
  },
  {
    icon: <SiTailwindcss className="text-teal-400" />,
    name: "Tailwind CSS",
    description: "Utility-first CSS framework.",
  },
  {
    icon: <FaNodeJs className="text-green-500" />,
    name: "Node.js",
    description: "JavaScript runtime for server-side development.",
  },
  {
    icon: <SiMongodb className="text-green-600" />,
    name: "MongoDB",
    description: "NoSQL database for modern apps.",
  },
  {
    icon: <FaAws className="text-orange-500" />,
    name: "AWS",
    description: "Cloud services for deployment and scalability.",
  },
];

export default function TechStackTimeline() {
  return (
    <section id="tech-stack" className="py-24 px-6 bg-gray-950 text-white">
      <h2 className="text-4xl font-bold text-center mb-12">Tech Stack</h2>
      <div className="relative border-l-2 border-gray-700 ml-6 space-y-16">
        {skills.map((skill, index) => (
          <TimelineItem key={index} skill={skill} />
        ))}
      </div>
    </section>
  );
}

function TimelineItem({ skill }: { skill: (typeof skills)[0] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="relative pl-10"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="absolute left-[-18px] top-1 w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-900" />
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-md">
        <div className="flex items-center gap-4">
          <div className="text-3xl">{skill.icon}</div>
          <h3 className="text-xl font-semibold">{skill.name}</h3>
        </div>
        <p className="mt-3 text-gray-300">{skill.description}</p>
      </div>
    </motion.div>
  );
}
