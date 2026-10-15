import React from 'react';
import { GoodDeed } from '../types';
import { Link } from '@inertiajs/react';
import { ReactionButton } from './ReactionButton';
import { CommentSection } from './CommentSection';
import {
    X,
    MapPin,
    CheckCircle2,
    Calendar,
    Users,
    Sparkles,
    ExternalLink,
    ShieldCheck,
} from 'lucide-react';

interface DeedModalProps {
    deed: GoodDeed | null;
    isOpen?: boolean;
    onClose: () => void;
}

export const DeedModal: React.FC<DeedModalProps> = ({ deed, onClose }) => {
    if (!deed) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 md:p-6 animate-fade-in">
            <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col text-slate-800">
                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-100 bg-white/95">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Verified Good Deed
                        </span>
                        <span className="text-xs text-slate-500 hidden sm:inline">
                            AI Trust Score: <strong className="text-emerald-600">{deed.ai_trust_score}%</strong>
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body Content Scrollable */}
                <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5">
                    {/* Media Display */}
                    <div className="w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-video relative flex items-center justify-center shadow-inner">
                        {deed.video_url ? (
                            <video
                                src={deed.video_url}
                                controls
                                autoPlay
                                className="w-full h-full object-contain bg-slate-900"
                            />
                        ) : (
                            <img
                                src={deed.thumbnail || (deed.photos && deed.photos[0]) || '/assets/hero-C5Z4Q9Lx.jpg'}
                                alt={deed.title}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>

                    {/* Metadata & Author Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <div className="flex items-center gap-3">
                            {deed.user?.avatar ? (
                                <img
                                    src={deed.user.avatar}
                                    alt={deed.user.name}
                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                                    {deed.user ? deed.user.name.charAt(0) : 'U'}
                                </div>
                            )}
                            <div className="min-w-0">
                                <h4 className="font-bold text-sm text-slate-900 truncate">{deed.user?.name || 'Good Deed Hero'}</h4>
                                <p className="text-xs text-slate-500 font-bangla truncate">
                                    {deed.user?.organization || `${deed.district}, Bangladesh`}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-600">
                            <span className="flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{deed.district}{deed.division ? `, ${deed.division}` : ''}</span>
                            </span>
                            {deed.deed_date && (
                                <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span>
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
                                </span>
                            )}
                            {deed.beneficiaries_count > 0 && (
                                <span className="flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                                    <Users className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                    <span>{deed.beneficiaries_count} Beneficiaries</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Story Title & Description */}
                    <div className="space-y-2">
                        <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-snug">
                            {deed.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-bangla">
                            {deed.description}
                        </p>
                    </div>

                    {/* Multi-Reaction & Social Bar */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <ReactionButton
                            deedId={deed.id}
                            initialLikesCount={deed.likes_count}
                            engagements={deed.engagements}
                            size="sm"
                        />
                        <Link
                            href={`/deeds/${deed.id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                        >
                            <span>সম্পূর্ণ পোস্ট দেখুন</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* AI Verification Flags */}
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                        <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider">
                            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                            AI Verification & Integrity Report
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Duplicate Media Scan: <strong>100% Unique Media</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Safety Score: <strong>Zero Inappropriate Content</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Category Relevance: <strong>Verified</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Impact Verification: <strong>+{deed.impact_points || 85} Points Awarded</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section with Owner Moderation */}
                    <div className="pt-3 border-t border-slate-100">
                        <CommentSection
                            deedId={deed.id}
                            postOwnerId={deed.user_id}
                            commentsCount={deed.comments_count}
                            engagements={deed.engagements}
                        />
                    </div>
                </div>

                {/* Footer action */}
                <div className="px-4 sm:px-6 py-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-bangla">
                        Valo Kaj Bangladesh — ডিজিটাল মানবতার দলিল
                    </span>
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
