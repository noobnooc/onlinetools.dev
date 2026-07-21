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
	categories: {
		encoding: 'Codificación',
		json: 'JSON y datos',
		text: 'Texto',
		time: 'Fecha y hora',
		generators: 'Generadores',
		crypto: 'Hashes y cripto',
		web: 'Web'
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
			name: 'Conversor JSON → CSV',
			description: 'Aplana arrays de objetos JSON a CSV con el escapado correcto'
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
		}
	}
};

export default es;
