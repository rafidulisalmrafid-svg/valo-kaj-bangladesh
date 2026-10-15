import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Campaign, Category } from '../types';
import { RoleSwitcher } from '../Components/RoleSwitcher';
import { Navbar } from '../Components/Navbar';
import { Footer } from '../Components/Footer';
import {
    Sparkles,
    Calendar,
    Users,
    HeartHandshake,
    CheckCircle2,
    ArrowRight,
    TrendingUp,
} from 'lucide-react';

interface CampaignsProps {
    campaigns: Campaign[];
    categories: Category[];
}

export default function Campaigns({ campaigns, categories }: CampaignsProps) {
    const handleJoin = (id: number) => {
        router.post(`/campaigns/${id}/join`, {}, { preserveScroll: true });
    };

    return (
        <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
            <Head title="Impact Campaigns — Valo Kaj Bangladesh" />

            <RoleSwitcher />
            <Navbar />

            <main className="flex-1 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8 sm:space-y-10">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        National Social Drives
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                        Active Impact Campaigns · সামাজিক কর্মসূচি
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 font-bangla max-w-xl mx-auto">
                        দেশজুড়ে চলমান সামাজিক পরিবর্তন ও সাহায্য কর্মসূচিতে সরাসরি অংশ নিন এবং সমষ্টিগত প্রভাব সৃষ্টি করুন।
                    </p>
                </div>

                {/* Campaigns List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {campaigns.map((camp) => {
                        const progressPercent = Math.min(
                            100,
                            Math.round((camp.current_deeds / camp.target_deeds) * 100)
                        );

                        return (
                            <div
                                key={camp.id}
                                className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
                            >
                                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                                    <img
                                        src={camp.banner || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80'}
                                        alt={camp.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm">
                                            {camp.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                                            {camp.title}
                                        </h3>
                                        <p className="text-sm text-emerald-700 font-bangla font-semibold">
                                            {camp.title_bn}
                                        </p>
                                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-bangla">
                                            {camp.description}
                                        </p>
                                    </div>

                                    {/* Progress Tracker */}
                                    <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-600 font-medium">Campaign Progress</span>
                                            <span className="font-bold text-emerald-700">
                                                {progressPercent}% Complete
                                            </span>
                                        </div>

                                        <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-500"
                                                style={{ width: `${progressPercent}%` }}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                                            <span>{camp.current_deeds.toLocaleString()} deeds done</span>
                                            <span>Goal: {camp.target_deeds.toLocaleString()} deeds</span>
                                        </div>
                                    </div>

                                    {/* Footer details & Action */}
                                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                                        <div className="text-xs text-slate-600">
                                            <span>Organized by: </span>
                                            <strong className="text-slate-900">{camp.organizer_name}</strong>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleJoin(camp.id)}
                                            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <HeartHandshake className="w-4 h-4" />
                                            <span>Join Campaign</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            <Footer />
        </div>
    );
}
