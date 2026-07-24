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
		changelogMetaDescription:
			'Novità su onlinetools.dev — nuovi strumenti, funzionalità e correzioni, tutto eseguito localmente nel tuo browser.',
		releaseDate: 'Data di rilascio',
		language: 'Lingua',
		openNav: 'Apri la navigazione',
		searchTools: 'Cerca strumenti',

		// About / Why page
		about: 'Informazioni',
		aboutTitle: 'Perché onlinetools.dev — prima il locale, senza tracciamento, verificabile | onlinetools.dev',
		aboutMetaDescription:
			'Perché esiste onlinetools.dev: ogni strumento gira nel tuo browser, nulla di ciò che incolli viene caricato, niente pubblicità, niente tracker, niente accesso — e un indicatore in tempo reale ti permette di verificarlo di persona.',
		aboutEyebrow: 'perché esiste · fiducia',
		aboutVerifyHeading: 'Non fidarti solo delle mie parole',
		aboutVerifyHint:
			'Scrivi o incolla qualsiasi cosa qui sotto. Il contatore resta a zero — ogni tasto viene elaborato qui, sulla tua macchina.',
		aboutRequestsLabel: 'Richieste di rete da quando questa pagina è stata aperta',
		aboutRequestsNote:
			'L’unica cosa che può muovere questo numero è aprire un altro strumento, che carica codice del sito dallo stesso dominio. Ciò che incolli, mai.',
		aboutVerifyPlaceholder: 'Scrivi o incolla qualsiasi cosa — niente esce dal tuo browser…',
		aboutOfflineReady: 'Pronto offline',
		aboutOfflineCaching: 'Memorizzazione in cache…',
		aboutDevtools:
			'Vuoi una prova più solida? Apri gli strumenti per sviluppatori del browser, vai alla scheda Network (Rete) e incolla. Vedrai che non succede nulla.',
		aboutViewSource: 'Vedi il codice',
		aboutEditPage: 'Modifica questa pagina',
		aboutBuiltBy: 'Creato da',

		// Favorites (stored locally in this browser)
		favorites: 'Preferiti',
		favoriteAdd: 'Aggiungi ai preferiti',
		favoriteRemove: 'Rimuovi dai preferiti',
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

		// Paste hero (homepage)
		pasteHeroHeading: 'Incolla qualsiasi cosa — ottieni subito lo strumento giusto',
		pasteHeroPlaceholder: 'Incolla un JWT, JSON, un timestamp Unix, un colore, un’URL, un’immagine…',
		tryLabel: 'Prova',
		plainText: 'Testo semplice',
		noMatchHint: 'Nessuna corrispondenza esatta — scegli uno strumento di testo qui sotto o cerca tutto',
		runHint: 'esegui',
		newlineHint: 'a capo',
		clearHint: 'cancella',

		// Pipeline (tool chains)
		chainNavLabel: 'Pipeline',
		chainNew: 'Novità',
		chainSteps: 'Passaggi',
		chainMoreRecipes: 'Altre ricette',
		chainTitle: 'Pipeline di strumenti — concatena strumenti per sviluppatori nel browser | onlinetools.dev',
		chainMetaDescription:
			'Concatena strumenti per sviluppatori in una pipeline: decodifica, trasforma ed estrai in un unico flusso. Ogni passaggio alimenta il successivo, tutto viene eseguito nel browser e l’intera ricetta sta in un link condivisibile.',
		chainEyebrow: 'banco di lavoro · local-first',
		chainHeading: 'Pipeline',
		chainSub: 'Concatena strumenti in una ricetta: ogni passaggio alimenta il successivo. Viene eseguito interamente nel tuo browser.',
		chainInputPlaceholder: 'Incolla o digita l’input iniziale…',
		chainAddStep: 'Aggiungi passaggio',
		chainSearchSteps: 'Cerca passaggi…',
		chainStarters: 'Esempi',
		chainEmpty: 'Aggiungi un passaggio: ogni passaggio alimenta il successivo.',
		chainHomeCta: 'Concatena strumenti in una pipeline',
		chainHomeCtaSub: 'Collega l’output di uno strumento al successivo: decodifica, trasforma ed estrai in un unico flusso.',
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
	tl: {
		direction: 'Direzione',
		encode: 'Codifica',
		decode: 'Decodifica',
		mode: 'Modalità',
		count: 'Quantità',
		lengthLbl: 'Lunghezza',
		uppercase: 'Maiuscolo',
		lowercase: 'Minuscolo',
		regenerate: 'Rigenera',
		b64InputEnc: 'Testo da codificare',
		b64InputDec: 'Base64 da decodificare',
		b64PhEnc: 'Qualsiasi testo, unicode incluso',
		b64UrlSafe: 'URL-safe (senza padding)',
		bcHash: 'Hash',
		bcVerify: 'Verifica',
		bcHashT: 'Fai l’hash di una password',
		bcVerifyT: 'Verifica una password contro un hash',
		bcPassword: 'Password',
		bcCost: 'Fattore di costo',
		bcHashLbl: 'Hash bcrypt',
		bcPh: 'resta nel tuo browser',
		bcVersion: 'Versione',
		bcCostShort: 'Costo',
		bcSalt: 'Salt',
		bcNote: 'L’hashing gira nel tuo browser — non viene trasmesso nulla. Il JS del browser è più lento del bcrypt nativo; considera i tempi un limite superiore.',
		caseInput: 'Testo o identificatore (uno per riga)',
		caseEmpty: 'I nove stili appaiono qui mentre digiti',
		colorInput: 'Colore',
		colorFormats: 'Formati',
		colorRgb: 'Canali RGB',
		colorContrast: 'Contrasto del testo (WCAG)',
		cronInput: 'Espressione cron',
		cronEvalIn: 'valutato in',
		cronNext: 'Prossime 5 esecuzioni',
		cronNone: 'Nessuna esecuzione nei prossimi 5 anni',
		diffOriginal: 'Originale',
		diffChanged: 'Modificato',
		diffLbl: 'Diff',
		diffUnchanged: 'invariate',
		diffEmpty: 'Il diff riga per riga appare qui',
		hashInput: 'Testo di cui fare l’hash',
		hashPh: 'Qualsiasi testo — gli hash si aggiornano mentre digiti',
		hashHmac: 'Chiave segreta HMAC',
		hashOptional: '(facoltativa)',
		hashHmacPh: 'Lascia vuoto per hash semplici',
		hashDigests: 'Digest',
		hashEmpty: 'I digest si aggiornano mentre digiti',
		hashNote: 'MD5 e SHA-1 sono mostrati solo per checksum legacy — usa SHA-256 o superiore per qualsiasi uso di sicurezza.',
		heAll: 'Codifica tutto il non ASCII',
		heNumeric: 'Solo numeriche',
		heInputEnc: 'Testo da fare escape',
		heInputDec: 'HTML con entità',
		imgDrop: 'Trascina un’immagine, clicca per sceglierla o incollala dagli appunti',
		imgLocal: 'Resta nel tuo browser — non viene caricato nulla',
		imgReplace: 'Trascina, clicca o incolla per sostituire',
		imgSource: 'Immagine sorgente',
		imgOriginal: 'Originale',
		imgDimensions: 'Dimensioni',
		imgDownload: 'Scarica {fmt}',
		imgErrNotImage: 'Formato immagine non riconosciuto (PNG, JPEG, WebP, GIF, SVG, BMP, ICO, AVIF)',
		imgErrDecode: 'Il browser non è riuscito a decodificare questa immagine',
		imgErrEncode: 'Il browser non è riuscito a codificare questa immagine',
		imgErrFormat: 'Questo browser non sa codificare {fmt} — prova PNG o JPEG',
		i2bToB64: 'Immagine → Base64',
		i2bFromB64: 'Base64 → immagine',
		i2bInput: 'Data URL o Base64 grezzo',
		i2bDataUrl: 'Data URL',
		i2bRawB64: 'Base64 grezzo',
		i2bCss: 'Sfondo CSS',
		i2bHtml: 'HTML <img>',
		i2bEncodedSize: 'Dimensione Base64',
		i2bOverhead: '+{pct}% vs binario',
		i2bNote: 'L’inlining risparmia una richiesta ma gonfia il documento e vanifica la cache — ideale per icone e risorse sotto ~10 KB.',
		icTarget: 'Converti in',
		icQuality: 'Qualità',
		icConverted: 'Convertita',
		icSmaller: 'più piccola dell’originale',
		icLarger: 'più grande dell’originale',
		icBgNote: 'JPEG non supporta la trasparenza — le aree trasparenti vengono appiattite su bianco.',
		icNote: 'La conversione usa l’encoder canvas del browser: le dimensioni esatte variano leggermente tra browser.',
		fgAppleBg: 'Sfondo icona Apple',
		fgFiles: 'File generati',
		fgHtml: 'Tag <link> HTML',
		fgSmall: 'La sorgente è {px}px — le icone più grandi verranno ingrandite e potrebbero risultare sfocate',
		fgNote: 'L’ICO contiene 16, 32 e 48 px. L’icona touch Apple non supporta la trasparenza e viene appiattita sullo sfondo scelto; le icone PWA mantengono l’alfa. Le sorgenti non quadrate vengono ritagliate al centro.',
		irBy: 'Ridimensiona per',
		irWidth: 'Larghezza',
		irHeight: 'Altezza',
		irPercent: 'Percentuale',
		irFormat: 'Formato',
		irKeep: 'Mantieni',
		irResized: 'Ridimensionata',
		irScale: 'Scala',
		irNote: 'La riduzione usa uno smoothing di alta qualità. L’ingrandimento non inventa dettagli — oltre 2× aspettati sfocatura.',
		jcInput: 'Array JSON di oggetti',
		jcDelimiter: 'Delimitatore',
		jcComma: 'Virgola',
		jcSemicolon: 'Punto e virgola (Excel europeo)',
		jcTab: 'Tabulazione',
		jfInput: 'Input JSON',
		jfIndent: 'Rientro',
		jfIndentation: 'Rientro',
		jfSp2: '2 spazi',
		jfSp4: '4 spazi',
		jfTabs: 'Tab',
		jfMin: 'Minificato — senza spazi',
		jfSortKeys: 'Ordina chiavi',
		jfText: 'Testo',
		jfTree: 'Albero',
		jfTreeHint: 'Passa sopra un nodo per copiare il suo JSONPath — provalo nel',
		jfTreeLink: 'tester JSONPath',
		jpExpr: 'Espressione JSONPath',
		jpDoc: 'Documento JSON',
		jpMatches: 'Corrispondenze',
		jpResults: 'Valori risultanti',
		jtInput: 'Esempio JSON',
		jtRoot: 'Nome del tipo radice',
		jtNote: 'Dedotto da questo solo esempio — segna i campi opzionali e allarga i nullable dove i tuoi dati variano.',
		jyFrom: 'Da',
		jySource: 'Formato di origine',
		jyAutoT: 'Rileva il formato di origine dal contenuto',
		jyTarget: 'Formato di destinazione',
		jyInput: 'Input',
		jyUnknown: 'formato sconosciuto',
		jwtAnatomy: 'Anatomia del token',
		jwtHeader: 'header',
		jwtPayload: 'payload',
		jwtSignature: 'firma (non verificata)',
		jwtIssued: 'Emesso',
		jwtExpires: 'Scade',
		jwtNotBefore: 'Non prima di',
		jwtLifetime: 'Durata',
		jwtNote: 'La decodifica legge soltanto il token — non verifica la firma. Verifica le firme lato server con le chiavi dell’emittente.',
		loremUnit: 'Unità',
		loremWords: 'Parole',
		loremSentences: 'Frasi',
		loremParagraphs: 'Paragrafi',
		loremClassic: 'Inizia con “Lorem ipsum…”',
		pwWeak: 'Debole',
		pwFair: 'Discreta',
		pwStrong: 'Forte',
		pwExcellent: 'Eccellente',
		pwNoLookalikes: 'Senza caratteri ambigui (0O1lI)',
		pwEntropy: 'Entropia',
		pwBits: 'bit',
		pwNote: '≥ 80 bit resiste al cracking offline di hash veloci; ≥ 100 bit è di fatto inindovinabile.',
		pwOut: 'Password',
		pwCrypto: 'Generate con crypto.getRandomValues, solo nel tuo browser. Nulla viene salvato o trasmesso.',
		qrContent: 'Contenuto',
		qrEc: 'Correzione errori',
		qrEcT: 'Sopravvive a {pct} di danni',
		qrSvg: 'SVG (vettoriale, stampa)',
		qrPng: 'PNG (chat, slide)',
		qrNote: 'Il contenuto è codificato direttamente — nessun redirect, nulla scade, nessun tracciamento delle scansioni.',
		rxPattern: 'Pattern',
		rxTest: 'Testo di prova',
		rxTestPh: 'Incolla il testo su cui provare il pattern',
		rxHighlighted: 'Evidenziato',
		rxMatches: 'Corrispondenze',
		rxMatched: 'Testo corrispondente',
		slugInput: 'Titolo (uno per riga)',
		slugSep: 'Separatore',
		slugHyphen: 'Trattino',
		slugUnderscore: 'Underscore',
		slugMax: 'Lunghezza max',
		slugOut: 'Slug',
		slInput: 'Righe',
		slPh: 'una per riga',
		slSort: 'Ordinamento',
		slKeep: 'Mantieni ordine',
		slAsc: 'Crescente',
		slDesc: 'Decrescente',
		slNatural: 'Naturale — numeri in ordine',
		slLength: 'Per lunghezza',
		slShuffle: 'Mescola',
		slDedupe: 'Deduplica',
		slIgnoreCase: 'Ignora maiuscole',
		slTrim: 'Rimuovi spazi',
		slDropEmpty: 'Elimina vuote',
		tsInput: 'Timestamp o data',
		tsNow: 'Ora unix attuale:',
		tsNowT: 'Usa l’ora attuale come input',
		tsRelative: 'Relativo',
		tsUnixS: 'Secondi unix',
		tsUnixMs: 'Millisecondi unix',
		tsZones: 'Tra fusi orari',
		tsNote: 'Il marcatore mostra l’ora locale di ogni fuso su una striscia di 24 h — le estremità scure vanno dalle 21:00 alle 07:00.',
		uaInput: 'Stringa User-Agent',
		uaBrowser: 'Browser',
		uaEngine: 'Engine',
		uaOs: 'Sistema operativo',
		uaDevice: 'Dispositivo',
		uaNote: 'Il pulsante “Esempio” inserisce lo User-Agent del tuo browser. Per le decisioni a runtime usa la feature detection, non lo UA sniffing.',
		uniInput: 'Testo da ispezionare',
		uniPh: 'Incolla qualsiasi cosa — i caratteri invisibili diventano visibili qui',
		uniGraphemes: 'Grafemi',
		uniGraphemesHint: 'ciò che vede l’utente',
		uniCodePoints: 'Code point',
		uniUtf16: 'Unità UTF-16',
		uniUtf16Hint: 'JS .length',
		uniUtf8: 'Byte UTF-8',
		uniLimit: 'Sono mostrati i primi 300 caratteri.',
		upInput: 'URL',
		upProtocol: 'Protocollo',
		upHost: 'Host',
		upHostname: 'Hostname',
		upPort: 'Porta',
		upPath: 'Percorso',
		upFragment: 'Frammento',
		upOrigin: 'Origine',
		upQuery: 'Parametri di query',
		upDefault: '(predefinita)',
		upNone: '(nessuno)',
		upEmpty: 'I componenti dell’URL appaiono qui',
		urlComponent: 'Modalità componente (encodeURIComponent)',
		urlInputDec: 'Testo codificato da decodificare',
		uuidOut: 'ID generati',
		uuidFormat: 'Formato ID',
		uuidHintV4: 'casuale',
		uuidHintV7: 'ordinato nel tempo',
		uuidHintUlid: 'ordinato nel tempo, base32',
		uuidHintNano: 'corto, URL-safe',
		uuidNote: 'Generati con crypto.getRandomValues — crittograficamente sicuri, creati nel tuo browser, mai registrati.',
		wcWords: 'Parole',
		wcChars: 'Caratteri',
		wcCharsHint: '{n} senza spazi',
		wcReading: 'Tempo di lettura',
		wcReadingHint: 'a 220 ppm',
		wcLines: 'Righe',
		wcSentences: 'Frasi',
		wcParagraphs: 'Paragrafi',
		wcAvg: 'Lunghezza media parola',

		// Shared formatter controls
		fmtFormat: 'Formatta',
		fmtMinify: 'Minifica',

		// SQL formatter
		sqlInput: 'Istruzioni SQL',
		sqlDialect: 'Dialetto',
		sqlKeywords: 'Parole chiave',
		sqlKeep: 'Mantieni',

		// XML formatter
		xmlInput: 'Documento XML',

		// XML ↔ JSON
		xjInputXml: 'Documento XML',
		xjInputJson: 'Oggetto JSON',
		xjNote: 'Gli attributi diventano chiavi "@_nome" e il testo accanto agli attributi diventa "#text", così la conversione fa il viaggio di andata e ritorno. L’ordine degli elementi tra fratelli misti non è preservato — XML ammette le ripetizioni, gli oggetti JSON no.',

		// CSV → JSON
		cjInput: 'Dati CSV / TSV',
		cjAuto: 'Auto',
		cjPipe: 'Pipe',
		cjHeader: 'La prima riga è l’intestazione',
		cjTyped: 'Valori tipizzati',

		// Markdown
		mdPreview: 'Anteprima',
		mdNote: 'L’anteprima viene sanificata prima del rendering, quindi script e gestori di eventi nel contenuto incollato o condiviso non possono essere eseguiti. La casella dell’output HTML contiene la conversione grezza.',

		// Code formatters
		htmlInput: 'Sorgente HTML',
		cssInput: 'Sorgente CSS',
		jsInput: 'Sorgente JavaScript',

		// String escape
		escEscape: 'Escape',
		escUnescape: 'Unescape',
		escDialect: 'Dialetto',
		escInputEsc: 'Testo da fare escape',
		escInputUnesc: 'Testo escapato',

		// Number base
		nbInput: 'Numero',
		nbFrom: 'Da',
		nbAutoT: 'Rileva dal prefisso 0x / 0o / 0b, altrimenti decimale',
		nbGroup: 'Raggruppa le cifre',
		nbBase: 'Base',
		nbBin: 'Binario',
		nbOct: 'Ottale',
		nbDec: 'Decimale',
		nbHex: 'Hex',
		nbBits: 'bit',

		// Text ↔ hex/binary
		hbFormat: 'Byte come',
		hbSep: 'Separatore',
		hbSpace: 'Spazio',
		hbNone: 'Nessuno',
		hbColon: 'Due punti',
		hbInputEnc: 'Testo da codificare',
		hbInputDec: 'Byte da decodificare',

		// JSON Schema
		schInfer: 'Deduci schema',
		schValidate: 'Valida',
		schInferT: 'Genera uno schema da JSON di esempio',
		schValidateT: 'Controlla il JSON contro uno schema',
		schData: 'Dati JSON',
		schSchema: 'JSON Schema',
		schViolations: 'violazioni',
		schValid: 'Valido — i dati sono conformi allo schema',
		schResult: 'Risultato della validazione',

		// EXIF
		exTags: '{n} campi di metadati',
		exNone: 'Nessun metadato trovato — questo file è già pulito',
		exStrip: 'Scarica copia ripulita',
		exGps: 'Posizione GPS incorporata',
		exMap: 'Vedi sulla mappa',
		exNote: 'Lettura e rimozione avvengono interamente nel tuo browser — la foto non viene mai caricata. La pulizia rimuove i segmenti di metadati byte per byte senza ricodificare, quindi pixel e qualità restano intatti.',

		// Cron builder
		crBuilder: 'Costruttore',
		crMinute: 'Minuto',
		crHour: 'Ora',
		crDom: 'Giorno del mese',
		crMonth: 'Mese',
		crDow: 'Giorno della settimana',
		crEvery: 'Ogni',
		crStep: 'Ogni N',
		crAt: 'Specifico',
		crUse: 'Usa espressione',

		// JWT sign & verify
		jwtDecode: 'Decodifica',
		jwtSign: 'Firma',
		jwtVerify: 'Verifica',
		jwtAlg: 'Algoritmo',
		jwtPayloadLbl: 'Payload (oggetto JSON)',
		jwtSecret: 'Segreto',
		jwtPrivKey: 'Chiave privata (PEM PKCS#8)',
		jwtPubKey: 'Segreto (HS) o chiave pubblica PEM (RS/ES)',
		jwtSignNote: 'La firma gira su WebCrypto nel tuo browser — la chiave non lascia mai questa pagina. Per gli algoritmi HS usa un segreto lungo e casuale; quelli corti si trovano per forza bruta, ovunque tu firmi.',
		jwtVerifyNote: 'La verifica controlla la firma contro la chiave che fornisci, in locale. Non scarica endpoint JWKS né valida claim come aud/iss — fallo lato server.',

		// Timestamp extras
		tsDiff: 'Differenza tra due date'
	},
	categories: {
		encoding: 'Codifica',
		json: 'JSON e dati',
		text: 'Testo',
		time: 'Data e ora',
		generators: 'Generatori',
		crypto: 'Hash e crittografia',
		web: 'Web',
		image: 'Immagini',
		code: 'Codice e markup',
		privacy: 'Privacy'
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
			name: 'Convertitore JSON ↔ CSV',
			description: 'Appiattisci JSON in CSV o riconverti CSV in oggetti JSON tipizzati'
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
		},
		'image-to-base64': {
			name: 'Convertitore immagine ↔ Base64',
			description: 'Converti immagini in data URL Base64 e viceversa — con snippet CSS e HTML'
		},
		'image-converter': {
			name: 'Convertitore di formato immagine',
			description: 'Converti immagini tra PNG, JPEG e WebP con controllo qualità'
		},
		'image-resizer': {
			name: 'Ridimensiona immagini',
			description: 'Ridimensiona per larghezza, altezza o percentuale — nitido e completamente offline'
		},
		'favicon-generator': {
			name: 'Generatore di favicon',
			description: 'Trasforma qualsiasi immagine in favicon.ico più il set completo di icone PNG e manifest'
		},
		'sql-formatter': {
			name: 'Formattatore SQL',
			description: 'Formatta SQL con parole chiave consapevoli del dialetto, o minificalo su una sola riga'
		},
		'xml-formatter': {
			name: 'Formattatore e validatore XML',
			description: 'Formatta, minifica e valida XML con posizioni d’errore esatte'
		},
		'xml-to-json': {
			name: 'Convertitore XML ↔ JSON',
			description: 'Converti documenti XML in JSON e viceversa, attributi inclusi'
		},
		'markdown-to-html': {
			name: 'Convertitore Markdown ↔ HTML',
			description: 'Renderizza Markdown in HTML con anteprima live, o riconverti HTML in Markdown'
		},
		'html-formatter': {
			name: 'Formattatore e minificatore HTML',
			description: 'Abbellisci HTML disordinato o minificalo per la produzione'
		},
		'css-formatter': {
			name: 'Formattatore e minificatore CSS',
			description: 'Abbellisci il CSS per leggerlo o minificalo per la pubblicazione'
		},
		'js-formatter': {
			name: 'Formattatore e minificatore JavaScript',
			description: 'Abbellisci JavaScript o minificalo con compressione e mangling reali'
		},
		'string-escape': {
			name: 'Escape / unescape di stringhe',
			description: 'Fai escape o unescape di stringhe per JSON, JavaScript, Java, XML, SQL e CSV'
		},
		'number-base-converter': {
			name: 'Convertitore di basi numeriche',
			description: 'Converti numeri tra binario, ottale, decimale, hex e qualsiasi base fino a 36'
		},
		'text-to-hex': {
			name: 'Convertitore testo ↔ hex / binario',
			description: 'Trasforma testo in byte hex, binari o decimali e decodifica i dump di byte'
		},
		'json-schema-validator': {
			name: 'Validatore e generatore di JSON Schema',
			description: 'Valida JSON contro uno schema, o deduci uno schema da dati di esempio'
		},
		'exif-viewer': {
			name: 'Visualizza e rimuovi EXIF',
			description: 'Scopri quali metadati contengono le tue foto — e rimuovili senza ricodificare'
		}
	}
};

export default it;
