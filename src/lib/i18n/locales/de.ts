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
	categories: {
		encoding: 'Kodierung',
		json: 'JSON & Daten',
		text: 'Text',
		time: 'Datum & Zeit',
		generators: 'Generatoren',
		crypto: 'Hashing & Krypto',
		web: 'Web'
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
			name: 'JSON → CSV-Konverter',
			description: 'Arrays von JSON-Objekten mit korrektem Escaping zu CSV abflachen'
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
		}
	}
};

export default de;
