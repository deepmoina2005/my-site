import { MenuIcon, XIcon, ChevronDown, Sparkles, BookOpen } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { navLinks } from "@/data/navLinks";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "@/features/service/serviceSlice";

export default function Navbar() {
    const dispatch = useDispatch();
    const location = useLocation();
    const { services } = useSelector((state) => state.services);

    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [mobileExpanded, setMobileExpanded] = useState(null);

    const { theme } = useThemeContext();
    const logoSrc = theme === "dark" ? "/assets/light-logo.png" : "/assets/dark-logo.png";
    const siteName = "Deepmoina";

    useEffect(() => {
        dispatch(fetchServices());
    }, [dispatch]);

    // Process navLinks to inject dynamic services
    const processedNavLinks = useMemo(() => {
        return navLinks.map(link => {
            if (link.name === "Services") {
                return {
                    ...link,
                    subLinks: services.map(s => ({
                        name: s.title,
                        href: `/services/${s._id}`
                    }))
                };
            }
            return link;
        });
    }, [services]);

    useEffect(() => {
        if (openMobileMenu) {
            document.body.classList.add("max-md:overflow-hidden");
        } else {
            document.body.classList.remove("max-md:overflow-hidden");
        }
    }, [openMobileMenu]);

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <nav className={`flex items-center justify-between fixed z-50 top-0 w-full px-6 md:px-16 lg:px-24 xl:px-32 py-4 ${openMobileMenu ? '' : 'backdrop-blur-md'}`}>
            <Link to="/">
                <img className="h-9 md:h-9.5 w-auto shrink-0" src={logoSrc} alt={siteName} width={140} height={40} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8 lg:pl-20">
                {processedNavLinks.filter(link => link.name !== "Contact").map((link) => {
                    const active = (link.href && isActive(link.href)) ||
                        (link.subLinks && link.subLinks.some(sub => isActive(sub.href)));

                    return link.subLinks ? (
                        <div
                            key={link.name}
                            className="relative group py-2"
                            onMouseEnter={() => setOpenDropdown(link.name)}
                            onMouseLeave={() => setOpenDropdown(null)}
                        >
                            <button className={`flex items-center gap-1.5 text-sm font-medium transition-colors uppercase tracking-wider relative group/link ${active ? 'text-purple-600' : 'hover:text-purple-600'}`}>
                                {link.name === "Services"}
                                {link.name === "More"}
                                {link.name}
                                <ChevronDown size={14} className={`transition-transform duration-300 ${openDropdown === link.name ? 'rotate-180' : ''}`} />

                                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover/link:w-full'}`} />
                            </button>

                            {/* Dropdown Menu */}
                            <div className={`absolute top-full left-1/2 -translate-x-1/2 min-w-[200px] mt-1 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl transition-all duration-300 origin-top z-[60]
                                ${openDropdown === link.name ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                {link.subLinks.length > 0 ? (
                                    link.subLinks.map((sub) => (
                                        <Link
                                            key={sub.name}
                                            to={sub.href}
                                            className="block px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 rounded-2xl transition-all whitespace-nowrap"
                                        >
                                            {sub.name}
                                        </Link>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-xs text-slate-400 text-center uppercase tracking-widest font-bold">
                                        Coming Soon
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Link
                            key={link.name}
                            to={link.href}
                            className={`text-sm font-medium transition-colors uppercase tracking-wider relative group/link ${active ? 'text-purple-600' : 'hover:text-purple-600'}`}
                        >
                            {link.name}
                            <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover/link:w-full'}`} />
                        </Link>
                    );
                })}
            </div>

            {/* Mobile menu Overlay */}
            <div className={`fixed inset-0 flex flex-col items-center justify-center gap-6 text-lg font-medium bg-white/95 dark:bg-black/98 backdrop-blur-2xl md:hidden transition duration-500 z-[100] ${openMobileMenu ? "translate-x-0" : "-translate-x-full"}`}>
                <button className="absolute top-6 right-6 p-2 text-slate-500 hover:text-red-500 transition-colors" onClick={() => setOpenMobileMenu(false)}>
                    <XIcon size={32} />
                </button>

                <div className="w-full flex flex-col items-center gap-4 overflow-y-auto max-h-[80vh] px-8 scrollbar-hide">
                    {processedNavLinks.map((link) => (
                        link.subLinks ? (
                            <div key={link.name} className="w-full text-center py-2">
                                <button
                                    onClick={() => setMobileExpanded(mobileExpanded === link.name ? null : link.name)}
                                    className="flex items-center justify-center gap-2 text-3xl font-black hover:text-purple-600 w-full uppercase tracking-tighter"
                                >
                                    {link.name}
                                    <ChevronDown size={28} className={`transition-transform duration-300 ${mobileExpanded === link.name ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`grid transition-all duration-500 ease-in-out overflow-hidden ${mobileExpanded === link.name ? 'grid-rows-[1fr] mt-6 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="min-h-0 flex flex-col gap-6">
                                        {link.subLinks.length > 0 ? (
                                            link.subLinks.map((sub) => (
                                                <Link
                                                    key={sub.name}
                                                    to={sub.href}
                                                    onClick={() => setOpenMobileMenu(false)}
                                                    className="text-xl text-slate-500 dark:text-slate-400 font-bold hover:text-purple-600 tracking-tight"
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))
                                        ) : (
                                            <span className="text-sm uppercase tracking-widest text-slate-400 font-black">Coming Soon</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={() => setOpenMobileMenu(false)}
                                className="text-3xl font-black hover:text-purple-600 transition-all hover:scale-105 uppercase tracking-tighter py-2"
                            >
                                {link.name}
                            </Link>
                        )
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button onClick={() => setOpenMobileMenu(!openMobileMenu)} className="md:hidden p-1">
                        <MenuIcon size={24} className="active:scale-90 transition text-slate-600 dark:text-slate-400" />
                    </button>
                </div>
                <Link to="/contact" className="hidden md:flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-bold rounded-full transition-all shadow-xl shadow-purple-500/25 uppercase tracking-widest active:scale-95 transform hover:-translate-y-0.5">
                    Contact
                </Link>
            </div>
        </nav>
    );
}