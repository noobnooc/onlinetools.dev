import type { Messages } from '$lib/i18n';

const es: Messages = {
	code: 'es',
	name: 'Español',
	ui: {
		search: 'Buscar',
		overview: 'Inicio',
		toggleTheme: 'Cambiar tema',
		themeSystem: 'Según el sistema',
		themeDark: 'Oscuro',
		themeLight: 'Claro',
		themeTitle: 'Tema: {mode} — clic para cambiar',
		footerPrivacy: 'Se ejecuta en tu navegador — nada de lo que pegas se sube',
		allTools: 'Todas las herramientas',
		changelog: 'Novedades',
		changelogMetaDescription:
			'Novedades de onlinetools.dev: nuevas herramientas, funciones y correcciones, todo ejecutándose localmente en tu navegador.',
		releaseDate: 'Fecha de versión',
		language: 'Idioma',
		openNav: 'Abrir navegación',
		searchTools: 'Buscar herramientas',
		homeTitle: 'onlinetools.dev — Herramientas de desarrollo que corren en tu navegador',
		homeMetaDescription:
			'Herramientas de desarrollo rápidas y orientadas al teclado que se ejecutan por completo en tu navegador. Formatea JSON, decodifica JWT y Base64, convierte timestamps, prueba regex — sin subir nada, sin registro, funciona sin conexión.',
		homeEyebrow: '{n} herramientas · local primero',
		homeHeading: 'Herramientas de desarrollo que corren en tu navegador',
		homeSub: 'Sin subir archivos, sin registro, sin esperas.',
		pasteToDetect: 'pega para detectar',
		worksOffline: 'funciona sin conexión',
		shortcuts: 'atajos',
		searchPlaceholder: 'Busca entre {n} herramientas o pega cualquier cosa…',
		startHere: 'Empieza aquí',
		smartPaste: 'Pegado inteligente',
		smartPasteDesc:
			'Pega lo que sea, donde sea — se detecta el tipo de contenido y la herramienta correcta queda a una tecla.',
		keyboardFirst: 'Teclado primero, de principio a fin',
		keyboardFirstDesc: 'Busca, ejecuta, copia y comparte sin tocar el ratón.',
		kbdAnyTool: 'cualquier herramienta',
		kbdCopyResult: 'copiar resultado',
		kbdConfirm: 'confirmar',
		kbdAllShortcuts: 'todos los atajos',
		toolsTitle: 'Todas las herramientas de desarrollo — onlinetools.dev',
		toolsMetaDescription:
			'Explora todas las herramientas de onlinetools.dev: JSON, YAML, Base64, JWT, timestamps, cron, regex, diff, UUID, hashes, códigos QR y más — todo se ejecuta localmente en tu navegador.',
		toolsBlurb: '{n} herramientas, todas calculadas en tu navegador. Llegan más cada poco — mira las',
		toolTitle: '{name} — Gratis y privado | onlinetools.dev',
		toolMetaSuffix: 'Se ejecuta por completo en tu navegador — sin subir nada, sin registro, funciona sin conexión.',
		runsLocally: 'Se ejecuta localmente',
		runsLocallyTitle:
			'Esta herramienta calcula todo en tu navegador. Lo que introduces nunca se sube.',
		aboutTool: 'Sobre esta herramienta',
		faqHeading: 'Preguntas frecuentes',
		relatedTools: 'Herramientas relacionadas',
		breadcrumbTools: 'herramientas',
		sample: 'Ejemplo',
		line: 'línea',
		output: 'Resultado',
		copy: 'Copiar',
		copied: 'Copiado',
		download: 'Descargar',
		share: 'Compartir',
		linkCopied: 'Enlace copiado',
		continueWith: 'Continuar con',
		suggested: 'sugerido',
		shareTooLarge:
			'El contenido es demasiado grande para una URL — los enlaces compartidos tienen límite para seguir siendo portables. El contenido nunca sale de este equipo.',
		emptyHint: 'El resultado aparece aquí mientras escribes',
		palettePlaceholder: 'Busca herramientas o pega contenido para procesarlo…',
		noMatch: 'Ninguna herramienta coincide',
		navigate: 'navegar',
		open: 'abrir',
		close: 'cerrar',
		detected: 'Detectado',
		chars: 'caracteres',
		shortcutsTitle: 'Atajos de teclado',
		scPalette: 'Abrir la paleta de comandos',
		scCopy: 'Copiar resultado',
		scEsc: 'Cerrar panel / descartar sugerencia',
		scHelp: 'Esta referencia de atajos',
		scPaste: 'Pegado inteligente — detecta el contenido y sugiere herramientas',
		scNav: 'Navegar y confirmar en los paneles'
	},
	tl: {
		direction: 'Dirección',
		encode: 'Codificar',
		decode: 'Decodificar',
		mode: 'Modo',
		count: 'Cantidad',
		lengthLbl: 'Longitud',
		uppercase: 'Mayúsculas',
		lowercase: 'Minúsculas',
		regenerate: 'Regenerar',
		b64InputEnc: 'Texto a codificar',
		b64InputDec: 'Base64 a decodificar',
		b64PhEnc: 'Cualquier texto, unicode incluido',
		b64UrlSafe: 'URL-safe (sin relleno)',
		bcHash: 'Hashear',
		bcVerify: 'Verificar',
		bcHashT: 'Hashear una contraseña',
		bcVerifyT: 'Verificar una contraseña contra un hash',
		bcPassword: 'Contraseña',
		bcCost: 'Factor de coste',
		bcHashLbl: 'Hash bcrypt',
		bcPh: 'se queda en tu navegador',
		bcVersion: 'Versión',
		bcCostShort: 'Coste',
		bcSalt: 'Salt',
		bcNote: 'El hasheo corre en tu navegador — no se transmite nada. El JS del navegador es más lento que bcrypt nativo; toma los tiempos como cota superior.',
		caseInput: 'Texto o identificador (uno por línea)',
		caseEmpty: 'Los nueve estilos aparecen aquí mientras escribes',
		colorInput: 'Color',
		colorFormats: 'Formatos',
		colorRgb: 'Canales RGB',
		colorContrast: 'Contraste de texto (WCAG)',
		cronInput: 'Expresión cron',
		cronEvalIn: 'evaluado en',
		cronNext: 'Próximas 5 ejecuciones',
		cronNone: 'Sin ejecuciones en los próximos 5 años',
		diffOriginal: 'Original',
		diffChanged: 'Modificado',
		diffLbl: 'Diff',
		diffUnchanged: 'sin cambios',
		diffEmpty: 'El diff línea a línea aparece aquí',
		hashInput: 'Texto a hashear',
		hashPh: 'Cualquier texto — los hashes se actualizan al escribir',
		hashHmac: 'Clave secreta HMAC',
		hashOptional: '(opcional)',
		hashHmacPh: 'Déjala vacía para hashes normales',
		hashDigests: 'Resúmenes',
		hashEmpty: 'Los resúmenes se actualizan al escribir',
		hashNote: 'MD5 y SHA-1 se muestran solo para checksums antiguos — usa SHA-256 o superior para cualquier cosa de seguridad.',
		heAll: 'Codificar todo lo no ASCII',
		heNumeric: 'Solo numéricas',
		heInputEnc: 'Texto a escapar',
		heInputDec: 'HTML con entidades',
		imgDrop: 'Suelta una imagen, haz clic para elegirla o pégala desde el portapapeles',
		imgLocal: 'Se queda en tu navegador — no se sube nada',
		imgReplace: 'Suelta, haz clic o pega para reemplazar',
		imgSource: 'Imagen de origen',
		imgOriginal: 'Original',
		imgDimensions: 'Dimensiones',
		imgDownload: 'Descargar {fmt}',
		imgErrNotImage: 'Formato de imagen no reconocido (PNG, JPEG, WebP, GIF, SVG, BMP, ICO, AVIF)',
		imgErrDecode: 'El navegador no pudo decodificar esta imagen',
		imgErrEncode: 'El navegador no pudo codificar esta imagen',
		imgErrFormat: 'Este navegador no puede codificar {fmt} — prueba PNG o JPEG',
		i2bToB64: 'Imagen → Base64',
		i2bFromB64: 'Base64 → imagen',
		i2bInput: 'Data URL o Base64 puro',
		i2bDataUrl: 'Data URL',
		i2bRawB64: 'Base64 puro',
		i2bCss: 'Fondo CSS',
		i2bHtml: 'HTML <img>',
		i2bEncodedSize: 'Tamaño en Base64',
		i2bOverhead: '+{pct}% vs binario',
		i2bNote: 'Insertar la imagen ahorra una petición pero engorda el documento y anula la caché — ideal para iconos y recursos de menos de ~10 KB.',
		icTarget: 'Convertir a',
		icQuality: 'Calidad',
		icConverted: 'Convertida',
		icSmaller: 'más pequeña que la original',
		icLarger: 'más grande que la original',
		icBgNote: 'JPEG no admite transparencia — las zonas transparentes se aplanan sobre blanco.',
		icNote: 'La conversión usa el codificador canvas de tu navegador, así que el tamaño exacto varía ligeramente entre navegadores.',
		fgAppleBg: 'Fondo del icono Apple',
		fgFiles: 'Archivos generados',
		fgHtml: 'Etiquetas <link> HTML',
		fgSmall: 'La fuente es de {px}px — los iconos mayores se ampliarán y pueden verse borrosos',
		fgNote: 'El ICO empaqueta 16, 32 y 48 px. El icono táctil de Apple no admite transparencia, así que se aplana sobre el fondo elegido; los iconos PWA conservan su alfa. Las fuentes no cuadradas se recortan al centro.',
		irBy: 'Redimensionar por',
		irWidth: 'Ancho',
		irHeight: 'Alto',
		irPercent: 'Porcentaje',
		irFormat: 'Formato',
		irKeep: 'Mantener',
		irResized: 'Redimensionada',
		irScale: 'Escala',
		irNote: 'Reducir usa suavizado de alta calidad. Ampliar no inventa detalle — espera borrosidad más allá de 2×.',
		jcInput: 'Array JSON de objetos',
		jcDelimiter: 'Delimitador',
		jcComma: 'Coma',
		jcSemicolon: 'Punto y coma (Excel europeo)',
		jcTab: 'Tabulador',
		jfInput: 'Entrada JSON',
		jfIndent: 'Sangría',
		jfIndentation: 'Sangría',
		jfSp2: '2 espacios',
		jfSp4: '4 espacios',
		jfTabs: 'Tabuladores',
		jfMin: 'Minificado — sin espacios',
		jfSortKeys: 'Ordenar claves',
		jfText: 'Texto',
		jfTree: 'Árbol',
		jfTreeHint: 'Pasa el cursor por un nodo para copiar su JSONPath — pruébalo en el',
		jfTreeLink: 'probador de JSONPath',
		jpExpr: 'Expresión JSONPath',
		jpDoc: 'Documento JSON',
		jpMatches: 'Coincidencias',
		jpResults: 'Valores resultantes',
		jtInput: 'Ejemplo JSON',
		jtRoot: 'Nombre del tipo raíz',
		jtNote: 'Inferido de este único ejemplo — marca campos opcionales y amplía los nullables donde tus datos varíen.',
		jyFrom: 'De',
		jySource: 'Formato de origen',
		jyAutoT: 'Detectar el formato de origen por el contenido',
		jyTarget: 'Formato de destino',
		jyInput: 'Entrada',
		jyUnknown: 'formato desconocido',
		jwtAnatomy: 'Anatomía del token',
		jwtHeader: 'cabecera',
		jwtPayload: 'payload',
		jwtSignature: 'firma (sin verificar)',
		jwtIssued: 'Emitido',
		jwtExpires: 'Expira',
		jwtNotBefore: 'No antes de',
		jwtLifetime: 'Vida útil',
		jwtNote: 'Decodificar solo lee el token — no verifica la firma. Verifica las firmas en el servidor con las claves del emisor.',
		loremUnit: 'Unidad',
		loremWords: 'Palabras',
		loremSentences: 'Frases',
		loremParagraphs: 'Párrafos',
		loremClassic: 'Empezar con «Lorem ipsum…»',
		pwWeak: 'Débil',
		pwFair: 'Aceptable',
		pwStrong: 'Fuerte',
		pwExcellent: 'Excelente',
		pwNoLookalikes: 'Sin caracteres confusos (0O1lI)',
		pwEntropy: 'Entropía',
		pwBits: 'bits',
		pwNote: '≥ 80 bits resiste el cracking offline de hashes rápidos; ≥ 100 bits es prácticamente inadivinable.',
		pwOut: 'Contraseñas',
		pwCrypto: 'Generadas con crypto.getRandomValues, solo en tu navegador. No se guarda ni se transmite nada.',
		qrContent: 'Contenido',
		qrEc: 'Corrección de errores',
		qrEcT: 'Sobrevive a un {pct} de daño',
		qrSvg: 'SVG (vectorial, imprenta)',
		qrPng: 'PNG (chat, diapositivas)',
		qrNote: 'El contenido se codifica directamente — sin redirecciones, nada caduca, sin rastreo de escaneos.',
		rxPattern: 'Patrón',
		rxTest: 'Texto de prueba',
		rxTestPh: 'Pega texto para probar el patrón',
		rxHighlighted: 'Resaltado',
		rxMatches: 'Coincidencias',
		rxMatched: 'Texto coincidente',
		slugInput: 'Título (uno por línea)',
		slugSep: 'Separador',
		slugHyphen: 'Guion',
		slugUnderscore: 'Guion bajo',
		slugMax: 'Longitud máxima',
		slugOut: 'Slug',
		slInput: 'Líneas',
		slPh: 'una por línea',
		slSort: 'Orden',
		slKeep: 'Mantener orden',
		slAsc: 'Ascendente',
		slDesc: 'Descendente',
		slNatural: 'Natural — números en orden',
		slLength: 'Por longitud',
		slShuffle: 'Barajar',
		slDedupe: 'Deduplicar',
		slIgnoreCase: 'Ignorar mayúsculas',
		slTrim: 'Recortar espacios',
		slDropEmpty: 'Quitar vacías',
		tsInput: 'Timestamp o fecha',
		tsNow: 'Hora unix actual:',
		tsNowT: 'Usar la hora actual como entrada',
		tsRelative: 'Relativo',
		tsUnixS: 'Segundos unix',
		tsUnixMs: 'Milisegundos unix',
		tsZones: 'Entre zonas horarias',
		tsNote: 'El marcador muestra la hora local de cada zona en una franja de 24 h — los extremos atenuados son 21:00–07:00.',
		uaInput: 'Cadena User-Agent',
		uaBrowser: 'Navegador',
		uaEngine: 'Motor',
		uaOs: 'Sistema operativo',
		uaDevice: 'Dispositivo',
		uaNote: 'El botón «Ejemplo» inserta el User-Agent de tu propio navegador. Usa detección de características, no UA sniffing, para decisiones en runtime.',
		uniInput: 'Texto a inspeccionar',
		uniPh: 'Pega lo que sea — los caracteres invisibles se ven aquí',
		uniGraphemes: 'Grafemas',
		uniGraphemesHint: 'lo que ve el usuario',
		uniCodePoints: 'Puntos de código',
		uniUtf16: 'Unidades UTF-16',
		uniUtf16Hint: 'JS .length',
		uniUtf8: 'Bytes UTF-8',
		uniLimit: 'Mostrando los primeros 300 caracteres.',
		upInput: 'URL',
		upProtocol: 'Protocolo',
		upHost: 'Host',
		upHostname: 'Nombre de host',
		upPort: 'Puerto',
		upPath: 'Ruta',
		upFragment: 'Fragmento',
		upOrigin: 'Origen',
		upQuery: 'Parámetros de consulta',
		upDefault: '(por defecto)',
		upNone: '(ninguno)',
		upEmpty: 'Los componentes de la URL aparecen aquí',
		urlComponent: 'Modo componente (encodeURIComponent)',
		urlInputDec: 'Texto codificado a decodificar',
		uuidOut: 'IDs generados',
		uuidFormat: 'Formato de ID',
		uuidHintV4: 'aleatorio',
		uuidHintV7: 'ordenado por tiempo',
		uuidHintUlid: 'ordenado por tiempo, base32',
		uuidHintNano: 'corto, URL-safe',
		uuidNote: 'Generados con crypto.getRandomValues — criptográficamente seguros, creados en tu navegador, sin registro alguno.',
		wcWords: 'Palabras',
		wcChars: 'Caracteres',
		wcCharsHint: '{n} sin espacios',
		wcReading: 'Tiempo de lectura',
		wcReadingHint: 'a 220 ppm',
		wcLines: 'Líneas',
		wcSentences: 'Frases',
		wcParagraphs: 'Párrafos',
		wcAvg: 'Longitud media de palabra',

		// Shared formatter controls
		fmtFormat: 'Formatear',
		fmtMinify: 'Minificar',

		// SQL formatter
		sqlInput: 'Sentencia(s) SQL',
		sqlDialect: 'Dialecto',
		sqlKeywords: 'Palabras clave',
		sqlKeep: 'Mantener',

		// XML formatter
		xmlInput: 'Documento XML',

		// XML ↔ JSON
		xjInputXml: 'Documento XML',
		xjInputJson: 'Objeto JSON',
		xjNote: 'Los atributos se convierten en claves "@_nombre" y el texto que convive con atributos pasa a "#text", de modo que la conversión hace el viaje de ida y vuelta. El orden de los elementos entre hermanos mixtos no se conserva — XML permite repeticiones, los objetos JSON no.',

		// CSV → JSON
		cjInput: 'Datos CSV / TSV',
		cjAuto: 'Auto',
		cjPipe: 'Barra vertical',
		cjHeader: 'La primera fila es cabecera',
		cjTyped: 'Valores tipados',

		// Markdown
		mdPreview: 'Vista previa',
		mdNote: 'La vista previa se sanea antes de renderizarse, así que los scripts y manejadores de eventos del contenido pegado o compartido no pueden ejecutarse. El cuadro de salida HTML lleva la conversión sin procesar.',

		// Code formatters
		htmlInput: 'Código HTML',
		cssInput: 'Código CSS',
		jsInput: 'Código JavaScript',

		// String escape
		escEscape: 'Escapar',
		escUnescape: 'Desescapar',
		escDialect: 'Dialecto',
		escInputEsc: 'Texto a escapar',
		escInputUnesc: 'Texto escapado',

		// Number base
		nbInput: 'Número',
		nbFrom: 'De',
		nbAutoT: 'Detectar por el prefijo 0x / 0o / 0b; decimal en caso contrario',
		nbGroup: 'Agrupar dígitos',
		nbBase: 'Base',
		nbBin: 'Binario',
		nbOct: 'Octal',
		nbDec: 'Decimal',
		nbHex: 'Hex',
		nbBits: 'bits',

		// Text ↔ hex/binary
		hbFormat: 'Bytes como',
		hbSep: 'Separador',
		hbSpace: 'Espacio',
		hbNone: 'Ninguno',
		hbColon: 'Dos puntos',
		hbInputEnc: 'Texto a codificar',
		hbInputDec: 'Bytes a decodificar',

		// JSON Schema
		schInfer: 'Inferir esquema',
		schValidate: 'Validar',
		schInferT: 'Generar un esquema a partir de un JSON de ejemplo',
		schValidateT: 'Comprobar JSON contra un esquema',
		schData: 'Datos JSON',
		schSchema: 'JSON Schema',
		schViolations: 'violaciones',
		schValid: 'Válido — los datos cumplen el esquema',
		schResult: 'Resultado de la validación',

		// EXIF
		exTags: '{n} campos de metadatos',
		exNone: 'Sin metadatos — este archivo ya está limpio',
		exStrip: 'Descargar copia limpia',
		exGps: 'Ubicación GPS incrustada',
		exMap: 'Ver en el mapa',
		exNote: 'La lectura y la limpieza ocurren por completo en tu navegador — la foto nunca se sube. La limpieza elimina los segmentos de metadatos byte a byte sin recodificar, así que los píxeles y la calidad quedan intactos.',

		// Cron builder
		crBuilder: 'Constructor',
		crMinute: 'Minuto',
		crHour: 'Hora',
		crDom: 'Día del mes',
		crMonth: 'Mes',
		crDow: 'Día de la semana',
		crEvery: 'Cada',
		crStep: 'Cada N',
		crAt: 'Específico',
		crUse: 'Usar expresión',

		// JWT sign & verify
		jwtDecode: 'Decodificar',
		jwtSign: 'Firmar',
		jwtVerify: 'Verificar',
		jwtAlg: 'Algoritmo',
		jwtPayloadLbl: 'Payload (objeto JSON)',
		jwtSecret: 'Secreto',
		jwtPrivKey: 'Clave privada (PEM PKCS#8)',
		jwtPubKey: 'Secreto (HS) o clave pública PEM (RS/ES)',
		jwtSignNote: 'La firma corre sobre WebCrypto en tu navegador — la clave nunca sale de esta página. Para los algoritmos HS usa un secreto aleatorio largo; los cortos ceden a la fuerza bruta se firmen donde se firmen.',
		jwtVerifyNote: 'La verificación comprueba la firma contra la clave que proporcionas, localmente. No consulta endpoints JWKS ni valida claims como aud/iss — hazlo en el servidor.',

		// Timestamp extras
		tsDiff: 'Diferencia entre dos fechas'
	},
	categories: {
		encoding: 'Codificación',
		json: 'JSON y datos',
		text: 'Texto',
		time: 'Fecha y hora',
		generators: 'Generadores',
		crypto: 'Hashes y cripto',
		web: 'Web',
		image: 'Imagen',
		code: 'Código y marcado',
		privacy: 'Privacidad'
	},
	tools: {
		'json-formatter': {
			name: 'Formateador y validador de JSON',
			description: 'Formatea, valida y minifica JSON con errores ubicados en línea:columna'
		},
		'base64-decode': {
			name: 'Codificar / decodificar Base64',
			description: 'Convierte texto a Base64 y viceversa, con variante URL-safe'
		},
		'timestamp-converter': {
			name: 'Conversor de timestamps Unix',
			description: 'Convierte timestamps Unix a fechas legibles y al revés, con tiempo relativo'
		},
		'jwt-decoder': {
			name: 'Decodificador de JWT',
			description: 'Decodifica cabecera y payload del JWT y comprueba la expiración — sin conexión'
		},
		'regex-tester': {
			name: 'Probador de regex',
			description: 'Prueba expresiones regulares con resaltado de coincidencias y grupos en vivo'
		},
		'diff-checker': {
			name: 'Comparador de textos (diff)',
			description: 'Compara dos textos línea a línea y ve adiciones y eliminaciones'
		},
		'url-encode-decode': {
			name: 'Codificar / decodificar URL',
			description: 'Codifica o decodifica componentes de URL y cadenas de consulta'
		},
		'url-parser': {
			name: 'Analizador de URL',
			description: 'Descompón una URL en protocolo, host, ruta y parámetros'
		},
		'uuid-generator': {
			name: 'Generador de UUID',
			description: 'Genera UUID v4/v7, ULID y Nano ID — uno a uno o en lote'
		},
		'hash-generator': {
			name: 'Generador de hashes',
			description: 'MD5, SHA-1, SHA-256, SHA-512 y HMAC — calculados en tu navegador'
		},
		'color-converter': {
			name: 'Conversor de colores',
			description: 'Convierte colores entre HEX, RGB, HSL y OKLCH con vista previa'
		},
		'case-converter': {
			name: 'Conversor de mayúsculas/minúsculas',
			description: 'Cambia entre camelCase, snake_case, kebab-case, PascalCase y más'
		},
		'word-counter': {
			name: 'Contador de palabras',
			description: 'Cuenta palabras, caracteres, frases, bytes y tiempo de lectura al escribir'
		},
		'lorem-ipsum-generator': {
			name: 'Generador de Lorem Ipsum',
			description: 'Genera palabras, frases o párrafos de relleno para maquetas'
		},
		'slug-generator': {
			name: 'Generador de slugs',
			description: 'Convierte títulos en slugs de URL limpios, con separador y longitud a elegir'
		},
		'sort-lines': {
			name: 'Ordenar y deduplicar líneas',
			description: 'Ordena líneas alfabética o naturalmente y elimina duplicados y vacías'
		},
		'html-entities': {
			name: 'Codificar / decodificar entidades HTML',
			description: 'Escapa texto para HTML o convierte entidades &amp; de vuelta a caracteres'
		},
		'unicode-inspector': {
			name: 'Inspector de caracteres Unicode',
			description: 'Ve puntos de código, bytes UTF-8/UTF-16 y escapes de cada carácter'
		},
		'cron-parser': {
			name: 'Analizador de expresiones cron',
			description: 'Explica cualquier programación cron en lenguaje llano con las próximas ejecuciones'
		},
		'password-generator': {
			name: 'Generador de contraseñas',
			description: 'Contraseñas aleatorias con opciones de caracteres y un medidor de entropía honesto'
		},
		'qr-code-generator': {
			name: 'Generador de códigos QR',
			description: 'Genera códigos QR nítidos en SVG o PNG — sin marca de agua, sin subir nada'
		},
		'json-to-yaml': {
			name: 'Conversor JSON ↔ YAML ↔ TOML',
			description: 'Convierte entre JSON, YAML y TOML con detección automática de formato'
		},
		'json-to-csv': {
			name: 'Conversor JSON ↔ CSV',
			description: 'Aplana JSON a CSV, o parsea CSV de vuelta a objetos JSON tipados'
		},
		'json-to-typescript': {
			name: 'JSON → tipos TypeScript',
			description: 'Infiere interfaces TypeScript a partir de un ejemplo JSON al instante'
		},
		'jsonpath-tester': {
			name: 'Probador de JSONPath',
			description: 'Consulta JSON con expresiones JSONPath y ve cada coincidencia con su ruta'
		},
		'bcrypt-generator': {
			name: 'Hash y verificación bcrypt',
			description: 'Hashea contraseñas con bcrypt y verifica hashes contra texto plano'
		},
		'user-agent-parser': {
			name: 'Analizador de User-Agent',
			description: 'Identifica navegador, motor, SO y dispositivo desde una cadena User-Agent'
		},
		'image-to-base64': {
			name: 'Conversor imagen ↔ Base64',
			description: 'Convierte imágenes en data URLs Base64 y viceversa — con fragmentos CSS y HTML'
		},
		'image-converter': {
			name: 'Conversor de formato de imagen',
			description: 'Convierte imágenes entre PNG, JPEG y WebP con control de calidad'
		},
		'image-resizer': {
			name: 'Redimensionador de imágenes',
			description: 'Redimensiona imágenes por ancho, alto o porcentaje — nítido y totalmente offline'
		},
		'favicon-generator': {
			name: 'Generador de favicon',
			description: 'Convierte cualquier imagen en favicon.ico más el set completo de iconos PNG y manifest'
		},
		'sql-formatter': {
			name: 'Formateador de SQL',
			description: 'Formatea SQL con palabras clave según el dialecto, o minifícalo a una línea'
		},
		'xml-formatter': {
			name: 'Formateador y validador de XML',
			description: 'Embellece, minifica y valida XML con posiciones de error exactas'
		},
		'xml-to-json': {
			name: 'Conversor XML ↔ JSON',
			description: 'Convierte documentos XML a JSON y de vuelta, atributos incluidos'
		},
		'markdown-to-html': {
			name: 'Conversor Markdown ↔ HTML',
			description: 'Renderiza Markdown a HTML con vista previa en vivo, o convierte HTML de vuelta a Markdown'
		},
		'html-formatter': {
			name: 'Formateador y minificador de HTML',
			description: 'Embellece HTML desordenado o minifícalo para producción'
		},
		'css-formatter': {
			name: 'Formateador y minificador de CSS',
			description: 'Embellece CSS para leerlo o minifícalo para publicarlo'
		},
		'js-formatter': {
			name: 'Formateador y minificador de JavaScript',
			description: 'Embellece JavaScript o minifícalo con compresión y renombrado reales'
		},
		'string-escape': {
			name: 'Escapador de cadenas',
			description: 'Escapa o desescapa cadenas para JSON, JavaScript, Java, XML, SQL y CSV'
		},
		'number-base-converter': {
			name: 'Conversor de bases numéricas',
			description: 'Convierte números entre binario, octal, decimal, hex y cualquier base hasta 36'
		},
		'text-to-hex': {
			name: 'Conversor texto ↔ hex / binario',
			description: 'Convierte texto en bytes hex, binarios o decimales y decodifica volcados de bytes'
		},
		'json-schema-validator': {
			name: 'Validador y generador de JSON Schema',
			description: 'Valida JSON contra un esquema, o infiere un esquema a partir de datos de ejemplo'
		},
		'exif-viewer': {
			name: 'Visor y eliminador de EXIF',
			description: 'Mira qué metadatos llevan tus fotos — y elimínalos sin recodificar'
		}
	}
};

export default es;
