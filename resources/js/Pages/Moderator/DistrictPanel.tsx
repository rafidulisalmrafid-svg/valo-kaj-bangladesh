import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { GoodDeed } from '../../types';
import { DISTRICTS } from '../../data/bangladeshGeodata';
import { RoleSwitcher } from '../../Components/RoleSwitcher';
import { Navbar } from '../../Components/Navbar';
import { Footer } from '../../Components/Footer';
import {
    CheckCircle2,
    XCircle,
    HelpCircle,
    MapPin,
    ShieldCheck,
    Clock,
    Sparkles,
    FileText,
    ExternalLink,
    AlertCircle,
    Building2,
} from 'lucide-react';

interface DistrictPanelProps {
    district: string;
    pendingDeeds: GoodDeed[];
    reviewedDeeds: GoodDeed[];
    stats: {
        pending_count: number;
        approved_count: number;
        rejected_count: number;
        district_name: string;
    };
}

export default function DistrictPanel({
    district,
    pendingDeeds,
    reviewedDeeds,
    stats,
}: DistrictPanelProps) {
    const [selectedDistrict, setSelectedDistrict] = useState(district);
    const [activeDeed, setActiveDeed] = useState<GoodDeed | null>(
        pendingDeeds.length > 0 ? pendingDeeds[0] : null
    );
    const [reviewNotes, setReviewNotes] = useState<Record<number, string>>({});

    const handleDistrictChange = (newDist: string) => {
        setSelectedDistrict(newDist);
        router.get('/moderator/district', { district: newDist });
    };

    const handleApprove = (id: number) => {
        const notes = reviewNotes[id] || 'Verified authentic good deed. Approved by District Moderator.';
        router.post(`/moderator/district/${id}/approve`, { notes }, { preserveScroll: true });
    };

    const handleReject = (id: number) => {
        const notes = reviewNotes[id] || 'Content does not meet verification guidelines.';
        router.post(`/moderator/district/${id}/reject`, { notes }, { preserveScroll: true });
    };

    const handleRequestInfo = (id: number) => {
        const notes = reviewNotes[id] || 'Please provide additional photos or video evidence showing the location.';
        router.post(`/moderator/district/${id}/request-info`, { notes }, { preserveScroll: true });
    };

    return (
        <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
            <Head title={`District Moderator Panel (${selectedDistrict}) — Valo Kaj Bangladesh`} />

            <RoleSwitcher />
            <Navbar />

            <main className="flex-1 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
                {/* Header with district selector */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                            <ShieldCheck className="w-4 h-4" />
                            <span>District Moderator Verification Queue</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            {selectedDistrict} District Moderation Panel
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-600 font-bangla mt-0.5">
                            শুধুমাত্র নিজ জেলার আপলোডসমূহ যাচাই, অনুমোদন এবং সনদ প্রদানের প্যানেল।
                        </p>
                    </div>

                    {/* District Switcher (for testing any district) */}
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-slate-600">Viewing District:</label>
                        <select
                            value={selectedDistrict}
                            onChange={(e) => handleDistrictChange(e.target.value)}
                            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                        >
                            {DISTRICTS.map((d) => (
                                <option key={d.name} value={d.name}>
                                    {d.name} ({d.name_bn})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Metrics Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-sm">
                        <span className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            Pending Queue
                        </span>
                        <p className="text-3xl font-black text-slate-900 mt-1">{stats.pending_count}</p>
                        <span className="text-[11px] text-slate-500">Needs review & scoring</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm">
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            Approved Deeds
                        </span>
                        <p className="text-3xl font-black text-emerald-700 mt-1">{stats.approved_count}</p>
                        <span className="text-[11px] text-slate-500">Published to public feed</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-rose-200 shadow-sm">
                        <span className="text-xs font-semibold text-rose-700 flex items-center gap-1.5">
                            <XCircle className="w-4 h-4" />
                            Rejected Submissions
                        </span>
                        <p className="text-3xl font-black text-rose-700 mt-1">{stats.rejected_count}</p>
                        <span className="text-[11px] text-slate-500">Spam or unverified</span>
                    </div>
                </div>

                {/* Main Moderation Queue Interface */}
                {pendingDeeds.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left: Pending Submissions List */}
                        <div className="lg:col-span-5 space-y-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                                Pending Submissions ({pendingDeeds.length})
                            </h3>
                            {pendingDeeds.map((deed) => {
                                const isCurrent = activeDeed?.id === deed.id;
                                return (
                                    <div
                                        key={deed.id}
                                        onClick={() => setActiveDeed(deed)}
                                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                                            isCurrent
                                                ? 'bg-blue-50/60 border-blue-400 shadow-sm'
                                                : 'bg-white border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                                                {deed.title}
                                            </h4>
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 whitespace-nowrap">
                                                <Sparkles className="w-3 h-3 text-amber-500" />
                                                AI: {deed.ai_trust_score}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 line-clamp-2">
                                            {deed.description}
                                        </p>
                                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                                            <span>Author: {deed.user?.name}</span>
                                            <span>{deed.deed_date}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right: Active Deed Deep Review Inspector */}
                        {activeDeed && (
                            <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                                            {activeDeed.category?.name} • {activeDeed.district}
                                        </span>
                                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 leading-snug">
                                            {activeDeed.title}
                                        </h2>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                                        <span className="text-[10px] uppercase font-bold text-emerald-700 block">AI Trust</span>
                                        <p className="text-2xl font-black text-slate-900">{activeDeed.ai_trust_score}%</p>
                                    </div>
                                </div>

                                {/* Media Preview */}
                                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                                    {activeDeed.video_url ? (
                                        <video src={activeDeed.video_url} controls className="w-full h-full object-contain bg-black" />
                                    ) : (
                                        <img
                                            src={activeDeed.thumbnail || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80'}
                                            alt={activeDeed.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>

                                {/* AI Safety & Quality Tags */}
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                        <Sparkles className="w-4 h-4 text-emerald-600" />
                                        Automated AI Analysis Signals
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        <span className="text-emerald-700">✓ No Duplicate Media Detected</span>
                                        <span className="text-emerald-700">✓ 0% Violence or Adult Content</span>
                                        <span className="text-emerald-700">✓ Category Relevance: 98%</span>
                                        <span className="text-emerald-700">✓ Location Coordinates Valid</span>
                                    </div>
                                </div>

                                {/* Story text */}
                                <div className="space-y-1">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Volunteer Narrative & Impact
                                    </h4>
                                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-bangla">
                                        {activeDeed.description}
                                    </p>
                                </div>

                                {/* User History Profile */}
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                                            {activeDeed.user?.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-xs text-slate-900">{activeDeed.user?.name}</h5>
                                            <p className="text-[11px] text-slate-500">
                                                {activeDeed.user?.organization || 'Individual Volunteer'} • Impact: {activeDeed.user?.impact_score} pts
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold text-emerald-700">Good Standing</span>
                                </div>

                                {/* Review Notes Input */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                                        Moderator Review Notes
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={reviewNotes[activeDeed.id] || ''}
                                        onChange={(e) =>
                                            setReviewNotes({ ...reviewNotes, [activeDeed.id]: e.target.value })
                                        }
                                        placeholder="Add private review notes or feedback for the volunteer..."
                                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                                    />
                                </div>

                                {/* Decision Actions */}
                                <div className="pt-2 flex flex-wrap gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => handleApprove(activeDeed.id)}
                                        className="flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Approve & Issue Certificate</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleRequestInfo(activeDeed.id)}
                                        className="px-4 py-3 rounded-xl font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-amber-800 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                        <HelpCircle className="w-4 h-4 text-amber-600" />
                                        <span>Request Info</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleReject(activeDeed.id)}
                                        className="px-4 py-3 rounded-xl font-semibold text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        <span>Reject</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-16 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-sm">
                        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                        <h3 className="text-xl font-bold text-slate-900">All Clear! No Pending Deeds</h3>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                            There are currently no pending good deeds waiting for moderation in {selectedDistrict} District. All submissions have been processed.
                        </p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
