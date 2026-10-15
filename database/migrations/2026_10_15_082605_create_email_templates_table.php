<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('email_templates', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('name');
            $table->string('subject');
            $table->text('body');
            $table->string('sender_email')->default('rafidul.labar.bd@gmail.com');
            $table->string('sender_name')->default('ভালো কাজ বাংলাদেশ');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Insert initial default templates
        DB::table('email_templates')->insert([
            [
                'key' => 'registration_welcome',
                'name' => 'সফল রেজিস্ট্রেশন স্বাগতম ও ধন্যবাদ বার্তা',
                'subject' => 'ভালো কাজ বাংলাদেশে আপনাকে উষ্ণ স্বাগতম ও ধন্যবাদ!',
                'body' => "প্রিয় {name},\n\nভালো কাজ বাংলাদেশ প্ল্যাটফর্মে সফলভাবে নিবন্ধন করার জন্য আপনাকে আন্তরিক ধন্যবাদ ও মোবারকবাদ।\n\nআমাদের এই প্ল্যাটফর্মের মূল লক্ষ্য হলো দেশের প্রতিটি জেলা-উপজেলায় মানুষের নিঃস্বার্থ মানবিক উদ্যোগ ও ইতিবাচক কর্মকাণ্ডকে এক সুতোয় বেঁধে অনুপ্রাণিত করা।\n\nআপনি এখন থেকে যেকোনো সময় আপনার চারপাশের যেকোনো ভালো কাজ, সমাজসেবা ও অনুপ্রেরণাদায়ী কাজের বিবরণ এখানে আপলোড করতে পারবেন।\n\nআসুন, একসঙ্গে ছড়িয়ে দিই ইতিবাচকতার বার্তা।\n\nশুভেচ্ছান্তে,\nভালো কাজ বাংলাদেশ পরিষদ\nইমেইল: rafidul.labar.bd@gmail.com",
                'sender_email' => 'rafidul.labar.bd@gmail.com',
                'sender_name' => 'ভালো কাজ বাংলাদেশ',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'deed_submission_thank_you',
                'name' => 'ভালো কাজ আপলোড ধন্যবাদ ও স্বীকৃতি বার্তা',
                'subject' => 'আপনার ভালো কাজের বিবরণ সফলভাবে জমা হয়েছে — আন্তরিক ধন্যবাদ!',
                'body' => "প্রিয় {name},\n\nআপনার সুন্দর উদ্যোগ ও ভালো কাজের বিবরণ '{title}' সফলভাবে ভালো কাজ বাংলাদেশ প্ল্যাটফর্মে জমা হয়েছে।\n\nআমাদের প্ল্যাটফর্মের স্বচ্ছতা ও সামাজিক মানদণ্ড বজায় রাখতে আপনার আপলোড করা পোস্টটি বর্তমানে অ্যাডমিন/মডারেশন পর্যালোচনায় রয়েছে। অ্যাডমিন কর্তৃক তথ্য ও প্রমাণাদি যাচাইয়ের পর এটি ওয়েবসাইটে সবার জন্য লাইভ প্রকাশিত হবে।\n\nমানবকল্যাণে আপনার এমন নিঃস্বার্থ অবদান সমাজকে আলোকিত করবে। মানবিক বাংলাদেশ বিনির্মাণে পাশে থাকার জন্য আপনাকে অশেষ ধন্যবাদ।\n\nকৃতজ্ঞতায়,\nভালো কাজ বাংলাদেশ টিম\nযোগাযোগ: rafidul.labar.bd@gmail.com",
                'sender_email' => 'rafidul.labar.bd@gmail.com',
                'sender_name' => 'ভালো কাজ বাংলাদেশ',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_templates');
    }
};
