import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Container from '@/shared/components/Container';
import SectionTitle from '@/shared/components/SectionTitle';
import { fetchServices } from '@/features/service/serviceSlice';
import {  Zap, ArrowRight, Layers } from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';

const ServicesPage = () => {
    const dispatch = useDispatch();
    const { services, loading } = useSelector((state) => state.services);

    useEffect(() => {
        dispatch(fetchServices());
    }, [dispatch]);

    if (loading && (!services || services.length === 0)) return (
        <main className="pt-32 pb-16 min-h-screen bg-slate-50 dark:bg-slate-950">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {[1, 2, 3].map(i => <div key={i} className="h-96 rounded-3xl bg-slate-100 dark:bg-slate-900 animate-pulse" />)}
                </div>
            </Container>
        </main>
    );

    return (
        <main className="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950">
            <Container>
                <SectionTitle
                    text1="EXPERT SOLUTIONS"
                    text2="Services & Expertise"
                    text3="I provide comprehensive digital solutions tailored to your unique requirements. Scale your business with high-performance systems."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20">
                    {services.map((service) => (
                        <Link
                            key={service._id}
                            to={`/services/${service._id}`}
                            className="group relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10"
                        >
                            {/* Card Image */}
                            <div className="relative h-72 w-full overflow-hidden">
                                {service.image ? (
                                    <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                                        <Zap className="size-16 text-white/20" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Category Badge */}
                                {service.category && (
                                    <div className="absolute top-6 left-6">
                                        <Badge className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white border-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                                            {service.category}
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-10 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors">
                                        {service.title}
                                    </h3>
                                    <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shrink-0">
                                        <ArrowRight size={24} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                    </div>
                                </div>

                                <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-8 line-clamp-2 font-medium">
                                    {service.shortDescription}
                                </p>

                                {/* Tech Stack Preview */}
                                {service.technologies?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-auto pt-6 border-t border-slate-50 dark:border-slate-800">
                                        {service.technologies.slice(0, 3).map((tech, i) => (
                                            <span key={i} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                                {tech}
                                            </span>
                                        ))}
                                        {service.technologies.length > 3 && (
                                            <span className="text-[10px] font-bold text-slate-400 px-2 py-1.5">+{service.technologies.length - 3}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>

                {(!services || services.length === 0) && !loading && (
                    <div className="text-center py-32">
                        <div className="size-20 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-6 text-slate-400">
                            <Layers className="size-10" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Services Found</h3>
                        <p className="text-slate-500">I'm currently updating my service offerings. Check back soon!</p>
                    </div>
                )}
            </Container>
        </main>
    );
};

export default ServicesPage;