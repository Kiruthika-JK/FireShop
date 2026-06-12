"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    signInWithRedirect,
    signOut,
    User,
    getRedirectResult
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, googleProvider, firestore } from "./firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Check if user is admin by direct document lookup (email as document ID)
    const checkAdminStatus = async (email: string) => {
        try {
            console.log('Admin check for email:', email);
            
            // Check if user email exists in admins collection
            const adminDocRef = doc(firestore, "admins", email);
            const adminDoc = await getDoc(adminDocRef);
            const isAdminUser = adminDoc.exists();
            
            console.log('Admin status for', email, ':', isAdminUser);
            return isAdminUser;
        } catch (error) {
            console.error("Error checking admin status", error);
            return false;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);

            if (user?.email) {
                const adminStatus = await checkAdminStatus(user.email);
                setIsAdmin(adminStatus);
            } else {
                setIsAdmin(false);
            }

            setLoading(false);
        });

        // Handle redirect result for mobile sign-in
        getRedirectResult(auth)
            .then((result) => {
                if (result?.user) {
                    console.log("Redirect sign-in successful:", result.user);
                }
            })
            .catch((error) => {
                console.error("Error handling redirect result:", error);
            });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        try {
            // Detect if mobile device
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                // Use redirect for mobile devices (popup blockers on mobile)
                await signInWithRedirect(auth, googleProvider);
            } else {
                // Use popup for desktop
                await signInWithPopup(auth, googleProvider);
            }
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setIsAdmin(false);
        } catch (error) {
            console.error("Error signing out", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
