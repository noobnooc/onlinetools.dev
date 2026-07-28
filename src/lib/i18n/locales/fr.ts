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
		changelogMetaDescription:
			"Nouveautés d'onlinetools.dev — nouveaux outils, fonctionnalités et correctifs, le tout exécuté localement dans votre navigateur.",
		releaseDate: 'Date de version',
		language: 'Langue',
		openNav: 'Ouvrir la navigation',
		searchTools: 'Rechercher des outils',

		// About / Why page
		about: 'À propos',
		aboutTitle: 'Pourquoi onlinetools.dev — local d’abord, sans pistage, vérifiable | onlinetools.dev',
		aboutMetaDescription:
			'Pourquoi onlinetools.dev existe : chaque outil s’exécute dans votre navigateur, rien de ce que vous collez n’est envoyé, aucune publicité, aucun traceur, aucune connexion — et un indicateur en direct vous permet de le vérifier vous-même.',
		aboutEyebrow: 'pourquoi ce site · confiance',
		aboutVerifyHeading: 'Ne me croyez pas sur parole',
		aboutVerifyHint:
			'Tapez ou collez n’importe quoi ci-dessous. Le compteur reste à zéro — chaque frappe est traitée ici, sur votre machine.',
		aboutRequestsLabel: 'Requêtes réseau depuis l’ouverture de cette page',
		aboutRequestsNote:
			'La seule chose qui puisse faire bouger ce nombre, c’est ouvrir un autre outil, ce qui charge le code du site depuis ce même domaine. Ce que vous collez, jamais.',
		aboutVerifyPlaceholder: 'Tapez ou collez n’importe quoi — rien ne quitte votre navigateur…',
		aboutOfflineReady: 'Prêt hors ligne',
		aboutOfflineCaching: 'Mise en cache…',
		aboutDevtools:
			'Vous voulez une preuve plus solide ? Ouvrez les outils de développement de votre navigateur, allez dans l’onglet Network (Réseau), puis collez. Vous verrez qu’il ne se passe rien.',
		aboutViewSource: 'Voir le code',
		aboutEditPage: 'Modifier cette page',
		aboutBuiltBy: 'Créé par',

		// About / Why page — the manifesto body (localized)
		aboutH1: 'Une calculatrice ne devrait pas téléphoner à la maison.',
		aboutLead:
			'La plupart des sites d’« outils en ligne » sont un mur de publicités autour d’un champ de texte qui envoie discrètement ce que vous collez vers un serveur que vous ne verrez jamais. J’en ai eu assez de décoder un JWT sur une page quelconque et de réaliser, une seconde trop tard, que je venais de confier mon jeton à un inconnu. onlinetools.dev est ma réponse : les mêmes outils qu’au quotidien, sauf que l’ordinateur qui fait le travail est celui déjà devant vous.',
		aboutS1Head: 'Tout s’exécute sur votre machine',
		aboutS1Body:
			'Chaque outil ici n’est que du calcul dans votre navigateur — aucun aller-retour, aucun serveur, nulle part où téléverser quoi que ce soit. Votre JSON, vos jetons d’accès, ce {env} que vous comptiez nettoyer d’abord : ils vont de votre presse-papiers à votre écran et s’arrêtent là. Je l’ai fait ainsi non parce que c’est moins cher (ça l’est) mais parce que vos données ne me regardent pas.',
		aboutS2Head: 'Pas de pub. Pas de traqueurs. Pas de compte.',
		aboutS2Body:
			'Aucun script d’analyse ne compte vos frappes, aucun bandeau de cookies (il n’y a pas de cookies à accepter), aucun « connectez-vous pour continuer », aucune offre payante qui attend trois étapes plus loin. Je ne sais vraiment pas qui vous êtes ni ce que vous collez, et c’est tout l’intérêt : un outil doit faire son travail puis vous oublier dès que vous fermez l’onglet.',
		aboutS3Head: 'Ça marche quand le réseau ne marche plus',
		aboutS3Body:
			'Chargez une page une fois et elle est à vous. Tout le site est statique et mis en cache par un service worker, donc dans un avion, dans le métro ou derrière un proxy d’entreprise verrouillé, les outils continuent de tourner. Le mode avion est un très bon endroit pour formater du JSON.',
		aboutS4Head: 'Rapide, et sans vous gêner',
		aboutS4Body:
			'Pas d’écran d’accueil, pas d’« acceptez nos conditions », aucune fenêtre entre vous et le travail. Appuyez sur {kbd} pour rejoindre n’importe quel outil, collez quelque chose et le bon apparaît de lui-même, et chaque résultat est à une touche de votre presse-papiers. Le clavier d’abord, de bout en bout.',
		aboutVerifyIntro:
			'Les promesses de confidentialité ne coûtent rien — chaque site dit « respecter votre vie privée » en chemin pour vous vendre. Voici donc quelque chose à vérifier plutôt qu’à croire. Ce compteur surveille en direct l’activité réseau de votre propre navigateur :',
		aboutBugLine:
			'Si un outil envoyait un jour vos données là où il ne faut pas, c’est un bug, pas un modèle économique — {issue} et je corrige.',
		aboutBugLink: 'ouvrez un ticket',

		// Favorites (stored locally in this browser)
		favorites: 'Favoris',
		favoriteAdd: 'Ajouter aux favoris',
		favoriteRemove: 'Retirer des favoris',
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

		// Paste hero (homepage)
		pasteHeroHeading: 'Collez n’importe quoi — obtenez le bon outil instantanément',
		pasteHeroPlaceholder: 'Collez un JWT, du JSON, un timestamp Unix, une couleur, une URL, une image…',
		tryLabel: 'Essayez',
		plainText: 'Texte brut',
		noMatchHint: 'Aucune correspondance exacte — choisissez un outil texte ci-dessous ou cherchez partout',
		runHint: 'exécuter',
		newlineHint: 'nouvelle ligne',
		clearHint: 'effacer',

		// Pipeline (tool chains)
		chainNavLabel: 'Pipeline',
		chainNew: 'Nouveau',
		chainSteps: 'Étapes',
		chainMoreRecipes: 'Plus de recettes',
		chainTitle: 'Pipeline d’outils — enchaînez des outils pour développeurs dans votre navigateur | onlinetools.dev',
		chainMetaDescription:
			'Enchaînez des outils pour développeurs dans un pipeline : décodez, transformez et extrayez en un seul flux. Chaque étape alimente la suivante, tout s’exécute dans votre navigateur et la recette complète tient dans un lien partageable.',
		chainEyebrow: 'atelier · local-first',
		chainHeading: 'Pipeline',
		chainSub: 'Enchaînez des outils en une recette : chaque étape alimente la suivante. Tout s’exécute dans votre navigateur.',
		chainInputPlaceholder: 'Collez ou saisissez l’entrée de départ…',
		chainAddStep: 'Ajouter une étape',
		chainSearchSteps: 'Rechercher des étapes…',
		chainStarters: 'Exemples',
		chainEmpty: 'Ajoutez une étape : chaque étape alimente la suivante.',
		chainHomeCta: 'Enchaînez des outils en un pipeline',
		chainHomeCtaSub: 'Reliez la sortie d’un outil au suivant : décodez, transformez et extrayez en un seul flux.',
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
	tl: {
		direction: 'Sens',
		encode: 'Encoder',
		decode: 'Décoder',
		mode: 'Mode',
		count: 'Nombre',
		lengthLbl: 'Longueur',
		uppercase: 'Majuscules',
		lowercase: 'Minuscules',
		regenerate: 'Régénérer',
		b64InputEnc: 'Texte à encoder',
		b64InputDec: 'Base64 à décoder',
		b64PhEnc: 'N’importe quel texte, unicode compris',
		b64UrlSafe: 'URL-safe (sans padding)',
		bcHash: 'Hacher',
		bcVerify: 'Vérifier',
		bcHashT: 'Hacher un mot de passe',
		bcVerifyT: 'Vérifier un mot de passe contre un hash',
		bcPassword: 'Mot de passe',
		bcCost: 'Facteur de coût',
		bcHashLbl: 'Hash bcrypt',
		bcPh: 'reste dans votre navigateur',
		bcVersion: 'Version',
		bcCostShort: 'Coût',
		bcSalt: 'Sel',
		bcNote: 'Le hachage s’exécute dans votre navigateur — rien n’est transmis. Le JS du navigateur est plus lent que bcrypt natif ; considérez les temps comme une borne haute.',
		caseInput: 'Texte ou identifiant (un par ligne)',
		caseEmpty: 'Les neuf styles apparaissent ici pendant la saisie',
		colorInput: 'Couleur',
		colorFormats: 'Formats',
		colorRgb: 'Canaux RGB',
		colorContrast: 'Contraste du texte (WCAG)',
		cronInput: 'Expression cron',
		cronEvalIn: 'évalué en',
		cronNext: '5 prochaines exécutions',
		cronNone: 'Aucune exécution dans les 5 prochaines années',
		diffOriginal: 'Original',
		diffChanged: 'Modifié',
		diffLbl: 'Diff',
		diffUnchanged: 'inchangées',
		diffEmpty: 'Le diff ligne par ligne apparaît ici',
		hashInput: 'Texte à hacher',
		hashPh: 'N’importe quel texte — les hachés se mettent à jour en direct',
		hashHmac: 'Clé secrète HMAC',
		hashOptional: '(optionnel)',
		hashHmacPh: 'Laisser vide pour des hachés simples',
		hashDigests: 'Empreintes',
		hashEmpty: 'Les empreintes se mettent à jour en direct',
		hashNote: 'MD5 et SHA-1 ne servent qu’aux checksums hérités — utilisez SHA-256 ou plus fort pour tout usage de sécurité.',
		heAll: 'Encoder tout le non-ASCII',
		heNumeric: 'Entités numériques uniquement',
		heInputEnc: 'Texte à échapper',
		heInputDec: 'HTML avec entités',
		imgDrop: 'Déposez une image, cliquez pour parcourir ou collez depuis le presse-papiers',
		imgLocal: 'Tout reste dans votre navigateur — rien n’est envoyé',
		imgReplace: 'Déposez, cliquez ou collez pour remplacer',
		imgSource: 'Image source',
		imgOriginal: 'Originale',
		imgDimensions: 'Dimensions',
		imgDownload: 'Télécharger {fmt}',
		imgErrNotImage: 'Format d’image non reconnu (PNG, JPEG, WebP, GIF, SVG, BMP, ICO, AVIF)',
		imgErrDecode: 'Le navigateur n’a pas pu décoder cette image',
		imgErrEncode: 'Le navigateur n’a pas pu encoder cette image',
		imgErrFormat: 'Ce navigateur ne sait pas encoder le {fmt} — essayez PNG ou JPEG',
		i2bToB64: 'Image → Base64',
		i2bFromB64: 'Base64 → image',
		i2bInput: 'Data URL ou Base64 brut',
		i2bDataUrl: 'Data URL',
		i2bRawB64: 'Base64 brut',
		i2bCss: 'Fond CSS',
		i2bHtml: 'HTML <img>',
		i2bEncodedSize: 'Taille en Base64',
		i2bOverhead: '+{pct}% vs binaire',
		i2bNote: 'L’inlining économise une requête mais alourdit le document et neutralise le cache — idéal pour les icônes et ressources de moins de ~10 Ko.',
		icTarget: 'Convertir en',
		icQuality: 'Qualité',
		icConverted: 'Convertie',
		icSmaller: 'plus petite que l’originale',
		icLarger: 'plus grande que l’originale',
		icBgNote: 'Le JPEG ne gère pas la transparence — les zones transparentes sont aplaties sur du blanc.',
		icNote: 'La conversion utilise l’encodeur canvas de votre navigateur ; la taille exacte varie donc légèrement selon les navigateurs.',
		fgAppleBg: 'Fond de l’icône Apple',
		fgFiles: 'Fichiers générés',
		fgHtml: 'Balises <link> HTML',
		fgSmall: 'La source fait {px}px — les icônes plus grandes seront agrandies et pourront paraître floues',
		fgNote: 'L’ICO contient 16, 32 et 48 px. L’icône tactile Apple ne peut pas être transparente : elle est aplatie sur le fond choisi ; les icônes PWA gardent leur alpha. Les sources non carrées sont recadrées au centre.',
		irBy: 'Redimensionner par',
		irWidth: 'Largeur',
		irHeight: 'Hauteur',
		irPercent: 'Pourcentage',
		irFormat: 'Format',
		irKeep: 'Conserver',
		irResized: 'Redimensionnée',
		irScale: 'Échelle',
		irNote: 'La réduction utilise un lissage de haute qualité. L’agrandissement n’invente pas de détail — attendez-vous à du flou au-delà de 2×.',
		jcInput: 'Tableau JSON d’objets',
		jcDelimiter: 'Délimiteur',
		jcComma: 'Virgule',
		jcSemicolon: 'Point-virgule (Excel européen)',
		jcTab: 'Tabulation',
		jfInput: 'Entrée JSON',
		jfIndent: 'Indentation',
		jfIndentation: 'Indentation',
		jfSp2: '2 espaces',
		jfSp4: '4 espaces',
		jfTabs: 'Tabulations',
		jfMin: 'Minifié — sans espaces',
		jfSortKeys: 'Trier les clés',
		jfText: 'Texte',
		jfTree: 'Arbre',
		jfTreeHint: 'Survolez un nœud pour copier son JSONPath — essayez-le dans le',
		jfTreeLink: 'testeur JSONPath',
		jpExpr: 'Expression JSONPath',
		jpDoc: 'Document JSON',
		jpMatches: 'Correspondances',
		jpResults: 'Valeurs résultantes',
		jtInput: 'Exemple JSON',
		jtRoot: 'Nom du type racine',
		jtNote: 'Déduit de ce seul exemple — marquez les champs optionnels et élargissez les nullables là où vos données varient.',
		jyFrom: 'De',
		jySource: 'Format source',
		jyAutoT: 'Détecter le format source depuis le contenu',
		jyTarget: 'Format cible',
		jyInput: 'Entrée',
		jyUnknown: 'format inconnu',
		jwtAnatomy: 'Anatomie du jeton',
		jwtHeader: 'en-tête',
		jwtPayload: 'payload',
		jwtSignature: 'signature (non vérifiée)',
		jwtIssued: 'Émis',
		jwtExpires: 'Expire',
		jwtNotBefore: 'Pas avant',
		jwtLifetime: 'Durée de vie',
		jwtNote: 'Le décodage ne fait que lire le jeton — il ne vérifie pas la signature. Vérifiez les signatures côté serveur avec les clés de l’émetteur.',
		loremUnit: 'Unité',
		loremWords: 'Mots',
		loremSentences: 'Phrases',
		loremParagraphs: 'Paragraphes',
		loremClassic: 'Commencer par « Lorem ipsum… »',
		pwWeak: 'Faible',
		pwFair: 'Moyen',
		pwStrong: 'Fort',
		pwExcellent: 'Excellent',
		pwNoLookalikes: 'Sans caractères ambigus (0O1lI)',
		pwEntropy: 'Entropie',
		pwBits: 'bits',
		pwNote: '≥ 80 bits résiste au cracking hors ligne des hachés rapides ; ≥ 100 bits est quasiment indevinable.',
		pwOut: 'Mots de passe',
		pwCrypto: 'Générés avec crypto.getRandomValues, uniquement dans votre navigateur. Rien n’est stocké ni transmis.',
		qrContent: 'Contenu',
		qrEc: 'Correction d’erreurs',
		qrEcT: 'Survit à {pct} de dommages',
		qrSvg: 'SVG (vectoriel, impression)',
		qrPng: 'PNG (chat, diapositives)',
		qrNote: 'Le contenu est encodé directement — pas de redirection, rien n’expire, pas de suivi des scans.',
		qrdResult: 'Contenu décodé',
		qrdNone: 'Aucun QR code trouvé — utilisez une image plus nette, recadrez près du code et gardez la marge blanche autour',
		qrdOpen: 'Ouvrir le lien',
		qrdWifiSsid: 'Réseau (SSID)',
		qrdWifiPass: 'Mot de passe',
		qrdWifiSec: 'Sécurité',
		qrdWifiHidden: 'Réseau masqué',
		qrdNote: 'Le scan se fait entièrement dans votre navigateur — ni l’image, ni le flux de la caméra, ni le contenu du code ne sont envoyés.',
		qrdCamera: 'Scanner avec la caméra',
		qrdCameraStop: 'Arrêter la caméra',
		qrdCameraErr: 'Caméra indisponible — vérifiez l’autorisation du navigateur ou utilisez une image',
		rxPattern: 'Motif',
		rxTest: 'Texte de test',
		rxTestPh: 'Collez du texte pour tester le motif',
		rxHighlighted: 'Surligné',
		rxMatches: 'Correspondances',
		rxMatched: 'Texte correspondant',
		slugInput: 'Titre (un par ligne)',
		slugSep: 'Séparateur',
		slugHyphen: 'Trait d’union',
		slugUnderscore: 'Tiret bas',
		slugMax: 'Longueur max',
		slugOut: 'Slug',
		slInput: 'Lignes',
		slPh: 'une par ligne',
		slSort: 'Tri',
		slKeep: 'Garder l’ordre',
		slAsc: 'Croissant',
		slDesc: 'Décroissant',
		slNatural: 'Naturel — nombres dans l’ordre',
		slLength: 'Par longueur',
		slShuffle: 'Mélanger',
		slDedupe: 'Dédupliquer',
		slIgnoreCase: 'Ignorer la casse',
		slTrim: 'Rogner les espaces',
		slDropEmpty: 'Supprimer les vides',
		tsInput: 'Timestamp ou date',
		tsNow: 'Heure unix actuelle :',
		tsNowT: 'Utiliser l’heure actuelle comme entrée',
		tsRelative: 'Relatif',
		tsUnixS: 'Secondes unix',
		tsUnixMs: 'Millisecondes unix',
		tsZones: 'Selon les fuseaux',
		tsNote: 'Le marqueur montre l’heure locale de chaque zone sur une bande de 24 h — les extrémités sombres vont de 21:00 à 07:00.',
		uaInput: 'Chaîne User-Agent',
		uaBrowser: 'Navigateur',
		uaEngine: 'Moteur',
		uaOs: 'Système d’exploitation',
		uaDevice: 'Appareil',
		uaNote: 'Le bouton « Exemple » insère le User-Agent de votre propre navigateur. Préférez la détection de fonctionnalités au UA sniffing.',
		uniInput: 'Texte à inspecter',
		uniPh: 'Collez n’importe quoi — les caractères invisibles deviennent visibles ici',
		uniGraphemes: 'Graphèmes',
		uniGraphemesHint: 'ce que voit l’utilisateur',
		uniCodePoints: 'Points de code',
		uniUtf16: 'Unités UTF-16',
		uniUtf16Hint: 'JS .length',
		uniUtf8: 'Octets UTF-8',
		uniLimit: 'Affichage des 300 premiers caractères.',
		upInput: 'URL',
		upProtocol: 'Protocole',
		upHost: 'Hôte',
		upHostname: 'Nom d’hôte',
		upPort: 'Port',
		upPath: 'Chemin',
		upFragment: 'Fragment',
		upOrigin: 'Origine',
		upQuery: 'Paramètres de requête',
		upDefault: '(par défaut)',
		upNone: '(aucun)',
		upEmpty: 'Les composants de l’URL apparaissent ici',
		urlComponent: 'Mode composant (encodeURIComponent)',
		urlInputDec: 'Texte encodé à décoder',
		uuidOut: 'IDs générés',
		uuidFormat: 'Format d’ID',
		uuidHintV4: 'aléatoire',
		uuidHintV7: 'ordonné par le temps',
		uuidHintUlid: 'ordonné par le temps, base32',
		uuidHintNano: 'court, URL-safe',
		uuidNote: 'Générés avec crypto.getRandomValues — cryptographiquement sûrs, créés dans votre navigateur, jamais journalisés.',
		wcWords: 'Mots',
		wcChars: 'Caractères',
		wcCharsHint: '{n} sans espaces',
		wcReading: 'Temps de lecture',
		wcReadingHint: 'à 220 mots/min',
		wcLines: 'Lignes',
		wcSentences: 'Phrases',
		wcParagraphs: 'Paragraphes',
		wcAvg: 'Longueur moyenne des mots',

		// Shared formatter controls
		fmtFormat: 'Formater',
		fmtMinify: 'Minifier',

		// SQL formatter
		sqlInput: 'Instruction(s) SQL',
		sqlDialect: 'Dialecte',
		sqlKeywords: 'Mots-clés',
		sqlKeep: 'Conserver',

		// XML formatter
		xmlInput: 'Document XML',

		// XML ↔ JSON
		xjInputXml: 'Document XML',
		xjInputJson: 'Objet JSON',
		xjNote: 'Les attributs deviennent des clés "@_nom" et le texte qui accompagne des attributs devient "#text", ce qui rend la conversion réversible. L’ordre des éléments entre frères mélangés n’est pas préservé — XML autorise les répétitions, pas les objets JSON.',

		// CSV → JSON
		cjInput: 'Données CSV / TSV',
		cjAuto: 'Auto',
		cjPipe: 'Pipe',
		cjHeader: 'La première ligne est l’en-tête',
		cjTyped: 'Valeurs typées',

		// Markdown
		mdPreview: 'Aperçu',
		mdNote: 'L’aperçu est assaini avant le rendu : les scripts et gestionnaires d’événements d’un contenu collé ou partagé ne peuvent donc pas s’exécuter. La zone de sortie HTML contient la conversion brute.',

		// Code formatters
		htmlInput: 'Source HTML',
		cssInput: 'Source CSS',
		jsInput: 'Source JavaScript',

		// String escape
		escEscape: 'Échapper',
		escUnescape: 'Déséchapper',
		escDialect: 'Dialecte',
		escInputEsc: 'Texte à échapper',
		escInputUnesc: 'Texte échappé',

		// Number base
		nbInput: 'Nombre',
		nbFrom: 'De',
		nbAutoT: 'Détecter d’après le préfixe 0x / 0o / 0b, décimal sinon',
		nbGroup: 'Grouper les chiffres',
		nbBase: 'Base',
		nbBin: 'Binaire',
		nbOct: 'Octal',
		nbDec: 'Décimal',
		nbHex: 'Hex',
		nbBits: 'bits',

		// Text ↔ hex/binary
		hbFormat: 'Octets en',
		hbSep: 'Séparateur',
		hbSpace: 'Espace',
		hbNone: 'Aucun',
		hbColon: 'Deux-points',
		hbInputEnc: 'Texte à encoder',
		hbInputDec: 'Octets à décoder',

		// JSON Schema
		schInfer: 'Inférer le schéma',
		schValidate: 'Valider',
		schInferT: 'Générer un schéma à partir d’un exemple JSON',
		schValidateT: 'Vérifier du JSON contre un schéma',
		schData: 'Données JSON',
		schSchema: 'Schéma JSON',
		schViolations: 'violations',
		schValid: 'Valide — les données sont conformes au schéma',
		schResult: 'Résultat de la validation',

		// EXIF
		exTags: '{n} champs de métadonnées',
		exNone: 'Aucune métadonnée trouvée — ce fichier est déjà propre',
		exStrip: 'Télécharger la copie nettoyée',
		exGps: 'Position GPS intégrée',
		exMap: 'Voir sur la carte',
		exNote: 'La lecture et la suppression se font entièrement dans votre navigateur — la photo n’est jamais envoyée. Le nettoyage retire les segments de métadonnées octet par octet, sans réencodage : pixels et qualité restent intacts.',

		// Cron builder
		crBuilder: 'Constructeur',
		crMinute: 'Minute',
		crHour: 'Heure',
		crDom: 'Jour du mois',
		crMonth: 'Mois',
		crDow: 'Jour de la semaine',
		crEvery: 'Chaque',
		crStep: 'Tous les N',
		crAt: 'Spécifique',
		crUse: 'Utiliser l’expression',

		// JWT sign & verify
		jwtDecode: 'Décoder',
		jwtSign: 'Signer',
		jwtVerify: 'Vérifier',
		jwtAlg: 'Algorithme',
		jwtPayloadLbl: 'Payload (objet JSON)',
		jwtSecret: 'Secret',
		jwtPrivKey: 'Clé privée (PEM PKCS#8)',
		jwtPubKey: 'Secret (HS) ou clé publique PEM (RS/ES)',
		jwtSignNote: 'La signature s’exécute sur WebCrypto dans votre navigateur — la clé ne quitte jamais cette page. Pour les algorithmes HS, utilisez un long secret aléatoire ; les secrets courts se cassent par force brute, où que vous signiez.',
		jwtVerifyNote: 'La vérification contrôle la signature contre la clé fournie, localement. Elle n’interroge pas de points de terminaison JWKS et ne valide pas les claims comme aud/iss — faites-le côté serveur.',

		// Timestamp extras
		tsDiff: 'Différence entre deux dates'
	},
	categories: {
		encoding: 'Encodage',
		json: 'JSON et données',
		text: 'Texte',
		time: 'Date et heure',
		generators: 'Générateurs',
		crypto: 'Hachage et crypto',
		web: 'Web',
		image: 'Image',
		code: 'Code et balisage',
		privacy: 'Confidentialité'
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
		'qr-code-decoder': {
			name: 'Décodeur de QR codes',
			description: 'Lisez un QR code depuis une image ou la caméra — URL, WiFi et texte, sans envoi'
		},
		'json-to-yaml': {
			name: 'Convertisseur JSON ↔ YAML ↔ TOML',
			description: 'Convertissez entre JSON, YAML et TOML avec détection automatique du format'
		},
		'json-to-csv': {
			name: 'Convertisseur JSON ↔ CSV',
			description: 'Aplatissez du JSON en CSV, ou analysez du CSV en objets JSON typés'
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
		},
		'image-to-base64': {
			name: 'Convertisseur image ↔ Base64',
			description: 'Convertit les images en data URLs Base64 et inversement — avec extraits CSS et HTML'
		},
		'image-converter': {
			name: 'Convertisseur de format d’image',
			description: 'Convertit les images entre PNG, JPEG et WebP avec réglage de qualité'
		},
		'image-resizer': {
			name: 'Redimensionneur d’images',
			description: 'Redimensionne par largeur, hauteur ou pourcentage — net et entièrement hors ligne'
		},
		'favicon-generator': {
			name: 'Générateur de favicon',
			description: 'Transforme n’importe quelle image en favicon.ico avec le set complet d’icônes PNG et manifest'
		},
		'sql-formatter': {
			name: 'Formateur SQL',
			description: 'Formatez du SQL avec des mots-clés adaptés au dialecte, ou minifiez-le en une ligne'
		},
		'xml-formatter': {
			name: 'Formateur et validateur XML',
			description: 'Formatez, minifiez et validez du XML avec la position exacte des erreurs'
		},
		'xml-to-json': {
			name: 'Convertisseur XML ↔ JSON',
			description: 'Convertissez des documents XML en JSON et inversement, attributs compris'
		},
		'markdown-to-html': {
			name: 'Convertisseur Markdown ↔ HTML',
			description: 'Rendez le Markdown en HTML avec aperçu en direct, ou reconvertissez du HTML en Markdown'
		},
		'html-formatter': {
			name: 'Formateur et minificateur HTML',
			description: 'Embellissez du HTML désordonné ou minifiez-le pour la production'
		},
		'css-formatter': {
			name: 'Formateur et minificateur CSS',
			description: 'Embellissez le CSS pour le lire ou minifiez-le pour le déployer'
		},
		'js-formatter': {
			name: 'Formateur et minificateur JavaScript',
			description: 'Embellissez du JavaScript ou minifiez-le avec vraie compression et renommage des variables'
		},
		'string-escape': {
			name: 'Échappement de chaînes',
			description: 'Échappez ou déséchappez des chaînes pour JSON, JavaScript, Java, XML, SQL et CSV'
		},
		'number-base-converter': {
			name: 'Convertisseur de bases numériques',
			description: 'Convertissez des nombres entre binaire, octal, décimal, hex et toute base jusqu’à 36'
		},
		'text-to-hex': {
			name: 'Convertisseur texte ↔ hex / binaire',
			description: 'Transformez du texte en octets hex, binaires ou décimaux et décodez les dumps d’octets'
		},
		'json-schema-validator': {
			name: 'Validateur et générateur de JSON Schema',
			description: 'Validez du JSON contre un schéma, ou inférez un schéma depuis des données d’exemple'
		},
		'exif-viewer': {
			name: 'Visionneuse et suppression EXIF',
			description: 'Voyez les métadonnées de vos photos — et retirez-les sans réencodage'
		}
	}
};

export default fr;
