import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { useProjects } from '@/context/ProjectContext';
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const ClientAccess = () => {
  const navigate = useNavigate();
  const { accessProjectByPin, setCurrentProject, setCurrentFolder } = useProjects();
  const [pin, setPin] = useState('');

  const handleAccess = () => {
    const project = accessProjectByPin(pin);
    if (project) {
      setCurrentProject(project);
      if (project.folders.length > 0) {
        setCurrentFolder(project.folders[0]);
      }
      navigate(`/client/gallery/${project.id}`);
    } else {
      toast.error('Invalid PIN. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBack backTo="/" />

      <main className="container px-4 md:px-6">
        <div className="max-w-md mx-auto py-16 md:py-24">
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Welcome
            </h1>
            <p className="text-muted-foreground">
              Enter the 6-digit PIN provided by your photographer to access your wedding photos.
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>Enter your project PIN</span>
              </div>

              <InputOTP
                maxLength={6}
                value={pin}
                onChange={setPin}
                className="gap-3"
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot
                    index={0}
                    className="w-12 h-14 text-xl font-mono border-border"
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-12 h-14 text-xl font-mono border-border"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-12 h-14 text-xl font-mono border-border"
                  />
                  <InputOTPSlot
                    index={3}
                    className="w-12 h-14 text-xl font-mono border-border"
                  />
                  <InputOTPSlot
                    index={4}
                    className="w-12 h-14 text-xl font-mono border-border"
                  />
                  <InputOTPSlot
                    index={5}
                    className="w-12 h-14 text-xl font-mono border-border"
                  />
                </InputOTPGroup>
              </InputOTP>

              <Button
                variant="hero"
                size="lg"
                className="w-full mt-2"
                onClick={handleAccess}
                disabled={pin.length !== 6}
              >
                Access Gallery
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Demo PIN: <code className="font-mono bg-muted px-2 py-1 rounded">284719</code>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ClientAccess;
