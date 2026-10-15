<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('title_bn');
            $table->text('description');
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('banner')->nullable();
            $table->string('division')->nullable();
            $table->string('district')->nullable();
            $table->integer('target_beneficiaries')->default(1000);
            $table->integer('current_beneficiaries')->default(0);
            $table->integer('target_deeds')->default(50);
            $table->integer('current_deeds')->default(0);
            $table->string('organizer_name')->default('Valo Kaj Bangladesh');
            $table->foreignId('organizer_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status')->default('active'); // active, upcoming, completed
            $table->timestamps();
        });

        Schema::create('campaign_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('deeds_count')->default(0);
            $table->timestamps();

            $table->unique(['campaign_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_participants');
        Schema::dropIfExists('campaigns');
    }
};
