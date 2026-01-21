import React from 'react';
import { Download, Check, ImageIcon, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Folder, Photo } from '@/data/mockData';

interface SelectionSummaryProps {
  selectedByFolder: { folder: Folder; photos: Photo[] }[];
  projectName: string;
}

export function SelectionSummary({ selectedByFolder, projectName }: SelectionSummaryProps) {
  const totalSelected = selectedByFolder.reduce((sum, item) => sum + item.photos.length, 0);

  const handleDownloadTxt = () => {
    let content = `# Selected Photos for ${projectName}\n`;
    content += `# Generated on ${new Date().toLocaleDateString()}\n`;
    content += `# Total: ${totalSelected} photos\n\n`;

    selectedByFolder.forEach(({ folder, photos }) => {
      content += `${folder.name}/\n`;
      photos.forEach((photo) => {
        content += `  ${photo.filename}\n`;
      });
      content += '\n';
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}_selections.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (totalSelected === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-display text-lg font-medium text-foreground mb-2">
          No Photos Selected Yet
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Selected photos will appear here. Share the PIN with your clients so they can start selecting.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold text-foreground">
            Selected Photos
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {totalSelected} photo{totalSelected !== 1 ? 's' : ''} across {selectedByFolder.length} folder{selectedByFolder.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleDownloadTxt} variant="hero">
          <Download className="w-4 h-4" />
          Download TXT
        </Button>
      </div>

      {/* Folder groups */}
      <div className="space-y-4">
        {selectedByFolder.map(({ folder, photos }) => (
          <div
            key={folder.id}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 border-b border-border">
              <FolderOpen className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">{folder.name}</span>
              <span className="text-sm text-muted-foreground">
                ({photos.length} photo{photos.length !== 1 ? 's' : ''})
              </span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
                  >
                    <img
                      src={photo.url}
                      alt={photo.filename}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs text-primary-foreground truncate font-medium">
                        {photo.filename}
                      </p>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-selected text-selected-foreground">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
