import type { ToolContent } from './content';

/**
 * Traduzione italiana dei contenuti dei tool (About + FAQ). Ogni voce è
 * tradotta manualmente e corrisponde uno a uno alla versione inglese in
 * content.ts; le voci mancanti ricadono automaticamente sull’inglese.
 */
const TOOL_CONTENT_IT: Record<string, ToolContent> = {
	'json-formatter': {
		about: [
			'Incolla qualsiasi JSON — una risposta API, un file di configurazione, una riga di log — e questo formatter lo indenta con il rientro che preferisci, oppure lo minifica per l’embedding. Il parsing usa il motore JSON nativo del browser, quindi ciò che risulta valido qui è esattamente ciò che JavaScript e ogni parser conforme a JSON accetteranno.',
			'Quando l’input non è valido, l’errore riporta la riga e la colonna esatte in cui il parsing è fallito, invece di un vago "unexpected token" da qualche parte. Insieme all’editor monospaziato, dare la caccia a una virgola mancante in un payload di 500 righe diventa questione di dieci secondi. Puoi anche ordinare alfabeticamente le chiavi degli oggetti, cosa che aiuta prima di fare il diff di due payload.',
			'La formattazione avviene interamente nel tuo browser. I payload che contengono token, dati dei clienti o URL interni non lasciano mai la tua macchina — non esiste alcun server che possa registrarli.'
		],
		faqs: [
			{
				q: 'Perché il mio JSON fallisce con "Unexpected token" anche se sembra a posto?',
				a: 'I soliti colpevoli sono le virgole in coda dopo l’ultimo elemento, gli apici singoli al posto dei doppi, le chiavi senza virgolette o i commenti. Tutte cose lecite nei letterali oggetto di JavaScript (o in JSON5), ma non nel JSON in senso stretto. Il marcatore riga/colonna punta al primo carattere problematico.'
			},
			{
				q: 'C’è un limite di dimensione?',
				a: 'Nessun limite rigido — il parsing è locale, quindi dipende dalla tua macchina. Documenti fino a decine di megabyte si formattano senza problemi in un browser moderno; oltre, la scheda può rallentare perché l’intero documento resta in memoria.'
			},
			{
				q: 'La formattazione modifica i miei dati?',
				a: 'Solo gli spazi bianchi, a meno che tu non abiliti l’ordinamento delle chiavi. I numeri vengono ri-serializzati dal motore JavaScript, quindi 1e2 diventa 100 e gli interi oltre la precisione double IEEE-754 vengono normalizzati — esattamente ciò che farebbe qualsiasi consumatore JS del tuo JSON.'
			},
			{
				q: 'Posso validare il JSON senza riformattarlo?',
				a: 'Sì — il badge di stato sopra l’input si aggiorna mentre digiti e segnala se il documento è parsabile, la sua dimensione e dove si trova il primo errore. L’azione Format serve solo quando vuoi che l’output venga riscritto.'
			}
		]
	},

	'base64-decode': {
		about: [
			'Base64 trasforma byte arbitrari in un alfabeto di 64 caratteri che sopravvive all’essere incollato in JSON, URL, header HTTP ed email. Questo strumento converte in entrambe le direzioni: digita o incolla del testo per codificarlo, oppure incolla un blob codificato per riottenere l’originale. UTF-8 è gestito correttamente in entrambi i sensi, quindi emoji e alfabeti non latini fanno il viaggio di andata e ritorno senza corrompersi.',
			'Il decoder è tollerante di proposito: accetta l’alfabeto URL-safe (- e _ al posto di + e /), elimina spazi e a capo, e ripristina il padding mancante prima di decodificare — le tre cose che più spesso fanno rifiutare ai decoder più severi input perfettamente recuperabile. Se i byte decodificati non sono testo UTF-8 valido lo segnala invece di stampare spazzatura, il che di solito significa che il payload era un dato binario, ad esempio un’immagine.',
			'Tutto avviene nella pagina. Decodificare qui un token o una credenziale non lo trasmette da nessuna parte.'
		],
		faqs: [
			{
				q: 'Perché la mia stringa Base64 termina con dei segni =?',
				a: 'Base64 codifica 3 byte in 4 caratteri, quindi quando la lunghezza dell’input non è un multiplo di 3 l’output viene riempito con = per mantenere allineati i gruppi. Il padding non trasporta dati; questo decoder lo ripristina automaticamente se è stato rimosso.'
			},
			{
				q: 'Qual è la differenza tra Base64 standard e URL-safe?',
				a: 'Il Base64 standard usa + e /, che negli URL hanno un significato speciale e devono a loro volta essere escapati. La variante URL-safe (RFC 4648 §5) li sostituisce con - e _ e di solito omette il padding. I JWT, per esempio, usano la forma URL-safe. L’encoder qui le offre entrambe; il decoder accetta automaticamente l’una o l’altra.'
			},
			{
				q: 'Base64 è crittografia?',
				a: 'No. Base64 è una codifica reversibile senza chiave — chiunque può decodificarla. Protegge i dati dalla corruzione durante il trasporto, non dalla lettura. Se ti serve riservatezza, prima cifra e poi codifica il testo cifrato.'
			},
			{
				q: 'Perché la decodifica dice che il risultato non è UTF-8 valido?',
				a: 'La stringa è stata decodificata con successo, ma i byte risultanti non sono testo — spesso un PNG, un PDF o dati compressi/cifrati. Decodificare quel contenuto in una casella di testo mostrerebbe mojibake, quindi lo strumento preferisce segnalarlo.'
			}
		]
	},

	'timestamp-converter': {
		about: [
			'Il tempo Unix conta i secondi trascorsi dal 1970-01-01T00:00:00 UTC e salta fuori ovunque: righe di database, claim JWT, file di log, risposte API. Questo convertitore accetta un timestamp in secondi o millisecondi — capisce quale dei due dall’ordine di grandezza — oltre a stringhe ISO 8601 e alla maggior parte delle date leggibili, e mostra tutte le rappresentazioni in una volta: ISO, UTC, la tua ora locale, il tempo relativo ed entrambe le precisioni Unix.',
			'L’ambiguità di unità è la trappola classica: 1700000000 è novembre 2023 in secondi ma gennaio 1970 in millisecondi. L’unità rilevata è mostrata esplicitamente e puoi forzarla con un clic quando l’ipotesi è sbagliata — basta contare le cifre a mente.',
			'La conversione è istantanea e locale, e l’orologio con l’ora corrente continua a scorrere, così mentre lavori la pagina fa anche da orologio epoch.'
		],
		faqs: [
			{
				q: 'Come decide lo strumento tra secondi e millisecondi?',
				a: 'Per ordine di grandezza: i valori con 11 o più cifre sono trattati come millisecondi, quelli più corti come secondi. Questo mappa i secondi fino a circa l’anno 5138 e i millisecondi dal 1973 circa in poi, risolvendo senza ambiguità ogni timestamp moderno realistico. Per i casi limite puoi cambiare l’unità a mano.'
			},
			{
				q: 'Cosa succede dopo il 2038?',
				a: 'Il problema dell’anno 2038 riguarda i sistemi che memorizzano il tempo Unix in un intero a 32 bit con segno. I numeri di JavaScript sono float a 64 bit, quindi questo convertitore gestisce date ben oltre il 2038 — molto oltre l’anno 275760, il limite di Date in JavaScript.'
			},
			{
				q: 'Posso riconvertire una data in timestamp?',
				a: 'Sì. Incolla una stringa ISO 8601 come 2026-07-20T12:00:00Z, o la maggior parte dei formati di data convenzionali, e i secondi e millisecondi Unix compaiono accanto alle altre rappresentazioni.'
			},
			{
				q: 'Quale fuso orario usa la riga dell’ora locale?',
				a: 'Il fuso configurato nel tuo browser, tramite l’API Intl — niente viene consultato in remoto. Il nome del fuso è stampato accanto al valore, così gli screenshot restano privi di ambiguità.'
			}
		]
	},

	'jwt-decoder': {
		about: [
			'Un JSON Web Token è composto da tre segmenti Base64URL — header, payload, firma — uniti da punti. Questo decoder divide il token e rende header e payload come JSON formattato, evidenzia i claim temporali registrati (iat, exp, nbf) come date leggibili e ti dice a colpo d’occhio se il token è scaduto.',
			'Decodificare non è verificare: il payload di qualunque JWT può essere letto da chiunque lo possieda, perché Base64URL è una codifica, non crittografia. È anche il motivo per cui incollare un token in un sito qualsiasi è di norma una pessima idea — questa pagina è l’eccezione, perché la decodifica avviene interamente nel tuo browser e il token non viene mai trasmesso. La verifica della firma con un segreto o una chiave pubblica è deliberatamente fuori dallo scopo del decoder offline.',
			'Un eventuale prefisso "Bearer " viene rimosso automaticamente, così puoi incollare direttamente da un header Authorization.'
		],
		faqs: [
			{
				q: 'È sicuro incollare qui un token di produzione?',
				a: 'Il token resta nel tuo browser — questa pagina non effettua richieste di rete con il tuo input, come puoi verificare nella scheda Network dei developer tools. Comunque, per abitudine tratta i token attivi come password: preferisci token scaduti o di test quando condividi screenshot.'
			},
			{
				q: 'Perché il mio token non si decodifica?',
				a: 'Controlla che abbia esattamente tre segmenti separati da punti e nessun a capo introdotto dal copia-incolla. I token di accesso opachi (per esempio molti token GitHub o Google) non sono affatto JWT — nessuna decodifica aprirà una stringa casuale che non ha mai contenuto JSON.'
			},
			{
				q: 'Cosa significano iat, exp e nbf?',
				a: 'Sono claim registrati dalla RFC 7519, tutti in secondi Unix: iat è quando il token è stato emesso, exp è quando smette di essere valido e nbf ("not before") è il primo istante in cui può essere accettato. Questo strumento converte ciascuno in una data leggibile e confronta exp con il tuo orologio.'
			},
			{
				q: 'Questo strumento può verificare la firma?',
				a: 'No — e in ogni caso una spunta verde di un tool online non andrebbe mai usata per decisioni di sicurezza. Verifica le firme nel tuo backend con una libreria mantenuta (jose, jsonwebtoken, PyJWT) contro le chiavi reali dell’issuer.'
			}
		]
	},

	'regex-tester': {
		about: [
			'Scrivi un pattern, incolla un testo di prova e ogni match viene evidenziato mentre digiti — con gruppi di cattura, gruppi con nome e posizioni dei match elencati sotto. Il tester usa il motore RegExp di JavaScript, quindi il comportamento coincide esattamente con quello di Node.js e dei browser, inclusi lookbehind, gruppi con nome ed escape di proprietà Unicode.',
			'I flag si attivano lettera per lettera (g, i, m, s, u, y, d) e il pattern viene compilato a ogni tasto premuto; gli errori di sintassi emergono subito con il messaggio del motore stesso, senza dover premere un pulsante. I pattern con match vuoti come a* sono gestiti in sicurezza e gli input fuori controllo sono limitati a 10.000 match, così un .* di troppo non può bloccare la scheda.',
			'I dialetti regex differiscono tra motori — un pattern che funziona qui può richiedere aggiustamenti per PCRE, RE2 o il modulo re di Python, soprattutto su supporto al lookbehind, quantificatori possessivi e flag inline.'
		],
		faqs: [
			{
				q: 'Quale dialetto regex usa questo tester?',
				a: "ECMAScript (JavaScript), come implementato dal tuo browser. Supporta lookahead, lookbehind, gruppi di cattura con nome, backreference ed escape di proprietà Unicode come \\p{Letter} (con il flag u). Non supporta la sintassi esclusiva di PCRE come quantificatori possessivi o ricorsione."
			},
			{
				q: 'Perché il mio pattern matcha tutto / niente?',
				a: 'Le due cause classiche: un metacarattere non escapato (. matcha qualsiasi carattere — escapalo come \\. per un punto letterale), oppure un flag g dimenticato a mente — questo tester trova sempre tutti i match, ma il tuo codice troverà solo il primo se g non è impostato.'
			},
			{
				q: 'Cosa sono i gruppi di cattura con nome?',
				a: 'La sintassi (?<name>...) etichetta un gruppo così puoi leggere i match per nome invece che per posizione: match.groups.name in JavaScript. Il pannello dei gruppi sotto i match mostra per ciascun match sia le catture numerate sia quelle con nome.'
			},
			{
				q: 'Una regex scritta qui gira senza modifiche in Python o Go?',
				a: 'Spesso, ma non sempre. Classi di caratteri, quantificatori e ancore sono portabili; lookbehind, sintassi dei gruppi con nome (Python usa (?P<name>...)) e flag inline differiscono. Il motore RE2 di Go, in più, rifiuta del tutto backreference e lookaround.'
			}
		]
	},

	'diff-checker': {
		about: [
			'Incolla il testo originale a sinistra e la versione modificata a destra e ottieni un confronto unificato riga per riga: cancellazioni in rosso, aggiunte in verde, contesto preservato nel mezzo, con i numeri di riga originali su entrambi i lati. È il modo più rapido per rispondere a "cosa è cambiato davvero?" tra due config, due risposte API o due versioni di uno snippet incollato in chat.',
			'Il confronto usa un algoritmo di longest common subsequence sulle righe, la stessa famiglia di algoritmi dietro git diff, quindi blocchi riordinati e piccole modifiche producono un risultato leggibile invece di segnare tutto come cambiato. Una riga di riepilogo totalizza le righe aggiunte e rimosse.',
			'Poiché entrambi i testi restano nella pagina, fare il diff di materiale riservato — contratti, credenziali nei config, testi non ancora pubblicati — non comporta nessuno dei rischi di incollarlo in un servizio web qualunque.'
		],
		faqs: [
			{
				q: 'Il diff lavora sulle parole o sulle righe?',
				a: 'Sulle righe. Ogni riga viene confrontata come unità, il che rispecchia come gli sviluppatori leggono i diff di codice e config. Una riga modificata appare quindi come una cancellazione più un’aggiunta; l’evidenziazione inline a livello di carattere è nella roadmap.'
			},
			{
				q: 'Perché il mio diff mostra tutto come cambiato?',
				a: 'Di solito sono differenze invisibili: un lato usa tab e l’altro spazi, terminatori di riga CRLF di Windows contro LF di Unix, o spazi in coda. Normalizzare gli spazi prima del confronto (per i payload JSON aiuta il formatter JSON con le chiavi ordinate) rende visibili le modifiche vere.'
			},
			{
				q: 'Posso fare un diff sensato di due risposte JSON?',
				a: 'Sì — prima passa entrambe dal formatter JSON con l’ordinamento delle chiavi abilitato, così i documenti equivalenti si serializzano in modo identico. A quel punto il diff mostra i cambi di valore reali invece del rumore da ordine delle chiavi.'
			},
			{
				q: 'C’è una dimensione massima del testo?',
				a: 'L’algoritmo confronta ogni riga di un testo con ogni riga dell’altro, quindi file estremamente grandi (decine di migliaia di righe su entrambi i lati) possono richiedere un momento. File di codice e payload API tipici si confrontano all’istante.'
			}
		]
	},

	'url-encode-decode': {
		about: [
			'Caratteri come spazi, e commerciali e lettere non ASCII non possono comparire così come sono in un URL, quindi vengono percent-encoded: uno spazio diventa %20, 你 diventa %E4%BD%A0. Questo strumento codifica il testo per inserirlo in sicurezza negli URL e decodifica le stringhe con percent-escape riportandole a testo leggibile, inclusa la convenzione del + per gli spazi usata nelle query string.',
			'Sono offerte due modalità di codifica perché JavaScript stesso ne ha due: la modalità componente (encodeURIComponent) escapa tutto ciò che potrebbe delimitare un URL, ed è quella che vuoi per un singolo valore di query string; la modalità URI completo (encodeURI) preserva i caratteri strutturali come /, ? e &, per quando stai codificando un intero URL che deve restare navigabile.',
			'La decodifica è rigorosa sulle sequenze % malformate — un % isolato o %ZZ viene segnalato come errore invece di passare in silenzio, che è esattamente come lo tratteranno browser e server.'
		],
		faqs: [
			{
				q: 'Quando uso la modalità componente e quando quella URI completo?',
				a: 'Se codifichi un valore che va dentro un URL (una query di ricerca, un target di redirect, un indirizzo email in un parametro) → modalità componente, così & e = dentro il valore non rompono la query string. Se codifichi un URL completo per la visualizzazione o il trasporto → modalità URI completo, così la struttura dell’URL sopravvive.'
			},
			{
				q: 'Perché + a volte significa spazio?',
				a: 'Il formato application/x-www-form-urlencoded — usato dagli invii dei form HTML e dalle query string — storicamente codifica gli spazi come +. Nei percorsi degli URL, + è solo un più. Il decoder qui tratta + come spazio, secondo la semantica delle query string; %20 funziona sempre ovunque.'
			},
			{
				q: 'Perché la mia stringa è doppiamente codificata (%2520)?',
				a: '%25 è la codifica di % stesso, quindi %2520 significa che il testo %20 è stato codificato una seconda volta. Succede quando due livelli di un sistema codificano entrambi. Esegui la decodifica due volte qui per srotolarla, poi sistema il livello che non dovrebbe codificare.'
			},
			{
				q: 'I caratteri Unicode sono gestiti correttamente?',
				a: 'Sì — il testo viene prima codificato in UTF-8 e ogni byte viene percent-escaped, secondo lo standard WHATWG URL. Ecco perché un carattere CJK diventa tre gruppi %XX.'
			}
		]
	},

	'url-parser': {
		about: [
			'Incolla un URL e guardalo sezionato: protocollo, host, porta, path, fragment e ogni parametro di query in una tabella chiave-valore già decodificata. Usa lo stesso parser WHATWG URL che il tuo browser usa per la navigazione, quindi l’interpretazione che vedi è quella che un browser applicherà davvero — compresi i casi limite come le porte di default che vengono omesse e i path normalizzati.',
			'La tabella dei parametri di query è la parte che userai di più: lunghi redirect OAuth, link taggati per l’analytics e chiamate API diventano leggibili a colpo d’occhio, con ogni valore già percent-decodificato. Sono accettati anche domini nudi senza schema; per il parsing viene assunto https://.',
			'Si abbina naturalmente all’encoder URL — analizza qui un URL per trovare il parametro che ti serve, modifica il valore e poi ricodificalo là.'
		],
		faqs: [
			{
				q: 'Perché l’URL analizzato differisce leggermente da quello che ho incollato?',
				a: 'Il parser WHATWG normalizza: mette in minuscolo schema e host, rimuove le porte di default (:443 per https), risolve i segmenti di path ./ e ../ e codifica i caratteri che lo richiedono. Ciò che vedi è la forma canonica su cui server e browser concordano.'
			},
			{
				q: 'Gestisce URL con chiavi di query duplicate?',
				a: 'Sì — ogni occorrenza è elencata come riga a sé, in ordine. Le chiavi duplicate sono legali e comuni: molte API le leggono come array (?tag=a&tag=b).'
			},
			{
				q: 'Qual è la differenza tra host e hostname?',
				a: 'hostname è solo il dominio (example.com); host include un’eventuale porta esplicita non di default (example.com:8080). Quando la porta è quella di default dello schema, i due coincidono perché la porta viene omessa.'
			},
			{
				q: 'Il fragment (#...) viene inviato al server?',
				a: 'No. Tutto ciò che segue # resta nel browser — i server non lo vedono mai. È il motivo per cui le single-page app lo usavano storicamente per il routing lato client, e perché i parametri di analytics messi dopo # sono invisibili al backend.'
			}
		]
	},

	'uuid-generator': {
		about: [
			'Genera identificatori universalmente unici in quattro varianti: UUID v4 (completamente casuale, il default di tutti i giorni), UUID v7 (ordinato nel tempo, la scelta moderna per le chiavi di database), ULID (ordinato nel tempo con una compatta scrittura Crockford Base32) e Nano ID (corto, adatto agli URL). Generane uno o fino a mille alla volta — uno per riga, pronti da incollare in uno script di seed.',
			'La casualità viene dalla Web Crypto API (crypto.getRandomValues), la sorgente crittograficamente sicura, non da Math.random. La generazione è locale, il che significa che gli ID non sono noti a nessun altro, non sono registrati da nessuna parte e sono disponibili offline.',
			'Se stai scegliendo un formato di ID per un nuovo sistema: v7 e ULID si ordinano per istante di creazione, il che tiene felici gli indici B-tree e rende gli ID grosso modo cronologici nei log; v4 non rivela nulla su quando è stato creato, che a volte è esattamente ciò che vuoi.'
		],
		faqs: [
			{
				q: 'Qual è la differenza tra UUID v4 e v7?',
				a: 'v4 sono 122 bit casuali. v7 (RFC 9562) inizia con un timestamp Unix in millisecondi a 48 bit seguito da bit casuali, quindi gli ID generati dopo si ordinano dopo. Per le chiavi primarie di database v7 di norma migliora la località degli insert e la dimensione degli indici; v4 resta valido dove l’ordinamento è irrilevante o il timing non deve trapelare.'
			},
			{
				q: 'Due UUID generati possono collidere?',
				a: 'Con 122 bit casuali la probabilità è così piccola che non vale la pena progettarci attorno: dovresti generare miliardi di ID al secondo per decenni per avvicinarti anche solo a una possibilità remota. Le collisioni nella pratica nascono dai bug (riutilizzare un seed, copiare righe), non dalla casualità.'
			},
			{
				q: 'Perché scegliere ULID invece di UUID v7?',
				a: 'Risolvono lo stesso problema. ULID sono 26 caratteri di Crockford Base32 insensibile alle maiuscole — più corto e pulito in URL e log — mentre v7 mantiene la forma standard UUID a 36 caratteri che ogni database e libreria già accetta. Scegli quello che il tuo ecosistema gestisce più nativamente.'
			},
			{
				q: 'Questi ID sono sicuri da usare come segreti o token?',
				a: 'La casualità è crittograficamente sicura, ma gli ID di solito vengono mostrati, loggati e indicizzati — trattati come pubblici. Per token di sessione o chiavi API genera un segreto dedicato con almeno 128 bit casuali e trattalo come una password.'
			}
		]
	},

	'hash-generator': {
		about: [
			'Calcola i digest MD5, SHA-1, SHA-256, SHA-384 e SHA-512 di qualsiasi testo, più le firme HMAC con chiave, direttamente nel browser. La famiglia SHA e HMAC usano la Web Crypto API — le stesse primitive verificate che il tuo browser usa per TLS — mentre MD5 (che Web Crypto omette deliberatamente) arriva come piccola implementazione locale per i checksum legacy.',
			'Gli hash si aggiornano in tempo reale mentre digiti e ogni algoritmo viene calcolato insieme agli altri, così confrontare un valore con un checksum in qualunque algoritmo abbia scelto una pagina di download non richiede alcuna configurazione. La modalità HMAC aggiunge un campo per la chiave segreta per verificare le firme dei webhook — GitHub, Stripe e la maggior parte dei provider di webhook firmano i payload con HMAC-SHA256.',
			'Poiché l’input non lascia mai la pagina, è sicuro fare l’hash di cose che non potresti incollare in un servizio online: payload API, password che stai confrontando con una lista di hash trapelati, documenti interni.'
		],
		faqs: [
			{
				q: 'Quale algoritmo di hash dovrei usare?',
				a: 'Per qualsiasi cosa rilevante per la sicurezza oggi: SHA-256 o più forte. MD5 e SHA-1 sono rotti per la resistenza alle collisioni — si possono costruire due input diversi con lo stesso digest — quindi sopravvivono solo per checksum non avversariali e compatibilità con protocolli legacy.'
			},
			{
				q: 'Perché MD5 è ancora offerto?',
				a: 'Perché lo incontri ancora: ETag, chiavi di cache, manifest di file, vecchie colonne di database. Verificare quei valori richiede di calcolare MD5 a prescindere dal suo status crittografico. Semplicemente non progettarci sopra niente di nuovo.'
			},
			{
				q: 'Cos’è HMAC e in cosa differisce da un hash semplice?',
				a: 'HMAC mescola una chiave segreta nell’hashing, così solo chi possiede la chiave può produrre o verificare il digest. Un hash semplice dimostra l’integrità ("questi dati non sono cambiati"); un HMAC dimostra anche l’autenticità ("qualcuno con la chiave lo ha prodotto"). La verifica delle firme dei webhook è l’uso quotidiano.'
			},
			{
				q: 'Fare l’hash di una password equivale a cifrarla?',
				a: 'No, e gli hash veloci come SHA-256 sono lo strumento sbagliato per conservare password — un attaccante può provarne miliardi al secondo. La memorizzazione delle password richiede un algoritmo deliberatamente lento e con salt: bcrypt, scrypt o Argon2.'
			}
		]
	},

	'case-converter': {
		about: [
			'Gli identificatori migrano continuamente tra convenzioni: l’API restituisce snake_case, il tuo TypeScript vuole camelCase, la classe CSS richiede kebab-case e la variabile d’ambiente pretende CONSTANT_CASE. Questo convertitore prende qualsiasi input misto — spazi, underscore, trattini, camelCase esistente — lo divide in parole in modo intelligente e lo ricompone in nove stili di destinazione contemporaneamente.',
			'Lo splitter capisce i casi difficili: spezza "getUserByID" in get/user/by/id (mantenendo intatto l’acronimo fino al confine), tratta le cifre come parte della loro parola ed elabora ogni riga in modo indipendente, così puoi incollare un’intera colonna di campi di database e convertirli in un colpo solo.',
			'Ogni stile è mostrato in simultanea con un pulsante di copia per riga — niente modalità da scegliere prima, incolla e prendi quello che ti serve.'
		],
		faqs: [
			{
				q: 'Come vengono gestiti gli acronimi tipo "HTTPResponse"?',
				a: 'Una sequenza di maiuscole seguita da una minuscola viene spezzata prima dell’ultima maiuscola: HTTPResponse → http + response. Corrisponde a come la maggior parte delle style guide si aspetta che gli acronimi vengano tokenizzati, anche se nessuno splitter può indovinare l’intento alla perfezione — casi limite come "IOError" diventano io + error.'
			},
			{
				q: 'Posso convertire molti identificatori in una volta?',
				a: 'Sì — ogni riga viene convertita in modo indipendente. Incolla una lista di nomi di colonna, uno per riga, e l’output preserva la struttura delle righe nel nuovo stile.'
			},
			{
				q: 'Che differenza c’è qui tra Title Case e Sentence case?',
				a: 'Title Case mette la maiuscola a ogni parola ("User Account Id"); Sentence case solo alla prima ("User account id"). Nessuno dei due applica le regole editoriali su articoli e preposizioni — per gli identificatori non le vuoi quasi mai.'
			},
			{
				q: 'Perché convertire avanti e indietro non sempre ripristina l’originale?',
				a: 'Dividere in parole scarta informazione — "user_ID_2" e "userId2" si tokenizzano in modo identico. Le conversioni sono deterministiche in avanti, ma la grafia originale dei confini di parola non sempre può essere ricostruita all’indietro.'
			}
		]
	},

	'word-counter': {
		about: [
			'Un contatore di parole e caratteri in tempo reale con i numeri che servono davvero a sviluppatori e autori: parole, caratteri con e senza spazi, byte UTF-8 (ciò che la colonna del tuo database o il limite dell’API misurano realmente), righe, frasi, paragrafi e un tempo di lettura stimato a 220 parole al minuto.',
			'I caratteri sono contati come code point Unicode, non come unità UTF-16, quindi emoji e testo CJK vengono contati come una persona si aspetterebbe — e il conteggio dei byte separato rende visibile la differenza: 日本語 sono 3 caratteri ma 9 byte. È esattamente la distinzione che ti morde quando una colonna VARCHAR(255) rifiuta una stringa da 200 "caratteri".',
			'Tutto si aggiorna mentre digiti, senza che nulla venga inviato da nessuna parte — sicuro per contare bozze di annunci, contratti o qualunque cosa non ancora pronta per il mondo.'
		],
		faqs: [
			{
				q: 'Perché il conteggio dei caratteri e quello dei byte differiscono?',
				a: 'I caratteri sono code point Unicode; i byte sono la loro codifica UTF-8. Le lettere ASCII occupano 1 byte ciascuna, la maggior parte delle lettere accentate europee 2, i caratteri CJK 3 e le emoji 4 (o più nelle sequenze). Limiti di database, header HTTP e molte API misurano byte, non caratteri.'
			},
			{
				q: 'Come vengono contate le parole nelle lingue senza spazi?',
				a: 'Il conteggio delle parole divide sugli spazi bianchi, il che sottostima il testo non segmentato in cinese o giapponese. Per quelle lingue il conteggio dei caratteri è la metrica più significativa, ed è il motivo per cui vengono mostrati sempre entrambi.'
			},
			{
				q: 'Cosa conta come frase?',
				a: 'Una sequenza di testo che termina con ., !, ? o … seguita da spazio o dalla fine dell’input. Abbreviazioni come "e.g." possono gonfiare leggermente il conteggio — contare le frasi è per natura euristico.'
			},
			{
				q: 'Quanto è accurato il tempo di lettura?',
				a: 'Divide il numero di parole per 220 wpm, una media comune per la lettura silenziosa adulta di prosa generica. Il materiale tecnico con codice si legge più lentamente; i listicle scorribili più in fretta. Trattalo come una stima di ordine di grandezza.'
			}
		]
	},

	'lorem-ipsum-generator': {
		about: [
			'Testo segnaposto per layout, mockup e dati di seed, generato nel tuo browser: scegli parole, frasi o paragrafi, imposta una quantità e copia. L’output attinge dal classico vocabolario del Cicerone rimescolato, così sembra prosa pseudo-latina naturale senza formare frasi leggibili che distraggono.',
			'Per impostazione predefinita il testo si apre con il tradizionale "Lorem ipsum dolor sit amet" — la frase che designer e revisori riconoscono all’istante come segnaposto — e puoi disattivarla per un output completamente casuale quando ti servono più blocchi distinti.',
			'Le lunghezze delle frasi e le dimensioni dei paragrafi variano casualmente entro intervalli realistici, così il testo risultante ha il ritmo visivo di un testo vero — importante quando stai valutando tipografia o a capo, dove frasi tutte uguali sembrano artificiali.'
		],
		faqs: [
			{
				q: 'Da dove viene il lorem ipsum?',
				a: 'Sono frammenti rimescolati del "De finibus bonorum et malorum" di Cicerone (45 a.C.), usati come riempitivo dai tipografi almeno dagli anni ’60 e resi popolari dai fogli Letraset e poi dal desktop publishing.'
			},
			{
				q: 'Perché usare lorem ipsum invece di testo vero?',
				a: 'Il contenuto leggibile sequestra l’attenzione — i revisori iniziano a correggere le parole invece di giudicare il layout. Lo pseudo-latino ha frequenze di lettere e lunghezze di parola naturali senza essere leggibile, il che mantiene il focus sul design.'
			},
			{
				q: 'Il testo generato è sempre lo stesso?',
				a: 'No — le parole vengono estratte casualmente ogni volta, quindi due generazioni differiscono. Solo la frase di apertura classica opzionale è fissa.'
			},
			{
				q: 'Posso generare un numero preciso di parole per il limite di un campo CMS?',
				a: 'Sì — imposta l’unità su parole e la quantità esattamente su ciò che ti serve, fino a 1000 alla volta. Abbinalo al contatore di parole per verificare i limiti di caratteri o byte.'
			}
		]
	},

	'slug-generator': {
		about: [
			'Trasforma qualsiasi titolo in uno slug pronto per l’URL: minuscolo, separato da trattini, ripulito dalla punteggiatura, con gli accenti traslitterati in ASCII puro — "Crème brûlée à Paris" diventa "creme-brulee-a-paris". Le opzioni coprono le varianti comuni: separatori underscore, maiuscole preservate e una lunghezza massima che taglia sul confine di parola invece che a metà.',
			'Gli slug contano sia per gli esseri umani sia per i motori di ricerca: sono leggibili nella barra degli indirizzi, sopravvivono al copia-incolla in chat senza percent-escape e danno ai risultati di ricerca un URL portatore di parole chiave. Il passo di traslitterazione è quello che la maggior parte delle funzioni slugify fatte in casa salta — senza, i titoli accentati o rompono gli URL o spariscono del tutto.',
			'Ogni riga viene slugificata in modo indipendente, così una lista incollata di titoli di articoli diventa in una sola operazione la lista corrispondente di slug.'
		],
		faqs: [
			{
				q: 'Perché trattini invece di underscore?',
				a: 'I motori di ricerca trattano i trattini come separatori di parole ma storicamente trattavano gli underscore come congiunzioni, e i trattini sono visivamente più chiari nel testo dei link sottolineato. Gli underscore restano popolari per nomi di file e identificatori, quindi sono offerti entrambi.'
			},
			{
				q: 'Cosa succede agli alfabeti non latini come il cinese o il cirillico?',
				a: 'I caratteri con un equivalente ASCII (latino accentato, alcune lettere speciali come ß → ss) vengono traslitterati; gli alfabeti senza una mappatura latina semplice vengono rimossi. Per i contenuti non latini la prassi comune è mantenere l’alfabeto nativo percent-encoded nell’URL oppure scrivere a mano uno slug romanizzato.'
			},
			{
				q: 'Esiste una lunghezza ideale per uno slug?',
				a: 'Più corto è meglio per condivisione e visualizzazione, ma non c’è un precipizio di ranking. L’opzione di lunghezza massima taglia sul confine di parola — utile per i CMS che limitano le colonne degli slug a 50–80 caratteri.'
			},
			{
				q: 'Lo slug dovrebbe cambiare quando cambia il titolo?',
				a: 'Una volta pubblicato, idealmente no — l’URL è un indirizzo a cui altri hanno linkato. La maggior parte dei siti mantiene lo slug originale o aggiunge un redirect. Genera gli slug al momento della creazione e tratta le rinomine come una decisione deliberata di redirect.'
			}
		]
	},

	'sort-lines': {
		about: [
			'Un banco di lavoro per elaborare righe: incolla qualsiasi lista e ordinala alfabeticamente, al contrario, in modo naturale (item2 prima di item10), per lunghezza, o mescolala — con la possibilità di rifilare gli spazi, eliminare le righe vuote e rimuovere i duplicati preservando l’ordine. Il numero di righe rimosse viene riportato, così vedi esattamente cosa ha fatto la deduplicazione.',
			'L’ordinamento naturale è l’opzione che userai di più: l’ordinamento alfabetico puro mette "item10" prima di "item2" perché confronta carattere per carattere, mentre quello naturale confronta i numeri incorporati come numeri — l’ordine che le persone si aspettano per nomi di file, versioni e ID.',
			'La deduplicazione mantiene la prima occorrenza e preserva l’ordine originale dei sopravvissuti, cosa che conta quando l’ordine della lista è significativo (import, righe di config, playlist). Una modalità senza distinzione tra maiuscole e minuscole tratta "Apple" e "apple" come la stessa riga.'
		],
		faqs: [
			{
				q: 'Qual è la differenza tra ordinamento alfabetico e naturale?',
				a: 'L’alfabetico confronta i codici dei caratteri, quindi "file10" < "file2" (perché "1" < "2" alla posizione 5). L’ordinamento naturale riconosce le sequenze di cifre e le confronta come numeri, ottenendo file2 < file10. Usa quello naturale per qualsiasi cosa contenga numeri.'
			},
			{
				q: 'La deduplicazione mantiene la prima o l’ultima occorrenza?',
				a: 'La prima. Le righe vengono scandite dall’alto in basso e una riga viene scartata solo se una identica (o uguale a meno di maiuscole, in modalità case-insensitive) è comparsa prima — così l’ordine dei sopravvissuti coincide con l’originale.'
			},
			{
				q: 'Quanto può essere grande la lista?',
				a: 'Centinaia di migliaia di righe vanno benissimo — le operazioni sono semplici passaggi più un ordinamento. Tutto resta nella memoria del browser, quindi il limite pratico è la tua macchina, non la quota di un server.'
			},
			{
				q: 'Posso combinare le operazioni?',
				a: 'Sì, e si applicano in un ordine sensato: prima il trim, poi la rimozione delle vuote, poi la deduplicazione, poi l’ordinamento — così " apple " e "apple" si deduplicano insieme quando il trim è attivo, e l’ordinamento vede sempre la lista ripulita.'
			}
		]
	},

	'html-entities': {
		about: [
			'Escapa il testo per includerlo in sicurezza nell’HTML — & diventa &amp;amp;, < diventa &amp;lt; — o decodifica testo pieno di entità riportandolo a caratteri leggibili, coprendo entità con nome (&amp;rarr;), riferimenti numerici decimali (&amp;#169;) ed esadecimali (&amp;#xA9;).',
			'La codifica offre due livelli: i cinque caratteri essenziali che rompono la struttura HTML (&amp; &lt; &gt; " \'), che è tutto ciò che serve per la correttezza, oppure tutto ciò che non è ASCII, utile quando una toolchain rovina l’UTF-8 da qualche parte tra te e la pagina. Una modalità solo numerica salta le entità con nome per la massima compatibilità con i parser XML rigorosi, che garantiscono solo le cinque predefinite.',
			'Il decoder è la metà di uso quotidiano: incolla uno snippet raschiato o una risposta API piena di &amp;#x27; e ottieni testo pulito. I nomi di entità sconosciuti passano intatti invece di essere indovinati.'
		],
		faqs: [
			{
				q: 'Quali caratteri devono essere escapati in HTML?',
				a: 'Nel contenuto testuale: & e <. Nei valori degli attributi: anche il carattere di virgoletta che delimita l’attributo (" o \'). Escapare > è convenzionale ma non strettamente richiesto. Tutto il resto può comparire letteralmente in un documento UTF-8.'
			},
			{
				q: 'La codifica in entità è una difesa contro l’XSS?',
				a: 'Escapare i cinque caratteri strutturali è il cuore dell’output encoding in contesto HTML, sì — ma solo per i contesti di testo e attributi HTML. URL, stringhe JavaScript e CSS richiedono ciascuno la propria codifica specifica di contesto; l’escape delle entità da solo non rende sicura l’iniezione arbitraria lì.'
			},
			{
				q: 'Entità con nome o numeriche — quali dovrei emettere?',
				a: 'I riferimenti numerici (&amp;#xE9;) funzionano in ogni parser HTML e XML. Le entità con nome sono più leggibili, ma XML ne predefinisce solo cinque, quindi &amp;eacute; rompe una pipeline XML/XHTML rigorosa. Nel dubbio, numeriche.'
			},
			{
				q: 'Perché vedo &amp;amp;#39; (doppia codifica) nei miei dati?',
				a: 'Due livelli hanno codificato una volta ciascuno: la &amp; della prima codifica è stata a sua volta escapata da un secondo passaggio. Decodifica due volte qui per recuperare il testo, poi trova e sistema il livello che non dovrebbe codificare.'
			}
		]
	},

	'unicode-inspector': {
		about: [
			'Incolla qualsiasi testo e guarda ogni carattere sezionato: il suo code point (U+XXXX), i byte UTF-8, le unità UTF-16, la sequenza di escape JavaScript, l’entità HTML e la categoria generale — più i totali per code point, unità UTF-16, byte UTF-8 e caratteri percepiti dall’utente (grapheme cluster).',
			'È lo strumento per i momenti "perché questa stringa è strana?": i caratteri invisibili (zero-width space, BOM, marcatori direzionali) compaiono come righe visibili; i caratteri sosia (а cirillica contro a latina) rivelano code point diversi; e un’emoji che "è un solo carattere" si scopre essere sette code point uniti da zero-width joiner.',
			'I quattro diversi totali di lunghezza rispondono all’eterna domanda del perché la .length di JavaScript, un limite in byte di database e ciò che l’utente vede non sono mai d’accordo su quanto è lunga una stringa.'
		],
		faqs: [
			{
				q: 'Perché "🎉".length === 2 in JavaScript?',
				a: 'Le stringhe JavaScript contano unità di codice UTF-16. I caratteri oltre U+FFFF — inclusa la maggior parte delle emoji — richiedono una coppia surrogata, cioè due unità. L’inspector mostra sia le unità sia il code point reale, e il riepilogo li conta separatamente.'
			},
			{
				q: 'Cos’è un grapheme cluster?',
				a: 'Ciò che un lettore percepisce come un solo carattere. é può essere due code point (e + accento combinante), e le emoji di famiglia possono essere sette o più uniti da zero-width joiner. Il conteggio dei grafemi usa Intl.Segmenter del browser — la cosa più vicina ai "caratteri come li vedono gli utenti".'
			},
			{
				q: 'Come trovo i caratteri invisibili in una stringa?',
				a: 'Incollala qui — ogni code point ottiene una riga, inclusi zero-width space (U+200B), no-break space (U+00A0), BOM (U+FEFF) e marcatori direzionali, ciascuno etichettato per categoria. Sono i classici colpevoli dietro stringhe "identiche" che falliscono i controlli di uguaglianza.'
			},
			{
				q: 'Cosa mi dicono le sequenze di byte UTF-8?',
				a: 'Esattamente ciò che verrà memorizzato o trasmesso: ASCII è un byte, la maggior parte delle estensioni latine due, i CJK tre, le emoji quattro. Se un sistema tronca a metà sequenza ottieni caratteri di sostituzione (�) — la vista dei byte mostra dove cadrebbero quei tagli.'
			}
		]
	},

	'cron-parser': {
		about: [
			'Incolla un’espressione cron a cinque campi e ottienila spiegata in linguaggio chiaro, con una scomposizione campo per campo e — la parte che intercetta gli errori veri — le prossime cinque esecuzioni effettive calcolate nel tuo fuso orario locale. "0 3 * * 1" si legge come "alle 03:00, di lunedì", seguito dalle date concrete in cui scatterà.',
			'Il parser supporta l’intera sintassi standard: liste (1,15), intervalli (9-17), passi (*/15), nomi di mesi e giorni (jan, mon), 7 come domenica e la famiglia di macro @daily/@hourly. Implementa anche la regola che tutti dimenticano: quando sia il giorno del mese sia il giorno della settimana sono vincolati, il job gira quando uno dei due corrisponde, non entrambi.',
			'Le espressioni a sei campi (Quartz, con i secondi) vengono riconosciute e segnalate esplicitamente invece di essere interpretate male in silenzio — la fonte più comune di confusione da "il mio cron è sbagliato" passando tra scheduler Java e crontab Unix.'
		],
		faqs: [
			{
				q: 'Quali sono i cinque campi, in ordine?',
				a: 'Minuto (0–59), ora (0–23), giorno del mese (1–31), mese (1–12), giorno della settimana (0–6, domenica = 0, con 7 accettato anch’esso come domenica). Ricordarne l’ordine è la fatica eterna — il pannello di scomposizione etichetta ogni campo della tua espressione.'
			},
			{
				q: 'Perché "0 0 1 * 1" gira più spesso di quanto mi aspettassi?',
				a: 'Perché quando sono vincolati sia il giorno del mese (il 1°) sia il giorno della settimana (lunedì), cron esegue il job quando UNO dei due corrisponde — ogni 1° del mese E ogni lunedì. Per dire "il 1° solo quando è lunedì" serve un controllo della data lato script.'
			},
			{
				q: 'Quale fuso orario usano i prossimi orari di esecuzione?',
				a: 'Il fuso locale del tuo browser, mostrato accanto ai risultati. I crontab reali girano nel fuso del server (o nella riga TZ= di alcuni cron) — verifica sempre cosa usa la macchina di destinazione, specialmente attraverso i cambi di ora legale.'
			},
			{
				q: 'Supporta secondi o anni?',
				a: 'No — quelle sono estensioni Quartz (Java) con 6 o 7 campi. Il cron Unix standard ha esattamente cinque campi e risoluzione al minuto. L’input a sei campi viene riconosciuto e segnalato come Quartz invece di essere letto male.'
			}
		]
	},

	'password-generator': {
		about: [
			'Genera password casuali con lunghezza e set di caratteri a scelta, anche in blocco, con un calcolo onesto dell’entropia — bit di casualità, non una barra colorata decorativa. La casualità viene da crypto.getRandomValues con rejection sampling, quindi ogni carattere è estratto uniformemente senza bias da modulo.',
			'A ogni set di caratteri abilitato è garantito almeno un rappresentante (una policy che molti siti impongono), poi il resto della password si riempie uniformemente e il tutto viene mescolato — così i caratteri garantiti non si raggruppano prevedibilmente all’inizio.',
			'Un filtro per i caratteri ambigui elimina i sosia (0/O, 1/l/I) per le password che un umano potrebbe mai leggere ad alta voce o ricopiare dalla carta. Poiché la generazione è locale, le password esistono solo sulla tua macchina finché non le metti da qualche parte.'
		],
		faqs: [
			{
				q: 'Cosa significano i bit di entropia?',
				a: 'Entropia = lunghezza × log2(dimensione del pool): il numero di possibilità equiprobabili che un attaccante deve esplorare. 64 bit di entropia resistono a un attacco occasionale; 80+ bit sono robusti contro il cracking offline di hash veloci; 100+ è di fatto inindovinabile. Una password di 16 caratteri su lettere+cifre+simboli è ~104 bit.'
			},
			{
				q: 'Una password lunga di sole minuscole è meglio di una corta e complessa?',
				a: 'Spesso sì — la lunghezza moltiplica l’entropia, mentre i set aggiuntivi allargano solo la base del logaritmo. 20 lettere minuscole (~94 bit) battono 10 caratteri completamente misti (~65 bit). Le regole di complessità esistono soprattutto per sconfiggere le wordlist, che la generazione casuale sconfigge già.'
			},
			{
				q: 'È sicuro generare password in un browser?',
				a: 'La casualità (crypto.getRandomValues) è lo stesso CSPRNG usato dai password manager nativi, e questa pagina non effettua richieste di rete con i tuoi dati. I rischi realistici riguardano ciò che succede dopo la generazione: cronologia degli appunti, condivisione dello schermo e dove la conservi.'
			},
			{
				q: 'Perché escludere i caratteri ambigui?',
				a: 'Per le password che verranno lette da esseri umani — codici di recupero stampati, dettate al telefono, ricopiate da un altro schermo — 0/O e 1/l/I generano ticket di supporto reali. Per le password solo incollate, tienili; la perdita di entropia dell’esclusione è comunque minima.'
			}
		]
	},

	'qr-code-generator': {
		about: [
			'Digita o incolla qualsiasi testo — un URL, le credenziali WiFi, un contatto — e ottieni all’istante un codice QR, reso come SVG vettoriale nitido da scaricare, o esportabile in PNG per chat e slide. Nessun watermark, nessun redirect da "piano gratuito" in scadenza, e poiché la generazione è locale, ciò che codifichi non tocca mai un server.',
			'Quest’ultimo punto conta più di quanto sembri: molti servizi QR gratuiti instradano il tuo URL attraverso il loro dominio di redirect (per poterti far pagare più avanti o tracciare le scansioni), il che significa che il codice smette di funzionare quando il servizio chiude. I codici generati qui codificano il tuo contenuto direttamente e funzionano per sempre.',
			'Quattro livelli di correzione degli errori scambiano capacità con robustezza — L sopravvive a danni leggeri, H sopravvive con il 30% del simbolo coperto (utile quando un logo coprirà il centro o la stampa sarà piccola e rovinata).'
		],
		faqs: [
			{
				q: 'Quale livello di correzione degli errori dovrei scegliere?',
				a: 'M (15%) è il default sensato. Usa H (30%) per codici stampati piccoli, codici dietro un vetro o riflessi, o quando sovrapponi un logo. Una correzione più alta rende il codice più denso, quindi per URL molto lunghi su schermo L mantiene i moduli più grandi e più facili da scansionare.'
			},
			{
				q: 'Perché SVG è meglio di PNG per la stampa?',
				a: 'SVG è indipendente dalla risoluzione — la stampante rasterizza al proprio DPI nativo, mantenendo i bordi dei moduli perfettamente netti a qualsiasi dimensione. Il PNG deve essere generato a una certa dimensione in pixel e può sfocarsi se ridimensionato. Usa SVG per stampa e strumenti di design, PNG per chat e slide.'
			},
			{
				q: 'Quanti dati entrano in un codice QR?',
				a: 'In teoria fino a ~3 KB di byte (versione 40, livello L), ma codici così grandi sono difficili da scansionare dagli schermi. Sotto i 300 caratteri la scansione è affidabile; per gli URL lunghi, accorciali prima — con lo shortener del tuo dominio se la permanenza conta.'
			},
			{
				q: 'Questi codici scadono o tracciano le scansioni?',
				a: 'No. Il contenuto è codificato direttamente nel pattern — nulla passa da questo sito, quindi non c’è nulla che possa scadere e nessuno (noi compresi) vede quando o dove viene scansionato. Il tracciamento delle scansioni richiede per forza un servizio di redirect.'
			}
		]
	},

	'json-to-yaml': {
		about: [
			'Converti tra JSON, YAML e TOML in qualsiasi direzione. Il formato di origine viene rilevato automaticamente mentre incolli — le parentesi suggeriscono JSON, i due punti dopo le chiavi suggeriscono YAML, le [tabelle] suggeriscono TOML — con un override manuale per l’input ambiguo. La conversione passa da un parse vero, quindi l’output è garantito valido, non una trasformazione testuale riga per riga.',
			'Ogni formato ha punti di forza reali: JSON per API e interscambio tra macchine, YAML per config editati a mano (Kubernetes, pipeline CI), TOML per file di configurazione ben tipizzati (Cargo, pyproject). Spostare dati tra loro a mano invita a errori di indentazione e quoting che questa conversione elimina.',
			'Il convertitore è onesto sui limiti dei formati: TOML non ha array al livello superiore né null, e la conversione di documenti simili spiega perché invece di perdere dati in silenzio.'
		],
		faqs: [
			{
				q: 'I commenti sopravvivono alla conversione?',
				a: 'No — JSON non ha una sintassi per i commenti, e la conversione passa dalla struttura dati parsata, che non li trasporta. Convertire YAML → JSON → YAML perde i commenti in modo irreversibile; conserva il file originale quando i commenti contano.'
			},
			{
				q: 'Perché il mio "no" YAML è diventato false?',
				a: 'YAML 1.1 tratta yes/no/on/off come booleani, e il codice paese NO notoriamente diventa false. Il parser qui segue YAML 1.2 (solo true/false), ma i file scritti per parser più vecchi possono ancora sorprendere. Metti tra virgolette le stringhe che sembrano booleani, numeri o date.'
			},
			{
				q: 'Perché il mio JSON non si converte in TOML?',
				a: 'TOML richiede una tabella (oggetto) al livello superiore — array o scalari nudi non possono essere un documento TOML — e non ha null. Ristruttura i dati (avvolgi l’array in una chiave, elimina o dai un default ai null) e la conversione andrà a buon fine.'
			},
			{
				q: 'YAML è un superset di JSON?',
				a: 'In pratica sì — YAML 1.2 parsa virtualmente tutti i documenti JSON, ed è per questo che incollare JSON in un config YAML di solito funziona. Il contrario non è vero: gli anchor, gli scalari multiriga e i tag di YAML non hanno equivalente JSON e vengono espansi o convertiti in stringa alla conversione.'
			}
		]
	},

	'json-to-csv': {
		about: [
			'Incolla un array di oggetti JSON e ottieni un CSV pronto per il foglio di calcolo: gli oggetti annidati vengono appiattiti in nomi di colonna puntati (user.address.city), le colonne sono l’unione di tutte le righe (i valori mancanti diventano celle vuote) e il quoting segue la RFC 4180, così virgole, virgolette e a capo dentro i valori sopravvivono a Excel e Google Sheets.',
			'È la strada più rapida da una risposta API a un foglio che qualcuno può filtrare e pivotare. L’unione delle colonne conta con i dati del mondo reale, dove gli oggetti sono eterogenei — la riga 1 può mancare di campi che la riga 40 ha, e il convertitore lo gestisce invece di andare in errore o perdere dati.',
			'Gli array dentro le righe vengono serializzati come stringhe JSON invece di essere esplosi in colonne — una scelta deliberata che mantiene una riga di input come una riga di output. Un’opzione per il delimitatore punto e virgola copre le localizzazioni in cui Excel si aspetta ; invece di ,.'
		],
		faqs: [
			{
				q: 'Come vengono rappresentati gli oggetti annidati?',
				a: 'Appiattiti con chiavi unite dal punto: {"user":{"name":"Ada"}} diventa una colonna user.name. Così ogni valore scalare resta indirizzabile in un’unica riga di intestazione piatta, che è ciò con cui gli strumenti da foglio di calcolo sanno davvero lavorare.'
			},
			{
				q: 'Cosa succede agli array dentro una riga?',
				a: 'Vengono incorporati come testo JSON in una singola cella (["a","b"]). Esplodere gli array in colonne (tags.0, tags.1…) o in righe extra cambia la forma dei tuoi dati in modi opinabili — incorporarli mantiene la conversione senza perdite e prevedibile.'
			},
			{
				q: 'Perché Excel mostra il mio CSV in una sola colonna?',
				a: 'Impostazioni locali: in gran parte d’Europa Excel si aspetta file separati da punto e virgola, perché la virgola è il separatore decimale. Passa l’opzione del delimitatore al punto e virgola, oppure usa Dati → Da testo/CSV, che permette di specificare il separatore.'
			},
			{
				q: 'Il convertitore gestisce un singolo oggetto (non un array)?',
				a: 'Sì — un oggetto solitario diventa un CSV a una riga. Gli oggetti indicizzati per ID ({"a1":{...},"a2":{...}}) si convertono però come un’unica riga larga; trasformali prima in un array se ogni valore deve essere una riga.'
			}
		]
	},

	'json-to-typescript': {
		about: [
			'Incolla un campione di JSON — una risposta API, un file di configurazione — e ottieni un’interfaccia TypeScript inferita da esso: gli oggetti annidati diventano tipi annidati, gli array ricevono i tipi degli elementi (con union per contenuti misti) e le chiavi che non sono identificatori validi vengono quotate correttamente.',
			'I tipi generati sono un punto di partenza, non un contratto: l’inferenza vede un solo campione, quindi un campo che nel tuo esempio è per caso null viene tipizzato come null, e i campi opzionali assenti le sono semplicemente ignoti. L’output è volutamente essenziale — niente decoratori, niente validazione a runtime — così puoi incollarlo ovunque e rifinirlo.',
			'Per i campi che variano tra le richieste, fai passare un secondo campione e fai il merge a mano, oppure passa a strumenti schema-first (OpenAPI, zod) quando la forma si stabilizza. Per il quotidiano "mi serve solo un tipo per questa risposta", un incolla basta.'
		],
		faqs: [
			{
				q: 'Perché il mio campo nullable è tipizzato solo come null?',
				a: 'L’inferenza vede soltanto il campione che hai incollato. Se lì il campo era null, null è tutto ciò che può sapere. Cambialo in string | null (o qualunque sia il tipo reale) dopo la generazione — oppure incolla un campione in cui il campo è valorizzato.'
			},
			{
				q: 'Come vengono gestiti i campi opzionali?',
				a: 'Non vengono rilevati — un singolo campione non può distinguere "sempre presente" da "presente questa volta". I campi assenti dal campione sono assenti dal tipo. Segna manualmente come opzionali (name?:) i campi che sai che l’API omette.'
			},
			{
				q: 'Cosa producono gli array a tipi misti?',
				a: 'Una union: [1, "a"] inferisce (number | string)[]. Gli array vuoti inferiscono unknown[] perché non c’è alcun elemento da ispezionare — sostituiscilo con il tipo reale degli elementi quando lo conosci.'
			},
			{
				q: 'Dovrei usare i tipi inferiti o una libreria di schemi come zod?',
				a: 'Le interfacce inferite esistono solo a compile time — non validano nulla a runtime. Per strumenti interni e tipizzazione rapida sono perfette; per input non fidato a runtime, definisci uno schema zod/valibot e derivane il tipo statico.'
			}
		]
	},

	'jsonpath-tester': {
		about: [
			"Testa espressioni JSONPath sul tuo JSON e vedi ogni match sia con il valore sia con il suo percorso concreto. Supporta la sintassi che copre l’uso quotidiano: notazione a punto e a parentesi, indici di array (anche negativi), wildcard, union (['a','b']) e discesa ricorsiva ($..price).",
			'L’output del percorso per ogni match è la parte silenziosamente utile: interroga $..id su un documento profondo e ogni risultato ti dice esattamente dove vive ($.data.items[3].id), pronto da incollare nel codice. Trasforma "da qualche parte in questo blob" in un indirizzo esatto.',
			'Le espressioni di filtro ([?(@.price < 10)]) non sono ancora implementate — lo strumento lo dichiara esplicitamente invece di restituire risultati sbagliati. Per l’estrazione strutturale, cioè la maggior parte dell’uso di JSONPath, funziona tutto.'
		],
		faqs: [
			{
				q: 'Qual è la differenza tra $.a.b e $..b?',
				a: '$.a.b segue un percorso esatto: la chiave a alla radice, poi la chiave b al suo interno. $..b (discesa ricorsiva) trova ogni b ovunque nel documento a qualsiasi profondità. La discesa ricorsiva è potente ma può sorprendere — matcha anche chiavi b annidate dentro cose a cui non avevi pensato.'
			},
			{
				q: 'Come accedo a chiavi con spazi o trattini?',
				a: "Notazione a parentesi con virgolette: $['my key'] o $.data['content-type']. La notazione a punto funziona solo per chiavi che sono nomi simili a identificatori validi."
			},
			{
				q: 'Gli indici di array negativi funzionano?',
				a: 'Sì — [-1] è l’ultimo elemento, [-2] il penultimo, secondo la convenzione resa popolare da Python e adottata dalla RFC 9535. [0] resta il primo elemento.'
			},
			{
				q: 'JSONPath è standardizzato?',
				a: 'Dal 2024 sì — la RFC 9535 ne definisce sintassi e semantica. Le implementazioni scritte prima differiscono nei casi limite (specialmente filtri e union), quindi la stessa espressione può comportarsi diversamente tra librerie; testa con l’implementazione con cui vai in produzione.'
			}
		]
	},

	'bcrypt-generator': {
		about: [
			'Fai l’hash di una password con bcrypt al cost factor scelto, o verifica un testo in chiaro contro un hash esistente — entrambi interamente nel browser, che è esattamente ciò che vuoi quando la cosa in prova è una password. Un ispettore di hash scompone inoltre qualsiasi hash bcrypt in versione, cost e salt.',
			'Bcrypt resta una scelta solida per la memorizzazione delle password perché è deliberatamente lento e con salt per password: il cost factor raddoppia il lavoro a ogni incremento, quindi cost 12 significa 4096 iterazioni del setup del cifrario sottostante. La lettura dei tempi mostra quanto impiega il cost scelto, rendendo concreto il compromesso sicurezza/latenza.',
			'La verifica è il bisogno quotidiano più comune: confermare che un hash in un database corrisponde a una password nota senza tirare su il codice dell’app. Incolla entrambi, ottieni un sì o un no.'
		],
		faqs: [
			{
				q: 'Quale cost factor dovrei usare in produzione?',
				a: 'La regola classica: il più alto che il tuo budget di latenza di login consente, oggi comunemente 10–13. Punta a 100–300 ms per hash sull’hardware di produzione. Il JavaScript nel browser è più lento del nativo, quindi il tempo mostrato qui è un limite superiore per i tuoi server.'
			},
			{
				q: 'Perché la stessa password dà un hash diverso ogni volta?',
				a: 'Per ogni hash viene generato un salt casuale di 16 byte, memorizzato dentro la stringa dell’hash stessa. È così per design — password identiche ottengono hash diversi, sconfiggendo le rainbow table precalcolate. La verifica rilegge il salt dall’hash, ed è per questo che il confronto funziona.'
			},
			{
				q: 'Cosa significano le parti di un hash bcrypt?',
				a: '$2b$12$ + 53 caratteri: 2b è la versione dell’algoritmo, 12 il cost (2^12 iterazioni), i successivi 22 caratteri il salt e gli ultimi 31 il digest — tutto nell’alfabeto base64 proprio di bcrypt. L’ispettore sotto lo strumento scompone qualsiasi hash in questo modo.'
			},
			{
				q: 'Bcrypt è ancora raccomandato rispetto ad Argon2?',
				a: 'Argon2id è oggi la prima scelta per i nuovi sistemi (la memory-hardness resiste al cracking su GPU). Bcrypt resta accettabile e onnipresente — il consiglio pratico è: non migrare in preda al panico uno storage bcrypt funzionante, ma scegli Argon2id per i progetti greenfield. Entrambi sono anni luce oltre gli hash veloci come SHA-256.'
			}
		]
	},

	'user-agent-parser': {
		about: [
			'Incolla una stringa User-Agent da una riga di log, un bug report o un export di analytics e ottienila decodificata: browser e versione, motore di rendering, sistema operativo, tipo di dispositivo e architettura della CPU. Il parser è ua-parser-js, la stessa libreria dietro innumerevoli pipeline di analytics, in esecuzione locale sulla tua stringa.',
			'Le stringhe User-Agent sono siti archeologici — ognuna dichiara ancora di essere Mozilla/5.0, Chrome dice di essere Safari, Safari dice di essere KHTML e la vera identità si nasconde nei token successivi. Un parser batte lo strizzare gli occhi: sa che "CriOS" significa Chrome su iOS e che Edge si nasconde dietro "Edg/".',
			'Nota la direzione del vento: i browser stanno congelando e riducendo le stringhe UA (e Chromium fornisce invece gli UA Client Hints), quindi il dettaglio di versione dal solo UA è sempre più grossolano. Per la forensics dei log e il triage dei bug resta indispensabile; per le decisioni sulle feature, usa la feature detection.'
		],
		faqs: [
			{
				q: 'Perché ogni User-Agent inizia con Mozilla/5.0?',
				a: 'Teatro di compatibilità anni ’90 mai finito: i server sniffavano "Mozilla" per servire pagine moderne, così ogni nuovo browser dichiarò di esserlo, e ciascun browser successivo impersonò i predecessori. Il prefisso è ormai tradizione priva di significato.'
			},
			{
				q: 'Posso fidarmi della versione del sistema operativo in una stringa UA?',
				a: 'Sempre meno ogni anno. macOS ha congelato la sua versione UA a 10_15_7, Windows 11 si presenta come Windows NT 10.0 e i browser con UA ridotto rendono le versioni volutamente grossolane. Tratta le versioni di OS dall’UA come approssimative; usa gli UA Client Hints dove controlli il client.'
			},
			{
				q: 'Cosa significa "like Gecko" o "KHTML, like Gecko"?',
				a: 'Altri strati di impersonificazione: WebKit discende da KHTML e voleva che le pagine con casi speciali per Gecko (il motore di Firefox) funzionassero, quindi aggiunse "like Gecko". Ogni browser WebKit/Blink porta la frase ancora oggi.'
			},
			{
				q: 'Dovrei usare il parsing dell’UA per la feature detection?',
				a: 'No — lo sniffing si rompe nel momento in cui esce una nuova versione di browser. Rileva direttamente la feature (if ("clipboard" in navigator)). Il parsing dell’UA serve ad analytics, analisi dei log e riproduzione dei bug segnalati dagli utenti, dove conoscere l’ambiente è l’intero punto.'
			}
		]
	},

	'color-converter': {
		about: [
			'Inserisci un colore in qualsiasi notazione comune — #hex, rgb(), hsl() o un colore CSS con nome — e ottieni tutti i formati insieme: HEX, RGB, HSL e OKLCH, accanto a un campione dal vivo. I canali alfa sono preservati tra i formati e l’output usa la sintassi CSS moderna (canali separati da spazio) che si incolla pulita nei fogli di stile attuali.',
			'OKLCH è incluso perché è la direzione in cui sta andando il colore in CSS: a differenza di HSL, il suo asse di luminosità è percettivamente uniforme, quindi due colori con la stessa L appaiono davvero ugualmente luminosi, e regolare la tinta non cambia per sbaglio la luminosità percepita. Convertire una palette esistente in OKLCH è il primo passo per costruire scale di colore coerenti.',
			'La matematica di conversione gira localmente usando le trasformazioni pubblicate sRGB↔OKLab, e i valori fanno il giro completo: l’RGB che ottieni da un input HSL è esattamente ciò che calcolerebbe il browser.'
		],
		faqs: [
			{
				q: 'Perché i valori di luminosità di HSL e OKLCH non coincidono?',
				a: 'La lightness di HSL è una proprietà geometrica dei valori RGB, non della visione umana — il giallo hsl(60 100% 50%) appare molto più luminoso del blu hsl(240 100% 50%) nonostante la L identica. L’asse L di OKLCH è progettato per corrispondere alla percezione, quindi L uguale significa luminosità apparente uguale. Quel disaccordo è l’intera ragione per cui OKLCH esiste.'
			},
			{
				q: 'Cosa significa il valore alfa e dove va in ciascun formato?',
				a: 'Alfa è l’opacità, da 0 (trasparente) a 1 (opaco). Nell’hex a 8 cifre è l’ultimo byte (#RRGGBBAA); nella sintassi funzionale moderna segue una barra: rgb(76 141 255 / 0.5). Questo convertitore trasporta l’alfa attraverso ogni formato automaticamente.'
			},
			{
				q: 'Ogni colore OKLCH può essere mostrato in sRGB?',
				a: 'No — OKLCH copre gamut ampi e alcune combinazioni di chroma/luminosità non hanno equivalente sRGB. Convertendo da sRGB (come fa questo strumento) si resta sempre rappresentabili; nell’altro verso, i colori fuori gamut vanno clippati o mappati, ed è per questo che un verde P3 vivido appare più spento su uno schermo sRGB.'
			},
			{
				q: 'Perché rgb(76 141 255) con gli spazi invece delle virgole?',
				a: 'CSS Color Module Level 4 ha standardizzato i canali separati da spazio con un /alpha opzionale, e ogni browser moderno lo supporta. La forma con le virgole funziona ancora, ma quella con gli spazi è ciò che usano le nuove specifiche (e questo strumento).'
			}
		]
	},

	'image-to-base64': {
		about: [
			'Trascina, scegli o incolla un’immagine e ottieni il suo Base64 in tutte le forme che possono servirti: un data URL pronto all’uso, una dichiarazione CSS background-image, un tag <img> completo con le dimensioni reali e il payload Base64 grezzo. Funziona anche al contrario: incolla un data URL o un blocco Base64 nudo e l’immagine viene decodificata, mostrata in anteprima e scaricabile come file.',
			'Il formato viene riconosciuto dai byte magici, non dall’estensione o dal tipo MIME dichiarato: un PNG rinominato in .jpg (o un data URL etichettato male) si converte comunque correttamente. Il pannello delle dimensioni è onesto sul costo: Base64 gonfia i dati di circa un terzo, e la dimensione codificata esatta compare accanto all’originale, così decidi subito se incorporare conviene.',
			'A differenza della maggior parte dei siti immagine-Base64, qui non viene caricato nulla: il file è letto con l’API FileReader del browser e codificato nella pagina. Questo rende lo strumento sicuro per screenshot di dashboard interne, immagini di prodotti non ancora usciti o qualsiasi cosa tu preferisca non consegnare al server di uno sconosciuto.'
		],
		faqs: [
			{
				q: 'Quando conviene incorporare un’immagine in Base64 invece di collegare un file?',
				a: 'Quando l’immagine è piccola (indicativamente sotto i 10 KB), cambia di rado e costerebbe una richiesta HTTP in più — icone, loghi nelle email, documenti HTML a file singolo. Per tutto il resto vince il file separato: si mette in cache indipendentemente, si carica in parallelo e non gonfia il tuo HTML o CSS del 33%.'
			},
			{
				q: 'Perché la versione Base64 è circa un terzo più grande del mio file?',
				a: 'Base64 rappresenta ogni 3 byte binari con 4 caratteri ASCII: un sovraccarico strutturale del +33% (più fino a due caratteri di padding). Gzip o Brotli sul server ne recupera una parte, ma il rigonfiamento è insito nella codifica — scambia dimensione con la possibilità di incorporare binario nel testo.'
			},
			{
				q: 'Posso decodificare un data URL trovato in un foglio di stile o nell’HTML?',
				a: 'Sì — passa a Base64 → immagine e incolla tutto, prefisso data: compreso. Anche i data URL SVG percent-encoded (quelli senza ;base64) si decodificano, e a capo e spazi nel payload vengono rimossi automaticamente. Il risultato si vede in anteprima nella pagina e si scarica con l’estensione giusta.'
			},
			{
				q: 'Funziona con SVG, GIF e ICO o solo con PNG e JPEG?',
				a: 'Tutto ciò che lo sniffer riconosce si converte in Base64: PNG, JPEG, WebP, GIF, SVG, BMP, ICO e AVIF. Per l’SVG in particolare, considera che il sorgente XML è spesso più piccolo e leggibile incorporato così com’è — codificare SVG in Base64 ha senso soprattutto quando virgolette ed escaping diventano un problema.'
			}
		]
	},

	'image-converter': {
		about: [
			'Converti un’immagine tra PNG, JPEG e WebP senza installare niente e senza caricarla da nessuna parte: trascina il file, scegli il formato di destinazione, regola la qualità con lo slider e guarda la dimensione di uscita aggiornarsi in tempo reale. Il riquadro Δ mostra esattamente quanto il file convertito è più piccolo (o più grande): scegliere la qualità smette di essere un tirare a indovinare.',
			'I tre formati hanno mestieri diversi. PNG è lossless con trasparenza completa — giusto per screenshot, asset di interfaccia e tutto ciò che ha bordi netti o testo. JPEG comprime le fotografie in modo aggressivo ma non ha canale alfa e sfuma i bordi duri. WebP batte tipicamente JPEG del 25–35% a qualità comparabile, supporta la trasparenza ed è supportato da tutti i browser attuali — per il web è quasi sempre la risposta.',
			'La conversione avviene su un canvas nel tuo browser: l’immagine viene decodificata, ridisegnata e ricodificata dagli stessi codec che il browser usa per mostrare le pagine. È questo a rendere lo strumento privato — ed è anche il motivo per cui i byte esatti variano leggermente tra Chrome, Firefox e Safari, ognuno col proprio encoder.'
		],
		faqs: [
			{
				q: 'Che qualità dovrei usare per JPEG e WebP?',
				a: 'Tra 75 e 90 copre quasi ogni uso reale. A 85 la maggior parte delle foto è visivamente indistinguibile dall’originale a una frazione della dimensione; sotto ~70 compaiono artefatti a blocchi nei gradienti e negli incarnati; sopra 90 la dimensione sale ripida per guadagni invisibili. Trascina lo slider guardando il riquadro della dimensione: il punto giusto di solito è evidente.'
			},
			{
				q: 'Perché il mio PNG è diventato più grande convertendolo in JPEG?',
				a: 'JPEG è fatto per i gradienti fotografici, non per i colori piatti. Screenshot, diagrammi e grafica di interfaccia si comprimono benissimo come PNG (lunghe serie di pixel identici), ma costringono JPEG a memorizzare rumore attorno a ogni bordo netto — file più grandi e ringing visibile. Tieni la grafica in PNG o convertila in WebP.'
			},
			{
				q: 'Che fine fa la trasparenza convertendo in JPEG?',
				a: 'JPEG non ha canale alfa, quindi le zone trasparenti vanno riempite con qualcosa — questo strumento le appiattisce su bianco, la convenzione per le immagini web. Se la trasparenza deve sopravvivere, scegli PNG o WebP come destinazione.'
			},
			{
				q: 'Perché il mio browser non può esportare AVIF o HEIC qui?',
				a: 'L’API toBlob del canvas codifica solo i formati per cui il browser include un encoder — PNG e JPEG ovunque, WebP in Chromium e Firefox. La codifica AVIF è ancora rara e HEIC è gravato da brevetti: i browser li decodificano ma non li producono. Se scegli un formato che il tuo browser non sa scrivere, lo strumento lo dice invece di rifilarti un PNG in silenzio.'
			}
		]
	},

	'image-resizer': {
		about: [
			'Ridimensiona un’immagine a una larghezza esatta, un’altezza esatta o una percentuale dell’originale — l’altra dimensione segue in automatico, niente viene stirato. Scegli un formato di uscita (o mantieni quello di origine), imposta la qualità per i formati lossy, guarda l’anteprima e scarica. I riquadri prima/dopo mostrano dimensioni e peso del file a colpo d’occhio.',
			'Il ridimensionamento usa la modalità di smoothing di alta qualità del browser, che applica un vero ricampionamento invece della decimazione nearest-neighbor: le foto rimpicciolite restano nitide invece di tremolare di aliasing. Ridurre è anche il modo onesto di alleggerire il file: dimezzare entrambe le dimensioni elimina tre quarti dei pixel, cosa che nessuno slider di qualità può eguagliare.',
			'I file non lasciano mai la pagina: decodifica, ricampionamento e ricodifica girano su un canvas locale. Non c’è barra di avanzamento dell’upload perché non c’è alcun upload — una foto da 40 megapixel si ridimensiona alla velocità con cui la tua macchina riesce a ridisegnarla, e funziona anche col cavo di rete staccato.'
		],
		faqs: [
			{
				q: 'Rimpicciolire e poi ringrandire ripristina la mia immagine?',
				a: 'No — la riduzione scarta pixel per sempre. Portare una foto da 3000px a 300px conserva l’1% dei dati; ringrandirla interpola il 99% mancante come sfocatura. Conserva il file originale ed esporta da lì le copie ridimensionate, invece di ridimensionare l’unica copia che hai.'
			},
			{
				q: 'Perché la mia immagine ingrandita sembra morbida?',
				a: 'L’ingrandimento non può creare dettagli mai catturati — il browser interpola tra i pixel esistenti, e oltre ~2× il risultato appare morbido. Un vero upscaling oltre quella soglia richiede strumenti ML che allucinano dettagli plausibili; un ricampionatore canvas, di proposito, non inventa nulla.'
			},
			{
				q: 'Come raggiungo una dimensione obiettivo, tipo «sotto i 200 KB»?',
				a: 'Usa entrambe le leve: prima ridimensiona alle dimensioni massime davvero necessarie (1200px di larghezza bastano per la maggior parte dei layout web), poi scegli WebP o JPEG e abbassa la qualità finché il riquadro della dimensione scende sotto l’obiettivo. La riduzione delle dimensioni fa il grosso del lavoro — la qualità rifinisce il resto.'
			},
			{
				q: 'Il ridimensionamento elimina i metadati EXIF come la posizione GPS?',
				a: 'Sì. La pipeline canvas ricodifica pixel puri — modello della fotocamera, timestamp, coordinate GPS e ogni altro tag EXIF spariscono dall’output. Per immagini destinate al web pubblico di solito è un vantaggio di privacy; se i metadati ti servono, conserva l’originale a parte.'
			}
		]
	},

	'favicon-generator': {
		about: [
			'Trascina un’immagine — idealmente un logo quadrato da 512px o più — e ottieni il kit favicon completo: un favicon.ico che racchiude 16, 32 e 48 px per schede e segnalibri, PNG nelle dimensioni standard inclusa l’icona touch Apple da 180px e le icone PWA da 192/512px, un site.webmanifest di partenza e i tag <link> da incollare nel tuo <head>. Un unico ZIP contiene tutto, con i nomi esatti che le convenzioni si aspettano.',
			'I dettagli che i tutorial sulle favicon sbagliano spesso qui sono gestiti: l’ICO incorpora voci compresse in PNG (supportate ovunque da Windows Vista in poi, molto più piccole delle vecchie icone BMP); l’icona touch Apple viene appiattita sul colore di sfondo che scegli, perché iOS sostituisce la trasparenza con il nero; e le icone PWA mantengono il canale alfa. Le sorgenti non quadrate vengono ritagliate al centro invece che schiacciate.',
			'Ridurre un logo a 16px è distruttivo per natura — i dettagli fini semplicemente non sopravvivono — quindi la riga di anteprima mostra ogni dimensione nei pixel reali, per giudicare la leggibilità prima di pubblicare. Tutto viene renderizzato su un canvas locale e i contenitori ICO/ZIP sono assemblati byte per byte nella pagina; il tuo logo non viene mai caricato da nessuna parte.'
		],
		faqs: [
			{
				q: 'Quali dimensioni di favicon servono davvero nel 2026?',
				a: 'Meno di quanto dica il folklore: un favicon.ico con 16/32/48 per legacy e barra degli indirizzi, un apple-touch-icon.png da 180px e PNG da 192/512px referenziati dal manifest. I browser moderni scelgono la corrispondenza migliore esattamente da questo set — i pacchetti da 20 file di certi generatori sono culto del cargo.'
			},
			{
				q: 'Perché il mio logo è illeggibile a 16px?',
				a: 'Sedici pixel sono brutalmente pochi — logotipi testuali, tratti sottili e gradienti delicati si dissolvono. Le favicon efficaci riducono il marchio a un solo glifo o forma ad alto contrasto. Se l’anteprima a 16px qui è poltiglia, ritaglia più stretto sulla parte distintiva del marchio o usa una variante semplificata per le dimensioni piccole.'
			},
			{
				q: 'Serve ancora un file .ico o bastano le favicon PNG?',
				a: 'Ogni browser moderno accetta favicon PNG, ma /favicon.ico resta il percorso che user agent, crawler e strumenti datati richiedono alla cieca. Servirci un vero ICO costa pochi kilobyte ed elimina un’intera classe di 404 e stranezze di fallback — tienilo accanto ai tuoi link PNG.'
			},
			{
				q: 'Perché l’icona touch Apple ha bisogno di un colore di sfondo?',
				a: 'iOS non rende la trasparenza nelle icone della schermata home — l’alfa del tuo PNG viene composto su nero. Appiattire in anticipo su un colore scelto mantiene il risultato intenzionale. Scegli lo sfondo adatto alla tua icona e ricorda che iOS arrotonda gli angoli da sé: fornisci un quadrato a tutta area.'
			}
		]
	}
};

export default TOOL_CONTENT_IT;
