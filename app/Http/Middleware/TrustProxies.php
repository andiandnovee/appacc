<?php

namespace App\Http\Middleware;

// ✅ Pakai middleware bawaan Laravel (bukan fideloper)
use Illuminate\Http\Middleware\TrustProxies as Middleware;

// ✅ Konstanta header diambil dari Symfony Request
use Symfony\Component\HttpFoundation\Request as SymfonyRequest;

class TrustProxies extends Middleware
{
    /**
     * Daftar proxy yang dipercaya.
     *
     * Nilai '*' artinya percaya semua proxy (aman untuk Codespaces,
     * tetapi sebaiknya dipersempit di produksi Anda sendiri).
     *
     * @var array<int, string>|string|null
     */
    protected $proxies = '*';

    /**
     * Header yang dipakai untuk mendeteksi informasi dari reverse proxy.
     *
     * Kita aktifkan semua header "X-Forwarded-*", termasuk varian AWS/ELB,
     * agar Laravel membaca host/proto/port asli dari Codespaces.
     *
     * @var int
     */
    protected $headers =
        SymfonyRequest::HEADER_X_FORWARDED_FOR
        | SymfonyRequest::HEADER_X_FORWARDED_HOST
        | SymfonyRequest::HEADER_X_FORWARDED_PROTO
        | SymfonyRequest::HEADER_X_FORWARDED_PORT
        | SymfonyRequest::HEADER_X_FORWARDED_AWS_ELB;
}
