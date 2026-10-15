import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AuditLog, GoodDeed } from '../../types';
import { RoleSwitcher } from '../../Components/RoleSwitcher';
import { Navbar } from '../../Components/Navbar';
import { Footer } from '../../Components/Footer';
import {
    Shield,
    Users,
    CheckCircle2,
    Clock,
    AlertTriangle,
    BarChart3,
    ArrowUpRight,
} from 'lucide-react';

interface DivisionPanelProps {
    division: string;
    divisionDeeds: GoodDeed[];
    districtSummaries: {
        district: string;
        pending: number;
        approved: number;
        rejected: number;
        mod_name: string;
    }[];
    moderatorLogs: AuditLog[];
}

export default function DivisionPanel({
    division,
    divisionDeeds,
    districtSummaries,
    moderatorLogs,
}: DivisionPanelProps) {
    return (
        <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
            <Head title={`Division Moderator Panel (${division}) — Valo Kaj Bangladesh`} />

            <RoleSwitcher />
            <Navbar />

            <main className="flex-1 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
                {/* Header */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                            <Shield className="w-4 h-4" />
                            <span>Division Moderator Oversight</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            {division} Division Moderation Center
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-600 font-bangla mt-0.5">
                            বিভাগের অন্তর্ভুক্ত সকল জেলার মডারেটরদের কাজের গতি, অনুমোদন ও আপিল পর্যবেক্ষণ।
                        </p>
                    </div>

                    <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {districtSummaries.length} Districts Supervised
                    </span>
                </div>

                {/* District Moderator Performance Metrics */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                        District Moderators Performance & Resolution Speed
                    </h3>

                    <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">District</th>
                                    <th className="py-3 px-4">Assigned Moderator</th>
                                    <th className="py-3 px-4">Pending</th>
                                    <th className="py-3 px-4">Approved</th>
                                    <th className="py-3 px-4">Rejected</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {districtSummaries.map((item) => (
                                    <tr key={item.district} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="py-3.5 px-4 font-bold text-slate-900">{item.district}</td>
                                        <td className="py-3.5 px-4 text-slate-600">{item.mod_name}</td>
                                        <td className="py-3.5 px-4">
                                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                                item.pending > 0 ? 'bg-amber-100 text-amber-800' : 'text-slate-400'
                                            }`}>
                                                {item.pending} pending
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-emerald-700 font-semibold">{item.approved}</td>
                                        <td className="py-3.5 px-4 text-rose-700 font-semibold">{item.rejected}</td>
                                        <td className="py-3.5 px-4">
                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Active & Healthy
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <Link
                                                href={`/moderator/district?district=${item.district}`}
                                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold"
                                            >
                                                <span>Inspect</span>
                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Audit Logs of Division Moderator Activity */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-600" />
                        Live Moderator Activity Stream
                    </h3>

                    <div className="space-y-2">
                        {moderatorLogs.map((log) => (
                            <div
                                key={log.id}
                                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="font-semibold text-slate-800">{log.action.replace('_', ' ').toUpperCase()}</span>
                                    <span className="text-slate-500">by {log.user?.name || 'Moderator'}</span>
                                </div>
                                <span className="text-slate-400 font-mono text-[11px]">
                                    {new Date(log.created_at).toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
