<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\CampaignParticipant;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CampaignController extends Controller
{
    public function index(): Response
    {
        $campaigns = Campaign::with(['category', 'organizer', 'participants'])
            ->latest('start_date')
            ->get();

        $categories = Category::all();

        return Inertia::render('Campaigns', [
            'campaigns' => $campaigns,
            'categories' => $categories,
        ]);
    }

    public function join(int $id): RedirectResponse
    {
        if (!Auth::check()) {
            return redirect('/auth')->with('info', 'Please sign in to join this campaign.');
        }

        $campaign = Campaign::findOrFail($id);
        $user = Auth::user();

        $existing = CampaignParticipant::where('campaign_id', $id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            return back()->with('info', 'You are already a registered participant in this campaign.');
        }

        CampaignParticipant::create([
            'campaign_id' => $id,
            'user_id' => $user->id,
            'deeds_count' => 0,
        ]);

        $user->increment('impact_score', 30);

        return back()->with('success', "Campaign joined! You earned +30 impact points for joining '{$campaign->title}'.");
    }
}
