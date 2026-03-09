
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Share2, Check, User, Clock, Copy } from 'lucide-react';
import Container from '@/shared/components/Container';
import blogAPI from '@/features/blog/blogAPI';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ children, language, isDarkMode, ...props }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(children).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="relative group/code my-10">
            <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-[2rem] blur-xl opacity-0 group-hover/code:opacity-100 transition-opacity" />

            <button
                onClick={handleCopy}
                className="absolute top-5 right-5 z-10 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover/code:opacity-100 transition-all active:scale-90 shadow-lg"
                aria-label="Copy code"
            >
                {copied ? (
                    <Check size={16} className="text-green-400" />
                ) : (
                    <Copy size={16} className="text-slate-300" />
                )}
            </button>

            <SyntaxHighlighter
                style={isDarkMode ? oneDark : oneLight}
                language={language}
                PreTag="div"
                {...props}
                customStyle={{
                    borderRadius: '1.5rem',
                    padding: '1.5rem',
                    paddingRight: '3.5rem',
                    fontSize: '0.9rem',
                    border: isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
                    overflowX: 'auto',
                    margin: 0
                }}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        </div>
    );
};

const BlogDetail = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [copied, setCopied] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Fetch blog
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const response = await blogAPI.getById(slug);
                setBlog(response.data.blog);
                window.scrollTo(0, 0);
            } catch (err) {
                setError('Blog post not found');
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    // Scroll progress bar
    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight =
                document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${(totalScroll / windowHeight) * 100}`;
            setScrollProgress(scroll);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Dark mode observer
    useEffect(() => {
        const updateTheme = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };
        updateTheme();
        const observer = new MutationObserver(() => updateTheme());
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return (
        <div className="min-h-screen pt-40 pb-20 flex flex-col items-center justify-center gap-6">
            <div className="size-16 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Curating Wisdom...</p>
        </div>
    );

    if (error || !blog) return (
        <div className="min-h-screen pt-40 pb-20 text-center">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Fragmented Transmission</h2>
            <p className="text-slate-500 mb-8">{error || 'This article has drifted into the void.'}</p>
            <Link to="/blog" className="text-purple-600 font-black uppercase tracking-widest text-xs border-b-2 border-purple-600 pb-1">Return to Archives</Link>
        </div>
    );

    return (
        <div className="bg-white dark:bg-slate-950 transition-colors duration-500">
            {/* Elegant Scroll Progress */}
            <div
                className="fixed top-0 left-0 h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 z-[100] transition-all duration-300 ease-out shadow-[0_0_15px_rgba(147,51,234,0.5)]"
                style={{ width: `${scrollProgress}%` }}
            />

            <main className="pt-32 pb-32 relative">
                <article>
                    <Container className="max-w-4xl">
                        {/* Meta Header */}
                        <div className="flex flex-col items-center text-center mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <Link
                                    to="/blog"
                                    className="size-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-purple-600 hover:bg-white transition-all shadow-sm group"
                                >
                                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                </Link>
                                <span className="px-5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-widest border border-purple-100 dark:border-purple-800/50">
                                    {blog.category || 'Article'}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black text-slate-950 dark:text-white mb-10 leading-[1.05] tracking-tight">
                                {blog.title}
                            </h1>

                            <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 text-[11px] font-bold uppercase tracking-[0.1em]">
                                <div className="flex items-center gap-2">
                                    <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-800">
                                        {blog.author?.image ? <img src={blog.author.image} /> : <User size={14} className="m-auto mt-1.5" />}
                                    </div>
                                    <span className="text-slate-900 dark:text-slate-200">{blog.author?.name || 'Admin'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-purple-500" />
                                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>
                                {blog.readTime && (
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-blue-500" />
                                        {blog.readTime} min read
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Premium Cover Image */}
                        {blog.coverImage && (
                            <div className="mb-20 group relative">
                                <div className="absolute inset-0 bg-purple-600/20 blur-3xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
                                    <img
                                        src={blog.coverImage}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Content Body */}
                        <div
                            className="prose prose-lg dark:prose-invert prose-purple max-w-none 
                                prose-headings:text-slate-950 dark:prose-headings:text-white prose-headings:font-black prose-headings:tracking-tighter
                                prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-[1.8] prose-p:mb-8
                                prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-a:no-underline prose-a:font-black prose-a:border-b-2 prose-a:border-purple-600/20 hover:prose-a:border-purple-600 transition-all
                                prose-img:rounded-[2.5rem] prose-img:shadow-2xl prose-img:my-16
                                prose-blockquote:border-l-4 prose-blockquote:border-purple-600 prose-blockquote:bg-purple-50/50 dark:prose-blockquote:bg-purple-900/10 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:rounded-r-3xl prose-blockquote:italic
                                prose-pre:bg-transparent prose-pre:p-0 prose-pre:my-12 prose-pre:overflow-hidden"
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        return !inline && match ? (
                                            <CodeBlock
                                                language={match[1]}
                                                isDarkMode={isDarkMode}
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, '')}
                                            </CodeBlock>
                                        ) : (
                                            <code className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 text-sm font-bold" {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                }}
                            >
                                {blog.content}
                            </ReactMarkdown>
                        </div>

                        {/* Footer Meta */}
                        <div className="mt-24 pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10">
                            <div className="flex flex-wrap gap-3">
                                {blog.tags?.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-xl text-[11px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-800 hover:text-purple-500 hover:border-purple-500/30 transition-all cursor-default"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={handleShare}
                                className="flex items-center gap-3 px-8 py-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-950/20 dark:shadow-white/10"
                            >
                                {copied ? <Check size={16} /> : <Share2 size={16} />}
                                {copied ? 'Transmission Copied' : 'Share Wisdom'}
                            </button>
                        </div>
                    </Container>
                </article>
            </main>
        </div>
    );
};

export default BlogDetail;