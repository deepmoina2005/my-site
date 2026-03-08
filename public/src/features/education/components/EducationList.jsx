import React from 'react';
import { useSelector } from 'react-redux';
import { School, GraduationCap, Calendar, MapPin, Building2, Tag, Globe } from 'lucide-react';

const EducationList = () => {
    const { educations, loading } = useSelector((state) => state.educations);

    if (loading) return <div className="text-center py-10">Loading education...</div>;

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-6xl mx-auto">
            {educations.map((edu, index) => (
                <div key={edu._id || index} className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:border-purple-500/50 transition-all duration-500 flex flex-col group">
                    <div className="flex items-start justify-between mb-6">
                        {edu.logo ? (
                            <img src={edu.logo} alt={edu.institution} className="size-14 object-contain rounded-xl grayscale group-hover:grayscale-0 transition-all" />
                        ) : (
                            <div className="size-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 border border-purple-100 dark:border-purple-800/50 group-hover:scale-110 transition-transform">
                                <GraduationCap size={28} />
                            </div>
                        )}
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
                            {formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                        </span>
                    </div>

                    <h3 className="text-2xl font-black mb-1 uppercase tracking-tight group-hover:text-purple-600 transition-colors leading-tight">{edu.degree}</h3>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">
                        <School size={14} className="text-purple-500" /> {edu.institution}
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
                        {edu.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-purple-500" /> {edu.location}
                            </div>
                        )}
                        {edu.workMode && (
                            <div className="flex items-center gap-1.5">
                                <Globe size={14} className="text-purple-500" /> {edu.workMode}
                            </div>
                        )}
                        {edu.category && (
                            <div className="flex items-center gap-1.5">
                                <Building2 size={14} className="text-purple-500" /> {edu.category}
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-2 border-purple-500/20 pl-4 py-1 mb-6">
                        {edu.description}
                    </p>

                    {edu.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-6 border-t border-slate-50 dark:border-slate-800 mt-auto">
                            {edu.tags.map(tag => (
                                <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-[9px] font-bold uppercase tracking-widest border border-slate-100 dark:border-slate-800">
                                    <Tag size={10} /> {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            {educations.length === 0 && !loading && (
                <p className="text-center col-span-full text-slate-500 py-20">No education records found.</p>
            )}
        </div>
    );
};

export default EducationList;
