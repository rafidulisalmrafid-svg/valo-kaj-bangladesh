import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Campaign, GoodDeed, User } from '../../types';
import { RoleSwitcher } from '../../Components/RoleSwitcher';
import { Navbar } from '../../Components/Navbar';
import { Footer } from '../../Components/Footer';
import {
    Building2,
    Users,
    HeartHandshake,
    Sparkles,
    CheckCircle2,
    Download,
    PlusCircle,
    TrendingUp,
} from 'lucide-react';

interface OrgDashboardProps {
    stats: {
        org_name: string;
        total_members: number;
        total_deeds: number;
        impact_score: number;
        active_campaigns: number;
    };
    members: User[];
    campaigns: Campaign[];
}

export default function OrganizationDashboard({
    stats,
    members,
    campaigns,
}: OrgDashboardProps) {
    const handleDownloadReport = () => {
        alert('Impact Report downloaded as PDF/CSV successfully.');
    };

    return (
        <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
            <Head title={`Organization Portal — ${stats.org_name} — Valo Kaj Bangladesh`} />

            <RoleSwitcher />
            <Navbar />

            <main className="flex-1 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
                {/* Header */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-sm">
                            <Building2 className="w-8 h-8" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                                Verified Community Organization
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.org_name}</h1>
                            <p className="text-xs text-slate-600 font-bangla">
                                সামাজিক সংগঠন ও ক্লাবের সমষ্টিগত মানবিক কার্যক্রম ড্যাশবোর্ড
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleDownloadReport}
                        className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download Impact Report (PDF)</span>
                    </button>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-emerald-600" />
                            Registered Members
                        </span>
                        <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                            {stats.total_members}
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                            <HeartHandshake className="w-4 h-4 text-teal-600" />
                            Total Good Deeds
                        </span>
                        <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                            {stats.total_deeds}
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            Impact Score
                        </span>
                        <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
                            {stats.impact_score.toLocaleString()}
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Active Campaigns
                        </span>
                        <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
                            {stats.active_campaigns}
                        </p>
                    </div>
                </div>

                {/* Organization Team & Campaigns */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Members */}
                    <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <Users className="w-4 h-4 text-emerald-600" />
                                Team Members ({members.length})
                            </h3>
                            <button
                                type="button"
                                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                            >
                                + Invite Volunteer
                            </button>
                        </div>

                        <div className="space-y-2.5">
                            {members.map((m) => (
                                <div
                                    key={m.id}
                                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                                            {m.name.charAt(0)}
                                        </div>
                                        <div>
                                            <span className="font-bold text-xs text-slate-900 block">{m.name}</span>
                                            <span className="text-[10px] text-slate-500">{m.district}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-700">{m.impact_score} pts</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Organization Campaigns */}
                    <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                Launched Campaigns ({campaigns.length})
                            </h3>
                            <Link
                                href="/campaigns"
                                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                            >
                                + New Campaign
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {campaigns.map((c) => (
                                <div
                                    key={c.id}
                                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                                >
                                    <h4 className="font-bold text-sm text-slate-900">{c.title}</h4>
                                    <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>
                                    <div className="flex items-center justify-between text-[11px] text-emerald-700 pt-1 border-t border-slate-200">
                                        <span>Beneficiaries: {c.current_beneficiaries}</span>
                                        <span>Status: {c.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
