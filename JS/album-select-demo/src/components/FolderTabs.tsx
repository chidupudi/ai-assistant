import React from 'react';
import { Folder as FolderIcon, ImageIcon } from 'lucide-react';
import { Folder } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface FolderTabsProps {
  folders: Folder[];
  activeFolder: Folder | null;
  onSelectFolder: (folder: Folder) => void;
}

export function FolderTabs({ folders, activeFolder, onSelectFolder }: FolderTabsProps) {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex gap-2 min-w-max px-1">
        {folders.map((folder) => {
          const isActive = activeFolder?.id === folder.id;
          const selectedCount = folder.photos.filter(p => p.selected).length;
          const totalCount = folder.photos.length;

          return (
            <button
              key={folder.id}
              onClick={() => onSelectFolder(folder)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200",
                "hover:shadow-soft",
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-card text-foreground border border-border hover:border-primary/30"
              )}
            >
              <FolderIcon className="w-4 h-4" />
              <span>{folder.name}</span>
              <span
                className={cn(
                  "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <ImageIcon className="w-3 h-3" />
                {selectedCount > 0 ? `${selectedCount}/${totalCount}` : totalCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
