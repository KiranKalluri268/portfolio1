"use client";

interface Skill {
  name: string;
  icon: React.JSX.Element;
}

export default function LoopingRow({
  skills,
  variant = "withName",
  speed = 20, // lower is faster
}: {
  skills: Skill[];
  variant?: "withName" | "iconOnly";
  speed?: number;
}) {
  const animationDuration = `${speed * skills.length*5}s`;

  return (
    <div className="w-full overflow-hidden">
      <div className="relative">
        <div
          className="flex animate-loop min-w-max"
          style={{ animationDuration }}
        >
          {[...skills, ...skills].map((skill, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-center shrink-0 mx-4 ${
                variant === "withName"
                  ? "w-28 h-28 bg-zinc-800 rounded-xl text-sm shadow"
                  : "w-16 h-16"
              }`}
            >
              <div className={`${variant === "withName" ? "text-3xl mb-1" : "text-4xl"}`}>
                {skill.icon}
              </div>
              {variant === "withName" && (
                <span className="text-gray-300 ml-2">{skill.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
