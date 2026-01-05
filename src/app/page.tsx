'use client';

import { useGlobalContext } from '@/context/GlobalContext';
import NavBar from '@/components/NavBar1';
import Hero from '@/components/hero';
import ProjectsSection from '@/components/projects';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import SkillsCarousel from '@/components/SkillsCarousel';
import ContactSection from '@/components/Contact';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorBoundary from '@/components/ErrorBoundary';
import SkipLink from '@/components/SkipLink';
import SceneIndicator from '@/components/SceneIndicator';
import NavigationControls from '@/components/NavigationControls';
import { useAudio } from '@/context/AudioContextProvider';
import { AnimatePresence } from 'framer-motion';

export default function Home() {
  const { currentScene } = useGlobalContext();
  const { audioEnabled } = useAudio();

  return (
    <>
      <ErrorBoundary>
        <LoadingScreen />
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

          <ErrorBoundary>
            <NavigationControls />
          </ErrorBoundary>

          <main id="main-content" aria-label="Main content">
            <AnimatePresence mode="sync">
              {currentScene === 0 && (
                <ErrorBoundary key={0}>
                  <Hero />
                </ErrorBoundary>
              )}
              {currentScene === 1 && (
                <ErrorBoundary key={1}>
                  <ProjectsSection />
                </ErrorBoundary>
              )}
              {currentScene === 2 && (
                <ErrorBoundary key={2}>
                  <ExperienceTimeline />
                </ErrorBoundary>
              )}
              {currentScene === 3 && (
                <ErrorBoundary key={3}>
                  <SkillsCarousel />
                </ErrorBoundary>
              )}
              {currentScene === 4 && (
                <ErrorBoundary key={4}>
                  <ContactSection />
                </ErrorBoundary>
              )}
            </AnimatePresence>
          </main>
        </>
      )}
    </>
  );
}
