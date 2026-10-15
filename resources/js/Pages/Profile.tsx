import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Certificate, GoodDeed, User, UserNotification } from '../types';
import { RoleSwitcher } from '../Components/RoleSwitcher';
import { Navbar } from '../Components/Navbar';
import { Footer } from '../Components/Footer';
import { CertificatePreview } from '../Components/CertificatePreview';
import {
    Sparkles,
    MapPin,
    Building2,
    Calendar,
    Award,
    CheckCircle2,
    Clock,
    PlusCircle,
    Bell,
    ChevronRight,
} from 'lucide-react';

interface ProfileProps {
    profileUser: User;
    myDeeds: GoodDeed[];
    myCertificates: Certificate[];
    notifications: UserNotification[];
}

export default function Profile({
    profileUser,
    myDeeds,
    myCertificates,
    notifications,
}: ProfileProps) {
    return (
        <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
            <Head title={`Volunteer Profile — ${profileUser.name} — Valo Kaj Bangladesh`} />

            <RoleSwitcher />
            <Navbar />

            <main className="flex-1 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8 sm:space-y-10">
                {/* Profile Hero Card */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            {profileUser.avatar ? (
                                <img
                                    src={profileUser.avatar}
                                    alt={profileUser.name}
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-emerald-500/20 shadow-md"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-3xl text-white shadow-md">
                                    {profileUser.name.charAt(0)}
                                </div>
                            )}

                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                        {profileUser.name}
                                    </h1>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 capitalize">
                                        {profileUser.role.replace('_', ' ')}
                                    </span>
                                </div>

                                <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>{profileUser.district}, {profileUser.division}</span>
                                    {profileUser.organization && (
                                        <>
                                            <span className="text-slate-300">•</span>
                                            <span className="flex items-center gap-1">
                                                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                                                {profileUser.organization}
                                            </span>
                                        </>
                                    )}
                                </p>

                                {profileUser.bio && (
                                    <p className="text-xs sm:text-sm text-slate-600 max-w-xl pt-1 leading-relaxed">
                                        {profileUser.bio}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Impact Points Counter Badge */}
                        <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-white border border-emerald-200/90 text-center min-w-44 shadow-sm">
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center justify-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                Impact Score
                            </span>
                            <p className="text-3xl sm:text-4xl font-black text-emerald-700 mt-1">
                                {profileUser.impact_score.toLocaleString()}
                            </p>
                            <span className="text-[11px] text-slate-500 font-semibold">
                                Level: District Hero 🌟
                            </span>
                        </div>
                    </div>
                </div>

                {/* Notifications & Announcements */}
                {notifications.length > 0 && (
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                            <Bell className="w-4 h-4 text-emerald-600" />
                            Recent Activity & Status Updates
                        </h3>
                        <div className="space-y-2">
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs flex items-center justify-between gap-4"
                                >
                                    <div>
                                        <h5 className="font-bold text-slate-900">{n.title}</h5>
                                        <p className="text-slate-600 mt-0.5">{n.message}</p>
                                    </div>
                                    {n.link && (
                                        <Link
                                            href={n.link}
                                            className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-semibold whitespace-nowrap transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* My Deeds List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                                My Good Deeds Submission History ({myDeeds.length})
                            </h2>
                            <p className="text-xs text-slate-600">
                                Track submission review status, AI Trust Scores, and admin verification
                            </p>
                        </div>

                        <Link
                            href="/deeds/create"
                            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-sm transition-all"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Upload New Deed</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {myDeeds.map((deed) => (
                            <div
                                key={deed.id}
                                className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                            deed.status === 'approved'
                                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                : deed.status === 'pending'
                                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                                        }`}>
                                            {deed.status === 'pending' ? 'অপেক্ষমাণ (Pending)' : deed.status.toUpperCase()}
                                        </span>

                                        <span className="text-xs font-bold text-emerald-700">
                                            AI Trust: {deed.ai_trust_score}%
                                        </span>
                                    </div>

                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{deed.title}</h3>
                                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{deed.description}</p>
                                </div>

                                {deed.review_notes && (
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Moderator / Admin Note:</span>
                                        <p className="text-slate-700 mt-0.5">{deed.review_notes}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                                    <span>{deed.district} • {deed.deed_date}</span>
                                    <span className="font-bold text-emerald-700">+{deed.impact_points} pts</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* My Earned Certificates */}
                {myCertificates.length > 0 && (
                    <div className="space-y-6 pt-6 border-t border-slate-200">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                                My Digital Certificates ({myCertificates.length})
                            </h2>
                            <p className="text-xs text-slate-600">
                                Official verifiable certificates issued by Valo Kaj Bangladesh
                            </p>
                        </div>

                        <div className="space-y-6">
                            {myCertificates.map((cert) => (
                                <CertificatePreview key={cert.id} certificate={cert} interactive={true} />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
