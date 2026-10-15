import React, { useState, useRef, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { PageProps, DeedEngagement } from '../types';
import { Heart, ThumbsUp, Sparkles, Frown, Flame } from 'lucide-react';

export type ReactionType = 'like' | 'love' | 'celebrate' | 'sad' | 'angry';

interface ReactionConfig {
    key: ReactionType;
    label: string;
    labelBn: string;
    emoji: string;
    color: string;
    activeBg: string;
    icon: React.ReactNode;
}

export const REACTION_CONFIGS: Record<ReactionType, ReactionConfig> = {
    like: {
        key: 'like',
        label: 'Like',
        labelBn: 'লাইক',
        emoji: '👍',
        color: 'text-blue-600',
        activeBg: 'bg-blue-50 border-blue-200 text-blue-700',
        icon: <ThumbsUp className="w-4 h-4 fill-blue-500 text-blue-600" />,
    },
    love: {
        key: 'love',
        label: 'Love',
        labelBn: 'ভালোবাসা',
        emoji: '❤️',
        color: 'text-rose-600',
        activeBg: 'bg-rose-50 border-rose-200 text-rose-700',
        icon: <Heart className="w-4 h-4 fill-rose-500 text-rose-600" />,
    },
    celebrate: {
        key: 'celebrate',
        label: 'Celebrate',
        labelBn: 'সাধুবাদ',
        emoji: '👏',
        color: 'text-amber-600',
        activeBg: 'bg-amber-50 border-amber-200 text-amber-800',
        icon: <Sparkles className="w-4 h-4 text-amber-500" />,
    },
    sad: {
        key: 'sad',
        label: 'Care / Sad',
        labelBn: 'সহমর্মিতা',
        emoji: '😢',
        color: 'text-indigo-600',
        activeBg: 'bg-indigo-50 border-indigo-200 text-indigo-700',
        icon: <Frown className="w-4 h-4 text-indigo-600" />,
    },
    angry: {
        key: 'angry',
        label: 'Angry',
        labelBn: 'ক্ষোভ',
        emoji: '😡',
        color: 'text-orange-600',
        activeBg: 'bg-orange-50 border-orange-200 text-orange-700',
        icon: <Flame className="w-4 h-4 text-orange-600" />,
    },
};

interface ReactionButtonProps {
    deedId: number;
    initialLikesCount: number;
    engagements?: DeedEngagement[];
    size?: 'sm' | 'md' | 'lg';
}

export const ReactionButton: React.FC<ReactionButtonProps> = ({
    deedId,
    initialLikesCount,
    engagements = [],
    size = 'md',
}) => {
    const { auth } = usePage<PageProps>().props;
    const currentUser = auth?.user;

    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Identify user's current reaction
    const userEngagement = currentUser
        ? engagements.find(
              (e) =>
                  e.user_id === currentUser.id &&
                  (e.type === 'reaction' || e.type === 'like')
          )
        : null;

    const currentReactionKey: ReactionType | null = userEngagement
        ? (userEngagement.reaction_type as ReactionType) || 'love'
        : null;

    // Aggregate reaction counts from engagements
    const reactionCounts: Record<ReactionType, number> = {
        like: 0,
        love: 0,
        celebrate: 0,
        sad: 0,
        angry: 0,
    };

    engagements.forEach((e) => {
        if (e.type === 'reaction' && e.reaction_type) {
            reactionCounts[e.reaction_type] = (reactionCounts[e.reaction_type] || 0) + 1;
        } else if (e.type === 'like') {
            reactionCounts['love'] = (reactionCounts['love'] || 0) + 1;
        }
    });

    // Top reactions present
    const topReactions = (Object.keys(reactionCounts) as ReactionType[])
        .filter((k) => reactionCounts[k] > 0)
        .slice(0, 3);

    const handleMouseEnter = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setIsOpen(true);
        }, 250);
    };

    const handleMouseLeave = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 300);
    };

    const sendReaction = (type: ReactionType) => {
        setIsOpen(false);
        if (!currentUser) {
            router.visit('/auth');
            return;
        }

        router.post(
            `/deeds/${deedId}/react`,
            { reaction: type },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    const handleMainButtonClick = () => {
        if (!currentUser) {
            router.visit('/auth');
            return;
        }
        // If already reacted, toggle it or default to love
        if (currentReactionKey) {
            sendReaction(currentReactionKey);
        } else {
            sendReaction('love');
        }
    };

    const activeConfig = currentReactionKey ? REACTION_CONFIGS[currentReactionKey] : null;

    return (
        <div
            className="relative inline-flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Floating Multi-Reaction Picker Bar */}
            {isOpen && (
                <div className="absolute bottom-full left-0 mb-2 z-50 flex items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-full shadow-2xl animate-fade-in-up">
                    {(Object.keys(REACTION_CONFIGS) as ReactionType[]).map((type) => {
                        const cfg = REACTION_CONFIGS[type];
                        const isSelected = currentReactionKey === type;
                        return (
                            <button
                                key={type}
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    sendReaction(type);
                                }}
                                className={`group relative p-2 sm:p-2.5 rounded-full hover:scale-130 transition-all duration-200 hover:bg-slate-50 cursor-pointer flex items-center justify-center ${
                                    isSelected ? 'bg-slate-100 ring-2 ring-emerald-500' : ''
                                }`}
                                title={`${cfg.label} (${cfg.labelBn})`}
                            >
                                <span className="text-xl sm:text-2xl transform transition-transform group-hover:-translate-y-1 block">
                                    {cfg.emoji}
                                </span>
                                {/* Tooltip label */}
                                <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {cfg.labelBn}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Main Trigger Button */}
            <button
                type="button"
                onClick={handleMainButtonClick}
                className={`inline-flex items-center gap-2 rounded-xl transition-all duration-200 cursor-pointer font-semibold shadow-xs ${
                    size === 'sm'
                        ? 'px-2.5 py-1 text-xs'
                        : size === 'lg'
                        ? 'px-5 py-2.5 text-base'
                        : 'px-3.5 py-2 text-sm'
                } ${
                    activeConfig
                        ? activeConfig.activeBg
                        : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                }`}
            >
                {activeConfig ? (
                    <span className="flex items-center gap-1.5">
                        <span className="text-base">{activeConfig.emoji}</span>
                        <span>{activeConfig.labelBn}</span>
                    </span>
                ) : (
                    <span className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>রিয়েকশন দিন</span>
                    </span>
                )}

                {/* Counter & Reaction Bubbles */}
                <div className="flex items-center gap-1 pl-1 border-l border-slate-200/80 ml-0.5">
                    {topReactions.length > 0 && (
                        <div className="flex -space-x-1">
                            {topReactions.map((r) => (
                                <span key={r} className="text-xs">
                                    {REACTION_CONFIGS[r].emoji}
                                </span>
                            ))}
                        </div>
                    )}
                    <span className="text-xs font-bold text-slate-800">
                        {Math.max(initialLikesCount, engagements.filter((e) => e.type === 'reaction' || e.type === 'like').length)}
                    </span>
                </div>
            </button>
        </div>
    );
};
