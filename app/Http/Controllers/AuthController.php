<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showAuth(Request $request): Response
    {
        $tab = in_array($request->query('tab'), ['signup', 'register']) ? 'register' : 'signin';
        return Inertia::render('Auth', [
            'defaultTab' => $tab,
        ]);
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
        ]);

        $field = filter_var($credentials['login'], FILTER_VALIDATE_EMAIL) ? 'email' : 'mobile';

        if (Auth::attempt([$field => $credentials['login'], 'password' => $credentials['password']], $request->boolean('remember'))) {
            $request->session()->regenerate();

            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'user_login',
                'target_type' => 'User',
                'target_id' => Auth::id(),
                'ip_address' => $request->ip(),
            ]);

            return redirect()->intended('/')->with('success', 'স্বাগতম! Welcome back to Valo Kaj Bangladesh.');
        }

        return back()->withErrors([
            'login' => 'Invalid email/mobile or password credentials.',
        ])->onlyInput('login');
    }

    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'mobile' => 'nullable|string|max:20|unique:users',
            'password' => 'required|string|min:6',
            'gender' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'division' => 'required|string',
            'district' => 'required|string',
            'upazila' => 'nullable|string',
            'organization' => 'nullable|string',
            'bio' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'mobile' => $validated['mobile'] ?? null,
            'password' => Hash::make($validated['password']),
            'gender' => $validated['gender'] ?? null,
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'division' => $validated['division'],
            'district' => $validated['district'],
            'upazila' => $validated['upazila'] ?? null,
            'organization' => $validated['organization'] ?? null,
            'bio' => $validated['bio'] ?? null,
            'avatar' => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
            'role' => 'user',
            'impact_score' => 50, // Welcome signup bonus
        ]);

        Auth::login($user);

        // Send Step 1 Welcome & Thank you email
        \App\Services\EmailNotificationService::sendRegistrationWelcomeEmail($user);

        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'user_registered',
            'target_type' => 'User',
            'target_id' => $user->id,
            'ip_address' => $request->ip(),
        ]);

        return redirect('/')->with('success', 'নিবন্ধন সফল হয়েছে! আপনার ইমেইলে স্বাগতম ও ধন্যবাদ বার্তা পাঠানো হয়েছে।');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('info', 'Logged out successfully.');
    }

    public function quickSwitchRole(Request $request, string $role): RedirectResponse
    {
        $roleMap = [
            'visitor' => null,
            'user' => 'rashida@valokaj.org',
            'district_moderator' => 'sylhet.mod@valokaj.org',
            'division_moderator' => 'div.mod@valokaj.org',
            'award_committee' => 'awards@valokaj.org',
            'super_admin' => 'admin@valokaj.org',
        ];

        if ($role === 'visitor') {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return back()->with('info', 'Switched to Visitor role (Guest).');
        }

        if (isset($roleMap[$role])) {
            $user = User::where('email', $roleMap[$role])->first();
            if ($user) {
                Auth::login($user);
                $request->session()->regenerate();
                return back()->with('success', "Role switched to: {$user->name} ({$role})");
            }
        }

        return back()->with('error', 'Unknown demo role.');
    }
}
