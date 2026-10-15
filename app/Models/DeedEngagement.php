<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeedEngagement extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'is_hidden' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function goodDeed(): BelongsTo
    {
        return $this->belongsTo(GoodDeed::class);
    }

    public function hiddenByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'hidden_by');
    }
}
