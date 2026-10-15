<?php

namespace Database\Seeders;

use App\Models\Award;
use App\Models\Campaign;
use App\Models\CampaignParticipant;
use App\Models\Category;
use App\Models\Certificate;
use App\Models\DeedEngagement;
use App\Models\GoodDeed;
use App\Models\User;
use App\Models\UserNotification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password123');

        // 1. Create Core Users with each of the 6 roles
        $superAdmin = User::create([
            'name' => 'Tanvir Ahmed',
            'email' => 'admin@valokaj.org',
            'mobile' => '01711000001',
            'password' => $password,
            'role' => 'super_admin',
            'gender' => 'Male',
            'division' => 'Dhaka',
            'district' => 'Dhaka',
            'upazila' => 'Gulshan',
            'organization' => 'Valo Kaj Foundation',
            'bio' => 'Super Administrator for Valo Kaj Bangladesh platform.',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
            'impact_score' => 12500,
        ]);

        $distModSylhet = User::create([
            'name' => 'Dr. Mahfuzur Rahman',
            'email' => 'sylhet.mod@valokaj.org',
            'mobile' => '01711000002',
            'password' => $password,
            'role' => 'district_moderator',
            'gender' => 'Male',
            'division' => 'Sylhet',
            'district' => 'Sylhet',
            'upazila' => 'Sylhet Sadar',
            'organization' => 'Sylhet Volunteer Network',
            'bio' => 'District Moderator for Sylhet district good deeds verification.',
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
            'impact_score' => 4500,
        ]);

        $divModCtg = User::create([
            'name' => 'Nazia Chowdhury',
            'email' => 'div.mod@valokaj.org',
            'mobile' => '01711000003',
            'password' => $password,
            'role' => 'division_moderator',
            'gender' => 'Female',
            'division' => 'Chattogram',
            'district' => 'Chattogram',
            'upazila' => 'Panchlaish',
            'organization' => 'Chattogram Youth Alliance',
            'bio' => 'Division Moderator overseeing Chattogram division districts & appeals.',
            'avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
            'impact_score' => 6200,
        ]);

        $awardCommittee = User::create([
            'name' => 'Prof. Anisul Haque',
            'email' => 'awards@valokaj.org',
            'mobile' => '01711000004',
            'password' => $password,
            'role' => 'award_committee',
            'gender' => 'Male',
            'division' => 'Dhaka',
            'district' => 'Dhaka',
            'upazila' => 'Dhanmondi',
            'organization' => 'National Awards Committee',
            'bio' => 'Chairman of the Valo Kaj Bangladesh Monthly & National Awards Jury.',
            'avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
            'impact_score' => 8400,
        ]);

        // Regular Top Volunteer Heroes
        $rashida = User::create([
            'name' => 'Rashida Akter',
            'email' => 'rashida@valokaj.org',
            'mobile' => '01711000010',
            'password' => $password,
            'role' => 'user',
            'gender' => 'Female',
            'division' => 'Sylhet',
            'district' => 'Sylhet',
            'upazila' => 'Golapganj',
            'organization' => 'Green Sylhet Initiative',
            'bio' => 'Planting trees and preserving hills in Sylhet. Environmental volunteer.',
            'avatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
            'impact_score' => 9840,
        ]);

        $karim = User::create([
            'name' => 'Karim Hossain',
            'email' => 'karim@valokaj.org',
            'mobile' => '01711000011',
            'password' => $password,
            'role' => 'user',
            'gender' => 'Male',
            'division' => 'Chattogram',
            'district' => 'Chattogram',
            'upazila' => 'Kotwali',
            'organization' => 'Paws of Chattogram',
            'bio' => 'Animal welfare advocate and stray rescue coordinator.',
            'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
            'impact_score' => 8720,
        ]);

        $nusrat = User::create([
            'name' => 'Nusrat Jahan',
            'email' => 'nusrat@valokaj.org',
            'mobile' => '01711000012',
            'password' => $password,
            'role' => 'user',
            'gender' => 'Female',
            'division' => 'Rangpur',
            'district' => 'Rangpur',
            'upazila' => 'Pirgachha',
            'organization' => 'Alor Dishari Pathshala',
            'bio' => 'Educating underprivileged rural kids under mango trees for 4 years.',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
            'impact_score' => 8210,
        ]);

        $sabbir = User::create([
            'name' => 'Sabbir Rahman',
            'email' => 'sabbir@valokaj.org',
            'mobile' => '01711000013',
            'password' => $password,
            'role' => 'user',
            'gender' => 'Male',
            'division' => 'Khulna',
            'district' => 'Khulna',
            'upazila' => 'Dumuria',
            'organization' => 'Sundarbans Guardians',
            'bio' => 'Coastal embankment cleanup & cyclone readiness volunteer.',
            'avatar' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
            'impact_score' => 7440,
        ]);

        $tania = User::create([
            'name' => 'Tania Islam',
            'email' => 'tania@valokaj.org',
            'mobile' => '01711000014',
            'password' => $password,
            'role' => 'user',
            'gender' => 'Female',
            'division' => 'Barishal',
            'district' => 'Barishal',
            'upazila' => 'Babuganj',
            'organization' => 'Riverine Relief Squad',
            'bio' => 'Free medical supply distribution in remote river islands.',
            'avatar' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
            'impact_score' => 6980,
        ]);

        $dhakaYouth = User::create([
            'name' => 'Dhaka Youth Club',
            'email' => 'dhakayouth@valokaj.org',
            'mobile' => '01711000015',
            'password' => $password,
            'role' => 'user',
            'gender' => 'Male',
            'division' => 'Dhaka',
            'district' => 'Dhaka',
            'upazila' => 'Mirpur',
            'organization' => 'Dhaka Youth Club',
            'bio' => 'Youth-led emergency blood donation network and community welfare.',
            'avatar' => 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=200&h=200&fit=crop&crop=face',
            'impact_score' => 11200,
        ]);

        // 2. Seed 12 Good Deed Categories
        $categoriesData = [
            ['slug' => 'tree-plantation', 'name' => 'Tree Plantation', 'name_bn' => 'বৃক্ষরোপণ', 'icon' => 'Trees', 'description' => 'Planting saplings, preserving urban greenery and afforesting riverbanks.', 'deed_count' => 8240],
            ['slug' => 'blood-donation', 'name' => 'Blood Donation', 'name_bn' => 'রক্তদান', 'icon' => 'HeartPulse', 'description' => 'Emergency voluntary blood donation drives and registry coordination.', 'deed_count' => 6410],
            ['slug' => 'education', 'name' => 'Education', 'name_bn' => 'শিক্ষা', 'icon' => 'GraduationCap', 'description' => 'Free tutoring, school supplies, literacy campaigns and mentorship.', 'deed_count' => 5120],
            ['slug' => 'healthcare', 'name' => 'Healthcare', 'name_bn' => 'স্বাস্থ্যসেবা', 'icon' => 'Stethoscope', 'description' => 'Free medical camps, prescription medicine support and health hygiene.', 'deed_count' => 3280],
            ['slug' => 'food-distribution', 'name' => 'Food Distribution', 'name_bn' => 'খাদ্য বিতরণ', 'icon' => 'Utensils', 'description' => 'Distributing warm meals and food packages to destitute communities.', 'deed_count' => 7930],
            ['slug' => 'community-service', 'name' => 'Community Service', 'name_bn' => 'সমাজসেবা', 'icon' => 'Users', 'description' => 'Public cleanliness drives, road repairs, neighborhood improvements.', 'deed_count' => 9720],
            ['slug' => 'environment', 'name' => 'Environment', 'name_bn' => 'পরিবেশ', 'icon' => 'Leaf', 'description' => 'Plastic cleanup, waste management, canal cleaning and eco-protection.', 'deed_count' => 4650],
            ['slug' => 'animal-rescue', 'name' => 'Animal Rescue', 'name_bn' => 'প্রাণী উদ্ধার', 'icon' => 'PawPrint', 'description' => 'Feeding stray animals, veterinary care, vaccination and rescue.', 'deed_count' => 3810],
            ['slug' => 'disaster-relief', 'name' => 'Disaster Relief', 'name_bn' => 'দুর্যোগ ত্রাণ', 'icon' => 'ShieldAlert', 'description' => 'Flood, cyclone, and cold wave emergency response and rehabilitation.', 'deed_count' => 2190],
            ['slug' => 'women-empowerment', 'name' => 'Women Empowerment', 'name_bn' => 'নারী ক্ষমতায়ন', 'icon' => 'Sparkles', 'description' => 'Skill development, sewing workshops, and women entrepreneurship.', 'deed_count' => 2850],
            ['slug' => 'youth-volunteer', 'name' => 'Youth Volunteer', 'name_bn' => 'তরুণ স্বেচ্ছাসেবক', 'icon' => 'Flame', 'description' => 'School & college student initiatives driving local social impact.', 'deed_count' => 6100],
            ['slug' => 'others', 'name' => 'Others', 'name_bn' => 'অন্যান্য', 'icon' => 'Gift', 'description' => 'Acts of spontaneous kindness, elder care, and civic assistance.', 'deed_count' => 1540],
        ];

        $categories = [];
        foreach ($categoriesData as $c) {
            $categories[$c['slug']] = Category::create($c);
        }

        // 3. Seed Verified & Pending Good Deeds
        $deeds = [
            [
                'user_id' => $rashida->id,
                'category_id' => $categories['tree-plantation']->id,
                'title' => 'Planting 500 trees in Sylhet hills',
                'description' => 'Organized an environmental drive to plant 500 native fruit and timber trees along the deforested hillsides of Golapganj, Sylhet. Engaged 35 local high school students and villagers to ensure sustainable watering.',
                'video_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                'thumbnail' => 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
                'photos' => [
                    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=800&auto=format&fit=crop&q=80'
                ],
                'division' => 'Sylhet',
                'district' => 'Sylhet',
                'upazila' => 'Golapganj',
                'location' => 'Dhaka Dakshin, Golapganj, Sylhet',
                'google_map_url' => 'https://maps.google.com/?q=24.8625,91.9754',
                'latitude' => 24.8625,
                'longitude' => 91.9754,
                'deed_date' => '2026-04-18',
                'beneficiaries_count' => 1200,
                'team_name' => 'Sylhet Green Brigade',
                'organization' => 'Green Sylhet Initiative',
                'status' => 'approved',
                'ai_trust_score' => 98,
                'ai_flags' => ['High Resolution Video', 'Geolocation Verified', 'No Duplicate Detected', 'Category Match: 99%'],
                'review_notes' => 'Authentic tree plantation drive verified with village elder testimony.',
                'reviewer_id' => $distModSylhet->id,
                'likes_count' => 342,
                'comments_count' => 45,
                'views_count' => 2850,
                'impact_points' => 90,
                'is_featured' => true,
            ],
            [
                'user_id' => $dhakaYouth->id,
                'category_id' => $categories['blood-donation']->id,
                'title' => 'Emergency blood drive saved 30 lives',
                'description' => 'Mobilized 60 voluntary blood donors at Dhaka Medical College Hospital for thalassemic children and emergency accident patients in critical need of rare B-negative and O-negative blood units.',
                'video_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                'thumbnail' => 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80',
                'photos' => [
                    'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80'
                ],
                'division' => 'Dhaka',
                'district' => 'Dhaka',
                'upazila' => 'Shahbagh',
                'location' => 'Dhaka Medical College Hospital, Dhaka',
                'google_map_url' => 'https://maps.google.com/?q=23.7258,90.3976',
                'latitude' => 23.7258,
                'longitude' => 90.3976,
                'deed_date' => '2026-04-19',
                'beneficiaries_count' => 30,
                'team_name' => 'Red Drop Squad',
                'organization' => 'Dhaka Youth Club',
                'status' => 'approved',
                'ai_trust_score' => 96,
                'ai_flags' => ['Hospital Slip Verified', 'Certified Nurse Signature', 'Zero Duplicate'],
                'review_notes' => 'Blood donation verified by DMCH blood bank coordinator.',
                'reviewer_id' => $superAdmin->id,
                'likes_count' => 518,
                'comments_count' => 64,
                'views_count' => 3910,
                'impact_points' => 95,
                'is_featured' => true,
            ],
            [
                'user_id' => $karim->id,
                'category_id' => $categories['animal-rescue']->id,
                'title' => 'Rescuing street dogs in monsoon flood',
                'description' => 'During flash urban waterlogging in Chattogram Agrabad area, our volunteer squad rescued 18 trapped stray puppies and mother dogs from drowning, provided warmth, vaccinations, and nutritious food.',
                'video_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                'thumbnail' => 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop&q=80',
                'photos' => [
                    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80'
                ],
                'division' => 'Chattogram',
                'district' => 'Chattogram',
                'upazila' => 'Double Mooring',
                'location' => 'Agrabad Commercial Area, Chattogram',
                'google_map_url' => 'https://maps.google.com/?q=22.3274,91.8124',
                'latitude' => 22.3274,
                'longitude' => 91.8124,
                'deed_date' => '2026-04-15',
                'beneficiaries_count' => 18,
                'team_name' => 'Chatto Paws',
                'organization' => 'Paws of Chattogram',
                'status' => 'approved',
                'ai_trust_score' => 94,
                'ai_flags' => ['Original Video Captured', 'Veterinary Check Confirmed'],
                'review_notes' => 'Animal welfare verified with local vet clinic report.',
                'reviewer_id' => $divModCtg->id,
                'likes_count' => 412,
                'comments_count' => 38,
                'views_count' => 3120,
                'impact_points' => 85,
                'is_featured' => true,
            ],
            [
                'user_id' => $nusrat->id,
                'category_id' => $categories['education']->id,
                'title' => 'Free school under the mango tree',
                'description' => 'Conducted weekly science and English learning sessions for 85 child laborers and rural children without access to formal school in Pirgachha, Rangpur. Distributed notebooks, bags, and fruit meals.',
                'video_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                'thumbnail' => 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
                'photos' => [
                    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80'
                ],
                'division' => 'Rangpur',
                'district' => 'Rangpur',
                'upazila' => 'Pirgachha',
                'location' => 'Kandi Union, Pirgachha, Rangpur',
                'google_map_url' => 'https://maps.google.com/?q=25.7144,89.3986',
                'latitude' => 25.7144,
                'longitude' => 89.3986,
                'deed_date' => '2026-04-12',
                'beneficiaries_count' => 85,
                'team_name' => 'Shikkhar Alo',
                'organization' => 'Alor Dishari Pathshala',
                'status' => 'approved',
                'ai_trust_score' => 97,
                'ai_flags' => ['High Quality Audio/Video', 'Clean Metadata', 'Safe Content'],
                'review_notes' => 'Education program verified by local union parishad member.',
                'reviewer_id' => $superAdmin->id,
                'likes_count' => 489,
                'comments_count' => 52,
                'views_count' => 4200,
                'impact_points' => 95,
                'is_featured' => true,
            ],
            [
                'user_id' => $sabbir->id,
                'category_id' => $categories['environment']->id,
                'title' => 'Coastal canal cleaning & plastic recovery',
                'description' => 'Removed 1.4 tons of single-use plastic waste from tidal canal entering the Sundarbans mangrove fringe. Waste sorted and handed over to eco-recycling enterprise.',
                'video_url' => null,
                'thumbnail' => 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
                'photos' => [
                    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop&q=80'
                ],
                'division' => 'Khulna',
                'district' => 'Khulna',
                'upazila' => 'Koyra',
                'location' => 'Koyra Ghat, Khulna',
                'google_map_url' => 'https://maps.google.com/?q=22.3421,89.3005',
                'latitude' => 22.3421,
                'longitude' => 89.3005,
                'deed_date' => '2026-04-10',
                'beneficiaries_count' => 3500,
                'team_name' => 'Mangrove Protectors',
                'organization' => 'Sundarbans Guardians',
                'status' => 'approved',
                'ai_trust_score' => 93,
                'ai_flags' => ['Environmental Impact High', 'GPS Matched'],
                'review_notes' => 'Weighing slips and recyclers receipt confirmed.',
                'reviewer_id' => $superAdmin->id,
                'likes_count' => 294,
                'comments_count' => 29,
                'views_count' => 1980,
                'impact_points' => 80,
                'is_featured' => false,
            ],
            // A Pending Deed for Sylhet Moderator to review
            [
                'user_id' => $rashida->id,
                'category_id' => $categories['food-distribution']->id,
                'title' => 'Hot meal distribution for 200 tea estate workers',
                'description' => 'Prepared and distributed cooked nutritious khichuri and boiled eggs for 200 daily wage tea garden workers in Lakkatura Tea Estate during severe rainstorm.',
                'video_url' => null,
                'thumbnail' => 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
                'photos' => [
                    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80'
                ],
                'division' => 'Sylhet',
                'district' => 'Sylhet',
                'upazila' => 'Sylhet Sadar',
                'location' => 'Lakkatura Tea Garden, Sylhet',
                'google_map_url' => 'https://maps.google.com/?q=24.9125,91.8654',
                'latitude' => 24.9125,
                'longitude' => 91.8654,
                'deed_date' => '2026-04-21',
                'beneficiaries_count' => 200,
                'team_name' => 'Sylhet Green Brigade',
                'organization' => 'Green Sylhet Initiative',
                'status' => 'pending', // Pending review for Sylhet moderator!
                'ai_trust_score' => 91,
                'ai_flags' => ['AI Check: No Duplicates Detected', 'Category Match: Food Distribution (96%)', 'Safe Community Imagery'],
                'review_notes' => null,
                'reviewer_id' => null,
                'likes_count' => 12,
                'comments_count' => 2,
                'views_count' => 85,
                'impact_points' => 70,
                'is_featured' => false,
            ],
            // A Pending Deed for Chattogram Moderator
            [
                'user_id' => $karim->id,
                'category_id' => $categories['community-service']->id,
                'title' => 'Installing solar lanterns in rural fisherfolk hamlet',
                'description' => 'Purchased and installed 15 solar lamps along the jetty in Anwara coast to assist nighttime fishermen and women processing dry fish safely.',
                'video_url' => null,
                'thumbnail' => 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
                'photos' => [
                    'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80'
                ],
                'division' => 'Chattogram',
                'district' => 'Chattogram',
                'upazila' => 'Anwara',
                'location' => 'Parki Beach Ghat, Anwara, Chattogram',
                'google_map_url' => 'https://maps.google.com/?q=22.1884,91.7924',
                'latitude' => 22.1884,
                'longitude' => 91.7924,
                'deed_date' => '2026-04-20',
                'beneficiaries_count' => 450,
                'team_name' => 'Coastal Illuminators',
                'organization' => 'Paws & People of Chattogram',
                'status' => 'pending', // Pending review for Chattogram!
                'ai_trust_score' => 89,
                'ai_flags' => ['Solar receipts checked', 'No spam detected'],
                'review_notes' => null,
                'reviewer_id' => null,
                'likes_count' => 5,
                'comments_count' => 1,
                'views_count' => 42,
                'impact_points' => 75,
                'is_featured' => false,
            ]
        ];

        $createdDeeds = [];
        foreach ($deeds as $d) {
            $createdDeeds[] = GoodDeed::create($d);
        }

        // 4. Seed Engagements (Likes & Comments)
        DeedEngagement::create([
            'user_id' => $karim->id,
            'good_deed_id' => $createdDeeds[0]->id,
            'type' => 'like',
        ]);
        DeedEngagement::create([
            'user_id' => $nusrat->id,
            'good_deed_id' => $createdDeeds[0]->id,
            'type' => 'comment',
            'comment' => 'Incredible initiative Rashida apu! The hill slopes truly need more indigenous trees to prevent landslides.',
        ]);
        DeedEngagement::create([
            'user_id' => $tania->id,
            'good_deed_id' => $createdDeeds[1]->id,
            'type' => 'like',
        ]);
        DeedEngagement::create([
            'user_id' => $rashida->id,
            'good_deed_id' => $createdDeeds[1]->id,
            'type' => 'comment',
            'comment' => 'Salute to the Dhaka Youth Club heroes for always being the first to donate rare blood.',
        ]);

        // 5. Seed Campaigns
        $campaign1 = Campaign::create([
            'title' => 'Green Bangladesh — 1 Million Trees Drive',
            'title_bn' => 'সবুজ বাংলাদেশ — ১০ লক্ষ বৃক্ষরোপণ কর্মসূচি',
            'description' => 'A nationwide afforestation movement aiming to plant one million native fruit, herbal, and shade trees across schools, embankments, and village roads in all 64 districts.',
            'category_id' => $categories['tree-plantation']->id,
            'banner' => 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80',
            'division' => null,
            'district' => null,
            'target_beneficiaries' => 500000,
            'current_beneficiaries' => 248000,
            'target_deeds' => 10000,
            'current_deeds' => 6420,
            'organizer_name' => 'Valo Kaj National Youth Council',
            'organizer_user_id' => $superAdmin->id,
            'start_date' => '2026-03-01',
            'end_date' => '2026-08-31',
            'status' => 'active',
        ]);

        $campaign2 = Campaign::create([
            'title' => 'Zero Hunger Ramadan & Eid Food Box',
            'title_bn' => 'জিরো হাঙ্গার রমজান ও ঈদ খাদ্য সহায়তা',
            'description' => 'Delivering monthly dry ration boxes (rice, lentils, cooking oil, dates) to ultra-poor elderly citizens, day laborers, and flood victims.',
            'category_id' => $categories['food-distribution']->id,
            'banner' => 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80',
            'division' => 'Dhaka',
            'district' => 'Dhaka',
            'target_beneficiaries' => 15000,
            'current_beneficiaries' => 12400,
            'target_deeds' => 500,
            'current_deeds' => 418,
            'organizer_name' => 'Dhaka Youth Club & Partners',
            'organizer_user_id' => $dhakaYouth->id,
            'start_date' => '2026-03-15',
            'end_date' => '2026-05-15',
            'status' => 'active',
        ]);

        CampaignParticipant::create([
            'campaign_id' => $campaign1->id,
            'user_id' => $rashida->id,
            'deeds_count' => 14,
        ]);
        CampaignParticipant::create([
            'campaign_id' => $campaign1->id,
            'user_id' => $sabbir->id,
            'deeds_count' => 8,
        ]);

        // 6. Seed Certificates with QR Code and Verification Token
        Certificate::create([
            'certificate_number' => 'VKB-2026-04829',
            'user_id' => $rashida->id,
            'good_deed_id' => $createdDeeds[0]->id,
            'campaign_id' => $campaign1->id,
            'title' => 'Sylhet District Champion in Environmental Impact',
            'recipient_name' => 'Rashida Akter',
            'district' => 'Sylhet',
            'division' => 'Sylhet',
            'achievement' => 'For outstanding dedication to community service, environmental preservation, and successfully planting 500 trees in Golapganj, Sylhet in April 2026.',
            'issue_date' => '2026-04-20',
            'qr_code_url' => 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://valokaj.org/verify-certificate/VKB-2026-04829',
            'verification_token' => 'VKB-2026-04829-VERIFIED-HASH-SECURE',
        ]);

        Certificate::create([
            'certificate_number' => 'VKB-2026-01054',
            'user_id' => $dhakaYouth->id,
            'good_deed_id' => $createdDeeds[1]->id,
            'title' => 'National Life Saver Honor — Blood Donation',
            'recipient_name' => 'Dhaka Youth Club',
            'district' => 'Dhaka',
            'division' => 'Dhaka',
            'achievement' => 'For coordinating emergency blood drives saving over 30 lives at Dhaka Medical College Hospital.',
            'issue_date' => '2026-04-21',
            'qr_code_url' => 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://valokaj.org/verify-certificate/VKB-2026-01054',
            'verification_token' => 'VKB-2026-01054-VERIFIED-HASH-SECURE',
        ]);

        // 7. Seed Awards (District, Division, National)
        Award::create([
            'month' => 'April',
            'year' => 2026,
            'level' => 'district',
            'title' => 'District Champion — Sylhet',
            'rank_name' => 'District Champion',
            'user_id' => $rashida->id,
            'good_deed_id' => $createdDeeds[0]->id,
            'district' => 'Sylhet',
            'division' => 'Sylhet',
            'citation' => 'Awarded to Rashida Akter for exemplary leadership in mobilizing 35 youths for hill reforestation.',
            'badge_color' => 'gold',
        ]);

        Award::create([
            'month' => 'April',
            'year' => 2026,
            'level' => 'division',
            'title' => 'Chattogram Division Champion',
            'rank_name' => 'Division Champion',
            'user_id' => $karim->id,
            'good_deed_id' => $createdDeeds[2]->id,
            'district' => 'Chattogram',
            'division' => 'Chattogram',
            'citation' => 'Awarded for tireless rescue and vaccination of stranded animals during monsoon floods.',
            'badge_color' => 'gold',
        ]);

        Award::create([
            'month' => 'April',
            'year' => 2026,
            'level' => 'national',
            'title' => 'National Volunteer of the Month',
            'rank_name' => 'National Volunteer of the Month',
            'user_id' => $nusrat->id,
            'good_deed_id' => $createdDeeds[3]->id,
            'district' => 'Rangpur',
            'division' => 'Rangpur',
            'citation' => 'Honored nationally for running open-air community literacy schools for underprivileged children.',
            'badge_color' => 'emerald',
        ]);

        // 8. Notifications
        UserNotification::create([
            'user_id' => $rashida->id,
            'title' => 'Good Deed Verified & Certificate Issued! 🎉',
            'message' => 'Your deed "Planting 500 trees in Sylhet hills" was approved with an AI Trust Score of 98%. Your digital certificate VKB-2026-04829 is ready.',
            'type' => 'certificate',
            'link' => '/verify-certificate/VKB-2026-04829',
            'is_read' => false,
        ]);
        UserNotification::create([
            'user_id' => $rashida->id,
            'title' => 'Congratulations! You are the District Champion 🏆',
            'message' => 'The Award Committee selected you as the District Champion for Sylhet for April 2026.',
            'type' => 'award',
            'link' => '/leaderboard',
            'is_read' => false,
        ]);
    }
}
