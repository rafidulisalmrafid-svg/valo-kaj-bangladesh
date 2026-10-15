import React from 'react';
import { Certificate } from '../types';
import { Award, ShieldCheck, QrCode, CheckCircle, ExternalLink, Printer } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface CertificatePreviewProps {
    certificate: Certificate;
    interactive?: boolean;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({ certificate, interactive = true }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="relative max-w-3xl mx-auto rounded-3xl p-1 bg-gradient-to-br from-amber-400 via-emerald-500 to-teal-600 shadow-xl">
            <div className="bg-white rounded-[22px] p-6 sm:p-10 border border-amber-200/60 relative overflow-hidden text-slate-900">
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Corner Ornaments */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-500/80" />
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-500/80" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-500/80" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-500/80" />

                {/* Certificate Header */}
                <div className="text-center space-y-2 mb-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Government & Community Recognized Digital Credential
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-serif">
                        Certificate of Community Impact
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 font-bengali">
                        ভালো কাজ বাংলাদেশ — ডিজিটাল সম্মাননা ও স্বীকৃতিপত্র
                    </p>
                </div>

                {/* Main Recipient Details */}
                <div className="text-center space-y-4 my-6 sm:my-8 relative z-10">
                    <p className="text-xs uppercase tracking-widest text-slate-500">
                        This digital recognition is proudly presented to
                    </p>

                    <h3 className="text-3xl sm:text-4xl font-black text-emerald-900 font-serif">
                        {certificate.recipient_name}
                    </h3>

                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                        <span>{certificate.district} District</span>
                        <span>•</span>
                        <span>{certificate.division} Division</span>
                    </div>

                    <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-700 leading-relaxed pt-2">
                        {certificate.achievement}
                    </p>
                </div>

                {/* Footer Validation Strip */}
                <div className="pt-8 mt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end relative z-10">
                    {/* Left: Issue Date & Cert ID */}
                    <div className="space-y-1 text-left">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                            Certificate ID
                        </span>
                        <p className="text-xs sm:text-sm font-mono font-bold text-amber-700">
                            {certificate.certificate_number}
                        </p>
                        <p className="text-[11px] text-slate-500">
                            Issued: {certificate.issue_date}
                        </p>
                    </div>

                    {/* Center: Official Seal */}
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center p-0.5 shadow-md mb-2">
                            <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center p-1 border border-amber-300">
                                <Award className="w-6 h-6 text-amber-600" />
                                <span className="text-[7px] font-bold text-amber-800 tracking-tighter">OFFICIAL SEAL</span>
                            </div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-900">Valo Kaj Bangladesh</span>
                        <span className="text-[9px] text-slate-500">National Impact Council</span>
                    </div>

                    {/* Right: QR Code & Verification Link */}
                    <div className="flex flex-col sm:items-end items-center space-y-1.5">
                        <div className="w-18 h-18 p-1 rounded-lg bg-white border border-slate-200 shadow-sm">
                            <img
                                src={certificate.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://valokaj.org/verify-certificate/${certificate.certificate_number}`}
                                alt="QR Code"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <Link
                            href={`/verify-certificate/${certificate.certificate_number}`}
                            className="inline-flex items-center gap-1 text-[10px] text-emerald-700 hover:text-emerald-800 font-semibold underline"
                        >
                            <span>Verify Online</span>
                            <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>
                </div>

                {/* Print button */}
                {interactive && (
                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2 print:hidden">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors shadow-xs"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print / Save PDF</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
