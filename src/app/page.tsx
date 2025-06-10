'use client';

import { useGlobalContext } from '@/context/GlobalContext';
import Hero from '@/components/hero';
import ProjectsSection from '@/components/projects';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import SkillsCarousel from '@/components/SkillsCarousel';
import ContactSection from '@/components/Contact';
import AudioPermissionPrompt from '@/components/AudioPermissionPrompt';
import { useAudio } from '@/context/AudioContextProvider';

export default function Home() {
  const { currentScene } = useGlobalContext();
  const { audioEnabled } = useAudio();

  return (
    <>
      <AudioPermissionPrompt />

      {audioEnabled && (
        <>
          {currentScene === 0 && <Hero />}
          {currentScene === 1 && <ProjectsSection />}
          {currentScene === 2 && <ExperienceTimeline />}
          {currentScene === 3 && <SkillsCarousel />}
          {currentScene === 4 && <ContactSection />}
        </>
      )}
    </>
  );
}
