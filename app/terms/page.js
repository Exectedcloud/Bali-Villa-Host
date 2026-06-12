'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';

const EFFECTIVE = 'June 2026';

const SECTIONS = [
  {
    en: {
      title: '1. Agreement to Terms',
      body: [
        'Welcome to BaliVilla Host Portal ("Portal", "we", "us"). By registering as a host and using this Portal, you agree to these Host Terms of Service ("Terms"). If you do not agree, do not register.',
        'We may update these Terms at any time. Material changes will be communicated by email. Continued use of the Portal after changes constitutes acceptance.',
      ],
    },
    id: {
      title: '1. Persetujuan Syarat',
      body: [
        'Selamat datang di BaliVilla Host Portal ("Portal", "kami"). Dengan mendaftar sebagai host dan menggunakan Portal ini, Anda menyetujui Syarat Layanan Host ini ("Syarat"). Jika Anda tidak setuju, jangan mendaftar.',
        'Kami dapat memperbarui Syarat ini kapan saja. Perubahan penting akan dikomunikasikan melalui email. Penggunaan Portal yang berkelanjutan setelah perubahan dianggap sebagai penerimaan.',
      ],
    },
  },
  {
    en: {
      title: '2. Platform Nature',
      body: [
        'BaliVilla operates a marketplace connecting Bali villa owners ("Hosts") with Chinese and international travellers ("Guests"). BaliVilla is not a party to any rental agreement between you and your guests.',
        'By listing on BaliVilla, you act as an independent property owner. You are solely responsible for the accuracy of your listing, the condition of your property, and compliance with Indonesian law.',
      ],
    },
    id: {
      title: '2. Sifat Platform',
      body: [
        'BaliVilla mengoperasikan marketplace yang menghubungkan pemilik villa di Bali ("Host") dengan wisatawan dari Tiongkok dan internasional ("Tamu"). BaliVilla bukan merupakan pihak dalam perjanjian sewa antara Anda dan tamu Anda.',
        'Dengan mendaftarkan listing di BaliVilla, Anda bertindak sebagai pemilik properti independen. Anda sepenuhnya bertanggung jawab atas keakuratan listing Anda, kondisi properti Anda, dan kepatuhan terhadap hukum Indonesia.',
      ],
    },
  },
  {
    en: {
      title: '3. Host Eligibility',
      body: [
        'To list on BaliVilla you must: (a) be at least 18 years old; (b) have the legal right to rent the property; (c) hold all applicable local licences and permits required for short-term rentals in Bali; (d) complete our identity and property verification (KYC) process.',
        'BaliVilla reserves the right to reject or remove listings that do not meet our standards or violate applicable law.',
      ],
    },
    id: {
      title: '3. Kelayakan Host',
      body: [
        'Untuk mendaftarkan listing di BaliVilla, Anda harus: (a) berusia minimal 18 tahun; (b) memiliki hak hukum untuk menyewakan properti; (c) memiliki semua lisensi dan izin lokal yang diperlukan untuk sewa jangka pendek di Bali; (d) menyelesaikan proses verifikasi identitas dan properti (KYC) kami.',
        'BaliVilla berhak menolak atau menghapus listing yang tidak memenuhi standar kami atau melanggar hukum yang berlaku.',
      ],
    },
  },
  {
    en: {
      title: '4. Listing Accuracy',
      body: [
        'You agree that all information in your listing — including photos, title, description, amenities, capacity, pricing, and house rules — is accurate, current, and not misleading.',
        'Providing materially false information (e.g. misrepresenting the number of bedrooms or amenities) may result in immediate listing removal and account suspension.',
        'BaliVilla uses DeepL to automatically translate your listing into Chinese for guests. You are responsible for ensuring the original content in English is accurate.',
      ],
    },
    id: {
      title: '4. Keakuratan Listing',
      body: [
        'Anda menyetujui bahwa semua informasi dalam listing Anda — termasuk foto, judul, deskripsi, fasilitas, kapasitas, harga, dan peraturan rumah — akurat, terkini, dan tidak menyesatkan.',
        'Memberikan informasi yang secara material tidak akurat (misalnya menyalahartikan jumlah kamar tidur atau fasilitas) dapat mengakibatkan penghapusan listing secara langsung dan penangguhan akun.',
        'BaliVilla menggunakan DeepL untuk menerjemahkan listing Anda ke bahasa Mandarin secara otomatis bagi tamu. Anda bertanggung jawab untuk memastikan konten asli dalam bahasa Inggris sudah akurat.',
      ],
    },
  },
  {
    en: {
      title: '5. Bookings and Availability',
      body: [
        'You must honour all confirmed bookings. Cancelling a confirmed booking without a legitimate reason may result in penalties, reduced listing visibility, and negative impact on your host rating.',
        'Keep your calendar up to date. BaliVilla is not responsible for double-bookings resulting from inaccurate availability.',
        'You must respond to guest enquiries within 24 hours. Persistent non-response may result in your listing being paused.',
      ],
    },
    id: {
      title: '5. Pemesanan dan Ketersediaan',
      body: [
        'Anda harus menghormati semua pemesanan yang telah dikonfirmasi. Membatalkan pemesanan yang dikonfirmasi tanpa alasan yang sah dapat mengakibatkan penalti, penurunan visibilitas listing, dan dampak negatif pada peringkat host Anda.',
        'Jaga kalender Anda tetap terkini. BaliVilla tidak bertanggung jawab atas pemesanan ganda yang diakibatkan oleh ketersediaan yang tidak akurat.',
        'Anda harus merespons pertanyaan tamu dalam 24 jam. Ketidakresponsifan yang terus-menerus dapat mengakibatkan listing Anda dijeda.',
      ],
    },
  },
  {
    en: {
      title: '6. Pricing and Fees',
      body: [
        'You set your own base price in Indonesian Rupiah (IDR). BaliVilla converts this to Chinese Yuan (CNY) for guest display using a live exchange rate sourced from Airwallex.',
        'BaliVilla charges a platform fee deducted from each booking payout. The applicable fee percentage is displayed in your host dashboard and confirmed at the time of listing publication.',
        'The exchange rate applied to your payout is locked at the time of booking confirmation and is shown on each booking detail page.',
      ],
    },
    id: {
      title: '6. Penetapan Harga dan Biaya',
      body: [
        'Anda menetapkan harga dasar sendiri dalam Rupiah Indonesia (IDR). BaliVilla mengonversinya ke Yuan Tiongkok (CNY) untuk tampilan tamu menggunakan nilai tukar langsung dari Airwallex.',
        'BaliVilla mengenakan biaya platform yang dipotong dari setiap pembayaran pemesanan. Persentase biaya yang berlaku ditampilkan di dashboard host Anda dan dikonfirmasi saat publikasi listing.',
        'Nilai tukar yang diterapkan pada pembayaran Anda dikunci pada saat konfirmasi pemesanan dan ditampilkan di setiap halaman detail pemesanan.',
      ],
    },
  },
  {
    en: {
      title: '7. Payouts',
      body: [
        'Payouts are made in IDR or USD to your registered bank account, typically within 3–5 business days after guest check-in.',
        'You must provide accurate banking information. BaliVilla is not responsible for failed payouts resulting from incorrect account details.',
        'Payouts may be withheld if there is an active dispute, a chargeback, or a suspected violation of these Terms.',
      ],
    },
    id: {
      title: '7. Pembayaran kepada Host',
      body: [
        'Pembayaran dilakukan dalam IDR atau USD ke rekening bank terdaftar Anda, biasanya dalam 3–5 hari kerja setelah tamu check-in.',
        'Anda harus memberikan informasi perbankan yang akurat. BaliVilla tidak bertanggung jawab atas kegagalan pembayaran yang diakibatkan oleh detail rekening yang salah.',
        'Pembayaran dapat ditahan jika terdapat sengketa aktif, chargeback, atau dugaan pelanggaran Syarat ini.',
      ],
    },
  },
  {
    en: {
      title: '8. Cancellation Policies',
      body: [
        'You choose one of three cancellation policies for each listing — Flexible, Moderate, or Strict. These are clearly displayed to guests before booking.',
        '• Flexible: Guests receive a full refund if they cancel at least 24 hours before check-in.',
        '• Moderate: Full refund up to 5 days before check-in; 50% refund within 1–5 days.',
        '• Strict: 50% refund if cancelled at least 14 days before check-in; no refund within 14 days.',
        'Service fees are non-refundable regardless of the policy. If you cancel a confirmed booking, the guest receives a full refund.',
      ],
    },
    id: {
      title: '8. Kebijakan Pembatalan',
      body: [
        'Anda memilih salah satu dari tiga kebijakan pembatalan untuk setiap listing — Fleksibel, Moderat, atau Ketat. Kebijakan ini ditampilkan dengan jelas kepada tamu sebelum pemesanan.',
        '• Fleksibel: Tamu mendapatkan pengembalian dana penuh jika membatalkan setidaknya 24 jam sebelum check-in.',
        '• Moderat: Pengembalian dana penuh hingga 5 hari sebelum check-in; pengembalian dana 50% dalam 1–5 hari.',
        '• Ketat: Pengembalian dana 50% jika dibatalkan setidaknya 14 hari sebelum check-in; tidak ada pengembalian dana dalam 14 hari.',
        'Biaya layanan tidak dapat dikembalikan terlepas dari kebijakan yang dipilih. Jika Anda membatalkan pemesanan yang dikonfirmasi, tamu mendapatkan pengembalian dana penuh.',
      ],
    },
  },
  {
    en: {
      title: '9. Guest Communication',
      body: [
        'All guest communication through BaliVilla\'s messaging system is automatically translated between Chinese and English via DeepL. You are responsible for the accuracy and professionalism of your messages.',
        'You must not share personal contact details (phone number, email, WhatsApp) with guests before a booking is confirmed, or attempt to take payments outside the platform.',
      ],
    },
    id: {
      title: '9. Komunikasi dengan Tamu',
      body: [
        'Semua komunikasi tamu melalui sistem pesan BaliVilla diterjemahkan secara otomatis antara bahasa Mandarin dan Inggris via DeepL. Anda bertanggung jawab atas keakuratan dan profesionalisme pesan Anda.',
        'Anda tidak boleh membagikan detail kontak pribadi (nomor telepon, email, WhatsApp) kepada tamu sebelum pemesanan dikonfirmasi, atau mencoba melakukan pembayaran di luar platform.',
      ],
    },
  },
  {
    en: {
      title: '10. Property Standards and Safety',
      body: [
        'Your villa must meet local health and safety standards. This includes working smoke detectors, safe electrical installations, clean water supply, and compliance with applicable Bali/Indonesian safety regulations.',
        'You are solely responsible for any accidents, injuries, or property damage that occur at your villa. BaliVilla strongly recommends adequate property and liability insurance.',
      ],
    },
    id: {
      title: '10. Standar Properti dan Keselamatan',
      body: [
        'Villa Anda harus memenuhi standar kesehatan dan keselamatan lokal. Ini termasuk detektor asap yang berfungsi, instalasi listrik yang aman, pasokan air bersih, dan kepatuhan terhadap peraturan keselamatan Bali/Indonesia yang berlaku.',
        'Anda sepenuhnya bertanggung jawab atas kecelakaan, cedera, atau kerusakan properti yang terjadi di villa Anda. BaliVilla sangat menyarankan asuransi properti dan tanggung jawab yang memadai.',
      ],
    },
  },
  {
    en: {
      title: '11. Intellectual Property',
      body: [
        'You retain ownership of the photos and descriptions you upload. By listing on BaliVilla, you grant us a non-exclusive, royalty-free licence to display and promote your listing content on the Platform and in marketing materials.',
        'You may not use BaliVilla\'s logo, brand name, or any Platform content without our prior written consent.',
      ],
    },
    id: {
      title: '11. Kekayaan Intelektual',
      body: [
        'Anda memiliki hak atas foto dan deskripsi yang Anda unggah. Dengan mendaftar di BaliVilla, Anda memberikan kami lisensi non-eksklusif, bebas royalti untuk menampilkan dan mempromosikan konten listing Anda di Platform dan dalam materi pemasaran.',
        'Anda tidak boleh menggunakan logo, nama merek BaliVilla, atau konten Platform apa pun tanpa persetujuan tertulis kami sebelumnya.',
      ],
    },
  },
  {
    en: {
      title: '12. Termination',
      body: [
        'Either party may terminate this agreement at any time. You may remove your listings and close your account from the dashboard settings.',
        'BaliVilla may suspend or terminate your account immediately if you: violate these Terms; receive sustained poor guest reviews; engage in fraudulent activity; or fail our KYC process.',
        'Outstanding obligations — including paying out confirmed bookings in progress — survive termination.',
      ],
    },
    id: {
      title: '12. Penghentian',
      body: [
        'Salah satu pihak dapat mengakhiri perjanjian ini kapan saja. Anda dapat menghapus listing dan menutup akun dari pengaturan dashboard.',
        'BaliVilla dapat menangguhkan atau mengakhiri akun Anda segera jika Anda: melanggar Syarat ini; menerima ulasan tamu yang terus-menerus buruk; terlibat dalam aktivitas penipuan; atau gagal dalam proses KYC kami.',
        'Kewajiban yang masih berlaku — termasuk pembayaran untuk pemesanan yang sedang berjalan — tetap berlaku setelah penghentian.',
      ],
    },
  },
  {
    en: {
      title: '13. Limitation of Liability',
      body: [
        'BaliVilla\'s total liability to you for any claim arising from the use of this Portal is limited to the platform fees paid by you in the 12 months preceding the claim.',
        'We are not liable for: lost bookings due to platform downtime; exchange rate fluctuations; actions or omissions of guests; or events beyond our reasonable control.',
      ],
    },
    id: {
      title: '13. Batasan Tanggung Jawab',
      body: [
        'Total tanggung jawab BaliVilla kepada Anda untuk setiap klaim yang timbul dari penggunaan Portal ini dibatasi pada biaya platform yang dibayarkan oleh Anda dalam 12 bulan sebelum klaim.',
        'Kami tidak bertanggung jawab atas: kehilangan pemesanan akibat gangguan platform; fluktuasi nilai tukar; tindakan atau kelalaian tamu; atau kejadian di luar kendali wajar kami.',
      ],
    },
  },
  {
    en: {
      title: '14. Governing Law',
      body: [
        'These Terms are governed by the laws of Singapore. Disputes shall be resolved by arbitration at the Singapore International Arbitration Centre (SIAC).',
      ],
    },
    id: {
      title: '14. Hukum yang Berlaku',
      body: [
        'Syarat ini diatur oleh hukum Singapura. Sengketa diselesaikan melalui arbitrase di Singapore International Arbitration Centre (SIAC).',
      ],
    },
  },
  {
    en: {
      title: '15. Contact',
      body: [
        'For questions about these Terms: legal@balivilla.com',
        'For host support: host-support@balivilla.com',
      ],
    },
    id: {
      title: '15. Kontak',
      body: [
        'Pertanyaan tentang Syarat ini: legal@balivilla.com',
        'Dukungan host: host-support@balivilla.com',
      ],
    },
  },
];

function isBullet(line) {
  return line.startsWith('•');
}

export default function HostTermsPage() {
  const [lang, setLang] = useState('id');
  const isId = lang === 'id';

  return (
    <div className="min-h-screen bg-paper">
      <div className="bg-surface border-b border-rule">
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-xl bg-jade-soft flex items-center justify-center shrink-0">
                <FileText className="size-6 text-jade" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-medium text-ink">
                  {isId ? 'Syarat Layanan Host' : 'Host Terms of Service'}
                </h1>
                <p className="text-sm text-ink-mute mt-1 italic">
                  {isId ? 'Host Terms of Service' : 'Syarat Layanan Host'}
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
            ? 'Syarat Host ini mengatur penggunaan BaliVilla Host Portal dan pendaftaran properti di platform BaliVilla. Harap baca dengan cermat sebelum mendaftar.'
            : 'These Host Terms govern your use of the BaliVilla Host Portal and your listing of properties on the BaliVilla platform. Please read them carefully before registering.'}
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
                  isBullet(line) ? (
                    <div key={j} className="flex gap-2 text-sm text-ink-soft leading-relaxed">
                      <span className="text-jade shrink-0 mt-0.5">•</span>
                      <span>{line.slice(2)}</span>
                    </div>
                  ) : (
                    <p key={j} className="text-sm text-ink-soft leading-relaxed">{line}</p>
                  )
                )}
              </div>
            </div>
          );
        })}

        <div className="text-center text-sm text-ink-mute pb-4 space-x-4">
          <Link href="/privacy" className="hover:text-jade transition-colors">
            {isId ? 'Kebijakan Privasi' : 'Privacy Policy'}
          </Link>
          <span>·</span>
          <Link href="/dashboard" className="hover:text-jade transition-colors">
            {isId ? 'Kembali ke Dashboard' : 'Back to Dashboard'}
          </Link>
        </div>
      </div>
    </div>
  );
}
