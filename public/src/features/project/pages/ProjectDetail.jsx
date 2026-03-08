import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, Calendar, Building2, Layers } from 'lucide-react';
import Container from '@/shared/components/Container';
import projectAPI from '@/features/project/projectAPI';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const response = await projectAPI.getById(id);
                setProject(response.data.project);
            } catch (err) {
                setError('Project not found');
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) return <div className="pt-32 text-center">Loading project details...</div>;
    if (error || !project) return <div className="pt-32 text-center text-red-500">{error || 'Project not found'}</div>;

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    };

    return (
        <main className="pt-24 pb-16">
            <Container>
                <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-purple-600 mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to projects
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div>
                            {project.associatedWith && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">
                                    <Building2 size={12} /> {project.associatedWith}
                                </span>
                            )}
                            <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight mb-4">{project.name}</h1>

                            <div className="flex flex-wrap gap-6 text-sm text-slate-500 font-medium">
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} className="text-purple-500" />
                                    <span>{formatDate(project.startDate)} — {project.isOngoing ? 'Present' : formatDate(project.endDate)}</span>
                                </div>
                                {project.isOngoing && (
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 text-[10px] font-bold uppercase tracking-widest">
                                        Ongoing
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                {project.description}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            {project.liveLink && (
                                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-purple-500/25 uppercase tracking-widest text-sm">
                                    <ExternalLink size={20} /> Live Demo
                                </a>
                            )}
                            {project.codeLink && (
                                <a href={project.codeLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold transition-all uppercase tracking-widest text-sm text-center">
                                    <Github size={20} /> Source Code
                                </a>
                            )}
                        </div>

                        <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                <Layers size={16} /> Technologies Stack
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.skills?.map(skill => (
                                    <span key={skill} className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30 rounded-xl text-xs font-bold uppercase tracking-wider">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl shadow-purple-500/5">
                            <img src={project.coverImage} alt={project.name} className="w-full h-auto" />
                        </div>
                        {project.media?.length > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                                {project.media.map((img, i) => (
                                    <div key={i} className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-all group shadow-lg">
                                        <img src={img} alt={`${project.name} ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </main>
    );
};

export default ProjectDetail;

