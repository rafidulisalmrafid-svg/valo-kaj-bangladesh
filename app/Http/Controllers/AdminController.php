<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Category;
use App\Models\Certificate;
use App\Models\DeedEngagement;
use App\Models\EmailTemplate;
use App\Models\GoodDeed;
use App\Models\User;
use App\Models\UserNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function index(Request $request): Response
    {
        $statusFilter = $request->query('status', 'pending');

        $stats = [
            'total_users' => User::count(),
            'total_deeds' => GoodDeed::count(),
            'approved_deeds' => GoodDeed::where('status', 'approved')->count(),
            'pending_deeds' => GoodDeed::where('status', 'pending')->count(),
            'rejected_deeds' => GoodDeed::where('status', 'rejected')->count(),
            'total_comments' => DeedEngagement::where('type', 'comment')->count(),
            'daily_uploads' => 142,
            'monthly_growth' => '+28.4%',
        ];

        $deedsQuery = GoodDeed::with(['user', 'category']);
        if ($statusFilter !== 'all') {
            $deedsQuery->where('status', $statusFilter);
        }

        $deeds = $deedsQuery->latest()->paginate(10)->withQueryString();

        $users = User::orderBy('created_at', 'desc')->paginate(15);
        $categories = Category::all();
        $auditLogs = AuditLog::with('user')->latest()->take(20)->get();

        // Comments list for super admin moderation
        $comments = DeedEngagement::where('type', 'comment')
            ->with(['user', 'goodDeed'])
            ->latest()
            ->paginate(15, ['*'], 'comments_page');

        // Email Templates for customization
        $emailTemplates = EmailTemplate::all();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'deeds' => $deeds,
            'currentStatus' => $statusFilter,
            'users' => $users,
            'categories' => $categories,
            'auditLogs' => $auditLogs,
            'comments' => $comments,
            'emailTemplates' => $emailTemplates,
        ]);
    }

    public function approveDeed(Request $request, int $id): RedirectResponse
    {
        $deed = GoodDeed::findOrFail($id);
        $reviewer = Auth::user();
        $notes = $request->input('notes', 'অ্যাডমিন কর্তৃক কনটেন্ট ও প্রমাণাদি যাচাইপূর্বক অনুমোদন করা হয়েছে (Approved by Super Admin).');

        $deed->update([
            'status' => 'approved',
            'reviewer_id' => $reviewer ? $reviewer->id : null,
            'reviewed_at' => now(),
            'review_notes' => $notes,
        ]);

        if ($deed->user) {
            $deed->user->increment('impact_score', $deed->impact_points ?: 50);
            $deed->user->increment('deeds_count', 1);

            UserNotification::create([
                'user_id' => $deed->user->id,
                'title' => '🎉 আপনার ভালো কাজের পোস্টটি অনুমোদিত হয়েছে!',
                'message' => "অভিনন্দন! আপনার পোস্ট '{$deed->title}' সফলভাবে অনুমোদিত হয়েছে এবং এটি এখন সবার জন্য লাইভ।",
                'type' => 'approval',
                'link' => "/deeds/{$deed->id}",
            ]);
        }

        AuditLog::create([
            'user_id' => $reviewer ? $reviewer->id : null,
            'action' => 'admin_deed_approved',
            'target_type' => 'GoodDeed',
            'target_id' => $deed->id,
            'details' => ['notes' => $notes, 'title' => $deed->title],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', "পোস্ট '{$deed->title}' সফলভাবে অনুমোদন করা হয়েছে এবং ওয়েবসাইটে লাইভ হয়েছে!");
    }

    public function rejectDeed(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'notes' => 'required|string|min:5|max:1000',
        ]);

        $deed = GoodDeed::findOrFail($id);
        $reviewer = Auth::user();
        $notes = $request->input('notes');

        $deed->update([
            'status' => 'rejected',
            'reviewer_id' => $reviewer ? $reviewer->id : null,
            'reviewed_at' => now(),
            'review_notes' => $notes,
        ]);

        if ($deed->user) {
            UserNotification::create([
                'user_id' => $deed->user->id,
                'title' => 'আপনার পোস্টটি বাতিল করা হয়েছে',
                'message' => "আপনার পোস্ট '{$deed->title}' অ্যাডমিন কর্তৃক বাতিল করা হয়েছে। কারণ: {$notes}",
                'type' => 'rejection',
                'link' => '/profile',
            ]);
        }

        AuditLog::create([
            'user_id' => $reviewer ? $reviewer->id : null,
            'action' => 'admin_deed_rejected',
            'target_type' => 'GoodDeed',
            'target_id' => $deed->id,
            'details' => ['notes' => $notes, 'title' => $deed->title],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('info', "পোস্ট '{$deed->title}' বাতিল করা হয়েছে। এটি ওয়েবসাইটে লাইভ হবে না।");
    }

    public function deleteComment(Request $request, int $id): RedirectResponse
    {
        $comment = DeedEngagement::where('type', 'comment')->findOrFail($id);
        $deed = $comment->goodDeed;
        $currentUser = Auth::user();

        $commentSnippet = mb_substr($comment->comment ?? '', 0, 40) . '...';
        $comment->delete();

        if ($deed && $deed->comments_count > 0) {
            $deed->decrement('comments_count');
        }

        AuditLog::create([
            'user_id' => $currentUser ? $currentUser->id : null,
            'action' => 'admin_comment_deleted',
            'target_type' => 'DeedEngagement',
            'target_id' => $id,
            'details' => ['comment' => $commentSnippet, 'post_id' => $deed ? $deed->id : null],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'অনুপযুক্ত কমেন্টটি অ্যাডমিন ড্যাশবোর্ড থেকে মুছে ফেলা হয়েছে (Comment deleted by Super Admin).');
    }

    public function updateUserRole(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'role' => 'required|in:visitor,user,district_moderator,division_moderator,award_committee,super_admin',
        ]);

        $user = User::findOrFail($id);
        $oldRole = $user->role;
        $user->update(['role' => $validated['role']]);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'user_role_updated',
            'target_type' => 'User',
            'target_id' => $user->id,
            'details' => ['old_role' => $oldRole, 'new_role' => $validated['role']],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', "Role for {$user->name} updated to {$validated['role']}.");
    }

    public function updateEmailTemplate(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'body' => 'required|string|min:10',
            'sender_email' => 'required|email|max:255',
            'sender_name' => 'required|string|max:255',
        ]);

        $template = EmailTemplate::findOrFail($id);
        $template->update($validated);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'email_template_updated',
            'target_type' => 'EmailTemplate',
            'target_id' => $template->id,
            'details' => ['template_key' => $template->key, 'subject' => $template->subject],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', "'{$template->name}' ইমেইল বার্তাটি সফলভাবে আপডেট ও সংরক্ষিত হয়েছে!");
    }
}
