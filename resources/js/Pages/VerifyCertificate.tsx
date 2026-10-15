import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Certificate } from '../types';
import { RoleSwitcher } from '../Components/RoleSwitcher';
import { Navbar } from '../Components/Navbar';
import { Footer } from '../Components/Footer';
import { CertificatePreview } from '../Components/CertificatePreview';
import { ShieldCheck, Search, CheckCircle2, AlertTriangle, QrCode } from 'lucide-react';

interface VerifyCertificateProps {
    certificate: Certificate | null;
    queriedNumber: string;
}

export default function VerifyCertificate({ certificate, queriedNumber }: VerifyCertificateProps) {
    const [certInput, setCertInput] = useState(queriedNumber);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (certInput.trim()) {
            router.get(`/verify-certificate/${certInput.trim()}`);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
            <Head title={`Verify Certificate ${certInput} — Valo Kaj Bangladesh`} />

            <RoleSwitcher />
            <Navbar />

            <main className="flex-1 py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        National Digital Registry Verification
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                        Verify Digital Certificate · সনদ সত্যতা যাচাই
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 font-bangla max-w-lg mx-auto">
                        যেকোনো অফিসিয়াল সনদপত্রের সত্যতা ও কিউআর কোড রেকর্ড যাচাই করুন।
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto bg-white border border-slate-200/90 rounded-2xl p-2 shadow-sm">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={certInput}
                                onChange={(e) => setCertInput(e.target.value)}
                                placeholder="Enter Certificate Number (e.g. VKB-2026-04829)"
                                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-sm"
                        >
                            Verify
                        </button>
                    </form>
                </div>

                {/* Validation Status Notice */}
                {certificate ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-1 shadow-xs">
                        <div className="inline-flex items-center gap-2 text-emerald-800 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>100% Authenticated Official Credential</span>
                        </div>
                        <p className="text-xs text-slate-700">
                            Certificate ID <strong className="text-slate-900">{certificate.certificate_number}</strong> is officially registered to{' '}
                            <strong className="text-slate-900">{certificate.recipient_name}</strong> in {certificate.district} District.
                        </p>
                    </div>
                ) : (
                    <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2 shadow-xs">
                        <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
                        <h4 className="font-bold text-slate-900 text-base">Certificate Not Found</h4>
                        <p className="text-xs text-slate-600 max-w-md mx-auto">
                            No active certificate matches the entered number "{queriedNumber}". Please check the certificate code printed on your document.
                        </p>
                    </div>
                )}

                {/* Live Certificate Display */}
                {certificate && (
                    <div className="pt-2">
                        <CertificatePreview certificate={certificate} interactive={true} />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
