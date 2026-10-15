<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Award;
use App\Models\GoodDeed;
use App\Models\User;
use App\Models\UserNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AwardCommitteeController extends Controller
{
    public function index(Request $request): Response
    {
        $selectedDistrict = $request->query('district', 'Sylhet');

        // Top shortlisted deeds for the selected district
        $shortlistedDeeds = GoodDeed::with(['user', 'category'])
            ->where('status', 'approved')
            ->where('district', $selectedDistrict)
            ->orderBy('impact_points', 'desc')
            ->take(20)
            ->get();

        $existingAwards = Award::with(['user', 'goodDeed'])
            ->where('month', 'April')
            ->where('year', 2026)
            ->latest()
            ->get();

        return Inertia::render('Awards/CommitteePanel', [
            'selectedDistrict' => $selectedDistrict,
            'shortlistedDeeds' => $shortlistedDeeds,
            'existingAwards' => $existingAwards,
        ]);
    }

    public function grantAward(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'good_deed_id' => 'required|exists:good_deeds,id',
            'level' => 'required|in:district,division,national',
            'rank_name' => 'required|string',
            'title' => 'required|string',
            'citation' => 'required|string',
        ]);

        $deed = GoodDeed::with('user')->findOrFail($validated['good_deed_id']);
        $user = $deed->user;

        $award = Award::create([
            'month' => 'April',
            'year' => 2026,
            'level' => $validated['level'],
            'rank_name' => $validated['rank_name'],
            'title' => $validated['title'],
            'user_id' => $user->id,
            'good_deed_id' => $deed->id,
            'district' => $deed->district,
            'division' => $deed->division,
            'citation' => $validated['citation'],
            'badge_color' => in_array($validated['rank_name'], ['District Champion', 'Division Champion', 'National Good Deed Hero']) ? 'gold' : 'emerald',
        ]);

        $user->increment('impact_score', 250);

        UserNotification::create([
            'user_id' => $user->id,
            'title' => "Award Won: {$award->title} 🏆",
            'message' => "Congratulations {$user->name}! The Award Committee has bestowed upon you: '{$award->rank_name}' for '{$deed->title}'.",
            'type' => 'award',
            'link' => '/leaderboard',
        ]);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'award_granted',
            'target_type' => 'Award',
            'target_id' => $award->id,
            'details' => ['recipient' => $user->name, 'title' => $award->title],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', "Award '{$award->title}' granted to {$user->name}!");
    }
}
