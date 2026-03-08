import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@/shared/components/Container';
import SectionTitle from '@/shared/components/SectionTitle';
import { fetchServices } from '@/features/service/serviceSlice';
import { CheckCircle2, Zap, DollarSign, Clock, ArrowRight, ExternalLink, Github, FileText, Globe, Layers } from 'lucide-react';
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-20">
                    {services.map((service) => (
                        <div key={service._id} className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] overflow-hidden flex flex-col hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">

                            {/* Header Image / Pattern */}
                            <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                                {service.image ? (
                                    <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 opacity-20" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 to-transparent" />

                                {/* Icon Badge */}
                                <div className="absolute -bottom-8 left-8 size-16 rounded-2xl bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-950 flex items-center justify-center shadow-xl group-hover:-translate-y-2 transition-transform duration-500">
                                    {service.icon ? (
                                        <img src={service.icon} alt={service.title} className="size-8 object-contain" />
                                    ) : (
                                        <Zap className="size-8 text-blue-600" />
                                    )}
                                </div>
                            </div>

                            <div className="p-8 pt-12 flex flex-col flex-grow">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                                        {service.title || service.name}
                                    </h3>
                                    {service.category && (
                                        <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                            {service.category}
                                        </Badge>
                                    )}
                                </div>

                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
                                    {service.shortDescription || service.description}
                                </p>

                                {/* Features */}
                                {service.features?.length > 0 && (
                                    <div className="space-y-4 mb-8">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Features</p>
                                        <ul className="space-y-3">
                                            {service.features.slice(0, 4).map((feat, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <CheckCircle2 size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-none mb-1">{feat.title || feat}</span>
                                                        {feat.description && <span className="text-xs text-slate-400 line-clamp-1">{feat.description}</span>}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Pricing & Links */}
                                <div className="mt-auto space-y-6">
                                    {(service.pricing?.startingPrice || service.pricing?.deliveryTime) && (
                                        <div className="flex items-center gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                            {service.pricing.startingPrice && (
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Starts At</span>
                                                    <span className="text-lg font-black text-slate-900 dark:text-white">${service.pricing.startingPrice}</span>
                                                </div>
                                            )}
                                            {service.pricing.deliveryTime && (
                                                <div className="flex flex-col border-l border-slate-200 dark:border-slate-700 pl-6">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</span>
                                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{service.pricing.deliveryTime}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        <a
                                            href={`/contact?service=${service.title || service.name}`}
                                            className="flex-grow flex items-center justify-center gap-2 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-bold hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all group/btn shadow-xl shadow-slate-200 dark:shadow-none"
                                        >
                                            Get Started
                                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </a>
                                        {service.links?.demo && (
                                            <a
                                                href={service.links.demo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="size-14 flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                                title="View Demo"
                                            >
                                                <ExternalLink size={20} className="text-slate-500" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
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
