import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Share2 } from 'lucide-react';
import Container from '@/shared/components/Container';
import blogAPI from '@/features/blog/blogAPI';

const BlogDetail = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                // Note: blogAPI has 'getById', assuming it can take slug if backend supports it
                // Or we need a getBySlug method. Let's look at blogAPI.
                const response = await blogAPI.getById(slug);
                setBlog(response.data.blog);
            } catch (err) {
                setError('Blog post not found');
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    if (loading) return <div className="pt-32 text-center">Loading article...</div>;
    if (error || !blog) return <div className="pt-32 text-center text-red-500">{error || 'Post not found'}</div>;

    return (
        <main className="pt-24 pb-16">
            <article>
                <Container className="max-w-4xl">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-purple-600 mb-10 transition-colors">
                        <ArrowLeft size={16} /> Back to articles
                    </Link>

                    <div className="space-y-6 mb-12">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full text-xs font-bold uppercase tracking-widest">{blog.category}</span>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                                <Calendar size={16} className="text-purple-500" />
                                {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                            {blog.title}
                        </h1>
                    </div>

                    {blog.coverImage && (
                        <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-purple-500/10">
                            <img src={blog.coverImage} alt={blog.title} className="w-full h-auto aspect-video object-cover" />
                        </div>
                    )}

                    <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                        {/* Using dangerouslySetInnerHTML because TipTap content is often HTML */}
                        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    </div>

                    <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm font-bold text-slate-500 mr-2 flex items-center gap-1"><Tag size={16} /> Tags:</span>
                            {blog.tags?.map(tag => (
                                <span key={tag} className="px-3 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-sm font-medium font-serif italic">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </Container>
            </article>
        </main>
    );
};

export default BlogDetail;
