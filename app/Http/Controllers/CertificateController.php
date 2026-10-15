<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function verify(Request $request, ?string $certNo = null): Response
    {
        $search = $certNo ?: $request->query('number', 'VKB-2026-04829');

        $certificate = Certificate::with(['user', 'goodDeed'])
            ->where('certificate_number', $search)
            ->orWhere('verification_token', $search)
            ->first();

        return Inertia::render('VerifyCertificate', [
            'certificate' => $certificate,
            'queriedNumber' => $search,
        ]);
    }
}
