import React, { useState } from 'react';
import { DISTRICTS, DIVISIONS, DistrictData } from '../data/bangladeshGeodata';
import { MapPin, Users, HeartHandshake, Award, Sparkles, Search, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface BangladeshMapProps {
    onSelectDistrict?: (districtName: string) => void;
    currentSelected?: string;
}

export const BangladeshMap: React.FC<BangladeshMapProps> = ({ onSelectDistrict, currentSelected = 'Sylhet' }) => {
    const [selectedDistrictName, setSelectedDistrictName] = useState<string>(currentSelected);
    const [selectedDivision, setSelectedDivision] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const currentDistrict = DISTRICTS.find((d) => d.name === selectedDistrictName) || DISTRICTS[0];

    const filteredDistricts = DISTRICTS.filter((d) => {
        const matchesDivision = selectedDivision === 'All' || d.division === selectedDivision;
        const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.name_bn.includes(searchQuery);
        return matchesDivision && matchesSearch;
    });

    const handleDistrictClick = (name: string) => {
        setSelectedDistrictName(name);
        if (onSelectDistrict) {
            onSelectDistrict(name);
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
                {/* Left: Division filters & interactive map visualization */}
                <div className="lg:col-span-7 space-y-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            <span>ইন্টারেক্টিভ মানচিত্র • Interactive Impact Map</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                            Explore Good Deeds across all 64 Districts
                        </h3>
                        <p className="text-sm text-slate-600 mt-1 font-bengali">
                            বাংলাদেশের প্রতিটি জেলায় মানবকল্যাণ ও ভালো কাজের চিত্র এক নজরে দেখুন।
                        </p>
                    </div>

                    {/* Division Pills */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        <button
                            type="button"
                            onClick={() => setSelectedDivision('All')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                selectedDivision === 'All'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            All 8 Divisions
                        </button>
                        {DIVISIONS.map((div) => (
                            <button
                                key={div.name}
                                type="button"
                                onClick={() => setSelectedDivision(div.name)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                    selectedDivision === div.name
                                        ? 'bg-emerald-600 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                <span>{div.name}</span>
                                <span className="opacity-75 font-bengali ml-1 text-[10px]">({div.name_bn})</span>
                            </button>
                        ))}
                    </div>

                    {/* Stylized Bangladesh Map View with Regional Hotspots */}
                    <div className="relative aspect-[4/3] w-full rounded-2xl bg-emerald-50/40 border border-slate-200 p-4 sm:p-6 overflow-hidden flex flex-col justify-between">
                        {/* Map Outline SVG Art */}
                        <svg
                            viewBox="0 0 500 600"
                            className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(16,185,129,0.1)]"
                        >
                            {/* SVG Bangladesh simplified territory polygon */}
                            <path
                                d="M 170 50 L 250 45 L 310 90 L 320 150 L 410 160 L 440 220 L 410 280 L 450 350 L 460 480 L 410 540 L 370 470 L 310 470 L 270 490 L 220 480 L 150 440 L 140 370 L 100 320 L 80 230 L 120 180 L 160 110 Z"
                                fill="#d1fae5"
                                stroke="#10b981"
                                strokeWidth="2.5"
                                strokeDasharray="6 3"
                                className="opacity-70"
                            />

                            {/* Regional Division Clusters */}
                            <circle cx="160" cy="110" r="45" fill="#a7f3d0" opacity="0.45" />
                            <circle cx="130" cy="220" r="50" fill="#a7f3d0" opacity="0.45" />
                            <circle cx="380" cy="170" r="55" fill="#a7f3d0" opacity="0.5" />
                            <circle cx="260" cy="150" r="40" fill="#a7f3d0" opacity="0.45" />
                            <circle cx="250" cy="280" r="60" fill="#34d399" opacity="0.4" />
                            <circle cx="160" cy="400" r="55" fill="#a7f3d0" opacity="0.45" />
                            <circle cx="260" cy="430" r="45" fill="#a7f3d0" opacity="0.45" />
                            <circle cx="390" cy="380" r="70" fill="#a7f3d0" opacity="0.5" />

                            {/* Clickable District Nodes */}
                            {DISTRICTS.map((d) => {
                                const x = ((d.lng - 88.0) / 4.8) * 400 + 40;
                                const y = 580 - ((d.lat - 20.6) / 6.2) * 520;
                                const isSelected = d.name === selectedDistrictName;

                                return (
                                    <g
                                        key={d.name}
                                        onClick={() => handleDistrictClick(d.name)}
                                        className="cursor-pointer transition-all duration-300 group"
                                    >
                                        {/* Ripple for selected */}
                                        {isSelected && (
                                            <circle
                                                cx={x}
                                                cy={y}
                                                r="16"
                                                fill="none"
                                                stroke="#059669"
                                                strokeWidth="2"
                                                className="animate-ping opacity-75 origin-center"
                                            />
                                        )}
                                        {/* Outer circle */}
                                        <circle
                                            cx={x}
                                            cy={y}
                                            r={isSelected ? 9 : 5}
                                            fill={isSelected ? '#059669' : '#10b981'}
                                            className="transition-all duration-200 group-hover:scale-150 group-hover:fill-emerald-700"
                                        />
                                        {/* Pin core */}
                                        <circle
                                            cx={x}
                                            cy={y}
                                            r={isSelected ? 4 : 2}
                                            fill="#ffffff"
                                        />
                                        {/* District text tag on hover/selected */}
                                        {(isSelected || ['Sylhet', 'Dhaka', 'Chattogram', 'Rangpur'].includes(d.name)) && (
                                            <text
                                                x={x}
                                                y={y - 12}
                                                textAnchor="middle"
                                                className={`text-[10px] font-bold ${
                                                    isSelected ? 'fill-emerald-900' : 'fill-slate-700'
                                                }`}
                                            >
                                                {d.name}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}
                        </svg>

                        <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200 pt-2 bg-white/80 px-2 py-1 rounded-lg backdrop-blur-xs">
                            <span>💡 মানচিত্রে যেকোনো জেলার পিন ক্লিক করে তথ্য দেখুন</span>
                            <span className="font-semibold text-emerald-700">Selected: {selectedDistrictName}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Selected District Inspector Card */}
                <div className="lg:col-span-5 space-y-4">
                    {/* District Search Input */}
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search any of 64 districts..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-xs"
                        />
                    </div>

                    {/* Selected District Profile */}
                    <div className="p-6 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {currentDistrict.division} Division
                                </span>
                                <h4 className="text-2xl font-black text-slate-900 mt-1">
                                    {currentDistrict.name}{' '}
                                    <span className="text-emerald-700 font-bengali">({currentDistrict.name_bn})</span>
                                </h4>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                64 Districts
                            </span>
                        </div>

                        {/* District Metrics Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                <span className="text-[11px] text-slate-600 flex items-center gap-1.5 font-medium">
                                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                                    Verified Deeds
                                </span>
                                <p className="text-xl font-black text-slate-900 mt-1">
                                    {currentDistrict.deeds.toLocaleString()}
                                </p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                <span className="text-[11px] text-slate-600 flex items-center gap-1.5 font-medium">
                                    <Users className="w-3.5 h-3.5 text-teal-600" />
                                    Active Heroes
                                </span>
                                <p className="text-xl font-black text-slate-900 mt-1">
                                    {currentDistrict.heroes.toLocaleString()}
                                </p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                <span className="text-[11px] text-slate-600 flex items-center gap-1.5 font-medium">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                    Impact Score
                                </span>
                                <p className="text-xl font-black text-emerald-700 mt-1">
                                    {currentDistrict.impact.toLocaleString()}
                                </p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                <span className="text-[11px] text-slate-600 flex items-center gap-1.5 font-medium">
                                    <Award className="w-3.5 h-3.5 text-yellow-600" />
                                    Top Hero
                                </span>
                                <p className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                                    {currentDistrict.topHero}
                                </p>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-2 flex flex-col gap-2">
                            <Link
                                href={`/explore?district=${currentDistrict.name}`}
                                className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition-all shadow-sm"
                            >
                                <span>View all good deeds from {currentDistrict.name}</span>
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href={`/deeds/create`}
                                className="w-full py-2.5 rounded-xl font-semibold text-xs bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center justify-center gap-2 transition-all"
                            >
                                <span>Upload deed in {currentDistrict.name}</span>
                            </Link>
                        </div>
                    </div>

                    {/* Quick District Picker list */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-h-52 overflow-y-auto space-y-1">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                            Districts in {selectedDivision === 'All' ? 'Bangladesh' : selectedDivision} ({filteredDistricts.length})
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                            {filteredDistricts.map((d) => (
                                <button
                                    key={d.name}
                                    type="button"
                                    onClick={() => handleDistrictClick(d.name)}
                                    className={`px-3 py-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between ${
                                        d.name === selectedDistrictName
                                            ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300'
                                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                                    }`}
                                >
                                    <span>{d.name}</span>
                                    <span className="text-[10px] text-slate-500 font-bengali">{d.name_bn}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
