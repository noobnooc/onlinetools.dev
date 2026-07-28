import type { Messages } from '$lib/i18n';

const nl: Messages = {
	code: 'nl',
	name: 'Nederlands',
	ui: {
		search: 'Zoeken',
		overview: 'Overzicht',
		toggleTheme: 'Kleurthema wisselen',
		themeSystem: 'Systeem volgen',
		themeDark: 'Donker',
		themeLight: 'Licht',
		themeTitle: 'Thema: {mode} — klik om te wisselen',
		footerPrivacy: 'Draait in je browser — niets wat je plakt wordt geüpload',
		allTools: 'Alle tools',
		changelog: 'Wijzigingslog',
		changelogMetaDescription:
			'Wat er nieuw is op onlinetools.dev — nieuwe tools, functies en verbeteringen, allemaal lokaal in je browser.',
		releaseDate: 'Releasedatum',
		language: 'Taal',
		openNav: 'Navigatie openen',
		searchTools: 'Tools zoeken',

		about: 'Over',
		aboutTitle: 'Waarom onlinetools.dev — lokaal, zonder tracking, controleerbaar | onlinetools.dev',
		aboutMetaDescription:
			'Waarom onlinetools.dev bestaat: elke tool draait in je browser, niets wat je plakt wordt geüpload, geen advertenties, geen trackers, geen login — en een live meter laat je het zelf controleren.',
		aboutEyebrow: 'waarom dit bestaat · vertrouwen',
		aboutVerifyHeading: 'Geloof me niet op mijn woord',
		aboutVerifyHint:
			'Typ of plak hieronder iets. De teller blijft op nul staan — elke toetsaanslag wordt hier afgehandeld, op jouw machine.',
		aboutRequestsLabel: 'Netwerkverzoeken sinds deze pagina werd geopend',
		aboutRequestsNote:
			'Het enige wat dit getal kan laten oplopen, is het openen van een andere tool, die code van ditzelfde domein laadt. Wat jij plakt doet dat nooit.',
		aboutVerifyPlaceholder: 'Typ of plak wat je wilt — er verlaat niets je browser…',
		aboutOfflineReady: 'Offline bruikbaar',
		aboutOfflineCaching: 'Cachen…',
		aboutDevtools:
			'Wil je hardere bewijzen? Open de DevTools van je browser, ga naar het tabblad Netwerk en plak dan. Je zult zien dat er niets gebeurt.',
		aboutViewSource: 'Broncode bekijken',
		aboutEditPage: 'Deze pagina bewerken',
		aboutBuiltBy: 'Gemaakt door',

		aboutH1: 'Een rekenmachine hoort niet naar huis te bellen.',
		aboutLead:
			'De meeste “online tool”-sites zijn een muur van advertenties rondom een tekstvak dat stilletjes alles wat je plakt naar een server stuurt die je nooit te zien krijgt. Ik werd het zat om ergens een JWT te decoderen en een seconde te laat te beseffen dat ik mijn token net aan een vreemde had gegeven. onlinetools.dev is mijn antwoord: dezelfde tools die je dagelijks gebruikt, alleen doet de computer die vóór je staat het werk.',
		aboutS1Head: 'Alles draait op jouw machine',
		aboutS1Body:
			'Elke tool hier is gewone berekening in je browser — geen rondje langs een server, geen upload. Je JSON, je access tokens, die {env} die je eigenlijk eerst wilde opschonen: ze gaan van je klembord naar je scherm en verder niet. Ik heb het zo gebouwd, niet omdat het goedkoper is (dat is het), maar omdat jouw data mij niets aangaat.',
		aboutS2Head: 'Geen advertenties. Geen trackers. Geen account.',
		aboutS2Body:
			'Er is geen analyticsscript dat je toetsaanslagen telt, geen cookiebanner (er zijn geen cookies om mee akkoord te gaan), geen “log in om verder te gaan”, geen upsell die drie stappen verderop wacht. Ik weet echt niet wie je bent of wat je plakt, en dat is precies de bedoeling — een tool doet zijn werk en vergeet je zodra je het tabblad sluit.',
		aboutS3Head: 'Het werkt ook als het netwerk het niet doet',
		aboutS3Body:
			'Laad een pagina één keer en hij is van jou. De hele site is statisch en wordt door een service worker gecachet, dus in het vliegtuig, in de metro of achter een dichtgetimmerde bedrijfsproxy blijven de tools werken. Vliegtuigmodus is een prima plek om JSON te formatteren.',
		aboutS4Head: 'Snel, en niet in de weg',
		aboutS4Body:
			'Geen splashscreen, geen “accepteer onze voorwaarden”, geen dialoogvenster tussen jou en het werk. Druk op {kbd} om naar elke tool te springen, plak iets en de juiste tool komt vanzelf bovendrijven, en elk resultaat is één toetsaanslag van je klembord verwijderd. Toetsenbord eerst, van boven tot onder.',
		aboutVerifyIntro:
			'Privacybeloftes zijn goedkoop — elke site zegt dat ze “je privacy waardeert” terwijl ze je verkoopt. Dus hier is iets om te controleren in plaats van te geloven. Deze teller kijkt live mee met de netwerkactiviteit van je eigen browser:',
		aboutBugLine:
			'Stuurt een tool je gegevens ooit ergens heen waar dat niet hoort, dan is dat een bug, geen verdienmodel — {issue} en ik los het op.',
		aboutBugLink: 'open een issue',

		favorites: 'Favorieten',
		favoriteAdd: 'Aan favorieten toevoegen',
		favoriteRemove: 'Uit favorieten verwijderen',

		homeTitle: 'onlinetools.dev — Developertools die in je browser draaien',
		homeMetaDescription:
			'Snelle, toetsenbordgerichte developertools die volledig in je browser draaien. Formatteer JSON, decodeer JWT’s en Base64, converteer tijdstempels, test regex — geen upload, geen registratie, werkt offline.',
		homeEyebrow: '{n} tools · lokaal eerst',
		homeHeading: 'Developertools die in je browser draaien',
		homeSub: 'Geen upload, geen registratie, geen wachten.',
		pasteToDetect: 'plak om te detecteren',
		worksOffline: 'werkt offline',
		shortcuts: 'sneltoetsen',
		searchPlaceholder: 'Zoek in {n} tools, of plak iets…',
		startHere: 'Begin hier',
		smartPaste: 'Slim plakken',
		smartPasteDesc:
			'Plak wat je wilt, waar je wilt — het contenttype wordt herkend en de juiste tool is één toetsaanslag ver.',
		keyboardFirst: 'Toetsenbord eerst, van begin tot eind',
		keyboardFirstDesc: 'Vinden, uitvoeren, kopiëren en delen zonder de muis aan te raken.',
		kbdAnyTool: 'elke tool',
		kbdCopyResult: 'resultaat kopiëren',
		kbdConfirm: 'bevestigen',
		kbdAllShortcuts: 'alle sneltoetsen',

		pasteHeroHeading: 'Plak iets — krijg direct de juiste tool',
		pasteHeroPlaceholder: 'Plak een JWT, JSON, een Unix-tijdstempel, een kleur, een URL, een afbeelding…',
		tryLabel: 'Probeer',
		plainText: 'Platte tekst',
		noMatchHint: 'Geen exacte match — kies hieronder een teksttool of doorzoek alles',
		runHint: 'uitvoeren',
		newlineHint: 'nieuwe regel',
		clearHint: 'wissen',

		chainNavLabel: 'Pijplijn',
		chainNew: 'Nieuw',
		chainSteps: 'Stappen',
		chainMoreRecipes: 'Meer recepten',
		chainTitle: 'Toolpijplijn — koppel developertools in je browser | onlinetools.dev',
		chainMetaDescription:
			'Koppel developertools tot een pijplijn — decoderen, transformeren en extraheren in één stroom. Elke stap voedt de volgende, alles draait in je browser en het hele recept past in een deelbare link.',
		chainEyebrow: 'werkbank · lokaal eerst',
		chainHeading: 'Pijplijn',
		chainSub: 'Koppel tools tot een recept — elke stap voedt de volgende. Draait volledig in je browser.',
		chainInputPlaceholder: 'Plak of typ de begininvoer…',
		chainAddStep: 'Stap toevoegen',
		chainSearchSteps: 'Stappen zoeken…',
		chainStarters: 'Startpunten',
		chainEmpty: 'Voeg een stap toe — elke stap voedt de volgende.',
		chainHomeCta: 'Koppel tools tot een pijplijn',
		chainHomeCtaSub: 'Voer de ene tool in de andere — decoderen, transformeren en extraheren in één stroom.',

		toolsTitle: 'Alle developertools — onlinetools.dev',
		toolsMetaDescription:
			'Blader door elke tool op onlinetools.dev: JSON, YAML, Base64, JWT, tijdstempels, cron, regex, diff, UUID, hashing, QR-codes en meer — allemaal lokaal in je browser.',
		toolsBlurb: '{n} tools, allemaal berekend in je browser. Er komen er gestaag bij — zie het',

		toolTitle: '{name} — Gratis & privé | onlinetools.dev',
		toolMetaSuffix: 'Draait volledig in je browser — geen upload, geen registratie, werkt offline.',
		runsLocally: 'Draait lokaal',
		runsLocallyTitle:
			'Deze tool rekent alles uit in je browser. Je invoer wordt nooit geüpload.',
		aboutTool: 'Over deze tool',
		faqHeading: 'Veelgestelde vragen',
		relatedTools: 'Gerelateerde tools',
		breadcrumbTools: 'tools',

		sample: 'Voorbeeld',
		line: 'regel',
		output: 'Uitvoer',
		copy: 'Kopiëren',
		copied: 'Gekopieerd',
		download: 'Downloaden',
		share: 'Delen',
		linkCopied: 'Link gekopieerd',
		continueWith: 'Ga verder met',
		suggested: 'aanbevolen',
		shareTooLarge:
			'Invoer te groot voor een URL — deellinks zijn begrensd zodat ze deelbaar blijven. De inhoud verlaat deze machine nooit.',
		emptyHint: 'De uitvoer verschijnt hier terwijl je typt',

		palettePlaceholder: 'Zoek tools, of plak inhoud om ermee te werken…',
		noMatch: 'Geen passende tool',
		navigate: 'navigeren',
		open: 'openen',
		close: 'sluiten',

		detected: 'Herkend',
		chars: 'tekens',

		shortcutsTitle: 'Sneltoetsen',
		scPalette: 'Commandopalet openen',
		scCopy: 'Resultaat kopiëren',
		scEsc: 'Paneel sluiten / suggestie negeren',
		scHelp: 'Dit sneltoetsoverzicht',
		scPaste: 'Slim plakken — inhoud herkennen en tools voorstellen',
		scNav: 'Navigeren en bevestigen in panelen'
	},
	tl: {
		direction: 'Richting',
		encode: 'Coderen',
		decode: 'Decoderen',
		mode: 'Modus',
		count: 'Aantal',
		lengthLbl: 'Lengte',
		uppercase: 'Hoofdletters',
		lowercase: 'Kleine letters',
		regenerate: 'Opnieuw genereren',

		b64InputEnc: 'Tekst om te coderen',
		b64InputDec: 'Base64 om te decoderen',
		b64PhEnc: 'Elke tekst, unicode inbegrepen',
		b64UrlSafe: 'URL-veilig (zonder padding)',

		bcHash: 'Hashen',
		bcVerify: 'Verifiëren',
		bcHashT: 'Een wachtwoord hashen',
		bcVerifyT: 'Een wachtwoord tegen een hash controleren',
		bcPassword: 'Wachtwoord',
		bcCost: 'Kostenfactor',
		bcHashLbl: 'Bcrypt-hash',
		bcPh: 'blijft in je browser',
		bcVersion: 'Versie',
		bcCostShort: 'Kosten',
		bcSalt: 'Salt',
		bcNote:
			'Het hashen gebeurt in je browser — er wordt niets verzonden. Browser-JS is trager dan native bcrypt, dus behandel de tijden als een bovengrens.',

		caseInput: 'Tekst of identifier (één per regel)',
		caseEmpty: 'Alle negen stijlen verschijnen hier terwijl je typt',

		colorInput: 'Kleur',
		colorFormats: 'Formaten',
		colorRgb: 'RGB-kanalen',
		colorContrast: 'Tekstcontrast (WCAG)',

		cronInput: 'Cron-expressie',
		cronEvalIn: 'geëvalueerd in',
		cronNext: 'Volgende 5 uitvoeringen',
		cronNone: 'Geen uitvoeringen binnen de komende 5 jaar',

		diffOriginal: 'Origineel',
		diffChanged: 'Gewijzigd',
		diffLbl: 'Verschil',
		diffUnchanged: 'ongewijzigd',
		diffEmpty: 'Het regel-voor-regelverschil verschijnt hier',

		hashInput: 'Tekst om te hashen',
		hashPh: 'Elke tekst — hashes worden bijgewerkt terwijl je typt',
		hashHmac: 'Geheime HMAC-sleutel',
		hashOptional: '(optioneel)',
		hashHmacPh: 'Laat leeg voor gewone hashes',
		hashDigests: 'Digests',
		hashEmpty: 'Digests worden live bijgewerkt terwijl je typt',
		hashNote:
			'MD5 en SHA-1 staan er alleen voor oude checksums — gebruik SHA-256 of sterker voor alles wat met beveiliging te maken heeft.',

		heAll: 'Alles buiten ASCII coderen',
		heNumeric: 'Alleen numeriek',
		heInputEnc: 'Tekst om te escapen',
		heInputDec: 'HTML met entiteiten',

		imgDrop: 'Sleep een afbeelding hierheen, klik om te bladeren, of plak vanaf het klembord',
		imgLocal: 'Blijft in je browser — er wordt niets geüpload',
		imgReplace: 'Sleep, klik of plak om te vervangen',
		imgSource: 'Bronafbeelding',
		imgOriginal: 'Origineel',
		imgDimensions: 'Afmetingen',
		imgDownload: '{fmt} downloaden',
		imgErrNotImage: 'Geen herkend afbeeldingsformaat (PNG, JPEG, WebP, GIF, SVG, BMP, ICO, AVIF)',
		imgErrDecode: 'De browser kon deze afbeelding niet decoderen',
		imgErrEncode: 'De browser kon deze afbeelding niet coderen',
		imgErrFormat: 'Deze browser kan {fmt} niet coderen — probeer PNG of JPEG',

		i2bToB64: 'Afbeelding → Base64',
		i2bFromB64: 'Base64 → afbeelding',
		i2bInput: 'Data-URL of ruwe Base64',
		i2bDataUrl: 'Data-URL',
		i2bRawB64: 'Ruwe Base64',
		i2bCss: 'CSS-achtergrond',
		i2bHtml: 'HTML <img>',
		i2bEncodedSize: 'Base64-grootte',
		i2bOverhead: '+{pct}% t.o.v. binair',
		i2bNote:
			'Inline zetten scheelt een request maar blaast het document op en ondermijnt caching — het beste voor iconen en andere assets onder ~10 kB.',

		icTarget: 'Converteren naar',
		icQuality: 'Kwaliteit',
		icConverted: 'Geconverteerd',
		icSmaller: 'kleiner dan het origineel',
		icLarger: 'groter dan het origineel',
		icBgNote: 'JPEG kent geen transparantie — transparante vlakken worden op wit gelegd.',
		icNote:
			'De conversie gebruikt de canvas-encoder van je browser, dus exacte bestandsgroottes verschillen licht per browser.',

		fgAppleBg: 'Achtergrond Apple-icoon',
		fgFiles: 'Gegenereerde bestanden',
		fgHtml: 'HTML <link>-tags',
		fgSmall: 'De bron is {px}px — iconen groter dan dat worden opgeschaald en kunnen wazig ogen',
		fgNote:
			'De ICO bevat 16, 32 en 48 px. Apple touch-iconen kunnen niet transparant zijn, dus die worden op de gekozen achtergrond gelegd; PWA-iconen behouden hun alpha. Niet-vierkante bronnen worden vanuit het midden bijgesneden.',

		irBy: 'Schalen op',
		irWidth: 'Breedte',
		irHeight: 'Hoogte',
		irPercent: 'Percentage',
		irFormat: 'Formaat',
		irKeep: 'Behouden',
		irResized: 'Geschaald',
		irScale: 'Schaal',
		irNote:
			'Verkleinen gebruikt hoogwaardige smoothing. Vergroten kan geen detail verzinnen — verwacht onscherpte voorbij 2×.',

		jcInput: 'JSON-array van objecten',
		jcDelimiter: 'Scheidingsteken',
		jcComma: 'Komma',
		jcSemicolon: 'Puntkomma (EU-Excel)',
		jcTab: 'Tab',

		jfInput: 'JSON-invoer',
		jfIndent: 'Inspringen',
		jfIndentation: 'Inspringing',
		jfSp2: '2 spaties',
		jfSp4: '4 spaties',
		jfTabs: 'Tabs',
		jfMin: 'Geminificeerd — geen witruimte',
		jfSortKeys: 'Sleutels sorteren',
		jfText: 'Tekst',
		jfTree: 'Boom',
		jfTreeHint: 'Ga over een knoop om het JSONPath te kopiëren — probeer het in de',
		jfTreeLink: 'JSONPath-tester',

		jpExpr: 'JSONPath-expressie',
		jpDoc: 'JSON-document',
		jpMatches: 'Overeenkomsten',
		jpResults: 'Resultaatwaarden',

		jtInput: 'JSON-voorbeeld',
		jtRoot: 'Naam van het hoofdtype',
		jtNote:
			'Afgeleid uit dit ene voorbeeld — markeer velden als optioneel en verbreed nullables waar je data varieert.',

		jyFrom: 'Van',
		jySource: 'Bronformaat',
		jyAutoT: 'Het bronformaat uit de inhoud afleiden',
		jyTarget: 'Doelformaat',
		jyInput: 'Invoer',
		jyUnknown: 'onbekend formaat',

		jwtAnatomy: 'Anatomie van het token',
		jwtHeader: 'header',
		jwtPayload: 'payload',
		jwtSignature: 'handtekening (niet geverifieerd)',
		jwtIssued: 'Uitgegeven',
		jwtExpires: 'Verloopt',
		jwtNotBefore: 'Niet vóór',
		jwtLifetime: 'Levensduur',
		jwtNote:
			'Decoderen leest het token alleen — het verifieert de handtekening niet. Verifieer handtekeningen server-side met de sleutels van de uitgever.',

		loremUnit: 'Eenheid',
		loremWords: 'Woorden',
		loremSentences: 'Zinnen',
		loremParagraphs: 'Alinea’s',
		loremClassic: 'Beginnen met “Lorem ipsum…”',

		pwWeak: 'Zwak',
		pwFair: 'Redelijk',
		pwStrong: 'Sterk',
		pwExcellent: 'Uitstekend',
		pwNoLookalikes: 'Geen gelijkenden (0O1lI)',
		pwEntropy: 'Entropie',
		pwBits: 'bits',
		pwNote: '≥ 80 bits weerstaat offline kraken van snelle hashes; ≥ 100 bits is praktisch onraadbaar.',
		pwOut: 'Wachtwoorden',
		pwCrypto: 'Gegenereerd met crypto.getRandomValues, uitsluitend in je browser. Er wordt niets opgeslagen of verzonden.',

		qrContent: 'Inhoud',
		qrEc: 'Foutcorrectie',
		qrEcT: 'Overleeft {pct} beschadiging',
		qrSvg: 'SVG (vector, druk)',
		qrPng: 'PNG (chat, slides)',
		qrNote: 'De inhoud wordt direct gecodeerd — geen doorstuurdienst, niets verloopt, geen scanregistratie.',

		qrdResult: 'Gedecodeerde inhoud',
		qrdNone: 'Geen QR-code gevonden — probeer een scherpere afbeelding, snijd dichter op de code bij en houd de blanco marge eromheen intact',
		qrdOpen: 'Link openen',
		qrdWifiSsid: 'Netwerk (SSID)',
		qrdWifiPass: 'Wachtwoord',
		qrdWifiSec: 'Beveiliging',
		qrdWifiHidden: 'Verborgen netwerk',
		qrdNote: 'Het scannen gebeurt volledig in je browser — noch de afbeelding, noch het camerabeeld, noch de inhoud van de code wordt ooit geüpload.',
		qrdCamera: 'Scannen met camera',
		qrdCameraStop: 'Camera stoppen',
		qrdCameraErr: 'Camera niet beschikbaar — controleer de browsertoestemming, of sleep in plaats daarvan een afbeelding hierheen',

		rxPattern: 'Patroon',
		rxTest: 'Testtekst',
		rxTestPh: 'Plak tekst om het patroon op te testen',
		rxHighlighted: 'Gemarkeerd',
		rxMatches: 'Overeenkomsten',
		rxMatched: 'Overeenkomende tekst',

		slugInput: 'Titel (één per regel)',
		slugSep: 'Scheidingsteken',
		slugHyphen: 'Koppelteken',
		slugUnderscore: 'Liggend streepje',
		slugMax: 'Maximale lengte',
		slugOut: 'Slug',

		slInput: 'Regels',
		slPh: 'één per regel',
		slSort: 'Sorteren',
		slKeep: 'Volgorde behouden',
		slAsc: 'Oplopend',
		slDesc: 'Aflopend',
		slNatural: 'Natuurlijk — getallen op volgorde',
		slLength: 'Op regellengte',
		slShuffle: 'Schudden',
		slDedupe: 'Ontdubbelen',
		slIgnoreCase: 'Hoofdletters negeren',
		slTrim: 'Bijsnijden',
		slDropEmpty: 'Lege regels weglaten',

		tsInput: 'Tijdstempel of datum',
		tsNow: 'Huidige unix-tijd:',
		tsNowT: 'De huidige tijd als invoer gebruiken',
		tsRelative: 'Relatief',
		tsUnixS: 'Unix-seconden',
		tsUnixMs: 'Unix-milliseconden',
		tsZones: 'Over tijdzones heen',
		tsNote: 'De markering toont het lokale uur van elke zone op een 24-uursbalk — de gedimde uiteinden zijn 21:00–07:00.',

		uaInput: 'User-Agent-string',
		uaBrowser: 'Browser',
		uaEngine: 'Engine',
		uaOs: 'Besturingssysteem',
		uaDevice: 'Apparaat',
		uaNote:
			'De knop “Voorbeeld” voegt de User-Agent van je eigen browser in. Gebruik feature detection, geen UA-sniffing, voor beslissingen tijdens runtime.',

		uniInput: 'Tekst om te inspecteren',
		uniPh: 'Plak wat je wilt — onzichtbare tekens worden hier zichtbaar',
		uniGraphemes: 'Grafemen',
		uniGraphemesHint: 'wat gebruikers zien',
		uniCodePoints: 'Codepunten',
		uniUtf16: 'UTF-16-eenheden',
		uniUtf16Hint: 'JS .length',
		uniUtf8: 'UTF-8-bytes',
		uniLimit: 'De eerste 300 tekens worden getoond.',

		upInput: 'URL',
		upProtocol: 'Protocol',
		upHost: 'Host',
		upHostname: 'Hostnaam',
		upPort: 'Poort',
		upPath: 'Pad',
		upFragment: 'Fragment',
		upOrigin: 'Origin',
		upQuery: 'Queryparameters',
		upDefault: '(standaard)',
		upNone: '(geen)',
		upEmpty: 'De URL-onderdelen verschijnen hier',

		urlComponent: 'Componentmodus (encodeURIComponent)',
		urlInputDec: 'Gecodeerde tekst om te decoderen',

		uuidOut: 'Gegenereerde ID’s',
		uuidFormat: 'ID-formaat',
		uuidHintV4: 'willekeurig',
		uuidHintV7: 'tijdgeordend',
		uuidHintUlid: 'tijdgeordend, base32',
		uuidHintNano: 'kort, URL-veilig',
		uuidNote:
			'Gegenereerd met crypto.getRandomValues — cryptografisch veilig, aangemaakt in je browser, nergens gelogd.',

		fmtFormat: 'Formatteren',
		fmtMinify: 'Minificeren',

		sqlInput: 'SQL-statement(s)',
		sqlDialect: 'Dialect',
		sqlKeywords: 'Sleutelwoorden',
		sqlKeep: 'Behouden',

		xmlInput: 'XML-document',

		xjInputXml: 'XML-document',
		xjInputJson: 'JSON-object',
		xjNote:
			'Attributen worden "@_naam"-sleutels en tekst naast attributen wordt "#text", zodat de conversie heen en terug klopt. De volgorde van gemengde broers en zussen blijft niet behouden — XML staat herhaling toe, JSON-objecten niet.',

		cjInput: 'CSV-/TSV-gegevens',
		cjAuto: 'Automatisch',
		cjPipe: 'Pipe',
		cjHeader: 'Eerste rij is de kop',
		cjTyped: 'Getypeerde waarden',

		mdPreview: 'Voorbeeld',
		mdNote:
			'Het voorbeeld wordt vóór het renderen opgeschoond, dus scripts en event handlers in geplakte of gedeelde inhoud kunnen niet draaien. Het HTML-uitvoervak bevat de ruwe conversie.',

		htmlInput: 'HTML-bron',
		cssInput: 'CSS-bron',
		jsInput: 'JavaScript-bron',

		escEscape: 'Escapen',
		escUnescape: 'Unescapen',
		escDialect: 'Dialect',
		escInputEsc: 'Tekst om te escapen',
		escInputUnesc: 'Geëscapete tekst',

		nbInput: 'Getal',
		nbFrom: 'Van',
		nbAutoT: 'Afleiden uit het 0x-/0o-/0b-voorvoegsel, anders decimaal',
		nbGroup: 'Cijfers groeperen',
		nbBase: 'Grondtal',
		nbBin: 'Binair',
		nbOct: 'Octaal',
		nbDec: 'Decimaal',
		nbHex: 'Hex',
		nbBits: 'bits',

		hbFormat: 'Bytes als',
		hbSep: 'Scheidingsteken',
		hbSpace: 'Spatie',
		hbNone: 'Geen',
		hbColon: 'Dubbele punt',
		hbInputEnc: 'Tekst om te coderen',
		hbInputDec: 'Bytes om te decoderen',

		schInfer: 'Schema afleiden',
		schValidate: 'Valideren',
		schInferT: 'Een schema genereren uit voorbeeld-JSON',
		schValidateT: 'JSON tegen een schema controleren',
		schData: 'JSON-gegevens',
		schSchema: 'JSON Schema',
		schViolations: 'overtredingen',
		schValid: 'Geldig — de gegevens voldoen aan het schema',
		schResult: 'Validatieresultaat',

		exTags: '{n} metadatavelden',
		exNone: 'Geen metadata gevonden — dit bestand is al schoon',
		exStrip: 'Opgeschoonde kopie downloaden',
		exGps: 'GPS-locatie ingesloten',
		exMap: 'Op de kaart bekijken',
		exNote:
			'Lezen en verwijderen gebeuren volledig in je browser — de foto wordt nooit geüpload. Het opschonen verwijdert metadatasegmenten byte voor byte zonder te hercoderen, dus pixels en kwaliteit blijven onaangeroerd.',

		crBuilder: 'Bouwer',
		crMinute: 'Minuut',
		crHour: 'Uur',
		crDom: 'Dag van de maand',
		crMonth: 'Maand',
		crDow: 'Dag van de week',
		crEvery: 'Elke',
		crStep: 'Elke N',
		crAt: 'Specifiek',
		crUse: 'Expressie gebruiken',

		jwtDecode: 'Decoderen',
		jwtSign: 'Ondertekenen',
		jwtVerify: 'Verifiëren',
		jwtAlg: 'Algoritme',
		jwtPayloadLbl: 'Payload (JSON-object)',
		jwtSecret: 'Geheim',
		jwtPrivKey: 'Privésleutel (PKCS#8 PEM)',
		jwtPubKey: 'Geheim (HS) of publieke sleutel in PEM (RS/ES)',
		jwtSignNote:
			'Het ondertekenen draait op WebCrypto in je browser — de sleutel verlaat deze pagina nooit. Gebruik voor HS-algoritmen een lang willekeurig geheim; korte zijn te brute-forcen, waar je ook ondertekent.',
		jwtVerifyNote:
			'De verificatie controleert de handtekening lokaal tegen de sleutel die je opgeeft. Ze haalt geen JWKS-endpoints op en valideert geen claims als aud/iss — doe dat server-side.',

		tsDiff: 'Verschil tussen twee datums',

		wcWords: 'Woorden',
		wcChars: 'Tekens',
		wcCharsHint: '{n} zonder spaties',
		wcReading: 'Leestijd',
		wcReadingHint: 'bij 220 wpm',
		wcLines: 'Regels',
		wcSentences: 'Zinnen',
		wcParagraphs: 'Alinea’s',
		wcAvg: 'Gem. woordlengte'
	},
	categories: {
		encoding: 'Codering',
		json: 'JSON & data',
		text: 'Tekst',
		time: 'Datum & tijd',
		generators: 'Generatoren',
		crypto: 'Hashing & crypto',
		web: 'Web',
		image: 'Afbeelding',
		code: 'Code & markup',
		privacy: 'Privacy'
	},
	tools: {
		'json-formatter': {
			name: 'JSON-formatter & validator',
			description: 'Formatteer, valideer en minificeer JSON met precieze foutposities'
		},
		'base64-decode': {
			name: 'Base64 coderen / decoderen',
			description: 'Codeer tekst naar Base64 of decodeer Base64 naar tekst, URL-veilig inbegrepen'
		},
		'image-to-base64': {
			name: 'Afbeelding ↔ Base64-converter',
			description: 'Zet afbeeldingen om in Base64-data-URL’s en terug — met CSS- en HTML-snippets'
		},
		'image-converter': {
			name: 'Afbeeldingsformaatconverter',
			description: 'Converteer afbeeldingen tussen PNG, JPEG en WebP met een kwaliteitsregelaar'
		},
		'image-resizer': {
			name: 'Afbeeldingsformaat aanpassen',
			description: 'Schaal afbeeldingen op breedte, hoogte of percentage — scherp en volledig offline'
		},
		'favicon-generator': {
			name: 'Favicon-generator',
			description: 'Maak van elke afbeelding een favicon.ico plus de volledige PNG- en manifest-iconenset'
		},
		'timestamp-converter': {
			name: 'Unix-tijdstempelconverter',
			description: 'Zet unix-tijdstempels om naar leesbare datums en terug, met relatieve tijd'
		},
		'jwt-decoder': {
			name: 'JWT-decoder',
			description: 'Decodeer JWT-header en -payload, controleer de vervaldatum — volledig offline'
		},
		'regex-tester': {
			name: 'Regex-tester',
			description: 'Test reguliere expressies met live markering van matches en groepen'
		},
		'diff-checker': {
			name: 'Tekstvergelijker',
			description: 'Vergelijk twee teksten regel voor regel en zie toevoegingen en verwijderingen'
		},
		'url-encode-decode': {
			name: 'URL coderen / decoderen',
			description: 'Percent-codeer of decodeer URL-onderdelen en querystrings'
		},
		'url-parser': {
			name: 'URL-parser',
			description: 'Splits een URL in protocol, host, pad en queryparameters'
		},
		'uuid-generator': {
			name: 'UUID-generator',
			description: 'Genereer UUID v4/v7, ULID en Nano ID — los of in bulk'
		},
		'hash-generator': {
			name: 'Hash-generator',
			description: 'MD5, SHA-1, SHA-256, SHA-512 en HMAC — berekend in je browser'
		},
		'color-converter': {
			name: 'Kleurconverter',
			description: 'Converteer kleuren tussen HEX, RGB, HSL en OKLCH met live voorbeeld'
		},
		'case-converter': {
			name: 'Schrijfwijzeconverter',
			description: 'Wissel tussen camelCase, snake_case, kebab-case, PascalCase en meer'
		},
		'word-counter': {
			name: 'Woordenteller',
			description: 'Tel woorden, tekens, zinnen, bytes en leestijd terwijl je typt'
		},
		'lorem-ipsum-generator': {
			name: 'Lorem ipsum-generator',
			description: 'Genereer opvulwoorden, -zinnen of -alinea’s voor mockups'
		},
		'slug-generator': {
			name: 'Slug-generator',
			description: 'Zet titels om in nette URL-slugs met opties voor scheidingsteken en lengte'
		},
		'sort-lines': {
			name: 'Regels sorteren & ontdubbelen',
			description: 'Sorteer regels alfabetisch of natuurlijk, verwijder duplicaten en lege regels'
		},
		'html-entities': {
			name: 'HTML-entiteiten coderen / decoderen',
			description: 'Escape tekst voor HTML of zet &amp;-entiteiten terug naar tekens'
		},
		'unicode-inspector': {
			name: 'Unicode-tekeninspecteur',
			description: 'Bekijk codepunten, UTF-8-/UTF-16-bytes en escapes voor elk teken'
		},
		'cron-parser': {
			name: 'Cron-expressieparser',
			description: 'Leg elk cron-schema in gewone taal uit, met de eerstvolgende uitvoertijden'
		},
		'password-generator': {
			name: 'Wachtwoordgenerator',
			description: 'Willekeurige wachtwoorden met tekensetopties en een eerlijke entropiemeter'
		},
		'qr-code-generator': {
			name: 'QR-codegenerator',
			description: 'Genereer scherpe QR-codes als SVG of PNG — geen watermerk, geen upload'
		},
		'qr-code-decoder': {
			name: 'QR-codedecoder',
			description: 'Lees QR-codes uit afbeeldingen of live camera — URL’s, wifi en tekst, offline'
		},
		'json-to-yaml': {
			name: 'JSON ↔ YAML ↔ TOML-converter',
			description: 'Converteer tussen JSON, YAML en TOML met automatische formaatherkenning'
		},
		'json-to-csv': {
			name: 'JSON ↔ CSV-converter',
			description: 'Plat JSON tot CSV, of parseer CSV terug naar getypeerde JSON-objecten'
		},
		'json-to-typescript': {
			name: 'JSON → TypeScript-types',
			description: 'Leid direct TypeScript-interfaces af uit een JSON-voorbeeld'
		},
		'jsonpath-tester': {
			name: 'JSONPath-tester',
			description: 'Bevraag JSON met JSONPath-expressies en zie elke match met zijn pad'
		},
		'bcrypt-generator': {
			name: 'Bcrypt hashen & verifiëren',
			description: 'Hash wachtwoorden met bcrypt en controleer hashes tegen platte tekst'
		},
		'user-agent-parser': {
			name: 'User-Agent-parser',
			description: 'Herken browser, engine, besturingssysteem en apparaat uit een User-Agent-string'
		},
		'sql-formatter': {
			name: 'SQL-formatter',
			description: 'Formatteer SQL met dialectbewuste sleutelwoorden, of minificeer het tot één regel'
		},
		'xml-formatter': {
			name: 'XML-formatter & validator',
			description: 'Formatteer, minificeer en valideer XML met exacte foutposities'
		},
		'xml-to-json': {
			name: 'XML ↔ JSON-converter',
			description: 'Converteer XML-documenten naar JSON en terug, attributen inbegrepen'
		},
		'markdown-to-html': {
			name: 'Markdown ↔ HTML-converter',
			description: 'Render Markdown naar HTML met live voorbeeld, of zet HTML terug om in Markdown'
		},
		'html-formatter': {
			name: 'HTML-formatter & minifier',
			description: 'Maak rommelige HTML leesbaar of minificeer het voor productie'
		},
		'css-formatter': {
			name: 'CSS-formatter & minifier',
			description: 'Maak CSS leesbaar of minificeer het vóór uitlevering'
		},
		'js-formatter': {
			name: 'JavaScript-formatter & minifier',
			description: 'Maak JavaScript leesbaar of minificeer het met echte compressie en mangling'
		},
		'string-escape': {
			name: 'String escapen / unescapen',
			description: 'Escape of unescape strings voor JSON, JavaScript, Java, XML, SQL en CSV'
		},
		'number-base-converter': {
			name: 'Talstelselconverter',
			description: 'Converteer getallen tussen binair, octaal, decimaal, hex en elk grondtal tot 36'
		},
		'text-to-hex': {
			name: 'Tekst ↔ hex-/binairconverter',
			description: 'Zet tekst om in hex-, binaire of decimale bytes en decodeer byte-dumps terug'
		},
		'json-schema-validator': {
			name: 'JSON Schema-validator & -generator',
			description: 'Valideer JSON tegen een schema, of leid een schema af uit voorbeelddata'
		},
		'exif-viewer': {
			name: 'EXIF-viewer & -verwijderaar',
			description: 'Zie welke metadata je foto’s meedragen — en verwijder ze zonder te hercoderen'
		}
	}
};

export default nl;
