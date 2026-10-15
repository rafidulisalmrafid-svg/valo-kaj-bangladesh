<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('awards', function (Blueprint $table) {
            $table->id();
            $table->string('month');
            $table->integer('year');
            $table->string('level'); // district, division, national
            $table->string('rank_name'); // Champion, 1st Runner-up, 2nd Runner-up, National Hero
            $table->string('title');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('good_deed_id')->nullable()->constrained()->nullOnDelete();
            $table->string('district')->nullable();
            $table->string('division')->nullable();
            $table->text('citation');
            $table->string('badge_color')->default('gold');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('awards');
    }
};
