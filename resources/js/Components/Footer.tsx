import React from 'react';
import { Leaf } from 'lucide-react';

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const YoutubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
    </svg>
);

const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
);

export const Footer: React.FC = () => {
    const columns = [
        {
            title: 'Platform · প্ল্যাটফর্ম',
            links: [
                { label: 'Explore · প্রদর্শনী', href: '/explore' },
                { label: 'Upload Deed · কাজ যোগ করুন', href: '/deeds/create' },
                { label: 'Leaderboard · র‍্যাঙ্কিং', href: '/leaderboard' },
                { label: 'Interactive Map · মানচিত্র', href: '/map' },
                { label: 'Campaigns · বিশেষ ক্যাম্পেইন', href: '/campaigns' },
            ],
        },
        {
            title: 'Community · সম্প্রদায়',
            links: [
                { label: 'Top Volunteers · সেরা স্বেচ্ছাসেবক', href: '/leaderboard' },
                { label: 'Organizations · পার্টনার সংস্থা', href: '/organization' },
                { label: 'District Moderation · জেলা প্যানেল', href: '/moderator/district' },
                { label: 'Verify Certificate · সনদ যাচাই', href: '/verify-certificate' },
            ],
        },
        {
            title: 'About · পরিচিতি',
            links: [
                { label: 'About Us · আমাদের সম্পর্কে', href: '/#about' },
                { label: 'Partner Organizations · পার্টনার', href: '/#about' },
                { label: 'Contact Helpline · যোগাযোগ', href: 'mailto:contact@valokaj.org' },
            ],
        },
        {
            title: 'Guidelines · নীতিমালা',
            links: [
                { label: 'Submission Rules · নিয়মাবলী', href: '/deeds/create' },
                { label: 'Privacy Policy · গোপনীয়তা', href: '#' },
                { label: 'Terms of Service · শর্তাবলী', href: '#' },
            ],
        },
    ];

    const socials = [
        { Icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
        { Icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
        { Icon: YoutubeIcon, href: 'https://youtube.com', label: 'YouTube' },
        { Icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
    ];

    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-8 sm:gap-10">
                    <div className="col-span-1 sm:col-span-2">
                        <div className="flex items-center gap-2">
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-hero text-primary-foreground shadow-soft">
                                <Leaf className="h-5 w-5" />
                            </span>
                            <span className="flex flex-col leading-tight">
                                <span className="text-base font-bold">Valo Kaj Bangladesh</span>
                                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                                    ভালো কাজ · Good Deeds
                                </span>
                            </span>
                        </div>
                        <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                            The largest digital archive of good deeds in Bangladesh. Built by the community, for the community.
                        </p>
                        <div className="mt-5 flex gap-2">
                            {socials.map((s, idx) => (
                                <a
                                    key={idx}
                                    href={s.href}
                                    className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                                >
                                    <s.Icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {columns.map((col) => (
                        <div key={col.title}>
                            <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
                                {col.title}
                            </div>
                            <ul className="mt-4 space-y-2.5">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
                    <span>© 2026 Valo Kaj Bangladesh. All rights reserved.</span>
                    <span>Made with 💚 across 64 districts</span>
                </div>
            </div>
        </footer>
    );
};
