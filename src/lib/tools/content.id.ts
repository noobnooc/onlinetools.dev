import type { ToolContent } from './content';

/**
 * Indonesian long-form tool copy (About + FAQ). Written entry by entry
 * against the English content.ts; anything missing falls back to English.
 */
const TOOL_CONTENT_ID: Record<string, ToolContent> = {
	'json-formatter': {
		about: [
			'Tempel JSON apa pun — respons API, berkas konfigurasi, sebaris log — dan perapi ini akan mencetaknya dengan indentasi pilihan Anda, atau memadatkannya untuk disisipkan ke dalam kode. Penguraiannya memakai mesin JSON bawaan browser, jadi apa yang lolos validasi di sini persis sama dengan yang akan diterima JavaScript dan setiap pengurai yang patuh pada JSON.',
			'Ketika masukannya tidak valid, galat ditandai dengan baris dan kolom persis tempat penguraian gagal, alih-alih “unexpected token” yang samar entah di mana. Digabung dengan editor berhuruf lebar tetap, memburu koma yang hilang di dalam muatan 500 baris menjadi pekerjaan sepuluh detik. Anda juga bisa mengurutkan kunci objek secara alfabetis, yang sangat membantu sebelum membandingkan dua muatan.',
			'Perapian berjalan sepenuhnya di browser Anda. Muatan yang berisi token, catatan pelanggan, atau URL internal tidak pernah meninggalkan mesin Anda — tidak ada server yang bisa mencatatnya.'
		],
		faqs: [
			{
				q: 'Kenapa JSON saya gagal dengan “Unexpected token” padahal terlihat baik-baik saja?',
				a: 'Biang keladi yang biasa: koma menggantung setelah elemen terakhir, tanda kutip tunggal alih-alih ganda, kunci tanpa tanda kutip, atau komentar. Semuanya sah di literal objek JavaScript (atau JSON5), tetapi tidak di JSON yang ketat. Penanda baris/kolom menunjuk karakter bermasalah yang pertama.'
			},
			{
				q: 'Apakah ada batas ukuran?',
				a: 'Tidak ada batas keras — penguraian berjalan lokal, jadi bergantung pada mesin Anda. Dokumen hingga puluhan megabita terformat dengan baik di browser modern; di atas itu tab bisa melambat karena seluruh dokumen ditahan di memori.'
			},
			{
				q: 'Apakah perapian mengubah data saya?',
				a: 'Hanya spasi, kecuali Anda menyalakan pengurutan kunci. Angka diserialkan ulang oleh mesin JavaScript, jadi 1e2 menjadi 100 dan bilangan bulat di luar presisi ganda IEEE-754 dinormalkan — persis yang akan dilakukan konsumen JSON Anda mana pun yang berbasis JS.'
			},
			{
				q: 'Bisakah saya memvalidasi JSON tanpa memformat ulang?',
				a: 'Bisa — lencana status di atas kolom masukan diperbarui sambil Anda mengetik dan melaporkan apakah dokumennya terurai, berapa ukurannya, dan di mana galat pertamanya. Tombol Rapikan baru Anda perlukan bila memang ingin keluarannya ditulis ulang.'
			}
		]
	},

	'base64-decode': {
		about: [
			'Base64 mengubah bita sembarang menjadi alfabet 64 karakter yang selamat saat ditempel ke JSON, URL, header HTTP, dan surel. Alat ini bekerja dua arah: ketik atau tempel teks untuk mengenkodenya, atau tempel gumpalan terenkode untuk mendapatkan aslinya kembali. UTF-8 ditangani dengan benar di kedua arah, jadi emoji dan aksara non-Latin bolak-balik tanpa rusak.',
			'Pendekodenya sengaja dibuat pemaaf: ia menerima alfabet aman-URL (- dan _ menggantikan + dan /), membuang spasi serta ganti baris, dan mengembalikan padding yang hilang sebelum mendekode — tiga hal yang paling sering membuat pendekode lain menolak masukan yang sebenarnya masih bisa dipulihkan. Kalau bita hasil dekode ternyata bukan teks UTF-8 yang sah, alat ini mengatakannya alih-alih mencetak karakter kacau; biasanya itu berarti muatannya adalah data biner seperti gambar.',
			'Semuanya terjadi di dalam halaman. Mendekode token atau kredensial di sini tidak mengirimkannya ke mana pun.'
		],
		faqs: [
			{
				q: 'Kenapa string Base64 saya diakhiri tanda =?',
				a: 'Base64 mengenkode 3 bita menjadi 4 karakter, jadi ketika panjang masukan bukan kelipatan 3, keluarannya diberi padding = agar kelompoknya tetap sejajar. Padding tidak membawa data; pendekode ini memulihkannya otomatis jika sebelumnya dibuang.'
			},
			{
				q: 'Apa bedanya Base64 standar dan Base64 aman-URL?',
				a: 'Base64 standar memakai + dan /, yang punya makna khusus di dalam URL dan harus di-escape lagi. Varian aman-URL (RFC 4648 §5) menukarnya dengan - dan _ dan biasanya membuang padding. JWT, misalnya, memakai bentuk aman-URL. Enkodernya di sini menyediakan keduanya; pendekodenya menerima keduanya secara otomatis.'
			},
			{
				q: 'Apakah Base64 termasuk enkripsi?',
				a: 'Bukan. Base64 adalah pengodean yang bisa dibalik dan tanpa kunci — siapa pun bisa mendekodenya. Ia melindungi data dari kerusakan saat pengiriman, bukan dari dibaca orang. Kalau Anda butuh kerahasiaan, enkripsi dulu lalu enkode teks sandinya.'
			},
			{
				q: 'Kenapa hasil dekode dibilang bukan UTF-8 yang sah?',
				a: 'String-nya berhasil didekode, tetapi bita yang dihasilkan bukan teks — sering kali berupa PNG, PDF, atau data terkompresi/terenkripsi. Menuangkan isi seperti itu ke kotak teks hanya akan menampilkan karakter kacau, jadi alat ini menandainya saja.'
			}
		]
	},

	'timestamp-converter': {
		about: [
			'Waktu Unix menghitung detik sejak 1970-01-01T00:00:00 UTC, dan ia muncul di mana-mana: baris basis data, klaim JWT, berkas log, respons API. Konverter ini menerima stempel waktu dalam detik atau milidetik — ia mengenali yang mana dari besarannya — juga string ISO 8601 dan sebagian besar tanggal yang ditulis untuk dibaca manusia, lalu menampilkan semua representasinya sekaligus: ISO, UTC, waktu lokal Anda, waktu relatif, dan kedua presisi Unix.',
			'Kerancuan satuan adalah jebakan klasiknya: 1700000000 adalah November 2023 dalam detik, tetapi Januari 1970 dalam milidetik. Satuan yang terdeteksi ditampilkan terang-terangan, dan Anda bisa menimpanya dengan sekali klik saat tebakannya meleset — tidak perlu lagi menghitung digit di kepala.',
			'Konversinya seketika dan lokal, dan penunjuk waktu berjalannya terus berdetak, jadi halaman ini sekaligus menjadi jam epoch selagi Anda bekerja.'
		],
		faqs: [
			{
				q: 'Bagaimana alat ini memutuskan antara detik dan milidetik?',
				a: 'Berdasarkan besaran: nilai dengan 11 digit atau lebih dianggap milidetik, yang lebih pendek dianggap detik. Pemetaan itu mencakup detik sampai sekitar tahun 5138 dan milidetik sejak sekitar 1973, yang menuntaskan setiap stempel waktu modern yang realistis tanpa ambigu. Untuk kasus tepi, satuannya bisa Anda balik secara manual.'
			},
			{
				q: 'Apa yang terjadi setelah 2038?',
				a: 'Masalah tahun 2038 menimpa sistem yang menyimpan waktu Unix dalam bilangan bulat bertanda 32 bit. Angka di JavaScript adalah pecahan 64 bit, jadi konverter ini menangani tanggal jauh melampaui 2038 — sampai tahun 275760, batas objek Date di JavaScript.'
			},
			{
				q: 'Bisakah saya mengubah tanggal kembali menjadi stempel waktu?',
				a: 'Bisa. Tempel string ISO 8601 seperti 2026-07-20T12:00:00Z, atau kebanyakan format tanggal konvensional, dan nilai detik serta milidetik Unix akan muncul bersama representasi lainnya.'
			},
			{
				q: 'Zona waktu mana yang dipakai untuk baris waktu lokal?',
				a: 'Zona waktu yang dikonfigurasi di browser Anda, lewat API Intl — tidak ada yang dicari dari jarak jauh. Nama zonanya dicetak di sebelah nilainya agar tangkapan layar tetap tidak menimbulkan salah paham.'
			}
		]
	},

	'jwt-decoder': {
		about: [
			'Sebuah JSON Web Token terdiri atas tiga segmen Base64URL — header, payload, tanda tangan — yang disambung dengan titik. Pendekode ini memecah token lalu menampilkan header dan payload sebagai JSON yang rapi, menandai klaim waktu baku (iat, exp, nbf) sebagai tanggal yang terbaca, dan langsung memberi tahu apakah tokennya sudah kedaluwarsa.',
			'Mendekode bukan memverifikasi: payload JWT mana pun bisa dibaca siapa saja yang memegangnya, karena Base64URL adalah pengodean, bukan enkripsi. Itu pula sebabnya menempel token ke situs sembarangan biasanya ide buruk — halaman ini pengecualian, karena pendekodean terjadi sepenuhnya di browser Anda dan tokennya tidak pernah dikirim. Verifikasi tanda tangan terhadap kunci rahasia atau kunci publik sengaja berada di luar cakupan pendekode luring ini.',
			'Awalan “Bearer ” di depan dibuang otomatis, jadi Anda bisa menempel langsung dari header Authorization.'
		],
		faqs: [
			{
				q: 'Amankah menempel token produksi di sini?',
				a: 'Token tetap di browser Anda — halaman ini tidak melakukan permintaan jaringan apa pun dengan masukan Anda, dan itu bisa Anda pastikan di tab Network pada DevTools. Meski begitu, biasakan memperlakukan token aktif seperti kata sandi: pakailah token kedaluwarsa atau token uji saat berbagi tangkapan layar.'
			},
			{
				q: 'Kenapa token saya gagal didekode?',
				a: 'Periksa apakah ia punya tepat tiga segmen yang dipisahkan titik dan tidak kemasukan ganti baris saat disalin. Token akses buram (misalnya banyak token GitHub atau Google) memang bukan JWT sama sekali — sebanyak apa pun pendekodean tak akan membuka string acak yang tidak pernah memuat JSON.'
			},
			{
				q: 'Apa arti iat, exp, dan nbf?',
				a: 'Ketiganya klaim baku dari RFC 7519, semuanya dalam detik Unix: iat adalah kapan token diterbitkan, exp kapan ia berhenti berlaku, dan nbf (“not before”) saat paling awal token boleh diterima. Alat ini mengubah masing-masing menjadi tanggal yang terbaca dan membandingkan exp dengan jam di perangkat Anda.'
			},
			{
				q: 'Bisakah alat ini memverifikasi tanda tangannya?',
				a: 'Tidak — lagi pula centang hijau dari alat daring tidak layak dipercaya untuk keputusan keamanan. Verifikasilah tanda tangan di backend Anda dengan pustaka yang terpelihara (jose, jsonwebtoken, PyJWT) memakai kunci penerbit yang sebenarnya.'
			}
		]
	},

	'regex-tester': {
		about: [
			'Tulis sebuah pola, tempel teks contoh, dan setiap kecocokan tersorot sambil Anda mengetik — lengkap dengan grup tangkapan, grup bernama, serta posisi kecocokan yang dirinci di bawahnya. Penguji ini memakai mesin RegExp JavaScript, jadi perilakunya persis seperti di Node.js dan browser, termasuk lookbehind, grup bernama, dan escape properti Unicode.',
			'Bendera dinyalakan per huruf (g, i, m, s, u, y, d) dan polanya dikompilasi pada setiap ketukan tombol; galat sintaksis muncul seketika dengan pesan dari mesinnya sendiri, bukan setelah Anda menekan tombol. Pola yang bisa cocok kosong seperti a* ditangani dengan aman, dan jumlah kecocokan dibatasi 10.000 agar .* yang kelewat longgar tidak membekukan tab.',
			'Ragam regex berbeda antar-mesin — pola yang jalan di sini mungkin perlu disesuaikan untuk PCRE, RE2, atau modul re milik Python, terutama soal dukungan lookbehind, kuantifier posesif, dan bendera sebaris.'
		],
		faqs: [
			{
				q: 'Ragam regex apa yang dipakai penguji ini?',
				a: 'ECMAScript (JavaScript), sebagaimana diterapkan browser Anda sendiri. Ia mendukung lookahead, lookbehind, grup tangkapan bernama, referensi balik, dan escape properti Unicode seperti \\p{Letter} (dengan bendera u). Ia tidak mendukung sintaksis khas PCRE seperti kuantifier posesif atau rekursi.'
			},
			{
				q: 'Kenapa pola saya cocok dengan semuanya / tidak cocok sama sekali?',
				a: 'Dua penyebab klasiknya: metakarakter yang lupa di-escape (. cocok dengan karakter apa pun — tulis \\. untuk titik harfiah), atau bendera g yang terlupakan. Penguji ini selalu mencari semua kecocokan, tetapi kode Anda hanya akan menemukan yang pertama bila g tidak dipasang.'
			},
			{
				q: 'Apa itu grup tangkapan bernama?',
				a: 'Sintaksis (?<nama>...) memberi label pada sebuah grup sehingga Anda membaca hasil menurut nama alih-alih posisi: match.groups.nama di JavaScript. Panel grup di bawah daftar kecocokan menampilkan tangkapan bernomor sekaligus bernama untuk tiap kecocokan.'
			},
			{
				q: 'Apakah regex dari sini bisa dipakai apa adanya di Python atau Go?',
				a: 'Sering bisa, tetapi tidak selalu. Kelas karakter, kuantifier, dan jangkar bersifat portabel; lookbehind, sintaksis grup bernama (Python memakai (?P<nama>...)), dan bendera sebaris berbeda. Mesin RE2 di Go bahkan menolak referensi balik dan lookaround sepenuhnya.'
			}
		]
	},

	'diff-checker': {
		about: [
			'Tempel teks asli di kiri dan versi yang sudah berubah di kanan, lalu dapatkan perbandingan baris demi baris dalam satu tampilan: penghapusan ditandai merah, penambahan hijau, konteks tetap utuh di antaranya, dengan nomor baris asli di kedua sisi. Ini cara tercepat menjawab “sebenarnya apa yang berubah?” antara dua konfigurasi, dua respons API, atau dua versi cuplikan yang ditempel seseorang di obrolan.',
			'Perbandingannya memakai algoritme subbarisan bersama terpanjang atas baris, sekeluarga dengan algoritme di balik git diff, sehingga blok yang berpindah urutan dan suntingan kecil menghasilkan tampilan yang terbaca alih-alih menandai semuanya sebagai berubah. Satu baris ringkasan menjumlahkan baris yang ditambah dan dibuang.',
			'Karena kedua teks tetap berada di halaman, membandingkan materi rahasia — kontrak, kredensial di dalam konfigurasi, naskah yang belum dirilis — sama sekali tidak membawa risiko seperti menempelkannya ke layanan web sembarangan.'
		],
		faqs: [
			{
				q: 'Apakah pembandingannya per kata atau per baris?',
				a: 'Per baris. Setiap baris dibandingkan sebagai satu satuan, sesuai cara pengembang membaca diff kode dan konfigurasi. Karena itu satu baris yang berubah tampil sebagai satu penghapusan plus satu penambahan; penyorotan sebaris di tingkat karakter masih dalam rencana.'
			},
			{
				q: 'Kenapa diff saya menandai semuanya berubah?',
				a: 'Biasanya karena perbedaan yang tak terlihat: satu sisi memakai tab dan sisi lain spasi, akhir baris CRLF ala Windows versus LF ala Unix, atau spasi tersisa di ujung baris. Menormalkan spasi sebelum membandingkan (untuk muatan JSON, perapi JSON dengan pengurutan kunci sangat membantu) membuat perubahan yang sesungguhnya terlihat.'
			},
			{
				q: 'Bisakah saya membandingkan dua respons JSON secara bermakna?',
				a: 'Bisa — lewatkan dulu keduanya melalui perapi JSON dengan pengurutan kunci dinyalakan, supaya dokumen yang setara diserialkan dengan cara yang sama persis. Setelah itu diff-nya menampilkan perubahan nilai yang nyata, bukan derau urutan kunci.'
			},
			{
				q: 'Apakah ada ukuran teks maksimum?',
				a: 'Algoritmenya membandingkan setiap baris satu teks dengan setiap baris teks lainnya, jadi berkas yang teramat besar (puluhan ribu baris di kedua sisi) bisa memakan waktu sejenak. Berkas kode dan muatan API pada umumnya dibandingkan seketika.'
			}
		]
	},

	'url-encode-decode': {
		about: [
			'Karakter seperti spasi, ampersand, dan huruf non-ASCII tidak boleh muncul mentah-mentah di dalam URL, jadi semuanya dienkode persen: spasi menjadi %20, dan 你 menjadi %E4%BD%A0. Alat ini mengenkode teks agar aman dimasukkan ke URL dan mendekode string berescape persen kembali menjadi teks yang terbaca, termasuk konvensi + untuk spasi yang dipakai di string kueri.',
			'Ada dua mode pengodean karena JavaScript sendiri punya dua: mode komponen (encodeURIComponent) meng-escape semua yang bisa memotong sebuah URL, yang Anda inginkan untuk satu nilai di dalam string kueri; mode URI penuh (encodeURI) mempertahankan karakter struktural seperti /, ?, dan &, untuk saat Anda mengenkode satu URL utuh yang harus tetap bisa dibuka.',
			'Pendekodeannya ketat terhadap urutan % yang cacat — sebuah % sendirian atau %ZZ dilaporkan sebagai galat alih-alih diloloskan diam-diam, persis seperti yang akan dilakukan browser dan server.'
		],
		faqs: [
			{
				q: 'Kapan memakai mode komponen dan kapan mode URI penuh?',
				a: 'Mengenkode nilai yang masuk ke dalam URL (kata kunci pencarian, alamat pengalihan, surel di dalam parameter) → mode komponen, supaya & dan = di dalam nilainya tidak merusak string kueri. Mengenkode satu URL lengkap untuk ditampilkan atau dikirim → mode URI penuh, supaya struktur URL-nya selamat.'
			},
			{
				q: 'Kenapa + kadang berarti spasi?',
				a: 'Format application/x-www-form-urlencoded — dipakai pengiriman formulir HTML dan string kueri — secara historis mengenkode spasi sebagai +. Di dalam path URL, + hanyalah tanda tambah. Pendekode di sini memperlakukan + sebagai spasi, mengikuti semantik string kueri; sedangkan %20 selalu benar di mana pun.'
			},
			{
				q: 'Kenapa string saya terenkode dua kali (%2520)?',
				a: '%25 adalah hasil pengodean tanda % itu sendiri, jadi %2520 berarti teks %20 dienkode untuk kedua kalinya. Ini terjadi ketika dua lapisan sistem sama-sama mengenkode. Jalankan dekode dua kali di sini untuk membukanya, lalu perbaiki lapisan yang seharusnya tidak ikut mengenkode.'
			},
			{
				q: 'Apakah karakter Unicode ditangani dengan benar?',
				a: 'Ya — teks dienkode ke UTF-8 lebih dulu lalu tiap bita di-escape persen, sesuai standar URL dari WHATWG. Itulah sebabnya satu karakter CJK berubah menjadi tiga kelompok %XX.'
			}
		]
	},

	'url-parser': {
		about: [
			'Tempel sebuah URL dan lihat ia dibedah: protokol, host, porta, path, fragmen, serta setiap parameter kueri sebagai tabel kunci–nilai yang sudah didekode. Alat ini memakai pengurai URL WHATWG yang sama seperti yang dipakai browser Anda untuk berpindah halaman, jadi tafsiran yang Anda lihat adalah tafsiran yang benar-benar akan diterapkan browser — termasuk kasus tepi seperti porta bawaan yang dihilangkan dan path yang dinormalkan.',
			'Tabel parameter kueri adalah bagian yang paling sering Anda pakai: pengalihan OAuth yang panjang, tautan bertag analitik, dan panggilan API menjadi terbaca sekali lihat, dengan setiap nilai sudah didekode dari bentuk persen. Domain telanjang tanpa skema juga diterima; https:// diasumsikan saat penguraian.',
			'Alat ini berpasangan alami dengan enkoder URL — urai sebuah URL di sini untuk menemukan parameter yang Anda butuhkan, sunting nilainya, lalu enkode kembali di sana.'
		],
		faqs: [
			{
				q: 'Kenapa URL hasil penguraian sedikit berbeda dari yang saya tempel?',
				a: 'Pengurai WHATWG melakukan normalisasi: skema dan host dijadikan huruf kecil, porta bawaan dibuang (:443 untuk https), segmen ./ dan ../ diselesaikan, dan karakter yang memerlukannya dienkode. Yang Anda lihat adalah bentuk kanonis yang disepakati server dan browser.'
			},
			{
				q: 'Bisakah ia menangani URL dengan kunci kueri yang berulang?',
				a: 'Bisa — setiap kemunculan didaftar sebagai barisnya sendiri, sesuai urutan. Kunci berulang itu sah dan lazim: banyak API membacanya sebagai larik (?tag=a&tag=b).'
			},
			{
				q: 'Apa bedanya host dan hostname?',
				a: 'hostname hanyalah domainnya (example.com); host menyertakan porta non-bawaan yang ditulis eksplisit (example.com:8080). Ketika portanya sama dengan bawaan skema, keduanya tampak sama karena porta itu dihilangkan.'
			},
			{
				q: 'Apakah fragmen (#...) ikut terkirim ke server?',
				a: 'Tidak. Semua yang berada setelah # tinggal di browser — server tidak pernah melihatnya. Karena itulah aplikasi satu halaman dahulu memakainya untuk perutean di sisi klien, dan karena itu pula parameter analitik yang diletakkan setelah # tidak terlihat oleh backend.'
			}
		]
	},

	'uuid-generator': {
		about: [
			'Hasilkan pengenal unik universal dalam empat rasa: UUID v4 (acak sepenuhnya, pilihan sehari-hari), UUID v7 (terurut waktu, pilihan modern untuk kunci basis data), ULID (terurut waktu dengan ejaan Crockford Base32 yang ringkas), dan Nano ID (pendek, ramah URL). Hasilkan satu, atau sampai seribu sekaligus — satu per baris, siap ditempel ke skrip seeding.',
			'Keacakannya berasal dari Web Crypto API (crypto.getRandomValues), sumber yang aman secara kriptografis, bukan Math.random. Pembangkitan berjalan lokal, artinya ID-nya tidak diketahui siapa pun selain Anda, tidak dicatat di mana pun, dan tersedia saat luring.',
			'Jika Anda sedang memilih format ID untuk sistem baru: v7 dan ULID terurut menurut waktu pembuatan, yang menyenangkan indeks B-tree dan membuat ID di log kurang lebih kronologis; sedangkan v4 tidak membocorkan apa pun tentang kapan ia dibuat, yang sesekali justru persis yang Anda inginkan.'
		],
		faqs: [
			{
				q: 'Apa bedanya UUID v4 dan v7?',
				a: 'v4 adalah 122 bita acak. v7 (RFC 9562) diawali stempel waktu 48 bit dalam milidetik Unix lalu disusul bit acak, sehingga ID yang dibuat belakangan juga terurut belakangan. Untuk kunci primer basis data, v7 umumnya memperbaiki lokalitas penyisipan dan ukuran indeks; v4 tetap baik ketika urutan tidak relevan atau waktu pembuatan tidak boleh bocor.'
			},
			{
				q: 'Mungkinkah dua UUID yang dihasilkan bertabrakan?',
				a: 'Dengan 122 bit acak, peluangnya begitu kecil sampai tak layak diantisipasi lewat rekayasa: Anda harus menghasilkan miliaran ID per detik selama puluhan tahun untuk sekadar mendekati kemungkinan yang amat tipis itu. Tabrakan di dunia nyata datang dari bug (memakai ulang benih, menyalin baris), bukan dari keacakan.'
			},
			{
				q: 'Kapan memilih ULID ketimbang UUID v7?',
				a: 'Keduanya menyelesaikan masalah yang sama. ULID terdiri dari 26 karakter Crockford Base32 yang tidak peka besar-kecil huruf — lebih pendek dan lebih rapi di URL maupun log — sementara v7 mempertahankan bentuk UUID 36 karakter yang sudah diterima setiap basis data dan pustaka. Pilih mana pun yang ditangani ekosistem Anda secara lebih alami.'
			},
			{
				q: 'Amankah memakai ID ini sebagai rahasia atau token?',
				a: 'Keacakannya memang aman secara kriptografis, tetapi ID biasanya ditampilkan, dicatat, dan diindeks — diperlakukan sebagai data publik. Untuk token sesi atau kunci API, buatlah rahasia tersendiri dengan setidaknya 128 bit acak dan perlakukan seperti kata sandi.'
			}
		]
	},

	'hash-generator': {
		about: [
			'Hitung digest MD5, SHA-1, SHA-256, SHA-384, dan SHA-512 dari teks apa pun, plus tanda tangan HMAC berkunci, langsung di dalam browser. Keluarga SHA dan HMAC memakai Web Crypto API — primitif teraudit yang sama dengan yang dipakai browser Anda untuk TLS — sementara MD5 (yang sengaja tidak disertakan Web Crypto) hadir sebagai implementasi lokal kecil untuk urusan checksum warisan.',
			'Nilai hash diperbarui langsung sambil Anda mengetik, dan semua algoritme dihitung sekaligus, jadi membandingkan sebuah nilai dengan checksum dalam algoritme apa pun yang dipilih halaman unduhan tidak butuh konfigurasi apa-apa. Mode HMAC menambahkan kolom kunci rahasia untuk memverifikasi tanda tangan webhook — GitHub, Stripe, dan sebagian besar penyedia webhook menandatangani muatan dengan HMAC-SHA256.',
			'Karena masukan tidak pernah meninggalkan halaman, aman untuk mem-hash hal-hal yang tidak mungkin Anda tempel ke layanan daring: muatan API, kata sandi yang sedang Anda cek terhadap daftar hash bocoran, dokumen internal.'
		],
		faqs: [
			{
				q: 'Algoritme hash mana yang sebaiknya saya pakai?',
				a: 'Untuk apa pun yang menyangkut keamanan hari ini: SHA-256 atau yang lebih kuat. MD5 dan SHA-1 sudah jebol dari sisi ketahanan tabrakan — dua masukan berbeda bisa dirancang menghasilkan digest yang sama — jadi keduanya hanya bertahan untuk checksum tanpa lawan dan kompatibilitas protokol lama.'
			},
			{
				q: 'Kalau begitu kenapa MD5 masih disediakan?',
				a: 'Karena Anda masih akan menemuinya: ETag, kunci cache, manifes berkas, kolom basis data lama. Memverifikasi nilai semacam itu tetap menuntut penghitungan MD5, terlepas dari status kriptografisnya. Cukup jangan merancang apa pun yang baru di atasnya.'
			},
			{
				q: 'Apa itu HMAC dan apa bedanya dari hash biasa?',
				a: 'HMAC mencampurkan kunci rahasia ke dalam proses hashing sehingga hanya pemegang kunci yang bisa membuat atau memverifikasi digest-nya. Hash biasa membuktikan integritas (“data ini tidak berubah”); HMAC juga membuktikan keaslian (“ini dibuat oleh seseorang yang memegang kuncinya”). Pemakaian sehari-harinya adalah verifikasi tanda tangan webhook.'
			},
			{
				q: 'Apakah hashing sama dengan mengenkripsi kata sandi?',
				a: 'Tidak, dan hash cepat seperti SHA-256 adalah alat yang keliru untuk menyimpan kata sandi — penyerang bisa mencoba miliaran per detik. Penyimpanan kata sandi membutuhkan algoritme yang sengaja lambat dan bergaram: bcrypt, scrypt, atau Argon2.'
			}
		]
	},

	'case-converter': {
		about: [
			'Pengenal terus-menerus berpindah antar-konvensi: API mengembalikan snake_case, TypeScript Anda mau camelCase, kelas CSS butuh kebab-case, dan variabel lingkungan menuntut CONSTANT_CASE. Konverter ini menerima masukan campur aduk apa pun — spasi, garis bawah, tanda hubung, camelCase yang sudah ada — memecahnya menjadi kata dengan cerdas, lalu menyusunnya ulang ke sembilan gaya tujuan sekaligus.',
			'Pemecahnya paham kasus-kasus rumit: ia membelah “getUserByID” menjadi get/user/by/id (menjaga akronim tetap utuh sampai batasnya), memperlakukan angka sebagai bagian dari katanya, dan memproses tiap baris secara terpisah, jadi Anda bisa menempel satu kolom penuh nama bidang basis data dan mengonversinya sekali jalan.',
			'Semua gaya ditampilkan serentak, masing-masing dengan tombol salin per barisnya — tak perlu memilih mode dulu, cukup tempel lalu ambil yang Anda perlukan.'
		],
		faqs: [
			{
				q: 'Bagaimana akronim seperti “HTTPResponse” ditangani?',
				a: 'Deretan huruf kapital yang diikuti huruf kecil dipecah tepat sebelum kapital terakhir: HTTPResponse → http + response. Ini sesuai dengan cara kebanyakan panduan gaya mengharapkan akronim ditokenkan, meski tidak ada pemecah yang bisa menebak maksud dengan sempurna — kasus tepi seperti “IOError” menjadi io + error.'
			},
			{
				q: 'Bisakah saya mengonversi banyak pengenal sekaligus?',
				a: 'Bisa — setiap baris dikonversi sendiri-sendiri. Tempel daftar nama kolom, satu per baris, dan keluarannya mempertahankan struktur baris itu dalam gaya yang baru.'
			},
			{
				q: 'Apa bedanya Title Case dan Sentence case di sini?',
				a: 'Title Case mengapitalkan setiap kata (“User Account Id”); Sentence case hanya kata pertama (“User account id”). Keduanya tidak menerapkan aturan redaksional soal kata sandang dan kata depan — untuk pengenal, aturan itu hampir tidak pernah Anda inginkan.'
			},
			{
				q: 'Kenapa mengonversi bolak-balik tidak selalu memulihkan bentuk asli saya?',
				a: 'Memecah menjadi kata membuang informasi — “user_ID_2” dan “userId2” ditokenkan secara identik. Konversi ke depan bersifat deterministik, tetapi ejaan asli batas antarkata tidak selalu bisa direkonstruksi ke belakang.'
			}
		]
	},

	'word-counter': {
		about: [
			'Penghitung kata dan karakter secara langsung dengan angka-angka yang benar-benar dibutuhkan pengembang dan penulis: kata, karakter dengan dan tanpa spasi, bita UTF-8 (yang sesungguhnya diukur kolom basis data atau batas API Anda), baris, kalimat, paragraf, serta perkiraan waktu baca pada laju umum 220 kata per menit.',
			'Karakter dihitung sebagai titik kode Unicode, bukan unit UTF-16, jadi emoji dan teks CJK terhitung sebagaimana orang mengharapkannya — dan hitungan bita yang terpisah membuat perbedaannya kelihatan: 日本語 adalah 3 karakter tetapi 9 bita. Pembedaan itulah yang menggigit ketika kolom VARCHAR(255) menolak string berisi 200 “karakter”.',
			'Semuanya diperbarui sambil Anda mengetik, tanpa apa pun dikirim ke mana pun — aman untuk menghitung draf pengumuman, kontrak, atau apa saja yang belum siap dilihat dunia.'
		],
		faqs: [
			{
				q: 'Kenapa hitungan karakter dan bita berbeda?',
				a: 'Karakter adalah titik kode Unicode; bita adalah bentuk pengodean UTF-8-nya. Huruf ASCII masing-masing 1 bita, sebagian besar huruf beraksen Eropa 2, karakter CJK 3, dan emoji 4 (atau lebih pada rangkaian). Batas basis data, header HTTP, dan banyak API mengukur bita, bukan karakter.'
			},
			{
				q: 'Bagaimana kata dihitung untuk bahasa tanpa spasi?',
				a: 'Penghitungan kata memecah pada spasi, sehingga teks tanpa pemisah dalam bahasa Tionghoa atau Jepang jadi terhitung terlalu sedikit. Untuk bahasa-bahasa itu, jumlah karakter adalah metrik yang lebih bermakna — itu sebabnya keduanya selalu ditampilkan.'
			},
			{
				q: 'Apa yang dihitung sebagai satu kalimat?',
				a: 'Rentetan teks yang diakhiri ., !, ?, atau … lalu diikuti spasi atau akhir masukan. Singkatan seperti “dsb.” bisa sedikit menggelembungkan hitungan — penghitungan kalimat memang pada dasarnya bersifat heuristik.'
			},
			{
				q: 'Seberapa akurat perkiraan waktu bacanya?',
				a: 'Ia membagi jumlah kata dengan 220 kata per menit, rata-rata yang lazim untuk orang dewasa membaca prosa umum dalam hati. Materi teknis berisi kode dibaca lebih lambat; artikel daftar yang bisa dipindai dibaca lebih cepat. Perlakukan sebagai perkiraan kasar.'
			}
		]
	},

	'lorem-ipsum-generator': {
		about: [
			'Teks pengisi untuk tata letak, purwarupa, dan data awal, dihasilkan di browser Anda: pilih kata, kalimat, atau paragraf, tentukan jumlahnya, lalu salin. Keluarannya menimba dari kosakata Cicero teracak yang klasik itu, sehingga tampak seperti prosa mirip-Latin yang wajar tanpa membentuk kalimat terbaca yang mengalihkan perhatian.',
			'Secara bawaan teksnya dibuka dengan “Lorem ipsum dolor sit amet” — frasa yang langsung dikenali desainer dan pengulas sebagai teks sementara — dan Anda bisa mematikannya untuk keluaran acak sepenuhnya ketika butuh beberapa blok yang jelas berbeda.',
			'Panjang kalimat dan ukuran paragraf bervariasi secara acak dalam rentang yang realistis, jadi teks yang dihasilkan punya irama visual naskah sungguhan — penting saat Anda menilai tipografi atau pemenggalan baris, di mana kalimat yang seragam justru tampak dibuat-buat.'
		],
		faqs: [
			{
				q: 'Dari mana asal lorem ipsum?',
				a: 'Ia adalah potongan teracak dari “De finibus bonorum et malorum” karya Cicero (45 SM), dipakai sebagai teks pengisi oleh para penata huruf setidaknya sejak 1960-an dan dipopulerkan lembar Letraset lalu perangkat lunak penerbitan desktop.'
			},
			{
				q: 'Kenapa memakai lorem ipsum alih-alih teks sungguhan?',
				a: 'Isi yang terbaca membajak perhatian — pengulas mulai menyunting kata-katanya alih-alih menilai tata letaknya. Latin-latinan punya frekuensi huruf dan panjang kata yang alami tanpa bisa dibaca, sehingga fokus tetap pada desain.'
			},
			{
				q: 'Apakah teks yang dihasilkan selalu sama?',
				a: 'Tidak — kata diambil secara acak setiap kali, jadi dua kali pembuatan akan berbeda. Hanya frasa pembuka klasik yang opsional itu yang tetap.'
			},
			{
				q: 'Bisakah saya menghasilkan jumlah kata tertentu untuk batas kolom CMS?',
				a: 'Bisa — setel satuannya ke kata dan isikan jumlah yang persis Anda perlukan, sampai 1000 sekali jalan. Padukan dengan alat penghitung kata untuk memastikannya terhadap batas karakter atau bita.'
			}
		]
	},

	'slug-generator': {
		about: [
			'Ubah judul apa pun menjadi slug siap-URL: huruf kecil, dipisah tanda hubung, bersih dari tanda baca, dengan aksen ditransliterasi ke ASCII polos — “Crème brûlée à Paris” menjadi “creme-brulee-a-paris”. Opsinya mencakup ragam yang lazim: pemisah garis bawah, besar-kecil huruf yang dipertahankan, dan panjang maksimum yang memotong di batas kata alih-alih di tengah kata.',
			'Slug penting bagi manusia sekaligus mesin pencari: ia terbaca di bilah alamat, selamat saat disalin ke obrolan tanpa escape persen, dan memberi hasil pencarian sebuah URL yang membawa kata kunci. Langkah transliterasi inilah yang biasanya dilewatkan fungsi slugify buatan sendiri — tanpanya, judul beraksen entah merusak URL atau lenyap sama sekali.',
			'Setiap baris di-slug-kan sendiri-sendiri, jadi daftar judul artikel yang Anda tempel berubah menjadi daftar slug yang bersesuaian dalam satu operasi.'
		],
		faqs: [
			{
				q: 'Kenapa tanda hubung, bukan garis bawah?',
				a: 'Mesin pencari memperlakukan tanda hubung sebagai pemisah kata, sedangkan garis bawah secara historis dianggap penyambung kata; tanda hubung juga lebih jelas secara visual pada teks tautan yang bergaris bawah. Garis bawah tetap populer untuk nama berkas dan pengenal, jadi keduanya disediakan.'
			},
			{
				q: 'Apa yang terjadi pada aksara non-Latin seperti Tionghoa atau Kiril?',
				a: 'Karakter yang punya padanan ASCII (huruf Latin beraksen, beberapa huruf khusus seperti ß → ss) ditransliterasi; aksara tanpa pemetaan Latin yang sederhana dibuang. Untuk konten non-Latin, praktik yang umum adalah membiarkan aksara aslinya terenkode persen di dalam URL, atau menulis slug romanisasi secara manual.'
			},
			{
				q: 'Adakah panjang slug yang ideal?',
				a: 'Lebih pendek lebih enak untuk dibagikan dan ditampilkan, tetapi tidak ada jurang peringkat di angka tertentu. Opsi panjang maksimum memangkas di batas kata — berguna untuk CMS yang membatasi kolom slug pada 50–80 karakter.'
			},
			{
				q: 'Haruskah slug berubah ketika judulnya berubah?',
				a: 'Setelah terbit, idealnya tidak — URL adalah alamat yang sudah ditautkan orang lain. Sebagian besar situs mempertahankan slug asli atau menambahkan pengalihan. Buat slug saat konten dibuat, dan perlakukan penggantian nama sebagai keputusan pengalihan yang disengaja.'
			}
		]
	},

	'sort-lines': {
		about: [
			'Meja kerja pengolah baris: tempel daftar apa pun lalu urutkan secara alfabetis, terbalik, alami (item2 sebelum item10), menurut panjang, atau acak saja — sambil secara opsional memangkas spasi, membuang baris kosong, dan menghapus duplikat dengan urutan tetap terjaga. Jumlah baris yang dibuang dilaporkan supaya Anda tahu persis apa yang dilakukan penghapusan duplikat.',
			'Pengurutan alami adalah opsi yang paling sering Anda pakai: pengurutan alfabetis biasa menaruh “item10” sebelum “item2” karena membandingkan karakter demi karakter, sedangkan pengurutan alami membandingkan angka yang tertanam sebagai bilangan — urutan yang diharapkan manusia untuk nama berkas, versi, dan pengenal.',
			'Penghapusan duplikat menyimpan kemunculan pertama dan menjaga urutan asli yang selamat, dan itu penting ketika urutan daftar memang bermakna (impor, baris konfigurasi, daftar putar). Mode tanpa peduli besar-kecil huruf menganggap “Apple” dan “apple” sebagai baris yang sama.'
		],
		faqs: [
			{
				q: 'Apa bedanya pengurutan alfabetis dan alami?',
				a: 'Alfabetis membandingkan kode karakter, jadi “file10” < “file2” (karena di posisi kelima “1” < “2”). Pengurutan alami mengenali deretan digit dan membandingkannya sebagai bilangan, sehingga file2 < file10. Pakai yang alami untuk apa pun yang mengandung angka.'
			},
			{
				q: 'Penghapusan duplikat menyimpan kemunculan pertama atau terakhir?',
				a: 'Yang pertama. Baris dipindai dari atas ke bawah, dan sebuah baris hanya dibuang jika baris identik (atau sama tanpa peduli besar-kecil huruf, pada mode itu) sudah muncul lebih dulu — sehingga urutan yang tersisa cocok dengan aslinya.'
			},
			{
				q: 'Seberapa besar daftar yang sanggup ditangani?',
				a: 'Ratusan ribu baris tidak masalah — operasinya hanya beberapa lintasan sederhana plus satu pengurutan. Semuanya tinggal di memori browser, jadi batas praktisnya adalah mesin Anda, bukan kuota server.'
			},
			{
				q: 'Bisakah saya menggabungkan beberapa operasi?',
				a: 'Bisa, dan semuanya diterapkan dalam urutan yang masuk akal: pangkas dulu, lalu buang baris kosong, lalu hapus duplikat, baru urutkan — sehingga “ apple ” dan “apple” terhapus sebagai duplikat ketika pemangkasan menyala, dan pengurutan selalu melihat daftar yang sudah bersih.'
			}
		]
	},

	'html-entities': {
		about: [
			'Escape teks agar aman disisipkan ke dalam HTML — & menjadi &amp;, < menjadi &lt; — atau dekode teks yang penuh entitas kembali menjadi karakter yang terbaca, mencakup entitas bernama (&rarr;), rujukan numerik desimal (&#169;), dan heksadesimal (&#xA9;).',
			'Pengodean menawarkan dua tingkat: lima karakter esensial yang merusak struktur HTML (& < > " \'), yang sudah cukup untuk kebenaran; atau semua yang non-ASCII, berguna ketika ada rantai perkakas yang mengacak UTF-8 di suatu titik antara Anda dan halamannya. Mode khusus numerik melewatkan entitas bernama demi kecocokan maksimal dengan pengurai XML yang ketat, yang hanya menjamin lima entitas terdefinisi.',
			'Bagian yang dipakai sehari-hari adalah pendekodenya: tempel cuplikan hasil scraping atau respons API yang bertaburan &#x27; lalu dapatkan teks bersih. Nama entitas yang tak dikenal diloloskan apa adanya alih-alih ditebak-tebak.'
		],
		faqs: [
			{
				q: 'Karakter apa saja yang wajib di-escape di HTML?',
				a: 'Pada isi teks: & dan <. Pada nilai atribut: ditambah karakter kutip yang membatasi atribut itu (" atau \'). Meng-escape > memang kebiasaan umum tetapi tidak diwajibkan. Selebihnya boleh muncul apa adanya di dalam dokumen UTF-8.'
			},
			{
				q: 'Apakah pengodean entitas melindungi dari XSS?',
				a: 'Meng-escape lima karakter struktural memang inti dari pengodean keluaran untuk konteks HTML — tetapi hanya untuk teks HTML dan konteks atribut. URL, string JavaScript, dan CSS punya pengodean sendiri sesuai konteksnya; escape entitas saja tidak membuat injeksi sembarangan menjadi aman di sana.'
			},
			{
				q: 'Entitas bernama atau numerik — mana yang sebaiknya dikeluarkan?',
				a: 'Rujukan numerik (&#xE9;) berfungsi di setiap pengurai HTML dan XML. Entitas bernama lebih enak dibaca, tetapi XML hanya mendefinisikan lima di muka, jadi &eacute; akan mematahkan alur XML/XHTML yang ketat. Kalau ragu, pilih numerik.'
			},
			{
				q: 'Kenapa di data saya muncul &amp;#39; (terenkode ganda)?',
				a: 'Dua lapisan masing-masing mengenkode sekali: tanda & dari pengodean pertama ikut di-escape lagi pada lintasan kedua. Dekode dua kali di sini untuk memulihkan teksnya, lalu temukan dan perbaiki lapisan yang seharusnya tidak ikut mengenkode.'
			}
		]
	},

	'unicode-inspector': {
		about: [
			'Tempel teks apa pun dan lihat setiap karakter dibedah: titik kodenya (U+XXXX), bita UTF-8, unit UTF-16, urutan escape JavaScript, entitas HTML, dan kategori umumnya — plus total untuk titik kode, unit UTF-16, bita UTF-8, dan karakter sebagaimana dirasakan pengguna (klaster grafem).',
			'Inilah alat untuk momen “kenapa string ini aneh sekali?”: karakter tak kasatmata (spasi lebar nol, BOM, penanda arah) muncul sebagai baris yang terlihat; karakter kembar (а Kiril versus a Latin) menyingkap titik kode yang berbeda; dan emoji yang “cuma satu karakter” ternyata tujuh titik kode yang disambung penggabung lebar nol.',
			'Empat total panjang yang berbeda itu menjawab pertanyaan abadi: mengapa .length di JavaScript, batas bita di basis data, dan apa yang dilihat pengguna tak pernah sepakat soal panjang sebuah string.'
		],
		faqs: [
			{
				q: 'Kenapa "🎉".length === 2 di JavaScript?',
				a: 'String JavaScript menghitung unit kode UTF-16. Karakter di atas U+FFFF — termasuk sebagian besar emoji — memerlukan pasangan pengganti, yaitu dua unit. Pemeriksa ini menampilkan baik unitnya maupun titik kode sebenarnya, dan ringkasannya menghitung keduanya secara terpisah.'
			},
			{
				q: 'Apa itu klaster grafem?',
				a: 'Apa yang dirasakan pembaca sebagai satu karakter. Huruf é bisa terdiri dari dua titik kode (e + aksen penggabung), dan emoji keluarga bisa berisi tujuh titik kode atau lebih yang disambung penggabung lebar nol. Hitungan grafem memakai Intl.Segmenter milik browser — yang paling mendekati “karakter sebagaimana dilihat pengguna”.'
			},
			{
				q: 'Bagaimana cara menemukan karakter tak kasatmata di dalam string?',
				a: 'Tempel saja di sini — setiap titik kode mendapat barisnya sendiri, termasuk spasi lebar nol (U+200B), spasi tanpa pemutus (U+00A0), BOM (U+FEFF), dan penanda arah, masing-masing berlabel kategorinya. Merekalah biang keladi klasik di balik string “identik” yang gagal saat dibandingkan.'
			},
			{
				q: 'Apa yang diberitahukan urutan bita UTF-8 kepada saya?',
				a: 'Persis apa yang akan disimpan atau dikirim: ASCII satu bita, sebagian besar perluasan Latin dua, CJK tiga, emoji empat. Kalau sebuah sistem memotong di tengah urutan, Anda akan mendapat karakter pengganti (�) — tampilan bita memperlihatkan di mana potongan semacam itu akan jatuh.'
			}
		]
	},

	'cron-parser': {
		about: [
			'Tempel ekspresi cron lima bidang lalu dapatkan penjelasannya dalam bahasa sehari-hari, dengan rincian bidang demi bidang serta — bagian yang menangkap kesalahan sungguhan — lima waktu jalan berikutnya yang dihitung menurut zona waktu lokal Anda. “0 3 * * 1” terbaca sebagai “pukul 03.00, setiap Senin”, disusul tanggal-tanggal konkret saat ia akan berjalan.',
			'Penguraiannya mendukung seluruh sintaksis baku: daftar (1,15), rentang (9-17), langkah (*/15), nama bulan dan hari (jan, mon), angka 7 sebagai Minggu, serta keluarga makro @daily/@hourly. Ia juga menerapkan aturan yang selalu terlupakan: ketika bidang tanggal dan bidang hari sama-sama dibatasi, tugas berjalan bila salah satunya cocok, bukan keduanya.',
			'Ekspresi enam bidang (Quartz, berdetik) dideteksi dan disebutkan terang-terangan alih-alih diurai keliru diam-diam — sumber kebingungan “cron saya salah jalan” yang paling sering terjadi ketika berpindah antara penjadwal Java dan crontab Unix.'
		],
		faqs: [
			{
				q: 'Apa saja lima bidangnya, sesuai urutan?',
				a: 'Menit (0–59), jam (0–23), tanggal (1–31), bulan (1–12), hari dalam minggu (0–6, Minggu = 0, dan 7 juga diterima sebagai Minggu). Mengingat urutannya adalah perjuangan abadi — panel rincian memberi label pada tiap bidang ekspresi Anda.'
			},
			{
				q: 'Kenapa “0 0 1 * 1” berjalan lebih sering daripada dugaan saya?',
				a: 'Karena tanggal (tanggal 1) dan hari (Senin) sama-sama dibatasi, cron menjalankan tugas ketika SALAH SATU cocok — yakni setiap tanggal 1 DAN setiap hari Senin. Untuk memaksudkan “tanggal 1 hanya bila jatuh pada Senin”, Anda perlu memeriksa tanggalnya di dalam skrip.'
			},
			{
				q: 'Zona waktu apa yang dipakai untuk waktu jalan berikutnya?',
				a: 'Zona waktu lokal browser Anda, yang ditampilkan berdampingan dengan hasilnya. Crontab sungguhan berjalan di zona waktu server (atau baris TZ= pada sebagian cron) — selalu pastikan apa yang dipakai mesin tujuan, terutama saat melewati pergantian waktu musim.'
			},
			{
				q: 'Apakah ini mendukung detik atau tahun?',
				a: 'Tidak — keduanya perluasan Quartz (Java) dengan 6 atau 7 bidang. Cron Unix baku punya tepat lima bidang dan resolusi satu menit. Masukan enam bidang dideteksi dan dilaporkan sebagai Quartz, bukan disalahbaca.'
			}
		]
	},

	'password-generator': {
		about: [
			'Hasilkan kata sandi acak dengan panjang dan himpunan karakter pilihan Anda, secara massal bila perlu, disertai perhitungan entropi yang jujur — bit keacakan, bukan bilah warna hiasan. Keacakannya berasal dari crypto.getRandomValues dengan pencuplikan tolak, jadi setiap karakter diambil secara seragam tanpa bias modulo.',
			'Setiap himpunan karakter yang dinyalakan dijamin diwakili setidaknya satu karakter (kebijakan yang dipaksakan banyak situs), lalu sisa kata sandinya diisi secara seragam dan keseluruhannya diacak ulang — sehingga karakter-karakter jaminan itu tidak menggerombol di awal secara mudah ditebak.',
			'Penyaring karakter rancu membuang si kembar (0/O, 1/l/I) demi kata sandi yang mungkin suatu saat dibaca keras oleh manusia atau diketik ulang dari kertas. Karena pembuatannya lokal, kata sandi itu hanya ada di mesin Anda sampai Anda sendiri menaruhnya di suatu tempat.'
		],
		faqs: [
			{
				q: 'Apa arti bit entropi itu?',
				a: 'Entropi = panjang × log2(ukuran kumpulan karakter): banyaknya kemungkinan berpeluang sama yang harus ditelusuri penyerang. Entropi 64 bit tahan terhadap serangan asal-asalan; 80 bit ke atas kuat melawan pembobolan luring pada hash cepat; 100 bit ke atas praktis mustahil ditebak. Kata sandi 16 karakter dari huruf + angka + simbol kira-kira 104 bit.'
			},
			{
				q: 'Apakah kata sandi panjang berhuruf kecil semua lebih baik daripada yang pendek tapi rumit?',
				a: 'Sering kali ya — panjang melipatgandakan entropi, sedangkan menambah himpunan karakter hanya memperlebar basis logaritmanya. Dua puluh huruf kecil (~94 bit) mengalahkan sepuluh karakter campur aduk (~65 bit). Aturan kerumitan ada terutama untuk mengalahkan daftar kata, dan pembuatan acak sudah mengalahkannya sejak awal.'
			},
			{
				q: 'Amankah membuat kata sandi di dalam browser?',
				a: 'Keacakannya (crypto.getRandomValues) adalah CSPRNG yang sama dengan yang dipakai pengelola kata sandi native, dan halaman ini tidak melakukan permintaan jaringan apa pun dengan data Anda. Risiko yang realistis justru muncul setelah pembuatan: riwayat papan klip, berbagi layar, dan tempat Anda menyimpannya.'
			},
			{
				q: 'Kenapa mengecualikan karakter rancu?',
				a: 'Untuk kata sandi yang akan dibaca manusia — kode pemulihan tercetak, dibacakan lewat telepon, diketik ulang dari layar lain — 0/O dan 1/l/I benar-benar melahirkan tiket dukungan. Untuk kata sandi yang murni ditempel, biarkan saja; kehilangan entropi karena mengecualikannya toh kecil.'
			}
		]
	},

	'qr-code-generator': {
		about: [
			'Ketik atau tempel teks apa pun — URL, kredensial WiFi, info kontak — dan dapatkan kode QR seketika, dirender sebagai SVG vektor yang tajam untuk diunduh, atau diekspor ke PNG untuk obrolan dan salindia. Tanpa watermark, tanpa pengalihan “paket gratis” yang kedaluwarsa, dan karena pembuatannya lokal, apa pun yang Anda enkode tidak pernah menyentuh server.',
			'Poin terakhir itu lebih penting daripada kelihatannya: banyak layanan QR gratis mengalirkan URL Anda lewat domain pengalihan mereka (supaya bisa menagih belakangan atau melacak pemindaian), artinya kodenya berhenti bekerja begitu layanan itu tutup. Kode yang dibuat di sini mengenkode konten Anda secara langsung dan berfungsi selamanya.',
			'Empat tingkat koreksi galat menukar kapasitas dengan ketangguhan — L bertahan pada kerusakan ringan, H bertahan meski 30% simbolnya tertutup (berguna ketika ada logo menutup bagian tengah atau hasil cetaknya kecil dan mudah lecet).'
		],
		faqs: [
			{
				q: 'Tingkat koreksi galat mana yang sebaiknya saya pilih?',
				a: 'M (15%) adalah bawaan yang masuk akal. Pakai H (30%) untuk kode cetak berukuran kecil, kode di balik kaca atau silau, atau ketika Anda menimpakan logo. Koreksi yang lebih tinggi membuat kode makin padat, jadi untuk URL yang sangat panjang di layar, tingkat L menjaga modulnya tetap besar dan gampang dipindai.'
			},
			{
				q: 'Kenapa SVG lebih baik daripada PNG untuk cetak?',
				a: 'SVG tidak bergantung pada resolusi — pencetak merasterkannya pada DPI aslinya, sehingga tepi modul tetap tajam sempurna di ukuran berapa pun. PNG harus dibuat pada ukuran piksel tertentu dan bisa buram saat diperbesar. Pakai SVG untuk cetak dan perkakas desain, PNG untuk obrolan dan salindia.'
			},
			{
				q: 'Berapa banyak data yang muat dalam sebuah kode QR?',
				a: 'Secara teori sampai sekitar 3 KB bita (versi 40, tingkat L), tetapi kode sebesar itu sukar dipindai dari layar. Di bawah 300 karakter terpindai dengan andal; untuk URL panjang, pendekkan dulu — dengan pemendek di domain Anda sendiri bila kelanggengan itu penting.'
			},
			{
				q: 'Apakah kode-kode ini kedaluwarsa atau melacak pemindaian?',
				a: 'Tidak. Kontennya dienkode langsung ke dalam polanya — tak ada yang melewati situs ini, jadi tak ada yang bisa kedaluwarsa, dan tak seorang pun (termasuk kami) tahu kapan atau di mana ia dipindai. Pelacakan pemindaian pada dasarnya menuntut adanya layanan pengalihan.'
			}
		]
	},

	'json-to-yaml': {
		about: [
			'Konversikan antara JSON, YAML, dan TOML ke segala arah. Format sumbernya dideteksi otomatis sambil Anda menempel — kurung siku mengisyaratkan JSON, titik dua setelah kunci mengisyaratkan YAML, [tabel] mengisyaratkan TOML — dengan penimpaan manual untuk masukan yang ambigu. Konversinya melewati penguraian sungguhan, jadi keluarannya dijamin sah, bukan hasil transformasi teks baris demi baris.',
			'Tiap format punya kekuatan nyata: JSON untuk API dan pertukaran antarmesin, YAML untuk konfigurasi yang disunting manusia (Kubernetes, alur CI), TOML untuk berkas konfigurasi bertipe rapi (Cargo, pyproject). Memindahkan data di antara ketiganya secara manual mengundang salah indentasi dan salah kutip, dan konversi ini menghapus soal itu.',
			'Konverternya jujur soal batasan format: TOML tidak punya larik di tingkat teratas dan tidak mengenal null, jadi saat mengonversi dokumen semacam itu ia menjelaskan alasannya alih-alih diam-diam membuang data.'
		],
		faqs: [
			{
				q: 'Apakah komentar selamat melewati konversi?',
				a: 'Tidak — JSON tidak punya sintaksis komentar, dan konversinya melewati struktur data hasil penguraian, yang tidak membawa komentar. Mengubah YAML → JSON → YAML menghilangkan komentar tanpa bisa dikembalikan; simpan berkas aslinya bila komentar itu penting.'
			},
			{
				q: 'Kenapa “no” di YAML saya berubah menjadi false?',
				a: 'YAML 1.1 memperlakukan yes/no/on/off sebagai boolean, dan kode negara NO terkenal berubah menjadi false. Pengurai di sini mengikuti YAML 1.2 (hanya true/false), tetapi berkas yang ditulis untuk pengurai lama masih bisa mengejutkan. Beri tanda kutip pada string yang menyerupai boolean, angka, atau tanggal.'
			},
			{
				q: 'Kenapa JSON saya gagal dikonversi ke TOML?',
				a: 'TOML mengharuskan tabel (objek) berada di tingkat teratas — larik atau skalar telanjang tidak bisa menjadi dokumen TOML — dan ia tidak mengenal null. Susun ulang datanya (bungkus lariknya di dalam sebuah kunci, buang atau beri nilai bawaan pada null-nya) dan konversinya akan berhasil.'
			},
			{
				q: 'Apakah YAML merupakan superset dari JSON?',
				a: 'Secara praktis ya — YAML 1.2 mengurai hampir semua dokumen JSON, itu sebabnya menempelkan JSON ke dalam konfigurasi YAML biasanya jalan. Sebaliknya tidak berlaku: jangkar, skalar multibaris, dan tag milik YAML tidak punya padanan di JSON sehingga saat dikonversi akan dikembangkan atau dijadikan string.'
			}
		]
	},

	'json-to-csv': {
		about: [
			'Tempel larik objek JSON dan dapatkan CSV yang siap masuk lembar sebar: objek bersarang diratakan menjadi nama kolom bertitik (user.address.city), kolomnya digabung dari seluruh baris (nilai yang tak ada menjadi sel kosong), dan pengutipannya mengikuti RFC 4180 sehingga koma, tanda kutip, dan ganti baris di dalam nilai selamat melewati Excel maupun Google Sheets.',
			'Ini jalur tercepat dari respons API menuju lembar sebar yang bisa disaring dan dibuat pivot oleh siapa pun. Penggabungan kolom penting pada data dunia nyata yang objeknya tidak seragam — baris ke-1 bisa saja kekurangan bidang yang dimiliki baris ke-40, dan konverter menanganinya alih-alih menyerah dengan galat atau membuang data.',
			'Konverternya juga berjalan terbalik: tempel hasil ekspor CSV dan dapatkan larik objek JSON berkunci baris tajuk, dengan deteksi pemisah otomatis (koma, titik koma, tab, garis tegak) dan opsi nilai bertipe — angka, boolean, dan null menjadi tipe JSON sungguhan. Kedua arah berjalan sepenuhnya di browser Anda, jadi ekspor data pelanggan tidak pernah meninggalkan mesin Anda.'
		],
		faqs: [
			{
				q: 'Bagaimana objek bersarang direpresentasikan?',
				a: 'Diratakan dengan kunci yang disambung titik: {"user":{"name":"Ada"}} menjadi kolom user.name. Dengan begitu setiap nilai skalar tetap bisa dialamatkan dalam satu baris tajuk yang datar, dan itulah yang benar-benar bisa diolah perkakas lembar sebar.'
			},
			{
				q: 'Apa yang terjadi pada larik di dalam sebuah baris?',
				a: 'Larik disematkan sebagai teks JSON dalam satu sel (["a","b"]). Memecah larik menjadi kolom (tags.0, tags.1…) atau baris tambahan mengubah bentuk data Anda menurut selera tertentu — menyematkannya menjaga konversi tetap tanpa kehilangan dan mudah ditebak.'
			},
			{
				q: 'Kenapa Excel menampilkan CSV saya dalam satu kolom saja?',
				a: 'Karena setelan lokal: di sebagian besar Eropa, Excel mengharapkan berkas berpemisah titik koma sebab koma dipakai sebagai pemisah desimal. Ganti opsi pemisah menjadi titik koma, atau gunakan Data → From Text/CSV yang memungkinkan Anda menentukan pemisahnya sendiri.'
			},
			{
				q: 'Apakah konverternya menangani objek tunggal (bukan larik)?',
				a: 'Ya — objek yang berdiri sendiri menjadi CSV satu baris. Namun objek yang berkunci ID ({"a1":{...},"a2":{...}}) berubah menjadi satu baris yang sangat lebar; ubah dulu menjadi larik bila tiap nilainya semestinya menjadi satu baris.'
			},
			{
				q: 'Bagaimana CSV → JSON menangani bidang berkutip dan ganti baris di dalamnya?',
				a: 'Sesuai RFC 4180: bidang yang dibungkus tanda kutip ganda boleh memuat pemisah, kutip ganda berulang ("") untuk satu kutip harfiah, dan ganti baris. Excel dan sebagian besar basis data mengekspor persis format ini, jadi berkas nyata terurai dengan benar.'
			},
			{
				q: 'Kenapa nol di depan kode pos saya hilang saat CSV → JSON?',
				a: 'Konversi bertipe mengubah 02134 menjadi angka 2134. Matikan “Nilai bertipe” dan setiap sel akan tetap berupa string persis seperti tertulis — pilihan yang tepat untuk pengenal, nomor telepon, dan apa pun yang punya nol di depan.'
			}
		]
	},

	'json-to-typescript': {
		about: [
			'Tempel contoh JSON — respons API, berkas konfigurasi — dan dapatkan antarmuka TypeScript yang disimpulkan darinya: objek bersarang menjadi tipe bersarang, larik memperoleh tipe elemen (dengan union bila isinya campur), dan kunci yang bukan pengenal sah dikutip dengan benar.',
			'Tipe yang dihasilkan adalah titik awal, bukan kontrak: penyimpulan hanya melihat satu contoh, jadi bidang yang kebetulan bernilai null di contoh Anda akan bertipe null, dan bidang opsional yang tidak muncul sama sekali tak diketahuinya. Keluarannya sengaja polos — tanpa dekorator, tanpa validasi saat runtime — supaya bisa Anda tempel ke mana pun lalu dipoles.',
			'Untuk bidang yang berbeda-beda antar-permintaan, jalankan contoh kedua lalu gabungkan secara manual, atau naik kelas ke perkakas berbasis skema (OpenAPI, zod) begitu bentuk datanya stabil. Untuk momen harian “saya cuma butuh tipe buat respons ini”, sekali tempel sudah cukup.'
		],
		faqs: [
			{
				q: 'Kenapa bidang saya yang bisa null malah bertipe null saja?',
				a: 'Penyimpulan hanya melihat contoh yang Anda tempel. Kalau di sana bidangnya null, ya null itulah satu-satunya yang bisa ia ketahui. Ubah menjadi string | null (atau apa pun tipe sebenarnya) setelah pembuatan — atau tempel contoh yang bidangnya terisi.'
			},
			{
				q: 'Bagaimana bidang opsional ditangani?',
				a: 'Tidak terdeteksi — satu contoh tidak bisa membedakan “selalu ada” dari “kebetulan ada kali ini”. Bidang yang absen di contoh juga absen di tipe. Tandai sendiri sebagai opsional (name?:) di tempat Anda tahu API kadang tidak mengirimkannya.'
			},
			{
				q: 'Larik bertipe campuran menghasilkan apa?',
				a: 'Sebuah union: [1, "a"] disimpulkan menjadi (number | string)[]. Larik kosong disimpulkan sebagai unknown[] karena tidak ada elemen untuk diperiksa — ganti dengan tipe elemen yang sesungguhnya begitu Anda tahu.'
			},
			{
				q: 'Sebaiknya pakai tipe hasil penyimpulan atau pustaka skema seperti zod?',
				a: 'Antarmuka hasil penyimpulan hanya hidup saat kompilasi — ia tidak memvalidasi apa pun saat runtime. Untuk perkakas internal dan pengetikan cepat, itu sempurna; untuk masukan tak tepercaya saat runtime, definisikan skema zod/valibot lalu turunkan tipe statisnya dari sana.'
			}
		]
	},

	'jsonpath-tester': {
		about: [
			'Uji ekspresi JSONPath terhadap JSON Anda sendiri dan lihat setiap kecocokan lengkap dengan nilainya sekaligus path konkretnya. Sintaksis yang didukung mencakup pemakaian sehari-hari: notasi titik dan kurung siku, indeks larik (termasuk negatif), wildcard, gabungan ([\'a\',\'b\']), dan penelusuran rekursif ($..price).',
			'Keluaran path pada tiap kecocokan adalah bagian yang diam-diam paling berguna: jalankan $..id pada dokumen yang dalam, dan tiap hasil memberi tahu persis di mana ia tinggal ($.data.items[3].id), siap ditempel ke dalam kode. Ia mengubah “ada di suatu tempat dalam gumpalan ini” menjadi alamat yang pasti.',
			'Ekspresi penyaring ([?(@.price < 10)]) belum diterapkan — alatnya mengatakannya terang-terangan alih-alih mengembalikan hasil yang salah. Untuk ekstraksi struktural, yang merupakan mayoritas penggunaan JSONPath, semuanya berfungsi.'
		],
		faqs: [
			{
				q: 'Apa bedanya $.a.b dan $..b?',
				a: '$.a.b menempuh satu rute persis: kunci a di akar, lalu kunci b di dalamnya. $..b (penelusuran rekursif) menemukan setiap b di mana pun dalam dokumen, pada kedalaman berapa pun. Penelusuran rekursif itu ampuh tetapi bisa mengejutkan — ia juga mencocokkan kunci b yang bersarang di tempat yang tak Anda pertimbangkan.'
			},
			{
				q: 'Bagaimana mengakses kunci yang mengandung spasi atau tanda hubung?',
				a: 'Dengan notasi kurung siku berkutip: $[\'my key\'] atau $.data[\'content-type\']. Notasi titik hanya bekerja untuk kunci yang berbentuk nama pengenal yang sah.'
			},
			{
				q: 'Apakah indeks larik negatif berfungsi?',
				a: 'Ya — [-1] adalah elemen terakhir, [-2] elemen kedua dari belakang, mengikuti konvensi yang dipopulerkan Python dan diadopsi RFC 9535. [0] tetap elemen pertama.'
			},
			{
				q: 'Apakah JSONPath sudah dibakukan?',
				a: 'Sejak 2024, ya — RFC 9535 mendefinisikan sintaksis dan semantiknya. Implementasi yang ditulis sebelum itu berbeda-beda pada kasus tepi (terutama penyaring dan gabungan), jadi ekspresi yang sama bisa berperilaku lain di pustaka berbeda; ujilah pada implementasi yang Anda pakai saat merilis.'
			}
		]
	},

	'bcrypt-generator': {
		about: [
			'Hash kata sandi dengan bcrypt pada faktor biaya pilihan Anda, atau verifikasi teks polos terhadap hash yang sudah ada — keduanya sepenuhnya di dalam browser, yang justru itulah yang Anda inginkan ketika yang sedang diuji adalah sebuah kata sandi. Ada pula pemeriksa hash yang memecah hash bcrypt mana pun menjadi versi, biaya, dan salt-nya.',
			'Bcrypt tetap pilihan yang kokoh untuk menyimpan kata sandi karena ia sengaja lambat dan bergaram per kata sandi: faktor biaya melipatduakan kerja pada setiap kenaikan, jadi biaya 12 berarti 4096 iterasi penyiapan sandi di bawahnya. Tampilan waktunya memperlihatkan berapa lama biaya pilihan Anda berjalan, sehingga pertukaran antara keamanan dan latensi menjadi konkret.',
			'Kebutuhan harian yang lebih sering justru verifikasi: memastikan bahwa hash di basis data cocok dengan kata sandi yang diketahui tanpa menyalakan kode aplikasi. Tempel keduanya, dapatkan jawaban ya atau tidak.'
		],
		faqs: [
			{
				q: 'Faktor biaya berapa yang sebaiknya saya pakai di produksi?',
				a: 'Panduan klasiknya: setinggi yang masih dimaafkan anggaran latensi login Anda, umumnya 10–13 saat ini. Bidik 100–300 ms per hash pada perangkat keras produksi Anda. JavaScript di browser berjalan lebih lambat daripada kode native, jadi waktu yang tampil di sini adalah batas atas untuk server Anda.'
			},
			{
				q: 'Kenapa kata sandi yang sama menghasilkan hash berbeda setiap kali?',
				a: 'Salt acak sepanjang 16 bita dibuat untuk tiap hash dan disimpan di dalam string hash itu sendiri. Itu memang disengaja — kata sandi identik memperoleh hash berbeda, sehingga tabel pelangi pra-hitung menjadi percuma. Verifikasi membaca kembali salt dari dalam hash, itulah sebabnya pembandingan tetap bisa jalan.'
			},
			{
				q: 'Apa arti bagian-bagian sebuah hash bcrypt?',
				a: '$2b$12$ + 53 karakter: 2b adalah versi algoritmenya, 12 adalah biayanya (2^12 iterasi), 22 karakter berikutnya adalah salt, dan 31 karakter terakhir adalah digest — semuanya dalam alfabet base64 khas bcrypt. Pemeriksa di bawah alat ini memecah hash mana pun dengan cara itu.'
			},
			{
				q: 'Apakah bcrypt masih dianjurkan ketimbang Argon2?',
				a: 'Argon2id adalah pilihan pertama saat ini untuk sistem baru (kebutuhan memorinya menyulitkan pembobolan dengan GPU). Bcrypt tetap dapat diterima dan ada di mana-mana — saran praktisnya: jangan panik memigrasikan penyimpanan bcrypt yang sudah berjalan baik, tetapi pilihlah Argon2id untuk rancangan yang dimulai dari nol. Keduanya jauh melampaui hash cepat semacam SHA-256.'
			}
		]
	},

	'user-agent-parser': {
		about: [
			'Tempel string User-Agent dari sebaris log, laporan bug, atau ekspor analitik dan dapatkan hasil bacaannya: browser dan versinya, mesin render, sistem operasi, jenis perangkat, dan arsitektur CPU. Penguraiannya memakai ua-parser-js, pustaka yang sama di balik tak terhitung alur analitik, berjalan lokal atas string Anda.',
			'String User-Agent adalah situs arkeologi — semuanya masih mengaku Mozilla/5.0, Chrome mengaku Safari, Safari mengaku KHTML, dan identitas aslinya bersembunyi di token-token belakangan. Pengurai lebih baik daripada memicingkan mata: ia tahu “CriOS” berarti Chrome di iOS dan Edge bersembunyi di balik “Edg/”.',
			'Perhatikan arah perkembangannya: browser sedang membekukan dan memangkas string UA (dan Chromium mengirim UA Client Hints sebagai gantinya), jadi detail versi dari UA semata makin kasar. Untuk forensik log dan triase bug ia tetap tak tergantikan; untuk keputusan soal fitur, gunakan deteksi fitur.'
		],
		faqs: [
			{
				q: 'Kenapa setiap User-Agent diawali Mozilla/5.0?',
				a: 'Sandiwara kompatibilitas dari era 1990-an yang tidak pernah usai: server mengendus kata “Mozilla” sebelum menyajikan halaman modern, jadi setiap browser baru mengaku sebagai Mozilla, dan tiap browser berikutnya menyamar sebagai pendahulunya. Sekarang awalan itu tinggal tradisi tanpa makna.'
			},
			{
				q: 'Bisakah saya memercayai versi OS di dalam string UA?',
				a: 'Makin tahun makin tidak. macOS membekukan versi UA-nya pada 10_15_7, Windows 11 melaporkan diri sebagai Windows NT 10.0, dan browser ber-UA terpangkas sengaja mengasarkan versinya. Perlakukan versi OS dari UA sebagai perkiraan; pakailah UA Client Hints di tempat Anda menguasai kliennya.'
			},
			{
				q: 'Apa maksud “like Gecko” atau “KHTML, like Gecko”?',
				a: 'Lapisan penyamaran lagi: WebKit berakar pada KHTML dan ingin halaman yang memberi perlakuan khusus pada Gecko (mesin Firefox) tetap jalan, maka ia menambahkan “like Gecko”. Setiap browser WebKit/Blink membawa frasa itu sampai hari ini.'
			},
			{
				q: 'Haruskah saya memakai penguraian UA untuk deteksi fitur?',
				a: 'Jangan — pengendusan UA rusak begitu versi browser baru dirilis. Deteksilah fiturnya sendiri (if ("clipboard" in navigator)). Penguraian UA berguna untuk analitik, analisis log, dan mereproduksi bug yang dilaporkan pengguna, yaitu situasi ketika mengetahui lingkungannya memang justru intinya.'
			}
		]
	},

	'color-converter': {
		about: [
			'Masukkan warna dalam notasi umum mana pun — #hex, rgb(), hsl(), atau nama warna CSS — dan dapatkan semua format sekaligus: HEX, RGB, HSL, dan OKLCH, berdampingan dengan contoh warna langsung. Kanal alfa dipertahankan lintas format, dan keluarannya memakai sintaksis CSS modern (kanal dipisah spasi) yang menempel rapi ke lembar gaya masa kini.',
			'OKLCH disertakan karena ke sanalah warna di CSS bergerak: berbeda dari HSL, sumbu terangnya seragam secara persepsi, jadi dua warna dengan L yang sama benar-benar tampak sama terangnya, dan mengubah rona tidak diam-diam menggeser terang yang dirasakan. Memindahkan palet yang sudah ada ke OKLCH adalah langkah pertama membangun skala warna yang konsisten.',
			'Matematika konversinya berjalan lokal memakai transformasi sRGB↔OKLab yang telah dipublikasikan, dan nilainya bolak-balik utuh: RGB yang Anda peroleh kembali dari masukan HSL persis sama dengan yang akan dihitung browser.'
		],
		faqs: [
			{
				q: 'Kenapa nilai terang di HSL dan OKLCH tidak sepakat?',
				a: 'Terang pada HSL adalah properti geometris nilai RGB, bukan properti penglihatan manusia — kuning hsl(60 100% 50%) tampak jauh lebih terang daripada biru hsl(240 100% 50%) meski L-nya identik. Sumbu L OKLCH dirancang mengikuti persepsi, jadi L yang sama berarti terang tampak yang sama. Ketidaksepakatan itulah alasan keberadaan OKLCH.'
			},
			{
				q: 'Apa arti nilai alfa dan di mana letaknya pada tiap format?',
				a: 'Alfa adalah keburaman, dari 0 (bening) sampai 1 (pekat). Pada hex delapan digit ia adalah bita terakhir (#RRGGBBAA); pada sintaksis fungsional modern ia mengikuti garis miring: rgb(76 141 255 / 0.5). Konverter ini membawa alfa melewati setiap format secara otomatis.'
			},
			{
				q: 'Apakah setiap warna OKLCH bisa ditampilkan dalam sRGB?',
				a: 'Tidak — OKLCH mencakup gamut lebar, dan sebagian kombinasi kroma/terang tidak punya padanan sRGB. Mengonversi dari sRGB (seperti yang dilakukan alat ini) selalu tetap dapat direpresentasikan; ke arah sebaliknya, warna di luar gamut harus dipangkas atau dipetakan — itu sebabnya hijau P3 yang menyala tampak lebih kusam di layar sRGB.'
			},
			{
				q: 'Kenapa rgb(76 141 255) dipisah spasi, bukan koma?',
				a: 'CSS Color Module Level 4 membakukan kanal berpemisah spasi dengan /alfa opsional, dan setiap browser modern mendukungnya. Bentuk berkoma masih berfungsi, tetapi bentuk berspasi itulah yang dipakai spesifikasi baru (dan alat ini).'
			}
		]
	},

	'image-to-base64': {
		about: [
			'Jatuhkan, pilih, atau tempel sebuah gambar lalu dapatkan bentuk Base64-nya dalam segala rasa yang mungkin Anda butuhkan: data URL siap pakai, deklarasi background-image untuk CSS, tag <img> lengkap dengan dimensi intrinsiknya, serta muatan Base64 mentah. Arah sebaliknya juga jalan — tempel data URL atau gumpalan Base64 telanjang, dan gambarnya didekode, dipratinjau, dan bisa diunduh sebagai berkas.',
			'Formatnya dikenali dari bita ajaib, bukan dari ekstensi berkas atau tipe MIME yang dinyatakan, jadi berkas PNG yang diganti nama menjadi .jpg (atau data URL berlabel keliru) tetap terkonversi dengan benar. Panel ukurannya jujur soal ongkosnya: Base64 menggelembungkan data sekitar sepertiga, dan ukuran terenkode yang persis ditampilkan di sebelah aslinya supaya Anda bisa menimbang apakah penyematan itu sepadan.',
			'Berbeda dari kebanyakan situs gambar-ke-Base64, tidak ada yang diunggah — berkasnya dibaca dengan FileReader API milik browser lalu dienkode di dalam halaman. Itu membuatnya aman untuk tangkapan layar dasbor internal, foto produk yang belum diluncurkan, atau apa pun yang lebih baik tidak Anda serahkan ke server orang asing.'
		],
		faqs: [
			{
				q: 'Kapan sebaiknya menyematkan gambar sebagai Base64 alih-alih menautkan berkas?',
				a: 'Ketika gambarnya kecil (kira-kira di bawah 10 KB), jarang berubah, dan kalau dipisah justru menambah satu permintaan HTTP — misalnya ikon, logo di surel, atau dokumen HTML satu berkas. Untuk apa pun yang lebih besar, berkas terpisah menang: ia di-cache sendiri, dimuat paralel, dan tidak menggemukkan HTML atau CSS Anda sebesar 33%.'
			},
			{
				q: 'Kenapa versi Base64-nya sekitar sepertiga lebih besar daripada berkas saya?',
				a: 'Base64 mewakili tiap 3 bita biner sebagai 4 karakter ASCII, yakni tambahan struktural +33% (plus paling banyak dua karakter padding). Gzip atau Brotli di server merebut kembali sebagian, tetapi penggelembungan itu melekat pada pengodeannya — ia menukar ukuran demi kemampuan menyisipkan data biner ke dalam teks.'
			},
			{
				q: 'Bisakah saya mendekode data URL yang saya temukan di lembar gaya atau HTML?',
				a: 'Bisa — beralihlah ke Base64 → gambar lalu tempel seluruhnya, termasuk awalan data:. Data URL SVG berenkode persen (yang tanpa ;base64) juga bisa didekode, dan ganti baris atau spasi di dalam muatannya dibersihkan otomatis. Hasilnya dipratinjau di halaman dan diunduh dengan ekstensi yang benar.'
			},
			{
				q: 'Apakah ini bekerja untuk SVG, GIF, dan ICO, atau hanya PNG dan JPEG?',
				a: 'Semua yang dikenali pengendus format bisa dikonversi ke Base64: PNG, JPEG, WebP, GIF, SVG, BMP, ICO, dan AVIF. Khusus SVG, pertimbangkan bahwa sumber XML-nya sering kali lebih kecil dan lebih terbaca bila disisipkan langsung — mengenkode SVG ke Base64 baru masuk akal ketika urusan kutip-mengutip atau escape jadi merepotkan.'
			}
		]
	},

	'image-converter': {
		about: [
			'Konversikan gambar antara PNG, JPEG, dan WebP tanpa memasang apa pun dan tanpa mengunggah ke mana pun: jatuhkan berkasnya, pilih tujuannya, atur kualitas lewat penggeser langsung, dan pantau ukuran keluaran diperbarui seketika. Ubin Δ memperlihatkan persis seberapa lebih kecil (atau lebih besar) berkas hasil konversi, sehingga memilih setelan kualitas berhenti jadi tebak-tebakan.',
			'Ketiga format punya tugas berbeda. PNG bersifat nirsusut dengan transparansi penuh — tepat untuk tangkapan layar, aset antarmuka, dan apa pun yang bertepi tajam atau berteks. JPEG memampatkan foto secara agresif tetapi tidak punya kanal alfa dan mengaburkan tepi keras. WebP biasanya mengungguli JPEG 25–35% pada kualitas setara, mendukung transparansi, dan didukung penuh di browser masa kini — untuk web, biasanya itulah jawabannya.',
			'Konversinya terjadi di atas canvas dalam browser Anda: gambarnya didekode, digambar ulang, dan dienkode kembali oleh kodek yang sama dengan yang dipakai browser untuk menampilkan halaman. Itulah yang membuat alat ini privat — sekaligus alasan jumlah bita persisnya sedikit berbeda antara Chrome, Firefox, dan Safari, sebab masing-masing membawa enkodernya sendiri.'
		],
		faqs: [
			{
				q: 'Setelan kualitas berapa yang sebaiknya saya pakai untuk JPEG dan WebP?',
				a: 'Rentang 75 sampai 90 mencakup hampir semua pemakaian nyata. Pada 85, kebanyakan foto tak terbedakan secara visual dari sumbernya dengan ukuran sepersekian; di bawah sekitar 70, artefak kotak-kotak merayapi gradasi dan warna kulit; di atas 90, ukuran berkas menanjak curam demi perolehan yang tak kasat mata. Geser penggesernya dan pantau ubin ukuran — titik manisnya biasanya kelihatan jelas.'
			},
			{
				q: 'Kenapa PNG saya malah membesar setelah dikonversi ke JPEG?',
				a: 'JPEG dibuat untuk gradasi fotografis, bukan warna datar. Tangkapan layar, diagram, dan gambar antarmuka memampat luar biasa sebagai PNG (deretan panjang piksel identik) tetapi memaksa JPEG menyimpan derau di sekeliling setiap tepi tajam — berkas lebih besar dan berbayang kentara. Simpan grafik semacam itu sebagai PNG, atau ubah ke WebP yang condong nirsusut.'
			},
			{
				q: 'Apa yang terjadi pada transparansi ketika saya konversi ke JPEG?',
				a: 'JPEG tidak punya kanal alfa, jadi wilayah transparan harus diisi sesuatu — alat ini meratakannya ke putih, konvensi untuk gambar web. Kalau transparansinya harus selamat, pilih PNG atau WebP sebagai tujuannya.'
			},
			{
				q: 'Kenapa browser saya tidak bisa mengekspor AVIF atau HEIC di sini?',
				a: 'API canvas toBlob hanya mengenkode format yang enkodernya dibawa browser — PNG dan JPEG di mana-mana, WebP di Chromium dan Firefox. Pengodean AVIF masih jarang dan HEIC terbebani paten, jadi browser mendekodenya tetapi tidak memproduksinya. Kalau Anda memilih format yang tak bisa ditulis browser Anda, alat ini mengatakannya alih-alih diam-diam memberi Anda PNG.'
			}
		]
	},

	'image-resizer': {
		about: [
			'Ubah ukuran gambar ke lebar tertentu, tinggi tertentu, atau persentase dari aslinya — dimensi satunya mengikuti otomatis sehingga tak ada yang melar. Pilih format keluaran (atau pertahankan format sumber), atur kualitas untuk tujuan yang bersusut, pratinjau hasilnya, lalu unduh. Ubin sebelum/sesudah memperlihatkan dimensi dan ukuran berkas sekali lihat.',
			'Penskalaannya memakai mode penghalusan berkualitas tinggi milik browser, yang menerapkan pengambilan sampel ulang yang benar alih-alih pemangkasan tetangga terdekat — foto yang diperkecil tetap renyah, bukan berkelip oleh aliasing. Mengubah ukuran juga cara paling jujur untuk mengecilkan berkas: memangkas separuh kedua dimensi membuang tiga perempat pikselnya, sesuatu yang tak bisa ditandingi penggeser kualitas mana pun.',
			'Berkas tak pernah meninggalkan halaman: pendekodean, pengambilan sampel ulang, dan pengodean ulang semuanya berjalan pada canvas lokal. Tidak ada bilah kemajuan unggah karena memang tidak ada unggahan — foto 40 megapiksel berubah ukuran secepat mesin Anda menggambarnya ulang, dan tetap jalan meski kabel jaringan dicabut.'
		],
		faqs: [
			{
				q: 'Apakah memperkecil lalu memperbesar lagi akan memulihkan gambar saya?',
				a: 'Tidak — memperkecil membuang piksel secara permanen. Menskalakan foto 3000px menjadi 300px hanya menyisakan 1% datanya; memperbesarnya kembali cuma menginterpolasi 99% yang hilang menjadi keburaman. Simpan berkas aslinya dan ekspor salinan yang diperkecil dari sana, alih-alih mengubah ukuran satu-satunya salinan yang Anda punya.'
			},
			{
				q: 'Kenapa gambar saya tampak lembek setelah diperbesar?',
				a: 'Memperbesar tak bisa menciptakan detail yang memang tak pernah terekam — browser menginterpolasi di antara piksel yang ada, dan di atas sekitar 2× itu terbaca sebagai kelembekan. Pembesaran sungguhan melampaui itu memerlukan perkakas berbasis pembelajaran mesin yang mengarang detail yang masuk akal; pengambil sampel ulang di canvas justru sengaja tidak mengarang apa pun.'
			},
			{
				q: 'Bagaimana cara mencapai target ukuran berkas, misalnya “di bawah 200 KB”?',
				a: 'Mainkan kedua tuasnya: pertama kecilkan ke dimensi terbesar yang benar-benar Anda butuhkan (lebar 1200px sudah lebih dari cukup untuk mayoritas tata letak web), lalu pilih WebP atau JPEG dan turunkan kualitas sampai ubin ukurannya berada di bawah target. Pengurangan dimensi mengerjakan bagian terbesarnya — penyetelan kualitas merapikan sisanya.'
			},
			{
				q: 'Apakah mengubah ukuran menghapus metadata EXIF seperti lokasi GPS?',
				a: 'Ya. Jalur canvas mengenkode ulang piksel murni — model kamera, stempel waktu, koordinat GPS, dan semua tag EXIF lainnya lenyap dari keluarannya. Untuk gambar yang menuju web publik, itu biasanya keuntungan bagi privasi; kalau metadatanya perlu dipertahankan, simpan berkas aslinya di samping.'
			}
		]
	},

	'favicon-generator': {
		about: [
			'Jatuhkan satu gambar — idealnya logo persegi berukuran 512px atau lebih — dan dapatkan paket favicon lengkap: sebuah favicon.ico yang memuat 16, 32, dan 48 px untuk tab dan markah, berkas PNG pada ukuran-ukuran baku termasuk ikon Apple touch 180px dan ikon PWA 192/512px, satu site.webmanifest awal, serta tag <link> untuk ditempel ke dalam <head> Anda. Satu unduhan ZIP memuat semuanya, dengan penamaan persis seperti yang diharapkan konvensi.',
			'Detail yang sering keliru di tutorial favicon sudah ditangani: ICO-nya menyematkan entri terkompresi PNG (didukung di mana-mana sejak Windows Vista, jauh lebih kecil daripada ikon BMP warisan); ikon Apple touch diratakan ke warna latar pilihan Anda, karena iOS mengganti transparansi dengan hitam; dan ikon PWA mempertahankan kanal alfanya. Sumber yang tidak persegi dipotong dari tengah, bukan dipenyet.',
			'Mengecilkan logo ke 16px pada dasarnya merusak — detail halus memang tak mungkin selamat — maka baris pratinjau memperlihatkan tiap ukuran pada dimensi sebenarnya, supaya Anda bisa menilai keterbacaannya sebelum dirilis. Semuanya dirender pada canvas lokal dan wadah ICO/ZIP dirakit bita demi bita di dalam halaman; logo Anda tidak pernah diunggah ke mana pun.'
		],
		faqs: [
			{
				q: 'Ukuran favicon apa saja yang sebenarnya saya perlukan pada 2026?',
				a: 'Lebih sedikit daripada yang disugestikan cerita rakyat: sebuah favicon.ico berisi 16/32/48 untuk keperluan warisan dan bilah alamat, satu apple-touch-icon.png 180px, serta PNG 192/512px yang dirujuk dari manifest aplikasi web. Browser modern memilih padanan terbaik justru dari himpunan ini — paket 20 berkas yang dimuntahkan sebagian generator itu sekadar kultus kargo.'
			},
			{
				q: 'Kenapa logo saya tidak terbaca pada 16px?',
				a: 'Enam belas piksel itu kejam kecilnya — logotaip, garis tipis, dan gradasi halus semuanya luluh. Favicon yang kuat memampatkan merek menjadi satu glif atau bentuk tebal dengan kontras tinggi. Kalau pratinjau 16px di sini tampak jadi bubur, potonglah lebih rapat ke bagian paling khas dari logo itu, atau pakai varian yang disederhanakan untuk ukuran kecil.'
			},
			{
				q: 'Apakah saya masih perlu berkas .ico, atau favicon PNG sudah cukup?',
				a: 'Setiap browser modern menerima favicon PNG, tetapi /favicon.ico tetap jalur yang diminta secara membabi buta oleh agen pengguna, perayap, dan perkakas lama. Menyajikan ICO sungguhan di sana hanya memakan beberapa kilobita dan menyingkirkan satu kelas penuh galat 404 serta keanehan cadangan — simpan saja berdampingan dengan tautan PNG Anda.'
			},
			{
				q: 'Kenapa ikon Apple touch memerlukan warna latar?',
				a: 'iOS tidak merender transparansi pada ikon layar utama — alfa apa pun di PNG Anda akan dikomposisikan di atas hitam. Meratakannya lebih dulu ke warna pilihan Anda menjaga hasilnya tetap disengaja. Pilih latar yang serasi dengan ikon Anda, dan ingat iOS membulatkan sudutnya sendiri, jadi sediakan persegi penuh tanpa margin.'
			}
		]
	},

	'sql-formatter': {
		about: [
			'Tempel kueri yang baru saja keluar dari berkas log, dari dump debug ORM, atau dari satu baris panjang milik rekan kerja, dan perapi ini memecahnya menjadi klausa-klausa terbaca dengan indentasi yang konsisten. Enam dialek didukung — SQL standar, PostgreSQL, MySQL, SQLite, SQL Server, dan BigQuery — sehingga sintaksis khas dialek seperti TOP, pengenal dalam tanda petik terbalik, atau tipe larik terformat dengan benar alih-alih menjegal penguraiannya.',
			'Besar-kecil huruf kata kunci bisa diatur: HURUF BESAR untuk tampilan klasik, huruf kecil bila tim Anda lebih suka begitu, atau biarkan apa adanya. Mode minifikasi melakukan kebalikannya — ia meringkas kueri terformat menjadi satu baris, membuang komentar sambil membiarkan literal string utuh bita demi bita, persis yang Anda inginkan sebelum menempelkan SQL ke konfigurasi JSON atau ke sebuah flag CLI.',
			'Kueri kerap memuat nama tabel, data pelanggan di dalam literal, atau petunjuk soal infrastruktur. Perapian berjalan sepenuhnya di browser Anda, jadi tidak satu pun dari itu sampai ke server.'
		],
		faqs: [
			{
				q: 'Dialek SQL mana yang sebaiknya saya pilih?',
				a: 'Yang dipakai basis data Anda — pilihan itu mengubah cara pengenal, pengutipan string, dan kata kunci dialek diurai. Kalau Anda cuma perlu perapian umum, SQL standar sudah menangani inti yang lazim. Galat penguraian pada sintaksis yang sebenarnya sah di basis data Anda biasanya pertanda untuk berganti dialek.'
			},
			{
				q: 'Apakah perapian mengubah apa yang dikerjakan kueri?',
				a: 'Tidak. Perapian hanya memindahkan spasi dan, bila diaktifkan, mengubah besar-kecil huruf kata kunci — pengenal dan literal mempertahankan bitanya persis. Kata kunci SQL tidak peka besar-kecil huruf di semua dialek yang didukung, jadi SELECT dan select adalah pernyataan yang sama.'
			},
			{
				q: 'Bisakah saya merapikan beberapa pernyataan sekaligus?',
				a: 'Bisa — tempel satu skrip utuh, dan tiap pernyataan yang diakhiri titik koma dirapikan berurutan dengan satu baris kosong di antaranya.'
			},
			{
				q: 'Apa persisnya yang dibuang minifikasi?',
				a: 'Komentar baris (--) dan komentar blok (/* */) dibuang, deretan spasi menciut jadi satu spasi, dan spasi di sekitar koma serta tanda kurung dihapus. Teks di dalam petik tunggal, petik ganda, dan petik terbalik tidak pernah disentuh, termasuk escape berupa petik berganda.'
			}
		]
	},

	'xml-formatter': {
		about: [
			'Alat ini merapikan XML dengan indentasi pilihan Anda, menandai galat well-formedness lengkap dengan baris dan kolom persisnya, serta bisa memampatkan dokumen menjadi satu baris. Komentar, bagian CDATA, dan prolog XML selamat melewati perapian — mengejutkan banyaknya perapi yang diam-diam melahapnya.',
			'Validasi di sini berarti well-formedness: tag bersarang dengan benar, atribut berkutip, karakter yang sah. Itu menangkap sebagian besar kecelakaan penyuntingan manual — garis miring yang hilang, elemen yang tak ditutup, ampersand nyasar. Validasi terhadap skema XSD sengaja berada di luar cakupan; tempatnya di alur build Anda, di mana berkas skemanya tersedia.',
			'Berkas konfigurasi, muatan SOAP, umpan RSS, dan manifest Android rutin memuat nama host internal dan kunci. Semuanya diurai secara lokal di sini — tidak ada yang dikirim ke mana pun.'
		],
		faqs: [
			{
				q: 'Kenapa XML saya gagal dengan “char … is not expected”?',
				a: 'Tersangka biasanya: & mentah yang seharusnya &amp;, nilai atribut tanpa tanda kutip, atau tag yang ditutup dengan urutan keliru. Pesan galatnya membawa baris dan kolom karakter bermasalah pertama, dan kotak masukan menandainya.'
			},
			{
				q: 'Apakah perapinya mengurutkan ulang atau menormalkan dokumen saya?',
				a: 'Tidak. Elemen, atribut, dan urutannya dipertahankan persis; yang berubah hanya spasi antar-elemen. Isi teks yang berbagi baris dengan markup akan dipangkas dan deretan spasi di dalamnya diciutkan — kalau Anda mengandalkan spasi yang bermakna (xml:space="preserve"), simpan bagian itu dalam bentuk terminifikasi.'
			},
			{
				q: 'Apa yang dibuang minifikasi?',
				a: 'Indentasi dan ganti baris antar-elemen, plus komentar. Bagian CDATA, instruksi pemrosesan, dan prolog tetap tinggal. Hasilnya terurai identik bagi konsumen mana pun yang tidak bergantung pada simpul teks yang isinya cuma spasi.'
			},
			{
				q: 'Bisakah ia memvalidasi terhadap XSD atau DTD?',
				a: 'Tidak — ini hanya memeriksa well-formedness. Validasi skema memerlukan berkas skema dan mesin XSD, yang lebih baik dilakukan di rantai perkakas Anda (xmllint --schema, atau pustaka XML milik bahasa Anda).'
			}
		]
	},

	'xml-to-json': {
		about: [
			'Konversikan XML ke JSON untuk menyuapkan respons SOAP warisan, umpan RSS, atau POM Maven ke JavaScript, jq, atau API yang bicara JSON — atau tempuh arah sebaliknya dan hasilkan XML dari data JSON. Atributnya dipertahankan: mereka menjadi kunci "@_nama", dan isi teks yang berdampingan dengan atribut mendarat di bawah "#text", jadi tak ada informasi yang lenyap diam-diam.',
			'Kedua format berselisih di hal-hal mendasar, dan konverter ini mengambil pilihan pragmatis yang sudah baku: elemen bersaudara yang berulang diciutkan menjadi larik JSON, nilai yang terlihat numerik menjadi angka, dan namespace ikut serta sebagai bagian nama elemen. Perjalanan bolak-balik XML → JSON → XML mempertahankan struktur dan isi untuk dokumen pada umumnya.',
			'Kedua arah berjalan lokal di browser Anda. Tempel umpan faktur atau respons API tanpa ia pergi ke mana-mana.'
		],
		faqs: [
			{
				q: 'Kenapa sebagian nilai kembali sebagai angka, bukan string?',
				a: 'Penguraiannya mengenali teks numerik lalu mengonversinya, dan itulah yang diinginkan sebagian besar konsumen. Waspadalah pada pengenal dengan nol di depan (kode produk, nomor telepon) — kalau itu penting bagi data Anda, beri tanda kutip setelah konversi atau perlakukan keluarannya sebagai titik awal.'
			},
			{
				q: 'Bagaimana elemen berulang ditangani?',
				a: 'Dua atau lebih elemen bersaudara bernama sama menjadi larik JSON di bawah kunci itu. Kemunculan tunggal tetap menjadi objek biasa — ketaksimetrisan itu melekat pada pemetaannya, jadi kode yang mengonsumsi JSON-nya sebaiknya menerima kedua bentuk atau menormalkannya lebih dulu.'
			},
			{
				q: 'Apa arti kunci @_ dan #text?',
				a: '@_ menandai apa yang tadinya atribut XML, sedangkan #text membawa teks elemen ketika atribut juga hadir. Menyuapkan konvensi yang sama kembali ke arah JSON → XML akan merekonstruksi markup aslinya.'
			},
			{
				q: 'Kenapa JSON → XML menolak larik saya di tingkat teratas?',
				a: 'Dokumen XML harus punya tepat satu elemen akar, dan larik telanjang tidak punya satu pun. Bungkus lariknya di dalam objek — {"items": {"item": [...]}} — dan konverternya akan menghasilkan dokumen yang well-formed.'
			}
		]
	},

	'markdown-to-html': {
		about: [
			'Tulis atau tempel Markdown lalu lihat pratinjau hasil render dan HTML yang dihasilkan berdampingan — lengkap dengan judul, tabel GFM, butir bergaya daftar tugas, blok kode berpagar, dan coretan. Arah sebaliknya mengubah HTML yang sudah ada menjadi Markdown yang bersih dengan judul ATX, butir bertanda hubung, dan kode berpagar, yaitu cara tercepat memindahkan konten CMS lama ke repositori dokumentasi.',
			'Pratinjaunya dibersihkan sebelum dirender: skrip, iframe, dan atribut penangan peristiwa dibuang, jadi tautan berbagi yang membawa markup jahat tidak bisa mengeksekusi apa pun di browser Anda. Kotak keluaran HTML selalu memperlihatkan hasil konversi mentahnya untuk disalin ke templat atau surel.',
			'Konversi dan pratinjau berjalan lokal. Draf catatan rilis yang memuat nama fitur yang belum diumumkan tetap tinggal di mesin Anda.'
		],
		faqs: [
			{
				q: 'Ini ragam Markdown yang mana?',
				a: 'CommonMark plus perluasan GitHub yang memang dipakai orang: tabel, coretan, dan URL yang otomatis jadi tautan. Ganti baris lunak tetap lunak — satu baris baru tidak berubah menjadi <br>, sesuai cara GitHub merender dokumen.'
			},
			{
				q: 'Kenapa pratinjaunya berbeda dari keluaran HTML mentah?',
				a: 'Pratinjau melewati penyaring yang membuang tag skrip, penangan peristiwa sebaris, dan URL javascript: sebelum dirender. Kotak keluaran melewati penyaringan itu karena isinya teks, bukan markup yang dirender — bersihkan sendiri di hilir bila Anda menyematkan HTML dari pengguna.'
			},
			{
				q: 'Seberapa setia konversi HTML → Markdown?',
				a: 'Elemen struktural — judul, daftar, tautan, penekanan, kode, kutipan, gambar — terkonversi dengan bersih. HTML yang tidak punya padanan Markdown (tabel bersarang, div berkelas, gaya sebaris) lewat begitu saja sebagai HTML mentah atau kehilangan gayanya, jadi membaca ulang sebentar sesudahnya itu berfaedah.'
			},
			{
				q: 'Bisakah HTML yang dihasilkan dipakai di surel?',
				a: 'Bisa — keluarannya HTML semantik polos tanpa kelas maupun lembar gaya eksternal, dan justru itulah yang paling ditoleransi klien surel. Tambahkan gaya yang Anda perlukan secara sebaris di atasnya.'
			}
		]
	},

	'html-formatter': {
		about: [
			'Percantik HTML yang keluar dari bundler, scraper, atau editor WYSIWYG: elemen diberi indentasi selebar pilihan Anda, atribut tetap di barisnya, dan isi pre serta textarea dibiarkan utuh bita demi bita. Mode minifikasi membuang komentar dan menciutkan spasi di antara tag — biasanya memangkas 10–25% ukuran halaman yang ditulis tangan.',
			'Minifikasi di sini sengaja konservatif: skrip dan gaya sebaris dilindungi, komentar kondisional selamat, dan satu spasi di antara elemen sebaris dipertahankan supaya “klik <a>di sini</a> sekarang” tidak menyatu menjadi satu kata. Anda mendapat minifikasi yang aman, bukan yang seagresif mungkin.',
			'Kedua operasi berjalan lokal di browser Anda — halaman yang belum terbit dan markup panel admin internal tidak pernah meninggalkan mesin Anda.'
		],
		faqs: [
			{
				q: 'Apakah minifikasi akan merusak JavaScript atau CSS sebaris saya?',
				a: 'Tidak — blok <script>, <style>, <pre>, dan <textarea> dikecualikan sepenuhnya dari penciutan spasi. Hanya markup di antara tag yang disentuh. Untuk memampatkan skripnya sendiri, jalankan lewat minifier JavaScript secara terpisah.'
			},
			{
				q: 'Kenapa spasi di antara tag aman dibuang?',
				a: 'Sebagian besar memang begitu: spasi antar-elemen blok tidak berpengaruh secara visual. Di antara elemen sebaris, ia berpengaruh — itu sebabnya minifier menciutkan deretannya menjadi satu spasi alih-alih menghapusnya. Tata letak yang bergantung pada trik spasi inline-block adalah pengecualian langka yang layak dilirik.'
			},
			{
				q: 'Apakah perapinya memperbaiki HTML yang tidak sah?',
				a: 'Ia merapikan apa yang Anda berikan tanpa memvalidasinya terhadap spesifikasi HTML — tag yang tak ditutup tetap tak tertutup. Browser toleran terhadap markup berantakan, jadi perapian tetap membantu Anda melihat strukturnya cukup jelas untuk memergoki masalahnya.'
			},
			{
				q: 'Lebar indentasi berapa yang sebaiknya saya pakai?',
				a: '2 spasi adalah konvensi yang berlaku di basis kode web dan menjadi bawaan sebagian besar panduan gaya framework. Pilih 4 kalau tim Anda sudah menyeragamkannya — pilihan ini sekadar kosmetik.'
			}
		]
	},

	'css-formatter': {
		about: [
			'Bentangkan CSS yang terminifikasi atau hasil tempel-salin menjadi aturan dengan satu deklarasi per baris, atau perah lembar gaya untuk produksi. Pemercantiknya menormalkan indentasi dan penempatan kurung kurawal; minifiernya membuang komentar, menciutkan spasi, dan menghapus titik koma terakhir sambil membiarkan string, isi url(...), dan ekspresi calc() tak tersentuh.',
			'Minifiernya terbuka soal apa yang tidak dilakukannya: ia tidak mengganti nama selektor, tidak menggabungkan aturan kembar, dan tidak menulis ulang warna. Itu membuat keluarannya mudah ditebak dan aman untuk lembar gaya mana pun, termasuk yang penuh trik dan awalan vendor — tempel, minifikasi, rilis.',
			'Seperti semua alat di sini, pemrosesannya lokal. Kode design system yang belum dirilis tetap tinggal di browser Anda.'
		],
		faqs: [
			{
				q: 'Seberapa kecil CSS setelah diminifikasi?',
				a: 'Biasanya 15–30% untuk CSS yang ditulis tangan, sebagian besar berkat indentasi dan komentar. Gzip di server Anda sudah menghapus banyak redundansi yang sama, jadi selisih ukuran di jaringan lebih kecil daripada yang disugestikan hitungan bita mentah — tetap minifikasi saja, sebab itu juga memangkas waktu penguraian.'
			},
			{
				q: 'Apakah aman untuk calc(), properti kustom, dan kueri media?',
				a: 'Aman. Spasi di dalam calc() bermakna dan dipertahankan; properti kustom beserta rujukan var()-nya hanyalah deklarasi biasa dan lewat tanpa berubah; @media dan aturan-at lainnya mempertahankan strukturnya.'
			},
			{
				q: 'Kenapa selektor keturunan tetap menyimpan spasinya?',
				a: 'Karena “nav a” dan “nava” memilih hal yang berbeda — spasi itu sebuah kombinator, bukan format. Minifiernya hanya membuang spasi yang tidak punya makna sintaksis.'
			},
			{
				q: 'Bisakah ia mengonversi antara LESS/SCSS dan CSS?',
				a: 'Tidak — sintaksis prapemroses butuh kompilasi, bukan perapian. SCSS polos yang sekaligus merupakan CSS sah akan terformat baik-baik saja; aturan bersarang dan mixin tidak.'
			}
		]
	},

	'js-formatter': {
		about: [
			'Percantik JavaScript dengan indentasi dan spasi yang konsisten — bentangkan bundel bawaan agar terbaca apa sebenarnya yang ia lakukan, atau bereskan kode yang ditempel dari konsol. Minifiernya barang sungguhan: Terser mengurai kode Anda menjadi AST, membuang kode mati, memendekkan nama variabel lokal, dan mencabut komentar — mesin yang sama dengan yang dipakai bundler di produksi.',
			'Karena minifikasinya berbasis AST, ia tak pernah merusak kode yang berfungsi seperti yang bisa dilakukan “kompresor” berbasis regex: string, literal templat, regex, dan kasus tepi ASI ditangani oleh pengurai sungguhan. Galat sintaksis dilaporkan beserta posisinya alih-alih menghasilkan keluaran yang rusak.',
			'Terser baru dimuat saat Anda pertama kali meminifikasi, sehingga halamannya tetap ringan, dan semuanya berjalan di dalam browser Anda — kode sumber berpemilik tidak pernah meninggalkan mesin Anda.'
		],
		faqs: [
			{
				q: 'Seberapa kecil kode saya nantinya?',
				a: 'Kode tulisan tangan biasanya susut 30–60% sebelum gzip: spasi, komentar, dan nama lokal yang panjang memang seberat itu. Kode yang sudah dibundel menyusut jauh lebih sedikit — ia sudah pernah melewati transformasi yang sama.'
			},
			{
				q: 'Apakah minifikasi mengubah perilaku?',
				a: 'Pemampatan dan pemendekan nama mempertahankan semantik: hanya nama lokal yang diganti, dan penyingkiran kode mati hanya membuang cabang yang terbukti tak mungkin dijalankan. Pengecualian klasiknya adalah kode yang mengandalkan Function.prototype.name atau toString() atas fungsinya sendiri.'
			},
			{
				q: 'Bisakah ini membuka kembali kode produksi dari sebuah situs?',
				a: 'Perapinya memulihkan spasi dan struktur sehingga alur kendalinya terbaca — tetapi nama variabel asli dan komentar hilang selamanya; yang Anda lihat adalah a, b, c. Untuk debugging yang serius, lebih baik pakai source map bila situs itu menyertakannya.'
			},
			{
				q: 'Apakah ia mendukung TypeScript atau JSX?',
				a: 'Tidak — keduanya butuh pengurai sendiri. Kompilasi dulu ke JavaScript (tsc, esbuild), lalu rapikan atau minifikasi keluarannya di sini.'
			}
		]
	},

	'string-escape': {
		about: [
			'Ubah string berbaris banyak yang penuh tanda kutip menjadi sesuatu yang bisa Anda tempel ke dalam nilai JSON, literal JavaScript, string Java, simpul teks XML, literal SQL, atau sel CSV — dan balikkan prosesnya saat Anda menemukan teks ter-escape di berkas log dan ingin membacanya. Enam dialek, dua arah.',
			'Tiap dialek mengikuti spesifikasi aslinya, bukan penyebut terkecil bersama: JSON meng-escape karakter kendali sebagai \\uXXXX, JavaScript menambah escape untuk petik tunggal dan petik terbalik, Java mengodekan non-ASCII sebagai urutan UTF-16 \\u, SQL menggandakan petik tunggal, CSV membungkus dan menggandakan sesuai RFC 4180, sedangkan XML memakai lima entitas terdefinisinya. Pembatal escape memahami bentuk \\x, \\u, dan \\u{…} serta melaporkan urutan cacat beserta posisinya.',
			'String ter-escape kerap berupa string koneksi, token, dan potongan kueri. Ini berjalan lokal — tempel saja dengan bebas.'
		],
		faqs: [
			{
				q: 'Dialek mana yang saya perlukan untuk berkas konfigurasi JSON?',
				a: 'JSON. Ia meng-escape petik ganda, garis miring terbalik, dan karakter kendali persis seperti yang dituntut RFC 8259 sekaligus membiarkan unicode tetap terbaca. Keluarannya jatuh pas ke nilai string JSON mana pun — tanpa tanda kutip pembungkusnya, yang diserahkan alat ini kepada Anda.'
			},
			{
				q: 'Apa bedanya dialek JSON dan JavaScript?',
				a: 'JavaScript tambahan meng-escape petik tunggal dan petik terbalik supaya hasilnya aman pada ketiga gaya pengutipan JS. JSON hanya perlu menangani petik ganda. Pembatalan escape menerima keduanya, plus bentuk \\x dan \\u{…} yang tidak didefinisikan JSON.'
			},
			{
				q: 'Apakah escape SQL membuat masukan pengguna aman untuk digabung?',
				a: 'Ia menghasilkan literal string SQL yang benar (petiknya digandakan), tetapi meng-escape lalu menggabung tetap pola yang keliru untuk masukan tak tepercaya — pakailah kueri berparameter. Alat ini untuk fikstur, migrasi, dan debugging, bukan untuk pertahanan terhadap injeksi.'
			},
			{
				q: 'Kenapa pembatalan escape pada string saya gagal?',
				a: 'Garis miring terbalik yang diikuti sesuatu yang bukan escape terdefinisi (\\q, atau \\u12 yang terpotong) itu cacat, dan galatnya menyebut indeks yang bermasalah. Kalau teks Anda memuat path Windows apa adanya, escape dulu — C:\\temp itu sebenarnya tab yang menyamar.'
			}
		]
	},

	'number-base-converter': {
		about: [
			'Ketik sebuah bilangan dalam basis apa pun lalu baca ia serentak dalam biner, oktal, desimal, dan heksadesimal — plus basis kustom apa pun sampai 36. Awalan dipahami (0x, 0o, 0b), pengelompokan digit membuat nilai panjang enak dipindai (1111 1111 · 255 · ff), dan penunjuk panjang bit memberi tahu sekilas apakah suatu nilai muat di 8, 32, atau 64 bit.',
			'Aritmetikanya memakai BigInt, jadi presisinya persis pada ukuran berapa pun: izin berkas, warna ARGB, alamat IP, awalan hash, dan ID basis data 64-bit semuanya terkonversi tanpa pembulatan diam-diam yang menghantam angka JavaScript biasa di atas 2⁵³.',
			'Bilangan negatif mempertahankan tandanya di semua basis. Semuanya dihitung lokal, seketika, sambil Anda mengetik.'
		],
		faqs: [
			{
				q: 'Bagaimana deteksi otomatis memutuskan basisnya?',
				a: 'Lewat awalan: 0x berarti heksadesimal, 0o oktal, 0b biner; selebihnya diurai sebagai desimal. Digit seperti “ff” tanpa awalan itu ambigu, jadi pilihlah HEX secara eksplisit — pesan galatnya akan mengingatkan Anda.'
			},
			{
				q: 'Apakah bilangan raksasa benar-benar persis?',
				a: 'Ya — konversinya berjalan di atas BigInt, yang presisinya arbitrer. 18446744073709551615 (2⁶⁴−1) bolak-balik tetap persis; konverter berbasis pecahan akan merusaknya menjadi …551616.'
			},
			{
				q: 'Bagaimana bilangan negatif ditampilkan dalam biner?',
				a: 'Dengan tanda minus (-1010), bukan komplemen dua, karena komplemen dua menuntut lebar yang tetap. Untuk melihat pola komplemen dua, tambahkan 2ⁿ ke nilai negatif Anda sesuai lebar yang Anda pedulikan, lalu konversikan hasilnya.'
			},
			{
				q: 'Basis 36 bisa dipakai untuk apa?',
				a: 'Untuk ID yang ringkas: 0-9 ditambah a-z adalah alfabet terpadat yang tetap tak peka besar-kecil huruf dan aman untuk URL. Banyak pemendek URL dan sistem tiket mengodekan ID numerik dengan cara ini — tempel satu dan bacalah bilangan yang ada di baliknya.'
			}
		]
	},

	'text-to-hex': {
		about: [
			'Lihat persis dari bita apa saja teks Anda tersusun: alat ini mengenkode teks ke UTF-8 lalu menampilkannya sebagai nilai bita heksadesimal, biner, atau desimal — dengan pemisah, besar-kecil huruf, dan awalan 0x sesuai pilihan Anda. Pendekodenya menempuh arah sebaliknya dan sengaja toleran: ia menerima deretan menyambung (48656c6c6f), pasangan berspasi, notasi bergaya MAC berpemisah titik dua, dan urutan escape \\x.',
			'Karena pengodeannya adalah UTF-8 pada tingkat bita, karakter multibita ditampilkan sebagaimana ia benar-benar ada di memori dan di jaringan: é adalah c3 a9, 世 adalah e4 b8 96, dan emoji memakan empat bita. Itu menjadikannya cara tercepat untuk membedah ketidakcocokan pengodean, misteri BOM, dan persoalan “kenapa string ini lebih panjang daripada tampaknya”.',
			'Kalau bita hasil dekode bukan UTF-8 yang sah, alat ini mengatakannya alih-alih mencetak karakter kacau — petunjuk kuat bahwa yang Anda pandangi adalah data biner, bukan teks.'
		],
		faqs: [
			{
				q: 'Kenapa satu karakter menjadi beberapa bita?',
				a: 'UTF-8 berlebar variabel: ASCII tetap satu bita, sebagian besar huruf Eropa dua, CJK tiga, emoji empat. Yang Anda lihat di sini adalah urutan bita persis yang disimpan sistem berbasis UTF-8 mana pun — berkas, HTTP, basis data — untuk teks Anda.'
			},
			{
				q: 'Format masukan apa saja yang diterima pendekodenya?',
				a: 'Heksadesimal sebagai deretan menyambung, pasangan berspasi, dengan awalan 0x atau \\x, atau berpemisah titik dua/koma; biner sebagai kelompok 8 bit dengan atau tanpa spasi; desimal sebagai nilai bita yang dipisahkan. Pemisah campur aduk dan spasi nyasar dibereskan otomatis.'
			},
			{
				q: 'Kenapa pendekodean bilang bitanya bukan UTF-8 yang sah?',
				a: 'Urutan bitanya melanggar aturan UTF-8 — misalnya ff yang berdiri sendiri, atau bita lanjutan tanpa bita pembuka. Datanya mungkin biner, dalam pengodean warisan seperti Latin-1, atau terpotong di tengah karakter.'
			},
			{
				q: 'Apakah ini sama dengan hex dump dari xxd?',
				a: 'Nilai bitanya identik; xxd menambahkan offset dan satu kolom ASCII. Tempel saja kolom heksadesimal dari dump xxd ke sini (tanpa kolom offsetnya) dan ia terdekode dengan baik.'
			}
		]
	},

	'json-schema-validator': {
		about: [
			'Dua arah dari disiplin yang sama: tempel contoh JSON lalu dapatkan skema draft-07 yang disimpulkan darinya, atau tempel data beserta skemanya dan lihat setiap pelanggaran terdaftar lengkap dengan path JSON-nya. Validasinya berjalan di atas Ajv — mesin yang sama dengan yang dipakai sebagian besar layanan Node — jadi yang lolos di sini juga lolos di CI.',
			'Penyimpulannya berpikiran produksi: kunci objek menjadi properti bertipe dan entri required, larik menggabungkan bentuk seluruh anggotanya, bilangan bulat dibedakan dari pecahan, dan kunci yang hanya muncul di sebagian anggota larik dengan tepat ditinggalkan dari required. Hasilnya adalah titik awal yang Anda ketatkan dengan format, rentang, dan pola.',
			'Respons API dan berkas konfigurasi justru data yang paling tak ingin Anda titipkan ke server pihak ketiga. Baik penyimpulan maupun validasi berjalan sepenuhnya di browser Anda.'
		],
		faqs: [
			{
				q: 'Draft JSON Schema mana yang didukung?',
				a: 'Penyimpulan mengeluarkan draft-07, draft dengan dukungan terluas di berbagai editor dan validator. Validasi menerima draft-07 serta draft-draft lebih awal yang dipahami Ajv dalam mode non-ketat; kata kunci 2019-09/2020-12 pun umumnya jalan karena kata kunci tak dikenal diabaikan, bukan dianggap fatal.'
			},
			{
				q: 'Apa arti tanda $ pada path pelanggaran?',
				a: 'Itu akar dokumen, bergaya JSONPath: $.age berarti properti age di tingkat teratas, $.items.2.name berarti name milik elemen larik ketiga. Path kosong ($) berarti pelanggarannya menyangkut akar dokumen itu sendiri — tipe yang salah, atau properti wajib yang hilang.'
			},
			{
				q: 'Kenapa skema hasil penyimpulan lebih ketat atau lebih longgar dari dugaan saya?',
				a: 'Ia menggambarkan persis contoh yang Anda berikan: bidang yang hadir di mana-mana menjadi wajib, dan hanya tipe yang teramati yang diizinkan. Suapkan contoh yang lebih bervariasi (larik berisi objek-objek representatif) untuk skema yang lebih umum, lalu sesuaikan dengan tangan — penyimpulan tak bisa menebak maksud Anda.'
			},
			{
				q: 'Apakah validasinya mendukung format, pattern, dan kata kunci batasan lainnya?',
				a: 'Kata kunci struktural (type, required, properties, items, enum, minimum, pattern…) ditegakkan sepenuhnya. String format seperti “email” atau “date-time” tidak diuji — itu mencerminkan spesifikasi JSON Schema, yang secara bawaan memperlakukan format sebagai anotasi, sekaligus menghindari rasa aman yang keliru.'
			}
		]
	},

	'exif-viewer': {
		about: [
			'Setiap foto yang diambil ponsel Anda membawa metadata tersembunyi: model kamera, waktu pengambilan, perangkat lunak penyunting — dan, kecuali dimatikan, koordinat GPS tempat Anda berdiri. Alat ini membaca metadata itu dari berkas JPEG, PNG, dan WebP lalu menampilkannya terkelompok dan sudah diterjemahkan: nilai pencahayaan sebagai f/2.8 dan 1/250 s, orientasi dalam kata-kata, GPS sebagai koordinat desimal dengan tautan peta.',
			'Pembersihnya menghasilkan salinan tanpa metadata — dan tanpa kehilangan mutu. Alih-alih mengenkode ulang gambarnya (yang memakan kualitas), ia membuang segmen metadata bita demi bita: blok EXIF dan XMP pada JPEG, chunk teks dan waktu pada PNG, chunk EXIF/XMP pada WebP. Piksel, dimensi, dan kualitas tak tersentuh; profil warna dipertahankan sehingga gambarnya tetap tampil sama persis.',
			'Inilah satu kategori alat yang seluruh maknanya terletak pada “berjalan lokal”: memeriksa foto demi data GPS dengan cara mengunggahnya ke server justru menggagalkan tujuannya. Berkasnya tidak pernah meninggalkan browser Anda — bisa dibuktikan di tab jaringan.'
		],
		faqs: [
			{
				q: 'Apakah membuang metadata mengubah kualitas gambar?',
				a: 'Tidak. Aliran data gambarnya disalin bit demi bit; hanya segmen metadata yang dilepas. Berkas hasil pembersihan lebih kecil persis sebesar ukuran metadatanya, dan pikselnya identik secara terbukti.'
			},
			{
				q: 'Kenapa tangkapan layar saya tidak menampilkan metadata apa pun?',
				a: 'Tangkapan layar dan sebagian besar gambar yang diekspor untuk web memang tidak pernah punya EXIF — kameralah yang menulisnya, sedangkan perkakas tangkapan layar umumnya tidak. Platform media sosial juga membuang metadata saat unggah, jadi foto yang diunduh dari sana biasanya sudah bersih.'
			},
			{
				q: 'Seberapa tepat posisi GPS-nya?',
				a: 'GPS ponsel di dalam EXIF biasanya akurat sampai beberapa meter — cukup untuk mengenali sebuah bangunan. Alat ini mengubah derajat/menit/detik yang tersimpan menjadi desimal dan menautkannya ke titik persisnya, jadi Anda bisa melihat tepat apa yang bisa dilihat penerima berkas itu.'
			},
			{
				q: 'Kenapa berkas yang sudah dibersihkan tetap menyimpan profil warna ICC?',
				a: 'Profil ICC memberi tahu perangkat lunak cara menafsirkan warnanya — membuangnya bisa menggeser warna secara kasatmata, dan ia sendiri tidak memuat informasi pribadi. Pembersihnya menyingkirkan metadata yang mengidentifikasi (EXIF, XMP, IPTC, komentar, stempel waktu) dan mempertahankan apa yang dibutuhkan gambar agar tampil benar.'
			}
		]
	}
};

export default TOOL_CONTENT_ID;
