<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\GoodDeed;
use App\Models\User;
use Illuminate\Database\Seeder;

class AllDivisionsDeedSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::first() ?? User::create([
            'name' => 'Tanvir Ahmed',
            'email' => 'admin@valokaj.org',
            'password' => bcrypt('password123'),
            'role' => 'super_admin',
        ]);

        $categories = Category::all()->keyBy('slug');

        $deeds = [
            // 1. Rajshahi Division
            [
                'user_id' => $admin->id,
                'category_id' => $categories['education']->id ?? 1,
                'title' => 'পদ্মার চরে পথশিশুদের জন্য মুক্ত পাঠশালা ও শীতবস্ত্র বিতরণ',
                'description' => 'রাজশাহীর পদ্মার চরে সুবিধা বঞ্চিত ৭৫ জন পথশিশুকে মৌলিক বাংলা ও ইংরেজি শিক্ষা প্রদান এবং সবার মাঝে শীতবস্ত্র ও পুষ্টিকর খাবার বিতরণ করা হয়। স্থানীয় তরুণদের সহযোগিতায় এই পাঠশালা নিয়মিত পরিচালিত হচ্ছে।',
                'video_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                'thumbnail' => 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
                'photos' => ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80'],
                'division' => 'Rajshahi',
                'district' => 'Rajshahi',
                'upazila' => 'Boalia',
                'location' => 'পদ্মার পাড়, বোয়ালিয়া, রাজশাহী',
                'deed_date' => '2026-04-14',
                'beneficiaries_count' => 75,
                'team_name' => 'পদ্মা তরুণ দল',
                'organization' => 'রাজশাহী ইয়ুথ সোসাইটি',
                'status' => 'approved',
                'ai_trust_score' => 97,
                'impact_points' => 92,
                'likes_count' => 184,
                'comments_count' => 24,
            ],
            // 2. Barishal Division
            [
                'user_id' => $admin->id,
                'category_id' => $categories['healthcare']->id ?? 1,
                'title' => 'বরিশালের প্রত্যন্ত চরাঞ্চলে ভাসমান ফ্রি মেডিকেল ক্যাম্প ও ওষুধ সেবা',
                'description' => 'নৌকাযোগে কীর্তনখোলা নদী ও সংলগ্ন প্রত্যন্ত চরাঞ্চলের ৪০০ জন গ্রামীণ মানুষের মাঝে বিনামূল্যে স্বাস্থ্য পরীক্ষা ও প্রয়োজনীয় ওষুধ বিতরণ কর্মসূচি সম্পন্ন হয়। অভিজ্ঞ ডাক্তারদের একটি দল বিনামূল্যে চিকিৎসা সেবা প্রদান করেন।',
                'video_url' => null,
                'thumbnail' => 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
                'photos' => ['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80'],
                'division' => 'Barishal',
                'district' => 'Barishal',
                'upazila' => 'Babuganj',
                'location' => 'কীর্তনখোলা চরাঞ্চল, বাবুগঞ্জ, বরিশাল',
                'deed_date' => '2026-04-11',
                'beneficiaries_count' => 400,
                'team_name' => 'রিভার হিলিং টিম',
                'organization' => 'বরিশাল হেলথ কেয়ার ফাউন্ডেশন',
                'status' => 'approved',
                'ai_trust_score' => 95,
                'impact_points' => 94,
                'likes_count' => 210,
                'comments_count' => 31,
            ],
            // 3. Mymensingh Division
            [
                'user_id' => $admin->id,
                'category_id' => $categories['environment']->id ?? 1,
                'title' => 'ময়মনসিংহে ব্রহ্মপুত্র নদের ঘাট ও বাঁধ পরিচ্ছন্নতা অভিযান',
                'description' => 'ব্রহ্মপুত্র নদের তীরে জমে থাকা প্লাস্টিক ও পলিথিন বর্জ্য অপসারণে ১০০ জন শিক্ষার্থী ও তরুণ অংশ নেন। সংগৃহীত ৮০০ কেজি প্লাস্টিক পুনর্ব্যবহারের জন্য পাঠানো হয় এবং নদের তীরবর্তী মানুষকে সচেতন করা হয়।',
                'video_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                'thumbnail' => 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
                'photos' => ['https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80'],
                'division' => 'Mymensingh',
                'district' => 'Mymensingh',
                'upazila' => 'Mymensingh Sadar',
                'location' => 'শিল্পাচার্য জয়নুল আবেদীন পার্ক সংলগ্ন ঘাট, ময়মনসিংহ',
                'deed_date' => '2026-04-09',
                'beneficiaries_count' => 1500,
                'team_name' => 'গ্রিন ব্রহ্মপুত্র',
                'organization' => 'ময়মনসিংহ পরিবেশ রক্ষা আন্দোলন',
                'status' => 'approved',
                'ai_trust_score' => 96,
                'impact_points' => 88,
                'likes_count' => 195,
                'comments_count' => 19,
            ],
            // 4. Dhaka Division additional story
            [
                'user_id' => $admin->id,
                'category_id' => $categories['food-distribution']->id ?? 1,
                'title' => 'ঢাকার বস্তি এলাকায় ১০০০ পথশিশুর মাঝে পুষ্টিকর খাবার বিতরণ',
                'description' => 'রাজধানীর কড়াইল বস্তি সংলগ্ন এলাকায় সুবিধাবঞ্চিত শিশু ও দিনমজুর পরিবারের মাঝে এক বেলার পুষ্টিকর দুপুরের খাবার ও ফলমূল বিতরণ করা হয়েছে।',
                'video_url' => null,
                'thumbnail' => 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
                'photos' => ['https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80'],
                'division' => 'Dhaka',
                'district' => 'Dhaka',
                'upazila' => 'Mohakhali',
                'location' => 'কড়াইল বস্তি, মহাখালী, ঢাকা',
                'deed_date' => '2026-04-16',
                'beneficiaries_count' => 1000,
                'team_name' => 'ঢাকা ফিডিং নেটওয়ার্ক',
                'organization' => 'বাংলাদেশ ইয়ুথ হাব',
                'status' => 'approved',
                'ai_trust_score' => 98,
                'impact_points' => 91,
                'likes_count' => 320,
                'comments_count' => 42,
            ],
        ];

        foreach ($deeds as $d) {
            GoodDeed::create($d);
        }
    }
}
