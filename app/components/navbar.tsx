import { ModeToggle } from "./theme-toggle-button";

export default function Navbar() {
    return (
        <div className="flex items-center justify-center">
            <div className="flex items-center justify-end py-3 px-3 w-full max-w-[1440px]">
                <ModeToggle />
            </div>
        </div>
    )
}