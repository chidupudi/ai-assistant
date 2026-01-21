import React, { useState, useEffect } from 'react';
import { Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

export function FloatingCallButton() {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        // Show popup after 1 minute (60000ms)
        const timer = setTimeout(() => {
            setShowPopup(true);
        }, 60000);

        return () => clearTimeout(timer);
    }, []);

    const handleCallClick = () => {
        window.location.href = 'tel:8008085560';
    };

    const handleWebsiteClick = () => {
        window.open('https://solutions.datenwork.in', '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            {/* Floating Call Button - Bottom Right */}
            <button
                onClick={() => setShowPopup(true)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-elevated hover:shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center group animate-shake"
                aria-label="Contact Us"
            >
                <Phone className="w-6 h-6 group-hover:animate-pulse" />
            </button>

            {/* Contact Popup Dialog */}
            <Dialog open={showPopup} onOpenChange={setShowPopup}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-display text-2xl flex items-center gap-2">
                            <Phone className="w-6 h-6 text-primary" />
                            Liked the Project?
                        </DialogTitle>
                        <DialogDescription className="text-base pt-2">
                            Get in touch with Datenwork Solutions for your custom web application needs!
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 pt-4">
                        {/* Call Button */}
                        <Button
                            variant="hero"
                            size="lg"
                            className="w-full text-lg"
                            onClick={handleCallClick}
                        >
                            <Phone className="w-5 h-5" />
                            Call 8008085560
                        </Button>

                        {/* Website Button */}
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full text-lg"
                            onClick={handleWebsiteClick}
                        >
                            🌐 Visit solutions.datenwork.in
                        </Button>

                        {/* Additional Info */}
                        <div className="pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground text-center">
                                We specialize in custom IT solutions and web development.
                                Let's discuss your project requirements!
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
