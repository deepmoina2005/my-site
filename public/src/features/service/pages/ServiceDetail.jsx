import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServiceById, clearCurrentService } from '../serviceSlice';
import Container from '@/shared/components/Container';
// import SectionTitle from '@/shared/components/SectionTitle'; // Not used in this layout
import {
    Loader2, ArrowLeft, CheckCircle2,
    ArrowRight, ExternalLink, Github,
    FileText, Zap, Layers
} from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentService, loading, error } = useSelector((state) => state.services);

    useEffect(() => {
        if (id) {
            dispatch(fetchServiceById(id));
        }
        return () => {
            dispatch(clearCurrentService());
        };
    }, [id, dispatch]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="size-12 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <Container className="py-20 text-center">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Service</h2>
                <p className="text-slate-600 mb-8">{error}</p>
                <button
                    onClick={() => navigate('/services')}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold"
                >
                    Back to Services
                </button>
            </Container>
        );
    }

    if (!currentService) return null;

    return (
        <main className="pt-24 pb-20 dark:bg-slate-950 min-h-screen">
            <Container>
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-12 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold">Back to Services</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left: Content */}
                    <div className="lg:col-span-8 space-y-12">
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-3">
                                {currentService.category && (
                                    <Badge className="bg-blue-600 text-white border-0 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                                        {currentService.category}
                                    </Badge>
                                )}
                                {currentService.status === 'Active' && (
                                    <Badge variant="outline" className="border-green-500 text-green-500 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                                        Available
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1]">
                                {currentService.title}
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                {currentService.shortDescription}
                            </p>
                        </div>

                        {/* Banner Image */}
                        <div className="relative rounded-[2rem] overflow-hidden aspect-[16/9] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800">
                            {currentService.image ? (
                                <img
                                    src={currentService.image}
                                    alt={currentService.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                                    <Zap className="size-24 text-white/20" />
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Service Overview</h2>
                            <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-medium">
                                <p className="whitespace-pre-wrap">{currentService.fullDescription}</p>
                            </div>
                        </div>

                        {/* Features */}
                        {currentService.features?.length > 0 && (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Key Features</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {currentService.features.map((feature, index) => (
                                        <div key={index} className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 group hover:border-blue-500/30 transition-all">
                                            <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">{feature.title}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Technologies */}
                        {currentService.technologies?.length > 0 && (
                            <div className="p-8 lg:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-black/50 transition-colors">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <Layers className="text-blue-500" size={20} />
                                    Tech Stack
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {currentService.technologies.map((tech, index) => (
                                        <Badge
                                            key={index}
                                            className="bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold transition-colors duration-300"
                                        >
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Box */}
<div className="p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-400/30 dark:shadow-none space-y-6 sticky top-24 transition-all duration-500">
  {/* Heading */}
  <div className="space-y-3">
    <h3 className="text-2xl lg:text-3xl font-extrabold leading-snug">
      Ready to start?
    </h3>
    <p className="text-blue-100 dark:text-blue-200 font-medium leading-relaxed">
      Let's discuss your project and bring your ideas to life with professional expertise.
    </p>
  </div>

  {/* Call-to-Action Button */}
  <a
    href={`/contact?service=${currentService.title}`}
    className="flex items-center justify-center gap-2 w-full py-4 lg:py-5 bg-white text-blue-600 rounded-2xl font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 dark:bg-blue-50 dark:text-blue-900 dark:hover:bg-blue-600 dark:hover:text-white"
  >
    Get Started
    <ArrowRight size={20} />
  </a>

  {/* External Links */}
  <div className="space-y-3 pt-4 border-t border-white/20">
    {currentService.links?.demo && (
      <a
        href={currentService.links.demo}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 text-white/80 hover:text-white font-semibold transition-colors duration-300"
      >
        <ExternalLink size={18} />
        Live Demo
      </a>
    )}
    {currentService.links?.github && (
      <a
        href={currentService.links.github}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 text-white/80 hover:text-white font-semibold transition-colors duration-300"
      >
        <Github size={18} />
        View Code
      </a>
    )}
    {currentService.links?.documentation && (
      <a
        href={currentService.links.documentation}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 text-white/80 hover:text-white font-semibold transition-colors duration-300"
      >
        <FileText size={18} />
        Documentation
      </a>
    )}
  </div>
</div>
                    </div>
                </div>
            </Container>
        </main>
    );
};

export default ServiceDetail;
