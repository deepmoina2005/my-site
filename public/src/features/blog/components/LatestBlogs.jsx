import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const LatestBlogs = () => {
    const { blogs, loading } = useSelector((state) => state.blogs);
    const latest = blogs.slice(0, 3);

    if (loading && blogs.length === 0) return null;

    return (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latest.map((blog) => (
                <Link key={blog._id} to={`/blog/${blog.slug}`} className="group flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-500">
                    <div className="aspect-video overflow-hidden relative">
                        {blog.coverImage ? (
                            <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-black uppercase tracking-tighter text-[10px]">No Thumbnail</div>
                        )}
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                {blog.category}
                            </span>
                        </div>
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                            {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <h3 className="text-xl font-black mb-4 group-hover:text-purple-600 transition-colors leading-tight uppercase tracking-tight">{blog.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-8 flex-grow leading-relaxed">
                            {blog.summary || blog.content?.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                        </p>
                        <div className="flex items-center gap-1.5 pt-6 border-t border-slate-50 dark:border-slate-800/50">
                            {blog.tags?.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-md">#{tag}</span>
                            ))}
                        </div>
                    </div>
                </Link>
            ))}
        </div>

    );
};

export default LatestBlogs;
