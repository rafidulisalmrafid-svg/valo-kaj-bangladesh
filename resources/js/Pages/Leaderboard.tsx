import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Award as AwardType, User } from '../types';
import { RoleSwitcher } from '../Components/RoleSwitcher';
import { Navbar } from '../Components/Navbar';
import { Footer } from '../Components/Footer';
import {
    Award,
    Trophy,
    Medal,
    Sparkles,
    Building2,
    GraduationCap,
    School,
    Users,
    MapPin,
    ArrowUpRight,
} from 'lucide-react';

interface LeaderboardProps {
    activeTab: string;
    nationalHeroes: User[];
    districtRankings: any[];
    organizations: any[];
    universities: any[];
    schools: any[];
    monthlyAwards: AwardType[];
}

export default function Leaderboard({
    activeTab = 'national',
    nationalHeroes,
    districtRankings,
    organizations,
    universities,
    schools,
    monthlyAwards,
}: LeaderboardProps) {
    const [tab, setTab] = useState<string>(activeTab);

    return (
        <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
            <Head title="Leaderboard & Awards — Valo Kaj Bangladesh" />

            <RoleSwitcher />
            <Navbar />

            <main className="flex-1 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold uppercase tracking-wider">
                        <Trophy className="w-3.5 h-3.5 text-amber-600" />
                        National Impact Honor Roll
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                        Bangladesh Good Deed Leaderboard · সম্মাননা ও র‍্যাঙ্কিং
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 font-bangla max-w-xl mx-auto">
                        ব্যক্তি, জেলা, বিভাগ, শিক্ষা প্রতিষ্ঠান এবং সংগঠন ভিত্তিক সর্বোচ্চ মানবকল্যাণকারী হিরোদের তালিকা।
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-x-auto text-xs font-bold">
                    {[
                        { key: 'national', name: 'National Heroes', icon: Trophy },
                        { key: 'district', name: 'Districts Ranking', icon: MapPin },
                        { key: 'organizations', name: 'Organizations', icon: Building2 },
                        { key: 'universities', name: 'Universities', icon: GraduationCap },
                        { key: 'schools', name: 'Schools', icon: School },
                        { key: 'awards', name: 'Monthly Winners', icon: Award },
                    ].map((item) => {
                        const Icon = item.icon;
                        const isActive = tab === item.key;
                        return (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => setTab(item.key)}
                                className={`px-4 py-2.5 rounded-xl whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                                    isActive
                                        ? 'bg-emerald-600 text-white shadow-sm font-bold'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{item.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* 1. National Heroes Tab */}
                {tab === 'national' && (
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                            <span>Rank & Volunteer</span>
                            <span>Deeds & Impact</span>
                        </div>

                        {nationalHeroes.map((hero, index) => {
                            const rank = index + 1;
                            const isTop3 = rank <= 3;
                            return (
                                <div
                                    key={hero.id}
                                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                                        rank === 1
                                            ? 'bg-amber-50/70 border-amber-200 shadow-sm'
                                            : isTop3
                                            ? 'bg-white border-slate-200 shadow-xs'
                                            : 'bg-slate-50/70 border-slate-200/80'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div
                                            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${
                                                rank === 1
                                                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                                                    : rank === 2
                                                    ? 'bg-slate-200 text-slate-800'
                                                    : rank === 3
                                                    ? 'bg-amber-700 text-white'
                                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                            }`}
                                        >
                                            #{rank}
                                        </div>

                                        {hero.avatar ? (
                                            <img
                                                src={hero.avatar}
                                                alt={hero.name}
                                                className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/20"
                                            />
                                        ) : (
                                            <div className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
                                                {hero.name.charAt(0)}
                                            </div>
                                        )}

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-base text-slate-900">{hero.name}</h3>
                                                {rank === 1 && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                                                        Champion 👑
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5 font-bangla">
                                                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                                {hero.district}, {hero.division}
                                                {hero.organization && ` • ${hero.organization}`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-lg sm:text-xl font-black text-emerald-700">
                                            {hero.impact_score.toLocaleString()} pts
                                        </p>
                                        <span className="text-xs text-slate-500">
                                            {Math.floor(hero.impact_score / 60)} verified deeds
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* 2. District Rankings Tab */}
                {tab === 'district' && (
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {districtRankings.map((d, index) => (
                                <div
                                    key={d.name}
                                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-black text-sm">
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base text-slate-900">{d.name} District</h4>
                                            <span className="text-xs text-slate-600">{d.division} Division • {d.heroes} Volunteers</span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm font-bold text-emerald-700">{d.deeds} deeds</p>
                                        <span className="text-[11px] text-slate-500">{d.impact} impact</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. Organizations Tab */}
                {tab === 'organizations' && (
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                        <div className="space-y-3">
                            {organizations.map((org, index) => (
                                <div
                                    key={org.name}
                                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 border border-teal-200 flex items-center justify-center font-black text-sm">
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base text-slate-900">{org.name}</h4>
                                            <p className="text-xs text-slate-600">
                                                {org.type} • {org.district} • {org.members} Members
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-base font-black text-teal-700">{org.impact} pts</p>
                                        <span className="text-xs text-slate-500">{org.deeds} deeds submitted</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. Universities Tab */}
                {tab === 'universities' && (
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                        <div className="space-y-3">
                            {universities.map((uni, index) => (
                                <div
                                    key={uni.name}
                                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-black text-sm">
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base text-slate-900">{uni.name}</h4>
                                            <p className="text-xs text-slate-600">
                                                Campus Location: {uni.location} • {uni.volunteers} Student Volunteers
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-base font-black text-emerald-700">{uni.impact} pts</p>
                                        <span className="text-xs text-slate-500">{uni.deeds} deeds</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. Schools Tab */}
                {tab === 'schools' && (
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                        <div className="space-y-3">
                            {schools.map((sch, index) => (
                                <div
                                    key={sch.name}
                                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center font-black text-sm">
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base text-slate-900">{sch.name}</h4>
                                            <p className="text-xs text-slate-600">
                                                {sch.district} District • {sch.students} Student Volunteers
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-base font-black text-amber-700">{sch.impact} pts</p>
                                        <span className="text-xs text-slate-500">Active School</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 6. Monthly Awards Tab */}
                {tab === 'awards' && (
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {monthlyAwards.map((award) => (
                                <div
                                    key={award.id}
                                    className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-white border border-amber-200/90 shadow-sm space-y-3 relative overflow-hidden"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                                        <Trophy className="w-5 h-5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                                        {award.level} Level Honor • {award.month} {award.year}
                                    </span>
                                    <h4 className="font-bold text-lg text-slate-900">{award.title}</h4>
                                    <p className="text-xs font-semibold text-emerald-700">
                                        Winner: {award.user?.name} ({award.district || award.division})
                                    </p>
                                    <p className="text-xs text-slate-600 leading-relaxed italic">
                                        "{award.citation}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
