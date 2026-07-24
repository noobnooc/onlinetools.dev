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
		changelogMetaDescription:
			'onlinetools.dev の最新情報 — 新しいツール、機能、修正。すべてブラウザ内でローカルに動作します。',
		releaseDate: 'リリース日',
		language: '言語',
		openNav: 'ナビゲーションを開く',
		searchTools: 'ツールを検索',

		// Favorites (stored locally in this browser)
		favorites: 'お気に入り',
		favoriteAdd: 'お気に入りに追加',
		favoriteRemove: 'お気に入りから削除',
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

		// Paste hero (homepage)
		pasteHeroHeading: '何でも貼り付け — 最適なツールが即座に見つかる',
		pasteHeroPlaceholder: 'JWT、JSON、UNIX タイムスタンプ、色、URL、画像などを貼り付け…',
		tryLabel: 'お試し',
		plainText: 'プレーンテキスト',
		noMatchHint: '完全一致なし — 下のテキストツールを選ぶか、全体を検索',
		runHint: '実行',
		newlineHint: '改行',
		clearHint: 'クリア',

		// Pipeline (tool chains)
		chainNavLabel: 'パイプライン',
		chainNew: 'New',
		chainSteps: 'ステップ',
		chainMoreRecipes: '他のレシピ',
		chainTitle: 'ツールパイプライン — ブラウザで開発ツールを連結 | onlinetools.dev',
		chainMetaDescription:
			'開発ツールをパイプラインに連結 — デコード・変換・抽出を一気に。各ステップの出力が次に渡り、すべてブラウザ内で動作し、レシピ全体が共有リンクに収まります。',
		chainEyebrow: 'ワークベンチ · ローカルファースト',
		chainHeading: 'パイプライン',
		chainSub: 'ツールをレシピに連結 — 各ステップの出力が次に渡ります。すべてブラウザ内で動作。',
		chainInputPlaceholder: '最初の入力を貼り付けまたは入力…',
		chainAddStep: 'ステップを追加',
		chainSearchSteps: 'ステップを検索…',
		chainStarters: 'サンプル',
		chainEmpty: 'ステップを追加 — 各ステップの出力が次に渡ります。',
		chainHomeCta: 'ツールをパイプラインに連結',
		chainHomeCtaSub: 'あるツールの出力を次へ — デコード・変換・抽出を一気に。',
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
	tl: {
		direction: '方向',
		encode: 'エンコード',
		decode: 'デコード',
		mode: 'モード',
		count: '個数',
		lengthLbl: '長さ',
		uppercase: '大文字',
		lowercase: '小文字',
		regenerate: '再生成',
		b64InputEnc: 'エンコードするテキスト',
		b64InputDec: 'デコードする Base64',
		b64PhEnc: '任意のテキスト、Unicode 対応',
		b64UrlSafe: 'URL セーフ(パディングなし)',
		bcHash: 'ハッシュ',
		bcVerify: '検証',
		bcHashT: 'パスワードをハッシュ化',
		bcVerifyT: 'パスワードとハッシュを照合',
		bcPassword: 'パスワード',
		bcCost: 'コスト係数',
		bcHashLbl: 'Bcrypt ハッシュ',
		bcPh: 'ブラウザ内に留まります',
		bcVersion: 'バージョン',
		bcCostShort: 'コスト',
		bcSalt: 'ソルト',
		bcNote: 'ハッシュ化はブラウザ内で実行され、何も送信されません。ブラウザの JS はネイティブ bcrypt より遅いため、時間は上限の目安としてください。',
		caseInput: 'テキストまたは識別子(1 行に 1 つ)',
		caseEmpty: '入力すると 9 種類のスタイルがここに表示されます',
		colorInput: 'カラー',
		colorFormats: '各フォーマット',
		colorRgb: 'RGB チャンネル',
		colorContrast: 'テキストコントラスト (WCAG)',
		cronInput: 'Cron 式',
		cronEvalIn: 'タイムゾーン:',
		cronNext: '次の 5 回',
		cronNone: '今後 5 年間に実行はありません',
		diffOriginal: '元のテキスト',
		diffChanged: '変更後',
		diffLbl: '差分',
		diffUnchanged: '行が同じ',
		diffEmpty: '行ごとの差分がここに表示されます',
		hashInput: 'ハッシュ化するテキスト',
		hashPh: '任意のテキスト — 入力中にハッシュが更新されます',
		hashHmac: 'HMAC 秘密鍵',
		hashOptional: '(任意)',
		hashHmacPh: '空のままなら通常のハッシュ',
		hashDigests: 'ダイジェスト',
		hashEmpty: '入力中にダイジェストが更新されます',
		hashNote: 'MD5 と SHA-1 はレガシーなチェックサム用です — セキュリティ用途には SHA-256 以上を使ってください。',
		heAll: '非 ASCII をすべてエンコード',
		heNumeric: '数値実体のみ',
		heInputEnc: 'エスケープするテキスト',
		heInputDec: '実体参照を含む HTML',
		imgDrop: '画像をドロップ、クリックで選択、またはクリップボードから貼り付け',
		imgLocal: 'ブラウザ内で完結 — 何もアップロードされません',
		imgReplace: 'ドロップ・クリック・貼り付けで差し替え',
		imgSource: '元画像',
		imgOriginal: '元',
		imgDimensions: '寸法',
		imgDownload: '{fmt} をダウンロード',
		imgErrNotImage: '認識できない画像形式です(PNG、JPEG、WebP、GIF、SVG、BMP、ICO、AVIF に対応)',
		imgErrDecode: 'ブラウザがこの画像をデコードできません',
		imgErrEncode: 'ブラウザがこの画像をエンコードできません',
		imgErrFormat: 'このブラウザは {fmt} をエンコードできません — PNG か JPEG をお試しください',
		i2bToB64: '画像 → Base64',
		i2bFromB64: 'Base64 → 画像',
		i2bInput: 'Data URL または生の Base64',
		i2bDataUrl: 'Data URL',
		i2bRawB64: '生の Base64',
		i2bCss: 'CSS 背景',
		i2bHtml: 'HTML <img>',
		i2bEncodedSize: 'Base64 サイズ',
		i2bOverhead: 'バイナリ比 +{pct}%',
		i2bNote: 'インライン化はリクエストを1つ減らせますが、文書が肥大化しキャッシュも効かなくなります — アイコンなど 10 KB 以下の小さな素材向きです。',
		icTarget: '変換先',
		icQuality: '品質',
		icConverted: '変換後',
		icSmaller: '元より小さい',
		icLarger: '元より大きい',
		icBgNote: 'JPEG は透過をサポートしません — 透明部分は白に合成されます。',
		icNote: '変換にはブラウザの canvas エンコーダを使うため、ファイルサイズはブラウザにより多少異なります。',
		fgAppleBg: 'Apple アイコン背景',
		fgFiles: '生成されたファイル',
		fgHtml: 'HTML <link> タグ',
		fgSmall: '元画像は {px}px です — それを超えるサイズは拡大され、ぼやける可能性があります',
		fgNote: 'ICO には 16・32・48 px を格納。Apple タッチアイコンは透過不可のため選択した背景色に合成され、PWA アイコンはアルファを保持します。正方形でない元画像は中央でトリミングされます。',
		irBy: 'リサイズ基準',
		irWidth: '幅',
		irHeight: '高さ',
		irPercent: 'パーセント',
		irFormat: '形式',
		irKeep: 'そのまま',
		irResized: 'リサイズ後',
		irScale: '倍率',
		irNote: '縮小は高品質スムージングを使用。拡大でディテールは増えません — 2× を超えるとぼやけます。',
		jcInput: 'JSON オブジェクトの配列',
		jcDelimiter: '区切り文字',
		jcComma: 'カンマ',
		jcSemicolon: 'セミコロン(欧州 Excel)',
		jcTab: 'タブ',
		jfInput: 'JSON 入力',
		jfIndent: 'インデント',
		jfIndentation: 'インデント方式',
		jfSp2: 'スペース 2',
		jfSp4: 'スペース 4',
		jfTabs: 'タブ',
		jfMin: 'ミニファイ — 空白なし',
		jfSortKeys: 'キーをソート',
		jfText: 'テキスト',
		jfTree: 'ツリー',
		jfTreeHint: 'ノードにホバーすると JSONPath をコピーできます — 試すなら:',
		jfTreeLink: 'JSONPath テスター',
		jpExpr: 'JSONPath 式',
		jpDoc: 'JSON ドキュメント',
		jpMatches: 'マッチ',
		jpResults: '結果の値',
		jtInput: 'JSON サンプル',
		jtRoot: 'ルート型名',
		jtNote: 'この 1 サンプルからの推論です — データが変わる項目は optional にし、nullable を広げてください。',
		jyFrom: '変換元',
		jySource: '元フォーマット',
		jyAutoT: '内容から元フォーマットを自動判別',
		jyTarget: '変換先',
		jyInput: '入力',
		jyUnknown: '不明なフォーマット',
		jwtAnatomy: 'トークンの構造',
		jwtHeader: 'ヘッダー',
		jwtPayload: 'ペイロード',
		jwtSignature: '署名(未検証)',
		jwtIssued: '発行',
		jwtExpires: '期限',
		jwtNotBefore: '有効開始',
		jwtLifetime: '有効期間',
		jwtNote: 'デコードはトークンを読むだけで、署名は検証しません。署名は発行者の鍵でサーバー側で検証してください。',
		loremUnit: '単位',
		loremWords: '単語',
		loremSentences: '文',
		loremParagraphs: '段落',
		loremClassic: '「Lorem ipsum…」で始める',
		pwWeak: '弱い',
		pwFair: '普通',
		pwStrong: '強い',
		pwExcellent: '非常に強い',
		pwNoLookalikes: '紛らわしい文字を除外 (0O1lI)',
		pwEntropy: 'エントロピー',
		pwBits: 'ビット',
		pwNote: '80 ビット以上で高速ハッシュのオフライン攻撃に耐え、100 ビット以上なら事実上推測不能です。',
		pwOut: 'パスワード',
		pwCrypto: 'crypto.getRandomValues でブラウザ内のみで生成。保存も送信もされません。',
		qrContent: '内容',
		qrEc: '誤り訂正',
		qrEcT: '{pct} の損傷まで読取可',
		qrSvg: 'SVG(ベクター、印刷向け)',
		qrPng: 'PNG(チャット、スライド)',
		qrNote: '内容は直接エンコードされます — リダイレクトなし、期限なし、スキャン追跡なし。',
		rxPattern: 'パターン',
		rxTest: 'テスト文字列',
		rxTestPh: 'パターンを試すテキストを貼り付け',
		rxHighlighted: 'ハイライト',
		rxMatches: 'マッチ',
		rxMatched: 'マッチしたテキスト',
		slugInput: 'タイトル(1 行に 1 つ)',
		slugSep: '区切り文字',
		slugHyphen: 'ハイフン',
		slugUnderscore: 'アンダースコア',
		slugMax: '最大長',
		slugOut: 'スラッグ',
		slInput: '行',
		slPh: '1 行に 1 件',
		slSort: 'ソート',
		slKeep: '順序を維持',
		slAsc: '昇順',
		slDesc: '降順',
		slNatural: '自然順 — 数値順',
		slLength: '行の長さ順',
		slShuffle: 'シャッフル',
		slDedupe: '重複削除',
		slIgnoreCase: '大文字小文字を無視',
		slTrim: '前後の空白を除去',
		slDropEmpty: '空行を削除',
		tsInput: 'タイムスタンプまたは日付',
		tsNow: '現在の Unix 時間:',
		tsNowT: '現在時刻を入力に使う',
		tsRelative: '相対時間',
		tsUnixS: 'Unix 秒',
		tsUnixMs: 'Unix ミリ秒',
		tsZones: 'タイムゾーン比較',
		tsNote: 'マーカーは各ゾーンの現地時刻を 24 時間バー上に示します — 暗い両端は 21:00–07:00 です。',
		uaInput: 'User-Agent 文字列',
		uaBrowser: 'ブラウザ',
		uaEngine: 'エンジン',
		uaOs: 'OS',
		uaDevice: 'デバイス',
		uaNote: '「サンプル」ボタンはあなたのブラウザの User-Agent を挿入します。実行時の判定は UA 判別ではなく機能検出で。',
		uniInput: '調べるテキスト',
		uniPh: '何でも貼り付け — 不可視文字がここで見えます',
		uniGraphemes: '書記素',
		uniGraphemesHint: 'ユーザーが見る単位',
		uniCodePoints: 'コードポイント',
		uniUtf16: 'UTF-16 ユニット',
		uniUtf16Hint: 'JS .length',
		uniUtf8: 'UTF-8 バイト',
		uniLimit: '先頭 300 文字のみ表示しています。',
		upInput: 'URL',
		upProtocol: 'プロトコル',
		upHost: 'ホスト',
		upHostname: 'ホスト名',
		upPort: 'ポート',
		upPath: 'パス',
		upFragment: 'フラグメント',
		upOrigin: 'オリジン',
		upQuery: 'クエリパラメータ',
		upDefault: '(デフォルト)',
		upNone: '(なし)',
		upEmpty: 'URL の構成要素がここに表示されます',
		urlComponent: 'コンポーネントモード (encodeURIComponent)',
		urlInputDec: 'デコードするエンコード済みテキスト',
		uuidOut: '生成された ID',
		uuidFormat: 'ID の種類',
		uuidHintV4: 'ランダム',
		uuidHintV7: '時系列順',
		uuidHintUlid: '時系列順、base32',
		uuidHintNano: '短く URL セーフ',
		uuidNote: 'crypto.getRandomValues による暗号学的に安全な生成。ブラウザ内で作られ、どこにも記録されません。',
		wcWords: '単語',
		wcChars: '文字',
		wcCharsHint: '空白除き {n}',
		wcReading: '読了時間',
		wcReadingHint: '毎分 220 語換算',
		wcLines: '行',
		wcSentences: '文',
		wcParagraphs: '段落',
		wcAvg: '平均単語長',

		// Shared formatter controls
		fmtFormat: '整形',
		fmtMinify: 'ミニファイ',

		// SQL formatter
		sqlInput: 'SQL 文(複数可)',
		sqlDialect: '方言',
		sqlKeywords: 'キーワード',
		sqlKeep: 'そのまま',

		// XML formatter
		xmlInput: 'XML ドキュメント',

		// XML ↔ JSON
		xjInputXml: 'XML ドキュメント',
		xjInputJson: 'JSON オブジェクト',
		xjNote: '属性は "@_name" 形式のキーに、属性と共存するテキストは "#text" になるため、変換はラウンドトリップ可能です。混在する兄弟要素間の順序は保持されません — XML は同名要素の繰り返しを許しますが、JSON オブジェクトは許さないためです。',

		// CSV → JSON
		cjInput: 'CSV / TSV データ',
		cjAuto: '自動',
		cjPipe: 'パイプ',
		cjHeader: '先頭行はヘッダー',
		cjTyped: '型付きの値',

		// Markdown
		mdPreview: 'プレビュー',
		mdNote: 'プレビューはレンダリング前にサニタイズされるため、貼り付けや共有された内容に含まれるスクリプトやイベントハンドラーは実行されません。HTML 出力欄には変換結果がそのまま入ります。',

		// Code formatters
		htmlInput: 'HTML ソース',
		cssInput: 'CSS ソース',
		jsInput: 'JavaScript ソース',

		// String escape
		escEscape: 'エスケープ',
		escUnescape: 'アンエスケープ',
		escDialect: '方言',
		escInputEsc: 'エスケープするテキスト',
		escInputUnesc: 'エスケープ済みテキスト',

		// Number base
		nbInput: '数値',
		nbFrom: '変換元',
		nbAutoT: '0x / 0o / 0b プレフィックスから判別、それ以外は 10 進数',
		nbGroup: '桁区切り',
		nbBase: '基数',
		nbBin: '2 進数',
		nbOct: '8 進数',
		nbDec: '10 進数',
		nbHex: '16 進数',
		nbBits: 'ビット',

		// Text ↔ hex/binary
		hbFormat: 'バイトの表記',
		hbSep: '区切り文字',
		hbSpace: 'スペース',
		hbNone: 'なし',
		hbColon: 'コロン',
		hbInputEnc: 'エンコードするテキスト',
		hbInputDec: 'デコードするバイト列',

		// JSON Schema
		schInfer: 'スキーマ推論',
		schValidate: '検証',
		schInferT: 'サンプル JSON からスキーマを生成',
		schValidateT: 'JSON をスキーマと照合',
		schData: 'JSON データ',
		schSchema: 'JSON Schema',
		schViolations: '件の違反',
		schValid: '有効 — データはスキーマに適合しています',
		schResult: '検証結果',

		// EXIF
		exTags: '{n} 件のメタデータフィールド',
		exNone: 'メタデータは見つかりませんでした — このファイルはすでにクリーンです',
		exStrip: 'クリーンなコピーをダウンロード',
		exGps: 'GPS 位置情報が埋め込まれています',
		exMap: '地図で見る',
		exNote: '読み取りと除去はすべてブラウザ内で行われ、写真がアップロードされることはありません。除去は再エンコードなしにメタデータセグメントをバイト単位で取り除くため、ピクセルと画質はそのままです。',

		// Cron builder
		crBuilder: 'ビルダー',
		crMinute: '分',
		crHour: '時',
		crDom: '日',
		crMonth: '月',
		crDow: '曜日',
		crEvery: 'すべて',
		crStep: 'N ごと',
		crAt: '指定',
		crUse: 'この式を使う',

		// JWT sign & verify
		jwtDecode: 'デコード',
		jwtSign: '署名',
		jwtVerify: '検証',
		jwtAlg: 'アルゴリズム',
		jwtPayloadLbl: 'ペイロード(JSON オブジェクト)',
		jwtSecret: 'シークレット',
		jwtPrivKey: '秘密鍵(PKCS#8 PEM)',
		jwtPubKey: 'シークレット(HS)または公開鍵 PEM(RS/ES)',
		jwtSignNote: '署名はブラウザ内の WebCrypto で実行され、鍵がこのページの外に出ることはありません。HS 系アルゴリズムには長いランダムなシークレットを使ってください — 短いシークレットは、どこで署名しようとブルートフォースで破られます。',
		jwtVerifyNote: '検証は、指定した鍵に対して署名をローカルで確認します。JWKS エンドポイントの取得や aud/iss などのクレームの検証は行いません — それらはサーバー側で行ってください。',

		// Timestamp extras
		tsDiff: '2 つの日付の差'
	},
	categories: {
		encoding: 'エンコード',
		json: 'JSON とデータ',
		text: 'テキスト',
		time: '日付と時刻',
		generators: 'ジェネレーター',
		crypto: 'ハッシュと暗号',
		web: 'Web',
		image: '画像',
		code: 'コードとマークアップ',
		privacy: 'プライバシー'
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
			name: 'JSON ↔ CSV変換',
			description: 'JSON をフラット化して CSV に変換、CSV は型付きの JSON オブジェクトに逆変換'
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
		},
		'image-to-base64': {
			name: '画像 ↔ Base64 変換',
			description: '画像と Base64 Data URL を相互変換 — CSS・HTML スニペット付き'
		},
		'image-converter': {
			name: '画像形式変換',
			description: 'PNG・JPEG・WebP 間で画像を変換、品質調整付き'
		},
		'image-resizer': {
			name: '画像リサイズ',
			description: '幅・高さ・パーセント指定で画像をリサイズ — 完全オフライン'
		},
		'favicon-generator': {
			name: 'Favicon ジェネレーター',
			description: '任意の画像から favicon.ico と PNG・manifest アイコン一式を生成'
		},
		'sql-formatter': {
			name: 'SQLフォーマッター',
			description: 'SQL を方言に応じたキーワード処理で整形、または 1 行にミニファイ'
		},
		'xml-formatter': {
			name: 'XML整形・検証',
			description: 'XML の整形・ミニファイ・検証。エラーは行・列まで正確に表示'
		},
		'xml-to-json': {
			name: 'XML ↔ JSON変換',
			description: 'XML ドキュメントと JSON を相互変換。属性も含めて変換'
		},
		'markdown-to-html': {
			name: 'Markdown ↔ HTML変換',
			description: 'Markdown をライブプレビュー付きで HTML に変換、HTML から Markdown への逆変換も'
		},
		'html-formatter': {
			name: 'HTML整形・ミニファイ',
			description: '乱れた HTML を読みやすく整形、または本番用にミニファイ'
		},
		'css-formatter': {
			name: 'CSS整形・ミニファイ',
			description: 'CSS を読みやすく整形、または配布用にミニファイ'
		},
		'js-formatter': {
			name: 'JavaScript整形・ミニファイ',
			description: 'JavaScript を整形、または本物の圧縮と変数名短縮でミニファイ'
		},
		'string-escape': {
			name: '文字列エスケープ / アンエスケープ',
			description: 'JSON・JavaScript・Java・XML・SQL・CSV 向けに文字列をエスケープ / 復元'
		},
		'number-base-converter': {
			name: '基数変換',
			description: '2 進・8 進・10 進・16 進から基数 36 まで、数値を相互変換'
		},
		'text-to-hex': {
			name: 'テキスト ↔ 16進 / 2進変換',
			description: 'テキストを 16 進・2 進・10 進のバイト列に変換し、バイトダンプを復元'
		},
		'json-schema-validator': {
			name: 'JSON Schema検証・生成',
			description: 'JSON をスキーマで検証、またはサンプルデータからスキーマを推論'
		},
		'exif-viewer': {
			name: 'EXIFビューアー・削除',
			description: '写真に含まれるメタデータを表示し、再エンコードなしで除去'
		}
	}
};

export default ja;
