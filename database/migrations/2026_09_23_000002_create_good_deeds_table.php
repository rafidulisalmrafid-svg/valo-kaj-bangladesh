<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('good_deeds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('video_url')->nullable();
            $table->json('photos')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('division');
            $table->string('district');
            $table->string('upazila')->nullable();
            $table->string('location')->nullable();
            $table->string('google_map_url')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->date('deed_date');
            $table->integer('beneficiaries_count')->default(1);
            $table->string('team_name')->nullable();
            $table->string('organization')->nullable();
            $table->string('status')->default('pending'); // pending, approved, rejected, needs_info
            $table->integer('ai_trust_score')->default(85);
            $table->json('ai_flags')->nullable();
            $table->text('review_notes')->nullable();
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->integer('likes_count')->default(0);
            $table->integer('comments_count')->default(0);
            $table->integer('views_count')->default(0);
            $table->integer('impact_points')->default(50);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('good_deeds');
    }
};
