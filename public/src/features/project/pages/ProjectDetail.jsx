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

                        {/* Project Features / Highlights */}
                        {project.features?.length > 0 && (
                            <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                    <Layers size={16} /> Project Highlights
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {project.features.map((feature, index) => (
                                        <div key={index} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-purple-500/30 transition-all group">
                                            <h4 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors">{feature.title}</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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
  {/* Project Image */}
  <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-shadow duration-300">
    <img
      src={project.coverImage}
      alt={project.name}
      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
    />
  </div>

  {/* Action Buttons */}
  <div className="flex flex-wrap gap-4 pt-4">
    {project.liveLink && (
      <a
        href={project.liveLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl uppercase tracking-widest text-sm transform hover:-translate-y-1"
      >
        <ExternalLink size={20} /> Live Demo
      </a>
    )}

    {project.codeLink && (
      <a
        href={project.codeLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-6 lg:px-8 py-3 lg:py-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold transition-all shadow-md hover:shadow-lg uppercase tracking-widest text-sm transform hover:-translate-y-1"
      >
        <Github size={20} /> Source Code
      </a>
    )}
  </div>
</div>
                </div>
            </Container>
        </main>
    );
};

export default ProjectDetail;

