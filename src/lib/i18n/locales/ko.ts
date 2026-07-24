import type { Messages } from '$lib/i18n';

const ko: Messages = {
	code: 'ko',
	name: '한국어',
	ui: {
		search: '검색',
		overview: '개요',
		toggleTheme: '테마 전환',
		themeSystem: '시스템 따르기',
		themeDark: '다크',
		themeLight: '라이트',
		themeTitle: '테마: {mode} — 클릭하여 전환',
		footerPrivacy: '모두 브라우저에서 실행 — 붙여넣은 내용은 업로드되지 않습니다',
		allTools: '모든 도구',
		changelog: '변경 이력',
		changelogMetaDescription:
			'onlinetools.dev의 새로운 소식 — 새 도구, 기능 및 수정 사항. 모두 브라우저에서 로컬로 실행됩니다.',
		releaseDate: '릴리스 날짜',
		language: '언어',
		openNav: '내비게이션 열기',
		searchTools: '도구 검색',

		// Favorites (stored locally in this browser)
		favorites: '즐겨찾기',
		favoriteAdd: '즐겨찾기에 추가',
		favoriteRemove: '즐겨찾기에서 제거',
		homeTitle: 'onlinetools.dev — 브라우저에서 실행되는 개발자 도구',
		homeMetaDescription:
			'빠르고 키보드 중심의 개발자 도구. 모두 브라우저 안에서 실행됩니다. JSON 포맷, JWT·Base64 디코딩, 타임스탬프 변환, 정규식 테스트 — 업로드 없음, 가입 없음, 오프라인 지원.',
		homeEyebrow: '{n}개 도구 · 로컬 우선',
		homeHeading: '브라우저에서 실행되는 개발자 도구',
		homeSub: '업로드 없음, 가입 없음, 대기 없음.',
		pasteToDetect: '붙여넣으면 자동 감지',
		worksOffline: '오프라인 지원',
		shortcuts: '단축키',
		searchPlaceholder: '{n}개 도구 검색 또는 아무거나 붙여넣기…',
		startHere: '여기서 시작',
		smartPaste: '스마트 붙여넣기',
		smartPasteDesc:
			'어디서든 무엇이든 붙여넣기 — 내용 유형을 자동 감지해 키 한 번으로 알맞은 도구로 이동합니다.',
		keyboardFirst: '처음부터 끝까지 키보드로',
		keyboardFirstDesc: '마우스 없이 찾고, 실행하고, 복사하고, 공유하세요.',
		kbdAnyTool: '아무 도구나',
		kbdCopyResult: '결과 복사',
		kbdConfirm: '확인',
		kbdAllShortcuts: '모든 단축키',

		// Paste hero (homepage)
		pasteHeroHeading: '무엇이든 붙여넣으세요 — 딱 맞는 도구를 바로 찾아드립니다',
		pasteHeroPlaceholder: 'JWT, JSON, Unix 타임스탬프, 색상, URL, 이미지 등을 붙여넣기…',
		tryLabel: '예시',
		plainText: '일반 텍스트',
		noMatchHint: '정확히 일치하는 항목 없음 — 아래 텍스트 도구를 선택하거나 전체 검색',
		runHint: '실행',
		newlineHint: '줄바꿈',
		clearHint: '지우기',

		// Pipeline (tool chains)
		chainNavLabel: '파이프라인',
		chainNew: 'New',
		chainTitle: '도구 파이프라인 — 브라우저에서 개발 도구 연결 | onlinetools.dev',
		chainMetaDescription:
			'개발 도구를 파이프라인으로 연결 — 디코딩, 변환, 추출을 한 번에. 각 단계의 출력이 다음 단계로 이어지고, 모두 브라우저에서 실행되며, 전체 레시피가 공유 링크에 담깁니다.',
		chainEyebrow: '워크벤치 · 로컬 우선',
		chainHeading: '파이프라인',
		chainSub: '도구를 레시피로 연결 — 각 단계의 출력이 다음으로 이어집니다. 전부 브라우저에서 실행됩니다.',
		chainInputPlaceholder: '시작 입력을 붙여넣거나 입력하세요…',
		chainAddStep: '단계 추가',
		chainSearchSteps: '단계 검색…',
		chainStarters: '예시',
		chainEmpty: '단계를 추가하세요 — 각 단계의 출력이 다음으로 이어집니다.',
		chainHomeCta: '도구를 파이프라인으로 연결',
		chainHomeCtaSub: '한 도구의 출력을 다음으로 — 디코딩, 변환, 추출을 한 번에.',
		toolsTitle: '모든 개발자 도구 — onlinetools.dev',
		toolsMetaDescription:
			'onlinetools.dev의 모든 도구: JSON, YAML, Base64, JWT, 타임스탬프, Cron, 정규식, Diff, UUID, 해시, QR 코드 등 — 모두 브라우저에서 로컬로 실행.',
		toolsBlurb: '{n}개 도구, 모두 브라우저에서 계산됩니다. 계속 추가 중 — 자세한 내용은',
		toolTitle: '{name} — 무료 · 프라이버시 보장 | onlinetools.dev',
		toolMetaSuffix: '전부 브라우저에서 실행 — 업로드 없음, 가입 없음, 오프라인 지원.',
		runsLocally: '로컬 실행',
		runsLocallyTitle:
			'이 도구의 모든 계산은 브라우저 안에서 이루어지며, 입력 내용은 업로드되지 않습니다.',
		aboutTool: '이 도구에 대해',
		faqHeading: '자주 묻는 질문',
		relatedTools: '관련 도구',
		breadcrumbTools: '도구',
		sample: '샘플',
		line: '행',
		output: '출력',
		copy: '복사',
		copied: '복사됨',
		download: '다운로드',
		share: '공유',
		linkCopied: '링크 복사됨',
		continueWith: '이어서 처리',
		suggested: '추천',
		shareTooLarge:
			'내용이 너무 커서 URL에 담을 수 없습니다 — 공유 링크에는 길이 제한이 있습니다. 내용은 이 기기를 떠나지 않습니다.',
		emptyHint: '입력하면 결과가 여기에 표시됩니다',
		palettePlaceholder: '도구를 검색하거나 내용을 붙여넣어 바로 실행…',
		noMatch: '일치하는 도구가 없습니다',
		navigate: '이동',
		open: '열기',
		close: '닫기',
		detected: '감지됨',
		chars: '자',
		shortcutsTitle: '키보드 단축키',
		scPalette: '커맨드 팔레트 열기',
		scCopy: '결과 복사',
		scEsc: '패널 닫기 / 제안 무시',
		scHelp: '이 단축키 목록',
		scPaste: '스마트 붙여넣기 — 내용을 감지해 도구 추천',
		scNav: '패널에서 이동 및 확인'
	},
	tl: {
		direction: '방향',
		encode: '인코딩',
		decode: '디코딩',
		mode: '모드',
		count: '개수',
		lengthLbl: '길이',
		uppercase: '대문자',
		lowercase: '소문자',
		regenerate: '다시 생성',
		b64InputEnc: '인코딩할 텍스트',
		b64InputDec: '디코딩할 Base64',
		b64PhEnc: '유니코드 포함 아무 텍스트',
		b64UrlSafe: 'URL-safe (패딩 없음)',
		bcHash: '해시',
		bcVerify: '검증',
		bcHashT: '비밀번호 해시하기',
		bcVerifyT: '비밀번호와 해시 대조',
		bcPassword: '비밀번호',
		bcCost: '비용 계수',
		bcHashLbl: 'Bcrypt 해시',
		bcPh: '브라우저 안에만 남습니다',
		bcVersion: '버전',
		bcCostShort: '비용',
		bcSalt: '솔트',
		bcNote: '해싱은 브라우저에서 실행되며 아무것도 전송되지 않습니다. 브라우저 JS는 네이티브 bcrypt보다 느리므로 시간은 상한선으로 참고하세요.',
		caseInput: '텍스트 또는 식별자 (한 줄에 하나)',
		caseEmpty: '입력하면 9가지 스타일이 여기에 표시됩니다',
		colorInput: '색상',
		colorFormats: '형식',
		colorRgb: 'RGB 채널',
		colorContrast: '텍스트 대비 (WCAG)',
		cronInput: 'Cron 표현식',
		cronEvalIn: '기준 시간대:',
		cronNext: '다음 5회 실행',
		cronNone: '향후 5년 내 실행 없음',
		diffOriginal: '원본',
		diffChanged: '변경본',
		diffLbl: '차이',
		diffUnchanged: '줄 동일',
		diffEmpty: '줄 단위 차이가 여기에 표시됩니다',
		hashInput: '해시할 텍스트',
		hashPh: '아무 텍스트나 — 입력하면 해시가 갱신됩니다',
		hashHmac: 'HMAC 비밀 키',
		hashOptional: '(선택)',
		hashHmacPh: '비우면 일반 해시',
		hashDigests: '다이제스트',
		hashEmpty: '입력하면 다이제스트가 실시간 갱신됩니다',
		hashNote: 'MD5와 SHA-1은 레거시 체크섬용입니다 — 보안 용도에는 SHA-256 이상을 사용하세요.',
		heAll: '모든 비 ASCII 인코딩',
		heNumeric: '숫자 엔티티만',
		heInputEnc: '이스케이프할 텍스트',
		heInputDec: '엔티티가 있는 HTML',
		imgDrop: '이미지를 끌어다 놓거나, 클릭해 선택하거나, 클립보드에서 붙여넣으세요',
		imgLocal: '브라우저 안에서만 처리 — 아무것도 업로드되지 않습니다',
		imgReplace: '끌어놓기·클릭·붙여넣기로 교체',
		imgSource: '원본 이미지',
		imgOriginal: '원본',
		imgDimensions: '크기',
		imgDownload: '{fmt} 다운로드',
		imgErrNotImage: '인식할 수 없는 이미지 형식입니다 (PNG, JPEG, WebP, GIF, SVG, BMP, ICO, AVIF 지원)',
		imgErrDecode: '브라우저가 이 이미지를 디코딩할 수 없습니다',
		imgErrEncode: '브라우저가 이 이미지를 인코딩할 수 없습니다',
		imgErrFormat: '이 브라우저는 {fmt} 인코딩을 지원하지 않습니다 — PNG나 JPEG을 사용해 보세요',
		i2bToB64: '이미지 → Base64',
		i2bFromB64: 'Base64 → 이미지',
		i2bInput: 'Data URL 또는 순수 Base64',
		i2bDataUrl: 'Data URL',
		i2bRawB64: '순수 Base64',
		i2bCss: 'CSS 배경',
		i2bHtml: 'HTML <img>',
		i2bEncodedSize: 'Base64 크기',
		i2bOverhead: '바이너리 대비 +{pct}%',
		i2bNote: '인라인화하면 요청 하나를 아끼지만 문서가 커지고 캐시가 무력화됩니다 — 아이콘 등 10 KB 이하 자산에 적합합니다.',
		icTarget: '변환 대상',
		icQuality: '품질',
		icConverted: '변환 후',
		icSmaller: '원본보다 작음',
		icLarger: '원본보다 큼',
		icBgNote: 'JPEG은 투명도를 지원하지 않습니다 — 투명 영역은 흰색으로 합성됩니다.',
		icNote: '변환에는 브라우저의 canvas 인코더를 사용하므로 파일 크기는 브라우저마다 조금씩 다릅니다.',
		fgAppleBg: 'Apple 아이콘 배경',
		fgFiles: '생성된 파일',
		fgHtml: 'HTML <link> 태그',
		fgSmall: '원본이 {px}px입니다 — 그보다 큰 아이콘은 확대되어 흐릿할 수 있습니다',
		fgNote: 'ICO에는 16, 32, 48px가 담깁니다. Apple 터치 아이콘은 투명도를 지원하지 않아 선택한 배경색 위에 평탄화되며, PWA 아이콘은 알파를 유지합니다. 정사각형이 아닌 원본은 중앙 기준으로 잘립니다.',
		irBy: '조절 기준',
		irWidth: '너비',
		irHeight: '높이',
		irPercent: '퍼센트',
		irFormat: '형식',
		irKeep: '유지',
		irResized: '조절 후',
		irScale: '배율',
		irNote: '축소에는 고품질 스무딩을 사용합니다. 확대는 디테일을 만들어내지 못합니다 — 2× 이상이면 흐릿해집니다.',
		jcInput: 'JSON 객체 배열',
		jcDelimiter: '구분자',
		jcComma: '쉼표',
		jcSemicolon: '세미콜론 (유럽 Excel)',
		jcTab: '탭',
		jfInput: 'JSON 입력',
		jfIndent: '들여쓰기',
		jfIndentation: '들여쓰기 방식',
		jfSp2: '공백 2',
		jfSp4: '공백 4',
		jfTabs: '탭',
		jfMin: '압축 — 공백 제거',
		jfSortKeys: '키 정렬',
		jfText: '텍스트',
		jfTree: '트리',
		jfTreeHint: '노드에 마우스를 올리면 JSONPath를 복사할 수 있습니다 — 여기서 시험해 보세요:',
		jfTreeLink: 'JSONPath 테스터',
		jpExpr: 'JSONPath 표현식',
		jpDoc: 'JSON 문서',
		jpMatches: '매치',
		jpResults: '결과 값',
		jtInput: 'JSON 샘플',
		jtRoot: '루트 타입 이름',
		jtNote: '이 샘플 하나에서 추론한 것입니다 — 값이 달라지는 필드는 optional로 표시하고 nullable을 넓히세요.',
		jyFrom: '원본',
		jySource: '원본 형식',
		jyAutoT: '내용에서 원본 형식 자동 감지',
		jyTarget: '대상 형식',
		jyInput: '입력',
		jyUnknown: '알 수 없는 형식',
		jwtAnatomy: '토큰 구조',
		jwtHeader: '헤더',
		jwtPayload: '페이로드',
		jwtSignature: '서명 (미검증)',
		jwtIssued: '발급',
		jwtExpires: '만료',
		jwtNotBefore: '유효 시작',
		jwtLifetime: '수명',
		jwtNote: '디코딩은 토큰을 읽기만 하며 서명을 검증하지 않습니다. 서명은 발급자의 키로 서버에서 검증하세요.',
		loremUnit: '단위',
		loremWords: '단어',
		loremSentences: '문장',
		loremParagraphs: '문단',
		loremClassic: '“Lorem ipsum…”으로 시작',
		pwWeak: '약함',
		pwFair: '보통',
		pwStrong: '강함',
		pwExcellent: '매우 강함',
		pwNoLookalikes: '혼동 문자 제외 (0O1lI)',
		pwEntropy: '엔트로피',
		pwBits: '비트',
		pwNote: '80비트 이상이면 빠른 해시의 오프라인 크래킹을 견디고, 100비트 이상이면 사실상 추측 불가능합니다.',
		pwOut: '비밀번호',
		pwCrypto: 'crypto.getRandomValues로 브라우저에서만 생성됩니다. 저장도 전송도 되지 않습니다.',
		qrContent: '내용',
		qrEc: '오류 정정',
		qrEcT: '{pct} 손상까지 인식',
		qrSvg: 'SVG (벡터, 인쇄용)',
		qrPng: 'PNG (채팅, 슬라이드)',
		qrNote: '내용이 직접 인코딩됩니다 — 리디렉션 없음, 만료 없음, 스캔 추적 없음.',
		rxPattern: '패턴',
		rxTest: '테스트 문자열',
		rxTestPh: '패턴을 시험할 텍스트를 붙여넣기',
		rxHighlighted: '하이라이트',
		rxMatches: '매치',
		rxMatched: '매치된 텍스트',
		slugInput: '제목 (한 줄에 하나)',
		slugSep: '구분자',
		slugHyphen: '하이픈',
		slugUnderscore: '언더스코어',
		slugMax: '최대 길이',
		slugOut: '슬러그',
		slInput: '줄',
		slPh: '한 줄에 하나',
		slSort: '정렬',
		slKeep: '순서 유지',
		slAsc: '오름차순',
		slDesc: '내림차순',
		slNatural: '자연 정렬 — 숫자 크기순',
		slLength: '줄 길이순',
		slShuffle: '섞기',
		slDedupe: '중복 제거',
		slIgnoreCase: '대소문자 무시',
		slTrim: '앞뒤 공백 제거',
		slDropEmpty: '빈 줄 제거',
		tsInput: '타임스탬프 또는 날짜',
		tsNow: '현재 Unix 시간:',
		tsNowT: '현재 시간을 입력으로 사용',
		tsRelative: '상대 시간',
		tsUnixS: 'Unix 초',
		tsUnixMs: 'Unix 밀리초',
		tsZones: '시간대 비교',
		tsNote: '마커는 각 시간대의 현지 시각을 24시간 막대 위에 표시합니다 — 어두운 양끝은 21:00–07:00입니다.',
		uaInput: 'User-Agent 문자열',
		uaBrowser: '브라우저',
		uaEngine: '엔진',
		uaOs: '운영체제',
		uaDevice: '기기',
		uaNote: '“샘플” 버튼은 현재 브라우저의 User-Agent를 넣습니다. 런타임 판단은 UA 스니핑이 아니라 기능 감지로 하세요.',
		uniInput: '검사할 텍스트',
		uniPh: '아무거나 붙여넣기 — 보이지 않는 문자가 여기서 드러납니다',
		uniGraphemes: '자소',
		uniGraphemesHint: '사용자가 보는 단위',
		uniCodePoints: '코드 포인트',
		uniUtf16: 'UTF-16 유닛',
		uniUtf16Hint: 'JS .length',
		uniUtf8: 'UTF-8 바이트',
		uniLimit: '처음 300자만 표시합니다.',
		upInput: 'URL',
		upProtocol: '프로토콜',
		upHost: '호스트',
		upHostname: '호스트명',
		upPort: '포트',
		upPath: '경로',
		upFragment: '프래그먼트',
		upOrigin: '오리진',
		upQuery: '쿼리 파라미터',
		upDefault: '(기본값)',
		upNone: '(없음)',
		upEmpty: 'URL 구성 요소가 여기에 표시됩니다',
		urlComponent: '컴포넌트 모드 (encodeURIComponent)',
		urlInputDec: '디코딩할 인코딩된 텍스트',
		uuidOut: '생성된 ID',
		uuidFormat: 'ID 형식',
		uuidHintV4: '무작위',
		uuidHintV7: '시간순',
		uuidHintUlid: '시간순, base32',
		uuidHintNano: '짧고 URL-safe',
		uuidNote: 'crypto.getRandomValues로 생성 — 암호학적으로 안전하며 브라우저에서 만들어지고 어디에도 기록되지 않습니다.',
		wcWords: '단어',
		wcChars: '문자',
		wcCharsHint: '공백 제외 {n}',
		wcReading: '읽기 시간',
		wcReadingHint: '분당 220단어 기준',
		wcLines: '줄',
		wcSentences: '문장',
		wcParagraphs: '문단',
		wcAvg: '평균 단어 길이',

		// Shared formatter controls
		fmtFormat: '포맷',
		fmtMinify: '압축',

		// SQL formatter
		sqlInput: 'SQL 문',
		sqlDialect: '방언',
		sqlKeywords: '키워드',
		sqlKeep: '유지',

		// XML formatter
		xmlInput: 'XML 문서',

		// XML ↔ JSON
		xjInputXml: 'XML 문서',
		xjInputJson: 'JSON 객체',
		xjNote: '속성은 "@_name" 키가 되고 속성과 함께 있는 텍스트는 "#text"가 되어 변환이 왕복 가능합니다. 서로 다른 형제 요소가 섞인 순서는 보존되지 않습니다 — XML은 반복을 허용하지만 JSON 객체는 그렇지 않습니다.',

		// CSV → JSON
		cjInput: 'CSV / TSV 데이터',
		cjAuto: '자동',
		cjPipe: '파이프',
		cjHeader: '첫 행은 헤더',
		cjTyped: '타입 변환',

		// Markdown
		mdPreview: '미리보기',
		mdNote: '미리보기는 렌더링 전에 정화(sanitize)되므로, 붙여넣거나 공유된 내용 속 스크립트와 이벤트 핸들러는 실행되지 않습니다. HTML 출력 상자에는 원본 변환 결과가 담깁니다.',

		// Code formatters
		htmlInput: 'HTML 소스',
		cssInput: 'CSS 소스',
		jsInput: 'JavaScript 소스',

		// String escape
		escEscape: '이스케이프',
		escUnescape: '언이스케이프',
		escDialect: '방언',
		escInputEsc: '이스케이프할 텍스트',
		escInputUnesc: '이스케이프된 텍스트',

		// Number base
		nbInput: '숫자',
		nbFrom: '원본 진법',
		nbAutoT: '0x / 0o / 0b 접두사로 감지, 그 외는 십진수',
		nbGroup: '자릿수 묶기',
		nbBase: '진법',
		nbBin: '2진수',
		nbOct: '8진수',
		nbDec: '10진수',
		nbHex: '16진수',
		nbBits: '비트',

		// Text ↔ hex/binary
		hbFormat: '바이트 표기',
		hbSep: '구분자',
		hbSpace: '공백',
		hbNone: '없음',
		hbColon: '콜론',
		hbInputEnc: '인코딩할 텍스트',
		hbInputDec: '디코딩할 바이트',

		// JSON Schema
		schInfer: '스키마 추론',
		schValidate: '검증',
		schInferT: '샘플 JSON에서 스키마 생성',
		schValidateT: 'JSON을 스키마와 대조',
		schData: 'JSON 데이터',
		schSchema: 'JSON Schema',
		schViolations: '위반',
		schValid: '유효 — 데이터가 스키마를 만족합니다',
		schResult: '검증 결과',

		// EXIF
		exTags: '메타데이터 필드 {n}개',
		exNone: '메타데이터가 없습니다 — 이미 깨끗한 파일입니다',
		exStrip: '정리된 사본 다운로드',
		exGps: 'GPS 위치 포함됨',
		exMap: '지도에서 보기',
		exNote: '읽기와 제거는 전부 브라우저 안에서 이루어지며 사진은 업로드되지 않습니다. 정리는 재인코딩 없이 메타데이터 구간만 바이트 단위로 제거하므로 픽셀과 품질은 그대로입니다.',

		// Cron builder
		crBuilder: '빌더',
		crMinute: '분',
		crHour: '시',
		crDom: '일',
		crMonth: '월',
		crDow: '요일',
		crEvery: '매번',
		crStep: 'N마다',
		crAt: '지정',
		crUse: '표현식 사용',

		// JWT sign & verify
		jwtDecode: '디코딩',
		jwtSign: '서명',
		jwtVerify: '검증',
		jwtAlg: '알고리즘',
		jwtPayloadLbl: '페이로드 (JSON 객체)',
		jwtSecret: '비밀 키',
		jwtPrivKey: '개인 키 (PKCS#8 PEM)',
		jwtPubKey: '비밀 키(HS) 또는 공개 키 PEM(RS/ES)',
		jwtSignNote: '서명은 브라우저의 WebCrypto에서 실행됩니다 — 키는 이 페이지를 벗어나지 않습니다. HS 알고리즘에는 길고 무작위한 비밀 키를 쓰세요. 짧은 키는 어디서 서명하든 무차별 대입으로 뚫립니다.',
		jwtVerifyNote: '검증은 입력한 키로 서명을 로컬에서 확인합니다. JWKS 엔드포인트를 가져오거나 aud/iss 같은 클레임을 검사하지는 않습니다 — 그것은 서버에서 하세요.',

		// Timestamp extras
		tsDiff: '두 날짜 사이의 차이'
	},
	categories: {
		encoding: '인코딩',
		json: 'JSON & 데이터',
		text: '텍스트',
		time: '날짜 & 시간',
		generators: '생성기',
		crypto: '해시 & 암호화',
		web: '웹',
		image: '이미지',
		code: '코드 & 마크업',
		privacy: '프라이버시'
	},
	tools: {
		'json-formatter': {
			name: 'JSON 포맷터 & 검증기',
			description: 'JSON 포맷·검증·압축, 오류 위치를 행:열까지 정확히 표시'
		},
		'base64-decode': {
			name: 'Base64 인코딩 / 디코딩',
			description: '텍스트와 Base64 상호 변환, URL-safe 형식 지원'
		},
		'timestamp-converter': {
			name: 'Unix 타임스탬프 변환기',
			description: 'Unix 타임스탬프와 날짜를 상호 변환, 상대 시간 표시'
		},
		'jwt-decoder': {
			name: 'JWT 디코더',
			description: 'JWT 헤더와 페이로드 디코딩, 만료 확인 — 완전 오프라인'
		},
		'regex-tester': {
			name: '정규식 테스터',
			description: '매치와 그룹을 실시간 하이라이트로 정규식 테스트'
		},
		'diff-checker': {
			name: '텍스트 Diff 검사기',
			description: '두 텍스트를 줄 단위로 비교해 추가·삭제 확인'
		},
		'url-encode-decode': {
			name: 'URL 인코딩 / 디코딩',
			description: 'URL 구성 요소와 쿼리 문자열의 퍼센트 인코딩/디코딩'
		},
		'url-parser': {
			name: 'URL 파서',
			description: 'URL을 프로토콜·호스트·경로·쿼리 파라미터로 분해'
		},
		'uuid-generator': {
			name: 'UUID 생성기',
			description: 'UUID v4/v7, ULID, Nano ID 생성 — 단건 또는 대량'
		},
		'hash-generator': {
			name: '해시 생성기',
			description: 'MD5, SHA-1, SHA-256, SHA-512, HMAC — 모두 브라우저에서 계산'
		},
		'color-converter': {
			name: '색상 변환기',
			description: 'HEX, RGB, HSL, OKLCH 간 변환을 실시간 미리보기와 함께'
		},
		'case-converter': {
			name: '케이스 변환기',
			description: 'camelCase, snake_case, kebab-case, PascalCase 등 상호 전환'
		},
		'word-counter': {
			name: '글자 수 세기',
			description: '단어·문자·문장·바이트·읽기 시간을 실시간 집계'
		},
		'lorem-ipsum-generator': {
			name: 'Lorem Ipsum 생성기',
			description: '목업용 더미 단어·문장·문단 생성'
		},
		'slug-generator': {
			name: '슬러그 생성기',
			description: '제목을 깔끔한 URL 슬러그로 변환, 구분자·길이 옵션'
		},
		'sort-lines': {
			name: '줄 정렬 & 중복 제거',
			description: '알파벳순·자연순 정렬, 중복 줄과 빈 줄 제거'
		},
		'html-entities': {
			name: 'HTML 엔티티 인코딩 / 디코딩',
			description: 'HTML용 텍스트 이스케이프 또는 &amp; 형식 엔티티 복원'
		},
		'unicode-inspector': {
			name: '유니코드 문자 인스펙터',
			description: '문자별 코드 포인트, UTF-8/UTF-16 바이트, 이스케이프 표기 확인'
		},
		'cron-parser': {
			name: 'Cron 표현식 파서',
			description: 'Cron 스케줄을 쉬운 말로 설명하고 다음 실행 시각 표시'
		},
		'password-generator': {
			name: '비밀번호 생성기',
			description: '문자 집합 옵션과 정직한 엔트로피 측정으로 랜덤 비밀번호 생성'
		},
		'qr-code-generator': {
			name: 'QR 코드 생성기',
			description: '선명한 QR 코드를 SVG/PNG로 생성 — 워터마크 없음, 업로드 없음'
		},
		'json-to-yaml': {
			name: 'JSON ↔ YAML ↔ TOML 변환기',
			description: 'JSON, YAML, TOML 간 변환, 포맷 자동 감지'
		},
		'json-to-csv': {
			name: 'JSON ↔ CSV 변환기',
			description: 'JSON을 CSV로 평탄화하거나 CSV를 다시 타입 있는 JSON 객체로 파싱'
		},
		'json-to-typescript': {
			name: 'JSON → TypeScript 타입',
			description: 'JSON 샘플에서 TypeScript 인터페이스를 즉시 추론'
		},
		'jsonpath-tester': {
			name: 'JSONPath 테스터',
			description: 'JSONPath 표현식으로 JSON을 조회하고 각 매치와 경로 확인'
		},
		'bcrypt-generator': {
			name: 'Bcrypt 해시 & 검증',
			description: 'bcrypt로 비밀번호 해시 생성 또는 평문과 해시 대조'
		},
		'user-agent-parser': {
			name: 'User-Agent 파서',
			description: 'UA 문자열에서 브라우저·엔진·OS·기기 식별'
		},
		'image-to-base64': {
			name: '이미지 ↔ Base64 변환기',
			description: '이미지와 Base64 Data URL 상호 변환 — CSS·HTML 스니펫 포함'
		},
		'image-converter': {
			name: '이미지 형식 변환기',
			description: 'PNG, JPEG, WebP 간 이미지 변환, 품질 조절 지원'
		},
		'image-resizer': {
			name: '이미지 크기 조절',
			description: '너비·높이·퍼센트로 이미지 크기 조절 — 완전 오프라인'
		},
		'favicon-generator': {
			name: '파비콘 생성기',
			description: '이미지 하나로 favicon.ico와 PNG·manifest 아이콘 세트 전체 생성'
		},
		'sql-formatter': {
			name: 'SQL 포맷터',
			description: '방언별 키워드 인식으로 SQL 포맷 또는 한 줄로 압축'
		},
		'xml-formatter': {
			name: 'XML 포맷터 & 검증기',
			description: 'XML 정리·압축·검증, 오류 위치를 정확히 표시'
		},
		'xml-to-json': {
			name: 'XML ↔ JSON 변환기',
			description: 'XML 문서와 JSON 상호 변환, 속성까지 보존'
		},
		'markdown-to-html': {
			name: 'Markdown ↔ HTML 변환기',
			description: 'Markdown을 실시간 미리보기로 HTML 렌더링, HTML을 Markdown으로 역변환'
		},
		'html-formatter': {
			name: 'HTML 포맷터 & 압축기',
			description: '지저분한 HTML 정리 또는 프로덕션용 압축'
		},
		'css-formatter': {
			name: 'CSS 포맷터 & 압축기',
			description: '읽기 좋게 CSS 정리 또는 배포용 압축'
		},
		'js-formatter': {
			name: 'JavaScript 포맷터 & 압축기',
			description: 'JavaScript 정리 또는 실제 압축·이름 축약으로 최소화'
		},
		'string-escape': {
			name: '문자열 이스케이프 / 언이스케이프',
			description: 'JSON, JavaScript, Java, XML, SQL, CSV용 문자열 이스케이프와 복원'
		},
		'number-base-converter': {
			name: '진법 변환기',
			description: '2·8·10·16진수와 최대 36진법 사이의 숫자 변환'
		},
		'text-to-hex': {
			name: '텍스트 ↔ Hex / 바이너리 변환기',
			description: '텍스트를 16진·2진·10진 바이트로 변환하고 바이트 덤프를 다시 디코딩'
		},
		'json-schema-validator': {
			name: 'JSON Schema 검증기 & 생성기',
			description: 'JSON을 스키마와 대조 검증하거나 샘플 데이터에서 스키마 추론'
		},
		'exif-viewer': {
			name: 'EXIF 뷰어 & 제거기',
			description: '사진에 담긴 메타데이터 확인과 재인코딩 없는 제거'
		}
	}
};

export default ko;
