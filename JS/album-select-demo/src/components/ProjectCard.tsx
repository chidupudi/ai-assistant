import React from 'react';
import { Calendar, Folder, ImageIcon, Users, ChevronRight, Lock } from 'lucide-react';
import { Project } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const totalPhotos = project.folders.reduce((sum, f) => sum + f.photos.length, 0);
  const selectedPhotos = project.folders.reduce(
    (sum, f) => sum + f.photos.filter((p) => p.selected).length,
    0
  );

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-5 rounded-xl bg-card border border-border",
        "transition-all duration-300 hover:shadow-elevated hover:border-primary/20",
        "group animate-fade-in"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>{project.clientName}</span>
          </div>
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.folders.slice(0, 3).map((folder) => (
          <span
            key={folder.id}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground"
          >
            <Folder className="w-3 h-3" />
            {folder.name}
          </span>
        ))}
        {project.folders.length > 3 && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
            +{project.folders.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(project.weddingDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{selectedPhotos}/{totalPhotos} selected</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="w-3 h-3" />
          <span className="font-mono">{project.pin}</span>
        </div>
      </div>
    </button>
  );
}
