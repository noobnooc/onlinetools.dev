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
		releaseDate: '릴리스 날짜',
		language: '언어',
		openNav: '내비게이션 열기',
		searchTools: '도구 검색',
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
	categories: {
		encoding: '인코딩',
		json: 'JSON & 데이터',
		text: '텍스트',
		time: '날짜 & 시간',
		generators: '생성기',
		crypto: '해시 & 암호화',
		web: '웹'
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
			name: 'JSON → CSV 변환기',
			description: 'JSON 객체 배열을 올바른 이스케이프로 CSV로 변환'
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
		}
	}
};

export default ko;
