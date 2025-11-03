'use client';

import { useGlobalContext } from '@/context/GlobalContext';
import NavBar from '@/components/NavBar1';
import Hero from '@/components/hero';
import ProjectsSection from '@/components/projects';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import SkillsCarousel from '@/components/SkillsCarousel';
import ContactSection from '@/components/Contact';
import AudioPermissionPrompt from '@/components/AudioPermissionPrompt';
import ErrorBoundary from '@/components/ErrorBoundary';
import SkipLink from '@/components/SkipLink';
import SceneIndicator from '@/components/SceneIndicator';
import { useAudio } from '@/context/AudioContextProvider';

export default function Home() {
  const { currentScene } = useGlobalContext();
  const { audioEnabled } = useAudio();

  return (
    <>
      <ErrorBoundary>
        <AudioPermissionPrompt />
      </ErrorBoundary>

      {audioEnabled && (
        <>
          <SkipLink href="#main-content">Skip to main content</SkipLink>
          <SkipLink href="#projects">Skip to projects</SkipLink>
          <SkipLink href="#experience">Skip to experience</SkipLink>
          <SkipLink href="#skills">Skip to skills</SkipLink>
          <SkipLink href="#contact">Skip to contact</SkipLink>
          
          <ErrorBoundary>
            <NavBar />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <SceneIndicator />
          </ErrorBoundary>
          
          <main id="main-content" aria-label="Main content">
            <ErrorBoundary>
              {currentScene === 0 && <Hero />}
            </ErrorBoundary>
            <ErrorBoundary>
              {currentScene === 1 && <ProjectsSection />}
            </ErrorBoundary>
            <ErrorBoundary>
              {currentScene === 2 && <ExperienceTimeline />}
            </ErrorBoundary>
            <ErrorBoundary>
              {currentScene === 3 && <SkillsCarousel />}
            </ErrorBoundary>
            <ErrorBoundary>
              {currentScene === 4 && <ContactSection />}
            </ErrorBoundary>
          </main>
        </>
      )}
    </>
  );
}
