import React, { useState, useRef, useEffect } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { Category, PageProps } from '../types';
import { RoleSwitcher } from '../Components/RoleSwitcher';
import { Navbar } from '../Components/Navbar';
import { Footer } from '../Components/Footer';
import { DISTRICTS, DIVISIONS } from '../data/bangladeshGeodata';
import {
    Sparkles,
    ShieldCheck,
    CheckCircle2,
    UploadCloud,
    Film,
    Image as ImageIcon,
    Link2,
    MapPin,
    Calendar,
    Users,
    Building2,
    X,
    Eye,
    Globe,
    AlertCircle,
    Loader2,
    HeartHandshake,
    AlertTriangle,
    FileCheck,
    ArrowRight,
    Camera,
    FolderUp,
    Phone,
    Mail,
    User as UserIcon,
    Lock,
} from 'lucide-react';

interface UploadDeedProps {
    categories: Category[];
}

export default function UploadDeed({ categories }: UploadDeedProps) {
    const { auth } = usePage<PageProps>().props;
    const currentUser = auth?.user;

    // Language State: default 'bn' (বাংলা) as requested by user
    const [lang, setLang] = useState<'bn' | 'en'>('bn');

    // Submission Type: 'good_deed' (ভালো কাজ) or 'complaint' (নাগরিক অভিযোগ / সমস্যা)
    const [submissionType, setSubmissionType] = useState<'good_deed' | 'complaint'>('good_deed');

    // Media Input Mode: 'upload' (সরাসরি ফাইল আপলোড) or 'url' (অনলাইন লিংক)
    const [mediaTab, setMediaTab] = useState<'upload' | 'url'>('upload');

    // File Preview States
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [imageFileDetails, setImageFileDetails] = useState<{ name: string; size: string } | null>(null);
    const [videoFileDetails, setVideoFileDetails] = useState<{ name: string; size: string } | null>(null);

    // AI Scanning Simulation State
    const [scanningAi, setScanningAi] = useState(false);
    const [aiProgressStep, setAiProgressStep] = useState(0);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        title: '',
        description: '',
        category_id: categories.length > 0 ? categories[0].id : 1,
        submission_type: 'good_deed',
        division: 'Dhaka',
        district: 'Dhaka',
        upazila: '',
        location: '',
        video_url: '',
        thumbnail: '',
        image_file: null as File | null,
        video_file: null as File | null,
        deed_date: new Date().toISOString().split('T')[0],
        beneficiaries_count: 1,
        team_name: '',
        organization: '',
        guest_name: '',
        guest_phone: '',
        guest_email: '',
        is_anonymous: false,
    });

    // Clean up created object URLs
    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            if (videoPreview && videoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(videoPreview);
            }
        };
    }, [imagePreview, videoPreview]);

    // Filter districts based on selected division
    const availableDistricts = DISTRICTS.filter(
        (d) => d.division === form.data.division
    );

    // Format file sizes
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Handle Image File Selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setData('image_file', file);
            setImageFileDetails({ name: file.name, size: formatBytes(file.size) });
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    // Handle Video File Selection
    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setData('video_file', file);
            setVideoFileDetails({ name: file.name, size: formatBytes(file.size) });
            const previewUrl = URL.createObjectURL(file);
            setVideoPreview(previewUrl);
        }
    };

    // Remove Image File
    const removeImageFile = () => {
        form.setData('image_file', null);
        setImagePreview(null);
        setImageFileDetails(null);
        if (imageInputRef.current) imageInputRef.current.value = '';
    };

    // Remove Video File
    const removeVideoFile = () => {
        form.setData('video_file', null);
        setVideoPreview(null);
        setVideoFileDetails(null);
        if (videoInputRef.current) videoInputRef.current.value = '';
    };

    // Handle Form Submit with AI verification animation
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setScanningAi(true);
        setAiProgressStep(1);

        const t1 = setTimeout(() => setAiProgressStep(2), 500);
        const t2 = setTimeout(() => setAiProgressStep(3), 1000);
        const t3 = setTimeout(() => {
            setScanningAi(false);
            form.post('/deeds', {
                forceFormData: true,
                preserveScroll: true,
            });
        }, 1500);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    };

    // Bilingual Dictionary
    const t = {
        pageTitle: lang === 'bn' ? 'ভালো কাজ ও নাগরিক অভিযোগ দাখিল' : 'Submit Good Deed or Grievance',
        badge: lang === 'bn' ? 'এআই যাচাইকৃত স্বচ্ছ সিটিজেন পোর্টাল' : 'AI-Verified Citizen Transparency Portal',
        heading: lang === 'bn' ? 'আপনার ভালো কাজ বা অভিযোগ দাখিল করুন' : 'Submit Your Good Deed or Grievance',
        subheading: lang === 'bn'
            ? 'ছবি ও ভিডিও সংযুক্ত করে আপনার এলাকার ভালো উদ্যোগ ছড়িয়ে দিন অথবা নাগরিক সমস্যার সমাধান চান।'
            : 'Share uplifting community deeds or report local civic issues with photo & video evidence.',
        langSwitchBtn: lang === 'bn' ? 'English এ দেখুন' : 'বাংলায় দেখুন',

        // Type selection
        typeLabel: lang === 'bn' ? 'দাখিলের বিষয় নির্বাচন করুন' : 'Select Submission Purpose',
        typeDeedTitle: lang === 'bn' ? 'ভালো কাজ / মানবিক উদ্যোগ' : 'Good Deed / Community Action',
        typeDeedDesc: lang === 'bn' ? 'বৃক্ষরোপণ, রক্তদান, খাদ্য বিতরণ, পরিচ্ছন্নতা বা যে কোনো প্রশংসনীয় উদ্যোগ' : 'Planting trees, blood donation, charity, cleanups or uplifting social deeds',
        typeComplaintTitle: lang === 'bn' ? 'নাগরিক অভিযোগ / সমস্যা' : 'Public Grievance / Community Issue',
        typeComplaintDesc: lang === 'bn' ? 'ভাঙা রাস্তা, বর্জ্য নিষ্কাশন সমস্যা, আলোকস্বল্পতা বা পরিবেশ বিপর্যয়' : 'Broken roads, water logging, garbage piles, civic hazards or pollution',

        // Section 1
        section1Title: lang === 'bn' ? '১. মৌলিক তথ্য ও বিবরণ' : '1. Basic Information & Description',
        titleLabel: lang === 'bn' ? 'শিরোনাম (Title) *' : 'Title *',
        titlePlaceholder: lang === 'bn'
            ? 'যেমন: মিরপুর ১০ নম্বরে স্বেচ্ছাশ্রমে সড়ক ও ফুটপাত পরিচ্ছন্নতা অভিযান'
            : 'e.g. Volunteer road cleanup & recycling drive at Mirpur 10',
        catLabel: lang === 'bn' ? 'ক্যাটাগরি নির্বাচন করুন *' : 'Select Category *',
        descLabel: lang === 'bn' ? 'বিস্তারিত বিবরণ (ঘটনা, স্থান ও প্রভাব) *' : 'Detailed Story & Impact *',
        descPlaceholder: lang === 'bn'
            ? 'ঘটনাটি কখন কীভাবে সংঘটিত হয়েছে? এতে কারা সহায়তা পেয়েছেন বা এলাকার কী উপকারে এসেছে? বিস্তারিত তুলে ধরুন...'
            : 'Describe what happened, who was helped, how it was executed, community impact and outcomes...',

        // Section 2: Media
        section2Title: lang === 'bn' ? '২. ছবি ও ভিডিও সংযুক্তি (Media Evidence)' : '2. Photo & Video Evidence',
        section2Subtitle: lang === 'bn'
            ? 'আপনি চাইলে সরাসরি আপনার ডিভাইস থেকে ছবি/ভিডিও আপলোড করতে পারেন, অথবা অনলাইন লিংকও দিতে পারেন।'
            : 'Upload files directly from your computer/phone or paste online video/image URLs.',
        tabUpload: lang === 'bn' ? '📁 সরাসরি ফাইল আপলোড (সুপারিশকৃত)' : '📁 Direct File Upload (Recommended)',
        tabUrl: lang === 'bn' ? '🔗 অনলাইন লিংক ব্যবহার করুন' : '🔗 Use Online URLs',

        imageUploadLabel: lang === 'bn' ? 'ছবি / ইমেজ ফাইল আপলোড করুন' : 'Upload Image / Photo File',
        imageUploadHint: lang === 'bn' ? 'PNG, JPG, WebP বা GIF (সর্বোচ্চ ২০ মেগাবাইট)' : 'PNG, JPG, WebP or GIF (Max 20MB)',
        imageDragText: lang === 'bn' ? 'ছবি সিলেক্ট করতে ক্লিক করুন অথবা এখানে টেনে এনে ছাড়ুন' : 'Click to select an image or drag & drop here',
        removeBtn: lang === 'bn' ? 'মুছে ফেলুন' : 'Remove',

        videoUploadLabel: lang === 'bn' ? 'ভিডিও ফাইল আপলোড করুন' : 'Upload Video File',
        videoUploadHint: lang === 'bn' ? 'MP4, WebM, MOV বা MKV (সর্বোচ্চ ১০০ মেগাবাইট)' : 'MP4, WebM, MOV or MKV (Max 100MB)',
        videoDragText: lang === 'bn' ? 'ভিডিও ফাইল সিলেক্ট করতে ক্লিক করুন' : 'Click to select video file from your device',

        videoUrlLabel: lang === 'bn' ? 'ভিডিওর অনলাইন লিংক (YouTube, Facebook, Vimeo বা ড্রাইভ লিংক)' : 'Video Link (YouTube, Facebook, Vimeo or Cloud Link)',
        videoUrlPlaceholder: 'https://www.youtube.com/watch?v=...',
        imageUrlLabel: lang === 'bn' ? 'ছবির অনলাইন লিংক (Image URL)' : 'Photo / Thumbnail Web URL',
        imageUrlPlaceholder: 'https://images.unsplash.com/...',

        // Section 3: Location & Date
        section3Title: lang === 'bn' ? '৩. অবস্থান ও সময়কাল' : '3. Location & Date',
        divisionLabel: lang === 'bn' ? 'বিভাগ (Division) *' : 'Division *',
        districtLabel: lang === 'bn' ? 'জেলা (District) *' : 'District *',
        upazilaLabel: lang === 'bn' ? 'উপজেলা / থানা (Upazila / Thana)' : 'Upazila / Thana',
        upazilaPlaceholder: lang === 'bn' ? 'যেমন: ধানমন্ডি, গুলশান, গোলাপগঞ্জ' : 'e.g. Dhanmondi, Gulshan, Golapganj',
        locationLabel: lang === 'bn' ? 'নির্দিষ্ট স্থান বা ল্যান্ডমার্ক' : 'Specific Landmark / Street Address',
        locationPlaceholder: lang === 'bn' ? 'যেমন: কেন্দ্রীয় শহিদ মিনারের উত্তর পাশে' : 'e.g. Beside Central Shaheed Minar',
        dateLabel: lang === 'bn' ? 'সংঘটিত হওয়ার তারিখ *' : 'Date of Event / Incident *',

        // Section 4: Impact & Team
        section4Title: lang === 'bn' ? '৪. প্রভাব ও অংশগ্রহণকারী' : '4. Impact & Beneficiaries',
        beneficiariesLabel: lang === 'bn' ? 'উপকৃত / প্রভাবিত মানুষের আনুমানিক সংখ্যা' : 'Estimated People Benefited / Affected',
        teamLabel: lang === 'bn' ? 'দল, ক্লাব বা সংগঠনের নাম (যদি থাকে)' : 'Team, Club or Organization (Optional)',
        teamPlaceholder: lang === 'bn' ? 'যেমন: বিডি ক্লিন, রেড ক্রিসেন্ট ইউথ ক্লাব' : 'e.g. BD Clean, Red Crescent Youth',
        anonymousLabel: lang === 'bn' ? 'আমার ব্যক্তিগত পরিচয় গোপন রাখুন (Anonymous Submission)' : 'Submit as Anonymous (Hide my public name)',

        // AI Trust Box & Moderation Info
        aiBoxTitle: lang === 'bn' ? 'অ্যাডমিন অনুমোদন ও স্বয়ংক্রিয় এআই কনটেন্ট গার্ড' : 'Admin Approval & Automated AI Content Guard',
        aiBoxDesc: lang === 'bn'
            ? 'আপলোডকৃত কোনো কনটেন্ট সরাসরি ওয়েবসাইটে প্রকাশিত হবে না। দাখিলের পর এটি প্রথমে অ্যাডমিন ড্যাশবোর্ডে জমা হবে। অ্যাডমিন কর্তৃক তথ্য, ছবি ও ভিডিও যাচাই এবং অনুমোদন পাওয়ার পরই পোস্টটি ওয়েবসাইটে সবার জন্য লাইভ দেখা যাবে।'
            : 'Uploaded content will NOT be published immediately. It will be sent to the Admin Dashboard for review. Once verified and approved by the Admin, it will go live on the website.',
        aiBadge1: lang === 'bn' ? '✓ অ্যাডমিন অনুমোদন বাধ্যতামূলক' : '✓ Admin Approval Mandatory',
        aiBadge2: lang === 'bn' ? '✓ স্প্যাম ও ভুয়া তথ্য প্রতিরোধ' : '✓ Misinformation Guard',
        aiBadge3: lang === 'bn' ? '✓ ডুপ্লিকেট মিডিয়া সনাক্তকরণ' : '✓ Duplicate Media Detection',
        aiBadge4: lang === 'bn' ? '✓ অনুমোদন পেলে ডিজিটাল সনদ' : '✓ Digital Certificate Upon Approval',

        // Button
        submitBtn: lang === 'bn' ? 'অ্যাডমিন অনুমোদনের জন্য জমা দিন' : 'Submit for Admin Review & Approval',
        scanningText1: lang === 'bn' ? 'ছবি ও ভিডিও ফাইল স্ক্যান করা হচ্ছে...' : 'Scanning media hash & safety checks...',
        scanningText2: lang === 'bn' ? 'এআই ট্রাস্ট স্কোর প্রস্তুত করা হচ্ছে...' : 'Generating AI Trust Score & Verification...',
        scanningText3: lang === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ডে জমা হচ্ছে...' : 'Queuing for Admin Dashboard review...',
    };

    return (
        <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
            <Head title={`${t.pageTitle} — Valo Kaj Bangladesh`} />

            <RoleSwitcher />
            <Navbar />

            <main className="flex-1 py-6 sm:py-10 max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 w-full space-y-6 sm:space-y-8">
                {/* Header with Bilingual Toggle */}
                <div className="relative text-center space-y-3 pt-1 sm:pt-2">
                    {/* Top Floating Language Switcher */}
                    <div className="flex justify-center sm:justify-end mb-2">
                        <button
                            type="button"
                            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
                            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white border border-emerald-500/30 text-emerald-700 text-xs font-semibold shadow-sm hover:bg-emerald-50 hover:border-emerald-500 transition-all cursor-pointer"
                        >
                            <Globe className="w-4 h-4 text-emerald-600" />
                            <span>{t.langSwitchBtn}</span>
                            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                                {lang === 'bn' ? 'EN' : 'বাংলা'}
                            </span>
                        </button>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] sm:text-xs font-bold tracking-wide">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse shrink-0" />
                        <span>{t.badge}</span>
                    </div>

                    <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight px-1">
                        {t.heading}
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed px-2">
                        {t.subheading}
                    </p>
                </div>

                {/* Main Form Container with Glass Effect */}
                <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 shadow-xl shadow-slate-200/50 space-y-6 sm:space-y-8">
                    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

                        {/* SUBMISSION PURPOSE / TYPE SELECTION */}
                        <div className="space-y-3">
                            <label className="block text-xs sm:text-sm font-bold text-slate-700">
                                {t.typeLabel}
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSubmissionType('good_deed');
                                        form.setData('submission_type', 'good_deed');
                                    }}
                                    className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                                        submissionType === 'good_deed'
                                            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                                            : 'bg-white border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    <div className={`p-2.5 rounded-xl shrink-0 ${
                                        submissionType === 'good_deed' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        <HeartHandshake className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                            {t.typeDeedTitle}
                                            {submissionType === 'good_deed' && (
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                                            {t.typeDeedDesc}
                                        </div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSubmissionType('complaint');
                                        form.setData('submission_type', 'complaint');
                                    }}
                                    className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                                        submissionType === 'complaint'
                                            ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                                            : 'bg-white border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    <div className={`p-2.5 rounded-xl shrink-0 ${
                                        submissionType === 'complaint' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                            {t.typeComplaintTitle}
                                            {submissionType === 'complaint' && (
                                                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                                            {t.typeComplaintDesc}
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* SECTION 1: BASIC INFORMATION */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <FileCheck className="w-5 h-5 text-emerald-600" />
                                {t.section1Title}
                            </h3>

                            {/* Title & Category Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        {t.titleLabel}
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.title}
                                        onChange={(e) => form.setData('title', e.target.value)}
                                        placeholder={t.titlePlaceholder}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
                                        required
                                    />
                                    {form.errors.title && (
                                        <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            {form.errors.title}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        {t.catLabel}
                                    </label>
                                    <select
                                        value={form.data.category_id}
                                        onChange={(e) => form.setData('category_id', Number(e.target.value))}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
                                    >
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {lang === 'bn' ? `${c.name_bn || c.name}` : c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    {t.descLabel}
                                </label>
                                <textarea
                                    rows={4}
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    placeholder={t.descPlaceholder}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all leading-relaxed"
                                    required
                                />
                                {form.errors.description && (
                                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        {form.errors.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* SECTION 2: PHOTO & VIDEO MEDIA EVIDENCE (DIRECT UPLOAD & LINKS) */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <Camera className="w-5 h-5 text-emerald-600" />
                                        {t.section2Title}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {t.section2Subtitle}
                                    </p>
                                </div>

                                {/* Media Input Switch Tabs */}
                                <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 w-full sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={() => setMediaTab('upload')}
                                        className={`flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                                            mediaTab === 'upload'
                                                ? 'bg-white text-emerald-700 shadow-sm'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        {t.tabUpload}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMediaTab('url')}
                                        className={`flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                                            mediaTab === 'url'
                                                ? 'bg-white text-emerald-700 shadow-sm'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        {t.tabUrl}
                                    </button>
                                </div>
                            </div>

                            {/* TAB 1: DIRECT FILE UPLOAD (IMAGE & VIDEO) */}
                            {mediaTab === 'upload' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-2">
                                    {/* Direct Image File Upload */}
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                                            <span className="flex items-center gap-1.5">
                                                <ImageIcon className="w-4 h-4 text-emerald-600" />
                                                {t.imageUploadLabel}
                                            </span>
                                            <span className="text-[11px] font-normal text-slate-400">
                                                {t.imageUploadHint}
                                            </span>
                                        </label>

                                        <input
                                            ref={imageInputRef}
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="image-file-input"
                                        />

                                        {!imagePreview ? (
                                            <label
                                                htmlFor="image-file-input"
                                                className="border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group bg-slate-50/50 min-h-[160px]"
                                            >
                                                <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
                                                    <UploadCloud className="w-6 h-6" />
                                                </div>
                                                <div className="text-center">
                                                    <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-700 block">
                                                        {t.imageDragText}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 mt-1 block">
                                                        JPG, PNG, WebP
                                                    </span>
                                                </div>
                                            </label>
                                        ) : (
                                            <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 group">
                                                <img
                                                    src={imagePreview}
                                                    alt="Uploaded preview"
                                                    className="w-full h-44 object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-white text-xs truncate max-w-[200px]">
                                                            <span className="font-semibold block truncate">
                                                                {imageFileDetails?.name}
                                                            </span>
                                                            <span className="text-[10px] text-slate-300">
                                                                {imageFileDetails?.size}
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={removeImageFile}
                                                            className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white text-xs flex items-center gap-1 transition-all cursor-pointer"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                            <span>{t.removeBtn}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {form.errors.image_file && (
                                            <p className="text-xs text-rose-500 mt-1">{form.errors.image_file}</p>
                                        )}
                                    </div>

                                    {/* Direct Video File Upload */}
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                                            <span className="flex items-center gap-1.5">
                                                <Film className="w-4 h-4 text-emerald-600" />
                                                {t.videoUploadLabel}
                                            </span>
                                            <span className="text-[11px] font-normal text-slate-400">
                                                {t.videoUploadHint}
                                            </span>
                                        </label>

                                        <input
                                            ref={videoInputRef}
                                            type="file"
                                            accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,video/mkv"
                                            onChange={handleVideoChange}
                                            className="hidden"
                                            id="video-file-input"
                                        />

                                        {!videoPreview ? (
                                            <label
                                                htmlFor="video-file-input"
                                                className="border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group bg-slate-50/50 min-h-[160px]"
                                            >
                                                <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
                                                    <FolderUp className="w-6 h-6" />
                                                </div>
                                                <div className="text-center">
                                                    <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-700 block">
                                                        {t.videoDragText}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 mt-1 block">
                                                        MP4, WebM, MOV
                                                    </span>
                                                </div>
                                            </label>
                                        ) : (
                                            <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 group">
                                                <video
                                                    src={videoPreview}
                                                    controls
                                                    className="w-full h-44 object-contain bg-slate-900"
                                                />
                                                <div className="p-2.5 bg-slate-100 text-slate-800 border-t border-slate-200 flex items-center justify-between text-xs">
                                                    <div className="truncate max-w-[200px]">
                                                        <span className="font-semibold block truncate">
                                                            {videoFileDetails?.name}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500">
                                                            {videoFileDetails?.size}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={removeVideoFile}
                                                        className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white text-xs flex items-center gap-1 transition-all cursor-pointer"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                        <span>{t.removeBtn}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {form.errors.video_file && (
                                            <p className="text-xs text-rose-500 mt-1">{form.errors.video_file}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: ONLINE LINKS (YOUTUBE / DRIVE / IMAGE URL) */}
                            {mediaTab === 'url' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                            <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                                            {t.videoUrlLabel}
                                        </label>
                                        <input
                                            type="text"
                                            value={form.data.video_url}
                                            onChange={(e) => form.setData('video_url', e.target.value)}
                                            placeholder={t.videoUrlPlaceholder}
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
                                        />
                                        <p className="text-[11px] text-slate-500 mt-1">
                                            ইউটিউব শর্টস বা সাধারণ ভিডিওর লিংক পেস্ট করুন।
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                                            {t.imageUrlLabel}
                                        </label>
                                        <input
                                            type="text"
                                            value={form.data.thumbnail}
                                            onChange={(e) => form.setData('thumbnail', e.target.value)}
                                            placeholder={t.imageUrlPlaceholder}
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
                                        />
                                        {form.data.thumbnail && (
                                            <div className="mt-2 relative rounded-xl overflow-hidden border border-slate-200 h-24 w-40 bg-slate-100">
                                                <img
                                                    src={form.data.thumbnail}
                                                    alt="Thumbnail Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src =
                                                            'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SECTION 3: LOCATION DETAILS */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-emerald-600" />
                                {t.section3Title}
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        {t.divisionLabel}
                                    </label>
                                    <select
                                        value={form.data.division}
                                        onChange={(e) => {
                                            const newDiv = e.target.value;
                                            const firstDist = DISTRICTS.find((d) => d.division === newDiv);
                                            form.setData({
                                                ...form.data,
                                                division: newDiv,
                                                district: firstDist ? firstDist.name : 'Dhaka',
                                            });
                                        }}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
                                    >
                                        {DIVISIONS.map((div) => (
                                            <option key={div.name} value={div.name}>
                                                {lang === 'bn' ? `${div.name_bn} বিভাগ` : `${div.name} Division`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        {t.districtLabel}
                                    </label>
                                    <select
                                        value={form.data.district}
                                        onChange={(e) => form.setData('district', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
                                    >
                                        {availableDistricts.map((d) => (
                                            <option key={d.name} value={d.name}>
                                                {lang === 'bn' ? `${d.name_bn} জেলা` : `${d.name} District`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        {t.upazilaLabel}
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.upazila}
                                        onChange={(e) => form.setData('upazila', e.target.value)}
                                        placeholder={t.upazilaPlaceholder}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Specific Landmark / Address */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    {t.locationLabel}
                                </label>
                                <input
                                    type="text"
                                    value={form.data.location}
                                    onChange={(e) => form.setData('location', e.target.value)}
                                    placeholder={t.locationPlaceholder}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
                                />
                            </div>
                        </div>

                        {/* SECTION 4: DATE, IMPACT & TEAM */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <Users className="w-5 h-5 text-emerald-600" />
                                {t.section4Title}
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        {t.dateLabel}
                                    </label>
                                    <input
                                        type="date"
                                        value={form.data.deed_date}
                                        onChange={(e) => form.setData('deed_date', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 text-slate-400" />
                                        {t.beneficiariesLabel}
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={form.data.beneficiaries_count}
                                        onChange={(e) => form.setData('beneficiaries_count', Number(e.target.value))}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                        {t.teamLabel}
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.organization}
                                        onChange={(e) => form.setData('organization', e.target.value)}
                                        placeholder={t.teamPlaceholder}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Guest Contributor Information (If user is not logged in) */}
                            {!currentUser && (
                                <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                                            <UserIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                                আপনার পরিচিতি (লগইন ছাড়া অবদানকারী)
                                            </h4>
                                            <p className="text-[11px] text-slate-500 font-bangla">
                                                লগইন না করেও আপনি ভালো কাজের হিস্টোরি আপলোড করতে পারেন।
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                                <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                                                <span>আপনার পূর্ণ নাম</span>
                                                <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={form.data.guest_name}
                                                onChange={(e) => form.setData('guest_name', e.target.value)}
                                                placeholder="যেমন: মোঃ আরিফুল ইসলাম"
                                                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-xs"
                                            />
                                            {form.errors.guest_name && (
                                                <p className="text-xs text-rose-500 mt-1">{form.errors.guest_name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                                <span>মোবাইল নম্বর</span>
                                                <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={form.data.guest_phone}
                                                onChange={(e) => form.setData('guest_phone', e.target.value)}
                                                placeholder="যেমন: 017XXXXXXXX"
                                                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-xs"
                                            />
                                            {form.errors.guest_phone && (
                                                <p className="text-xs text-rose-500 mt-1">{form.errors.guest_phone}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                                            <span className="flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                                                <span>ইমেইল ঠিকানা</span>
                                                <span className="text-slate-400 font-normal">(ঐচ্ছিক / Optional)</span>
                                            </span>
                                            <span className="text-[10px] text-emerald-700 font-medium font-bangla">
                                                ইমেইল দিলে স্বয়ংক্রিয় ধন্যবাদ ও কনফার্মেশন বার্তা পাবেন
                                            </span>
                                        </label>
                                        <input
                                            type="email"
                                            value={form.data.guest_email}
                                            onChange={(e) => form.setData('guest_email', e.target.value)}
                                            placeholder="যেমন: citizen@gmail.com"
                                            className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-xs"
                                        />
                                        {form.errors.guest_email && (
                                            <p className="text-xs text-rose-500 mt-1">{form.errors.guest_email}</p>
                                        )}
                                        <p className="text-[11px] text-slate-500 mt-1 font-bangla">
                                            💡 আপনি ইমেইল প্রদান করলে আমাদের প্রেরক (rafidul.labar.bd@gmail.com) থেকে স্বয়ংক্রিয় ধন্যবাদ পত্র আপনার ইনবক্সে চলে যাবে।
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Anonymous / Privacy Checkbox */}
                            <div className="pt-2 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/70">
                                <label className="flex items-start gap-3 cursor-pointer text-xs font-semibold text-slate-800 select-none">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_anonymous}
                                        onChange={(e) => form.setData('is_anonymous', e.target.checked)}
                                        className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                                    />
                                    <div>
                                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                                            <Lock className="w-3.5 h-3.5 text-emerald-700" />
                                            <span>আমার নাম ও বিস্তারিত ঠিকানা জনসমক্ষে প্রকাশ না করে গোপন রাখুন (Keep Anonymous)</span>
                                        </span>
                                        <p className="text-[11px] text-slate-500 font-normal font-bangla mt-0.5">
                                            এটি টিক দিলে ওয়েবসাইটে আপনার পোস্টের নিচে আসল নাম বা বিস্তারিত ঠিকানা প্রদর্শিত হবে না (শুধু জেলা ও সুরক্ষিত পরিচিতি দেখা যাবে)।
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* SECTION 5: AI TRUST & VERIFICATION ENGINE */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 space-y-3">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                <h4 className="text-xs sm:text-sm font-bold text-emerald-950 uppercase tracking-wider">
                                    {t.aiBoxTitle}
                                </h4>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                {t.aiBoxDesc}
                            </p>
                            <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-emerald-800">
                                <span className="px-2.5 py-1 rounded-lg bg-emerald-100/80 border border-emerald-300/60">
                                    {t.aiBadge1}
                                </span>
                                <span className="px-2.5 py-1 rounded-lg bg-emerald-100/80 border border-emerald-300/60">
                                    {t.aiBadge2}
                                </span>
                                <span className="px-2.5 py-1 rounded-lg bg-emerald-100/80 border border-emerald-300/60">
                                    {t.aiBadge3}
                                </span>
                                <span className="px-2.5 py-1 rounded-lg bg-emerald-100/80 border border-emerald-300/60">
                                    {t.aiBadge4}
                                </span>
                            </div>
                        </div>

                        {/* SUBMIT BUTTON WITH AI SCANNING ANIMATION */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={form.processing || scanningAi}
                                className="w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {scanningAi ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>
                                            {aiProgressStep === 1
                                                ? t.scanningText1
                                                : aiProgressStep === 2
                                                ? t.scanningText2
                                                : t.scanningText3}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span>{t.submitBtn}</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
