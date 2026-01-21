import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, Folder, Photo, mockProjects } from '@/data/mockData';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  currentFolder: Folder | null;
  setCurrentProject: (project: Project | null) => void;
  setCurrentFolder: (folder: Folder | null) => void;
  togglePhotoSelection: (photoId: string) => void;
  togglePhotoFlag: (photoId: string) => void;
  createProject: (name: string, clientName: string, weddingDate: string, folders: string[]) => void;
  addFolder: (projectId: string, folderName: string) => void;
  getSelectedPhotos: (projectId: string) => { folder: Folder; photos: Photo[] }[];
  getTotalSelected: (projectId: string) => number;
  getTotalFlagged: (projectId: string) => number;
  accessProjectByPin: (pin: string) => Project | null;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);

  const togglePhotoSelection = (photoId: string) => {
    if (!currentProject) return;

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== currentProject.id) return project;

        const updatedFolders = project.folders.map((folder) => ({
          ...folder,
          photos: folder.photos.map((photo) =>
            photo.id === photoId ? { ...photo, selected: !photo.selected } : photo
          ),
        }));

        const updatedProject = { ...project, folders: updatedFolders };
        setCurrentProject(updatedProject);
        
        // Update current folder if it contains the photo
        if (currentFolder) {
          const updatedFolder = updatedFolders.find(f => f.id === currentFolder.id);
          if (updatedFolder) setCurrentFolder(updatedFolder);
        }

        return updatedProject;
      })
    );
  };

  const togglePhotoFlag = (photoId: string) => {
    if (!currentProject) return;

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== currentProject.id) return project;

        const updatedFolders = project.folders.map((folder) => ({
          ...folder,
          photos: folder.photos.map((photo) =>
            photo.id === photoId ? { ...photo, flagged: !photo.flagged } : photo
          ),
        }));

        const updatedProject = { ...project, folders: updatedFolders };
        setCurrentProject(updatedProject);
        
        if (currentFolder) {
          const updatedFolder = updatedFolders.find(f => f.id === currentFolder.id);
          if (updatedFolder) setCurrentFolder(updatedFolder);
        }

        return updatedProject;
      })
    );
  };

  const createProject = (name: string, clientName: string, weddingDate: string, folderNames: string[]) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name,
      pin: Math.floor(100000 + Math.random() * 900000).toString(),
      clientName,
      weddingDate,
      createdAt: new Date().toISOString().split('T')[0],
      folders: folderNames.map((fname, index) => ({
        id: `folder-${Date.now()}-${index}`,
        name: fname,
        photos: [],
      })),
    };

    setProjects((prev) => [newProject, ...prev]);
  };

  const addFolder = (projectId: string, folderName: string) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;

        const newFolder: Folder = {
          id: `folder-${Date.now()}`,
          name: folderName,
          photos: [],
        };

        return { ...project, folders: [...project.folders, newFolder] };
      })
    );
  };

  const getSelectedPhotos = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return [];

    return project.folders
      .map((folder) => ({
        folder,
        photos: folder.photos.filter((photo) => photo.selected),
      }))
      .filter((item) => item.photos.length > 0);
  };

  const getTotalSelected = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return 0;

    return project.folders.reduce(
      (total, folder) => total + folder.photos.filter((p) => p.selected).length,
      0
    );
  };

  const getTotalFlagged = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return 0;

    return project.folders.reduce(
      (total, folder) => total + folder.photos.filter((p) => p.flagged).length,
      0
    );
  };

  const accessProjectByPin = (pin: string) => {
    return projects.find((p) => p.pin === pin) || null;
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        currentFolder,
        setCurrentProject,
        setCurrentFolder,
        togglePhotoSelection,
        togglePhotoFlag,
        createProject,
        addFolder,
        getSelectedPhotos,
        getTotalSelected,
        getTotalFlagged,
        accessProjectByPin,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
