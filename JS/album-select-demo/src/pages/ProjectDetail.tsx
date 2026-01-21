import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Check, FolderPlus, ImageIcon, Eye, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/Header';
import { FolderTabs } from '@/components/FolderTabs';
import { ImageCard } from '@/components/ImageCard';
import { SelectionSummary } from '@/components/SelectionSummary';
import { useProjects } from '@/context/ProjectContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ProjectDetail = () => {
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
    getSelectedPhotos,
    getTotalSelected,
    getTotalFlagged,
    addFolder,
  } = useProjects();

  const [copied, setCopied] = useState(false);
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [activeTab, setActiveTab] = useState('photos');

  useEffect(() => {
    if (projectId) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setCurrentProject(project);
        if (project.folders.length > 0 && !currentFolder) {
          setCurrentFolder(project.folders[0]);
        }
      } else {
        navigate('/studio');
      }
    }
  }, [projectId, projects]);

  const handleCopyPin = () => {
    if (currentProject) {
      navigator.clipboard.writeText(currentProject.pin);
      setCopied(true);
      toast.success('PIN copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddFolder = () => {
    if (newFolderName.trim() && currentProject) {
      addFolder(currentProject.id, newFolderName.trim());
      setNewFolderName('');
      setShowAddFolder(false);
      toast.success(`Folder "${newFolderName}" created`);
    }
  };

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-soft">Loading...</div>
      </div>
    );
  }

  const selectedPhotos = getSelectedPhotos(currentProject.id);
  const totalSelected = getTotalSelected(currentProject.id);
  const totalFlagged = getTotalFlagged(currentProject.id);

  return (
    <div className="min-h-screen bg-background">
      <Header
        showBack
        backTo="/studio"
        title={currentProject.name}
        subtitle={currentProject.clientName}
        rightContent={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyPin}
              className="hidden sm:flex"
            >
              {copied ? (
                <Check className="w-4 h-4 text-selected" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span className="font-mono">{currentProject.pin}</span>
            </Button>
          </div>
        }
      />

      <main className="container px-4 md:px-6 py-6">
        {/* Stats Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-selected/10">
            <Check className="w-4 h-4 text-selected" />
            <span className="text-sm font-medium">
              {totalSelected} Selected
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-flagged/10">
            <Eye className="w-4 h-4 text-flagged" />
            <span className="text-sm font-medium">{totalFlagged} Flagged</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAddFolder(true)}
            >
              <FolderPlus className="w-4 h-4" />
              Add Folder
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Photos
            </TabsTrigger>
            <TabsTrigger value="selections" className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Selections
              {totalSelected > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-selected text-selected-foreground">
                  {totalSelected}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="photos" className="space-y-6">
            {/* Folder Tabs */}
            <FolderTabs
              folders={currentProject.folders}
              activeFolder={currentFolder}
              onSelectFolder={setCurrentFolder}
            />

            {/* Photo Grid */}
            {currentFolder && currentFolder.photos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {currentFolder.photos.map((photo) => (
                  <ImageCard
                    key={photo.id}
                    photo={photo}
                    onToggleSelect={() => togglePhotoSelection(photo.id)}
                    onToggleFlag={() => togglePhotoFlag(photo.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-medium text-foreground mb-2">
                  {currentFolder ? 'No Photos in This Folder' : 'Select a Folder'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentFolder
                    ? 'Upload photos to this folder to get started'
                    : 'Choose a folder from the tabs above'}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="selections">
            <SelectionSummary
              selectedByFolder={selectedPhotos}
              projectName={currentProject.name}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Folder Dialog */}
      <Dialog open={showAddFolder} onOpenChange={setShowAddFolder}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Add New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name (e.g., Cocktail Hour)"
              onKeyPress={(e) => e.key === 'Enter' && handleAddFolder()}
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddFolder(false)}>
                Cancel
              </Button>
              <Button variant="hero" onClick={handleAddFolder}>
                Create Folder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetail;
