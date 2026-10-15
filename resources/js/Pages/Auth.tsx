import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Navbar } from '../Components/Navbar';
import { Footer } from '../Components/Footer';
import { RoleSwitcher } from '../Components/RoleSwitcher';
import { DISTRICTS, DIVISIONS } from '../data/bangladeshGeodata';
import { Leaf, Mail, Lock, User as UserIcon, MapPin, Building2, ShieldCheck, ArrowRight } from 'lucide-react';

interface AuthPageProps {
    defaultTab?: 'signin' | 'register';
    errors: Record<string, string>;
}

export default function Auth({ defaultTab = 'signin', errors }: AuthPageProps) {
    const [tab, setTab] = useState<'signin' | 'register'>(defaultTab);

    // Sign in form
    const loginForm = useForm({
        login: '',
        password: '',
        remember: true,
    });

    // Register form
    const registerForm = useForm({
        name: '',
        email: '',
        mobile: '',
        password: '',
        gender: 'Male',
        date_of_birth: '2000-01-01',
        division: 'Sylhet',
        district: 'Sylhet',
        upazila: 'Sylhet Sadar',
        organization: '',
        bio: '',
    });

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginForm.post('/auth/login');
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        registerForm.post('/auth/register');
    };

    const availableDistricts = DISTRICTS.filter(
        (d) => d.division === registerForm.data.division
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
            <Head title="Sign in or Register — Valo Kaj Bangladesh" />

            <Navbar />

            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-xl mx-auto">
                    {/* Brand header */}
                    <Link href="/" className="mx-auto flex w-fit items-center gap-2 mb-6">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white shadow-md">
                            <Leaf className="h-5 w-5" />
                        </span>
                        <span className="text-xl font-bold tracking-tight text-slate-900">Valo Kaj Bangladesh</span>
                    </Link>

                    {/* Clean White Card */}
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm sm:p-8">
                        {/* Tab Switcher */}
                        <div className="grid w-full grid-cols-2 rounded-xl bg-slate-100 p-1 text-slate-600 text-sm font-medium">
                            <button
                                type="button"
                                onClick={() => setTab('register')}
                                className={`py-2 px-3 rounded-lg transition-all cursor-pointer ${
                                    tab === 'register'
                                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                                        : 'hover:text-slate-900'
                                }`}
                            >
                                Register <span className="font-bangla ml-1">· নিবন্ধন</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setTab('signin')}
                                className={`py-2 px-3 rounded-lg transition-all cursor-pointer ${
                                    tab === 'signin'
                                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                                        : 'hover:text-slate-900'
                                }`}
                            >
                                Sign in <span className="font-bangla ml-1">· লগইন</span>
                            </button>
                        </div>

                        {/* SIGN IN TAB */}
                        {tab === 'signin' && (
                            <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
                                    <p className="font-bangla mt-1 text-sm text-slate-500">
                                        আপনার একাউন্টে প্রবেশ করে ভালো কাজের প্রভাব দেখুন।
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">
                                        Email or Mobile · <span className="font-bangla normal-case">ইমেইল বা মোবাইল</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={loginForm.data.login}
                                        onChange={(e) => loginForm.setData('login', e.target.value)}
                                        placeholder="you@gmail.com বা 017XXXXXXXX"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        required
                                    />
                                    {loginForm.errors.login && (
                                        <p className="text-xs text-rose-500 mt-1">{loginForm.errors.login}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">
                                        Password · <span className="font-bangla normal-case">পাসওয়ার্ড</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={loginForm.data.password}
                                        onChange={(e) => loginForm.setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        required
                                    />
                                    {loginForm.errors.password && (
                                        <p className="text-xs text-rose-500 mt-1">{loginForm.errors.password}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loginForm.processing}
                                    className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 text-sm font-bold text-white shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    {loginForm.processing ? 'Signing in...' : 'Sign in · লগইন করুন'}
                                </button>
                            </form>
                        )}
                        {/* REGISTER TAB */}
                        {tab === 'register' && (
                            <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h2>
                                    <p className="font-bangla mt-1 text-sm text-slate-500">
                                        সম্পূর্ণ তথ্য দিয়ে নিবন্ধন করুন — আপনার ঠিকানা অনুযায়ী জেলা লিডারবোর্ডে যোগ হবেন।
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">
                                            Full Name · <span className="font-bangla normal-case">পূর্ণ নাম</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={registerForm.data.name}
                                            onChange={(e) => registerForm.setData('name', e.target.value)}
                                            placeholder="আব্দুল করিম / Abdul Karim"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
                                            required
                                        />
                                        {registerForm.errors.name && (
                                            <p className="text-xs text-rose-500 mt-1">{registerForm.errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">
                                            Mobile Number · <span className="font-bangla normal-case">মোবাইল</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={registerForm.data.mobile}
                                            onChange={(e) => registerForm.setData('mobile', e.target.value)}
                                            placeholder="01712345678"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">
                                            Email Address · <span className="font-bangla normal-case">ইমেইল</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={registerForm.data.email}
                                            onChange={(e) => registerForm.setData('email', e.target.value)}
                                            placeholder="citizen@gmail.com"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
                                            required
                                        />
                                        {registerForm.errors.email && (
                                            <p className="text-xs text-rose-500 mt-1">{registerForm.errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">
                                            Password · <span className="font-bangla normal-case">পাসওয়ার্ড</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={registerForm.data.password}
                                            onChange={(e) => registerForm.setData('password', e.target.value)}
                                            placeholder="কমপক্ষে ৬ অক্ষর (Min. 6 chars)"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
                                            required
                                        />
                                        {registerForm.errors.password && (
                                            <p className="text-xs text-rose-500 mt-1">{registerForm.errors.password}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">
                                            Division · <span className="font-bangla normal-case">বিভাগ</span>
                                        </label>
                                        <select
                                            value={registerForm.data.division}
                                            onChange={(e) => {
                                                const newDiv = e.target.value;
                                                const firstDist = DISTRICTS.find((d) => d.division === newDiv);
                                                registerForm.setData({
                                                    ...registerForm.data,
                                                    division: newDiv,
                                                    district: firstDist ? firstDist.name : 'Dhaka',
                                                });
                                            }}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                                        >
                                            {DIVISIONS.map((div) => (
                                                <option key={div.name} value={div.name}>
                                                    {div.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">
                                            District · <span className="font-bangla normal-case">জেলা</span>
                                        </label>
                                        <select
                                            value={registerForm.data.district}
                                            onChange={(e) => registerForm.setData('district', e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                                        >
                                            {availableDistricts.map((d) => (
                                                <option key={d.name} value={d.name}>
                                                    {d.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">
                                            Upazila / Thana · <span className="font-bangla normal-case">উপজেলা</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={registerForm.data.upazila}
                                            onChange={(e) => registerForm.setData('upazila', e.target.value)}
                                            placeholder="যেমন: সদর"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={registerForm.processing}
                                    className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3.5 text-sm font-bold text-white shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    {registerForm.processing ? 'Creating account...' : 'Create account · একাউন্ট তৈরি করুন'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
            <RoleSwitcher />
        </div>
    );
}
