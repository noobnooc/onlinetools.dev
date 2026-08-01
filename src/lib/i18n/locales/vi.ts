import type { Messages } from '$lib/i18n';

const vi: Messages = {
	code: 'vi',
	name: 'Tiếng Việt',
	ui: {
		search: 'Tìm kiếm',
		overview: 'Tổng quan',
		toggleTheme: 'Đổi giao diện màu',
		themeSystem: 'Theo hệ thống',
		themeDark: 'Tối',
		themeLight: 'Sáng',
		themeTitle: 'Giao diện: {mode} — nhấn để đổi',
		footerPrivacy: 'Chạy trong trình duyệt của bạn — mọi thứ bạn dán đều không được tải lên',
		allTools: 'Tất cả công cụ',
		changelog: 'Nhật ký thay đổi',
		changelogMetaDescription:
			'Có gì mới trên onlinetools.dev — công cụ mới, tính năng mới và các bản sửa lỗi, tất cả chạy cục bộ trong trình duyệt của bạn.',
		releaseDate: 'Ngày phát hành',
		language: 'Ngôn ngữ',
		openNav: 'Mở điều hướng',
		searchTools: 'Tìm công cụ',

		// About / Why page
		about: 'Giới thiệu',
		aboutTitle:
			'Vì sao có onlinetools.dev — chạy cục bộ, không theo dõi, có thể kiểm chứng | onlinetools.dev',
		aboutMetaDescription:
			'Vì sao onlinetools.dev tồn tại: mọi công cụ đều chạy trong trình duyệt của bạn, những gì bạn dán không được tải lên, không quảng cáo, không trình theo dõi, không đăng nhập — và một bộ đếm trực tiếp để bạn tự kiểm chứng.',
		aboutEyebrow: 'vì sao có trang này · niềm tin',
		aboutVerifyHeading: 'Đừng vội tin lời tôi',
		aboutVerifyHint:
			'Hãy gõ hoặc dán bất cứ thứ gì bên dưới. Bộ đếm sẽ đứng yên ở số không — mọi phím bạn gõ đều được xử lý ngay tại đây, trên máy của bạn.',
		aboutRequestsLabel: 'Số yêu cầu mạng kể từ khi mở trang này',
		aboutRequestsNote:
			'Thứ duy nhất có thể làm con số này nhúc nhích là việc bạn mở một công cụ khác, khi đó trang tải mã của chính nó từ cùng tên miền. Nội dung bạn dán thì không bao giờ.',
		aboutVerifyPlaceholder: 'Gõ hoặc dán bất cứ thứ gì — không gì rời khỏi trình duyệt của bạn…',
		aboutOfflineReady: 'Sẵn sàng ngoại tuyến',
		aboutOfflineCaching: 'Đang lưu vào bộ nhớ đệm…',
		aboutDevtools:
			'Muốn bằng chứng chắc chắn hơn? Hãy mở DevTools của trình duyệt, chuyển sang tab Network rồi dán. Bạn sẽ thấy đúng là chẳng có gì xảy ra.',
		aboutViewSource: 'Xem mã nguồn',
		aboutEditPage: 'Sửa trang này',
		aboutBuiltBy: 'Thực hiện bởi',

		// About / Why page — the manifesto body (localized)
		aboutH1: 'Một cái máy tính bỏ túi thì không cần gọi về nhà.',
		aboutLead:
			'Phần lớn các trang “công cụ online” là một bức tường quảng cáo bao quanh một ô nhập liệu, lặng lẽ gửi mọi thứ bạn dán vào tới một máy chủ mà bạn sẽ chẳng bao giờ thấy. Tôi phát chán cảnh giải mã một JWT trên trang web nào đó rồi nhận ra, chậm mất một giây, rằng mình vừa trao token cho người lạ. onlinetools.dev là câu trả lời của tôi: vẫn những công cụ bạn dùng mỗi ngày, chỉ khác ở chỗ cái máy làm việc chính là cái đang ở trước mặt bạn.',
		aboutS1Head: 'Mọi thứ chạy trên máy của bạn',
		aboutS1Body:
			'Mỗi công cụ ở đây chỉ là những phép tính thuần túy trong trình duyệt — không có vòng gửi–nhận, không có máy chủ, không có chỗ nào để tải lên. JSON của bạn, các token truy cập của bạn, cái {env} mà bạn định dọn dẹp trước đã: chúng đi từ khay nhớ tạm lên màn hình rồi dừng ở đó. Tôi làm như vậy không phải vì rẻ hơn (đúng là rẻ hơn thật), mà vì dữ liệu của bạn không phải việc của tôi.',
		aboutS2Head: 'Không quảng cáo. Không theo dõi. Không tài khoản.',
		aboutS2Body:
			'Không có script phân tích đếm từng phím bạn gõ, không có banner cookie (vốn chẳng có cookie nào để bạn đồng ý), không có “đăng nhập để tiếp tục”, không có lời chào mời nâng cấp rình sẵn ở bước thứ ba. Tôi thực sự không biết bạn là ai và bạn dán gì — và đó chính là điều cốt lõi: một công cụ nên làm xong việc của nó rồi quên bạn ngay khi bạn đóng tab.',
		aboutS3Head: 'Vẫn chạy khi mạng thì không',
		aboutS3Body:
			'Tải một trang một lần là nó thuộc về bạn. Toàn bộ trang web là tĩnh và được service worker lưu đệm, nên trên máy bay, dưới tàu điện ngầm hay sau một proxy công ty khóa chặt, các công cụ vẫn chạy. Chế độ máy bay là một nơi hoàn toàn ổn để định dạng JSON.',
		aboutS4Head: 'Nhanh, và không cản đường bạn',
		aboutS4Body:
			'Không màn hình chờ, không “đồng ý điều khoản”, không hộp thoại nào chen giữa bạn và công việc. Nhấn {kbd} để nhảy tới bất kỳ công cụ nào, dán bất cứ thứ gì và công cụ phù hợp sẽ tự hiện ra, còn mọi kết quả chỉ cách khay nhớ tạm đúng một phím. Ưu tiên bàn phím, từ đầu đến cuối.',
		aboutVerifyIntro:
			'Lời hứa về quyền riêng tư thì rẻ — trang nào cũng nói “chúng tôi coi trọng quyền riêng tư của bạn” trên đường đem bạn đi bán. Vậy nên đây là thứ để kiểm chứng, thay vì để tin. Bộ đếm này theo dõi trực tiếp hoạt động mạng của chính trình duyệt bạn:',
		aboutBugLine:
			'Nếu có công cụ nào gửi dữ liệu của bạn tới nơi lẽ ra không nên, đó là lỗi chứ không phải mô hình kinh doanh — {issue} và tôi sẽ sửa.',
		aboutBugLink: 'hãy mở một issue',

		// Favorites (stored locally in this browser)
		favorites: 'Yêu thích',
		favoriteAdd: 'Thêm vào yêu thích',
		favoriteRemove: 'Bỏ khỏi yêu thích',

		// Home
		homeTitle: 'onlinetools.dev — Công cụ lập trình chạy ngay trong trình duyệt',
		homeMetaDescription:
			'Bộ công cụ lập trình nhanh, ưu tiên bàn phím, chạy hoàn toàn trong trình duyệt của bạn. Định dạng JSON, giải mã JWT và Base64, đổi dấu thời gian, thử regex — không tải lên, không đăng ký, chạy được ngoại tuyến.',
		homeEyebrow: '{n} công cụ · chạy cục bộ',
		homeHeading: 'Công cụ lập trình chạy ngay trong trình duyệt',
		homeSub: 'Không tải lên, không đăng ký, không phải chờ.',
		pasteToDetect: 'dán để nhận diện',
		worksOffline: 'chạy ngoại tuyến',
		shortcuts: 'phím tắt',
		searchPlaceholder: 'Tìm trong {n} công cụ, hoặc dán bất cứ thứ gì…',
		startHere: 'Bắt đầu ở đây',
		smartPaste: 'Dán thông minh',
		smartPasteDesc:
			'Dán bất cứ thứ gì, ở bất cứ đâu — loại nội dung sẽ được nhận diện và công cụ phù hợp chỉ cách một phím.',
		keyboardFirst: 'Ưu tiên bàn phím, từ đầu đến cuối',
		keyboardFirstDesc: 'Tìm, chạy, sao chép và chia sẻ mà không cần chạm vào chuột.',
		kbdAnyTool: 'công cụ bất kỳ',
		kbdCopyResult: 'sao chép kết quả',
		kbdConfirm: 'xác nhận',
		kbdAllShortcuts: 'tất cả phím tắt',

		// Paste hero (homepage)
		pasteHeroHeading: 'Dán bất cứ thứ gì — có ngay công cụ phù hợp',
		pasteHeroPlaceholder: 'Dán một JWT, JSON, dấu thời gian Unix, mã màu, URL, hình ảnh…',
		tryLabel: 'Thử',
		plainText: 'Văn bản thuần',
		noMatchHint:
			'Không khớp chính xác — chọn một công cụ văn bản bên dưới hoặc tìm trong tất cả',
		runHint: 'chạy',
		newlineHint: 'xuống dòng',
		clearHint: 'xóa',

		// Pipeline (tool chains)
		chainNavLabel: 'Chuỗi công cụ',
		chainNew: 'Tạo mới',
		chainSteps: 'Các bước',
		chainMoreRecipes: 'Thêm công thức',
		chainTitle:
			'Chuỗi công cụ — nối các công cụ lập trình ngay trong trình duyệt | onlinetools.dev',
		chainMetaDescription:
			'Nối các công cụ lập trình thành một chuỗi — giải mã, biến đổi và trích xuất trong một mạch. Mỗi bước tiếp sức cho bước sau, tất cả chạy trong trình duyệt của bạn, và cả công thức nằm gọn trong một liên kết chia sẻ được.',
		chainEyebrow: 'bàn làm việc · chạy cục bộ',
		chainHeading: 'Chuỗi công cụ',
		chainSub:
			'Nối các công cụ thành một công thức — mỗi bước tiếp sức cho bước sau. Chạy hoàn toàn trong trình duyệt của bạn.',
		chainInputPlaceholder: 'Dán hoặc gõ dữ liệu đầu vào…',
		chainAddStep: 'Thêm bước',
		chainSearchSteps: 'Tìm bước…',
		chainStarters: 'Công thức gợi ý',
		chainEmpty: 'Hãy thêm một bước — mỗi bước tiếp sức cho bước sau.',
		chainHomeCta: 'Nối các công cụ thành một chuỗi',
		chainHomeCtaSub:
			'Đưa kết quả của công cụ này sang công cụ kế tiếp — giải mã, biến đổi và trích xuất trong một mạch.',

		// Tools index page
		toolsTitle: 'Tất cả công cụ lập trình — onlinetools.dev',
		toolsMetaDescription:
			'Duyệt mọi công cụ trên onlinetools.dev: JSON, YAML, Base64, JWT, dấu thời gian, cron, regex, so sánh văn bản, UUID, hash, mã QR và nhiều hơn nữa — tất cả chạy cục bộ trong trình duyệt của bạn.',
		toolsBlurb:
			'{n} công cụ, mỗi công cụ đều được tính ngay trong trình duyệt của bạn. Còn nhiều thứ đang đến đều đặn — xem',

		// Tool page shell
		toolTitle: '{name} — Miễn phí và riêng tư | onlinetools.dev',
		toolMetaSuffix:
			'Chạy hoàn toàn trong trình duyệt của bạn — không tải lên, không đăng ký, chạy được ngoại tuyến.',
		runsLocally: 'Chạy cục bộ',
		runsLocallyTitle:
			'Công cụ này tính toán mọi thứ ngay trong trình duyệt của bạn. Dữ liệu bạn nhập không bao giờ được tải lên.',
		aboutTool: 'Về công cụ này',
		faqHeading: 'Câu hỏi thường gặp',
		relatedTools: 'Công cụ liên quan',
		breadcrumbTools: 'công cụ',
		reportIssue: 'Báo lỗi',
		reportIssueTitle: 'Báo lỗi của {name} trên GitHub',

		// Shared tool components
		sample: 'Mẫu',
		line: 'dòng',
		output: 'Kết quả',
		copy: 'Sao chép',
		copied: 'Đã sao chép',
		download: 'Tải xuống',
		share: 'Chia sẻ',
		linkCopied: 'Đã sao chép liên kết',
		continueWith: 'Tiếp tục với',
		suggested: 'gợi ý',
		shareTooLarge:
			'Dữ liệu quá lớn để đưa vào URL — liên kết chia sẻ bị giới hạn để vẫn gọn và dùng được ở mọi nơi. Nội dung vẫn không bao giờ rời khỏi máy này.',
		emptyHint: 'Kết quả hiện ở đây khi bạn gõ',

		// Command palette
		palettePlaceholder: 'Tìm công cụ, hoặc dán nội dung để xử lý ngay…',
		noMatch: 'Không có công cụ phù hợp',
		navigate: 'di chuyển',
		open: 'mở',
		close: 'đóng',

		// Smart paste
		detected: 'Đã nhận diện',
		chars: 'ký tự',

		// Shortcut help
		shortcutsTitle: 'Phím tắt',
		scPalette: 'Mở bảng lệnh',
		scCopy: 'Sao chép kết quả',
		scEsc: 'Đóng bảng / bỏ qua gợi ý',
		scHelp: 'Bảng phím tắt này',
		scPaste: 'Dán thông minh — nhận diện nội dung và gợi ý công cụ',
		scNav: 'Di chuyển và xác nhận trong các bảng'
	},
	tl: {
		direction: 'Chiều',
		encode: 'Mã hóa',
		decode: 'Giải mã',
		mode: 'Chế độ',
		count: 'Số lượng',
		lengthLbl: 'Độ dài',
		uppercase: 'Chữ hoa',
		lowercase: 'Chữ thường',
		regenerate: 'Tạo lại',
		b64InputEnc: 'Văn bản cần mã hóa',
		b64InputDec: 'Base64 cần giải mã',
		b64PhEnc: 'Văn bản bất kỳ, kể cả unicode',
		b64UrlSafe: 'An toàn cho URL (không đệm)',
		bcHash: 'Băm',
		bcVerify: 'Kiểm tra',
		bcHashT: 'Băm một mật khẩu',
		bcVerifyT: 'Đối chiếu mật khẩu với một chuỗi hash',
		bcPassword: 'Mật khẩu',
		bcCost: 'Hệ số chi phí',
		bcHashLbl: 'Chuỗi hash bcrypt',
		bcPh: 'ở lại trong trình duyệt của bạn',
		bcVersion: 'Phiên bản',
		bcCostShort: 'Chi phí',
		bcSalt: 'Salt',
		bcNote:
			'Việc băm chạy trong trình duyệt của bạn — không có gì được truyền đi. JS trong trình duyệt chậm hơn bcrypt bản gốc, nên hãy xem thời gian đo được là giới hạn trên.',
		caseInput: 'Văn bản hoặc định danh (mỗi dòng một mục)',
		caseEmpty: 'Cả chín kiểu viết sẽ hiện ở đây khi bạn gõ',
		colorInput: 'Màu',
		colorFormats: 'Các định dạng',
		colorRgb: 'Kênh RGB',
		colorContrast: 'Độ tương phản chữ (WCAG)',
		cronInput: 'Biểu thức cron',
		cronEvalIn: 'tính theo múi giờ',
		cronNext: '5 lần chạy kế tiếp',
		cronNone: 'Không có lần chạy nào trong 5 năm tới',
		diffOriginal: 'Bản gốc',
		diffChanged: 'Bản sửa',
		diffLbl: 'Khác biệt',
		diffUnchanged: 'không đổi',
		diffEmpty: 'Khác biệt từng dòng sẽ hiện ở đây',
		hashInput: 'Văn bản cần băm',
		hashPh: 'Văn bản bất kỳ — các chuỗi hash cập nhật khi bạn gõ',
		hashHmac: 'Khóa bí mật HMAC',
		hashOptional: '(tùy chọn)',
		hashHmacPh: 'Để trống nếu chỉ cần hash thường',
		hashDigests: 'Bản tóm lược',
		hashEmpty: 'Các bản tóm lược cập nhật trực tiếp khi bạn gõ',
		hashNote:
			'MD5 và SHA-1 chỉ hiển thị để đối chiếu checksum cũ — với bất cứ việc gì liên quan tới bảo mật, hãy dùng SHA-256 trở lên.',
		heAll: 'Mã hóa mọi ký tự ngoài ASCII',
		heNumeric: 'Chỉ dạng số',
		heInputEnc: 'Văn bản cần thoát ký tự',
		heInputDec: 'HTML có thực thể',
		imgDrop: 'Kéo thả một ảnh, bấm để chọn, hoặc dán từ khay nhớ tạm',
		imgLocal: 'Ở lại trong trình duyệt của bạn — không có gì được tải lên',
		imgReplace: 'Kéo thả, bấm hoặc dán để thay ảnh',
		imgSource: 'Ảnh nguồn',
		imgOriginal: 'Ảnh gốc',
		imgDimensions: 'Kích thước',
		imgDownload: 'Tải {fmt}',
		imgErrNotImage: 'Không phải định dạng ảnh nhận diện được (PNG, JPEG, WebP, GIF, SVG, BMP, ICO, AVIF)',
		imgErrDecode: 'Trình duyệt không giải mã được ảnh này',
		imgErrEncode: 'Trình duyệt không mã hóa được ảnh này',
		imgErrFormat: 'Trình duyệt này không mã hóa được {fmt} — hãy thử PNG hoặc JPEG',
		i2bToB64: 'Ảnh → Base64',
		i2bFromB64: 'Base64 → ảnh',
		i2bInput: 'Data URL hoặc Base64 thuần',
		i2bDataUrl: 'Data URL',
		i2bRawB64: 'Base64 thuần',
		i2bCss: 'Nền CSS',
		i2bHtml: 'HTML <img>',
		i2bEncodedSize: 'Kích thước Base64',
		i2bOverhead: '+{pct}% so với nhị phân',
		i2bNote:
			'Nhúng thẳng giúp bớt một request nhưng làm phình tài liệu và mất khả năng lưu đệm — hợp nhất với icon và các tài nguyên nhỏ dưới ~10 KB.',
		icTarget: 'Chuyển sang',
		icQuality: 'Chất lượng',
		icConverted: 'Sau khi chuyển',
		icSmaller: 'nhỏ hơn ảnh gốc',
		icLarger: 'lớn hơn ảnh gốc',
		icBgNote: 'JPEG không hỗ trợ trong suốt — vùng trong suốt sẽ bị làm phẳng trên nền trắng.',
		icNote:
			'Việc chuyển đổi dùng bộ mã hóa canvas của trình duyệt, nên kích thước tệp chính xác có chênh lệch nhỏ giữa các trình duyệt.',
		fgAppleBg: 'Nền icon Apple',
		fgFiles: 'Tệp đã tạo',
		fgHtml: 'Thẻ HTML <link>',
		fgSmall: 'Ảnh nguồn là {px}px — icon lớn hơn mức đó sẽ bị phóng to và có thể bị mờ',
		fgNote:
			'Tệp ICO gói sẵn 16, 32 và 48 px. Icon Apple touch không được trong suốt nên sẽ được làm phẳng trên nền bạn chọn; icon PWA giữ nguyên kênh alpha. Ảnh nguồn không vuông sẽ được cắt theo tâm.',
		irBy: 'Đổi cỡ theo',
		irWidth: 'Chiều rộng',
		irHeight: 'Chiều cao',
		irPercent: 'Phần trăm',
		irFormat: 'Định dạng',
		irKeep: 'Giữ nguyên',
		irResized: 'Sau khi đổi cỡ',
		irScale: 'Tỷ lệ',
		irNote:
			'Thu nhỏ dùng thuật toán làm mượt chất lượng cao. Phóng to không thể tạo ra chi tiết vốn không có — trên 2× sẽ thấy mờ.',
		jcInput: 'Mảng JSON gồm các đối tượng',
		jcDelimiter: 'Ký tự phân tách',
		jcComma: 'Dấu phẩy',
		jcSemicolon: 'Dấu chấm phẩy (Excel châu Âu)',
		jcTab: 'Tab',
		jfInput: 'JSON đầu vào',
		jfIndent: 'Thụt lề',
		jfIndentation: 'Kiểu thụt lề',
		jfSp2: '2 dấu cách',
		jfSp4: '4 dấu cách',
		jfTabs: 'Tab',
		jfMin: 'Đã nén — không khoảng trắng',
		jfSortKeys: 'Sắp xếp khóa',
		jfText: 'Văn bản',
		jfTree: 'Cây',
		jfTreeHint: 'Rê chuột lên một nút để sao chép JSONPath của nó — thử ngay trong',
		jfTreeLink: 'công cụ JSONPath',
		jpExpr: 'Biểu thức JSONPath',
		jpDoc: 'Tài liệu JSON',
		jpMatches: 'Kết quả khớp',
		jpResults: 'Giá trị kết quả',
		jtInput: 'JSON mẫu',
		jtRoot: 'Tên kiểu gốc',
		jtNote:
			'Được suy ra từ đúng một mẫu này — hãy đánh dấu trường tùy chọn và mở rộng kiểu nullable ở những chỗ dữ liệu của bạn thay đổi.',
		jyFrom: 'Từ',
		jySource: 'Định dạng nguồn',
		jyAutoT: 'Tự nhận định dạng nguồn từ nội dung',
		jyTarget: 'Định dạng đích',
		jyInput: 'Đầu vào',
		jyUnknown: 'định dạng lạ',
		jwtAnatomy: 'Cấu tạo token',
		jwtHeader: 'header',
		jwtPayload: 'payload',
		jwtSignature: 'chữ ký (chưa xác minh)',
		jwtIssued: 'Phát hành',
		jwtExpires: 'Hết hạn',
		jwtNotBefore: 'Không dùng trước',
		jwtLifetime: 'Thời hạn',
		jwtNote:
			'Việc giải mã chỉ đọc token — nó không xác minh chữ ký. Hãy xác minh chữ ký ở phía máy chủ bằng khóa của bên phát hành.',
		loremUnit: 'Đơn vị',
		loremWords: 'Từ',
		loremSentences: 'Câu',
		loremParagraphs: 'Đoạn',
		loremClassic: 'Bắt đầu bằng “Lorem ipsum…”',
		pwWeak: 'Yếu',
		pwFair: 'Tạm ổn',
		pwStrong: 'Mạnh',
		pwExcellent: 'Rất mạnh',
		pwNoLookalikes: 'Bỏ ký tự dễ nhầm (0O1lI)',
		pwEntropy: 'Entropy',
		pwBits: 'bit',
		pwNote:
			'≥ 80 bit chịu được tấn công ngoại tuyến vào các hàm băm nhanh; ≥ 100 bit thì gần như không thể đoán.',
		pwOut: 'Mật khẩu',
		pwCrypto:
			'Sinh bằng crypto.getRandomValues, chỉ trong trình duyệt của bạn. Không có gì được lưu hay truyền đi.',
		qrContent: 'Nội dung',
		qrEc: 'Sửa lỗi',
		qrEcT: 'Chịu được hư hỏng {pct}',
		qrSvg: 'SVG (vector, để in)',
		qrPng: 'PNG (chat, slide)',
		qrNote:
			'Nội dung được mã hóa trực tiếp — không qua dịch vụ chuyển hướng, không hết hạn, không theo dõi lượt quét.',
		qrdResult: 'Nội dung giải mã',
		qrdNone:
			'Không tìm thấy mã QR — hãy dùng ảnh rõ nét hơn, cắt sát mã và giữ phần lề trắng xung quanh',
		qrdOpen: 'Mở liên kết',
		qrdWifiSsid: 'Mạng (SSID)',
		qrdWifiPass: 'Mật khẩu',
		qrdWifiSec: 'Bảo mật',
		qrdWifiHidden: 'Mạng ẩn',
		qrdNote:
			'Quá trình quét diễn ra hoàn toàn trong trình duyệt — ảnh, hình ảnh từ camera và nội dung mã không bao giờ được tải lên.',
		qrdCamera: 'Quét bằng camera',
		qrdCameraStop: 'Tắt camera',
		qrdCameraErr: 'Không truy cập được camera — kiểm tra quyền của trình duyệt hoặc dùng ảnh thay thế',
		rxPattern: 'Mẫu',
		rxTest: 'Chuỗi thử',
		rxTestPh: 'Dán văn bản để thử mẫu lên đó',
		rxHighlighted: 'Đã tô sáng',
		rxMatches: 'Kết quả khớp',
		rxMatched: 'Văn bản khớp',
		slugInput: 'Tiêu đề (mỗi dòng một mục)',
		slugSep: 'Ký tự phân tách',
		slugHyphen: 'Gạch ngang',
		slugUnderscore: 'Gạch dưới',
		slugMax: 'Độ dài tối đa',
		slugOut: 'Slug',
		slInput: 'Các dòng',
		slPh: 'mỗi dòng một mục',
		slSort: 'Sắp xếp',
		slKeep: 'Giữ nguyên thứ tự',
		slAsc: 'Tăng dần',
		slDesc: 'Giảm dần',
		slNatural: 'Tự nhiên — số theo đúng thứ tự',
		slLength: 'Theo độ dài dòng',
		slShuffle: 'Xáo trộn',
		slDedupe: 'Bỏ trùng lặp',
		slIgnoreCase: 'Bỏ qua hoa/thường',
		slTrim: 'Cắt khoảng trắng thừa',
		slDropEmpty: 'Bỏ dòng trống',
		tsInput: 'Dấu thời gian hoặc ngày',
		tsNow: 'Thời gian unix hiện tại:',
		tsNowT: 'Dùng thời gian hiện tại làm đầu vào',
		tsRelative: 'Tương đối',
		tsUnixS: 'Unix theo giây',
		tsUnixMs: 'Unix theo mili giây',
		tsZones: 'Theo các múi giờ',
		tsNote:
			'Dấu chỉ vị trí cho thấy giờ địa phương của từng múi trên dải 24 giờ — hai đầu mờ là khoảng 21:00–07:00.',
		uaInput: 'Chuỗi User-Agent',
		uaBrowser: 'Trình duyệt',
		uaEngine: 'Engine',
		uaOs: 'Hệ điều hành',
		uaDevice: 'Thiết bị',
		uaNote:
			'Nút “Mẫu” chèn chuỗi User-Agent của chính trình duyệt bạn. Khi cần quyết định lúc chạy, hãy dùng feature detection thay vì dò chuỗi UA.',
		uniInput: 'Văn bản cần soi',
		uniPh: 'Dán bất cứ thứ gì — ký tự vô hình sẽ hiện rõ ở đây',
		uniGraphemes: 'Grapheme',
		uniGraphemesHint: 'thứ người dùng nhìn thấy',
		uniCodePoints: 'Điểm mã',
		uniUtf16: 'Đơn vị UTF-16',
		uniUtf16Hint: 'JS .length',
		uniUtf8: 'Byte UTF-8',
		uniLimit: 'Đang hiển thị 300 ký tự đầu tiên.',
		upInput: 'URL',
		upProtocol: 'Giao thức',
		upHost: 'Host',
		upHostname: 'Tên máy chủ',
		upPort: 'Cổng',
		upPath: 'Đường dẫn',
		upFragment: 'Fragment',
		upOrigin: 'Origin',
		upQuery: 'Tham số truy vấn',
		upDefault: '(mặc định)',
		upNone: '(không có)',
		upEmpty: 'Các thành phần của URL sẽ hiện ở đây',
		urlComponent: 'Chế độ thành phần (encodeURIComponent)',
		urlInputDec: 'Văn bản đã mã hóa cần giải mã',
		uuidOut: 'ID đã tạo',
		uuidFormat: 'Định dạng ID',
		uuidHintV4: 'ngẫu nhiên',
		uuidHintV7: 'sắp theo thời gian',
		uuidHintUlid: 'sắp theo thời gian, base32',
		uuidHintNano: 'ngắn, an toàn cho URL',
		uuidNote:
			'Sinh bằng crypto.getRandomValues — an toàn về mặt mật mã, tạo ngay trong trình duyệt của bạn, không được ghi lại ở đâu cả.',
		fmtFormat: 'Định dạng',
		fmtMinify: 'Nén',
		sqlInput: 'Câu lệnh SQL',
		sqlDialect: 'Phương ngữ',
		sqlKeywords: 'Từ khóa',
		sqlKeep: 'Giữ nguyên',
		xmlInput: 'Tài liệu XML',
		xjInputXml: 'Tài liệu XML',
		xjInputJson: 'Đối tượng JSON',
		xjNote:
			'Thuộc tính trở thành khóa "@_tên", còn phần văn bản đi kèm thuộc tính thành "#text", nhờ vậy chuyển đổi hai chiều vẫn khớp. Thứ tự giữa các nút anh em hỗn hợp không được giữ lại — XML cho phép lặp, còn đối tượng JSON thì không.',
		cjInput: 'Dữ liệu CSV / TSV',
		cjAuto: 'Tự động',
		cjPipe: 'Dấu sổ đứng',
		cjHeader: 'Dòng đầu là tiêu đề cột',
		cjTyped: 'Giá trị có kiểu',
		mdPreview: 'Xem trước',
		mdNote:
			'Bản xem trước được làm sạch trước khi hiển thị, nên script và trình xử lý sự kiện trong nội dung dán hoặc chia sẻ không thể chạy. Ô kết quả HTML chứa bản chuyển đổi thô.',
		htmlInput: 'Mã HTML',
		cssInput: 'Mã CSS',
		jsInput: 'Mã JavaScript',
		escEscape: 'Thoát ký tự',
		escUnescape: 'Bỏ thoát ký tự',
		escDialect: 'Phương ngữ',
		escInputEsc: 'Văn bản cần thoát ký tự',
		escInputUnesc: 'Văn bản đã thoát ký tự',
		nbInput: 'Số',
		nbFrom: 'Từ hệ',
		nbAutoT: 'Nhận biết theo tiền tố 0x / 0o / 0b, còn lại coi là thập phân',
		nbGroup: 'Nhóm chữ số',
		nbBase: 'Hệ cơ số',
		nbBin: 'Nhị phân',
		nbOct: 'Bát phân',
		nbDec: 'Thập phân',
		nbHex: 'Thập lục phân',
		nbBits: 'bit',
		hbFormat: 'Byte dạng',
		hbSep: 'Ký tự phân tách',
		hbSpace: 'Dấu cách',
		hbNone: 'Không',
		hbColon: 'Dấu hai chấm',
		hbInputEnc: 'Văn bản cần mã hóa',
		hbInputDec: 'Byte cần giải mã',
		schInfer: 'Suy ra schema',
		schValidate: 'Kiểm tra',
		schInferT: 'Tạo schema từ JSON mẫu',
		schValidateT: 'Đối chiếu JSON với một schema',
		schData: 'Dữ liệu JSON',
		schSchema: 'JSON Schema',
		schViolations: 'lỗi vi phạm',
		schValid: 'Hợp lệ — dữ liệu tuân theo schema',
		schResult: 'Kết quả kiểm tra',
		exTags: '{n} trường siêu dữ liệu',
		exNone: 'Không tìm thấy siêu dữ liệu — tệp này vốn đã sạch',
		exStrip: 'Tải bản đã làm sạch',
		exGps: 'Có nhúng vị trí GPS',
		exMap: 'Xem trên bản đồ',
		exNote:
			'Việc đọc và xóa diễn ra hoàn toàn trong trình duyệt của bạn — bức ảnh không bao giờ được tải lên. Thao tác làm sạch gỡ các đoạn siêu dữ liệu theo từng byte mà không mã hóa lại, nên điểm ảnh và chất lượng vẫn nguyên vẹn.',
		crBuilder: 'Trình dựng',
		crMinute: 'Phút',
		crHour: 'Giờ',
		crDom: 'Ngày trong tháng',
		crMonth: 'Tháng',
		crDow: 'Thứ trong tuần',
		crEvery: 'Mỗi',
		crStep: 'Cứ mỗi N',
		crAt: 'Cụ thể',
		crUse: 'Dùng biểu thức này',
		jwtDecode: 'Giải mã',
		jwtSign: 'Ký',
		jwtVerify: 'Xác minh',
		jwtAlg: 'Thuật toán',
		jwtPayloadLbl: 'Payload (đối tượng JSON)',
		jwtSecret: 'Khóa bí mật',
		jwtPrivKey: 'Khóa riêng tư (PKCS#8 PEM)',
		jwtPubKey: 'Khóa bí mật (HS) hoặc khóa công khai PEM (RS/ES)',
		jwtSignNote:
			'Việc ký chạy trên WebCrypto trong trình duyệt của bạn — khóa không bao giờ rời khỏi trang này. Với các thuật toán HS, hãy dùng khóa bí mật dài và ngẫu nhiên; khóa ngắn vẫn bị dò ra bằng vét cạn dù bạn ký ở đâu.',
		jwtVerifyNote:
			'Việc xác minh đối chiếu chữ ký với khóa bạn cung cấp, ngay tại máy. Nó không gọi tới endpoint JWKS và không kiểm tra các claim như aud/iss — hãy làm việc đó ở phía máy chủ.',
		tsDiff: 'Khoảng cách giữa hai mốc thời gian',
		wcWords: 'Từ',
		wcChars: 'Ký tự',
		wcCharsHint: '{n} nếu bỏ dấu cách',
		wcReading: 'Thời gian đọc',
		wcReadingHint: 'ở tốc độ 220 từ/phút',
		wcLines: 'Dòng',
		wcSentences: 'Câu',
		wcParagraphs: 'Đoạn',
		wcAvg: 'Độ dài từ trung bình'
	},
	categories: {
		encoding: 'Mã hóa',
		json: 'JSON và dữ liệu',
		text: 'Văn bản',
		time: 'Ngày và giờ',
		generators: 'Bộ sinh',
		crypto: 'Hash và mật mã',
		web: 'Web',
		image: 'Hình ảnh',
		code: 'Mã và markup',
		privacy: 'Riêng tư'
	},
	tools: {
		'json-formatter': {
			name: 'Định dạng & kiểm tra JSON',
			description: 'Định dạng, kiểm tra và nén JSON với vị trí lỗi chính xác'
		},
		'base64-decode': {
			name: 'Mã hóa / giải mã Base64',
			description: 'Mã hóa văn bản sang Base64 hoặc giải mã Base64 về văn bản, có cả biến thể URL-safe'
		},
		'image-to-base64': {
			name: 'Chuyển đổi ảnh ↔ Base64',
			description: 'Biến ảnh thành data URL Base64 và ngược lại — kèm đoạn mã CSS và HTML'
		},
		'image-converter': {
			name: 'Chuyển đổi định dạng ảnh',
			description: 'Chuyển ảnh giữa PNG, JPEG và WebP với thanh chỉnh chất lượng'
		},
		'image-resizer': {
			name: 'Đổi kích thước ảnh',
			description: 'Đổi cỡ ảnh theo chiều rộng, chiều cao hoặc phần trăm — sắc nét và hoàn toàn ngoại tuyến'
		},
		'favicon-generator': {
			name: 'Tạo favicon',
			description: 'Biến ảnh bất kỳ thành favicon.ico cùng trọn bộ icon PNG và manifest'
		},
		'timestamp-converter': {
			name: 'Chuyển đổi dấu thời gian Unix',
			description: 'Đổi dấu thời gian unix sang ngày giờ dễ đọc và ngược lại, kèm thời gian tương đối'
		},
		'jwt-decoder': {
			name: 'Giải mã JWT',
			description: 'Giải mã header và payload của JWT, kiểm tra hạn dùng — hoàn toàn ngoại tuyến'
		},
		'regex-tester': {
			name: 'Thử biểu thức chính quy',
			description: 'Thử regex với tô sáng kết quả khớp và các nhóm ngay khi gõ'
		},
		'diff-checker': {
			name: 'So sánh văn bản',
			description: 'So sánh hai văn bản theo từng dòng và xem phần thêm, phần xóa'
		},
		'url-encode-decode': {
			name: 'Mã hóa / giải mã URL',
			description: 'Mã hóa phần trăm hoặc giải mã thành phần URL và chuỗi truy vấn'
		},
		'url-parser': {
			name: 'Phân tích URL',
			description: 'Tách một URL thành giao thức, host, đường dẫn và tham số truy vấn'
		},
		'uuid-generator': {
			name: 'Tạo UUID',
			description: 'Tạo UUID v4/v7, ULID và Nano ID — từng cái một hoặc hàng loạt'
		},
		'hash-generator': {
			name: 'Tạo hash',
			description: 'MD5, SHA-1, SHA-256, SHA-512 và HMAC — tính ngay trong trình duyệt của bạn'
		},
		'color-converter': {
			name: 'Chuyển đổi màu',
			description: 'Chuyển màu giữa HEX, RGB, HSL và OKLCH với xem trước trực tiếp'
		},
		'case-converter': {
			name: 'Chuyển kiểu viết',
			description: 'Đổi qua lại giữa camelCase, snake_case, kebab-case, PascalCase và nhiều kiểu khác'
		},
		'word-counter': {
			name: 'Đếm từ',
			description: 'Đếm từ, ký tự, câu, byte và thời gian đọc ngay khi bạn gõ'
		},
		'lorem-ipsum-generator': {
			name: 'Tạo Lorem Ipsum',
			description: 'Tạo từ, câu hoặc đoạn văn giữ chỗ cho bản thiết kế'
		},
		'slug-generator': {
			name: 'Tạo slug',
			description: 'Biến tiêu đề thành slug URL gọn gàng với tùy chọn dấu phân tách và độ dài'
		},
		'sort-lines': {
			name: 'Sắp xếp & bỏ dòng trùng',
			description: 'Sắp xếp dòng theo bảng chữ cái hoặc thứ tự tự nhiên, bỏ dòng trùng và dòng trống'
		},
		'html-entities': {
			name: 'Mã hóa / giải mã thực thể HTML',
			description: 'Thoát ký tự cho HTML hoặc đổi thực thể kiểu &amp; về đúng ký tự'
		},
		'unicode-inspector': {
			name: 'Soi ký tự Unicode',
			description: 'Xem điểm mã, byte UTF-8/UTF-16 và chuỗi thoát của từng ký tự'
		},
		'cron-parser': {
			name: 'Phân tích biểu thức cron',
			description: 'Diễn giải mọi lịch cron bằng lời dễ hiểu kèm các lần chạy kế tiếp'
		},
		'password-generator': {
			name: 'Tạo mật khẩu',
			description: 'Mật khẩu ngẫu nhiên với tùy chọn bộ ký tự và thước đo entropy trung thực'
		},
		'qr-code-generator': {
			name: 'Tạo mã QR',
			description: 'Tạo mã QR sắc nét dạng SVG hoặc PNG — không watermark, không tải lên'
		},
		'qr-code-decoder': {
			name: 'Giải mã mã QR',
			description: 'Đọc mã QR từ hình ảnh hoặc camera — URL, WiFi và văn bản, hoàn toàn ngoại tuyến'
		},
		'json-to-yaml': {
			name: 'Chuyển đổi JSON ↔ YAML ↔ TOML',
			description: 'Chuyển qua lại giữa JSON, YAML và TOML với tự nhận diện định dạng'
		},
		'json-to-csv': {
			name: 'Chuyển đổi JSON ↔ CSV',
			description: 'Trải phẳng JSON thành CSV, hoặc đọc CSV về thành đối tượng JSON có kiểu'
		},
		'json-to-typescript': {
			name: 'JSON → kiểu TypeScript',
			description: 'Suy ra interface TypeScript từ một mẫu JSON ngay lập tức'
		},
		'jsonpath-tester': {
			name: 'Thử JSONPath',
			description: 'Truy vấn JSON bằng biểu thức JSONPath và xem mọi kết quả khớp kèm đường dẫn'
		},
		'bcrypt-generator': {
			name: 'Băm & kiểm tra bcrypt',
			description: 'Băm mật khẩu bằng bcrypt và đối chiếu chuỗi hash với văn bản thuần'
		},
		'user-agent-parser': {
			name: 'Phân tích User-Agent',
			description: 'Nhận diện trình duyệt, engine, hệ điều hành và thiết bị từ chuỗi User-Agent'
		},
		'sql-formatter': {
			name: 'Định dạng SQL',
			description: 'Định dạng SQL với từ khóa theo từng phương ngữ, hoặc nén về một dòng'
		},
		'xml-formatter': {
			name: 'Định dạng & kiểm tra XML',
			description: 'Trình bày đẹp, nén và kiểm tra XML với vị trí lỗi chính xác'
		},
		'xml-to-json': {
			name: 'Chuyển đổi XML ↔ JSON',
			description: 'Chuyển tài liệu XML sang JSON và ngược lại, kèm cả thuộc tính'
		},
		'markdown-to-html': {
			name: 'Chuyển đổi Markdown ↔ HTML',
			description: 'Kết xuất Markdown ra HTML với xem trước trực tiếp, hoặc đưa HTML về Markdown'
		},
		'html-formatter': {
			name: 'Định dạng & nén HTML',
			description: 'Làm gọn HTML lộn xộn hoặc nén lại để đưa lên production'
		},
		'css-formatter': {
			name: 'Định dạng & nén CSS',
			description: 'Làm đẹp CSS để dễ đọc hoặc nén lại trước khi phát hành'
		},
		'js-formatter': {
			name: 'Định dạng & nén JavaScript',
			description: 'Làm đẹp JavaScript hoặc nén thật sự kèm rút gọn tên biến'
		},
		'string-escape': {
			name: 'Thoát / bỏ thoát chuỗi',
			description: 'Thoát hoặc bỏ thoát chuỗi theo quy tắc JSON, JavaScript, Java, XML, SQL và CSV'
		},
		'number-base-converter': {
			name: 'Chuyển đổi hệ cơ số',
			description: 'Đổi số giữa nhị phân, bát phân, thập phân, thập lục phân và mọi cơ số tới 36'
		},
		'text-to-hex': {
			name: 'Chuyển đổi văn bản ↔ hex / nhị phân',
			description: 'Biến văn bản thành byte hex, nhị phân hay thập phân và giải mã ngược lại'
		},
		'json-schema-validator': {
			name: 'Kiểm tra & tạo JSON Schema',
			description: 'Đối chiếu JSON với schema, hoặc suy ra schema từ dữ liệu mẫu'
		},
		'exif-viewer': {
			name: 'Xem & xóa EXIF',
			description: 'Xem ảnh của bạn mang theo siêu dữ liệu gì — và xóa sạch mà không mã hóa lại'
		}
	}
};

export default vi;
