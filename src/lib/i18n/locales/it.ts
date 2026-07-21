import type { Messages } from '$lib/i18n';

const it: Messages = {
	code: 'it',
	name: 'Italiano',
	ui: {
		search: 'Cerca',
		overview: 'Panoramica',
		toggleTheme: 'Cambia tema',
		themeSystem: 'Segui il sistema',
		themeDark: 'Scuro',
		themeLight: 'Chiaro',
		themeTitle: 'Tema: {mode} — clicca per cambiare',
		footerPrivacy: 'Gira nel tuo browser — niente di ciò che incolli viene caricato',
		allTools: 'Tutti gli strumenti',
		changelog: 'Novità',
		releaseDate: 'Data di rilascio',
		language: 'Lingua',
		openNav: 'Apri la navigazione',
		searchTools: 'Cerca strumenti',
		homeTitle: 'onlinetools.dev — Strumenti per sviluppatori che girano nel browser',
		homeMetaDescription:
			'Strumenti per sviluppatori veloci e pensati per la tastiera, eseguiti interamente nel browser. Formatta JSON, decodifica JWT e Base64, converti timestamp, testa regex — nessun upload, nessuna registrazione, funziona offline.',
		homeEyebrow: '{n} strumenti · local-first',
		homeHeading: 'Strumenti per sviluppatori che girano nel browser',
		homeSub: 'Nessun upload, nessuna registrazione, nessuna attesa.',
		pasteToDetect: 'incolla per rilevare',
		worksOffline: 'funziona offline',
		shortcuts: 'scorciatoie',
		searchPlaceholder: 'Cerca tra {n} strumenti o incolla qualsiasi cosa…',
		startHere: 'Inizia qui',
		smartPaste: 'Incolla intelligente',
		smartPasteDesc:
			'Incolla qualsiasi cosa, ovunque — il tipo di contenuto viene rilevato e lo strumento giusto è a un tasto di distanza.',
		keyboardFirst: 'Tastiera al primo posto, dall’inizio alla fine',
		keyboardFirstDesc: 'Trova, esegui, copia e condividi senza toccare il mouse.',
		kbdAnyTool: 'qualsiasi strumento',
		kbdCopyResult: 'copia risultato',
		kbdConfirm: 'conferma',
		kbdAllShortcuts: 'tutte le scorciatoie',
		toolsTitle: 'Tutti gli strumenti per sviluppatori — onlinetools.dev',
		toolsMetaDescription:
			'Sfoglia tutti gli strumenti di onlinetools.dev: JSON, YAML, Base64, JWT, timestamp, cron, regex, diff, UUID, hash, codici QR e altro — tutto in locale nel tuo browser.',
		toolsBlurb: '{n} strumenti, ognuno calcolato nel tuo browser. Ne arrivano sempre di nuovi — vedi il',
		toolTitle: '{name} — Gratis e privato | onlinetools.dev',
		toolMetaSuffix: 'Gira interamente nel browser — nessun upload, nessuna registrazione, funziona offline.',
		runsLocally: 'Gira in locale',
		runsLocallyTitle:
			'Questo strumento calcola tutto nel tuo browser. Ciò che inserisci non viene mai caricato.',
		aboutTool: 'Su questo strumento',
		faqHeading: 'Domande frequenti',
		relatedTools: 'Strumenti correlati',
		breadcrumbTools: 'strumenti',
		sample: 'Esempio',
		line: 'riga',
		output: 'Risultato',
		copy: 'Copia',
		copied: 'Copiato',
		download: 'Scarica',
		share: 'Condividi',
		linkCopied: 'Link copiato',
		continueWith: 'Continua con',
		suggested: 'consigliato',
		shareTooLarge:
			'Contenuto troppo grande per un URL — i link di condivisione hanno un limite per restare portabili. Il contenuto non lascia mai questa macchina.',
		emptyHint: 'Il risultato appare qui mentre digiti',
		palettePlaceholder: 'Cerca strumenti o incolla contenuto da elaborare…',
		noMatch: 'Nessuno strumento corrispondente',
		navigate: 'naviga',
		open: 'apri',
		close: 'chiudi',
		detected: 'Rilevato',
		chars: 'caratteri',
		shortcutsTitle: 'Scorciatoie da tastiera',
		scPalette: 'Apri la palette dei comandi',
		scCopy: 'Copia risultato',
		scEsc: 'Chiudi pannello / ignora suggerimento',
		scHelp: 'Questo riferimento delle scorciatoie',
		scPaste: 'Incolla intelligente — rileva il contenuto e suggerisce strumenti',
		scNav: 'Naviga e conferma nei pannelli'
	},
	categories: {
		encoding: 'Codifica',
		json: 'JSON e dati',
		text: 'Testo',
		time: 'Data e ora',
		generators: 'Generatori',
		crypto: 'Hash e crittografia',
		web: 'Web'
	},
	tools: {
		'json-formatter': {
			name: 'Formattatore e validatore JSON',
			description: 'Formatta, valida e minifica JSON con errori localizzati a riga:colonna'
		},
		'base64-decode': {
			name: 'Codifica / decodifica Base64',
			description: 'Converti testo in Base64 e viceversa, con variante URL-safe'
		},
		'timestamp-converter': {
			name: 'Convertitore di timestamp Unix',
			description: 'Converti timestamp Unix in date leggibili e viceversa, con tempo relativo'
		},
		'jwt-decoder': {
			name: 'Decodificatore JWT',
			description: 'Decodifica header e payload del JWT e controlla la scadenza — tutto offline'
		},
		'regex-tester': {
			name: 'Tester di regex',
			description: 'Testa espressioni regolari con evidenziazione live di match e gruppi'
		},
		'diff-checker': {
			name: 'Confronto testi (diff)',
			description: 'Confronta due testi riga per riga e vedi aggiunte ed eliminazioni'
		},
		'url-encode-decode': {
			name: 'Codifica / decodifica URL',
			description: 'Codifica o decodifica in percentuale componenti URL e query string'
		},
		'url-parser': {
			name: 'Parser di URL',
			description: 'Scomponi un URL in protocollo, host, percorso e parametri'
		},
		'uuid-generator': {
			name: 'Generatore di UUID',
			description: 'Genera UUID v4/v7, ULID e Nano ID — singoli o in blocco'
		},
		'hash-generator': {
			name: 'Generatore di hash',
			description: 'MD5, SHA-1, SHA-256, SHA-512 e HMAC — calcolati nel tuo browser'
		},
		'color-converter': {
			name: 'Convertitore di colori',
			description: 'Converti colori tra HEX, RGB, HSL e OKLCH con anteprima live'
		},
		'case-converter': {
			name: 'Convertitore di case',
			description: 'Passa tra camelCase, snake_case, kebab-case, PascalCase e altro'
		},
		'word-counter': {
			name: 'Contatore di parole',
			description: 'Conta parole, caratteri, frasi, byte e tempo di lettura mentre digiti'
		},
		'lorem-ipsum-generator': {
			name: 'Generatore Lorem Ipsum',
			description: 'Genera parole, frasi o paragrafi segnaposto per i mockup'
		},
		'slug-generator': {
			name: 'Generatore di slug',
			description: 'Trasforma i titoli in slug URL puliti, con separatore e lunghezza a scelta'
		},
		'sort-lines': {
			name: 'Ordina e deduplica righe',
			description: 'Ordina le righe alfabeticamente o naturalmente, rimuovi duplicati e righe vuote'
		},
		'html-entities': {
			name: 'Codifica / decodifica entità HTML',
			description: 'Fai escape del testo per HTML o riconverti le entità &amp; in caratteri'
		},
		'unicode-inspector': {
			name: 'Ispettore di caratteri Unicode',
			description: 'Vedi code point, byte UTF-8/UTF-16 ed escape di ogni carattere'
		},
		'cron-parser': {
			name: 'Parser di espressioni cron',
			description: 'Spiega qualsiasi pianificazione cron in parole semplici con le prossime esecuzioni'
		},
		'password-generator': {
			name: 'Generatore di password',
			description: 'Password casuali con opzioni sui caratteri e un misuratore di entropia onesto'
		},
		'qr-code-generator': {
			name: 'Generatore di codici QR',
			description: 'Genera codici QR nitidi in SVG o PNG — senza watermark, senza upload'
		},
		'json-to-yaml': {
			name: 'Convertitore JSON ↔ YAML ↔ TOML',
			description: 'Converti tra JSON, YAML e TOML con rilevamento automatico del formato'
		},
		'json-to-csv': {
			name: 'Convertitore JSON → CSV',
			description: 'Appiattisci array di oggetti JSON in CSV con l’escaping corretto'
		},
		'json-to-typescript': {
			name: 'JSON → tipi TypeScript',
			description: 'Deduce all’istante interfacce TypeScript da un esempio JSON'
		},
		'jsonpath-tester': {
			name: 'Tester JSONPath',
			description: 'Interroga JSON con espressioni JSONPath e vedi ogni match con il suo percorso'
		},
		'bcrypt-generator': {
			name: 'Hash e verifica bcrypt',
			description: 'Genera hash bcrypt delle password e verifica gli hash contro il testo in chiaro'
		},
		'user-agent-parser': {
			name: 'Parser di User-Agent',
			description: 'Identifica browser, engine, SO e dispositivo da una stringa User-Agent'
		}
	}
};

export default it;
