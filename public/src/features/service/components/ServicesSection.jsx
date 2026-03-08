import React from 'react';
import { useSelector } from 'react-redux';
import { Zap, ArrowRight, Star } from 'lucide-react';

const ServicesSection = () => {
    const { services, loading } = useSelector((state) => state.services);

    if (loading && services.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                ))}
            </div>
        );
    }

    if (!services || services.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto px-4">
            {services.slice(0, 6).map((service, index) => (
                <div
                    key={service._id || index}
                    className="group relative p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-500 flex flex-col items-start overflow-hidden shadow-sm hover:shadow-2xl"
                >
                    {/* Background Glow */}
                    <div className="absolute -right-10 -top-10 size-40 bg-purple-500/5 blur-[80px] group-hover:bg-purple-500/10 transition-all duration-500" />

                    {/* Upper Row: Icon & Category */}
                    <div className="flex w-full justify-between items-start mb-8">
                        <div className="size-16 rounded-2xl bg-slate-950 dark:bg-white flex items-center justify-center text-white dark:text-slate-950 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-slate-200 dark:shadow-none">
                            {service.icon ? (
                                <img src={service.icon} alt={service.title} className="size-10 object-contain" />
                            ) : (
                                <Zap size={28} />
                            )}
                        </div>
                        {service.category && (
                            <span className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                {service.category}
                            </span>
                        )}
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {service.title || service.name}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-8 flex-grow">
                        {service.shortDescription || service.description}
                    </p>

                    {/* Features Preview (if any) */}
                    {service.features?.length > 0 && (
                        <div className="w-full flex flex-wrap gap-2 mb-8">
                            {service.features.slice(0, 2).map((f, i) => (
                                <span key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                    <Star size={10} className="text-purple-500 fill-purple-500" />
                                    {f.title}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* CTA */}
                    <div className="w-full pt-6 border-t border-slate-100 dark:border-slate-800">
                        <a
                            href={`/services/${service._id}`}
                            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-950 dark:text-white group-hover:translate-x-2 transition-transform duration-500"
                        >
                            View Details
                            <ArrowRight size={14} className="text-purple-500" />
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ServicesSection;
