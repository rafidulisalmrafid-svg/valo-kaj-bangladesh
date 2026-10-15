import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { GoodDeed, User } from '../types';
import { RoleSwitcher } from '../Components/RoleSwitcher';
import { Navbar } from '../Components/Navbar';
import { Footer } from '../Components/Footer';
import { BangladeshMap } from '../Components/BangladeshMap';
import { DeedCard } from '../Components/DeedCard';
import { DeedModal } from '../Components/DeedModal';
import { MapPin, Sparkles, PlusCircle } from 'lucide-react';

interface MapPageProps {
    initialDistrict: string;
    districtDeeds: GoodDeed[];
    districtHeroes: User[];
}

export default function Map({ initialDistrict, districtDeeds, districtHeroes }: MapPageProps) {
    const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
    const [selectedDeed, setSelectedDeed] = useState<GoodDeed | null>(null);

    return (
        <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
            <Head title={`Interactive Bangladesh Map — ${selectedDistrict} District — Valo Kaj Bangladesh`} />

            <RoleSwitcher />
            <Navbar />

            <main className="flex-1 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8 sm:space-y-10">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        Geographic Impact Explorer
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                        Bangladesh 64 Districts Impact Map · মানচিত্র
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 font-bangla max-w-xl mx-auto">
                        যেকোনো জেলা নির্বাচন করে সেই জেলার মোট আপলোড, যাচাইকৃত ভালো কাজ ও স্থানীয় হিরোদের বিবরণ জানুন।
                    </p>
                </div>

                {/* Bangladesh Interactive Map */}
                <BangladeshMap
                    currentSelected={selectedDistrict}
                    onSelectDistrict={(dist) => setSelectedDistrict(dist)}
                />

                {/* Verified Deeds from Selected District */}
                <div className="space-y-6 pt-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                            <span>Verified Deeds from {selectedDistrict}</span>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                {districtDeeds.length} deeds
                            </span>
                        </h3>

                        <Link
                            href={`/deeds/create`}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Add Deed in {selectedDistrict}</span>
                        </Link>
                    </div>

                    {districtDeeds.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {districtDeeds.map((deed) => (
                                <DeedCard
                                    key={deed.id}
                                    deed={deed}
                                    onOpenModal={(d) => setSelectedDeed(d)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center text-slate-500 text-xs shadow-sm">
                            No verified deeds recorded yet in {selectedDistrict}. Be the first to upload!
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            <DeedModal deed={selectedDeed} onClose={() => setSelectedDeed(null)} />
        </div>
    );
}
