import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FeaturedProjects = () => {
    const { projects, loading } = useSelector((state) => state.projects);
    const featured = projects.slice(0, 3);

    if (loading && projects.length === 0) return null;

    return (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((project) => (
                <div key={project._id} className="group relative flex flex-col rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-500">
                    <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                        {project.coverImage ? (
                            <img src={project.coverImage} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No Thumbnail</div>
                        )}
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-slate-100 dark:border-slate-800">
                                {project.category || "Project"}
                            </span>
                        </div>
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                        <h3 className="text-2xl font-black mb-2 group-hover:text-purple-600 transition-colors uppercase tracking-tight leading-tight">{project.name}</h3>
                        <p className="text-slate-600 dark:text-slate-400 line-clamp-2 mb-6 text-sm flex-grow leading-relaxed">
                            {project.description}
                        </p>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800/50">
                            <Link to={`/projects/${project._id}`} className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-purple-600 group-hover:translate-x-1 transition-transform">
                                Explore <ArrowRight size={14} />
                            </Link>
                            {project.isOngoing && (
                                <span className="flex items-center gap-1.5 text-[9px] font-black text-green-500 uppercase tracking-widest">
                                    <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span> Ongoing
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeaturedProjects;
