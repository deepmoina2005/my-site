import React from 'react';
import { useSelector } from 'react-redux';
import { ArrowUpRight } from 'lucide-react';

const LatestProducts = () => {
    const { products, loading } = useSelector((state) => state.products);
    const latest = products.slice(0, 3);

    if (loading && products.length === 0) return null;

    return (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latest.map((product) => (
                <div key={product._id} className="group flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-500">
                    <div className="aspect-video overflow-hidden relative shadow-inner">
                        {product.thumbnail ? (
                            <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-black uppercase tracking-widest text-[10px]">No Thumbnail</div>
                        )}
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-slate-100 dark:border-slate-800">
                                {product.category || 'Product'}
                            </span>
                        </div>
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                        <h3 className="text-2xl font-black mb-2 group-hover:text-purple-600 transition-colors uppercase tracking-tight leading-tight">{product.title}</h3>
                        {product.subject && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">{product.subject}</p>}

                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-8 flex-grow leading-relaxed">
                            {product.description}
                        </p>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800/50">
                            <a href={product.subject?.startsWith('http') ? product.subject : '#'} target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-purple-600 hover:translate-x-1 transition-transform">
                                Access Tool <ArrowUpRight size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>

    );
};

export default LatestProducts;
