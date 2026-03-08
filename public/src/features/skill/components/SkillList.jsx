import React from 'react';
import { useSelector } from 'react-redux';
import { ExternalLink, Tag } from 'lucide-react';

const SkillList = () => {
    const { skills, loading } = useSelector((state) => state.skills);

    if (loading) return <div className="text-center py-10">Loading skills...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
            {skills.map((skill, index) => (
                <div key={skill._id || index} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 hover:border-purple-500/50 transition-all group flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {skill.icon ? (
                                <img src={skill.icon} alt={skill.name} className="size-10 object-contain grayscale group-hover:grayscale-0 transition-all" />
                            ) : (
                                <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">?</div>
                            )}
                            <div>
                                <h3 className="font-bold text-lg leading-tight">{skill.name}</h3>
                                <span className="text-[10px] text-purple-600 font-extrabold uppercase tracking-widest">{skill.category}</span>
                            </div>
                        </div>
                        {skill.level && (
                            <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-600 text-[10px] font-bold uppercase tracking-tighter shadow-sm border border-purple-200 dark:border-purple-800/50">
                                {skill.level}
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-grow leading-relaxed">
                        {skill.description}
                    </p>

                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                        {skill.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {skill.tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-[10px] font-bold">
                                        <Tag size={10} /> {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {skill.link && (
                            <a href={skill.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors uppercase tracking-widest pl-1">
                                Official Link <ExternalLink size={12} />
                            </a>
                        )}
                    </div>
                </div>
            ))}
            {skills.length === 0 && !loading && (
                <p className="text-center w-full text-slate-500 col-span-full py-10">No skills found.</p>
            )}
        </div>
    );
};

export default SkillList;

