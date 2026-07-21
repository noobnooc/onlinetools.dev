import type { Messages } from '$lib/i18n';

const fr: Messages = {
	code: 'fr',
	name: 'Français',
	ui: {
		search: 'Rechercher',
		overview: 'Accueil',
		toggleTheme: 'Changer de thème',
		themeSystem: 'Suivre le système',
		themeDark: 'Sombre',
		themeLight: 'Clair',
		themeTitle: 'Thème : {mode} — cliquer pour changer',
		footerPrivacy: 'Tout s’exécute dans votre navigateur — rien de ce que vous collez n’est envoyé',
		allTools: 'Tous les outils',
		changelog: 'Journal des modifications',
		releaseDate: 'Date de version',
		language: 'Langue',
		openNav: 'Ouvrir la navigation',
		searchTools: 'Rechercher des outils',
		homeTitle: 'onlinetools.dev — Outils de développement qui tournent dans votre navigateur',
		homeMetaDescription:
			'Des outils de développement rapides, pensés pour le clavier, qui s’exécutent entièrement dans votre navigateur. Formatez du JSON, décodez JWT et Base64, convertissez des timestamps, testez des regex — sans envoi, sans inscription, fonctionne hors ligne.',
		homeEyebrow: '{n} outils · local d’abord',
		homeHeading: 'Outils de développement qui tournent dans votre navigateur',
		homeSub: 'Aucun envoi, aucune inscription, aucune attente.',
		pasteToDetect: 'collez pour détecter',
		worksOffline: 'fonctionne hors ligne',
		shortcuts: 'raccourcis',
		searchPlaceholder: 'Recherchez parmi {n} outils, ou collez n’importe quoi…',
		startHere: 'Commencer ici',
		smartPaste: 'Collage intelligent',
		smartPasteDesc:
			'Collez n’importe quoi, n’importe où — le type de contenu est détecté et le bon outil est à une touche.',
		keyboardFirst: 'Le clavier d’abord, de bout en bout',
		keyboardFirstDesc: 'Trouvez, exécutez, copiez et partagez sans toucher la souris.',
		kbdAnyTool: 'n’importe quel outil',
		kbdCopyResult: 'copier le résultat',
		kbdConfirm: 'valider',
		kbdAllShortcuts: 'tous les raccourcis',
		toolsTitle: 'Tous les outils de développement — onlinetools.dev',
		toolsMetaDescription:
			'Parcourez tous les outils d’onlinetools.dev : JSON, YAML, Base64, JWT, timestamps, cron, regex, diff, UUID, hachage, QR codes et plus — tout s’exécute localement dans votre navigateur.',
		toolsBlurb: '{n} outils, tous calculés dans votre navigateur. D’autres arrivent régulièrement — voir le',
		toolTitle: '{name} — Gratuit et privé | onlinetools.dev',
		toolMetaSuffix: 'S’exécute entièrement dans votre navigateur — sans envoi, sans inscription, fonctionne hors ligne.',
		runsLocally: 'Exécution locale',
		runsLocallyTitle:
			'Cet outil calcule tout dans votre navigateur. Votre saisie n’est jamais envoyée.',
		aboutTool: 'À propos de cet outil',
		faqHeading: 'Questions fréquentes',
		relatedTools: 'Outils associés',
		breadcrumbTools: 'outils',
		sample: 'Exemple',
		line: 'ligne',
		output: 'Résultat',
		copy: 'Copier',
		copied: 'Copié',
		download: 'Télécharger',
		share: 'Partager',
		linkCopied: 'Lien copié',
		continueWith: 'Continuer avec',
		suggested: 'suggéré',
		shareTooLarge:
			'Contenu trop volumineux pour une URL — les liens de partage sont limités pour rester portables. Le contenu ne quitte jamais cette machine.',
		emptyHint: 'Le résultat apparaît ici pendant la saisie',
		palettePlaceholder: 'Recherchez des outils, ou collez du contenu à traiter…',
		noMatch: 'Aucun outil correspondant',
		navigate: 'naviguer',
		open: 'ouvrir',
		close: 'fermer',
		detected: 'Détecté',
		chars: 'caractères',
		shortcutsTitle: 'Raccourcis clavier',
		scPalette: 'Ouvrir la palette de commandes',
		scCopy: 'Copier le résultat',
		scEsc: 'Fermer le panneau / ignorer la suggestion',
		scHelp: 'Cette référence des raccourcis',
		scPaste: 'Collage intelligent — détecte le contenu et suggère des outils',
		scNav: 'Naviguer et valider dans les panneaux'
	},
	categories: {
		encoding: 'Encodage',
		json: 'JSON et données',
		text: 'Texte',
		time: 'Date et heure',
		generators: 'Générateurs',
		crypto: 'Hachage et crypto',
		web: 'Web'
	},
	tools: {
		'json-formatter': {
			name: 'Formateur et validateur JSON',
			description: 'Formatez, validez et minifiez du JSON avec des erreurs localisées ligne:colonne'
		},
		'base64-decode': {
			name: 'Encodage / décodage Base64',
			description: 'Convertissez du texte en Base64 et inversement, variante URL-safe incluse'
		},
		'timestamp-converter': {
			name: 'Convertisseur de timestamps Unix',
			description: 'Convertissez les timestamps Unix en dates lisibles et inversement, avec temps relatif'
		},
		'jwt-decoder': {
			name: 'Décodeur JWT',
			description: 'Décodez l’en-tête et la charge utile d’un JWT, vérifiez l’expiration — hors ligne'
		},
		'regex-tester': {
			name: 'Testeur de regex',
			description: 'Testez des expressions régulières avec surlignage des correspondances et groupes'
		},
		'diff-checker': {
			name: 'Comparateur de textes (diff)',
			description: 'Comparez deux textes ligne par ligne et voyez ajouts et suppressions'
		},
		'url-encode-decode': {
			name: 'Encodage / décodage d’URL',
			description: 'Encodez ou décodez en pourcent les composants d’URL et chaînes de requête'
		},
		'url-parser': {
			name: 'Analyseur d’URL',
			description: 'Décomposez une URL en protocole, hôte, chemin et paramètres'
		},
		'uuid-generator': {
			name: 'Générateur d’UUID',
			description: 'Générez des UUID v4/v7, ULID et Nano ID — à l’unité ou en lot'
		},
		'hash-generator': {
			name: 'Générateur de hachages',
			description: 'MD5, SHA-1, SHA-256, SHA-512 et HMAC — calculés dans votre navigateur'
		},
		'color-converter': {
			name: 'Convertisseur de couleurs',
			description: 'Convertissez des couleurs entre HEX, RGB, HSL et OKLCH avec aperçu en direct'
		},
		'case-converter': {
			name: 'Convertisseur de casse',
			description: 'Passez de camelCase à snake_case, kebab-case, PascalCase et plus'
		},
		'word-counter': {
			name: 'Compteur de mots',
			description: 'Comptez mots, caractères, phrases, octets et temps de lecture en direct'
		},
		'lorem-ipsum-generator': {
			name: 'Générateur de Lorem Ipsum',
			description: 'Générez des mots, phrases ou paragraphes de remplissage pour vos maquettes'
		},
		'slug-generator': {
			name: 'Générateur de slugs',
			description: 'Transformez des titres en slugs d’URL propres, séparateur et longueur au choix'
		},
		'sort-lines': {
			name: 'Trier et dédupliquer les lignes',
			description: 'Triez les lignes par ordre alphabétique ou naturel, supprimez doublons et lignes vides'
		},
		'html-entities': {
			name: 'Encodage / décodage d’entités HTML',
			description: 'Échappez du texte pour le HTML ou reconvertissez les entités &amp; en caractères'
		},
		'unicode-inspector': {
			name: 'Inspecteur de caractères Unicode',
			description: 'Voyez points de code, octets UTF-8/UTF-16 et échappements de chaque caractère'
		},
		'cron-parser': {
			name: 'Analyseur d’expressions cron',
			description: 'Expliquez toute planification cron en langage clair avec les prochaines exécutions'
		},
		'password-generator': {
			name: 'Générateur de mots de passe',
			description: 'Mots de passe aléatoires avec options de caractères et mesure d’entropie honnête'
		},
		'qr-code-generator': {
			name: 'Générateur de QR codes',
			description: 'Générez des QR codes nets en SVG ou PNG — sans filigrane, sans envoi'
		},
		'json-to-yaml': {
			name: 'Convertisseur JSON ↔ YAML ↔ TOML',
			description: 'Convertissez entre JSON, YAML et TOML avec détection automatique du format'
		},
		'json-to-csv': {
			name: 'Convertisseur JSON → CSV',
			description: 'Aplatissez des tableaux d’objets JSON en CSV avec un échappement correct'
		},
		'json-to-typescript': {
			name: 'JSON → types TypeScript',
			description: 'Déduisez des interfaces TypeScript à partir d’un exemple JSON, instantanément'
		},
		'jsonpath-tester': {
			name: 'Testeur JSONPath',
			description: 'Interrogez du JSON avec des expressions JSONPath et voyez chaque correspondance'
		},
		'bcrypt-generator': {
			name: 'Hachage et vérification bcrypt',
			description: 'Hachez des mots de passe avec bcrypt et vérifiez les hachages'
		},
		'user-agent-parser': {
			name: 'Analyseur de User-Agent',
			description: 'Identifiez navigateur, moteur, OS et appareil depuis une chaîne User-Agent'
		}
	}
};

export default fr;
