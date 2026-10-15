import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Category, Certificate, GoodDeed, User } from '../types';
import { Navbar } from '../Components/Navbar';
import { Footer } from '../Components/Footer';
import { DeedModal } from '../Components/DeedModal';
import { RoleSwitcher } from '../Components/RoleSwitcher';
import {
    Sparkles,
    ArrowRight,
    CirclePlay,
    Video,
    ShieldCheck,
    MapPinned,
    Users,
    HeartHandshake,
    Heart,
    MessageCircle,
    Play,
    BadgeCheck,
    Trees,
    Droplet,
    GraduationCap,
    PawPrint,
    UsersRound,
    Leaf,
    Stethoscope,
    HandHeart,
    Siren,
    CloudUpload,
    Award,
    Crown,
    Trophy,
    Medal,
    MapPin,
    QrCode,
    ChevronLeft,
    ChevronRight,
    Pause,
    Shield,
    Clock,
} from 'lucide-react';

interface HomeProps {
    stats?: {
        deeds_count: number;
        heroes_count: number;
        districts_count: number;
        impact_points: number;
        trees_planted: number;
        blood_donations: number;
    };
    recentDeeds?: GoodDeed[];
    categories?: Category[];
    topHeroes?: User[];
    divisionStats?: { name: string; name_bn: string; heroes: string; deeds: string; code: string }[];
    featuredCertificate?: Certificate;
    activeCampaigns?: any[];
}

function useCountUp(target: number, duration: number = 1600) {
    const [count, setCount] = useState(0);
    const [seen, setSeen] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setSeen(true);
            },
            { threshold: 0.2 }
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!seen) return;
        const startTime = performance.now();
        let frameId = 0;
        const tick = (now: number) => {
            const progress = Math.min(1, (now - startTime) / duration);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(target * easeOut));
            if (progress < 1) {
                frameId = requestAnimationFrame(tick);
            }
        };
        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, [seen, target, duration]);

    return { ref, count };
}

function AnimatedStat({ target, suffix = '' }: { target: number; suffix?: string }) {
    const { ref, count } = useCountUp(target);
    return (
        <span ref={ref}>
            {target >= 1000 ? Math.floor(count).toLocaleString() : count}
            {suffix}
        </span>
    );
}

export default function Home({
    stats,
    recentDeeds,
    categories,
    topHeroes,
    divisionStats,
    featuredCertificate,
}: HomeProps) {
    const [selectedDeed, setSelectedDeed] = useState<any | null>(null);
    const [activeRankingTab, setActiveRankingTab] = useState<'district' | 'division' | 'national'>('district');

    // 5 Featured stats matching lovable site
    const statCards = [
        { label: 'Videos Uploaded', bn: 'ভিডিও আপলোড', value: 48520, icon: Video, suffix: '+' },
        { label: 'Verified Good Deeds', bn: 'যাচাইকৃত ভালো কাজ', value: 32180, icon: ShieldCheck, suffix: '+' },
        { label: 'Districts', bn: 'জেলা', value: 64, icon: MapPinned, suffix: '' },
        { label: 'Volunteers', bn: 'স্বেচ্ছাসেবক', value: 12400, icon: Users, suffix: '+' },
        { label: 'People Impacted', bn: 'উপকারভোগী মানুষ', value: 1240000, icon: HeartHandshake, suffix: '+' },
    ];

    // 4 Featured Good Deeds matching lovable site
    const featuredStories = [
        {
            id: 1,
            title: 'Planting 500 trees in Sylhet hills',
            author: 'Rashida Akter',
            district: 'Sylhet',
            category: 'Tree Plantation',
            likes: '12.4k',
            comments: 842,
            img: '/assets/hero-C5Z4Q9Lx.jpg',
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            verified: true,
            beneficiaries_count: 1200,
            ai_trust_score: 98,
            location: 'Dhaka Dakshin, Golapganj, Sylhet',
            description:
                'Organized an environmental drive to plant 500 native fruit and timber trees along the deforested hillsides of Golapganj, Sylhet. Engaged 35 local high school students and villagers to ensure sustainable watering.',
        },
        {
            id: 2,
            title: 'Emergency blood drive saved 30 lives',
            author: 'Dhaka Youth Club',
            district: 'Dhaka',
            category: 'Blood Donation',
            likes: '9.1k',
            comments: 512,
            img: '/assets/deed-blood-DHwLUnjs.jpg',
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            verified: true,
            beneficiaries_count: 30,
            ai_trust_score: 96,
            location: 'Dhaka Medical College Hospital, Dhaka',
            description:
                'Mobilized 60 voluntary blood donors at Dhaka Medical College Hospital for thalassemic children and emergency accident patients in critical need of rare B-negative and O-negative blood units.',
        },
        {
            id: 3,
            title: 'Rescuing street dogs in monsoon flood',
            author: 'Karim Hossain',
            district: 'Chattogram',
            category: 'Animal Rescue',
            likes: '7.8k',
            comments: 421,
            img: '/assets/deed-animal-CgdZ_OYi.jpg',
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            verified: false,
            beneficiaries_count: 18,
            ai_trust_score: 94,
            location: 'Agrabad Commercial Area, Chattogram',
            description:
                'During flash urban waterlogging in Chattogram Agrabad area, our volunteer squad rescued 18 trapped stray puppies and mother dogs from drowning, provided warmth, vaccinations, and nutritious food.',
        },
        {
            id: 4,
            title: 'Free school under the mango tree',
            author: 'Nusrat Jahan',
            district: 'Rangpur',
            category: 'Education',
            likes: '15.2k',
            comments: 1104,
            img: '/assets/deed-education-Ct-qPFBz.jpg',
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            verified: true,
            beneficiaries_count: 85,
            ai_trust_score: 97,
            location: 'Kandi Union, Pirgachha, Rangpur',
            description:
                'Conducted weekly science and English learning sessions for 85 child laborers and rural children without access to formal school in Pirgachha, Rangpur. Distributed notebooks, bags, and fruit meals.',
        },
    ];

    // Normalize stories from dynamic DB approved deeds + defaults
    const allStories = React.useMemo(() => {
        if (recentDeeds && recentDeeds.length > 0) {
            return recentDeeds.map((d: any) => ({
                id: d.id,
                title: d.title,
                author: d.is_anonymous ? 'নাম প্রকাশে অনিচ্ছুক' : (d.user ? d.user.name : (d.guest_name || 'নাগরিক')),
                is_anonymous: !!d.is_anonymous,
                district: d.district || 'ঢাকা',
                division: d.division || 'Dhaka',
                category: d.category ? (d.category.name_bn || d.category.name) : 'ভালো কাজ',
                likes: d.likes_count ? (d.likes_count > 999 ? `${(d.likes_count / 1000).toFixed(1)}k` : String(d.likes_count)) : '0',
                comments: d.comments_count || 0,
                img: d.thumbnail || (d.photos && d.photos[0]) || '/assets/hero-C5Z4Q9Lx.jpg',
                video_url: d.video_url,
                verified: d.status === 'approved',
                beneficiaries_count: d.beneficiaries_count || 1,
                ai_trust_score: d.ai_trust_score || 95,
                location: d.location || `${d.district}, বাংলাদেশ`,
                description: d.description,
                rawDeed: d,
            }));
        }
        return featuredStories.map((d: any) => ({ ...d, rawDeed: d }));
    }, [recentDeeds]);

    // Auto-Rotating Carousel State (4 cards per view, 4.5s auto-rotate)
    const CARDS_PER_VIEW = 4;
    const ROTATION_INTERVAL_MS = 4500; // 4.5 seconds
    const totalPages = Math.max(1, Math.ceil(allStories.length / CARDS_PER_VIEW));
    const [currentPage, setCurrentPage] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-rotate effect
    useEffect(() => {
        if (totalPages <= 1 || isPaused) return;

        const interval = setInterval(() => {
            setCurrentPage((curr) => (curr + 1) % totalPages);
        }, ROTATION_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [totalPages, isPaused]);

    const handleNextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    const handleGoToPage = (index: number) => {
        setCurrentPage(index);
    };

    // Group all stories into pages of 4 items for smooth sliding track
    const pages = React.useMemo(() => {
        const result: any[][] = [];
        for (let i = 0; i < totalPages; i++) {
            const start = i * CARDS_PER_VIEW;
            let slice = allStories.slice(start, start + CARDS_PER_VIEW);
            if (slice.length < CARDS_PER_VIEW && allStories.length >= CARDS_PER_VIEW) {
                slice = [...slice, ...allStories.slice(0, CARDS_PER_VIEW - slice.length)];
            }
            result.push(slice);
        }
        return result;
    }, [allStories, totalPages]);

    // 10 Categories matching lovable site
    const categoryList = [
        { name: 'Tree Plantation', bn: 'বৃক্ষরোপণ', icon: Trees, count: '8.2k' },
        { name: 'Blood Donation', bn: 'রক্তদান', icon: Droplet, count: '6.4k' },
        { name: 'Education', bn: 'শিক্ষা', icon: GraduationCap, count: '5.1k' },
        { name: 'Animal Rescue', bn: 'প্রাণী উদ্ধার', icon: PawPrint, count: '3.8k' },
        { name: 'Community Service', bn: 'সমাজসেবা', icon: UsersRound, count: '9.7k' },
        { name: 'Environment', bn: 'পরিবেশ', icon: Leaf, count: '4.6k' },
        { name: 'Healthcare', bn: 'স্বাস্থ্যসেবা', icon: Stethoscope, count: '3.2k' },
        { name: 'Helping the Poor', bn: 'দরিদ্র সাহায্য', icon: HandHeart, count: '7.9k' },
        { name: 'Emergency Response', bn: 'জরুরি সেবা', icon: Siren, count: '2.1k' },
        { name: 'Others', bn: 'অন্যান্য', icon: Sparkles, count: '1.5k' },
    ];

    // How it works 3 steps
    const steps = [
        {
            n: '01',
            icon: CloudUpload,
            title: 'Upload your deed',
            desc: 'Share a video or photos of your good deed with location, category and a short story.',
        },
        {
            n: '02',
            icon: ShieldCheck,
            title: 'Get verified',
            desc: 'Our district reviewers verify authenticity so your impact counts on the leaderboard.',
        },
        {
            n: '03',
            icon: Award,
            title: 'Earn certificates',
            desc: 'Collect badges, digital certificates with QR codes, and compete for monthly awards.',
        },
    ];

    // Top Heroes
    const heroesData = [
        {
            rank: 1,
            name: 'Rashida Akter',
            district: 'Sylhet',
            deeds: 148,
            score: 9840,
            icon: Crown,
            tier: 'bg-gradient-cta text-primary-foreground',
        },
        {
            rank: 2,
            name: 'Karim Hossain',
            district: 'Chattogram',
            deeds: 132,
            score: 8720,
            icon: Trophy,
            tier: 'bg-primary/10 text-primary',
        },
        {
            rank: 3,
            name: 'Nusrat Jahan',
            district: 'Rangpur',
            deeds: 121,
            score: 8210,
            icon: Medal,
            tier: 'bg-primary/10 text-primary',
        },
        {
            rank: 4,
            name: 'Sabbir Rahman',
            district: 'Khulna',
            deeds: 108,
            score: 7440,
            icon: Award,
            tier: 'bg-muted text-foreground',
        },
        {
            rank: 5,
            name: 'Tania Islam',
            district: 'Barishal',
            deeds: 96,
            score: 6980,
            icon: Award,
            tier: 'bg-muted text-foreground',
        },
    ];

    // 8 Divisions data & bar ratios
    const divisions = [
        { name: 'Dhaka', deeds: 12480, heroes: 2140, color: 'oklch(0.72 0.17 148)' },
        { name: 'Chattogram', deeds: 9820, heroes: 1680, color: 'oklch(0.62 0.15 152)' },
        { name: 'Rajshahi', deeds: 5410, heroes: 940, color: 'oklch(0.78 0.14 145)' },
        { name: 'Khulna', deeds: 4890, heroes: 812, color: 'oklch(0.55 0.13 155)' },
        { name: 'Barishal', deeds: 3210, heroes: 540, color: 'oklch(0.68 0.15 150)' },
        { name: 'Sylhet', deeds: 6740, heroes: 1210, color: 'oklch(0.5 0.12 155)' },
        { name: 'Rangpur', deeds: 4020, heroes: 690, color: 'oklch(0.75 0.16 148)' },
        { name: 'Mymensingh', deeds: 2860, heroes: 470, color: 'oklch(0.6 0.14 152)' },
    ];
    const maxDeeds = Math.max(...divisions.map((d) => d.deeds));

    // Partner logos
    const partners = [
        'Bangladesh Red Crescent',
        'Youth Foundation BD',
        'GreenBangla',
        'Dhaka University',
        'BRAC',
        'Grameen Trust',
    ];

    return (
        <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
            <Head title="Valo Kaj Bangladesh — Share Your Good Deeds. Inspire Bangladesh." />

            {/* Sticky Glass Navbar */}
            <Navbar />

            <main>
                {/* 1. Hero Section */}
                <section className="relative overflow-hidden pt-10 pb-24 md:pt-16">
                    {/* Ambient Glow Orbs */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary-glow/30 blur-3xl animate-float"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute top-40 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float"
                        style={{ animationDelay: '-3s' }}
                    />

                    <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-[1.05fr_1fr]">
                        <div className="animate-fade-up">
                            {/* District badge */}
                            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span className="font-bangla">সারা বাংলাদেশের ভালো কাজের প্ল্যাটফর্ম</span>
                                <span className="opacity-60">·</span> 64 Districts
                            </span>

                            {/* Headline */}
                            <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                                Share Your Good Deeds.
                                <br />
                                <span className="text-gradient">Inspire Bangladesh.</span>
                            </h1>

                            {/* Bengali Subheadline */}
                            <p className="mt-4 font-bangla text-lg font-semibold text-foreground/80 md:text-xl">
                                আপনার ভালো কাজ শেয়ার করুন, বাংলাদেশকে অনুপ্রাণিত করুন।
                            </p>

                            {/* Description */}
                            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                                Upload your community service videos, inspire millions, and become your district's
                                Good Deed Hero. Together we build the largest digital archive of kindness in Bangladesh.
                            </p>

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-wrap items-center gap-3">
                                <Link
                                    href="/deeds/create"
                                    className="group inline-flex items-center gap-2 rounded-full bg-gradient-cta px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
                                >
                                    <span>Upload Good Deed</span>
                                    <span className="font-bangla opacity-90">· ভালো কাজ দিন</span>
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                                <a
                                    href="#explore"
                                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground shadow-card transition-colors hover:bg-accent"
                                >
                                    <CirclePlay className="h-5 w-5 text-primary" />
                                    <span>Explore</span>
                                    <span className="font-bangla text-muted-foreground">· ভিডিও দেখুন</span>
                                </a>
                            </div>

                            {/* Volunteer Avatars Cluster */}
                            <div className="mt-10 flex items-center gap-6">
                                <div className="flex -space-x-3">
                                    {['oklch(0.72 0.17 148)', 'oklch(0.55 0.14 152)', 'oklch(0.82 0.12 145)', 'oklch(0.4 0.1 155)'].map(
                                        (color, idx) => (
                                            <div
                                                key={idx}
                                                className="h-9 w-9 rounded-full border-2 border-background"
                                                style={{ backgroundColor: color }}
                                            />
                                        )
                                    )}
                                </div>
                                <div className="text-sm">
                                    <div className="font-semibold">12,400+ Heroes</div>
                                    <div className="text-muted-foreground">already changing lives</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Hero Image Card */}
                        <div className="relative animate-fade-up" style={{ animationDelay: '150ms' }}>
                            <div className="relative overflow-hidden rounded-3xl shadow-glow">
                                <img
                                    src="/assets/hero-C5Z4Q9Lx.jpg"
                                    alt="Bangladeshi volunteers planting trees together in a green field"
                                    width={1600}
                                    height={1200}
                                    className="h-[520px] w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />

                                {/* Live from Sylhet Badge */}
                                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium shadow-card backdrop-blur">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-primary" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                                    </span>
                                    LIVE from Sylhet · Tree Plantation
                                </div>
                            </div>

                            {/* Floating Stats Badge (bottom-left) */}
                            <div className="absolute -bottom-6 -left-4 hidden w-64 rounded-2xl bg-card p-4 shadow-glow sm:block">
                                <div className="flex items-center gap-3">
                                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Today across BD</div>
                                        <div className="text-lg font-bold">2,847 deeds</div>
                                    </div>
                                </div>
                                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                    <div className="h-full w-4/5 rounded-full bg-gradient-cta" />
                                </div>
                            </div>

                            {/* Floating Verified Hero (top-right) */}
                            <div className="absolute -right-3 top-8 hidden rounded-2xl bg-card px-4 py-3 shadow-glow md:block">
                                <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                    Verified Hero
                                </div>
                                <div className="mt-0.5 text-sm font-bold">Rashida · Rangpur</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Overlapping Metrics Bar */}
                <section className="relative mx-auto -mt-6 max-w-7xl px-4">
                    <div className="grid grid-cols-2 gap-3 rounded-3xl border border-border bg-card p-4 shadow-card sm:p-6 md:grid-cols-3 lg:grid-cols-5">
                        {statCards.map((stat) => (
                            <div
                                key={stat.label}
                                className="group relative overflow-hidden rounded-2xl bg-gradient-soft p-5 transition-transform hover:-translate-y-0.5"
                            >
                                <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <div className="text-2xl font-bold tracking-tight md:text-3xl">
                                    <AnimatedStat target={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="mt-1 text-xs font-medium text-muted-foreground">{stat.label}</div>
                                <div className="font-bangla text-[11px] text-muted-foreground/80">{stat.bn}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Latest Good Deeds Section (#explore) with Smooth 4-Card Sliding Carousel */}
                <section
                    id="explore"
                    className="mx-auto max-w-7xl px-4 py-20"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                Featured · নির্বাচিত
                            </span>
                            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl font-bangla">
                                Latest Good Deeds
                            </h2>
                            <p className="mt-1 font-bangla text-base font-semibold text-emerald-700">
                                সাম্প্রতিক ভালো কাজ
                            </p>
                            <p className="mt-1 max-w-xl text-xs sm:text-sm text-slate-600 font-bangla">
                                সারা দেশের ৬৪ জেলার নাগরিকদের বাস্তব ভালো কাজের গল্প ও ভিডিও প্রমাণাদি।
                            </p>
                        </div>

                        {/* Navigation Controls & View All */}
                        <div className="flex items-center gap-3">
                            {/* Prev & Next Slide Buttons */}
                            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                                <button
                                    type="button"
                                    onClick={handlePrevPage}
                                    title="পূর্ববর্তী ৪টি কাজ"
                                    aria-label="পূর্ববর্তী"
                                    className="p-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-700 shadow-xs transition-all cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNextPage}
                                    title="পরবর্তী ৪টি কাজ"
                                    aria-label="পরবর্তী"
                                    className="p-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-700 shadow-xs transition-all cursor-pointer"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* View All Button */}
                            <Link
                                href="/explore"
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-800 shadow-xs transition-all hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
                            >
                                <span>View All</span>
                                <span className="font-bangla text-xs text-slate-500">· সব দেখুন ({allStories.length})</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Smooth Horizontal Sliding Carousel Track */}
                    <div className="overflow-hidden w-full py-2">
                        <div
                            className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                            style={{ transform: `translateX(-${currentPage * 100}%)` }}
                        >
                            {pages.map((pageCards, pIndex) => (
                                <div
                                    key={pIndex}
                                    className="w-full shrink-0 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 px-0.5"
                                >
                                    {pageCards.map((deed, idx) => (
                                        <article
                                            key={`${deed.id}-${pIndex}-${idx}`}
                                            onClick={() => setSelectedDeed(deed.rawDeed || deed)}
                                            className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-emerald-300 flex flex-col justify-between"
                                        >
                                            <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                                                <img
                                                    src={deed.img}
                                                    alt={deed.title}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                                                {/* Top Category Pill & Verified/Anonymous Badge */}
                                                <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-1">
                                                    <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-800 backdrop-blur shadow-xs border border-slate-200/60">
                                                        {deed.category}
                                                    </span>
                                                    {deed.is_anonymous ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 text-white px-2 py-0.5 text-[10px] font-bold shadow-xs">
                                                            <Shield className="w-3 h-3" />
                                                            নাম গোপন
                                                        </span>
                                                    ) : deed.verified ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold shadow-xs">
                                                            <BadgeCheck className="w-3 h-3" />
                                                            যাচাইকৃত
                                                        </span>
                                                    ) : null}
                                                </div>

                                                {/* Centered Play Button on Hover */}
                                                {deed.video_url && (
                                                    <div className="absolute inset-0 grid place-items-center opacity-90 transition-opacity group-hover:scale-110 duration-300">
                                                        <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-600/90 text-white shadow-lg backdrop-blur">
                                                            <Play className="h-5 w-5 ml-0.5 fill-current" />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Bottom Title & Author in Image Overlay */}
                                                <div className="absolute inset-x-3 bottom-3 text-white">
                                                    <h3 className="text-sm font-bold leading-snug line-clamp-2 drop-shadow-md group-hover:text-emerald-200 transition-colors">
                                                        {deed.title}
                                                    </h3>
                                                    <p className="mt-1 text-[11px] text-slate-200 font-medium flex items-center justify-between">
                                                        <span className="truncate">{deed.author}</span>
                                                        <span className="shrink-0 text-emerald-300 font-semibold">{deed.district}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Footer bar with likes, comments, watch CTA */}
                                            <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-500 bg-white border-t border-slate-100">
                                                <span className="inline-flex items-center gap-1.5 font-medium">
                                                    <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-50" /> {deed.likes}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 font-medium">
                                                    <MessageCircle className="h-3.5 w-3.5 text-slate-400" /> {deed.comments}
                                                </span>
                                                <span className="font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                                                    বিস্তারিত দেখুন →
                                                </span>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dot Pagination Indicators */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-2">
                            {Array.from({ length: totalPages }).map((_, pIdx) => (
                                <button
                                    key={pIdx}
                                    type="button"
                                    onClick={() => handleGoToPage(pIdx)}
                                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                                        currentPage === pIdx
                                            ? 'w-8 h-2 bg-emerald-600 shadow-xs'
                                            : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                                    }`}
                                    title={`স্লাইড ${pIdx + 1}-এ যান`}
                                    aria-label={`স্লাইড ${pIdx + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* 4. Trusted Partner Organizations Ticker */}
                <section className="border-y border-border bg-card/50 py-10">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                            Trusted by partner organizations
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                            {partners.map((p) => (
                                <span
                                    key={p}
                                    className="text-sm font-semibold text-foreground/60 transition-colors hover:text-primary cursor-default"
                                >
                                    {p}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. Categories Section */}
                <section className="mx-auto max-w-7xl px-4 py-20">
                    <div className="mb-10 text-center">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                            Categories · <span className="font-bangla normal-case tracking-normal">বিভাগ</span>
                        </span>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                            Every act of kindness has a home
                        </h2>
                        <p className="mt-2 font-bangla text-base text-foreground/70">
                            প্রতিটি ভালো কাজের জন্য আলাদা জায়গা
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                        {categoryList.map((cat) => (
                            <Link
                                key={cat.name}
                                href={`/explore?category=${encodeURIComponent(cat.name)}`}
                                className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
                            >
                                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-gradient-cta group-hover:text-primary-foreground">
                                    <cat.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold">{cat.name}</div>
                                    <div className="font-bangla text-xs text-foreground/70">{cat.bn}</div>
                                    <div className="mt-0.5 text-xs text-muted-foreground">{cat.count} deeds</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 6. How It Works Section */}
                <section className="bg-gradient-soft py-20">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="mb-12 max-w-2xl">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                How it works
                            </span>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                                Three steps from good deed to national recognition
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            {steps.map((step) => (
                                <div
                                    key={step.n}
                                    className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-card"
                                >
                                    <div className="absolute -right-6 -top-6 text-7xl font-black text-primary/5 select-none">
                                        {step.n}
                                    </div>
                                    <div className="mb-5 inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-cta text-primary-foreground shadow-glow">
                                        <step.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold">{step.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 7. Leaderboard Section (#heroes) */}
                <section id="heroes" className="bg-gradient-soft py-20">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                    Leaderboard
                                </span>
                                <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                                    This Month's Top Heroes
                                </h2>
                                <p className="mt-4 max-w-md text-muted-foreground">
                                    Every good deed earns Impact Points. Reach the top and claim your district
                                    championship, a digital certificate, and a spot in the annual National Hero awards.
                                </p>

                                <div className="mt-8 grid grid-cols-3 gap-3">
                                    {(['district', 'division', 'national'] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveRankingTab(tab)}
                                            className={`rounded-2xl border p-4 text-center transition-all cursor-pointer ${
                                                activeRankingTab === tab
                                                    ? 'border-primary bg-primary/10 text-primary shadow-soft'
                                                    : 'border-border bg-card shadow-card hover:border-primary/40'
                                            }`}
                                        >
                                            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                            </div>
                                            <div className="mt-1 text-lg font-bold">Rankings</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-border bg-card p-3 shadow-card sm:p-5">
                                <ul className="space-y-2">
                                    {heroesData.map((hero) => (
                                        <li
                                            key={hero.rank}
                                            className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-accent"
                                        >
                                            <div
                                                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl font-bold ${hero.tier}`}
                                            >
                                                {hero.rank <= 3 ? <hero.icon className="h-5 w-5" /> : hero.rank}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate font-semibold">{hero.name}</span>
                                                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                                        {hero.district}
                                                    </span>
                                                </div>
                                                <div className="mt-0.5 text-xs text-muted-foreground">
                                                    {hero.deeds} verified deeds
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold tabular-nums">
                                                    {hero.score.toLocaleString()}
                                                </div>
                                                <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                                    Impact
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 8. 64 Districts & Interactive Map Breakdown (#districts) */}
                <section id="districts" className="mx-auto max-w-7xl px-4 py-20">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr]">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                The Map
                            </span>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                                Good deeds from all 8 divisions & 64 districts
                            </h2>
                            <p className="mt-4 max-w-md text-muted-foreground">
                                Every deed you upload gets pinned on the national map. Click your district to see local
                                heroes, top videos and community impact.
                            </p>
                            <Link
                                href="/map"
                                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-cta px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
                            >
                                <MapPin className="h-4 w-4" />
                                <span>Open interactive map</span>
                            </Link>
                        </div>

                        <div className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-7">
                            <div className="mb-4 flex items-center justify-between text-xs font-medium text-muted-foreground">
                                <span>Division</span>
                                <span>Verified Deeds</span>
                            </div>
                            <ul className="space-y-3">
                                {divisions.map((div) => (
                                    <li key={div.name} className="grid grid-cols-[5.5rem_1fr_auto] sm:grid-cols-[8rem_1fr_auto] items-center gap-2 sm:gap-4">
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-semibold">{div.name}</div>
                                            <div className="text-[11px] text-muted-foreground">
                                                {div.heroes.toLocaleString()} heroes
                                            </div>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${(div.deeds / maxDeeds) * 100}%`,
                                                    backgroundColor: div.color,
                                                }}
                                            />
                                        </div>
                                        <div className="w-16 text-right text-sm font-bold tabular-nums">
                                            {div.deeds.toLocaleString()}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 9. Awards & Certificates Section (#awards) */}
                <section id="awards" className="bg-gradient-soft py-20">
                    <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                Awards & Certificates
                            </span>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                                Recognition that lasts a lifetime
                            </h2>
                            <p className="mt-4 max-w-lg text-muted-foreground">
                                Every month we honor the Top Volunteer, Top Good Deed, Top Youth and Top Organization. At
                                year's end, District, Division and National Hero awards celebrate the very best of Bangladesh.
                            </p>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                {[
                                    { icon: Trophy, title: 'Monthly Awards', desc: '4 categories every month' },
                                    { icon: ShieldCheck, title: 'Verified Badge', desc: 'Trusted by district admins' },
                                    { icon: QrCode, title: 'Digital Certificate', desc: 'QR-verifiable & shareable' },
                                    { icon: Trophy, title: 'National Hero', desc: 'Annual grand recognition' },
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-2xl border border-border bg-card p-4 shadow-card"
                                    >
                                        <div className="mb-2 grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                                            <item.icon className="h-4 w-4" />
                                        </div>
                                        <div className="text-sm font-semibold">{item.title}</div>
                                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Physical Certificate Preview */}
                        <div className="relative mx-auto w-full max-w-xl">
                            <div className="rotate-[-2deg] rounded-3xl border-2 border-primary/20 bg-card p-8 shadow-glow">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-cta text-primary-foreground">
                                            <Trophy className="h-5 w-5" />
                                        </div>
                                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Valo Kaj Bangladesh
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-mono text-muted-foreground">
                                        No. VKB-2026-04829
                                    </div>
                                </div>

                                <div className="mt-8 text-center">
                                    <div className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
                                        Certificate of Recognition
                                    </div>
                                    <div className="mt-4 font-display text-3xl font-bold">Rashida Akter</div>
                                    <div className="mt-1 text-sm text-muted-foreground">District Champion · Sylhet</div>
                                    <div className="mx-auto mt-4 h-px w-24 bg-primary/40" />
                                    <p className="mt-4 mx-auto max-w-sm text-xs text-muted-foreground">
                                        For outstanding contribution to community service, tree plantation and
                                        environmental impact in April 2026.
                                    </p>
                                </div>

                                <div className="mt-8 flex items-end justify-between">
                                    <div>
                                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                            Issued
                                        </div>
                                        <div className="text-sm font-semibold">Apr 30, 2026</div>
                                    </div>
                                    <div className="grid h-16 w-16 place-items-center rounded-lg border border-border bg-muted">
                                        <QrCode className="h-10 w-10 text-foreground/80" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 10. Upload CTA Banner (#upload) */}
                <section id="upload" className="mx-auto max-w-7xl px-4 py-20">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 text-primary-foreground shadow-glow md:p-16">
                        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-glow/40 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl" />

                        <div className="relative max-w-2xl">
                            <span className="inline-flex rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
                                Join the movement · <span className="font-bangla normal-case tracking-normal">যোগ দিন</span>
                            </span>
                            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                                Your next good deed could inspire a million people.
                            </h2>
                            <p className="mt-3 font-bangla text-lg text-primary-foreground/95 md:text-xl">
                                আপনার একটি ভালো কাজ লক্ষ মানুষকে অনুপ্রাণিত করতে পারে।
                            </p>
                            <p className="mt-4 max-w-lg text-primary-foreground/85 md:text-lg">
                                Upload your first video today. Get verified. Earn your certificate. Represent your
                                district on the national leaderboard.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href="/deeds/create"
                                    className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3.5 text-sm font-semibold text-foreground shadow-soft transition-transform hover:scale-[1.03]"
                                >
                                    <span>Upload good deed</span>
                                    <span className="font-bangla opacity-70">· ভালো কাজ দিন</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="/auth"
                                    className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-6 py-3.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-primary-foreground/20"
                                >
                                    <span>Create free account</span>
                                    <span className="font-bangla opacity-90">· ফ্রি অ্যাকাউন্ট</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />

            {/* Interactive Deed Detail Modal */}
            {selectedDeed && (
                <DeedModal
                    deed={selectedDeed}
                    isOpen={!!selectedDeed}
                    onClose={() => setSelectedDeed(null)}
                />
            )}

            {/* Role Switcher floating widget for test convenience */}
            <RoleSwitcher />
        </div>
    );
}
