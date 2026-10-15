<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\GoodDeed;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DivisionModeratorController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $division = $request->query('division', $user->division ?? 'Chattogram');

        $divisionDeeds = GoodDeed::with(['user', 'category', 'reviewer'])
            ->where('division', $division)
            ->latest()
            ->take(20)
            ->get();

        $districtSummaries = [
            ['district' => 'Chattogram', 'pending' => 4, 'approved' => 184, 'rejected' => 6, 'mod_name' => 'Nazia Chowdhury'],
            ['district' => "Cox's Bazar", 'pending' => 2, 'approved' => 96, 'rejected' => 3, 'mod_name' => 'Salim Ullah'],
            ['district' => 'Cumilla', 'pending' => 3, 'approved' => 142, 'rejected' => 8, 'mod_name' => 'Kazi Faisal'],
            ['district' => 'Noakhali', 'pending' => 1, 'approved' => 88, 'rejected' => 2, 'mod_name' => 'Anowara Begum'],
            ['district' => 'Feni', 'pending' => 0, 'approved' => 65, 'rejected' => 1, 'mod_name' => 'Shamsul Alam'],
            ['district' => 'Brahmanbaria', 'pending' => 2, 'approved' => 74, 'rejected' => 4, 'mod_name' => 'Jashim Uddin'],
        ];

        $moderatorLogs = AuditLog::with('user')
            ->whereIn('action', ['deed_approved', 'deed_rejected'])
            ->latest()
            ->take(15)
            ->get();

        return Inertia::render('Moderator/DivisionPanel', [
            'division' => $division,
            'divisionDeeds' => $divisionDeeds,
            'districtSummaries' => $districtSummaries,
            'moderatorLogs' => $moderatorLogs,
        ]);
    }
}
