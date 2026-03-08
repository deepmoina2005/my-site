import React from "react";
import { useSelector } from "react-redux";
import { ExternalLink, Calendar, Award, FileText, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const CertificateList = () => {
  const { certificates, loading } = useSelector((state) => state.certificates);

  if (loading)
    return (
      <div className="text-center py-16 text-slate-500 font-semibold">
        Loading certificates...
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">

      {certificates.map((cert, index) => (
        <Link
          to={`/certificates/${cert._id}`}
          key={cert._id || index}
          className="group  relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 flex flex-col hover:-translate-y-1 block"
        >

          {/* Image Section */}
          <div className="aspect-[16/9] overflow-hidden relative bg-slate-100 dark:bg-slate-800">

            {cert.image ? (
              <img
                src={cert.image}
                alt={cert.title}
                className="w-full p-2 rounded-2xl h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Award size={48} strokeWidth={1} />
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            {/* Certified badge */}
            <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 dark:bg-slate-900/90 rounded-full text-[10px] font-black uppercase tracking-widest shadow border border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
              <CheckCircle size={10} className="text-green-500" />
              Certified
            </div>

          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-grow">

            <h3 className="font-bold text-lg mb-1 group-hover:text-purple-600 transition-colors truncate">
              {cert.title}
            </h3>

            <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-widest">
              {cert.issuer}
            </p>

            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex-grow">

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

            </div>
          </div>
        </Link>
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