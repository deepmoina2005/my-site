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
                            <img src={edu.logo} alt={edu.institution} className="size-16 object-contain rounded-xl grayscale group-hover:grayscale-0 transition-all" />
                        ) : (
                            <div className="size-16 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 border border-purple-100 dark:border-purple-800/50 group-hover:scale-110 transition-transform">
                                <GraduationCap size={32} />
                            </div>
                        )}
                        <div className="flex flex-col items-end gap-2">
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm border border-slate-200 dark:border-slate-700">
                                {formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                            </span>
                            {edu.grade && (
                                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded border border-purple-100 dark:border-purple-800/50">
                                    Grade: {edu.grade}
                                </span>
                            )}
                        </div>
                    </div>

                    <h3 className="text-xl font-black mb-1 uppercase tracking-tight group-hover:text-purple-600 transition-colors leading-tight">
                        {edu.institution}
                    </h3>
                    <div className="flex flex-col gap-1 mb-4">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                            <GraduationCap size={16} className="text-purple-500" /> {edu.degree}
                        </div>
                        {edu.fieldOfStudy && (
                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-5">
                                {edu.fieldOfStudy}
                            </div>
                        )}
                    </div>

                    {edu.activities && (
                        <div className="mb-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 flex items-center gap-1">
                                <Building2 size={12} /> Activities & Societies
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                {edu.activities}
                            </p>
                        </div>
                    )}

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-2 border-purple-500/20 pl-4 py-1 mb-6">
                        {edu.description}
                    </p>

                    {edu.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-6 border-t border-slate-50 dark:border-slate-800 mt-auto">
                            {edu.skills.map(skill => (
                                <span key={skill} className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-[9px] font-bold uppercase tracking-widest border border-slate-100 dark:border-slate-800">
                                    <Tag size={10} /> {skill}
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
