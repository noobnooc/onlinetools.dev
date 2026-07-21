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
		releaseDate: '发布日期',
		language: '语言',
		openNav: '打开导航',
		searchTools: '搜索工具',
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
	categories: {
		encoding: '编码转换',
		json: 'JSON 与数据',
		text: '文本',
		time: '日期时间',
		generators: '生成器',
		crypto: '哈希与加密',
		web: 'Web'
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
		'json-to-yaml': {
			name: 'JSON ↔ YAML ↔ TOML 转换',
			description: '在 JSON、YAML、TOML 之间转换,自动识别格式'
		},
		'json-to-csv': {
			name: 'JSON → CSV 转换',
			description: '将 JSON 对象数组展平为 CSV,正确处理转义'
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
		}
	}
};

export default zh;
