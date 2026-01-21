import React, { useEffect, useState } from 'react';
import { auth } from '../../services/firebase';

const FirebaseDebug: React.FC = () => {
    const [status, setStatus] = useState<string>('Checking Firebase connection...');
    const [config, setConfig] = useState<any>(null);

    useEffect(() => {
        // Check Firebase configuration
        const checkFirebase = () => {
            try {
                // Check if auth is initialized
                if (auth) {
                    setStatus('✅ Firebase Auth initialized successfully');

                    // Log current auth state
                    auth.onAuthStateChanged((user) => {
                        console.log('Auth state changed:', user);
                    });
                } else {
                    setStatus('❌ Firebase Auth not initialized');
                }

                // Check environment variables
                const envConfig = {
                    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
                    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing',
                    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
                    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing',
                    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing',
                    appId: import.meta.env.VITE_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing',
                    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ? '✅ Set' : '❌ Missing',
                };

                setConfig(envConfig);
            } catch (error: any) {
                setStatus(`❌ Error: ${error.message}`);
            }
        };

        checkFirebase();
    }, []);

    return (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md text-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">🔧 Firebase Debug</h3>
            <p className="mb-2">{status}</p>

            {config && (
                <div className="mt-2 space-y-1">
                    <p className="font-semibold">Environment Variables:</p>
                    {Object.entries(config).map(([key, value]) => (
                        <p key={key} className="text-xs">
                            <span className="font-mono">{key}:</span> {value as string}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FirebaseDebug;
