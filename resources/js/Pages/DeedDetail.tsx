import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { GoodDeed } from '../types';
import { RoleSwitcher } from '../Components/RoleSwitcher';
import { Navbar } from '../Components/Navbar';
import { Footer } from '../Components/Footer';
import { DeedCard } from '../Components/DeedCard';
import { ReactionButton } from '../Components/ReactionButton';
import { CommentSection } from '../Components/CommentSection';
import {
    Share2,
    MapPin,
    Calendar,
    Users,
    Sparkles,
    CheckCircle2,
    ArrowLeft,
} from 'lucide-react';

interface DeedDetailProps {
    deed: GoodDeed;
    relatedDeeds: GoodDeed[];
}

export default function DeedDetail({ deed, relatedDeeds }: DeedDetailProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
            <Head title={`${deed.title} — Valo Kaj Bangladesh`} />

            <RoleSwitcher />
            <Navbar />

            <main className="flex-1 py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
                {/* Back button */}
                <div>
                    <Link
                        href="/explore"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Explore Feed</span>
                    </Link>
                </div>

                {/* Main Story Card */}
                <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm p-6 sm:p-10 space-y-8">
                    {/* Header Tags */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <CheckCircle2 className="w-4 h-4" />
                                Verified Good Deed
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                {deed.category?.name}
                            </span>
                        </div>

                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            AI Trust Score: {deed.ai_trust_score}%
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                        {deed.title}
                    </h1>

                    {/* Media Frame */}
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center relative shadow-sm">
                        {deed.video_url ? (
                            <video src={deed.video_url} controls autoPlay className="w-full h-full object-contain bg-black" />
                        ) : (
                            <img
                                src={deed.thumbnail || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80'}
                                alt={deed.title}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>

                    {/* Volunteer & Location Metadata Bar */}
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            {deed.is_anonymous ? (
                                <div className="w-11 h-11 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-base shadow-sm">
                                    <Shield className="w-5 h-5 text-slate-600" />
                                </div>
                            ) : deed.user?.avatar ? (
                                <img
                                    src={deed.user.avatar}
                                    alt={deed.user.name}
                                    className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/30"
                                />
                            ) : (
                                <div className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
                                    {deed.user ? deed.user.name.charAt(0) : (deed.guest_name ? deed.guest_name.charAt(0) : 'U')}
                                </div>
                            )}
                            <div>
                                <h4 className="font-bold text-sm text-slate-900 font-bangla">
                                    {deed.is_anonymous
                                        ? 'নাম প্রকাশে অনিচ্ছুক নাগরিক'
                                        : (deed.user?.name || deed.guest_name || 'শুভাকাঙ্ক্ষী')}
                                </h4>
                                <p className="text-xs text-slate-600 font-bangla">
                                    {deed.is_anonymous
                                        ? 'নীরব মানবসেবী'
                                        : (deed.user?.organization || (deed.guest_name ? 'নাগরিক উদ্যোগ' : `${deed.district}, Bangladesh`))}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-600">
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-emerald-600" />
                                {deed.district}, {deed.division}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                {(() => {
                                    try {
                                        const d = new Date(deed.deed_date);
                                        return !isNaN(d.getTime())
                                            ? d.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
                                            : deed.deed_date.slice(0, 10);
                                    } catch {
                                        return deed.deed_date.slice(0, 10);
                                    }
                                })()}
                            </span>
                            <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                                <Users className="w-4 h-4" />
                                {deed.beneficiaries_count} Beneficiaries
                            </span>
                        </div>
                    </div>

                    {/* Detailed Narrative */}
                    <div className="space-y-3 pt-2">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                            Story & Community Impact
                        </h3>
                        <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line font-bangla">
                            {deed.description}
                        </p>
                    </div>

                    {/* Social Action Bar with Multi-Reactions */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <ReactionButton
                                deedId={deed.id}
                                initialLikesCount={deed.likes_count}
                                engagements={deed.engagements}
                                size="md"
                            />

                            <button
                                type="button"
                                onClick={handleShare}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs transition-colors cursor-pointer"
                            >
                                <Share2 className="w-4 h-4" />
                                <span>{copied ? 'Link Copied!' : 'Share'}</span>
                            </button>
                        </div>

                        <span className="text-xs font-bold text-emerald-700">
                            +{deed.impact_points} Impact Points
                        </span>
                    </div>

                    {/* Comments with Post Owner Moderation */}
                    <div className="pt-6 border-t border-slate-100">
                        <CommentSection
                            deedId={deed.id}
                            postOwnerId={deed.user_id}
                            commentsCount={deed.comments_count}
                            engagements={deed.engagements}
                        />
                    </div>
                </div>

                {/* Related Deeds */}
                {relatedDeeds.length > 0 && (
                    <div className="space-y-4 pt-4">
                        <h3 className="text-xl font-extrabold text-slate-900">Related Good Deeds</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {relatedDeeds.map((rel) => (
                                <DeedCard key={rel.id} deed={rel} />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
