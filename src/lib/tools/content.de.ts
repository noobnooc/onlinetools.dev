import type { ToolContent } from './content';

/**
 * Deutsche Übersetzung der Tool-Texte (About + FAQ). Jeder Eintrag wurde
 * einzeln übersetzt und entspricht 1:1 der englischen Vorlage in content.ts;
 * fehlende Einträge fallen automatisch auf Englisch zurück.
 */
const TOOL_CONTENT_DE: Record<string, ToolContent> = {
	'json-formatter': {
		about: [
			'Füge beliebiges JSON ein — eine API-Antwort, eine Config-Datei, eine Logzeile — und dieser Formatter gibt es mit der Einrückung deiner Wahl hübsch formatiert aus oder minifiziert es zum Einbetten. Geparst wird mit der nativen JSON-Engine des Browsers: Was hier validiert, akzeptieren JavaScript und jeder JSON-konforme Parser exakt genauso.',
			'Bei ungültiger Eingabe wird der Fehler mit der genauen Zeile und Spalte annotiert, an der das Parsen fehlgeschlagen ist — statt eines vagen „unexpected token“ irgendwo. Zusammen mit dem Monospace-Editor wird die Jagd nach einem fehlenden Komma in einem 500-Zeilen-Payload zur Sache von zehn Sekunden. Du kannst Objekt-Keys außerdem alphabetisch sortieren, was vor dem Diffen zweier Payloads hilft.',
			'Die Formatierung läuft vollständig in deinem Browser. Payloads mit Tokens, Kundendaten oder internen URLs verlassen deinen Rechner nie — es gibt keinen Server, der sie mitloggen könnte.'
		],
		faqs: [
			{
				q: 'Warum schlägt mein JSON mit „Unexpected token“ fehl, obwohl es korrekt aussieht?',
				a: 'Die üblichen Verdächtigen: ein Komma nach dem letzten Element, einfache statt doppelter Anführungszeichen, Keys ohne Anführungszeichen oder Kommentare. All das ist in JavaScript-Objektliteralen (oder JSON5) erlaubt, in striktem JSON aber nicht. Die Zeilen-/Spaltenmarkierung zeigt auf das erste problematische Zeichen.'
			},
			{
				q: 'Gibt es eine Größenbeschränkung?',
				a: 'Kein hartes Limit — das Parsen läuft lokal, es hängt also von deinem Rechner ab. Dokumente bis zu einigen Dutzend Megabyte formatieren in einem modernen Browser problemlos; darüber hinaus kann der Tab langsamer werden, weil das gesamte Dokument im Speicher gehalten wird.'
			},
			{
				q: 'Verändert die Formatierung meine Daten?',
				a: 'Nur Whitespace, sofern du nicht die Key-Sortierung aktivierst. Zahlen werden von der JavaScript-Engine neu serialisiert: 1e2 wird zu 100 und Ganzzahlen jenseits der IEEE-754-Double-Präzision werden normalisiert — genau das, was jeder JS-basierte Konsument deines JSON ebenfalls tun würde.'
			},
			{
				q: 'Kann ich JSON validieren, ohne es neu zu formatieren?',
				a: 'Ja — das Status-Badge über der Eingabe aktualisiert sich beim Tippen und meldet, ob das Dokument parsebar ist, wie groß es ist und wo der erste Fehler liegt. Die Format-Aktion brauchst du nur, wenn die Ausgabe neu geschrieben werden soll.'
			}
		]
	},

	'base64-decode': {
		about: [
			'Base64 verwandelt beliebige Bytes in ein 64-Zeichen-Alphabet, das das Einfügen in JSON, URLs, HTTP-Header und E-Mails unbeschadet übersteht. Dieses Tool konvertiert in beide Richtungen: Tippe oder füge Text ein, um ihn zu kodieren, oder füge einen kodierten Blob ein, um das Original zurückzubekommen. UTF-8 wird in beiden Richtungen korrekt behandelt, sodass Emoji und nicht-lateinische Schriften ohne Zeichensalat den Roundtrip überstehen.',
			'Der Decoder ist absichtlich nachsichtig: Er akzeptiert das URL-sichere Alphabet (- und _ statt + und /), entfernt Whitespace und Zeilenumbrüche und stellt fehlendes Padding vor dem Dekodieren wieder her — die drei Dinge, an denen strengere Decoder eigentlich problemlos wiederherstellbare Eingaben am häufigsten scheitern lassen. Sind die dekodierten Bytes kein gültiger UTF-8-Text, sagt das Tool es dir, statt Datenmüll auszugeben — meistens heißt das, der Payload war Binärdaten, etwa ein Bild.',
			'Alles passiert auf der Seite selbst. Ein Token oder Credential hier zu dekodieren überträgt es nirgendwohin.'
		],
		faqs: [
			{
				q: 'Warum endet mein Base64-String mit =-Zeichen?',
				a: 'Base64 kodiert 3 Bytes in 4 Zeichen; ist die Eingabelänge kein Vielfaches von 3, wird die Ausgabe mit = aufgefüllt, damit die Gruppen ausgerichtet bleiben. Padding trägt keine Daten; dieser Decoder stellt es automatisch wieder her, falls es entfernt wurde.'
			},
			{
				q: 'Was ist der Unterschied zwischen Standard- und URL-sicherem Base64?',
				a: 'Standard-Base64 verwendet + und /, die in URLs eine Sonderbedeutung haben und selbst wieder escaped werden müssten. Die URL-sichere Variante (RFC 4648 §5) tauscht sie gegen - und _ und lässt das Padding meist weg. JWTs zum Beispiel nutzen die URL-sichere Form. Der Encoder hier bietet beide an; der Decoder akzeptiert automatisch beide.'
			},
			{
				q: 'Ist Base64 Verschlüsselung?',
				a: 'Nein. Base64 ist eine umkehrbare Kodierung ohne Schlüssel — jeder kann sie dekodieren. Sie schützt Daten vor Transportschäden, nicht vor dem Mitlesen. Brauchst du Vertraulichkeit, verschlüssle zuerst und kodiere dann den Ciphertext.'
			},
			{
				q: 'Warum meldet das Dekodieren, das Ergebnis sei kein gültiges UTF-8?',
				a: 'Der String wurde erfolgreich dekodiert, aber die resultierenden Bytes sind kein Text — oft ein PNG, ein PDF oder komprimierte/verschlüsselte Daten. Solchen Inhalt in ein Textfeld zu dekodieren würde nur Zeichensalat zeigen, also markiert das Tool ihn stattdessen.'
			}
		]
	},

	'timestamp-converter': {
		about: [
			'Unix-Zeit zählt Sekunden seit 1970-01-01T00:00:00 UTC und taucht überall auf: Datenbankzeilen, JWT-Claims, Logdateien, API-Antworten. Dieser Konverter akzeptiert Timestamps in Sekunden oder Millisekunden — die Einheit wird an der Größenordnung erkannt — ebenso wie ISO-8601-Strings und die meisten menschenlesbaren Datumsangaben, und zeigt alle Darstellungen auf einmal: ISO, UTC, deine lokale Zeit, relative Zeit und beide Unix-Präzisionen.',
			'Die Einheiten-Mehrdeutigkeit ist die klassische Falle: 1700000000 ist in Sekunden November 2023, in Millisekunden aber Januar 1970. Die erkannte Einheit wird explizit angezeigt, und du kannst sie mit einem Klick umschalten, wenn die Vermutung falsch liegt — Schluss mit dem Ziffernzählen im Kopf.',
			'Die Umrechnung ist sofort und lokal, und die Anzeige der aktuellen Zeit tickt weiter — die Seite taugt beim Arbeiten also nebenbei als Epoch-Uhr.'
		],
		faqs: [
			{
				q: 'Wie entscheidet das Tool zwischen Sekunden und Millisekunden?',
				a: 'Über die Größenordnung: Werte mit 11 oder mehr Stellen werden als Millisekunden behandelt, kürzere als Sekunden. Damit reichen Sekunden bis etwa ins Jahr 5138 und Millisekunden ab etwa 1973 — jeder realistische moderne Timestamp ist damit eindeutig. Für Grenzfälle kannst du die Einheit manuell umschalten.'
			},
			{
				q: 'Was passiert nach 2038?',
				a: 'Das Jahr-2038-Problem betrifft Systeme, die Unix-Zeit in einem vorzeichenbehafteten 32-Bit-Integer speichern. JavaScript-Zahlen sind 64-Bit-Floats, dieser Konverter verarbeitet also Daten weit jenseits von 2038 — bis weit über das Jahr 275760 hinaus, dem Limit von JavaScript Date.'
			},
			{
				q: 'Kann ich ein Datum zurück in einen Timestamp umwandeln?',
				a: 'Ja. Füge einen ISO-8601-String wie 2026-07-20T12:00:00Z oder die meisten gängigen Datumsformate ein, und die Unix-Sekunden und -Millisekunden erscheinen neben den anderen Darstellungen.'
			},
			{
				q: 'Welche Zeitzone wird für die Zeile mit der lokalen Zeit verwendet?',
				a: 'Die in deinem Browser konfigurierte Zeitzone, über die Intl-API — nichts wird remote nachgeschlagen. Der Zeitzonenname steht direkt neben dem Wert, damit Screenshots eindeutig bleiben.'
			}
		]
	},

	'jwt-decoder': {
		about: [
			'Ein JSON Web Token besteht aus drei Base64URL-Segmenten — Header, Payload, Signatur — verbunden durch Punkte. Dieser Decoder zerlegt ein Token, rendert Header und Payload als formatiertes JSON, markiert die registrierten Zeit-Claims (iat, exp, nbf) als menschenlesbare Daten und zeigt dir auf einen Blick, ob das Token abgelaufen ist.',
			'Dekodieren ist keine Verifikation: Den Payload eines JWT kann jeder lesen, der es in der Hand hat, denn Base64URL ist eine Kodierung, keine Verschlüsselung. Genau deshalb ist es normalerweise eine schlechte Idee, ein Token auf einer beliebigen Website einzufügen — diese Seite ist die Ausnahme, weil das Dekodieren vollständig in deinem Browser stattfindet und das Token nie übertragen wird. Die Signaturprüfung gegen ein Secret oder einen Public Key liegt beim Offline-Decoder bewusst außerhalb des Umfangs.',
			'Ein führendes „Bearer “-Präfix wird automatisch entfernt, du kannst also direkt aus einem Authorization-Header einfügen.'
		],
		faqs: [
			{
				q: 'Ist es sicher, hier ein Produktions-Token einzufügen?',
				a: 'Das Token bleibt in deinem Browser — diese Seite macht keine Netzwerk-Requests mit deiner Eingabe, was du im Network-Tab der Developer Tools nachprüfen kannst. Behandle Live-Tokens aus Gewohnheit trotzdem wie Passwörter: Für Screenshots lieber abgelaufene oder Test-Tokens verwenden.'
			},
			{
				q: 'Warum lässt sich mein Token nicht dekodieren?',
				a: 'Prüfe, ob es genau drei durch Punkte getrennte Segmente hat und keine Zeilenumbrüche vom Kopieren enthält. Opake Access-Tokens (z. B. viele GitHub- oder Google-Tokens) sind gar keine JWTs — kein Dekodieren der Welt öffnet einen Zufallsstring, der nie JSON enthielt.'
			},
			{
				q: 'Was bedeuten iat, exp und nbf?',
				a: 'Das sind registrierte Claims aus RFC 7519, alle in Unix-Sekunden: iat ist der Ausstellungszeitpunkt des Tokens, exp der Zeitpunkt, ab dem es ungültig wird, und nbf („not before“) der früheste Moment, ab dem es akzeptiert werden darf. Dieses Tool wandelt jeden in ein lesbares Datum um und vergleicht exp mit deiner Uhr.'
			},
			{
				q: 'Kann dieses Tool die Signatur verifizieren?',
				a: 'Nein — und einem grünen Häkchen eines Online-Tools sollte man für Sicherheitsentscheidungen ohnehin nicht vertrauen. Verifiziere Signaturen in deinem Backend mit einer gepflegten Library (jose, jsonwebtoken, PyJWT) gegen die tatsächlichen Keys des Issuers.'
			}
		]
	},

	'regex-tester': {
		about: [
			'Schreib ein Pattern, füge Beispieltext ein, und jeder Match wird beim Tippen hervorgehoben — mit Capture-Groups, benannten Gruppen und Match-Positionen darunter aufgelistet. Der Tester nutzt die JavaScript-RegExp-Engine, das Verhalten entspricht also exakt dem von Node.js und Browsern, inklusive Lookbehind, benannter Gruppen und Unicode-Property-Escapes.',
			'Flags werden pro Buchstabe umgeschaltet (g, i, m, s, u, y, d) und das Pattern wird bei jedem Tastendruck kompiliert; Syntaxfehler erscheinen sofort mit der Original-Meldung der Engine statt erst nach einem Buttonklick. Patterns mit leeren Matches wie a* werden sicher behandelt, und ausufernde Eingaben werden bei 10.000 Matches gekappt, damit ein verirrtes .* den Tab nicht einfrieren kann.',
			'Regex-Dialekte unterscheiden sich zwischen Engines — ein Pattern, das hier funktioniert, braucht für PCRE, RE2 oder Pythons re-Modul eventuell Anpassungen, vor allem bei Lookbehind-Unterstützung, possessiven Quantifizierern und Inline-Flags.'
		],
		faqs: [
			{
				q: 'Welchen Regex-Dialekt verwendet dieser Tester?',
				a: 'ECMAScript (JavaScript), so wie ihn dein eigener Browser implementiert. Unterstützt werden Lookahead, Lookbehind, benannte Capture-Groups, Rückverweise und Unicode-Property-Escapes wie \\p{Letter} (mit dem u-Flag). Nicht unterstützt wird PCRE-exklusive Syntax wie possessive Quantifizierer oder Rekursion.'
			},
			{
				q: 'Warum matcht mein Pattern alles / nichts?',
				a: 'Die zwei Klassiker: ein nicht escaptes Metazeichen (. matcht jedes Zeichen — escape es als \\. für einen literalen Punkt) oder ein gedanklich fehlendes g-Flag — dieser Tester findet immer alle Matches, dein Code aber nur den ersten, sofern g nicht gesetzt ist.'
			},
			{
				q: 'Was sind benannte Capture-Groups?',
				a: 'Die Syntax (?<name>...) benennt eine Gruppe, sodass du Matches über den Namen statt über die Position auslesen kannst: match.groups.name in JavaScript. Das Gruppen-Panel unter den Matches zeigt für jeden Match nummerierte und benannte Captures.'
			},
			{
				q: 'Läuft ein Regex von hier unverändert in Python oder Go?',
				a: 'Oft, aber nicht immer. Zeichenklassen, Quantifizierer und Anker sind portabel; Lookbehind, die Syntax benannter Gruppen (Python nutzt (?P<name>...)) und Inline-Flags unterscheiden sich. Gos RE2-Engine lehnt Rückverweise und Lookaround sogar komplett ab.'
			}
		]
	},

	'diff-checker': {
		about: [
			'Füge links einen Originaltext und rechts eine geänderte Version ein und erhalte einen zeilenweisen Unified-Vergleich: Löschungen rot markiert, Ergänzungen grün, Kontext dazwischen erhalten, mit den originalen Zeilennummern auf beiden Seiten. Der schnellste Weg, die Frage „Was hat sich eigentlich geändert?“ zwischen zwei Configs, zwei API-Antworten oder zwei Versionen eines im Chat geposteten Snippets zu beantworten.',
			'Der Vergleich nutzt einen Longest-Common-Subsequence-Algorithmus über Zeilen, dieselbe Algorithmenfamilie wie git diff — umsortierte Blöcke und kleine Änderungen ergeben also ein lesbares Resultat, statt dass alles als geändert markiert wird. Eine Zusammenfassungszeile summiert hinzugefügte und entfernte Zeilen.',
			'Weil beide Texte auf der Seite bleiben, birgt das Diffen vertraulichen Materials — Verträge, Credentials in Configs, unveröffentlichte Texte — keines der Risiken, die das Einfügen in einen beliebigen Webdienst mit sich bringt.'
		],
		faqs: [
			{
				q: 'Arbeitet der Diff auf Wörtern oder Zeilen?',
				a: 'Zeilen. Jede Zeile wird als Einheit verglichen, was dem entspricht, wie Entwickler Diffs von Code und Configs lesen. Eine geänderte Zeile erscheint deshalb als eine Löschung plus eine Ergänzung; Inline-Hervorhebung auf Zeichenebene steht auf der Roadmap.'
			},
			{
				q: 'Warum zeigt mein Diff alles als geändert an?',
				a: 'Meist unsichtbare Unterschiede: eine Seite nutzt Tabs, die andere Leerzeichen, Windows-CRLF-Zeilenenden gegen Unix-LF, oder Whitespace am Zeilenende. Whitespace vor dem Vergleich zu normalisieren (für JSON-Payloads hilft der JSON-Formatter mit sortierten Keys) macht die echten Änderungen sichtbar.'
			},
			{
				q: 'Kann ich zwei JSON-Antworten sinnvoll diffen?',
				a: 'Ja — formatiere vorher beide durch den JSON-Formatter mit aktivierter Key-Sortierung, damit äquivalente Dokumente identisch serialisiert werden. Dann zeigt der Diff echte Wertänderungen statt Rauschen durch die Key-Reihenfolge.'
			},
			{
				q: 'Gibt es eine maximale Textgröße?',
				a: 'Der Algorithmus vergleicht jede Zeile des einen Texts mit jeder Zeile des anderen, extrem große Dateien (Zehntausende Zeilen auf beiden Seiten) können also einen Moment dauern. Typische Code-Dateien und API-Payloads werden sofort verglichen.'
			}
		]
	},

	'url-encode-decode': {
		about: [
			'Zeichen wie Leerzeichen, kaufmännische Und-Zeichen und Nicht-ASCII-Buchstaben dürfen nicht roh in einer URL stehen, also werden sie prozentkodiert: aus einem Leerzeichen wird %20, aus 你 wird %E4%BD%A0. Dieses Tool kodiert Text für die sichere Einbettung in URLs und dekodiert prozent-escapte Strings zurück in lesbaren Text, inklusive der +-Konvention für Leerzeichen in Query-Strings.',
			'Es gibt zwei Kodier-Modi, weil JavaScript selbst zwei hat: Der Komponenten-Modus (encodeURIComponent) escapet alles, was eine URL strukturieren könnte — genau richtig für einen einzelnen Query-String-Wert; der Voll-URI-Modus (encodeURI) erhält Strukturzeichen wie /, ? und &, wenn du eine komplette URL kodierst, die navigierbar bleiben muss.',
			'Beim Dekodieren wird bei fehlerhaften %-Sequenzen streng geprüft — ein einzelnes % oder %ZZ wird als Fehler gemeldet statt stillschweigend durchgereicht, exakt so, wie Browser und Server damit umgehen.'
		],
		faqs: [
			{
				q: 'Wann nehme ich den Komponenten-Modus und wann den Voll-URI-Modus?',
				a: 'Beim Kodieren eines Werts, der in eine URL eingebettet wird (eine Suchanfrage, ein Redirect-Ziel, eine E-Mail-Adresse in einem Parameter) → Komponenten-Modus, damit & und = im Wert den Query-String nicht zerlegen. Beim Kodieren einer kompletten URL für Anzeige oder Transport → Voll-URI-Modus, damit die URL-Struktur erhalten bleibt.'
			},
			{
				q: 'Warum bedeutet + manchmal ein Leerzeichen?',
				a: 'Das Format application/x-www-form-urlencoded — genutzt von HTML-Formular-Submits und Query-Strings — kodiert Leerzeichen historisch als +. In URL-Pfaden ist + einfach ein Plus. Der Decoder hier behandelt + als Leerzeichen, passend zur Query-String-Semantik; %20 funktioniert immer und überall.'
			},
			{
				q: 'Warum ist mein String doppelt kodiert (%2520)?',
				a: '%25 ist die Kodierung von % selbst, %2520 bedeutet also, dass der Text %20 ein zweites Mal kodiert wurde. Das passiert, wenn zwei Schichten eines Systems jeweils kodieren. Dekodiere hier zweimal, um es auszupacken, und repariere dann die Schicht, die nicht kodieren sollte.'
			},
			{
				q: 'Werden Unicode-Zeichen korrekt behandelt?',
				a: 'Ja — Text wird zuerst als UTF-8 kodiert und jedes Byte prozent-escapet, gemäß dem WHATWG-URL-Standard. Deshalb wird aus einem CJK-Zeichen drei %XX-Gruppen.'
			}
		]
	},

	'url-parser': {
		about: [
			'Füge eine URL ein und sieh sie seziert: Protokoll, Host, Port, Pfad, Fragment und jeder Query-Parameter als dekodierte Key-Value-Tabelle. Verwendet wird derselbe WHATWG-URL-Parser, den dein Browser für die Navigation nutzt — die Interpretation, die du siehst, ist also die, die ein Browser tatsächlich anwendet, inklusive Sonderfällen wie dem Weglassen von Standard-Ports und der Normalisierung von Pfaden.',
			'Die Query-Parameter-Tabelle ist der Teil, den du am häufigsten brauchst: Lange OAuth-Redirects, Analytics-getaggte Links und API-Aufrufe werden auf einen Blick lesbar, jeder Wert bereits prozent-dekodiert. Nackte Domains ohne Schema werden ebenfalls akzeptiert; fürs Parsen wird https:// angenommen.',
			'Der Parser ergänzt sich natürlich mit dem URL-Encoder — parse hier eine URL, um den benötigten Parameter zu finden, ändere den Wert und kodiere ihn dort neu.'
		],
		faqs: [
			{
				q: 'Warum unterscheidet sich die geparste URL leicht von meiner Eingabe?',
				a: 'Der WHATWG-Parser normalisiert: Er schreibt Schema und Host klein, entfernt Standard-Ports (:443 für https), löst ./- und ../-Pfadsegmente auf und kodiert Zeichen, die es brauchen. Was du siehst, ist die kanonische Form, auf die sich Server und Browser einigen.'
			},
			{
				q: 'Kommt der Parser mit URLs mit doppelten Query-Keys klar?',
				a: 'Ja — jedes Vorkommen wird als eigene Zeile gelistet, in Reihenfolge. Doppelte Keys sind legal und verbreitet: Viele APIs lesen sie als Arrays (?tag=a&tag=b).'
			},
			{
				q: 'Was ist der Unterschied zwischen host und hostname?',
				a: 'hostname ist nur die Domain (example.com); host enthält zusätzlich einen expliziten Nicht-Standard-Port (example.com:8080). Ist der Port der Standard des Schemas, sehen beide gleich aus, weil der Port weggelassen wird.'
			},
			{
				q: 'Wird das Fragment (#...) an den Server gesendet?',
				a: 'Nein. Alles nach # bleibt im Browser — Server sehen es nie. Deshalb haben Single-Page-Apps es historisch für clientseitiges Routing genutzt, und deshalb sind Analytics-Parameter hinter # für das Backend unsichtbar.'
			}
		]
	},

	'uuid-generator': {
		about: [
			'Generiere universell eindeutige Bezeichner in vier Varianten: UUID v4 (vollständig zufällig, der Alltagsstandard), UUID v7 (zeitlich sortierbar, die moderne Wahl für Datenbank-Keys), ULID (zeitlich sortierbar mit kompakter Crockford-Base32-Schreibweise) und Nano ID (kurz, URL-freundlich). Erzeuge eine oder bis zu tausend auf einmal — eine pro Zeile, bereit zum Einfügen in ein Seed-Skript.',
			'Die Zufälligkeit stammt aus der Web Crypto API (crypto.getRandomValues), der kryptografisch sicheren Quelle, nicht aus Math.random. Die Generierung läuft lokal — die IDs kennt also niemand sonst, sie werden nirgends geloggt und sind offline verfügbar.',
			'Falls du ein ID-Format für ein neues System wählst: v7 und ULID sortieren nach Erstellungszeit, was B-Tree-Indizes glücklich macht und IDs in Logs grob chronologisch hält; v4 verrät nichts über den Erstellungszeitpunkt — gelegentlich genau das, was du willst.'
		],
		faqs: [
			{
				q: 'Was ist der Unterschied zwischen UUID v4 und v7?',
				a: 'v4 sind 122 Zufallsbits. v7 (RFC 9562) beginnt mit einem 48-Bit-Unix-Millisekunden-Timestamp, gefolgt von Zufallsbits — später generierte IDs sortieren also später. Für Datenbank-Primärschlüssel verbessert v7 typischerweise Insert-Lokalität und Indexgröße; v4 bleibt gut, wo Reihenfolge egal ist oder Timing nicht durchsickern darf.'
			},
			{
				q: 'Können zwei generierte UUIDs kollidieren?',
				a: 'Mit 122 Zufallsbits ist die Wahrscheinlichkeit so winzig, dass sich Engineering dagegen nicht lohnt: Du müsstest über Jahrzehnte Milliarden IDs pro Sekunde erzeugen, um auch nur eine entfernte Chance zu erreichen. Kollisionen in der Praxis kommen von Bugs (wiederverwendeter Seed, kopierte Zeilen), nicht vom Zufall.'
			},
			{
				q: 'Warum ULID statt UUID v7 wählen?',
				a: 'Sie lösen dasselbe Problem. ULID besteht aus 26 Zeichen groß-/kleinschreibungsunabhängigem Crockford Base32 — kürzer und sauberer in URLs und Logs — während v7 die standardmäßige 36-Zeichen-UUID-Form behält, die jede Datenbank und Library bereits akzeptiert. Nimm, was dein Ökosystem nativer verarbeitet.'
			},
			{
				q: 'Sind diese IDs als Secrets oder Tokens sicher?',
				a: 'Die Zufälligkeit ist kryptografisch sicher, aber IDs werden üblicherweise angezeigt, geloggt und indiziert — also als öffentlich behandelt. Für Session-Tokens oder API-Keys generiere ein dediziertes Secret mit mindestens 128 Zufallsbits und behandle es wie ein Passwort.'
			}
		]
	},

	'hash-generator': {
		about: [
			'Berechne MD5-, SHA-1-, SHA-256-, SHA-384- und SHA-512-Digests beliebigen Texts, plus HMAC-Signaturen mit Schlüssel — direkt im Browser. Die SHA-Familie und HMAC nutzen die Web Crypto API, dieselben auditierten Primitiven, die dein Browser für TLS verwendet, während MD5 (das Web Crypto bewusst weglässt) als kleine lokale Implementierung für Legacy-Checksummen mitgeliefert wird.',
			'Hashes aktualisieren sich live beim Tippen, und jeder Algorithmus wird gleichzeitig berechnet — einen Wert gegen eine Checksumme zu vergleichen, egal welchen Algorithmus eine Download-Seite gewählt hat, braucht also keine Konfiguration. Der HMAC-Modus fügt ein Feld für den Secret Key hinzu, um Webhook-Signaturen zu prüfen — GitHub, Stripe und die meisten Webhook-Anbieter signieren Payloads mit HMAC-SHA256.',
			'Da die Eingabe die Seite nie verlässt, kannst du gefahrlos Dinge hashen, die du keinem Online-Dienst geben könntest: API-Payloads, Passwörter, die du gegen eine Liste geleakter Hashes prüfst, interne Dokumente.'
		],
		faqs: [
			{
				q: 'Welchen Hash-Algorithmus sollte ich verwenden?',
				a: 'Für alles Sicherheitsrelevante heute: SHA-256 oder stärker. MD5 und SHA-1 sind bei der Kollisionsresistenz gebrochen — zwei verschiedene Eingaben mit demselben Digest lassen sich konstruieren — sie überleben nur noch für nicht-adversariale Checksummen und Legacy-Protokollkompatibilität.'
			},
			{
				q: 'Warum wird MD5 überhaupt noch angeboten?',
				a: 'Weil es dir noch begegnet: ETags, Cache-Keys, Datei-Manifeste, alte Datenbankspalten. Solche Werte zu verifizieren erfordert MD5 zu berechnen, unabhängig von seinem kryptografischen Status. Nur nichts Neues darauf aufbauen.'
			},
			{
				q: 'Was ist HMAC und wie unterscheidet es sich von einem einfachen Hash?',
				a: 'HMAC mischt einen geheimen Schlüssel ins Hashing, sodass nur Schlüsselinhaber den Digest erzeugen oder verifizieren können. Ein einfacher Hash beweist Integrität („diese Daten sind unverändert“); ein HMAC beweist zusätzlich Authentizität („jemand mit dem Schlüssel hat das erzeugt“). Der Alltagsfall ist die Verifikation von Webhook-Signaturen.'
			},
			{
				q: 'Ist Hashen dasselbe wie ein Passwort verschlüsseln?',
				a: 'Nein — und schnelle Hashes wie SHA-256 sind das falsche Werkzeug zum Speichern von Passwörtern: Angreifer können Milliarden pro Sekunde durchprobieren. Passwortspeicherung braucht einen bewusst langsamen, gesalzenen Algorithmus: bcrypt, scrypt oder Argon2.'
			}
		]
	},

	'case-converter': {
		about: [
			'Bezeichner wandern ständig zwischen Konventionen: Die API liefert snake_case, dein TypeScript will camelCase, die CSS-Klasse braucht kebab-case und die Umgebungsvariable verlangt CONSTANT_CASE. Dieser Konverter nimmt beliebig gemischte Eingaben — Leerzeichen, Unterstriche, Bindestriche, vorhandenes camelCase — zerlegt sie intelligent in Wörter und setzt sie in neun Zielstilen gleichzeitig wieder zusammen.',
			'Der Splitter versteht die kniffligen Fälle: Er zerlegt „getUserByID“ in get/user/by/id (und hält das Akronym bis zur Grenze zusammen), behandelt Ziffern als Teil ihres Worts und verarbeitet jede Zeile unabhängig — du kannst also eine ganze Spalte Datenbankfelder einfügen und in einem Rutsch konvertieren.',
			'Alle Stile werden gleichzeitig angezeigt, mit Kopieren-Button pro Zeile — kein Modus-Auswählen vorab, einfach einfügen und den passenden nehmen.'
		],
		faqs: [
			{
				q: 'Wie werden Akronyme wie „HTTPResponse“ behandelt?',
				a: 'Eine Folge von Großbuchstaben gefolgt von einem Kleinbuchstaben wird vor dem letzten Großbuchstaben getrennt: HTTPResponse → http + response. Das entspricht dem, wie die meisten Style-Guides Akronyme tokenisieren — auch wenn kein Splitter die Absicht perfekt erraten kann: Grenzfälle wie „IOError“ werden zu io + error.'
			},
			{
				q: 'Kann ich viele Bezeichner auf einmal konvertieren?',
				a: 'Ja — jede Zeile wird unabhängig konvertiert. Füge eine Liste von Spaltennamen ein, einen pro Zeile, und die Ausgabe erhält die Zeilenstruktur im neuen Stil.'
			},
			{
				q: 'Was ist hier der Unterschied zwischen Title Case und Sentence case?',
				a: 'Title Case schreibt jedes Wort groß („User Account Id“); Sentence case nur das erste („User account id“). Keiner der beiden wendet redaktionelle Regeln für Artikel und Präpositionen an — für Bezeichner willst du die praktisch nie.'
			},
			{
				q: 'Warum stellt Hin- und Herkonvertieren nicht immer mein Original wieder her?',
				a: 'Das Zerlegen in Wörter verwirft Information — „user_ID_2“ und „userId2“ tokenisieren identisch. Konvertierungen sind vorwärts deterministisch, aber die ursprüngliche Schreibweise der Wortgrenzen lässt sich nicht immer rückwärts rekonstruieren.'
			}
		]
	},

	'word-counter': {
		about: [
			'Ein Live-Wort- und Zeichenzähler mit den Zahlen, die Entwickler und Schreibende wirklich brauchen: Wörter, Zeichen mit und ohne Leerzeichen, UTF-8-Bytes (was deine Datenbankspalte oder dein API-Limit tatsächlich misst), Zeilen, Sätze, Absätze und eine geschätzte Lesezeit bei typischen 220 Wörtern pro Minute.',
			'Zeichen werden als Unicode-Codepoints gezählt, nicht als UTF-16-Einheiten — Emoji und CJK-Text zählen also so, wie ein Mensch es erwarten würde. Die separate Byte-Zählung macht den Unterschied sichtbar: 日本語 sind 3 Zeichen, aber 9 Bytes. Genau diese Unterscheidung beißt, wenn eine VARCHAR(255)-Spalte einen String mit 200 „Zeichen“ ablehnt.',
			'Alles aktualisiert sich beim Tippen, ohne dass irgendetwas gesendet wird — sicher zum Zählen von Entwürfen für Ankündigungen, Verträge oder alles andere, das noch nicht für die Welt bestimmt ist.'
		],
		faqs: [
			{
				q: 'Warum unterscheiden sich Zeichen- und Byte-Anzahl?',
				a: 'Zeichen sind Unicode-Codepoints; Bytes sind deren UTF-8-Kodierung. ASCII-Buchstaben sind je 1 Byte, die meisten europäischen Buchstaben mit Akzent 2, CJK-Zeichen 3 und Emoji 4 (oder mehr in Sequenzen). Datenbank-Limits, HTTP-Header und viele APIs messen Bytes, nicht Zeichen.'
			},
			{
				q: 'Wie werden Wörter in Sprachen ohne Leerzeichen gezählt?',
				a: 'Die Wortzählung trennt an Whitespace, was unsegmentierten Text auf Chinesisch oder Japanisch unterzählt. Für diese Sprachen ist die Zeichenzahl die aussagekräftigere Metrik — deshalb werden immer beide angezeigt.'
			},
			{
				q: 'Was zählt als Satz?',
				a: 'Eine Textfolge, die mit ., !, ? oder … endet, gefolgt von Whitespace oder dem Ende der Eingabe. Abkürzungen wie „z. B.“ können die Zählung leicht aufblähen — Satzzählung ist von Natur aus heuristisch.'
			},
			{
				q: 'Wie genau ist die Lesezeit?',
				a: 'Sie teilt die Wortzahl durch 220 wpm, einen gängigen Durchschnitt für stilles Lesen allgemeiner Prosa durch Erwachsene. Technisches Material mit Code liest sich langsamer, überfliegbare Listen schneller. Betrachte sie als Schätzung der Größenordnung.'
			}
		]
	},

	'lorem-ipsum-generator': {
		about: [
			'Platzhaltertext für Layouts, Mockups und Seed-Daten, generiert in deinem Browser: Wörter, Sätze oder Absätze wählen, Anzahl festlegen, kopieren. Die Ausgabe schöpft aus dem klassischen verwürfelten Cicero-Vokabular und sieht daher nach natürlicher lateinisch anmutender Prosa aus, ohne ablenkende lesbare Sätze zu bilden.',
			'Standardmäßig beginnt der Text mit dem traditionellen „Lorem ipsum dolor sit amet“ — der Phrase, die Designer und Reviewer sofort als Platzhalter erkennen — und du kannst das für komplett zufällige Ausgabe abschalten, wenn du mehrere unterscheidbare Blöcke brauchst.',
			'Satzlängen und Absatzgrößen variieren zufällig in realistischen Bereichen, sodass der Text den visuellen Rhythmus echter Texte hat — wichtig, wenn du Typografie oder Zeilenumbruch beurteilst, wo gleichförmige Sätze künstlich wirken.'
		],
		faqs: [
			{
				q: 'Woher stammt Lorem Ipsum?',
				a: 'Es sind verwürfelte Fragmente aus Ciceros „De finibus bonorum et malorum“ (45 v. Chr.), von Schriftsetzern mindestens seit den 1960ern als Fülltext verwendet und durch Letraset-Bögen und später Desktop-Publishing-Software populär geworden.'
			},
			{
				q: 'Warum Lorem Ipsum statt echtem Text?',
				a: 'Lesbarer Inhalt kapert die Aufmerksamkeit — Reviewer fangen an, die Wörter zu redigieren, statt das Layout zu beurteilen. Pseudo-Latein hat natürliche Buchstabenhäufigkeiten und Wortlängen, ohne lesbar zu sein — der Fokus bleibt auf dem Design.'
			},
			{
				q: 'Ist der generierte Text immer derselbe?',
				a: 'Nein — die Wörter werden jedes Mal zufällig gezogen, zwei Generierungen unterscheiden sich also. Nur die optionale klassische Eröffnungsphrase ist fix.'
			},
			{
				q: 'Kann ich eine bestimmte Wortzahl für ein CMS-Feldlimit generieren?',
				a: 'Ja — stelle die Einheit auf Wörter und die Anzahl auf genau das, was du brauchst, bis zu 1000 auf einmal. Kombiniere es mit dem Wortzähler-Tool, um Zeichen- oder Byte-Limits zu prüfen.'
			}
		]
	},

	'slug-generator': {
		about: [
			'Verwandle jeden Titel in einen URL-tauglichen Slug: kleingeschrieben, mit Bindestrichen getrennt, von Interpunktion befreit, mit in reines ASCII transliterierten Akzenten — aus „Crème brûlée à Paris“ wird „creme-brulee-a-paris“. Optionen decken die gängigen Varianten ab: Unterstrich-Trenner, erhaltene Groß-/Kleinschreibung und eine Maximallänge, die an einer Wortgrenze schneidet statt mitten im Wort.',
			'Slugs sind für Menschen und Suchmaschinen gleichermaßen wichtig: Sie sind in der Adresszeile lesbar, überstehen das Kopieren in Chats ohne Prozent-Escaping und geben Suchergebnissen eine URL mit Keywords. Der Transliterationsschritt ist das, was die meisten selbstgebauten Slugify-Funktionen auslassen — ohne ihn machen Titel mit Akzenten URLs kaputt oder verschwinden ganz.',
			'Jede Zeile wird unabhängig slugifiziert — eine eingefügte Liste von Artikeltiteln wird in einem Durchgang zu einer passenden Liste von Slugs.'
		],
		faqs: [
			{
				q: 'Warum Bindestriche statt Unterstriche?',
				a: 'Suchmaschinen behandeln Bindestriche als Worttrenner, Unterstriche historisch aber als Wortverbinder, und Bindestriche sind in unterstrichenem Linktext optisch klarer. Unterstriche bleiben für Dateinamen und Bezeichner beliebt, deshalb werden beide angeboten.'
			},
			{
				q: 'Was passiert mit nicht-lateinischen Schriften wie Chinesisch oder Kyrillisch?',
				a: 'Zeichen mit ASCII-Entsprechung (akzentuiertes Latein, ein paar Sonderbuchstaben wie ß → ss) werden transliteriert; Schriften ohne einfache lateinische Zuordnung werden entfernt. Für nicht-lateinische Inhalte ist gängige Praxis, entweder die native Schrift prozentkodiert in der URL zu behalten oder einen manuell romanisierten Slug zu schreiben.'
			},
			{
				q: 'Gibt es eine ideale Slug-Länge?',
				a: 'Kürzer ist besser fürs Teilen und Anzeigen, aber es gibt keine Ranking-Klippe. Die Maximallängen-Option schneidet an einer Wortgrenze ab — nützlich für CMSe, die Slug-Spalten auf 50–80 Zeichen begrenzen.'
			},
			{
				q: 'Sollte sich der Slug ändern, wenn sich der Titel ändert?',
				a: 'Nach der Veröffentlichung idealerweise nicht — die URL ist eine Adresse, auf die andere verlinkt haben. Die meisten Sites behalten den ursprünglichen Slug oder legen einen Redirect an. Generiere Slugs beim Erstellen und behandle Umbenennungen als bewusste Redirect-Entscheidung.'
			}
		]
	},

	'sort-lines': {
		about: [
			'Eine Werkbank für Zeilenverarbeitung: Füge eine beliebige Liste ein und sortiere sie alphabetisch, rückwärts, natürlich (item2 vor item10) oder nach Länge — oder mische sie zufällig — und optional dazu: Whitespace trimmen, Leerzeilen entfernen und Duplikate löschen, mit erhaltener Reihenfolge. Die Anzahl entfernter Zeilen wird gemeldet, du siehst also genau, was die Deduplizierung getan hat.',
			'Die natürliche Sortierung ist die Option, zu der du am häufigsten greifen wirst: Rein alphabetische Sortierung stellt „item10“ vor „item2“, weil sie Zeichen für Zeichen vergleicht, während natürliche Sortierung eingebettete Zahlen numerisch vergleicht — die Reihenfolge, die Menschen bei Dateinamen, Versionen und IDs erwarten.',
			'Die Deduplizierung behält das erste Vorkommen und erhält die ursprüngliche Reihenfolge der Überlebenden — wichtig, wenn die Listenreihenfolge Bedeutung hat (Imports, Config-Zeilen, Playlists). Ein Modus ohne Beachtung der Groß-/Kleinschreibung behandelt „Apple“ und „apple“ als dieselbe Zeile.'
		],
		faqs: [
			{
				q: 'Was ist der Unterschied zwischen alphabetischer und natürlicher Sortierung?',
				a: 'Alphabetisch vergleicht Zeichencodes, also gilt „file10“ < „file2“ (weil an Position 5 „1“ < „2“ ist). Natürliche Sortierung erkennt Ziffernfolgen und vergleicht sie als Zahlen: file2 < file10. Nimm natürlich für alles, was Zahlen enthält.'
			},
			{
				q: 'Behält die Deduplizierung das erste oder letzte Vorkommen?',
				a: 'Das erste. Zeilen werden von oben nach unten durchlaufen, und eine Zeile fällt nur weg, wenn eine identische (oder im Modus ohne Groß-/Kleinschreibung eine gleichlautende) bereits vorkam — die überlebende Reihenfolge entspricht also dem Original.'
			},
			{
				q: 'Wie große Listen verkraftet das Tool?',
				a: 'Hunderttausende Zeilen sind kein Problem — die Operationen sind einfache Durchläufe und eine Sortierung. Alles bleibt im Browser-Speicher, die praktische Grenze ist also dein Rechner, keine Server-Quote.'
			},
			{
				q: 'Kann ich Operationen kombinieren?',
				a: 'Ja, und sie greifen in sinnvoller Reihenfolge: erst trimmen, dann Leerzeilen entfernen, dann deduplizieren, dann sortieren — „ apple “ und „apple“ deduplizieren also gemeinsam, wenn Trimmen an ist, und die Sortierung sieht immer die bereinigte Liste.'
			}
		]
	},

	'html-entities': {
		about: [
			'Escape Text für die sichere Einbettung in HTML — aus & wird &amp;amp;, aus < wird &amp;lt; — oder dekodiere entity-gespickten Text zurück in lesbare Zeichen, inklusive benannter Entities (&amp;rarr;), dezimaler (&amp;#169;) und hexadezimaler (&amp;#xA9;) numerischer Referenzen.',
			'Beim Kodieren gibt es zwei Stufen: die fünf essenziellen Zeichen, die die HTML-Struktur brechen (&amp; &lt; &gt; " \') — mehr braucht es für Korrektheit nicht — oder alles Nicht-ASCII, nützlich, wenn irgendwo zwischen dir und der Seite eine Toolchain UTF-8 verstümmelt. Ein Nur-numerisch-Modus lässt benannte Entities weg, für maximale Kompatibilität mit strikten XML-Parsern, die nur die fünf vordefinierten garantieren.',
			'Der Decoder ist die Alltagsseite: Füge ein gescraptes Snippet oder eine API-Antwort voller &amp;#x27; ein und erhalte sauberen Text. Unbekannte Entity-Namen werden unverändert durchgereicht statt geraten.'
		],
		faqs: [
			{
				q: 'Welche Zeichen müssen in HTML escaped werden?',
				a: 'In Textinhalten: & und <. In Attributwerten: zusätzlich das Anführungszeichen, das das Attribut begrenzt (" oder \'). > zu escapen ist üblich, aber nicht zwingend nötig. Alles andere darf in einem UTF-8-Dokument wörtlich stehen.'
			},
			{
				q: 'Ist Entity-Kodierung ein Schutz gegen XSS?',
				a: 'Das Escapen der fünf Strukturzeichen ist der Kern des Output-Encodings im HTML-Kontext, ja — aber nur für HTML-Text- und Attribut-Kontexte. URLs, JavaScript-Strings und CSS brauchen ihre eigenen kontextspezifischen Kodierungen; Entity-Escaping allein macht beliebige Injection dort nicht sicher.'
			},
			{
				q: 'Benannte oder numerische Entities — welche sollte ich ausgeben?',
				a: 'Numerische Referenzen (&amp;#xE9;) funktionieren in jedem HTML- und XML-Parser. Benannte Entities sind lesbarer, aber XML definiert nur fünf vor — &amp;eacute; bricht also eine strikte XML/XHTML-Pipeline. Im Zweifel: numerisch.'
			},
			{
				q: 'Warum sehe ich &amp;amp;#39; (doppelt kodiert) in meinen Daten?',
				a: 'Zwei Schichten haben je einmal kodiert: Das &amp; der ersten Kodierung wurde von einem zweiten Durchlauf selbst escaped. Dekodiere hier zweimal, um den Text wiederherzustellen, und finde und repariere dann die Schicht, die nicht kodieren sollte.'
			}
		]
	},

	'unicode-inspector': {
		about: [
			'Füge beliebigen Text ein und sieh jedes Zeichen seziert: Codepoint (U+XXXX), UTF-8-Bytes, UTF-16-Einheiten, JavaScript-Escape-Sequenz, HTML-Entity und allgemeine Kategorie — plus Summen für Codepoints, UTF-16-Einheiten, UTF-8-Bytes und wahrgenommene Zeichen (Graphem-Cluster).',
			'Das ist das Tool für „Warum ist dieser String so seltsam?“-Momente: Unsichtbare Zeichen (Zero-Width-Spaces, BOMs, Richtungsmarken) tauchen als sichtbare Zeilen auf; verwechselbare Zeichen (kyrillisches а vs. lateinisches a) offenbaren unterschiedliche Codepoints; und ein Emoji, das „ein Zeichen ist“, entpuppt sich als sieben Codepoints, verbunden durch Zero-Width-Joiners.',
			'Die vier verschiedenen Längensummen beantworten die ewige Frage, warum JavaScripts .length, ein Datenbank-Byte-Limit und das, was der Nutzer sieht, sich über die Länge eines Strings uneins sind.'
		],
		faqs: [
			{
				q: 'Warum ist "🎉".length === 2 in JavaScript?',
				a: 'JavaScript-Strings zählen UTF-16-Code-Units. Zeichen jenseits von U+FFFF — darunter die meisten Emoji — brauchen ein Surrogatpaar, also zwei Einheiten. Der Inspector zeigt beide Einheiten und den echten Codepoint, und die Zusammenfassung zählt sie getrennt.'
			},
			{
				q: 'Was ist ein Graphem-Cluster?',
				a: 'Das, was ein Leser als ein Zeichen wahrnimmt. é kann zwei Codepoints sein (e + kombinierender Akzent), und Familien-Emoji können sieben oder mehr sein, verbunden durch Zero-Width-Joiners. Die Graphem-Zählung nutzt den Intl.Segmenter des Browsers — das Nächste an „Zeichen, wie Nutzer sie sehen“.'
			},
			{
				q: 'Wie finde ich unsichtbare Zeichen in einem String?',
				a: 'Füge ihn hier ein — jeder Codepoint bekommt eine Zeile, inklusive Zero-Width-Spaces (U+200B), geschützter Leerzeichen (U+00A0), BOMs (U+FEFF) und Richtungsmarken, jeweils mit Kategorie beschriftet. Das sind die klassischen Übeltäter hinter „identischen“ Strings, die Gleichheitsprüfungen nicht bestehen.'
			},
			{
				q: 'Was sagen mir die UTF-8-Bytesequenzen?',
				a: 'Genau das, was gespeichert oder übertragen wird: ASCII ist ein Byte, die meisten lateinischen Erweiterungen zwei, CJK drei, Emoji vier. Schneidet ein System mitten in einer Sequenz ab, bekommst du Ersetzungszeichen (�) — die Byte-Ansicht zeigt, wo solche Schnitte landen würden.'
			}
		]
	},

	'cron-parser': {
		about: [
			'Füge einen fünfteiligen Cron-Ausdruck ein und erhalte eine Erklärung in Klartext, mit einer Aufschlüsselung Feld für Feld und — dem Teil, der echte Fehler abfängt — den nächsten fünf tatsächlichen Ausführungszeiten in deiner lokalen Zeitzone. „0 3 * * 1“ liest sich zurück als „Um 03:00, montags“, gefolgt von den konkreten Terminen, an denen der Job feuert.',
			'Der Parser unterstützt die volle Standardsyntax: Listen (1,15), Bereiche (9-17), Schritte (*/15), Monats- und Wochentagsnamen (jan, mon), 7 als Sonntag und die Makrofamilie @daily/@hourly. Er implementiert auch die Regel, die jeder vergisst: Sind sowohl Tag-des-Monats als auch Wochentag eingeschränkt, läuft der Job, wenn eines von beiden passt — nicht beide.',
			'Sechsteilige Ausdrücke (Quartz, mit Sekunden) werden erkannt und explizit gemeldet statt still falsch geparst — die häufigste Quelle der „mein Cron ist kaputt“-Verwirrung beim Wechsel zwischen Java-Schedulern und Unix-Crontab.'
		],
		faqs: [
			{
				q: 'Was sind die fünf Felder, in welcher Reihenfolge?',
				a: 'Minute (0–59), Stunde (0–23), Tag des Monats (1–31), Monat (1–12), Wochentag (0–6, Sonntag = 0, wobei 7 ebenfalls als Sonntag akzeptiert wird). Sich die Reihenfolge zu merken ist der ewige Kampf — das Aufschlüsselungs-Panel beschriftet jedes Feld deines Ausdrucks.'
			},
			{
				q: 'Warum läuft „0 0 1 * 1“ öfter als erwartet?',
				a: 'Weil sowohl Tag-des-Monats (der 1.) als auch Wochentag (Montag) eingeschränkt sind, führt Cron den Job aus, wenn EINES von beiden passt — an jedem 1. des Monats UND an jedem Montag. Für „der 1. nur, wenn er ein Montag ist“ brauchst du eine Datumsprüfung im Skript.'
			},
			{
				q: 'Welche Zeitzone verwenden die nächsten Ausführungszeiten?',
				a: 'Die lokale Zeitzone deines Browsers, die neben den Ergebnissen angezeigt wird. Echte Crontabs laufen in der Zeitzone des Servers (oder mit der TZ=-Zeile mancher Crons) — prüfe immer, was die Zielmaschine nutzt, besonders über Zeitumstellungen hinweg.'
			},
			{
				q: 'Unterstützt das Tool Sekunden oder Jahre?',
				a: 'Nein — das sind Quartz-Erweiterungen (Java) mit 6 oder 7 Feldern. Standard-Unix-Cron hat genau fünf Felder und Minutenauflösung. Sechsteilige Eingaben werden erkannt und als Quartz gemeldet statt fehlinterpretiert.'
			}
		]
	},

	'password-generator': {
		about: [
			'Generiere zufällige Passwörter mit gewählter Länge und Zeichensätzen, bei Bedarf im Bulk, mit einer ehrlichen Entropie-Berechnung — Bits an Zufälligkeit, kein dekorativer Farbbalken. Die Zufälligkeit stammt aus crypto.getRandomValues mit Rejection Sampling, jedes Zeichen wird also gleichverteilt gezogen, ohne Modulo-Bias.',
			'Jeder aktivierte Zeichensatz bekommt garantiert mindestens einen Vertreter (eine Policy, die viele Sites erzwingen), dann füllt sich der Rest des Passworts gleichverteilt und das Ganze wird gemischt — die garantierten Zeichen klumpen also nicht vorhersehbar am Anfang.',
			'Ein Filter für mehrdeutige Zeichen entfernt die Verwechselbaren (0/O, 1/l/I) für Passwörter, die je ein Mensch vorlesen oder vom Papier abtippen könnte. Da die Generierung lokal läuft, existieren die Passwörter nur auf deinem Rechner, bis du sie irgendwo ablegst.'
		],
		faqs: [
			{
				q: 'Was bedeuten die Entropie-Bits?',
				a: 'Entropie = Länge × log2(Poolgröße): die Zahl gleichwahrscheinlicher Möglichkeiten, die ein Angreifer durchsuchen muss. 64 Bit Entropie hält beiläufigen Angriffen stand; 80+ Bit sind stark gegen Offline-Cracking schneller Hashes; 100+ ist praktisch unerratbar. Ein 16-Zeichen-Passwort über Buchstaben+Ziffern+Symbole hat ~104 Bit.'
			},
			{
				q: 'Ist ein langes Kleinbuchstaben-Passwort besser als ein kurzes komplexes?',
				a: 'Oft ja — Länge multipliziert Entropie, während zusätzliche Zeichensätze nur die Basis des Logarithmus verbreitern. 20 Kleinbuchstaben (~94 Bit) schlagen 10 voll gemischte Zeichen (~65 Bit). Komplexitätsregeln existieren vor allem, um Wortlisten zu schlagen — was zufällige Generierung ohnehin tut.'
			},
			{
				q: 'Ist es sicher, Passwörter im Browser zu generieren?',
				a: 'Die Zufallsquelle (crypto.getRandomValues) ist derselbe CSPRNG, den native Passwortmanager nutzen, und diese Seite macht keine Netzwerk-Requests mit deinen Daten. Die realistischen Risiken liegen im Danach: Zwischenablage-Verlauf, Screen-Sharing und wo du es speicherst.'
			},
			{
				q: 'Warum mehrdeutige Zeichen ausschließen?',
				a: 'Bei Passwörtern, die von Menschen gelesen werden — gedruckte Wiederherstellungscodes, am Telefon durchgegeben, von einem anderen Bildschirm abgetippt — verursachen 0/O und 1/l/I echte Support-Tickets. Für rein eingefügte Passwörter behalte sie; der Entropieverlust durch den Ausschluss ist so oder so gering.'
			}
		]
	},

	'qr-code-generator': {
		about: [
			'Tippe oder füge beliebigen Text ein — eine URL, WLAN-Zugangsdaten, Kontaktinfos — und erhalte sofort einen QR-Code, gerendert als gestochen scharfes Vektor-SVG zum Herunterladen oder als PNG-Export für Chats und Slides. Kein Wasserzeichen, kein ablaufender „Free Tier“-Redirect, und weil die Generierung lokal läuft, berührt das, was du kodierst, nie einen Server.',
			'Der letzte Punkt wiegt schwerer, als es scheint: Viele kostenlose QR-Dienste leiten deine URL über ihre Redirect-Domain (um später zu kassieren oder Scans zu tracken) — der Code hört also auf zu funktionieren, wenn der Dienst es tut. Hier generierte Codes kodieren deinen Inhalt direkt und funktionieren für immer.',
			'Vier Fehlerkorrektur-Stufen tauschen Kapazität gegen Robustheit — L übersteht leichte Beschädigung, H übersteht die Verdeckung von 30 % des Symbols (nützlich, wenn ein Logo die Mitte überlagert oder der Druck klein und verschrammt sein wird).'
		],
		faqs: [
			{
				q: 'Welche Fehlerkorrektur-Stufe sollte ich wählen?',
				a: 'M (15 %) ist der vernünftige Standard. Nimm H (30 %) für klein gedruckte Codes, Codes hinter Glas oder bei Blendung, oder wenn ein Logo darübergelegt wird. Höhere Korrektur macht den Code dichter — bei sehr langen URLs am Bildschirm hält L die Module größer und leichter scanbar.'
			},
			{
				q: 'Warum ist SVG für den Druck besser als PNG?',
				a: 'SVG ist auflösungsunabhängig — der Drucker rastert mit seiner nativen DPI, die Modulkanten bleiben in jeder Größe perfekt scharf. PNG muss in einer festen Pixelgröße erzeugt werden und kann beim Skalieren verschwimmen. Nimm SVG für Druck und Design-Tools, PNG für Chats und Slides.'
			},
			{
				q: 'Wie viele Daten passen in einen QR-Code?',
				a: 'Theoretisch bis zu ~3 KB an Bytes (Version 40, Stufe L), aber so große Codes sind vom Bildschirm schwer zu scannen. Unter 300 Zeichen scannt zuverlässig; lange URLs vorher kürzen — mit dem Shortener deiner eigenen Domain, wenn Beständigkeit zählt.'
			},
			{
				q: 'Laufen diese Codes ab oder tracken sie Scans?',
				a: 'Nein. Der Inhalt wird direkt ins Muster kodiert — nichts läuft über diese Site, es gibt also nichts, das ablaufen könnte, und niemand (auch wir nicht) sieht, wann oder wo gescannt wird. Scan-Tracking erfordert zwingend einen Redirect-Dienst.'
			}
		]
	},

	'json-to-yaml': {
		about: [
			'Konvertiere zwischen JSON, YAML und TOML in jede Richtung. Das Quellformat wird beim Einfügen automatisch erkannt — Klammern deuten auf JSON, key:-Doppelpunkte auf YAML, [Tabellen] auf TOML — mit manueller Übersteuerung für mehrdeutige Eingaben. Die Konvertierung läuft über einen echten Parse-Vorgang, die Ausgabe ist also garantiert gültig, keine zeilenweise Texttransformation.',
			'Jedes Format hat echte Stärken: JSON für APIs und Maschinenaustausch, YAML für von Menschen editierte Configs (Kubernetes, CI-Pipelines), TOML für sauber typisierte Config-Dateien (Cargo, pyproject). Daten von Hand zwischen ihnen zu bewegen lädt zu Einrückungs- und Quoting-Fehlern ein, die diese Konvertierung eliminiert.',
			'Der Konverter ist ehrlich bei Formatgrenzen: TOML kennt keine Top-Level-Arrays und kein null, und beim Konvertieren solcher Dokumente wird der Grund gemeldet, statt still Daten zu verwerfen.'
		],
		faqs: [
			{
				q: 'Überleben Kommentare die Konvertierung?',
				a: 'Nein — JSON hat keine Kommentarsyntax, und die Konvertierung läuft über die geparste Datenstruktur, die keine Kommentare trägt. YAML → JSON → YAML verliert die Kommentare unwiederbringlich; behalte die Originaldatei, wenn Kommentare wichtig sind.'
			},
			{
				q: 'Warum wurde aus meinem YAML-„no“ ein false?',
				a: 'YAML 1.1 behandelt yes/no/on/off als Booleans, und der Ländercode NO wird berühmt-berüchtigt zu false. Der Parser hier folgt YAML 1.2 (nur true/false), aber Dateien für ältere Parser können trotzdem überraschen. Setze Strings in Anführungszeichen, die wie Booleans, Zahlen oder Daten aussehen.'
			},
			{
				q: 'Warum schlägt die Konvertierung meines JSON nach TOML fehl?',
				a: 'TOML verlangt eine Tabelle (Objekt) auf oberster Ebene — Arrays oder nackte Skalare können kein TOML-Dokument sein — und es kennt kein null. Strukturiere die Daten um (packe das Array unter einen Key, entferne die nulls oder gib ihnen Defaults), dann klappt die Konvertierung.'
			},
			{
				q: 'Ist YAML eine Obermenge von JSON?',
				a: 'Praktisch ja — YAML 1.2 parst praktisch alle JSON-Dokumente, weshalb JSON in eine YAML-Config einzufügen meist funktioniert. Umgekehrt gilt das nicht: YAMLs Anker, mehrzeilige Skalare und Tags haben kein JSON-Äquivalent und werden bei der Konvertierung expandiert oder zu Strings gemacht.'
			}
		]
	},

	'json-to-csv': {
		about: [
			'Füge ein Array von JSON-Objekten ein und erhalte ein tabellenfertiges CSV: Verschachtelte Objekte werden zu Spaltennamen mit Punkten flachgezogen (user.address.city), Spalten werden über alle Zeilen vereinigt (fehlende Werte werden leere Zellen), und das Quoting folgt RFC 4180 — Kommas, Anführungszeichen und Zeilenumbrüche in Werten überstehen Excel und Google Sheets.',
			'Das ist der schnellste Weg von einer API-Antwort zu einer Tabelle, die jemand filtern und pivotieren kann. Die Spaltenvereinigung zählt bei realen Daten mit heterogenen Objekten — Zeile 1 kann Felder vermissen lassen, die Zeile 40 hat, und der Konverter geht damit um, statt zu scheitern oder Daten zu verwerfen.',
			'Arrays innerhalb von Zeilen werden als JSON-Strings serialisiert statt in Spalten explodiert — eine bewusste Entscheidung, die eine Eingabezeile als eine Ausgabezeile erhält. Eine Semikolon-Trennzeichen-Option deckt Regionen ab, in denen Excel ; statt , erwartet.'
		],
		faqs: [
			{
				q: 'Wie werden verschachtelte Objekte dargestellt?',
				a: 'Flachgezogen mit durch Punkte verbundenen Keys: {"user":{"name":"Ada"}} wird zur Spalte user.name. So bleibt jeder Skalarwert in einer flachen Kopfzeile adressierbar — das, womit Tabellenkalkulationen tatsächlich arbeiten können.'
			},
			{
				q: 'Was passiert mit Arrays innerhalb einer Zeile?',
				a: 'Sie werden als JSON-Text in eine einzelne Zelle eingebettet (["a","b"]). Arrays in Spalten (tags.0, tags.1…) oder Extrazeilen zu explodieren verändert die Form deiner Daten auf meinungsstarke Weise — das Einbetten hält die Konvertierung verlustfrei und vorhersehbar.'
			},
			{
				q: 'Warum zeigt Excel mein CSV in einer einzigen Spalte?',
				a: 'Locale-Einstellungen: In weiten Teilen Europas erwartet Excel semikolongetrennte Dateien, weil das Komma das Dezimaltrennzeichen ist. Stelle die Trennzeichen-Option auf Semikolon um, oder nutze Daten → Aus Text/CSV, wo du das Trennzeichen angeben kannst.'
			},
			{
				q: 'Verarbeitet der Konverter auch ein einzelnes Objekt (kein Array)?',
				a: 'Ja — ein einzelnes Objekt wird zu einem einzeiligen CSV. Objekte mit IDs als Keys ({"a1":{...},"a2":{...}}) konvertieren allerdings als eine breite Zeile; wandle sie zuerst in ein Array um, wenn jeder Wert eine Zeile sein soll.'
			}
		]
	},

	'json-to-typescript': {
		about: [
			'Füge ein JSON-Beispiel ein — eine API-Antwort, eine Config-Datei — und erhalte ein daraus abgeleitetes TypeScript-Interface: Verschachtelte Objekte werden zu verschachtelten Typen, Arrays bekommen Elementtypen (mit Unions bei gemischtem Inhalt), und Keys, die keine gültigen Bezeichner sind, werden sauber in Anführungszeichen gesetzt.',
			'Generierte Typen sind ein Ausgangspunkt, kein Vertrag: Die Inferenz sieht nur ein Beispiel — ein Feld, das in deinem Beispiel zufällig null ist, wird als null typisiert, und optionale Felder, die fehlten, kennt sie schlicht nicht. Die Ausgabe ist bewusst schlicht — keine Decorators, keine Laufzeitvalidierung — du kannst sie also überall einfügen und verfeinern.',
			'Für Felder, die zwischen Requests variieren, jage ein zweites Beispiel durch und merge von Hand — oder steige auf Schema-first-Tooling um (OpenAPI, zod), sobald sich die Form stabilisiert. Für den täglichen „Ich brauche nur schnell einen Typ für diese Response“-Moment reicht ein einziges Einfügen.'
		],
		faqs: [
			{
				q: 'Warum wird mein nullable Feld nur als null typisiert?',
				a: 'Die Inferenz sieht nur das eingefügte Beispiel. War das Feld dort null, ist null alles, was sie wissen kann. Ändere es nach der Generierung zu string | null (oder was der echte Typ ist) — oder füge ein Beispiel ein, in dem das Feld befüllt ist.'
			},
			{
				q: 'Wie werden optionale Felder behandelt?',
				a: 'Sie werden nicht erkannt — ein einzelnes Beispiel kann „immer vorhanden“ nicht von „diesmal vorhanden“ unterscheiden. Felder, die im Beispiel fehlen, fehlen im Typ. Markiere Felder manuell als optional (name?:), wo du weißt, dass die API sie weglässt.'
			},
			{
				q: 'Was ergeben Arrays mit gemischten Typen?',
				a: 'Eine Union: [1, "a"] inferiert (number | string)[]. Leere Arrays inferieren unknown[], da es kein Element zu inspizieren gibt — ersetze das durch den echten Elementtyp, sobald du ihn kennst.'
			},
			{
				q: 'Sollte ich inferierte Typen oder eine Schema-Library wie zod verwenden?',
				a: 'Inferierte Interfaces existieren nur zur Compile-Zeit — sie validieren zur Laufzeit nichts. Für interne Tools und schnelles Typisieren sind sie perfekt; für nicht vertrauenswürdige Eingaben zur Laufzeit definiere ein zod/valibot-Schema und leite den statischen Typ daraus ab.'
			}
		]
	},

	'jsonpath-tester': {
		about: [
			'Teste JSONPath-Ausdrücke gegen dein eigenes JSON und sieh jeden Treffer mit Wert und konkretem Pfad. Unterstützt wird die Syntax für den Alltagsgebrauch: Punkt- und Klammernotation, Array-Indizes (auch negative), Wildcards, Unions ([\'a\',\'b\']) und rekursiver Abstieg ($..price).',
			'Die Pfadausgabe pro Treffer ist der stille Star: Frage $..id gegen ein tiefes Dokument ab, und jedes Ergebnis sagt dir exakt, wo es liegt ($.data.items[3].id), bereit zum Einfügen in Code. Aus „irgendwo in diesem Blob“ wird eine exakte Adresse.',
			'Filterausdrücke ([?(@.price < 10)]) sind noch nicht implementiert — das Tool sagt das ausdrücklich, statt falsche Ergebnisse zu liefern. Für strukturelle Extraktion, den Großteil der JSONPath-Nutzung, funktioniert alles.'
		],
		faqs: [
			{
				q: 'Was ist der Unterschied zwischen $.a.b und $..b?',
				a: '$.a.b folgt genau einer Route: Key a an der Wurzel, dann Key b darin. $..b (rekursiver Abstieg) findet jedes b irgendwo im Dokument, in beliebiger Tiefe. Rekursiver Abstieg ist mächtig, kann aber überraschen — er matcht auch b-Keys in Dingen, an die du nicht gedacht hast.'
			},
			{
				q: 'Wie greife ich auf Keys mit Leerzeichen oder Bindestrichen zu?',
				a: 'Klammernotation mit Anführungszeichen: $[\'my key\'] oder $.data[\'content-type\']. Die Punktnotation funktioniert nur für Keys, die gültige bezeichnerartige Namen sind.'
			},
			{
				q: 'Funktionieren negative Array-Indizes?',
				a: 'Ja — [-1] ist das letzte Element, [-2] das vorletzte, nach der von Python popularisierten und von RFC 9535 übernommenen Konvention. [0] bleibt das erste Element.'
			},
			{
				q: 'Ist JSONPath standardisiert?',
				a: 'Seit 2024 ja — RFC 9535 definiert Syntax und Semantik. Davor geschriebene Implementierungen unterscheiden sich in Randfällen (besonders bei Filtern und Unions) — derselbe Ausdruck kann sich also je nach Library anders verhalten; teste gegen die Implementierung, mit der du deployst.'
			}
		]
	},

	'bcrypt-generator': {
		about: [
			'Hashe ein Passwort mit bcrypt bei wählbarem Cost-Faktor, oder verifiziere einen Klartext gegen einen vorhandenen Hash — beides vollständig im Browser, was genau das Richtige ist, wenn das Testobjekt ein Passwort ist. Ein Hash-Inspector zerlegt außerdem jeden bcrypt-Hash in Version, Cost und Salt.',
			'Bcrypt bleibt eine solide Wahl für Passwortspeicherung, weil es absichtlich langsam und pro Passwort gesalzen ist: Der Cost-Faktor verdoppelt die Arbeit mit jedem Inkrement, Cost 12 bedeutet also 4096 Iterationen des zugrunde liegenden Cipher-Setups. Die Zeitmessung zeigt, wie lange dein gewählter Cost dauert — der Trade-off zwischen Sicherheit und Latenz wird damit konkret.',
			'Verifikation ist der häufigere Alltagsbedarf: bestätigen, dass ein Hash in einer Datenbank zu einem bekannten Passwort passt, ohne App-Code hochzufahren. Beides einfügen, Ja oder Nein bekommen.'
		],
		faqs: [
			{
				q: 'Welchen Cost-Faktor sollte ich in Produktion verwenden?',
				a: 'Die klassische Faustregel: so hoch, wie es dein Login-Latenzbudget erlaubt, heute üblicherweise 10–13. Ziele auf 100–300 ms pro Hash auf deiner Produktionshardware. Browser-JavaScript läuft langsamer als nativ, die hier gezeigte Zeit ist also eine Obergrenze für deine Server.'
			},
			{
				q: 'Warum ergibt dasselbe Passwort jedes Mal einen anderen Hash?',
				a: 'Pro Hash wird ein zufälliges 16-Byte-Salt generiert und im Hash-String selbst gespeichert. Das ist Absicht — identische Passwörter bekommen unterschiedliche Hashes, was vorberechnete Rainbow Tables aushebelt. Die Verifikation liest das Salt aus dem Hash zurück, deshalb funktioniert der Vergleich.'
			},
			{
				q: 'Was bedeuten die Teile eines bcrypt-Hashes?',
				a: '$2b$12$ + 53 Zeichen: 2b ist die Algorithmusversion, 12 der Cost (2^12 Iterationen), die nächsten 22 Zeichen das Salt und die letzten 31 der Digest — alles in bcrypts eigenem Base64-Alphabet. Der Inspector unter dem Tool zerlegt jeden Hash auf diese Weise.'
			},
			{
				q: 'Wird bcrypt noch gegenüber Argon2 empfohlen?',
				a: 'Argon2id ist die aktuelle erste Wahl für neue Systeme (Memory-Hardness widersteht GPU-Cracking). Bcrypt bleibt akzeptabel und allgegenwärtig — der praktische Rat: Migriere funktionierende bcrypt-Speicherung nicht in Panik, aber wähle Argon2id für Neuentwicklungen. Beide liegen Welten über schnellen Hashes wie SHA-256.'
			}
		]
	},

	'user-agent-parser': {
		about: [
			'Füge einen User-Agent-String aus einer Logzeile, einem Bug-Report oder einem Analytics-Export ein und lass ihn entschlüsseln: Browser und Version, Rendering-Engine, Betriebssystem, Gerätetyp und CPU-Architektur. Der Parser ist ua-parser-js, dieselbe Library hinter unzähligen Analytics-Pipelines, lokal auf deinem String ausgeführt.',
			'User-Agent-Strings sind archäologische Fundstätten — jeder behauptet noch, Mozilla/5.0 zu sein, Chrome behauptet Safari, Safari behauptet KHTML, und die wahre Identität versteckt sich in den späteren Tokens. Ein Parser schlägt das Zusammenkneifen der Augen: Er weiß, dass „CriOS“ Chrome auf iOS bedeutet und dass Edge sich hinter „Edg/“ versteckt.',
			'Beachte die Richtung der Entwicklung: Browser frieren UA-Strings ein und reduzieren sie (und Chromium liefert stattdessen UA Client Hints) — Versionsdetails allein aus dem UA werden also zunehmend grob. Für Log-Forensik und Bug-Triage bleibt er unverzichtbar; für Feature-Entscheidungen nutze Feature Detection.'
		],
		faqs: [
			{
				q: 'Warum beginnt jeder User-Agent mit Mozilla/5.0?',
				a: 'Kompatibilitätstheater aus den 1990ern, das nie endete: Server prüften auf „Mozilla“, um moderne Seiten auszuliefern, also gab sich jeder neue Browser als solcher aus, und jeder folgende Browser imitierte seine Vorgänger. Das Präfix ist heute bedeutungslose Tradition.'
			},
			{
				q: 'Kann ich der OS-Version in einem UA-String trauen?',
				a: 'Jedes Jahr weniger. macOS hat seine UA-Version bei 10_15_7 eingefroren, Windows 11 meldet sich als Windows NT 10.0, und Browser mit reduziertem UA vergröbern Versionen absichtlich. Behandle OS-Versionen aus dem UA als Näherung; nutze UA Client Hints, wo du den Client kontrollierst.'
			},
			{
				q: 'Was bedeutet „like Gecko“ oder „KHTML, like Gecko“?',
				a: 'Weitere Imitationsschichten: WebKit stammt von KHTML ab und wollte, dass Seiten mit Gecko-Sonderbehandlung (Firefox-Engine) funktionieren, also hängte es „like Gecko“ an. Jeder WebKit/Blink-Browser trägt die Phrase bis heute.'
			},
			{
				q: 'Sollte ich UA-Parsing für Feature Detection verwenden?',
				a: 'Nein — Sniffing bricht, sobald eine neue Browserversion erscheint. Erkenne das Feature selbst (if ("clipboard" in navigator)). UA-Parsing ist für Analytics, Log-Analyse und das Reproduzieren gemeldeter Bugs — dort ist die Umgebung zu kennen genau der Punkt.'
			}
		]
	},

	'color-converter': {
		about: [
			'Gib eine Farbe in jeder gängigen Notation ein — #hex, rgb(), hsl() oder eine benannte CSS-Farbe — und erhalte alle Formate auf einmal: HEX, RGB, HSL und OKLCH, neben einer Live-Vorschau. Alpha-Kanäle bleiben über alle Formate erhalten, und die Ausgabe nutzt moderne CSS-Syntax (leerzeichengetrennte Kanäle), die sich sauber in aktuelle Stylesheets einfügen lässt.',
			'OKLCH ist dabei, weil CSS-Farbe genau dorthin steuert: Anders als bei HSL ist seine Helligkeitsachse perzeptuell gleichförmig — zwei Farben mit demselben L sehen tatsächlich gleich hell aus, und eine Farbton-Änderung verschiebt nicht versehentlich die wahrgenommene Helligkeit. Eine bestehende Palette nach OKLCH zu konvertieren ist der erste Schritt zu konsistenten Farbskalen.',
			'Die Umrechnungsmathematik läuft lokal mit den veröffentlichten sRGB↔OKLab-Transformationen, und die Werte sind roundtrip-fest: Das RGB, das du aus einer HSL-Eingabe zurückbekommst, ist exakt das, was der Browser berechnen würde.'
		],
		faqs: [
			{
				q: 'Warum widersprechen sich die Helligkeitswerte von HSL und OKLCH?',
				a: 'HSL-Helligkeit ist eine geometrische Eigenschaft der RGB-Werte, keine des menschlichen Sehens — hsl(60 100% 50%)-Gelb wirkt weit heller als hsl(240 100% 50%)-Blau, trotz identischem L. Die L-Achse von OKLCH ist auf Wahrnehmung ausgelegt: Gleiches L bedeutet gleiche scheinbare Helligkeit. Dieser Widerspruch ist der ganze Grund, warum es OKLCH gibt.'
			},
			{
				q: 'Was bedeutet der Alpha-Wert und wo steht er in jedem Format?',
				a: 'Alpha ist die Deckkraft, von 0 (transparent) bis 1 (deckend). In 8-stelligem Hex ist es das letzte Byte (#RRGGBBAA); in moderner funktionaler Syntax folgt es auf einen Schrägstrich: rgb(76 141 255 / 0.5). Dieser Konverter zieht Alpha automatisch durch jedes Format.'
			},
			{
				q: 'Lässt sich jede OKLCH-Farbe in sRGB darstellen?',
				a: 'Nein — OKLCH deckt weite Gamuts ab, und manche Chroma/Helligkeits-Kombinationen haben kein sRGB-Äquivalent. Von sRGB aus zu konvertieren (wie dieses Tool es tut) bleibt immer darstellbar; in die andere Richtung müssen Out-of-Gamut-Farben geclippt oder gemappt werden — deshalb wirkt ein leuchtendes P3-Grün auf einem sRGB-Bildschirm stumpfer.'
			},
			{
				q: 'Warum leerzeichengetrenntes rgb(76 141 255) statt Kommas?',
				a: 'CSS Color Module Level 4 hat leerzeichengetrennte Kanäle mit optionalem /alpha standardisiert, und jeder moderne Browser unterstützt sie. Die Komma-Form funktioniert weiterhin, aber die Leerzeichen-Form ist die, die neue Specs (und dieses Tool) verwenden.'
			}
		]
	},

	'image-to-base64': {
		about: [
			'Bild ablegen, auswählen oder einfügen — und du bekommst sein Base64 in jeder Form, die du brauchen könntest: eine sofort nutzbare Data-URL, eine CSS-background-image-Deklaration, ein vollständiges <img>-Tag mit echten Abmessungen und den rohen Base64-Payload. Die Gegenrichtung funktioniert auch: Data-URL oder nacktes Base64 einfügen, und das Bild wird dekodiert, als Vorschau angezeigt und lässt sich als Datei herunterladen.',
			'Das Format wird an den Magic Bytes erkannt, nicht an der Dateiendung oder dem deklarierten MIME-Typ — ein zu .jpg umbenanntes PNG (oder eine falsch beschriftete Data-URL) konvertiert also trotzdem korrekt. Die Größenanzeige ist ehrlich, was die Kosten angeht: Base64 bläht Daten um rund ein Drittel auf, und die exakte kodierte Größe steht direkt neben der Originalgröße, damit du entscheiden kannst, ob sich das Einbetten lohnt.',
			'Anders als bei den meisten Bild-zu-Base64-Seiten wird nichts hochgeladen — die Datei wird mit der FileReader-API des Browsers gelesen und in der Seite kodiert. Das macht das Tool sicher für Screenshots interner Dashboards, unveröffentlichte Produktbilder oder alles andere, was du lieber nicht dem Server eines Fremden anvertraust.'
		],
		faqs: [
			{
				q: 'Wann sollte ich ein Bild als Base64 einbetten statt eine Datei zu verlinken?',
				a: 'Wenn das Bild klein ist (grob unter 10 KB), sich selten ändert und sonst einen zusätzlichen HTTP-Request kosten würde — Icons, Logos in E-Mails, Ein-Datei-HTML-Dokumente. Für alles Größere gewinnt die separate Datei: Sie wird unabhängig gecacht, lädt parallel und bläht dein HTML oder CSS nicht um 33 % auf.'
			},
			{
				q: 'Warum ist die Base64-Version rund ein Drittel größer als meine Datei?',
				a: 'Base64 stellt je 3 Binärbytes als 4 ASCII-Zeichen dar — ein struktureller Overhead von +33 % (plus bis zu zwei Füllzeichen). Gzip oder Brotli auf dem Server holt einen Teil zurück, aber die Aufblähung steckt in der Kodierung selbst — sie tauscht Größe gegen die Fähigkeit, Binärdaten in Text einzubetten.'
			},
			{
				q: 'Kann ich eine Data-URL dekodieren, die ich in einem Stylesheet oder HTML gefunden habe?',
				a: 'Ja — wechsle zu Base64 → Bild und füge alles ein, samt data:-Präfix. Auch prozent-kodierte SVG-Data-URLs (die ohne ;base64) werden dekodiert, Zeilenumbrüche und Leerzeichen im Payload automatisch entfernt. Das Ergebnis erscheint als Vorschau und lädt mit der richtigen Endung herunter.'
			},
			{
				q: 'Funktioniert das mit SVG, GIF und ICO oder nur mit PNG und JPEG?',
				a: 'Alles, was der Sniffer erkennt, lässt sich in Base64 wandeln: PNG, JPEG, WebP, GIF, SVG, BMP, ICO und AVIF. Speziell bei SVG gilt: Die XML-Quelle ist direkt eingebettet oft kleiner und lesbarer — SVG in Base64 lohnt sich vor allem, wenn Anführungszeichen oder Escaping zum Problem werden.'
			}
		]
	},

	'image-converter': {
		about: [
			'Konvertiere ein Bild zwischen PNG, JPEG und WebP, ohne etwas zu installieren oder hochzuladen: Datei ablegen, Ziel wählen, Qualität am Live-Regler einstellen und zusehen, wie sich die Ausgabegröße in Echtzeit aktualisiert. Die Δ-Kachel zeigt exakt, wie viel kleiner (oder größer) die konvertierte Datei ist — die Qualitätswahl hört auf, Raterei zu sein.',
			'Die drei Formate haben klare Aufgaben. PNG ist verlustfrei mit voller Transparenz — richtig für Screenshots, UI-Assets und alles mit scharfen Kanten oder Text. JPEG komprimiert Fotos aggressiv, hat aber keinen Alphakanal und verwischt harte Kanten. WebP schlägt JPEG bei vergleichbarer Qualität typischerweise um 25–35 %, unterstützt Transparenz und läuft in allen aktuellen Browsern — fürs Web ist es meist die Antwort.',
			'Die Konvertierung passiert auf einem Canvas in deinem Browser: Das Bild wird dekodiert, neu gezeichnet und von denselben Codecs re-enkodiert, mit denen dein Browser Seiten darstellt. Das macht das Tool privat — und erklärt zugleich, warum die exakten Bytezahlen zwischen Chrome, Firefox und Safari leicht abweichen: Jeder bringt seinen eigenen Encoder mit.'
		],
		faqs: [
			{
				q: 'Welche Qualitätsstufe sollte ich für JPEG und WebP nehmen?',
				a: 'Zwischen 75 und 90 deckt fast jeden echten Einsatz ab. Bei 85 sind die meisten Fotos visuell nicht vom Original zu unterscheiden — bei einem Bruchteil der Größe; unter ~70 kriechen Blockartefakte in Verläufe und Hauttöne; über 90 steigt die Dateigröße steil für Gewinne, die man nicht sieht. Regler ziehen, Größenkachel beobachten — der Sweet Spot ist meist offensichtlich.'
			},
			{
				q: 'Warum wurde mein PNG bei der Konvertierung zu JPEG größer?',
				a: 'JPEG ist für fotografische Verläufe gebaut, nicht für Flächenfarben. Screenshots, Diagramme und UI-Grafiken komprimieren als PNG hervorragend (lange Läufe identischer Pixel), zwingen JPEG aber, um jede scharfe Kante Rauschen zu speichern — größere Dateien und sichtbares Ringing. Grafiken als PNG lassen oder nach WebP wandeln.'
			},
			{
				q: 'Was passiert mit Transparenz bei der Konvertierung zu JPEG?',
				a: 'JPEG hat keinen Alphakanal, transparente Bereiche müssen also gefüllt werden — dieses Tool legt sie auf Weiß, die Konvention für Webbilder. Soll die Transparenz überleben, wähle PNG oder WebP als Ziel.'
			},
			{
				q: 'Warum kann mein Browser hier kein AVIF oder HEIC exportieren?',
				a: 'Die toBlob-API des Canvas kodiert nur Formate, für die der Browser einen Encoder mitbringt — PNG und JPEG überall, WebP in Chromium und Firefox. AVIF-Encoding ist noch selten und HEIC patentbelastet, Browser dekodieren beide nur. Wählst du ein Format, das dein Browser nicht schreiben kann, sagt das Tool es dir, statt dir stillschweigend ein PNG unterzuschieben.'
			}
		]
	},

	'image-resizer': {
		about: [
			'Skaliere ein Bild auf eine exakte Breite, eine exakte Höhe oder einen Prozentsatz des Originals — die andere Dimension folgt automatisch, nichts wird verzerrt. Ausgabeformat wählen (oder das Quellformat behalten), bei verlustbehafteten Zielen die Qualität setzen, Ergebnis prüfen, herunterladen. Vorher/Nachher-Kacheln zeigen Abmessungen und Dateigröße auf einen Blick.',
			'Die Skalierung nutzt den hochwertigen Glättungsmodus des Browsers, der echtes Resampling betreibt statt Nearest-Neighbor-Ausdünnung — verkleinerte Fotos bleiben knackig, statt vor Aliasing zu flimmern. Verkleinern ist außerdem der ehrliche Weg zu kleineren Dateien: Beide Dimensionen zu halbieren entfernt drei Viertel der Pixel — da kommt kein Qualitätsregler mit.',
			'Dateien verlassen die Seite nie: Dekodieren, Resampling und Re-Enkodieren laufen auf einem lokalen Canvas. Es gibt keinen Upload-Fortschrittsbalken, weil es keinen Upload gibt — ein 40-Megapixel-Foto skaliert so schnell, wie deine Maschine es neu zeichnen kann, und funktioniert auch mit gezogenem Netzwerkkabel.'
		],
		faqs: [
			{
				q: 'Stellt Verkleinern und wieder Vergrößern mein Bild wieder her?',
				a: 'Nein — Verkleinern verwirft Pixel endgültig. Ein 3000px-Foto auf 300px zu skalieren behält 1 % der Daten; das Zurückvergrößern interpoliert die fehlenden 99 % als Unschärfe. Bewahre das Original auf und exportiere skalierte Kopien daraus, statt dein einziges Exemplar zu skalieren.'
			},
			{
				q: 'Warum wirkt mein hochskaliertes Bild weich?',
				a: 'Vergrößern kann kein Detail erschaffen, das nie aufgenommen wurde — der Browser interpoliert zwischen vorhandenen Pixeln, was sich jenseits von etwa 2× als Weichheit zeigt. Echtes Upscaling darüber hinaus braucht ML-Tools, die plausibles Detail halluzinieren; ein Canvas-Resampler erfindet bewusst nichts.'
			},
			{
				q: 'Wie treffe ich eine Zielgröße, etwa „unter 200 KB"?',
				a: 'Beide Hebel nutzen: Erst auf die größten tatsächlich benötigten Abmessungen skalieren (1200px Breite reichen für die meisten Web-Layouts), dann WebP oder JPEG wählen und die Qualität senken, bis die Größenkachel unter dem Ziel liegt. Die Dimensionsreduktion leistet die Hauptarbeit — die Qualität feintunt den Rest.'
			},
			{
				q: 'Entfernt das Skalieren EXIF-Metadaten wie den GPS-Standort?',
				a: 'Ja. Die Canvas-Pipeline re-enkodiert reine Pixel — Kameramodell, Zeitstempel, GPS-Koordinaten und alle anderen EXIF-Tags fehlen in der Ausgabe. Für Bilder, die ins öffentliche Web gehen, ist das meist ein Privatsphäre-Gewinn; brauchst du die Metadaten, bewahre das Original daneben auf.'
			}
		]
	},

	'favicon-generator': {
		about: [
			'Ein Bild ablegen — idealerweise ein quadratisches Logo mit 512px oder mehr — und das komplette Favicon-Kit erhalten: eine favicon.ico mit 16, 32 und 48 px für Tabs und Lesezeichen, PNGs in den Standardgrößen samt 180px-Apple-Touch-Icon und 192/512px-PWA-Icons, ein Start-site.webmanifest und die <link>-Tags zum Einfügen in den <head>. Ein einziges ZIP enthält alles, benannt exakt so, wie die Konventionen es erwarten.',
			'Die Details, die Favicon-Tutorials gern falsch machen, sind hier abgedeckt: Das ICO bettet PNG-komprimierte Einträge ein (seit Windows Vista überall unterstützt, deutlich kleiner als alte BMP-Icons); das Apple-Touch-Icon wird auf eine von dir gewählte Hintergrundfarbe reduziert, weil iOS Transparenz durch Schwarz ersetzt; und die PWA-Icons behalten ihren Alphakanal. Nicht-quadratische Quellen werden mittig zugeschnitten statt gestaucht.',
			'Ein Logo auf 16px zu verkleinern ist naturgemäß destruktiv — feine Details überleben schlicht nicht —, daher zeigt die Vorschauzeile jede Größe in echten Abmessungen, damit du die Lesbarkeit vor dem Veröffentlichen beurteilen kannst. Alles rendert auf einem lokalen Canvas, die ICO/ZIP-Container werden Byte für Byte in der Seite zusammengesetzt; dein Logo wird nirgendwohin hochgeladen.'
		],
		faqs: [
			{
				q: 'Welche Favicon-Größen braucht man 2026 wirklich?',
				a: 'Weniger als die Folklore behauptet: eine favicon.ico mit 16/32/48 für Legacy und Adressleiste, ein 180px apple-touch-icon.png und 192/512px-PNGs, referenziert aus dem Web-App-Manifest. Moderne Browser wählen aus genau diesem Set die beste Übereinstimmung — die 20-Datei-Pakete mancher Generatoren sind Cargo-Kult.'
			},
			{
				q: 'Warum ist mein Logo bei 16px unleserlich?',
				a: 'Sechzehn Pixel sind brutal wenig — Wortmarken, dünne Striche und feine Verläufe lösen sich auf. Starke Favicons reduzieren die Marke auf eine einzige kräftige Glyphe oder Form mit hohem Kontrast. Wenn die 16px-Vorschau hier Brei ist, schneide enger auf den markanten Teil zu oder nutze eine vereinfachte Variante für kleine Größen.'
			},
			{
				q: 'Brauche ich noch eine .ico-Datei oder reichen PNG-Favicons?',
				a: 'Jeder moderne Browser akzeptiert PNG-Favicons, aber /favicon.ico ist nach wie vor der Pfad, den User-Agents, Crawler und ältere Tools blind anfragen. Dort ein echtes ICO auszuliefern kostet wenige Kilobyte und beseitigt eine ganze Klasse von 404s und Fallback-Macken — behalte es neben deinen PNG-Links.'
			},
			{
				q: 'Warum braucht das Apple-Touch-Icon eine Hintergrundfarbe?',
				a: 'iOS rendert keine Transparenz in Homescreen-Icons — das Alpha deines PNGs wird auf Schwarz komponiert. Vorab auf eine gewählte Farbe zu reduzieren hält das Ergebnis beabsichtigt. Wähle den Hintergrund passend zum Icon, und denk daran: iOS rundet die Ecken selbst, liefere also ein vollflächiges Quadrat.'
			}
		]
	},

	'sql-formatter': {
		about: [
			'Füge eine Query frisch aus einer Logdatei, einem ORM-Debug-Dump oder dem Einzeiler eines Kollegen ein, und dieser Formatter zerlegt sie in lesbare Klauseln mit konsistenter Einrückung. Sechs Dialekte werden unterstützt — Standard-SQL, PostgreSQL, MySQL, SQLite, SQL Server und BigQuery — sodass dialektspezifische Syntax wie TOP, Backtick-Bezeichner oder Array-Typen korrekt formatiert wird, statt den Parser stolpern zu lassen.',
			'Die Schreibweise der Schlüsselwörter ist konfigurierbar: GROSSBUCHSTABEN für den klassischen Look, Kleinbuchstaben, wenn dein Team das bevorzugt, oder das Original unangetastet lassen. Der Minify-Modus macht das Gegenteil — er kollabiert eine formatierte Query auf eine einzige Zeile und entfernt Kommentare, während String-Literale Byte für Byte intakt bleiben. Genau das willst du, bevor du SQL in eine JSON-Config oder ein CLI-Flag einfügst.',
			'Queries enthalten oft Tabellennamen, Kundendaten in Literalen oder Hinweise auf die Infrastruktur. Die Formatierung läuft vollständig in deinem Browser — nichts davon erreicht einen Server.'
		],
		faqs: [
			{
				q: 'Welchen SQL-Dialekt sollte ich wählen?',
				a: 'Den, den deine Datenbank spricht — er bestimmt, wie Bezeichner, String-Quoting und Dialekt-Schlüsselwörter geparst werden. Für generisches Aufräumen deckt Standard-SQL den gemeinsamen Kern ab. Ein Parse-Fehler bei Syntax, die für deine Datenbank gültig ist, ist meist ein Zeichen, den Dialekt zu wechseln.'
			},
			{
				q: 'Ändert die Formatierung, was die Query tut?',
				a: 'Nein. Formatieren verschiebt nur Whitespace und ändert, falls aktiviert, die Schreibweise der Schlüsselwörter — Bezeichner und Literale behalten ihre exakten Bytes. SQL-Schlüsselwörter sind in allen unterstützten Dialekten case-insensitiv; SELECT und select sind dasselbe Statement.'
			},
			{
				q: 'Kann ich mehrere Statements auf einmal formatieren?',
				a: 'Ja — füge ein ganzes Skript ein, und jedes mit ; abgeschlossene Statement wird der Reihe nach formatiert, mit einer Leerzeile dazwischen.'
			},
			{
				q: 'Was genau entfernt das Minifizieren?',
				a: 'Zeilenkommentare (--) und Blockkommentare (/* */) fallen weg, Whitespace-Folgen kollabieren zu einzelnen Leerzeichen, und Leerzeichen um Kommata und Klammern werden entfernt. Text in einfachen Anführungszeichen, doppelten Anführungszeichen und Backticks wird nie angetastet, verdoppelte Anführungszeichen als Escapes eingeschlossen.'
			}
		]
	},

	'xml-formatter': {
		about: [
			'Dieses Tool formatiert XML mit der Einrückung deiner Wahl, meldet Wohlgeformtheitsfehler mit exakter Zeile und Spalte und kann ein Dokument auf eine einzige Zeile minifizieren. Kommentare, CDATA-Abschnitte und der XML-Prolog überstehen die Formatierung — eine überraschende Zahl von Formatierern schluckt sie stillschweigend.',
			'Validierung bedeutet hier Wohlgeformtheit: korrekt verschachtelte Tags, Attribute in Anführungszeichen, zulässige Zeichen. Das fängt die überwältigende Mehrheit der Unfälle beim Handeditieren ab — ein fehlender Schrägstrich, ein nicht geschlossenes Element, ein verirrtes kaufmännisches Und. Schema-Validierung gegen eine XSD liegt bewusst außerhalb des Umfangs; die gehört in deine Build-Pipeline, wo die Schema-Datei vorliegt.',
			'Config-Dateien, SOAP-Payloads, RSS-Feeds und Android-Manifeste enthalten routinemäßig interne Hostnamen und Schlüssel. Alles hier parst lokal — nichts wird übertragen.'
		],
		faqs: [
			{
				q: 'Warum schlägt mein XML mit „char … is not expected“ fehl?',
				a: 'Die üblichen Verdächtigen: ein rohes &, das &amp; heißen müsste, ein Attributwert ohne Anführungszeichen oder Tags, die in der falschen Reihenfolge schließen. Die Fehlermeldung enthält Zeile und Spalte des ersten problematischen Zeichens, und die Eingabebox markiert es.'
			},
			{
				q: 'Sortiert oder normalisiert der Formatter mein Dokument um?',
				a: 'Nein. Elemente, Attribute und ihre Reihenfolge bleiben exakt erhalten; nur der Whitespace zwischen Elementen ändert sich. Textinhalt, der sich eine Zeile mit Markup teilt, wird getrimmt, und interne Whitespace-Folgen kollabieren — wenn du auf signifikanten Whitespace angewiesen bist (xml:space="preserve"), lass diese Abschnitte minifiziert.'
			},
			{
				q: 'Was entfernt das Minifizieren?',
				a: 'Einrückung und Zeilenumbrüche zwischen Elementen, plus Kommentare. CDATA-Abschnitte, Processing Instructions und der Prolog bleiben. Das Ergebnis parst für jeden Konsumenten identisch, der nicht von Nur-Whitespace-Textknoten abhängt.'
			},
			{
				q: 'Kann es gegen eine XSD oder DTD validieren?',
				a: 'Nein — hier wird nur Wohlgeformtheit geprüft. Schema-Validierung braucht die Schema-Datei und eine XSD-Engine; das erledigst du besser in deiner Toolchain (xmllint --schema oder die XML-Library deiner Sprache).'
			}
		]
	},

	'xml-to-json': {
		about: [
			'Konvertiere XML zu JSON, um Legacy-SOAP-Antworten, RSS-Feeds oder Maven-POMs in JavaScript, jq oder eine JSON-native API zu füttern — oder geh den umgekehrten Weg und erzeuge XML aus JSON-Daten. Attribute bleiben erhalten: Sie werden zu "@_name"-Keys, und Textinhalt, der neben Attributen existiert, landet unter "#text" — es verschwindet also keine Information stillschweigend.',
			'Die beiden Formate sind sich in Grundsatzfragen uneins, und dieser Konverter trifft die üblichen pragmatischen Entscheidungen: Wiederholte Geschwisterelemente kollabieren zu einem JSON-Array, numerisch aussehende Werte werden Zahlen, und Namespaces reisen als Teil des Elementnamens mit. Der Roundtrip XML → JSON → XML erhält für typische Dokumente Struktur und Inhalt.',
			'Beide Richtungen laufen lokal in deinem Browser. Füge einen Rechnungs-Feed oder eine API-Antwort ein, ohne dass sie irgendwohin geht.'
		],
		faqs: [
			{
				q: 'Warum kommen manche Werte als Zahlen statt als Strings zurück?',
				a: 'Der Parser erkennt numerischen Text und konvertiert ihn — was die meisten Konsumenten wollen. Vorsicht bei Bezeichnern mit führenden Nullen (Produktcodes, Telefonnummern): Wenn das für deine Daten zählt, setze sie nach der Konvertierung in Anführungszeichen oder betrachte die Ausgabe als Ausgangspunkt.'
			},
			{
				q: 'Wie werden wiederholte Elemente behandelt?',
				a: 'Zwei oder mehr Geschwister mit demselben Namen werden zu einem JSON-Array unter diesem Key. Ein einzelnes Vorkommen bleibt ein einfaches Objekt — diese Asymmetrie steckt im Mapping selbst; Code, der das JSON konsumiert, sollte beide Formen tolerieren oder zuerst normalisieren.'
			},
			{
				q: 'Was bedeuten die Keys @_ und #text?',
				a: '@_ markiert, was ein XML-Attribut war; #text trägt den Elementtext, wenn zusätzlich Attribute vorhanden sind. Dieselbe Konvention zurück in die Richtung JSON → XML gefüttert rekonstruiert das ursprüngliche Markup.'
			},
			{
				q: 'Warum lehnt JSON → XML mein Top-Level-Array ab?',
				a: 'Ein XML-Dokument muss genau ein Wurzelelement haben, und ein nacktes Array hat keins. Wickle das Array in ein Objekt — {"items": {"item": [...]}} — und der Konverter erzeugt ein wohlgeformtes Dokument.'
			}
		]
	},

	'csv-to-json': {
		about: [
			'Füge einen CSV-Export ein — aus Excel, einem Datenbank-Dump, einem Analytics-Download — und erhalte ein JSON-Array von Objekten, deren Keys aus der Kopfzeile stammen. Das Trennzeichen wird über Komma, Semikolon, Tab und Pipe automatisch erkannt (manuell festlegbar), das Quoting folgt RFC 4180 — eingebettete Kommata, Anführungszeichen und sogar Zeilenumbrüche in gequoteten Feldern parsen also korrekt.',
			'Die typisierte Konvertierung erkennt Zahlen, true/false und null und gibt echte JSON-Typen statt Strings aus; schalte sie ab, wenn führende Nullen oder große Bezeichner wörtlich überleben müssen. Dateien ohne Kopfzeile werden zu Arrays von Arrays, und doppelte Header-Namen bekommen numerische Suffixe, statt sich gegenseitig stillschweigend zu überschreiben.',
			'Tabellen enthalten tendenziell die sensibelsten Daten, mit denen Entwickler hantieren — Kundenlisten, Gehälter, Bestellhistorien. Die Konvertierung passiert vollständig in deinem Browser; nichts wird hochgeladen.'
		],
		faqs: [
			{
				q: 'Warum wurde meine semikolongetrennte Datei als eine Spalte geparst?',
				a: 'Die automatische Erkennung sampelt die ersten Zeilen und wählt das Trennzeichen, das konsistente Spaltenzahlen ergibt — eine Datei aus einspaltigen Zeilen kann sie täuschen. Lege das Trennzeichen über den Umschalter fest, und das Parsen folgt sofort.'
			},
			{
				q: 'Wie verhalten sich gequotete Felder und eingebettete Zeilenumbrüche?',
				a: 'Gemäß RFC 4180: In doppelte Anführungszeichen eingefasste Felder dürfen das Trennzeichen, verdoppelte Anführungszeichen ("") für ein literales Anführungszeichen und Zeilenumbrüche enthalten. Excel und die meisten Datenbanken exportieren genau dieses Format.'
			},
			{
				q: 'Warum verlieren meine Postleitzahlen ihre führenden Nullen?',
				a: 'Die typisierte Konvertierung macht aus 02134 die Zahl 2134. Deaktiviere „Typisierte Werte“, und jede Zelle bleibt ein String — exakt wie geschrieben.'
			},
			{
				q: 'Kann ich TSV- oder pipe-getrennte Dateien konvertieren?',
				a: 'Ja — Tab und Pipe sind vollwertige Trennzeichen, automatisch erkannt oder manuell festgelegt. Der Parser ist derselbe; nur der Separator ändert sich.'
			}
		]
	},

	'markdown-to-html': {
		about: [
			'Schreibe oder füge Markdown ein und sieh gerenderte Vorschau und erzeugtes HTML nebeneinander — inklusive Überschriften, GFM-Tabellen, Task-Listen-Aufzählungen, Fenced-Code-Blöcken und Durchgestrichenem. Die Gegenrichtung konvertiert bestehendes HTML in sauberes Markdown mit ATX-Überschriften, Bindestrich-Listen und Fenced Code — der schnellste Weg, alte CMS-Inhalte in ein Docs-Repo zu migrieren.',
			'Die Vorschau wird vor dem Rendern bereinigt: Skripte, iframes und Event-Handler-Attribute werden entfernt — ein geteilter Link mit feindseligem Markup kann in deinem Browser also nichts ausführen. Die HTML-Ausgabebox zeigt immer die rohe Konvertierung zum Kopieren in Templates oder E-Mails.',
			'Konvertierung und Vorschau laufen lokal. Entwürfe von Release Notes mit unangekündigten Feature-Namen bleiben auf deinem Rechner.'
		],
		faqs: [
			{
				q: 'Welcher Markdown-Dialekt ist das?',
				a: 'CommonMark plus die GitHub-Erweiterungen, die tatsächlich genutzt werden: Tabellen, Durchstreichen und automatisch verlinkte URLs. Weiche Zeilenumbrüche bleiben weich — ein einzelner Zeilenumbruch wird nicht zu <br>, passend zu GitHubs Rendering von Dokumenten.'
			},
			{
				q: 'Warum unterscheidet sich die Vorschau vom rohen HTML-Output?',
				a: 'Die Vorschau durchläuft vor dem Rendern einen Sanitizer, der Script-Tags, Inline-Event-Handler und javascript:-URLs entfernt. Die Ausgabebox umgeht die Bereinigung, weil sie Text ist, kein gerendertes Markup — bereinige nachgelagert, wenn du nutzergeliefertes HTML einbettest.'
			},
			{
				q: 'Wie originalgetreu ist HTML → Markdown?',
				a: 'Strukturelemente — Überschriften, Listen, Links, Hervorhebungen, Code, Blockquotes, Bilder — konvertieren sauber. HTML ohne Markdown-Äquivalent (verschachtelte Tabellen, divs mit Klassen, Inline-Styles) wird als rohes HTML durchgereicht oder verliert sein Styling — ein kurzes Gegenlesen danach lohnt sich.'
			},
			{
				q: 'Kann ich das erzeugte HTML in einer E-Mail verwenden?',
				a: 'Ja — die Ausgabe ist schlichtes semantisches HTML ohne Klassen und externe Stylesheets, genau das, was E-Mail-Clients am besten vertragen. Benötigtes Styling ergänzt du inline obendrauf.'
			}
		]
	},

	'html-formatter': {
		about: [
			'Bring HTML in Form, das aus einem Bundler, einem Scraper oder einem WYSIWYG-Editor kam: Elemente werden auf deine gewählte Breite eingerückt, Attribute bleiben auf ihrer Zeile, und die Inhalte von pre/textarea bleiben Byte für Byte intakt. Der Minify-Modus entfernt Kommentare und kollabiert den Whitespace zwischen Tags — auf handgeschriebenen Seiten typischerweise 10–25 % Ersparnis.',
			'Die Minifizierung ist bewusst konservativ: Inline-Skripte und -Styles sind geschützt, Conditional Comments überleben, und einzelne Leerzeichen zwischen Inline-Elementen bleiben erhalten, damit „klicke <a>hier</a> jetzt“ nicht zu „klickehierjetzt“ verschmilzt. Du bekommst ein sicheres Minify, kein maximal aggressives.',
			'Beide Operationen laufen lokal in deinem Browser — unveröffentlichte Seiten und internes Admin-Markup verlassen deinen Rechner nie.'
		],
		faqs: [
			{
				q: 'Macht das Minifizieren mein Inline-JavaScript oder -CSS kaputt?',
				a: 'Nein — <script>-, <style>-, <pre>- und <textarea>-Blöcke sind vom Whitespace-Kollabieren vollständig ausgenommen. Nur Markup zwischen Tags wird angefasst. Um die Skripte selbst zu komprimieren, schicke sie separat durch den JavaScript-Minifier.'
			},
			{
				q: 'Warum lässt sich Whitespace zwischen Tags gefahrlos entfernen?',
				a: 'Meistens eben doch nicht ganz: Whitespace zwischen Block-Elementen hat keinen visuellen Effekt, zwischen Inline-Elementen aber schon — deshalb kollabiert der Minifier Folgen zu einem einzelnen Leerzeichen, statt sie zu löschen. Layouts, die auf Inline-Block-Whitespace-Hacks beruhen, sind die seltene Ausnahme, die einen Blick wert ist.'
			},
			{
				q: 'Repariert der Formatter ungültiges HTML?',
				a: 'Er formatiert, was du ihm gibst, ohne gegen die HTML-Spezifikation zu validieren — nicht geschlossene Tags bleiben offen. Browser verzeihen Tag-Suppe, und die Formatierung macht die Struktur gut genug sichtbar, um das Problem zu erkennen.'
			},
			{
				q: 'Welche Einrückungsbreite sollte ich nehmen?',
				a: '2 Leerzeichen sind die vorherrschende Konvention in Web-Codebasen und der Default der meisten Framework-Style-Guides. Nimm 4, wenn dein Team sich darauf geeinigt hat — die Wahl ist rein kosmetisch.'
			}
		]
	},

	'css-formatter': {
		about: [
			'Expandiere minifiziertes oder zusammenkopiertes CSS in Regeln mit einer Deklaration pro Zeile, oder quetsche ein Stylesheet für die Produktion zusammen. Der Beautifier normalisiert Einrückung und Klammersetzung; der Minifier entfernt Kommentare, kollabiert Whitespace und streicht abschließende Semikolons, während Strings, url(...)-Inhalte und calc()-Ausdrücke unangetastet bleiben.',
			'Der Minifier ist transparent darin, was er nicht tut: Er benennt keine Selektoren um, führt keine doppelten Regeln zusammen und schreibt keine Farben um. Das macht die Ausgabe vorhersagbar und sicher für jedes Stylesheet, auch für solche mit Hacks und Vendor-Prefixes — einfügen, minifizieren, ausliefern.',
			'Wie bei jedem Tool hier läuft die Verarbeitung lokal. Unveröffentlichter Design-System-Code bleibt in deinem Browser.'
		],
		faqs: [
			{
				q: 'Wie viel kleiner wird minifiziertes CSS?',
				a: 'Typischerweise 15–30 % bei handgeschriebenem CSS, hauptsächlich durch Einrückung und Kommentare. Gzip auf deinem Server entfernt viel derselben Redundanz — der Unterschied auf der Leitung ist also kleiner, als die rohe Byte-Zahl suggeriert. Minifiziere trotzdem, es verkürzt auch die Parse-Zeit.'
			},
			{
				q: 'Ist es sicher für calc(), Custom Properties und Media Queries?',
				a: 'Ja. Leerzeichen innerhalb von calc() sind bedeutungstragend und bleiben erhalten; Custom Properties und ihre var()-Referenzen sind gewöhnliche Deklarationen und überleben unverändert; @media und andere At-Rules behalten ihre Struktur.'
			},
			{
				q: 'Warum behalten Nachfahren-Selektoren ihre Leerzeichen?',
				a: 'Weil „nav a“ und „nava“ verschiedene Dinge selektieren — das Leerzeichen ist ein Kombinator, keine Formatierung. Der Minifier entfernt nur Whitespace ohne syntaktische Bedeutung.'
			},
			{
				q: 'Kann es zwischen LESS/SCSS und CSS konvertieren?',
				a: 'Nein — Präprozessor-Syntax braucht Kompilierung, keine Formatierung. Schlichtes SCSS, das zugleich gültiges CSS ist, formatiert problemlos; verschachtelte Regeln und Mixins nicht.'
			}
		]
	},

	'js-formatter': {
		about: [
			'Formatiere JavaScript mit konsistenter Einrückung und konsistenten Abständen — deminifiziere ein vendortes Bundle, um zu lesen, was es wirklich tut, oder räume aus einer Konsole kopierten Code auf. Der Minifier ist das echte Werkzeug: Terser parst deinen Code in einen AST, entfernt toten Code, kürzt lokale Variablennamen und streicht Kommentare — dieselbe Engine, die Bundler in Produktion verwenden.',
			'Weil die Minifizierung AST-basiert ist, macht sie funktionierenden Code nie so kaputt wie regex-basierte „Kompressoren“: Strings, Template-Literale, Regexes und ASI-Grenzfälle behandelt ein echter Parser. Syntaxfehler werden mit Position gemeldet, statt korrupte Ausgabe zu erzeugen.',
			'Terser lädt erst beim ersten Minifizieren, was die Seite leicht hält, und läuft vollständig in deinem Browser — proprietärer Quellcode verlässt deinen Rechner nie.'
		],
		faqs: [
			{
				q: 'Wie viel kleiner wird mein Code?',
				a: 'Handgeschriebener Code schrumpft typischerweise um 30–60 % vor gzip: Whitespace, Kommentare und lange lokale Namen wiegen so viel. Bereits gebündelter Code schrumpft deutlich weniger — er hat dieselbe Transformation schon einmal durchlaufen.'
			},
			{
				q: 'Ändert die Minifizierung das Verhalten?',
				a: 'Kompression und Mangling erhalten die Semantik: Nur lokale Namen werden umbenannt, und die Dead-Code-Elimination entfernt Zweige, die beweisbar nie laufen können. Code, der sich auf Function.prototype.name oder das toString() der eigenen Funktionen verlässt, ist die klassische Ausnahme.'
			},
			{
				q: 'Kann das hier minifizierten Produktionscode einer Website entminifizieren?',
				a: 'Der Formatter stellt Whitespace und Struktur wieder her, was den Kontrollfluss lesbar macht — aber die ursprünglichen Variablennamen und Kommentare sind für immer weg; du siehst a, b, c. Für ernsthaftes Debugging sind Source Maps die bessere Wahl, falls die Site sie ausliefert.'
			},
			{
				q: 'Unterstützt es TypeScript oder JSX?',
				a: 'Nein — beide brauchen eigene Parser. Kompiliere zuerst nach JavaScript (tsc, esbuild) und formatiere oder minifiziere dann hier die Ausgabe.'
			}
		]
	},

	'string-escape': {
		about: [
			'Verwandle einen mehrzeiligen String mit Anführungszeichen in etwas, das du in einen JSON-Wert, ein JavaScript-Literal, einen Java-String, einen XML-Textknoten, ein SQL-Literal oder eine CSV-Zelle einfügen kannst — und kehre den Prozess um, wenn du escapten Text in einer Logdatei findest und ihn lesen willst. Sechs Dialekte, beide Richtungen.',
			'Jeder Dialekt folgt seiner tatsächlichen Spezifikation statt einem kleinsten gemeinsamen Nenner: JSON escapet Steuerzeichen als \\uXXXX, JavaScript escapet zusätzlich einfache Anführungszeichen und Backticks, Java kodiert Nicht-ASCII als UTF-16-\\u-Sequenzen, SQL verdoppelt einfache Anführungszeichen, CSV umschließt und verdoppelt gemäß RFC 4180, und XML nutzt seine fünf vordefinierten Entities. Der Unescaper versteht die Formen \\x, \\u und \\u{…} und meldet fehlerhafte Sequenzen mit ihrer Position.',
			'Escapte Strings sind häufig Connection Strings, Tokens und Query-Fragmente. Das hier läuft lokal — füge unbesorgt ein.'
		],
		faqs: [
			{
				q: 'Welchen Dialekt brauche ich für eine JSON-Config-Datei?',
				a: 'JSON. Er escapet doppelte Anführungszeichen, Backslashes und Steuerzeichen exakt so, wie RFC 8259 es verlangt, und lässt Unicode lesbar. Die Ausgabe passt in jeden JSON-String-Wert — ohne die umschließenden Anführungszeichen, die das Tool dir überlässt.'
			},
			{
				q: 'Was ist der Unterschied zwischen den Dialekten JSON und JavaScript?',
				a: 'JavaScript escapet zusätzlich einfache Anführungszeichen und Backticks, damit das Ergebnis in allen drei JS-Quoting-Stilen sicher ist. JSON braucht nur die Behandlung doppelter Anführungszeichen. Das Unescapen akzeptiert beide, plus die Formen \\x und \\u{…}, die JSON nicht definiert.'
			},
			{
				q: 'Macht SQL-Escaping Nutzereingaben sicher fürs Konkatenieren?',
				a: 'Es erzeugt ein korrektes SQL-String-Literal (Anführungszeichen verdoppelt), aber Escapen-und-Konkatenieren bleibt für nicht vertrauenswürdige Eingaben das falsche Muster — nutze parametrisierte Queries. Dieses Tool ist für Fixtures, Migrationen und Debugging gedacht, nicht als Injection-Abwehr.'
			},
			{
				q: 'Warum schlägt das Unescapen meines Strings fehl?',
				a: 'Ein Backslash gefolgt von etwas, das kein definiertes Escape ist (\\q, ein abgeschnittenes \\u12), ist fehlerhaft, und der Fehler nennt den betroffenen Index. Enthält dein Text literale Windows-Pfade, escape ihn zuerst — C:\\temp ist ein Tab in Verkleidung.'
			}
		]
	},

	'number-base-converter': {
		about: [
			'Tippe eine Zahl in beliebiger Basis und lies sie gleichzeitig in Binär, Oktal, Dezimal und Hex — plus jeder benutzerdefinierten Basis bis 36. Präfixe werden verstanden (0x, 0o, 0b), Ziffern-Gruppierung macht lange Werte überfliegbar (1111 1111 · 255 · ff), und eine Bitlängen-Anzeige verrät auf einen Blick, ob ein Wert in 8, 32 oder 64 Bit passt.',
			'Die Arithmetik läuft auf BigInt, die Präzision ist also bei jeder Größe exakt: Dateiberechtigungen, ARGB-Farben, IP-Adressen, Hash-Präfixe und 64-Bit-Datenbank-IDs konvertieren ohne das stille Runden, das gewöhnliche JavaScript-Zahlen oberhalb von 2⁵³ trifft.',
			'Negative Zahlen behalten ihr Vorzeichen über alle Basen hinweg. Alles rechnet lokal, sofort, beim Tippen.'
		],
		faqs: [
			{
				q: 'Wie entscheidet die automatische Erkennung über die Basis?',
				a: 'Per Präfix: 0x heißt Hex, 0o Oktal, 0b Binär; alles andere parst als Dezimal. Ziffernfolgen wie „ff“ ohne Präfix sind mehrdeutig — wähle dann explizit HEX; die Fehlermeldung erinnert dich daran.'
			},
			{
				q: 'Sind riesige Zahlen wirklich exakt?',
				a: 'Ja — die Konvertierung läuft auf BigInt, also mit beliebiger Präzision. 18446744073709551615 (2⁶⁴−1) übersteht den Roundtrip exakt; ein float-basierter Konverter würde daraus …551616 machen.'
			},
			{
				q: 'Wie werden negative Zahlen binär dargestellt?',
				a: 'Mit Minuszeichen (-1010), nicht im Zweierkomplement, denn das Zweierkomplement erfordert eine feste Breite. Um ein Zweierkomplement-Muster zu sehen, addiere 2ⁿ für die gewünschte Breite zu deinem negativen Wert und konvertiere das Ergebnis.'
			},
			{
				q: 'Wofür lässt sich Basis 36 nutzen?',
				a: 'Kompakte IDs: 0-9 plus a-z ist das dichteste Alphabet, das case-insensitiv und URL-sicher bleibt. Viele URL-Shortener und Ticketsysteme kodieren numerische IDs auf diese Weise — füge eine ein und lies die zugrunde liegende Zahl.'
			}
		]
	},

	'text-to-hex': {
		about: [
			'Sieh exakt, aus welchen Bytes dein Text besteht: Dieses Tool kodiert Text als UTF-8 und zeigt ihn als Hex-, Binär- oder Dezimal-Bytewerte — mit Trennzeichen, Groß-/Kleinschreibung und 0x-Präfixen nach Wahl. Der Decoder geht den umgekehrten Weg und ist bewusst tolerant: Er akzeptiert durchgehende Folgen (48656c6c6f), Paare mit Leerzeichen, doppelpunktgetrennte MAC-Notation und \\x-Escape-Sequenzen.',
			'Weil die Kodierung byteweises UTF-8 ist, erscheinen Mehrbyte-Zeichen so, wie sie tatsächlich im Speicher und auf der Leitung existieren: é ist c3 a9, 世 ist e4 b8 96, und Emoji belegen vier Bytes. Das macht dieses Tool zum schnellsten Weg, Encoding-Mismatches, BOM-Mysterien und „Warum ist dieser String länger, als er aussieht“-Probleme zu debuggen.',
			'Sind dekodierte Bytes kein gültiges UTF-8, sagt das Tool es dir, statt Zeichensalat auszugeben — ein starker Hinweis, dass du Binärdaten statt Text vor dir hast.'
		],
		faqs: [
			{
				q: 'Warum werden aus einem Zeichen mehrere Bytes?',
				a: 'UTF-8 ist variabel breit: ASCII bleibt ein Byte, die meisten europäischen Buchstaben brauchen zwei, CJK drei, Emoji vier. Was du hier siehst, ist die exakte Bytesequenz, die jedes UTF-8-System — Dateien, HTTP, Datenbanken — für deinen Text speichert.'
			},
			{
				q: 'Welche Eingabeformate akzeptiert der Decoder?',
				a: 'Hex als durchgehende Folge, als Paare mit Leerzeichen, mit 0x- oder \\x-Präfixen oder doppelpunkt-/kommagetrennt; Binär als 8-Bit-Gruppen mit oder ohne Leerzeichen; Dezimal als getrennte Bytewerte. Gemischte Trennzeichen und verirrter Whitespace werden automatisch bereinigt.'
			},
			{
				q: 'Warum meldet das Dekodieren, die Bytes seien kein gültiges UTF-8?',
				a: 'Die Bytesequenz verletzt die UTF-8-Regeln — zum Beispiel ein einzelnes ff oder ein Fortsetzungsbyte ohne Startbyte. Die Daten sind womöglich binär, in einer Legacy-Kodierung wie Latin-1, oder mitten im Zeichen abgeschnitten.'
			},
			{
				q: 'Ist das dasselbe wie ein Hexdump von xxd?',
				a: 'Die Bytewerte sind identisch; xxd ergänzt Offsets und eine ASCII-Spalte. Füge die Hex-Spalten eines xxd-Dumps hier ein (ohne die Offset-Spalte), und sie dekodieren problemlos.'
			}
		]
	},

	'json-schema-validator': {
		about: [
			'Zwei Richtungen derselben Disziplin: Füge Beispiel-JSON ein und erhalte ein daraus abgeleitetes draft-07-Schema, oder füge Daten plus Schema ein und sieh jeden Verstoß mit seinem JSON-Pfad gelistet. Die Validierung läuft auf Ajv — derselben Engine, die die meisten Node-Services nutzen — was hier besteht, besteht also auch in CI.',
			'Die Ableitung denkt produktionsnah: Objekt-Keys werden zu typisierten Properties und required-Einträgen, Arrays vereinigen die Formen all ihrer Mitglieder, Integer werden von Floats unterschieden, und Keys, die nur in manchen Array-Mitgliedern vorkommen, bleiben korrekterweise aus required heraus. Das Ergebnis ist ein Ausgangspunkt, den du mit Formaten, Wertebereichen und Patterns verschärfst.',
			'API-Antworten und Config-Dateien sind genau die Daten, die du am wenigsten auf einem fremden Server sehen willst. Ableitung und Validierung laufen beide vollständig in deinem Browser.'
		],
		faqs: [
			{
				q: 'Welcher JSON-Schema-Draft wird unterstützt?',
				a: 'Die Ableitung erzeugt draft-07, den über Editoren und Validatoren hinweg am breitesten unterstützten Draft. Die Validierung akzeptiert draft-07 und die früheren Drafts, die Ajv im Non-Strict-Modus versteht; Keywords aus 2019-09/2020-12 funktionieren größtenteils ebenfalls, da unbekannte Keywords ignoriert werden, statt fatal zu sein.'
			},
			{
				q: 'Was bedeutet das $ in den Verstoß-Pfaden?',
				a: 'Es ist die Wurzel des Dokuments, im JSONPath-Stil: $.age meint die Top-Level-Property age, $.items.2.name den Namen des dritten Array-Elements. Ein leerer Pfad ($) heißt, der Verstoß betrifft die Dokumentwurzel selbst — falscher Typ oder eine fehlende Pflicht-Property.'
			},
			{
				q: 'Warum ist das abgeleitete Schema strenger oder lockerer als erwartet?',
				a: 'Es beschreibt exakt das Beispiel, das du geliefert hast: Überall vorhandene Felder werden required, und nur beobachtete Typen sind erlaubt. Füttere für ein allgemeineres Schema ein vielfältigeres Beispiel (ein Array repräsentativer Objekte) und justiere dann von Hand — die Ableitung kann deine Absicht nicht kennen.'
			},
			{
				q: 'Unterstützt die Validierung format, pattern und andere Constraint-Keywords?',
				a: 'Strukturelle Keywords (type, required, properties, items, enum, minimum, pattern…) werden voll durchgesetzt. Format-Strings wie "email" oder "date-time" werden nicht geprüft — das spiegelt die JSON-Schema-Spezifikation, in der format standardmäßig Annotation ist, und vermeidet falsche Sicherheit.'
			}
		]
	},

	'exif-viewer': {
		about: [
			'Jedes Foto deines Handys trägt versteckte Metadaten: Kameramodell, Aufnahmezeit, Bearbeitungssoftware — und, sofern nicht deaktiviert, die GPS-Koordinaten deines Standorts. Dieses Tool liest diese Metadaten aus JPEG-, PNG- und WebP-Dateien und zeigt sie gruppiert und dekodiert: Belichtungswerte als f/2.8 und 1/250 s, die Orientierung in Worten, GPS als Dezimalkoordinaten mit Kartenlink.',
			'Die Bereinigung erzeugt eine Kopie ohne Metadaten — verlustfrei. Statt das Bild neu zu enkodieren (was Qualität kostet), entfernt sie die Metadaten-Segmente Byte für Byte: EXIF- und XMP-Blöcke in JPEG, Text- und Zeit-Chunks in PNG, EXIF-/XMP-Chunks in WebP. Pixel, Abmessungen und Qualität bleiben unangetastet; Farbprofile werden behalten, damit das Bild weiterhin identisch rendert.',
			'Das ist die eine Tool-Kategorie, in der „läuft lokal“ der ganze Punkt ist: Ein Foto per Server-Upload auf GPS-Daten zu prüfen würde den Zweck vereiteln. Die Datei verlässt deinen Browser nie — nachprüfbar im Network-Tab.'
		],
		faqs: [
			{
				q: 'Verändert das Entfernen der Metadaten die Bildqualität?',
				a: 'Nein. Der Bilddatenstrom wird Bit für Bit kopiert; nur Metadaten-Segmente fallen weg. Die bereinigte Datei ist exakt um die Metadatengröße kleiner, und die Pixel sind beweisbar identisch.'
			},
			{
				q: 'Warum zeigt mein Screenshot keine Metadaten?',
				a: 'Screenshots und die meisten fürs Web exportierten Bilder hatten nie EXIF — Kameras schreiben es, Screenshot-Tools meist nicht. Social-Media-Plattformen entfernen Metadaten zudem beim Upload; ein von dort heruntergeladenes Foto ist also meist schon sauber.'
			},
			{
				q: 'Ist die GPS-Position exakt?',
				a: 'Handy-GPS in EXIF ist typischerweise auf wenige Meter genau — genug, um ein Gebäude zu identifizieren. Das Tool wandelt die gespeicherten Grad/Minuten/Sekunden in Dezimalwerte um und verlinkt auf den exakten Punkt, damit du präzise siehst, was ein Empfänger der Datei sehen könnte.'
			},
			{
				q: 'Warum behält die bereinigte Datei ein ICC-Farbprofil?',
				a: 'Das ICC-Profil sagt Software, wie die Farben zu interpretieren sind — es zu entfernen kann sie sichtbar verschieben, und es enthält keine persönlichen Informationen. Die Bereinigung entfernt identifizierende Metadaten (EXIF, XMP, IPTC, Kommentare, Zeitstempel) und behält, was das Bild zum korrekten Rendern braucht.'
			}
		]
	}
};

export default TOOL_CONTENT_DE;
