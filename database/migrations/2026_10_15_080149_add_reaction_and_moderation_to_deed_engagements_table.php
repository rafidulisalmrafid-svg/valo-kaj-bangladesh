<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('deed_engagements', function (Blueprint $table) {
            $table->string('reaction_type')->nullable()->after('type'); // like, love, celebrate, sad, angry
            $table->boolean('is_hidden')->default(false)->after('comment');
            $table->foreignId('hidden_by')->nullable()->constrained('users')->nullOnDelete()->after('is_hidden');
            $table->string('moderation_note')->nullable()->after('hidden_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('deed_engagements', function (Blueprint $table) {
            $table->dropForeign(['hidden_by']);
            $table->dropColumn(['reaction_type', 'is_hidden', 'hidden_by', 'moderation_note']);
        });
    }
};
