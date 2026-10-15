<?php

namespace App\Http\Controllers;

use App\Models\Award;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaderboardController extends Controller
{
    public function index(Request $request): Response
    {
        $tab = $request->query('tab', 'national');

        $nationalHeroes = User::where('role', 'user')
            ->orderBy('impact_score', 'desc')
            ->take(10)
            ->get();

        $districtRankings = [
            ['name' => 'Sylhet', 'division' => 'Sylhet', 'deeds' => '6,740', 'heroes' => '1,210', 'impact' => '482,900', 'badge' => 'Rank 1'],
            ['name' => 'Dhaka', 'division' => 'Dhaka', 'deeds' => '12,480', 'heroes' => '2,140', 'impact' => '440,200', 'badge' => 'Rank 2'],
            ['name' => 'Chattogram', 'division' => 'Chattogram', 'deeds' => '9,820', 'heroes' => '1,680', 'impact' => '392,100', 'badge' => 'Rank 3'],
            ['name' => 'Rangpur', 'division' => 'Rangpur', 'deeds' => '4,020', 'heroes' => '690', 'impact' => '295,400', 'badge' => 'Rank 4'],
            ['name' => 'Khulna', 'division' => 'Khulna', 'deeds' => '4,890', 'heroes' => '812', 'impact' => '274,300', 'badge' => 'Rank 5'],
            ['name' => 'Rajshahi', 'division' => 'Rajshahi', 'deeds' => '5,410', 'heroes' => '940', 'impact' => '261,800', 'badge' => 'Rank 6'],
            ['name' => 'Barishal', 'division' => 'Barishal', 'deeds' => '3,210', 'heroes' => '540', 'impact' => '198,400', 'badge' => 'Rank 7'],
            ['name' => 'Mymensingh', 'division' => 'Mymensingh', 'deeds' => '2,860', 'heroes' => '470', 'impact' => '172,900', 'badge' => 'Rank 8'],
        ];

        $organizations = [
            ['name' => 'Dhaka Youth Club', 'type' => 'NGO / Club', 'district' => 'Dhaka', 'members' => 340, 'impact' => '84,200', 'deeds' => 1240],
            ['name' => 'Green Sylhet Initiative', 'type' => 'Environmental', 'district' => 'Sylhet', 'members' => 280, 'impact' => '76,500', 'deeds' => 980],
            ['name' => 'Paws of Chattogram', 'type' => 'Animal Welfare', 'district' => 'Chattogram', 'members' => 195, 'impact' => '62,800', 'deeds' => 840],
            ['name' => 'Sundarbans Guardians', 'type' => 'Conservation', 'district' => 'Khulna', 'members' => 150, 'impact' => '51,400', 'deeds' => 610],
            ['name' => 'Alor Dishari Pathshala', 'type' => 'Education', 'district' => 'Rangpur', 'members' => 120, 'impact' => '44,900', 'deeds' => 520],
        ];

        $universities = [
            ['name' => 'University of Dhaka', 'location' => 'Dhaka', 'volunteers' => 1420, 'deeds' => 4820, 'impact' => '194,000'],
            ['name' => 'Shahjalal University of Science & Technology', 'location' => 'Sylhet', 'volunteers' => 980, 'deeds' => 3410, 'impact' => '152,400'],
            ['name' => 'Chittagong University', 'location' => 'Chattogram', 'volunteers' => 890, 'deeds' => 2940, 'impact' => '138,200'],
            ['name' => 'Rajshahi University', 'location' => 'Rajshahi', 'volunteers' => 640, 'deeds' => 2120, 'impact' => '98,700'],
            ['name' => 'Khulna University', 'location' => 'Khulna', 'volunteers' => 580, 'deeds' => 1950, 'impact' => '89,100'],
        ];

        $schools = [
            ['name' => 'Sylhet Govt. Pilot High School', 'district' => 'Sylhet', 'students' => 310, 'trees' => 1400, 'impact' => '38,200'],
            ['name' => 'Dhaka Residential Model College', 'district' => 'Dhaka', 'students' => 450, 'deeds' => 520, 'impact' => '42,100'],
            ['name' => 'Chittagong Collegiate School', 'district' => 'Chattogram', 'students' => 290, 'deeds' => 410, 'impact' => '34,900'],
        ];

        $monthlyAwards = Award::with(['user', 'goodDeed'])
            ->latest()
            ->take(8)
            ->get();

        return Inertia::render('Leaderboard', [
            'activeTab' => $tab,
            'nationalHeroes' => $nationalHeroes,
            'districtRankings' => $districtRankings,
            'organizations' => $organizations,
            'universities' => $universities,
            'schools' => $schools,
            'monthlyAwards' => $monthlyAwards,
        ]);
    }
}
