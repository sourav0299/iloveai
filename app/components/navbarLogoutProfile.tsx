'use client';
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from "firebase/auth";
import { LogIn, LogOut, User, User2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function NavbarLogoutProfile() {
    const [user, setUser] = useState<FirebaseUser | null>(null);

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => unsubscribe();
    }, []);

    const handleLogout = async() => {
        try{
            await signOut(auth);
        }catch(error){
            console.error("Error Sign Out")
        }
    }

    return (
       <div className="flex items-center gap-4">
            {user ? (
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        {user.photoURL ? (
                            <img 
                                src={user.photoURL} 
                                alt="Profile" 
                                className="w-8 h-8 rounded-full"
                            />
                        ) : (
                            <User className="w-8 h-8" />
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-2 py-2 rounded-sm bg-transparent text-black dark:text-white hover:bg-red-400 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleGoogleLogin}
                    className="flex items-center gap-2 px-2 py-2 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    <User2 className="w-4 h-4" />
                </button>
            )}
        </div>
    )
}