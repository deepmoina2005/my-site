import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@/shared/components/Container';
import { fetchSkills } from '@/features/skill/skillSlice';
import SkillList from '@/features/skill/components/SkillList';
import { Search, Zap } from 'lucide-react';

const SkillsPage = () => {
    const dispatch = useDispatch();
    const { skills, loading } = useSelector((state) => state.skills);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        dispatch(fetchSkills());
        window.scrollTo(0, 0);
    }, [dispatch]);

    const categories = ['All', ...new Set(skills.map(skill => skill.category).filter(Boolean))];

    const filteredSkills = skills.filter(skill => {
        const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (skill.description && skill.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (skill.category && skill.category.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = activeCategory === 'All' || skill.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <main className="pb-24 min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
            {/* Elegant Header Section */}
            <div className="relative overflow-hidden mb-16">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 dark:from-purple-900/20 dark:to-blue-900/20 pointer-events-none" />
                <Container className="pt-12 pb-20 text-center relative z-10 mt-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-purple-200 dark:border-purple-800/50">
                        TECHNICAL EXPERTISE
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-none">
                        Current <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Skillset</span>
                    </h1>

                    {/* Floating Search Bar */}
                    <div className="max-w-2xl mx-auto relative group mb-12">
                        <div className="absolute inset-0 bg-purple-600/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-500 transition-colors">
                                <Search size={22} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by tech, tool, or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-18 pl-16 pr-8 rounded-[2rem] bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xl focus:ring-4 focus:ring-purple-500/10 outline-none text-lg transition-all text-center"
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap items-center justify-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${activeCategory === category
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg scale-105'
                                    : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:text-purple-600'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </Container>
            </div>

            <Container>
                {/* Skill Grid */}
                <div className="mt-10">
                    <SkillList data={filteredSkills} loading={loading} />
                </div>

                {!loading && skills.length > 0 && (
                    <div className="mt-20 text-center">
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <Zap size={18} className="text-purple-500" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Constantly Evolving Technical Stack
                            </span>
                        </div>
                    </div>
                )}
            </Container>
        </main>
    );
};

export default SkillsPage;
