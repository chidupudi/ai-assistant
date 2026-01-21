import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Flag, ImageIcon, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { FolderTabs } from '@/components/FolderTabs';
import { ImageCard } from '@/components/ImageCard';
import { useProjects } from '@/context/ProjectContext';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ClientGallery = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const {
    projects,
    currentProject,
    currentFolder,
    setCurrentProject,
    setCurrentFolder,
    togglePhotoSelection,
    togglePhotoFlag,
    getTotalSelected,
    getTotalFlagged,
  } = useProjects();

  const [filter, setFilter] = useState<'all' | 'selected' | 'flagged'>('all');

  useEffect(() => {
    if (projectId) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setCurrentProject(project);
        if (project.folders.length > 0 && !currentFolder) {
          setCurrentFolder(project.folders[0]);
        }
      } else {
        navigate('/client');
      }
    }
  }, [projectId, projects]);

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-soft">Loading your gallery...</div>
      </div>
    );
  }

  const totalSelected = getTotalSelected(currentProject.id);
  const totalFlagged = getTotalFlagged(currentProject.id);

  const filteredPhotos = currentFolder?.photos.filter((photo) => {
    if (filter === 'selected') return photo.selected;
    if (filter === 'flagged') return photo.flagged;
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Header
        showBack
        backTo="/client"
        title={currentProject.name}
        subtitle={`${currentProject.folders.length} folders • ${new Date(currentProject.weddingDate).toLocaleDateString()}`}
      />

      <main className="container px-4 md:px-6 py-4 md:py-6">
        {/* Stats - Mobile friendly */}
        <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-selected/10 text-sm shrink-0">
            <Check className="w-3.5 h-3.5 text-selected" />
            <span className="font-medium">{totalSelected} Selected</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-flagged/10 text-sm shrink-0">
            <Flag className="w-3.5 h-3.5 text-flagged" />
            <span className="font-medium">{totalFlagged} Flagged</span>
          </div>
        </div>

        {/* Folder Tabs - Mobile dropdown on small screens */}
        <div className="hidden sm:block mb-6">
          <FolderTabs
            folders={currentProject.folders}
            activeFolder={currentFolder}
            onSelectFolder={setCurrentFolder}
          />
        </div>

        {/* Mobile folder selector */}
        <div className="sm:hidden mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  {currentFolder?.name || 'Select Folder'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[calc(100vw-2rem)]">
              {currentProject.folders.map((folder) => (
                <DropdownMenuItem
                  key={folder.id}
                  onClick={() => setCurrentFolder(folder)}
                  className={cn(
                    "flex items-center justify-between",
                    currentFolder?.id === folder.id && "bg-primary/10"
                  )}
                >
                  <span>{folder.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {folder.photos.filter(p => p.selected).length}/{folder.photos.length}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: 'All Photos' },
            { key: 'selected', label: 'Selected' },
            { key: 'flagged', label: 'Flagged' },
          ].map((item) => (
            <Button
              key={item.key}
              variant={filter === item.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(item.key as typeof filter)}
            >
              {item.label}
            </Button>
          ))}
        </div>

        {/* Photo Grid - Responsive */}
        {filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <ImageCard
                  photo={photo}
                  onToggleSelect={() => togglePhotoSelection(photo.id)}
                  onToggleFlag={() => togglePhotoFlag(photo.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-medium text-foreground mb-2">
              {filter === 'all' ? 'No Photos Available' : `No ${filter} Photos`}
            </h3>
            <p className="text-sm text-muted-foreground">
              {filter === 'all'
                ? 'Check back later for photos'
                : 'Try changing the filter'}
            </p>
          </div>
        )}
      </main>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background/95 backdrop-blur-sm border-t border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-selected text-selected-foreground flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span className="text-sm font-medium">{totalSelected}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-flagged text-flagged-foreground flex items-center justify-center">
                <Flag className="w-3.5 h-3.5" />
              </span>
              <span className="text-sm font-medium">{totalFlagged}</span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            Auto-saved
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClientGallery;
