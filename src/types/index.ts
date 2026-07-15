// Shared TypeScript types for the portfolio application

// Scene types
export type SceneIndex = 0 | 1 | 2 | 3 | 4;

// Project types
export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  github?: string;
  live?: string;
}

// Experience types
export interface Experience {
  title: string;
  company: string;
  date: string;
  description: string;
}

// Skill types
export interface Skill {
  name: string;
  icon: React.ReactNode;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

// Form types
export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}

// Social link types
export interface SocialLink {
  name: string;
  url: string;
  svg: React.ReactNode;
}


