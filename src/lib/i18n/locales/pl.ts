import type { Messages } from '$lib/i18n';

const pl: Messages = {
	code: 'pl',
	name: 'Polski',
	ui: {
		search: 'Szukaj',
		overview: 'Przegląd',
		toggleTheme: 'Przełącz motyw',
		themeSystem: 'Jak w systemie',
		themeDark: 'Ciemny',
		themeLight: 'Jasny',
		themeTitle: 'Motyw: {mode} — kliknij, aby zmienić',
		footerPrivacy: 'Działa w Twojej przeglądarce — nic, co wkleisz, nie jest wysyłane',
		allTools: 'Wszystkie narzędzia',
		changelog: 'Historia zmian',
		changelogMetaDescription:
			'Co nowego na onlinetools.dev — nowe narzędzia, funkcje i poprawki, wszystko działa lokalnie w Twojej przeglądarce.',
		releaseDate: 'Data wydania',
		language: 'Język',
		openNav: 'Otwórz nawigację',
		searchTools: 'Szukaj narzędzi',

		// About / Why page
		about: 'O projekcie',
		aboutTitle:
			'Dlaczego onlinetools.dev — lokalnie, bez śledzenia, do sprawdzenia | onlinetools.dev',
		aboutMetaDescription:
			'Dlaczego powstało onlinetools.dev: każde narzędzie działa w Twojej przeglądarce, nic, co wklejasz, nie jest wysyłane, bez reklam, bez trackerów, bez logowania — a licznik na żywo pozwala to sprawdzić samodzielnie.',
		aboutEyebrow: 'dlaczego to powstało · zaufanie',
		aboutVerifyHeading: 'Nie musisz wierzyć mi na słowo',
		aboutVerifyHint:
			'Wpisz lub wklej cokolwiek poniżej. Licznik zostanie na zerze — każde naciśnięcie klawisza obsługiwane jest tutaj, na Twojej maszynie.',
		aboutRequestsLabel: 'Żądania sieciowe od otwarcia tej strony',
		aboutRequestsNote:
			'Jedyne, co może ruszyć tę liczbę, to otwarcie kolejnego narzędzia, które pobiera własny kod z tej samej domeny. To, co wklejasz, nigdy jej nie ruszy.',
		aboutVerifyPlaceholder: 'Wpisz lub wklej cokolwiek — nic nie opuści Twojej przeglądarki…',
		aboutOfflineReady: 'Gotowe offline',
		aboutOfflineCaching: 'Buforowanie…',
		aboutDevtools:
			'Chcesz twardszego dowodu? Otwórz narzędzia deweloperskie przeglądarki, przejdź na zakładkę Network i wklej. Zobaczysz, jak nic się nie dzieje.',
		aboutViewSource: 'Zobacz źródło',
		aboutEditPage: 'Edytuj tę stronę',
		aboutBuiltBy: 'Autor',

		// About / Why page — the manifesto body (localized)
		aboutH1: 'Kalkulator nie powinien dzwonić do centrali.',
		aboutLead:
			'Większość stron z „narzędziami online” to ściana reklam owinięta wokół pola tekstowego, które po cichu wysyła wszystko, co wkleisz, na serwer, którego nigdy nie zobaczysz. Zmęczyło mnie dekodowanie JWT na przypadkowej stronie i orientowanie się sekundę za późno, że właśnie oddałem swój token obcemu. onlinetools.dev to moja odpowiedź: te same narzędzia, po które sięgasz codziennie, tyle że komputer wykonujący pracę to ten, który już masz przed sobą.',
		aboutS1Head: 'Wszystko działa na Twojej maszynie',
		aboutS1Body:
			'Każde narzędzie tutaj to zwykłe obliczenia w przeglądarce — bez żądania w obie strony, bez serwera, bez miejsca, dokąd cokolwiek miałoby trafić. Twój JSON, Twoje tokeny dostępu, ten {env}, który miałeś najpierw wyczyścić: idą ze schowka na ekran i tam się zatrzymują. Zbudowałem to tak nie dlatego, że taniej się to utrzymuje (choć taniej), lecz dlatego, że Twoje dane to nie moja sprawa.',
		aboutS2Head: 'Bez reklam. Bez trackerów. Bez konta.',
		aboutS2Body:
			'Nie ma skryptu analitycznego liczącego Twoje naciśnięcia klawiszy, nie ma baneru cookie (nie ma żadnych ciasteczek do zaakceptowania), nie ma „zaloguj się, aby kontynuować”, nie ma oferty premium czyhającej trzy kroki dalej. Naprawdę nie wiem, kim jesteś ani co wklejasz — i o to właśnie chodzi: narzędzie ma zrobić swoje i zapomnieć o Tobie w chwili, gdy zamkniesz kartę.',
		aboutS3Head: 'Działa, gdy sieć nie działa',
		aboutS3Body:
			'Wczytaj stronę raz, a zostaje Twoja. Cała witryna jest statyczna i buforowana przez service workera, więc w samolocie, w metrze albo za szczelnym firmowym proxy narzędzia działają dalej. Tryb samolotowy to całkiem dobre miejsce na formatowanie JSON-a.',
		aboutS4Head: 'Szybko i bez wchodzenia w drogę',
		aboutS4Body:
			'Bez ekranu powitalnego, bez „zaakceptuj regulamin”, bez okna między Tobą a pracą. Naciśnij {kbd}, aby przejść do dowolnego narzędzia, wklej cokolwiek, a właściwe narzędzie samo się pokaże — a każdy wynik dzieli od schowka jedno naciśnięcie klawisza. Klawiatura na pierwszym miejscu, na każdym poziomie.',
		aboutVerifyIntro:
			'Deklaracje o prywatności są tanie — każda strona „ceni Twoją prywatność” po drodze do sprzedania Cię dalej. Więc zamiast wiary mam coś do sprawdzenia. Ten licznik obserwuje na żywo ruch sieciowy Twojej własnej przeglądarki:',
		aboutBugLine:
			'Jeśli któreś narzędzie kiedykolwiek wyśle Twoje dane tam, gdzie nie powinno, to jest błąd, a nie model biznesowy — {issue}, a ja to naprawię.',
		aboutBugLink: 'zgłoś problem',

		// Favorites (stored locally in this browser)
		favorites: 'Ulubione',
		favoriteAdd: 'Dodaj do ulubionych',
		favoriteRemove: 'Usuń z ulubionych',

		// Home
		homeTitle: 'onlinetools.dev — Narzędzia deweloperskie działające w przeglądarce',
		homeMetaDescription:
			'Szybkie narzędzia deweloperskie obsługiwane z klawiatury, działające w całości w Twojej przeglądarce. Formatuj JSON, dekoduj JWT i Base64, konwertuj znaczniki czasu, testuj wyrażenia regularne — bez wysyłania, bez rejestracji, działa offline.',
		homeEyebrow: '{n} narzędzi · lokalnie',
		homeHeading: 'Narzędzia deweloperskie działające w przeglądarce',
		homeSub: 'Bez wysyłania, bez rejestracji, bez czekania.',
		pasteToDetect: 'wklej, a rozpozna',
		worksOffline: 'działa offline',
		shortcuts: 'skróty',
		searchPlaceholder: 'Przeszukaj {n} narzędzi albo wklej cokolwiek…',
		startHere: 'Zacznij tutaj',
		smartPaste: 'Inteligentne wklejanie',
		smartPasteDesc:
			'Wklej cokolwiek i gdziekolwiek — typ treści zostanie rozpoznany, a właściwe narzędzie będzie o jedno naciśnięcie klawisza.',
		keyboardFirst: 'Klawiatura na pierwszym miejscu, od początku do końca',
		keyboardFirstDesc: 'Znajdź, uruchom, skopiuj i udostępnij bez dotykania myszy.',
		kbdAnyTool: 'dowolne narzędzie',
		kbdCopyResult: 'kopiuj wynik',
		kbdConfirm: 'potwierdź',
		kbdAllShortcuts: 'wszystkie skróty',

		// Paste hero (homepage)
		pasteHeroHeading: 'Wklej cokolwiek — dostaniesz właściwe narzędzie od razu',
		pasteHeroPlaceholder: 'Wklej JWT, JSON, znacznik czasu, kolor, adres URL, obraz…',
		tryLabel: 'Wypróbuj',
		plainText: 'Zwykły tekst',
		noMatchHint:
			'Brak dokładnego dopasowania — wybierz narzędzie tekstowe poniżej lub przeszukaj wszystko',
		runHint: 'uruchom',
		newlineHint: 'nowa linia',
		clearHint: 'wyczyść',

		// Pipeline (tool chains)
		chainNavLabel: 'Potok',
		chainNew: 'Nowy',
		chainSteps: 'Kroki',
		chainMoreRecipes: 'Więcej przepisów',
		chainTitle:
			'Potok narzędzi — łącz narzędzia deweloperskie w przeglądarce | onlinetools.dev',
		chainMetaDescription:
			'Połącz narzędzia deweloperskie w potok — dekoduj, przekształcaj i wyciągaj dane w jednym przebiegu. Każdy krok zasila następny, wszystko działa w Twojej przeglądarce, a cały przepis mieści się w linku do udostępnienia.',
		chainEyebrow: 'warsztat · lokalnie',
		chainHeading: 'Potok',
		chainSub:
			'Połącz narzędzia w przepis — każdy krok zasila następny. Działa w całości w Twojej przeglądarce.',
		chainInputPlaceholder: 'Wklej lub wpisz dane wejściowe…',
		chainAddStep: 'Dodaj krok',
		chainSearchSteps: 'Szukaj kroków…',
		chainStarters: 'Na start',
		chainEmpty: 'Dodaj krok — każdy krok zasila następny.',
		chainHomeCta: 'Połącz narzędzia w potok',
		chainHomeCtaSub:
			'Przekaż wynik jednego narzędzia do kolejnego — dekoduj, przekształcaj i wyciągaj dane w jednym przebiegu.',

		// Tools index page
		toolsTitle: 'Wszystkie narzędzia deweloperskie — onlinetools.dev',
		toolsMetaDescription:
			'Przejrzyj wszystkie narzędzia na onlinetools.dev: JSON, YAML, Base64, JWT, znaczniki czasu, cron, regex, diff, UUID, hashe, kody QR i więcej — wszystko działa lokalnie w Twojej przeglądarce.',
		toolsBlurb:
			'{n} narzędzi, każde liczone w Twojej przeglądarce. Kolejne dochodzą regularnie — zobacz',

		// Tool page shell
		toolTitle: '{name} — Za darmo i prywatnie | onlinetools.dev',
		toolMetaSuffix:
			'Działa w całości w Twojej przeglądarce — bez wysyłania, bez rejestracji, działa offline.',
		runsLocally: 'Działa lokalnie',
		runsLocallyTitle:
			'To narzędzie liczy wszystko w Twojej przeglądarce. Dane wejściowe nigdy nie są wysyłane.',
		aboutTool: 'O tym narzędziu',
		faqHeading: 'Często zadawane pytania',
		relatedTools: 'Powiązane narzędzia',
		breadcrumbTools: 'narzędzia',

		// Shared tool components
		sample: 'Przykład',
		line: 'wiersz',
		output: 'Wynik',
		copy: 'Kopiuj',
		copied: 'Skopiowano',
		download: 'Pobierz',
		share: 'Udostępnij',
		linkCopied: 'Link skopiowany',
		continueWith: 'Kontynuuj w',
		suggested: 'sugerowane',
		shareTooLarge:
			'Dane są za duże jak na adres URL — linki do udostępniania mają limit, żeby pozostały przenośne. Treść i tak nigdy nie opuszcza tej maszyny.',
		emptyHint: 'Wynik pojawi się tutaj w trakcie pisania',

		// Command palette
		palettePlaceholder: 'Szukaj narzędzi albo wklej treść, aby na niej działać…',
		noMatch: 'Brak pasującego narzędzia',
		navigate: 'nawigacja',
		open: 'otwórz',
		close: 'zamknij',

		// Smart paste
		detected: 'Rozpoznano',
		chars: 'znaków',

		// Shortcut help
		shortcutsTitle: 'Skróty klawiszowe',
		scPalette: 'Otwórz paletę poleceń',
		scCopy: 'Kopiuj wynik',
		scEsc: 'Zamknij panel / odrzuć sugestię',
		scHelp: 'Ten spis skrótów',
		scPaste: 'Inteligentne wklejanie — rozpoznaj treść i zaproponuj narzędzia',
		scNav: 'Nawiguj i zatwierdzaj w panelach'
	},
	tl: {
		direction: 'Kierunek',
		encode: 'Koduj',
		decode: 'Dekoduj',
		mode: 'Tryb',
		count: 'Liczba',
		lengthLbl: 'Długość',
		uppercase: 'Wielkie litery',
		lowercase: 'Małe litery',
		regenerate: 'Wygeneruj ponownie',
		b64InputEnc: 'Tekst do zakodowania',
		b64InputDec: 'Base64 do zdekodowania',
		b64PhEnc: 'Dowolny tekst, także unicode',
		b64UrlSafe: 'Bezpieczny w URL (bez dopełnienia)',
		bcHash: 'Hashuj',
		bcVerify: 'Zweryfikuj',
		bcHashT: 'Zahashuj hasło',
		bcVerifyT: 'Sprawdź hasło względem hasha',
		bcPassword: 'Hasło',
		bcCost: 'Współczynnik kosztu',
		bcHashLbl: 'Hash bcrypt',
		bcPh: 'zostaje w Twojej przeglądarce',
		bcVersion: 'Wersja',
		bcCostShort: 'Koszt',
		bcSalt: 'Sól',
		bcNote:
			'Hashowanie działa w Twojej przeglądarce — nic nie jest przesyłane. JS w przeglądarce jest wolniejszy od natywnego bcrypta, więc traktuj czasy jako górne ograniczenie.',
		caseInput: 'Tekst lub identyfikator (jeden na wiersz)',
		caseEmpty: 'Wszystkie dziewięć stylów pojawi się tutaj w trakcie pisania',
		colorInput: 'Kolor',
		colorFormats: 'Formaty',
		colorRgb: 'Kanały RGB',
		colorContrast: 'Kontrast tekstu (WCAG)',
		cronInput: 'Wyrażenie cron',
		cronEvalIn: 'obliczone w strefie',
		cronNext: 'Następne 5 uruchomień',
		cronNone: 'Brak uruchomień w ciągu najbliższych 5 lat',
		diffOriginal: 'Oryginał',
		diffChanged: 'Po zmianach',
		diffLbl: 'Różnice',
		diffUnchanged: 'bez zmian',
		diffEmpty: 'Różnice wiersz po wierszu pojawią się tutaj',
		hashInput: 'Tekst do zahashowania',
		hashPh: 'Dowolny tekst — hashe aktualizują się w trakcie pisania',
		hashHmac: 'Klucz tajny HMAC',
		hashOptional: '(opcjonalnie)',
		hashHmacPh: 'Zostaw puste, aby policzyć zwykłe hashe',
		hashDigests: 'Skróty',
		hashEmpty: 'Skróty aktualizują się na żywo w trakcie pisania',
		hashNote:
			'MD5 i SHA-1 są pokazywane wyłącznie dla starych sum kontrolnych — do czegokolwiek związanego z bezpieczeństwem użyj SHA-256 lub mocniejszego.',
		heAll: 'Koduj wszystko poza ASCII',
		heNumeric: 'Tylko liczbowe',
		heInputEnc: 'Tekst do zabezpieczenia',
		heInputDec: 'HTML z encjami',
		imgDrop: 'Upuść obraz, kliknij, aby wybrać, albo wklej ze schowka',
		imgLocal: 'Zostaje w Twojej przeglądarce — nic nie jest wysyłane',
		imgReplace: 'Upuść, kliknij lub wklej, aby zamienić',
		imgSource: 'Obraz źródłowy',
		imgOriginal: 'Oryginał',
		imgDimensions: 'Wymiary',
		imgDownload: 'Pobierz {fmt}',
		imgErrNotImage: 'Nierozpoznany format obrazu (PNG, JPEG, WebP, GIF, SVG, BMP, ICO, AVIF)',
		imgErrDecode: 'Przeglądarka nie zdołała zdekodować tego obrazu',
		imgErrEncode: 'Przeglądarka nie zdołała zakodować tego obrazu',
		imgErrFormat: 'Ta przeglądarka nie potrafi zakodować {fmt} — spróbuj PNG lub JPEG',
		i2bToB64: 'Obraz → Base64',
		i2bFromB64: 'Base64 → obraz',
		i2bInput: 'Data URL lub surowy Base64',
		i2bDataUrl: 'Data URL',
		i2bRawB64: 'Surowy Base64',
		i2bCss: 'Tło CSS',
		i2bHtml: 'HTML <img>',
		i2bEncodedSize: 'Rozmiar Base64',
		i2bOverhead: '+{pct}% względem binarnego',
		i2bNote:
			'Osadzenie oszczędza jedno żądanie, ale powiększa dokument i psuje buforowanie — najlepiej sprawdza się przy ikonach i innych zasobach poniżej ~10 KB.',
		icTarget: 'Konwertuj na',
		icQuality: 'Jakość',
		icConverted: 'Po konwersji',
		icSmaller: 'mniej niż oryginał',
		icLarger: 'więcej niż oryginał',
		icBgNote: 'JPEG nie obsługuje przezroczystości — przezroczyste obszary zostaną spłaszczone na biało.',
		icNote:
			'Konwersja korzysta z kodera canvas w Twojej przeglądarce, więc dokładne rozmiary plików nieco różnią się między przeglądarkami.',
		fgAppleBg: 'Tło ikony Apple',
		fgFiles: 'Wygenerowane pliki',
		fgHtml: 'Znaczniki HTML <link>',
		fgSmall: 'Źródło ma {px}px — ikony większe od tego zostaną powiększone i mogą być nieostre',
		fgNote:
			'Plik ICO zawiera rozmiary 16, 32 i 48 px. Ikony Apple touch nie mogą być przezroczyste, więc są spłaszczane na wybranym tle; ikony PWA zachowują kanał alfa. Źródła, które nie są kwadratowe, są przycinane do środka.',
		irBy: 'Skaluj według',
		irWidth: 'Szerokość',
		irHeight: 'Wysokość',
		irPercent: 'Procent',
		irFormat: 'Format',
		irKeep: 'Bez zmian',
		irResized: 'Po przeskalowaniu',
		irScale: 'Skala',
		irNote:
			'Pomniejszanie korzysta z wysokiej jakości wygładzania. Powiększanie nie wymyśli szczegółów — powyżej 2× spodziewaj się nieostrości.',
		jcInput: 'Tablica JSON z obiektami',
		jcDelimiter: 'Separator',
		jcComma: 'Przecinek',
		jcSemicolon: 'Średnik (Excel w Europie)',
		jcTab: 'Tabulator',
		jfInput: 'Wejściowy JSON',
		jfIndent: 'Wcięcie',
		jfIndentation: 'Sposób wcięć',
		jfSp2: '2 spacje',
		jfSp4: '4 spacje',
		jfTabs: 'Tabulatory',
		jfMin: 'Zminifikowany — bez białych znaków',
		jfSortKeys: 'Sortuj klucze',
		jfText: 'Tekst',
		jfTree: 'Drzewo',
		jfTreeHint: 'Najedź na węzeł, aby skopiować jego JSONPath — wypróbuj go w narzędziu',
		jfTreeLink: 'JSONPath',
		jpExpr: 'Wyrażenie JSONPath',
		jpDoc: 'Dokument JSON',
		jpMatches: 'Dopasowania',
		jpResults: 'Wartości wyników',
		jtInput: 'Przykładowy JSON',
		jtRoot: 'Nazwa typu głównego',
		jtNote:
			'Wywnioskowane z tej jednej próbki — oznacz pola jako opcjonalne i poszerz typy nullowalne tam, gdzie dane bywają różne.',
		jyFrom: 'Z',
		jySource: 'Format źródłowy',
		jyAutoT: 'Rozpoznaj format źródłowy z treści',
		jyTarget: 'Format docelowy',
		jyInput: 'Wejście',
		jyUnknown: 'nieznany format',
		jwtAnatomy: 'Budowa tokenu',
		jwtHeader: 'nagłówek',
		jwtPayload: 'ładunek',
		jwtSignature: 'podpis (niezweryfikowany)',
		jwtIssued: 'Wystawiony',
		jwtExpires: 'Wygasa',
		jwtNotBefore: 'Ważny od',
		jwtLifetime: 'Czas życia',
		jwtNote:
			'Dekodowanie tylko odczytuje token — nie weryfikuje podpisu. Podpisy sprawdzaj po stronie serwera kluczami wystawcy.',
		loremUnit: 'Jednostka',
		loremWords: 'Słowa',
		loremSentences: 'Zdania',
		loremParagraphs: 'Akapity',
		loremClassic: 'Zacznij od „Lorem ipsum…”',
		pwWeak: 'Słabe',
		pwFair: 'Przeciętne',
		pwStrong: 'Silne',
		pwExcellent: 'Znakomite',
		pwNoLookalikes: 'Bez podobnych znaków (0O1lI)',
		pwEntropy: 'Entropia',
		pwBits: 'bitów',
		pwNote:
			'≥ 80 bitów wytrzymuje łamanie offline szybkich hashy; ≥ 100 bitów jest praktycznie nie do odgadnięcia.',
		pwOut: 'Hasła',
		pwCrypto:
			'Wygenerowane przez crypto.getRandomValues, wyłącznie w Twojej przeglądarce. Nic nie jest zapisywane ani przesyłane.',
		qrContent: 'Treść',
		qrEc: 'Korekcja błędów',
		qrEcT: 'Przetrwa uszkodzenie {pct}',
		qrSvg: 'SVG (wektor, druk)',
		qrPng: 'PNG (czat, slajdy)',
		qrNote:
			'Treść jest kodowana bezpośrednio — bez usługi przekierowań, nic nie wygasa, żadnego śledzenia skanów.',
		qrdResult: 'Odczytana treść',
		qrdNone:
			'Nie znaleziono kodu QR — użyj ostrzejszego obrazu, przytnij bliżej kodu i zachowaj biały margines wokół niego',
		qrdOpen: 'Otwórz link',
		qrdWifiSsid: 'Sieć (SSID)',
		qrdWifiPass: 'Hasło',
		qrdWifiSec: 'Zabezpieczenia',
		qrdWifiHidden: 'Sieć ukryta',
		qrdNote:
			'Skanowanie odbywa się w całości w przeglądarce — ani obraz, ani podgląd z kamery, ani zawartość kodu nie są nigdzie wysyłane.',
		qrdCamera: 'Skanuj kamerą',
		qrdCameraStop: 'Zatrzymaj kamerę',
		qrdCameraErr: 'Kamera niedostępna — sprawdź uprawnienia przeglądarki lub użyj obrazu',
		rxPattern: 'Wzorzec',
		rxTest: 'Tekst testowy',
		rxTestPh: 'Wklej tekst, na którym sprawdzisz wzorzec',
		rxHighlighted: 'Podświetlone',
		rxMatches: 'Dopasowania',
		rxMatched: 'Dopasowany tekst',
		slugInput: 'Tytuł (jeden na wiersz)',
		slugSep: 'Separator',
		slugHyphen: 'Myślnik',
		slugUnderscore: 'Podkreślnik',
		slugMax: 'Maksymalna długość',
		slugOut: 'Slug',
		slInput: 'Wiersze',
		slPh: 'jeden na wiersz',
		slSort: 'Sortuj',
		slKeep: 'Zachowaj kolejność',
		slAsc: 'Rosnąco',
		slDesc: 'Malejąco',
		slNatural: 'Naturalnie — liczby po kolei',
		slLength: 'Według długości wiersza',
		slShuffle: 'Wymieszaj',
		slDedupe: 'Usuń duplikaty',
		slIgnoreCase: 'Ignoruj wielkość liter',
		slTrim: 'Przytnij spacje',
		slDropEmpty: 'Usuń puste',
		tsInput: 'Znacznik czasu lub data',
		tsNow: 'Bieżący czas unix:',
		tsNowT: 'Użyj bieżącego czasu jako wejścia',
		tsRelative: 'Względnie',
		tsUnixS: 'Unix w sekundach',
		tsUnixMs: 'Unix w milisekundach',
		tsZones: 'W różnych strefach czasowych',
		tsNote:
			'Znacznik pokazuje lokalną godzinę każdej strefy na 24-godzinnym pasku — przygaszone końce to 21:00–07:00.',
		uaInput: 'Ciąg User-Agent',
		uaBrowser: 'Przeglądarka',
		uaEngine: 'Silnik',
		uaOs: 'System operacyjny',
		uaDevice: 'Urządzenie',
		uaNote:
			'Przycisk „Przykład” wstawia User-Agent Twojej własnej przeglądarki. Do decyzji w czasie działania używaj wykrywania funkcji, a nie analizy UA.',
		uniInput: 'Tekst do zbadania',
		uniPh: 'Wklej cokolwiek — niewidoczne znaki staną się tutaj widoczne',
		uniGraphemes: 'Grafemy',
		uniGraphemesHint: 'to, co widzi użytkownik',
		uniCodePoints: 'Punkty kodowe',
		uniUtf16: 'Jednostki UTF-16',
		uniUtf16Hint: 'JS .length',
		uniUtf8: 'Bajty UTF-8',
		uniLimit: 'Pokazano pierwszych 300 znaków.',
		upInput: 'URL',
		upProtocol: 'Protokół',
		upHost: 'Host',
		upHostname: 'Nazwa hosta',
		upPort: 'Port',
		upPath: 'Ścieżka',
		upFragment: 'Fragment',
		upOrigin: 'Origin',
		upQuery: 'Parametry zapytania',
		upDefault: '(domyślny)',
		upNone: '(brak)',
		upEmpty: 'Składniki adresu URL pojawią się tutaj',
		urlComponent: 'Tryb komponentu (encodeURIComponent)',
		urlInputDec: 'Zakodowany tekst do zdekodowania',
		uuidOut: 'Wygenerowane identyfikatory',
		uuidFormat: 'Format identyfikatora',
		uuidHintV4: 'losowy',
		uuidHintV7: 'uporządkowany czasowo',
		uuidHintUlid: 'uporządkowany czasowo, base32',
		uuidHintNano: 'krótki, bezpieczny w URL',
		uuidNote:
			'Wygenerowane przez crypto.getRandomValues — kryptograficznie bezpieczne, utworzone w Twojej przeglądarce, nigdzie nielogowane.',
		fmtFormat: 'Formatuj',
		fmtMinify: 'Minifikuj',
		sqlInput: 'Zapytanie lub zapytania SQL',
		sqlDialect: 'Dialekt',
		sqlKeywords: 'Słowa kluczowe',
		sqlKeep: 'Bez zmian',
		xmlInput: 'Dokument XML',
		xjInputXml: 'Dokument XML',
		xjInputJson: 'Obiekt JSON',
		xjNote:
			'Atrybuty stają się kluczami „@_nazwa”, a tekst obok atrybutów trafia do „#text”, dzięki czemu konwersja działa w obie strony. Kolejność wśród mieszanych elementów rodzeństwa nie jest zachowywana — XML dopuszcza powtórzenia, obiekty JSON nie.',
		cjInput: 'Dane CSV / TSV',
		cjAuto: 'Automatycznie',
		cjPipe: 'Pionowa kreska',
		cjHeader: 'Pierwszy wiersz to nagłówek',
		cjTyped: 'Wartości z typami',
		mdPreview: 'Podgląd',
		mdNote:
			'Podgląd jest oczyszczany przed wyrenderowaniem, więc skrypty i procedury obsługi zdarzeń we wklejonej lub udostępnionej treści nie mogą się uruchomić. Pole z wynikowym HTML zawiera surową konwersję.',
		htmlInput: 'Kod HTML',
		cssInput: 'Kod CSS',
		jsInput: 'Kod JavaScript',
		escEscape: 'Escapuj',
		escUnescape: 'Cofnij escapowanie',
		escDialect: 'Dialekt',
		escInputEsc: 'Tekst do escapowania',
		escInputUnesc: 'Tekst z escapowaniem',
		nbInput: 'Liczba',
		nbFrom: 'Z',
		nbAutoT: 'Rozpoznaj po przedrostku 0x / 0o / 0b, w przeciwnym razie dziesiętnie',
		nbGroup: 'Grupuj cyfry',
		nbBase: 'System',
		nbBin: 'Binarny',
		nbOct: 'Ósemkowy',
		nbDec: 'Dziesiętny',
		nbHex: 'Szesnastkowy',
		nbBits: 'bitów',
		hbFormat: 'Bajty jako',
		hbSep: 'Separator',
		hbSpace: 'Spacja',
		hbNone: 'Brak',
		hbColon: 'Dwukropek',
		hbInputEnc: 'Tekst do zakodowania',
		hbInputDec: 'Bajty do zdekodowania',
		schInfer: 'Wywnioskuj schemat',
		schValidate: 'Waliduj',
		schInferT: 'Wygeneruj schemat na podstawie przykładowego JSON-a',
		schValidateT: 'Sprawdź JSON względem schematu',
		schData: 'Dane JSON',
		schSchema: 'JSON Schema',
		schViolations: 'naruszeń',
		schValid: 'Poprawne — dane są zgodne ze schematem',
		schResult: 'Wynik walidacji',
		exTags: 'Pola metadanych: {n}',
		exNone: 'Nie znaleziono metadanych — ten plik jest już czysty',
		exStrip: 'Pobierz oczyszczoną kopię',
		exGps: 'Osadzona lokalizacja GPS',
		exMap: 'Zobacz na mapie',
		exNote:
			'Odczyt i usuwanie odbywają się w całości w Twojej przeglądarce — zdjęcie nigdy nie jest wysyłane. Czyszczenie usuwa segmenty metadanych bajt po bajcie, bez ponownego kodowania, więc piksele i jakość pozostają nietknięte.',
		crBuilder: 'Kreator',
		crMinute: 'Minuta',
		crHour: 'Godzina',
		crDom: 'Dzień miesiąca',
		crMonth: 'Miesiąc',
		crDow: 'Dzień tygodnia',
		crEvery: 'Każdy',
		crStep: 'Co N',
		crAt: 'Konkretne',
		crUse: 'Użyj wyrażenia',
		jwtDecode: 'Dekoduj',
		jwtSign: 'Podpisz',
		jwtVerify: 'Zweryfikuj',
		jwtAlg: 'Algorytm',
		jwtPayloadLbl: 'Ładunek (obiekt JSON)',
		jwtSecret: 'Sekret',
		jwtPrivKey: 'Klucz prywatny (PKCS#8 PEM)',
		jwtPubKey: 'Sekret (HS) lub klucz publiczny PEM (RS/ES)',
		jwtSignNote:
			'Podpisywanie działa na WebCrypto w Twojej przeglądarce — klucz nigdy nie opuszcza tej strony. Dla algorytmów HS użyj długiego losowego sekretu; krótkie da się złamać siłowo niezależnie od tego, gdzie podpisujesz.',
		jwtVerifyNote:
			'Weryfikacja sprawdza podpis względem podanego klucza, lokalnie. Nie pobiera punktów końcowych JWKS ani nie sprawdza pól takich jak aud/iss — to zrób po stronie serwera.',
		tsDiff: 'Różnica między dwiema datami',
		wcWords: 'Słowa',
		wcChars: 'Znaki',
		wcCharsHint: '{n} bez spacji',
		wcReading: 'Czas czytania',
		wcReadingHint: 'przy 220 słowach/min',
		wcLines: 'Wiersze',
		wcSentences: 'Zdania',
		wcParagraphs: 'Akapity',
		wcAvg: 'Śr. długość słowa'
	},
	categories: {
		encoding: 'Kodowanie',
		json: 'JSON i dane',
		text: 'Tekst',
		time: 'Data i czas',
		generators: 'Generatory',
		crypto: 'Hashe i kryptografia',
		web: 'Web',
		image: 'Obrazy',
		code: 'Kod i znaczniki',
		privacy: 'Prywatność'
	},
	tools: {
		'json-formatter': {
			name: 'Formater i walidator JSON',
			description: 'Formatuj, waliduj i minifikuj JSON z dokładnym wskazaniem miejsca błędu'
		},
		'base64-decode': {
			name: 'Base64 — kodowanie / dekodowanie',
			description: 'Zakoduj tekst do Base64 lub zdekoduj Base64 do tekstu, także w wariancie URL-safe'
		},
		'image-to-base64': {
			name: 'Konwerter obraz ↔ Base64',
			description: 'Zamień obrazy na data URL w Base64 i z powrotem — ze snippetami CSS i HTML'
		},
		'image-converter': {
			name: 'Konwerter formatów obrazu',
			description: 'Konwertuj obrazy między PNG, JPEG i WebP z regulacją jakości'
		},
		'image-resizer': {
			name: 'Zmiana rozmiaru obrazu',
			description: 'Skaluj obrazy według szerokości, wysokości lub procentu — ostro i całkiem offline'
		},
		'favicon-generator': {
			name: 'Generator favikon',
			description: 'Zamień dowolny obraz w favicon.ico oraz pełny zestaw ikon PNG i manifestu'
		},
		'timestamp-converter': {
			name: 'Konwerter znaczników czasu unix',
			description: 'Zamieniaj znaczniki unix na czytelne daty i z powrotem, z czasem względnym'
		},
		'jwt-decoder': {
			name: 'Dekoder JWT',
			description: 'Zdekoduj nagłówek i ładunek JWT, sprawdź wygaśnięcie — w pełni offline'
		},
		'regex-tester': {
			name: 'Tester wyrażeń regularnych',
			description: 'Testuj wyrażenia regularne z podświetlaniem dopasowań i grupami na żywo'
		},
		'diff-checker': {
			name: 'Porównywarka tekstu',
			description: 'Porównaj dwa teksty wiersz po wierszu i zobacz dodania oraz usunięcia'
		},
		'url-encode-decode': {
			name: 'URL — kodowanie / dekodowanie',
			description: 'Koduj procentowo lub dekoduj składniki adresu URL i ciągi zapytań'
		},
		'url-parser': {
			name: 'Parser adresów URL',
			description: 'Rozłóż adres URL na protokół, host, ścieżkę i parametry zapytania'
		},
		'uuid-generator': {
			name: 'Generator UUID',
			description: 'Generuj UUID v4/v7, ULID i Nano ID — pojedynczo lub masowo'
		},
		'hash-generator': {
			name: 'Generator hashy',
			description: 'MD5, SHA-1, SHA-256, SHA-512 i HMAC — liczone w Twojej przeglądarce'
		},
		'color-converter': {
			name: 'Konwerter kolorów',
			description: 'Konwertuj kolory między HEX, RGB, HSL i OKLCH z podglądem na żywo'
		},
		'case-converter': {
			name: 'Konwerter wielkości liter',
			description: 'Przełączaj między camelCase, snake_case, kebab-case, PascalCase i innymi'
		},
		'word-counter': {
			name: 'Licznik słów',
			description: 'Licz słowa, znaki, zdania, bajty i czas czytania w trakcie pisania'
		},
		'lorem-ipsum-generator': {
			name: 'Generator Lorem Ipsum',
			description: 'Generuj zastępcze słowa, zdania lub akapity do makiet'
		},
		'slug-generator': {
			name: 'Generator slugów',
			description: 'Zamień tytuły w czyste slugi URL z opcjami separatora i długości'
		},
		'sort-lines': {
			name: 'Sortowanie i usuwanie duplikatów',
			description: 'Sortuj wiersze alfabetycznie lub naturalnie, usuwaj duplikaty i puste'
		},
		'html-entities': {
			name: 'Encje HTML — kodowanie / dekodowanie',
			description: 'Zabezpiecz tekst dla HTML lub zamień encje typu &amp; z powrotem na znaki'
		},
		'unicode-inspector': {
			name: 'Inspektor znaków Unicode',
			description: 'Zobacz punkty kodowe, bajty UTF-8/UTF-16 i sekwencje ucieczki każdego znaku'
		},
		'cron-parser': {
			name: 'Parser wyrażeń cron',
			description: 'Wyjaśnij dowolny harmonogram cron prostym językiem wraz z czasami uruchomień'
		},
		'password-generator': {
			name: 'Generator haseł',
			description: 'Losowe hasła z wyborem zestawu znaków i uczciwym miernikiem entropii'
		},
		'qr-code-generator': {
			name: 'Generator kodów QR',
			description: 'Generuj ostre kody QR jako SVG lub PNG — bez znaku wodnego, bez wysyłania'
		},
		'qr-code-decoder': {
			name: 'Dekoder kodów QR',
			description: 'Odczytuj kody QR z obrazów lub kamerą — URL, WiFi i tekst, całkowicie offline'
		},
		'json-to-yaml': {
			name: 'Konwerter JSON ↔ YAML ↔ TOML',
			description: 'Konwertuj między JSON, YAML i TOML z automatycznym rozpoznaniem formatu'
		},
		'json-to-csv': {
			name: 'Konwerter JSON ↔ CSV',
			description: 'Spłaszcz JSON do CSV albo sparsuj CSV z powrotem na obiekty JSON z typami'
		},
		'json-to-typescript': {
			name: 'JSON → typy TypeScript',
			description: 'Wywnioskuj interfejsy TypeScript z przykładowego JSON-a w mgnieniu oka'
		},
		'jsonpath-tester': {
			name: 'Tester JSONPath',
			description: 'Odpytuj JSON wyrażeniami JSONPath i zobacz każde dopasowanie wraz ze ścieżką'
		},
		'bcrypt-generator': {
			name: 'Bcrypt — hash i weryfikacja',
			description: 'Hashuj hasła bcryptem i sprawdzaj hashe względem tekstu jawnego'
		},
		'user-agent-parser': {
			name: 'Parser User-Agent',
			description: 'Rozpoznaj przeglądarkę, silnik, system i urządzenie z ciągu User-Agent'
		},
		'sql-formatter': {
			name: 'Formater SQL',
			description: 'Formatuj SQL ze słowami kluczowymi właściwymi dialektowi lub zwiń go do jednej linii'
		},
		'xml-formatter': {
			name: 'Formater i walidator XML',
			description: 'Formatuj, minifikuj i waliduj XML z dokładnym wskazaniem miejsca błędu'
		},
		'xml-to-json': {
			name: 'Konwerter XML ↔ JSON',
			description: 'Konwertuj dokumenty XML na JSON i z powrotem, razem z atrybutami'
		},
		'markdown-to-html': {
			name: 'Konwerter Markdown ↔ HTML',
			description: 'Renderuj Markdown do HTML z podglądem na żywo lub zamień HTML z powrotem w Markdown'
		},
		'html-formatter': {
			name: 'Formater i minifikator HTML',
			description: 'Uporządkuj zabałaganiony HTML albo zminifikuj go na produkcję'
		},
		'css-formatter': {
			name: 'Formater i minifikator CSS',
			description: 'Sformatuj CSS do czytania albo zminifikuj przed wdrożeniem'
		},
		'js-formatter': {
			name: 'Formater i minifikator JavaScript',
			description: 'Sformatuj JavaScript albo zminifikuj go z prawdziwą kompresją i skracaniem nazw'
		},
		'string-escape': {
			name: 'Escapowanie ciągów znaków',
			description: 'Escapuj lub odwracaj escapowanie ciągów dla JSON, JavaScriptu, Javy, XML, SQL i CSV'
		},
		'number-base-converter': {
			name: 'Konwerter systemów liczbowych',
			description: 'Zamieniaj liczby między systemem binarnym, ósemkowym, dziesiętnym, szesnastkowym i dowolnym do 36'
		},
		'text-to-hex': {
			name: 'Konwerter tekst ↔ hex / binarny',
			description: 'Zamień tekst na bajty hex, binarne lub dziesiętne i zdekoduj zrzuty bajtów'
		},
		'json-schema-validator': {
			name: 'Walidator i generator JSON Schema',
			description: 'Waliduj JSON względem schematu albo wywnioskuj schemat z przykładowych danych'
		},
		'exif-viewer': {
			name: 'Podgląd i usuwanie EXIF',
			description: 'Zobacz, jakie metadane niosą Twoje zdjęcia — i usuń je bez ponownego kodowania'
		}
	}
};

export default pl;
