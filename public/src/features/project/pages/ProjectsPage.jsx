import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Container from '@/shared/components/Container';
import SectionTitle from '@/shared/components/SectionTitle';
import { fetchProjects } from '@/features/project/projectSlice';
import { ExternalLink, ArrowRight } from 'lucide-react';

const ProjectsPage = () => {
    const dispatch = useDispatch();
    const { projects, loading } = useSelector((state) => state.projects);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    if (loading) return <div className="pt-32 text-center">Loading projects...</div>;

    return (
        <main className="pt-24 pb-16">
            <Container>
                <SectionTitle text1="WORK" text2="Featured Projects" text3="A selection of my recent works and side projects." />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {projects.map((project) => (
                        <div key={project._id} className="group relative flex flex-col h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-purple-500/50 transition-all duration-300">
                            <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                                {project.coverImage ? (
                                    <img src={project.coverImage} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                                )}
                                {project.isOngoing && (
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                                        Ongoing
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {(project.skills || []).slice(0, 3).map(skill => (
                                        <span key={skill} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 border border-purple-100 dark:border-purple-800/30">{skill}</span>
                                    ))}
                                </div>

                                <h3 className="text-xl font-bold mb-1 group-hover:text-purple-600 transition-colors uppercase tracking-tight">{project.name}</h3>
                                {project.associatedWith && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">@{project.associatedWith}</p>}

                                <p className="text-slate-600 dark:text-slate-400 line-clamp-2 mb-6 text-sm flex-grow leading-relaxed">
                                    {project.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/50">
                                    <Link to={`/projects/${project._id}`} className="text-xs font-extrabold uppercase tracking-widest flex items-center gap-1 hover:text-purple-600 transition-colors">
                                        Details <ArrowRight size={14} />
                                    </Link>
                                    <div className="flex gap-2">
                                        {project.liveLink && (
                                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-600 dark:text-slate-300 transition-all">
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {projects.length === 0 && !loading && (
                    <p className="text-center py-20 text-slate-500">Stay tuned, projects are coming soon!</p>
                )}
            </Container>
        </main>
    );
};

export default ProjectsPage;
