<?php

namespace App\Http\Controllers;

use App\Models\GoodDeed;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MapController extends Controller
{
    public function index(Request $request): Response
    {
        $selectedDistrict = $request->query('district', 'Sylhet');

        $districtDeeds = GoodDeed::with(['user', 'category'])
            ->where('status', 'approved')
            ->where('district', $selectedDistrict)
            ->take(6)
            ->get();

        $districtHeroes = User::where('district', $selectedDistrict)
            ->where('role', 'user')
            ->orderBy('impact_score', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Map', [
            'initialDistrict' => $selectedDistrict,
            'districtDeeds' => $districtDeeds,
            'districtHeroes' => $districtHeroes,
        ]);
    }
}
