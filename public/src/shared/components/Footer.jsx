import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useThemeContext } from "@/context/ThemeContext";
import { navLinks } from "@/data/navLinks";
import { Github, Linkedin, Twitter, Facebook, Instagram, Youtube } from "lucide-react";

const SocialIcon = ({ href, icon: Icon, label }) => {
    if (!href) return null;
    return (
        <a href={href} target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            aria-label={label}>
            <Icon className="h-4 w-4" />
        </a>
    );
};

export default function Footer() {
    const { theme } = useThemeContext();
    const settings = useSelector((state) => state.settings.settings);

    const siteName = settings?.general?.siteName || "Portfolio CMS";
    const siteDescription = settings?.general?.siteDescription || "Dedicated to building high-quality web applications and sharing knowledge through projects and blogs.";
    const contactEmail = settings?.contact?.contactEmail || "";
    const address = settings?.contact?.address || "";
    const siteLogoUrl = settings?.general?.siteLogoUrl || "";
    const social = settings?.social || {};

    return (
        <footer className="relative px-6 md:px-16 lg:px-24 xl:px-32 mt-40 w-full dark:text-slate-50">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-200 dark:border-slate-700 pb-12">

                <div className="md:max-w-md">
                    <Link to="/">
                        {siteLogoUrl ? (
                            <img className="h-9 w-auto shrink-0" src={siteLogoUrl} alt={siteName} />
                        ) : (
                            <img className="h-9 w-auto shrink-0"
                                src={theme === "dark" ? "/assets/light-logo.png" : "/assets/dark-logo.png"}
                                alt={siteName} />
                        )}
                    </Link>

                    <p className="mt-6 text-slate-500 dark:text-slate-400 leading-relaxed">
                        {siteDescription}
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-2 mt-5">
                        <SocialIcon href={social.github} icon={Github} label="GitHub" />
                        <SocialIcon href={social.linkedin} icon={Linkedin} label="LinkedIn" />
                        <SocialIcon href={social.twitter} icon={Twitter} label="Twitter" />
                        <SocialIcon href={social.facebook} icon={Facebook} label="Facebook" />
                        <SocialIcon href={social.instagram} icon={Instagram} label="Instagram" />
                        <SocialIcon href={social.youtube} icon={Youtube} label="YouTube" />
                    </div>
                </div>

                <div className="flex-1 flex items-start md:justify-end gap-20">

                    {/* Navigation */}
                    <div>
                        <h2 className="font-bold text-lg mb-6 uppercase tracking-widest text-slate-400 text-sm">Navigation</h2>
                        <ul className="grid grid-cols-2 gap-x-10 gap-y-3">
                            {navLinks.map((link, index) => (
                                <li key={index}>
                                    <Link to={link.to || link.href} className="text-slate-600 dark:text-slate-300 hover:text-purple-600 transition font-medium">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h2 className="font-bold text-lg mb-6 uppercase tracking-widest text-slate-400 text-sm">Get in touch</h2>
                        <div className="space-y-3">
                            {contactEmail && <p className="text-slate-600 dark:text-slate-300 font-medium">{contactEmail}</p>}
                            {address && <p className="text-slate-600 dark:text-slate-300 font-medium">{address}</p>}
                            {!contactEmail && !address && <p className="text-slate-500 text-sm">No contact info set.</p>}
                        </div>
                    </div>

                </div>
            </div>

            <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
                <p>Copyright {new Date().getFullYear()} © {siteName}. All Rights Reserved.</p>
            </div>
        </footer>
    );
}
