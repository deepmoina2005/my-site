import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Container from '@/shared/components/Container';
import { fetchBlogs } from '@/features/blog/blogSlice';
import { Search, Calendar, User, ArrowRight, LayoutGrid, List as ListIcon } from 'lucide-react';

const BlogPage = () => {
    const dispatch = useDispatch();
    const { blogs, loading } = useSelector((state) => state.blogs);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        dispatch(fetchBlogs());
    }, [dispatch]);

    const categories = ['All', ...new Set(blogs.map(blog => blog.category).filter(Boolean))];

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (blog.summary && blog.summary.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = activeCategory === 'All' || blog.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <main className="pb-24 min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
            {/* Elegant Header Section */}
            <div className="relative overflow-hidden mb-16">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 dark:from-purple-900/20 dark:to-blue-900/20 pointer-events-none" />
                <Container className="pt-12 pb-20 text-center relative z-10 mt-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                        Insights & Articles
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-none">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Digital</span> Journal
                    </h1>

                    {/* Floating Search Bar */}
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute inset-0 bg-purple-600/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-500 transition-colors">
                                <Search size={22} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search articles, wisdom, or tech..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-18 pl-16 pr-8 rounded-[2rem] bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xl focus:ring-4 focus:ring-purple-500/10 outline-none text-lg transition-all"
                            />
                        </div>
                    </div>
                </Container>
            </div>

            <Container>
                {/* Modern Category Filter */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-20 overflow-x-auto pb-4 scrollbar-hide">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border ${activeCategory === category
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xl scale-105'
                                : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-100 dark:border-slate-800 hover:border-purple-500/50 hover:text-purple-600'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Blog Grid with Mixed Layouts */}
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-20">
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="flex flex-col lg:flex-row gap-12 animate-pulse">
                                <div className="w-full lg:w-[500px] aspect-[16/10] bg-slate-100 dark:bg-slate-900 rounded-[2.5rem]" />
                                <div className="flex-1 space-y-6 py-4">
                                    <div className="h-4 bg-slate-100 dark:bg-slate-900 rounded-full w-24" />
                                    <div className="h-12 bg-slate-100 dark:bg-slate-900 rounded-2xl w-3/4" />
                                    <div className="space-y-3">
                                        <div className="h-4 bg-slate-100 dark:bg-slate-900 rounded-full w-full" />
                                        <div className="h-4 bg-slate-100 dark:bg-slate-900 rounded-full w-5/6" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : filteredBlogs.length > 0 ? (
                        filteredBlogs.map((blog, idx) => (
                            <div key={blog._id} className="group relative flex flex-col lg:flex-row gap-12 items-center">
                                {/* Visual Side */}
                                <Link
                                    to={`/blog/${blog.slug}`}
                                    className="w-full lg:w-[550px] aspect-[16/10] overflow-hidden rounded-[3rem] relative shadow-2xl transition-all duration-700 group-hover:shadow-purple-500/20 group-hover:-translate-y-2"
                                >
                                    {blog.coverImage ? (
                                        <img
                                            src={blog.coverImage}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 font-black uppercase tracking-widest text-xs">
                                            No Visual
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </Link>

                                {/* Meta Side */}
                                <div className="flex flex-col flex-1 max-w-2xl px-4 lg:px-0">
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="px-5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-[0.1em] border border-purple-100 dark:border-purple-800/50">
                                            {blog.category || 'Article'}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>

                                    <Link to={`/blog/${blog.slug}`}>
                                        <h2 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white mb-6 leading-[1.1] group-hover:text-purple-600 transition-colors tracking-tight">
                                            {blog.title}
                                        </h2>
                                    </Link>

                                    <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 line-clamp-2 leading-relaxed font-medium">
                                        {blog.summary || blog.content?.replace(/<[^>]*>?/gm, '').substring(0, 160)}...
                                    </p>

                                    <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-800/80">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden">
                                                {blog.author?.image ? (
                                                    <img src={blog.author.image} className="w-full h-full object-cover" />
                                                ) : <User size={18} className="text-slate-400" />}
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 dark:text-slate-200">{blog.author?.name || 'Admin'}</span>
                                        </div>

                                        <Link
                                            to={`/blog/${blog.slug}`}
                                            className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest group-hover:gap-4 transition-all"
                                        >
                                            Explore <ArrowRight size={18} className="text-purple-600" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-40 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem]">
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Silence in the archives...</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mb-10">We couldn't find any articles matching your current filter.</p>
                            <button
                                onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                                className="px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-purple-500/20"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </Container>
        </main>
    );
};

export default BlogPage;