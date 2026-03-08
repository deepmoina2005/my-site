import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@/shared/components/Container';
import SectionTitle from '@/shared/components/SectionTitle';
import { fetchProducts } from '@/features/product/productSlice';
import { Tag, ArrowUpRight, Globe } from 'lucide-react';

const ProductsPage = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) return <div className="pt-32 text-center">Loading products...</div>;

    return (
        <main className="pt-24 pb-16">
            <Container>
                <SectionTitle text1="STORE" text2="Digital Products" text3="Tools, templates, and resources to help you build better products." />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {products.map((product) => (
                        <div key={product._id} className="group overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                            <div className="aspect-[16/10] overflow-hidden relative">
                                {product.thumbnail ? (
                                    <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xs">No Image Available</div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-slate-100 dark:border-slate-800">
                                        {product.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold group-hover:text-purple-600 transition-colors uppercase tracking-tight">{product.title}</h3>
                                </div>

                                {product.subject && (
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-4 uppercase tracking-tighter">
                                        <Globe size={12} className="text-purple-500" /> {product.subject}
                                    </div>
                                )}

                                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="space-y-6 mt-auto">
                                    {product.tags?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                                            {product.tags.map(tag => (
                                                <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                                    <Tag size={10} /> {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <a href={product.subject?.startsWith('http') ? product.subject : '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-purple-500/20 uppercase tracking-widest text-xs group">
                                        Access Resource <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {products.length === 0 && !loading && (
                    <p className="text-center py-20 text-slate-500 col-span-full">Product inventory is empty right now.</p>
                )}
            </Container>
        </main>
    );
};

export default ProductsPage;

