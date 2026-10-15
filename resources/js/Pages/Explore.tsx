import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Category, GoodDeed } from '../types';
import { RoleSwitcher } from '../Components/RoleSwitcher';
import { Navbar } from '../Components/Navbar';
import { Footer } from '../Components/Footer';
import { DeedCard } from '../Components/DeedCard';
import { DeedModal } from '../Components/DeedModal';
import { DISTRICTS, DIVISIONS } from '../data/bangladeshGeodata';
import {
    Search,
    Flame,
    Clock,
    Sparkles,
    PlusCircle,
    X,
    MapPin,
    Film,
    Image as ImageIcon,
    BookOpen,
    LayoutGrid,
    CheckCircle2,
    SlidersHorizontal,
    ArrowRight,
    Building2,
    Layers,
    Award
} from 'lucide-react';

interface ExploreProps {
    deeds: {
        data: GoodDeed[];
        current_page: number;
        last_page: number;
        total: number;
        prev_page_url?: string;
        next_page_url?: string;
    };
    categories: Category[];
    divisionCounts?: Record<string, number>;
    filters: {
        search?: string;
        category?: string;
        district?: string;
        division?: string;
        sort?: string;
        type?: string;
    };
}

export default function Explore({ deeds, categories, divisionCounts = {}, filters }: ExploreProps) {
    const filtersObj = (Array.isArray(filters) || !filters) ? {} : filters;
    const [selectedDeed, setSelectedDeed] = useState<GoodDeed | null>(null);
    const [search, setSearch] = useState(typeof filtersObj.search === 'string' ? filtersObj.search : '');
    const [category, setCategory] = useState(typeof filtersObj.category === 'string' ? filtersObj.category : '');
    const [district, setDistrict] = useState(typeof filtersObj.district === 'string' ? filtersObj.district : '');
    const [division, setDivision] = useState(typeof filtersObj.division === 'string' && filtersObj.division ? filtersObj.division : 'all');
    const [sort, setSort] = useState(typeof filtersObj.sort === 'string' ? filtersObj.sort : 'recent');
    const [type, setType] = useState(typeof filtersObj.type === 'string' ? filtersObj.type : 'all');

    // Divisions list with 'All Divisions' prepended
    const allDivisionsList = [
        { name: 'all', name_bn: 'সকল বিভাগ', count: deeds.total || 0, icon: Layers },
        ...DIVISIONS.map(d => ({
            name: d.name,
            name_bn: d.name_bn,
            count: divisionCounts[d.name] || d.deeds || 0,
            icon: Building2
        }))
    ];

    // Filter districts based on currently selected division
    const availableDistricts = division && division !== 'all'
        ? DISTRICTS.filter(d => d.division.toLowerCase() === division.toLowerCase())
        : [];

    const applyFilters = (newFilters: Record<string, any>) => {
        router.get('/explore', {
            search,
            category,
            district,
            division: division === 'all' ? '' : division,
            sort,
            type: type === 'all' ? '' : type,
            ...newFilters,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDivisionChange = (divName: string) => {
        setDivision(divName);
        setDistrict('');
        applyFilters({
            division: divName === 'all' ? '' : divName,
            district: '',
        });
    };

    const handleDistrictChange = (distName: string) => {
        setDistrict(distName);
        applyFilters({ district: distName });
    };

    const handleTypeChange = (newType: string) => {
        setType(newType);
        applyFilters({ type: newType === 'all' ? '' : newType });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const handleClearFilters = () => {
        setSearch('');
        setCategory('');
        setDistrict('');
        setDivision('all');
        setSort('recent');
        setType('all');
        router.get('/explore');
    };

    const hasActiveFilters = Boolean(
        search || category || district || (division && division !== 'all') || (type && type !== 'all') || (sort && sort !== 'recent')
    );

    // Active division object info
    const currentDivObj = DIVISIONS.find(d => d.name.toLowerCase() === division.toLowerCase());

    return (
        <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
            <Head title="ভালো কাজের প্রদর্শনী — View All Good Deeds & Stories — Valo Kaj Bangladesh" />

            <RoleSwitcher />
            <Navbar />

            <main className="flex-1 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
                {/* 1. Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            <span>সব ভালো কাজ · Good Deeds & Stories</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            View All · ভালো কাজের উন্মুক্ত প্রদর্শনী
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                            বাংলাদেশের ৮টি বিভাগ ও ৬৪ জেলার নাগরিকদের আপলোডকৃত ভালো কাজের গল্প, ইতিহাস, অনুপ্রেরণাদায়ী ভিডিও, ছবি ও সামাজিক উদ্যোগগুলো বিভাগভিত্তিক দেখুন।
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <Link
                            href="/deeds/create"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>আপনার ভালো কাজ দিন · Upload Deed</span>
                        </Link>
                    </div>
                </div>

                {/* 2. DIVISION-WISE SELECTOR BAR (বিভাগভিত্তিক নির্বাচন ব্যবস্থা) */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-emerald-600" />
                            <span>বিভাগ নির্বাচন করুন (Select Division)</span>
                        </h3>
                        {division !== 'all' && (
                            <button
                                type="button"
                                onClick={() => handleDivisionChange('all')}
                                className="text-xs text-emerald-700 hover:underline font-semibold cursor-pointer"
                            >
                                সকল বিভাগে ফিরে যান (View All)
                            </button>
                        )}
                    </div>

                    {/* Division Pills Scrollable Container */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
                        {allDivisionsList.map((divItem) => {
                            const isSelected = division.toLowerCase() === divItem.name.toLowerCase();
                            return (
                                <button
                                    key={divItem.name}
                                    type="button"
                                    onClick={() => handleDivisionChange(divItem.name)}
                                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 flex items-center gap-2 border ${
                                        isSelected
                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500/20'
                                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    <span>{divItem.name_bn}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                        isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {divItem.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 3. ACTIVE DIVISION SPOTLIGHT & FAST DISTRICT CHIPS */}
                {division !== 'all' && currentDivObj && (
                    <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200/90 shadow-sm space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h2 className="text-base sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-emerald-600" />
                                    <span>{currentDivObj.name_bn} বিভাগ ({currentDivObj.name} Division · All Deeds)</span>
                                </h2>
                                <p className="text-xs text-slate-600 mt-0.5">
                                    এই বিভাগের অধীনে আপলোড করা সকল মানবিক গল্প, ইতিহাস, ছবি ও ভিডিও নিচে প্রদর্শিত হচ্ছে।
                                </p>
                            </div>

                            <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                মোট জেলা: {currentDivObj.count} টি
                            </span>
                        </div>

                        {/* District Fast Filter Chips within Selected Division */}
                        {availableDistricts.length > 0 && (
                            <div className="pt-2 border-t border-emerald-200/60 flex flex-wrap items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-600 mr-1">জেলা নির্বাচন:</span>
                                <button
                                    type="button"
                                    onClick={() => handleDistrictChange('')}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                        !district
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    সকল জেলা
                                </button>
                                {availableDistricts.map((d) => (
                                    <button
                                        key={d.name}
                                        type="button"
                                        onClick={() => handleDistrictChange(d.name)}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                            district === d.name
                                                ? 'bg-emerald-600 text-white shadow-sm'
                                                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        {d.name_bn} ({d.name})
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 4. CONTENT TYPE TABS & SEARCH / SORT BAR */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
                    {/* Content Type Tabs: All, Videos, Photos, Stories */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                            {[
                                { key: 'all', label: 'সব কনটেন্ট (All)', icon: LayoutGrid },
                                { key: 'video', label: 'ভিডিও (Videos)', icon: Film },
                                { key: 'photo', label: 'ফটোস্টোরি ও ছবি (Photos)', icon: ImageIcon },
                            ].map((tab) => {
                                const Icon = tab.icon;
                                const isActive = type === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => handleTypeChange(tab.key)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="শিরোনাম বা স্থান দিয়ে খুঁজুন..."
                                className="w-full pl-9 pr-16 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
                            />
                            <button
                                type="submit"
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer"
                            >
                                খুঁজুন
                            </button>
                        </form>
                    </div>

                    {/* Secondary Filters: Category & Sorting */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        {/* Category Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-500">ক্যাটাগরি:</span>
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    applyFilters({ category: e.target.value });
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
                            >
                                <option value="">সকল ক্যাটাগরি (All Categories)</option>
                                {categories.map((c) => (
                                    <option key={c.slug} value={c.slug}>
                                        {c.name_bn || c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort Options */}
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                            <button
                                type="button"
                                onClick={() => {
                                    setSort('recent');
                                    applyFilters({ sort: 'recent' });
                                }}
                                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                    sort === 'recent'
                                        ? 'bg-white text-emerald-700 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <Clock className="w-3 h-3" />
                                <span>সর্বশেষ</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSort('trending');
                                    applyFilters({ sort: 'trending' });
                                }}
                                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                    sort === 'trending'
                                        ? 'bg-white text-emerald-700 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <Flame className="w-3 h-3" />
                                <span>জনপ্রিয়</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSort('impact');
                                    applyFilters({ sort: 'impact' });
                                }}
                                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                    sort === 'impact'
                                        ? 'bg-white text-emerald-700 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <Award className="w-3 h-3" />
                                <span>সর্বোচ্চ প্রভাব</span>
                            </button>
                        </div>
                    </div>

                    {/* Active filter tags & reset button */}
                    {hasActiveFilters && (
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-semibold text-slate-400">সক্রিয় ফিল্টার:</span>
                            {division && division !== 'all' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    বিভাগ: {currentDivObj?.name_bn || division}
                                    <button type="button" onClick={() => handleDivisionChange('all')} className="hover:text-rose-600 cursor-pointer">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {district && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    জেলা: {district}
                                    <button type="button" onClick={() => handleDistrictChange('')} className="hover:text-rose-600 cursor-pointer">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {category && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    ক্যাটাগরি: {category}
                                    <button type="button" onClick={() => { setCategory(''); applyFilters({ category: '' }); }} className="hover:text-rose-600 cursor-pointer">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {type && type !== 'all' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    ধরন: {type === 'video' ? 'ভিডিও' : 'ফটোস্টোরি'}
                                    <button type="button" onClick={() => handleTypeChange('all')} className="hover:text-rose-600 cursor-pointer">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="text-xs text-rose-600 hover:underline font-semibold ml-auto cursor-pointer"
                            >
                                সব ফিল্টার মুছুন (Reset All)
                            </button>
                        </div>
                    )}
                </div>

                {/* 5. CONTENT FEED / WALL GRID */}
                {deeds.data && deeds.data.length > 0 ? (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                            {deeds.data.map((deed) => (
                                <DeedCard
                                    key={deed.id}
                                    deed={deed}
                                    onOpenModal={(d) => setSelectedDeed(d)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {deeds.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-6">
                                {deeds.prev_page_url ? (
                                    <Link
                                        href={deeds.prev_page_url}
                                        className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm"
                                    >
                                        ← পূর্ববর্তী পাতা
                                    </Link>
                                ) : (
                                    <span className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 cursor-not-allowed">
                                        ← পূর্ববর্তী পাতা
                                    </span>
                                )}

                                <span className="px-3 py-1.5 text-xs text-slate-500 font-medium">
                                    পাতা {deeds.current_page} / {deeds.last_page}
                                </span>

                                {deeds.next_page_url ? (
                                    <Link
                                        href={deeds.next_page_url}
                                        className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm"
                                    >
                                        পরবর্তী পাতা →
                                    </Link>
                                ) : (
                                    <span className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 cursor-not-allowed">
                                        পরবর্তী পাতা →
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16 px-4 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
                        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                            <Layers className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">
                            {division !== 'all'
                                ? `${currentDivObj?.name_bn || division} বিভাগে এখনও কোনো কনটেন্ট পাওয়া যায়নি`
                                : 'কোনো কনটেন্ট পাওয়া যায়নি'}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                            আপনার এলাকায় ঘটে যাওয়া কোনো ভালো কাজ, মানবিক গল্প কিংবা নাগরিক সমস্যার কথা প্রথম আপলোড করে আপনার বিভাগের হিরো হয়ে উঠুন!
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/deeds/create"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span>নতুন কনটেন্ট বা ভালো কাজ দিন</span>
                            </Link>
                        </div>
                    </div>
                )}
            </main>

            <Footer />

            {/* Interactive Deed Modal */}
            {selectedDeed && (
                <DeedModal
                    deed={selectedDeed}
                    isOpen={!!selectedDeed}
                    onClose={() => setSelectedDeed(null)}
                />
            )}
        </div>
    );
}
