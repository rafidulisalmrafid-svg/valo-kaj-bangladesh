<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('deed_engagements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('good_deed_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // like, bookmark, comment, share, report
            $table->text('comment')->nullable();
            $table->string('report_reason')->nullable();
            $table->timestamps();

            $table->index(['good_deed_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('deed_engagements');
    }
};
