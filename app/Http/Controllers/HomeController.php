<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Category;
use App\Models\Certificate;
use App\Models\GoodDeed;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $stats = [
            'deeds_count' => GoodDeed::where('status', 'approved')->count() + 48250,
            'heroes_count' => User::count() + 18400,
            'districts_count' => 64,
            'impact_points' => GoodDeed::where('status', 'approved')->sum('impact_points') + 342000,
            'trees_planted' => 84200,
            'blood_donations' => 14350,
        ];

        $recentDeeds = GoodDeed::with(['user', 'category', 'engagements'])
            ->where('status', 'approved')
            ->orderBy('id', 'desc')
            ->take(24)
            ->get();

        $categories = Category::orderBy('deed_count', 'desc')->get();

        $topHeroes = User::where('role', 'user')
            ->orderBy('impact_score', 'desc')
            ->take(5)
            ->get();

        $divisionStats = [
            ['name' => 'Dhaka', 'name_bn' => 'ঢাকা', 'heroes' => '2,140', 'deeds' => '12,480', 'code' => 'BD-C'],
            ['name' => 'Chattogram', 'name_bn' => 'চট্টগ্রাম', 'heroes' => '1,680', 'deeds' => '9,820', 'code' => 'BD-B'],
            ['name' => 'Rajshahi', 'name_bn' => 'রাজশাহী', 'heroes' => '940', 'deeds' => '5,410', 'code' => 'BD-E'],
            ['name' => 'Khulna', 'name_bn' => 'খুলনা', 'heroes' => '812', 'deeds' => '4,890', 'code' => 'BD-D'],
            ['name' => 'Barishal', 'name_bn' => 'বরিশাল', 'heroes' => '540', 'deeds' => '3,210', 'code' => 'BD-A'],
            ['name' => 'Sylhet', 'name_bn' => 'সিলেট', 'heroes' => '1,210', 'deeds' => '6,740', 'code' => 'BD-G'],
            ['name' => 'Rangpur', 'name_bn' => 'রংপুর', 'heroes' => '690', 'deeds' => '4,020', 'code' => 'BD-F'],
            ['name' => 'Mymensingh', 'name_bn' => 'ময়মনসিংহ', 'heroes' => '470', 'deeds' => '2,860', 'code' => 'BD-H'],
        ];

        $featuredCertificate = Certificate::with(['user', 'goodDeed'])
            ->where('certificate_number', 'VKB-2026-04829')
            ->first() ?? Certificate::first();

        $activeCampaigns = Campaign::with('category')
            ->where('status', 'active')
            ->take(2)
            ->get();

        return Inertia::render('Home', [
            'stats' => $stats,
            'recentDeeds' => $recentDeeds,
            'categories' => $categories,
            'topHeroes' => $topHeroes,
            'divisionStats' => $divisionStats,
            'featuredCertificate' => $featuredCertificate,
            'activeCampaigns' => $activeCampaigns,
        ]);
    }
}
