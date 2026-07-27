import type { ToolContent } from './content';

/**
 * Polish long-form tool copy (About + FAQ). Written entry by entry against
 * the English content.ts; anything missing falls back to English.
 */
const TOOL_CONTENT_PL: Record<string, ToolContent> = {
	'json-formatter': {
		about: [
			'Wklej dowolny JSON — odpowiedź API, plik konfiguracyjny, wiersz z logu — a ten formater wypisze go czytelnie z wybranym przez Ciebie wcięciem albo zminifikuje do osadzenia w kodzie. Parsowanie korzysta z natywnego silnika JSON w przeglądarce, więc to, co przechodzi walidację tutaj, zaakceptuje też JavaScript i każdy parser zgodny ze standardem.',
			'Gdy wejście jest niepoprawne, błąd zostaje opisany dokładnym wierszem i kolumną, w których parsowanie się wywróciło, zamiast mglistego „unexpected token” gdzieś w dokumencie. W połączeniu z edytorem o stałej szerokości znaku szukanie brakującego przecinka w 500-wierszowym ładunku staje się kwestią dziesięciu sekund. Możesz też posortować klucze obiektów alfabetycznie, co bardzo pomaga przed porównywaniem dwóch ładunków.',
			'Formatowanie działa w całości w Twojej przeglądarce. Ładunki z tokenami, danymi klientów czy wewnętrznymi adresami nigdy nie opuszczają Twojej maszyny — nie ma serwera, który mógłby je zapisać.'
		],
		faqs: [
			{
				q: 'Dlaczego mój JSON zwraca „Unexpected token”, choć wygląda poprawnie?',
				a: 'Zwykle winne są: przecinek po ostatnim elemencie, apostrofy zamiast cudzysłowów, klucze bez cudzysłowów albo komentarze. Wszystko to jest w porządku w literałach obiektów JavaScriptu (czy w JSON5), ale nie w ścisłym JSON-ie. Znacznik wiersza i kolumny wskazuje pierwszy problematyczny znak.'
			},
			{
				q: 'Czy istnieje limit rozmiaru?',
				a: 'Nie ma twardego limitu — parsowanie jest lokalne, więc wszystko zależy od Twojej maszyny. Dokumenty do kilkudziesięciu megabajtów formatują się w nowoczesnej przeglądarce bez problemu; powyżej tego karta może zwolnić, bo cały dokument trzymany jest w pamięci.'
			},
			{
				q: 'Czy formatowanie zmienia moje dane?',
				a: 'Tylko białe znaki, chyba że włączysz sortowanie kluczy. Liczby są ponownie serializowane przez silnik JavaScriptu, więc 1e2 staje się 100, a liczby całkowite spoza precyzji IEEE-754 są normalizowane — dokładnie tak, jak zrobiłby dowolny konsument Twojego JSON-a napisany w JS.'
			},
			{
				q: 'Czy mogę zwalidować JSON bez przeformatowania go?',
				a: 'Tak — plakietka nad polem wejściowym aktualizuje się w trakcie pisania i pokazuje, czy dokument się parsuje, jaki ma rozmiar i gdzie jest pierwszy błąd. Akcja formatowania jest potrzebna dopiero wtedy, gdy chcesz przepisanego wyniku.'
			}
		]
	},

	'base64-decode': {
		about: [
			'Base64 zamienia dowolne bajty w 64-znakowy alfabet, który bez szwanku przechodzi przez JSON, adresy URL, nagłówki HTTP i pocztę. To narzędzie działa w obie strony: wpisz lub wklej tekst, aby go zakodować, albo wklej zakodowany blok, aby odzyskać oryginał. UTF-8 obsługiwane jest poprawnie w obu kierunkach, więc emoji i pisma niełacińskie wracają bez zniekształceń.',
			'Dekoder jest wyrozumiały z rozmysłem: przyjmuje alfabet URL-safe (- i _ zamiast + i /), usuwa białe znaki oraz łamania wierszy i uzupełnia brakujące dopełnienie przed dekodowaniem — czyli trzy rzeczy, przez które surowsze dekodery najczęściej odrzucają dane w pełni możliwe do odzyskania. Jeśli zdekodowane bajty nie są poprawnym tekstem UTF-8, narzędzie mówi to wprost zamiast wypisywać krzaki; zwykle znaczy to, że ładunek był danymi binarnymi, na przykład obrazem.',
			'Wszystko dzieje się na stronie. Zdekodowanie tutaj tokenu albo danych logowania nie wysyła ich nigdzie.'
		],
		faqs: [
			{
				q: 'Dlaczego mój ciąg Base64 kończy się znakami =?',
				a: 'Base64 koduje 3 bajty na 4 znaki, więc gdy długość wejścia nie jest wielokrotnością trójki, wynik zostaje dopełniony znakami =, aby grupy się zgadzały. Dopełnienie nie niesie danych; ten dekoder odtwarza je automatycznie, jeśli zostało obcięte.'
			},
			{
				q: 'Czym różni się standardowy Base64 od wariantu URL-safe?',
				a: 'Standardowy Base64 używa + i /, które mają w adresach URL specjalne znaczenie i same wymagają escapowania. Wariant URL-safe (RFC 4648 §5) zamienia je na - i _ i zwykle pomija dopełnienie. Tej postaci używają na przykład tokeny JWT. Koder oferuje tu obie odmiany, a dekoder przyjmuje każdą z nich automatycznie.'
			},
			{
				q: 'Czy Base64 to szyfrowanie?',
				a: 'Nie. Base64 to odwracalne kodowanie bez klucza — każdy może je zdekodować. Chroni dane przed uszkodzeniem w transporcie, a nie przed odczytaniem. Jeśli potrzebujesz poufności, najpierw zaszyfruj, a dopiero potem zakoduj szyfrogram.'
			},
			{
				q: 'Dlaczego dekodowanie mówi, że wynik nie jest poprawnym UTF-8?',
				a: 'Ciąg zdekodował się bez błędu, ale otrzymane bajty nie są tekstem — najczęściej to PNG, PDF albo dane skompresowane lub zaszyfrowane. Wypisanie takiej treści do pola tekstowego dałoby krzaki, więc narzędzie zamiast tego to sygnalizuje.'
			}
		]
	},

	'timestamp-converter': {
		about: [
			'Czas uniksowy liczy sekundy od 1970-01-01T00:00:00 UTC i pojawia się dosłownie wszędzie: w wierszach bazy danych, w polach tokenów JWT, w logach, w odpowiedziach API. Ten konwerter przyjmuje znacznik w sekundach albo milisekundach — jednostkę rozpoznaje po rzędzie wielkości — a także ciągi ISO 8601 i większość dat zapisanych po ludzku, po czym pokazuje wszystkie reprezentacje naraz: ISO, UTC, Twój czas lokalny, czas względny i obie precyzje uniksowe.',
			'Klasyczną pułapką jest niejednoznaczność jednostki: 1700000000 to listopad 2023 w sekundach, ale styczeń 1970 w milisekundach. Wykryta jednostka jest wypisana wprost, a gdy domysł okaże się zły, zmienisz ją jednym kliknięciem — koniec z liczeniem cyfr w głowie.',
			'Konwersja jest natychmiastowa i lokalna, a wskazanie bieżącego czasu wciąż tyka, więc podczas pracy strona pełni też funkcję zegara epoki uniksowej.'
		],
		faqs: [
			{
				q: 'Jak narzędzie rozstrzyga między sekundami a milisekundami?',
				a: 'Po rzędzie wielkości: wartości mające 11 cyfr lub więcej traktowane są jako milisekundy, krótsze jako sekundy. To odwzorowuje sekundy do około roku 5138, a milisekundy od mniej więcej 1973 roku, co jednoznacznie rozstrzyga każdy realny współczesny znacznik czasu. W przypadkach brzegowych jednostkę możesz przełączyć ręcznie.'
			},
			{
				q: 'Co się stanie po roku 2038?',
				a: 'Problem roku 2038 dotyczy systemów przechowujących czas uniksowy w 32-bitowej liczbie całkowitej ze znakiem. Liczby w JavaScripcie to 64-bitowe zmiennoprzecinkowe, więc ten konwerter obsługuje daty daleko poza 2038 — aż do roku 275760, czyli granicy typu Date w JavaScripcie.'
			},
			{
				q: 'Czy mogę zamienić datę z powrotem na znacznik czasu?',
				a: 'Tak. Wklej ciąg ISO 8601, na przykład 2026-07-20T12:00:00Z, albo większość zwyczajnych formatów daty, a obok pozostałych reprezentacji pojawią się sekundy i milisekundy uniksowe.'
			},
			{
				q: 'Której strefy czasowej dotyczy wiersz z czasem lokalnym?',
				a: 'Strefy skonfigurowanej w Twojej przeglądarce, odczytanej przez API Intl — nic nie jest sprawdzane zdalnie. Nazwa strefy wypisywana jest obok wartości, dzięki czemu zrzuty ekranu pozostają jednoznaczne.'
			}
		]
	},

	'jwt-decoder': {
		about: [
			'JSON Web Token to trzy segmenty Base64URL — nagłówek, ładunek, podpis — połączone kropkami. Ten dekoder rozdziela token i pokazuje nagłówek oraz ładunek jako sformatowany JSON, zamienia zarejestrowane pola czasowe (iat, exp, nbf) na czytelne daty i od razu mówi, czy token już wygasł.',
			'Dekodowanie to nie weryfikacja: ładunek dowolnego JWT może odczytać każdy, kto go ma, bo Base64URL jest kodowaniem, a nie szyfrowaniem. To także powód, dla którego wklejanie tokenu na przypadkową stronę jest zwykle złym pomysłem — ta strona stanowi wyjątek, bo dekodowanie odbywa się w całości w Twojej przeglądarce, a token nie jest nigdzie wysyłany. Weryfikacja podpisu kluczem tajnym lub publicznym celowo pozostaje poza zakresem dekodera offline.',
			'Wiodący przedrostek „Bearer ” jest usuwany automatycznie, więc możesz wkleić token prosto z nagłówka Authorization.'
		],
		faqs: [
			{
				q: 'Czy wklejanie tu produkcyjnego tokenu jest bezpieczne?',
				a: 'Token zostaje w Twojej przeglądarce — ta strona nie wykonuje z Twoimi danymi żadnych żądań sieciowych, co potwierdzisz w zakładce Network w narzędziach deweloperskich. Mimo to przyzwyczaj się traktować żywe tokeny jak hasła: do zrzutów ekranu używaj tokenów wygasłych albo testowych.'
			},
			{
				q: 'Dlaczego mój token się nie dekoduje?',
				a: 'Sprawdź, czy ma dokładnie trzy segmenty rozdzielone kropkami i czy przy kopiowaniu nie wpadły w niego łamania wierszy. Nieprzezroczyste tokeny dostępu (na przykład wiele tokenów GitHuba czy Google) w ogóle nie są JWT — żadne dekodowanie nie otworzy losowego ciągu, który nigdy nie zawierał JSON-a.'
			},
			{
				q: 'Co oznaczają iat, exp i nbf?',
				a: 'To zarejestrowane pola z RFC 7519, wszystkie w sekundach uniksowych: iat to moment wystawienia tokenu, exp moment, w którym przestaje być ważny, a nbf („not before”) najwcześniejsza chwila, w której wolno go przyjąć. To narzędzie zamienia każde z nich na czytelną datę i porównuje exp z Twoim zegarem.'
			},
			{
				q: 'Czy to narzędzie może zweryfikować podpis?',
				a: 'Nie — a zielonemu znaczkowi z narzędzia online i tak nie należy ufać przy decyzjach dotyczących bezpieczeństwa. Podpisy weryfikuj w swoim backendzie za pomocą utrzymywanej biblioteki (jose, jsonwebtoken, PyJWT) i rzeczywistych kluczy wystawcy.'
			}
		]
	},

	'regex-tester': {
		about: [
			'Napisz wzorzec, wklej przykładowy tekst, a każde dopasowanie zostanie podświetlone w trakcie pisania — z grupami przechwytującymi, grupami nazwanymi i pozycjami dopasowań wypisanymi poniżej. Tester korzysta z silnika RegExp JavaScriptu, więc zachowanie odpowiada dokładnie temu, co zrobią Node.js i przeglądarki, łącznie z lookbehind, grupami nazwanymi i escape’ami właściwości Unicode.',
			'Flagi przełącza się literami (g, i, m, s, u, y, d), a wzorzec kompilowany jest przy każdym naciśnięciu klawisza; błędy składni pojawiają się od razu, wraz z komunikatem samego silnika, a nie dopiero po kliknięciu przycisku. Wzorce dopuszczające puste dopasowanie, takie jak a*, obsługiwane są bezpiecznie, a liczba dopasowań ograniczona jest do 10 000, żeby zabłąkane .* nie zamroziło karty.',
			'Odmiany wyrażeń regularnych różnią się między silnikami — wzorzec działający tutaj może wymagać poprawek dla PCRE, RE2 albo modułu re w Pythonie, głównie w kwestii obsługi lookbehind, kwantyfikatorów zaborczych i flag wbudowanych w wzorzec.'
		],
		faqs: [
			{
				q: 'Której odmiany wyrażeń regularnych używa ten tester?',
				a: 'ECMAScript (JavaScript), w wydaniu Twojej własnej przeglądarki. Obsługuje lookahead, lookbehind, nazwane grupy przechwytujące, odwołania wsteczne oraz escape’y właściwości Unicode w rodzaju \\p{Letter} (z flagą u). Nie obsługuje składni wyłącznie PCRE, takiej jak kwantyfikatory zaborcze czy rekurencja.'
			},
			{
				q: 'Dlaczego mój wzorzec dopasowuje wszystko albo nic?',
				a: 'Dwie klasyczne przyczyny: nieuciekniony metaznak (. pasuje do dowolnego znaku — dla dosłownej kropki napisz \\.) albo zapomniana flaga g. Ten tester zawsze znajduje wszystkie dopasowania, ale Twój kod znajdzie tylko pierwsze, jeśli g nie zostanie ustawione.'
			},
			{
				q: 'Czym są nazwane grupy przechwytujące?',
				a: 'Składnia (?<nazwa>...) etykietuje grupę, dzięki czemu odczytujesz dopasowania po nazwie zamiast po pozycji: match.groups.nazwa w JavaScripcie. Panel grup pod dopasowaniami pokazuje dla każdego trafienia zarówno numerowane, jak i nazwane przechwycenia.'
			},
			{
				q: 'Czy wyrażenie stąd zadziała bez zmian w Pythonie albo Go?',
				a: 'Często tak, ale nie zawsze. Klasy znaków, kwantyfikatory i kotwice są przenośne; lookbehind, składnia grup nazwanych (Python używa (?P<nazwa>...)) i flagi wbudowane różnią się. Silnik RE2 w Go dodatkowo w ogóle odrzuca odwołania wsteczne i lookaround.'
			}
		]
	},

	'diff-checker': {
		about: [
			'Wklej oryginalny tekst po lewej, a zmienioną wersję po prawej, i otrzymaj spójne porównanie wiersz po wierszu: usunięcia na czerwono, dodania na zielono, zachowany kontekst pomiędzy i oryginalne numery wierszy po obu stronach. To najszybszy sposób, by odpowiedzieć na pytanie „co się właściwie zmieniło?” między dwiema konfiguracjami, dwiema odpowiedziami API albo dwiema wersjami fragmentu, który ktoś wkleił na czacie.',
			'Porównanie korzysta z algorytmu najdłuższego wspólnego podciągu na wierszach — z tej samej rodziny co algorytm stojący za git diff — więc przestawione bloki i drobne poprawki dają czytelny wynik zamiast oznaczania wszystkiego jako zmienione. Wiersz podsumowania zlicza dodane i usunięte linie.',
			'Ponieważ oba teksty zostają na stronie, porównywanie materiałów poufnych — umów, danych logowania w konfiguracjach, niewydanych treści — nie niesie żadnego z ryzyk wklejania ich do przypadkowego serwisu.'
		],
		faqs: [
			{
				q: 'Czy porównanie działa na słowach, czy na wierszach?',
				a: 'Na wierszach. Każdy wiersz porównywany jest jako całość, co odpowiada temu, jak programiści czytają diffy kodu i konfiguracji. Zmieniony wiersz pokazuje się więc jako jedno usunięcie plus jedno dodanie; podświetlanie różnic na poziomie znaków jest w planach.'
			},
			{
				q: 'Dlaczego mój diff pokazuje wszystko jako zmienione?',
				a: 'Zwykle przez różnice niewidoczne gołym okiem: jedna strona używa tabulatorów, druga spacji, końce wierszy w stylu Windows CRLF kontra uniksowy LF albo spacje na końcach wierszy. Znormalizowanie białych znaków przed porównaniem (dla ładunków JSON pomaga formater JSON z sortowaniem kluczy) uwidacznia prawdziwe zmiany.'
			},
			{
				q: 'Czy mogę sensownie porównać dwie odpowiedzi JSON?',
				a: 'Tak — przepuść najpierw obie przez formater JSON z włączonym sortowaniem kluczy, żeby równoważne dokumenty serializowały się identycznie. Wtedy diff pokaże faktyczne zmiany wartości zamiast szumu z kolejności kluczy.'
			},
			{
				q: 'Czy jest maksymalny rozmiar tekstu?',
				a: 'Algorytm porównuje każdy wiersz jednego tekstu z każdym wierszem drugiego, więc naprawdę duże pliki (dziesiątki tysięcy wierszy po obu stronach) mogą zająć chwilę. Typowe pliki z kodem i ładunki API porównują się natychmiast.'
			}
		]
	},

	'url-encode-decode': {
		about: [
			'Znaki takie jak spacje, ampersandy czy litery spoza ASCII nie mogą wystąpić w adresie URL w surowej postaci, więc koduje się je procentowo: spacja staje się %20, a 你 zamienia się w %E4%BD%A0. To narzędzie koduje tekst tak, by bezpiecznie trafił do URL-a, i dekoduje ciągi z sekwencjami procentowymi z powrotem na czytelny tekst — łącznie z konwencją + oznaczającą spację w ciągach zapytań.',
			'Dostępne są dwa tryby kodowania, bo sam JavaScript ma dwa: tryb komponentu (encodeURIComponent) escapuje wszystko, co mogłoby rozdzielić URL-a, czego chcesz dla pojedynczej wartości w query stringu; tryb pełnego URI (encodeURI) zachowuje znaki strukturalne takie jak /, ? i &, gdy kodujesz cały adres, który ma pozostać klikalny.',
			'Dekodowanie jest surowe wobec uszkodzonych sekwencji % — samotny % albo %ZZ zgłaszany jest jako błąd zamiast być po cichu przepuszczonym, czyli dokładnie tak, jak potraktują go przeglądarki i serwery.'
		],
		faqs: [
			{
				q: 'Kiedy używać trybu komponentu, a kiedy pełnego URI?',
				a: 'Kodujesz wartość, która trafi do wnętrza URL-a (zapytanie wyszukiwania, adres przekierowania, e-mail w parametrze) → tryb komponentu, żeby & i = wewnątrz wartości nie rozbiły ciągu zapytania. Kodujesz kompletny adres do wyświetlenia lub przesłania → tryb pełnego URI, żeby struktura adresu przetrwała.'
			},
			{
				q: 'Dlaczego + czasem oznacza spację?',
				a: 'Format application/x-www-form-urlencoded — używany przy wysyłce formularzy HTML i w ciągach zapytań — historycznie koduje spacje jako +. W ścieżkach URL + to po prostu plus. Tutejszy dekoder traktuje + jak spację, zgodnie z semantyką query stringów; %20 działa zawsze i wszędzie.'
			},
			{
				q: 'Dlaczego mój ciąg jest zakodowany podwójnie (%2520)?',
				a: '%25 to zakodowany znak %, więc %2520 znaczy, że tekst %20 zakodowano po raz drugi. Dzieje się tak, gdy dwie warstwy systemu kodują niezależnie od siebie. Uruchom tu dekodowanie dwa razy, żeby to rozwinąć, a potem napraw warstwę, która kodować nie powinna.'
			},
			{
				q: 'Czy znaki Unicode są obsługiwane poprawnie?',
				a: 'Tak — tekst jest najpierw kodowany do UTF-8, a następnie każdy bajt escapowany procentowo, zgodnie ze standardem URL organizacji WHATWG. Dlatego jeden znak CJK zamienia się w trzy grupy %XX.'
			}
		]
	},

	'url-parser': {
		about: [
			'Wklej adres URL i zobacz go rozłożonego na części: protokół, host, port, ścieżkę, fragment oraz każdy parametr zapytania w postaci zdekodowanej tabeli klucz–wartość. Narzędzie korzysta z tego samego parsera URL według WHATWG, którego Twoja przeglądarka używa przy nawigacji, więc interpretacja na ekranie jest tą, którą przeglądarka faktycznie zastosuje — łącznie z przypadkami brzegowymi, jak pomijanie domyślnych portów i normalizowanie ścieżek.',
			'Tabela parametrów zapytania przyda się najczęściej: długie przekierowania OAuth, linki otagowane pod analitykę i wywołania API stają się czytelne na pierwszy rzut oka, a każda wartość jest już zdekodowana z zapisu procentowego. Same domeny bez schematu też są akceptowane; do parsowania przyjmowane jest https://.',
			'Narzędzie tworzy naturalną parę z koderem URL — sparsuj tutaj adres, znajdź potrzebny parametr, popraw wartość, a potem zakoduj ją tam z powrotem.'
		],
		faqs: [
			{
				q: 'Dlaczego sparsowany URL różni się nieco od tego, co wkleiłem?',
				a: 'Parser WHATWG normalizuje adres: zamienia schemat i host na małe litery, usuwa domyślne porty (:443 dla https), rozwiązuje segmenty ./ i ../ oraz koduje znaki, które tego wymagają. To, co widzisz, to postać kanoniczna, co do której serwery i przeglądarki są zgodne.'
			},
			{
				q: 'Czy obsłuży adresy z powtórzonymi kluczami w zapytaniu?',
				a: 'Tak — każde wystąpienie trafia do własnego wiersza, w kolejności występowania. Powtórzone klucze są legalne i częste: wiele API czyta je jako tablice (?tag=a&tag=b).'
			},
			{
				q: 'Czym różni się host od hostname?',
				a: 'hostname to sama domena (example.com); host zawiera dodatkowo jawnie podany, niedomyślny port (example.com:8080). Gdy port jest domyślny dla schematu, oba wyglądają tak samo, bo port zostaje pominięty.'
			},
			{
				q: 'Czy fragment (#...) trafia na serwer?',
				a: 'Nie. Wszystko po znaku # zostaje w przeglądarce — serwery nigdy tego nie widzą. Właśnie dlatego aplikacje jednostronicowe historycznie używały go do routingu po stronie klienta i dlatego parametry analityczne umieszczone po # są dla backendu niewidoczne.'
			}
		]
	},

	'uuid-generator': {
		about: [
			'Generuj uniwersalne identyfikatory w czterech odmianach: UUID v4 (w pełni losowy, codzienny domyślny wybór), UUID v7 (uporządkowany czasowo, nowoczesny wybór na klucze bazodanowe), ULID (uporządkowany czasowo, w zwartym zapisie Crockford Base32) oraz Nano ID (krótki, przyjazny adresom URL). Wygeneruj jeden albo nawet tysiąc naraz — po jednym w wierszu, gotowe do wklejenia w skrypt zasilający bazę.',
			'Losowość pochodzi z Web Crypto API (crypto.getRandomValues), czyli źródła bezpiecznego kryptograficznie, a nie z Math.random. Generowanie jest lokalne, co oznacza, że identyfikatory nie są znane nikomu innemu, nigdzie nie trafiają do logów i działają offline.',
			'Jeśli wybierasz format identyfikatora dla nowego systemu: v7 i ULID sortują się według czasu utworzenia, co sprzyja indeksom B-drzewa i sprawia, że identyfikatory w logach układają się mniej więcej chronologicznie; v4 nie zdradza nic o momencie powstania, co czasem jest dokładnie tym, czego chcesz.'
		],
		faqs: [
			{
				q: 'Czym różni się UUID v4 od v7?',
				a: 'v4 to 122 losowe bity. v7 (RFC 9562) zaczyna się od 48-bitowego znacznika czasu w milisekundach uniksowych, po którym idą bity losowe, więc identyfikatory utworzone później sortują się później. Dla kluczy głównych w bazie v7 zwykle poprawia lokalność wstawień i rozmiar indeksu; v4 pozostaje w porządku tam, gdzie kolejność nie ma znaczenia albo moment utworzenia nie może wyciekać.'
			},
			{
				q: 'Czy dwa wygenerowane UUID mogą się powtórzyć?',
				a: 'Przy 122 losowych bitach prawdopodobieństwo jest tak małe, że nie warto się przed nim zabezpieczać: trzeba by generować miliardy identyfikatorów na sekundę przez dziesięciolecia, żeby w ogóle dojść do nikłej szansy. Kolizje w praktyce biorą się z błędów (użycie tego samego ziarna, kopiowanie wierszy), a nie z losowości.'
			},
			{
				q: 'Kiedy wybrać ULID zamiast UUID v7?',
				a: 'Rozwiązują ten sam problem. ULID to 26 znaków Crockford Base32 bez rozróżniania wielkości liter — krócej i czyściej w adresach i logach — a v7 zachowuje standardowy 36-znakowy kształt UUID, który każda baza i biblioteka już akceptuje. Wybierz to, co Twój ekosystem obsługuje bardziej natywnie.'
			},
			{
				q: 'Czy takich identyfikatorów można używać jako sekretów lub tokenów?',
				a: 'Losowość jest bezpieczna kryptograficznie, ale identyfikatory zwykle się wyświetla, loguje i indeksuje — traktuje jak dane jawne. Na tokeny sesji czy klucze API wygeneruj osobny sekret o co najmniej 128 losowych bitach i traktuj go jak hasło.'
			}
		]
	},

	'hash-generator': {
		about: [
			'Policz skróty MD5, SHA-1, SHA-256, SHA-384 i SHA-512 dowolnego tekstu, a także podpisy HMAC z kluczem, bezpośrednio w przeglądarce. Rodzina SHA oraz HMAC korzystają z Web Crypto API — tych samych audytowanych prymitywów, których Twoja przeglądarka używa do TLS — natomiast MD5 (celowo pominięty w Web Crypto) dostarczany jest jako niewielka lokalna implementacja na potrzeby starszych sum kontrolnych.',
			'Skróty aktualizują się na żywo w trakcie pisania, a wszystkie algorytmy liczone są naraz, więc porównanie wartości z sumą kontrolną w algorytmie, który akurat wybrała strona pobierania, nie wymaga żadnej konfiguracji. Tryb HMAC dodaje pole klucza tajnego do weryfikowania podpisów webhooków — GitHub, Stripe i większość dostawców webhooków podpisuje ładunki za pomocą HMAC-SHA256.',
			'Ponieważ dane wejściowe nigdy nie opuszczają strony, możesz spokojnie hashować rzeczy, których nie wkleiłbyś do usługi online: ładunki API, hasła sprawdzane wobec listy wykradzionych skrótów, dokumenty wewnętrzne.'
		],
		faqs: [
			{
				q: 'Którego algorytmu skrótu powinienem użyć?',
				a: 'Do wszystkiego, co dziś dotyczy bezpieczeństwa: SHA-256 lub mocniejszy. MD5 i SHA-1 są złamane pod względem odporności na kolizje — da się spreparować dwa różne wejścia o tym samym skrócie — więc zostają wyłącznie do sum kontrolnych bez przeciwnika i zgodności ze starymi protokołami.'
			},
			{
				q: 'Po co w ogóle wciąż udostępniać MD5?',
				a: 'Bo nadal go spotykasz: nagłówki ETag, klucze cache’a, manifesty plików, stare kolumny w bazach. Weryfikacja takich wartości wymaga policzenia MD5 niezależnie od jego statusu kryptograficznego. Tylko nie projektuj wokół niego niczego nowego.'
			},
			{
				q: 'Czym jest HMAC i czym różni się od zwykłego skrótu?',
				a: 'HMAC wplata w hashowanie klucz tajny, więc tylko posiadacze klucza mogą wytworzyć lub zweryfikować skrót. Zwykły skrót dowodzi integralności („te dane się nie zmieniły”); HMAC dowodzi dodatkowo autentyczności („wytworzył to ktoś z kluczem”). Codzienne zastosowanie to weryfikacja podpisów webhooków.'
			},
			{
				q: 'Czy hashowanie to to samo co szyfrowanie hasła?',
				a: 'Nie, a szybkie skróty w rodzaju SHA-256 to złe narzędzie do przechowywania haseł — atakujący mogą sprawdzać miliardy na sekundę. Przechowywanie haseł wymaga algorytmu celowo wolnego i solonego: bcrypta, scrypta albo Argon2.'
			}
		]
	},

	'case-converter': {
		about: [
			'Identyfikatory nieustannie wędrują między konwencjami: API zwraca snake_case, Twój TypeScript chce camelCase, klasa CSS potrzebuje kebab-case, a zmienna środowiskowa domaga się CONSTANT_CASE. Ten konwerter bierze dowolne wymieszane wejście — spacje, podkreślniki, myślniki, istniejący camelCase — rozsądnie dzieli je na słowa i składa z powrotem od razu w dziewięciu docelowych stylach.',
			'Dzielnik radzi sobie z trudnymi przypadkami: rozbija „getUserByID” na get/user/by/id (zachowując skrótowiec w całości aż do granicy), traktuje cyfry jako część swojego słowa i przetwarza każdy wiersz osobno, więc możesz wkleić całą kolumnę nazw pól z bazy i przekonwertować je za jednym razem.',
			'Wszystkie style pokazywane są jednocześnie, każdy z własnym przyciskiem kopiowania — nie trzeba najpierw wybierać trybu, wystarczy wkleić i zabrać ten, którego potrzebujesz.'
		],
		faqs: [
			{
				q: 'Jak traktowane są skrótowce w rodzaju „HTTPResponse”?',
				a: 'Ciąg wielkich liter, po którym następuje mała litera, dzielony jest przed ostatnią wielką literą: HTTPResponse → http + response. Odpowiada to temu, jak większość przewodników stylu oczekuje tokenizacji skrótowców, choć żaden dzielnik nie odgadnie intencji bezbłędnie — przypadki brzegowe jak „IOError” dają io + error.'
			},
			{
				q: 'Czy mogę przekonwertować wiele identyfikatorów naraz?',
				a: 'Tak — każdy wiersz konwertowany jest niezależnie. Wklej listę nazw kolumn, po jednej w wierszu, a wynik zachowa układ wierszy w nowym stylu.'
			},
			{
				q: 'Czym różni się tutaj Title Case od Sentence case?',
				a: 'Title Case zapisuje wielką literą każde słowo („User Account Id”); Sentence case tylko pierwsze („User account id”). Żaden z nich nie stosuje redakcyjnych reguł o przedimkach i przyimkach — przy identyfikatorach i tak prawie nigdy ich nie chcesz.'
			},
			{
				q: 'Dlaczego konwersja tam i z powrotem nie zawsze odtwarza oryginał?',
				a: 'Podział na słowa gubi informację — „user_ID_2” i „userId2” tokenizują się identycznie. Konwersje są deterministyczne w przód, ale pierwotnego zapisu granic między słowami nie zawsze da się odtworzyć wstecz.'
			}
		]
	},

	'word-counter': {
		about: [
			'Licznik słów i znaków działający na żywo, podający liczby, których programiści i piszący naprawdę potrzebują: słowa, znaki ze spacjami i bez, bajty UTF-8 (czyli to, co faktycznie mierzy kolumna w bazie albo limit API), wiersze, zdania, akapity oraz szacowany czas czytania przy typowych 220 słowach na minutę.',
			'Znaki liczone są jako punkty kodowe Unicode, a nie jednostki UTF-16, więc emoji i tekst CJK liczą się tak, jak spodziewałby się człowiek — a osobna liczba bajtów uwidacznia różnicę: 日本語 to 3 znaki, ale 9 bajtów. Dokładnie to rozróżnienie boli, gdy kolumna VARCHAR(255) odrzuca ciąg mający 200 „znaków”.',
			'Wszystko przelicza się w trakcie pisania i nic nigdzie nie jest wysyłane — bezpiecznie policzysz szkice ogłoszeń, umowy albo cokolwiek innego, co nie jest jeszcze gotowe na świat.'
		],
		faqs: [
			{
				q: 'Dlaczego liczba znaków różni się od liczby bajtów?',
				a: 'Znaki to punkty kodowe Unicode; bajty to ich zapis w UTF-8. Litery ASCII zajmują po 1 bajcie, większość europejskich liter z akcentami 2, znaki CJK 3, a emoji 4 (lub więcej w sekwencjach). Limity baz danych, nagłówki HTTP i wiele API mierzą bajty, nie znaki.'
			},
			{
				q: 'Jak liczone są słowa w językach bez spacji?',
				a: 'Zliczanie słów dzieli tekst po białych znakach, co zaniża wynik dla niesegmentowanego tekstu chińskiego czy japońskiego. Dla tych języków sensowniejszą miarą jest liczba znaków — dlatego obie wartości są zawsze widoczne.'
			},
			{
				q: 'Co liczy się jako zdanie?',
				a: 'Ciąg tekstu zakończony znakiem ., !, ? albo …, po którym następuje biały znak lub koniec tekstu. Skróty w rodzaju „np.” mogą lekko zawyżyć wynik — liczenie zdań jest z natury heurystyczne.'
			},
			{
				q: 'Jak dokładny jest czas czytania?',
				a: 'Dzieli liczbę słów przez 220 słów na minutę, czyli częstą średnią dla cichego czytania prozy ogólnej przez osobę dorosłą. Materiał techniczny z kodem czyta się wolniej, listy do przeskanowania wzrokiem szybciej. Traktuj to jako szacunek co do rzędu wielkości.'
			}
		]
	},

	'lorem-ipsum-generator': {
		about: [
			'Tekst zastępczy do układów, makiet i danych testowych, generowany w Twojej przeglądarce: wybierz słowa, zdania albo akapity, ustaw liczbę i kopiuj. Wynik czerpie z klasycznego, pomieszanego słownictwa Cycerona, więc wygląda jak naturalna quasi-łacińska proza, nie tworząc przy tym rozpraszających, czytelnych zdań.',
			'Domyślnie tekst zaczyna się tradycyjnym „Lorem ipsum dolor sit amet” — frazą, którą projektanci i recenzenci natychmiast rozpoznają jako wypełniacz — a gdy potrzebujesz kilku wyraźnie różnych bloków, możesz to wyłączyć i dostać wynik w pełni losowy.',
			'Długości zdań i rozmiary akapitów zmieniają się losowo w realistycznych zakresach, więc powstały tekst ma wizualny rytm prawdziwej treści — co ma znaczenie, gdy oceniasz typografię albo łamanie wierszy, bo jednakowe zdania wyglądają sztucznie.'
		],
		faqs: [
			{
				q: 'Skąd wzięło się lorem ipsum?',
				a: 'To pomieszane fragmenty dzieła Cycerona „De finibus bonorum et malorum” (45 r. p.n.e.), używane jako wypełniacz przez zecerów co najmniej od lat 60. XX wieku i spopularyzowane przez arkusze Letraset, a później oprogramowanie DTP.'
			},
			{
				q: 'Po co używać lorem ipsum zamiast prawdziwego tekstu?',
				a: 'Czytelna treść porywa uwagę — recenzenci zaczynają poprawiać słowa zamiast oceniać układ. Pseudołacina ma naturalne częstości liter i długości wyrazów, a przy tym nie daje się czytać, dzięki czemu uwaga zostaje przy projekcie.'
			},
			{
				q: 'Czy generowany tekst jest zawsze taki sam?',
				a: 'Nie — słowa dobierane są losowo za każdym razem, więc dwa wygenerowane bloki będą się różnić. Stała jest wyłącznie opcjonalna klasyczna fraza otwierająca.'
			},
			{
				q: 'Czy mogę wygenerować konkretną liczbę słów pod limit pola w CMS-ie?',
				a: 'Tak — ustaw jednostkę na słowa i podaj dokładnie tyle, ile potrzebujesz, do 1000 naraz. Połącz to z licznikiem słów, aby sprawdzić wynik względem limitów znaków lub bajtów.'
			}
		]
	},

	'slug-generator': {
		about: [
			'Zamień dowolny tytuł w slug gotowy do adresu URL: małe litery, rozdzielenie myślnikami, usunięta interpunkcja, znaki diakrytyczne przepisane na czyste ASCII — „Crème brûlée à Paris” zamienia się w „creme-brulee-a-paris”. Opcje pokrywają typowe warianty: separator w postaci podkreślnika, zachowanie wielkości liter oraz maksymalną długość ucinaną na granicy słowa, a nie w jego środku.',
			'Slugi liczą się i dla ludzi, i dla wyszukiwarek: są czytelne w pasku adresu, przetrwają wklejenie na czat bez zapisu procentowego i dają wynikom wyszukiwania adres niosący słowa kluczowe. Krok transliteracji to właśnie to, co pomija większość domowych funkcji slugify — bez niego tytuły z diakrytykami albo psują adresy, albo znikają zupełnie.',
			'Każdy wiersz przetwarzany jest osobno, więc wklejona lista tytułów artykułów zamienia się w odpowiadającą jej listę slugów w jednej operacji.'
		],
		faqs: [
			{
				q: 'Dlaczego myślniki zamiast podkreślników?',
				a: 'Wyszukiwarki traktują myślniki jako separatory słów, a podkreślniki historycznie jako łączniki; do tego w podkreślonym tekście odnośnika myślnik jest po prostu czytelniejszy. Podkreślniki pozostają popularne w nazwach plików i identyfikatorach, więc dostępne są oba warianty.'
			},
			{
				q: 'Co dzieje się z pismami niełacińskimi, jak chińskie czy cyrylica?',
				a: 'Znaki mające odpowiedniki ASCII (łacińskie z diakrytykami, kilka liter specjalnych jak ß → ss) są transliterowane; pisma bez prostego odwzorowania na łacinkę są usuwane. Przy treściach niełacińskich zwyczajowo albo zostawia się rodzime pismo zakodowane procentowo w adresie, albo pisze ręczny slug w transkrypcji.'
			},
			{
				q: 'Czy istnieje idealna długość sluga?',
				a: 'Krótszy jest lepszy do udostępniania i wyświetlania, ale nie ma tu żadnego progu wpływającego na pozycję w wyszukiwarce. Opcja maksymalnej długości przycina na granicy słowa — przydaje się w CMS-ach ograniczających kolumnę sluga do 50–80 znaków.'
			},
			{
				q: 'Czy slug powinien się zmieniać razem z tytułem?',
				a: 'Po publikacji najlepiej nie — adres to miejsce, do którego inni już podlinkowali. Większość serwisów zachowuje pierwotny slug albo dodaje przekierowanie. Generuj slugi przy tworzeniu treści, a zmianę nazwy traktuj jako świadomą decyzję o przekierowaniu.'
			}
		]
	},

	'sort-lines': {
		about: [
			'Warsztat do obróbki wierszy: wklej dowolną listę i posortuj ją alfabetycznie, odwrotnie, naturalnie (item2 przed item10), według długości albo ją przetasuj — opcjonalnie przycinając białe znaki, usuwając puste wiersze i kasując duplikaty z zachowaniem kolejności. Liczba usuniętych wierszy jest raportowana, więc dokładnie widzisz, co zrobiło odsiewanie duplikatów.',
			'Sortowanie naturalne to opcja, po którą sięgniesz najczęściej: zwykłe sortowanie alfabetyczne stawia „item10” przed „item2”, bo porównuje znak po znaku, a sortowanie naturalne porównuje osadzone liczby liczbowo — czyli w kolejności, jakiej ludzie oczekują dla nazw plików, wersji i identyfikatorów.',
			'Odsiewanie duplikatów zachowuje pierwsze wystąpienie i pierwotną kolejność tych, które zostały, co ma znaczenie, gdy kolejność listy coś znaczy (importy, wiersze konfiguracji, playlisty). Tryb ignorujący wielkość liter traktuje „Apple” i „apple” jako ten sam wiersz.'
		],
		faqs: [
			{
				q: 'Czym różni się sortowanie alfabetyczne od naturalnego?',
				a: 'Alfabetyczne porównuje kody znaków, więc „file10” < „file2” (bo na piątej pozycji „1” < „2”). Sortowanie naturalne rozpoznaje ciągi cyfr i porównuje je jako liczby, dając file2 < file10. Do wszystkiego, co zawiera liczby, używaj naturalnego.'
			},
			{
				q: 'Czy odsiewanie duplikatów zostawia pierwsze czy ostatnie wystąpienie?',
				a: 'Pierwsze. Wiersze przeglądane są z góry na dół, a wiersz zostaje usunięty tylko wtedy, gdy identyczny (lub równy z pominięciem wielkości liter, w odpowiednim trybie) pojawił się wcześniej — dzięki temu kolejność ocalałych odpowiada oryginalnej.'
			},
			{
				q: 'Jak dużą listę to udźwignie?',
				a: 'Setki tysięcy wierszy nie stanowią problemu — operacje to proste przebiegi plus jedno sortowanie. Wszystko zostaje w pamięci przeglądarki, więc praktyczną granicą jest Twoja maszyna, a nie limit serwera.'
			},
			{
				q: 'Czy mogę łączyć operacje?',
				a: 'Tak, i stosowane są w sensownej kolejności: najpierw przycinanie, potem usuwanie pustych, potem duplikatów, na końcu sortowanie — dzięki czemu przy włączonym przycinaniu „ apple ” i „apple” odsiewają się razem, a sortowanie zawsze widzi już oczyszczoną listę.'
			}
		]
	},

	'html-entities': {
		about: [
			'Zabezpiecz tekst do bezpiecznego wstawienia w HTML — & zamienia się w &amp;, < w &lt; — albo zdekoduj tekst pełen encji z powrotem na czytelne znaki, obsługując encje nazwane (&rarr;), dziesiętne (&#169;) i szesnastkowe (&#xA9;) odwołania liczbowe.',
			'Kodowanie ma dwa poziomy: pięć kluczowych znaków rozbijających strukturę HTML (& < > " \'), co w zupełności wystarcza do poprawności, albo wszystko poza ASCII, co przydaje się, gdy któreś ogniwo łańcucha narzędzi po drodze psuje UTF-8. Tryb wyłącznie liczbowy pomija encje nazwane dla maksymalnej zgodności ze ścisłymi parserami XML, które gwarantują tylko pięć predefiniowanych.',
			'Codziennie częściej używa się połowy dekodującej: wklej zeskrobany fragment albo odpowiedź API najeżoną &#x27; i odbierz czysty tekst. Nieznane nazwy encji przechodzą nietknięte, zamiast być zgadywane.'
		],
		faqs: [
			{
				q: 'Które znaki trzeba escapować w HTML?',
				a: 'W treści tekstowej: & oraz <. W wartościach atrybutów: dodatkowo znak cudzysłowu ograniczający atrybut (" albo \'). Escapowanie > jest zwyczajowe, ale nie jest ściśle wymagane. Cała reszta może wystąpić dosłownie w dokumencie UTF-8.'
			},
			{
				q: 'Czy kodowanie encji chroni przed XSS?',
				a: 'Escapowanie pięciu znaków strukturalnych to trzon kodowania wyjścia w kontekście HTML, owszem — ale tylko dla tekstu HTML i wartości atrybutów. Adresy URL, łańcuchy JavaScriptu i CSS wymagają własnych kodowań właściwych dla swojego kontekstu; samo escapowanie encji nie czyni tam dowolnego wstrzyknięcia bezpiecznym.'
			},
			{
				q: 'Encje nazwane czy liczbowe — które emitować?',
				a: 'Odwołania liczbowe (&#xE9;) działają w każdym parserze HTML i XML. Encje nazwane są czytelniejsze, ale XML predefiniuje tylko pięć, więc &eacute; wywraca ścisły potok XML/XHTML. W razie wątpliwości: liczbowe.'
			},
			{
				q: 'Dlaczego widzę w danych &amp;#39; (podwójnie zakodowane)?',
				a: 'Dwie warstwy zakodowały po razie: znak & z pierwszego kodowania został sam zescapowany przy drugim przebiegu. Zdekoduj tutaj dwukrotnie, aby odzyskać tekst, a potem znajdź i napraw warstwę, która nie powinna kodować.'
			}
		]
	},

	'unicode-inspector': {
		about: [
			'Wklej dowolny tekst i zobacz każdy znak rozłożony na części: jego punkt kodowy (U+XXXX), bajty UTF-8, jednostki UTF-16, sekwencję ucieczki JavaScriptu, encję HTML i kategorię ogólną — plus sumy dla punktów kodowych, jednostek UTF-16, bajtów UTF-8 i znaków postrzeganych przez użytkownika (klastrów grafemowych).',
			'To narzędzie na chwile „dlaczego ten napis jest dziwny?”: niewidoczne znaki (spacje zerowej szerokości, znaczniki BOM, znaki kierunku) pojawiają się jako widoczne wiersze; znaki-bliźniaki (cyrylickie а kontra łacińskie a) ujawniają różne punkty kodowe; a emoji, które „jest jednym znakiem”, okazuje się siedmioma punktami kodowymi połączonymi łącznikami zerowej szerokości.',
			'Cztery różne sumy długości odpowiadają na odwieczne pytanie, dlaczego .length w JavaScripcie, limit bajtów w bazie danych i to, co widzi użytkownik, nigdy nie zgadzają się co do długości napisu.'
		],
		faqs: [
			{
				q: 'Dlaczego "🎉".length === 2 w JavaScripcie?',
				a: 'Napisy w JavaScripcie liczą jednostki kodowe UTF-16. Znaki powyżej U+FFFF — w tym większość emoji — wymagają pary zastępczej, czyli dwóch jednostek. Inspektor pokazuje zarówno jednostki, jak i rzeczywisty punkt kodowy, a podsumowanie zlicza je osobno.'
			},
			{
				q: 'Czym jest klaster grafemowy?',
				a: 'Tym, co czytelnik postrzega jako jeden znak. é może być dwoma punktami kodowymi (e + akcent łączący), a emoji rodziny bywa złożone z siedmiu lub więcej połączonych łącznikami zerowej szerokości. Liczba grafemów pochodzi z Intl.Segmenter w przeglądarce — najbliższego odpowiednika „znaków tak, jak widzi je użytkownik”.'
			},
			{
				q: 'Jak znaleźć niewidoczne znaki w napisie?',
				a: 'Wklej go tutaj — każdy punkt kodowy dostaje własny wiersz, łącznie ze spacjami zerowej szerokości (U+200B), spacjami nierozdzielającymi (U+00A0), znacznikami BOM (U+FEFF) i znakami kierunku, każdy opisany kategorią. To klasyczni winowajcy „identycznych” napisów, które nie przechodzą porównania.'
			},
			{
				q: 'Co mówią mi sekwencje bajtów UTF-8?',
				a: 'Dokładnie to, co zostanie zapisane lub przesłane: ASCII to jeden bajt, większość rozszerzeń łacińskich dwa, CJK trzy, emoji cztery. Jeśli system utnie napis w środku sekwencji, dostaniesz znaki zastępcze (�) — widok bajtowy pokazuje, gdzie takie cięcia by wypadły.'
			}
		]
	},

	'cron-parser': {
		about: [
			'Wklej pięciopolowe wyrażenie cron i dostań je wyjaśnione zwykłym językiem, z rozbiciem pole po polu oraz — częścią, która wyłapuje prawdziwe pomyłki — pięcioma najbliższymi rzeczywistymi terminami uruchomienia policzonymi w Twojej strefie czasowej. „0 3 * * 1” czyta się jako „o 03:00, w poniedziałki”, a dalej idą konkretne daty, w których zadanie wystartuje.',
			'Parser obsługuje pełną standardową składnię: listy (1,15), zakresy (9-17), kroki (*/15), nazwy miesięcy i dni tygodnia (jan, mon), 7 jako niedzielę oraz rodzinę makr @daily/@hourly. Realizuje też regułę, o której wszyscy zapominają: gdy ograniczone są jednocześnie dzień miesiąca i dzień tygodnia, zadanie uruchamia się, gdy pasuje którykolwiek z nich, a nie oba naraz.',
			'Wyrażenia sześciopolowe (Quartz, z sekundami) są wykrywane i wyraźnie sygnalizowane, zamiast po cichu zostać źle zinterpretowane — to najczęstsze źródło zamieszania w stylu „mój cron chodzi nie wtedy, co trzeba” przy przenoszeniu zadań między harmonogramami Javy a uniksowym crontabem.'
		],
		faqs: [
			{
				q: 'Jakie jest pięć pól i w jakiej kolejności?',
				a: 'Minuta (0–59), godzina (0–23), dzień miesiąca (1–31), miesiąc (1–12), dzień tygodnia (0–6, niedziela = 0, przy czym 7 też jest przyjmowane jako niedziela). Zapamiętanie kolejności to odwieczna udręka — panel rozbicia podpisuje każde pole Twojego wyrażenia.'
			},
			{
				q: 'Dlaczego „0 0 1 * 1” uruchamia się częściej, niż się spodziewałem?',
				a: 'Ponieważ ograniczone są zarówno dzień miesiąca (1.), jak i dzień tygodnia (poniedziałek), cron uruchamia zadanie, gdy pasuje KTÓRYKOLWIEK z nich — czyli każdego pierwszego dnia miesiąca ORAZ w każdy poniedziałek. Żeby uzyskać „1. tylko wtedy, gdy wypada w poniedziałek”, trzeba sprawdzić datę w samym skrypcie.'
			},
			{
				q: 'W jakiej strefie czasowej podawane są kolejne uruchomienia?',
				a: 'W lokalnej strefie Twojej przeglądarki, wypisanej obok wyników. Prawdziwe crontaby działają w strefie serwera (albo według linii TZ= w niektórych cronach) — zawsze sprawdź, czego używa maszyna docelowa, zwłaszcza przy zmianach czasu.'
			},
			{
				q: 'Czy obsługiwane są sekundy albo lata?',
				a: 'Nie — to rozszerzenia Quartza (Java) z 6 lub 7 polami. Standardowy uniksowy cron ma dokładnie pięć pól i rozdzielczość jednej minuty. Wejście sześciopolowe jest wykrywane i zgłaszane jako Quartz, a nie odczytywane błędnie.'
			}
		]
	},

	'password-generator': {
		about: [
			'Generuj losowe hasła o wybranej długości i z wybranych zestawów znaków, w razie potrzeby hurtowo, z uczciwym wyliczeniem entropii — bitami losowości, a nie ozdobnym kolorowym paskiem. Losowość pochodzi z crypto.getRandomValues z próbkowaniem odrzucającym, więc każdy znak losowany jest równomiernie, bez obciążenia wynikającego z reszty z dzielenia.',
			'Z każdego włączonego zestawu znaków gwarantowany jest co najmniej jeden przedstawiciel (polityka wymuszana przez wiele serwisów), potem reszta hasła dopełniana jest równomiernie, a całość zostaje przetasowana — dzięki temu gwarantowane znaki nie skupiają się przewidywalnie na początku.',
			'Filtr znaków niejednoznacznych usuwa bliźniaki (0/O, 1/l/I) z myślą o hasłach, które człowiek może kiedyś przeczytać na głos albo przepisać z kartki. Ponieważ generowanie jest lokalne, hasła istnieją wyłącznie na Twojej maszynie, dopóki gdzieś ich nie zapiszesz.'
		],
		faqs: [
			{
				q: 'Co oznaczają bity entropii?',
				a: 'Entropia = długość × log2(rozmiar puli): liczba jednakowo prawdopodobnych możliwości, które musi przeszukać atakujący. 64 bity wytrzymują przypadkowy atak; 80 i więcej jest mocne wobec offline’owego łamania szybkich skrótów; 100 i więcej jest praktycznie nie do odgadnięcia. Szesnastoznakowe hasło z liter, cyfr i symboli to około 104 bity.'
			},
			{
				q: 'Czy długie hasło z samych małych liter jest lepsze niż krótkie i skomplikowane?',
				a: 'Często tak — długość mnoży entropię, a dodatkowe zestawy jedynie poszerzają podstawę logarytmu. 20 małych liter (~94 bity) bije 10 znaków w pełni wymieszanych (~65 bitów). Reguły złożoności istnieją głównie po to, by pokonać listy słów, a losowe generowanie i tak je pokonuje.'
			},
			{
				q: 'Czy generowanie haseł w przeglądarce jest bezpieczne?',
				a: 'Losowość (crypto.getRandomValues) to ten sam CSPRNG, którego używają natywne menedżery haseł, a ta strona nie wykonuje z Twoimi danymi żadnych żądań sieciowych. Realne ryzyka dotyczą tego, co dzieje się po wygenerowaniu: historii schowka, udostępniania ekranu i miejsca, w którym hasło przechowasz.'
			},
			{
				q: 'Po co wykluczać znaki niejednoznaczne?',
				a: 'Dla haseł, które przeczyta człowiek — wydrukowanych kodów odzyskiwania, dyktowanych przez telefon, przepisywanych z innego ekranu — 0/O oraz 1/l/I generują realne zgłoszenia do wsparcia. Przy hasłach tylko wklejanych zostaw je; strata entropii przy wykluczeniu jest tak czy inaczej niewielka.'
			}
		]
	},

	'qr-code-generator': {
		about: [
			'Wpisz lub wklej dowolny tekst — adres URL, dane WiFi, kontakt — i natychmiast otrzymaj kod QR, wyrenderowany jako ostry wektorowy SVG do pobrania albo wyeksportowany do PNG na czaty i slajdy. Bez znaku wodnego, bez wygasającego przekierowania z „darmowego planu”, a ponieważ generowanie jest lokalne, to, co kodujesz, nigdy nie dotyka serwera.',
			'Ten ostatni punkt znaczy więcej, niż się wydaje: wiele darmowych usług QR przepuszcza Twój adres przez własną domenę przekierowującą (żeby móc potem pobierać opłaty albo liczyć skany), co oznacza, że kod przestaje działać razem z usługą. Kody generowane tutaj kodują treść bezpośrednio i działają na zawsze.',
			'Cztery poziomy korekcji błędów wymieniają pojemność na odporność — L przetrwa drobne uszkodzenia, H przetrwa zasłonięcie 30% symbolu (przydaje się, gdy logo zakryje środek albo wydruk będzie mały i poobcierany).'
		],
		faqs: [
			{
				q: 'Który poziom korekcji błędów wybrać?',
				a: 'M (15%) to rozsądne ustawienie domyślne. Wybierz H (30%) do małych kodów drukowanych, kodów za szybą lub w odblasku albo gdy nakładasz logo. Wyższa korekcja zagęszcza kod, więc przy bardzo długich adresach na ekranie poziom L zostawia moduły większe i łatwiejsze do zeskanowania.'
			},
			{
				q: 'Dlaczego SVG jest lepszy do druku niż PNG?',
				a: 'SVG jest niezależny od rozdzielczości — drukarka rasteryzuje go w swoim natywnym DPI, więc krawędzie modułów pozostają idealnie ostre w każdym rozmiarze. PNG trzeba wygenerować w konkretnym rozmiarze pikselowym i przy skalowaniu potrafi się rozmyć. SVG do druku i narzędzi projektowych, PNG na czat i slajdy.'
			},
			{
				q: 'Ile danych mieści się w kodzie QR?',
				a: 'Teoretycznie około 3 KB bajtów (wersja 40, poziom L), ale tak duże kody trudno zeskanować z ekranu. Poniżej 300 znaków skanuje się niezawodnie; długie adresy najpierw skróć — najlepiej skracaczem we własnej domenie, jeśli zależy Ci na trwałości.'
			},
			{
				q: 'Czy te kody wygasają albo śledzą skany?',
				a: 'Nie. Treść kodowana jest bezpośrednio we wzorze — nic nie przechodzi przez tę stronę, więc nie ma czemu wygasnąć i nikt (my również) nie widzi, kiedy ani gdzie kod został zeskanowany. Śledzenie skanów z definicji wymaga usługi przekierowującej.'
			}
		]
	},

	'json-to-yaml': {
		about: [
			'Konwertuj między JSON-em, YAML-em i TOML-em w dowolną stronę. Format źródłowy rozpoznawany jest automatycznie w trakcie wklejania — nawiasy sugerują JSON, dwukropki po kluczach YAML, [tabele] TOML — z możliwością ręcznego wskazania przy niejednoznacznym wejściu. Konwersja przechodzi przez prawdziwe parsowanie, więc wynik jest z definicji poprawny, a nie efektem przekształcania tekstu wiersz po wierszu.',
			'Każdy format ma realne mocne strony: JSON do API i wymiany maszynowej, YAML do konfiguracji edytowanej przez ludzi (Kubernetes, potoki CI), TOML do dobrze otypowanych plików konfiguracyjnych (Cargo, pyproject). Ręczne przenoszenie danych między nimi zaprasza do błędów z wcięciami i cudzysłowami, które ta konwersja eliminuje.',
			'Konwerter uczciwie mówi o ograniczeniach formatów: TOML nie ma tablic na najwyższym poziomie ani wartości null, więc przy konwersji takich dokumentów wyjaśnia dlaczego, zamiast po cichu gubić dane.'
		],
		faqs: [
			{
				q: 'Czy komentarze przetrwają konwersję?',
				a: 'Nie — JSON nie ma składni komentarzy, a konwersja przechodzi przez sparsowaną strukturę danych, która komentarzy nie niesie. Zamiana YAML → JSON → YAML gubi je bezpowrotnie; gdy komentarze są ważne, zachowaj oryginalny plik.'
			},
			{
				q: 'Dlaczego moje „no” w YAML-u zamieniło się w false?',
				a: 'YAML 1.1 traktuje yes/no/on/off jako wartości logiczne, przez co kod kraju NO słynnie staje się false. Tutejszy parser trzyma się YAML-a 1.2 (tylko true/false), ale pliki pisane pod starsze parsery wciąż potrafią zaskoczyć. Napisy wyglądające jak wartości logiczne, liczby albo daty bierz w cudzysłów.'
			},
			{
				q: 'Dlaczego mój JSON nie konwertuje się do TOML-a?',
				a: 'TOML wymaga tabeli (obiektu) na najwyższym poziomie — tablica ani goły skalar nie mogą być dokumentem TOML — i nie zna wartości null. Przebuduj dane (zawiń tablicę pod klucz, usuń nulle albo daj im wartości domyślne), a konwersja się powiedzie.'
			},
			{
				q: 'Czy YAML jest nadzbiorem JSON-a?',
				a: 'Praktycznie tak — YAML 1.2 parsuje niemal wszystkie dokumenty JSON, dlatego wklejenie JSON-a do konfiguracji YAML zwykle działa. Odwrotnie już nie: kotwice, wieloliniowe skalary i tagi YAML-a nie mają odpowiednika w JSON-ie i przy konwersji zostają rozwinięte albo zamienione na napisy.'
			}
		]
	},

	'json-to-csv': {
		about: [
			'Wklej tablicę obiektów JSON i dostań CSV gotowy do arkusza: zagnieżdżone obiekty spłaszczane są do nazw kolumn z kropkami (user.address.city), kolumny są sumą wszystkich wierszy (brakujące wartości stają się pustymi komórkami), a cudzysłowy stawiane są zgodnie z RFC 4180, więc przecinki, cudzysłowy i łamania wierszy wewnątrz wartości przeżywają Excela i Arkusze Google.',
			'To najkrótsza droga od odpowiedzi API do arkusza, który ktoś może przefiltrować i przekształcić w tabelę przestawną. Suma kolumn ma znaczenie przy prawdziwych danych, gdzie obiekty bywają różnorodne — wiersz 1. może nie mieć pól, które ma wiersz 40., a konwerter to obsługuje, zamiast zgłaszać błąd albo gubić dane.',
			'Konwerter działa też w drugą stronę: wklej eksport CSV i dostań tablicę obiektów JSON z kluczami z wiersza nagłówka, z automatycznym wykrywaniem separatora (przecinek, średnik, tabulator, kreska pionowa) i opcjonalnym typowaniem wartości — liczby, wartości logiczne i null stają się prawdziwymi typami JSON. Oba kierunki działają w całości w Twojej przeglądarce, więc eksporty z danymi klientów nigdy nie opuszczają Twojej maszyny.'
		],
		faqs: [
			{
				q: 'Jak reprezentowane są zagnieżdżone obiekty?',
				a: 'Spłaszczane do kluczy łączonych kropką: {"user":{"name":"Ada"}} staje się kolumną user.name. Dzięki temu każda wartość skalarna pozostaje adresowalna w jednym płaskim wierszu nagłówka, a właśnie z tym potrafią pracować arkusze.'
			},
			{
				q: 'Co dzieje się z tablicami wewnątrz wiersza?',
				a: 'Trafiają jako tekst JSON do pojedynczej komórki (["a","b"]). Rozbijanie tablic na kolumny (tags.0, tags.1…) albo dodatkowe wiersze zmienia kształt Twoich danych w dość arbitralny sposób — osadzenie zachowuje konwersję bezstratną i przewidywalną.'
			},
			{
				q: 'Dlaczego Excel pokazuje mój CSV w jednej kolumnie?',
				a: 'Przez ustawienia regionalne: w dużej części Europy Excel oczekuje plików rozdzielanych średnikiem, bo przecinek pełni rolę separatora dziesiętnego. Przełącz separator na średnik albo użyj Dane → Z tekstu/CSV, gdzie możesz wskazać separator ręcznie.'
			},
			{
				q: 'Czy konwerter poradzi sobie z pojedynczym obiektem (nie tablicą)?',
				a: 'Tak — samotny obiekt staje się jednowierszowym CSV-em. Obiekty kluczowane identyfikatorem ({"a1":{...},"a2":{...}}) zamieniają się jednak w jeden szeroki wiersz; jeśli każda wartość ma być osobnym wierszem, najpierw przekształć je w tablicę.'
			},
			{
				q: 'Jak CSV → JSON radzi sobie z polami w cudzysłowach i łamaniami wierszy?',
				a: 'Zgodnie z RFC 4180: pola ujęte w cudzysłowy mogą zawierać separator, podwojony cudzysłów ("") oznacza znak dosłowny, a łamania wierszy są dozwolone. Excel i większość baz danych eksportują dokładnie ten format, więc realne pliki parsują się poprawnie.'
			},
			{
				q: 'Dlaczego moim kodom pocztowym znikają wiodące zera przy CSV → JSON?',
				a: 'Typowana konwersja zamienia 02134 w liczbę 2134. Odznacz „Wartości z typami”, a każda komórka pozostanie napisem dokładnie tak, jak zapisano — to właściwy wybór dla identyfikatorów, numerów telefonu i wszystkiego z wiodącymi zerami.'
			}
		]
	},

	'json-to-typescript': {
		about: [
			'Wklej przykładowy JSON — odpowiedź API, plik konfiguracyjny — i dostań wywnioskowany z niego interfejs TypeScriptu: zagnieżdżone obiekty stają się zagnieżdżonymi typami, tablice dostają typ elementu (a przy mieszanej zawartości unię), a klucze niebędące poprawnymi identyfikatorami trafiają w cudzysłowy.',
			'Wygenerowane typy to punkt wyjścia, a nie kontrakt: wnioskowanie widzi jedną próbkę, więc pole, które akurat jest w niej null, otypuje się jako null, a pola opcjonalne, których w próbce nie było, po prostu dla niego nie istnieją. Wynik jest celowo prosty — bez dekoratorów, bez walidacji w czasie działania — żebyś mógł wkleić go gdziekolwiek i dopracować.',
			'Dla pól różniących się między żądaniami przepuść drugą próbkę i scal ręcznie, albo przejdź na narzędzia oparte na schemacie (OpenAPI, zod), gdy kształt danych się ustabilizuje. Na codzienne „potrzebuję po prostu typu dla tej odpowiedzi” jedno wklejenie wystarczy.'
		],
		faqs: [
			{
				q: 'Dlaczego moje pole dopuszczające null ma typ po prostu null?',
				a: 'Wnioskowanie widzi tylko wklejoną próbkę. Jeśli pole było tam null-em, to null jest wszystkim, co może wiedzieć. Po wygenerowaniu zmień to na string | null (albo cokolwiek jest prawdziwym typem) — lub wklej próbkę, w której pole jest wypełnione.'
			},
			{
				q: 'Jak traktowane są pola opcjonalne?',
				a: 'Nie są wykrywane — pojedyncza próbka nie odróżni „zawsze obecne” od „obecne tym razem”. Pola nieobecne w próbce są nieobecne w typie. Tam, gdzie wiesz, że API je pomija, oznacz je opcjonalnie (name?:) ręcznie.'
			},
			{
				q: 'Co powstaje z tablic o mieszanych typach?',
				a: 'Unia: [1, "a"] daje (number | string)[]. Puste tablice dają unknown[], bo nie ma elementu do zbadania — podmień na prawdziwy typ elementu, gdy go poznasz.'
			},
			{
				q: 'Używać typów wywnioskowanych czy biblioteki schematów w rodzaju zod?',
				a: 'Wywnioskowane interfejsy istnieją wyłącznie w czasie kompilacji — niczego nie walidują w czasie działania. Do narzędzi wewnętrznych i szybkiego otypowania są idealne; dla niezaufanych danych w czasie działania zdefiniuj schemat zod/valibot i wyprowadź z niego typ statyczny.'
			}
		]
	},

	'jsonpath-tester': {
		about: [
			'Testuj wyrażenia JSONPath na własnym JSON-ie i oglądaj każde trafienie razem z jego wartością i konkretną ścieżką. Obsługiwana jest składnia pokrywająca codzienne zastosowania: notacja kropkowa i nawiasowa, indeksy tablic (także ujemne), symbole wieloznaczne, unie ([\'a\',\'b\']) i zejście rekurencyjne ($..price).',
			'Ścieżka wypisywana przy każdym trafieniu to po cichu najużyteczniejsza część: zapytaj $..id o głęboki dokument, a każdy wynik powie Ci dokładnie, gdzie mieszka ($.data.items[3].id), gotowy do wklejenia w kod. Zamienia „gdzieś w tym worku danych” w konkretny adres.',
			'Wyrażenia filtrujące ([?(@.price < 10)]) nie są jeszcze zaimplementowane — narzędzie mówi to wprost, zamiast zwracać błędne wyniki. Do ekstrakcji strukturalnej, czyli większości zastosowań JSONPath, wszystko działa.'
		],
		faqs: [
			{
				q: 'Czym różni się $.a.b od $..b?',
				a: '$.a.b podąża jedną konkretną trasą: klucz a w korzeniu, a w nim klucz b. $..b (zejście rekurencyjne) znajduje każde b w dokumencie, na dowolnej głębokości. Zejście rekurencyjne jest potężne, ale bywa zaskakujące — dopasuje też klucze b zagnieżdżone w miejscach, o których nie pomyślałeś.'
			},
			{
				q: 'Jak dostać się do kluczy ze spacjami albo myślnikami?',
				a: 'Notacją nawiasową z cudzysłowami: $[\'my key\'] albo $.data[\'content-type\']. Notacja kropkowa działa tylko dla kluczy będących poprawnymi nazwami identyfikatorów.'
			},
			{
				q: 'Czy ujemne indeksy tablic działają?',
				a: 'Tak — [-1] to ostatni element, [-2] przedostatni, zgodnie z konwencją spopularyzowaną przez Pythona i przyjętą w RFC 9535. [0] pozostaje pierwszym elementem.'
			},
			{
				q: 'Czy JSONPath jest ustandaryzowany?',
				a: 'Od 2024 roku tak — RFC 9535 definiuje składnię i semantykę. Implementacje napisane wcześniej różnią się w przypadkach brzegowych (zwłaszcza przy filtrach i uniach), więc to samo wyrażenie może działać inaczej w różnych bibliotekach; testuj na tej, z którą wdrażasz.'
			}
		]
	},

	'bcrypt-generator': {
		about: [
			'Zahashuj hasło bcryptem przy wybranym współczynniku kosztu albo sprawdź tekst jawny wobec istniejącego hasha — jedno i drugie w całości w przeglądarce, czyli dokładnie tak, jak chcesz, gdy badaną rzeczą jest hasło. Inspektor hashy rozbija też dowolny hash bcrypt na wersję, koszt i sól.',
			'Bcrypt pozostaje solidnym wyborem do przechowywania haseł, bo jest celowo wolny i solony osobno dla każdego hasła: współczynnik kosztu podwaja pracę z każdym krokiem, więc koszt 12 oznacza 4096 iteracji konfiguracji szyfru pod spodem. Odczyt czasu pokazuje, ile trwa wybrany przez Ciebie koszt, przez co kompromis bezpieczeństwo/opóźnienie staje się namacalny.',
			'Częstszą codzienną potrzebą jest weryfikacja: potwierdzenie, że hash z bazy odpowiada znanemu hasłu, bez uruchamiania kodu aplikacji. Wklej jedno i drugie, dostań tak albo nie.'
		],
		faqs: [
			{
				q: 'Jakiego współczynnika kosztu używać na produkcji?',
				a: 'Klasyczna wskazówka: tak wysokiego, na jaki pozwala Twój budżet opóźnienia logowania, dziś zwykle 10–13. Celuj w 100–300 ms na hash na sprzęcie produkcyjnym. JavaScript w przeglądarce działa wolniej niż kod natywny, więc czas pokazany tutaj jest górnym ograniczeniem dla Twoich serwerów.'
			},
			{
				q: 'Dlaczego to samo hasło daje za każdym razem inny hash?',
				a: 'Do każdego hasha generowana jest losowa 16-bajtowa sól, zapisywana wewnątrz samego ciągu hasha. Tak ma być — identyczne hasła dostają różne hashe, co unieważnia gotowe tęczowe tablice. Weryfikacja odczytuje sól z powrotem z hasha, dlatego porównanie w ogóle działa.'
			},
			{
				q: 'Co oznaczają części hasha bcrypt?',
				a: '$2b$12$ + 53 znaki: 2b to wersja algorytmu, 12 to koszt (2^12 iteracji), kolejne 22 znaki to sól, a ostatnie 31 to skrót — wszystko w bcryptowym wariancie base64. Inspektor pod narzędziem rozbija w ten sposób dowolny hash.'
			},
			{
				q: 'Czy bcrypt jest nadal zalecany zamiast Argon2?',
				a: 'Argon2id jest dziś pierwszym wyborem dla nowych systemów (twardość pamięciowa utrudnia łamanie na GPU). Bcrypt pozostaje akceptowalny i wszechobecny — praktyczna rada brzmi: nie migruj w panice działającego magazynu bcrypt, ale przy projektach od zera wybieraj Argon2id. Oba są o klasy lepsze od szybkich skrótów w rodzaju SHA-256.'
			}
		]
	},

	'user-agent-parser': {
		about: [
			'Wklej ciąg User-Agent z linii logu, zgłoszenia błędu albo eksportu z analityki i dostań go rozszyfrowanego: przeglądarka i wersja, silnik renderujący, system operacyjny, typ urządzenia i architektura procesora. Parserem jest ua-parser-js, ta sama biblioteka, która stoi za niezliczonymi potokami analitycznymi, uruchamiana lokalnie na Twoim ciągu.',
			'Ciągi User-Agent są stanowiskami archeologicznymi — każdy nadal twierdzi, że jest Mozilla/5.0, Chrome podaje się za Safari, Safari za KHTML, a prawdziwa tożsamość kryje się w dalszych tokenach. Parser bije mrużenie oczu: wie, że „CriOS” oznacza Chrome na iOS, a Edge chowa się za „Edg/”.',
			'Zwróć uwagę na kierunek zmian: przeglądarki zamrażają i skracają ciągi UA (a Chromium wysyła zamiast tego UA Client Hints), więc szczegółowość wersji z samego UA jest coraz zgrubniejsza. Do analizy logów i triage’u błędów pozostaje niezastąpiony; do decyzji o funkcjach używaj wykrywania funkcji.'
		],
		faqs: [
			{
				q: 'Dlaczego każdy User-Agent zaczyna się od Mozilla/5.0?',
				a: 'To teatrzyk zgodności z lat 90., który nigdy się nie skończył: serwery szukały słowa „Mozilla”, żeby podać nowoczesną stronę, więc każda nowa przeglądarka twierdziła, że nią jest, a kolejne podszywały się pod poprzedniczki. Dziś ten przedrostek to już tylko bezsensowna tradycja.'
			},
			{
				q: 'Czy mogę ufać wersji systemu w ciągu UA?',
				a: 'Z roku na rok coraz mniej. macOS zamroził swoją wersję w UA na 10_15_7, Windows 11 przedstawia się jako Windows NT 10.0, a przeglądarki ze skróconym UA celowo zaokrąglają wersje. Traktuj wersję systemu z UA jako przybliżoną; tam, gdzie kontrolujesz klienta, korzystaj z UA Client Hints.'
			},
			{
				q: 'Co znaczy „like Gecko” albo „KHTML, like Gecko”?',
				a: 'Kolejne warstwy podszywania: WebKit wywodzi się z KHTML-a i chciał, by działały strony traktujące specjalnie Gecko (silnik Firefoksa), więc dopisał „like Gecko”. Każda przeglądarka na WebKicie i Blinku nosi tę frazę do dziś.'
			},
			{
				q: 'Czy używać parsowania UA do wykrywania funkcji?',
				a: 'Nie — sniffing psuje się w chwili wydania nowej wersji przeglądarki. Wykrywaj samą funkcję (if ("clipboard" in navigator)). Parsowanie UA służy analityce, analizie logów i odtwarzaniu błędów zgłoszonych przez użytkowników, gdzie poznanie środowiska jest właśnie celem.'
			}
		]
	},

	'color-converter': {
		about: [
			'Wpisz kolor w dowolnym popularnym zapisie — #hex, rgb(), hsl() albo nazwa koloru CSS — i dostań wszystkie formaty naraz: HEX, RGB, HSL i OKLCH, obok żywej próbki. Kanał alfa jest zachowywany między formatami, a wyjście używa nowoczesnej składni CSS (kanały rozdzielone spacjami), która wkleja się czysto do współczesnych arkuszy stylów.',
			'OKLCH jest w zestawie, bo w tę stronę zmierza kolor w CSS: w odróżnieniu od HSL jego oś jasności jest percepcyjnie jednorodna, więc dwa kolory o tym samym L naprawdę wyglądają na równie jasne, a zmiana odcienia nie zmienia przy okazji postrzeganej jasności. Przeniesienie istniejącej palety do OKLCH to pierwszy krok do budowy spójnych skal kolorystycznych.',
			'Matematyka konwersji działa lokalnie, na opublikowanych przekształceniach sRGB↔OKLab, a wartości wracają bez strat: RGB otrzymane z wejścia HSL jest dokładnie tym, co policzyłaby przeglądarka.'
		],
		faqs: [
			{
				q: 'Dlaczego wartości jasności w HSL i OKLCH się nie zgadzają?',
				a: 'Jasność w HSL jest właściwością geometryczną wartości RGB, a nie ludzkiego wzroku — żółty hsl(60 100% 50%) wygląda o wiele jaśniej niż niebieski hsl(240 100% 50%), mimo identycznego L. Oś L w OKLCH zaprojektowano tak, by odpowiadała percepcji, więc równe L oznacza równą pozorną jasność. Ta rozbieżność jest właśnie powodem istnienia OKLCH.'
			},
			{
				q: 'Co oznacza wartość alfa i gdzie trafia w każdym z formatów?',
				a: 'Alfa to nieprzezroczystość, od 0 (przezroczysty) do 1 (kryjący). W ośmiocyfrowym hex to ostatni bajt (#RRGGBBAA); w nowoczesnej składni funkcyjnej idzie po ukośniku: rgb(76 141 255 / 0.5). Ten konwerter przenosi alfę przez wszystkie formaty automatycznie.'
			},
			{
				q: 'Czy każdy kolor OKLCH da się pokazać w sRGB?',
				a: 'Nie — OKLCH obejmuje szerokie gamuty, a niektóre kombinacje chromy i jasności nie mają odpowiednika w sRGB. Konwersja z sRGB (czyli to, co robi to narzędzie) zawsze pozostaje reprezentowalna; w drugą stronę kolory spoza gamutu trzeba przyciąć lub odwzorować — dlatego soczysta zieleń P3 na ekranie sRGB wygląda bledziej.'
			},
			{
				q: 'Dlaczego rgb(76 141 255) ze spacjami zamiast przecinków?',
				a: 'CSS Color Module Level 4 ustandaryzował kanały rozdzielone spacjami z opcjonalną /alfą, a każda nowoczesna przeglądarka to obsługuje. Forma z przecinkami nadal działa, ale to forma ze spacjami jest tą, której używają nowe specyfikacje (i to narzędzie).'
			}
		]
	},

	'image-to-base64': {
		about: [
			'Upuść, wybierz albo wklej obraz i dostań jego postać Base64 w każdym potrzebnym wariancie: gotowy do użycia data URL, deklarację background-image w CSS, kompletny znacznik <img> z wymiarami własnymi oraz surowy ładunek Base64. Odwrotny kierunek też działa — wklej data URL albo goły ciąg Base64, a obraz zostanie zdekodowany, pokazany w podglądzie i będzie do pobrania jako plik.',
			'Format rozpoznawany jest z bajtów magicznych, a nie z rozszerzenia pliku czy deklarowanego typu MIME, więc PNG przemianowany na .jpg (albo data URL z błędną etykietą) i tak przekonwertuje się poprawnie. Panel rozmiaru uczciwie pokazuje koszt: Base64 powiększa dane o mniej więcej jedną trzecią, a dokładny rozmiar po zakodowaniu widnieje obok oryginalnego, żebyś mógł zdecydować, czy osadzanie się opłaca.',
			'W odróżnieniu od większości stron „obraz na Base64” nic nie jest wysyłane — plik odczytywany jest przez przeglądarkowe API FileReader i kodowany na stronie. To czyni narzędzie bezpiecznym dla zrzutów wewnętrznych pulpitów, niewydanych zdjęć produktowych i wszystkiego innego, czego wolałbyś nie oddawać serwerowi obcej firmy.'
		],
		faqs: [
			{
				q: 'Kiedy osadzać obraz jako Base64 zamiast linkować plik?',
				a: 'Gdy obraz jest mały (z grubsza poniżej 10 KB), rzadko się zmienia i w przeciwnym razie kosztowałby dodatkowe żądanie HTTP — czyli ikony, logo w e-mailach albo jednoplikowe dokumenty HTML. Przy czymkolwiek większym wygrywa osobny plik: buforuje się niezależnie, ładuje równolegle i nie powiększa Twojego HTML-a ani CSS-a o 33%.'
			},
			{
				q: 'Dlaczego wersja Base64 jest o mniej więcej jedną trzecią większa od pliku?',
				a: 'Base64 przedstawia każde 3 bajty danych binarnych jako 4 znaki ASCII, czyli strukturalny narzut +33% (plus najwyżej dwa znaki dopełnienia). Gzip albo Brotli na serwerze część tego odzyskuje, ale samo rozdęcie jest nieodłączne od kodowania — wymienia rozmiar na możliwość osadzenia danych binarnych w tekście.'
			},
			{
				q: 'Czy mogę zdekodować data URL znaleziony w arkuszu stylów albo HTML-u?',
				a: 'Tak — przełącz na Base64 → obraz i wklej całość razem z przedrostkiem data:. Zakodowane procentowo data URL-e z SVG (te bez ;base64) też się dekodują, a łamania wierszy i spacje w ładunku są usuwane automatycznie. Wynik pokazuje się w podglądzie i pobiera z właściwym rozszerzeniem.'
			},
			{
				q: 'Czy działa to dla SVG, GIF i ICO, czy tylko dla PNG i JPEG?',
				a: 'Wszystko, co rozpozna detektor, przekonwertuje się na Base64: PNG, JPEG, WebP, GIF, SVG, BMP, ICO i AVIF. Przy SVG warto jednak pamiętać, że źródło XML wklejone wprost bywa mniejsze i czytelniejsze — kodowanie SVG w Base64 ma sens głównie wtedy, gdy problemem staje się cytowanie albo escapowanie.'
			}
		]
	},

	'image-converter': {
		about: [
			'Konwertuj obraz między PNG, JPEG i WebP bez instalowania czegokolwiek i bez wysyłania go gdziekolwiek: upuść plik, wybierz format docelowy, ustaw jakość żywym suwakiem i patrz, jak rozmiar wyniku aktualizuje się na bieżąco. Kafelek Δ pokazuje dokładnie, o ile mniejszy (albo większy) jest plik po konwersji, więc dobór jakości przestaje być zgadywanką.',
			'Te trzy formaty mają różne zadania. PNG jest bezstratny i ma pełną przezroczystość — właściwy do zrzutów ekranu, elementów interfejsu i wszystkiego z ostrymi krawędziami albo tekstem. JPEG mocno kompresuje fotografie, ale nie ma kanału alfa i rozmywa twarde krawędzie. WebP przy porównywalnej jakości bije zwykle JPEG o 25–35%, obsługuje przezroczystość i działa we wszystkich aktualnych przeglądarkach — w sieci to zwykle właściwa odpowiedź.',
			'Konwersja odbywa się na płótnie w Twojej przeglądarce: obraz jest dekodowany, przerysowywany i kodowany ponownie tymi samymi kodekami, których przeglądarka używa do wyświetlania stron. To właśnie czyni narzędzie prywatnym — i dlatego dokładna liczba bajtów różni się nieco między Chrome, Firefoksem i Safari, bo każde ma własne kodery.'
		],
		faqs: [
			{
				q: 'Jaką jakość ustawiać dla JPEG i WebP?',
				a: 'Przedział 75–90 pokrywa niemal każde realne zastosowanie. Przy 85 większość zdjęć jest wizualnie nie do odróżnienia od źródła przy ułamku rozmiaru; poniżej mniej więcej 70 w gradientach i odcieniach skóry pojawiają się artefakty blokowe; powyżej 90 rozmiar rośnie stromo za zysk, którego nie zobaczysz. Przeciągnij suwak i patrz na kafelek rozmiaru — optimum zwykle rzuca się w oczy.'
			},
			{
				q: 'Dlaczego mój PNG urósł po konwersji na JPEG?',
				a: 'JPEG powstał do fotograficznych gradientów, a nie płaskich barw. Zrzuty ekranu, diagramy i grafika interfejsu kompresują się znakomicie jako PNG (długie ciągi identycznych pikseli), ale zmuszają JPEG do zapisywania szumu wokół każdej ostrej krawędzi — stąd większe pliki i widoczne obwódki. Trzymaj grafikę w PNG albo skonwertuj ją na WebP nastawiony na bezstratność.'
			},
			{
				q: 'Co dzieje się z przezroczystością przy konwersji na JPEG?',
				a: 'JPEG nie ma kanału alfa, więc przezroczyste obszary trzeba czymś wypełnić — to narzędzie spłaszcza je na biało, zgodnie z konwencją obrazów w sieci. Jeśli przezroczystość ma przetrwać, wybierz jako cel PNG albo WebP.'
			},
			{
				q: 'Dlaczego moja przeglądarka nie eksportuje tu AVIF ani HEIC?',
				a: 'API canvas toBlob koduje wyłącznie formaty, dla których przeglądarka ma koder — PNG i JPEG wszędzie, WebP w Chromium i Firefoksie. Kodowanie AVIF wciąż jest rzadkie, a HEIC obciążone patentami, więc przeglądarki je dekodują, ale nie tworzą. Jeśli wybierzesz format, którego Twoja przeglądarka nie potrafi zapisać, narzędzie to powie, zamiast po cichu podać Ci PNG.'
			}
		]
	},

	'image-resizer': {
		about: [
			'Przeskaluj obraz do konkretnej szerokości, konkretnej wysokości albo procentu oryginału — drugi wymiar podąża automatycznie, więc nic się nie rozciąga. Wybierz format wyjściowy (albo zostaw źródłowy), ustaw jakość dla formatów stratnych, obejrzyj podgląd i pobierz. Kafelki przed/po pokazują wymiary i rozmiar pliku na pierwszy rzut oka.',
			'Skalowanie korzysta z trybu wysokiej jakości wygładzania w przeglądarce, który stosuje właściwe ponowne próbkowanie zamiast prostego odrzucania pikseli — pomniejszone zdjęcia pozostają ostre, zamiast migotać aliasingiem. Zmiana rozmiaru to też uczciwy sposób na zmniejszenie pliku: przepołowienie obu wymiarów usuwa trzy czwarte pikseli, czemu żaden suwak jakości nie dorówna.',
			'Pliki nigdy nie opuszczają strony: dekodowanie, ponowne próbkowanie i ponowne kodowanie działają na lokalnym płótnie. Nie ma paska postępu wysyłania, bo nie ma wysyłania — zdjęcie o rozdzielczości 40 megapikseli skaluje się tak szybko, jak Twoja maszyna zdąży je przerysować, i działa przy wypiętym kablu sieciowym.'
		],
		faqs: [
			{
				q: 'Czy pomniejszenie i powiększenie z powrotem odtworzy mój obraz?',
				a: 'Nie — pomniejszanie bezpowrotnie odrzuca piksele. Skalowanie zdjęcia z 3000 px do 300 px zachowuje 1% danych; powiększenie z powrotem interpoluje brakujące 99% jako rozmycie. Trzymaj oryginał i eksportuj z niego pomniejszone kopie, zamiast skalować jedyny egzemplarz, jaki masz.'
			},
			{
				q: 'Dlaczego powiększony obraz wygląda miękko?',
				a: 'Powiększanie nie stworzy detalu, którego nigdy nie zarejestrowano — przeglądarka interpoluje między istniejącymi pikselami, co powyżej mniej więcej 2× odbiera się jako miękkość. Prawdziwe powiększanie ponad ten poziom wymaga narzędzi opartych na uczeniu maszynowym, które dopowiadają wiarygodny detal; resampler na płótnie celowo niczego nie zmyśla.'
			},
			{
				q: 'Jak trafić w zadany rozmiar pliku, na przykład „poniżej 200 KB”?',
				a: 'Użyj obu dźwigni: najpierw przeskaluj do największych wymiarów, jakich naprawdę potrzebujesz (1200 px szerokości w zupełności wystarcza większości układów w sieci), a potem wybierz WebP albo JPEG i obniżaj jakość, aż kafelek rozmiaru zejdzie poniżej celu. Największą robotę wykona redukcja wymiarów — jakość dostraja resztę.'
			},
			{
				q: 'Czy zmiana rozmiaru usuwa metadane EXIF, na przykład lokalizację GPS?',
				a: 'Tak. Potok na płótnie koduje na nowo czyste piksele — model aparatu, znaczniki czasu, współrzędne GPS i każdy inny znacznik EXIF znikają z wyniku. Dla obrazów trafiających do publicznej sieci to zwykle zysk dla prywatności; jeśli metadane mają zostać zachowane, trzymaj oryginał obok.'
			}
		]
	},

	'favicon-generator': {
		about: [
			'Upuść jeden obraz — najlepiej kwadratowe logo o boku 512 px lub większym — i dostań kompletny zestaw favikon: plik favicon.ico z rozmiarami 16, 32 i 48 px na karty i zakładki, pliki PNG w standardowych rozmiarach łącznie ze 180-pikselową ikoną Apple touch i ikonami PWA 192/512 px, startowy site.webmanifest oraz znaczniki <link> do wklejenia w <head>. Jedno pobranie ZIP zawiera wszystko, nazwane dokładnie tak, jak oczekują konwencje.',
			'Szczegóły, które poradniki o favikonach zwykle psują, są tutaj dopilnowane: ICO osadza wpisy skompresowane jako PNG (obsługiwane wszędzie od czasów Windows Vista i znacznie mniejsze od dawnych ikon BMP); ikona Apple touch jest spłaszczana na wybrany przez Ciebie kolor tła, bo iOS zamienia przezroczystość na czerń; a ikony PWA zachowują kanał alfa. Źródła niekwadratowe są przycinane do środka, a nie ściskane.',
			'Zmniejszenie logo do 16 px jest z natury destrukcyjne — drobny detal po prostu tego nie przeżyje — dlatego rząd podglądów pokazuje każdy rozmiar w rzeczywistych wymiarach, byś ocenił czytelność przed wdrożeniem. Wszystko renderuje się na lokalnym płótnie, a kontenery ICO i ZIP składane są bajt po bajcie na stronie; Twoje logo nigdzie nie jest wysyłane.'
		],
		faqs: [
			{
				q: 'Jakich rozmiarów favikon naprawdę potrzebuję w 2026 roku?',
				a: 'Mniej, niż sugeruje folklor: favicon.ico z rozmiarami 16/32/48 dla starszych zastosowań i paska adresu, jeden apple-touch-icon.png o boku 180 px oraz pliki PNG 192/512 px wskazane z manifestu aplikacji webowej. Nowoczesne przeglądarki wybierają najlepsze dopasowanie właśnie z tego zestawu — dwudziestoplikowe paczki z niektórych generatorów to kult cargo.'
			},
			{
				q: 'Dlaczego moje logo jest nieczytelne przy 16 px?',
				a: 'Szesnaście pikseli to brutalnie mało — sygnety słowne, cienkie kreski i delikatne gradienty po prostu się rozpuszczają. Dobre favikony sprowadzają markę do jednego mocnego znaku lub kształtu o wysokim kontraście. Jeśli podgląd 16 px jest tutaj papką, przytnij ciaśniej do charakterystycznej części znaku albo użyj uproszczonego wariantu dla małych rozmiarów.'
			},
			{
				q: 'Czy plik .ico jest wciąż potrzebny, czy wystarczą favikony PNG?',
				a: 'Każda nowoczesna przeglądarka przyjmuje favikony PNG, ale /favicon.ico wciąż jest ścieżką, o którą agenty użytkownika, roboty i starsze narzędzia pytają w ciemno. Wystawienie tam prawdziwego ICO kosztuje kilka kilobajtów i eliminuje całą klasę błędów 404 oraz dziwactw awaryjnych — trzymaj go obok odnośników do PNG.'
			},
			{
				q: 'Dlaczego ikona Apple touch potrzebuje koloru tła?',
				a: 'iOS nie renderuje przezroczystości w ikonach na ekranie głównym — jakakolwiek alfa w Twoim PNG zostanie złożona na czarnym tle. Wcześniejsze spłaszczenie na wybranym kolorze sprawia, że wynik jest zamierzony. Wybierz tło pasujące do ikony i pamiętaj, że iOS sam zaokrągla narożniki, więc dostarcz pełny kwadrat na spad.'
			}
		]
	},

	'sql-formatter': {
		about: [
			'Wklej zapytanie prosto z pliku logu, z debugowego zrzutu ORM-a albo z jednolinijkowca kolegi, a ten formater rozbije je na czytelne klauzule ze spójnymi wcięciami. Obsługiwanych jest sześć dialektów — standardowy SQL, PostgreSQL, MySQL, SQLite, SQL Server i BigQuery — więc składnia specyficzna dla dialektu, jak TOP, identyfikatory w grawisach czy typy tablicowe, formatuje się poprawnie, zamiast wywracać parser.',
			'Wielkość liter słów kluczowych jest konfigurowalna: WERSALIKI dla klasycznego wyglądu, małe litery, jeśli tak woli Twój zespół, albo zostawienie oryginału bez zmian. Tryb minifikacji robi rzecz odwrotną — zwija sformatowane zapytanie do jednej linii, usuwając komentarze i zostawiając literały tekstowe bajt w bajt nietknięte, czyli dokładnie to, czego chcesz przed wklejeniem SQL-a do konfiguracji JSON albo flagi w wierszu poleceń.',
			'Zapytania często zawierają nazwy tabel, dane klientów w literałach albo wskazówki o infrastrukturze. Formatowanie działa w całości w Twojej przeglądarce, więc nic z tego nie trafia na żaden serwer.'
		],
		faqs: [
			{
				q: 'Który dialekt SQL wybrać?',
				a: 'Ten, którym mówi Twoja baza — od niego zależy sposób parsowania identyfikatorów, cudzysłowów w napisach i słów kluczowych dialektu. Jeśli chodzi tylko o ogólne uporządkowanie, standardowy SQL obsłuży wspólny rdzeń. Błąd parsowania na składni poprawnej dla Twojej bazy to zwykle sygnał, żeby zmienić dialekt.'
			},
			{
				q: 'Czy formatowanie zmienia działanie zapytania?',
				a: 'Nie. Formatowanie przesuwa tylko białe znaki i — jeśli włączysz tę opcję — zmienia wielkość liter słów kluczowych; identyfikatory i literały zachowują dokładnie swoje bajty. Słowa kluczowe SQL są w każdym obsługiwanym dialekcie niewrażliwe na wielkość liter, więc SELECT i select to ta sama instrukcja.'
			},
			{
				q: 'Czy mogę sformatować wiele instrukcji naraz?',
				a: 'Tak — wklej cały skrypt, a każda instrukcja zakończona średnikiem zostanie sformatowana po kolei, z pustą linią pomiędzy nimi.'
			},
			{
				q: 'Co dokładnie usuwa minifikacja?',
				a: 'Znikają komentarze liniowe (--) i blokowe (/* */), ciągi białych znaków zwijają się do pojedynczych spacji, a spacje wokół przecinków i nawiasów są usuwane. Tekst w apostrofach, cudzysłowach i grawisach nie jest ruszany, łącznie z podwojonymi znakami ucieczki.'
			}
		]
	},

	'xml-formatter': {
		about: [
			'To narzędzie formatuje XML z wybranym przez Ciebie wcięciem, zgłasza błędy poprawności składniowej wraz z dokładnym wierszem i kolumną oraz potrafi zminifikować dokument do jednej linii. Komentarze, sekcje CDATA i prolog XML przeżywają formatowanie — zaskakująco wiele formaterów zjada je po cichu.',
			'Walidacja oznacza tu poprawność składniową: właściwie zagnieżdżone znaczniki, wartości atrybutów w cudzysłowach, dozwolone znaki. To wyłapuje przytłaczającą większość wypadków przy ręcznej edycji — brakujący ukośnik, niedomknięty element, zabłąkany ampersand. Walidacja względem schematu XSD jest celowo poza zakresem; jej miejsce jest w Twoim potoku budowania, gdzie plik schematu jest dostępny.',
			'Pliki konfiguracyjne, ładunki SOAP, kanały RSS i manifesty Androida rutynowo zawierają wewnętrzne nazwy hostów i klucze. Wszystko tutaj parsuje się lokalnie — nic nie jest przesyłane.'
		],
		faqs: [
			{
				q: 'Dlaczego mój XML wywala się z „char … is not expected”?',
				a: 'Zwykle winne są: surowy znak &, który powinien być &amp;, wartość atrybutu bez cudzysłowów albo znaczniki zamykane w złej kolejności. Komunikat błędu niesie wiersz i kolumnę pierwszego problematycznego znaku, a pole wejściowe je zaznacza.'
			},
			{
				q: 'Czy formater przestawia albo normalizuje mój dokument?',
				a: 'Nie. Elementy, atrybuty i ich kolejność zostają zachowane co do joty; zmienia się wyłącznie odstęp między elementami. Treść tekstowa dzieląca wiersz ze znacznikami jest przycinana, a wewnętrzne ciągi białych znaków zwijane — jeśli polegasz na znaczących odstępach (xml:space="preserve"), trzymaj takie fragmenty w formie zminifikowanej.'
			},
			{
				q: 'Co usuwa minifikacja?',
				a: 'Wcięcia i łamania wierszy między elementami oraz komentarze. Sekcje CDATA, instrukcje przetwarzania i prolog zostają. Wynik parsuje się identycznie dla każdego odbiorcy, który nie zależy od węzłów tekstowych złożonych wyłącznie z białych znaków.'
			},
			{
				q: 'Czy potrafi walidować względem XSD albo DTD?',
				a: 'Nie — sprawdzana jest wyłącznie poprawność składniowa. Walidacja schematem wymaga pliku schematu i silnika XSD, co lepiej robić w swoim łańcuchu narzędzi (xmllint --schema albo biblioteka XML Twojego języka).'
			}
		]
	},

	'xml-to-json': {
		about: [
			'Konwertuj XML na JSON, żeby podać stare odpowiedzi SOAP, kanały RSS albo pliki POM Mavena do JavaScriptu, jq lub API mówiącego natywnie w JSON — albo idź w drugą stronę i wyprodukuj XML z danych JSON. Atrybuty są zachowywane: stają się kluczami „@_nazwa”, a treść tekstowa współistniejąca z atrybutami ląduje pod „#text”, więc żadna informacja nie znika po cichu.',
			'Oba formaty różnią się w rzeczach podstawowych, a ten konwerter dokonuje standardowych, pragmatycznych wyborów: powtarzające się elementy rodzeństwa zwijają się w tablicę JSON, wartości wyglądające na liczby stają się liczbami, a przestrzenie nazw podróżują jako część nazwy elementu. Obieg XML → JSON → XML zachowuje strukturę i treść typowych dokumentów.',
			'Oba kierunki działają lokalnie w Twojej przeglądarce. Wklej kanał z fakturami albo odpowiedź API, a nic nigdzie nie pojedzie.'
		],
		faqs: [
			{
				q: 'Dlaczego niektóre wartości wracają jako liczby zamiast napisów?',
				a: 'Parser rozpoznaje tekst liczbowy i go konwertuje, czego oczekuje większość odbiorców. Uważaj na identyfikatory z wiodącymi zerami (kody produktów, numery telefonów) — jeśli to ma dla Twoich danych znaczenie, ujmij je w cudzysłów po konwersji albo potraktuj wynik jako punkt wyjścia.'
			},
			{
				q: 'Jak traktowane są powtarzające się elementy?',
				a: 'Dwa lub więcej elementów rodzeństwa o tej samej nazwie stają się tablicą JSON pod tym kluczem. Pojedyncze wystąpienie pozostaje zwykłym obiektem — ta asymetria jest wpisana w to odwzorowanie, więc kod czytający ten JSON powinien znieść oba kształty albo najpierw je ujednolicić.'
			},
			{
				q: 'Co oznaczają klucze @_ i #text?',
				a: '@_ oznacza to, co było atrybutem XML, a #text niesie tekst elementu, gdy występują też atrybuty. Podanie tej samej konwencji z powrotem w kierunku JSON → XML odtwarza oryginalny dokument.'
			},
			{
				q: 'Dlaczego JSON → XML odrzuca moją tablicę na najwyższym poziomie?',
				a: 'Dokument XML musi mieć dokładnie jeden element główny, a goła tablica nie ma żadnego. Zawiń ją w obiekt — {"items": {"item": [...]}} — a konwerter wyprodukuje poprawny składniowo dokument.'
			}
		]
	},

	'markdown-to-html': {
		about: [
			'Pisz albo wklejaj Markdown i oglądaj obok siebie wyrenderowany podgląd i wygenerowany HTML — z nagłówkami, tabelami GFM, punktami w stylu list zadań, blokami kodu w ogrodzeniach i przekreśleniem. Kierunek odwrotny zamienia istniejący HTML w czysty Markdown z nagłówkami ATX, punktami z myślnikiem i kodem w ogrodzeniach, co jest najszybszą drogą do przeniesienia starych treści z CMS-a do repozytorium dokumentacji.',
			'Podgląd jest oczyszczany przed renderowaniem: skrypty, ramki iframe i atrybuty obsługi zdarzeń są usuwane, więc udostępniony link niosący wrogi kod nie uruchomi niczego w Twojej przeglądarce. Pole wyjściowe HTML zawsze pokazuje surową konwersję do skopiowania do szablonów albo maili.',
			'Konwersja i podgląd działają lokalnie. Szkice informacji o wydaniu z nazwami niezapowiedzianych funkcji zostają na Twojej maszynie.'
		],
		faqs: [
			{
				q: 'Która to odmiana Markdowna?',
				a: 'CommonMark plus te rozszerzenia GitHuba, których ludzie faktycznie używają: tabele, przekreślenie i automatyczne linkowanie adresów. Miękkie łamania wierszy pozostają miękkie — pojedynczy znak nowej linii nie zamienia się w <br>, zgodnie z tym, jak GitHub renderuje dokumenty.'
			},
			{
				q: 'Dlaczego podgląd różni się od surowego wyjścia HTML?',
				a: 'Podgląd przechodzi przez sanityzator, który przed renderowaniem usuwa znaczniki script, wbudowane procedury obsługi zdarzeń i adresy javascript:. Pole wyjściowe pomija sanityzację, bo to tekst, a nie renderowany dokument — jeśli osadzasz HTML od użytkowników, oczyść go u siebie.'
			},
			{
				q: 'Jak wierna jest konwersja HTML → Markdown?',
				a: 'Elementy strukturalne — nagłówki, listy, odnośniki, wyróżnienia, kod, cytaty, obrazy — konwertują się czysto. HTML bez odpowiednika w Markdownie (zagnieżdżone tabele, divy z klasami, style inline) przechodzi jako surowy HTML albo traci stylowanie, więc szybkie przejrzenie wyniku bywa opłacalne.'
			},
			{
				q: 'Czy mogę użyć wygenerowanego HTML-a w e-mailu?',
				a: 'Tak — wynik to zwykły semantyczny HTML bez klas i zewnętrznych arkuszy stylów, czyli dokładnie to, co klienci poczty znoszą najlepiej. Potrzebne stylowanie dołóż na wierzchu jako inline.'
			}
		]
	},

	'html-formatter': {
		about: [
			'Uporządkuj HTML, który wyszedł z bundlera, scrapera albo edytora WYSIWYG: elementy dostają wcięcia o wybranej szerokości, atrybuty zostają w swoim wierszu, a zawartość pre i textarea pozostaje nietknięta bajt w bajt. Tryb minifikacji usuwa komentarze i zwija odstępy między znacznikami — na ręcznie pisanych stronach to zwykle 10–25% mniej wagi.',
			'Minifikacja jest tu celowo zachowawcza: skrypty i style inline są chronione, komentarze warunkowe przeżywają, a pojedyncze spacje między elementami liniowymi zostają zachowane, żeby „kliknij <a>tutaj</a> teraz” nie zlało się w jedno słowo. Dostajesz minifikację bezpieczną, a nie maksymalnie agresywną.',
			'Obie operacje działają lokalnie w Twojej przeglądarce — nieopublikowane strony i markup wewnętrznych paneli administracyjnych nigdy nie opuszczają Twojej maszyny.'
		],
		faqs: [
			{
				q: 'Czy minifikacja zepsuje mój wbudowany JavaScript albo CSS?',
				a: 'Nie — bloki <script>, <style>, <pre> i <textarea> są całkowicie wyłączone ze zwijania białych znaków. Ruszany jest wyłącznie markup pomiędzy znacznikami. Żeby skompresować same skrypty, przepuść je osobno przez minifikator JavaScriptu.'
			},
			{
				q: 'Dlaczego usuwanie odstępów między znacznikami jest bezpieczne?',
				a: 'Przeważnie jest: odstęp między elementami blokowymi nie ma efektu wizualnego. Między elementami liniowymi już ma — dlatego minifikator zwija ciągi do pojedynczej spacji, zamiast je kasować. Układy oparte na sztuczkach z odstępami przy inline-block to rzadki wyjątek wart obejrzenia.'
			},
			{
				q: 'Czy formater naprawia niepoprawny HTML?',
				a: 'Formatuje to, co dostanie, bez walidacji względem specyfikacji HTML — niedomknięte znaczniki zostają niedomknięte. Przeglądarki wybaczają zupę znaczników, więc formatowanie i tak pomoże Ci zobaczyć strukturę na tyle dobrze, by wypatrzyć problem.'
			},
			{
				q: 'Jakiej szerokości wcięcia używać?',
				a: '2 spacje to dominująca konwencja w webowych bazach kodu i domyślne ustawienie większości przewodników stylu we frameworkach. Wybierz 4, jeśli Twój zespół tak się umówił — to kwestia czysto kosmetyczna.'
			}
		]
	},

	'css-formatter': {
		about: [
			'Rozwiń zminifikowany albo wklejony skądś CSS w reguły z jedną deklaracją na wiersz, albo ściśnij arkusz na produkcję. Upiększacz normalizuje wcięcia i ustawienie nawiasów klamrowych; minifikator usuwa komentarze, zwija białe znaki i kasuje końcowe średniki, zostawiając nietknięte napisy, zawartość url(...) i wyrażenia calc().',
			'Minifikator uczciwie mówi, czego nie robi: nie zmienia nazw selektorów, nie scala zduplikowanych reguł ani nie przepisuje kolorów. Dzięki temu wynik jest przewidywalny i bezpieczny dla każdego arkusza, także takiego z hackami i prefiksami producentów — wklej, zminifikuj, wdrażaj.',
			'Jak w każdym narzędziu tutaj, przetwarzanie jest lokalne. Niewydany kod systemu projektowego zostaje w Twojej przeglądarce.'
		],
		faqs: [
			{
				q: 'O ile mniejszy robi się zminifikowany CSS?',
				a: 'Zwykle o 15–30% przy CSS-ie pisanym ręcznie, głównie dzięki wcięciom i komentarzom. Gzip na serwerze usuwa dużą część tej samej redundancji, więc różnica w rozmiarze na łączu jest mniejsza, niż sugerują surowe bajty — i tak minifikuj, bo skraca to również czas parsowania.'
			},
			{
				q: 'Czy to bezpieczne dla calc(), właściwości niestandardowych i zapytań medialnych?',
				a: 'Tak. Spacje wewnątrz calc() są znaczące i zostają zachowane; właściwości niestandardowe i odwołania var() to zwykłe deklaracje i przechodzą bez zmian; @media i inne reguły at zachowują swoją strukturę.'
			},
			{
				q: 'Dlaczego selektory potomka zachowały spacje?',
				a: 'Bo „nav a” i „nava” wybierają co innego — ta spacja jest kombinatorem, a nie formatowaniem. Minifikator usuwa wyłącznie białe znaki pozbawione znaczenia składniowego.'
			},
			{
				q: 'Czy potrafi konwertować między LESS/SCSS a CSS?',
				a: 'Nie — składnia preprocesorów wymaga kompilacji, a nie formatowania. Zwykły SCSS będący jednocześnie poprawnym CSS-em sformatuje się bez problemu; zagnieżdżone reguły i miksiny już nie.'
			}
		]
	},

	'js-formatter': {
		about: [
			'Upiększ JavaScript spójnymi wcięciami i odstępami — rozminifikuj dołączony bundle, żeby zobaczyć, co naprawdę robi, albo uporządkuj kod wklejony z konsoli. Minifikator jest tu prawdziwy: Terser parsuje kod do AST, usuwa martwy kod, skraca nazwy zmiennych lokalnych i wycina komentarze — to ten sam silnik, którego bundlery używają na produkcji.',
			'Ponieważ minifikacja opiera się na AST, nigdy nie psuje działającego kodu w sposób, w jaki potrafią „kompresory” oparte na wyrażeniach regularnych: napisy, literały szablonowe, wyrażenia regularne i przypadki brzegowe ASI obsługuje prawdziwy parser. Błędy składni są raportowane z pozycją, zamiast dawać uszkodzone wyjście.',
			'Terser ładuje się dopiero przy pierwszej minifikacji, dzięki czemu strona pozostaje lekka, i działa w całości w Twojej przeglądarce — zastrzeżony kod źródłowy nigdy nie opuszcza Twojej maszyny.'
		],
		faqs: [
			{
				q: 'O ile mniejszy będzie mój kod?',
				a: 'Kod pisany ręcznie zwykle chudnie o 30–60% przed gzipem: białe znaki, komentarze i długie nazwy lokalne ważą właśnie tyle. Kod już zbundlowany kurczy się znacznie mniej — raz przeszedł przez tę samą transformację.'
			},
			{
				q: 'Czy minifikacja zmienia zachowanie?',
				a: 'Kompresja i skracanie nazw zachowują semantykę: zmieniane są tylko nazwy lokalne, a usuwanie martwego kodu wycina gałęzie, które dowodnie nie mogą się wykonać. Klasycznym wyjątkiem jest kod polegający na Function.prototype.name albo na toString() własnych funkcji.'
			},
			{
				q: 'Czy da się tym odminifikować kod produkcyjny ze strony?',
				a: 'Formater przywraca białe znaki i strukturę, przez co przepływ sterowania staje się czytelny — ale oryginalne nazwy zmiennych i komentarze przepadły na zawsze; zobaczysz a, b, c. Do poważnego debugowania lepiej sięgnąć po source mapy, jeśli serwis je publikuje.'
			},
			{
				q: 'Czy obsługuje TypeScript albo JSX?',
				a: 'Nie — jedno i drugie potrzebuje własnego parsera. Najpierw skompiluj do JavaScriptu (tsc, esbuild), a potem formatuj albo minifikuj tutaj wynik.'
			}
		]
	},

	'string-escape': {
		about: [
			'Zamień wielowierszowy napis z cudzysłowami w coś, co wkleisz do wartości JSON, literału JavaScriptu, napisu w Javie, węzła tekstowego XML, literału SQL albo komórki CSV — i odwróć proces, gdy trafisz na escapowany tekst w logu i chcesz go przeczytać. Sześć dialektów, w obie strony.',
			'Każdy dialekt trzyma się swojej faktycznej specyfikacji, a nie najmniejszego wspólnego mianownika: JSON escapuje znaki sterujące jako \\uXXXX, JavaScript dodatkowo apostrofy i grawisy, Java koduje znaki spoza ASCII jako sekwencje UTF-16 \\u, SQL podwaja apostrofy, CSV opakowuje i podwaja zgodnie z RFC 4180, a XML używa swoich pięciu predefiniowanych encji. Odwrotny tryb rozumie formy \\x, \\u i \\u{…} oraz zgłasza wadliwe sekwencje wraz z ich pozycją.',
			'Escapowane napisy to często ciągi połączeń, tokeny i fragmenty zapytań. To działa lokalnie — wklejaj bez obaw.'
		],
		faqs: [
			{
				q: 'Którego dialektu potrzebuję do pliku konfiguracyjnego JSON?',
				a: 'JSON. Escapuje cudzysłowy, ukośniki wsteczne i znaki sterujące dokładnie tak, jak wymaga RFC 8259, i zostawia unikod czytelny. Wynik wchodzi w dowolną wartość napisową JSON — bez otaczających cudzysłowów, które narzędzie zostawia Tobie.'
			},
			{
				q: 'Czym różni się dialekt JSON od JavaScriptu?',
				a: 'JavaScript escapuje dodatkowo apostrofy i grawisy, dzięki czemu wynik jest bezpieczny w każdym z trzech sposobów cytowania w JS. JSON potrzebuje wyłącznie obsługi cudzysłowów. Odwracanie escapowania przyjmuje oba, a także formy \\x i \\u{…}, których JSON nie definiuje.'
			},
			{
				q: 'Czy escapowanie SQL sprawia, że dane od użytkownika można bezpiecznie sklejać?',
				a: 'Daje poprawny literał tekstowy SQL (z podwojonymi apostrofami), ale escapowanie i sklejanie to wciąż zły wzorzec dla niezaufanych danych — używaj zapytań parametryzowanych. To narzędzie służy do fikstur, migracji i debugowania, a nie do obrony przed wstrzyknięciami.'
			},
			{
				q: 'Dlaczego odwrócenie escapowania mojego napisu się nie udaje?',
				a: 'Ukośnik wsteczny, po którym idzie coś, co nie jest zdefiniowaną sekwencją ucieczki (\\q, ucięte \\u12), jest wadliwy, a błąd wskazuje indeks winowajcy. Jeśli w tekście masz dosłowne ścieżki Windows, najpierw je zescapuj — C:\\temp to tabulator w przebraniu.'
			}
		]
	},

	'number-base-converter': {
		about: [
			'Wpisz liczbę w dowolnym systemie i czytaj ją jednocześnie dwójkowo, ósemkowo, dziesiętnie i szesnastkowo — plus w dowolnym systemie własnym do 36. Przedrostki są rozumiane (0x, 0o, 0b), grupowanie cyfr sprawia, że długie wartości daje się objąć wzrokiem (1111 1111 · 255 · ff), a odczyt długości w bitach od razu mówi, czy wartość zmieści się w 8, 32 czy 64 bitach.',
			'Arytmetyka opiera się na BigInt, więc precyzja jest dokładna przy każdym rozmiarze: uprawnienia plików, kolory ARGB, adresy IP, przedrostki skrótów i 64-bitowe identyfikatory bazodanowe konwertują się bez cichego zaokrąglania, które dotyka zwykłych liczb JavaScriptu powyżej 2⁵³.',
			'Liczby ujemne zachowują znak we wszystkich systemach. Wszystko liczy się lokalnie i natychmiast, w trakcie pisania.'
		],
		faqs: [
			{
				q: 'Jak automatyczne wykrywanie ustala system?',
				a: 'Po przedrostku: 0x oznacza szesnastkowy, 0o ósemkowy, 0b dwójkowy; cała reszta parsuje się jako dziesiętna. Cyfry w rodzaju „ff” bez przedrostka są niejednoznaczne, więc wybierz HEX wprost — komunikat błędu Ci o tym przypomni.'
			},
			{
				q: 'Czy naprawdę ogromne liczby są dokładne?',
				a: 'Tak — konwersja działa na BigInt, czyli na arbitralnej precyzji. 18446744073709551615 (2⁶⁴−1) wraca w obiegu co do jedności; konwerter oparty na liczbach zmiennoprzecinkowych zepsułby to do …551616.'
			},
			{
				q: 'Jak pokazywane są liczby ujemne w zapisie dwójkowym?',
				a: 'Ze znakiem minus (-1010), a nie w kodzie uzupełnień do dwóch, bo uzupełnienie do dwóch wymaga ustalonej szerokości. Żeby zobaczyć wzorzec U2, dodaj do swojej wartości ujemnej 2ⁿ dla interesującej Cię szerokości i przekonwertuj wynik.'
			},
			{
				q: 'Do czego przydaje się system o podstawie 36?',
				a: 'Do zwięzłych identyfikatorów: 0-9 plus a-z to najgęstszy alfabet, który pozostaje niewrażliwy na wielkość liter i bezpieczny w adresach URL. Wiele skracaczy linków i systemów zgłoszeń koduje tak numeryczne identyfikatory — wklej jeden i odczytaj kryjącą się pod nim liczbę.'
			}
		]
	},

	'text-to-hex': {
		about: [
			'Zobacz dokładnie, z jakich bajtów zbudowany jest Twój tekst: to narzędzie koduje tekst do UTF-8 i pokazuje go jako wartości szesnastkowe, dwójkowe albo dziesiętne — z wybranym separatorem, wielkością liter i przedrostkami 0x. Dekoder działa w drugą stronę i jest celowo wyrozumiały: przyjmuje ciągłe ciągi (48656c6c6f), pary rozdzielone spacjami, notację z dwukropkami w stylu adresów MAC oraz sekwencje ucieczki \\x.',
			'Ponieważ kodowanie odbywa się na poziomie bajtów UTF-8, znaki wielobajtowe widać takimi, jakie naprawdę są w pamięci i na łączu: é to c3 a9, 世 to e4 b8 96, a emoji zajmuje cztery bajty. To najszybszy sposób na diagnozowanie niezgodności kodowań, zagadek z BOM-em i problemów typu „czemu ten napis jest dłuższy, niż wygląda”.',
			'Jeśli zdekodowane bajty nie są poprawnym UTF-8, narzędzie mówi to wprost zamiast wypisywać krzaki — to mocna wskazówka, że patrzysz na dane binarne, a nie na tekst.'
		],
		faqs: [
			{
				q: 'Dlaczego jeden znak zamienia się w kilka bajtów?',
				a: 'UTF-8 ma zmienną szerokość: ASCII zostaje jednobajtowe, większość liter europejskich zajmuje dwa bajty, znaki CJK trzy, a emoji cztery. To, co tu widzisz, to dokładna sekwencja bajtów, jaką dowolny system oparty na UTF-8 — pliki, HTTP, bazy danych — zapisuje dla Twojego tekstu.'
			},
			{
				q: 'Jakie formaty wejścia przyjmuje dekoder?',
				a: 'Szesnastkowe jako ciągły ciąg, pary rozdzielone spacjami, z przedrostkami 0x lub \\x, albo rozdzielone dwukropkiem czy przecinkiem; dwójkowe jako grupy ośmiobitowe ze spacjami lub bez; dziesiętne jako rozdzielone wartości bajtów. Mieszane separatory i zabłąkane białe znaki są usuwane automatycznie.'
			},
			{
				q: 'Dlaczego dekodowanie mówi, że bajty nie są poprawnym UTF-8?',
				a: 'Sekwencja bajtów łamie reguły UTF-8 — na przykład samotne ff albo bajt kontynuacji bez bajtu prowadzącego. Dane mogą być binarne, w starszym kodowaniu w rodzaju Latin-1 albo ucięte w środku znaku.'
			},
			{
				q: 'Czy to to samo, co zrzut szesnastkowy z xxd?',
				a: 'Wartości bajtów są identyczne; xxd dokłada offsety i kolumnę ASCII. Wklej tutaj same kolumny szesnastkowe ze zrzutu xxd (bez kolumny offsetu), a zdekodują się bez problemu.'
			}
		]
	},

	'json-schema-validator': {
		about: [
			'Dwa kierunki tej samej dyscypliny: wklej przykładowy JSON i dostań wywnioskowany z niego schemat draft-07, albo wklej dane razem ze schematem i zobacz każde naruszenie wypisane wraz ze ścieżką JSON. Walidacja działa na Ajv — tym samym silniku, którego używa większość serwisów w Node — więc co przechodzi tutaj, przejdzie i w CI.',
			'Wnioskowanie jest nastawione produkcyjnie: klucze obiektów stają się otypowanymi właściwościami i pozycjami w required, tablice scalają kształty wszystkich swoich elementów, liczby całkowite są odróżniane od zmiennoprzecinkowych, a klucze występujące tylko w części elementów tablicy słusznie zostają poza required. Wynik to punkt wyjścia, który dociskasz formatami, zakresami i wzorcami.',
			'Odpowiedzi API i pliki konfiguracyjne to akurat te dane, których najmniej chcesz na cudzym serwerze. I wnioskowanie, i walidacja działają w całości w Twojej przeglądarce.'
		],
		faqs: [
			{
				q: 'Który draft JSON Schema jest obsługiwany?',
				a: 'Wnioskowanie generuje draft-07, najszerzej wspierany draft wśród edytorów i walidatorów. Walidacja przyjmuje draft-07 oraz wcześniejsze drafty, które Ajv rozumie w trybie nierestrykcyjnym; słowa kluczowe z 2019-09/2020-12 przeważnie też działają, bo nieznane słowa kluczowe są ignorowane, a nie traktowane jako błąd krytyczny.'
			},
			{
				q: 'Co oznacza $ w ścieżkach naruszeń?',
				a: 'To korzeń dokumentu, w stylu JSONPath: $.age to właściwość age na najwyższym poziomie, a $.items.2.name to pole name trzeciego elementu tablicy. Pusta ścieżka ($) znaczy, że naruszenie dotyczy samego korzenia dokumentu — złego typu albo brakującej wymaganej właściwości.'
			},
			{
				q: 'Dlaczego wywnioskowany schemat jest bardziej albo mniej restrykcyjny, niż oczekiwałem?',
				a: 'Opisuje dokładnie tę próbkę, którą podałeś: pola obecne wszędzie stają się wymagane, a dozwolone są wyłącznie zaobserwowane typy. Podaj bardziej zróżnicowaną próbkę (tablicę reprezentatywnych obiektów), żeby dostać ogólniejszy schemat, a potem popraw go ręcznie — wnioskowanie nie zna Twoich intencji.'
			},
			{
				q: 'Czy walidacja obsługuje format, pattern i inne słowa kluczowe ograniczeń?',
				a: 'Słowa kluczowe strukturalne (type, required, properties, items, enum, minimum, pattern…) są egzekwowane w pełni. Wartości format w rodzaju „email” czy „date-time” nie są sprawdzane — odzwierciedla to specyfikację JSON Schema, w której format jest domyślnie adnotacją, i pozwala uniknąć fałszywego poczucia bezpieczeństwa.'
			}
		]
	},

	'exif-viewer': {
		about: [
			'Każde zdjęcie z Twojego telefonu niesie ukryte metadane: model aparatu, czas wykonania, oprogramowanie do edycji — a jeśli nie wyłączono tej opcji, także współrzędne GPS miejsca, w którym stałeś. To narzędzie odczytuje takie metadane z plików JPEG, PNG i WebP i pokazuje je pogrupowane oraz rozszyfrowane: wartości ekspozycji jako f/2.8 i 1/250 s, orientację słowami, a GPS jako współrzędne dziesiętne z odnośnikiem do mapy.',
			'Funkcja czyszczenia tworzy kopię pozbawioną metadanych — bezstratnie. Zamiast kodować obraz na nowo (co kosztuje jakość), usuwa segmenty metadanych bajt po bajcie: bloki EXIF i XMP w JPEG, fragmenty tekstowe i czasowe w PNG, kawałki EXIF/XMP w WebP. Piksele, wymiary i jakość zostają nietknięte; profile kolorów są zachowywane, więc obraz nadal wyświetla się identycznie.',
			'To jedyna kategoria narzędzi, w której „działa lokalnie” jest całym sensem: sprawdzanie zdjęcia pod kątem danych GPS przez wysłanie go na serwer przeczyłoby idei. Plik nigdy nie opuszcza Twojej przeglądarki — co możesz sprawdzić w zakładce sieci.'
		],
		faqs: [
			{
				q: 'Czy usunięcie metadanych zmienia jakość obrazu?',
				a: 'Nie. Strumień danych obrazu jest kopiowany bit w bit; usuwane są wyłącznie segmenty metadanych. Oczyszczony plik jest mniejszy dokładnie o rozmiar metadanych, a piksele pozostają dowodliwie identyczne.'
			},
			{
				q: 'Dlaczego mój zrzut ekranu nie pokazuje żadnych metadanych?',
				a: 'Zrzuty ekranu i większość obrazów eksportowanych na potrzeby sieci nigdy nie miały EXIF-u — zapisują go aparaty, a narzędzia do zrzutów przeważnie nie. Platformy społecznościowe też usuwają metadane przy wgrywaniu, więc zdjęcie pobrane z takiej platformy zwykle jest już czyste.'
			},
			{
				q: 'Czy pozycja GPS jest dokładna?',
				a: 'GPS telefonu zapisany w EXIF jest zwykle dokładny do kilku metrów — wystarczająco, by wskazać budynek. Narzędzie zamienia zapisane stopnie, minuty i sekundy na postać dziesiętną i linkuje do konkretnego punktu, żebyś zobaczył dokładnie to, co zobaczyłby odbiorca pliku.'
			},
			{
				q: 'Dlaczego oczyszczony plik zachowuje profil kolorów ICC?',
				a: 'Profil ICC mówi oprogramowaniu, jak interpretować kolory — usunięcie go potrafi je widocznie przesunąć, a sam profil nie zawiera żadnych informacji osobowych. Czyszczenie usuwa metadane identyfikujące (EXIF, XMP, IPTC, komentarze, znaczniki czasu) i zostawia to, czego obraz potrzebuje do poprawnego wyświetlenia.'
			}
		]
	}
};

export default TOOL_CONTENT_PL;
