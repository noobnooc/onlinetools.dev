import type { Messages } from '$lib/i18n';

const ja: Messages = {
	code: 'ja',
	name: '日本語',
	ui: {
		search: '検索',
		overview: '概要',
		toggleTheme: 'テーマを切り替え',
		themeSystem: 'システムに従う',
		themeDark: 'ダーク',
		themeLight: 'ライト',
		themeTitle: 'テーマ:{mode} — クリックで切り替え',
		footerPrivacy: 'すべてブラウザ内で動作 — 貼り付けた内容がアップロードされることはありません',
		allTools: 'すべてのツール',
		changelog: '更新履歴',
		releaseDate: 'リリース日',
		language: '言語',
		openNav: 'ナビゲーションを開く',
		searchTools: 'ツールを検索',
		homeTitle: 'onlinetools.dev — ブラウザで動く開発者ツール',
		homeMetaDescription:
			'高速でキーボード主体の開発者ツール。すべてブラウザ内で完結します。JSON 整形、JWT や Base64 のデコード、タイムスタンプ変換、正規表現テスト — アップロード不要、登録不要、オフライン対応。',
		homeEyebrow: '{n} 個のツール · ローカルファースト',
		homeHeading: 'ブラウザで動く開発者ツール',
		homeSub: 'アップロード不要、登録不要、待ち時間なし。',
		pasteToDetect: '貼り付けて自動判別',
		worksOffline: 'オフライン対応',
		shortcuts: 'ショートカット',
		searchPlaceholder: '{n} 個のツールを検索、または何でも貼り付け…',
		startHere: 'ここから始める',
		smartPaste: 'スマートペースト',
		smartPasteDesc:
			'どこにでも何でも貼り付け — 内容の種類を自動判別し、キー一つで適切なツールへ。',
		keyboardFirst: '最初から最後までキーボードで',
		keyboardFirstDesc: '検索、実行、コピー、共有 — マウスに触れずに。',
		kbdAnyTool: '任意のツール',
		kbdCopyResult: '結果をコピー',
		kbdConfirm: '確定',
		kbdAllShortcuts: 'すべてのショートカット',
		toolsTitle: 'すべての開発者ツール — onlinetools.dev',
		toolsMetaDescription:
			'onlinetools.dev の全ツール一覧:JSON、YAML、Base64、JWT、タイムスタンプ、Cron、正規表現、差分、UUID、ハッシュ、QR コードなど — すべてブラウザ内で動作。',
		toolsBlurb: '{n} 個のツール、すべてブラウザ内で計算。続々追加中 — 詳しくは',
		toolTitle: '{name} — 無料 · プライバシー重視 | onlinetools.dev',
		toolMetaSuffix: 'すべてブラウザ内で動作 — アップロード不要、登録不要、オフライン対応。',
		runsLocally: 'ローカル実行',
		runsLocallyTitle:
			'このツールの計算はすべてブラウザ内で行われ、入力内容がアップロードされることはありません。',
		aboutTool: 'このツールについて',
		faqHeading: 'よくある質問',
		relatedTools: '関連ツール',
		breadcrumbTools: 'ツール',
		sample: 'サンプル',
		line: '行',
		output: '出力',
		copy: 'コピー',
		copied: 'コピーしました',
		download: 'ダウンロード',
		share: '共有',
		linkCopied: 'リンクをコピーしました',
		continueWith: '続けて処理',
		suggested: 'おすすめ',
		shareTooLarge:
			'内容が大きすぎて URL に収まりません — 共有リンクには上限があります。内容がこの端末の外に出ることはありません。',
		emptyHint: '入力すると結果がここに表示されます',
		palettePlaceholder: 'ツールを検索、または内容を貼り付けて実行…',
		noMatch: '該当するツールがありません',
		navigate: '移動',
		open: '開く',
		close: '閉じる',
		detected: '検出',
		chars: '文字',
		shortcutsTitle: 'キーボードショートカット',
		scPalette: 'コマンドパレットを開く',
		scCopy: '結果をコピー',
		scEsc: 'パネルを閉じる / 提案を消す',
		scHelp: 'このショートカット一覧',
		scPaste: 'スマートペースト — 内容を判別してツールを提案',
		scNav: 'パネル内の移動と確定'
	},
	categories: {
		encoding: 'エンコード',
		json: 'JSON とデータ',
		text: 'テキスト',
		time: '日付と時刻',
		generators: 'ジェネレーター',
		crypto: 'ハッシュと暗号',
		web: 'Web'
	},
	tools: {
		'json-formatter': {
			name: 'JSON整形・検証',
			description: 'JSON の整形・検証・圧縮。エラーは行・列まで正確に表示'
		},
		'base64-decode': {
			name: 'Base64エンコード / デコード',
			description: 'テキストと Base64 の相互変換。URL セーフ形式にも対応'
		},
		'timestamp-converter': {
			name: 'Unixタイムスタンプ変換',
			description: 'Unix タイムスタンプと日時の相互変換、相対時間付き'
		},
		'jwt-decoder': {
			name: 'JWTデコーダー',
			description: 'JWT のヘッダーとペイロードをデコードし有効期限を確認 — 完全オフライン'
		},
		'regex-tester': {
			name: '正規表現テスター',
			description: 'マッチとグループをリアルタイムでハイライトして正規表現をテスト'
		},
		'diff-checker': {
			name: 'テキスト差分チェッカー',
			description: '2 つのテキストを行単位で比較し、追加と削除を表示'
		},
		'url-encode-decode': {
			name: 'URLエンコード / デコード',
			description: 'URL コンポーネントやクエリ文字列のパーセントエンコード / デコード'
		},
		'url-parser': {
			name: 'URLパーサー',
			description: 'URL をプロトコル・ホスト・パス・クエリパラメータに分解'
		},
		'uuid-generator': {
			name: 'UUIDジェネレーター',
			description: 'UUID v4/v7、ULID、Nano ID を生成 — 単発でも一括でも'
		},
		'hash-generator': {
			name: 'ハッシュ生成',
			description: 'MD5、SHA-1、SHA-256、SHA-512、HMAC — すべてブラウザ内で計算'
		},
		'color-converter': {
			name: 'カラーコンバーター',
			description: 'HEX、RGB、HSL、OKLCH の相互変換をライブプレビュー付きで'
		},
		'case-converter': {
			name: 'ケース変換',
			description: 'camelCase、snake_case、kebab-case、PascalCase などを相互変換'
		},
		'word-counter': {
			name: '文字数カウンター',
			description: '単語数・文字数・文数・バイト数・読了時間をリアルタイム集計'
		},
		'lorem-ipsum-generator': {
			name: 'ダミーテキスト生成',
			description: 'モックアップ用のダミーの単語・文・段落を生成'
		},
		'slug-generator': {
			name: 'スラッグ生成',
			description: 'タイトルをきれいな URL スラッグに変換。区切り文字と長さを指定可能'
		},
		'sort-lines': {
			name: '行のソートと重複削除',
			description: 'アルファベット順・自然順で行をソートし、重複行と空行を削除'
		},
		'html-entities': {
			name: 'HTMLエンティティ変換',
			description: 'テキストを HTML 用にエスケープ、または &amp; 形式の実体参照を文字に戻す'
		},
		'unicode-inspector': {
			name: 'Unicode文字インスペクター',
			description: '各文字のコードポイント、UTF-8/UTF-16 バイト、エスケープ表記を表示'
		},
		'cron-parser': {
			name: 'Cron式パーサー',
			description: 'Cron スケジュールを分かりやすい言葉で説明し、次回実行時刻を表示'
		},
		'password-generator': {
			name: 'パスワードジェネレーター',
			description: '文字種を選んでランダムパスワードを生成。正直なエントロピー表示付き'
		},
		'qr-code-generator': {
			name: 'QRコードジェネレーター',
			description: '高精細な QR コードを SVG / PNG で生成 — 透かしなし、アップロードなし'
		},
		'json-to-yaml': {
			name: 'JSON ↔ YAML ↔ TOML変換',
			description: 'JSON、YAML、TOML を相互変換。フォーマットを自動判別'
		},
		'json-to-csv': {
			name: 'JSON → CSV変換',
			description: 'JSON オブジェクトの配列を正しいエスケープで CSV に変換'
		},
		'json-to-typescript': {
			name: 'JSON → TypeScript型',
			description: 'JSON サンプルから TypeScript インターフェースを即座に推論'
		},
		'jsonpath-tester': {
			name: 'JSONPathテスター',
			description: 'JSONPath 式で JSON を検索し、各マッチとそのパスを表示'
		},
		'bcrypt-generator': {
			name: 'Bcryptハッシュ・検証',
			description: 'bcrypt でパスワードをハッシュ化、または平文とハッシュを照合'
		},
		'user-agent-parser': {
			name: 'User-Agentパーサー',
			description: 'UA 文字列からブラウザ・エンジン・OS・デバイスを判定'
		}
	}
};

export default ja;
