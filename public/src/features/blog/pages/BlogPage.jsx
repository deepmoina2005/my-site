import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Container from '@/shared/components/Container';
import SectionTitle from '@/shared/components/SectionTitle';
import { fetchBlogs } from '@/features/blog/blogSlice';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BlogPage = () => {
    const dispatch = useDispatch();
    const { blogs, loading } = useSelector((state) => state.blogs);

    useEffect(() => {
        dispatch(fetchBlogs());
    }, [dispatch]);

    if (loading) return <div className="pt-32 text-center">Loading blogs...</div>;

    return (
        <main className="pt-24 pb-16">
            <Container>
                <SectionTitle text1="BLOG" text2="Insights & Thoughts" text3="My latest articles, tutorials, and insights from the tech world." />

                <div className="grid grid-cols-1 gap-8 mt-12 max-w-4xl mx-auto">
                    {blogs.map((blog) => (
                        <Link key={blog._id} to={`/blog/${blog.slug}`} className="group flex flex-col md:flex-row gap-6 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-purple-500/50 hover:bg-white dark:hover:bg-slate-900/50 transition-all duration-300">
                            <div className="md:w-64 aspect-video md:aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0">
                                {blog.coverImage ? (
                                    <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                                )}
                            </div>

                            <div className="flex flex-col justify-center py-2">
                                <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-purple-600 mb-3">
                                    <span>{blog.category}</span>
                                    <span className="text-slate-300 dark:text-slate-700">•</span>
                                    <div className="flex items-center gap-1 text-slate-500 normal-case font-medium">
                                        <Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-600 transition-colors">{blog.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                                    {blog.content?.replace(/<[^>]*>?/gm, '').substring(0, 160)}...
                                </p>

                                <div className="flex items-center gap-1 text-sm font-bold text-purple-600">
                                    Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {blogs.length === 0 && !loading && (
                    <p className="text-center py-20 text-slate-500">No blog posts found at the moment.</p>
                )}
            </Container>
        </main>
    );
};

export default BlogPage;
