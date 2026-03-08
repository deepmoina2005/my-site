import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, Award, CheckCircle, FileText } from 'lucide-react';
import Container from '@/shared/components/Container';
import certificateAPI from '@/features/certificate/certificateAPI';

const CertificateDetail = () => {
    const { id } = useParams();
    const [cert, setCert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                setLoading(true);
                const response = await certificateAPI.getById(id);
                // The API might return it wrapped in an object like { entity: {...} } or directly.
                // Depending on the backend framework (e.g. from backend: { success: true, entity: {...} })
                setCert(response.data.entity || response.data.certificate || response.data);
            } catch (err) {
                setError('Certificate not found');
            } finally {
                setLoading(false);
            }
        };
        fetchCertificate();
    }, [id]);

    if (loading) return <div className="pt-32 pb-32 text-center text-slate-500 font-semibold uppercase tracking-widest">Loading certificate details...</div>;
    if (error || !cert) return <div className="pt-32 pb-32 text-center text-red-500 font-semibold uppercase tracking-widest">{error || 'Certificate not found'}</div>;

    const formatIssueDate = () => {
        if (!cert.issueMonth && !cert.issueYear) return "Unknown";
        return `${cert.issueMonth || ''} ${cert.issueYear || ''}`.trim();
    };

    const formatExpDate = () => {
        if (!cert.expirationMonth && !cert.expirationYear) return "No expiration date";
        return `${cert.expirationMonth || ''} ${cert.expirationYear || ''}`.trim();
    };

    return (
        <main className="pt-24 pb-16">
            <Container>
                <Link to="/certificates" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-purple-600 mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to certificates
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Details */}
                    <div className="space-y-8">
                        <div>
                            {cert.issuer && (
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">
                                    <Award size={12} className="text-purple-500" /> {cert.issuer}
                                </span>
                            )}
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{cert.title}</h1>

                            <div className="flex flex-wrap gap-6 text-sm text-slate-500 font-medium bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">

                                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                    <CheckCircle size={18} className="text-green-500" />
                                    <span>Verified Credential</span>
                                </div>

                                <div className="flex flex-col gap-2 w-full mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-slate-400" />
                                        <span><strong>Issued:</strong> {formatIssueDate()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-slate-400 opacity-50" />
                                        <span className="opacity-80"><strong>Expires:</strong> {formatExpDate()}</span>
                                    </div>
                                    {cert.credentialId && (
                                        <div className="mt-2 font-mono text-xs p-2 bg-slate-100 dark:bg-slate-800 rounded-lg max-w-max border border-slate-200 dark:border-slate-700">
                                            <strong>Credential ID:</strong> <span className="select-all">{cert.credentialId}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {cert.description && (
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <h3 className="text-xl font-bold mb-3">Description</h3>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                                    {cert.description}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-4 pt-4">
                            {cert.link && (
                                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-purple-500/25 uppercase tracking-widest text-sm">
                                    <ExternalLink size={20} /> Verify Credential
                                </a>
                            )}
                        </div>

                        {cert.skills && cert.skills.length > 0 && (
                            <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                    <Award size={16} /> Skills Acquired
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {cert.skills.map(skill => (
                                        <span key={skill} className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30 rounded-xl text-xs font-bold uppercase tracking-wider">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {cert.media && cert.media.length > 0 && (
                            <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                    <FileText size={16} /> Additional Media
                                </h3>
                                <div className="flex flex-col gap-3">
                                    {cert.media.map((m, mi) => (
                                        <a href={m} target="_blank" rel="noopener noreferrer" key={mi} className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 dark:hover:text-purple-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 w-fit">
                                            <FileText size={16} /> View Document {mi + 1}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Image */}
                    <div className="space-y-6">
                        <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl shadow-purple-500/5 bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
                            {cert.image ? (
                                <img src={cert.image} alt={cert.title} className="w-full h-auto rounded-xl shadow-sm border border-slate-200 dark:border-slate-700" />
                            ) : (
                                <div className="aspect-[4/3] w-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                    <Award size={64} strokeWidth={1} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </main>
    );
};

export default CertificateDetail;
