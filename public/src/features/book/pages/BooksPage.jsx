import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@/shared/components/Container';
import SectionTitle from '@/shared/components/SectionTitle';
import { fetchBooks } from '@/features/book/bookSlice';
import { BookOpen, Download, Tag } from 'lucide-react';

const BooksPage = () => {
    const dispatch = useDispatch();
    const { books, loading } = useSelector((state) => state.books);

    useEffect(() => {
        dispatch(fetchBooks());
    }, [dispatch]);

    if (loading) return <div className="pt-32 text-center">Loading books...</div>;

    return (
        <main className="pt-24 pb-16">
            <Container>
                <SectionTitle text1="LIBRARY" text2="Books & Reading" text3="My published books, recommended reads, and technical guides." />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {books.map((book) => (
                        <div key={book._id} className="group flex flex-col h-[550px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                            <div className="aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800 relative shadow-inner">
                                {book.thumbnail ? (
                                    <img src={book.thumbnail} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold uppercase tracking-tighter text-xs">No Cover Image</div>
                                )}
                                <div className="absolute top-4 left-4 p-2 bg-white/90 dark:bg-slate-900/90 rounded-xl backdrop-blur-md shadow-lg border border-slate-100 dark:border-slate-800">
                                    <BookOpen size={18} className="text-purple-600" />
                                </div>
                                <div className="absolute bottom-4 right-4">
                                    <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                        {book.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold mb-1 line-clamp-1 uppercase tracking-tight group-hover:text-purple-600 transition-colors">{book.title}</h3>
                                {book.author && <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest italic">{book.author}</p>}

                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-4 mb-6 flex-grow leading-relaxed">
                                    {book.description}
                                </p>

                                <div className="space-y-6 mt-auto">
                                    {book.tags?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                                            {book.tags.map(tag => (
                                                <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                                    <Tag size={10} /> {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {book.bookFileUrl && (
                                        <a href={book.bookFileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-3.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 dark:hover:bg-purple-600 hover:text-white transition-all shadow-xl shadow-slate-900/10 group">
                                            Download / View <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {books.length === 0 && !loading && (
                    <p className="text-center py-20 text-slate-500 col-span-full">Wait for it... library is being updated.</p>
                )}
            </Container>
        </main>
    );
};

export default BooksPage;

