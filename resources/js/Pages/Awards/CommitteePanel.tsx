import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Award as AwardType, GoodDeed } from '../../types';
import { DISTRICTS } from '../../data/bangladeshGeodata';
import { RoleSwitcher } from '../../Components/RoleSwitcher';
import { Navbar } from '../../Components/Navbar';
import { Footer } from '../../Components/Footer';
import {
    Trophy,
    Award,
    Sparkles,
    CheckCircle2,
    Calendar,
    Crown,
    Medal,
} from 'lucide-react';

interface CommitteePanelProps {
    shortlistedDeeds: GoodDeed[];
    existingAwards: AwardType[];
    district: string;
}

export default function CommitteePanel({
    shortlistedDeeds,
    existingAwards,
    district,
}: CommitteePanelProps) {
    const [selectedDeedId, setSelectedDeedId] = useState<number | null>(
        shortlistedDeeds.length > 0 ? shortlistedDeeds[0].id : null
    );
    const [level, setLevel] = useState<'district' | 'division' | 'national'>('district');
    const [rankName, setRankName] = useState('District Champion');
    const [citation, setCitation] = useState('Outstanding commitment and verifiable community impact for the month.');

    const handleDistrictChange = (newDist: string) => {
        router.get('/awards/committee', { district: newDist });
    };

    const handleGrantAward = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDeedId) return;

        router.post('/awards/grant', {
            good_deed_id: selectedDeedId,
            level,
            rank_name: rankName,
            citation,
        }, {
            preserveScroll: true,
        });
    };

    return (
        <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
            <Head title="Award Committee Jury Panel — Valo Kaj Bangladesh" />

            <RoleSwitcher />
            <Navbar />

            <main className="flex-1 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
                {/* Header */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                            <Trophy className="w-4 h-4 text-amber-600" />
                            <span>Monthly & National Awards Jury</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Award Committee Selection Panel
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-600 font-bangla mt-0.5">
                            প্রতি মাসে শীর্ষ ২০ যাচাইকৃত ভালো কাজ থেকে জেলা, বিভাগ ও জাতীয় চ্যাম্পিয়ন নির্বাচন।
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-slate-600">Shortlist District:</label>
                        <select
                            value={district}
                            onChange={(e) => handleDistrictChange(e.target.value)}
                            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                        >
                            {DISTRICTS.map((d) => (
                                <option key={d.name} value={d.name}>
                                    {d.name} ({d.name_bn})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Top 20 Shortlisted Deeds for Selected District */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-600" />
                                Top 20 Shortlisted Deeds — {district}
                            </h3>
                            <span className="text-xs text-emerald-700 font-bold">
                                Ranked by Impact Score & Verification
                            </span>
                        </div>

                        <div className="space-y-3">
                            {shortlistedDeeds.map((deed, index) => {
                                const isSelected = selectedDeedId === deed.id;
                                return (
                                    <div
                                        key={deed.id}
                                        onClick={() => setSelectedDeedId(deed.id)}
                                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                                            isSelected
                                                ? 'bg-amber-50/80 border-amber-400 shadow-sm'
                                                : 'bg-white border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                                                    isSelected ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-slate-100 text-slate-600 border border-slate-200'
                                                }`}
                                            >
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{deed.title}</h4>
                                                <p className="text-xs text-slate-600">
                                                    Hero: {deed.user?.name} • {deed.category?.name} • Beneficiaries: {deed.beneficiaries_count}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className="text-xs font-bold text-emerald-700">{deed.impact_points} pts</span>
                                            <span className="text-[10px] text-slate-500 block">AI: {deed.ai_trust_score}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Grant Award Action Card */}
                    <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-2">
                            <Crown className="w-5 h-5 text-amber-500" />
                            <h3 className="text-lg font-extrabold text-slate-900">Bestow Championship Award</h3>
                        </div>

                        <form onSubmit={handleGrantAward} className="space-y-4">
                            {/* Award Level */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Award Level
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['district', 'division', 'national'] as const).map((lvl) => (
                                        <button
                                            key={lvl}
                                            type="button"
                                            onClick={() => setLevel(lvl)}
                                            className={`py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                                                level === lvl
                                                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                                                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                                            }`}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Award Category / Rank Name */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Honor Title / Rank
                                </label>
                                <select
                                    value={rankName}
                                    onChange={(e) => setRankName(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                                >
                                    {level === 'district' && (
                                        <>
                                            <option value="District Champion">District Champion 🥇</option>
                                            <option value="1st Runner-up">1st Runner-up 🥈</option>
                                            <option value="2nd Runner-up">2nd Runner-up 🥉</option>
                                        </>
                                    )}
                                    {level === 'division' && (
                                        <>
                                            <option value="Division Champion">Division Champion 🏆</option>
                                            <option value="Division Youth Hero">Division Youth Hero 🌟</option>
                                        </>
                                    )}
                                    {level === 'national' && (
                                        <>
                                            <option value="National Good Deed Hero">National Good Deed Hero 👑</option>
                                            <option value="National Volunteer of the Month">National Volunteer of the Month</option>
                                            <option value="National Organization Award">National Organization Award</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            {/* Citation */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Official Citation & Jury Commendation
                                </label>
                                <textarea
                                    rows={3}
                                    value={citation}
                                    onChange={(e) => setCitation(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!selectedDeedId}
                                className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                            >
                                <Trophy className="w-4 h-4" />
                                <span>Crown Winner & Issue Award (+250 Pts)</span>
                            </button>
                        </form>

                        {/* Recent Awards History */}
                        <div className="pt-4 border-t border-slate-100 space-y-2">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                                Recent Granted Awards ({existingAwards.length})
                            </span>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {existingAwards.map((a) => (
                                    <div
                                        key={a.id}
                                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                                    >
                                        <div className="flex items-center justify-between font-bold text-amber-800">
                                            <span>{a.rank_name}</span>
                                            <span className="text-[10px] text-slate-500">{a.month} {a.year}</span>
                                        </div>
                                        <p className="text-slate-700 mt-0.5">{a.user?.name} ({a.district || a.division})</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
