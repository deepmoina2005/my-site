import React from 'react';
import { useSelector } from 'react-redux';
import { Briefcase, Calendar, MapPin, Building2, Tag, Globe } from 'lucide-react';

const ExperienceList = () => {
    const { experiences, loading } = useSelector((state) => state.experiences);

    if (loading) return <div className="text-center py-10">Loading experiences...</div>;

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
    };

    return (
        <div className="space-y-12 mt-12 max-w-5xl mx-auto">
            {experiences.map((exp, index) => (
                <div key={exp._id || index} className="relative group">
                    {/* Timeline Line */}
                    <div className="absolute left-[31px] md:left-1/2 top-0 bottom-[-48px] w-px bg-slate-200 dark:bg-slate-800 hidden md:block opacity-50"></div>

                    <div className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                        {/* Content Card */}
                        <div className="w-full md:w-1/2">
                            <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:border-purple-500/50 transition-all duration-500">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        {exp.logo ? (
                                            <img src={exp.logo} alt={exp.company} className="size-12 object-contain rounded-xl grayscale group-hover:grayscale-0 transition-all" />
                                        ) : (
                                            <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                <Building2 size={24} />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-purple-600 transition-colors leading-tight">{exp.title}</h3>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{exp.company}</span>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block">
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter border ${exp.isOngoing ? 'bg-green-100 text-green-600 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                            {exp.isOngoing ? 'Active' : 'Completed'}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        <Calendar size={14} className="text-purple-500" />
                                        {formatDate(exp.startDate)} - {exp.isOngoing ? 'Present' : formatDate(exp.endDate)}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        <MapPin size={14} className="text-purple-500" />
                                        {exp.location} ({exp.workMode})
                                    </div>
                                </div>

                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed whitespace-pre-line border-l-2 border-slate-100 dark:border-slate-800 pl-4">
                                    {exp.description}
                                </p>

                                {exp.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-6 border-t border-slate-50 dark:border-slate-800">
                                        {exp.tags.map(tag => (
                                            <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-[9px] font-bold uppercase tracking-widest border border-slate-100 dark:border-slate-800">
                                                <Tag size={10} /> {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Middle Icon */}
                        <div className="relative z-10 hidden md:flex size-16 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border-4 border-slate-50 dark:border-slate-800 shadow-2xl group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                            <Briefcase size={28} className="group-hover:rotate-12 transition-transform" />
                        </div>

                        {/* Spacer for other side */}
                        <div className="hidden md:block w-1/2 px-8">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-full border border-purple-100 dark:border-purple-800">
                                    Professional Milestone
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {experiences.length === 0 && !loading && (
                <p className="text-center text-slate-500 py-20">No experiences found.</p>
            )}
        </div>
    );
};

export default ExperienceList;

