import React from 'react';
import { Download, FileText, Calendar, Tag } from 'lucide-react';

const NoteCard = ({ note }) => {
    return (
        <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 flex flex-col h-full">
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                {note.thumbnail ? (
                    <img
                        src={note.thumbnail}
                        alt={note.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-300 dark:text-slate-700">
                        <FileText size={64} strokeWidth={1} />
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest border border-slate-200/50 dark:border-slate-800/50">
                        {note.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-slate-400 mb-3">
                    <Calendar size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                        {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </span>
                </div>

                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                    {note.title}
                </h3>

                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-4">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {note.subject}
                    </span>
                    {note.semester && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            Sem {note.semester}
                        </span>
                    )}
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
                    {note.description || 'Access and download these study notes for your preparation.'}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {note.tags?.slice(0, 3).map((tag, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            <Tag size={10} /> {tag}
                        </div>
                    ))}
                </div>

                {/* Action */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <a
                        href={note.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 h-12 bg-slate-900 dark:bg-purple-600 hover:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-2xl font-bold transition-all group/btn"
                    >
                        <Download size={18} className="group-hover/btn:-translate-y-1 transition-transform" />
                        Download Notes
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
