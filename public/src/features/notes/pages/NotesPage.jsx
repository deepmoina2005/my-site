import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes } from '../noteSlice';
import Container from '@/shared/components/Container';
import SectionTitle from '@/shared/components/SectionTitle';
import NoteCard from '../components/NoteCard';
import { Search, Filter, Loader2, BookOpen } from 'lucide-react';

const NotesPage = () => {
    const dispatch = useDispatch();
    const { notes, loading, error } = useSelector((state) => state.notes);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        dispatch(fetchNotes());
    }, [dispatch]);

    const categories = ['All', ...new Set(notes.map((note) => note.category))];

    const filteredNotes = notes.filter((note) => {
        const matchesSearch =
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (error) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-slate-500">
                <p className="text-xl font-bold mb-4">Error loading notes</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return (
        <main className="pt-24 pb-16 min-h-screen">
            <Container>
                <SectionTitle
                    text1="RESOURCES"
                    text2="Educational Notes"
                    text3="Comprehensive study materials and notes curated for your learning journey."
                />

                {/* Filters and Search */}
                <div className="mt-12 flex flex-col md:flex-row gap-6 mb-12">
                    {/* Search */}
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by title, subject or category..."
                            className="w-full h-14 pl-12 pr-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium text-slate-900 dark:text-white shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 h-14 rounded-2xl font-bold transition-all whitespace-nowrap border shadow-sm ${selectedCategory === cat
                                        ? 'bg-purple-600 border-purple-600 text-white'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-purple-500/50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notes Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-purple-600">
                        <Loader2 size={48} strokeWidth={1.5} className="animate-spin mb-4" />
                        <p className="font-bold uppercase tracking-widest text-xs">Loading resources...</p>
                    </div>
                ) : filteredNotes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredNotes.map((note) => (
                            <NoteCard key={note._id} note={note} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-slate-50 dark:bg-slate-800/20 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-700 mb-6 shadow-sm">
                            <BookOpen size={40} strokeWidth={1} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No notes found</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                            We couldn't find any notes matching your search criteria. Try a different keyword or category.
                        </p>
                    </div>
                )}
            </Container>
        </main>
    );
};

export default NotesPage;
