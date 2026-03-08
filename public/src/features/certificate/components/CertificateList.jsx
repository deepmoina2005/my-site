import React from "react";
import { useSelector } from "react-redux";
import { ExternalLink, Calendar, Award, FileText, CheckCircle } from "lucide-react";

const CertificateList = () => {
  const { certificates, loading } = useSelector((state) => state.certificates);

  if (loading)
    return (
      <div className="text-center py-16 text-slate-500 font-semibold">
        Loading certificates...
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mt-12">

      {certificates.map((cert, index) => (
        <div
          key={cert._id || index}
          className="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 flex flex-col h-full hover:-translate-y-1"
        >

          {/* Image Section */}
          <div className="aspect-[4/3] overflow-hidden relative bg-slate-100 dark:bg-slate-800">

            {cert.image ? (
              <img
                src={cert.image}
                alt={cert.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Award size={56} strokeWidth={1} />
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            {/* Certified badge */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-slate-900/90 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
              <CheckCircle size={10} className="text-green-500" />
              Certified
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-grow">

            <h3 className="font-black text-xl mb-1 group-hover:text-purple-600 transition-colors tracking-tight">
              {cert.title}
            </h3>

            <p className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-widest">
              {cert.issuer}
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">

              {/* Dates */}
              {(cert.issueMonth || cert.issueYear) && (
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Calendar size={14} className="text-purple-500" />
                  Issued: {cert.issueMonth} {cert.issueYear}

                  {cert.expirationMonth || cert.expirationYear ? (
                    <> • Exp: {cert.expirationMonth} {cert.expirationYear}</>
                  ) : (
                    <> • No expiration</>
                  )}
                </div>
              )}

              {/* Credential ID */}
              {cert.credentialId && (
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                  ID: {cert.credentialId}
                </div>
              )}

              {/* Skills */}
              {cert.skills && cert.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {cert.skills.map((skill, si) => (
                    <span
                      key={si}
                      className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-bold uppercase tracking-wider rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Links */}
              <div className="flex flex-wrap items-center gap-4 pt-3">

                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 hover:text-purple-700 transition-transform hover:translate-x-1"
                  >
                    Show Credential <ExternalLink size={14} />
                  </a>
                )}

                {cert.media &&
                  cert.media.length > 0 &&
                  cert.media.map((m, mi) => (
                    <a
                      key={mi}
                      href={m}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-purple-600"
                    >
                      <FileText size={14} /> Media {mi + 1}
                    </a>
                  ))}
              </div>

            </div>
          </div>
        </div>
      ))}

      {/* Empty state */}
      {certificates.length === 0 && !loading && (
        <p className="text-center col-span-full text-slate-400 py-20 font-bold uppercase tracking-[0.2em]">
          No certificates found
        </p>
      )}

    </div>
  );
};

export default CertificateList;