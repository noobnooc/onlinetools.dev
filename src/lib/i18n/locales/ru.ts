import type { Messages } from '$lib/i18n';

const ru: Messages = {
	code: 'ru',
	name: 'Русский',
	ui: {
		search: 'Поиск',
		overview: 'Обзор',
		toggleTheme: 'Переключить тему',
		themeSystem: 'Как в системе',
		themeDark: 'Тёмная',
		themeLight: 'Светлая',
		themeTitle: 'Тема: {mode} — нажмите, чтобы переключить',
		footerPrivacy: 'Работает в вашем браузере — вставленное никуда не отправляется',
		allTools: 'Все инструменты',
		changelog: 'История изменений',
		releaseDate: 'Дата версии',
		language: 'Язык',
		openNav: 'Открыть навигацию',
		searchTools: 'Поиск инструментов',
		homeTitle: 'onlinetools.dev — инструменты разработчика, работающие в браузере',
		homeMetaDescription:
			'Быстрые инструменты разработчика с управлением с клавиатуры, работающие целиком в браузере. Форматируйте JSON, декодируйте JWT и Base64, конвертируйте таймстампы, тестируйте регулярные выражения — без загрузки, без регистрации, работает офлайн.',
		homeEyebrow: '{n} инструментов · локально прежде всего',
		homeHeading: 'Инструменты разработчика, работающие в браузере',
		homeSub: 'Без загрузки, без регистрации, без ожидания.',
		pasteToDetect: 'вставьте для распознавания',
		worksOffline: 'работает офлайн',
		shortcuts: 'горячие клавиши',
		searchPlaceholder: 'Найдите среди {n} инструментов или вставьте что угодно…',
		startHere: 'Начните отсюда',
		smartPaste: 'Умная вставка',
		smartPasteDesc:
			'Вставьте что угодно и где угодно — тип содержимого распознаётся, и нужный инструмент в одном нажатии.',
		keyboardFirst: 'Клавиатура прежде всего, от начала до конца',
		keyboardFirstDesc: 'Ищите, запускайте, копируйте и делитесь, не касаясь мыши.',
		kbdAnyTool: 'любой инструмент',
		kbdCopyResult: 'скопировать результат',
		kbdConfirm: 'подтвердить',
		kbdAllShortcuts: 'все сочетания',
		toolsTitle: 'Все инструменты разработчика — onlinetools.dev',
		toolsMetaDescription:
			'Все инструменты onlinetools.dev: JSON, YAML, Base64, JWT, таймстампы, cron, регулярные выражения, diff, UUID, хеши, QR-коды и другое — всё работает локально в вашем браузере.',
		toolsBlurb: '{n} инструментов, каждый считает в вашем браузере. Новые появляются регулярно — смотрите',
		toolTitle: '{name} — бесплатно и приватно | onlinetools.dev',
		toolMetaSuffix: 'Работает целиком в браузере — без загрузки, без регистрации, офлайн.',
		runsLocally: 'Работает локально',
		runsLocallyTitle:
			'Этот инструмент всё считает в вашем браузере. Введённые данные никуда не отправляются.',
		aboutTool: 'Об этом инструменте',
		faqHeading: 'Частые вопросы',
		relatedTools: 'Похожие инструменты',
		breadcrumbTools: 'инструменты',
		sample: 'Пример',
		line: 'строка',
		output: 'Результат',
		copy: 'Копировать',
		copied: 'Скопировано',
		download: 'Скачать',
		share: 'Поделиться',
		linkCopied: 'Ссылка скопирована',
		continueWith: 'Продолжить в',
		suggested: 'рекомендуем',
		shareTooLarge:
			'Содержимое слишком велико для URL — у ссылок есть предел длины, чтобы они оставались переносимыми. Данные не покидают это устройство.',
		emptyHint: 'Результат появится здесь по мере ввода',
		palettePlaceholder: 'Ищите инструменты или вставьте содержимое для обработки…',
		noMatch: 'Подходящих инструментов нет',
		navigate: 'навигация',
		open: 'открыть',
		close: 'закрыть',
		detected: 'Распознано',
		chars: 'символов',
		shortcutsTitle: 'Горячие клавиши',
		scPalette: 'Открыть палитру команд',
		scCopy: 'Скопировать результат',
		scEsc: 'Закрыть панель / скрыть подсказку',
		scHelp: 'Этот список сочетаний',
		scPaste: 'Умная вставка — распознаёт содержимое и предлагает инструменты',
		scNav: 'Навигация и подтверждение в панелях'
	},
	categories: {
		encoding: 'Кодирование',
		json: 'JSON и данные',
		text: 'Текст',
		time: 'Дата и время',
		generators: 'Генераторы',
		crypto: 'Хеши и криптография',
		web: 'Веб'
	},
	tools: {
		'json-formatter': {
			name: 'Форматирование и проверка JSON',
			description: 'Форматируйте, проверяйте и минифицируйте JSON с ошибками с точностью до строки:столбца'
		},
		'base64-decode': {
			name: 'Base64: кодирование / декодирование',
			description: 'Преобразуйте текст в Base64 и обратно, включая URL-safe вариант'
		},
		'timestamp-converter': {
			name: 'Конвертер Unix-времени',
			description: 'Переводите Unix-таймстампы в даты и обратно, с относительным временем'
		},
		'jwt-decoder': {
			name: 'Декодер JWT',
			description: 'Декодируйте заголовок и полезную нагрузку JWT, проверяйте срок — полностью офлайн'
		},
		'regex-tester': {
			name: 'Тестер регулярных выражений',
			description: 'Проверяйте регулярные выражения с живой подсветкой совпадений и групп'
		},
		'diff-checker': {
			name: 'Сравнение текстов (diff)',
			description: 'Сравнивайте два текста построчно и смотрите добавления и удаления'
		},
		'url-encode-decode': {
			name: 'URL: кодирование / декодирование',
			description: 'Процентное кодирование и декодирование компонентов URL и строк запроса'
		},
		'url-parser': {
			name: 'Разбор URL',
			description: 'Разложите URL на протокол, хост, путь и параметры запроса'
		},
		'uuid-generator': {
			name: 'Генератор UUID',
			description: 'Генерируйте UUID v4/v7, ULID и Nano ID — по одному или пачкой'
		},
		'hash-generator': {
			name: 'Генератор хешей',
			description: 'MD5, SHA-1, SHA-256, SHA-512 и HMAC — всё считается в браузере'
		},
		'color-converter': {
			name: 'Конвертер цветов',
			description: 'Переводите цвета между HEX, RGB, HSL и OKLCH с живым предпросмотром'
		},
		'case-converter': {
			name: 'Конвертер регистров',
			description: 'Переключайтесь между camelCase, snake_case, kebab-case, PascalCase и другими'
		},
		'word-counter': {
			name: 'Счётчик слов',
			description: 'Считайте слова, символы, предложения, байты и время чтения на лету'
		},
		'lorem-ipsum-generator': {
			name: 'Генератор Lorem Ipsum',
			description: 'Генерируйте слова, предложения или абзацы-заполнители для макетов'
		},
		'slug-generator': {
			name: 'Генератор слагов',
			description: 'Превращайте заголовки в чистые URL-слаги с выбором разделителя и длины'
		},
		'sort-lines': {
			name: 'Сортировка и дедупликация строк',
			description: 'Сортируйте строки по алфавиту или естественно, убирайте дубли и пустые'
		},
		'html-entities': {
			name: 'HTML-сущности: кодирование / декодирование',
			description: 'Экранируйте текст для HTML или превращайте &amp;-сущности обратно в символы'
		},
		'unicode-inspector': {
			name: 'Инспектор символов Unicode',
			description: 'Смотрите кодовые точки, байты UTF-8/UTF-16 и экранирование каждого символа'
		},
		'cron-parser': {
			name: 'Разбор cron-выражений',
			description: 'Объясняет любое cron-расписание простым языком и показывает ближайшие запуски'
		},
		'password-generator': {
			name: 'Генератор паролей',
			description: 'Случайные пароли с выбором наборов символов и честной оценкой энтропии'
		},
		'qr-code-generator': {
			name: 'Генератор QR-кодов',
			description: 'Чёткие QR-коды в SVG или PNG — без водяных знаков и без загрузки'
		},
		'json-to-yaml': {
			name: 'Конвертер JSON ↔ YAML ↔ TOML',
			description: 'Конвертируйте между JSON, YAML и TOML с автоопределением формата'
		},
		'json-to-csv': {
			name: 'Конвертер JSON → CSV',
			description: 'Превращайте массивы JSON-объектов в CSV с корректным экранированием'
		},
		'json-to-typescript': {
			name: 'JSON → типы TypeScript',
			description: 'Мгновенно выводите интерфейсы TypeScript из примера JSON'
		},
		'jsonpath-tester': {
			name: 'Тестер JSONPath',
			description: 'Запрашивайте JSON выражениями JSONPath и смотрите каждое совпадение с путём'
		},
		'bcrypt-generator': {
			name: 'Bcrypt: хеш и проверка',
			description: 'Хешируйте пароли bcrypt и сверяйте хеши с открытым текстом'
		},
		'user-agent-parser': {
			name: 'Разбор User-Agent',
			description: 'Определяйте браузер, движок, ОС и устройство по строке User-Agent'
		}
	}
};

export default ru;
