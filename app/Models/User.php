<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $guarded = ['id'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'social_links' => 'array',
            'impact_score' => 'integer',
        ];
    }

    public function goodDeeds(): HasMany
    {
        return $this->hasMany(GoodDeed::class);
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    public function awards(): HasMany
    {
        return $this->hasMany(Award::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(UserNotification::class);
    }

    public function engagements(): HasMany
    {
        return $this->hasMany(DeedEngagement::class);
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    public function isDivisionModerator(): bool
    {
        return $this->role === 'division_moderator' || $this->isSuperAdmin();
    }

    public function isDistrictModerator(): bool
    {
        return in_array($this->role, ['district_moderator', 'division_moderator', 'super_admin']);
    }

    public function isAwardCommittee(): bool
    {
        return $this->role === 'award_committee' || $this->isSuperAdmin();
    }
}
