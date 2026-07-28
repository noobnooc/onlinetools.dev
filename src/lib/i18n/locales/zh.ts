import type { Messages } from '$lib/i18n';

const zh: Messages = {
	code: 'zh',
	name: '中文',
	ui: {
		search: '搜索',
		overview: '概览',
		toggleTheme: '切换主题',
		themeSystem: '跟随系统',
		themeDark: '深色',
		themeLight: '浅色',
		themeTitle: '主题:{mode} — 点击切换',
		footerPrivacy: '全部在你的浏览器中运行 — 粘贴的内容不会被上传',
		allTools: '全部工具',
		changelog: '更新日志',
		changelogMetaDescription:
			'onlinetools.dev 的最新动态——新增工具、新功能与问题修复,全部在浏览器本地运行。',
		releaseDate: '发布日期',
		language: '语言',
		openNav: '打开导航',
		searchTools: '搜索工具',

		// About / Why page
		about: '关于',
		aboutTitle: 'onlinetools.dev 的理念 — 本地优先、无追踪、可验证 | onlinetools.dev',
		aboutMetaDescription:
			'onlinetools.dev 为何存在:每个工具都在你的浏览器中运行,粘贴的内容不会上传,无广告、无追踪、无登录 — 还有一个实时指示器,让你亲自验证。',
		aboutEyebrow: '为何存在 · 信任',
		aboutVerifyHeading: '别只听我说',
		aboutVerifyHint:
			'在下面输入或粘贴任何内容。计数会一直停在零 — 每一次按键都在你的机器上处理。',
		aboutRequestsLabel: '本页打开后发出的网络请求',
		aboutRequestsNote:
			'唯一会让这个数字变化的,是打开另一个工具 — 那会从同一域名加载本站自己的代码。你粘贴的内容永远不会。',
		aboutVerifyPlaceholder: '输入或粘贴任何内容 — 什么都不会离开你的浏览器……',
		aboutOfflineReady: '可离线',
		aboutOfflineCaching: '缓存中…',
		aboutDevtools:
			'想要更硬的证据?打开浏览器开发者工具,切到 Network(网络)面板,然后粘贴。你会看到什么都没发生。',
		aboutViewSource: '查看源码',
		aboutEditPage: '编辑此页',
		aboutBuiltBy: '作者',

		// About / Why page — the manifesto body (localized)
		aboutH1: '计算器不该偷偷联网回家。',
		aboutLead:
			'大多数“在线工具”网站,都是一堆广告包着一个输入框,你粘进去的东西被悄悄发往一台你永远看不到的服务器。我受够了在某个随手打开的页面上解码 JWT,然后慢半拍地意识到——我刚把自己的 token 交给了陌生人。onlinetools.dev 就是我的回答:还是你每天用的那些工具,只不过干活的那台电脑,就是你面前这台。',
		aboutS1Head: '一切都在你的机器上运行',
		aboutS1Body:
			'这里的每个工具都只是浏览器里的纯计算——没有往返请求,没有服务器,压根没有可上传的地方。你的 JSON、你的访问令牌、那个你本想先清理再说的 {env}:它们从你的剪贴板走到你的屏幕,就到此为止。我这样做不是因为省钱(确实省),而是因为你的数据不关我的事。',
		aboutS2Head: '无广告。无追踪。无账户。',
		aboutS2Body:
			'没有统计脚本记录你的每一次按键,没有 cookie 同意横幅(根本没有 cookie 需要你同意),没有“登录后继续”,也没有藏在三步之后的付费升级。我是真的不知道你是谁、你粘了什么——这正是重点:工具做完它该做的事,就该在你关掉标签页的那一刻把你忘掉。',
		aboutS3Head: '断网时它照常能用',
		aboutS3Body:
			'一个页面加载过一次,就归你了。整个站点是静态的,由 service worker 缓存,所以在飞机上、在地铁里、在封得死死的公司代理后面,工具都照跑不误。飞行模式是格式化 JSON 的好地方。',
		aboutS4Head: '快,而且不挡你的路',
		aboutS4Body:
			'没有启动画面,没有“接受我们的条款”,你和工作之间没有任何弹窗。按 {kbd} 直达任意工具,粘贴任何内容,对的工具会自己浮现,而每个结果离你的剪贴板都只有一次按键。键盘优先,贯穿到底。',
		aboutVerifyIntro:
			'隐私承诺很廉价——每个网站都在把你卖掉的路上说自己“重视你的隐私”。所以这里给你的不是一句让你相信的话,而是一样你可以亲自核对的东西。这个计数器实时盯着你浏览器自己的网络活动:',
		aboutBugLine:
			'如果哪个工具真把你的数据发到了不该去的地方,那是 bug,不是商业模式——{issue},我会修。',
		aboutBugLink: '提个 issue',

		// Favorites (stored locally in this browser)
		favorites: '收藏',
		favoriteAdd: '添加到收藏',
		favoriteRemove: '取消收藏',
		homeTitle: 'onlinetools.dev — 在浏览器中运行的开发者工具',
		homeMetaDescription:
			'快速、键盘优先的开发者工具,全部在浏览器本地运行。格式化 JSON、解码 JWT 与 Base64、转换时间戳、测试正则 — 无需上传、无需注册、支持离线。',
		homeEyebrow: '{n} 个工具 · 本地优先',
		homeHeading: '在浏览器中运行的开发者工具',
		homeSub: '无需上传、无需注册、即开即用。',
		pasteToDetect: '粘贴即识别',
		worksOffline: '支持离线',
		shortcuts: '快捷键',
		searchPlaceholder: '搜索 {n} 个工具,或粘贴任意内容…',
		startHere: '从这里开始',
		smartPaste: '智能粘贴',
		smartPasteDesc: '在任意位置粘贴任何内容 — 自动识别内容类型,一次按键直达对应工具。',
		keyboardFirst: '键盘优先,贯穿始终',
		keyboardFirstDesc: '查找、运行、复制、分享,全程无需鼠标。',
		kbdAnyTool: '任意工具',
		kbdCopyResult: '复制结果',
		kbdConfirm: '确认',
		kbdAllShortcuts: '全部快捷键',

		// Paste hero (homepage)
		pasteHeroHeading: '粘贴任何内容 —— 立刻找到对的工具',
		pasteHeroPlaceholder: '粘贴 JWT、JSON、Unix 时间戳、颜色、URL、图片……',
		tryLabel: '试试',
		plainText: '纯文本',
		noMatchHint: '没有精确匹配 —— 从下面挑个文本工具，或搜索全部',
		runHint: '运行',
		newlineHint: '换行',
		clearHint: '清除',

		// Pipeline (tool chains)
		chainNavLabel: '管线',
		chainNew: 'New',
		chainSteps: '步骤',
		chainMoreRecipes: '更多配方',
		chainTitle: '工具管线 —— 在浏览器里串联开发者工具 | onlinetools.dev',
		chainMetaDescription:
			'把开发者工具串成一条管线 —— 解码、转换、提取一气呵成。每一步的输出喂给下一步，全部在浏览器里运行，整条配方就藏在一个可分享的链接里。',
		chainEyebrow: '工作台 · 本地优先',
		chainHeading: '管线',
		chainSub: '把工具串成配方 —— 每一步的输出喂给下一步。全部在你的浏览器里运行。',
		chainInputPlaceholder: '粘贴或输入起始内容……',
		chainAddStep: '添加步骤',
		chainSearchSteps: '搜索步骤……',
		chainStarters: '示例',
		chainEmpty: '添加一个步骤 —— 每一步的输出喂给下一步。',
		chainHomeCta: '把工具串成一条管线',
		chainHomeCtaSub: '让一个工具的输出直接流进下一个 —— 解码、转换、提取一气呵成。',
		toolsTitle: '全部开发者工具 — onlinetools.dev',
		toolsMetaDescription:
			'浏览 onlinetools.dev 的全部工具:JSON、YAML、Base64、JWT、时间戳、Cron、正则、Diff、UUID、哈希、二维码等 — 全部在浏览器本地运行。',
		toolsBlurb: '{n} 个工具,全部在浏览器中计算。持续更新中 — 详见',
		toolTitle: '{name} — 免费 · 隐私安全 | onlinetools.dev',
		toolMetaSuffix: '完全在浏览器中运行 — 无需上传、无需注册、支持离线。',
		runsLocally: '本地运行',
		runsLocallyTitle: '此工具的全部计算都在你的浏览器中完成,输入内容不会被上传。',
		aboutTool: '关于此工具',
		faqHeading: '常见问题',
		relatedTools: '相关工具',
		breadcrumbTools: '工具',
		sample: '示例',
		line: '行',
		output: '输出',
		copy: '复制',
		copied: '已复制',
		download: '下载',
		share: '分享',
		linkCopied: '链接已复制',
		continueWith: '继续处理',
		suggested: '推荐',
		shareTooLarge: '内容过大,无法放入 URL — 分享链接有长度上限以保证可移植。内容不会离开这台设备。',
		emptyHint: '输入后结果会实时显示在这里',
		palettePlaceholder: '搜索工具,或粘贴内容直接处理…',
		noMatch: '没有匹配的工具',
		navigate: '导航',
		open: '打开',
		close: '关闭',
		detected: '检测到',
		chars: '字符',
		shortcutsTitle: '键盘快捷键',
		scPalette: '打开命令面板',
		scCopy: '复制结果',
		scEsc: '关闭面板 / 忽略建议',
		scHelp: '本快捷键参考',
		scPaste: '智能粘贴 — 识别内容并推荐工具',
		scNav: '在面板中导航与确认'
	},
	tl: {
		direction: '方向',
		encode: '编码',
		decode: '解码',
		mode: '模式',
		count: '数量',
		lengthLbl: '长度',
		uppercase: '大写',
		lowercase: '小写',
		regenerate: '重新生成',
		b64InputEnc: '待编码文本',
		b64InputDec: '待解码 Base64',
		b64PhEnc: '任意文本,支持 Unicode',
		b64UrlSafe: 'URL 安全(无填充)',
		bcHash: '哈希',
		bcVerify: '校验',
		bcHashT: '对密码做哈希',
		bcVerifyT: '校验密码与哈希是否匹配',
		bcPassword: '密码',
		bcCost: '成本因子',
		bcHashLbl: 'Bcrypt 哈希',
		bcPh: '仅保留在浏览器中',
		bcVersion: '版本',
		bcCostShort: '成本',
		bcSalt: '盐值',
		bcNote: '哈希在你的浏览器中运行,不会传输任何内容。浏览器 JS 比原生 bcrypt 慢,耗时仅作上限参考。',
		caseInput: '文本或标识符(每行一个)',
		caseEmpty: '输入后九种风格会同时显示在这里',
		colorInput: '颜色',
		colorFormats: '各种格式',
		colorRgb: 'RGB 通道',
		colorContrast: '文字对比度 (WCAG)',
		cronInput: 'Cron 表达式',
		cronEvalIn: '时区为',
		cronNext: '接下来 5 次运行',
		cronNone: '未来 5 年内没有运行',
		diffOriginal: '原始文本',
		diffChanged: '修改后',
		diffLbl: '差异',
		diffUnchanged: '行未变',
		diffEmpty: '逐行差异会显示在这里',
		hashInput: '待哈希文本',
		hashPh: '任意文本 — 输入时哈希实时更新',
		hashHmac: 'HMAC 密钥',
		hashOptional: '(可选)',
		hashHmacPh: '留空则计算普通哈希',
		hashDigests: '摘要',
		hashEmpty: '输入时摘要实时更新',
		hashNote: 'MD5 与 SHA-1 仅用于旧式校验和 — 涉及安全请使用 SHA-256 或更强的算法。',
		heAll: '编码所有非 ASCII 字符',
		heNumeric: '仅数字实体',
		heInputEnc: '待转义文本',
		heInputDec: '含实体的 HTML',
		imgDrop: '拖入图片、点击选择,或直接粘贴剪贴板中的图片',
		imgLocal: '全程在浏览器中处理 — 不会上传任何内容',
		imgReplace: '拖入、点击或粘贴以替换',
		imgSource: '源图片',
		imgOriginal: '原始',
		imgDimensions: '尺寸',
		imgDownload: '下载 {fmt}',
		imgErrNotImage: '无法识别的图片格式(支持 PNG、JPEG、WebP、GIF、SVG、BMP、ICO、AVIF)',
		imgErrDecode: '浏览器无法解码这张图片',
		imgErrEncode: '浏览器无法编码这张图片',
		imgErrFormat: '当前浏览器无法编码 {fmt} — 请尝试 PNG 或 JPEG',
		i2bToB64: '图片 → Base64',
		i2bFromB64: 'Base64 → 图片',
		i2bInput: 'Data URL 或纯 Base64',
		i2bDataUrl: 'Data URL',
		i2bRawB64: '纯 Base64',
		i2bCss: 'CSS 背景',
		i2bHtml: 'HTML <img>',
		i2bEncodedSize: 'Base64 大小',
		i2bOverhead: '较二进制 +{pct}%',
		i2bNote: '内联可省去一次请求,但会让文档变大并失去缓存 — 适合图标等 10 KB 以下的小资源。',
		icTarget: '转换为',
		icQuality: '质量',
		icConverted: '转换后',
		icSmaller: '小于原图',
		icLarger: '大于原图',
		icBgNote: 'JPEG 不支持透明 — 透明区域会被压平为白色。',
		icNote: '转换使用浏览器的 canvas 编码器,文件大小在不同浏览器间会略有差异。',
		fgAppleBg: 'Apple 图标背景',
		fgFiles: '生成的文件',
		fgHtml: 'HTML <link> 标签',
		fgSmall: '源图为 {px}px — 超过该尺寸的图标将被放大,可能发虚',
		fgNote: 'ICO 内打包 16、32、48 px。Apple 触摸图标不支持透明,会压平到所选背景色上;PWA 图标保留透明通道。非正方形的源图会居中裁剪。',
		irBy: '缩放方式',
		irWidth: '宽度',
		irHeight: '高度',
		irPercent: '百分比',
		irFormat: '格式',
		irKeep: '不变',
		irResized: '缩放后',
		irScale: '比例',
		irNote: '缩小使用高质量平滑算法。放大无法凭空生成细节 — 超过 2× 会明显发虚。',
		jcInput: 'JSON 对象数组',
		jcDelimiter: '分隔符',
		jcComma: '逗号',
		jcSemicolon: '分号(欧洲 Excel)',
		jcTab: '制表符',
		jfInput: 'JSON 输入',
		jfIndent: '缩进',
		jfIndentation: '缩进方式',
		jfSp2: '2 空格',
		jfSp4: '4 空格',
		jfTabs: '制表符',
		jfMin: '压缩 — 去除空白',
		jfSortKeys: '键排序',
		jfText: '文本',
		jfTree: '树形',
		jfTreeHint: '悬停节点可复制其 JSONPath — 可以在这里试试:',
		jfTreeLink: 'JSONPath 测试器',
		jpExpr: 'JSONPath 表达式',
		jpDoc: 'JSON 文档',
		jpMatches: '匹配',
		jpResults: '结果值',
		jtInput: 'JSON 样本',
		jtRoot: '根类型名',
		jtNote: '仅从这一份样本推导 — 数据有变化的字段请自行标记可选并放宽可空类型。',
		jyFrom: '从',
		jySource: '源格式',
		jyAutoT: '根据内容自动识别源格式',
		jyTarget: '目标格式',
		jyInput: '输入',
		jyUnknown: '未知格式',
		jwtAnatomy: '令牌结构',
		jwtHeader: '头部',
		jwtPayload: '载荷',
		jwtSignature: '签名(未校验)',
		jwtIssued: '签发时间',
		jwtExpires: '过期时间',
		jwtNotBefore: '生效时间',
		jwtLifetime: '有效期',
		jwtNote: '解码只是读取令牌 — 不会校验签名。请在服务端用签发方的密钥校验签名。',
		loremUnit: '单位',
		loremWords: '单词',
		loremSentences: '句子',
		loremParagraphs: '段落',
		loremClassic: '以 “Lorem ipsum…” 开头',
		pwWeak: '弱',
		pwFair: '一般',
		pwStrong: '强',
		pwExcellent: '极强',
		pwNoLookalikes: '排除易混淆字符 (0O1lI)',
		pwEntropy: '熵值',
		pwBits: '位',
		pwNote: '≥ 80 位可抵御快速哈希的离线破解;≥ 100 位几乎不可能被猜中。',
		pwOut: '密码',
		pwCrypto: '使用 crypto.getRandomValues 在你的浏览器中生成,不存储、不传输。',
		qrContent: '内容',
		qrEc: '纠错等级',
		qrEcT: '可承受 {pct} 损坏',
		qrSvg: 'SVG(矢量,适合印刷)',
		qrPng: 'PNG(聊天,幻灯片)',
		qrNote: '内容被直接编码 — 无跳转服务、永不过期、无扫描追踪。',
		qrdResult: '识别结果',
		qrdNone: '未在图片中找到二维码 — 请使用更清晰的图片、裁剪到二维码附近,并保留四周留白',
		qrdOpen: '打开链接',
		qrdWifiSsid: '网络名称 (SSID)',
		qrdWifiPass: '密码',
		qrdWifiSec: '加密方式',
		qrdWifiHidden: '隐藏网络',
		qrdNote: '识别完全在你的浏览器中进行 — 图片和二维码内容都不会被上传。',
		qrdCamera: '摄像头扫描',
		qrdCameraStop: '关闭摄像头',
		qrdCameraErr: '无法访问摄像头 — 请检查浏览器权限,或改用图片',
		rxPattern: '模式',
		rxTest: '测试文本',
		rxTestPh: '粘贴要匹配的文本',
		rxHighlighted: '高亮结果',
		rxMatches: '匹配',
		rxMatched: '匹配到的文本',
		slugInput: '标题(每行一个)',
		slugSep: '分隔符',
		slugHyphen: '连字符',
		slugUnderscore: '下划线',
		slugMax: '最大长度',
		slugOut: 'Slug',
		slInput: '文本行',
		slPh: '每行一条',
		slSort: '排序',
		slKeep: '保持原序',
		slAsc: '升序',
		slDesc: '降序',
		slNatural: '自然排序 — 数字按大小',
		slLength: '按行长度',
		slShuffle: '随机打乱',
		slDedupe: '去重',
		slIgnoreCase: '忽略大小写',
		slTrim: '去除首尾空白',
		slDropEmpty: '删除空行',
		tsInput: '时间戳或日期',
		tsNow: '当前 Unix 时间:',
		tsNowT: '用当前时间作为输入',
		tsRelative: '相对时间',
		tsUnixS: 'Unix 秒',
		tsUnixMs: 'Unix 毫秒',
		tsZones: '跨时区对比',
		tsNote: '标记表示各时区在 24 小时条上的本地时间 — 变暗两端为 21:00–07:00。',
		uaInput: 'User-Agent 字符串',
		uaBrowser: '浏览器',
		uaEngine: '内核',
		uaOs: '操作系统',
		uaDevice: '设备',
		uaNote: '「示例」按钮会填入你当前浏览器的 User-Agent。运行时判断请用特性检测,而非 UA 嗅探。',
		uniInput: '待检查文本',
		uniPh: '粘贴任意内容 — 不可见字符在这里现形',
		uniGraphemes: '字素',
		uniGraphemesHint: '用户看到的',
		uniCodePoints: '码点',
		uniUtf16: 'UTF-16 单元',
		uniUtf16Hint: 'JS .length',
		uniUtf8: 'UTF-8 字节',
		uniLimit: '仅显示前 300 个字符。',
		upInput: 'URL',
		upProtocol: '协议',
		upHost: '主机',
		upHostname: '主机名',
		upPort: '端口',
		upPath: '路径',
		upFragment: '片段',
		upOrigin: '源 (Origin)',
		upQuery: '查询参数',
		upDefault: '(默认)',
		upNone: '(无)',
		upEmpty: 'URL 组件会显示在这里',
		urlComponent: '组件模式 (encodeURIComponent)',
		urlInputDec: '待解码的编码文本',
		uuidOut: '生成的 ID',
		uuidFormat: 'ID 类型',
		uuidHintV4: '随机',
		uuidHintV7: '按时间有序',
		uuidHintUlid: '按时间有序,base32',
		uuidHintNano: '短小,URL 安全',
		uuidNote: '使用 crypto.getRandomValues 生成 — 加密安全,在你的浏览器中创建,不留任何记录。',
		wcWords: '单词',
		wcChars: '字符',
		wcCharsHint: '不含空格 {n}',
		wcReading: '阅读时长',
		wcReadingHint: '按每分钟 220 词',
		wcLines: '行数',
		wcSentences: '句子',
		wcParagraphs: '段落',
		wcAvg: '平均词长',

		// Shared formatter controls
		fmtFormat: '格式化',
		fmtMinify: '压缩',

		// SQL formatter
		sqlInput: 'SQL 语句',
		sqlDialect: '方言',
		sqlKeywords: '关键字',
		sqlKeep: '保持原样',

		// XML formatter
		xmlInput: 'XML 文档',

		// XML ↔ JSON
		xjInputXml: 'XML 文档',
		xjInputJson: 'JSON 对象',
		xjNote:
			'属性会变成 "@_name" 键,与属性并存的文本会变成 "#text",因此转换可以往返还原。混合兄弟元素之间的顺序不会保留——XML 允许元素重复,JSON 对象则不允许。',

		// CSV → JSON
		cjInput: 'CSV / TSV 数据',
		cjAuto: '自动',
		cjPipe: '竖线',
		cjHeader: '首行为表头',
		cjTyped: '类型化值',

		// Markdown
		mdPreview: '预览',
		mdNote:
			'预览在渲染前会先净化,粘贴或分享内容中的脚本与事件处理器无法执行。HTML 输出框中始终是未净化的原始转换结果。',

		// Code formatters
		htmlInput: 'HTML 源码',
		cssInput: 'CSS 源码',
		jsInput: 'JavaScript 源码',

		// String escape
		escEscape: '转义',
		escUnescape: '反转义',
		escDialect: '方言',
		escInputEsc: '待转义文本',
		escInputUnesc: '已转义文本',

		// Number base
		nbInput: '数字',
		nbFrom: '源进制',
		nbAutoT: '根据 0x / 0o / 0b 前缀识别,否则按十进制',
		nbGroup: '数位分组',
		nbBase: '进制',
		nbBin: '二进制',
		nbOct: '八进制',
		nbDec: '十进制',
		nbHex: '十六进制',
		nbBits: '位',

		// Text ↔ hex/binary
		hbFormat: '字节表示为',
		hbSep: '分隔符',
		hbSpace: '空格',
		hbNone: '无',
		hbColon: '冒号',
		hbInputEnc: '待编码文本',
		hbInputDec: '待解码字节',

		// JSON Schema
		schInfer: '推导 Schema',
		schValidate: '校验',
		schInferT: '从 JSON 样本生成 Schema',
		schValidateT: '按 Schema 检查 JSON',
		schData: 'JSON 数据',
		schSchema: 'JSON Schema',
		schViolations: '处违规',
		schValid: '校验通过——数据符合 Schema',
		schResult: '校验结果',

		// EXIF
		exTags: '{n} 个元数据字段',
		exNone: '未发现元数据——这个文件已经很干净',
		exStrip: '下载清理后的副本',
		exGps: '嵌入了 GPS 位置',
		exMap: '在地图上查看',
		exNote:
			'读取与清除都完全在你的浏览器中进行——照片不会被上传。清理按字节移除元数据段而不重新编码,像素和画质分毫不动。',

		// Cron builder
		crBuilder: '构建器',
		crMinute: '分钟',
		crHour: '小时',
		crDom: '每月第几天',
		crMonth: '月份',
		crDow: '星期几',
		crEvery: '每个',
		crStep: '每 N 个',
		crAt: '指定',
		crUse: '使用该表达式',

		// JWT sign & verify
		jwtDecode: '解码',
		jwtSign: '签名',
		jwtVerify: '校验',
		jwtAlg: '算法',
		jwtPayloadLbl: '载荷(JSON 对象)',
		jwtSecret: '密钥',
		jwtPrivKey: '私钥(PKCS#8 PEM)',
		jwtPubKey: '密钥 (HS) 或公钥 PEM (RS/ES)',
		jwtSignNote:
			'签名通过浏览器中的 WebCrypto 完成——密钥不会离开本页面。HS 系列算法请使用足够长的随机密钥;短密钥无论在哪里签名都能被暴力破解。',
		jwtVerifyNote:
			'校验只在本地用你提供的密钥核对签名,不会请求 JWKS 端点,也不校验 aud/iss 等声明——那些请在服务端完成。',

		// Timestamp extras
		tsDiff: '两个日期之间的差值'
	},
	categories: {
		encoding: '编码转换',
		json: 'JSON 与数据',
		text: '文本',
		time: '日期时间',
		generators: '生成器',
		crypto: '哈希与加密',
		web: 'Web',
		image: '图片',
		code: '代码与标记',
		privacy: '隐私'
	},
	tools: {
		'json-formatter': {
			name: 'JSON 格式化与校验',
			description: '格式化、校验、压缩 JSON,错误精确定位到行列'
		},
		'base64-decode': {
			name: 'Base64 编码 / 解码',
			description: '文本与 Base64 互转,支持 URL 安全变体'
		},
		'timestamp-converter': {
			name: 'Unix 时间戳转换',
			description: 'Unix 时间戳与日期互转,附相对时间'
		},
		'jwt-decoder': {
			name: 'JWT 解码器',
			description: '解码 JWT 头部与载荷、检查过期时间 — 完全离线'
		},
		'regex-tester': {
			name: '正则表达式测试',
			description: '实时高亮匹配与捕获分组,在线测试正则表达式'
		},
		'diff-checker': {
			name: '文本对比 Diff',
			description: '逐行对比两段文本,直观查看增删差异'
		},
		'url-encode-decode': {
			name: 'URL 编码 / 解码',
			description: '对 URL 组件与查询字符串进行百分号编码或解码'
		},
		'url-parser': {
			name: 'URL 解析器',
			description: '将 URL 拆解为协议、主机、路径与查询参数'
		},
		'uuid-generator': {
			name: 'UUID 生成器',
			description: '生成 UUID v4/v7、ULID 和 Nano ID,支持批量'
		},
		'hash-generator': {
			name: '哈希生成器',
			description: 'MD5、SHA-1、SHA-256、SHA-512 与 HMAC — 全部在浏览器中计算'
		},
		'color-converter': {
			name: '颜色转换器',
			description: '在 HEX、RGB、HSL 与 OKLCH 之间转换,实时预览'
		},
		'case-converter': {
			name: '命名风格转换',
			description: '在 camelCase、snake_case、kebab-case、PascalCase 等之间切换'
		},
		'word-counter': {
			name: '字数统计',
			description: '实时统计单词、字符、句子、字节数与阅读时长'
		},
		'lorem-ipsum-generator': {
			name: '占位文本生成器',
			description: '为原型与设计稿生成占位用的单词、句子或段落'
		},
		'slug-generator': {
			name: 'Slug 生成器',
			description: '将标题转换为干净的 URL slug,可选分隔符与长度'
		},
		'sort-lines': {
			name: '行排序与去重',
			description: '按字母或自然顺序排序,移除重复行与空行'
		},
		'html-entities': {
			name: 'HTML 实体编码 / 解码',
			description: '转义 HTML 文本,或将 &amp; 类实体还原为字符'
		},
		'unicode-inspector': {
			name: 'Unicode 字符检查器',
			description: '查看每个字符的码点、UTF-8/UTF-16 字节与转义写法'
		},
		'cron-parser': {
			name: 'Cron 表达式解析',
			description: '用通俗语言解释 Cron 计划,并列出接下来的运行时间'
		},
		'password-generator': {
			name: '密码生成器',
			description: '按字符集生成随机密码,附真实的熵值评估'
		},
		'qr-code-generator': {
			name: '二维码生成器',
			description: '生成清晰的 SVG / PNG 二维码 — 无水印、不上传'
		},
		'qr-code-decoder': {
			name: '二维码识别器',
			description: '从图片中识别二维码 — 链接、WiFi 密码、文本,全程本地处理'
		},
		'json-to-yaml': {
			name: 'JSON ↔ YAML ↔ TOML 转换',
			description: '在 JSON、YAML、TOML 之间转换,自动识别格式'
		},
		'json-to-csv': {
			name: 'JSON ↔ CSV 转换',
			description: '将 JSON 展平为 CSV,或把 CSV 解析回类型化的 JSON 对象'
		},
		'json-to-typescript': {
			name: 'JSON → TypeScript 类型',
			description: '从 JSON 样本即时推导 TypeScript 接口'
		},
		'jsonpath-tester': {
			name: 'JSONPath 测试器',
			description: '用 JSONPath 表达式查询 JSON,查看每个匹配及其路径'
		},
		'bcrypt-generator': {
			name: 'Bcrypt 哈希与校验',
			description: '用 bcrypt 哈希密码,或校验明文与哈希是否匹配'
		},
		'user-agent-parser': {
			name: 'User-Agent 解析器',
			description: '从 UA 字符串识别浏览器、内核、操作系统与设备'
		},
		'image-to-base64': {
			name: '图片 ↔ Base64 转换',
			description: '图片与 Base64 Data URL 互转,附 CSS 与 HTML 代码片段'
		},
		'image-converter': {
			name: '图片格式转换',
			description: '在 PNG、JPEG、WebP 之间转换图片,可调压缩质量'
		},
		'image-resizer': {
			name: '图片缩放',
			description: '按宽度、高度或百分比缩放图片 — 清晰且完全离线'
		},
		'favicon-generator': {
			name: 'Favicon 生成器',
			description: '把任意图片变成 favicon.ico 及完整的 PNG 与 manifest 图标套件'
		},
		'sql-formatter': {
			name: 'SQL 格式化',
			description: '按数据库方言格式化 SQL 关键字,或压缩为单行'
		},
		'xml-formatter': {
			name: 'XML 格式化与校验',
			description: '美化、压缩并校验 XML,错误精确定位到行列'
		},
		'xml-to-json': {
			name: 'XML ↔ JSON 转换',
			description: 'XML 与 JSON 双向互转,属性也不丢失'
		},
		'markdown-to-html': {
			name: 'Markdown ↔ HTML 转换',
			description: 'Markdown 渲染为 HTML 并实时预览,或把 HTML 转回 Markdown'
		},
		'html-formatter': {
			name: 'HTML 格式化与压缩',
			description: '美化凌乱的 HTML,或压缩后用于生产环境'
		},
		'css-formatter': {
			name: 'CSS 格式化与压缩',
			description: '美化 CSS 便于阅读,或压缩后直接上线'
		},
		'js-formatter': {
			name: 'JavaScript 格式化与压缩',
			description: '美化 JavaScript,或用真正的压缩与变量名混淆缩小体积'
		},
		'string-escape': {
			name: '字符串转义 / 反转义',
			description: '按 JSON、JavaScript、Java、XML、SQL 与 CSV 规则转义或还原字符串'
		},
		'number-base-converter': {
			name: '进制转换器',
			description: '在二、八、十、十六进制及至多 36 的任意进制之间转换数字'
		},
		'text-to-hex': {
			name: '文本 ↔ 十六进制 / 二进制转换',
			description: '把文本转成十六进制、二进制或十进制字节,也能反向解码字节串'
		},
		'json-schema-validator': {
			name: 'JSON Schema 校验与生成',
			description: '按 Schema 校验 JSON,或从样本数据推导 Schema'
		},
		'exif-viewer': {
			name: 'EXIF 查看与清除',
			description: '查看照片携带的元数据,并在不重新编码的前提下移除'
		}
	}
};

export default zh;
