import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '../types';
import { Leaf, Menu, X, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user;

    const navLinks = [
        { label: 'View All', bn: 'সব দেখুন', href: '/explore' },
        { label: 'Heroes', bn: 'হিরো', href: '#heroes' },
        { label: 'Districts', bn: 'জেলা', href: '#districts' },
        { label: 'Awards', bn: 'পুরস্কার', href: '#awards' },
        { label: 'Map', bn: 'মানচিত্র', href: '#map' },
    ];

    return (
        <header className="sticky top-0 z-40 w-full">
            <div className="mx-auto mt-3 max-w-7xl px-4">
                <nav className="glass flex items-center justify-between rounded-2xl px-4 py-3 shadow-card">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-hero text-primary-foreground shadow-soft">
                            <Leaf className="h-5 w-5" />
                        </span>
                        <span className="flex flex-col leading-tight">
                            <span className="text-sm font-bold tracking-tight">Valo Kaj</span>
                            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                                Bangladesh
                            </span>
                        </span>
                    </Link>

                    <ul className="hidden items-center gap-8 md:flex">
                        {navLinks.map((item) => (
                            <li key={item.label}>
                                <a
                                    href={item.href}
                                    className="group flex flex-col items-center text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                                >
                                    <span>{item.label}</span>
                                    <span className="font-bangla text-[10px] text-muted-foreground group-hover:text-primary">
                                        {item.bn}
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="hidden items-center gap-2 md:flex">
                        {user ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                                >
                                    <UserIcon className="h-4 w-4" />
                                    <span>My account</span>
                                    <span className="font-bangla text-muted-foreground">· অ্যাকাউন্ট</span>
                                </Link>
                                <Link
                                    href="/deeds/create"
                                    className="rounded-full bg-gradient-cta px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
                                >
                                    Upload <span className="font-bangla">· আপলোড</span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth"
                                    className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                                >
                                    Sign in <span className="font-bangla text-muted-foreground">· লগইন</span>
                                </Link>
                                <Link
                                    href="/auth"
                                    className="rounded-full bg-gradient-cta px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
                                >
                                    Register <span className="font-bangla">· নিবন্ধন</span>
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="grid h-10 w-10 place-items-center rounded-xl border border-border md:hidden cursor-pointer"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </nav>

                {mobileOpen && (
                    <div className="glass mt-2 rounded-2xl p-4 md:hidden">
                        <ul className="flex flex-col gap-1">
                            {navLinks.map((item) => (
                                <li key={item.label}>
                                    <a
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                                    >
                                        <span>{item.label}</span>
                                        <span className="font-bangla text-xs text-muted-foreground">{item.bn}</span>
                                    </a>
                                </li>
                            ))}
                            <li className="mt-3 pt-3 border-t border-border flex flex-col gap-2">
                                <Link
                                    href="/deeds/create"
                                    onClick={() => setMobileOpen(false)}
                                    className="w-full rounded-xl bg-gradient-cta px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-soft flex items-center justify-center gap-2"
                                >
                                    <span>Upload Good Deed</span>
                                    <span className="font-bangla opacity-90">· ভালো কাজ দিন</span>
                                </Link>

                                {user ? (
                                    <Link
                                        href="/profile"
                                        onClick={() => setMobileOpen(false)}
                                        className="w-full rounded-xl border border-border bg-card px-4 py-2 text-center text-sm font-medium hover:bg-accent"
                                    >
                                        My account · অ্যাকাউন্ট
                                    </Link>
                                ) : (
                                    <div className="flex gap-2">
                                        <Link
                                            href="/auth"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-center text-sm font-medium hover:bg-accent"
                                        >
                                            Sign in · লগইন
                                        </Link>
                                        <Link
                                            href="/auth"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex-1 rounded-xl border border-primary/30 bg-primary/10 text-primary px-3 py-2 text-center text-sm font-semibold hover:bg-primary/20"
                                        >
                                            Register · নিবন্ধন
                                        </Link>
                                    </div>
                                )}
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
};
