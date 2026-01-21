import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  showBack?: boolean;
  backTo?: string;
  title?: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
}

export function Header({ showBack, backTo = '/', title, subtitle, rightContent }: HeaderProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          {showBack && (
            <Link to={backTo}>
              <Button variant="ghost" size="icon-sm">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          )}

          {isHome ? (
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="Datenwork Solutions"
                className="h-9 w-auto transition-transform group-hover:scale-105"
              />
              <span className="font-display text-xl font-semibold tracking-tight">
                Datenwork Solutions
              </span>
            </Link>
          ) : (
            <div>
              {title && (
                <h1 className="font-display text-lg font-semibold text-foreground leading-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {rightContent}
          {isHome && (
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/studio">
                <Button variant="ghost">Studio</Button>
              </Link>
              <Link to="/client">
                <Button variant="hero">Client Access</Button>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
