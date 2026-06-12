'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

const EFFECTIVE = 'June 2026';

const THIRD_PARTIES = [
  { name: 'Airwallex',  purpose_en: 'Payment processing and payout disbursement',                           purpose_id: 'Pemrosesan pembayaran dan distribusi pembayaran kepada host',            location: 'Hong Kong' },
  { name: 'DeepL',      purpose_en: 'Automatic Chinese↔English translation for listings and guest messages', purpose_id: 'Terjemahan otomatis Mandarin↔Inggris untuk listing dan pesan tamu',     location: 'Germany' },
  { name: 'PostHog',    purpose_en: 'Self-hosted product analytics (not shared externally)',                 purpose_id: 'Analitik produk yang di-host sendiri (tidak dibagikan secara eksternal)', location: 'Self-hosted' },
  { name: 'Resend',     purpose_en: 'Transactional email (booking notifications, account emails)',           purpose_id: 'Email transaksional (notifikasi pemesanan, email akun)',                  location: 'USA' },
  { name: 'Twilio',     purpose_en: 'SMS verification for international numbers',                            purpose_id: 'Verifikasi SMS untuk nomor internasional',                               location: 'USA' },
  { name: 'Cloudflare', purpose_en: 'File storage for listing photos and documents (Cloudflare R2)',         purpose_id: 'Penyimpanan file untuk foto listing dan dokumen (Cloudflare R2)',        location: 'USA' },
  { name: 'Mapbox',     purpose_en: 'Map display and address autocomplete in listing onboarding',            purpose_id: 'Tampilan peta dan pelengkapan otomatis alamat dalam orientasi listing',   location: 'USA' },
];

const SECTIONS = [
  {
    en: {
      title: '1. Data We Collect',
      body: [
        'Account information: your name, email address, phone number, and password (stored as a hash).',
        'Business information: your property address, banking details for payouts, and KYC identity documents.',
        'Listing content: photos, descriptions, pricing, availability, and amenity information you upload.',
        'Booking data: guest names, booking dates, payout amounts, and booking history.',
        'Messages: content of conversations with guests (stored in both original and DeepL-translated form).',
        'Usage data: dashboard interactions and feature usage, collected via our self-hosted PostHog analytics.',
        'Device information: browser type, IP address (used for security and session management).',
      ],
    },
    id: {
      title: '1. Data yang Kami Kumpulkan',
      body: [
        'Informasi akun: nama, alamat email, nomor telepon, dan kata sandi (disimpan dalam bentuk hash).',
        'Informasi bisnis: alamat properti, detail perbankan untuk pembayaran, dan dokumen identitas KYC.',
        'Konten listing: foto, deskripsi, harga, ketersediaan, dan informasi fasilitas yang Anda unggah.',
        'Data pemesanan: nama tamu, tanggal pemesanan, jumlah pembayaran, dan riwayat pemesanan.',
        'Pesan: konten percakapan dengan tamu (disimpan dalam bentuk asli dan terjemahan DeepL).',
        'Data penggunaan: interaksi dashboard dan penggunaan fitur, dikumpulkan melalui analitik PostHog yang di-host sendiri.',
        'Informasi perangkat: jenis browser, alamat IP (digunakan untuk keamanan dan manajemen sesi).',
      ],
    },
  },
  {
    en: {
      title: '2. How We Use Your Data',
      body: [
        '• Process and manage bookings made through your listings',
        '• Calculate and disburse payouts via Airwallex',
        '• Translate your listing content and guest messages via DeepL',
        '• Send booking notifications, payout confirmations, and account emails via Resend',
        '• Verify your identity and property during the KYC onboarding process',
        '• Analyse how hosts use the dashboard to improve the product (PostHog, self-hosted)',
        '• Detect and prevent fraud and unauthorised account access',
        '• Comply with Indonesian tax reporting and financial record-keeping obligations',
      ],
    },
    id: {
      title: '2. Cara Kami Menggunakan Data Anda',
      body: [
        '• Memproses dan mengelola pemesanan yang dilakukan melalui listing Anda',
        '• Menghitung dan mendistribusikan pembayaran melalui Airwallex',
        '• Menerjemahkan konten listing dan pesan tamu Anda melalui DeepL',
        '• Mengirim notifikasi pemesanan, konfirmasi pembayaran, dan email akun melalui Resend',
        '• Memverifikasi identitas dan properti Anda selama proses orientasi KYC',
        '• Menganalisis cara host menggunakan dashboard untuk meningkatkan produk (PostHog, di-host sendiri)',
        '• Mendeteksi dan mencegah penipuan dan akses akun yang tidak sah',
        '• Mematuhi pelaporan pajak Indonesia dan kewajiban pencatatan keuangan',
      ],
    },
  },
  {
    en: {
      title: '3. Guest Data You Access',
      body: [
        'When a booking is confirmed, we share the following guest information with you: guest name, contact phone number and email, number of guests, and special requests.',
        'This information is provided solely to facilitate the stay. You must not use it for marketing, sell it to third parties, or retain it longer than necessary.',
        'Guest contact details are not visible until after booking confirmation — this protects guest privacy and platform integrity.',
      ],
    },
    id: {
      title: '3. Data Tamu yang Dapat Anda Akses',
      body: [
        'Ketika pemesanan dikonfirmasi, kami membagikan informasi tamu berikut kepada Anda: nama tamu, nomor telepon dan email kontak, jumlah tamu, dan permintaan khusus.',
        'Informasi ini diberikan semata-mata untuk memfasilitasi masa inap. Anda tidak boleh menggunakannya untuk pemasaran, menjualnya kepada pihak ketiga, atau menyimpannya lebih lama dari yang diperlukan.',
        'Detail kontak tamu tidak terlihat sampai setelah konfirmasi pemesanan — ini melindungi privasi tamu dan integritas platform.',
      ],
    },
  },
  {
    en: {
      title: '4. Data Sharing',
      body: [
        'We do not sell your personal data. We share data with the following trusted service providers only to the extent necessary to operate the platform:',
      ],
    },
    id: {
      title: '4. Berbagi Data',
      body: [
        'Kami tidak menjual data pribadi Anda. Kami berbagi data dengan penyedia layanan terpercaya berikut hanya sejauh yang diperlukan untuk mengoperasikan platform:',
      ],
    },
    table: true,
  },
  {
    en: {
      title: '5. Data Retention',
      body: [
        'Account data: retained while your account is active, then soft-deleted for 90 days after closure, followed by permanent deletion.',
        'Booking and financial records: retained for 7 years to meet Indonesian and international tax and financial compliance requirements.',
        'Listing photos and content: deleted within 30 days of listing removal.',
        'Messages: retained for 3 years.',
        'KYC documents: retained for the duration required by applicable anti-money-laundering regulations.',
      ],
    },
    id: {
      title: '5. Retensi Data',
      body: [
        'Data akun: disimpan selama akun Anda aktif, kemudian dihapus secara lunak selama 90 hari setelah penutupan, diikuti dengan penghapusan permanen.',
        'Catatan pemesanan dan keuangan: disimpan selama 7 tahun untuk memenuhi persyaratan kepatuhan pajak dan keuangan Indonesia dan internasional.',
        'Foto listing dan konten: dihapus dalam 30 hari setelah listing dihapus.',
        'Pesan: disimpan selama 3 tahun.',
        'Dokumen KYC: disimpan selama yang diperlukan oleh peraturan anti-pencucian uang yang berlaku.',
      ],
    },
  },
  {
    en: {
      title: '6. Security',
      body: [
        'All data in transit is encrypted via HTTPS.',
        'Authentication tokens are stored in HttpOnly cookies — inaccessible to JavaScript, protecting against XSS attacks.',
        'Payout banking details are encrypted at rest.',
        'Listing photos are stored on Cloudflare R2 with enterprise-grade access controls.',
        'Passwords are hashed and never stored in plain text.',
        'We will notify you promptly if a data breach affects your account, as required by applicable law.',
      ],
    },
    id: {
      title: '6. Keamanan',
      body: [
        'Semua data dalam transit dienkripsi melalui HTTPS.',
        'Token autentikasi disimpan dalam cookie HttpOnly — tidak dapat diakses oleh JavaScript, melindungi dari serangan XSS.',
        'Detail perbankan pembayaran dienkripsi saat disimpan.',
        'Foto listing disimpan di Cloudflare R2 dengan kontrol akses tingkat enterprise.',
        'Kata sandi di-hash dan tidak pernah disimpan dalam teks biasa.',
        'Kami akan memberi tahu Anda segera jika terjadi pelanggaran data yang mempengaruhi akun Anda, sesuai hukum yang berlaku.',
      ],
    },
  },
  {
    en: {
      title: '7. Your Rights',
      body: [
        'Under applicable data protection law you have the right to:',
        '• Access: request a copy of the personal data we hold about you',
        '• Rectification: correct inaccurate or incomplete data',
        '• Erasure: request deletion of your data (subject to legal retention requirements)',
        '• Portability: receive your data in a machine-readable format',
        '• Object: object to processing based on legitimate interests',
        'To exercise these rights, email privacy@balivilla.com. We will respond within 30 days.',
      ],
    },
    id: {
      title: '7. Hak-Hak Anda',
      body: [
        'Di bawah undang-undang perlindungan data yang berlaku, Anda berhak untuk:',
        '• Akses: meminta salinan data pribadi yang kami simpan tentang Anda',
        '• Koreksi: memperbaiki data yang tidak akurat atau tidak lengkap',
        '• Penghapusan: meminta penghapusan data Anda (tunduk pada persyaratan penyimpanan hukum)',
        '• Portabilitas: menerima data Anda dalam format yang dapat dibaca mesin',
        '• Keberatan: keberatan terhadap pemrosesan berdasarkan kepentingan yang sah',
        'Untuk menggunakan hak-hak ini, email privacy@balivilla.com. Kami akan merespons dalam 30 hari.',
      ],
    },
  },
  {
    en: {
      title: '8. Cookies',
      body: [
        'access_token: An HttpOnly, Secure cookie used for authentication. Not accessible via JavaScript.',
        'bv-host-locale: Stores your language preference (English or Indonesian).',
        'PostHog analytics cookies: Track dashboard interactions to help us improve the product. You may opt out by contacting privacy@balivilla.com.',
      ],
    },
    id: {
      title: '8. Cookie',
      body: [
        'access_token: Cookie HttpOnly dan Aman yang digunakan untuk autentikasi. Tidak dapat diakses melalui JavaScript.',
        'bv-host-locale: Menyimpan preferensi bahasa Anda (Inggris atau Indonesia).',
        'Cookie analitik PostHog: Melacak interaksi dashboard untuk membantu kami meningkatkan produk. Anda dapat memilih keluar dengan menghubungi privacy@balivilla.com.',
      ],
    },
  },
  {
    en: {
      title: '9. International Data Transfers',
      body: [
        'Your data may be processed in: the USA (Cloudflare, Resend, Twilio), Germany (DeepL), and Hong Kong (Airwallex).',
        'Cross-border transfers are conducted under Standard Contractual Clauses (SCCs) or equivalent legally recognised safeguards.',
      ],
    },
    id: {
      title: '9. Transfer Data Internasional',
      body: [
        'Data Anda mungkin diproses di: Amerika Serikat (Cloudflare, Resend, Twilio), Jerman (DeepL), dan Hong Kong (Airwallex).',
        'Transfer lintas batas dilakukan berdasarkan Standard Contractual Clauses (SCC) atau perlindungan yang diakui secara hukum yang setara.',
      ],
    },
  },
  {
    en: {
      title: '10. Contact',
      body: [
        'Privacy enquiries: privacy@balivilla.com',
        'General host support: host-support@balivilla.com',
      ],
    },
    id: {
      title: '10. Kontak',
      body: [
        'Pertanyaan privasi: privacy@balivilla.com',
        'Dukungan host umum: host-support@balivilla.com',
      ],
    },
  },
];

export default function HostPrivacyPage() {
  const [lang, setLang] = useState('id');
  const isId = lang === 'id';

  return (
    <div className="min-h-screen bg-paper">
      <div className="bg-surface border-b border-rule">
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-xl bg-jade-soft flex items-center justify-center shrink-0">
                <Shield className="size-6 text-jade" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-medium text-ink">
                  {isId ? 'Kebijakan Privasi' : 'Privacy Policy'}
                </h1>
                <p className="text-sm text-ink-mute mt-1 italic">
                  {isId ? 'Privacy Policy' : 'Kebijakan Privasi'}
                </p>
                <p className="text-xs text-ink-mute mt-0.5">
                  {isId ? `Berlaku: ${EFFECTIVE}` : `Effective: ${EFFECTIVE}`}
                </p>
              </div>
            </div>
            <div className="flex rounded-lg border border-rule overflow-hidden shrink-0 mt-1">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${lang === 'en' ? 'bg-jade text-white' : 'text-ink-mute hover:text-ink'}`}
              >EN</button>
              <button
                onClick={() => setLang('id')}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${lang === 'id' ? 'bg-jade text-white' : 'text-ink-mute hover:text-ink'}`}
              >ID</button>
            </div>
          </div>
          <div className="mt-5 rounded-xl bg-warn/8 border border-warn/20 px-4 py-3">
            <p className="text-xs text-warn leading-relaxed">
              {isId
                ? '⚠ Dokumen ini adalah draf untuk referensi dan belum ditinjau oleh konsultan hukum. Akan diselesaikan sebelum publikasi resmi.'
                : '⚠ This document is a draft for reference only and has not yet been reviewed by legal counsel. It will be finalised before official publication.'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        <p className="text-sm text-ink-soft leading-relaxed">
          {isId
            ? 'Kebijakan Privasi ini menjelaskan cara BaliVilla mengumpulkan, menggunakan, dan melindungi informasi pribadi yang Anda berikan saat menggunakan Host Portal. Kebijakan ini mencakup data Anda sebagai host dan kewajiban Anda terkait data tamu yang Anda terima melalui platform.'
            : 'This Privacy Policy explains how BaliVilla collects, uses, and protects personal information you provide when using the Host Portal. It covers both your data as a host and your obligations regarding guest data you receive through the platform.'}
        </p>

        {SECTIONS.map((s, i) => {
          const t = s[lang];
          return (
            <div key={i} className="bg-surface rounded-xl border border-rule shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-rule bg-surface-alt">
                <h2 className="text-sm font-semibold text-ink">{t.title}</h2>
              </div>
              <div className="px-5 py-4 space-y-2.5">
                {t.body.map((line, j) =>
                  line.startsWith('•') ? (
                    <div key={j} className="flex gap-2 text-sm text-ink-soft leading-relaxed">
                      <span className="text-jade shrink-0 mt-0.5">•</span>
                      <span>{line.slice(2)}</span>
                    </div>
                  ) : (
                    <p key={j} className="text-sm text-ink-soft leading-relaxed">{line}</p>
                  )
                )}
                {s.table && (
                  <div className="mt-2 overflow-x-auto rounded-lg border border-rule">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-surface-alt border-b border-rule">
                          <th className="px-3 py-2 text-left font-semibold text-ink">
                            {isId ? 'Penyedia' : 'Provider'}
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-ink">
                            {isId ? 'Tujuan' : 'Purpose'}
                          </th>
                          <th className="px-3 py-2 text-left font-semibold text-ink">
                            {isId ? 'Lokasi' : 'Location'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {THIRD_PARTIES.map((tp, j) => (
                          <tr key={j} className="border-b border-rule last:border-0 hover:bg-surface-alt transition-colors">
                            <td className="px-3 py-2 font-medium text-ink whitespace-nowrap">{tp.name}</td>
                            <td className="px-3 py-2 text-ink-soft">{isId ? tp.purpose_id : tp.purpose_en}</td>
                            <td className="px-3 py-2 text-ink-mute whitespace-nowrap">{tp.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div className="text-center text-sm text-ink-mute pb-4 space-x-4">
          <Link href="/terms" className="hover:text-jade transition-colors">
            {isId ? 'Syarat Layanan Host' : 'Host Terms'}
          </Link>
          <span>·</span>
          <Link href="/login" className="hover:text-jade transition-colors">
            {isId ? 'Kembali ke Login' : 'Back to Login'}
          </Link>
        </div>
      </div>
    </div>
  );
}
