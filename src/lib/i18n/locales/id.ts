import type { Messages } from '$lib/i18n';

const id: Messages = {
	code: 'id',
	name: 'Bahasa Indonesia',
	ui: {
		search: 'Cari',
		overview: 'Ikhtisar',
		toggleTheme: 'Ganti tema warna',
		themeSystem: 'Ikuti sistem',
		themeDark: 'Gelap',
		themeLight: 'Terang',
		themeTitle: 'Tema: {mode} — klik untuk mengganti',
		footerPrivacy: 'Berjalan di browser Anda — tak ada yang Anda tempel yang diunggah',
		allTools: 'Semua alat',
		changelog: 'Catatan perubahan',
		changelogMetaDescription:
			'Apa yang baru di onlinetools.dev — alat, fitur, dan perbaikan terbaru, semuanya berjalan secara lokal di browser Anda.',
		releaseDate: 'Tanggal rilis',
		language: 'Bahasa',
		openNav: 'Buka navigasi',
		searchTools: 'Cari alat',

		// About / Why page
		about: 'Tentang',
		aboutTitle:
			'Mengapa onlinetools.dev — berjalan lokal, tanpa pelacakan, bisa dibuktikan | onlinetools.dev',
		aboutMetaDescription:
			'Mengapa onlinetools.dev ada: setiap alat berjalan di browser Anda, apa pun yang Anda tempel tidak diunggah, tanpa iklan, tanpa pelacak, tanpa login — dan ada penghitung langsung agar Anda bisa membuktikannya sendiri.',
		aboutEyebrow: 'alasan keberadaannya · kepercayaan',
		aboutVerifyHeading: 'Jangan percaya begitu saja',
		aboutVerifyHint:
			'Ketik atau tempel apa pun di bawah ini. Penghitungnya akan tetap nol — setiap ketukan tombol ditangani di sini, di mesin Anda sendiri.',
		aboutRequestsLabel: 'Permintaan jaringan sejak halaman ini dibuka',
		aboutRequestsNote:
			'Satu-satunya hal yang bisa menggerakkan angka ini adalah saat Anda membuka alat lain, yang memuat kodenya sendiri dari domain yang sama. Apa yang Anda tempel tidak pernah menggerakkannya.',
		aboutVerifyPlaceholder: 'Ketik atau tempel apa pun — tidak ada yang keluar dari browser Anda…',
		aboutOfflineReady: 'Siap offline',
		aboutOfflineCaching: 'Menyimpan ke cache…',
		aboutDevtools:
			'Ingin bukti yang lebih kuat? Buka DevTools browser Anda, pindah ke tab Network, lalu tempel. Anda akan menyaksikan tidak terjadi apa-apa.',
		aboutViewSource: 'Lihat kode sumber',
		aboutEditPage: 'Sunting halaman ini',
		aboutBuiltBy: 'Dibuat oleh',

		// About / Why page — the manifesto body (localized)
		aboutH1: 'Kalkulator seharusnya tidak diam-diam lapor ke server.',
		aboutLead:
			'Kebanyakan situs “alat online” adalah tembok iklan yang membungkus sebuah kotak teks, yang diam-diam mengirim apa pun yang Anda tempel ke server yang tak akan pernah Anda lihat. Saya lelah mendekode JWT di halaman entah milik siapa, lalu sadar sedetik terlambat bahwa saya baru saja menyerahkan token saya kepada orang asing. onlinetools.dev adalah jawaban saya: alat-alat yang sama yang Anda pakai tiap hari, hanya saja komputer yang mengerjakannya adalah komputer yang sudah ada di depan Anda.',
		aboutS1Head: 'Semuanya berjalan di mesin Anda',
		aboutS1Body:
			'Setiap alat di sini hanyalah komputasi biasa di dalam browser — tanpa perjalanan bolak-balik ke server, tanpa server sama sekali, tak ada tempat untuk mengunggah apa pun. JSON Anda, token akses Anda, {env} yang tadinya mau Anda bersihkan dulu: semuanya berpindah dari papan klip ke layar Anda, lalu berhenti di sana. Saya membangunnya begini bukan karena lebih murah (memang lebih murah), tetapi karena data Anda bukan urusan saya.',
		aboutS2Head: 'Tanpa iklan. Tanpa pelacak. Tanpa akun.',
		aboutS2Body:
			'Tidak ada skrip analitik yang menghitung ketukan tombol Anda, tidak ada spanduk cookie (memang tidak ada cookie yang perlu disetujui), tidak ada “masuk untuk melanjutkan”, tidak ada tawaran berbayar yang menunggu tiga langkah kemudian. Saya sungguh tidak tahu siapa Anda atau apa yang Anda tempel, dan justru itulah intinya — sebuah alat semestinya menyelesaikan tugasnya lalu melupakan Anda begitu tab ditutup.',
		aboutS3Head: 'Tetap jalan saat jaringan tidak',
		aboutS3Body:
			'Muat satu halaman sekali, dan halaman itu jadi milik Anda. Seluruh situs bersifat statis dan disimpan oleh service worker, jadi di dalam pesawat, di kereta bawah tanah, atau di balik proxy kantor yang ketat, alat-alatnya tetap berjalan. Mode pesawat adalah tempat yang sangat layak untuk merapikan JSON.',
		aboutS4Head: 'Cepat, dan tidak menghalangi',
		aboutS4Body:
			'Tanpa layar pembuka, tanpa “setujui ketentuan kami”, tanpa jendela yang menghadang antara Anda dan pekerjaan. Tekan {kbd} untuk melompat ke alat mana pun, tempel apa pun dan alat yang tepat akan muncul sendiri, dan setiap hasil hanya berjarak satu tombol dari papan klip Anda. Mengutamakan papan ketik, sampai ke detail terkecil.',
		aboutVerifyIntro:
			'Klaim soal privasi itu murah — setiap situs bilang “kami menghargai privasi Anda” sambil menjual Anda. Jadi ini sesuatu untuk diperiksa, bukan untuk dipercaya. Penghitung ini memantau aktivitas jaringan browser Anda sendiri, secara langsung:',
		aboutBugLine:
			'Kalau ada alat yang mengirim data Anda ke tempat yang seharusnya tidak, itu bug, bukan model bisnis — {issue} dan saya akan memperbaikinya.',
		aboutBugLink: 'buka sebuah issue',

		// Favorites (stored locally in this browser)
		favorites: 'Favorit',
		favoriteAdd: 'Tambahkan ke favorit',
		favoriteRemove: 'Hapus dari favorit',

		// Home
		homeTitle: 'onlinetools.dev — Alat developer yang berjalan di browser Anda',
		homeMetaDescription:
			'Alat developer yang cepat dan mengutamakan papan ketik, berjalan sepenuhnya di browser Anda. Rapikan JSON, dekode JWT dan Base64, konversi stempel waktu, uji regex — tanpa unggah, tanpa daftar, bisa offline.',
		homeEyebrow: '{n} alat · berjalan lokal',
		homeHeading: 'Alat developer yang berjalan di browser Anda',
		homeSub: 'Tanpa unggah, tanpa daftar, tanpa menunggu.',
		pasteToDetect: 'tempel untuk dikenali',
		worksOffline: 'bisa offline',
		shortcuts: 'pintasan',
		searchPlaceholder: 'Cari di {n} alat, atau tempel apa pun…',
		startHere: 'Mulai dari sini',
		smartPaste: 'Tempel Cerdas',
		smartPasteDesc:
			'Tempel apa pun, di mana pun — jenis kontennya dikenali dan alat yang tepat hanya berjarak satu tombol.',
		keyboardFirst: 'Mengutamakan papan ketik, dari ujung ke ujung',
		keyboardFirstDesc: 'Temukan, jalankan, salin, dan bagikan tanpa menyentuh tetikus.',
		kbdAnyTool: 'alat mana pun',
		kbdCopyResult: 'salin hasil',
		kbdConfirm: 'konfirmasi',
		kbdAllShortcuts: 'semua pintasan',

		// Paste hero (homepage)
		pasteHeroHeading: 'Tempel apa saja — dapatkan alat yang tepat seketika',
		pasteHeroPlaceholder: 'Tempel JWT, JSON, stempel waktu Unix, warna, URL, gambar…',
		tryLabel: 'Coba',
		plainText: 'Teks biasa',
		noMatchHint: 'Tidak ada yang persis cocok — pilih alat teks di bawah atau cari semuanya',
		runHint: 'jalankan',
		newlineHint: 'baris baru',
		clearHint: 'bersihkan',

		// Pipeline (tool chains)
		chainNavLabel: 'Rangkaian',
		chainNew: 'Baru',
		chainSteps: 'Langkah',
		chainMoreRecipes: 'Resep lainnya',
		chainTitle:
			'Rangkaian Alat — sambungkan alat developer di browser Anda | onlinetools.dev',
		chainMetaDescription:
			'Sambungkan alat developer menjadi satu rangkaian — dekode, ubah, dan ekstrak dalam satu alur. Setiap langkah menyuapi langkah berikutnya, semuanya berjalan di browser Anda, dan seluruh resepnya muat dalam satu tautan yang bisa dibagikan.',
		chainEyebrow: 'meja kerja · berjalan lokal',
		chainHeading: 'Rangkaian',
		chainSub:
			'Sambungkan alat menjadi sebuah resep — setiap langkah menyuapi langkah berikutnya. Berjalan sepenuhnya di browser Anda.',
		chainInputPlaceholder: 'Tempel atau ketik masukan awal…',
		chainAddStep: 'Tambah langkah',
		chainSearchSteps: 'Cari langkah…',
		chainStarters: 'Resep awal',
		chainEmpty: 'Tambahkan satu langkah — setiap langkah menyuapi langkah berikutnya.',
		chainHomeCta: 'Sambungkan alat menjadi rangkaian',
		chainHomeCtaSub:
			'Alirkan hasil satu alat ke alat berikutnya — dekode, ubah, dan ekstrak dalam satu alur.',

		// Tools index page
		toolsTitle: 'Semua alat developer — onlinetools.dev',
		toolsMetaDescription:
			'Jelajahi semua alat di onlinetools.dev: JSON, YAML, Base64, JWT, stempel waktu, cron, regex, diff, UUID, hash, kode QR, dan lainnya — semuanya berjalan lokal di browser Anda.',
		toolsBlurb:
			'{n} alat, semuanya dihitung di browser Anda. Yang lain menyusul secara berkala — lihat',

		// Tool page shell
		toolTitle: '{name} — Gratis & Privat | onlinetools.dev',
		toolMetaSuffix:
			'Berjalan sepenuhnya di browser Anda — tanpa unggah, tanpa daftar, bisa dipakai offline.',
		runsLocally: 'Berjalan lokal',
		runsLocallyTitle:
			'Alat ini menghitung semuanya di browser Anda. Masukan Anda tidak pernah diunggah.',
		aboutTool: 'Tentang alat ini',
		faqHeading: 'Pertanyaan yang sering diajukan',
		relatedTools: 'Alat terkait',
		breadcrumbTools: 'alat',
		reportIssue: 'Laporkan masalah',
		reportIssueTitle: 'Laporkan masalah {name} di GitHub',

		// Shared tool components
		sample: 'Contoh',
		line: 'baris',
		output: 'Keluaran',
		copy: 'Salin',
		copied: 'Tersalin',
		download: 'Unduh',
		share: 'Bagikan',
		linkCopied: 'Tautan tersalin',
		continueWith: 'Lanjutkan dengan',
		suggested: 'disarankan',
		shareTooLarge:
			'Masukan terlalu besar untuk sebuah URL — tautan berbagi dibatasi agar tetap ringkas dan mudah dibagikan. Isinya tetap tidak pernah meninggalkan mesin ini.',
		emptyHint: 'Keluaran muncul di sini sambil Anda mengetik',

		// Command palette
		palettePlaceholder: 'Cari alat, atau tempel konten untuk langsung diolah…',
		noMatch: 'Tidak ada alat yang cocok',
		navigate: 'navigasi',
		open: 'buka',
		close: 'tutup',

		// Smart paste
		detected: 'Terdeteksi',
		chars: 'karakter',

		// Shortcut help
		shortcutsTitle: 'Pintasan papan ketik',
		scPalette: 'Buka palet perintah',
		scCopy: 'Salin hasil',
		scEsc: 'Tutup panel / abaikan saran',
		scHelp: 'Daftar pintasan ini',
		scPaste: 'Tempel Cerdas — kenali konten dan sarankan alat',
		scNav: 'Bernavigasi dan mengonfirmasi di dalam panel'
	},
	tl: {
		direction: 'Arah',
		encode: 'Enkode',
		decode: 'Dekode',
		mode: 'Mode',
		count: 'Jumlah',
		lengthLbl: 'Panjang',
		uppercase: 'Huruf besar',
		lowercase: 'Huruf kecil',
		regenerate: 'Buat ulang',
		b64InputEnc: 'Teks yang akan dienkode',
		b64InputDec: 'Base64 yang akan didekode',
		b64PhEnc: 'Teks apa pun, termasuk unicode',
		b64UrlSafe: 'Aman untuk URL (tanpa padding)',
		bcHash: 'Hash',
		bcVerify: 'Verifikasi',
		bcHashT: 'Hash sebuah kata sandi',
		bcVerifyT: 'Cocokkan kata sandi dengan sebuah hash',
		bcPassword: 'Kata sandi',
		bcCost: 'Faktor biaya',
		bcHashLbl: 'Hash bcrypt',
		bcPh: 'tetap di browser Anda',
		bcVersion: 'Versi',
		bcCostShort: 'Biaya',
		bcSalt: 'Salt',
		bcNote:
			'Proses hashing berjalan di browser Anda — tidak ada yang dikirim. JS di browser lebih lambat daripada bcrypt native, jadi anggap waktunya sebagai batas atas.',
		caseInput: 'Teks atau pengenal (satu per baris)',
		caseEmpty: 'Kesembilan gaya penulisan muncul di sini sambil Anda mengetik',
		colorInput: 'Warna',
		colorFormats: 'Format',
		colorRgb: 'Kanal RGB',
		colorContrast: 'Kontras teks (WCAG)',
		cronInput: 'Ekspresi cron',
		cronEvalIn: 'dihitung dalam zona',
		cronNext: '5 jadwal berikutnya',
		cronNone: 'Tidak ada jadwal dalam 5 tahun ke depan',
		diffOriginal: 'Asli',
		diffChanged: 'Setelah diubah',
		diffLbl: 'Perbedaan',
		diffUnchanged: 'tidak berubah',
		diffEmpty: 'Perbedaan baris demi baris muncul di sini',
		hashInput: 'Teks yang akan di-hash',
		hashPh: 'Teks apa pun — hash diperbarui sambil Anda mengetik',
		hashHmac: 'Kunci rahasia HMAC',
		hashOptional: '(opsional)',
		hashHmacPh: 'Kosongkan untuk hash biasa',
		hashDigests: 'Digest',
		hashEmpty: 'Digest diperbarui langsung sambil Anda mengetik',
		hashNote:
			'MD5 dan SHA-1 ditampilkan hanya untuk checksum lama — gunakan SHA-256 atau yang lebih kuat untuk apa pun yang menyangkut keamanan.',
		heAll: 'Enkode semua karakter non-ASCII',
		heNumeric: 'Hanya numerik',
		heInputEnc: 'Teks yang akan di-escape',
		heInputDec: 'HTML berisi entitas',
		imgDrop: 'Jatuhkan gambar, klik untuk memilih, atau tempel dari papan klip',
		imgLocal: 'Tetap di browser Anda — tidak ada yang diunggah',
		imgReplace: 'Jatuhkan, klik, atau tempel untuk mengganti',
		imgSource: 'Gambar sumber',
		imgOriginal: 'Asli',
		imgDimensions: 'Dimensi',
		imgDownload: 'Unduh {fmt}',
		imgErrNotImage: 'Bukan format gambar yang dikenali (PNG, JPEG, WebP, GIF, SVG, BMP, ICO, AVIF)',
		imgErrDecode: 'Browser tidak dapat mendekode gambar ini',
		imgErrEncode: 'Browser tidak dapat mengenkode gambar ini',
		imgErrFormat: 'Browser ini tidak dapat mengenkode {fmt} — coba PNG atau JPEG',
		i2bToB64: 'Gambar → Base64',
		i2bFromB64: 'Base64 → gambar',
		i2bInput: 'Data URL atau Base64 mentah',
		i2bDataUrl: 'Data URL',
		i2bRawB64: 'Base64 mentah',
		i2bCss: 'Latar CSS',
		i2bHtml: 'HTML <img>',
		i2bEncodedSize: 'Ukuran Base64',
		i2bOverhead: '+{pct}% dibanding biner',
		i2bNote:
			'Menyisipkan langsung menghemat satu permintaan tetapi menggelembungkan dokumen dan menggagalkan caching — paling cocok untuk ikon dan aset kecil di bawah ~10 KB.',
		icTarget: 'Konversi ke',
		icQuality: 'Kualitas',
		icConverted: 'Hasil konversi',
		icSmaller: 'lebih kecil dari aslinya',
		icLarger: 'lebih besar dari aslinya',
		icBgNote: 'JPEG tidak mengenal transparansi — area transparan diratakan ke putih.',
		icNote:
			'Konversi memakai enkoder canvas browser Anda, sehingga ukuran file persisnya sedikit berbeda antar browser.',
		fgAppleBg: 'Latar ikon Apple',
		fgFiles: 'Berkas yang dihasilkan',
		fgHtml: 'Tag HTML <link>',
		fgSmall: 'Sumbernya {px}px — ikon yang lebih besar akan diperbesar dan bisa tampak buram',
		fgNote:
			'Berkas ICO memuat 16, 32, dan 48 px. Ikon Apple touch tidak boleh transparan, jadi diratakan ke latar yang Anda pilih; ikon PWA mempertahankan kanal alfanya. Sumber yang tidak persegi dipotong dari tengah.',
		irBy: 'Ubah ukuran berdasarkan',
		irWidth: 'Lebar',
		irHeight: 'Tinggi',
		irPercent: 'Persen',
		irFormat: 'Format',
		irKeep: 'Pertahankan',
		irResized: 'Hasil ubah ukuran',
		irScale: 'Skala',
		irNote:
			'Memperkecil memakai penghalusan berkualitas tinggi. Memperbesar tidak bisa mengarang detail — di atas 2× siap-siap buram.',
		jcInput: 'Larik JSON berisi objek',
		jcDelimiter: 'Pemisah',
		jcComma: 'Koma',
		jcSemicolon: 'Titik koma (Excel Eropa)',
		jcTab: 'Tab',
		jfInput: 'Masukan JSON',
		jfIndent: 'Indentasi',
		jfIndentation: 'Gaya indentasi',
		jfSp2: '2 spasi',
		jfSp4: '4 spasi',
		jfTabs: 'Tab',
		jfMin: 'Diminifikasi — tanpa spasi',
		jfSortKeys: 'Urutkan kunci',
		jfText: 'Teks',
		jfTree: 'Pohon',
		jfTreeHint: 'Arahkan kursor ke sebuah simpul untuk menyalin JSONPath-nya — coba di',
		jfTreeLink: 'penguji JSONPath',
		jpExpr: 'Ekspresi JSONPath',
		jpDoc: 'Dokumen JSON',
		jpMatches: 'Kecocokan',
		jpResults: 'Nilai hasil',
		jtInput: 'Contoh JSON',
		jtRoot: 'Nama tipe akar',
		jtNote:
			'Disimpulkan dari satu contoh ini saja — tandai bidang sebagai opsional dan perluas tipe nullable di tempat data Anda bervariasi.',
		jyFrom: 'Dari',
		jySource: 'Format sumber',
		jyAutoT: 'Deteksi format sumber dari isinya',
		jyTarget: 'Format tujuan',
		jyInput: 'Masukan',
		jyUnknown: 'format tidak dikenal',
		jwtAnatomy: 'Anatomi token',
		jwtHeader: 'header',
		jwtPayload: 'payload',
		jwtSignature: 'tanda tangan (tidak diverifikasi)',
		jwtIssued: 'Diterbitkan',
		jwtExpires: 'Kedaluwarsa',
		jwtNotBefore: 'Berlaku mulai',
		jwtLifetime: 'Masa berlaku',
		jwtNote:
			'Pendekodean hanya membaca token — ia tidak memverifikasi tanda tangan. Verifikasi tanda tangan di sisi server dengan kunci milik penerbitnya.',
		loremUnit: 'Satuan',
		loremWords: 'Kata',
		loremSentences: 'Kalimat',
		loremParagraphs: 'Paragraf',
		loremClassic: 'Mulai dengan “Lorem ipsum…”',
		pwWeak: 'Lemah',
		pwFair: 'Cukup',
		pwStrong: 'Kuat',
		pwExcellent: 'Sangat kuat',
		pwNoLookalikes: 'Tanpa karakter mirip (0O1lI)',
		pwEntropy: 'Entropi',
		pwBits: 'bit',
		pwNote:
			'≥ 80 bit sanggup menahan pembobolan offline pada hash cepat; ≥ 100 bit praktis mustahil ditebak.',
		pwOut: 'Kata sandi',
		pwCrypto:
			'Dibuat dengan crypto.getRandomValues, hanya di browser Anda. Tidak ada yang disimpan atau dikirim.',
		qrContent: 'Konten',
		qrEc: 'Koreksi galat',
		qrEcT: 'Tahan kerusakan {pct}',
		qrSvg: 'SVG (vektor, cetak)',
		qrPng: 'PNG (obrolan, salindia)',
		qrNote:
			'Kontennya dienkode langsung — tanpa layanan pengalihan, tidak ada yang kedaluwarsa, tanpa pelacakan pemindaian.',
		qrdResult: 'Konten hasil dekode',
		qrdNone:
			'Kode QR tidak ditemukan — gunakan gambar yang lebih tajam, potong lebih dekat ke kode, dan pertahankan margin putih di sekitarnya',
		qrdOpen: 'Buka tautan',
		qrdWifiSsid: 'Jaringan (SSID)',
		qrdWifiPass: 'Kata sandi',
		qrdWifiSec: 'Keamanan',
		qrdWifiHidden: 'Jaringan tersembunyi',
		qrdNote:
			'Pemindaian sepenuhnya terjadi di browser Anda — gambar, tampilan kamera, maupun isi kode tidak pernah diunggah.',
		qrdCamera: 'Pindai dengan kamera',
		qrdCameraStop: 'Hentikan kamera',
		qrdCameraErr: 'Kamera tidak tersedia — periksa izin browser atau gunakan gambar',
		rxPattern: 'Pola',
		rxTest: 'Teks uji',
		rxTestPh: 'Tempel teks untuk menguji polanya',
		rxHighlighted: 'Disorot',
		rxMatches: 'Kecocokan',
		rxMatched: 'Teks yang cocok',
		slugInput: 'Judul (satu per baris)',
		slugSep: 'Pemisah',
		slugHyphen: 'Tanda hubung',
		slugUnderscore: 'Garis bawah',
		slugMax: 'Panjang maksimum',
		slugOut: 'Slug',
		slInput: 'Baris',
		slPh: 'satu per baris',
		slSort: 'Urutkan',
		slKeep: 'Pertahankan urutan',
		slAsc: 'Menaik',
		slDesc: 'Menurun',
		slNatural: 'Alami — angka sesuai urutan',
		slLength: 'Menurut panjang baris',
		slShuffle: 'Acak',
		slDedupe: 'Hapus duplikat',
		slIgnoreCase: 'Abaikan besar-kecil huruf',
		slTrim: 'Pangkas spasi',
		slDropEmpty: 'Buang baris kosong',
		tsInput: 'Stempel waktu atau tanggal',
		tsNow: 'Waktu unix saat ini:',
		tsNowT: 'Gunakan waktu sekarang sebagai masukan',
		tsRelative: 'Relatif',
		tsUnixS: 'Unix dalam detik',
		tsUnixMs: 'Unix dalam milidetik',
		tsZones: 'Lintas zona waktu',
		tsNote:
			'Penanda menunjukkan jam lokal tiap zona pada bilah 24 jam — ujung yang redup adalah 21.00–07.00.',
		uaInput: 'String User-Agent',
		uaBrowser: 'Browser',
		uaEngine: 'Mesin render',
		uaOs: 'Sistem operasi',
		uaDevice: 'Perangkat',
		uaNote:
			'Tombol “Contoh” menyisipkan User-Agent browser Anda sendiri. Untuk keputusan saat runtime, gunakan deteksi fitur, bukan pengendusan UA.',
		uniInput: 'Teks yang akan diperiksa',
		uniPh: 'Tempel apa pun — karakter tak kasatmata menjadi terlihat di sini',
		uniGraphemes: 'Grafem',
		uniGraphemesHint: 'yang dilihat pengguna',
		uniCodePoints: 'Titik kode',
		uniUtf16: 'Unit UTF-16',
		uniUtf16Hint: 'JS .length',
		uniUtf8: 'Bita UTF-8',
		uniLimit: 'Menampilkan 300 karakter pertama.',
		upInput: 'URL',
		upProtocol: 'Protokol',
		upHost: 'Host',
		upHostname: 'Nama host',
		upPort: 'Porta',
		upPath: 'Path',
		upFragment: 'Fragmen',
		upOrigin: 'Origin',
		upQuery: 'Parameter kueri',
		upDefault: '(bawaan)',
		upNone: '(tidak ada)',
		upEmpty: 'Komponen URL muncul di sini',
		urlComponent: 'Mode komponen (encodeURIComponent)',
		urlInputDec: 'Teks terenkode yang akan didekode',
		uuidOut: 'ID yang dihasilkan',
		uuidFormat: 'Format ID',
		uuidHintV4: 'acak',
		uuidHintV7: 'terurut waktu',
		uuidHintUlid: 'terurut waktu, base32',
		uuidHintNano: 'pendek, aman untuk URL',
		uuidNote:
			'Dibuat dengan crypto.getRandomValues — aman secara kriptografis, dibuat di browser Anda, tidak pernah dicatat di mana pun.',
		fmtFormat: 'Rapikan',
		fmtMinify: 'Minifikasi',
		sqlInput: 'Pernyataan SQL',
		sqlDialect: 'Dialek',
		sqlKeywords: 'Kata kunci',
		sqlKeep: 'Biarkan',
		xmlInput: 'Dokumen XML',
		xjInputXml: 'Dokumen XML',
		xjInputJson: 'Objek JSON',
		xjNote:
			'Atribut menjadi kunci "@_nama" dan teks yang berdampingan dengan atribut menjadi "#text", sehingga konversinya bisa bolak-balik. Urutan antar-saudara campuran tidak dipertahankan — XML membolehkan pengulangan, objek JSON tidak.',
		cjInput: 'Data CSV / TSV',
		cjAuto: 'Otomatis',
		cjPipe: 'Garis tegak',
		cjHeader: 'Baris pertama adalah header',
		cjTyped: 'Nilai bertipe',
		mdPreview: 'Pratinjau',
		mdNote:
			'Pratinjau dibersihkan sebelum dirender, jadi skrip dan penangan peristiwa di dalam konten yang ditempel atau dibagikan tidak bisa berjalan. Kotak keluaran HTML memuat hasil konversi mentahnya.',
		htmlInput: 'Kode HTML',
		cssInput: 'Kode CSS',
		jsInput: 'Kode JavaScript',
		escEscape: 'Escape',
		escUnescape: 'Batalkan escape',
		escDialect: 'Dialek',
		escInputEsc: 'Teks yang akan di-escape',
		escInputUnesc: 'Teks yang sudah di-escape',
		nbInput: 'Bilangan',
		nbFrom: 'Dari',
		nbAutoT: 'Deteksi dari awalan 0x / 0o / 0b, selain itu dianggap desimal',
		nbGroup: 'Kelompokkan digit',
		nbBase: 'Basis',
		nbBin: 'Biner',
		nbOct: 'Oktal',
		nbDec: 'Desimal',
		nbHex: 'Heksadesimal',
		nbBits: 'bit',
		hbFormat: 'Bita sebagai',
		hbSep: 'Pemisah',
		hbSpace: 'Spasi',
		hbNone: 'Tanpa',
		hbColon: 'Titik dua',
		hbInputEnc: 'Teks yang akan dienkode',
		hbInputDec: 'Bita yang akan didekode',
		schInfer: 'Simpulkan skema',
		schValidate: 'Validasi',
		schInferT: 'Hasilkan skema dari contoh JSON',
		schValidateT: 'Periksa JSON terhadap sebuah skema',
		schData: 'Data JSON',
		schSchema: 'JSON Schema',
		schViolations: 'pelanggaran',
		schValid: 'Valid — datanya sesuai dengan skema',
		schResult: 'Hasil validasi',
		exTags: '{n} bidang metadata',
		exNone: 'Tidak ada metadata — berkas ini memang sudah bersih',
		exStrip: 'Unduh salinan yang sudah dibersihkan',
		exGps: 'Lokasi GPS tertanam',
		exMap: 'Lihat di peta',
		exNote:
			'Pembacaan dan pembersihan terjadi sepenuhnya di browser Anda — fotonya tidak pernah diunggah. Pembersihan membuang segmen metadata bita demi bita tanpa mengenkode ulang, jadi piksel dan kualitasnya tidak tersentuh.',
		crBuilder: 'Perakit',
		crMinute: 'Menit',
		crHour: 'Jam',
		crDom: 'Tanggal',
		crMonth: 'Bulan',
		crDow: 'Hari dalam minggu',
		crEvery: 'Setiap',
		crStep: 'Setiap N',
		crAt: 'Tertentu',
		crUse: 'Pakai ekspresi ini',
		jwtDecode: 'Dekode',
		jwtSign: 'Tanda tangani',
		jwtVerify: 'Verifikasi',
		jwtAlg: 'Algoritme',
		jwtPayloadLbl: 'Payload (objek JSON)',
		jwtSecret: 'Kunci rahasia',
		jwtPrivKey: 'Kunci privat (PKCS#8 PEM)',
		jwtPubKey: 'Kunci rahasia (HS) atau kunci publik PEM (RS/ES)',
		jwtSignNote:
			'Penandatanganan berjalan di atas WebCrypto di browser Anda — kuncinya tidak pernah meninggalkan halaman ini. Untuk algoritme HS gunakan kunci rahasia yang panjang dan acak; yang pendek bisa ditebak paksa di mana pun Anda menandatanganinya.',
		jwtVerifyNote:
			'Verifikasi memeriksa tanda tangan terhadap kunci yang Anda berikan, secara lokal. Ia tidak mengambil endpoint JWKS maupun memeriksa klaim seperti aud/iss — lakukan itu di sisi server.',
		tsDiff: 'Selisih antara dua tanggal',
		wcWords: 'Kata',
		wcChars: 'Karakter',
		wcCharsHint: '{n} tanpa spasi',
		wcReading: 'Waktu baca',
		wcReadingHint: 'pada 220 kata/menit',
		wcLines: 'Baris',
		wcSentences: 'Kalimat',
		wcParagraphs: 'Paragraf',
		wcAvg: 'Rata-rata panjang kata'
	},
	categories: {
		encoding: 'Enkode',
		json: 'JSON & data',
		text: 'Teks',
		time: 'Tanggal & waktu',
		generators: 'Generator',
		crypto: 'Hash & kriptografi',
		web: 'Web',
		image: 'Gambar',
		code: 'Kode & markup',
		privacy: 'Privasi'
	},
	tools: {
		'json-formatter': {
			name: 'Perapi & Validator JSON',
			description: 'Rapikan, validasi, dan minifikasi JSON dengan posisi galat yang presisi'
		},
		'base64-decode': {
			name: 'Enkode / Dekode Base64',
			description: 'Enkode teks ke Base64 atau dekode Base64 ke teks, termasuk varian aman-URL'
		},
		'image-to-base64': {
			name: 'Konverter Gambar ↔ Base64',
			description: 'Ubah gambar menjadi data URL Base64 dan sebaliknya — lengkap dengan cuplikan CSS dan HTML'
		},
		'image-converter': {
			name: 'Konverter Format Gambar',
			description: 'Konversi gambar antara PNG, JPEG, dan WebP dengan pengatur kualitas'
		},
		'image-resizer': {
			name: 'Pengubah Ukuran Gambar',
			description: 'Ubah ukuran gambar menurut lebar, tinggi, atau persentase — tajam dan sepenuhnya offline'
		},
		'favicon-generator': {
			name: 'Generator Favicon',
			description: 'Ubah gambar apa pun menjadi favicon.ico plus set ikon PNG dan manifes lengkap'
		},
		'timestamp-converter': {
			name: 'Konverter Stempel Waktu Unix',
			description: 'Ubah stempel waktu unix menjadi tanggal yang terbaca dan sebaliknya, dengan waktu relatif'
		},
		'jwt-decoder': {
			name: 'Dekoder JWT',
			description: 'Dekode header dan payload JWT, periksa masa berlakunya — sepenuhnya offline'
		},
		'regex-tester': {
			name: 'Penguji Regex',
			description: 'Uji ekspresi reguler dengan penyorotan kecocokan dan grup secara langsung'
		},
		'diff-checker': {
			name: 'Pembanding Teks',
			description: 'Bandingkan dua teks baris demi baris dan lihat penambahan serta penghapusannya'
		},
		'url-encode-decode': {
			name: 'Enkode / Dekode URL',
			description: 'Enkode persen atau dekode komponen URL dan string kueri'
		},
		'url-parser': {
			name: 'Pengurai URL',
			description: 'Pecah sebuah URL menjadi protokol, host, path, dan parameter kueri'
		},
		'uuid-generator': {
			name: 'Generator UUID',
			description: 'Hasilkan UUID v4/v7, ULID, dan Nano ID — satuan maupun massal'
		},
		'hash-generator': {
			name: 'Generator Hash',
			description: 'MD5, SHA-1, SHA-256, SHA-512, dan HMAC — dihitung di browser Anda'
		},
		'color-converter': {
			name: 'Konverter Warna',
			description: 'Konversi warna antara HEX, RGB, HSL, dan OKLCH dengan pratinjau langsung'
		},
		'case-converter': {
			name: 'Konverter Gaya Penulisan',
			description: 'Berpindah antara camelCase, snake_case, kebab-case, PascalCase, dan lainnya'
		},
		'word-counter': {
			name: 'Penghitung Kata',
			description: 'Hitung kata, karakter, kalimat, bita, dan waktu baca sambil Anda mengetik'
		},
		'lorem-ipsum-generator': {
			name: 'Generator Lorem Ipsum',
			description: 'Hasilkan kata, kalimat, atau paragraf pengisi untuk purwarupa'
		},
		'slug-generator': {
			name: 'Generator Slug',
			description: 'Ubah judul menjadi slug URL yang rapi dengan opsi pemisah dan panjang'
		},
		'sort-lines': {
			name: 'Urutkan & Hapus Duplikat Baris',
			description: 'Urutkan baris secara alfabetis atau alami, buang duplikat dan baris kosong'
		},
		'html-entities': {
			name: 'Enkode / Dekode Entitas HTML',
			description: 'Escape teks untuk HTML atau kembalikan entitas bergaya &amp; menjadi karakter'
		},
		'unicode-inspector': {
			name: 'Pemeriksa Karakter Unicode',
			description: 'Lihat titik kode, bita UTF-8/UTF-16, dan escape untuk setiap karakter'
		},
		'cron-parser': {
			name: 'Pengurai Ekspresi Cron',
			description: 'Jelaskan jadwal cron apa pun dalam bahasa sederhana beserta waktu jalan berikutnya'
		},
		'password-generator': {
			name: 'Generator Kata Sandi',
			description: 'Kata sandi acak dengan pilihan himpunan karakter dan pengukur entropi yang jujur'
		},
		'qr-code-generator': {
			name: 'Generator Kode QR',
			description: 'Hasilkan kode QR yang tajam sebagai SVG atau PNG — tanpa watermark, tanpa unggah'
		},
		'qr-code-decoder': {
			name: 'Pendekode Kode QR',
			description: 'Baca kode QR dari gambar atau kamera — URL, WiFi, dan teks, sepenuhnya offline'
		},
		'json-to-yaml': {
			name: 'Konverter JSON ↔ YAML ↔ TOML',
			description: 'Konversi antara JSON, YAML, dan TOML dengan deteksi format otomatis'
		},
		'json-to-csv': {
			name: 'Konverter JSON ↔ CSV',
			description: 'Ratakan JSON menjadi CSV, atau urai CSV kembali menjadi objek JSON bertipe'
		},
		'json-to-typescript': {
			name: 'JSON → Tipe TypeScript',
			description: 'Simpulkan antarmuka TypeScript dari sebuah contoh JSON secara instan'
		},
		'jsonpath-tester': {
			name: 'Penguji JSONPath',
			description: 'Kueri JSON dengan ekspresi JSONPath dan lihat tiap kecocokan beserta path-nya'
		},
		'bcrypt-generator': {
			name: 'Hash & Verifikasi Bcrypt',
			description: 'Hash kata sandi dengan bcrypt dan cocokkan hash terhadap teks polos'
		},
		'user-agent-parser': {
			name: 'Pengurai User-Agent',
			description: 'Kenali browser, mesin render, sistem operasi, dan perangkat dari string User-Agent'
		},
		'sql-formatter': {
			name: 'Perapi SQL',
			description: 'Rapikan SQL dengan kata kunci sesuai dialek, atau padatkan menjadi satu baris'
		},
		'xml-formatter': {
			name: 'Perapi & Validator XML',
			description: 'Rapikan, minifikasi, dan validasi XML dengan posisi galat yang tepat'
		},
		'xml-to-json': {
			name: 'Konverter XML ↔ JSON',
			description: 'Konversi dokumen XML menjadi JSON dan sebaliknya, atribut ikut terbawa'
		},
		'markdown-to-html': {
			name: 'Konverter Markdown ↔ HTML',
			description: 'Render Markdown ke HTML dengan pratinjau langsung, atau kembalikan HTML menjadi Markdown'
		},
		'html-formatter': {
			name: 'Perapi & Minifier HTML',
			description: 'Percantik HTML yang berantakan atau minifikasi untuk produksi'
		},
		'css-formatter': {
			name: 'Perapi & Minifier CSS',
			description: 'Percantik CSS agar mudah dibaca atau minifikasi sebelum dirilis'
		},
		'js-formatter': {
			name: 'Perapi & Minifier JavaScript',
			description: 'Percantik JavaScript atau minifikasi dengan kompresi dan penyingkatan nama sungguhan'
		},
		'string-escape': {
			name: 'Escape / Unescape String',
			description: 'Escape atau kembalikan string untuk JSON, JavaScript, Java, XML, SQL, dan CSV'
		},
		'number-base-converter': {
			name: 'Konverter Basis Bilangan',
			description: 'Konversi bilangan antara biner, oktal, desimal, heksadesimal, dan basis apa pun hingga 36'
		},
		'text-to-hex': {
			name: 'Konverter Teks ↔ Heks / Biner',
			description: 'Ubah teks menjadi bita heks, biner, atau desimal dan dekode kembali dump bita'
		},
		'json-schema-validator': {
			name: 'Validator & Generator JSON Schema',
			description: 'Validasi JSON terhadap sebuah skema, atau simpulkan skema dari data contoh'
		},
		'exif-viewer': {
			name: 'Penampil & Penghapus EXIF',
			description: 'Lihat metadata yang dibawa foto Anda — dan buang tanpa mengenkode ulang'
		}
	}
};

export default id;
