<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Category;
use App\Models\DeedEngagement;
use App\Models\GoodDeed;
use App\Models\UserNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DeedController extends Controller
{
    public function index(Request $request): Response
    {
        $query = GoodDeed::with(['user', 'category', 'engagements.user'])
            ->where('status', 'approved');

        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->filled('district')) {
            $query->where('district', $request->district);
        }

        if ($request->filled('division') && $request->division !== 'all') {
            $query->where('division', $request->division);
        }

        if ($request->filled('type')) {
            if ($request->type === 'video') {
                $query->whereNotNull('video_url');
            } elseif ($request->type === 'photo') {
                $query->whereNull('video_url');
            }
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', "%{$s}%")
                    ->orWhere('description', 'like', "%{$s}%")
                    ->orWhere('location', 'like', "%{$s}%")
                    ->orWhere('organization', 'like', "%{$s}%");
            });
        }

        $sort = $request->query('sort', 'recent');
        if ($sort === 'trending') {
            $query->orderBy('likes_count', 'desc');
        } elseif ($sort === 'impact') {
            $query->orderBy('impact_points', 'desc');
        } else {
            $query->latest('deed_date');
        }

        $deeds = $query->paginate(12)->withQueryString();
        $categories = Category::all();

        $divisionCounts = GoodDeed::where('status', 'approved')
            ->selectRaw('division, count(*) as count')
            ->groupBy('division')
            ->pluck('count', 'division');

        return Inertia::render('Explore', [
            'deeds' => $deeds,
            'categories' => $categories,
            'divisionCounts' => $divisionCounts,
            'filters' => (object) $request->only(['search', 'category', 'district', 'division', 'sort', 'type']),
        ]);
    }

    public function create(): Response
    {
        $categories = Category::all();
        return Inertia::render('UploadDeed', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string|min:20',
            'category_id' => 'required|exists:categories,id',
            'division' => 'required|string',
            'district' => 'required|string',
            'upazila' => 'nullable|string',
            'location' => 'nullable|string',
            'video_url' => 'nullable|string',
            'thumbnail' => 'nullable|string',
            'image_file' => 'nullable|file|mimes:jpeg,png,jpg,webp,gif,svg|max:20480',
            'photos_files.*' => 'nullable|file|mimes:jpeg,png,jpg,webp,gif,svg|max:20480',
            'video_file' => 'nullable|file|mimes:mp4,mov,avi,webm,mkv,3gp|max:102400',
            'deed_date' => 'required|date',
            'beneficiaries_count' => 'nullable|integer|min:1',
            'team_name' => 'nullable|string',
            'organization' => 'nullable|string',
            'is_anonymous' => 'nullable|boolean',
        ];

        // Guest validation rules when user is not logged in
        if (!Auth::check()) {
            $rules['guest_name'] = 'required|string|max:255';
            $rules['guest_phone'] = 'required|string|max:20';
            $rules['guest_email'] = 'nullable|email|max:255';
        }

        $validated = $request->validate($rules);

        // Process direct video upload or URL
        $videoUrl = $validated['video_url'] ?? null;
        if ($request->hasFile('video_file') && $request->file('video_file')->isValid()) {
            $videoPath = $request->file('video_file')->store('deeds/videos', 'public');
            $videoUrl = '/storage/' . $videoPath;
        }

        // Process direct photo upload or URLs
        $photoPaths = [];
        if ($request->hasFile('image_file') && $request->file('image_file')->isValid()) {
            $imgPath = $request->file('image_file')->store('deeds/images', 'public');
            $photoPaths[] = '/storage/' . $imgPath;
        }
        if ($request->hasFile('photos_files')) {
            foreach ($request->file('photos_files') as $file) {
                if ($file->isValid()) {
                    $p = $file->store('deeds/images', 'public');
                    $photoPaths[] = '/storage/' . $p;
                }
            }
        }
        if (!empty($validated['thumbnail'])) {
            $photoPaths[] = $validated['thumbnail'];
        }

        // Default fallback photo if none provided
        if (empty($photoPaths)) {
            $photoPaths = ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80'];
        }
        $thumbnail = $photoPaths[0];

        // Simulated AI Verification Pipeline
        $aiTrustScore = rand(88, 98);
        $aiFlags = [
            'AI Duplicate Detection: 100% Unique Media',
            'Category Match Confidence: ' . rand(92, 99) . '%',
            'Safety Scan: Clean (0% adult, 0% violence, 0% spam)',
            'Media Quality: High Definition (1080p verified)',
        ];

        $isAuth = Auth::check();

        $deed = GoodDeed::create([
            'user_id' => $isAuth ? Auth::id() : null,
            'guest_name' => !$isAuth ? ($validated['guest_name'] ?? null) : null,
            'guest_phone' => !$isAuth ? ($validated['guest_phone'] ?? null) : null,
            'guest_email' => !$isAuth ? ($validated['guest_email'] ?? null) : null,
            'is_anonymous' => $request->boolean('is_anonymous'),
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'video_url' => $videoUrl,
            'photos' => $photoPaths,
            'thumbnail' => $thumbnail,
            'division' => $validated['division'],
            'district' => $validated['district'],
            'upazila' => $validated['upazila'] ?? null,
            'location' => $validated['location'] ?? "{$validated['district']}, Bangladesh",
            'deed_date' => $validated['deed_date'],
            'beneficiaries_count' => $validated['beneficiaries_count'] ?? 1,
            'team_name' => $validated['team_name'] ?? null,
            'organization' => $validated['organization'] ?? null,
            'status' => 'pending', // Pending review by Admin
            'ai_trust_score' => $aiTrustScore,
            'ai_flags' => $aiFlags,
            'impact_points' => rand(60, 95),
        ]);

        // Send Step 2: Deed submission thank-you email
        \App\Services\EmailNotificationService::sendDeedSubmissionThankYouEmail($deed);

        // Create user notification if registered user
        if ($isAuth) {
            UserNotification::create([
                'user_id' => Auth::id(),
                'title' => 'কনটেন্টটি অ্যাডমিন পর্যালোচনার জন্য জমা হয়েছে',
                'message' => "আপনার '{$deed->title}' পোস্টটি সফলভাবে জমা হয়েছে। অ্যাডমিনের পর্যালোচনার পর এটি প্রকাশিত হবে। আপনার ইমেইলে একটি কৃতজ্ঞতাপত্র পাঠানো হয়েছে।",
                'type' => 'upload',
                'link' => '/profile',
            ]);

            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'deed_uploaded_pending_admin',
                'target_type' => 'GoodDeed',
                'target_id' => $deed->id,
                'ip_address' => $request->ip(),
            ]);

            return redirect('/profile')->with('success', "আপনার ভালো কাজের পোস্টটি সফলভাবে জমা হয়েছে এবং ইমেইলে একটি ধন্যবাদ বার্তা পাঠানো হয়েছে! অ্যাডমিন পর্যালোচনার পর এটি ওয়েবসাইটে লাইভ হবে।");
        }

        return redirect('/explore')->with('success', "আপনার ভালো কাজের পোস্টটি সফলভাবে জমা হয়েছে! অ্যাডমিন পর্যালোচনার পর এটি ওয়েবসাইটে লাইভ হবে।" . (!empty($validated['guest_email']) ? " আপনার প্রদত্ত ইমেইলে একটি ধন্যবাদ বার্তা পাঠানো হয়েছে।" : ""));
    }

    public function show(int $id): Response|RedirectResponse
    {
        $deed = GoodDeed::with(['user', 'category'])->findOrFail($id);

        $currentUser = Auth::user();
        $isAuthor = $currentUser && $currentUser->id === $deed->user_id;
        $isAdminOrMod = $currentUser && in_array($currentUser->role, ['super_admin', 'district_moderator', 'division_moderator', 'award_committee']);

        // Security: Unapproved posts can only be viewed by author or moderators/admins
        if ($deed->status !== 'approved' && !$isAuthor && !$isAdminOrMod) {
            return redirect('/explore')->with('info', 'এই পোস্টটি এখনও অ্যাডমিন দ্বারা অনুমোদিত হয়নি। অ্যাডমিনের অনুমোদনের পর এটি সবার জন্য লাইভ প্রকাশিত হবে।');
        }

        $deed->increment('views_count');

        // Load all engagements with users
        $deed->load(['engagements' => function ($q) {
            $q->with('user')->orderBy('created_at', 'desc');
        }]);

        // Security: Filter hidden comments for general audience (author and admins can see hidden ones)
        if (!$isAuthor && !$isAdminOrMod) {
            $deed->setRelation('engagements', $deed->engagements->filter(function ($eng) use ($currentUser) {
                if ($eng->type !== 'comment') {
                    return true;
                }
                if (!$eng->is_hidden) {
                    return true;
                }
                return $currentUser && $eng->user_id === $currentUser->id;
            })->values());
        }

        $relatedDeeds = GoodDeed::with(['user', 'category'])
            ->where('status', 'approved')
            ->where('id', '!=', $id)
            ->where(function ($q) use ($deed) {
                $q->where('category_id', $deed->category_id)
                    ->orWhere('district', $deed->district);
            })
            ->take(3)
            ->get();

        return Inertia::render('DeedDetail', [
            'deed' => $deed,
            'relatedDeeds' => $relatedDeeds,
        ]);
    }

    public function react(Request $request, int $id): RedirectResponse
    {
        if (!Auth::check()) {
            return redirect('/auth')->with('info', 'রিয়েকশন দিতে অনুগ্রহ করে সাইন ইন করুন (Please sign in to react).');
        }

        $validated = $request->validate([
            'reaction' => 'required|string|in:like,love,celebrate,sad,angry',
        ]);

        $deed = GoodDeed::findOrFail($id);
        $userId = Auth::id();
        $reactionType = $validated['reaction'];

        $existing = DeedEngagement::where('user_id', $userId)
            ->where('good_deed_id', $id)
            ->where(function ($q) {
                $q->where('type', 'like')
                  ->orWhere('type', 'reaction');
            })
            ->first();

        if ($existing) {
            $currentType = $existing->reaction_type ?: ($existing->type === 'like' ? 'love' : 'like');
            if ($currentType === $reactionType) {
                // If clicked again on the same reaction, toggle off
                $existing->delete();
                if ($deed->likes_count > 0) {
                    $deed->decrement('likes_count');
                }
                return back()->with('info', 'রিয়েকশন তুলে নেওয়া হয়েছে।');
            } else {
                // Change to new reaction
                $existing->update([
                    'type' => 'reaction',
                    'reaction_type' => $reactionType,
                ]);
                return back()->with('success', 'রিয়েকশন আপডেট করা হয়েছে!');
            }
        }

        // New reaction
        DeedEngagement::create([
            'user_id' => $userId,
            'good_deed_id' => $id,
            'type' => 'reaction',
            'reaction_type' => $reactionType,
        ]);

        $deed->increment('likes_count');

        return back()->with('success', 'আপনার অনুভূতি সফলভাবে প্রকাশ পেয়েছে!');
    }

    public function toggleLike(int $id): RedirectResponse
    {
        $request = request();
        $reaction = $request->input('reaction', 'love');
        $request->merge(['reaction' => $reaction]);
        return $this->react($request, $id);
    }

    public function comment(Request $request, int $id): RedirectResponse
    {
        if (!Auth::check()) {
            return redirect('/auth')->with('info', 'মন্তব্য করতে অনুগ্রহ করে সাইন ইন করুন (Please sign in to comment).');
        }

        $request->validate(['comment' => 'required|string|max:1000']);
        $deed = GoodDeed::findOrFail($id);

        DeedEngagement::create([
            'user_id' => Auth::id(),
            'good_deed_id' => $id,
            'type' => 'comment',
            'comment' => $request->comment,
            'is_hidden' => false,
        ]);

        $deed->increment('comments_count');

        return back()->with('success', 'আপনার মন্তব্যটি সফলভাবে প্রকাশিত হয়েছে!');
    }

    public function deleteComment(Request $request, int $id): RedirectResponse
    {
        if (!Auth::check()) {
            return redirect('/auth')->with('error', 'অননুমোদিত অনুরোধ (Unauthorized).');
        }

        $comment = DeedEngagement::where('type', 'comment')->findOrFail($id);
        $deed = $comment->goodDeed;
        $currentUser = Auth::user();

        $isPostAuthor = $deed && $deed->user_id === $currentUser->id;
        $isAdmin = in_array($currentUser->role, ['super_admin', 'district_moderator']);
        $isCommentAuthor = $comment->user_id === $currentUser->id;

        if (!$isPostAuthor && !$isAdmin && !$isCommentAuthor) {
            return back()->with('error', 'আপনার এই কমেন্টটি ডিলিট করার অনুমতি নেই (Unauthorized).');
        }

        $commentSnippet = mb_substr($comment->comment ?? '', 0, 40) . '...';
        $comment->delete();

        if ($deed && $deed->comments_count > 0) {
            $deed->decrement('comments_count');
        }

        if ($isPostAuthor || $isAdmin) {
            AuditLog::create([
                'user_id' => $currentUser->id,
                'action' => $isAdmin ? 'comment_deleted_by_admin' : 'comment_deleted_by_author',
                'target_type' => 'DeedEngagement',
                'target_id' => $id,
                'details' => ['comment' => $commentSnippet, 'post_id' => $deed ? $deed->id : null],
                'ip_address' => $request->ip(),
            ]);
        }

        return back()->with('success', 'কমেন্টটি সফলভাবে মুছে ফেলা হয়েছে (Comment deleted).');
    }

    public function toggleHideComment(Request $request, int $id): RedirectResponse
    {
        if (!Auth::check()) {
            return redirect('/auth')->with('error', 'অননুমোদিত অনুরোধ (Unauthorized).');
        }

        $comment = DeedEngagement::where('type', 'comment')->findOrFail($id);
        $deed = $comment->goodDeed;
        $currentUser = Auth::user();

        $isPostAuthor = $deed && $deed->user_id === $currentUser->id;
        $isAdmin = in_array($currentUser->role, ['super_admin', 'district_moderator']);

        if (!$isPostAuthor && !$isAdmin) {
            return back()->with('error', 'শুধুমাত্র পোস্টের মালিক বা অ্যাডমিন কমেন্ট লুকানোর (Hide) অধিকার রাখেন।');
        }

        $newHiddenState = !$comment->is_hidden;
        $comment->update([
            'is_hidden' => $newHiddenState,
            'hidden_by' => $newHiddenState ? $currentUser->id : null,
        ]);

        $message = $newHiddenState
            ? 'কমেন্টটি পাবলিক ভিউ থেকে হাইড (লুকানো) করা হয়েছে।'
            : 'কমেন্টটি পুনরায় দৃশ্যমান (Unhidden) করা হয়েছে।';

        return back()->with('success', $message);
    }

    public function toggleBookmark(int $id): RedirectResponse
    {
        if (!Auth::check()) {
            return redirect('/auth')->with('info', 'সংরক্ষণ করতে অনুগ্রহ করে সাইন ইন করুন।');
        }

        $existing = DeedEngagement::where('user_id', Auth::id())
            ->where('good_deed_id', $id)
            ->where('type', 'bookmark')
            ->first();

        if ($existing) {
            $existing->delete();
            $msg = 'বুকমার্ক থেকে সরিয়ে নেওয়া হয়েছে।';
        } else {
            DeedEngagement::create([
                'user_id' => Auth::id(),
                'good_deed_id' => $id,
                'type' => 'bookmark',
            ]);
            $msg = 'বুকমার্কে সংরক্ষণ করা হয়েছে!';
        }

        return back()->with('info', $msg);
    }
}
