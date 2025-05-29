"use client"
import { Heart, Menu, X } from "lucide-react";
import NavbarLogoutProfile from "./navbarLogoutProfile";
import { NavbarWallet } from "./navbarWallet";
import { ModeToggle } from "./theme-toggle-button";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="relative">
            {/* Desktop and Tablet Navigation */}
            <div className="flex items-center justify-between w-full max-w-[1440px] mx-auto px-4 py-3">
                {/* Left section - Logo */}
                <div className="w-auto md:w-1/4">
                    <a className="flex items-center gap-2" href="/">
                        I {<Heart />} AI
                    </a>
                </div>
                
                {/* Center section - wallet (hidden on mobile) */}
                <div className="hidden md:flex items-center justify-center flex-1">
                    <NavbarWallet />
                </div>
                
                {/* Right section - profile and theme toggle */}
                <div className="hidden md:flex items-center justify-end gap-4 w-1/4">
                    <NavbarLogoutProfile />
                    <ModeToggle />
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-background border-b border-border md:hidden">
                    <div className="flex flex-col space-y-4 p-4">
                        <div className="flex justify-center">
                            <NavbarWallet />
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <NavbarLogoutProfile />
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}