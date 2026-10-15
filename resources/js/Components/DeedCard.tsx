import React, { useState } from 'react';
import { GoodDeed } from '../types';
import { router } from '@inertiajs/react';
import {
    Heart,
    MessageCircle,
    Share2,
    MapPin,
    CheckCircle2,
    Play,
    Sparkles,
    Calendar,
    Film,
    Image as ImageIcon,
    Shield,
} from 'lucide-react';
import { ReactionButton } from './ReactionButton';

interface DeedCardProps {
    deed: GoodDeed;
    onOpenModal?: (deed: GoodDeed) => void;
}

export const DeedCard: React.FC<DeedCardProps> = ({ deed, onOpenModal }) => {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(deed.likes_count || 0);
    const [copied, setCopied] = useState(false);

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLiked(!liked);
        setLikesCount(liked ? likesCount - 1 : likesCount + 1);
        router.post(`/deeds/${deed.id}/like`, {}, { preserveScroll: true });
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(`${window.location.origin}/deeds/${deed.id}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const hasVideo = Boolean(deed.video_url);

    return (
        <div
            onClick={() => onOpenModal && onOpenModal(deed)}
            className="group relative bg-white border border-slate-200/80 hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col h-full"
        >
            {/* Media Thumbnail Container */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img
                    src={deed.thumbnail || (deed.photos && deed.photos[0]) || '/assets/hero-C5Z4Q9Lx.jpg'}
                    alt={deed.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-600 text-white shadow-sm backdrop-blur-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        যাচাইকৃত
                    </span>

                    {deed.category && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/90 text-slate-800 shadow-sm backdrop-blur-sm border border-slate-200">
                            {deed.category.name_bn || deed.category.name}
                        </span>
                    )}
                </div>

                {/* Media Type Icon & Video Indicator */}
                {hasVideo ? (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-11 h-11 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-emerald-500 transition-all">
                            <Play className="w-4 h-4 ml-0.5 fill-current" />
                        </div>
                    </div>
                ) : (
                    <div className="absolute top-2.5 right-2.5 hidden">
                        <span className="p-1 rounded-md bg-black/60 text-white text-[10px]">
                            <ImageIcon className="w-3.5 h-3.5" />
                        </span>
                    </div>
                )}

                {/* AI Trust Score Tag & Media Type Pill */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm font-medium">
                        {hasVideo ? <Film className="w-3 h-3 text-emerald-400" /> : <ImageIcon className="w-3 h-3 text-amber-400" />}
                        <span>{hasVideo ? 'ভিডিও স্টোরি' : 'ফটো ও গল্প'}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold backdrop-blur-sm">
                        <Sparkles className="w-3 h-3" />
                        AI Trust: {deed.ai_trust_score || 95}%
                    </span>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                    {/* Division & District Badge */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            {deed.division} · {deed.district}
                        </span>
                        {deed.deed_date && (
                            <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto">
                                <Calendar className="w-3 h-3" />
                                {deed.deed_date}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                        {deed.title}
                    </h3>

                    {/* Description Excerpt */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-1.5">
                        {deed.description}
                    </p>
                </div>

                {/* Footer: Author & Engagement */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {/* Author info */}
                    <div className="flex items-center gap-2 min-w-0">
                        {deed.is_anonymous ? (
                            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                                <Shield className="w-3.5 h-3.5 text-slate-600" />
                            </div>
                        ) : deed.user?.avatar ? (
                            <img
                                src={deed.user.avatar}
                                alt={deed.user.name}
                                className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/30 shrink-0"
                            />
                        ) : (
                            <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                {deed.user ? deed.user.name.charAt(0) : (deed.guest_name ? deed.guest_name.charAt(0) : 'U')}
                            </div>
                        )}
                        <div className="truncate">
                            <span className="text-xs font-semibold text-slate-800 block truncate font-bangla">
                                {deed.is_anonymous
                                    ? 'নাম গোপন'
                                    : (deed.user ? deed.user.name : (deed.guest_name || deed.author || 'নাগরিক'))}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bangla block truncate">
                                {deed.is_anonymous ? 'নীরব মানবসেবী' : (deed.organization || `${deed.district}, বাংলাদেশ`)}
                            </span>
                        </div>
                    </div>

                    {/* Engagement Counts with Multi-Reaction */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                        <div onClick={(e) => e.stopPropagation()}>
                            <ReactionButton
                                deedId={deed.id}
                                initialLikesCount={likesCount}
                                engagements={deed.engagements}
                                size="sm"
                            />
                        </div>

                        <div className="flex items-center gap-1 px-1.5 py-1 text-slate-400">
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{deed.comments_count || 0}</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleShare}
                            className="p-1 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="লিংক কপি করুন"
                        >
                            <Share2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {copied && (
                <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-lg animate-fade-in z-20">
                    লিংক কপি হয়েছে!
                </div>
            )}
        </div>
    );
};
