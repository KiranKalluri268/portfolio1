// src/context/ProjectViewContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

type ProjectView = "title" | "project" | "seeAll";

type ProjectViewContextType = {
  currentView: ProjectView;
  setCurrentView: (view: ProjectView) => void;
};

const ProjectViewContext = createContext<ProjectViewContextType | undefined>(undefined);

export const ProjectViewProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentView, setCurrentView] = useState<ProjectView>("title");

  return (
    <ProjectViewContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </ProjectViewContext.Provider>
  );
};

export const useProjectView = () => {
  const context = useContext(ProjectViewContext);
  if (!context) throw new Error("useProjectView must be used within ProjectViewProvider");
  return context;
};
