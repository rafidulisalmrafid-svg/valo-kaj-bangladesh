import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import { PageProps } from '../types';
import { ShieldCheck, UserCheck, Award, Eye, Settings, MapPin } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
    const { auth } = usePage<PageProps>().props;
    const currentRole = auth.user ? auth.user.role : 'visitor';

    const roles = [
        {
            key: 'visitor',
            name: 'Visitor / Guest',
            icon: Eye,
            color: 'bg-slate-700 text-slate-200 border-slate-600',
            desc: 'Public browsing, map, feed & certificate verification',
        },
        {
            key: 'user',
            name: 'Hero User',
            icon: UserCheck,
            color: 'bg-emerald-800 text-emerald-100 border-emerald-600',
            desc: 'Rashida (Sylhet) - Upload deeds, earn points, get certificates',
        },
        {
            key: 'district_moderator',
            name: 'District Mod',
            icon: MapPin,
            color: 'bg-blue-800 text-blue-100 border-blue-600',
            desc: 'Dr. Mahfuz (Sylhet) - Review & approve district uploads with AI score',
        },
        {
            key: 'division_moderator',
            name: 'Division Mod',
            icon: ShieldCheck,
            color: 'bg-indigo-800 text-indigo-100 border-indigo-600',
            desc: 'Nazia (Chattogram) - Monitor all districts & oversee mod metrics',
        },
        {
            key: 'award_committee',
            name: 'Awards Jury',
            icon: Award,
            color: 'bg-amber-800 text-amber-100 border-amber-500',
            desc: 'Prof. Anisul - Shortlist top 20 deeds & crown district/national champions',
        },
        {
            key: 'super_admin',
            name: 'Super Admin',
            icon: Settings,
            color: 'bg-rose-900 text-rose-100 border-rose-600',
            desc: 'Tanvir - Full control of users, roles, categories, audit logs & system',
        },
    ];

    return (
        <div className="bg-white/95 border-b border-slate-200 text-xs py-1.5 px-3 sm:px-4 z-50 backdrop-blur-md w-full overflow-hidden shadow-xs">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center justify-between sm:justify-start gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                        ⚡ Role Switcher
                    </span>
                    <span className="text-[11px] text-slate-600 truncate">
                        Current: <strong className="text-slate-900 capitalize">{currentRole.replace('_', ' ')}</strong>
                        <span className="hidden md:inline">{auth.user ? ` (${auth.user.name})` : ' (Guest)'}</span>
                    </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none max-w-full">
                    {roles.map((r) => {
                        const Icon = r.icon;
                        const isActive = currentRole === r.key;
                        return (
                            <Link
                                key={r.key}
                                href={`/auth/switch-role/${r.key}`}
                                preserveScroll
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-medium transition-all border shrink-0 ${
                                    isActive
                                        ? `${r.color} ring-2 ring-emerald-500 font-bold shadow-xs`
                                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
                                }`}
                                title={r.desc}
                            >
                                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                                <span>{r.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
