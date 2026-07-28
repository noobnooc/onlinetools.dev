import type { ToolContent } from './content';

/**
 * Dutch long-form tool copy (About + FAQ). Written entry by entry
 * against the English content.ts; anything missing falls back to English.
 */
const TOOL_CONTENT_NL: Record<string, ToolContent> = {
	'json-formatter': {
		about: [
			'Plak willekeurige JSON — een API-antwoord, een configuratiebestand, een logregel — en deze formatter drukt het netjes af met de inspringing van jouw keuze, of minificeert het om ergens in te sluiten. Het parsen gebeurt met de eigen JSON-engine van de browser, dus wat hier valideert is exact wat JavaScript en elke JSON-conforme parser accepteert.',
			'Is de invoer ongeldig, dan krijg je de exacte regel en kolom waar het parsen misging, in plaats van een vage “unexpected token” ergens. Samen met de monospace-editor wordt het opsporen van een ontbrekende komma in een payload van 500 regels een klus van tien seconden. Je kunt objectsleutels ook alfabetisch sorteren, wat helpt vlak voordat je twee payloads vergelijkt.',
			'Het formatteren draait volledig in je browser. Payloads met tokens, klantgegevens of interne URL’s verlaten je machine nooit — er is geen server die ze zou kunnen loggen.'
		],
		faqs: [
			{
				q: 'Waarom faalt mijn JSON met “Unexpected token” terwijl het er prima uitziet?',
				a: 'De gebruikelijke boosdoeners zijn een komma na het laatste item, enkele in plaats van dubbele aanhalingstekens, sleutels zonder aanhalingstekens, of commentaar. Dat mag allemaal in JavaScript-objectliterals (of JSON5), maar niet in strikte JSON. De regel-/kolommarkering wijst het eerste probleemteken aan.'
			},
			{
				q: 'Is er een maximumgrootte?',
				a: 'Geen harde limiet — het parsen gebeurt lokaal, dus het hangt van je machine af. Documenten tot tientallen megabytes formatteren prima in een moderne browser; daarboven kan het tabblad traag worden omdat het hele document in het geheugen staat.'
			},
			{
				q: 'Verandert formatteren mijn data?',
				a: 'Alleen witruimte, tenzij je sleutels laat sorteren. Getallen worden opnieuw geserialiseerd door de JavaScript-engine, dus 1e2 wordt 100 en gehele getallen buiten de IEEE-754-precisie worden genormaliseerd — precies wat elke JS-gebaseerde consument van je JSON ook zou doen.'
			},
			{
				q: 'Kan ik JSON valideren zonder het te herformatteren?',
				a: 'Ja — de statusbadge boven het invoerveld werkt bij terwijl je typt en meldt of het document parseert, hoe groot het is en waar de eerste fout zit. De actie Formatteren heb je alleen nodig als je de uitvoer herschreven wilt hebben.'
			}
		]
	},

	'base64-decode': {
		about: [
			'Base64 zet willekeurige bytes om in een alfabet van 64 tekens dat overleeft wat je erin plakt: JSON, URL’s, HTTP-headers en e-mail. Deze tool converteert in beide richtingen: typ of plak tekst om te coderen, of plak een gecodeerde blob om het origineel terug te krijgen. UTF-8 wordt in beide richtingen correct behandeld, dus emoji en niet-Latijnse schriften komen ongeschonden terug.',
			'De decoder is met opzet vergevingsgezind: hij accepteert het URL-veilige alfabet (- en _ in plaats van + en /), verwijdert witruimte en regeleinden, en herstelt ontbrekende padding vóór het decoderen — de drie dingen die striktere decoders het vaakst laten struikelen over volstrekt herstelbare invoer. Zijn de gedecodeerde bytes geen geldige UTF-8-tekst, dan zegt hij dat in plaats van onzin te tonen; meestal betekent dat dat de payload binaire data was, zoals een afbeelding.',
			'Alles gebeurt in de pagina. Een token of inloggegeven hier decoderen verstuurt het nergens heen.'
		],
		faqs: [
			{
				q: 'Waarom eindigt mijn Base64-string op =-tekens?',
				a: 'Base64 codeert 3 bytes naar 4 tekens, dus wanneer de invoerlengte geen veelvoud van 3 is, wordt de uitvoer met = aangevuld om de groepen uitgelijnd te houden. Padding bevat geen data; deze decoder herstelt het automatisch als het was weggehaald.'
			},
			{
				q: 'Wat is het verschil tussen standaard en URL-veilige Base64?',
				a: 'Standaard-Base64 gebruikt + en /, die in URL’s een speciale betekenis hebben en zelf geëscaped moeten worden. De URL-veilige variant (RFC 4648 §5) vervangt ze door - en _ en laat de padding meestal weg. JWT’s gebruiken bijvoorbeeld de URL-veilige vorm. De encoder hier biedt beide; de decoder accepteert automatisch allebei.'
			},
			{
				q: 'Is Base64 versleuteling?',
				a: 'Nee. Base64 is een omkeerbare codering zonder sleutel — iedereen kan het decoderen. Het beschermt data tegen beschadiging tijdens transport, niet tegen meelezen. Heb je vertrouwelijkheid nodig, versleutel dan eerst en codeer de cijfertekst.'
			},
			{
				q: 'Waarom zegt het decoderen dat het resultaat geen geldige UTF-8 is?',
				a: 'De string is succesvol gedecodeerd, maar de resulterende bytes zijn geen tekst — vaak een PNG, een PDF, of gecomprimeerde/versleutelde data. Zulke inhoud in een tekstvak tonen zou onleesbare tekens opleveren, dus meldt de tool het in plaats daarvan.'
			}
		]
	},

	'timestamp-converter': {
		about: [
			'Unix-tijd telt seconden sinds 1970-01-01T00:00:00 UTC, en je komt het overal tegen: databaserijen, JWT-claims, logbestanden, API-antwoorden. Deze converter accepteert een tijdstempel in seconden of milliseconden — de eenheid wordt uit de grootte afgeleid — plus ISO 8601-strings en de meeste leesbare datums, en toont alle weergaven tegelijk: ISO, UTC, je lokale tijd, relatieve tijd en beide unix-precisies.',
			'De dubbelzinnige eenheid is de klassieke valkuil: 1700000000 is november 2023 in seconden, maar januari 1970 in milliseconden. De gedetecteerde eenheid wordt expliciet getoond en je kunt hem met één klik overrulen als de gok fout is — geen cijfers meer tellen in je hoofd.',
			'De conversie is direct en lokaal, en de huidige-tijdweergave blijft doortikken, zodat de pagina ook dienstdoet als epoch-klok terwijl je werkt.'
		],
		faqs: [
			{
				q: 'Hoe kiest de tool tussen seconden en milliseconden?',
				a: 'Op grootte: waarden van 11 cijfers of meer worden als milliseconden gelezen, kortere als seconden. Dat dekt seconden tot ongeveer het jaar 5138 en milliseconden vanaf circa 1973, wat elk realistisch modern tijdstempel eenduidig maakt. Voor randgevallen kun je de eenheid handmatig omzetten.'
			},
			{
				q: 'Wat gebeurt er na 2038?',
				a: 'Het jaar-2038-probleem treft systemen die unix-tijd in een 32-bits integer met teken opslaan. JavaScript-getallen zijn 64-bits floats, dus deze converter verwerkt datums ver voorbij 2038 — tot ruim voorbij het jaar 275760, de grens van JavaScript Date.'
			},
			{
				q: 'Kan ik een datum terugrekenen naar een tijdstempel?',
				a: 'Ja. Plak een ISO 8601-string zoals 2026-07-20T12:00:00Z, of de meeste gangbare datumnotaties, en de unix-seconden en -milliseconden verschijnen naast de andere weergaven.'
			},
			{
				q: 'Welke tijdzone wordt gebruikt voor de regel met lokale tijd?',
				a: 'De tijdzone die in je browser is ingesteld, via de Intl-API — er wordt niets extern opgezocht. De naam van de tijdzone staat naast de waarde, zodat schermafbeeldingen ondubbelzinnig blijven.'
			}
		]
	},

	'jwt-decoder': {
		about: [
			'Een JSON Web Token bestaat uit drie Base64URL-segmenten — header, payload, handtekening — verbonden door punten. Deze decoder splitst een token, toont header en payload als geformatteerde JSON, markeert de geregistreerde tijdclaims (iat, exp, nbf) als leesbare datums en vertelt je in één oogopslag of het token verlopen is.',
			'Decoderen is geen verifiëren: de payload van elk JWT is leesbaar voor wie het token heeft, want Base64URL is een codering, geen versleuteling. Precies daarom is een token in een willekeurige website plakken normaal gesproken een slecht idee — deze pagina is de uitzondering, omdat het decoderen volledig in je browser gebeurt en het token nooit wordt verstuurd. Handtekeningverificatie tegen een geheim of publieke sleutel valt bewust buiten het bestek van de offline decoder.',
			'Een voorloopvoorvoegsel “Bearer ” wordt automatisch verwijderd, zodat je direct uit een Authorization-header kunt plakken.'
		],
		faqs: [
			{
				q: 'Is het veilig om hier een productietoken te plakken?',
				a: 'Het token blijft in je browser — deze pagina doet geen enkel netwerkverzoek met je invoer, wat je in het netwerktabblad van de developer tools kunt bevestigen. Behandel levende tokens toch als wachtwoorden: gebruik bij voorkeur verlopen of testtokens als je schermafbeeldingen deelt.'
			},
			{
				q: 'Waarom laat mijn token zich niet decoderen?',
				a: 'Controleer of het precies drie door punten gescheiden segmenten heeft en geen regeleinden uit een geknipte kopie. Opake access tokens (zoals veel GitHub- of Google-tokens) zijn helemaal geen JWT’s — geen enkele decoder opent een willekeurige string die nooit JSON bevatte.'
			},
			{
				q: 'Wat betekenen iat, exp en nbf?',
				a: 'Het zijn geregistreerde claims uit RFC 7519, alle in unix-seconden: iat is wanneer het token is uitgegeven, exp wanneer het ongeldig wordt, en nbf (“not before”) het vroegste moment waarop het aanvaard mag worden. Deze tool zet ze om naar leesbare datums en vergelijkt exp met je klok.'
			},
			{
				q: 'Kan deze tool de handtekening verifiëren?',
				a: 'Nee — en een groen vinkje van een online tool zou je voor beveiligingsbeslissingen sowieso niet moeten vertrouwen. Verifieer handtekeningen in je backend met een onderhouden bibliotheek (jose, jsonwebtoken, PyJWT) tegen de echte sleutels van de uitgever.'
			}
		]
	},

	'regex-tester': {
		about: [
			'Schrijf een patroon, plak voorbeeldtekst, en elke match wordt gemarkeerd terwijl je typt — met capture-groepen, benoemde groepen en matchposities eronder. De tester gebruikt de JavaScript-RegExp-engine, dus het gedrag komt exact overeen met wat Node.js en browsers doen, inclusief lookbehind, benoemde groepen en Unicode-eigenschapescapes.',
			'Vlaggen zet je per letter aan (g, i, m, s, u, y, d) en het patroon wordt bij elke toetsaanslag gecompileerd; syntaxfouten verschijnen meteen met de eigen melding van de engine in plaats van pas na een klik op een knop. Patronen met lege matches zoals a* worden veilig afgehandeld en het aantal matches is begrensd op 10.000, zodat een verdwaalde .* het tabblad niet kan laten vastlopen.',
			'Regex-dialecten verschillen per engine — een patroon dat hier werkt kan aanpassing nodig hebben voor PCRE, RE2 of de re-module van Python, vooral rond lookbehind-ondersteuning, possessieve kwantoren en inline-vlaggen.'
		],
		faqs: [
			{
				q: 'Welke regex-smaak gebruikt deze tester?',
				a: 'ECMAScript (JavaScript), zoals jouw eigen browser die implementeert. Hij ondersteunt lookahead, lookbehind, benoemde capture-groepen, backreferences en Unicode-eigenschapescapes zoals \\p{Letter} (met de u-vlag). PCRE-only-syntaxis zoals possessieve kwantoren of recursie wordt niet ondersteund.'
			},
			{
				q: 'Waarom matcht mijn patroon alles / niets?',
				a: 'De twee klassieke oorzaken: een niet-geëscapet metateken (. matcht elk teken — escape het als \\. voor een letterlijke punt), of een in gedachten ontbrekende g-vlag — deze tester vindt altijd alle matches, maar jouw code vindt alleen de eerste als g niet is gezet.'
			},
			{
				q: 'Wat zijn benoemde capture-groepen?',
				a: 'De syntaxis (?<naam>...) geeft een groep een label, zodat je matches op naam kunt uitlezen in plaats van op positie: match.groups.naam in JavaScript. Het groepenpaneel onder de matches toont per match zowel genummerde als benoemde captures.'
			},
			{
				q: 'Draait een regex van hier ongewijzigd in Python of Go?',
				a: 'Vaak wel, niet altijd. Tekenklassen, kwantoren en ankers zijn overdraagbaar; lookbehind, de syntaxis voor benoemde groepen (Python gebruikt (?P<naam>...)) en inline-vlaggen verschillen. De RE2-engine van Go weigert bovendien backreferences en lookaround volledig.'
			}
		]
	},

	'diff-checker': {
		about: [
			'Plak links de oorspronkelijke tekst en rechts de gewijzigde versie, en krijg een samengevoegde regel-voor-regelvergelijking: verwijderingen in rood, toevoegingen in groen, context ertussen bewaard, met aan beide zijden de oorspronkelijke regelnummers. Het is de snelste manier om te beantwoorden “wat is er nu eigenlijk veranderd?” tussen twee configuraties, twee API-antwoorden of twee versies van een fragment dat iemand in de chat plakte.',
			'De vergelijking gebruikt een longest-common-subsequence-algoritme over regels — dezelfde familie als achter git diff — waardoor herschikte blokken en kleine bewerkingen een leesbaar resultaat opleveren in plaats van alles als gewijzigd te markeren. Een samenvattingsregel telt toegevoegde en verwijderde regels op.',
			'Omdat beide teksten in de pagina blijven, brengt het vergelijken van vertrouwelijk materiaal — contracten, inloggegevens in configuraties, nog niet gepubliceerde teksten — geen van de risico’s met zich mee van het plakken in een willekeurige webdienst.'
		],
		faqs: [
			{
				q: 'Werkt de vergelijking op woorden of op regels?',
				a: 'Op regels. Elke regel wordt als geheel vergeleken, wat aansluit bij hoe ontwikkelaars diffs van code en configuratie lezen. Een gewijzigde regel verschijnt dus als één verwijdering plus één toevoeging; markering op tekenniveau staat op de roadmap.'
			},
			{
				q: 'Waarom toont mijn diff alles als gewijzigd?',
				a: 'Meestal door onzichtbare verschillen: de ene kant gebruikt tabs en de andere spaties, Windows-CRLF tegenover Unix-LF, of witruimte aan het regeleinde. Witruimte normaliseren vóór het vergelijken (de JSON-formatter met gesorteerde sleutels helpt bij JSON-payloads) maakt de echte wijzigingen zichtbaar.'
			},
			{
				q: 'Kan ik twee JSON-antwoorden zinvol vergelijken?',
				a: 'Ja — haal ze eerst allebei door de JSON-formatter met sleutelsortering aan, zodat gelijkwaardige documenten identiek serialiseren. Dan toont de diff echte waardewijzigingen in plaats van ruis door sleutelvolgorde.'
			},
			{
				q: 'Is er een maximale tekstgrootte?',
				a: 'Het algoritme vergelijkt elke regel van de ene tekst met elke regel van de andere, dus extreem grote bestanden (tienduizenden regels aan beide kanten) kunnen even duren. Gewone codebestanden en API-payloads vergelijken direct.'
			}
		]
	},

	'url-encode-decode': {
		about: [
			'Tekens als spaties, ampersands en niet-ASCII-letters kunnen niet onbewerkt in een URL staan, dus worden ze percent-gecodeerd: een spatie wordt %20, 你 wordt %E4%BD%A0. Deze tool codeert tekst voor veilig gebruik in URL’s en decodeert percent-geëscapete strings terug naar leesbare tekst, inclusief de +-conventie voor spaties in querystrings.',
			'Er zijn twee coderingsmodi omdat JavaScript er zelf ook twee heeft: componentmodus (encodeURIComponent) escapet alles wat een URL zou kunnen opdelen, wat je wilt voor één enkele querystringwaarde; volledige-URI-modus (encodeURI) behoudt structurele tekens als /, ? en &, voor wanneer je een hele URL codeert die navigeerbaar moet blijven.',
			'Het decoderen is streng over misvormde %-reeksen — een losse % of %ZZ wordt als fout gemeld in plaats van stilzwijgend doorgelaten, precies zoals browsers en servers het ook behandelen.'
		],
		faqs: [
			{
				q: 'Wanneer gebruik ik componentmodus en wanneer volledige-URI-modus?',
				a: 'Codeer je een waarde die ín een URL komt (een zoekterm, een redirect-doel, een e-mailadres in een parameter) → componentmodus, zodat & en = binnen de waarde de querystring niet breken. Codeer je een complete URL om te tonen of te versturen → volledige-URI-modus, zodat de structuur van de URL intact blijft.'
			},
			{
				q: 'Waarom betekent + soms een spatie?',
				a: 'Het formaat application/x-www-form-urlencoded — gebruikt door HTML-formulieren en querystrings — codeert spaties historisch als +. In URL-paden is + gewoon een plus. De decoder hier behandelt + als spatie, conform querystring-semantiek; %20 werkt altijd en overal.'
			},
			{
				q: 'Waarom is mijn string dubbel gecodeerd (%2520)?',
				a: '%25 is de codering van % zelf, dus %2520 betekent dat de tekst %20 een tweede keer is gecodeerd. Dat gebeurt wanneer twee lagen van een systeem allebei coderen. Decodeer hier twee keer om het uit te pakken en repareer daarna de laag die niet zou moeten coderen.'
			},
			{
				q: 'Worden Unicode-tekens correct behandeld?',
				a: 'Ja — tekst wordt eerst als UTF-8 gecodeerd en daarna wordt elke byte percent-geëscaped, volgens de WHATWG URL-standaard. Daarom wordt één CJK-teken drie %XX-groepen.'
			}
		]
	},

	'url-parser': {
		about: [
			'Plak een URL en zie hem ontleed: protocol, host, poort, pad, fragment en elke queryparameter als een gedecodeerde sleutel-waardetabel. Het gebruikt dezelfde WHATWG-URL-parser als je browser voor navigatie, dus de interpretatie die je ziet is de interpretatie die een browser daadwerkelijk toepast — inclusief randgevallen als het weglaten van standaardpoorten en het normaliseren van paden.',
			'De tabel met queryparameters gebruik je het vaakst: lange OAuth-redirects, met analytics getagde links en API-aanroepen worden in één oogopslag leesbaar, met elke waarde al percent-gedecodeerd. Kale domeinen zonder schema worden ook geaccepteerd; voor het parsen wordt https:// aangenomen.',
			'Het combineert vanzelf met de URL-encoder — parseer hier een URL om de parameter te vinden die je nodig hebt, pas de waarde aan, en codeer hem daar opnieuw.'
		],
		faqs: [
			{
				q: 'Waarom verschilt de geparseerde URL licht van wat ik plakte?',
				a: 'De WHATWG-parser normaliseert: hij zet schema en host in kleine letters, verwijdert standaardpoorten (:443 voor https), lost ./- en ../-padsegmenten op en codeert tekens die dat nodig hebben. Wat je ziet is de canonieke vorm waar servers en browsers het over eens zijn.'
			},
			{
				q: 'Kan hij URL’s met dubbele querysleutels aan?',
				a: 'Ja — elk voorkomen krijgt zijn eigen rij, in volgorde. Dubbele sleutels zijn legaal en gebruikelijk: veel API’s lezen ze als arrays (?tag=a&tag=b).'
			},
			{
				q: 'Wat is het verschil tussen host en hostname?',
				a: 'hostname is alleen het domein (example.com); host bevat ook een expliciete niet-standaardpoort (example.com:8080). Als de poort de standaard van het schema is, zien beide er hetzelfde uit omdat de poort wordt weggelaten.'
			},
			{
				q: 'Wordt het fragment (#...) naar de server gestuurd?',
				a: 'Nee. Alles na # blijft in de browser — servers zien het nooit. Daarom gebruikten single-page-apps het vroeger voor routing aan de clientzijde, en daarom zijn analytics-parameters achter # onzichtbaar voor de backend.'
			}
		]
	},

	'uuid-generator': {
		about: [
			'Genereer universeel unieke identifiers in vier smaken: UUID v4 (volledig willekeurig, de dagelijkse standaard), UUID v7 (tijdgeordend, de moderne keuze voor databasesleutels), ULID (tijdgeordend met een compacte Crockford-Base32-schrijfwijze) en Nano ID (kort en URL-vriendelijk). Genereer er één of maximaal duizend tegelijk — één per regel, klaar om in een seed-script te plakken.',
			'De willekeur komt van de Web Crypto API (crypto.getRandomValues), de cryptografisch veilige bron, niet van Math.random. Het genereren gebeurt lokaal, wat betekent dat de ID’s bij niemand anders bekend zijn, nergens gelogd worden en offline beschikbaar zijn.',
			'Kies je een ID-formaat voor een nieuw systeem: v7 en ULID sorteren op aanmaaktijd, wat B-tree-indexen blij maakt en ID’s in logs ongeveer chronologisch houdt; v4 verraadt niets over het moment van aanmaak, wat soms precies is wat je wilt.'
		],
		faqs: [
			{
				q: 'Wat is het verschil tussen UUID v4 en v7?',
				a: 'v4 is 122 willekeurige bits. v7 (RFC 9562) begint met een 48-bits unix-milliseconde-tijdstempel gevolgd door willekeurige bits, dus later gegenereerde ID’s sorteren later. Voor primaire databasesleutels verbetert v7 doorgaans de insert-lokaliteit en de indexgrootte; v4 blijft prima waar volgorde er niet toe doet of timing niet mag uitlekken.'
			},
			{
				q: 'Kunnen twee gegenereerde UUID’s botsen?',
				a: 'Met 122 willekeurige bits is de kans zo klein dat je er niet omheen hoeft te ontwerpen: je zou decennialang miljarden ID’s per seconde moeten genereren voor zelfs maar een verwaarloosbare kans. Botsingen in de praktijk komen van bugs (een seed hergebruiken, rijen kopiëren), niet van de willekeur.'
			},
			{
				q: 'Waarom ULID kiezen boven UUID v7?',
				a: 'Ze lossen hetzelfde probleem op. ULID is 26 tekens hoofdletterongevoelige Crockford-Base32 — korter en netter in URL’s en logs — terwijl v7 de standaard 36-tekenvorm van UUID houdt die elke database en bibliotheek al accepteert. Kies wat je ecosysteem het meest natuurlijk verwerkt.'
			},
			{
				q: 'Zijn deze ID’s veilig als geheim of token?',
				a: 'De willekeur is cryptografisch veilig, maar ID’s worden meestal getoond, gelogd en geïndexeerd — ze gelden als publiek. Genereer voor sessietokens of API-sleutels een apart geheim met minstens 128 willekeurige bits en behandel het als een wachtwoord.'
			}
		]
	},

	'hash-generator': {
		about: [
			'Bereken MD5-, SHA-1-, SHA-256-, SHA-384- en SHA-512-digests van willekeurige tekst, plus HMAC-handtekeningen met sleutel, rechtstreeks in de browser. De SHA-familie en HMAC gebruiken de Web Crypto API — dezelfde gecontroleerde primitieven die je browser voor TLS gebruikt — terwijl MD5 (dat Web Crypto bewust weglaat) als kleine lokale implementatie meekomt voor oude checksums.',
			'Hashes worden live bijgewerkt terwijl je typt, en elk algoritme wordt tegelijk berekend, zodat het vergelijken met een checksum in welk algoritme een downloadpagina ook koos geen instellingen vergt. In HMAC-modus komt er een veld voor een geheime sleutel bij, om webhook-handtekeningen te verifiëren — GitHub, Stripe en de meeste webhook-aanbieders ondertekenen payloads met HMAC-SHA256.',
			'Omdat de invoer de pagina nooit verlaat, kun je veilig dingen hashen die je niet in een online dienst zou plakken: API-payloads, wachtwoorden die je tegen een gelekte-hashlijst controleert, interne documenten.'
		],
		faqs: [
			{
				q: 'Welk hash-algoritme moet ik gebruiken?',
				a: 'Voor alles wat vandaag met beveiliging te maken heeft: SHA-256 of sterker. MD5 en SHA-1 zijn gebroken wat botsingsbestendigheid betreft — twee verschillende invoeren kunnen met dezelfde digest worden geconstrueerd — dus ze blijven alleen bestaan voor niet-vijandige checksums en compatibiliteit met oude protocollen.'
			},
			{
				q: 'Waarom wordt MD5 dan nog aangeboden?',
				a: 'Omdat je het nog steeds tegenkomt: ETags, cachesleutels, bestandsmanifesten, oude databasekolommen. Zulke waarden verifiëren vereist MD5 berekenen, los van de cryptografische status ervan. Ontwerp er alleen niets nieuws omheen.'
			},
			{
				q: 'Wat is HMAC en hoe verschilt het van een gewone hash?',
				a: 'HMAC mengt een geheime sleutel door het hashen, zodat alleen sleutelhouders de digest kunnen maken of verifiëren. Een gewone hash bewijst integriteit (“deze data is ongewijzigd”); een HMAC bewijst ook authenticiteit (“iemand met de sleutel heeft dit gemaakt”). Webhook-handtekeningen verifiëren is het dagelijkse gebruik.'
			},
			{
				q: 'Is hashen hetzelfde als een wachtwoord versleutelen?',
				a: 'Nee, en snelle hashes als SHA-256 zijn het verkeerde gereedschap om wachtwoorden op te slaan — aanvallers proberen er miljarden per seconde. Wachtwoordopslag vraagt om een bewust traag, gesalt algoritme: bcrypt, scrypt of Argon2.'
			}
		]
	},

	'case-converter': {
		about: [
			'Identifiers reizen voortdurend tussen conventies: de API geeft snake_case terug, je TypeScript wil camelCase, de CSS-klasse heeft kebab-case nodig en de omgevingsvariabele eist CONSTANT_CASE. Deze converter neemt willekeurige gemengde invoer — spaties, underscores, koppeltekens, bestaande camelCase — splitst die verstandig in woorden en voegt ze meteen in negen doelstijlen weer samen.',
			'De splitser begrijpt de lastige gevallen: hij breekt “getUserByID” op in get/user/by/id (waarbij het acroniem tot de grens intact blijft), rekent cijfers bij hun woord en verwerkt elke regel apart, zodat je een hele kolom databasevelden kunt plakken en in één keer kunt omzetten.',
			'Elke stijl wordt tegelijk getoond met een kopieerknop per rij — je hoeft geen modus vooraf te kiezen, gewoon plakken en pakken wat je nodig hebt.'
		],
		faqs: [
			{
				q: 'Hoe worden acroniemen als “HTTPResponse” behandeld?',
				a: 'Een reeks hoofdletters gevolgd door een kleine letter wordt gesplitst vóór de laatste hoofdletter: HTTPResponse → http + response. Dat komt overeen met hoe de meeste stijlgidsen acroniemen willen tokeniseren, al kan geen enkele splitser de bedoeling perfect raden — randgevallen als “IOError” worden io + error.'
			},
			{
				q: 'Kan ik veel identifiers tegelijk omzetten?',
				a: 'Ja — elke regel wordt apart omgezet. Plak een lijst kolomnamen, één per regel, en de uitvoer behoudt de regelstructuur in de nieuwe stijl.'
			},
			{
				q: 'Wat is hier het verschil tussen Title Case en Sentence case?',
				a: 'Title Case zet elk woord met een hoofdletter (“User Account Id”); Sentence case alleen het eerste (“User account id”). Geen van beide past de redactionele regels over lidwoorden en voorzetsels toe — voor identifiers wil je die vrijwel nooit.'
			},
			{
				q: 'Waarom levert heen en weer converteren niet altijd mijn origineel op?',
				a: 'Het splitsen in woorden gooit informatie weg — “user_ID_2” en “userId2” tokeniseren identiek. Conversies zijn vooruit deterministisch, maar de oorspronkelijke schrijfwijze van de woordgrenzen valt niet altijd terug te construeren.'
			}
		]
	},

	'word-counter': {
		about: [
			'Een live woord- en tekenteller met de getallen die ontwikkelaars en schrijvers echt nodig hebben: woorden, tekens met en zonder spaties, UTF-8-bytes (wat je databasekolom of API-limiet werkelijk meet), regels, zinnen, alinea’s en een geschatte leestijd bij de gebruikelijke 220 woorden per minuut.',
			'Tekens worden geteld als Unicode-codepunten, niet als UTF-16-eenheden, zodat emoji en CJK-tekst tellen zoals een mens verwacht — en de aparte bytetelling maakt het verschil zichtbaar: 日本語 is 3 tekens maar 9 bytes. Precies dat onderscheid bijt wanneer een VARCHAR(255)-kolom een string van 200 “tekens” weigert.',
			'Alles wordt bijgewerkt terwijl je typt, zonder dat er iets wordt verstuurd — veilig om concepten van aankondigingen, contracten of iets anders dat nog niet naar buiten mag te tellen.'
		],
		faqs: [
			{
				q: 'Waarom verschillen het aantal tekens en het aantal bytes?',
				a: 'Tekens zijn Unicode-codepunten; bytes zijn hun UTF-8-codering. ASCII-letters zijn 1 byte, de meeste Europese letters met accent 2, CJK-tekens 3 en emoji 4 (of meer in reeksen). Databaselimieten, HTTP-headers en veel API’s meten bytes, geen tekens.'
			},
			{
				q: 'Hoe worden woorden geteld bij talen zonder spaties?',
				a: 'De woordtelling splitst op witruimte, wat ongesegmenteerde tekst in het Chinees of Japans onderschat. Voor die talen is de tekentelling het zinvollere getal, en daarom worden beide altijd getoond.'
			},
			{
				q: 'Wat telt als een zin?',
				a: 'Een stuk tekst dat eindigt op ., !, ? of … gevolgd door witruimte of het einde van de invoer. Afkortingen als “bijv.” kunnen de telling licht opblazen — zinnen tellen is inherent heuristisch.'
			},
			{
				q: 'Hoe nauwkeurig is de leestijd?',
				a: 'Hij deelt het aantal woorden door 220 wpm, een gangbaar gemiddelde voor stil lezen van algemeen proza door volwassenen. Technisch materiaal met code leest trager; opsommingen laten zich sneller doorbladeren. Zie het als een schatting op de juiste orde van grootte.'
			}
		]
	},

	'lorem-ipsum-generator': {
		about: [
			'Vulstekst voor lay-outs, mockups en seed-data, gegenereerd in je browser: kies woorden, zinnen of alinea’s, stel een aantal in, en kopieer. De uitvoer put uit de klassieke door elkaar gehusselde Cicero-woordenschat, zodat het eruitziet als natuurlijk Latijn-achtig proza zonder afleidend leesbare zinnen te vormen.',
			'Standaard begint de tekst met het traditionele “Lorem ipsum dolor sit amet” — de zin die ontwerpers en reviewers meteen als vulstekst herkennen — en je kunt dat uitzetten voor volledig willekeurige uitvoer wanneer je meerdere verschillende blokken nodig hebt.',
			'Zinslengtes en alineagroottes variëren willekeurig binnen realistische marges, zodat de tekst het visuele ritme van echte kopij krijgt — belangrijk als je typografie of regelafbreking beoordeelt, waar uniforme zinnen kunstmatig ogen.'
		],
		faqs: [
			{
				q: 'Waar komt lorem ipsum vandaan?',
				a: 'Het zijn door elkaar gehusselde fragmenten uit Cicero’s “De finibus bonorum et malorum” (45 v.Chr.), sinds minstens de jaren zestig door zetters als vulling gebruikt en populair geworden door Letraset-vellen en later desktoppublishingsoftware.'
			},
			{
				q: 'Waarom lorem ipsum gebruiken in plaats van echte tekst?',
				a: 'Leesbare inhoud kaapt de aandacht — reviewers gaan de woorden redigeren in plaats van de lay-out beoordelen. Pseudo-Latijn heeft natuurlijke letterfrequenties en woordlengtes zonder leesbaar te zijn, waardoor de focus op het ontwerp blijft.'
			},
			{
				q: 'Is de gegenereerde tekst altijd dezelfde?',
				a: 'Nee — woorden worden elke keer willekeurig getrokken, dus twee generaties verschillen. Alleen de optionele klassieke openingszin ligt vast.'
			},
			{
				q: 'Kan ik een exact aantal woorden genereren voor een CMS-veldlimiet?',
				a: 'Ja — zet de eenheid op woorden en het aantal op precies wat je nodig hebt, tot 1000 per keer. Combineer het met de woordenteller om tegen teken- of bytelimieten te controleren.'
			}
		]
	},

	'slug-generator': {
		about: [
			'Zet elke titel om in een URL-klare slug: kleine letters, gescheiden door koppeltekens, ontdaan van leestekens, met accenten getranslitereerd naar gewone ASCII — “Crème brûlée à Paris” wordt “creme-brulee-a-paris”. De opties dekken de gangbare varianten: underscores als scheidingsteken, behouden hoofdlettergebruik, en een maximumlengte die op een woordgrens afkapt in plaats van middenin een woord.',
			'Slugs doen ertoe voor mensen én zoekmachines: ze zijn leesbaar in de adresbalk, overleven kopiëren en plakken in de chat zonder percent-escapes, en geven zoekresultaten een URL met trefwoorden. De transliteratiestap is wat de meeste zelfgemaakte slugify-functies overslaan — zonder die stap breken titels met accenten de URL of verdwijnen ze helemaal.',
			'Elke regel wordt onafhankelijk geslugificeerd, zodat een geplakte lijst artikeltitels in één handeling een bijpassende lijst slugs oplevert.'
		],
		faqs: [
			{
				q: 'Waarom koppeltekens in plaats van underscores?',
				a: 'Zoekmachines behandelen koppeltekens als woordscheiders, terwijl ze underscores historisch als woordverbinders zagen, en koppeltekens zijn visueel duidelijker in onderstreepte linktekst. Underscores blijven populair voor bestandsnamen en identifiers, dus beide worden aangeboden.'
			},
			{
				q: 'Wat gebeurt er met niet-Latijnse schriften zoals Chinees of Cyrillisch?',
				a: 'Tekens met een ASCII-equivalent (Latijn met accenten, een paar bijzondere letters zoals ß → ss) worden getranslitereerd; schriften zonder eenvoudige Latijnse afbeelding worden verwijderd. Voor niet-Latijnse inhoud is de gangbare praktijk het oorspronkelijke schrift percent-gecodeerd in de URL houden of handmatig een geromaniseerde slug schrijven.'
			},
			{
				q: 'Bestaat er een ideale sluglengte?',
				a: 'Korter is beter om te delen en te tonen, maar er is geen klif in de ranking. De optie voor maximumlengte kapt op een woordgrens af — handig voor CMS’en die de slugkolom op 50–80 tekens begrenzen.'
			},
			{
				q: 'Moet de slug meeveranderen als de titel verandert?',
				a: 'Zodra gepubliceerd het liefst niet — de URL is een adres waar anderen naartoe hebben gelinkt. De meeste sites houden de oorspronkelijke slug aan of voegen een redirect toe. Genereer slugs bij het aanmaken en behandel hernoemen als een bewuste redirect-beslissing.'
			}
		]
	},

	'sort-lines': {
		about: [
			'Een werkbank voor regels: plak een willekeurige lijst en sorteer die alfabetisch, omgekeerd, natuurlijk (item2 vóór item10), op lengte, of schud hem door elkaar — desgewenst met witruimte bijgesneden, lege regels weggelaten en duplicaten verwijderd met behoud van volgorde. Het aantal verwijderde regels wordt gemeld, zodat je precies ziet wat het ontdubbelen deed.',
			'Natuurlijk sorteren is de optie waar je het vaakst naar grijpt: gewoon alfabetisch sorteren zet “item10” vóór “item2” omdat het teken voor teken vergelijkt, terwijl natuurlijk sorteren ingebedde getallen numeriek vergelijkt — de volgorde die mensen verwachten bij bestandsnamen, versies en ID’s.',
			'Het ontdubbelen bewaart het eerste voorkomen en behoudt de oorspronkelijke volgorde van de overblijvers, wat uitmaakt als de lijstvolgorde betekenis heeft (imports, configuratieregels, afspeellijsten). Een hoofdletterongevoelige modus behandelt “Apple” en “apple” als dezelfde regel.'
		],
		faqs: [
			{
				q: 'Wat is het verschil tussen alfabetisch en natuurlijk sorteren?',
				a: 'Alfabetisch vergelijkt tekencodes, dus “file10” < “file2” (omdat “1” < “2” op positie 5). Natuurlijk sorteren herkent cijferreeksen en vergelijkt ze als getallen, wat file2 < file10 geeft. Gebruik natuurlijk voor alles met getallen erin.'
			},
			{
				q: 'Behoudt ontdubbelen het eerste of het laatste voorkomen?',
				a: 'Het eerste. Regels worden van boven naar beneden gescand en een regel valt alleen af als eerder een identieke (of, in hoofdletterongevoelige modus, gelijke) regel voorkwam — zodat de overgebleven volgorde met het origineel overeenkomt.'
			},
			{
				q: 'Hoe groot mag de lijst zijn?',
				a: 'Honderdduizenden regels gaan prima — de bewerkingen zijn eenvoudige doorlopen plus een sortering. Alles blijft in het browsergeheugen, dus de praktische grens is je machine, niet een serverquotum.'
			},
			{
				q: 'Kan ik bewerkingen combineren?',
				a: 'Ja, en ze worden in een zinnige volgorde toegepast: eerst bijsnijden, dan lege regels weg, dan ontdubbelen, dan sorteren — zodat “ apple ” en “apple” samen ontdubbelen als bijsnijden aanstaat, en het sorteren altijd de opgeschoonde lijst ziet.'
			}
		]
	},

	'html-entities': {
		about: [
			'Escape tekst voor veilig gebruik in HTML — & wordt &amp;, < wordt &lt; — of decodeer tekst vol entiteiten terug naar leesbare tekens, met dekking voor benoemde entiteiten (&rarr;), decimale (&#169;) en hexadecimale (&#xA9;) numerieke referenties.',
			'Coderen kent twee niveaus: de vijf essentiële tekens die de HTML-structuur breken (& < > " \'), wat je voor correctheid nodig hebt, of alles buiten ASCII, handig wanneer een toolchain UTF-8 ergens tussen jou en de pagina verminkt. Een numeriek-alleen-modus slaat benoemde entiteiten over voor maximale compatibiliteit met strikte XML-parsers, die alleen de vijf voorgedefinieerde garanderen.',
			'De decoder is de helft die je dagelijks gebruikt: plak een gescrapet fragment of een API-antwoord vol &#x27; en krijg schone tekst terug. Onbekende entiteitsnamen blijven onaangeroerd in plaats van geraden te worden.'
		],
		faqs: [
			{
				q: 'Welke tekens moeten in HTML worden geëscaped?',
				a: 'In tekstinhoud: & en <. In attribuutwaarden: ook het aanhalingsteken dat het attribuut begrenst (" of \'). > escapen is gebruikelijk maar niet strikt noodzakelijk. Al het overige mag letterlijk in een UTF-8-document staan.'
			},
			{
				q: 'Is entiteitscodering een verdediging tegen XSS?',
				a: 'De vijf structurele tekens escapen is de kern van uitvoercodering in HTML-context, ja — maar alleen voor HTML-tekst- en attribuutcontexten. URL’s, JavaScript-strings en CSS vragen om hun eigen contextspecifieke codering; alleen entiteiten escapen maakt willekeurige injectie daar niet veilig.'
			},
			{
				q: 'Benoemde of numerieke entiteiten — wat moet ik uitsturen?',
				a: 'Numerieke referenties (&#xE9;) werken in elke HTML- en XML-parser. Benoemde entiteiten zijn leesbaarder, maar XML definieert er maar vijf vooraf, dus &eacute; breekt een strikte XML/XHTML-pijplijn. Bij twijfel: numeriek.'
			},
			{
				q: 'Waarom zie ik &amp;#39; (dubbel gecodeerd) in mijn data?',
				a: 'Twee lagen hebben elk één keer gecodeerd: de & van de eerste codering is door een tweede ronde nog eens geëscaped. Decodeer hier twee keer om de tekst terug te krijgen, en zoek daarna de laag op die niet zou moeten coderen.'
			}
		]
	},

	'unicode-inspector': {
		about: [
			'Plak willekeurige tekst en zie elk teken ontleed: zijn codepunt (U+XXXX), UTF-8-bytes, UTF-16-eenheden, JavaScript-escapereeks, HTML-entiteit en algemene categorie — plus totalen voor codepunten, UTF-16-eenheden, UTF-8-bytes en door gebruikers waargenomen tekens (grafeemclusters).',
			'Dit is de tool voor “waarom doet deze string zo raar?”-momenten: onzichtbare tekens (zero-width spaties, BOM’s, richtingsmarkeringen) verschijnen als zichtbare rijen; op elkaar lijkende tekens (Cyrillische а tegenover Latijnse a) blijken verschillende codepunten; en een emoji die “één teken is” blijkt zeven codepunten verbonden door zero-width joiners.',
			'De vier verschillende lengtetotalen beantwoorden de eeuwige vraag waarom .length in JavaScript, een bytelimiet in de database en wat de gebruiker ziet het allemaal oneens zijn over hoe lang een string is.'
		],
		faqs: [
			{
				q: 'Waarom is "🎉".length === 2 in JavaScript?',
				a: 'JavaScript-strings tellen UTF-16-code-eenheden. Tekens boven U+FFFF — waaronder de meeste emoji — hebben een surrogaatpaar nodig, dus twee eenheden. De inspecteur toont zowel de eenheden als het echte codepunt, en de samenvatting telt ze apart.'
			},
			{
				q: 'Wat is een grafeemcluster?',
				a: 'Wat een lezer als één teken ervaart. é kan twee codepunten zijn (e + combinerend accent), en familie-emoji kunnen zeven of meer zijn, verbonden door zero-width joiners. De grafeemtelling gebruikt Intl.Segmenter van de browser — het dichtst bij “tekens zoals gebruikers ze zien”.'
			},
			{
				q: 'Hoe vind ik onzichtbare tekens in een string?',
				a: 'Plak hem hier — elk codepunt krijgt een rij, inclusief zero-width spaties (U+200B), harde spaties (U+00A0), BOM’s (U+FEFF) en richtingsmarkeringen, elk met categorie. Dat zijn de klassieke boosdoeners achter “identieke” strings die toch niet gelijk zijn.'
			},
			{
				q: 'Wat vertellen de UTF-8-bytereeksen mij?',
				a: 'Precies wat er opgeslagen of verstuurd wordt: ASCII is één byte, de meeste Latijnse uitbreidingen twee, CJK drie, emoji vier. Als een systeem middenin een reeks afkapt, krijg je vervangingstekens (�) — de byteweergave laat zien waar zulke knips zouden vallen.'
			}
		]
	},

	'cron-parser': {
		about: [
			'Plak een cron-expressie met vijf velden en krijg hem in gewone taal uitgelegd, met een uitsplitsing per veld en — het deel dat echte fouten vangt — de eerstvolgende vijf werkelijke uitvoertijden, berekend in je lokale tijdzone. “0 3 * * 1” leest terug als “Om 03:00, op maandag”, gevolgd door de concrete datums waarop het afgaat.',
			'De parser ondersteunt de volledige standaardsyntaxis: lijsten (1,15), bereiken (9-17), stappen (*/15), maand- en weekdagnamen (jan, mon), 7 als zondag, en de @daily/@hourly-macrofamilie. Hij implementeert ook de regel die iedereen vergeet: wanneer zowel dag-van-de-maand als dag-van-de-week beperkt zijn, draait de taak als één van beide matcht, niet allebei.',
			'Expressies met zes velden (Quartz, met seconden) worden herkend en expliciet benoemd in plaats van stilzwijgend verkeerd geparseerd — de meest voorkomende bron van “mijn cron klopt niet”-verwarring bij het schakelen tussen Java-schedulers en Unix-crontab.'
		],
		faqs: [
			{
				q: 'Wat zijn de vijf velden, op volgorde?',
				a: 'Minuut (0–59), uur (0–23), dag van de maand (1–31), maand (1–12), dag van de week (0–6, zondag = 0, waarbij ook 7 als zondag wordt aanvaard). De volgorde onthouden is de eeuwige worsteling — het uitsplitsingspaneel benoemt elk veld van jouw expressie.'
			},
			{
				q: 'Waarom draait “0 0 1 * 1” vaker dan ik verwachtte?',
				a: 'Omdat zowel dag-van-de-maand (de 1e) als dag-van-de-week (maandag) beperkt zijn, draait cron de taak als ÉÉN van beide matcht — elke 1e van de maand ÉN elke maandag. Wil je “de 1e alleen als het een maandag is”, dan moet je de datum in je script controleren.'
			},
			{
				q: 'Welke tijdzone gebruiken de volgende-uitvoertijden?',
				a: 'De lokale tijdzone van je browser, die naast de resultaten wordt getoond. Echte crontabs draaien in de tijdzone van de server (of de TZ=-regel in sommige crons) — controleer altijd wat de doelmachine gebruikt, zeker rond zomertijdwissels.'
			},
			{
				q: 'Ondersteunt dit seconden of jaren?',
				a: 'Nee — dat zijn Quartz-uitbreidingen (Java) met 6 of 7 velden. Standaard-Unix-cron heeft precies vijf velden en een resolutie van één minuut. Invoer met zes velden wordt herkend en als Quartz gemeld in plaats van verkeerd gelezen.'
			}
		]
	},

	'password-generator': {
		about: [
			'Genereer willekeurige wachtwoorden met een gekozen lengte en tekensets, desgewenst in bulk, met een eerlijke entropieberekening — bits aan willekeur, niet een decoratieve kleurenbalk. De willekeur komt van crypto.getRandomValues met rejection sampling, zodat elk teken uniform wordt getrokken zonder modulo-vertekening.',
			'Van elke ingeschakelde tekenset is minstens één vertegenwoordiger gegarandeerd (een regel die veel sites afdwingen), waarna de rest van het wachtwoord uniform wordt gevuld en het geheel wordt geschud — zodat de gegarandeerde tekens zich niet voorspelbaar aan het begin ophopen.',
			'Een filter voor dubbelzinnige tekens haalt de gelijkenden (0/O, 1/l/I) eruit voor wachtwoorden die een mens ooit hardop zou voorlezen of van papier zou overtypen. Omdat het genereren lokaal gebeurt, bestaan de wachtwoorden alleen op jouw machine totdat jij ze ergens neerzet.'
		],
		faqs: [
			{
				q: 'Wat betekenen de entropiebits?',
				a: 'Entropie = lengte × log2(grootte van de tekenpool): het aantal even waarschijnlijke mogelijkheden dat een aanvaller moet doorzoeken. 64 bits entropie weerstaat een terloopse aanval; 80+ bits is sterk tegen offline kraken van snelle hashes; 100+ is praktisch niet te raden. Een wachtwoord van 16 tekens over letters+cijfers+symbolen zit rond 104 bits.'
			},
			{
				q: 'Is een lang wachtwoord in kleine letters beter dan een kort complex wachtwoord?',
				a: 'Vaak wel — lengte vermenigvuldigt de entropie, terwijl extra tekensets alleen het grondtal van de logaritme verbreden. 20 kleine letters (~94 bits) verslaan 10 volledig gemengde tekens (~65 bits). Complexiteitsregels bestaan vooral om woordenlijsten te verslaan, en dat doet willekeurig genereren toch al.'
			},
			{
				q: 'Is het veilig om wachtwoorden in een browser te genereren?',
				a: 'De willekeur (crypto.getRandomValues) is dezelfde CSPRNG die native wachtwoordmanagers gebruiken, en deze pagina doet geen netwerkverzoeken met je data. De realistische risico’s zitten in wat er ná het genereren gebeurt: klembordgeschiedenis, schermdelen, en waar je het opslaat.'
			},
			{
				q: 'Waarom dubbelzinnige tekens uitsluiten?',
				a: 'Voor wachtwoorden die mensen lezen — afgedrukte herstelcodes, telefonisch gespeld, overgetypt van een ander scherm — leveren 0/O en 1/l/I echte supporttickets op. Voor wachtwoorden die je alleen plakt kun je ze laten staan; het entropieverlies van uitsluiten is hoe dan ook klein.'
			}
		]
	},

	'qr-code-generator': {
		about: [
			'Typ of plak willekeurige tekst — een URL, wifigegevens, contactinformatie — en krijg direct een QR-code, weergegeven als scherpe vector-SVG die je kunt downloaden, of geëxporteerd als PNG voor chats en presentaties. Geen watermerk, geen verlopende “gratis” redirect, en omdat het genereren lokaal gebeurt, raakt wat je codeert nooit een server.',
			'Dat laatste doet er meer toe dan het lijkt: veel gratis QR-diensten leiden je URL via hun eigen redirectdomein (zodat ze later kunnen factureren of scans kunnen tellen), waardoor de code stopt met werken zodra de dienst dat doet. Codes die hier gegenereerd worden coderen je inhoud direct en werken voor altijd.',
			'Vier niveaus van foutcorrectie ruilen capaciteit in voor robuustheid — L overleeft lichte beschadiging, H overleeft dat 30% van het symbool bedekt is (handig wanneer een logo het midden afdekt of de afdruk klein en versleten wordt).'
		],
		faqs: [
			{
				q: 'Welk niveau van foutcorrectie moet ik kiezen?',
				a: 'M (15%) is de verstandige standaard. Gebruik H (30%) voor kleine gedrukte codes, codes achter glas of met weerspiegeling, of wanneer je er een logo overheen legt. Hogere correctie maakt de code dichter, dus voor erg lange URL’s op een scherm houdt L de modules groter en makkelijker te scannen.'
			},
			{
				q: 'Waarom is SVG beter dan PNG voor drukwerk?',
				a: 'SVG is resolutieonafhankelijk — de printer rastert op zijn eigen dpi en houdt de moduleranden bij elk formaat perfect scherp. PNG moet op een bepaald pixelformaat gegenereerd worden en kan vervagen bij schalen. Gebruik SVG voor drukwerk en ontwerptools, PNG voor chat en presentaties.'
			},
			{
				q: 'Hoeveel data past er in een QR-code?',
				a: 'In theorie tot ongeveer 3 kB aan bytes (versie 40, niveau L), maar zulke grote codes zijn moeilijk van een scherm te scannen. Onder de 300 tekens scant betrouwbaar; kort lange URL’s eerst in — met de verkorter van je eigen domein als duurzaamheid telt.'
			},
			{
				q: 'Verlopen deze codes of registreren ze scans?',
				a: 'Nee. De inhoud zit rechtstreeks in het patroon — er loopt niets via deze site, dus er is niets dat kan verlopen, en niemand (wij ook niet) ziet wanneer of waar er gescand wordt. Scans tellen vereist per definitie een redirectdienst.'
			}
		]
	},

	'qr-code-decoder': {
		about: [
			'Sleep, plak of kies een afbeelding met een QR-code — een schermafbeelding, een gedownload ticket, een foto van een poster — en de inhoud wordt hier in je browser uitgelezen. Dat dekt het geval dat je telefooncamera niet aankan: een QR-code die al op het scherm staat waar je naar kijkt. En staat de code op papier voor je, dan scant de cameramodus hem live — zonder app.',
			'De decoder herkent wat hij vond en reageert daarop: URL’s krijgen een knop om te openen, wifi-codes worden uitgepakt in netwerknaam, wachtwoord en beveiligingstype, en vCard-, mailto:-, tel:-, geo:- en otpauth:-payloads worden gelabeld, zodat je weet wat je plakt voordat je het gebruikt. Niet-Latijnse tekst en emoji decoderen correct als UTF-8, en omgekeerde (licht-op-donker) codes worden automatisch afgehandeld.',
			'Omdat het scannen lokaal gebeurt, is het veilig voor gevoelige codes: een wifiwachtwoord, een 2FA-instelcode of een privélink verlaat je machine nooit. Het is ook de eerlijke manier om te controleren wat een verdachte code werkelijk bevat, voordat iets hem echt scant.'
		],
		faqs: [
			{
				q: 'Waarom werd er geen QR-code gevonden in mijn afbeelding?',
				a: 'Meestal door onscherpte, weinig contrast, sterke perspectiefvervorming, of doordat de code maar een fractie van een grote foto beslaat. Snijd dichter op de code bij, gebruik een scherpere bron, en zorg dat de rustzone — de blanco marge rond het symbool — zichtbaar is. Schermafbeeldingen decoderen vrijwel altijd; schuine foto’s van gebogen of glanzende oppervlakken zijn het lastige geval.'
			},
			{
				q: 'Kan hij wifi-QR-codes lezen?',
				a: 'Ja. WIFI:-payloads (het formaat dat Android en iOS genereren om een netwerk te delen) worden ontleed in netwerknaam, wachtwoord, beveiligingstype en de vlag voor verborgen netwerken, met de escaperegels correct afgehandeld — dus een wachtwoord met ; of : komt er intact uit.'
			},
			{
				q: 'Is het veilig om een QR-code van een onbekende bron te decoderen?',
				a: 'Decoderen leest hier alleen het patroon en toont je de tekst — er wordt niets bezocht, uitgevoerd of geüpload. Daarmee is dit een goede eerste stap voor een code die je niet vertrouwt: bekijk de echte URL voordat je besluit hem te openen. De knop om de link te openen gaat nooit vanzelf af.'
			},
			{
				q: 'Welke afbeeldingsformaten werken?',
				a: 'Alles wat je browser kan tonen: PNG, JPEG, WebP, GIF, BMP, AVIF en SVG. De afbeelding wordt op een canvas getekend en op meerdere schalen gescand, zodat zowel enorme foto’s als kleine schermafbeeldingen een eerlijke kans krijgen. Geanimeerde afbeeldingen worden op hun eerste frame gescand.'
			}
		]
	},

	'json-to-yaml': {
		about: [
			'Converteer in elke richting tussen JSON, YAML en TOML. Het bronformaat wordt automatisch herkend terwijl je plakt — haakjes wijzen op JSON, sleutel:-dubbelepunten op YAML, [tabellen] op TOML — met een handmatige overschrijving voor dubbelzinnige invoer. De conversie loopt via een echte parse, dus de uitvoer is gegarandeerd geldig, geen regel-voor-regeltekstbewerking.',
			'Elk formaat heeft echte sterke punten: JSON voor API’s en machine-uitwisseling, YAML voor configuratie die mensen bewerken (Kubernetes, CI-pijplijnen), TOML voor goed getypeerde configuratiebestanden (Cargo, pyproject). Data met de hand tussen die formaten verplaatsen nodigt uit tot inspring- en aanhalingsfouten die deze conversie uitsluit.',
			'De converter is eerlijk over de grenzen van elk formaat: TOML kent geen arrays op het hoogste niveau en geen null, en bij het converteren van zulke documenten wordt uitgelegd waarom het niet gaat in plaats van stilzwijgend data weg te gooien.'
		],
		faqs: [
			{
				q: 'Blijven commentaren behouden bij conversie?',
				a: 'Nee — JSON kent geen commentaarsyntaxis, en de conversie loopt via de geparseerde datastructuur, die geen commentaren draagt. YAML → JSON → YAML verliest de commentaren onherroepelijk; bewaar het originele bestand als commentaren ertoe doen.'
			},
			{
				q: 'Waarom werd mijn YAML-“no” false?',
				a: 'YAML 1.1 behandelt yes/no/on/off als booleans, en de landcode NO wordt daardoor beroemd false. De parser hier volgt YAML 1.2 (alleen true/false), maar bestanden geschreven voor oudere parsers kunnen alsnog verrassen. Zet strings die op booleans, getallen of datums lijken tussen aanhalingstekens.'
			},
			{
				q: 'Waarom laat mijn JSON zich niet naar TOML converteren?',
				a: 'TOML vereist een tabel (object) op het hoogste niveau — arrays of kale scalairen kunnen geen TOML-document zijn — en kent geen null. Herstructureer de data (wikkel de array in een sleutel, verwijder of vervang de nulls) en het converteert.'
			},
			{
				q: 'Is YAML een superset van JSON?',
				a: 'Praktisch gezien wel — YAML 1.2 parseert vrijwel alle JSON-documenten, en daarom werkt JSON in een YAML-configuratie plakken meestal. Andersom geldt dat niet: de anchors, meerregelige scalairen en tags van YAML hebben geen JSON-equivalent en worden bij conversie uitgeklapt of naar tekst omgezet.'
			}
		]
	},

	'json-to-csv': {
		about: [
			'Plak een array van JSON-objecten en krijg een spreadsheetklare CSV: geneste objecten worden afgeplat naar kolomnamen met punten (user.address.city), kolommen worden samengevoegd over alle rijen (ontbrekende waarden worden lege cellen), en het gebruik van aanhalingstekens volgt RFC 4180, zodat komma’s, aanhalingstekens en regeleinden binnen waarden Excel en Google Sheets overleven.',
			'Dit is de snelste weg van een API-antwoord naar een spreadsheet die iemand kan filteren en draaien. Het samenvoegen van kolommen doet ertoe bij echte data waar objecten heterogeen zijn — rij 1 mist misschien velden die rij 40 wel heeft, en de converter gaat daarmee om in plaats van te falen of data weg te laten.',
			'De converter werkt ook andersom: plak een CSV-export en krijg een JSON-array van objecten met de kopregel als sleutels, met automatische herkenning van het scheidingsteken (komma, puntkomma, tab, pipe) en optioneel getypeerde waarden — getallen, booleans en null worden echte JSON-typen. Beide richtingen draaien volledig in je browser, dus klantexports verlaten je machine nooit.'
		],
		faqs: [
			{
				q: 'Hoe worden geneste objecten weergegeven?',
				a: 'Afgeplat met sleutels die met punten zijn samengevoegd: {"user":{"name":"Ada"}} wordt een kolom user.name. Zo blijft elke scalaire waarde adresseerbaar in één platte kopregel, en daar kunnen spreadsheettools echt mee werken.'
			},
			{
				q: 'Wat gebeurt er met arrays binnen een rij?',
				a: 'Ze worden als JSON-tekst in één cel ingesloten (["a","b"]). Arrays uitklappen naar kolommen (tags.0, tags.1…) of extra rijen verandert de vorm van je data op eigenzinnige manieren — insluiten houdt de conversie verliesvrij en voorspelbaar.'
			},
			{
				q: 'Waarom toont Excel mijn CSV in één kolom?',
				a: 'Landinstellingen: in een groot deel van Europa verwacht Excel bestanden met puntkomma’s, omdat de komma het decimaalteken is. Zet de scheidingstekenoptie op puntkomma, of gebruik Gegevens → Uit tekst/CSV, waar je het scheidingsteken zelf opgeeft.'
			},
			{
				q: 'Kan de converter een enkel object aan (geen array)?',
				a: 'Ja — een los object wordt een CSV van één rij. Objecten met ID’s als sleutel ({"a1":{...},"a2":{...}}) worden echter één brede rij; zet ze eerst om naar een array als elke waarde een rij moet zijn.'
			},
			{
				q: 'Hoe gaat CSV → JSON om met velden tussen aanhalingstekens en ingesloten regeleinden?',
				a: 'Volgens RFC 4180: velden tussen dubbele aanhalingstekens mogen het scheidingsteken bevatten, verdubbelde aanhalingstekens ("") voor een letterlijk aanhalingsteken, en regeleinden. Excel en de meeste databases exporteren precies dit formaat, dus echte bestanden parseren correct.'
			},
			{
				q: 'Waarom verliezen mijn postcodes hun voorloopnullen bij CSV → JSON?',
				a: 'Getypeerde conversie maakt van 02134 het getal 2134. Zet “Getypeerde waarden” uit en elke cel blijft een string, precies zoals geschreven — de juiste keuze voor identifiers, telefoonnummers en alles met voorloopnullen.'
			}
		]
	},

	'json-to-typescript': {
		about: [
			'Plak een JSON-voorbeeld — een API-antwoord, een configuratiebestand — en krijg er een TypeScript-interface uit afgeleid: geneste objecten worden geneste typen, arrays krijgen elementtypen (met unions bij gemengde inhoud), en sleutels die geen geldige identifier zijn worden netjes tussen aanhalingstekens gezet.',
			'Gegenereerde typen zijn een startpunt, geen contract: de inferentie ziet één voorbeeld, dus een veld dat in jouw voorbeeld toevallig null is krijgt het type null, en optionele velden die ontbraken zijn eenvoudigweg onbekend. De uitvoer is bewust kaal — geen decorators, geen runtimevalidatie — zodat je hem overal kunt plakken en verfijnen.',
			'Voor velden die per request verschillen kun je een tweede voorbeeld erdoorheen halen en handmatig samenvoegen, of overstappen op schema-first-gereedschap (OpenAPI, zod) zodra de vorm stabiliseert. Voor het dagelijkse “ik heb gewoon even een type voor dit antwoord nodig” is één keer plakken genoeg.'
		],
		faqs: [
			{
				q: 'Waarom krijgt mijn nullable veld alleen het type null?',
				a: 'De inferentie ziet alleen het voorbeeld dat je plakte. Was het veld daar null, dan is null alles wat ze kan weten. Verander het na het genereren in string | null (of wat het echte type is) — of plak een voorbeeld waarin het veld wel gevuld is.'
			},
			{
				q: 'Hoe worden optionele velden behandeld?',
				a: 'Ze worden niet gedetecteerd — één voorbeeld kan “altijd aanwezig” niet onderscheiden van “deze keer aanwezig”. Velden die in het voorbeeld ontbreken, ontbreken in het type. Markeer velden handmatig als optioneel (naam?:) waar je weet dat de API ze weglaat.'
			},
			{
				q: 'Wat leveren arrays met gemengde typen op?',
				a: 'Een union: [1, "a"] leidt tot (number | string)[]. Lege arrays leiden tot unknown[], omdat er geen element te inspecteren valt — vervang dat door het echte elementtype zodra je het kent.'
			},
			{
				q: 'Moet ik afgeleide typen gebruiken of een schemabibliotheek als zod?',
				a: 'Afgeleide interfaces bestaan alleen tijdens compilatie — ze valideren niets tijdens runtime. Voor interne tools en snel typen zijn ze perfect; voor niet-vertrouwde invoer tijdens runtime definieer je een zod-/valibot-schema en leid je het statische type daaruit af.'
			}
		]
	},

	'jsonpath-tester': {
		about: [
			'Test JSONPath-expressies tegen je eigen JSON en zie elke match met zowel de waarde als het concrete pad. Ondersteunt de syntaxis die het dagelijks gebruik dekt: punt- en haakjesnotatie, array-indices (ook negatieve), wildcards, unions ([\'a\',\'b\']) en recursieve afdaling ($..price).',
			'De paduitvoer per match is het stilletjes nuttige deel: bevraag $..id op een diep document en elk resultaat vertelt je precies waar het woont ($.data.items[3].id), klaar om in code te plakken. Het verandert “ergens in deze blob” in een exact adres.',
			'Filterexpressies ([?(@.price < 10)]) zijn nog niet geïmplementeerd — de tool zegt dat expliciet in plaats van verkeerde resultaten te geven. Voor structurele extractie, waar JSONPath meestal voor dient, werkt alles.'
		],
		faqs: [
			{
				q: 'Wat is het verschil tussen $.a.b en $..b?',
				a: '$.a.b volgt één exacte route: sleutel a in de root, dan sleutel b daarbinnen. $..b (recursieve afdaling) vindt elke b, waar dan ook in het document, op elke diepte. Recursieve afdaling is krachtig maar kan verrassen — het matcht ook b-sleutels genest in dingen waar je niet aan dacht.'
			},
			{
				q: 'Hoe benader ik sleutels met spaties of streepjes?',
				a: 'Met haakjesnotatie en aanhalingstekens: $[\'my key\'] of $.data[\'content-type\']. Puntnotatie werkt alleen voor sleutels die geldige identifier-achtige namen zijn.'
			},
			{
				q: 'Werken negatieve array-indices?',
				a: 'Ja — [-1] is het laatste element, [-2] het voorlaatste, conform de conventie die door Python populair werd en door RFC 9535 is overgenomen. [0] blijft het eerste element.'
			},
			{
				q: 'Is JSONPath gestandaardiseerd?',
				a: 'Sinds 2024 wel — RFC 9535 legt syntaxis en semantiek vast. Implementaties van vóór die tijd verschillen in randgevallen (vooral bij filters en unions), dus dezelfde expressie kan zich per bibliotheek anders gedragen; test tegen de implementatie waarmee je uitrolt.'
			}
		]
	},

	'bcrypt-generator': {
		about: [
			'Hash een wachtwoord met bcrypt op een gekozen kostenfactor, of controleer platte tekst tegen een bestaande hash — allebei volledig in de browser, wat precies is wat je wilt wanneer het geteste ding een wachtwoord is. Een hash-inspecteur splitst bovendien elke bcrypt-hash in versie, kosten en salt.',
			'Bcrypt blijft een solide keuze voor wachtwoordopslag omdat het bewust traag is en per wachtwoord gesalt: de kostenfactor verdubbelt het werk bij elke stap, dus kosten 12 betekent 4096 iteraties van de onderliggende cipher-setup. De tijdmeting laat zien hoe lang jouw gekozen kosten duren, waarmee de afweging tussen veiligheid en latentie concreet wordt.',
			'Verifiëren is de vaker voorkomende dagelijkse behoefte: bevestigen dat een hash in een database bij een bekend wachtwoord hoort zonder applicatiecode op te starten. Plak beide, krijg een ja of nee.'
		],
		faqs: [
			{
				q: 'Welke kostenfactor moet ik in productie gebruiken?',
				a: 'De klassieke richtlijn: zo hoog als je latentiebudget voor inloggen toelaat, tegenwoordig gewoonlijk 10–13. Mik op 100–300 ms per hash op je productiehardware. Browser-JavaScript is trager dan native, dus de tijd die je hier ziet is een bovengrens voor je servers.'
			},
			{
				q: 'Waarom levert hetzelfde wachtwoord elke keer een andere hash op?',
				a: 'Per hash wordt een willekeurige salt van 16 bytes gegenereerd en in de hashstring zelf opgeslagen. Dat is opzet — identieke wachtwoorden krijgen verschillende hashes, wat vooraf berekende rainbow tables uitschakelt. Bij verifiëren wordt de salt weer uit de hash gelezen, en daarom werkt vergelijken.'
			},
			{
				q: 'Wat betekenen de onderdelen van een bcrypt-hash?',
				a: '$2b$12$ + 53 tekens: 2b is de algoritmeversie, 12 de kosten (2^12 iteraties), de volgende 22 tekens de salt en de laatste 31 de digest — alles in het eigen base64-alfabet van bcrypt. De inspecteur onder de tool splitst elke hash op deze manier.'
			},
			{
				q: 'Wordt bcrypt nog aanbevolen boven Argon2?',
				a: 'Argon2id is tegenwoordig de eerste keuze voor nieuwe systemen (geheugenintensiteit weerstaat kraken met GPU’s). Bcrypt blijft acceptabel en alomtegenwoordig — het praktische advies luidt: migreer werkende bcrypt-opslag niet in paniek, maar kies Argon2id voor nieuwe ontwerpen. Beide zijn mijlenver beter dan snelle hashes als SHA-256.'
			}
		]
	},

	'user-agent-parser': {
		about: [
			'Plak een User-Agent-string uit een logregel, bugrapport of analytics-export en krijg hem ontcijferd: browser en versie, renderengine, besturingssysteem, apparaattype en CPU-architectuur. De parser is ua-parser-js, dezelfde bibliotheek achter talloze analytics-pijplijnen, hier lokaal draaiend op jouw string.',
			'User-Agent-strings zijn archeologische vindplaatsen — elke string beweert nog steeds Mozilla/5.0 te zijn, Chrome beweert Safari te zijn, Safari beweert KHTML te zijn, en de echte identiteit schuilt in de latere tokens. Een parser verslaat turen: hij weet dat “CriOS” Chrome op iOS betekent en dat Edge zich achter “Edg/” verstopt.',
			'Let op de richting waarin het gaat: browsers bevriezen en versimpelen hun UA-strings (en Chromium levert in plaats daarvan UA Client Hints), dus versiedetail uit alleen de UA wordt steeds grover. Voor logforensiek en bugtriage blijft het onmisbaar; voor beslissingen over functionaliteit gebruik je feature detection.'
		],
		faqs: [
			{
				q: 'Waarom begint elke User-Agent met Mozilla/5.0?',
				a: 'Compatibiliteitstoneel uit de jaren negentig dat nooit is opgehouden: servers zochten naar “Mozilla” om moderne pagina’s te serveren, dus beweerde elke nieuwe browser dat te zijn, en elke volgende browser deed zich voor als zijn voorgangers. Het voorvoegsel is nu betekenisloze traditie.'
			},
			{
				q: 'Kan ik de OS-versie in een UA-string vertrouwen?',
				a: 'Elk jaar minder. macOS bevroor zijn UA-versie op 10_15_7, Windows 11 meldt zich als Windows NT 10.0, en browsers met gereduceerde UA vergroven versies met opzet. Behandel OS-versies uit de UA als benadering; gebruik UA Client Hints waar je de client zelf beheert.'
			},
			{
				q: 'Wat betekent “like Gecko” of “KHTML, like Gecko”?',
				a: 'Nog meer lagen imitatie: WebKit stamt af van KHTML en wilde dat pagina’s die speciaal voor Gecko (de engine van Firefox) waren geschreven zouden werken, dus voegde het “like Gecko” toe. Elke WebKit-/Blink-browser draagt de zin tot op vandaag.'
			},
			{
				q: 'Moet ik UA-parsing gebruiken voor feature detection?',
				a: 'Nee — sniffing breekt zodra er een nieuwe browserversie uitkomt. Detecteer de functie zelf (if ("clipboard" in navigator)). UA-parsing is voor analytics, loganalyse en het reproduceren van door gebruikers gemelde bugs, waar de omgeving kennen juist het hele punt is.'
			}
		]
	},

	'color-converter': {
		about: [
			'Voer een kleur in in elke gangbare notatie — #hex, rgb(), hsl(), of een CSS-kleurnaam — en krijg alle formaten tegelijk: HEX, RGB, HSL en OKLCH, naast een levend kleurvlak. Alfakanalen blijven bewaard tussen formaten, en de uitvoer gebruikt moderne CSS-syntaxis (kanalen gescheiden door spaties) die schoon in hedendaagse stylesheets plakt.',
			'OKLCH zit erbij omdat CSS-kleur die kant op gaat: anders dan bij HSL is de lichtheidsas perceptueel uniform, dus twee kleuren met dezelfde L ogen echt even helder, en de tint aanpassen verandert niet per ongeluk de waargenomen helderheid. Een bestaand palet naar OKLCH omzetten is de eerste stap naar consistente kleurschalen.',
			'De rekenkunde draait lokaal met de gepubliceerde sRGB↔OKLab-transformaties, en waarden komen heen en terug: de RGB die je uit een HSL-invoer terugkrijgt is precies wat de browser zou berekenen.'
		],
		faqs: [
			{
				q: 'Waarom komen de lichtheidswaarden van HSL en OKLCH niet overeen?',
				a: 'De lichtheid van HSL is een meetkundige eigenschap van RGB-waarden, niet van het menselijk zien — hsl(60 100% 50%) geel oogt veel helderder dan hsl(240 100% 50%) blauw, ondanks dezelfde L. De L-as van OKLCH is ontworpen om bij de waarneming aan te sluiten, dus gelijke L betekent gelijke schijnbare helderheid. Precies dat verschil is de hele bestaansreden van OKLCH.'
			},
			{
				q: 'Wat betekent de alfawaarde en waar staat die in elk formaat?',
				a: 'Alfa is dekking, van 0 (transparant) tot 1 (ondoorzichtig). In 8-cijferige hex is het de laatste byte (#RRGGBBAA); in moderne functionele syntaxis volgt het na een schuine streep: rgb(76 141 255 / 0.5). Deze converter draagt alfa automatisch door alle formaten mee.'
			},
			{
				q: 'Kan elke OKLCH-kleur in sRGB getoond worden?',
				a: 'Nee — OKLCH bestrijkt brede gamuts, en sommige combinaties van chroma en lichtheid hebben geen sRGB-equivalent. Converteren vanuit sRGB (zoals deze tool doet) blijft altijd weer te geven; andersom moeten kleuren buiten het gamut geknipt of afgebeeld worden, en daarom oogt een fel P3-groen doffer op een sRGB-scherm.'
			},
			{
				q: 'Waarom rgb(76 141 255) met spaties in plaats van komma’s?',
				a: 'CSS Color Module Level 4 standaardiseerde kanalen gescheiden door spaties met een optionele /alfa, en elke moderne browser ondersteunt dat. De kommavorm werkt nog steeds, maar de spatievorm is wat nieuwe specificaties (en deze tool) gebruiken.'
			}
		]
	},

	'image-to-base64': {
		about: [
			'Sleep, kies of plak een afbeelding en krijg de Base64-vorm in elke smaak die je nodig kunt hebben: een kant-en-klare data-URL, een CSS-declaratie background-image, een volledige <img>-tag met intrinsieke afmetingen, en de ruwe Base64-payload. De omgekeerde richting werkt ook — plak een data-URL of een kale Base64-blob en de afbeelding wordt gedecodeerd, getoond en is als bestand te downloaden.',
			'Het formaat wordt uit de magic bytes bepaald, niet uit de bestandsextensie of het opgegeven mimetype, dus een PNG die is hernoemd naar .jpg (of een data-URL met het verkeerde label) converteert alsnog correct. Het formaatpaneel is eerlijk over de kosten: Base64 blaast data met ongeveer een derde op, en de exacte gecodeerde grootte staat naast het origineel, zodat je kunt beslissen of inline zetten het waard is.',
			'Anders dan bij de meeste image-to-Base64-sites wordt er niets geüpload — het bestand wordt gelezen met de FileReader-API van de browser en in de pagina gecodeerd. Daardoor is het veilig voor schermafbeeldingen van interne dashboards, nog niet uitgebrachte productfoto’s, of wat je verder liever niet aan de server van een vreemde geeft.'
		],
		faqs: [
			{
				q: 'Wanneer moet ik een afbeelding als Base64 inline zetten in plaats van een bestand te linken?',
				a: 'Wanneer de afbeelding klein is (ruwweg onder 10 kB), zelden verandert en anders een extra HTTP-verzoek zou kosten — denk aan iconen, logo’s in e-mails, of HTML-documenten die één bestand moeten blijven. Voor alles wat groter is wint een apart bestand: het cachet onafhankelijk, laadt parallel en blaast je HTML of CSS niet met 33% op.'
			},
			{
				q: 'Waarom is de Base64-versie ongeveer een derde groter dan mijn bestand?',
				a: 'Base64 stelt elke 3 bytes binair voor als 4 ASCII-tekens, een structurele overhead van +33% (plus maximaal twee paddingtekens). Gzip of Brotli op je server haalt een deel terug, maar de opblazing zit in de codering zelf — het ruilt grootte in voor de mogelijkheid binaire data in tekst in te bedden.'
			},
			{
				q: 'Kan ik een data-URL decoderen die ik in een stylesheet of HTML vond?',
				a: 'Ja — schakel naar Base64 → afbeelding en plak het geheel, inclusief het data:-voorvoegsel. Percent-gecodeerde SVG-data-URL’s (die zonder ;base64) decoderen ook, en regeleinden of witruimte binnen de payload worden automatisch verwijderd. Het resultaat wordt in de pagina getoond en downloadt met de juiste extensie.'
			},
			{
				q: 'Werkt dit voor SVG-, GIF- en ICO-bestanden, of alleen voor PNG en JPEG?',
				a: 'Alles wat de sniffer herkent converteert naar Base64: PNG, JPEG, WebP, GIF, SVG, BMP, ICO en AVIF. Bedenk bij SVG dat de XML-bron vaak kleiner en leesbaarder is als je hem direct inline zet — SVG in Base64 coderen is vooral zinvol wanneer aanhalingstekens of escapes een probleem worden.'
			}
		]
	},

	'image-converter': {
		about: [
			'Converteer een afbeelding tussen PNG, JPEG en WebP zonder iets te installeren of ergens te uploaden: sleep het bestand erin, kies het doel, stel de kwaliteit in met een live schuifregelaar, en zie de uitvoergrootte in realtime meebewegen. De Δ-tegel toont precies hoeveel kleiner (of groter) het geconverteerde bestand is, zodat een kwaliteitsinstelling kiezen ophoudt gokwerk te zijn.',
			'De drie formaten hebben verschillende taken. PNG is verliesvrij met volledige transparantie — juist voor schermafbeeldingen, UI-assets en alles met scherpe randen of tekst. JPEG comprimeert foto’s agressief maar heeft geen alfakanaal en vervaagt harde randen. WebP verslaat JPEG doorgaans met 25–35% bij vergelijkbare kwaliteit, ondersteunt transparantie en wordt door alle huidige browsers ondersteund — voor het web is het meestal het antwoord.',
			'De conversie gebeurt op een canvas in je browser: de afbeelding wordt gedecodeerd, opnieuw getekend en opnieuw gecodeerd door dezelfde codecs waarmee je browser pagina’s toont. Dat maakt de tool privé — en verklaart ook waarom exacte bytegetallen licht verschillen tussen Chrome, Firefox en Safari, die elk hun eigen encoders meeleveren.'
		],
		faqs: [
			{
				q: 'Welke kwaliteitsinstelling moet ik gebruiken voor JPEG en WebP?',
				a: 'Tussen 75 en 90 dekt vrijwel elk praktisch geval. Bij 85 zijn de meeste foto’s visueel niet van de bron te onderscheiden, tegen een fractie van de grootte; onder ongeveer 70 sluipen blokartefacten in verlopen en huidtinten; boven 90 stijgt de bestandsgrootte steil voor winst die je niet ziet. Sleep de regelaar en kijk naar de groottetegel — het optimum is meestal duidelijk.'
			},
			{
				q: 'Waarom werd mijn PNG groter toen ik hem naar JPEG converteerde?',
				a: 'JPEG is gemaakt voor fotografische verlopen, niet voor vlakke kleur. Schermafbeeldingen, diagrammen en UI-kunst comprimeren uitstekend als PNG (lange reeksen identieke pixels), maar dwingen JPEG om ruis rond elke scherpe rand op te slaan — grotere bestanden en zichtbare ringing. Houd grafische afbeeldingen als PNG of converteer ze naar verliesarme WebP.'
			},
			{
				q: 'Wat gebeurt er met transparantie als ik naar JPEG converteer?',
				a: 'JPEG heeft geen alfakanaal, dus transparante gebieden moeten met iets gevuld worden — deze tool legt ze op wit, de conventie voor webafbeeldingen. Moet de transparantie behouden blijven, kies dan PNG of WebP als doel.'
			},
			{
				q: 'Waarom kan mijn browser hier geen AVIF of HEIC exporteren?',
				a: 'De canvas-API toBlob codeert alleen formaten waarvoor de browser een encoder meelevert — PNG en JPEG overal, WebP in Chromium en Firefox. AVIF-codering is nog zeldzaam en HEIC is patentbelast, dus browsers decoderen ze wel maar produceren ze niet. Kies je een formaat dat je browser niet kan schrijven, dan zegt de tool dat in plaats van je stiekem een PNG te geven.'
			}
		]
	},

	'image-resizer': {
		about: [
			'Schaal een afbeelding naar een exacte breedte, een exacte hoogte, of een percentage van het origineel — de andere dimensie volgt automatisch, zodat er niets uitgerekt wordt. Kies een uitvoerformaat (of houd het bronformaat aan), stel de kwaliteit in voor verliesgevende doelen, bekijk het resultaat en download. Voor- en na-tegels tonen afmetingen en bestandsgrootte in één oogopslag.',
			'Het schalen gebruikt de hoogwaardige smoothing-modus van de browser, die echte resampling toepast in plaats van nearest-neighbour-decimatie — verkleinde foto’s blijven scherp in plaats van te flikkeren van aliasing. Schalen is ook de eerlijke manier om bestandsgrootte terug te brengen: beide dimensies halveren verwijdert driekwart van de pixels, wat geen enkele kwaliteitsschuif kan evenaren.',
			'Bestanden verlaten de pagina nooit: decoderen, resamplen en opnieuw coderen gebeuren allemaal op een lokaal canvas. Er is geen voortgangsbalk voor uploaden omdat er geen upload is — een foto van 40 megapixel schaalt zo snel als je machine hem kan hertekenen, en werkt met de netwerkkabel eruit.'
		],
		faqs: [
			{
				q: 'Herstelt verkleinen en weer vergroten mijn afbeelding?',
				a: 'Nee — verkleinen gooit pixels definitief weg. Een foto van 3000px naar 300px schalen houdt 1% van de data over; hem weer vergroten interpoleert de ontbrekende 99% als onscherpte. Bewaar het originele bestand en exporteer daaruit verkleinde kopieën, in plaats van de enige kopie die je hebt te verkleinen.'
			},
			{
				q: 'Waarom ziet mijn vergrote afbeelding er zacht uit?',
				a: 'Vergroten kan geen detail maken dat nooit is vastgelegd — de browser interpoleert tussen bestaande pixels, wat voorbij ongeveer 2× als onscherpte leest. Echt opschalen daarboven vraagt om ML-gereedschap dat plausibel detail verzint; een canvas-resampler verzint met opzet niets.'
			},
			{
				q: 'Hoe haal ik een doelbestandsgrootte, zoals “onder 200 kB”?',
				a: 'Gebruik beide knoppen: schaal eerst naar de grootste afmetingen die je echt nodig hebt (1200px breed is ruim genoeg voor de meeste weblayouts), kies daarna WebP of JPEG en verlaag de kwaliteit tot de groottetegel onder je doel staat. De dimensiereductie doet het meeste werk — kwaliteit stelt de rest fijn af.'
			},
			{
				q: 'Verwijdert schalen EXIF-metadata zoals GPS-locatie?',
				a: 'Ja. De canvas-pijplijn hercodeert pure pixels — cameramodel, tijdstempels, GPS-coördinaten en elke andere EXIF-tag zijn uit de uitvoer verdwenen. Dat is meestal winst voor de privacy bij afbeeldingen die naar het publieke web gaan; heb je de metadata nodig, bewaar dan het origineel ernaast.'
			}
		]
	},

	'favicon-generator': {
		about: [
			'Sleep één afbeelding erin — bij voorkeur een vierkant logo van 512px of groter — en krijg de complete favicon-set: een favicon.ico met 16, 32 en 48 px voor tabbladen en bladwijzers, PNG’s op de standaardformaten inclusief het Apple touch-icoon van 180px en de PWA-iconen van 192/512px, een site.webmanifest om mee te beginnen, en de <link>-tags om in je <head> te plakken. Eén ZIP-download bevat alles, precies benoemd zoals de conventies verwachten.',
			'De details die favicon-tutorials verkeerd doen zijn hier afgehandeld: de ICO bevat PNG-gecomprimeerde entries (overal ondersteund sinds Windows Vista, veel kleiner dan oude BMP-iconen); het Apple touch-icoon wordt op een door jou gekozen achtergrondkleur gelegd, omdat iOS transparantie door zwart vervangt; en de PWA-iconen behouden hun alfakanaal. Niet-vierkante bronnen worden vanuit het midden bijgesneden, niet platgedrukt.',
			'Een logo naar 16px verkleinen is van nature destructief — fijn detail overleeft eenvoudigweg niet — dus de voorbeeldrij toont elk formaat op zijn echte afmetingen, zodat je de leesbaarheid kunt beoordelen voordat je het uitrolt. Alles wordt op een lokaal canvas gerenderd en de ICO-/ZIP-containers worden byte voor byte in de pagina samengesteld; je logo wordt nergens geüpload.'
		],
		faqs: [
			{
				q: 'Welke faviconformaten heb ik in 2026 echt nodig?',
				a: 'Minder dan de folklore suggereert: een favicon.ico met 16/32/48 voor legacy en de adresbalk, één apple-touch-icon.png van 180px, en PNG’s van 192/512px waarnaar het web-app-manifest verwijst. Moderne browsers kiezen de beste match uit precies deze set — de pakketten met 20 bestanden die sommige generatoren uitspugen zijn cargo cult.'
			},
			{
				q: 'Waarom is mijn logo onleesbaar op 16px?',
				a: 'Zestien pixels is meedogenloos klein — woordmerken, dunne lijnen en fijne verlopen lossen allemaal op. Sterke favicons brengen het merk terug tot één vet teken of vorm met veel contrast. Is het 16px-voorbeeld hier pap, snijd dan strakker op het kenmerkende deel van het merk of gebruik een vereenvoudigde variant voor kleine formaten.'
			},
			{
				q: 'Heb ik nog een .ico-bestand nodig, of volstaan PNG-favicons?',
				a: 'Elke moderne browser accepteert PNG-favicons, maar /favicon.ico is nog steeds het pad dat user agents, crawlers en oudere tooling blind opvragen. Daar een echte ICO serveren kost een paar kilobytes en elimineert een hele klasse 404’s en terugvalgrilligheden — houd hem naast je PNG-links.'
			},
			{
				q: 'Waarom heeft het Apple touch-icoon een achtergrondkleur nodig?',
				a: 'iOS rendert geen transparantie in iconen op het beginscherm — welke alfa je PNG ook heeft, hij wordt op zwart samengesteld. Vooraf platleggen op een kleur die jij koos houdt het resultaat bedoeld. Kies de achtergrond die bij je icoon past, en onthoud dat iOS de hoeken zelf afrondt, dus lever een vierkant aan dat helemaal doorloopt.'
			}
		]
	},

	'sql-formatter': {
		about: [
			'Plak een query die net uit een logbestand, een ORM-debugdump of de one-liner van een collega komt, en deze formatter breekt hem op in leesbare clausules met consistente inspringing. Zes dialecten worden ondersteund — standaard-SQL, PostgreSQL, MySQL, SQLite, SQL Server en BigQuery — zodat dialectspecifieke syntaxis als TOP, identifiers met backticks of arraytypen correct wordt geformatteerd in plaats van de parser te laten struikelen.',
			'Het hoofdlettergebruik van sleutelwoorden is instelbaar: HOOFDLETTERS voor de klassieke look, kleine letters als je team dat prettiger vindt, of het origineel onaangeroerd laten. De minificatiemodus doet het omgekeerde — hij vouwt een geformatteerde query tot één regel en verwijdert commentaar terwijl stringliteralen byte-voor-byte intact blijven, wat je wilt voordat je SQL in een JSON-configuratie of een CLI-vlag plakt.',
			'Query’s bevatten vaak tabelnamen, klantgegevens in literalen, of aanwijzingen over je infrastructuur. Het formatteren draait volledig in je browser, dus daar komt niets van bij een server terecht.'
		],
		faqs: [
			{
				q: 'Welk SQL-dialect moet ik kiezen?',
				a: 'Het dialect dat je database spreekt — het bepaalt hoe identifiers, stringquoting en dialectsleutelwoorden worden geparseerd. Wil je alleen algemeen opruimen, dan dekt standaard-SQL de gemeenschappelijke kern. Een parsefout op syntaxis die in jouw database geldig is, is meestal een teken om van dialect te wisselen.'
			},
			{
				q: 'Verandert formatteren wat de query doet?',
				a: 'Nee. Formatteren verplaatst alleen witruimte en, indien ingeschakeld, wijzigt het hoofdlettergebruik van sleutelwoorden — identifiers en literalen houden hun exacte bytes. SQL-sleutelwoorden zijn in elk ondersteund dialect hoofdletterongevoelig, dus SELECT en select zijn dezelfde instructie.'
			},
			{
				q: 'Kan ik meerdere instructies tegelijk formatteren?',
				a: 'Ja — plak een heel script en elke met ; afgesloten instructie wordt op volgorde geformatteerd, met een lege regel ertussen.'
			},
			{
				q: 'Wat verwijdert minificeren precies?',
				a: 'Regelcommentaar (--) en blokcommentaar (/* */) vervallen, reeksen witruimte worden één spatie, en spaties rond komma’s en haakjes verdwijnen. Tekst binnen enkele aanhalingstekens, dubbele aanhalingstekens en backticks wordt nooit aangeraakt, inclusief verdubbelde-aanhalingsteken-escapes.'
			}
		]
	},

	'xml-formatter': {
		about: [
			'Deze tool drukt XML netjes af met de inspringing van jouw keuze, meldt welgevormdheidsfouten met exacte regel en kolom, en kan een document tot één regel minificeren. Commentaren, CDATA-secties en de XML-proloog overleven het formatteren — verrassend veel formatters eten die stilletjes op.',
			'Valideren betekent hier welgevormdheid: correct geneste tags, attributen tussen aanhalingstekens, toegestane tekens. Dat vangt de overgrote meerderheid van handmatige bewerkingsongelukken — een ontbrekende slash, een niet-gesloten element, een verdwaalde ampersand. Schemavalidatie tegen een XSD valt bewust buiten het bestek; die hoort in je buildpijplijn thuis, mét het schemabestand.',
			'Configuratiebestanden, SOAP-payloads, RSS-feeds en Android-manifests bevatten routinematig interne hostnamen en sleutels. Alles wordt hier lokaal geparseerd — er wordt niets verstuurd.'
		],
		faqs: [
			{
				q: 'Waarom faalt mijn XML met “char … is not expected”?',
				a: 'De gebruikelijke verdachten zijn een kale & die &amp; had moeten zijn, een attribuutwaarde zonder aanhalingstekens, of tags die in de verkeerde volgorde sluiten. De foutmelding draagt regel en kolom van het eerste probleemteken, en het invoerveld markeert het.'
			},
			{
				q: 'Herschikt of normaliseert de formatter mijn document?',
				a: 'Nee. Elementen, attributen en hun volgorde blijven exact behouden; alleen witruimte tussen elementen verandert. Tekstinhoud die een regel deelt met markup wordt bijgesneden en interne reeksen witruimte worden samengevouwen — vertrouw je op betekenisvolle witruimte (xml:space="preserve"), houd die secties dan geminificeerd.'
			},
			{
				q: 'Wat verwijdert minificeren?',
				a: 'Inspringing en regeleinden tussen elementen, plus commentaar. CDATA-secties, verwerkingsinstructies en de proloog blijven. Het resultaat parseert identiek voor elke consument die niet afhankelijk is van tekstknopen met alleen witruimte.'
			},
			{
				q: 'Kan het valideren tegen een XSD of DTD?',
				a: 'Nee — dit controleert alleen welgevormdheid. Schemavalidatie vraagt om het schemabestand en een XSD-engine, en dat kun je beter in je toolchain doen (xmllint --schema, of de XML-bibliotheek van je taal).'
			}
		]
	},

	'xml-to-json': {
		about: [
			'Converteer XML naar JSON om oude SOAP-antwoorden, RSS-feeds of Maven-POM’s in JavaScript, jq of een JSON-native API te voeren — of ga de andere kant op en maak XML uit JSON-data. Attributen blijven behouden: ze worden "@_naam"-sleutels, en tekstinhoud die naast attributen bestaat komt onder "#text" terecht, zodat er niets stilletjes verdwijnt.',
			'De twee formaten zijn het over fundamentele zaken oneens, en deze converter maakt de gangbare pragmatische keuzes: herhaalde zusterelementen worden samengevoegd tot een JSON-array, numeriek ogende waarden worden getallen, en namespaces reizen mee als deel van de elementnaam. XML → JSON → XML behoudt structuur en inhoud voor typische documenten.',
			'Beide richtingen draaien lokaal in je browser. Plak een factuurfeed of een API-antwoord zonder dat het ergens heen gaat.'
		],
		faqs: [
			{
				q: 'Waarom komen sommige waarden terug als getallen in plaats van strings?',
				a: 'De parser herkent numerieke tekst en converteert die, wat de meeste consumenten willen. Pas op met identifiers met voorloopnullen (productcodes, telefoonnummers) — is dat belangrijk voor je data, zet ze dan na de conversie tussen aanhalingstekens of behandel de uitvoer als startpunt.'
			},
			{
				q: 'Hoe worden herhaalde elementen behandeld?',
				a: 'Twee of meer broers en zussen met dezelfde naam worden een JSON-array onder die sleutel. Eén enkel voorkomen blijft een gewoon object — die asymmetrie zit in de afbeelding zelf, dus code die de JSON verwerkt moet beide vormen tolereren of eerst normaliseren.'
			},
			{
				q: 'Wat betekenen de @_- en #text-sleutels?',
				a: '@_ markeert wat een XML-attribuut was, #text draagt de elementtekst wanneer er ook attributen zijn. Diezelfde conventie terugvoeren in de richting JSON → XML reconstrueert de oorspronkelijke markup.'
			},
			{
				q: 'Waarom weigert JSON → XML mijn array op het hoogste niveau?',
				a: 'Een XML-document moet precies één rootelement hebben, en een kale array heeft er geen. Wikkel de array in een object — {"items": {"item": [...]}} — en de converter levert een welgevormd document.'
			}
		]
	},

	'markdown-to-html': {
		about: [
			'Schrijf of plak Markdown en zie zowel het gerenderde voorbeeld als de gegenereerde HTML naast elkaar — koppen, GFM-tabellen, opsommingen in takenlijststijl, fenced codeblokken en doorhalingen inbegrepen. De omgekeerde richting zet bestaande HTML om in schone Markdown met ATX-koppen, streepjesopsommingen en fenced code, wat de snelste manier is om oude CMS-inhoud naar een docs-repository te verhuizen.',
			'Het voorbeeld wordt vóór het renderen opgeschoond: scripts, iframes en event-handler-attributen worden verwijderd, zodat een gedeelde link met vijandige markup niets in je browser kan uitvoeren. Het HTML-uitvoervak toont altijd de ruwe conversie, om in sjablonen of e-mails te plakken.',
			'Conversie en voorbeeld draaien lokaal. Concept-releasenotities met nog niet aangekondigde functienamen blijven op je machine.'
		],
		faqs: [
			{
				q: 'Welke Markdown-smaak is dit?',
				a: 'CommonMark plus de GitHub-uitbreidingen die mensen echt gebruiken: tabellen, doorhaling en automatisch gelinkte URL’s. Zachte regeleinden blijven zacht — één newline wordt geen <br>, net als hoe GitHub documenten rendert.'
			},
			{
				q: 'Waarom verschilt het voorbeeld van de ruwe HTML-uitvoer?',
				a: 'Het voorbeeld gaat door een sanitizer die scripttags, inline event handlers en javascript:-URL’s verwijdert voordat er gerenderd wordt. Het uitvoervak omzeilt de sanitizer omdat het tekst is, geen gerenderde markup — schoon verderop zelf op als je door gebruikers aangeleverde HTML insluit.'
			},
			{
				q: 'Hoe getrouw is HTML → Markdown?',
				a: 'Structurele elementen — koppen, lijsten, links, nadruk, code, blockquotes, afbeeldingen — converteren schoon. HTML zonder Markdown-equivalent (geneste tabellen, divs met klassen, inline styles) gaat door als ruwe HTML of verliest zijn opmaak, dus een snelle doorlezing achteraf is de moeite waard.'
			},
			{
				q: 'Kan ik de gegenereerde HTML in een e-mail gebruiken?',
				a: 'Ja — de uitvoer is gewone semantische HTML zonder klassen of externe stylesheets, en dat is precies wat e-mailclients het beste verdragen. Voeg de opmaak die je nodig hebt er inline aan toe.'
			}
		]
	},

	'html-formatter': {
		about: [
			'Maak HTML leesbaar die uit een bundler, een scraper of een WYSIWYG-editor kwam: elementen worden ingesprongen op de breedte die jij kiest, attributen blijven op hun regel, en de inhoud van pre/textarea blijft byte-voor-byte intact. De minificatiemodus verwijdert commentaar en vouwt de witruimte tussen tags samen — bij handgeschreven pagina’s doorgaans 10–25% minder bytes.',
			'De minificatie is hier bewust behoudend: inline scripts en styles worden beschermd, conditioneel commentaar overleeft, en enkele spaties tussen inline-elementen blijven staan, zodat “klik <a>hier</a> nu” niet samensmelt tot “klikhiernu”. Je krijgt een veilige minificatie, geen maximaal agressieve.',
			'Beide bewerkingen draaien lokaal in je browser — nog niet gepubliceerde pagina’s en interne beheermarkup verlaten je machine nooit.'
		],
		faqs: [
			{
				q: 'Breekt minificeren mijn inline JavaScript of CSS?',
				a: 'Nee — <script>-, <style>-, <pre>- en <textarea>-blokken zijn volledig uitgesloten van het samenvouwen van witruimte. Alleen markup tussen tags wordt aangeraakt. Wil je de scripts zelf comprimeren, haal ze dan apart door de JavaScript-minifier.'
			},
			{
				q: 'Waarom is witruimte tussen tags veilig om te verwijderen?',
				a: 'Meestal is het dat: witruimte tussen blokelementen heeft geen visueel effect. Tussen inline-elementen wél, en daarom vouwt de minifier reeksen samen tot één spatie in plaats van ze te verwijderen. Layouts die op inline-block-witruimtetrucs leunen zijn de zeldzame uitzondering die je even moet nakijken.'
			},
			{
				q: 'Repareert de formatter ongeldige HTML?',
				a: 'Hij formatteert wat je hem geeft zonder tegen de HTML-specificatie te valideren — niet-gesloten tags blijven niet-gesloten. Browsers zijn mild voor tag soup, dus formatteren helpt je nog steeds de structuur genoeg te zien om het probleem te vinden.'
			},
			{
				q: 'Welke inspringbreedte moet ik gebruiken?',
				a: '2 spaties is de heersende conventie in webcodebases en de standaard van de meeste frameworkstijlgidsen. Kies 4 als je team daarop gestandaardiseerd is — de keuze is cosmetisch.'
			}
		]
	},

	'css-formatter': {
		about: [
			'Klap geminificeerde of gekopieerde CSS uit naar regels met één declaratie per regel, of pers een stylesheet samen voor productie. De beautifier normaliseert inspringing en accoladeplaatsing; de minifier verwijdert commentaar, vouwt witruimte samen en laat afsluitende puntkomma’s vallen, terwijl strings, de inhoud van url(...) en calc()-expressies onaangeroerd blijven.',
			'De minifier is transparant over wat hij níet doet: hij hernoemt geen selectors, voegt geen dubbele regels samen en herschrijft geen kleuren. Dat maakt de uitvoer voorspelbaar en veilig voor elke stylesheet, ook met hacks en vendor prefixes — plakken, minificeren, uitleveren.',
			'Zoals bij elke tool hier gebeurt de verwerking lokaal. Nog niet uitgebrachte designsysteemcode blijft in je browser.'
		],
		faqs: [
			{
				q: 'Hoeveel kleiner wordt geminificeerde CSS?',
				a: 'Doorgaans 15–30% voor handgeschreven CSS, vooral door inspringing en commentaar. Gzip op je server haalt veel van dezelfde redundantie weg, dus het verschil op de lijn is kleiner dan het ruwe bytegetal suggereert — minificeer toch, het scheelt ook parsetijd.'
			},
			{
				q: 'Is het veilig voor calc(), custom properties en media queries?',
				a: 'Ja. Spaties binnen calc() zijn betekenisvol en blijven behouden; custom properties en hun var()-verwijzingen zijn gewone declaraties en overleven ongewijzigd; @media en andere at-rules houden hun structuur.'
			},
			{
				q: 'Waarom hielden mijn descendant-selectors hun spaties?',
				a: 'Omdat “nav a” en “nava” verschillende dingen selecteren — de spatie is een combinator, geen opmaak. De minifier verwijdert alleen witruimte zonder syntactische betekenis.'
			},
			{
				q: 'Kan het converteren tussen LESS/SCSS en CSS?',
				a: 'Nee — preprocessorsyntaxis vraagt compilatie, geen formattering. Gewone SCSS die ook geldige CSS is formatteert prima; geneste regels en mixins niet.'
			}
		]
	},

	'js-formatter': {
		about: [
			'Maak JavaScript leesbaar met consistente inspringing en spatiëring — klap een meegeleverde bundle uit om te zien wat hij werkelijk doet, of ruim code op die uit een console is geplakt. De minifier is het echte werk: Terser parseert je code tot een AST, verwijdert dode code, verkort lokale variabelenamen en haalt commentaar weg — dezelfde engine die bundlers in productie gebruiken.',
			'Omdat de minificatie op de AST werkt, breekt ze nooit werkende code zoals regex-gebaseerde “compressors” dat kunnen: strings, template literals, reguliere expressies en ASI-randgevallen worden door een echte parser afgehandeld. Syntaxfouten worden met positie gemeld in plaats van corrupte uitvoer op te leveren.',
			'Terser wordt pas geladen zodra je voor het eerst minificeert, wat de pagina licht houdt, en draait volledig in je browser — eigen broncode verlaat je machine nooit.'
		],
		faqs: [
			{
				q: 'Hoeveel kleiner wordt mijn code?',
				a: 'Handgeschreven code krimpt doorgaans 30–60% vóór gzip: witruimte, commentaar en lange lokale namen wegen zo zwaar. Code die al gebundeld is krimpt veel minder — die is dezelfde transformatie al één keer doorgegaan.'
			},
			{
				q: 'Verandert minificatie het gedrag?',
				a: 'Compressie en mangling behouden de semantiek: alleen lokale namen worden hernoemd, en dead-code-eliminatie verwijdert takken die aantoonbaar niet kunnen draaien. Code die leunt op Function.prototype.name of toString() van haar eigen functies is de klassieke uitzondering.'
			},
			{
				q: 'Kan dit productiecode van een website ontminificeren?',
				a: 'De formatter herstelt witruimte en structuur, waardoor de controlestroom leesbaar wordt — maar oorspronkelijke variabelenamen en commentaar zijn voorgoed weg; je ziet a, b, c. Voor serieus debuggen zijn source maps beter, als de site die meelevert.'
			},
			{
				q: 'Ondersteunt het TypeScript of JSX?',
				a: 'Nee — beide hebben hun eigen parsers nodig. Compileer eerst naar JavaScript (tsc, esbuild) en formatteer of minificeer de uitvoer hier.'
			}
		]
	},

	'string-escape': {
		about: [
			'Zet een meerregelige string met aanhalingstekens om in iets dat je binnen een JSON-waarde, een JavaScript-literal, een Java-string, een XML-tekstknoop, een SQL-literal of een CSV-cel kunt plakken — en draai het proces om wanneer je geëscapete tekst in een logbestand vindt en die wilt lezen. Zes dialecten, beide richtingen.',
			'Elk dialect volgt zijn eigen specificatie in plaats van een kleinste gemene deler: JSON escapet stuurtekens als \\uXXXX, JavaScript escapet daarbovenop enkele aanhalingstekens en backticks, Java codeert niet-ASCII als UTF-16-\\u-reeksen, SQL verdubbelt enkele aanhalingstekens, CSV omhult en verdubbelt volgens RFC 4180, en XML gebruikt zijn vijf voorgedefinieerde entiteiten. De unescaper begrijpt de vormen \\x, \\u en \\u{…} en meldt misvormde reeksen met hun positie.',
			'Geëscapete strings zijn vaak connection strings, tokens en queryfragmenten. Dit draait lokaal — plak gerust.'
		],
		faqs: [
			{
				q: 'Welk dialect heb ik nodig voor een JSON-configuratiebestand?',
				a: 'JSON. Het escapet dubbele aanhalingstekens, backslashes en stuurtekens precies zoals RFC 8259 vereist en laat unicode leesbaar. De uitvoer past in elke JSON-stringwaarde — zonder de omringende aanhalingstekens, die de tool aan jou overlaat.'
			},
			{
				q: 'Wat is het verschil tussen de dialecten JSON en JavaScript?',
				a: 'JavaScript escapet daarnaast enkele aanhalingstekens en backticks, zodat het resultaat veilig is in alle drie de JS-quotingstijlen. JSON heeft alleen dubbele aanhalingstekens nodig. Bij het unescapen worden beide geaccepteerd, plus de vormen \\x en \\u{…} die JSON niet definieert.'
			},
			{
				q: 'Maakt SQL-escaping gebruikersinvoer veilig om samen te voegen?',
				a: 'Het levert een correcte SQL-stringliteral op (aanhalingstekens verdubbeld), maar escapen-en-dan-samenvoegen blijft het verkeerde patroon voor niet-vertrouwde invoer — gebruik geparametriseerde query’s. Deze tool is voor fixtures, migraties en debuggen, niet voor injectieverdediging.'
			},
			{
				q: 'Waarom mislukt het unescapen van mijn string?',
				a: 'Een backslash gevolgd door iets dat geen gedefinieerde escape is (\\q, een afgekapte \\u12) is misvormd, en de fout noemt de betreffende index. Bevat je tekst letterlijke Windows-paden, escape hem dan eerst — C:\\temp is een vermomde tab.'
			}
		]
	},

	'number-base-converter': {
		about: [
			'Typ een getal in elk grondtal en lees het tegelijk in binair, octaal, decimaal en hexadecimaal — plus elk aangepast grondtal tot 36. Voorvoegsels worden begrepen (0x, 0o, 0b), cijfergroepering maakt lange waarden scanbaar (1111 1111 · 255 · ff), en een bitlengteweergave vertelt je meteen of een waarde in 8, 32 of 64 bits past.',
			'De rekenkunde gebruikt BigInt, dus de precisie is exact op elke grootte: bestandsrechten, ARGB-kleuren, IP-adressen, hashvoorvoegsels en 64-bits database-ID’s converteren allemaal zonder de stille afronding die gewone JavaScript-getallen boven 2⁵³ treft.',
			'Negatieve getallen behouden hun teken in alle grondtallen. Alles rekent lokaal, direct, terwijl je typt.'
		],
		faqs: [
			{
				q: 'Hoe bepaalt automatische herkenning het grondtal?',
				a: 'Aan het voorvoegsel: 0x betekent hex, 0o octaal, 0b binair; al het overige wordt als decimaal gelezen. Cijfers als “ff” zonder voorvoegsel zijn dubbelzinnig, dus kies dan expliciet HEX — de foutmelding herinnert je eraan.'
			},
			{
				q: 'Zijn enorme getallen echt exact?',
				a: 'Ja — de conversie draait op BigInt, dat willekeurige precisie heeft. 18446744073709551615 (2⁶⁴−1) komt exact heen en terug; een float-gebaseerde converter zou het verminken tot …551616.'
			},
			{
				q: 'Hoe worden negatieve getallen binair getoond?',
				a: 'Met een minteken (-1010), niet in tweecomplement, omdat tweecomplement een vaste breedte vereist. Wil je een tweecomplementpatroon zien, tel dan 2ⁿ bij je negatieve waarde op voor de breedte die je interesseert en converteer dat.'
			},
			{
				q: 'Waarvoor kun je grondtal 36 gebruiken?',
				a: 'Compacte ID’s: 0-9 plus a-z is het dichtste alfabet dat hoofdletterongevoelig en URL-veilig blijft. Veel URL-verkorters en ticketsystemen coderen numerieke ID’s zo — plak er een en lees het onderliggende getal.'
			}
		]
	},

	'text-to-hex': {
		about: [
			'Zie precies uit welke bytes je tekst bestaat: deze tool codeert tekst naar UTF-8 en toont die als hex-, binaire of decimale bytewaarden — met jouw keuze van scheidingsteken, hoofdlettergebruik en 0x-voorvoegsels. De decoder gaat de andere kant op en is bewust tolerant: hij accepteert aaneengesloten reeksen (48656c6c6f), paren met spaties, MAC-achtige notatie met dubbele punten en \\x-escapereeksen.',
			'Omdat de codering UTF-8 op byteniveau is, worden multibyte-tekens getoond zoals ze werkelijk in het geheugen en op de lijn bestaan: é is c3 a9, 世 is e4 b8 96, en emoji nemen vier bytes in beslag. Daarmee is dit de snelste manier om coderingsverschillen, BOM-mysteries en “waarom is deze string langer dan hij lijkt”-problemen te debuggen.',
			'Zijn de gedecodeerde bytes geen geldige UTF-8, dan zegt de tool dat in plaats van onleesbare tekens af te drukken — een sterke aanwijzing dat je naar binaire data kijkt in plaats van naar tekst.'
		],
		faqs: [
			{
				q: 'Waarom wordt één teken meerdere bytes?',
				a: 'UTF-8 is variabel van breedte: ASCII blijft één byte, de meeste Europese letters nemen er twee, CJK drie, emoji vier. Wat je hier ziet is de exacte bytereeks die elk UTF-8-systeem — bestanden, HTTP, databases — voor jouw tekst opslaat.'
			},
			{
				q: 'Welke invoerformaten accepteert de decoder?',
				a: 'Hex als aaneengesloten reeks, paren met spaties, met 0x- of \\x-voorvoegsels, of gescheiden door dubbele punten/komma’s; binair als groepen van 8 bits met of zonder spaties; decimaal als gescheiden bytewaarden. Gemengde scheidingstekens en verdwaalde witruimte worden automatisch opgeruimd.'
			},
			{
				q: 'Waarom zegt het decoderen dat de bytes geen geldige UTF-8 zijn?',
				a: 'De bytereeks schendt de UTF-8-regels — bijvoorbeeld een losse ff, of een vervolgbyte zonder leidende byte. De data kan binair zijn, in een oude codering als Latin-1 staan, of middenin een teken afgekapt zijn.'
			},
			{
				q: 'Is dit hetzelfde als een hexdump van xxd?',
				a: 'De bytewaarden zijn identiek; xxd voegt offsets en een ASCII-kolom toe. Plak de hexkolommen van een xxd-dump hier (zonder de offsetkolom) en het decodeert prima.'
			}
		]
	},

	'json-schema-validator': {
		about: [
			'Twee richtingen van dezelfde discipline: plak voorbeeld-JSON en krijg er een draft-07-schema uit afgeleid, of plak data plus een schema en zie elke overtreding met zijn JSON-pad. De validatie draait op Ajv — dezelfde engine die de meeste Node-services gebruiken — dus wat hier slaagt, slaagt in CI.',
			'De inferentie is productiegericht: objectsleutels worden getypeerde properties en required-entries, arrays voegen de vormen van al hun leden samen, gehele getallen worden onderscheiden van floats, en sleutels die maar in sommige arrayleden voorkomen blijven terecht buiten required. Het resultaat is een startpunt dat je aanscherpt met formats, bereiken en patronen.',
			'API-antwoorden en configuratiebestanden zijn precies de data die je het minst op een server van derden wilt hebben. Zowel de inferentie als de validatie draait volledig in je browser.'
		],
		faqs: [
			{
				q: 'Welke JSON Schema-draft wordt ondersteund?',
				a: 'De inferentie levert draft-07, de breedst ondersteunde draft in editors en validators. De validatie accepteert draft-07 en de eerdere drafts die Ajv in niet-strikte modus begrijpt; de keywords van 2019-09/2020-12 werken meestal ook, omdat onbekende keywords genegeerd worden in plaats van fataal te zijn.'
			},
			{
				q: 'Wat betekent de $ in overtredingspaden?',
				a: 'Het is de root van het document, in JSONPath-stijl: $.age betekent de property age op het hoogste niveau, $.items.2.name de name van het derde arrayelement. Een leeg pad ($) betekent dat de overtreding de documentroot zelf betreft — verkeerd type, of een ontbrekende verplichte property.'
			},
			{
				q: 'Waarom is het afgeleide schema strenger of losser dan ik verwachtte?',
				a: 'Het beschrijft exact het voorbeeld dat je gaf: velden die overal aanwezig zijn worden verplicht, en alleen waargenomen typen zijn toegestaan. Voer het een gevarieerder voorbeeld (een array van representatieve objecten) voor een algemener schema, en pas het daarna met de hand aan — de inferentie kan de bedoeling niet kennen.'
			},
			{
				q: 'Ondersteunt de validatie format, pattern en andere beperkingskeywords?',
				a: 'Structurele keywords (type, required, properties, items, enum, minimum, pattern…) worden volledig afgedwongen. Formatstrings als "email" of "date-time" worden niet gecontroleerd — dat volgt de JSON Schema-specificatie, waarin format standaard annotatie is, en voorkomt vals vertrouwen.'
			}
		]
	},

	'exif-viewer': {
		about: [
			'Elke foto die je telefoon maakt draagt verborgen metadata mee: cameramodel, opnametijd, bewerkingssoftware — en, tenzij uitgeschakeld, de GPS-coördinaten van waar je stond. Deze tool leest die metadata uit JPEG-, PNG- en WebP-bestanden en toont ze gegroepeerd en ontcijferd: belichtingswaarden als f/2.8 en 1/250 s, oriëntatie in woorden, GPS als decimale coördinaten met een kaartlink.',
			'De cleaner maakt een kopie zonder metadata — verliesvrij. In plaats van de afbeelding opnieuw te coderen (wat kwaliteit kost), verwijdert hij de metadatasegmenten byte voor byte: EXIF- en XMP-blokken in JPEG, tekst- en tijdchunks in PNG, EXIF-/XMP-chunks in WebP. Pixels, afmetingen en kwaliteit blijven onaangeroerd; kleurprofielen blijven behouden zodat de afbeelding identiek weergegeven wordt.',
			'Dit is de ene categorie waar “draait lokaal” het hele punt is: een foto op GPS-data controleren door hem naar een server te uploaden zou het doel voorbijschieten. Het bestand verlaat je browser nooit — na te gaan in het netwerktabblad.'
		],
		faqs: [
			{
				q: 'Verandert het verwijderen van metadata de beeldkwaliteit?',
				a: 'Nee. De beelddatastroom wordt bit voor bit gekopieerd; alleen metadatasegmenten vervallen. Het opgeschoonde bestand is precies de metadatagrootte kleiner, en de pixels zijn aantoonbaar identiek.'
			},
			{
				q: 'Waarom toont mijn schermafbeelding geen metadata?',
				a: 'Schermafbeeldingen en de meeste voor het web geëxporteerde afbeeldingen hadden nooit EXIF — camera’s schrijven het, screenshottools meestal niet. Sociale platforms strippen metadata bovendien bij het uploaden, dus een foto die je daar downloadt is meestal al schoon.'
			},
			{
				q: 'Is de GPS-positie exact?',
				a: 'Telefoon-GPS in EXIF is doorgaans nauwkeurig tot op een paar meter — genoeg om een gebouw aan te wijzen. De tool zet de opgeslagen graden/minuten/seconden om naar decimalen en linkt naar het exacte punt, zodat je precies ziet wat een ontvanger van het bestand zou kunnen zien.'
			},
			{
				q: 'Waarom houdt het opgeschoonde bestand een ICC-kleurprofiel?',
				a: 'Het ICC-profiel vertelt software hoe de kleuren geïnterpreteerd moeten worden — het weghalen kan ze zichtbaar verschuiven, en het bevat geen persoonsgegevens. De cleaner verwijdert identificerende metadata (EXIF, XMP, IPTC, commentaren, tijdstempels) en behoudt wat de afbeelding nodig heeft om correct weergegeven te worden.'
			}
		]
	}
};

export default TOOL_CONTENT_NL;
