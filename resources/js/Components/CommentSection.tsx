import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { PageProps, DeedEngagement } from '../types';
import { MessageCircle, Send, Trash2, Eye, EyeOff, ShieldAlert, Sparkles } from 'lucide-react';

interface CommentSectionProps {
    deedId: number;
    postOwnerId: number;
    commentsCount: number;
    engagements?: DeedEngagement[];
}

export const CommentSection: React.FC<CommentSectionProps> = ({
    deedId,
    postOwnerId,
    commentsCount,
    engagements = [],
}) => {
    const { auth } = usePage<PageProps>().props;
    const currentUser = auth?.user;

    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

    const isPostOwner = Boolean(currentUser && currentUser.id === postOwnerId);
    const isAdmin = Boolean(currentUser && ['super_admin', 'district_moderator'].includes(currentUser.role));

    const comments = engagements.filter((e) => e.type === 'comment');

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || submitting) return;

        if (!currentUser) {
            router.visit('/auth');
            return;
        }

        setSubmitting(true);
        router.post(
            `/deeds/${deedId}/comment`,
            { comment: commentText.trim() },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCommentText('');
                    setSubmitting(false);
                },
                onError: () => setSubmitting(false),
            }
        );
    };

    const handleDelete = (commentId: number) => {
        if (!confirm('আপনি কি নিশ্চিত যে এই কমেন্টটি স্থায়ীভাবে মুছে ফেলতে চান?')) {
            return;
        }

        setActionLoadingId(commentId);
        router.delete(`/comments/${commentId}`, {
            preserveScroll: true,
            onFinish: () => setActionLoadingId(null),
        });
    };

    const handleToggleHide = (commentId: number) => {
        setActionLoadingId(commentId);
        router.post(
            `/comments/${commentId}/toggle-hide`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setActionLoadingId(null),
            }
        );
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>মন্তব্য ও প্রতিক্রিয়া ({comments.length || commentsCount})</span>
                </h3>
                {isPostOwner && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>পোস্ট মালিক মডারেশন সক্রিয়</span>
                    </span>
                )}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={
                        currentUser
                            ? 'উৎসাহমূলক মন্তব্য লিখুন...'
                            : 'মন্তব্য করতে সাইন ইন করুন...'
                    }
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-xs"
                />
                <button
                    type="submit"
                    disabled={submitting || !commentText.trim()}
                    className="px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer shadow-sm shrink-0"
                >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'পোস্ট হচ্ছে...' : 'পাঠান'}</span>
                </button>
            </form>

            {/* Comments List */}
            <div className="space-y-2.5 pt-1">
                {comments.length > 0 ? (
                    comments.map((c) => {
                        const isCommentAuthor = Boolean(currentUser && currentUser.id === c.user_id);
                        const canModerate = isPostOwner || isAdmin;
                        const canDelete = canModerate || isCommentAuthor;
                        const isLoading = actionLoadingId === c.id;

                        return (
                            <div
                                key={c.id}
                                className={`p-3.5 rounded-2xl border transition-all ${
                                    c.is_hidden
                                        ? 'bg-amber-50/60 border-amber-200/80'
                                        : 'bg-white hover:bg-slate-50/70 border-slate-200 shadow-xs'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    {/* Author Info */}
                                    <div className="flex items-center gap-2.5">
                                        {c.user?.avatar ? (
                                            <img
                                                src={c.user.avatar}
                                                alt={c.user.name}
                                                className="w-7 h-7 rounded-full object-cover border border-slate-200"
                                            />
                                        ) : (
                                            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                                                {c.user?.name ? c.user.name.charAt(0) : 'U'}
                                            </div>
                                        )}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-xs text-slate-900">
                                                    {c.user?.name || 'শুভাকাঙ্ক্ষী'}
                                                </span>
                                                {c.user_id === postOwnerId && (
                                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                                                        লেখক
                                                    </span>
                                                )}
                                                {c.is_hidden && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                                        <EyeOff className="w-3 h-3 text-amber-700" />
                                                        <span>লুকানো (পাবলিক থেকে অফ)</span>
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-slate-400">
                                                {new Date(c.created_at).toLocaleString('bn-BD', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Moderation Controls */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        {canModerate && (
                                            <button
                                                type="button"
                                                onClick={() => handleToggleHide(c.id)}
                                                disabled={isLoading}
                                                className={`px-2 py-1 rounded-lg text-[10px] font-semibold border flex items-center gap-1 transition-all cursor-pointer ${
                                                    c.is_hidden
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300'
                                                }`}
                                                title={
                                                    c.is_hidden
                                                        ? 'কমেন্টটি সবার জন্য উন্মুক্ত (Unhide) করুন'
                                                        : 'কমেন্টটি সাধারণ ভিজিটরদের থেকে লুকান (Hide)'
                                                }
                                            >
                                                {c.is_hidden ? (
                                                    <>
                                                        <Eye className="w-3 h-3 text-emerald-600" />
                                                        <span>আনহাইড</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff className="w-3 h-3 text-amber-600" />
                                                        <span>হাইড</span>
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {canDelete && (
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(c.id)}
                                                disabled={isLoading}
                                                className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 flex items-center gap-1 transition-all cursor-pointer"
                                                title="কমেন্টটি মুছে ফেলুন (Delete)"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                <span className="hidden sm:inline">মুছুন</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Comment Content */}
                                <p className="mt-2 text-xs sm:text-sm text-slate-700 font-bangla whitespace-pre-line pl-9">
                                    {c.comment}
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
                        <p className="text-xs text-slate-500 italic">
                            এখনও কোনো মন্তব্য করা হয়নি। এই ভালো কাজের জন্য প্রথম অভিনন্দন বা মন্তব্যটি লিখুন!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
