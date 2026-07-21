import type { ToolContent } from './content';

/**
 * Version française des contenus longs des outils (À propos + FAQ).
 * Traduction française de content.ts, rédigée entrée par entrée ;
 * toute entrée manquante retombe automatiquement sur l’anglais.
 */
const TOOL_CONTENT_FR: Record<string, ToolContent> = {
	'json-formatter': {
		about: [
			'Collez n’importe quel JSON — une réponse d’API, un fichier de configuration, une ligne de log — et ce formateur l’affiche proprement avec l’indentation de votre choix, ou le minifie pour l’intégrer ailleurs. L’analyse s’appuie sur le moteur JSON natif du navigateur : ce qui est validé ici est exactement ce que JavaScript et tout parseur conforme à la norme JSON accepteront.',
			'Quand l’entrée est invalide, l’erreur indique la ligne et la colonne exactes où l’analyse a échoué, au lieu d’un vague "unexpected token" quelque part. Combiné à l’éditeur à chasse fixe, traquer une virgule manquante dans une charge utile de 500 lignes devient l’affaire de dix secondes. Vous pouvez aussi trier les clés des objets par ordre alphabétique, ce qui aide avant de comparer deux charges utiles.',
			'Le formatage s’exécute entièrement dans votre navigateur. Les données contenant des jetons, des fiches clients ou des URL internes ne quittent jamais votre machine — il n’existe aucun serveur qui pourrait les journaliser.'
		],
		faqs: [
			{
				q: 'Pourquoi mon JSON échoue-t-il avec "Unexpected token" alors qu’il semble correct ?',
				a: 'Les coupables habituels : une virgule finale après le dernier élément, des guillemets simples au lieu de doubles, des clés sans guillemets, ou des commentaires. Tout cela est valide dans un littéral d’objet JavaScript (ou en JSON5), mais pas en JSON strict. Le marqueur ligne/colonne pointe vers le premier caractère fautif.'
			},
			{
				q: 'Y a-t-il une limite de taille ?',
				a: 'Pas de limite stricte — l’analyse est locale, tout dépend donc de votre machine. Des documents de plusieurs dizaines de mégaoctets se formatent sans problème dans un navigateur moderne ; au-delà, l’onglet peut ralentir, car le document entier est conservé en mémoire.'
			},
			{
				q: 'Le formatage modifie-t-il mes données ?',
				a: 'Seulement les espaces, sauf si vous activez le tri des clés. Les nombres sont resérialisés par le moteur JavaScript : 1e2 devient 100 et les entiers dépassant la double précision IEEE-754 sont normalisés — exactement ce que ferait tout consommateur de votre JSON basé sur JS.'
			},
			{
				q: 'Puis-je valider du JSON sans le reformater ?',
				a: 'Oui — le badge d’état au-dessus de la zone de saisie se met à jour pendant la frappe et indique si le document est analysable, sa taille et l’emplacement de la première erreur. L’action Formater n’est nécessaire que si vous voulez réécrire la sortie.'
			}
		]
	},

	'base64-decode': {
		about: [
			'Base64 transforme des octets arbitraires en un alphabet de 64 caractères qui survit au copier-coller dans du JSON, des URL, des en-têtes HTTP et des e-mails. Cet outil convertit dans les deux sens : saisissez ou collez du texte pour l’encoder, ou collez une chaîne encodée pour retrouver l’original. L’UTF-8 est géré correctement dans les deux directions : emojis et écritures non latines font l’aller-retour sans être abîmés.',
			'Le décodeur est volontairement tolérant : il accepte l’alphabet compatible URL (- et _ à la place de + et /), supprime espaces et sauts de ligne, et restaure le remplissage manquant avant de décoder — les trois raisons qui poussent le plus souvent des décodeurs plus stricts à rejeter une entrée pourtant parfaitement récupérable. Si les octets décodés ne forment pas du texte UTF-8 valide, il le signale au lieu d’afficher du charabia, ce qui signifie généralement que la charge utile était des données binaires, comme une image.',
			'Tout se passe dans la page. Décoder ici un jeton ou un identifiant ne le transmet nulle part.'
		],
		faqs: [
			{
				q: 'Pourquoi ma chaîne Base64 se termine-t-elle par des signes = ?',
				a: 'Base64 encode 3 octets en 4 caractères : quand la longueur de l’entrée n’est pas un multiple de 3, la sortie est complétée avec = pour garder les groupes alignés. Le remplissage ne porte aucune donnée ; ce décodeur le restaure automatiquement s’il a été retiré.'
			},
			{
				q: 'Quelle est la différence entre le Base64 standard et le Base64 compatible URL ?',
				a: 'Le Base64 standard utilise + et /, qui ont un sens particulier dans les URL et doivent eux-mêmes être échappés. La variante compatible URL (RFC 4648 §5) les remplace par - et _ et omet généralement le remplissage. Les JWT, par exemple, utilisent la forme compatible URL. L’encodeur ici propose les deux ; le décodeur accepte automatiquement l’une comme l’autre.'
			},
			{
				q: 'Base64 est-il un chiffrement ?',
				a: 'Non. Base64 est un encodage réversible sans clé — n’importe qui peut le décoder. Il protège les données contre la corruption lors du transport, pas contre la lecture. Si vous avez besoin de confidentialité, chiffrez d’abord puis encodez le texte chiffré.'
			},
			{
				q: 'Pourquoi le décodage indique-t-il que le résultat n’est pas de l’UTF-8 valide ?',
				a: 'La chaîne s’est bien décodée, mais les octets obtenus ne sont pas du texte — souvent un PNG, un PDF, ou des données compressées/chiffrées. Décoder un tel contenu vers une zone de texte afficherait du mojibake, l’outil préfère donc le signaler.'
			}
		]
	},

	'timestamp-converter': {
		about: [
			'Le temps Unix compte les secondes écoulées depuis le 1970-01-01T00:00:00 UTC, et on le croise partout : lignes de base de données, claims JWT, fichiers de logs, réponses d’API. Ce convertisseur accepte un timestamp en secondes ou en millisecondes — il détecte l’unité d’après l’ordre de grandeur — ainsi que les chaînes ISO 8601 et la plupart des dates lisibles par un humain, et affiche toutes les représentations à la fois : ISO, UTC, votre heure locale, le temps relatif et les deux précisions Unix.',
			'L’ambiguïté d’unité est le piège classique : 1700000000 correspond à novembre 2023 en secondes, mais à janvier 1970 en millisecondes. L’unité détectée est affichée explicitement, et vous pouvez la corriger d’un clic quand la détection se trompe — plus besoin de compter les chiffres de tête.',
			'La conversion est instantanée et locale, et l’affichage de l’heure courante continue de défiler : la page fait aussi office d’horloge epoch pendant que vous travaillez.'
		],
		faqs: [
			{
				q: 'Comment l’outil choisit-il entre secondes et millisecondes ?',
				a: 'Par ordre de grandeur : les valeurs de 11 chiffres ou plus sont traitées comme des millisecondes, les plus courtes comme des secondes. Cela couvre les secondes jusqu’à l’an ~5138 et les millisecondes à partir de ~1973, ce qui lève l’ambiguïté pour tout timestamp moderne réaliste. Vous pouvez basculer l’unité manuellement pour les cas limites.'
			},
			{
				q: 'Que se passe-t-il après 2038 ?',
				a: 'Le problème de l’an 2038 touche les systèmes qui stockent le temps Unix dans un entier signé 32 bits. Les nombres JavaScript sont des flottants 64 bits : ce convertisseur gère donc des dates bien au-delà de 2038 — jusqu’après l’an 275760, la limite de Date en JavaScript.'
			},
			{
				q: 'Puis-je convertir une date en timestamp ?',
				a: 'Oui. Collez une chaîne ISO 8601 comme 2026-07-20T12:00:00Z, ou la plupart des formats de date usuels, et les secondes et millisecondes Unix s’affichent aux côtés des autres représentations.'
			},
			{
				q: 'Quel fuseau horaire est utilisé pour la ligne "heure locale" ?',
				a: 'Le fuseau configuré dans votre navigateur, via l’API Intl — rien n’est interrogé à distance. Le nom du fuseau est affiché à côté de la valeur, pour que les captures d’écran restent sans ambiguïté.'
			}
		]
	},

	'jwt-decoder': {
		about: [
			'Un JSON Web Token, ce sont trois segments Base64URL — en-tête, charge utile, signature — reliés par des points. Ce décodeur découpe le jeton et affiche l’en-tête et la charge utile en JSON formaté, met en évidence les claims temporels normalisés (iat, exp, nbf) sous forme de dates lisibles, et vous dit d’un coup d’œil si le jeton a expiré.',
			'Décoder n’est pas vérifier : la charge utile de n’importe quel JWT peut être lue par quiconque le détient, car Base64URL est un encodage, pas un chiffrement. C’est aussi pourquoi coller un jeton sur un site web quelconque est en général une mauvaise idée — cette page est l’exception, car le décodage se fait entièrement dans votre navigateur et le jeton n’est jamais transmis. La vérification de signature contre un secret ou une clé publique est délibérément hors du périmètre de ce décodeur hors ligne.',
			'Un préfixe "Bearer " en tête est supprimé automatiquement : vous pouvez coller directement depuis un en-tête Authorization.'
		],
		faqs: [
			{
				q: 'Est-il prudent de coller ici un jeton de production ?',
				a: 'Le jeton reste dans votre navigateur — cette page n’effectue aucune requête réseau avec votre saisie, ce que vous pouvez vérifier dans l’onglet réseau des outils de développement. Gardez tout de même l’habitude de traiter les jetons actifs comme des mots de passe : préférez des jetons expirés ou de test pour les captures d’écran.'
			},
			{
				q: 'Pourquoi mon jeton ne se décode-t-il pas ?',
				a: 'Vérifiez qu’il comporte exactement trois segments séparés par des points et aucun saut de ligne introduit par le copier-coller. Les jetons d’accès opaques (par exemple beaucoup de jetons GitHub ou Google) ne sont pas du tout des JWT — aucun décodage n’ouvrira une chaîne aléatoire qui n’a jamais contenu de JSON.'
			},
			{
				q: 'Que signifient iat, exp et nbf ?',
				a: 'Ce sont des claims normalisés par la RFC 7519, tous en secondes Unix : iat est l’instant d’émission du jeton, exp le moment où il cesse d’être valide, et nbf ("not before") le premier instant où il peut être accepté. Cet outil convertit chacun en date lisible et compare exp à votre horloge.'
			},
			{
				q: 'Cet outil peut-il vérifier la signature ?',
				a: 'Non — et une coche verte affichée par un outil en ligne ne devrait de toute façon pas fonder une décision de sécurité. Vérifiez les signatures côté backend avec une bibliothèque maintenue (jose, jsonwebtoken, PyJWT) contre les vraies clés de l’émetteur.'
			}
		]
	},

	'regex-tester': {
		about: [
			'Écrivez un motif, collez un texte d’exemple, et chaque correspondance est surlignée pendant la frappe — avec les groupes de capture, les groupes nommés et les positions listés en dessous. Le testeur utilise le moteur RegExp de JavaScript, donc le comportement correspond exactement à ce que feront Node.js et les navigateurs, y compris le lookbehind, les groupes nommés et les échappements de propriétés Unicode.',
			'Les drapeaux se basculent lettre par lettre (g, i, m, s, u, y, d) et le motif est compilé à chaque frappe ; les erreurs de syntaxe apparaissent immédiatement avec le message du moteur lui-même, plutôt qu’après un clic sur un bouton. Les motifs à correspondance vide comme a* sont gérés sans danger, et les entrées incontrôlées sont plafonnées à 10 000 correspondances, pour qu’un .* égaré ne puisse pas geler l’onglet.',
			'Les dialectes regex diffèrent d’un moteur à l’autre — un motif qui fonctionne ici peut demander des ajustements pour PCRE, RE2 ou le module re de Python, surtout autour du support du lookbehind, des quantificateurs possessifs et des drapeaux en ligne.'
		],
		faqs: [
			{
				q: 'Quelle saveur de regex ce testeur utilise-t-il ?',
				a: 'ECMAScript (JavaScript), telle qu’implémentée par votre propre navigateur. Elle prend en charge le lookahead, le lookbehind, les groupes de capture nommés, les rétroréférences et les échappements de propriétés Unicode comme \\p{Letter} (avec le drapeau u). Elle ne prend pas en charge la syntaxe propre à PCRE, comme les quantificateurs possessifs ou la récursion.'
			},
			{
				q: 'Pourquoi mon motif correspond-il à tout / à rien ?',
				a: 'Les deux causes classiques : un métacaractère non échappé (. correspond à n’importe quel caractère — échappez-le en \\. pour un point littéral), ou un drapeau g oublié mentalement — ce testeur trouve toujours toutes les correspondances, mais votre code ne trouvera que la première si g n’est pas activé.'
			},
			{
				q: 'Que sont les groupes de capture nommés ?',
				a: 'La syntaxe (?<name>...) étiquette un groupe pour lire les correspondances par nom plutôt que par position : match.groups.name en JavaScript. Le panneau des groupes sous les correspondances montre les captures numérotées et nommées pour chaque correspondance.'
			},
			{
				q: 'Une regex écrite ici fonctionnera-t-elle telle quelle en Python ou en Go ?',
				a: 'Souvent, mais pas toujours. Classes de caractères, quantificateurs et ancres sont portables ; le lookbehind, la syntaxe des groupes nommés (Python utilise (?P<name>...)) et les drapeaux en ligne diffèrent. Le moteur RE2 de Go rejette en plus totalement les rétroréférences et le lookaround.'
			}
		]
	},

	'diff-checker': {
		about: [
			'Collez un texte original à gauche et une version modifiée à droite, et obtenez une comparaison unifiée ligne par ligne : suppressions en rouge, ajouts en vert, contexte préservé entre les deux, avec les numéros de ligne d’origine des deux côtés. C’est le moyen le plus rapide de répondre à "qu’est-ce qui a réellement changé ?" entre deux configurations, deux réponses d’API, ou deux versions d’un extrait collé dans un chat.',
			'La comparaison utilise un algorithme de plus longue sous-séquence commune sur les lignes — la même famille d’algorithmes que git diff — de sorte que les blocs réordonnés et les petites modifications produisent un résultat lisible au lieu de tout marquer comme changé. Une ligne de synthèse totalise les lignes ajoutées et supprimées.',
			'Comme les deux textes restent dans la page, comparer du contenu confidentiel — contrats, identifiants dans des configurations, textes non publiés — ne présente aucun des risques du collage dans un service web quelconque.'
		],
		faqs: [
			{
				q: 'La comparaison porte-t-elle sur les mots ou sur les lignes ?',
				a: 'Sur les lignes. Chaque ligne est comparée comme une unité, ce qui correspond à la façon dont les développeurs lisent les diffs de code et de configuration. Une ligne modifiée apparaît donc comme une suppression plus un ajout ; le surlignage intra-ligne au niveau des caractères est sur la feuille de route.'
			},
			{
				q: 'Pourquoi mon diff montre-t-il tout comme modifié ?',
				a: 'Généralement des différences invisibles : un côté utilise des tabulations et l’autre des espaces, des fins de ligne Windows CRLF contre Unix LF, ou des espaces en fin de ligne. Normaliser les espaces avant de comparer (le formateur JSON avec tri des clés aide pour les charges utiles JSON) fait apparaître les vrais changements.'
			},
			{
				q: 'Puis-je comparer utilement deux réponses JSON ?',
				a: 'Oui — passez d’abord les deux par le formateur JSON avec le tri des clés activé, pour que des documents équivalents se sérialisent à l’identique. Le diff montre alors les vrais changements de valeurs au lieu du bruit lié à l’ordre des clés.'
			},
			{
				q: 'Y a-t-il une taille de texte maximale ?',
				a: 'L’algorithme compare chaque ligne d’un texte à chaque ligne de l’autre : des fichiers extrêmement grands (des dizaines de milliers de lignes des deux côtés) peuvent donc prendre un moment. Les fichiers de code et charges utiles d’API typiques se comparent instantanément.'
			}
		]
	},

	'url-encode-decode': {
		about: [
			'Les caractères comme les espaces, les esperluettes et les lettres non ASCII ne peuvent pas figurer tels quels dans une URL : ils sont encodés en pourcent — une espace devient %20, 你 devient %E4%BD%A0. Cet outil encode du texte pour l’inclure sans risque dans des URL et décode les chaînes en pourcent vers du texte lisible, y compris la convention + pour les espaces utilisée dans les chaînes de requête.',
			'Deux modes d’encodage sont proposés parce que JavaScript lui-même en a deux : le mode composant (encodeURIComponent) échappe tout ce qui pourrait délimiter une URL — ce qu’il faut pour une valeur isolée de chaîne de requête ; le mode URI complet (encodeURI) préserve les caractères structurels comme /, ? et &, pour encoder une URL entière qui doit rester navigable.',
			'Le décodage est strict avec les séquences % malformées — un % isolé ou %ZZ est signalé comme une erreur au lieu d’être laissé passer silencieusement, exactement comme le traiteront les navigateurs et les serveurs.'
		],
		faqs: [
			{
				q: 'Quand utiliser le mode composant plutôt que le mode URI complet ?',
				a: 'Pour encoder une valeur qui va à l’intérieur d’une URL (une requête de recherche, une cible de redirection, une adresse e-mail en paramètre) → mode composant, pour que les & et = dans la valeur ne cassent pas la chaîne de requête. Pour encoder une URL complète destinée à l’affichage ou au transport → mode URI complet, pour que la structure de l’URL survive.'
			},
			{
				q: 'Pourquoi + signifie-t-il parfois une espace ?',
				a: 'Le format application/x-www-form-urlencoded — utilisé par les soumissions de formulaires HTML et les chaînes de requête — encode historiquement les espaces en +. Dans un chemin d’URL, + est juste un plus. Le décodeur ici traite + comme une espace, conformément à la sémantique des chaînes de requête ; %20 fonctionne toujours et partout.'
			},
			{
				q: 'Pourquoi ma chaîne est-elle doublement encodée (%2520) ?',
				a: '%25 est l’encodage de % lui-même, donc %2520 signifie que le texte %20 a été encodé une seconde fois. Cela arrive quand deux couches d’un système encodent chacune de leur côté. Décodez deux fois ici pour la déballer, puis corrigez la couche qui ne devrait pas encoder.'
			},
			{
				q: 'Les caractères Unicode sont-ils gérés correctement ?',
				a: 'Oui — le texte est d’abord encodé en UTF-8 puis chaque octet est échappé en pourcent, conformément au standard URL du WHATWG. C’est pourquoi un caractère CJC devient trois groupes %XX.'
			}
		]
	},

	'url-parser': {
		about: [
			'Collez une URL et voyez-la disséquée : protocole, hôte, port, chemin, fragment, et chaque paramètre de requête dans un tableau clé-valeur décodé. L’outil utilise le même parseur URL WHATWG que votre navigateur pour la navigation : l’interprétation affichée est celle qu’un navigateur appliquera réellement — y compris les cas limites comme la suppression des ports par défaut et la normalisation des chemins.',
			'Le tableau des paramètres de requête est la partie que vous utiliserez le plus : les longues redirections OAuth, les liens balisés analytics et les appels d’API deviennent lisibles d’un coup d’œil, chaque valeur déjà décodée du pourcent-encodage. Les domaines nus sans schéma sont acceptés aussi ; https:// est supposé pour l’analyse.',
			'Il se combine naturellement avec l’encodeur d’URL — analysez une URL ici pour trouver le paramètre voulu, modifiez la valeur, puis ré-encodez-la là-bas.'
		],
		faqs: [
			{
				q: 'Pourquoi l’URL analysée diffère-t-elle légèrement de ce que j’ai collé ?',
				a: 'Le parseur WHATWG normalise : il met le schéma et l’hôte en minuscules, retire les ports par défaut (:443 pour https), résout les segments de chemin ./ et ../, et encode les caractères qui le nécessitent. Ce que vous voyez est la forme canonique sur laquelle serveurs et navigateurs s’accordent.'
			},
			{
				q: 'Gère-t-il les URL avec des clés de requête en double ?',
				a: 'Oui — chaque occurrence est listée sur sa propre ligne, dans l’ordre. Les clés en double sont légales et courantes : beaucoup d’API les lisent comme des tableaux (?tag=a&tag=b).'
			},
			{
				q: 'Quelle est la différence entre host et hostname ?',
				a: 'hostname est juste le domaine (example.com) ; host inclut un port explicite non par défaut (example.com:8080). Quand le port est celui par défaut du schéma, les deux se ressemblent car le port est omis.'
			},
			{
				q: 'Le fragment (#...) est-il envoyé au serveur ?',
				a: 'Non. Tout ce qui suit # reste dans le navigateur — les serveurs ne le voient jamais. C’est pourquoi les applications monopages l’ont historiquement utilisé pour le routage côté client, et pourquoi des paramètres analytics placés après # sont invisibles pour le backend.'
			}
		]
	},

	'uuid-generator': {
		about: [
			'Générez des identifiants universellement uniques en quatre variantes : UUID v4 (entièrement aléatoire, le choix courant), UUID v7 (ordonné dans le temps, le choix moderne pour les clés de base de données), ULID (ordonné dans le temps avec une écriture compacte en Base32 de Crockford) et Nano ID (court, adapté aux URL). Générez-en un seul ou jusqu’à mille à la fois — un par ligne, prêts à coller dans un script de seed.',
			'L’aléa provient de l’API Web Crypto (crypto.getRandomValues), la source cryptographiquement sûre, pas de Math.random. La génération est locale : les identifiants ne sont connus de personne d’autre, journalisés nulle part, et disponibles hors ligne.',
			'Si vous choisissez un format d’identifiant pour un nouveau système : v7 et ULID se trient par date de création, ce qui ménage les index B-tree et rend les identifiants à peu près chronologiques dans les logs ; v4 ne révèle rien de sa date de création, ce qui est parfois exactement ce que vous voulez.'
		],
		faqs: [
			{
				q: 'Quelle est la différence entre UUID v4 et v7 ?',
				a: 'v4, ce sont 122 bits aléatoires. v7 (RFC 9562) commence par un horodatage Unix de 48 bits en millisecondes suivi de bits aléatoires : les identifiants générés plus tard se trient plus tard. Pour des clés primaires de base de données, v7 améliore généralement la localité d’insertion et la taille des index ; v4 reste très bien quand l’ordre est sans importance ou que le moment de création ne doit pas fuiter.'
			},
			{
				q: 'Deux UUID générés peuvent-ils entrer en collision ?',
				a: 'Avec 122 bits aléatoires, la probabilité est si faible qu’elle ne mérite pas d’ingénierie : il faudrait générer des milliards d’identifiants par seconde pendant des décennies pour atteindre ne serait-ce qu’une chance infime. En pratique, les collisions viennent de bugs (réutilisation d’une graine, copie de lignes), pas de l’aléa.'
			},
			{
				q: 'Pourquoi choisir ULID plutôt qu’UUID v7 ?',
				a: 'Ils résolvent le même problème. ULID, ce sont 26 caractères en Base32 de Crockford insensible à la casse — plus court et plus propre dans les URL et les logs — tandis que v7 conserve la forme standard d’UUID à 36 caractères que toutes les bases et bibliothèques acceptent déjà. Prenez celui que votre écosystème gère le plus nativement.'
			},
			{
				q: 'Ces identifiants peuvent-ils servir de secrets ou de jetons ?',
				a: 'L’aléa est cryptographiquement sûr, mais les identifiants sont généralement affichés, journalisés et indexés — traités comme publics. Pour des jetons de session ou des clés d’API, générez un secret dédié d’au moins 128 bits aléatoires et traitez-le comme un mot de passe.'
			}
		]
	},

	'hash-generator': {
		about: [
			'Calculez des empreintes MD5, SHA-1, SHA-256, SHA-384 et SHA-512 de n’importe quel texte, plus des signatures HMAC à clé, directement dans le navigateur. La famille SHA et HMAC utilisent l’API Web Crypto — les mêmes primitives auditées que votre navigateur emploie pour TLS — tandis que MD5 (que Web Crypto omet délibérément) est fourni par une petite implémentation locale pour les sommes de contrôle héritées.',
			'Les empreintes se mettent à jour pendant la frappe, et tous les algorithmes sont calculés en même temps : comparer une valeur à une somme de contrôle, quel que soit l’algorithme choisi par la page de téléchargement, ne demande aucune configuration. Le mode HMAC ajoute un champ de clé secrète pour vérifier les signatures de webhooks — GitHub, Stripe et la plupart des fournisseurs signent leurs charges utiles en HMAC-SHA256.',
			'Comme l’entrée ne quitte jamais la page, vous pouvez hacher sans risque ce que vous ne colleriez jamais dans un service en ligne : charges utiles d’API, mots de passe comparés à une liste d’empreintes fuitées, documents internes.'
		],
		faqs: [
			{
				q: 'Quel algorithme de hachage devrais-je utiliser ?',
				a: 'Pour tout ce qui touche à la sécurité aujourd’hui : SHA-256 ou plus fort. MD5 et SHA-1 sont cassés côté résistance aux collisions — on peut fabriquer deux entrées différentes avec la même empreinte — ils ne survivent donc que pour des sommes de contrôle non adverses et la compatibilité avec des protocoles hérités.'
			},
			{
				q: 'Pourquoi proposer encore MD5 ?',
				a: 'Parce qu’on le croise encore : ETags, clés de cache, manifestes de fichiers, vieilles colonnes de base de données. Vérifier ces valeurs impose de calculer du MD5, quel que soit son statut cryptographique. Ne concevez simplement rien de nouveau autour de lui.'
			},
			{
				q: 'Qu’est-ce que HMAC et en quoi diffère-t-il d’un hachage simple ?',
				a: 'HMAC mélange une clé secrète au hachage : seuls les détenteurs de la clé peuvent produire ou vérifier l’empreinte. Un hachage simple prouve l’intégrité ("ces données n’ont pas changé") ; un HMAC prouve aussi l’authenticité ("quelqu’un possédant la clé a produit ceci"). La vérification de signatures de webhooks en est l’usage quotidien.'
			},
			{
				q: 'Hacher un mot de passe, est-ce le chiffrer ?',
				a: 'Non, et les hachages rapides comme SHA-256 sont le mauvais outil pour stocker des mots de passe — les attaquants peuvent en essayer des milliards par seconde. Le stockage de mots de passe exige un algorithme volontairement lent et salé : bcrypt, scrypt ou Argon2.'
			}
		]
	},

	'case-converter': {
		about: [
			'Les identifiants voyagent sans cesse entre conventions : l’API renvoie du snake_case, votre TypeScript veut du camelCase, la classe CSS demande du kebab-case et la variable d’environnement exige du CONSTANT_CASE. Ce convertisseur prend n’importe quelle entrée mixte — espaces, tirets bas, traits d’union, camelCase existant — la découpe intelligemment en mots, et la réassemble dans neuf styles cibles à la fois.',
			'Le découpage comprend les cas piégeux : il scinde "getUserByID" en get/user/by/id (en gardant l’acronyme intact jusqu’à la frontière), traite les chiffres comme partie de leur mot, et traite chaque ligne indépendamment — vous pouvez coller toute une colonne de champs de base de données et les convertir d’un coup.',
			'Tous les styles s’affichent simultanément avec un bouton de copie par ligne — pas de mode à choisir d’abord : collez et prenez celui qu’il vous faut.'
		],
		faqs: [
			{
				q: 'Comment les acronymes comme "HTTPResponse" sont-ils gérés ?',
				a: 'Une suite de majuscules suivie d’une minuscule est coupée avant la dernière majuscule : HTTPResponse → http + response. C’est ainsi que la plupart des guides de style attendent la tokenisation des acronymes, même si aucun découpeur ne peut deviner parfaitement l’intention — des cas limites comme "IOError" deviennent io + error.'
			},
			{
				q: 'Puis-je convertir plusieurs identifiants à la fois ?',
				a: 'Oui — chaque ligne est convertie indépendamment. Collez une liste de noms de colonnes, un par ligne, et la sortie conserve la structure des lignes dans le nouveau style.'
			},
			{
				q: 'Quelle est la différence entre Title Case et Sentence case ici ?',
				a: 'Title Case met une majuscule à chaque mot ("User Account Id") ; Sentence case seulement au premier ("User account id"). Aucun des deux n’applique les règles éditoriales sur les articles et prépositions — pour des identifiants, vous n’en voulez presque jamais.'
			},
			{
				q: 'Pourquoi un aller-retour ne restaure-t-il pas toujours l’original ?',
				a: 'Le découpage en mots perd de l’information — "user_ID_2" et "userId2" se tokenisent à l’identique. Les conversions sont déterministes dans le sens aller, mais l’orthographe originale des frontières de mots ne peut pas toujours être reconstruite en sens inverse.'
			}
		]
	},

	'word-counter': {
		about: [
			'Un compteur de mots et de caractères en direct, avec les chiffres dont développeurs et rédacteurs ont réellement besoin : mots, caractères avec et sans espaces, octets UTF-8 (ce que mesure vraiment votre colonne de base de données ou votre limite d’API), lignes, phrases, paragraphes, et un temps de lecture estimé à un rythme typique de 220 mots par minute.',
			'Les caractères sont comptés en points de code Unicode, pas en unités UTF-16 : les emojis et le texte CJC se comptent comme un humain s’y attendrait — et le décompte d’octets séparé rend la différence visible : 日本語 fait 3 caractères mais 9 octets. C’est exactement cette distinction qui fait mal quand une colonne VARCHAR(255) rejette une chaîne de 200 "caractères".',
			'Tout se met à jour pendant la frappe, sans rien envoyer nulle part — sûr pour compter des brouillons d’annonces, des contrats, ou tout ce qui n’est pas prêt à être diffusé.'
		],
		faqs: [
			{
				q: 'Pourquoi les décomptes de caractères et d’octets diffèrent-ils ?',
				a: 'Les caractères sont des points de code Unicode ; les octets sont leur encodage UTF-8. Les lettres ASCII font 1 octet chacune, la plupart des lettres accentuées européennes 2, les caractères CJC 3, et les emojis 4 (ou plus en séquences). Les limites de bases de données, les en-têtes HTTP et beaucoup d’API mesurent des octets, pas des caractères.'
			},
			{
				q: 'Comment les mots sont-ils comptés pour les langues sans espaces ?',
				a: 'Le comptage de mots découpe sur les espaces, ce qui sous-compte le texte non segmenté en chinois ou en japonais. Pour ces langues, le nombre de caractères est la mesure la plus pertinente — c’est pourquoi les deux sont toujours affichés.'
			},
			{
				q: 'Qu’est-ce qui compte comme une phrase ?',
				a: 'Une suite de texte se terminant par ., !, ? ou … suivie d’une espace ou de la fin de l’entrée. Des abréviations comme "e.g." peuvent gonfler légèrement le compte — le comptage de phrases est par nature heuristique.'
			},
			{
				q: 'Quelle est la précision du temps de lecture ?',
				a: 'Il divise le nombre de mots par 220 mots/minute, une moyenne courante pour la lecture silencieuse de prose générale par un adulte. Le contenu technique avec du code se lit plus lentement ; les listes survolables plus vite. Prenez-le comme un ordre de grandeur.'
			}
		]
	},

	'lorem-ipsum-generator': {
		about: [
			'Du texte de remplissage pour maquettes, prototypes et données de test, généré dans votre navigateur : choisissez mots, phrases ou paragraphes, fixez un nombre, et copiez. La sortie puise dans le vocabulaire classique du Cicéron brouillé : elle ressemble à de la prose latine naturelle sans former de phrases lisibles qui distraient.',
			'Par défaut, le texte s’ouvre sur le traditionnel "Lorem ipsum dolor sit amet" — la formule que designers et relecteurs reconnaissent instantanément comme du remplissage — et vous pouvez le désactiver pour une sortie entièrement aléatoire quand il vous faut plusieurs blocs distincts.',
			'Les longueurs de phrases et les tailles de paragraphes varient aléatoirement dans des plages réalistes : le texte obtenu a le rythme visuel d’un vrai contenu — important quand vous jugez la typographie ou les retours à la ligne, où des phrases uniformes paraissent artificielles.'
		],
		faqs: [
			{
				q: 'D’où vient le lorem ipsum ?',
				a: 'Ce sont des fragments brouillés du "De finibus bonorum et malorum" de Cicéron (45 av. J.-C.), utilisés comme remplissage par les typographes depuis au moins les années 1960 et popularisés par les planches Letraset puis les logiciels de PAO.'
			},
			{
				q: 'Pourquoi utiliser du lorem ipsum plutôt que du vrai texte ?',
				a: 'Un contenu lisible détourne l’attention — les relecteurs se mettent à corriger les mots au lieu de juger la mise en page. Le pseudo-latin a des fréquences de lettres et des longueurs de mots naturelles sans être lisible, ce qui garde le regard sur le design.'
			},
			{
				q: 'Le texte généré est-il toujours le même ?',
				a: 'Non — les mots sont tirés aléatoirement à chaque fois, deux générations diffèrent donc. Seule la formule d’ouverture classique, optionnelle, est fixe.'
			},
			{
				q: 'Puis-je générer un nombre de mots précis pour une limite de champ CMS ?',
				a: 'Oui — réglez l’unité sur les mots et le nombre sur exactement ce qu’il vous faut, jusqu’à 1000 à la fois. Combinez-le avec le compteur de mots pour vérifier les limites en caractères ou en octets.'
			}
		]
	},

	'slug-generator': {
		about: [
			'Transformez n’importe quel titre en slug prêt pour l’URL : minuscules, mots séparés par des traits d’union, ponctuation retirée, accents translittérés en ASCII pur — "Crème brûlée à Paris" devient "creme-brulee-a-paris". Les options couvrent les variantes courantes : séparateur tiret bas, casse préservée, et une longueur maximale qui coupe à la frontière d’un mot plutôt qu’en plein milieu.',
			'Les slugs comptent pour les humains comme pour les moteurs de recherche : ils sont lisibles dans la barre d’adresse, survivent au copier-coller dans un chat sans échappement en pourcent, et donnent aux résultats de recherche une URL porteuse de mots-clés. L’étape de translittération est celle que la plupart des fonctions slugify maison oublient — sans elle, les titres accentués cassent les URL ou disparaissent complètement.',
			'Chaque ligne est slugifiée indépendamment : une liste de titres d’articles collée devient une liste de slugs correspondante en une seule opération.'
		],
		faqs: [
			{
				q: 'Pourquoi des traits d’union plutôt que des tirets bas ?',
				a: 'Les moteurs de recherche traitent les traits d’union comme des séparateurs de mots mais ont historiquement traité les tirets bas comme des liants, et les traits d’union sont visuellement plus clairs dans un texte de lien souligné. Les tirets bas restent populaires pour les noms de fichiers et les identifiants, les deux sont donc proposés.'
			},
			{
				q: 'Qu’advient-il des écritures non latines comme le chinois ou le cyrillique ?',
				a: 'Les caractères ayant un équivalent ASCII (latin accentué, quelques lettres spéciales comme ß → ss) sont translittérés ; les écritures sans correspondance latine simple sont supprimées. Pour du contenu non latin, l’usage courant est de garder l’écriture native encodée en pourcent dans l’URL, ou d’écrire un slug romanisé à la main.'
			},
			{
				q: 'Existe-t-il une longueur de slug idéale ?',
				a: 'Plus court est mieux pour le partage et l’affichage, mais il n’y a pas de seuil fatidique pour le classement. L’option de longueur maximale tronque à la frontière d’un mot — utile pour les CMS qui plafonnent les colonnes de slug à 50–80 caractères.'
			},
			{
				q: 'Le slug doit-il changer quand le titre change ?',
				a: 'Une fois publié, idéalement non — l’URL est une adresse vers laquelle d’autres ont lié. La plupart des sites gardent le slug d’origine ou ajoutent une redirection. Générez les slugs à la création et traitez les renommages comme une décision de redirection délibérée.'
			}
		]
	},

	'sort-lines': {
		about: [
			'Un établi de traitement de lignes : collez n’importe quelle liste et triez-la par ordre alphabétique, inverse, naturel (item2 avant item10), par longueur, ou mélangez-la — tout en supprimant au choix les espaces superflus, les lignes vides et les doublons, avec l’ordre préservé. Le nombre de lignes supprimées est indiqué, pour voir exactement ce que la déduplication a fait.',
			'Le tri naturel est l’option que vous utiliserez le plus : le tri alphabétique simple place "item10" avant "item2" car il compare caractère par caractère, tandis que le tri naturel compare les nombres intégrés numériquement — l’ordre que les humains attendent pour les noms de fichiers, les versions et les identifiants.',
			'La déduplication garde la première occurrence et préserve l’ordre d’origine des survivantes, ce qui compte quand l’ordre de la liste a un sens (imports, lignes de configuration, playlists). Un mode insensible à la casse traite "Apple" et "apple" comme une même ligne.'
		],
		faqs: [
			{
				q: 'Quelle est la différence entre tri alphabétique et tri naturel ?',
				a: 'L’alphabétique compare les codes de caractères, donc "file10" < "file2" (parce que "1" < "2" en position 5). Le tri naturel reconnaît les suites de chiffres et les compare comme des nombres, donnant file2 < file10. Utilisez le naturel pour tout ce qui contient des nombres.'
			},
			{
				q: 'La déduplication garde-t-elle la première ou la dernière occurrence ?',
				a: 'La première. Les lignes sont parcourues de haut en bas et une ligne n’est écartée que si une ligne identique (ou égale à la casse près, en mode insensible) est apparue plus haut — l’ordre des survivantes correspond donc à l’original.'
			},
			{
				q: 'Quelle taille de liste l’outil supporte-t-il ?',
				a: 'Des centaines de milliers de lignes passent sans problème — les opérations sont de simples parcours et un tri. Tout reste dans la mémoire du navigateur : la limite pratique est votre machine, pas un quota serveur.'
			},
			{
				q: 'Puis-je combiner les opérations ?',
				a: 'Oui, et elles s’appliquent dans un ordre sensé : d’abord la suppression des espaces, puis les lignes vides, puis la déduplication, puis le tri — ainsi " apple " et "apple" se dédupliquent ensemble quand le nettoyage est actif, et le tri voit toujours la liste nettoyée.'
			}
		]
	},

	'html-entities': {
		about: [
			'Échappez du texte pour l’inclure sans risque dans du HTML — & devient &amp;amp;, < devient &amp;lt; — ou décodez un texte truffé d’entités vers des caractères lisibles, en couvrant les entités nommées (&amp;rarr;), les références numériques décimales (&amp;#169;) et hexadécimales (&amp;#xA9;).',
			'L’encodage offre deux niveaux : les cinq caractères essentiels qui cassent la structure HTML (&amp; &lt; &gt; " \'), tout ce qu’il faut pour la correction, ou tout le non-ASCII, utile quand une chaîne d’outils abîme l’UTF-8 quelque part entre vous et la page. Un mode numérique seul évite les entités nommées pour une compatibilité maximale avec les parseurs XML stricts, qui ne garantissent que les cinq prédéfinies.',
			'Le décodeur est la moitié du quotidien : collez un extrait scrapé ou une réponse d’API pleine de &amp;#x27; et récupérez du texte propre. Les noms d’entités inconnus passent tels quels au lieu d’être devinés.'
		],
		faqs: [
			{
				q: 'Quels caractères doivent être échappés en HTML ?',
				a: 'Dans le contenu textuel : & et <. Dans les valeurs d’attributs : aussi le guillemet qui délimite l’attribut (" ou \'). Échapper > est conventionnel mais pas strictement requis. Tout le reste peut apparaître littéralement dans un document UTF-8.'
			},
			{
				q: 'L’encodage en entités protège-t-il contre les XSS ?',
				a: 'Échapper les cinq caractères structurels est le cœur de l’encodage de sortie en contexte HTML, oui — mais uniquement pour les contextes de texte et d’attributs HTML. Les URL, les chaînes JavaScript et le CSS exigent leurs propres encodages contextuels ; l’échappement d’entités seul ne rend pas l’injection arbitraire sûre dans ces contextes.'
			},
			{
				q: 'Entités nommées ou numériques — lesquelles émettre ?',
				a: 'Les références numériques (&amp;#xE9;) fonctionnent dans tout parseur HTML et XML. Les entités nommées sont plus lisibles, mais XML n’en prédéfinit que cinq : &amp;eacute; casse un pipeline XML/XHTML strict. Dans le doute, numérique.'
			},
			{
				q: 'Pourquoi vois-je &amp;amp;#39; (double encodage) dans mes données ?',
				a: 'Deux couches ont encodé chacune une fois : le &amp; du premier encodage a lui-même été échappé par un second passage. Décodez deux fois ici pour récupérer le texte, puis trouvez et corrigez la couche qui ne devrait pas encoder.'
			}
		]
	},

	'unicode-inspector': {
		about: [
			'Collez n’importe quel texte et voyez chaque caractère disséqué : son point de code (U+XXXX), ses octets UTF-8, ses unités UTF-16, sa séquence d’échappement JavaScript, son entité HTML et sa catégorie générale — plus les totaux de points de code, d’unités UTF-16, d’octets UTF-8 et de caractères perçus par l’utilisateur (grappes de graphèmes).',
			'C’est l’outil des moments "pourquoi cette chaîne est-elle bizarre ?" : les caractères invisibles (espaces de largeur nulle, BOM, marques directionnelles) apparaissent comme des lignes visibles ; les caractères sosies (а cyrillique contre a latin) révèlent des points de code différents ; et un emoji qui "fait un caractère" se révèle être sept points de code reliés par des liants de largeur nulle.',
			'Les quatre totaux de longueur différents répondent à l’éternelle question : pourquoi le .length de JavaScript, une limite d’octets en base de données et ce que voit l’utilisateur ne sont-ils jamais d’accord sur la longueur d’une chaîne.'
		],
		faqs: [
			{
				q: 'Pourquoi "🎉".length === 2 en JavaScript ?',
				a: 'Les chaînes JavaScript comptent des unités de code UTF-16. Les caractères au-delà de U+FFFF — dont la plupart des emojis — nécessitent une paire de substitution, soit deux unités. L’inspecteur montre les deux unités et le vrai point de code, et le résumé les compte séparément.'
			},
			{
				q: 'Qu’est-ce qu’une grappe de graphèmes ?',
				a: 'Ce qu’un lecteur perçoit comme un seul caractère. é peut être deux points de code (e + accent combinant), et les emojis de famille peuvent en compter sept ou plus reliés par des liants de largeur nulle. Le décompte de graphèmes utilise l’Intl.Segmenter du navigateur — ce qui se rapproche le plus des "caractères tels que les utilisateurs les voient".'
			},
			{
				q: 'Comment trouver les caractères invisibles dans une chaîne ?',
				a: 'Collez-la ici — chaque point de code a sa ligne, y compris les espaces de largeur nulle (U+200B), les espaces insécables (U+00A0), les BOM (U+FEFF) et les marques directionnelles, chacun étiqueté par catégorie. Ce sont les coupables classiques derrière des chaînes "identiques" qui échouent aux tests d’égalité.'
			},
			{
				q: 'Que m’apprennent les séquences d’octets UTF-8 ?',
				a: 'Exactement ce qui sera stocké ou transmis : l’ASCII fait un octet, la plupart des extensions latines deux, le CJC trois, les emojis quatre. Si un système tronque au milieu d’une séquence, vous obtenez des caractères de remplacement (�) — la vue en octets montre où de telles coupures tomberaient.'
			}
		]
	},

	'cron-parser': {
		about: [
			'Collez une expression cron à cinq champs et obtenez son explication en langage clair, avec un décryptage champ par champ et — la partie qui attrape les vraies erreurs — les cinq prochaines exécutions réelles calculées dans votre fuseau horaire local. "0 3 * * 1" se relit "À 03:00, le lundi", suivi des dates concrètes où elle se déclenchera.',
			'Le parseur prend en charge toute la syntaxe standard : listes (1,15), plages (9-17), pas (*/15), noms de mois et de jours (jan, mon), 7 pour dimanche, et la famille de macros @daily/@hourly. Il applique aussi la règle que tout le monde oublie : quand le jour du mois et le jour de la semaine sont tous deux restreints, la tâche s’exécute quand l’un OU l’autre correspond, pas les deux.',
			'Les expressions à six champs (Quartz, avec les secondes) sont détectées et signalées explicitement plutôt que mal interprétées en silence — la source la plus courante de confusion "mon cron est faux" en passant des planificateurs Java au crontab Unix.'
		],
		faqs: [
			{
				q: 'Quels sont les cinq champs, dans l’ordre ?',
				a: 'Minute (0–59), heure (0–23), jour du mois (1–31), mois (1–12), jour de la semaine (0–6, dimanche = 0, 7 étant aussi accepté pour dimanche). Se souvenir de l’ordre est l’éternel combat — le panneau de décryptage étiquette chaque champ de votre expression.'
			},
			{
				q: 'Pourquoi "0 0 1 * 1" s’exécute-t-il plus souvent que prévu ?',
				a: 'Parce que le jour du mois (le 1er) et le jour de la semaine (lundi) sont tous deux restreints, cron exécute la tâche quand L’UN OU L’AUTRE correspond — chaque 1er du mois ET chaque lundi. Pour dire "le 1er seulement si c’est un lundi", il faut une vérification de date côté script.'
			},
			{
				q: 'Quel fuseau horaire les prochaines exécutions utilisent-elles ?',
				a: 'Le fuseau local de votre navigateur, affiché à côté des résultats. Les vrais crontabs s’exécutent dans le fuseau du serveur (ou selon la ligne TZ= de certains crons) — vérifiez toujours ce qu’utilise la machine cible, surtout autour des changements d’heure.'
			},
			{
				q: 'Les secondes ou les années sont-elles prises en charge ?',
				a: 'Non — ce sont des extensions Quartz (Java) à 6 ou 7 champs. Le cron Unix standard a exactement cinq champs et une résolution d’une minute. Une entrée à six champs est détectée et signalée comme du Quartz plutôt que mal lue.'
			}
		]
	},

	'password-generator': {
		about: [
			'Générez des mots de passe aléatoires avec la longueur et les jeux de caractères de votre choix, en lot si besoin, avec un calcul d’entropie honnête — des bits d’aléa, pas une barre colorée décorative. L’aléa provient de crypto.getRandomValues avec échantillonnage par rejet : chaque caractère est tiré uniformément, sans biais de modulo.',
			'Chaque jeu de caractères activé est garanti d’avoir au moins un représentant (une politique que beaucoup de sites imposent), puis le reste du mot de passe se remplit uniformément et l’ensemble est mélangé — pour que les caractères garantis ne se regroupent pas de façon prévisible au début.',
			'Un filtre de caractères ambigus retire les sosies (0/O, 1/l/I) pour les mots de passe qu’un humain pourrait un jour lire à voix haute ou recopier depuis un papier. La génération étant locale, les mots de passe n’existent que sur votre machine, jusqu’à ce que vous les mettiez quelque part.'
		],
		faqs: [
			{
				q: 'Que signifient les bits d’entropie ?',
				a: 'Entropie = longueur × log2(taille du jeu) : le nombre de possibilités équiprobables qu’un attaquant doit parcourir. 64 bits d’entropie résistent aux attaques occasionnelles ; 80+ bits sont solides contre le craquage hors ligne de hachages rapides ; 100+ est effectivement indevinable. Un mot de passe de 16 caractères sur lettres+chiffres+symboles fait ~104 bits.'
			},
			{
				q: 'Un long mot de passe en minuscules vaut-il mieux qu’un court complexe ?',
				a: 'Souvent oui — la longueur multiplie l’entropie tandis que les jeux supplémentaires ne font qu’élargir la base du logarithme. 20 lettres minuscules (~94 bits) battent 10 caractères entièrement mélangés (~65 bits). Les règles de complexité existent surtout pour déjouer les listes de mots, ce que la génération aléatoire déjoue déjà.'
			},
			{
				q: 'Est-il sûr de générer des mots de passe dans un navigateur ?',
				a: 'L’aléa (crypto.getRandomValues) est le même CSPRNG que celui des gestionnaires de mots de passe natifs, et cette page n’effectue aucune requête réseau avec vos données. Les risques réalistes concernent l’après-génération : historique du presse-papiers, partage d’écran, et l’endroit où vous les stockez.'
			},
			{
				q: 'Pourquoi exclure les caractères ambigus ?',
				a: 'Pour les mots de passe destinés à être lus par des humains — codes de récupération imprimés, dictés au téléphone, recopiés depuis un autre écran — 0/O et 1/l/I génèrent de vrais tickets de support. Pour les mots de passe uniquement collés, gardez-les ; la perte d’entropie liée à l’exclusion est mineure dans les deux cas.'
			}
		]
	},

	'qr-code-generator': {
		about: [
			'Saisissez ou collez n’importe quel texte — une URL, des identifiants WiFi, des coordonnées — et obtenez un code QR instantanément, rendu en SVG vectoriel net à télécharger, ou exporté en PNG pour les chats et les présentations. Pas de filigrane, pas de redirection "offre gratuite" qui expire, et comme la génération est locale, ce que vous encodez ne touche jamais un serveur.',
			'Ce dernier point compte plus qu’il n’y paraît : beaucoup de services QR gratuits font passer votre URL par leur domaine de redirection (pour facturer plus tard ou pister les scans), si bien que le code cesse de fonctionner quand le service disparaît. Les codes générés ici encodent votre contenu directement et fonctionnent pour toujours.',
			'Quatre niveaux de correction d’erreur arbitrent entre capacité et robustesse — L survit à des dégâts légers, H survit à 30 % du symbole masqué (utile quand un logo couvrira le centre ou que l’impression sera petite et abîmée).'
		],
		faqs: [
			{
				q: 'Quel niveau de correction d’erreur choisir ?',
				a: 'M (15 %) est le choix par défaut raisonnable. Utilisez H (30 %) pour les petits codes imprimés, les codes derrière une vitre ou des reflets, ou en cas de superposition d’un logo. Une correction plus élevée densifie le code : pour des URL très longues à l’écran, L garde des modules plus grands et plus faciles à scanner.'
			},
			{
				q: 'Pourquoi le SVG vaut-il mieux que le PNG pour l’impression ?',
				a: 'Le SVG est indépendant de la résolution — l’imprimante rastérise à son DPI natif, gardant les bords des modules parfaitement nets à toute taille. Le PNG doit être généré à une taille en pixels donnée et peut devenir flou à l’agrandissement. SVG pour l’impression et les outils de design, PNG pour les chats et les présentations.'
			},
			{
				q: 'Combien de données tiennent dans un code QR ?',
				a: 'Jusqu’à ~3 Ko d’octets en théorie (version 40, niveau L), mais des codes aussi grands sont difficiles à scanner depuis un écran. En dessous de 300 caractères, le scan est fiable ; pour les URL longues, raccourcissez-les d’abord — avec le raccourcisseur de votre propre domaine si la pérennité compte.'
			},
			{
				q: 'Ces codes expirent-ils ou pistent-ils les scans ?',
				a: 'Non. Le contenu est encodé directement dans le motif — rien ne transite par ce site, il n’y a donc rien qui puisse expirer, et personne (nous compris) ne voit quand ni où le code est scanné. Le suivi des scans exige par nature un service de redirection.'
			}
		]
	},

	'json-to-yaml': {
		about: [
			'Convertissez entre JSON, YAML et TOML dans tous les sens. Le format source est détecté automatiquement au collage — des crochets suggèrent du JSON, des deux-points key: du YAML, des [tables] du TOML — avec un choix manuel pour les entrées ambiguës. La conversion passe par une vraie analyse syntaxique : la sortie est garantie valide, ce n’est pas une transformation texte ligne à ligne.',
			'Chaque format a de vraies forces : JSON pour les API et l’échange machine, YAML pour la configuration éditée à la main (Kubernetes, pipelines CI), TOML pour les fichiers de configuration bien typés (Cargo, pyproject). Déplacer des données de l’un à l’autre à la main invite les erreurs d’indentation et de guillemets que cette conversion élimine.',
			'Le convertisseur est honnête sur les limites des formats : TOML n’a ni tableaux de premier niveau ni null, et la conversion de tels documents explique pourquoi au lieu de perdre des données en silence.'
		],
		faqs: [
			{
				q: 'Les commentaires survivent-ils à la conversion ?',
				a: 'Non — JSON n’a pas de syntaxe de commentaire, et la conversion passe par la structure de données analysée, qui ne transporte pas les commentaires. Convertir YAML → JSON → YAML perd les commentaires irréversiblement ; gardez le fichier d’origine quand les commentaires comptent.'
			},
			{
				q: 'Pourquoi mon "no" YAML est-il devenu false ?',
				a: 'YAML 1.1 traite yes/no/on/off comme des booléens, et le code pays NO devient célèbrement false. Le parseur ici suit YAML 1.2 (seulement true/false), mais des fichiers écrits pour des parseurs plus anciens peuvent encore surprendre. Mettez entre guillemets les chaînes qui ressemblent à des booléens, des nombres ou des dates.'
			},
			{
				q: 'Pourquoi mon JSON échoue-t-il à se convertir en TOML ?',
				a: 'TOML exige une table (un objet) au premier niveau — un tableau ou un scalaire nu ne peut pas être un document TOML — et il n’a pas de null. Restructurez les données (enveloppez le tableau dans une clé, supprimez les null ou donnez-leur une valeur par défaut) et la conversion passera.'
			},
			{
				q: 'YAML est-il un sur-ensemble de JSON ?',
				a: 'En pratique oui — YAML 1.2 analyse la quasi-totalité des documents JSON, ce qui explique pourquoi coller du JSON dans une configuration YAML fonctionne généralement. L’inverse est faux : les ancres, scalaires multilignes et tags de YAML n’ont pas d’équivalent JSON et sont développés ou transformés en chaînes à la conversion.'
			}
		]
	},

	'json-to-csv': {
		about: [
			'Collez un tableau d’objets JSON et obtenez un CSV prêt pour le tableur : les objets imbriqués sont aplatis en noms de colonnes à points (user.address.city), les colonnes sont fusionnées sur l’ensemble des lignes (les valeurs manquantes deviennent des cellules vides), et les guillemets suivent la RFC 4180 : virgules, guillemets et sauts de ligne à l’intérieur des valeurs survivent à Excel et Google Sheets.',
			'C’est le chemin le plus rapide d’une réponse d’API vers une feuille de calcul que quelqu’un peut filtrer et croiser. La fusion des colonnes compte avec des données réelles, où les objets sont hétérogènes — la ligne 1 peut manquer de champs que la ligne 40 possède, et le convertisseur le gère au lieu d’échouer ou de perdre des données.',
			'Les tableaux à l’intérieur des lignes sont sérialisés en chaînes JSON plutôt qu’éclatés en colonnes — un choix délibéré qui garde une ligne d’entrée pour une ligne de sortie. Une option point-virgule couvre les régions où Excel attend ; plutôt que ,.'
		],
		faqs: [
			{
				q: 'Comment les objets imbriqués sont-ils représentés ?',
				a: 'Aplatis avec des clés jointes par des points : {"user":{"name":"Ada"}} devient une colonne user.name. Chaque valeur scalaire reste ainsi adressable dans une seule ligne d’en-tête plate — ce avec quoi les tableurs savent réellement travailler.'
			},
			{
				q: 'Qu’advient-il des tableaux à l’intérieur d’une ligne ?',
				a: 'Ils sont intégrés comme texte JSON dans une seule cellule (["a","b"]). Éclater les tableaux en colonnes (tags.0, tags.1…) ou en lignes supplémentaires change la forme de vos données de façon arbitraire — l’intégration garde la conversion sans perte et prévisible.'
			},
			{
				q: 'Pourquoi Excel affiche-t-il mon CSV dans une seule colonne ?',
				a: 'Paramètres régionaux : dans une bonne partie de l’Europe, Excel attend des fichiers séparés par des points-virgules, car la virgule est le séparateur décimal. Passez l’option de délimiteur sur le point-virgule, ou utilisez Données → À partir d’un fichier texte/CSV, qui permet de préciser le séparateur.'
			},
			{
				q: 'Le convertisseur gère-t-il un objet seul (pas un tableau) ?',
				a: 'Oui — un objet isolé devient un CSV d’une ligne. Attention toutefois : des objets indexés par identifiant ({"a1":{...},"a2":{...}}) se convertissent en une seule ligne très large ; transformez-les d’abord en tableau si chaque valeur doit être une ligne.'
			}
		]
	},

	'json-to-typescript': {
		about: [
			'Collez un échantillon JSON — une réponse d’API, un fichier de configuration — et obtenez une interface TypeScript inférée : les objets imbriqués deviennent des types imbriqués, les tableaux reçoivent des types d’éléments (avec des unions pour les contenus mixtes), et les clés qui ne sont pas des identifiants valides sont correctement mises entre guillemets.',
			'Les types générés sont un point de départ, pas un contrat : l’inférence ne voit qu’un échantillon, donc un champ qui se trouve être null dans votre exemple est typé null, et les champs optionnels absents lui sont simplement inconnus. La sortie est volontairement sobre — pas de décorateurs, pas de validation à l’exécution — pour être collée n’importe où et affinée.',
			'Pour les champs qui varient entre requêtes, passez un second échantillon et fusionnez à la main, ou passez à un outillage schema-first (OpenAPI, zod) une fois la forme stabilisée. Pour le quotidien "il me faut juste un type pour cette réponse", un collage suffit.'
		],
		faqs: [
			{
				q: 'Pourquoi mon champ nullable est-il typé simplement null ?',
				a: 'L’inférence ne voit que l’échantillon collé. Si le champ y était null, null est tout ce qu’elle peut savoir. Remplacez par string | null (ou le vrai type) après génération — ou collez un échantillon où le champ est renseigné.'
			},
			{
				q: 'Comment les champs optionnels sont-ils gérés ?',
				a: 'Ils ne sont pas détectés — un échantillon unique ne peut pas distinguer "toujours présent" de "présent cette fois". Les champs absents de l’échantillon sont absents du type. Marquez manuellement les champs optionnels (name?:) là où vous savez que l’API les omet.'
			},
			{
				q: 'Que produisent les tableaux à types mixtes ?',
				a: 'Une union : [1, "a"] infère (number | string)[]. Les tableaux vides infèrent unknown[] puisqu’il n’y a aucun élément à inspecter — remplacez par le vrai type d’élément quand vous le connaissez.'
			},
			{
				q: 'Types inférés ou bibliothèque de schémas comme zod ?',
				a: 'Les interfaces inférées n’existent qu’à la compilation — elles ne valident rien à l’exécution. Pour les outils internes et le typage rapide, elles sont parfaites ; pour des entrées non fiables à l’exécution, définissez un schéma zod/valibot et dérivez-en le type statique.'
			}
		]
	},

	'jsonpath-tester': {
		about: [
			'Testez des expressions JSONPath sur votre propre JSON et voyez chaque correspondance avec sa valeur et son chemin concret. La syntaxe couvre l’usage quotidien : notation par points et par crochets, indices de tableaux (y compris négatifs), jokers, unions ([\'a\',\'b\']) et descente récursive ($..price).',
			'Le chemin affiché pour chaque correspondance est la partie discrètement utile : interrogez $..id sur un document profond et chaque résultat vous dit exactement où il se trouve ($.data.items[3].id), prêt à coller dans du code. Cela transforme "quelque part dans ce blob" en adresse exacte.',
			'Les expressions de filtre ([?(@.price < 10)]) ne sont pas encore implémentées — l’outil le dit explicitement au lieu de renvoyer des résultats faux. Pour l’extraction structurelle, qui représente l’essentiel de l’usage de JSONPath, tout fonctionne.'
		],
		faqs: [
			{
				q: 'Quelle est la différence entre $.a.b et $..b ?',
				a: '$.a.b suit un chemin exact : la clé a à la racine, puis la clé b à l’intérieur. $..b (descente récursive) trouve chaque b n’importe où dans le document, à n’importe quelle profondeur. La descente récursive est puissante mais peut surprendre — elle attrape aussi des clés b nichées dans des endroits auxquels vous n’aviez pas pensé.'
			},
			{
				q: 'Comment accéder aux clés contenant des espaces ou des tirets ?',
				a: 'Notation par crochets avec guillemets : $[\'my key\'] ou $.data[\'content-type\']. La notation par points ne fonctionne que pour les clés qui ressemblent à des identifiants valides.'
			},
			{
				q: 'Les indices de tableaux négatifs fonctionnent-ils ?',
				a: 'Oui — [-1] est le dernier élément, [-2] l’avant-dernier, suivant la convention popularisée par Python et adoptée par la RFC 9535. [0] reste le premier élément.'
			},
			{
				q: 'JSONPath est-il standardisé ?',
				a: 'Depuis 2024, oui — la RFC 9535 en définit la syntaxe et la sémantique. Les implémentations antérieures divergent sur les cas limites (surtout les filtres et les unions) : une même expression peut se comporter différemment selon les bibliothèques ; testez avec celle que vous déployez.'
			}
		]
	},

	'bcrypt-generator': {
		about: [
			'Hachez un mot de passe avec bcrypt au facteur de coût de votre choix, ou vérifiez un texte en clair contre un hachage existant — le tout entièrement dans le navigateur, exactement ce qu’il faut quand la chose testée est un mot de passe. Un inspecteur décompose aussi tout hachage bcrypt en version, coût et sel.',
			'Bcrypt reste un choix solide pour le stockage des mots de passe parce qu’il est volontairement lent et salé par mot de passe : le facteur de coût double le travail à chaque incrément, donc un coût de 12 signifie 4096 itérations de l’initialisation du chiffre sous-jacent. La mesure de temps affichée montre la durée de votre coût choisi, rendant concret le compromis sécurité/latence.',
			'La vérification est le besoin quotidien le plus fréquent : confirmer qu’un hachage en base correspond à un mot de passe connu sans lancer le code applicatif. Collez les deux, obtenez un oui ou un non.'
		],
		faqs: [
			{
				q: 'Quel facteur de coût utiliser en production ?',
				a: 'Le conseil classique : aussi haut que votre budget de latence de connexion le permet, couramment 10–13 aujourd’hui. Visez 100–300 ms par hachage sur votre matériel de production. Le JavaScript du navigateur est plus lent que le natif : le temps affiché ici est une borne supérieure pour vos serveurs.'
			},
			{
				q: 'Pourquoi le même mot de passe donne-t-il un hachage différent à chaque fois ?',
				a: 'Un sel aléatoire de 16 octets est généré par hachage et stocké dans la chaîne de hachage elle-même. C’est voulu — des mots de passe identiques obtiennent des hachages différents, ce qui déjoue les tables arc-en-ciel précalculées. La vérification relit le sel depuis le hachage, c’est pourquoi la comparaison fonctionne.'
			},
			{
				q: 'Que signifient les parties d’un hachage bcrypt ?',
				a: '$2b$12$ + 53 caractères : 2b est la version de l’algorithme, 12 le coût (2^12 itérations), les 22 caractères suivants le sel, et les 31 derniers l’empreinte — le tout dans l’alphabet base64 propre à bcrypt. L’inspecteur sous l’outil découpe ainsi n’importe quel hachage.'
			},
			{
				q: 'Bcrypt est-il encore recommandé face à Argon2 ?',
				a: 'Argon2id est aujourd’hui le premier choix pour les nouveaux systèmes (sa gourmandise en mémoire résiste au craquage par GPU). Bcrypt reste acceptable et omniprésent — le conseil pratique : ne migrez pas dans la panique un stockage bcrypt qui fonctionne, mais choisissez Argon2id pour les projets neufs. Les deux sont des lieues au-dessus des hachages rapides comme SHA-256.'
			}
		]
	},

	'user-agent-parser': {
		about: [
			'Collez une chaîne User-Agent tirée d’une ligne de log, d’un rapport de bug ou d’un export analytics et obtenez son décodage : navigateur et version, moteur de rendu, système d’exploitation, type d’appareil et architecture CPU. Le parseur est ua-parser-js, la même bibliothèque derrière d’innombrables pipelines analytics, exécutée localement sur votre chaîne.',
			'Les chaînes User-Agent sont des sites archéologiques — chacune prétend encore être Mozilla/5.0, Chrome se fait passer pour Safari, Safari pour KHTML, et la vraie identité se cache dans les derniers segments. Un parseur bat le plissement d’yeux : il sait que "CriOS" signifie Chrome sur iOS et qu’Edge se cache derrière "Edg/".',
			'Notez le sens de l’histoire : les navigateurs figent et réduisent leurs chaînes UA (et Chromium fournit à la place les UA Client Hints), donc le détail de version tiré du seul UA devient de plus en plus grossier. Pour l’analyse de logs et le tri des bugs, il reste indispensable ; pour les décisions de fonctionnalités, utilisez la détection de fonctionnalités.'
		],
		faqs: [
			{
				q: 'Pourquoi chaque User-Agent commence-t-il par Mozilla/5.0 ?',
				a: 'Un théâtre de compatibilité des années 1990 qui n’a jamais cessé : les serveurs cherchaient "Mozilla" pour servir des pages modernes, alors chaque nouveau navigateur a prétendu l’être, et chaque navigateur suivant a imité ses prédécesseurs. Le préfixe n’est plus qu’une tradition vide de sens.'
			},
			{
				q: 'Puis-je faire confiance à la version d’OS dans une chaîne UA ?',
				a: 'De moins en moins chaque année. macOS a figé sa version UA à 10_15_7, Windows 11 se déclare Windows NT 10.0, et les navigateurs à UA réduit grossissent délibérément les versions. Traitez les versions d’OS issues de l’UA comme approximatives ; utilisez les UA Client Hints là où vous contrôlez le client.'
			},
			{
				q: 'Que signifie "like Gecko" ou "KHTML, like Gecko" ?',
				a: 'D’autres couches d’imitation : WebKit descend de KHTML et voulait que les pages traitant spécialement Gecko (le moteur de Firefox) fonctionnent, alors il a ajouté "like Gecko". Chaque navigateur WebKit/Blink porte cette formule encore aujourd’hui.'
			},
			{
				q: 'Devrais-je utiliser l’analyse d’UA pour la détection de fonctionnalités ?',
				a: 'Non — le sniffing casse dès qu’une nouvelle version de navigateur sort. Détectez la fonctionnalité elle-même (if ("clipboard" in navigator)). L’analyse d’UA sert à l’analytics, à l’analyse de logs et à la reproduction de bugs signalés par les utilisateurs, où connaître l’environnement est justement le but.'
			}
		]
	},

	'color-converter': {
		about: [
			'Saisissez une couleur dans n’importe quelle notation courante — #hex, rgb(), hsl() ou un nom de couleur CSS — et obtenez tous les formats à la fois : HEX, RGB, HSL et OKLCH, à côté d’un aperçu en direct. Les canaux alpha sont préservés d’un format à l’autre, et la sortie utilise la syntaxe CSS moderne (canaux séparés par des espaces) qui se colle proprement dans les feuilles de style actuelles.',
			'OKLCH est inclus parce que c’est là que va la couleur en CSS : contrairement à HSL, son axe de luminosité est perceptuellement uniforme — deux couleurs de même L paraissent réellement aussi lumineuses l’une que l’autre, et ajuster la teinte ne change pas accidentellement la luminosité perçue. Convertir une palette existante en OKLCH est la première étape vers des gammes de couleurs cohérentes.',
			'Les calculs de conversion s’exécutent localement avec les transformations publiées sRGB↔OKLab, et les valeurs font l’aller-retour : le RGB obtenu depuis une entrée HSL est exactement ce que le navigateur calculerait.'
		],
		faqs: [
			{
				q: 'Pourquoi les luminosités HSL et OKLCH ne concordent-elles pas ?',
				a: 'La luminosité HSL est une propriété géométrique des valeurs RGB, pas de la vision humaine — le jaune hsl(60 100% 50%) paraît bien plus lumineux que le bleu hsl(240 100% 50%) malgré un L identique. L’axe L d’OKLCH est conçu pour correspondre à la perception : à L égal, luminosité apparente égale. Ce désaccord est la raison d’être même d’OKLCH.'
			},
			{
				q: 'Que signifie la valeur alpha et où va-t-elle dans chaque format ?',
				a: 'Alpha est l’opacité, de 0 (transparent) à 1 (opaque). En hexadécimal à 8 chiffres, c’est l’octet final (#RRGGBBAA) ; dans la syntaxe fonctionnelle moderne, elle suit une barre oblique : rgb(76 141 255 / 0.5). Ce convertisseur propage l’alpha automatiquement dans chaque format.'
			},
			{
				q: 'Toute couleur OKLCH peut-elle s’afficher en sRGB ?',
				a: 'Non — OKLCH couvre des gamuts larges, et certaines combinaisons chroma/luminosité n’ont pas d’équivalent sRGB. Convertir depuis le sRGB (comme le fait cet outil) reste toujours représentable ; dans l’autre sens, les couleurs hors gamut doivent être écrêtées ou remappées — c’est pourquoi un vert P3 éclatant paraît plus terne sur un écran sRGB.'
			},
			{
				q: 'Pourquoi rgb(76 141 255) avec des espaces plutôt que des virgules ?',
				a: 'CSS Color Module Level 4 a standardisé les canaux séparés par des espaces avec un /alpha optionnel, et tous les navigateurs modernes le prennent en charge. La forme à virgules fonctionne toujours, mais la forme à espaces est celle qu’utilisent les nouvelles spécifications (et cet outil).'
			}
		]
	},

	'image-to-base64': {
		about: [
			'Déposez, choisissez ou collez une image et obtenez son Base64 sous toutes les formes utiles : un data URL prêt à l’emploi, une déclaration CSS background-image, une balise <img> complète avec ses dimensions réelles, et le payload Base64 brut. Le sens inverse fonctionne aussi — collez un data URL ou un bloc Base64 nu, et l’image est décodée, prévisualisée et téléchargeable en fichier.',
			'Le format est identifié par les octets magiques, pas par l’extension ni le type MIME déclaré : un PNG renommé en .jpg (ou un data URL mal étiqueté) se convertit donc correctement. Le panneau des tailles est honnête sur le coût : Base64 gonfle les données d’environ un tiers, et la taille encodée exacte s’affiche à côté de l’originale pour décider si l’incrustation en vaut la peine.',
			'Contrairement à la plupart des sites image vers Base64, rien n’est envoyé : le fichier est lu avec l’API FileReader du navigateur et encodé dans la page. C’est donc sans risque pour les captures de tableaux de bord internes, les visuels produits non publiés, ou tout ce que vous préférez ne pas confier au serveur d’un inconnu.'
		],
		faqs: [
			{
				q: 'Quand incruster une image en Base64 plutôt que lier un fichier ?',
				a: 'Quand l’image est petite (moins de ~10 Ko), change rarement et coûterait sinon une requête HTTP supplémentaire — icônes, logos dans les e-mails, documents HTML autonomes. Au-delà, le fichier séparé gagne : il se met en cache indépendamment, se charge en parallèle et ne gonfle pas votre HTML ou CSS de 33 %.'
			},
			{
				q: 'Pourquoi la version Base64 est-elle environ un tiers plus grosse que mon fichier ?',
				a: 'Base64 représente chaque groupe de 3 octets binaires par 4 caractères ASCII, un surcoût structurel de +33 % (plus jusqu’à deux caractères de bourrage). Gzip ou Brotli côté serveur en récupère une partie, mais l’inflation est inhérente à l’encodage — il échange de la taille contre la capacité d’incorporer du binaire dans du texte.'
			},
			{
				q: 'Puis-je décoder un data URL trouvé dans une feuille de style ou du HTML ?',
				a: 'Oui — passez en Base64 → image et collez le tout, préfixe data: compris. Les data URLs SVG en percent-encoding (ceux sans ;base64) se décodent aussi, et les sauts de ligne ou espaces du payload sont retirés automatiquement. Le résultat s’affiche dans la page et se télécharge avec la bonne extension.'
			},
			{
				q: 'Est-ce que ça marche pour SVG, GIF et ICO, ou seulement PNG et JPEG ?',
				a: 'Tout ce que le détecteur reconnaît se convertit en Base64 : PNG, JPEG, WebP, GIF, SVG, BMP, ICO et AVIF. Pour le SVG en particulier, notez que la source XML est souvent plus petite et plus lisible incrustée telle quelle — encoder du SVG en Base64 n’a vraiment de sens que lorsque les guillemets ou l’échappement posent problème.'
			}
		]
	},

	'image-converter': {
		about: [
			'Convertissez une image entre PNG, JPEG et WebP sans rien installer ni envoyer nulle part : déposez le fichier, choisissez la cible, réglez la qualité au curseur et regardez la taille de sortie se mettre à jour en temps réel. La tuile Δ montre exactement de combien le fichier converti est plus petit (ou plus gros) — choisir un réglage de qualité cesse d’être une devinette.',
			'Les trois formats ont des métiers distincts. PNG est sans perte avec transparence complète — parfait pour les captures d’écran, les éléments d’interface et tout ce qui a des bords nets ou du texte. JPEG compresse agressivement les photos mais n’a pas de canal alpha et floute les bords durs. WebP bat généralement JPEG de 25–35 % à qualité comparable, gère la transparence et est supporté par tous les navigateurs actuels — pour le web, c’est généralement la réponse.',
			'La conversion se fait sur un canvas dans votre navigateur : l’image est décodée, redessinée et réencodée par les mêmes codecs que votre navigateur utilise pour afficher les pages. C’est ce qui rend l’outil privé — et aussi la raison pour laquelle le nombre exact d’octets varie légèrement entre Chrome, Firefox et Safari, chacun embarquant son propre encodeur.'
		],
		faqs: [
			{
				q: 'Quel réglage de qualité utiliser pour JPEG et WebP ?',
				a: 'Entre 75 et 90 couvre presque tous les usages réels. À 85, la plupart des photos sont visuellement identiques à la source pour une fraction de la taille ; sous ~70, des artefacts en blocs apparaissent dans les dégradés et les tons chair ; au-dessus de 90, la taille grimpe en flèche pour des gains invisibles. Faites glisser le curseur en surveillant la tuile de taille — le bon compromis saute aux yeux.'
			},
			{
				q: 'Pourquoi mon PNG a-t-il grossi en passant en JPEG ?',
				a: 'JPEG est conçu pour les dégradés photographiques, pas pour les aplats. Captures d’écran, schémas et éléments d’interface se compressent superbement en PNG (longues séries de pixels identiques) mais forcent JPEG à stocker du bruit autour de chaque bord net — fichiers plus gros et ringing visible. Gardez les graphiques en PNG ou convertissez-les en WebP.'
			},
			{
				q: 'Que devient la transparence lors d’une conversion en JPEG ?',
				a: 'JPEG n’a pas de canal alpha : les zones transparentes doivent être remplies — cet outil les aplatit sur du blanc, la convention pour les images web. Si la transparence doit survivre, choisissez PNG ou WebP comme cible.'
			},
			{
				q: 'Pourquoi mon navigateur ne peut-il pas exporter en AVIF ou HEIC ici ?',
				a: 'L’API toBlob du canvas n’encode que les formats pour lesquels le navigateur embarque un encodeur — PNG et JPEG partout, WebP dans Chromium et Firefox. L’encodage AVIF reste rare et HEIC est grevé de brevets : les navigateurs les décodent mais ne les produisent pas. Si vous choisissez un format que votre navigateur ne sait pas écrire, l’outil le dit au lieu de vous donner un PNG en silence.'
			}
		]
	},

	'image-resizer': {
		about: [
			'Redimensionnez une image à une largeur exacte, une hauteur exacte ou un pourcentage de l’original — l’autre dimension suit automatiquement, rien n’est étiré. Choisissez un format de sortie (ou gardez celui d’origine), réglez la qualité pour les cibles avec perte, prévisualisez et téléchargez. Les tuiles avant/après montrent dimensions et taille de fichier d’un coup d’œil.',
			'La mise à l’échelle utilise le mode de lissage haute qualité du navigateur, qui applique un vrai rééchantillonnage plutôt qu’une décimation au plus proche voisin — les photos réduites restent nettes au lieu de scintiller d’aliasing. Redimensionner est aussi la façon honnête de réduire le poids : diviser les deux dimensions par deux supprime les trois quarts des pixels, ce qu’aucun curseur de qualité ne peut égaler.',
			'Les fichiers ne quittent jamais la page : décodage, rééchantillonnage et réencodage tournent sur un canvas local. Il n’y a pas de barre de progression d’envoi parce qu’il n’y a pas d’envoi — une photo de 40 mégapixels se redimensionne aussi vite que votre machine peut la redessiner, câble réseau débranché compris.'
		],
		faqs: [
			{
				q: 'Réduire puis ré-agrandir restaure-t-il mon image ?',
				a: 'Non — la réduction jette des pixels définitivement. Passer une photo de 3000px à 300px conserve 1 % des données ; la ré-agrandir interpole les 99 % manquants en flou. Gardez le fichier original et exportez-en des copies redimensionnées, plutôt que de redimensionner votre seul exemplaire.'
			},
			{
				q: 'Pourquoi mon image agrandie paraît-elle floue ?',
				a: 'L’agrandissement ne peut pas créer du détail jamais capturé — le navigateur interpole entre les pixels existants, ce qui se lit comme du flou au-delà d’environ 2×. Un vrai upscaling au-delà demande des outils à base de ML qui hallucinent du détail plausible ; un rééchantillonneur canvas n’invente délibérément rien.'
			},
			{
				q: 'Comment atteindre une taille cible, genre « moins de 200 Ko » ?',
				a: 'Jouez sur les deux leviers : redimensionnez d’abord aux plus grandes dimensions réellement nécessaires (1200px de large suffisent à la plupart des mises en page web), puis choisissez WebP ou JPEG et baissez la qualité jusqu’à ce que la tuile de taille passe sous l’objectif. La réduction des dimensions fait l’essentiel du travail — la qualité affine le reste.'
			},
			{
				q: 'Le redimensionnement supprime-t-il les métadonnées EXIF comme la position GPS ?',
				a: 'Oui. Le pipeline canvas réencode des pixels purs — modèle d’appareil, horodatages, coordonnées GPS et toutes les autres balises EXIF disparaissent de la sortie. C’est généralement un gain de confidentialité pour des images destinées au web public ; si vous devez préserver les métadonnées, conservez l’original à côté.'
			}
		]
	}
};

export default TOOL_CONTENT_FR;
