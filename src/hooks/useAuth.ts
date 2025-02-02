import { useEffect, useState } from 'react';

import { signOut } from 'firebase/auth';

import { useAppContext } from '../contexts/AppContext';
import { getUser, signInWithGoogle, UserData } from '../lib/auth';
import { auth } from '../lib/firebase';

export function useAuth() {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const { setIsEditMode } = useAppContext();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userData = await getUser(firebaseUser.uid);
                    setUser(userData);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSignIn = async () => {
        try {
            const userData = await signInWithGoogle();
            setUser(userData);
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setIsEditMode(false);
            window.location.reload();
        } catch (error) {
            console.error('Error signing out with Google', error);
        }
    };

    return { user, loading, handleSignIn, handleSignOut };
}
