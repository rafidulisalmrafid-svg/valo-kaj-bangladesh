import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { AuditLog, Category, GoodDeed, User, DeedEngagement, EmailTemplate } from '../../types';
import { RoleSwitcher } from '../../Components/RoleSwitcher';
import { Navbar } from '../../Components/Navbar';
import { Footer } from '../../Components/Footer';
import {
    Settings,
    Users,
    Shield,
    FileCheck,
    CheckCircle2,
    Clock,
    Search,
    Check,
    X,
    Eye,
    AlertTriangle,
    Video,
    Image as ImageIcon,
    MapPin,
    Sparkles,
    Filter,
    Calendar,
    ShieldAlert,
    ExternalLink,
    AlertCircle,
    MessageSquare,
    Trash2,
    Mail,
    Send,
    Save,
    CheckCheck,
    Info,
} from 'lucide-react';

interface AdminDashboardProps {
    stats: {
        total_users: number;
        total_deeds: number;
        approved_deeds: number;
        pending_deeds: number;
        rejected_deeds: number;
        total_comments?: number;
        daily_uploads: number;
        monthly_growth: string;
    };
    deeds: {
        data: GoodDeed[];
        current_page: number;
        last_page: number;
        total: number;
    };
    currentStatus: string;
    users: {
        data: User[];
        current_page: number;
        last_page: number;
    };
    categories: Category[];
    auditLogs: AuditLog[];
    comments?: {
        data: DeedEngagement[];
        current_page: number;
        last_page: number;
        total: number;
    };
    emailTemplates?: EmailTemplate[];
}

export default function AdminDashboard({
    stats,
    deeds,
    currentStatus,
    users,
    categories,
    auditLogs,
    comments,
    emailTemplates = [],
}: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<'moderation' | 'comments' | 'emailTemplates' | 'users' | 'audit'>('moderation');
    const [statusFilter, setStatusFilter] = useState<string>(currentStatus || 'pending');
    const [searchUser, setSearchUser] = useState('');
    const [searchDeed, setSearchDeed] = useState('');
    const [searchComment, setSearchComment] = useState('');
    const [commentActionLoadingId, setCommentActionLoadingId] = useState<number | null>(null);

    // Email Templates Editing State
    const [editingTemplates, setEditingTemplates] = useState<Record<number, { subject: string; body: string; sender_email: string; sender_name: string }>>(() => {
        const map: Record<number, { subject: string; body: string; sender_email: string; sender_name: string }> = {};
        emailTemplates.forEach((t) => {
            map[t.id] = {
                subject: t.subject,
                body: t.body,
                sender_email: t.sender_email || 'rafidul.labar.bd@gmail.com',
                sender_name: t.sender_name || 'ভালো কাজ বাংলাদেশ',
            };
        });
        return map;
    });
    const [templateSavingId, setTemplateSavingId] = useState<number | null>(null);

    const handleSaveTemplate = (id: number) => {
        const tData = editingTemplates[id];
        if (!tData) return;
        setTemplateSavingId(id);
        router.post(`/admin/email-templates/${id}`, tData, {
            preserveScroll: true,
            onFinish: () => setTemplateSavingId(null),
        });
    };

    // Inspection Modal State
    const [inspectingDeed, setInspectingDeed] = useState<GoodDeed | null>(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // Rejection Modal State
    const [rejectingDeed, setRejectingDeed] = useState<GoodDeed | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const handleFilterStatus = (newStatus: string) => {
        setStatusFilter(newStatus);
        router.get('/admin', { status: newStatus }, { preserveState: true, preserveScroll: true });
    };

    const handleApprove = (deedId: number, customNotes?: string) => {
        setActionLoading(true);
        router.post(
            `/admin/deeds/${deedId}/approve`,
            { notes: customNotes || adminNotes || 'অ্যাডমিন কর্তৃক কনটেন্ট ও প্রমাণাদি যাচাইপূর্বক অনুমোদন করা হয়েছে।' },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setActionLoading(false);
                    setInspectingDeed(null);
                    setAdminNotes('');
                },
                onError: () => setActionLoading(false),
            }
        );
    };

    const handleReject = (deedId: number, reason?: string) => {
        setActionLoading(true);
        router.post(
            `/admin/deeds/${deedId}/reject`,
            { notes: reason || rejectReason || 'নীতিমালা অনুযায়ী কনটেন্টটি উপযুক্ত বিবেচিত না হওয়ায় অ্যাডমিন কর্তৃক বাতিল করা হয়েছে।' },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setActionLoading(false);
                    setRejectingDeed(null);
                    setInspectingDeed(null);
                    setRejectReason('');
                },
                onError: () => setActionLoading(false),
            }
        );
    };

    const handleRoleChange = (userId: number, newRole: string) => {
        router.post(`/admin/users/${userId}/role`, { role: newRole }, { preserveScroll: true });
    };

    const handleDeleteCommentByAdmin = (commentId: number) => {
        if (!confirm('আপনি কি নিশ্চিত যে এই কমেন্টটি অ্যাডমিন হিসেবে প্ল্যাটফর্ম থেকে স্থায়ীভাবে মুছে ফেলতে চান?')) {
            return;
        }
        setCommentActionLoadingId(commentId);
        router.delete(`/admin/comments/${commentId}`, {
            preserveScroll: true,
            onFinish: () => setCommentActionLoadingId(null),
        });
    };

    const filteredUsers = users.data.filter(
        (u) =>
            u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
            u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
            u.role.toLowerCase().includes(searchUser.toLowerCase())
    );

    const filteredDeeds = deeds.data.filter(
        (d) =>
            d.title.toLowerCase().includes(searchDeed.toLowerCase()) ||
            d.description.toLowerCase().includes(searchDeed.toLowerCase()) ||
            d.district.toLowerCase().includes(searchDeed.toLowerCase()) ||
            (d.user && d.user.name.toLowerCase().includes(searchDeed.toLowerCase()))
    );

    const formatDeedDate = (dateStr?: string) => {
        if (!dateStr) return '';
        try {
            const d = new Date(dateStr);
            return !isNaN(d.getTime())
                ? d.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
                : dateStr.slice(0, 10);
        } catch {
            return dateStr.slice(0, 10);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
            <Head title="Super Admin Center — পোস্ট অনুমোদন ও ব্যবস্থাপনা — Valo Kaj Bangladesh" />

            <RoleSwitcher />
            <Navbar />

            <main className="flex-1 py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6 sm:space-y-8">
                {/* 1. Header Banner */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1.5">
                            <Settings className="w-4 h-4" />
                            <span>System Administration & Content Gatekeeper</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Super Admin Central Command
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-600 font-bangla mt-1 max-w-2xl leading-relaxed">
                            নাগরিকদের আপলোডকৃত ভালো কাজের গল্প, ছবি ও ভিডিও যাচাই, অনুমোদন ও প্রকাশনা নিয়ন্ত্রণ কেন্দ্র। অ্যাডমিনের অনুমোদন ছাড়া কোনো পোস্ট ওয়েবসাইটে লাইভ হয় না।
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5" />
                            Full Access Privileges
                        </span>
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Auto-Publish Guard Active
                        </span>
                    </div>
                </div>

                {/* 2. Critical Publishing Policy Notice */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3.5 shadow-sm">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <h4 className="font-bold text-amber-950 font-bangla">
                            🛡️ কনটেন্ট প্রকাশনা ও স্বীকৃতি নীতিমালা:
                        </h4>
                        <p className="text-amber-800 font-bangla leading-relaxed text-xs sm:text-[13px]">
                            কোনো নাগরিক বা ভলান্টিয়ার যখন নতুন কোনো ভালো কাজের গল্প, ভিডিও বা ছবি আপলোড করেন, তখন তা সরাসরি মূল ওয়েবসাইটে প্রকাশিত হয় না এবং সাথে সাথে কোনো সার্টিফিকেট পায় না। আপলোডের সময় ব্যবহারকারীর ইমেইলে স্বয়ংক্রিয়ভাবে একটি ধন্যবাদ বার্তা পাঠানো হয়। পোস্টটি <strong className="text-amber-950 underline">অপেক্ষমাণ (Pending)</strong> তালিকায় জমা থাকে। অ্যাডমিন তথ্য ও প্রমাণাদি যাচাই করে <strong className="text-emerald-700">"অনুমোদন (Approve)"</strong> ক্লিক করলে পোস্টটি ওয়েবসাইটে লাইভ হবে এবং পয়েন্ট যুক্ত হবে।
                        </p>
                    </div>
                </div>

                {/* 3. System Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-amber-500" />
                            Pending Review
                        </span>
                        <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
                            {stats.pending_deeds.toLocaleString()}
                        </p>
                        <span className="text-[11px] text-amber-700 font-bangla">অপেক্ষমাণ কনটেন্ট</span>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Approved & Live
                        </span>
                        <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
                            {stats.approved_deeds.toLocaleString()}
                        </p>
                        <span className="text-[11px] text-emerald-700 font-bangla">ওয়েবসাইটে প্রকাশিত</span>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 text-rose-500" />
                            Rejected Posts
                        </span>
                        <p className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">
                            {stats.rejected_deeds.toLocaleString()}
                        </p>
                        <span className="text-[11px] text-rose-700 font-bangla">বাতিলকৃত পোস্ট</span>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                            <FileCheck className="w-4 h-4 text-teal-600" />
                            Total Deeds
                        </span>
                        <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                            {stats.total_deeds.toLocaleString()}
                        </p>
                        <span className="text-[11px] text-teal-600">All 64 districts</span>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm col-span-2 lg:col-span-1">
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-indigo-600" />
                            Total Users
                        </span>
                        <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                            {stats.total_users.toLocaleString()}
                        </p>
                        <span className="text-[11px] text-indigo-600">{stats.monthly_growth} growth</span>
                    </div>
                </div>

                {/* 4. Top Navigation Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
                    <button
                        onClick={() => setActiveTab('moderation')}
                        className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                            activeTab === 'moderation'
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm'
                        }`}
                    >
                        <Shield className="w-4 h-4" />
                        <span>কনটেন্ট যাচাই ও অনুমোদন (Content Moderation)</span>
                        <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-black/10 font-mono">
                            {stats.pending_deeds}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('comments')}
                        className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                            activeTab === 'comments'
                                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm'
                        }`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span>কমেন্ট মডারেশন (Comments Control)</span>
                        <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-black/10 font-mono">
                            {comments?.total || stats.total_comments || 0}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('emailTemplates')}
                        className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                            activeTab === 'emailTemplates'
                                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm'
                        }`}
                    >
                        <Mail className="w-4 h-4" />
                        <span>ইমেইল বার্তা সাজান (Email Templates)</span>
                        <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-sky-100 text-sky-800 font-mono font-bold">
                            {emailTemplates?.length || 2}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                            activeTab === 'users'
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm'
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        <span>ইউজার ও রোল ব্যবস্থাপনা (Users RBAC)</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('audit')}
                        className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                            activeTab === 'audit'
                                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm'
                        }`}
                    >
                        <Clock className="w-4 h-4" />
                        <span>অডিট ট্রেইল ও নিরাপত্তা লগ (Audit Logs)</span>
                    </button>
                </div>

                {/* TAB 1: CONTENT MODERATION & APPROVAL PIPELINE */}
                {activeTab === 'moderation' && (
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
                        {/* Sub-filters & Search Bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Status Filter Pills */}
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => handleFilterStatus('pending')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                        statusFilter === 'pending'
                                            ? 'bg-amber-500 text-white shadow-sm font-extrabold'
                                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                                    }`}
                                >
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>অপেক্ষমাণ (Pending)</span>
                                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 font-mono">
                                        {stats.pending_deeds}
                                    </span>
                                </button>

                                <button
                                    onClick={() => handleFilterStatus('approved')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                        statusFilter === 'approved'
                                            ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                                    }`}
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>অনুমোদিত / লাইভ (Approved)</span>
                                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 font-mono">
                                        {stats.approved_deeds}
                                    </span>
                                </button>

                                <button
                                    onClick={() => handleFilterStatus('rejected')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                        statusFilter === 'rejected'
                                            ? 'bg-rose-600 text-white shadow-sm font-extrabold'
                                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                                    }`}
                                >
                                    <X className="w-3.5 h-3.5" />
                                    <span>বাতিলকৃত (Rejected)</span>
                                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 font-mono">
                                        {stats.rejected_deeds}
                                    </span>
                                </button>

                                <button
                                    onClick={() => handleFilterStatus('all')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                        statusFilter === 'all'
                                            ? 'bg-slate-800 text-white shadow-sm font-extrabold'
                                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                                    }`}
                                >
                                    <Filter className="w-3.5 h-3.5" />
                                    <span>সকল পোস্ট (All)</span>
                                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 font-mono">
                                        {stats.total_deeds}
                                    </span>
                                </button>
                            </div>

                            {/* Search Deeds */}
                            <div className="relative w-full md:w-72">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchDeed}
                                    onChange={(e) => setSearchDeed(e.target.value)}
                                    placeholder="পোস্টের শিরোনাম, জেলা বা লেখক..."
                                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                                />
                            </div>
                        </div>

                        {/* Deeds Table / Cards */}
                        {filteredDeeds.length === 0 ? (
                            <div className="text-center py-16 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                <CheckCircle2 className="w-12 h-12 text-emerald-500/50 mx-auto mb-3" />
                                <h3 className="text-base font-bold text-slate-800">
                                    কোনো পোস্ট পাওয়া যায়নি
                                </h3>
                                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                                    {statusFilter === 'pending'
                                        ? 'বর্তমানে পর্যালোচনার জন্য কোনো অপেক্ষমাণ পোস্ট নেই। নতুন পোস্ট জমা হলে এখানে দৃশ্যমান হবে।'
                                        : 'এই ফিল্টারে বর্তমানে কোনো কনটেন্ট নেই।'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredDeeds.map((deed) => (
                                    <div
                                        key={deed.id}
                                        className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 group"
                                    >
                                        {/* Left Side: Thumbnail & Content Info */}
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            {/* Media Thumbnail */}
                                            <div
                                                onClick={() => setInspectingDeed(deed)}
                                                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 cursor-pointer group-hover:ring-2 group-hover:ring-emerald-500/40 transition-all"
                                            >
                                                {deed.thumbnail || (deed.photos && deed.photos[0]) ? (
                                                    <img
                                                        src={deed.thumbnail || (deed.photos && deed.photos[0])}
                                                        alt={deed.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                                        <ImageIcon className="w-6 h-6 mb-1" />
                                                        <span className="text-[10px]">No Photo</span>
                                                    </div>
                                                )}

                                                {/* Video Indicator Badge */}
                                                {deed.video_url && (
                                                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                                                        <Video className="w-3 h-3" />
                                                        <span>Video</span>
                                                    </span>
                                                )}
                                            </div>

                                            {/* Story & Meta */}
                                            <div className="space-y-1.5 flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {/* Status Badge */}
                                                    <span
                                                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                                            deed.status === 'approved'
                                                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                                : deed.status === 'pending'
                                                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                                                        }`}
                                                    >
                                                        {deed.status === 'pending'
                                                            ? 'অপেক্ষমাণ (Pending)'
                                                            : deed.status === 'approved'
                                                            ? 'অনুমোদিত / লাইভ (Live)'
                                                            : 'বাতিলকৃত (Rejected)'}
                                                    </span>

                                                    {/* Category */}
                                                    {deed.category && (
                                                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                                                            {deed.category.name_bn || deed.category.name}
                                                        </span>
                                                    )}

                                                    {/* Location */}
                                                    <span className="text-xs text-slate-600 flex items-center gap-1">
                                                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                                        <span>
                                                            {deed.district}, {deed.division}
                                                            {deed.upazila ? ` (${deed.upazila})` : ''}
                                                        </span>
                                                    </span>

                                                    {/* Date */}
                                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{formatDeedDate(deed.deed_date)}</span>
                                                    </span>
                                                </div>

                                                <h4
                                                    onClick={() => setInspectingDeed(deed)}
                                                    className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1"
                                                >
                                                    {deed.title}
                                                </h4>

                                                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-bangla">
                                                    {deed.description}
                                                </p>

                                                {/* Author and AI Trust Score */}
                                                <div className="pt-1 flex flex-wrap items-center gap-3 text-xs">
                                                    <div className="flex items-center gap-1.5 text-slate-600">
                                                        <span className="text-slate-400">আপলোডকারী:</span>
                                                        <span className="font-semibold text-slate-800">
                                                            {deed.user ? deed.user.name : (deed.guest_name ? `${deed.guest_name} (গেস্ট)` : 'গেস্ট')}
                                                        </span>
                                                        {deed.is_anonymous ? (
                                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                                                নাম গোপন
                                                            </span>
                                                        ) : null}
                                                        {deed.user?.email && (
                                                            <span className="text-[10px] text-slate-400">
                                                                ({deed.user.email})
                                                            </span>
                                                        )}
                                                        {!deed.user && deed.guest_email && (
                                                            <span className="text-[10px] text-slate-400">
                                                                ({deed.guest_email})
                                                            </span>
                                                        )}
                                                    </div>

                                                    <span className="text-slate-300">·</span>

                                                    <div className="flex items-center gap-1 text-emerald-700 font-bold">
                                                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                                        <span>AI ট্রাস্ট স্কোর: {deed.ai_trust_score}%</span>
                                                    </div>

                                                    {deed.beneficiaries_count > 1 && (
                                                        <>
                                                            <span className="text-slate-300">·</span>
                                                            <span className="text-slate-600">
                                                                উপকৃত: ~{deed.beneficiaries_count} জন
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Action Buttons */}
                                        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                                            {/* Preview / Inspect Button */}
                                            <button
                                                type="button"
                                                onClick={() => setInspectingDeed(deed)}
                                                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
                                                title="সম্পূর্ণ গল্প, ছবি ও ভিডিও যাচাই করুন"
                                            >
                                                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                                <span>যাচাই ও বিস্তারিত</span>
                                            </button>

                                            {/* Direct Live Link if Approved */}
                                            {deed.status === 'approved' && (
                                                <Link
                                                    href={`/deeds/${deed.id}`}
                                                    target="_blank"
                                                    className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 transition-all"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    <span>লাইভ পোস্ট দেখুন</span>
                                                </Link>
                                            )}

                                            {/* Approve Button */}
                                            {deed.status !== 'approved' && (
                                                <button
                                                    type="button"
                                                    disabled={actionLoading}
                                                    onClick={() => handleApprove(deed.id)}
                                                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                                                    title="অনুমোদন করলে পোস্টটি তৎক্ষণাৎ ওয়েবসাইটে লাইভ হবে"
                                                >
                                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                    <span>অনুমোদন ও লাইভ করুন</span>
                                                </button>
                                            )}

                                            {/* Reject Button */}
                                            {deed.status !== 'rejected' && (
                                                <button
                                                    type="button"
                                                    disabled={actionLoading}
                                                    onClick={() => setRejectingDeed(deed)}
                                                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                                                >
                                                    <X className="w-3.5 h-3.5 stroke-[3]" />
                                                    <span>বাতিল করুন</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB: COMMENTS MODERATION PANEL */}
                {activeTab === 'comments' && (
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-amber-600" />
                                    <span>প্ল্যাটফর্মের সর্বজনীন কমেন্ট নিয়ন্ত্রণ (Comments Moderation)</span>
                                </h3>
                                <p className="text-xs text-slate-500 font-bangla mt-0.5">
                                    ওয়েবসাইটের সকল ভালো কাজের নিচে করা মন্তব্য পর্যবেক্ষণ করুন। কোনো অশালীন বা আপত্তিকর মন্তব্য থাকলে অবিলম্বে মুছে দিন।
                                </p>
                            </div>

                            {/* Comment Search */}
                            <div className="relative w-full sm:w-72">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchComment}
                                    onChange={(e) => setSearchComment(e.target.value)}
                                    placeholder="কমেন্ট, ইউজার বা পোস্ট খুঁজুন..."
                                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-xs"
                                />
                            </div>
                        </div>

                        {/* Comments Table */}
                        <div className="overflow-x-auto rounded-2xl border border-slate-200">
                            <table className="w-full text-left text-xs text-slate-700">
                                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                    <tr>
                                        <th className="p-3.5">মন্তব্যকারী (User)</th>
                                        <th className="p-3.5">ভালো কাজের পোস্ট (Post)</th>
                                        <th className="p-3.5">মন্তব্যের বিবরণ (Comment)</th>
                                        <th className="p-3.5">অবস্থা (Status)</th>
                                        <th className="p-3.5">তারিখ ও সময়</th>
                                        <th className="p-3.5 text-right">মডারেশন অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {comments && comments.data && comments.data.length > 0 ? (
                                        comments.data
                                            .filter((c) => {
                                                if (!searchComment.trim()) return true;
                                                const q = searchComment.toLowerCase();
                                                const commentMatch = c.comment?.toLowerCase().includes(q);
                                                const userMatch = c.user?.name.toLowerCase().includes(q) || c.user?.email.toLowerCase().includes(q);
                                                const postMatch = c.good_deed?.title.toLowerCase().includes(q);
                                                return commentMatch || userMatch || postMatch;
                                            })
                                            .map((c) => {
                                                const isLoading = commentActionLoadingId === c.id;
                                                return (
                                                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                                                        {/* User */}
                                                        <td className="p-3.5 whitespace-nowrap">
                                                            <div className="flex items-center gap-2.5">
                                                                {c.user?.avatar ? (
                                                                    <img
                                                                        src={c.user.avatar}
                                                                        alt={c.user.name}
                                                                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                                                    />
                                                                ) : (
                                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                                                                        {c.user?.name ? c.user.name.charAt(0) : 'U'}
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <span className="font-bold text-slate-900 block">
                                                                        {c.user?.name || 'Anonymous User'}
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-400">
                                                                        {c.user?.email || 'N/A'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Post */}
                                                        <td className="p-3.5 max-w-[200px]">
                                                            {c.good_deed ? (
                                                                <Link
                                                                    href={`/deeds/${c.good_deed.id}`}
                                                                    className="font-semibold text-emerald-700 hover:text-emerald-800 line-clamp-2 hover:underline"
                                                                >
                                                                    {c.good_deed.title}
                                                                </Link>
                                                            ) : (
                                                                <span className="text-slate-400 italic">
                                                                    Post #{c.good_deed_id}
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* Comment Content */}
                                                        <td className="p-3.5 max-w-sm">
                                                            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-bangla text-slate-800 whitespace-pre-line text-xs">
                                                                "{c.comment}"
                                                            </div>
                                                        </td>

                                                        {/* Status */}
                                                        <td className="p-3.5 whitespace-nowrap">
                                                            {c.is_hidden ? (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                                                    লুকানো (Hidden by Author)
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                    দৃশ্যমান (Public)
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* Date */}
                                                        <td className="p-3.5 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                                                            {new Date(c.created_at).toLocaleString('bn-BD', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </td>

                                                        {/* Actions */}
                                                        <td className="p-3.5 text-right whitespace-nowrap">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteCommentByAdmin(c.id)}
                                                                disabled={isLoading}
                                                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 hover:border-rose-300 inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                                                                title="অ্যাডমিন হিসেবে কমেন্টটি স্থায়ীভাবে মুছে ফেলুন"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                <span>মুছে ফেলুন</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-slate-400">
                                                প্ল্যাটফর্মে এখনও কোনো কমেন্ট পাওয়া যায়নি।
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB: EMAIL TEMPLATES MANAGEMENT */}
                {activeTab === 'emailTemplates' && (
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                        {/* Header Banner */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-bangla">
                                            স্বয়ংক্রিয় ধন্যবাদ বার্তা কনফিগারেশন (Email Messaging System)
                                        </h3>
                                        <p className="text-xs text-slate-500 font-bangla mt-0.5">
                                            ইউজার রেজিস্ট্রেশন এবং ভালো কাজের হিস্টোরি সাবমিটের পর স্বয়ংক্রিয়ভাবে প্রেরিত ইমেইল বার্তাগুলো এখান থেকে সাজিয়ে নিন।
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                <span className="text-slate-500 font-bangla">নির্ধারিত প্রেরক:</span>
                                <span className="font-mono font-bold text-sky-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                                    rafidul.labar.bd@gmail.com
                                </span>
                            </div>
                        </div>

                        {/* Info Callout */}
                        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 text-sky-950 text-xs sm:text-sm flex items-start gap-3">
                            <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="font-bangla leading-relaxed">
                                    <strong>নীতিমালা দ্রষ্টব্য:</strong> ভালো কাজের হিস্টোরি আপলোড করলেই কেউ সরাসরি সার্টিফিকেট পাবে না। সাবমিট করলে ইউজারের মেইলে কেবল এই 'থ্যাঙ্ক ইউ' বার্তা যাবে। গেস্ট ইউজার যদি ইমেইল প্রদান করেন তবে তিনিও এই বার্তা পাবেন।
                                </p>
                                <p className="text-xs text-sky-800 font-bangla">
                                    বার্তার ভেতরে ডাইনামিক ফিল্ড যেমন: <code className="bg-white/80 px-1.5 py-0.5 rounded font-mono font-bold">{'{name}'}</code>, <code className="bg-white/80 px-1.5 py-0.5 rounded font-mono font-bold">{'{title}'}</code>, <code className="bg-white/80 px-1.5 py-0.5 rounded font-mono font-bold">{'{district}'}</code>, <code className="bg-white/80 px-1.5 py-0.5 rounded font-mono font-bold">{'{division}'}</code> ব্যবহার করলে ইমেইল পাঠানোর সময় তা স্বয়ংক্রিয়ভাবে সংশ্লিষ্ট তথ্যে প্রতিস্থাপিত হবে।
                                </p>
                            </div>
                        </div>

                        {/* Templates List */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {(emailTemplates && emailTemplates.length > 0 ? emailTemplates : [
                                {
                                    id: 1,
                                    key: 'registration_welcome',
                                    title: 'ধাপ ১: নতুন ইউজার রেজিস্ট্রেশন স্বাগতম ও ধন্যবাদ বার্তা',
                                    description: 'নতুন কোনো ইউজার প্ল্যাটফর্মে সফলভাবে রেজিস্টার করার সাথে সাথে এই বার্তা পাঠানো হয়।',
                                    sender_email: 'rafidul.labar.bd@gmail.com',
                                    sender_name: 'ভালো কাজ বাংলাদেশ',
                                    subject: 'স্বাগতম ও ধন্যবাদ! ভালো কাজ বাংলাদেশে যুক্ত হওয়ার জন্য',
                                    body: "প্রিয় {name},\n\nভালো কাজ বাংলাদেশে আপনাকে আন্তরিক স্বাগতম ও ধন্যবাদ! আপনার এই ছোট্ট উদ্যোগটি আমাদের পুরো সমাজ ও দেশকে ইতিবাচক পরিবর্তনের পথে এক ধাপ এগিয়ে নিতে সাহায্য করবে।\n\nআপনি এখন থেকে দেশের যেকোনো প্রান্তের ভালো কাজের গল্প, ছবি বা ভিডিও শেয়ার করতে পারেন।\n\nধন্যবাদান্তে,\nভালো কাজ বাংলাদেশ টিম\nইমেইল: rafidul.labar.bd@gmail.com",
                                    placeholders: ['{name}', '{email}'],
                                    is_active: true,
                                    created_at: new Date().toISOString(),
                                    updated_at: new Date().toISOString(),
                                },
                                {
                                    id: 2,
                                    key: 'deed_submission_thank_you',
                                    title: 'ধাপ ২: ভালো কাজ আপলোড পরবর্তী ধন্যবাদ বার্তা',
                                    description: 'লগইন করা ইউজার কিংবা গেস্ট ভিজিটর কাজ আপলোড করার পর এই বার্তাটি মেইলে পৌঁছায়।',
                                    sender_email: 'rafidul.labar.bd@gmail.com',
                                    sender_name: 'ভালো কাজ বাংলাদেশ',
                                    subject: 'আপনার ভালো কাজের গল্পটি সফলভাবে জমা হয়েছে — আন্তরিক ধন্যবাদ!',
                                    body: "প্রিয় {name},\n\nআপনার প্রেরিত ভালো কাজের গল্প \"{title}\" ({district}, {division}) সফলভাবে জমা হয়েছে। নিঃস্বার্থ এই সমাজসেবামূলক কাজের জন্য আপনাকে জানাই অন্তরের অন্তস্তল থেকে উষ্ণ ধন্যবাদ!\n\nআমাদের অ্যাডমিন টিম আপনার পোস্ট ও প্রমাণাদি যাচাই করছেন। অনুমোদন সম্পন্ন হলে তা ওয়েবসাইটে প্রকাশিত হবে।\n\nসুন্দর ও মানবিক বাংলাদেশ গড়ায় আপনার এই অবদান চিরস্মরণীয় হয়ে থাকুক।\n\nশুভকামনায়,\nভালো কাজ বাংলাদেশ টিম\nইমেইল: rafidul.labar.bd@gmail.com",
                                    placeholders: ['{name}', '{title}', '{district}', '{division}', '{email}'],
                                    is_active: true,
                                    created_at: new Date().toISOString(),
                                    updated_at: new Date().toISOString(),
                                }
                            ]).map((tpl) => {
                                const state = editingTemplates[tpl.id] || {
                                    subject: tpl.subject,
                                    body: tpl.body,
                                    sender_email: tpl.sender_email || 'rafidul.labar.bd@gmail.com',
                                    sender_name: tpl.sender_name || 'ভালো কাজ বাংলাদেশ',
                                };
                                const isSaving = templateSavingId === tpl.id;

                                return (
                                    <div
                                        key={tpl.id}
                                        className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
                                    >
                                        <div className="space-y-4">
                                            {/* Card Top Title & Badge */}
                                            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                                                <div>
                                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 uppercase font-mono">
                                                        {tpl.key}
                                                    </span>
                                                    <h4 className="text-sm sm:text-base font-bold text-slate-900 font-bangla mt-1">
                                                        {tpl.title}
                                                    </h4>
                                                    {tpl.description && (
                                                        <p className="text-xs text-slate-500 font-bangla mt-0.5">
                                                            {tpl.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Sender Settings Row */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-slate-700 font-bangla block">
                                                        প্রেরকের নাম (Sender Name):
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={state.sender_name}
                                                        onChange={(e) =>
                                                            setEditingTemplates((prev) => ({
                                                                ...prev,
                                                                [tpl.id]: {
                                                                    ...state,
                                                                    sender_name: e.target.value,
                                                                },
                                                            }))
                                                        }
                                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
                                                        placeholder="ভালো কাজ বাংলাদেশ"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-slate-700 font-bangla block">
                                                        প্রেরক ইমেইল (From Email):
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={state.sender_email}
                                                        onChange={(e) =>
                                                            setEditingTemplates((prev) => ({
                                                                ...prev,
                                                                [tpl.id]: {
                                                                    ...state,
                                                                    sender_email: e.target.value,
                                                                },
                                                            }))
                                                        }
                                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
                                                        placeholder="rafidul.labar.bd@gmail.com"
                                                    />
                                                </div>
                                            </div>

                                            {/* Subject Field */}
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-700 font-bangla block">
                                                    ইমেইল বিষয় (Email Subject):
                                                </label>
                                                <input
                                                    type="text"
                                                    value={state.subject}
                                                    onChange={(e) =>
                                                        setEditingTemplates((prev) => ({
                                                            ...prev,
                                                            [tpl.id]: {
                                                                ...state,
                                                                subject: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
                                                    placeholder="ইমেইলের সাবজেক্ট লিখুন..."
                                                />
                                            </div>

                                            {/* Message Body Field */}
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-bold text-slate-700 font-bangla">
                                                        ইমেইল বার্তা / মেসেজ কনটেন্ট (Message Body):
                                                    </label>
                                                    <span className="text-[11px] text-slate-400 font-mono">
                                                        {state.body.length} chars
                                                    </span>
                                                </div>
                                                <textarea
                                                    rows={7}
                                                    value={state.body}
                                                    onChange={(e) =>
                                                        setEditingTemplates((prev) => ({
                                                            ...prev,
                                                            [tpl.id]: {
                                                                ...state,
                                                                body: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                    className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bangla text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors leading-relaxed resize-y font-normal"
                                                    placeholder="ব্যবহারকারীর জন্য ধন্যবাদ বার্তাটি লিখুন..."
                                                />
                                            </div>

                                            {/* Dynamic Placeholders Helper */}
                                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                                                <span className="text-[11px] font-bold text-slate-600 font-bangla block">
                                                    ব্যবহারযোগ্য ডাইনামিক ভেরিয়েবলসমূহ:
                                                </span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {(tpl.placeholders && tpl.placeholders.length > 0
                                                        ? tpl.placeholders
                                                        : ['{name}', '{title}', '{district}', '{division}', '{email}']
                                                    ).map((ph, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-mono font-bold text-sky-700 shadow-2xs"
                                                            title="ক্লিক করে মেসেজে যোগ করতে পারেন"
                                                        >
                                                            {ph}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Action Footer */}
                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <span className="text-[11px] text-slate-400 font-bangla">
                                                সর্বশেষ হালনাগাদ: {tpl.updated_at ? new Date(tpl.updated_at).toLocaleDateString('bn-BD') : 'আজ'}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => handleSaveTemplate(tpl.id)}
                                                disabled={isSaving}
                                                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <Clock className="w-4 h-4 animate-spin" />
                                                        <span>সংরক্ষণ হচ্ছে...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4" />
                                                        <span>বার্তা সংরক্ষণ করুন</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* TAB 2: USER & RBAC MANAGEMENT TABLE */}
                {activeTab === 'users' && (
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-indigo-600" />
                                    Role-Based Access Control (RBAC) & Users
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Assign roles: Visitor, User, District Moderator, Division Moderator, Award Committee, Super Admin
                                </p>
                            </div>

                            <div className="relative w-full sm:w-64">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchUser}
                                    onChange={(e) => setSearchUser(e.target.value)}
                                    placeholder="Search user or email..."
                                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200">
                                    <tr>
                                        <th className="py-3 px-4">User</th>
                                        <th className="py-3 px-4">Location</th>
                                        <th className="py-3 px-4">Impact Score</th>
                                        <th className="py-3 px-4">Current Role</th>
                                        <th className="py-3 px-4 text-right">Change Role</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-2.5">
                                                    {u.avatar ? (
                                                        <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                                                            {u.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="font-bold text-slate-900 block">{u.name}</span>
                                                        <span className="text-[10px] text-slate-500">{u.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600">
                                                {u.district || 'National'}{u.division ? `, ${u.division}` : ''}
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-emerald-700">
                                                {u.impact_score} pts
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                                                    u.role === 'super_admin' ? 'bg-rose-100 text-rose-800' :
                                                    u.role === 'award_committee' ? 'bg-amber-100 text-amber-800' :
                                                    u.role === 'division_moderator' ? 'bg-indigo-100 text-indigo-800' :
                                                    u.role === 'district_moderator' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {u.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                    className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white"
                                                >
                                                    <option value="user">User</option>
                                                    <option value="district_moderator">District Moderator</option>
                                                    <option value="division_moderator">Division Moderator</option>
                                                    <option value="award_committee">Award Committee</option>
                                                    <option value="super_admin">Super Admin</option>
                                                    <option value="visitor">Visitor</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: AUDIT TRAIL TABLE */}
                {activeTab === 'audit' && (
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-rose-600" />
                            Platform Security & Moderation Audit Trail
                        </h3>

                        <div className="space-y-2">
                            {auditLogs.map((log) => (
                                <div
                                    key={log.id}
                                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="font-bold text-slate-800">{log.action}</span>
                                        <span className="text-slate-500">
                                            Target: {log.target_type} #{log.target_id || ''}
                                        </span>
                                    </div>
                                    <span className="text-slate-400 font-mono text-[11px]">
                                        {new Date(log.created_at).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* DETAIL & INSPECTION MODAL */}
            {inspectingDeed && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
                    <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col my-8 text-slate-800">
                        {/* Modal Header */}
                        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
                            <div className="space-y-1">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                                    inspectingDeed.status === 'approved'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : inspectingDeed.status === 'pending'
                                        ? 'bg-amber-100 text-amber-900'
                                        : 'bg-rose-100 text-rose-800'
                                }`}>
                                    Status: {inspectingDeed.status.toUpperCase()}
                                </span>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 line-clamp-1">
                                    {inspectingDeed.title}
                                </h3>
                            </div>

                            <button
                                onClick={() => setInspectingDeed(null)}
                                className="p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 sm:p-6 space-y-6 flex-1">
                            {/* Video Player or High-Res Photo Gallery */}
                            {inspectingDeed.video_url ? (
                                <div className="space-y-2">
                                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                                        <Video className="w-4 h-4 text-rose-600" />
                                        সংযুক্ত ভিডিও ফাইল / অনলাইন মিডিয়া
                                    </span>
                                    {inspectingDeed.video_url.endsWith('.mp4') ||
                                    inspectingDeed.video_url.endsWith('.webm') ||
                                    inspectingDeed.video_url.startsWith('/storage/') ? (
                                        <video
                                            src={inspectingDeed.video_url}
                                            controls
                                            className="w-full max-h-96 rounded-2xl bg-black object-contain shadow-md"
                                        />
                                    ) : (
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                                            <span className="text-xs text-slate-700 truncate">
                                                ভিডিও লিংক: {inspectingDeed.video_url}
                                            </span>
                                            <a
                                                href={inspectingDeed.video_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 shrink-0 ml-2"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                <span>ভিডিও দেখুন</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ) : null}

                            {/* Photo Gallery */}
                            {inspectingDeed.photos && inspectingDeed.photos.length > 0 && (
                                <div className="space-y-2">
                                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                                        <ImageIcon className="w-4 h-4 text-emerald-600" />
                                        সংযুক্ত ছবির প্রমাণাদি ({inspectingDeed.photos.length} টি)
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {inspectingDeed.photos.map((photo, i) => (
                                            <a
                                                key={i}
                                                href={photo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group"
                                            >
                                                <img
                                                    src={photo}
                                                    alt={`Evidence ${i + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                                <span className="absolute bottom-1 right-1 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white">
                                                    বড় করে দেখুন ↗
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Story Description */}
                            <div className="space-y-2">
                                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    মূল ঘটনা ও বিবরণ (Detailed Story)
                                </span>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bangla text-slate-800 leading-relaxed whitespace-pre-line">
                                    {inspectingDeed.description}
                                </div>
                            </div>

                            {/* Verification Data Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                    <span className="text-slate-500 block">অবস্থান (Location)</span>
                                    <span className="font-bold text-slate-800">
                                        {inspectingDeed.district}, {inspectingDeed.division}
                                    </span>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                    <span className="text-slate-500 block">ক্যাটাগরি</span>
                                    <span className="font-bold text-slate-800">
                                        {inspectingDeed.category?.name_bn || inspectingDeed.category?.name || 'General'}
                                    </span>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                    <span className="text-slate-500 block">সংঘটিত হওয়ার তারিখ</span>
                                    <span className="font-bold text-slate-800">
                                        {formatDeedDate(inspectingDeed.deed_date)}
                                    </span>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                    <span className="text-slate-500 block">উপকৃত মানুষ</span>
                                    <span className="font-bold text-emerald-700">
                                        ~{inspectingDeed.beneficiaries_count} জন
                                    </span>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                    <span className="text-slate-500 block">সংগঠন / দল</span>
                                    <span className="font-bold text-slate-800">
                                        {inspectingDeed.organization || inspectingDeed.team_name || 'ব্যক্তিগত উদ্যোগ'}
                                    </span>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                    <span className="text-slate-500 block">AI ট্রাস্ট স্কোর</span>
                                    <span className="font-bold text-emerald-700">
                                        {inspectingDeed.ai_trust_score}% Clean
                                    </span>
                                </div>
                            </div>

                            {/* Submitter Box */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                                        {inspectingDeed.user?.name
                                            ? inspectingDeed.user.name.charAt(0)
                                            : inspectingDeed.guest_name
                                            ? inspectingDeed.guest_name.charAt(0)
                                            : 'G'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-900 block">
                                                {inspectingDeed.user?.name || inspectingDeed.guest_name || 'গেস্ট কনট্রিবিউটর'}
                                            </span>
                                            {inspectingDeed.is_anonymous ? (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                                    🔒 নাম ও ঠিকানা গোপন
                                                </span>
                                            ) : null}
                                            {!inspectingDeed.user_id && (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                                                    লগইন ছাড়া গেস্ট
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[11px] text-slate-500">
                                            {inspectingDeed.user?.email || inspectingDeed.guest_email || 'ইমেইল দেওয়া হয়নি'}
                                            {inspectingDeed.guest_phone ? ` · ফোন: ${inspectingDeed.guest_phone}` : ''}
                                            {inspectingDeed.user?.role ? ` · Role: ${inspectingDeed.user.role}` : ''}
                                        </span>
                                    </div>
                                </div>

                                <span className="text-[11px] text-slate-500">
                                    দাখিল: {new Date(inspectingDeed.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            {/* Admin Review Note Input */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-700">
                                    অ্যাডমিন যাচাই নোট / মন্তব্য (ঐচ্ছিক):
                                </label>
                                <input
                                    type="text"
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="যাচাই ও অনুমোদনের কারণ বা পর্যবেক্ষণ উল্লেখ করুন..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                                />
                            </div>
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="p-5 sm:p-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
                            <button
                                type="button"
                                onClick={() => setInspectingDeed(null)}
                                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                বন্ধ করুন
                            </button>

                            <div className="flex items-center gap-2">
                                {inspectingDeed.status !== 'rejected' && (
                                    <button
                                        type="button"
                                        disabled={actionLoading}
                                        onClick={() => {
                                            setRejectingDeed(inspectingDeed);
                                            setInspectingDeed(null);
                                        }}
                                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>বাতিল করুন</span>
                                    </button>
                                )}

                                {inspectingDeed.status !== 'approved' && (
                                    <button
                                        type="button"
                                        disabled={actionLoading}
                                        onClick={() => handleApprove(inspectingDeed.id, adminNotes)}
                                        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        <Check className="w-4 h-4 stroke-[3]" />
                                        <span>অনুমোদন ও লাইভ করুন (Approve & Publish)</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* REJECTION REASON MODAL */}
            {rejectingDeed && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-800">
                        <div className="flex items-center justify-between">
                            <h4 className="text-base font-bold text-rose-700 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                <span>পোস্ট বাতিল নিশ্চিতকরণ</span>
                            </h4>
                            <button
                                onClick={() => setRejectingDeed(null)}
                                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-xs text-slate-600 font-bangla leading-relaxed">
                            আপনি কি <strong className="text-slate-900">"{rejectingDeed.title}"</strong> পোস্টটি বাতিল করতে চান? বাতিলকৃত পোস্ট ওয়েবসাইটে লাইভ প্রকাশিত হবে না এবং লেখকের প্রোফাইলে কারণ সহ নোটিফিকেশন যাবে।
                        </p>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-700">
                                বাতিলের কারণ (লেখককে জানানো হবে):
                            </label>
                            <textarea
                                rows={3}
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="যেমন: আপলোডকৃত ভিডিও বা ছবিতে ঘটনাটির স্পষ্ট প্রমাণ নেই, বা নীতিমালা বহির্ভূত কনটেন্ট..."
                                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setRejectingDeed(null)}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
                            >
                                ফিরে যান
                            </button>
                            <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => handleReject(rejectingDeed.id, rejectReason)}
                                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                                <X className="w-4 h-4" />
                                <span>বাতিল নিশ্চিত করুন</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
