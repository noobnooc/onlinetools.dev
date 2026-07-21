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
	}
};

export default TOOL_CONTENT_DE;
