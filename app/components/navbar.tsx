"use client"
import { Heart } from "lucide-react";
import NavbarLogoutProfile from "./navbarLogoutProfile";
import { NavbarWallet } from "./navbarWallet";
import { ModeToggle } from "./theme-toggle-button";

export default function Navbar() {
    return (
        <div className="flex items-center justify-between w-full max-w-[1440px] mx-auto px-4 py-3">
            {/* Left section - empty for spacing */}
            <div className="w-1/4"><a className="flex items-center gap-2" href="/">I {<Heart />} AI</a></div>
            
            {/* Center section - wallet */}
            <div className="flex items-center justify-center flex-1">
                <NavbarWallet />
            </div>
            
            {/* Right section - profile and theme toggle */}
            <div className="flex items-center justify-end gap-4 w-1/4">
                <NavbarLogoutProfile />
                <ModeToggle />
            </div>
        </div>
    )
}