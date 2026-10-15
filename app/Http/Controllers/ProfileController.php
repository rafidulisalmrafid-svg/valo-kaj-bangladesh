<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\GoodDeed;
use App\Models\UserNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();

        if (!$user) {
            // Default to top hero for preview if not signed in
            $user = \App\Models\User::where('email', 'rashida@valokaj.org')->first();
        }

        $myDeeds = GoodDeed::with('category')
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        $myCertificates = Certificate::where('user_id', $user->id)
            ->latest()
            ->get();

        $notifications = UserNotification::where('user_id', $user->id)
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Profile', [
            'profileUser' => $user,
            'myDeeds' => $myDeeds,
            'myCertificates' => $myCertificates,
            'notifications' => $notifications,
        ]);
    }
}
