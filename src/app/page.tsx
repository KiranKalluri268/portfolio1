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
import SceneWrapper from '@/components/SceneWrapper';

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
                <SceneWrapper key={0} index={0}>
                  <ErrorBoundary>
                    <Hero />
                  </ErrorBoundary>
                </SceneWrapper>
              )}
              {currentScene === 1 && (
                <SceneWrapper key={1} index={1}>
                  <ErrorBoundary>
                    <ProjectsSection />
                  </ErrorBoundary>
                </SceneWrapper>
              )}
              {currentScene === 2 && (
                <SceneWrapper key={2} index={2}>
                  <ErrorBoundary>
                    <ExperienceTimeline />
                  </ErrorBoundary>
                </SceneWrapper>
              )}
              {currentScene === 3 && (
                <SceneWrapper key={3} index={3}>
                  <ErrorBoundary>
                    <SkillsCarousel />
                  </ErrorBoundary>
                </SceneWrapper>
              )}
              {currentScene === 4 && (
                <SceneWrapper key={4} index={4}>
                  <ErrorBoundary>
                    <ContactSection />
                  </ErrorBoundary>
                </SceneWrapper>
              )}
            </AnimatePresence>
          </main>
        </>
      )}
    </>
  );
}
