import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Users, ImageIcon, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-warm opacity-50" />
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative container px-4 md:px-6 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Streamline Your Photo Selection
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Beautiful Wedding Albums,{' '}
              <span className="text-primary">Effortlessly Curated</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              The elegant way for photo studios and clients to collaborate on selecting
              the perfect photos for their wedding album. A demo by <strong>Datenwork Solutions</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/studio">
                <Button variant="hero" size="xl" className="group">
                  <Camera className="w-5 h-5" />
                  Studio Dashboard
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/client">
                <Button variant="outline" size="xl">
                  <Users className="w-5 h-5" />
                  Client Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A seamless workflow for studios and clients alike
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: 'Studios Create Projects',
                description: 'Organize photos by event folders like Sangeeth, Muhurtham, and Reception. Share a simple PIN with your clients.',
              },
              {
                icon: ImageIcon,
                title: 'Clients Select Photos',
                description: 'Easy-to-use gallery with select and flag options. Mobile-friendly for comfortable browsing sessions.',
              },
              {
                icon: CheckCircle,
                title: 'Export Selections',
                description: 'View all selected photos at a glance and export the list as a TXT file for easy album preparation.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-card border border-border hover:shadow-elevated hover:border-primary/20 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5 border-t border-border">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              This is a demo showcasing custom web solutions by Datenwork Solutions.
              Explore the features or contact us for your own custom application.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/studio">
                <Button variant="hero" size="lg">
                  Enter Studio
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <div className="text-sm text-muted-foreground">
                Demo PIN: <code className="font-mono bg-muted px-2 py-1 rounded">284719</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Datenwork Solutions" className="h-8 w-auto" />
                <span className="font-display font-semibold text-lg">Datenwork Solutions</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Custom IT Solutions & Web Development
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-3">Contact Us</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>📞 <a href="tel:8008085560" className="hover:text-primary transition-colors">8008085560</a></p>
                <p>🌐 <a href="https://solutions.datenwork.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">solutions.datenwork.in</a></p>
              </div>
            </div>

            {/* About Demo */}
            <div>
              <h3 className="font-semibold mb-3">About This Demo</h3>
              <p className="text-sm text-muted-foreground">
                This application demonstrates our capabilities in building custom web solutions.
                Contact us to discuss your project requirements.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2026 Datenwork Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
