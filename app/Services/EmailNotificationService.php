<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\EmailTemplate;
use App\Models\GoodDeed;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class EmailNotificationService
{
    /**
     * Send welcome and thank you email after registration
     */
    public static function sendRegistrationWelcomeEmail(User $user): bool
    {
        if (empty($user->email)) {
            return false;
        }

        try {
            $template = EmailTemplate::where('key', 'registration_welcome')
                ->where('is_active', true)
                ->first();

            $subject = $template ? $template->subject : 'ভালো কাজ বাংলাদেশে আপনাকে উষ্ণ স্বাগতম ও ধন্যবাদ!';
            $body = $template ? $template->body : "প্রিয় {name},\n\nভালো কাজ বাংলাদেশে নিবন্ধন করার জন্য আপনাকে আন্তরিক ধন্যবাদ।";
            $fromEmail = $template ? $template->sender_email : 'rafidul.labar.bd@gmail.com';
            $fromName = $template ? $template->sender_name : 'ভালো কাজ বাংলাদেশ';

            // Replace dynamic placeholders
            $body = str_replace(
                ['{name}', '{email}'],
                [$user->name, $user->email],
                $body
            );

            $html = self::renderHtmlEmail($subject, $body, $user->name);

            // Send Email with both HTML and plain-text fallback
            Mail::html($html, function ($message) use ($user, $subject, $fromEmail, $fromName, $body) {
                $message->to($user->email, $user->name)
                    ->from($fromEmail, $fromName)
                    ->replyTo($fromEmail, $fromName)
                    ->subject($subject)
                    ->text($body);
            });

            Log::info("Registration welcome email dispatched to {$user->email} from {$fromEmail}");

            return true;
        } catch (\Throwable $e) {
            Log::error("Failed sending registration welcome email to {$user->email}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send thank you email after submitting a good deed history
     */
    public static function sendDeedSubmissionThankYouEmail(GoodDeed $deed): bool
    {
        // Determine recipient email and name
        $recipientEmail = null;
        $recipientName = null;

        if ($deed->user_id && $deed->user) {
            $recipientEmail = $deed->user->email;
            $recipientName = $deed->user->name;
        } elseif (!empty($deed->guest_email)) {
            $recipientEmail = $deed->guest_email;
            $recipientName = $deed->guest_name ?: 'সম্মানিত শুভাকাঙ্ক্ষী';
        }

        // If no email provided (guest without email), do not fail, just return false
        if (empty($recipientEmail)) {
            Log::info("No email provided for Deed #{$deed->id} submission thank-you notification.");
            return false;
        }

        try {
            $template = EmailTemplate::where('key', 'deed_submission_thank_you')
                ->where('is_active', true)
                ->first();

            $subject = $template ? $template->subject : 'আপনার ভালো কাজের বিবরণ সফলভাবে জমা হয়েছে — আন্তরিক ধন্যবাদ!';
            $body = $template ? $template->body : "প্রিয় {name},\n\nআপনার ভালো কাজ '{title}' এর বিবরণ সফলভাবে জমা হয়েছে। আপনাকে অশেষ ধন্যবাদ।";
            $fromEmail = $template ? $template->sender_email : 'rafidul.labar.bd@gmail.com';
            $fromName = $template ? $template->sender_name : 'ভালো কাজ বাংলাদেশ';

            // Replace placeholders
            $body = str_replace(
                ['{name}', '{title}', '{district}', '{division}'],
                [$recipientName, $deed->title, $deed->district, $deed->division],
                $body
            );

            $subject = str_replace(
                ['{name}', '{title}'],
                [$recipientName, $deed->title],
                $subject
            );

            $html = self::renderHtmlEmail($subject, $body, $recipientName);

            // Send Email with both HTML and plain-text fallback
            Mail::html($html, function ($message) use ($recipientEmail, $recipientName, $subject, $fromEmail, $fromName, $body) {
                $message->to($recipientEmail, $recipientName)
                    ->from($fromEmail, $fromName)
                    ->replyTo($fromEmail, $fromName)
                    ->subject($subject)
                    ->text($body);
            });

            Log::info("Deed submission thank-you email sent to {$recipientEmail} for Deed #{$deed->id} from {$fromEmail}");

            AuditLog::create([
                'user_id' => $deed->user_id,
                'action' => 'thank_you_email_sent',
                'target_type' => 'GoodDeed',
                'target_id' => $deed->id,
                'details' => ['recipient' => $recipientEmail, 'from' => $fromEmail],
            ]);

            return true;
        } catch (\Throwable $e) {
            Log::error("Failed sending deed submission thank-you email to {$recipientEmail}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Render responsive branded HTML template for emails
     */
    private static function renderHtmlEmail(string $title, string $bodyText, string $recipientName): string
    {
        $escapedBody = nl2br(htmlspecialchars($bodyText, ENT_QUOTES, 'UTF-8'));
        $year = date('Y');

        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$title}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <!-- Header -->
        <tr>
            <td style="padding: 28px 32px; background: #059669; text-align: center; color: #ffffff;">
                <h1 style="margin: 0; font-size: 22px; font-weight: 800;">ভালো কাজ বাংলাদেশ</h1>
                <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">মানবতার জয়গান, ইতিবাচকতার সমাজ</p>
            </td>
        </tr>

        <!-- Content Body -->
        <tr>
            <td style="padding: 36px 32px; background-color: #ffffff;">
                <div style="font-size: 15px; line-height: 1.8; color: #334155;">
                    {$escapedBody}
                </div>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="padding: 20px 32px; background-color: #f1f5f9; border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="margin: 0 0 4px; font-size: 12px; color: #64748b; font-weight: 600;">
                    ভালো কাজ বাংলাদেশ পরিষদ | rafidul.labar.bd@gmail.com
                </p>
                <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                    &copy; {$year} Valo Kaj Bangladesh. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;
    }
}
