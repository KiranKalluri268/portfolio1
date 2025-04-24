import LoopingRow from "./LoopingRow";
import {
  FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaPython, FaJava, FaDatabase, FaGitAlt,
} from "react-icons/fa";
import {
  SiTailwindcss, SiMongodb, SiMysql, SiTypescript, SiJavascript, SiExpress,
} from "react-icons/si";

const skillCategories = [
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: <FaReact /> },
      { name: "Tailwind", icon: <SiTailwindcss /> },
      { name: "HTML", icon: <FaHtml5 /> },
      { name: "CSS", icon: <FaCss3Alt /> },
      { name: "JavaScript", icon: <SiJavascript /> },
      { name: "TypeScript", icon: <SiTypescript /> },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: <FaNodeJs /> },
      { name: "Express", icon: <SiExpress /> },
      { name: "Git", icon: <FaGitAlt /> },
    ],
  },
  {
    title: "Database",
    skills: [
      { name: "MongoDB", icon: <SiMongodb /> },
      { name: "MySQL", icon: <SiMysql /> },
      { name: "Database", icon: <FaDatabase /> },
    ],
  },
  {
    title: "Programming Languages",
    skills: [
      { name: "Python", icon: <FaPython /> },
      { name: "Java", icon: <FaJava /> },
    ],
  },
];

export default function SkillsCarousel() {
  return (
    <section className="py-12 space-y-10">
      {skillCategories.map((cat, idx) => (
        <div key={idx}>
          <h3 className="text-xl font-semibold mb-4 text-center">{cat.title}</h3>
          <LoopingRow skills={cat.skills} variant="withName" speed={0.7 + idx * 0.2} />
        </div>
      ))}
    </section>
  );
}
