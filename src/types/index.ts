// Shared TypeScript types for the portfolio application

// Scene types
export type SceneIndex = 0 | 1 | 2 | 3 | 4;

export interface Scene {
  index: SceneIndex;
  name: string;
}

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

// Animation types
export type AnimationDirection = "up" | "down";

export interface AnimationConfig {
  duration: number;
  easing: string;
}

// Social link types
export interface SocialLink {
  name: string;
  url: string;
  svg: React.ReactNode;
}

// Particle types for background effects
export interface ParticleConfig {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  z: number;
  canvasWidth: number;
  canvasHeight: number;
}

// Star types for starfield
export interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: number;
  isStatic: boolean;
  twinkleOffset: number;
  color: string;
  shape: "circle" | "spike";
  spikes?: number;
  lengths?: number[];
}

