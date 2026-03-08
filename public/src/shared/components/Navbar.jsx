import { MenuIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { navLinks } from "@/data/navLinks";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useSettings } from "@/shared/hooks/useSettings";

export default function Navbar() {
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const { theme } = useThemeContext();
    const { general } = useSettings();
    const logoSrc = general.siteLogoUrl || (theme === "dark" ? "/assets/light-logo.png" : "/assets/dark-logo.png");
    const siteName = general.siteName || "Portfolio";

    useEffect(() => {
        if (openMobileMenu) {
            document.body.classList.add("max-md:overflow-hidden");
        } else {
            document.body.classList.remove("max-md:overflow-hidden");
        }
    }, [openMobileMenu]);

    return (
        <nav className={`flex items-center justify-between fixed z-50 top-0 w-full px-6 md:px-16 lg:px-24 xl:px-32 py-4 ${openMobileMenu ? '' : 'backdrop-blur'}`}>
            <Link to="/">
                <img className="h-9 md:h-9.5 w-auto shrink-0" src={logoSrc} alt={siteName} width={140} height={40} />
            </Link>
            <div className="hidden items-center md:gap-8 lg:gap-9 md:flex lg:pl-20">
                {navLinks.map((link) => (
                    <Link key={link.name} to={link.href} className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        {link.name}
                    </Link>
                ))}
            </div>
            {/* Mobile menu */}
            <div className={`fixed inset-0 flex flex-col items-center justify-center gap-6 text-lg font-medium bg-white/60 dark:bg-black/40 backdrop-blur-md md:hidden transition duration-300 ${openMobileMenu ? "translate-x-0" : "-translate-x-full"}`}>
                {navLinks.map((link) => (
                    <Link key={link.name} to={link.href} onClick={() => setOpenMobileMenu(false)} className="hover:text-purple-600 transition-colors">
                        {link.name}
                    </Link>
                ))}
                <button className="aspect-square size-10 p-1 items-center justify-center bg-purple-600 hover:bg-purple-700 transition text-white rounded-md flex" onClick={() => setOpenMobileMenu(false)}>
                    <XIcon />
                </button>
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <button onClick={() => setOpenMobileMenu(!openMobileMenu)} className="md:hidden">
                    <MenuIcon size={26} className="active:scale-90 transition" />
                </button>
            </div>
        </nav>
    );
}