<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Certificate;
use App\Models\GoodDeed;
use App\Models\User;
use App\Models\UserNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DistrictModeratorController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $district = $request->query('district', $user->district ?? 'Sylhet');

        $pendingDeeds = GoodDeed::with(['user', 'category'])
            ->where('status', 'pending')
            ->where('district', $district)
            ->latest()
            ->get();

        $reviewedDeeds = GoodDeed::with(['user', 'category'])
            ->whereIn('status', ['approved', 'rejected', 'needs_info'])
            ->where('district', $district)
            ->latest()
            ->take(10)
            ->get();

        $stats = [
            'pending_count' => $pendingDeeds->count(),
            'approved_count' => GoodDeed::where('district', $district)->where('status', 'approved')->count(),
            'rejected_count' => GoodDeed::where('district', $district)->where('status', 'rejected')->count(),
            'district_name' => $district,
        ];

        return Inertia::render('Moderator/DistrictPanel', [
            'district' => $district,
            'pendingDeeds' => $pendingDeeds,
            'reviewedDeeds' => $reviewedDeeds,
            'stats' => $stats,
        ]);
    }

    public function approve(Request $request, int $id): RedirectResponse
    {
        $deed = GoodDeed::findOrFail($id);
        $reviewer = Auth::user();

        $deed->update([
            'status' => 'approved',
            'review_notes' => $request->input('notes', 'Verified authentic good deed. Approved by District Moderator.'),
            'reviewer_id' => $reviewer ? $reviewer->id : 1,
        ]);

        // Award points to deed creator
        $author = $deed->user;
        if ($author) {
            $author->increment('impact_score', $deed->impact_points);

            // Generate Certificate
            $certNum = 'VKB-2026-' . str_pad((string)rand(1000, 9999), 5, '0', STR_PAD_LEFT);
            Certificate::create([
                'certificate_number' => $certNum,
                'user_id' => $author->id,
                'good_deed_id' => $deed->id,
                'title' => "Certificate of Recognition — {$deed->district} District",
                'recipient_name' => $author->name,
                'district' => $deed->district,
                'division' => $deed->division,
                'achievement' => "Successfully executed verified community good deed: {$deed->title}",
                'issue_date' => now()->toDateString(),
                'qr_code_url' => "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://valokaj.org/verify-certificate/{$certNum}",
                'verification_token' => "{$certNum}-TOKEN-HASH",
            ]);

            // Send notification
            UserNotification::create([
                'user_id' => $author->id,
                'title' => 'Good Deed Approved! 🎉',
                'message' => "Your deed '{$deed->title}' has been approved by the District Moderator! Certificate {$certNum} has been issued.",
                'type' => 'approval',
                'link' => "/verify-certificate/{$certNum}",
            ]);
        }

        AuditLog::create([
            'user_id' => $reviewer ? $reviewer->id : null,
            'action' => 'deed_approved',
            'target_type' => 'GoodDeed',
            'target_id' => $deed->id,
            'details' => ['district' => $deed->district, 'notes' => $deed->review_notes],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', "Deed '{$deed->title}' has been approved! Impact points & certificate issued.");
    }

    public function reject(Request $request, int $id): RedirectResponse
    {
        $deed = GoodDeed::findOrFail($id);
        $reviewer = Auth::user();
        $notes = $request->input('notes', 'Content does not meet verification guidelines.');

        $deed->update([
            'status' => 'rejected',
            'review_notes' => $notes,
            'reviewer_id' => $reviewer ? $reviewer->id : 1,
        ]);

        if ($deed->user) {
            UserNotification::create([
                'user_id' => $deed->user->id,
                'title' => 'Good Deed Not Approved',
                'message' => "Your deed '{$deed->title}' could not be verified. Note: {$notes}",
                'type' => 'rejection',
                'link' => '/profile',
            ]);
        }

        AuditLog::create([
            'user_id' => $reviewer ? $reviewer->id : null,
            'action' => 'deed_rejected',
            'target_type' => 'GoodDeed',
            'target_id' => $deed->id,
            'details' => ['notes' => $notes],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('info', "Deed '{$deed->title}' was rejected.");
    }

    public function requestInfo(Request $request, int $id): RedirectResponse
    {
        $deed = GoodDeed::findOrFail($id);
        $notes = $request->input('notes', 'Please provide additional photos or video evidence showing the location.');

        $deed->update([
            'status' => 'needs_info',
            'review_notes' => $notes,
        ]);

        if ($deed->user) {
            UserNotification::create([
                'user_id' => $deed->user->id,
                'title' => 'More Information Requested for Good Deed',
                'message' => "The moderator has requested more info on '{$deed->title}': {$notes}",
                'type' => 'upload',
                'link' => '/profile',
            ]);
        }

        return back()->with('info', "Additional information requested from volunteer.");
    }
}
