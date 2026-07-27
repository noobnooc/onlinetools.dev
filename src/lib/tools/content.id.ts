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
	}
};

export default TOOL_CONTENT_ID;
