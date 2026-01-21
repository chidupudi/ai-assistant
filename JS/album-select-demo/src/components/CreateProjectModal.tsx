import React, { useState } from 'react';
import { X, Plus, Folder, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, clientName: string, weddingDate: string, folders: string[]) => void;
}

export function CreateProjectModal({ open, onClose, onCreate }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [folders, setFolders] = useState(['Sangeeth', 'Muhurtham', 'Reception']);
  const [newFolder, setNewFolder] = useState('');

  const handleAddFolder = () => {
    if (newFolder.trim() && !folders.includes(newFolder.trim())) {
      setFolders([...folders, newFolder.trim()]);
      setNewFolder('');
    }
  };

  const handleRemoveFolder = (index: number) => {
    setFolders(folders.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && clientName && weddingDate && folders.length > 0) {
      onCreate(name, clientName, weddingDate, folders);
      // Reset form
      setName('');
      setClientName('');
      setWeddingDate('');
      setFolders(['Sangeeth', 'Muhurtham', 'Reception']);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Create New Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Lakshmi & Arjun Wedding"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Lakshmi Iyer"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weddingDate">Wedding Date</Label>
            <Input
              id="weddingDate"
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Event Folders</Label>
            <div className="flex flex-wrap gap-2">
              {folders.map((folder, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm font-medium group"
                >
                  <Folder className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{folder}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFolder(index)}
                    className="ml-1 p-0.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
                placeholder="Add new folder..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFolder())}
              />
              <Button type="button" variant="secondary" onClick={handleAddFolder}>
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="hero">
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
