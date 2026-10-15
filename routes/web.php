<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AwardCommitteeController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\DeedController;
use App\Http\Controllers\DistrictModeratorController;
use App\Http\Controllers\DivisionModeratorController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/explore', [DeedController::class, 'index'])->name('explore');
Route::get('/deeds/{id}', [DeedController::class, 'show'])->name('deeds.show')->where('id', '[0-9]+');
Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard');
Route::get('/map', [MapController::class, 'index'])->name('map');
Route::get('/campaigns', [CampaignController::class, 'index'])->name('campaigns');
Route::get('/verify-certificate/{cert_no?}', [CertificateController::class, 'verify'])->name('certificate.verify');

// Auth & Role Switching
Route::get('/login', fn() => redirect('/auth?tab=signin'))->name('login');
Route::get('/register', fn() => redirect('/auth?tab=signup'))->name('register');
Route::get('/auth', [AuthController::class, 'showAuth'])->name('auth');
Route::post('/auth/login', [AuthController::class, 'login'])->name('auth.login');
Route::post('/auth/register', [AuthController::class, 'register'])->name('auth.register');
Route::post('/auth/logout', [AuthController::class, 'logout'])->name('auth.logout');
Route::get('/auth/switch-role/{role}', [AuthController::class, 'quickSwitchRole'])->name('auth.switch-role');

// Upload & Social Engagement (Multi-Reactions & Comments)
Route::get('/deeds/create', [DeedController::class, 'create'])->name('deeds.create');
Route::post('/deeds', [DeedController::class, 'store'])->name('deeds.store');
Route::post('/deeds/{id}/like', [DeedController::class, 'toggleLike'])->name('deeds.like');
Route::post('/deeds/{id}/react', [DeedController::class, 'react'])->name('deeds.react');
Route::post('/deeds/{id}/comment', [DeedController::class, 'comment'])->name('deeds.comment');
Route::delete('/comments/{id}', [DeedController::class, 'deleteComment'])->name('comments.delete');
Route::post('/comments/{id}/toggle-hide', [DeedController::class, 'toggleHideComment'])->name('comments.toggle-hide');
Route::post('/deeds/{id}/bookmark', [DeedController::class, 'toggleBookmark'])->name('deeds.bookmark');
Route::post('/campaigns/{id}/join', [CampaignController::class, 'join'])->name('campaigns.join');

// User Profile
Route::get('/profile', [ProfileController::class, 'index'])->name('profile');

// District Moderator Panel
Route::get('/moderator/district', [DistrictModeratorController::class, 'index'])->name('moderator.district');
Route::post('/moderator/district/{id}/approve', [DistrictModeratorController::class, 'approve'])->name('moderator.district.approve');
Route::post('/moderator/district/{id}/reject', [DistrictModeratorController::class, 'reject'])->name('moderator.district.reject');
Route::post('/moderator/district/{id}/request-info', [DistrictModeratorController::class, 'requestInfo'])->name('moderator.district.request-info');

// Division Moderator Panel
Route::get('/moderator/division', [DivisionModeratorController::class, 'index'])->name('moderator.division');

// Award Committee Panel
Route::get('/awards/committee', [AwardCommitteeController::class, 'index'])->name('awards.committee');
Route::post('/awards/grant', [AwardCommitteeController::class, 'grantAward'])->name('awards.grant');

// Super Admin Panel
Route::get('/admin', [AdminController::class, 'index'])->name('admin');
Route::post('/admin/users/{id}/role', [AdminController::class, 'updateUserRole'])->name('admin.users.role');
Route::post('/admin/deeds/{id}/approve', [AdminController::class, 'approveDeed'])->name('admin.deeds.approve');
Route::post('/admin/deeds/{id}/reject', [AdminController::class, 'rejectDeed'])->name('admin.deeds.reject');
Route::delete('/admin/comments/{id}', [AdminController::class, 'deleteComment'])->name('admin.comments.delete');
Route::post('/admin/email-templates/{id}', [AdminController::class, 'updateEmailTemplate'])->name('admin.email-templates.update');

// Organization Dashboard
Route::get('/organization', [OrganizationController::class, 'index'])->name('organization');
