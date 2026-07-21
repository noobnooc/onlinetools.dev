import type { Messages } from '$lib/i18n';

const de: Messages = {
	code: 'de',
	name: 'Deutsch',
	ui: {
		search: 'Suchen',
		overview: 'Übersicht',
		toggleTheme: 'Farbschema wechseln',
		themeSystem: 'System folgen',
		themeDark: 'Dunkel',
		themeLight: 'Hell',
		themeTitle: 'Design: {mode} — klicken zum Wechseln',
		footerPrivacy: 'Läuft in deinem Browser — nichts, was du einfügst, wird hochgeladen',
		allTools: 'Alle Tools',
		changelog: 'Änderungsprotokoll',
		releaseDate: 'Versionsdatum',
		language: 'Sprache',
		openNav: 'Navigation öffnen',
		searchTools: 'Tools suchen',
		homeTitle: 'onlinetools.dev — Entwickler-Tools, die im Browser laufen',
		homeMetaDescription:
			'Schnelle, tastaturorientierte Entwickler-Tools, die vollständig im Browser laufen. JSON formatieren, JWT und Base64 dekodieren, Timestamps umrechnen, Regex testen — kein Upload, keine Anmeldung, funktioniert offline.',
		homeEyebrow: '{n} Tools · Local-first',
		homeHeading: 'Entwickler-Tools, die im Browser laufen',
		homeSub: 'Kein Upload, keine Anmeldung, kein Warten.',
		pasteToDetect: 'Einfügen zum Erkennen',
		worksOffline: 'funktioniert offline',
		shortcuts: 'Tastenkürzel',
		searchPlaceholder: '{n} Tools durchsuchen oder etwas einfügen…',
		startHere: 'Hier starten',
		smartPaste: 'Smart Paste',
		smartPasteDesc:
			'Füge überall alles ein — der Inhaltstyp wird erkannt und das passende Tool ist einen Tastendruck entfernt.',
		keyboardFirst: 'Tastatur zuerst, von Anfang bis Ende',
		keyboardFirstDesc: 'Finden, ausführen, kopieren und teilen — ohne die Maus zu berühren.',
		kbdAnyTool: 'jedes Tool',
		kbdCopyResult: 'Ergebnis kopieren',
		kbdConfirm: 'bestätigen',
		kbdAllShortcuts: 'alle Kürzel',
		toolsTitle: 'Alle Entwickler-Tools — onlinetools.dev',
		toolsMetaDescription:
			'Alle Tools auf onlinetools.dev: JSON, YAML, Base64, JWT, Timestamps, Cron, Regex, Diff, UUID, Hashing, QR-Codes und mehr — alles läuft lokal in deinem Browser.',
		toolsBlurb: '{n} Tools, jedes davon rechnet in deinem Browser. Es kommen laufend neue dazu — siehe das',
		toolTitle: '{name} — Kostenlos & privat | onlinetools.dev',
		toolMetaSuffix: 'Läuft vollständig im Browser — kein Upload, keine Anmeldung, funktioniert offline.',
		runsLocally: 'Läuft lokal',
		runsLocallyTitle:
			'Dieses Tool berechnet alles in deinem Browser. Deine Eingaben werden nie hochgeladen.',
		aboutTool: 'Über dieses Tool',
		faqHeading: 'Häufige Fragen',
		relatedTools: 'Verwandte Tools',
		breadcrumbTools: 'Tools',
		sample: 'Beispiel',
		line: 'Zeile',
		output: 'Ergebnis',
		copy: 'Kopieren',
		copied: 'Kopiert',
		download: 'Herunterladen',
		share: 'Teilen',
		linkCopied: 'Link kopiert',
		continueWith: 'Weiter mit',
		suggested: 'empfohlen',
		shareTooLarge:
			'Inhalt zu groß für eine URL — Teil-Links sind begrenzt, damit sie portabel bleiben. Der Inhalt verlässt dieses Gerät nie.',
		emptyHint: 'Das Ergebnis erscheint hier während der Eingabe',
		palettePlaceholder: 'Tools suchen oder Inhalt einfügen und direkt verarbeiten…',
		noMatch: 'Kein passendes Tool',
		navigate: 'navigieren',
		open: 'öffnen',
		close: 'schließen',
		detected: 'Erkannt',
		chars: 'Zeichen',
		shortcutsTitle: 'Tastenkürzel',
		scPalette: 'Befehlspalette öffnen',
		scCopy: 'Ergebnis kopieren',
		scEsc: 'Panel schließen / Vorschlag verwerfen',
		scHelp: 'Diese Kürzel-Übersicht',
		scPaste: 'Smart Paste — Inhalt erkennen und Tools vorschlagen',
		scNav: 'In Panels navigieren und bestätigen'
	},
	tl: {
		direction: 'Richtung',
		encode: 'Kodieren',
		decode: 'Dekodieren',
		mode: 'Modus',
		count: 'Anzahl',
		lengthLbl: 'Länge',
		uppercase: 'Großbuchstaben',
		lowercase: 'Kleinbuchstaben',
		regenerate: 'Neu erzeugen',
		b64InputEnc: 'Zu kodierender Text',
		b64InputDec: 'Zu dekodierendes Base64',
		b64PhEnc: 'Beliebiger Text, Unicode inklusive',
		b64UrlSafe: 'URL-sicher (ohne Padding)',
		bcHash: 'Hashen',
		bcVerify: 'Prüfen',
		bcHashT: 'Ein Passwort hashen',
		bcVerifyT: 'Ein Passwort gegen einen Hash prüfen',
		bcPassword: 'Passwort',
		bcCost: 'Kostenfaktor',
		bcHashLbl: 'Bcrypt-Hash',
		bcPh: 'bleibt in deinem Browser',
		bcVersion: 'Version',
		bcCostShort: 'Kosten',
		bcSalt: 'Salt',
		bcNote: 'Das Hashing läuft in deinem Browser — nichts wird übertragen. Browser-JS ist langsamer als natives bcrypt; betrachte die Zeiten als Obergrenze.',
		caseInput: 'Text oder Bezeichner (einer pro Zeile)',
		caseEmpty: 'Alle neun Stile erscheinen hier beim Tippen',
		colorInput: 'Farbe',
		colorFormats: 'Formate',
		colorRgb: 'RGB-Kanäle',
		colorContrast: 'Textkontrast (WCAG)',
		cronInput: 'Cron-Ausdruck',
		cronEvalIn: 'ausgewertet in',
		cronNext: 'Nächste 5 Ausführungen',
		cronNone: 'Keine Ausführungen in den nächsten 5 Jahren',
		diffOriginal: 'Original',
		diffChanged: 'Geändert',
		diffLbl: 'Diff',
		diffUnchanged: 'unverändert',
		diffEmpty: 'Der zeilenweise Diff erscheint hier',
		hashInput: 'Zu hashender Text',
		hashPh: 'Beliebiger Text — Hashes aktualisieren sich live',
		hashHmac: 'HMAC-Geheimschlüssel',
		hashOptional: '(optional)',
		hashHmacPh: 'Leer lassen für einfache Hashes',
		hashDigests: 'Prüfsummen',
		hashEmpty: 'Prüfsummen aktualisieren sich beim Tippen',
		hashNote: 'MD5 und SHA-1 dienen nur alten Checksummen — nutze SHA-256 oder stärker für alles Sicherheitsrelevante.',
		heAll: 'Alles Nicht-ASCII kodieren',
		heNumeric: 'Nur numerische Entities',
		heInputEnc: 'Zu escapender Text',
		heInputDec: 'HTML mit Entities',
		imgDrop: 'Bild hierher ziehen, klicken zum Auswählen oder aus der Zwischenablage einfügen',
		imgLocal: 'Bleibt in deinem Browser — nichts wird hochgeladen',
		imgReplace: 'Ziehen, klicken oder einfügen zum Ersetzen',
		imgSource: 'Quellbild',
		imgOriginal: 'Original',
		imgDimensions: 'Abmessungen',
		imgDownload: '{fmt} herunterladen',
		imgErrNotImage: 'Kein erkanntes Bildformat (PNG, JPEG, WebP, GIF, SVG, BMP, ICO, AVIF)',
		imgErrDecode: 'Der Browser konnte dieses Bild nicht dekodieren',
		imgErrEncode: 'Der Browser konnte dieses Bild nicht kodieren',
		imgErrFormat: 'Dieser Browser kann kein {fmt} kodieren — versuche PNG oder JPEG',
		i2bToB64: 'Bild → Base64',
		i2bFromB64: 'Base64 → Bild',
		i2bInput: 'Data-URL oder rohes Base64',
		i2bDataUrl: 'Data-URL',
		i2bRawB64: 'Rohes Base64',
		i2bCss: 'CSS-Hintergrund',
		i2bHtml: 'HTML <img>',
		i2bEncodedSize: 'Base64-Größe',
		i2bOverhead: '+{pct}% ggü. Binär',
		i2bNote: 'Inlining spart einen Request, bläht aber das Dokument auf und umgeht den Cache — ideal für Icons und Assets unter ~10 KB.',
		icTarget: 'Umwandeln in',
		icQuality: 'Qualität',
		icConverted: 'Konvertiert',
		icSmaller: 'kleiner als das Original',
		icLarger: 'größer als das Original',
		icBgNote: 'JPEG kennt keine Transparenz — transparente Bereiche werden auf Weiß reduziert.',
		icNote: 'Die Konvertierung nutzt den Canvas-Encoder deines Browsers; exakte Dateigrößen variieren daher leicht.',
		fgAppleBg: 'Apple-Icon-Hintergrund',
		fgFiles: 'Erzeugte Dateien',
		fgHtml: 'HTML-<link>-Tags',
		fgSmall: 'Quelle ist {px}px — größere Icons werden hochskaliert und können weich wirken',
		fgNote: 'Das ICO packt 16, 32 und 48 px. Apple-Touch-Icons können nicht transparent sein und werden auf die gewählte Hintergrundfarbe reduziert; PWA-Icons behalten ihren Alphakanal. Nicht-quadratische Quellen werden mittig zugeschnitten.',
		irBy: 'Skalieren nach',
		irWidth: 'Breite',
		irHeight: 'Höhe',
		irPercent: 'Prozent',
		irFormat: 'Format',
		irKeep: 'Beibehalten',
		irResized: 'Skaliert',
		irScale: 'Maßstab',
		irNote: 'Verkleinern nutzt hochwertige Glättung. Vergrößern erfindet keine Details — ab 2× wird es sichtbar weich.',
		jcInput: 'JSON-Array von Objekten',
		jcDelimiter: 'Trennzeichen',
		jcComma: 'Komma',
		jcSemicolon: 'Semikolon (EU-Excel)',
		jcTab: 'Tabulator',
		jfInput: 'JSON-Eingabe',
		jfIndent: 'Einzug',
		jfIndentation: 'Einzug',
		jfSp2: '2 Leerzeichen',
		jfSp4: '4 Leerzeichen',
		jfTabs: 'Tabs',
		jfMin: 'Minifiziert — ohne Leerraum',
		jfSortKeys: 'Schlüssel sortieren',
		jfText: 'Text',
		jfTree: 'Baum',
		jfTreeHint: 'Fahre über einen Knoten, um seinen JSONPath zu kopieren — probier ihn im',
		jfTreeLink: 'JSONPath-Tester',
		jpExpr: 'JSONPath-Ausdruck',
		jpDoc: 'JSON-Dokument',
		jpMatches: 'Treffer',
		jpResults: 'Ergebniswerte',
		jtInput: 'JSON-Beispiel',
		jtRoot: 'Name des Wurzeltyps',
		jtNote: 'Aus diesem einen Beispiel abgeleitet — markiere Felder als optional und weite Nullables, wo deine Daten variieren.',
		jyFrom: 'Von',
		jySource: 'Quellformat',
		jyAutoT: 'Quellformat aus dem Inhalt erkennen',
		jyTarget: 'Zielformat',
		jyInput: 'Eingabe',
		jyUnknown: 'unbekanntes Format',
		jwtAnatomy: 'Token-Anatomie',
		jwtHeader: 'Header',
		jwtPayload: 'Payload',
		jwtSignature: 'Signatur (nicht geprüft)',
		jwtIssued: 'Ausgestellt',
		jwtExpires: 'Läuft ab',
		jwtNotBefore: 'Nicht vor',
		jwtLifetime: 'Lebensdauer',
		jwtNote: 'Das Dekodieren liest den Token nur — die Signatur wird nicht geprüft. Prüfe Signaturen serverseitig mit den Schlüsseln des Ausstellers.',
		loremUnit: 'Einheit',
		loremWords: 'Wörter',
		loremSentences: 'Sätze',
		loremParagraphs: 'Absätze',
		loremClassic: 'Mit „Lorem ipsum…“ beginnen',
		pwWeak: 'Schwach',
		pwFair: 'Mittel',
		pwStrong: 'Stark',
		pwExcellent: 'Exzellent',
		pwNoLookalikes: 'Keine Verwechselbaren (0O1lI)',
		pwEntropy: 'Entropie',
		pwBits: 'Bit',
		pwNote: '≥ 80 Bit widersteht Offline-Cracking schneller Hashes; ≥ 100 Bit ist praktisch unerratbar.',
		pwOut: 'Passwörter',
		pwCrypto: 'Erzeugt mit crypto.getRandomValues, nur in deinem Browser. Nichts wird gespeichert oder übertragen.',
		qrContent: 'Inhalt',
		qrEc: 'Fehlerkorrektur',
		qrEcT: 'Übersteht {pct} Beschädigung',
		qrSvg: 'SVG (Vektor, Druck)',
		qrPng: 'PNG (Chat, Folien)',
		qrNote: 'Der Inhalt wird direkt kodiert — kein Redirect-Dienst, nichts läuft ab, kein Scan-Tracking.',
		rxPattern: 'Muster',
		rxTest: 'Testtext',
		rxTestPh: 'Text einfügen, um das Muster zu testen',
		rxHighlighted: 'Hervorgehoben',
		rxMatches: 'Treffer',
		rxMatched: 'Gefundener Text',
		slugInput: 'Titel (einer pro Zeile)',
		slugSep: 'Trennzeichen',
		slugHyphen: 'Bindestrich',
		slugUnderscore: 'Unterstrich',
		slugMax: 'Maximale Länge',
		slugOut: 'Slug',
		slInput: 'Zeilen',
		slPh: 'eine pro Zeile',
		slSort: 'Sortierung',
		slKeep: 'Reihenfolge behalten',
		slAsc: 'Aufsteigend',
		slDesc: 'Absteigend',
		slNatural: 'Natürlich — Zahlen der Größe nach',
		slLength: 'Nach Zeilenlänge',
		slShuffle: 'Mischen',
		slDedupe: 'Duplikate entfernen',
		slIgnoreCase: 'Groß-/Kleinschreibung ignorieren',
		slTrim: 'Leerraum trimmen',
		slDropEmpty: 'Leere entfernen',
		tsInput: 'Timestamp oder Datum',
		tsNow: 'Aktuelle Unix-Zeit:',
		tsNowT: 'Aktuelle Zeit als Eingabe verwenden',
		tsRelative: 'Relativ',
		tsUnixS: 'Unix-Sekunden',
		tsUnixMs: 'Unix-Millisekunden',
		tsZones: 'Über Zeitzonen',
		tsNote: 'Der Marker zeigt die Ortszeit jeder Zone auf einem 24-h-Streifen — die abgedunkelten Enden sind 21:00–07:00.',
		uaInput: 'User-Agent-String',
		uaBrowser: 'Browser',
		uaEngine: 'Engine',
		uaOs: 'Betriebssystem',
		uaDevice: 'Gerät',
		uaNote: 'Der „Beispiel“-Button fügt den User-Agent deines eigenen Browsers ein. Nutze Feature-Detection statt UA-Sniffing für Laufzeitentscheidungen.',
		uniInput: 'Zu untersuchender Text',
		uniPh: 'Füge irgendetwas ein — unsichtbare Zeichen werden hier sichtbar',
		uniGraphemes: 'Grapheme',
		uniGraphemesHint: 'was Nutzer sehen',
		uniCodePoints: 'Codepoints',
		uniUtf16: 'UTF-16-Einheiten',
		uniUtf16Hint: 'JS .length',
		uniUtf8: 'UTF-8-Bytes',
		uniLimit: 'Es werden die ersten 300 Zeichen angezeigt.',
		upInput: 'URL',
		upProtocol: 'Protokoll',
		upHost: 'Host',
		upHostname: 'Hostname',
		upPort: 'Port',
		upPath: 'Pfad',
		upFragment: 'Fragment',
		upOrigin: 'Origin',
		upQuery: 'Query-Parameter',
		upDefault: '(Standard)',
		upNone: '(keins)',
		upEmpty: 'URL-Bestandteile erscheinen hier',
		urlComponent: 'Komponentenmodus (encodeURIComponent)',
		urlInputDec: 'Kodierter Text zum Dekodieren',
		uuidOut: 'Erzeugte IDs',
		uuidFormat: 'ID-Format',
		uuidHintV4: 'zufällig',
		uuidHintV7: 'zeitlich geordnet',
		uuidHintUlid: 'zeitlich geordnet, base32',
		uuidHintNano: 'kurz, URL-sicher',
		uuidNote: 'Erzeugt mit crypto.getRandomValues — kryptographisch sicher, in deinem Browser erstellt, nirgends protokolliert.',
		wcWords: 'Wörter',
		wcChars: 'Zeichen',
		wcCharsHint: '{n} ohne Leerzeichen',
		wcReading: 'Lesezeit',
		wcReadingHint: 'bei 220 WpM',
		wcLines: 'Zeilen',
		wcSentences: 'Sätze',
		wcParagraphs: 'Absätze',
		wcAvg: 'Ø Wortlänge',

		// Shared formatter controls
		fmtFormat: 'Formatieren',
		fmtMinify: 'Minifizieren',

		// SQL formatter
		sqlInput: 'SQL-Statement(s)',
		sqlDialect: 'Dialekt',
		sqlKeywords: 'Schlüsselwörter',
		sqlKeep: 'Beibehalten',

		// XML formatter
		xmlInput: 'XML-Dokument',

		// XML ↔ JSON
		xjInputXml: 'XML-Dokument',
		xjInputJson: 'JSON-Objekt',
		xjNote:
			'Attribute werden zu "@_name"-Keys und Text neben Attributen zu "#text", damit die Konvertierung den Roundtrip übersteht. Die Reihenfolge gemischter Geschwisterelemente bleibt nicht erhalten — XML erlaubt Wiederholungen, JSON-Objekte nicht.',

		// CSV → JSON
		cjInput: 'CSV-/TSV-Daten',
		cjAuto: 'Auto',
		cjPipe: 'Pipe',
		cjHeader: 'Erste Zeile ist Kopfzeile',
		cjTyped: 'Typisierte Werte',

		// Markdown
		mdPreview: 'Vorschau',
		mdNote:
			'Die Vorschau wird vor dem Rendern bereinigt — Skripte und Event-Handler in eingefügten oder geteilten Inhalten können also nicht ausgeführt werden. Die HTML-Ausgabebox enthält die rohe Konvertierung.',

		// Code formatters
		htmlInput: 'HTML-Quelltext',
		cssInput: 'CSS-Quelltext',
		jsInput: 'JavaScript-Quelltext',

		// String escape
		escEscape: 'Escapen',
		escUnescape: 'Unescapen',
		escDialect: 'Dialekt',
		escInputEsc: 'Zu escapender Text',
		escInputUnesc: 'Escapter Text',

		// Number base
		nbInput: 'Zahl',
		nbFrom: 'Von',
		nbAutoT: 'Erkennung am Präfix 0x / 0o / 0b, sonst dezimal',
		nbGroup: 'Ziffern gruppieren',
		nbBase: 'Basis',
		nbBin: 'Binär',
		nbOct: 'Oktal',
		nbDec: 'Dezimal',
		nbHex: 'Hex',
		nbBits: 'Bit',

		// Text ↔ hex/binary
		hbFormat: 'Bytes als',
		hbSep: 'Trennzeichen',
		hbSpace: 'Leerzeichen',
		hbNone: 'Keins',
		hbColon: 'Doppelpunkt',
		hbInputEnc: 'Zu kodierender Text',
		hbInputDec: 'Zu dekodierende Bytes',

		// JSON Schema
		schInfer: 'Schema ableiten',
		schValidate: 'Validieren',
		schInferT: 'Ein Schema aus Beispiel-JSON erzeugen',
		schValidateT: 'JSON gegen ein Schema prüfen',
		schData: 'JSON-Daten',
		schSchema: 'JSON-Schema',
		schViolations: 'Verstöße',
		schValid: 'Gültig — die Daten entsprechen dem Schema',
		schResult: 'Validierungsergebnis',

		// EXIF
		exTags: '{n} Metadaten-Felder',
		exNone: 'Keine Metadaten gefunden — diese Datei ist bereits sauber',
		exStrip: 'Bereinigte Kopie herunterladen',
		exGps: 'GPS-Standort eingebettet',
		exMap: 'Auf Karte anzeigen',
		exNote:
			'Lesen und Entfernen laufen vollständig in deinem Browser — das Foto wird nie hochgeladen. Die Bereinigung entfernt Metadaten-Segmente Byte für Byte ohne Re-Enkodierung; Pixel und Qualität bleiben unangetastet.',

		// Cron builder
		crBuilder: 'Baukasten',
		crMinute: 'Minute',
		crHour: 'Stunde',
		crDom: 'Tag des Monats',
		crMonth: 'Monat',
		crDow: 'Wochentag',
		crEvery: 'Jede(r)',
		crStep: 'Alle N',
		crAt: 'Bestimmte',
		crUse: 'Ausdruck übernehmen',

		// JWT sign & verify
		jwtDecode: 'Dekodieren',
		jwtSign: 'Signieren',
		jwtVerify: 'Verifizieren',
		jwtAlg: 'Algorithmus',
		jwtPayloadLbl: 'Payload (JSON-Objekt)',
		jwtSecret: 'Secret',
		jwtPrivKey: 'Privater Schlüssel (PKCS#8-PEM)',
		jwtPubKey: 'Secret (HS) oder Public-Key-PEM (RS/ES)',
		jwtSignNote:
			'Das Signieren läuft über WebCrypto in deinem Browser — der Schlüssel verlässt diese Seite nie. Nutze für HS-Algorithmen ein langes zufälliges Secret; kurze sind per Brute-Force knackbar, egal wo du signierst.',
		jwtVerifyNote:
			'Die Verifikation prüft die Signatur lokal gegen den von dir angegebenen Schlüssel. Sie ruft keine JWKS-Endpoints ab und validiert keine Claims wie aud/iss — erledige das serverseitig.',

		// Timestamp extras
		tsDiff: 'Differenz zwischen zwei Datumsangaben'
	},
	categories: {
		encoding: 'Kodierung',
		json: 'JSON & Daten',
		text: 'Text',
		time: 'Datum & Zeit',
		generators: 'Generatoren',
		crypto: 'Hashing & Krypto',
		web: 'Web',
		image: 'Bild',
		code: 'Code & Markup',
		privacy: 'Privatsphäre'
	},
	tools: {
		'json-formatter': {
			name: 'JSON-Formatierer & -Validator',
			description: 'JSON formatieren, validieren und minifizieren — Fehler exakt bei Zeile:Spalte'
		},
		'base64-decode': {
			name: 'Base64 kodieren / dekodieren',
			description: 'Text zu Base64 und zurück, inklusive URL-sicherer Variante'
		},
		'timestamp-converter': {
			name: 'Unix-Timestamp-Konverter',
			description: 'Unix-Timestamps in lesbare Daten umwandeln und zurück, mit relativer Zeit'
		},
		'jwt-decoder': {
			name: 'JWT-Decoder',
			description: 'JWT-Header und -Payload dekodieren, Ablauf prüfen — komplett offline'
		},
		'regex-tester': {
			name: 'Regex-Tester',
			description: 'Reguläre Ausdrücke testen mit Live-Hervorhebung von Treffern und Gruppen'
		},
		'diff-checker': {
			name: 'Text-Diff-Vergleich',
			description: 'Zwei Texte zeilenweise vergleichen und Hinzufügungen wie Löschungen sehen'
		},
		'url-encode-decode': {
			name: 'URL kodieren / dekodieren',
			description: 'URL-Komponenten und Query-Strings prozent-kodieren oder dekodieren'
		},
		'url-parser': {
			name: 'URL-Parser',
			description: 'Eine URL in Protokoll, Host, Pfad und Query-Parameter zerlegen'
		},
		'uuid-generator': {
			name: 'UUID-Generator',
			description: 'UUID v4/v7, ULID und Nano ID erzeugen — einzeln oder in Serie'
		},
		'hash-generator': {
			name: 'Hash-Generator',
			description: 'MD5, SHA-1, SHA-256, SHA-512 und HMAC — berechnet in deinem Browser'
		},
		'color-converter': {
			name: 'Farbkonverter',
			description: 'Farben zwischen HEX, RGB, HSL und OKLCH umrechnen, mit Live-Vorschau'
		},
		'case-converter': {
			name: 'Schreibweisen-Konverter',
			description: 'Zwischen camelCase, snake_case, kebab-case, PascalCase und mehr wechseln'
		},
		'word-counter': {
			name: 'Wortzähler',
			description: 'Wörter, Zeichen, Sätze, Bytes und Lesezeit live zählen'
		},
		'lorem-ipsum-generator': {
			name: 'Lorem-Ipsum-Generator',
			description: 'Platzhalter-Wörter, -Sätze oder -Absätze für Mockups erzeugen'
		},
		'slug-generator': {
			name: 'Slug-Generator',
			description: 'Titel in saubere URL-Slugs verwandeln, mit Trennzeichen- und Längenoptionen'
		},
		'sort-lines': {
			name: 'Zeilen sortieren & deduplizieren',
			description: 'Zeilen alphabetisch oder natürlich sortieren, Duplikate und Leerzeilen entfernen'
		},
		'html-entities': {
			name: 'HTML-Entities kodieren / dekodieren',
			description: 'Text für HTML escapen oder &amp;-Entities zurück in Zeichen wandeln'
		},
		'unicode-inspector': {
			name: 'Unicode-Zeichen-Inspektor',
			description: 'Codepoints, UTF-8/UTF-16-Bytes und Escapes jedes Zeichens ansehen'
		},
		'cron-parser': {
			name: 'Cron-Ausdrucks-Parser',
			description: 'Jeden Cron-Zeitplan verständlich erklären, mit den nächsten Ausführungszeiten'
		},
		'password-generator': {
			name: 'Passwort-Generator',
			description: 'Zufallspasswörter mit Zeichensatz-Optionen und ehrlicher Entropie-Anzeige'
		},
		'qr-code-generator': {
			name: 'QR-Code-Generator',
			description: 'Gestochen scharfe QR-Codes als SVG oder PNG — ohne Wasserzeichen, ohne Upload'
		},
		'json-to-yaml': {
			name: 'JSON ↔ YAML ↔ TOML-Konverter',
			description: 'Zwischen JSON, YAML und TOML konvertieren, mit automatischer Formaterkennung'
		},
		'json-to-csv': {
			name: 'JSON ↔ CSV-Konverter',
			description: 'JSON zu CSV abflachen oder CSV zurück in typisierte JSON-Objekte parsen'
		},
		'json-to-typescript': {
			name: 'JSON → TypeScript-Typen',
			description: 'TypeScript-Interfaces sofort aus einem JSON-Beispiel ableiten'
		},
		'jsonpath-tester': {
			name: 'JSONPath-Tester',
			description: 'JSON mit JSONPath-Ausdrücken abfragen und jeden Treffer mit Pfad sehen'
		},
		'bcrypt-generator': {
			name: 'Bcrypt-Hash & -Verifikation',
			description: 'Passwörter mit bcrypt hashen und Hashes gegen Klartext prüfen'
		},
		'user-agent-parser': {
			name: 'User-Agent-Parser',
			description: 'Browser, Engine, OS und Gerät aus einem User-Agent-String erkennen'
		},
		'image-to-base64': {
			name: 'Bild ↔ Base64 Konverter',
			description: 'Bilder in Base64-Data-URLs umwandeln und zurück — mit CSS- und HTML-Snippets'
		},
		'image-converter': {
			name: 'Bildformat-Konverter',
			description: 'Bilder zwischen PNG, JPEG und WebP konvertieren, mit Qualitätsregler'
		},
		'image-resizer': {
			name: 'Bildgrößen-Änderung',
			description: 'Bilder nach Breite, Höhe oder Prozent skalieren — scharf und komplett offline'
		},
		'favicon-generator': {
			name: 'Favicon-Generator',
			description: 'Macht aus jedem Bild favicon.ico plus das komplette PNG- und Manifest-Icon-Set'
		},
		'sql-formatter': {
			name: 'SQL-Formatierer',
			description: 'SQL mit dialektbewussten Schlüsselwörtern formatieren oder auf eine Zeile minifizieren'
		},
		'xml-formatter': {
			name: 'XML-Formatierer & -Validator',
			description: 'XML formatieren, minifizieren und validieren — Fehler mit exakter Position'
		},
		'xml-to-json': {
			name: 'XML ↔ JSON-Konverter',
			description: 'XML-Dokumente zu JSON konvertieren und zurück, Attribute inklusive'
		},
		'markdown-to-html': {
			name: 'Markdown ↔ HTML-Konverter',
			description: 'Markdown mit Live-Vorschau zu HTML rendern oder HTML zurück in Markdown wandeln'
		},
		'html-formatter': {
			name: 'HTML-Formatierer & -Minifier',
			description: 'Unordentliches HTML lesbar formatieren oder für die Produktion minifizieren'
		},
		'css-formatter': {
			name: 'CSS-Formatierer & -Minifier',
			description: 'CSS zum Lesen aufbereiten oder fürs Ausliefern minifizieren'
		},
		'js-formatter': {
			name: 'JavaScript-Formatierer & -Minifier',
			description: 'JavaScript lesbar formatieren oder mit echter Kompression und Mangling minifizieren'
		},
		'string-escape': {
			name: 'String-Escaper / -Unescaper',
			description: 'Strings für JSON, JavaScript, Java, XML, SQL und CSV escapen oder unescapen'
		},
		'number-base-converter': {
			name: 'Zahlenbasis-Konverter',
			description: 'Zahlen zwischen Binär, Oktal, Dezimal, Hex und jeder Basis bis 36 umrechnen'
		},
		'text-to-hex': {
			name: 'Text ↔ Hex / Binär-Konverter',
			description: 'Text in Hex-, Binär- oder Dezimal-Bytes wandeln und Byte-Dumps zurück dekodieren'
		},
		'json-schema-validator': {
			name: 'JSON-Schema-Validator & -Generator',
			description: 'JSON gegen ein Schema validieren oder ein Schema aus Beispieldaten ableiten'
		},
		'exif-viewer': {
			name: 'EXIF-Viewer & -Entferner',
			description: 'Sehen, welche Metadaten deine Fotos tragen — und sie ohne Re-Enkodierung entfernen'
		}
	}
};

export default de;
