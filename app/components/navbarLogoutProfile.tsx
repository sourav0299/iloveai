'use client';
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser, updateCurrentUser } from "firebase/auth";
import { LogIn, LogOut, User, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { User as PrismaUser } from '@prisma/client'
import { createUser, getUser, updateUserLastLogin } from "./sso/sso";
import toast from 'react-hot-toast'

export default function NavbarLogoutProfile() {
    const [user, setUser] = useState<PrismaUser | null>(null);

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, new GoogleAuthProvider());
            const { user: FirebaseUser } = result;

            if(!FirebaseUser.email){
                throw new Error("No email found")
            }

            let dbUser = await getUser(FirebaseUser.uid)

            if(!dbUser){
                dbUser = await createUser({
                    firebaseUid: FirebaseUser.uid,
                    email: FirebaseUser.email,
                    displayName: FirebaseUser.displayName,
                    photoURL: FirebaseUser.photoURL,
                });
                toast.success("User Created Successfully")
            }else{
                dbUser = await updateUserLastLogin(FirebaseUser.uid)
                toast.success("Welcome Back")
            }
            setUser(dbUser);
        } catch (error) {
            console.error("Error signing in with Google:", error);
            toast.error("Error while creating profile")
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const dbUser = await getUser(firebaseUser.uid);
                setUser(dbUser);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async() => {
        try{
            await signOut(auth);
        }catch(error){
            console.error("Error signing out:", error);
            toast.error("Failed to sign out. Please try again.");
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