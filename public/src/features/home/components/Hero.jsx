import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Code, BookOpen, Layers, Award } from "lucide-react";

const DEFAULTS = {
    name: "Deepmoina Boruah",
    position: "Full Stack Developer",
    description: "Building modern web applications with scalable backend systems and high-performance UI experiences. Specializing in React, Node.js, and Cloud architectures.",
    profilePic: "/assets/hero.png",
    ctaText: "Hire Me",
    ctaLink: "/contact",
};

const Hero = () => {
    const { projects } = useSelector((state) => state.projects);
    const { blogs } = useSelector((state) => state.blogs);
    const { skills } = useSelector((state) => state.skills);
    const { certificates } = useSelector((state) => state.certificates);
    const heroTitle = `Hi, I'm ${DEFAULTS.name}`;
    const heroSubtitle = DEFAULTS.position;
    const heroDescription = DEFAULTS.description;
    const heroImageUrl = DEFAULTS.profilePic;
    const resumeUrl = null;
    const ctaText = DEFAULTS.ctaText;
    const ctaLink = DEFAULTS.ctaLink;

    const stats = [
        { label: "Projects", count: projects?.length || 0, icon: <Layers className="text-blue-500" size={20} /> },
        { label: "Articles", count: blogs?.length || 0, icon: <BookOpen className="text-purple-500" size={20} /> },
        { label: "Skills", count: skills?.length || 0, icon: <Code className="text-green-500" size={20} /> },
        { label: "Certificates", count: certificates?.length || 0, icon: <Award className="text-orange-500" size={20} /> },
    ];

    const handleScroll = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section
            id="home"
            className="w-full pt-16 md:pt-[12vh] min-h-screen bg-slate-50 dark:bg-[#0f0715] flex flex-col justify-center overflow-hidden transition-colors duration-300"
        >
            <div className="w-full px-6 md:w-11/12 max-w-6xl mx-auto py-20">
                <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 items-center gap-12 md:gap-16">

                    {/* Text Content */}
                    <div className="text-center lg:text-left space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-xl md:text-2xl text-purple-600 dark:text-purple-400 font-bold tracking-tight uppercase animate-in fade-in slide-in-from-bottom duration-500">
                                {heroTitle}
                            </h3>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] text-slate-900 dark:text-white uppercase tracking-tighter animate-in fade-in slide-in-from-bottom duration-700">
                                {heroSubtitle}
                            </h1>
                            <p className="mt-6 text-base md:text-lg text-slate-600 dark:text-slate-300 opacity-80 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium italic animate-in fade-in slide-in-from-bottom duration-1000">
                                "{heroDescription}"
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 animate-in fade-in zoom-in duration-1000">
                            <Link
                                to={ctaLink}
                                className="px-8 h-14 bg-slate-900 dark:bg-white text-white dark:text-[#0f0715] font-black uppercase tracking-widest text-xs rounded-xl hover:bg-purple-600 dark:hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-2xl shadow-purple-500/10 flex items-center gap-2 group"
                            >
                                {ctaText} <ArrowRight size={18} className="group-hover:translate-x-2 transition-all" />
                            </Link>

                            {resumeUrl ? (
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className="px-8 h-14 bg-blue-700 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-blue-800 transition-all duration-300 flex items-center space-x-2 shadow-2xl shadow-blue-500/10 active:scale-95"
                                >
                                    <span>Download CV</span>
                                    <Download size={18} />
                                </a>
                            ) : (
                                <button
                                    onClick={() => handleScroll("projects")}
                                    className="px-8 h-14 bg-blue-700 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-blue-800 transition-all duration-300 flex items-center space-x-2 shadow-2xl shadow-blue-500/10 active:scale-95"
                                >
                                    <span>View Projects</span>
                                    <ArrowRight size={18} />
                                </button>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 max-w-2xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom duration-1000">
                            {stats.map((stat, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-center lg:text-left shadow-sm">
                                    <div className="mb-2 flex justify-center lg:justify-start">{stat.icon}</div>
                                    <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.count}+</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Profile Image */}
                    <div className="relative group p-4 animate-in fade-in zoom-in duration-1000">
                        <div className="absolute inset-0 bg-blue-600/10 dark:bg-blue-600/20 blur-[100px] rounded-full group-hover:bg-purple-600/20 transition-all duration-700"></div>
                        <div className="relative w-full aspect-square max-w-[450px] border-[10px] border-white dark:border-blue-950/50 rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-900/10 dark:shadow-blue-900/20 group-hover:border-purple-200 dark:group-hover:border-purple-900/50 transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 dark:from-[#0f0715] via-transparent to-transparent opacity-40"></div>
                            <img
                                src={heroImageUrl}
                                alt={heroSubtitle}
                                className="object-cover w-full h-full grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                onError={(e) => { e.target.src = DEFAULTS.profilePic; }}
                            />
                        </div>
                        <div className="absolute -top-4 -right-2 md:-top-10 md:-right-10 size-16 bg-blue-700 rounded-2xl flex items-center justify-center text-white shadow-2xl rotate-12 group-hover:rotate-0 transition-all duration-500 z-10 scale-75 md:scale-100">
                            <Code size={32} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div
                className="absolute bottom-10 right-10 cursor-pointer pb-4 hidden md:flex flex-col items-center gap-2 group transition-all"
                onClick={() => handleScroll("projects")}
            >
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Explore</span>
                <div className="w-6 h-10 rounded-full border-2 border-slate-300 dark:border-white/20 flex justify-center p-1 group-hover:border-purple-600 dark:group-hover:border-purple-400">
                    <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-white rounded-full animate-bounce group-hover:bg-purple-600 dark:group-hover:bg-purple-400"></div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
