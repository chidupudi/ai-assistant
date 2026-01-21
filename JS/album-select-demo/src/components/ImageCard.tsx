import React, { useState } from 'react';
import { Check, Flag, Maximize2 } from 'lucide-react';
import { Photo } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ImageCardProps {
  photo: Photo;
  onToggleSelect: () => void;
  onToggleFlag: () => void;
}

export function ImageCard({ photo, onToggleSelect, onToggleFlag }: ImageCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "group relative rounded-lg overflow-hidden bg-muted/30 transition-all duration-300",
          "hover:shadow-elevated",
          photo.selected && "ring-2 ring-selected ring-offset-2 ring-offset-background",
          photo.flagged && !photo.selected && "ring-2 ring-flagged ring-offset-2 ring-offset-background"
        )}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {!isLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse-soft" />
          )}
          <img
            src={photo.url}
            alt={photo.filename}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              isLoaded ? "opacity-100" : "opacity-0",
              "group-hover:scale-105"
            )}
            onLoad={() => setIsLoaded(true)}
            loading="lazy"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Status badges */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            {photo.selected && (
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-selected text-selected-foreground shadow-soft animate-check-bounce">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </span>
            )}
            {photo.flagged && (
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-flagged text-flagged-foreground shadow-soft animate-check-bounce">
                <Flag className="w-3 h-3" />
              </span>
            )}
          </div>

          {/* Fullscreen button */}
          <button
            onClick={() => setShowFullscreen(true)}
            className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-background hover:scale-110"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Filename on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-sm font-medium text-primary-foreground truncate">
              {photo.filename}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-2 flex gap-2 justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={onToggleSelect}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
              photo.selected
                ? "bg-selected text-selected-foreground"
                : "bg-background/90 backdrop-blur-sm text-foreground hover:bg-selected hover:text-selected-foreground"
            )}
          >
            <Check className="w-4 h-4" />
            <span>{photo.selected ? 'Selected' : 'Select'}</span>
          </button>
          <button
            onClick={onToggleFlag}
            className={cn(
              "flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
              photo.flagged
                ? "bg-flagged text-flagged-foreground"
                : "bg-background/90 backdrop-blur-sm text-foreground hover:bg-flagged hover:text-flagged-foreground"
            )}
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-background/95 backdrop-blur-md border-none">
          <div className="relative flex items-center justify-center p-4">
            <img
              src={photo.url}
              alt={photo.filename}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            
            {/* Actions in fullscreen */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 bg-background/90 backdrop-blur-sm rounded-full p-2 shadow-elevated">
              <button
                onClick={onToggleSelect}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                  photo.selected
                    ? "bg-selected text-selected-foreground"
                    : "bg-muted text-foreground hover:bg-selected hover:text-selected-foreground"
                )}
              >
                <Check className="w-4 h-4" />
                {photo.selected ? 'Selected' : 'Select'}
              </button>
              <button
                onClick={onToggleFlag}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                  photo.flagged
                    ? "bg-flagged text-flagged-foreground"
                    : "bg-muted text-foreground hover:bg-flagged hover:text-flagged-foreground"
                )}
              >
                <Flag className="w-4 h-4" />
                {photo.flagged ? 'Flagged' : 'Flag'}
              </button>
            </div>

            {/* Filename */}
            <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-sm font-medium">{photo.filename}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
