import type { Messages } from '$lib/i18n';

const tr: Messages = {
	code: 'tr',
	name: 'Türkçe',
	ui: {
		search: 'Ara',
		overview: 'Genel bakış',
		toggleTheme: 'Renk temasını değiştir',
		themeSystem: 'Sistemi izle',
		themeDark: 'Koyu',
		themeLight: 'Açık',
		themeTitle: 'Tema: {mode} — değiştirmek için tıklayın',
		footerPrivacy: 'Tarayıcınızda çalışır — yapıştırdığınız hiçbir şey yüklenmez',
		allTools: 'Tüm araçlar',
		changelog: 'Sürüm notları',
		changelogMetaDescription:
			'onlinetools.dev’de neler yeni — yeni araçlar, özellikler ve düzeltmeler; hepsi tarayıcınızda yerel olarak çalışır.',
		releaseDate: 'Yayın tarihi',
		language: 'Dil',
		openNav: 'Menüyü aç',
		searchTools: 'Araçlarda ara',

		// About / Why page
		about: 'Hakkında',
		aboutTitle: 'Neden onlinetools.dev — yerelde çalışır, izlemez, doğrulanabilir | onlinetools.dev',
		aboutMetaDescription:
			'onlinetools.dev neden var: her araç tarayıcınızda çalışır, yapıştırdığınız hiçbir şey yüklenmez, reklam yok, izleyici yok, giriş yok — ve canlı bir sayaç bunu kendiniz doğrulamanızı sağlar.',
		aboutEyebrow: 'neden var · güven',
		aboutVerifyHeading: 'Sözüme güvenmek zorunda değilsiniz',
		aboutVerifyHint:
			'Aşağıya bir şeyler yazın ya da yapıştırın. Sayaç sıfırda kalacak — her tuş vuruşu burada, kendi makinenizde işleniyor.',
		aboutRequestsLabel: 'Bu sayfa açıldığından beri yapılan ağ isteği',
		aboutRequestsNote:
			'Bu sayıyı kıpırdatabilecek tek şey, aynı alan adından kendi kodunu yükleyen başka bir aracı açmanızdır. Yapıştırdığınız içerik asla kıpırdatmaz.',
		aboutVerifyPlaceholder: 'Bir şeyler yazın veya yapıştırın — hiçbir şey tarayıcınızdan çıkmaz…',
		aboutOfflineReady: 'Çevrimdışına hazır',
		aboutOfflineCaching: 'Önbelleğe alınıyor…',
		aboutDevtools:
			'Daha sağlam kanıt mı istiyorsunuz? Tarayıcınızın geliştirici araçlarını açın, Network sekmesine geçin, sonra yapıştırın. Hiçbir şeyin olmadığını izleyeceksiniz.',
		aboutViewSource: 'Kaynağı görüntüle',
		aboutEditPage: 'Bu sayfayı düzenle',
		aboutBuiltBy: 'Yapan',

		// About / Why page — the manifesto body (localized)
		aboutH1: 'Bir hesap makinesi arkanızdan sunucuya rapor vermemeli.',
		aboutLead:
			'“Online araç” sitelerinin çoğu, yapıştırdığınız her şeyi sessizce hiç görmeyeceğiniz bir sunucuya gönderen bir metin kutusunun etrafına örülmüş bir reklam duvarıdır. Rastgele bir sayfada JWT çözüp bir saniye sonra “az önce token’ımı bir yabancıya verdim” diye fark etmekten bıktım. onlinetools.dev benim cevabım: her gün uzandığınız araçların aynısı, ama işi yapan bilgisayar zaten önünüzde duran.',
		aboutS1Head: 'Her şey sizin makinenizde çalışır',
		aboutS1Body:
			'Buradaki her araç, tarayıcınızda yapılan düz bir hesaplamadır — gidiş dönüş yok, sunucu yok, karşıya yükleyecek bir yer yok. JSON’unuz, erişim token’larınız, önce temizlemeyi düşündüğünüz şu {env}: panonuzdan ekranınıza gider ve orada kalır. Bunu ucuza mal olduğu için yapmadım (öyle de) — verileriniz beni ilgilendirmediği için yaptım.',
		aboutS2Head: 'Reklam yok. İzleyici yok. Hesap yok.',
		aboutS2Body:
			'Tuş vuruşlarınızı sayan bir analytics betiği yok, çerez bandı yok (onay verilecek çerez de yok), “devam etmek için giriş yapın” yok, üç adım sonra bekleyen bir satış teklifi yok. Kim olduğunuzu ve ne yapıştırdığınızı gerçekten bilmiyorum — asıl mesele de bu: bir araç işini yapmalı ve sekmeyi kapattığınız anda sizi unutmalı.',
		aboutS3Head: 'Ağ çalışmadığında da çalışır',
		aboutS3Body:
			'Bir sayfayı bir kez açtınız mı artık sizindir. Sitenin tamamı statiktir ve bir service worker tarafından önbelleğe alınır; yani uçakta, metroda ya da kilitli bir kurumsal proxy’nin ardında araçlar çalışmaya devam eder. Uçak modu, JSON biçimlendirmek için gayet uygun bir yerdir.',
		aboutS4Head: 'Hızlı ve yolunuzdan çekilir',
		aboutS4Body:
			'Açılış ekranı yok, “koşulları kabul edin” yok, sizinle iş arasında duran bir pencere yok. Herhangi bir araca atlamak için {kbd} tuşlayın, bir şey yapıştırın ve doğru araç kendiliğinden yüzeye çıksın; her sonuç panonuza tek tuş uzaklıkta. Baştan sona klavye önceliklidir.',
		aboutVerifyIntro:
			'Gizlilik iddiaları ucuzdur — her site, size bir şey satmaya giderken “gizliliğinize değer verdiğini” söyler. Bu yüzden inanmanız gereken değil, kontrol edebileceğiniz bir şey: bu sayaç tarayıcınızın kendi ağ etkinliğini canlı olarak izler:',
		aboutBugLine:
			'Bir araç verilerinizi gitmemesi gereken bir yere gönderirse bu bir hatadır, iş modeli değil — {issue}, düzelteyim.',
		aboutBugLink: 'bir issue açın',

		// Favorites (stored locally in this browser)
		favorites: 'Favoriler',
		favoriteAdd: 'Favorilere ekle',
		favoriteRemove: 'Favorilerden çıkar',

		// Home
		homeTitle: 'onlinetools.dev — Tarayıcınızda çalışan geliştirici araçları',
		homeMetaDescription:
			'Tamamen tarayıcınızda çalışan hızlı, klavye öncelikli geliştirici araçları. JSON biçimlendirin, JWT ve Base64 çözün, zaman damgası dönüştürün, regex test edin — yükleme yok, kayıt yok, çevrimdışı çalışır.',
		homeEyebrow: '{n} araç · yerelde çalışır',
		homeHeading: 'Tarayıcınızda çalışan geliştirici araçları',
		homeSub: 'Yükleme yok, kayıt yok, bekleme yok.',
		pasteToDetect: 'yapıştırın, tanısın',
		worksOffline: 'çevrimdışı çalışır',
		shortcuts: 'kısayollar',
		searchPlaceholder: '{n} araç içinde arayın ya da bir şey yapıştırın…',
		startHere: 'Buradan başlayın',
		smartPaste: 'Akıllı Yapıştır',
		smartPasteDesc:
			'Nereye olursa olsun bir şey yapıştırın — içerik türü tanınır ve doğru araç tek tuş uzağınızda olur.',
		keyboardFirst: 'Baştan sona klavye öncelikli',
		keyboardFirstDesc: 'Fareye dokunmadan bulun, çalıştırın, kopyalayın ve paylaşın.',
		kbdAnyTool: 'herhangi bir araç',
		kbdCopyResult: 'sonucu kopyala',
		kbdConfirm: 'onayla',
		kbdAllShortcuts: 'tüm kısayollar',

		// Paste hero (homepage)
		pasteHeroHeading: 'Bir şey yapıştırın — doğru aracı anında alın',
		pasteHeroPlaceholder: 'JWT, JSON, Unix zaman damgası, renk, URL, görsel… yapıştırın',
		tryLabel: 'Deneyin',
		plainText: 'Düz metin',
		noMatchHint: 'Tam eşleşme yok — aşağıdan bir metin aracı seçin veya her şeyi arayın',
		runHint: 'çalıştır',
		newlineHint: 'yeni satır',
		clearHint: 'temizle',

		// Pipeline (tool chains)
		chainNavLabel: 'Zincir',
		chainNew: 'Yeni',
		chainSteps: 'Adımlar',
		chainMoreRecipes: 'Diğer tarifler',
		chainTitle: 'Araç Zinciri — geliştirici araçlarını tarayıcınızda birbirine bağlayın | onlinetools.dev',
		chainMetaDescription:
			'Geliştirici araçlarını bir zincire dizin — tek akışta çözün, dönüştürün ve ayıklayın. Her adım bir sonrakini besler, her şey tarayıcınızda çalışır ve tarifin tamamı paylaşılabilir bir bağlantıda durur.',
		chainEyebrow: 'tezgâh · yerelde çalışır',
		chainHeading: 'Zincir',
		chainSub:
			'Araçları bir tarife dizin — her adım bir sonrakini besler. Tamamen tarayıcınızda çalışır.',
		chainInputPlaceholder: 'Başlangıç girdisini yapıştırın veya yazın…',
		chainAddStep: 'Adım ekle',
		chainSearchSteps: 'Adımlarda ara…',
		chainStarters: 'Hazır başlangıçlar',
		chainEmpty: 'Bir adım ekleyin — her adım bir sonrakini besler.',
		chainHomeCta: 'Araçları bir zincire dizin',
		chainHomeCtaSub:
			'Bir aracın çıktısını diğerine aktarın — tek akışta çözün, dönüştürün ve ayıklayın.',

		// Tools index page
		toolsTitle: 'Tüm geliştirici araçları — onlinetools.dev',
		toolsMetaDescription:
			'onlinetools.dev’deki tüm araçlara göz atın: JSON, YAML, Base64, JWT, zaman damgaları, cron, regex, diff, UUID, hash, QR kodları ve daha fazlası — hepsi tarayıcınızda yerel olarak çalışır.',
		toolsBlurb:
			'{n} araç, her biri tarayıcınızda hesaplanıyor. Yenileri istikrarlı biçimde ekleniyor — bakın:',

		// Tool page shell
		toolTitle: '{name} — Ücretsiz ve Gizli | onlinetools.dev',
		toolMetaSuffix: 'Tamamen tarayıcınızda çalışır — yükleme yok, kayıt yok, çevrimdışı çalışır.',
		runsLocally: 'Yerelde çalışır',
		runsLocallyTitle: 'Bu araç her şeyi tarayıcınızda hesaplar. Girdiniz asla karşıya yüklenmez.',
		aboutTool: 'Bu araç hakkında',
		faqHeading: 'Sıkça sorulan sorular',
		relatedTools: 'İlgili araçlar',
		breadcrumbTools: 'araçlar',

		// Shared tool components
		sample: 'Örnek',
		line: 'satır',
		output: 'Çıktı',
		copy: 'Kopyala',
		copied: 'Kopyalandı',
		download: 'İndir',
		share: 'Paylaş',
		linkCopied: 'Bağlantı kopyalandı',
		continueWith: 'Şununla devam et',
		suggested: 'önerilen',
		shareTooLarge:
			'Girdi bir URL için fazla büyük — paylaşım bağlantıları taşınabilir kalsın diye sınırlandırılmıştır. İçerik bu makineden hiç çıkmaz.',
		emptyHint: 'Siz yazdıkça çıktı burada belirir',

		// Command palette
		palettePlaceholder: 'Araçlarda arayın ya da üzerinde çalışmak için içerik yapıştırın…',
		noMatch: 'Eşleşen araç yok',
		navigate: 'gezin',
		open: 'aç',
		close: 'kapat',

		// Smart paste
		detected: 'Tanındı',
		chars: 'karakter',

		// Shortcut help
		shortcutsTitle: 'Klavye kısayolları',
		scPalette: 'Komut paletini aç',
		scCopy: 'Sonucu kopyala',
		scEsc: 'Paneli kapat / öneriyi kaldır',
		scHelp: 'Bu kısayol listesi',
		scPaste: 'Akıllı Yapıştır — içeriği tanı ve araç öner',
		scNav: 'Panellerde gezinin ve onaylayın'
	},
	tl: {
		direction: 'Yön',
		encode: 'Kodla',
		decode: 'Çöz',
		mode: 'Mod',
		count: 'Adet',
		lengthLbl: 'Uzunluk',
		uppercase: 'Büyük harf',
		lowercase: 'Küçük harf',
		regenerate: 'Yeniden üret',
		b64InputEnc: 'Kodlanacak metin',
		b64InputDec: 'Çözülecek Base64',
		b64PhEnc: 'Unicode dâhil her türlü metin',
		b64UrlSafe: 'URL güvenli (dolgusuz)',
		bcHash: 'Hash’le',
		bcVerify: 'Doğrula',
		bcHashT: 'Bir parolayı hash’le',
		bcVerifyT: 'Bir parolayı hash ile karşılaştır',
		bcPassword: 'Parola',
		bcCost: 'Maliyet faktörü',
		bcHashLbl: 'Bcrypt hash’i',
		bcPh: 'tarayıcınızda kalır',
		bcVersion: 'Sürüm',
		bcCostShort: 'Maliyet',
		bcSalt: 'Salt',
		bcNote:
			'Hash’leme tarayıcınızda çalışır — hiçbir şey iletilmez. Tarayıcıdaki JS, yerel bcrypt’ten yavaştır; süreleri üst sınır olarak değerlendirin.',
		caseInput: 'Metin veya tanımlayıcı (her satıra bir tane)',
		caseEmpty: 'Siz yazdıkça dokuz biçimin hepsi burada belirir',
		colorInput: 'Renk',
		colorFormats: 'Biçimler',
		colorRgb: 'RGB kanalları',
		colorContrast: 'Metin kontrastı (WCAG)',
		cronInput: 'Cron ifadesi',
		cronEvalIn: 'şuna göre hesaplandı:',
		cronNext: 'Sonraki 5 çalışma',
		cronNone: 'Önümüzdeki 5 yıl içinde çalışma yok',
		diffOriginal: 'Özgün',
		diffChanged: 'Değişmiş',
		diffLbl: 'Fark',
		diffUnchanged: 'değişmedi',
		diffEmpty: 'Satır satır fark burada görünür',
		hashInput: 'Hash’lenecek metin',
		hashPh: 'Herhangi bir metin — siz yazdıkça hash’ler güncellenir',
		hashHmac: 'HMAC gizli anahtarı',
		hashOptional: '(isteğe bağlı)',
		hashHmacPh: 'Düz hash için boş bırakın',
		hashDigests: 'Özetler',
		hashEmpty: 'Siz yazdıkça özetler anlık güncellenir',
		hashNote:
			'MD5 ve SHA-1 yalnızca eski sağlama toplamları için gösterilir — güvenlikle ilgili her şeyde SHA-256 veya daha güçlüsünü kullanın.',
		heAll: 'ASCII olmayan tüm karakterleri kodla',
		heNumeric: 'Yalnızca sayısal',
		heInputEnc: 'Kaçışlanacak metin',
		heInputDec: 'Varlık içeren HTML',
		imgDrop: 'Bir görsel sürükleyin, seçmek için tıklayın ya da panodan yapıştırın',
		imgLocal: 'Tarayıcınızda kalır — hiçbir şey yüklenmez',
		imgReplace: 'Değiştirmek için sürükleyin, tıklayın veya yapıştırın',
		imgSource: 'Kaynak görsel',
		imgOriginal: 'Özgün',
		imgDimensions: 'Boyutlar',
		imgDownload: '{fmt} indir',
		imgErrNotImage: 'Tanınan bir görsel biçimi değil (PNG, JPEG, WebP, GIF, SVG, BMP, ICO, AVIF)',
		imgErrDecode: 'Tarayıcı bu görseli çözemedi',
		imgErrEncode: 'Tarayıcı bu görseli kodlayamadı',
		imgErrFormat: 'Bu tarayıcı {fmt} kodlayamıyor — PNG veya JPEG deneyin',
		i2bToB64: 'Görsel → Base64',
		i2bFromB64: 'Base64 → görsel',
		i2bInput: 'Data URL veya ham Base64',
		i2bDataUrl: 'Data URL',
		i2bRawB64: 'Ham Base64',
		i2bCss: 'CSS arka planı',
		i2bHtml: 'HTML <img>',
		i2bEncodedSize: 'Base64 boyutu',
		i2bOverhead: 'ikiliye göre +%{pct}',
		i2bNote:
			'Gömme bir isteği azaltır ama belgeyi şişirir ve önbelleklemeyi bozar — en iyisi ikonlar ve ~10 KB altındaki küçük varlıklar için.',
		icTarget: 'Şuna dönüştür',
		icQuality: 'Kalite',
		icConverted: 'Dönüştürülmüş',
		icSmaller: 'özgününden küçük',
		icLarger: 'özgününden büyük',
		icBgNote: 'JPEG’de saydamlık yoktur — saydam alanlar beyaz üzerine düzleştirilir.',
		icNote:
			'Dönüştürme tarayıcınızın canvas kodlayıcısını kullanır; bu yüzden tam dosya boyutları tarayıcılar arasında biraz değişir.',
		fgAppleBg: 'Apple ikonu arka planı',
		fgFiles: 'Üretilen dosyalar',
		fgHtml: 'HTML <link> etiketleri',
		fgSmall:
			'Kaynak {px}px — bunun üzerindeki ikonlar büyütülecek ve bulanık görünebilir',
		fgNote:
			'ICO içinde 16, 32 ve 48 px bulunur. Apple touch ikonları saydam olamaz, bu yüzden seçtiğiniz arka plan üzerine düzleştirilir; PWA ikonları alfa kanalını korur. Kare olmayan kaynaklar ortadan kırpılır.',
		irBy: 'Şuna göre boyutlandır',
		irWidth: 'Genişlik',
		irHeight: 'Yükseklik',
		irPercent: 'Yüzde',
		irFormat: 'Biçim',
		irKeep: 'Koru',
		irResized: 'Boyutlandırılmış',
		irScale: 'Ölçek',
		irNote:
			'Küçültme yüksek kaliteli yumuşatma kullanır. Büyütme yoktan ayrıntı yaratamaz — 2× üzerinde bulanıklık bekleyin.',
		jcInput: 'Nesnelerden oluşan JSON dizisi',
		jcDelimiter: 'Ayırıcı',
		jcComma: 'Virgül',
		jcSemicolon: 'Noktalı virgül (Avrupa Excel)',
		jcTab: 'Sekme',
		jfInput: 'JSON girdisi',
		jfIndent: 'Girinti',
		jfIndentation: 'Girintileme',
		jfSp2: '2 boşluk',
		jfSp4: '4 boşluk',
		jfTabs: 'Sekme',
		jfMin: 'Küçültülmüş — boşluksuz',
		jfSortKeys: 'Anahtarları sırala',
		jfText: 'Metin',
		jfTree: 'Ağaç',
		jfTreeHint: 'JSONPath’ini kopyalamak için bir düğümün üzerine gelin — şurada deneyin:',
		jfTreeLink: 'JSONPath test aracı',
		jpExpr: 'JSONPath ifadesi',
		jpDoc: 'JSON belgesi',
		jpMatches: 'Eşleşmeler',
		jpResults: 'Sonuç değerleri',
		jtInput: 'JSON örneği',
		jtRoot: 'Kök tür adı',
		jtNote:
			'Bu tek örnekten çıkarıldı — verileriniz değişkense alanları isteğe bağlı işaretleyin ve null olabilecekleri genişletin.',
		jyFrom: 'Kaynak',
		jySource: 'Kaynak biçim',
		jyAutoT: 'Kaynak biçimi içerikten algıla',
		jyTarget: 'Hedef biçim',
		jyInput: 'Girdi',
		jyUnknown: 'bilinmeyen biçim',
		jwtAnatomy: 'Token anatomisi',
		jwtHeader: 'başlık',
		jwtPayload: 'yük',
		jwtSignature: 'imza (doğrulanmadı)',
		jwtIssued: 'Verildi',
		jwtExpires: 'Sona eriyor',
		jwtNotBefore: 'Şundan önce geçersiz',
		jwtLifetime: 'Ömür',
		jwtNote:
			'Çözme yalnızca token’ı okur — imzayı doğrulamaz. İmzaları sunucu tarafında, veren tarafın anahtarlarıyla doğrulayın.',
		loremUnit: 'Birim',
		loremWords: 'Kelime',
		loremSentences: 'Cümle',
		loremParagraphs: 'Paragraf',
		loremClassic: '“Lorem ipsum…” ile başla',
		pwWeak: 'Zayıf',
		pwFair: 'Orta',
		pwStrong: 'Güçlü',
		pwExcellent: 'Mükemmel',
		pwNoLookalikes: 'Benzer karakterler yok (0O1lI)',
		pwEntropy: 'Entropi',
		pwBits: 'bit',
		pwNote:
			'≥ 80 bit, hızlı hash’lere karşı çevrimdışı kırmaya dayanır; ≥ 100 bit pratikte tahmin edilemez.',
		pwOut: 'Parolalar',
		pwCrypto:
			'crypto.getRandomValues ile yalnızca tarayıcınızda üretildi. Hiçbir şey saklanmaz veya iletilmez.',
		qrContent: 'İçerik',
		qrEc: 'Hata düzeltme',
		qrEcT: '%{pct} hasara dayanır',
		qrSvg: 'SVG (vektör, baskı)',
		qrPng: 'PNG (sohbet, sunum)',
		qrNote:
			'İçerik doğrudan kodlanır — yönlendirme servisi yok, süresi dolan bir şey yok, tarama takibi yok.',
		qrdResult: 'Çözülen içerik',
		qrdNone:
			'QR kod bulunamadı — daha net bir görsel kullanın, koda yakın kırpın ve çevresindeki boşluğu koruyun',
		qrdOpen: 'Bağlantıyı aç',
		qrdWifiSsid: 'Ağ (SSID)',
		qrdWifiPass: 'Parola',
		qrdWifiSec: 'Güvenlik',
		qrdWifiHidden: 'Gizli ağ',
		qrdNote:
			'Tarama tamamen tarayıcınızda gerçekleşir — ne görsel ne de kodun içeriği hiçbir yere yüklenir.',
		rxPattern: 'Desen',
		rxTest: 'Test metni',
		rxTestPh: 'Deseni deneyeceğiniz metni yapıştırın',
		rxHighlighted: 'Vurgulanmış',
		rxMatches: 'Eşleşmeler',
		rxMatched: 'Eşleşen metin',
		slugInput: 'Başlık (her satıra bir tane)',
		slugSep: 'Ayırıcı',
		slugHyphen: 'Tire',
		slugUnderscore: 'Alt çizgi',
		slugMax: 'En fazla uzunluk',
		slugOut: 'Slug',
		slInput: 'Satırlar',
		slPh: 'her satıra bir tane',
		slSort: 'Sırala',
		slKeep: 'Sırayı koru',
		slAsc: 'Artan',
		slDesc: 'Azalan',
		slNatural: 'Doğal — sayılar sırasıyla',
		slLength: 'Satır uzunluğuna göre',
		slShuffle: 'Karıştır',
		slDedupe: 'Yinelenenleri sil',
		slIgnoreCase: 'Büyük/küçük harfi yoksay',
		slTrim: 'Boşlukları kırp',
		slDropEmpty: 'Boşları at',
		tsInput: 'Zaman damgası veya tarih',
		tsNow: 'Şu anki unix zamanı:',
		tsNowT: 'Şu anki zamanı girdi olarak kullan',
		tsRelative: 'Göreli',
		tsUnixS: 'Unix saniye',
		tsUnixMs: 'Unix milisaniye',
		tsZones: 'Saat dilimlerine göre',
		tsNote:
			'İşaretçi, her dilimin yerel saatini 24 saatlik şeritte gösterir — soluk uçlar 21:00–07:00 arasıdır.',
		uaInput: 'User-Agent dizgesi',
		uaBrowser: 'Tarayıcı',
		uaEngine: 'Motor',
		uaOs: 'İşletim sistemi',
		uaDevice: 'Cihaz',
		uaNote:
			'“Örnek” düğmesi kendi tarayıcınızın User-Agent’ını ekler. Çalışma anındaki kararlar için UA ayıklama yerine özellik algılama kullanın.',
		uniInput: 'İncelenecek metin',
		uniPh: 'Bir şey yapıştırın — görünmez karakterler burada görünür olur',
		uniGraphemes: 'Grafemler',
		uniGraphemesHint: 'kullanıcının gördüğü',
		uniCodePoints: 'Kod noktaları',
		uniUtf16: 'UTF-16 birimi',
		uniUtf16Hint: 'JS .length',
		uniUtf8: 'UTF-8 bayt',
		uniLimit: 'İlk 300 karakter gösteriliyor.',
		upInput: 'URL',
		upProtocol: 'Protokol',
		upHost: 'Host',
		upHostname: 'Ana makine adı',
		upPort: 'Port',
		upPath: 'Yol',
		upFragment: 'Parça',
		upOrigin: 'Origin',
		upQuery: 'Sorgu parametreleri',
		upDefault: '(varsayılan)',
		upNone: '(yok)',
		upEmpty: 'URL bileşenleri burada görünür',
		urlComponent: 'Bileşen modu (encodeURIComponent)',
		urlInputDec: 'Çözülecek kodlanmış metin',
		uuidOut: 'Üretilen kimlikler',
		uuidFormat: 'Kimlik biçimi',
		uuidHintV4: 'rastgele',
		uuidHintV7: 'zamana göre sıralı',
		uuidHintUlid: 'zamana göre sıralı, base32',
		uuidHintNano: 'kısa, URL güvenli',
		uuidNote:
			'crypto.getRandomValues ile üretildi — kriptografik olarak güvenli, tarayıcınızda oluşturuldu, hiçbir yere kaydedilmedi.',
		fmtFormat: 'Biçimlendir',
		fmtMinify: 'Küçült',
		sqlInput: 'SQL ifadesi/ifadeleri',
		sqlDialect: 'Lehçe',
		sqlKeywords: 'Anahtar kelimeler',
		sqlKeep: 'Koru',
		xmlInput: 'XML belgesi',
		xjInputXml: 'XML belgesi',
		xjInputJson: 'JSON nesnesi',
		xjNote:
			'Öznitelikler "@_ad" anahtarlarına, özniteliklerin yanındaki metin ise "#text" alanına dönüşür; böylece dönüşüm geri alınabilir. Karışık kardeş düğümler arasındaki sıra korunmaz — XML tekrara izin verir, JSON nesneleri vermez.',
		cjInput: 'CSV / TSV verisi',
		cjAuto: 'Otomatik',
		cjPipe: 'Dikey çizgi',
		cjHeader: 'İlk satır başlıktır',
		cjTyped: 'Türlü değerler',
		mdPreview: 'Önizleme',
		mdNote:
			'Önizleme işlenmeden önce temizlenir; yapıştırılan veya paylaşılan içerikteki betikler ve olay işleyicileri çalışamaz. HTML çıktısı kutusu ham dönüşümü taşır.',
		htmlInput: 'HTML kaynağı',
		cssInput: 'CSS kaynağı',
		jsInput: 'JavaScript kaynağı',
		escEscape: 'Kaçışla',
		escUnescape: 'Kaçışı kaldır',
		escDialect: 'Lehçe',
		escInputEsc: 'Kaçışlanacak metin',
		escInputUnesc: 'Kaçışlanmış metin',
		nbInput: 'Sayı',
		nbFrom: 'Kaynak',
		nbAutoT: '0x / 0o / 0b önekinden algıla, aksi hâlde ondalık say',
		nbGroup: 'Basamakları grupla',
		nbBase: 'Taban',
		nbBin: 'İkili',
		nbOct: 'Sekizli',
		nbDec: 'Ondalık',
		nbHex: 'Onaltılı',
		nbBits: 'bit',
		hbFormat: 'Baytlar şu biçimde',
		hbSep: 'Ayırıcı',
		hbSpace: 'Boşluk',
		hbNone: 'Yok',
		hbColon: 'İki nokta',
		hbInputEnc: 'Kodlanacak metin',
		hbInputDec: 'Çözülecek baytlar',
		schInfer: 'Şema çıkar',
		schValidate: 'Doğrula',
		schInferT: 'Örnek JSON’dan şema üret',
		schValidateT: 'JSON’u bir şemaya göre denetle',
		schData: 'JSON verisi',
		schSchema: 'JSON Schema',
		schViolations: 'ihlal',
		schValid: 'Geçerli — veri şemaya uyuyor',
		schResult: 'Doğrulama sonucu',
		exTags: '{n} meta veri alanı',
		exNone: 'Meta veri bulunamadı — bu dosya zaten temiz',
		exStrip: 'Temizlenmiş kopyayı indir',
		exGps: 'GPS konumu gömülü',
		exMap: 'Haritada göster',
		exNote:
			'Okuma ve temizleme tamamen tarayıcınızda olur — fotoğraf asla yüklenmez. Temizleme, meta veri bölümlerini yeniden kodlamadan bayt bayt kaldırır; pikseller ve kalite olduğu gibi kalır.',
		crBuilder: 'Oluşturucu',
		crMinute: 'Dakika',
		crHour: 'Saat',
		crDom: 'Ayın günü',
		crMonth: 'Ay',
		crDow: 'Haftanın günü',
		crEvery: 'Her',
		crStep: 'Her N',
		crAt: 'Belirli',
		crUse: 'İfadeyi kullan',
		jwtDecode: 'Çöz',
		jwtSign: 'İmzala',
		jwtVerify: 'Doğrula',
		jwtAlg: 'Algoritma',
		jwtPayloadLbl: 'Yük (JSON nesnesi)',
		jwtSecret: 'Gizli anahtar',
		jwtPrivKey: 'Özel anahtar (PKCS#8 PEM)',
		jwtPubKey: 'Gizli anahtar (HS) veya açık anahtar PEM (RS/ES)',
		jwtSignNote:
			'İmzalama tarayıcınızdaki WebCrypto üzerinde çalışır — anahtar bu sayfadan hiç çıkmaz. HS algoritmalarında uzun ve rastgele bir gizli anahtar kullanın; kısa olanlar nerede imzalarsanız imzalayın kaba kuvvetle kırılabilir.',
		jwtVerifyNote:
			'Doğrulama, verdiğiniz anahtara karşı imzayı yerelde denetler. JWKS uç noktalarını çekmez, aud/iss gibi iddiaları da doğrulamaz — onu sunucu tarafında yapın.',
		tsDiff: 'İki tarih arasındaki fark',
		wcWords: 'Kelime',
		wcChars: 'Karakter',
		wcCharsHint: 'boşluksuz {n}',
		wcReading: 'Okuma süresi',
		wcReadingHint: 'dakikada 220 kelime',
		wcLines: 'Satır',
		wcSentences: 'Cümle',
		wcParagraphs: 'Paragraf',
		wcAvg: 'Ort. kelime uzunluğu'
	},
	categories: {
		encoding: 'Kodlama',
		json: 'JSON ve veri',
		text: 'Metin',
		time: 'Tarih ve saat',
		generators: 'Üreteçler',
		crypto: 'Hash ve kriptografi',
		web: 'Web',
		image: 'Görsel',
		code: 'Kod ve biçimlendirme',
		privacy: 'Gizlilik'
	},
	tools: {
		'json-formatter': {
			name: 'JSON Biçimlendirici ve Doğrulayıcı',
			description: 'JSON’u biçimlendirin, doğrulayın ve küçültün; hatanın yerini tam olarak görün'
		},
		'base64-decode': {
			name: 'Base64 Kodlama / Çözme',
			description: 'Metni Base64’e kodlayın veya Base64’ü metne çözün, URL güvenli biçim dâhil'
		},
		'image-to-base64': {
			name: 'Görsel ↔ Base64 Dönüştürücü',
			description: 'Görselleri Base64 data URL’ye ve geri çevirin — CSS ve HTML parçacıklarıyla'
		},
		'image-converter': {
			name: 'Görsel Biçim Dönüştürücü',
			description: 'Görselleri PNG, JPEG ve WebP arasında kalite ayarıyla dönüştürün'
		},
		'image-resizer': {
			name: 'Görsel Boyutlandırıcı',
			description: 'Görselleri genişliğe, yüksekliğe veya yüzdeye göre boyutlandırın — net ve tamamen çevrimdışı'
		},
		'favicon-generator': {
			name: 'Favicon Üreteci',
			description: 'Herhangi bir görselden favicon.ico ile tüm PNG ve manifest ikon setini üretin'
		},
		'timestamp-converter': {
			name: 'Unix Zaman Damgası Dönüştürücü',
			description: 'Unix zaman damgalarını okunur tarihlere ve geri çevirin, göreli zamanla birlikte'
		},
		'jwt-decoder': {
			name: 'JWT Çözücü',
			description: 'JWT başlığını ve yükünü çözün, süresini denetleyin — tamamen çevrimdışı'
		},
		'regex-tester': {
			name: 'Regex Test Aracı',
			description: 'Düzenli ifadeleri canlı eşleşme vurgusu ve gruplarla test edin'
		},
		'diff-checker': {
			name: 'Metin Farkı Karşılaştırıcı',
			description: 'İki metni satır satır karşılaştırın, eklenen ve silinenleri görün'
		},
		'url-encode-decode': {
			name: 'URL Kodlama / Çözme',
			description: 'URL bileşenlerini ve sorgu dizgelerini yüzde kodlayın ya da çözün'
		},
		'url-parser': {
			name: 'URL Ayrıştırıcı',
			description: 'Bir URL’yi protokol, host, yol ve sorgu parametrelerine ayırın'
		},
		'uuid-generator': {
			name: 'UUID Üreteci',
			description: 'UUID v4/v7, ULID ve Nano ID üretin — tek tek veya toplu'
		},
		'hash-generator': {
			name: 'Hash Üreteci',
			description: 'MD5, SHA-1, SHA-256, SHA-512 ve HMAC — tarayıcınızda hesaplanır'
		},
		'color-converter': {
			name: 'Renk Dönüştürücü',
			description: 'Renkleri HEX, RGB, HSL ve OKLCH arasında canlı önizlemeyle dönüştürün'
		},
		'case-converter': {
			name: 'Yazım Biçimi Dönüştürücü',
			description: 'camelCase, snake_case, kebab-case, PascalCase ve diğerleri arasında geçiş yapın'
		},
		'word-counter': {
			name: 'Kelime Sayacı',
			description: 'Yazdıkça kelime, karakter, cümle, bayt ve okuma süresini sayın'
		},
		'lorem-ipsum-generator': {
			name: 'Lorem Ipsum Üreteci',
			description: 'Tasarım taslakları için yer tutucu kelime, cümle veya paragraf üretin'
		},
		'slug-generator': {
			name: 'Slug Üreteci',
			description: 'Başlıkları ayırıcı ve uzunluk seçenekleriyle temiz URL slug’larına çevirin'
		},
		'sort-lines': {
			name: 'Satır Sıralama ve Yineleme Temizleme',
			description: 'Satırları alfabetik veya doğal sıralayın, yinelenenleri ve boşları silin'
		},
		'html-entities': {
			name: 'HTML Varlıkları Kodlama / Çözme',
			description: 'Metni HTML için kaçışlayın ya da &amp; biçimli varlıkları karakterlere çevirin'
		},
		'unicode-inspector': {
			name: 'Unicode Karakter İnceleyici',
			description: 'Her karakterin kod noktasını, UTF-8/UTF-16 baytlarını ve kaçışlarını görün'
		},
		'cron-parser': {
			name: 'Cron İfadesi Ayrıştırıcı',
			description: 'Herhangi bir cron planını sade dille açıklayın ve sonraki çalışma zamanlarını görün'
		},
		'password-generator': {
			name: 'Parola Üreteci',
			description: 'Karakter kümesi seçenekleri ve dürüst bir entropi ölçeriyle rastgele parolalar'
		},
		'qr-code-generator': {
			name: 'QR Kod Üreteci',
			description: 'SVG veya PNG olarak net QR kodları üretin — filigran yok, yükleme yok'
		},
		'qr-code-decoder': {
			name: 'QR Kod Çözücü',
			description: 'Görsellerdeki QR kodları okuyun — URL, WiFi ve metin, tamamen çevrimdışı'
		},
		'json-to-yaml': {
			name: 'JSON ↔ YAML ↔ TOML Dönüştürücü',
			description: 'JSON, YAML ve TOML arasında biçim otomatik algılamayla dönüştürün'
		},
		'json-to-csv': {
			name: 'JSON ↔ CSV Dönüştürücü',
			description: 'JSON’u CSV’ye düzleştirin ya da CSV’yi türlü JSON nesnelerine ayrıştırın'
		},
		'json-to-typescript': {
			name: 'JSON → TypeScript Türleri',
			description: 'Bir JSON örneğinden TypeScript arayüzlerini anında çıkarın'
		},
		'jsonpath-tester': {
			name: 'JSONPath Test Aracı',
			description: 'JSON’u JSONPath ifadeleriyle sorgulayın, her eşleşmeyi yoluyla görün'
		},
		'bcrypt-generator': {
			name: 'Bcrypt Hash ve Doğrulama',
			description: 'Parolaları bcrypt ile hash’leyin ve hash’leri düz metinle karşılaştırın'
		},
		'user-agent-parser': {
			name: 'User-Agent Ayrıştırıcı',
			description: 'Bir User-Agent dizgesinden tarayıcıyı, motoru, işletim sistemini ve cihazı belirleyin'
		},
		'sql-formatter': {
			name: 'SQL Biçimlendirici',
			description: 'SQL’i lehçeye duyarlı anahtar kelimelerle biçimlendirin ya da tek satıra küçültün'
		},
		'xml-formatter': {
			name: 'XML Biçimlendirici ve Doğrulayıcı',
			description: 'XML’i güzelce yazdırın, küçültün ve hatanın tam yerini görerek doğrulayın'
		},
		'xml-to-json': {
			name: 'XML ↔ JSON Dönüştürücü',
			description: 'XML belgelerini öznitelikleriyle birlikte JSON’a ve geri çevirin'
		},
		'markdown-to-html': {
			name: 'Markdown ↔ HTML Dönüştürücü',
			description: 'Markdown’ı canlı önizlemeyle HTML’e işleyin ya da HTML’i Markdown’a döndürün'
		},
		'html-formatter': {
			name: 'HTML Biçimlendirici ve Küçültücü',
			description: 'Dağınık HTML’i güzelleştirin ya da üretim için küçültün'
		},
		'css-formatter': {
			name: 'CSS Biçimlendirici ve Küçültücü',
			description: 'CSS’i okumak için güzelleştirin ya da yayına almak için küçültün'
		},
		'js-formatter': {
			name: 'JavaScript Biçimlendirici ve Küçültücü',
			description: 'JavaScript’i güzelleştirin ya da gerçek sıkıştırma ve ad kısaltmayla küçültün'
		},
		'string-escape': {
			name: 'Dizge Kaçışlama / Kaçış Kaldırma',
			description: 'Dizgeleri JSON, JavaScript, Java, XML, SQL ve CSV için kaçışlayın veya geri çevirin'
		},
		'number-base-converter': {
			name: 'Sayı Tabanı Dönüştürücü',
			description: 'Sayıları ikili, sekizli, ondalık, onaltılı ve 36’ya kadar her taban arasında çevirin'
		},
		'text-to-hex': {
			name: 'Metin ↔ Hex / İkili Dönüştürücü',
			description: 'Metni hex, ikili veya ondalık baytlara çevirin, bayt dökümlerini geri çözün'
		},
		'json-schema-validator': {
			name: 'JSON Schema Doğrulayıcı ve Üreteci',
			description: 'JSON’u bir şemaya göre doğrulayın ya da örnek veriden şema çıkarın'
		},
		'exif-viewer': {
			name: 'EXIF Görüntüleyici ve Temizleyici',
			description: 'Fotoğraflarınızın taşıdığı meta veriyi görün — ve yeniden kodlamadan silin'
		}
	}
};

export default tr;
