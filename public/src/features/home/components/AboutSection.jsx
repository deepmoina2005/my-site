import React from "react";
import { useSelector } from "react-redux";
import { TerminalSquare, Github, Lightbulb, Zap } from "lucide-react";
import { useSettings } from "@/shared/hooks/useSettings";
import Container from "@/shared/components/Container";
import SectionTitle from "@/shared/components/SectionTitle";

const AboutSection = () => {
  const { homepage, general } = useSettings();
  const { projects } = useSelector((state) => state.projects);

  const name = homepage.heroTitle || general.siteName || "Deepmoina Boruah";
  const profilePic = homepage.heroImageUrl || "/assets/hero.jpg";

  const currentYear = new Date().getFullYear();
  const startYear = 2021;
  const yearsOfExp = currentYear - startYear;

  const highlights = [
    {
      icon: <TerminalSquare size={18} className="text-blue-500" />,
      text: "Full Stack Developer",
    },
    {
      icon: <Github size={18} className="text-purple-500" />,
      text: "Open Source Contributor",
    },
    {
      icon: <Lightbulb size={18} className="text-amber-500" />,
      text: "Problem Solver",
    },
    {
      icon: <Zap size={18} className="text-orange-500" />,
      text: "Passionate about building scalable web applications",
    },
  ];

const stats = [
  { label: "Years Experience", value: `+${yearsOfExp}` },
  { label: "Projects Completed", value: `+${projects?.length || 10}` },
  { label: "Certificates Earned", value: "+12" },
  { label: "Technologies Mastered", value: "+15" },
  { label: "GitHub Repositories", value: "+30" },
  { label: "Happy Clients", value: "+8" },
];

  return (
    <section
      id="about"
      className="py-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 relative overflow-hidden transition-colors duration-300"
    >
      {/* Background gradient blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-200/40 dark:bg-blue-900/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-200/40 dark:bg-purple-900/10 blur-[120px]" />
      </div>

      <Container className="relative z-10">
        <SectionTitle
          text1="DISCOVER"
          text2="About Me"
          text3="A glimpse into my professional journey and passion for software engineering."
        />

        <div className="mt-16 flex flex-col lg:flex-row gap-16 lg:gap-20 items-center lg:items-start">
          {/* LEFT SIDE IMAGE */}
          <div className="w-full lg:w-5/12 relative group">
            <div className="relative w-full max-h-[500px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-500">
              <img
                src={profilePic}
                alt={name}
                className="w-full h-full object-cover object-center grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                onError={(e) => {
                  e.target.src = "/assets/hero.jpg";
                }}
              />

              {/* Hover info */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <h4 className="font-bold text-lg text-slate-900 dark:text-white capitalize">
                  {name}
                </h4>
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-1 uppercase tracking-widest">
                  Software Engineer
                </p>
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] opacity-20 blur-2xl -z-10 group-hover:opacity-30 transition-opacity duration-700" />

            {/* Highlights */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/70 dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 hover:shadow-lg transition-all duration-300"
                >
                  <div className="mt-0.5">{item.icon}</div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full lg:w-7/12 flex flex-col justify-center space-y-8">
            <div>
              <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                I'm {name}
              </h3>

              <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mt-2">
                Transforming Ideas Into High-Performance Digital Solutions
              </h4>
            </div>

            <div className="space-y-4 text-base md:text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
              <p>
                I am a dedicated Full Stack Developer passionate about creating
                scalable, elegant, and high-performance web applications. I
                enjoy solving complex technical challenges and transforming
                ideas into real digital products.
              </p>

              <p>
                My expertise includes modern technologies like React, Node.js,
                and cloud platforms. I focus on building applications that are
                fast, secure, and user-friendly.
              </p>

              <p>
                I constantly explore new technologies, contribute to open
                source, and refine my skills to stay ahead in the rapidly
                evolving software ecosystem.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-1 hover:shadow-xl hover:border-purple-500/30 transition-all duration-300"
                >
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {stat.value}
                  </span>

                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutSection;