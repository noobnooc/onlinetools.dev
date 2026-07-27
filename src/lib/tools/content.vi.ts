import type { ToolContent } from './content';

/**
 * Vietnamese long-form tool copy (About + FAQ). Written entry by entry
 * against the English content.ts; anything missing falls back to English.
 */
const TOOL_CONTENT_VI: Record<string, ToolContent> = {
	'json-formatter': {
		about: [
			'Dán bất kỳ JSON nào — một phản hồi API, một tệp cấu hình, một dòng log — và công cụ này sẽ trình bày lại cho dễ đọc theo mức thụt lề bạn chọn, hoặc nén gọn để nhúng vào mã. Việc phân tích dùng chính bộ máy JSON có sẵn của trình duyệt, nên thứ gì hợp lệ ở đây cũng đúng là thứ JavaScript và mọi trình phân tích tuân thủ JSON sẽ chấp nhận.',
			'Khi dữ liệu vào không hợp lệ, lỗi được chú thích bằng đúng dòng và cột nơi việc phân tích thất bại, thay vì một câu “unexpected token” mơ hồ ở đâu đó. Kết hợp với trình soạn thảo chữ đều, việc truy tìm một dấu phẩy thiếu trong khối dữ liệu 500 dòng chỉ còn là chuyện mười giây. Bạn cũng có thể sắp xếp khóa của đối tượng theo bảng chữ cái, rất hữu ích trước khi đem hai khối dữ liệu ra so sánh.',
			'Việc định dạng chạy hoàn toàn trong trình duyệt của bạn. Những khối dữ liệu chứa token, hồ sơ khách hàng hay địa chỉ nội bộ không bao giờ rời khỏi máy bạn — chẳng có máy chủ nào để mà ghi lại chúng.'
		],
		faqs: [
			{
				q: 'JSON của tôi trông vẫn ổn, sao lại báo “Unexpected token”?',
				a: 'Thủ phạm quen thuộc là dấu phẩy thừa sau phần tử cuối, dùng nháy đơn thay vì nháy kép, khóa không đặt trong nháy, hoặc có chú thích. Tất cả đều chấp nhận được trong literal đối tượng của JavaScript (hay trong JSON5) nhưng không hợp lệ với JSON nghiêm ngặt. Chỉ báo dòng/cột trỏ vào ký tự sai đầu tiên.'
			},
			{
				q: 'Có giới hạn dung lượng không?',
				a: 'Không có giới hạn cứng — việc phân tích diễn ra cục bộ nên phụ thuộc vào máy bạn. Tài liệu cỡ vài chục megabyte vẫn định dạng tốt trên trình duyệt hiện đại; lớn hơn nữa thì tab có thể chậm lại vì toàn bộ tài liệu được giữ trong bộ nhớ.'
			},
			{
				q: 'Định dạng có làm thay đổi dữ liệu của tôi không?',
				a: 'Chỉ khoảng trắng, trừ khi bạn bật sắp xếp khóa. Các số được bộ máy JavaScript tuần tự hóa lại, nên 1e2 thành 100 và số nguyên vượt độ chính xác của IEEE-754 sẽ bị chuẩn hóa — đúng như bất kỳ chương trình JS nào đọc JSON của bạn cũng sẽ làm.'
			},
			{
				q: 'Tôi có thể kiểm tra JSON mà không định dạng lại không?',
				a: 'Được — huy hiệu trạng thái phía trên ô nhập cập nhật ngay khi bạn gõ, cho biết tài liệu có phân tích được không, dung lượng bao nhiêu và lỗi đầu tiên nằm ở đâu. Bạn chỉ cần bấm Định dạng khi thực sự muốn viết lại phần kết quả.'
			}
		]
	},

	'base64-decode': {
		about: [
			'Base64 biến các byte bất kỳ thành một bảng chữ cái 64 ký tự chịu được việc dán vào JSON, URL, header HTTP và email. Công cụ này chạy cả hai chiều: gõ hoặc dán văn bản để mã hóa, hoặc dán một khối đã mã hóa để lấy lại bản gốc. UTF-8 được xử lý đúng ở cả hai chiều, nên emoji và các hệ chữ ngoài Latinh đi vòng vẫn nguyên vẹn.',
			'Bộ giải mã cố tình dễ tính: nó chấp nhận bảng chữ cái an toàn cho URL (dùng - và _ thay cho + và /), loại bỏ khoảng trắng cùng ngắt dòng, và bù lại phần đệm bị thiếu trước khi giải mã — đúng ba thứ khiến các bộ giải mã khắt khe hơn hay từ chối những dữ liệu vốn hoàn toàn khôi phục được. Nếu các byte giải ra không phải văn bản UTF-8 hợp lệ, công cụ sẽ nói thẳng thay vì in ra một mớ ký tự lỗi; thường điều đó nghĩa là dữ liệu vốn ở dạng nhị phân, chẳng hạn một tấm ảnh.',
			'Mọi thứ diễn ra ngay trong trang. Giải mã một token hay thông tin đăng nhập ở đây không gửi nó đi đâu cả.'
		],
		faqs: [
			{
				q: 'Vì sao chuỗi Base64 của tôi kết thúc bằng dấu =?',
				a: 'Base64 mã hóa 3 byte thành 4 ký tự, nên khi độ dài đầu vào không chia hết cho 3, phần kết quả được đệm thêm dấu = để các nhóm vẫn thẳng hàng. Phần đệm không mang dữ liệu; bộ giải mã này tự khôi phục nếu nó đã bị cắt bỏ.'
			},
			{
				q: 'Base64 chuẩn và Base64 an toàn cho URL khác nhau thế nào?',
				a: 'Base64 chuẩn dùng + và /, vốn mang ý nghĩa đặc biệt trong URL và bản thân chúng lại phải được mã hóa tiếp. Biến thể an toàn cho URL (RFC 4648 §5) đổi chúng thành - và _ và thường bỏ luôn phần đệm. Ví dụ, JWT dùng dạng an toàn cho URL này. Bộ mã hóa ở đây cho bạn cả hai; bộ giải mã tự nhận cả hai.'
			},
			{
				q: 'Base64 có phải là mã hóa bảo mật không?',
				a: 'Không. Base64 là phép mã hóa thuận nghịch và không có khóa — ai cũng giải được. Nó bảo vệ dữ liệu khỏi hỏng hóc khi truyền, chứ không khỏi bị đọc. Nếu bạn cần tính bí mật, hãy mã hóa bằng mật mã trước rồi mới encode bản mã.'
			},
			{
				q: 'Vì sao kết quả giải mã báo không phải UTF-8 hợp lệ?',
				a: 'Chuỗi đã giải mã thành công, nhưng các byte thu được không phải văn bản — thường là một tệp PNG, PDF, hay dữ liệu đã nén/đã mã hóa. Đổ nội dung như vậy vào ô văn bản chỉ ra ký tự lỗi, nên công cụ báo rõ thay vì hiển thị.'
			}
		]
	},

	'timestamp-converter': {
		about: [
			'Thời gian Unix đếm số giây kể từ 1970-01-01T00:00:00 UTC, và nó xuất hiện khắp nơi: hàng trong cơ sở dữ liệu, các claim của JWT, tệp log, phản hồi API. Công cụ này nhận dấu thời gian tính theo giây hoặc mili giây — nó tự đoán đơn vị dựa trên độ lớn — cũng như chuỗi ISO 8601 và hầu hết các định dạng ngày viết cho người đọc, rồi hiển thị mọi cách biểu diễn cùng lúc: ISO, UTC, giờ địa phương của bạn, thời gian tương đối, và cả hai độ chính xác Unix.',
			'Cái bẫy kinh điển nằm ở chỗ nhập nhằng đơn vị: 1700000000 là tháng 11 năm 2023 nếu tính bằng giây, nhưng lại là tháng 1 năm 1970 nếu tính bằng mili giây. Đơn vị được nhận diện luôn hiển thị rõ ràng, và bạn có thể ghi đè bằng một cú nhấp khi máy đoán sai — khỏi phải nhẩm đếm chữ số nữa.',
			'Việc chuyển đổi diễn ra tức thì và ngay tại máy, còn đồng hồ thời gian hiện tại vẫn chạy, nên trang này kiêm luôn vai trò đồng hồ epoch trong lúc bạn làm việc.'
		],
		faqs: [
			{
				q: 'Công cụ phân biệt giây và mili giây bằng cách nào?',
				a: 'Bằng độ lớn: giá trị từ 11 chữ số trở lên được coi là mili giây, ngắn hơn thì coi là giây. Cách này ánh xạ giây tới tận khoảng năm 5138 và mili giây từ khoảng năm 1973 trở đi, đủ để xử lý dứt khoát mọi dấu thời gian hiện đại trong thực tế. Với các trường hợp biên, bạn có thể đổi đơn vị thủ công.'
			},
			{
				q: 'Sau năm 2038 thì sao?',
				a: 'Vấn đề năm 2038 chỉ ảnh hưởng tới các hệ thống lưu thời gian Unix trong số nguyên có dấu 32 bit. Số trong JavaScript là số thực dấu phẩy động 64 bit, nên công cụ này xử lý được những mốc xa hơn 2038 rất nhiều — tới tận năm 275760, giới hạn của kiểu Date trong JavaScript.'
			},
			{
				q: 'Tôi có thể đổi ngược từ ngày sang dấu thời gian không?',
				a: 'Có. Hãy dán một chuỗi ISO 8601 như 2026-07-20T12:00:00Z, hoặc hầu hết các định dạng ngày thông dụng, rồi số giây và mili giây Unix sẽ hiện ra cạnh những cách biểu diễn còn lại.'
			},
			{
				q: 'Dòng giờ địa phương dùng múi giờ nào?',
				a: 'Múi giờ được cấu hình trong trình duyệt của bạn, lấy qua API Intl — không có tra cứu nào từ xa. Tên múi giờ được in ngay cạnh giá trị, nên ảnh chụp màn hình vẫn rõ ràng không mập mờ.'
			}
		]
	},

	'jwt-decoder': {
		about: [
			'Một JSON Web Token gồm ba đoạn Base64URL — header, payload, chữ ký — nối với nhau bằng dấu chấm. Công cụ này tách token ra, hiển thị header và payload dưới dạng JSON đã định dạng, đổi các claim thời gian chuẩn (iat, exp, nbf) thành ngày giờ dễ đọc, và cho bạn biết ngay token đã hết hạn hay chưa.',
			'Giải mã không phải là xác minh: payload của bất kỳ JWT nào cũng đọc được bởi bất cứ ai đang giữ nó, vì Base64URL là phép mã hóa dạng biểu diễn chứ không phải mật mã. Đó cũng là lý do dán token vào một trang web bất kỳ thường là ý tưởng tồi — trang này là ngoại lệ, vì việc giải mã diễn ra hoàn toàn trong trình duyệt của bạn và token không bao giờ được truyền đi. Việc xác minh chữ ký bằng khóa bí mật hay khóa công khai được cố ý để ngoài phạm vi của bộ giải mã ngoại tuyến này.',
			'Tiền tố “Bearer ” ở đầu sẽ tự động bị cắt bỏ, nên bạn có thể dán thẳng từ một header Authorization.'
		],
		faqs: [
			{
				q: 'Dán token của môi trường production vào đây có an toàn không?',
				a: 'Token ở lại trong trình duyệt của bạn — trang này không thực hiện bất kỳ yêu cầu mạng nào với dữ liệu bạn nhập, và bạn có thể tự xác nhận điều đó ở tab Network trong DevTools. Dù vậy, hãy tập thói quen coi token đang hoạt động như mật khẩu: khi chia sẻ ảnh chụp màn hình, hãy dùng token đã hết hạn hoặc token thử nghiệm.'
			},
			{
				q: 'Vì sao token của tôi không giải mã được?',
				a: 'Hãy kiểm tra xem nó có đúng ba đoạn ngăn cách bằng dấu chấm và có bị chèn ngắt dòng khi sao chép hay không. Các access token dạng đục (chẳng hạn nhiều token của GitHub hay Google) vốn không phải JWT — không phép giải mã nào mở được một chuỗi ngẫu nhiên chưa từng chứa JSON.'
			},
			{
				q: 'iat, exp và nbf nghĩa là gì?',
				a: 'Đó là các claim chuẩn theo RFC 7519, tất cả tính bằng giây Unix: iat là lúc token được phát hành, exp là lúc nó hết hiệu lực, còn nbf (“not before”) là thời điểm sớm nhất token được phép chấp nhận. Công cụ này đổi từng giá trị thành ngày giờ dễ đọc và đối chiếu exp với đồng hồ máy bạn.'
			},
			{
				q: 'Công cụ này có xác minh chữ ký được không?',
				a: 'Không — và dù sao thì một dấu tích xanh từ công cụ trực tuyến cũng không nên được tin cậy cho các quyết định bảo mật. Hãy xác minh chữ ký ở backend của bạn bằng một thư viện còn được bảo trì (jose, jsonwebtoken, PyJWT) với đúng khóa của bên phát hành.'
			}
		]
	},

	'regex-tester': {
		about: [
			'Viết một mẫu, dán văn bản thử vào, và mọi chỗ khớp được tô sáng ngay khi bạn gõ — kèm nhóm bắt, nhóm đặt tên và vị trí khớp liệt kê ngay bên dưới. Công cụ dùng chính bộ máy RegExp của JavaScript, nên hành vi khớp đúng y như trên Node.js và các trình duyệt, kể cả lookbehind, nhóm đặt tên và escape thuộc tính Unicode.',
			'Các cờ được bật tắt theo từng chữ cái (g, i, m, s, u, y, d) và mẫu được biên dịch lại sau mỗi phím gõ; lỗi cú pháp hiện ra ngay với chính thông báo của bộ máy, không phải chờ tới lúc bạn bấm nút. Những mẫu khớp rỗng như a* được xử lý an toàn, và số kết quả bị chặn ở 10.000 để một dấu .* đi lạc không làm treo tab.',
			'Các phương ngữ regex khác nhau tùy bộ máy — một mẫu chạy tốt ở đây có thể phải chỉnh lại cho PCRE, RE2 hay module re của Python, chủ yếu quanh chuyện hỗ trợ lookbehind, lượng từ chiếm hữu và cờ đặt ngay trong mẫu.'
		],
		faqs: [
			{
				q: 'Công cụ này dùng phương ngữ regex nào?',
				a: 'ECMAScript (JavaScript), đúng như bản cài đặt trong trình duyệt của bạn. Nó hỗ trợ lookahead, lookbehind, nhóm bắt đặt tên, tham chiếu ngược và escape thuộc tính Unicode như \\p{Letter} (khi bật cờ u). Nó không hỗ trợ cú pháp riêng của PCRE như lượng từ chiếm hữu hay đệ quy.'
			},
			{
				q: 'Vì sao mẫu của tôi khớp mọi thứ / chẳng khớp gì?',
				a: 'Hai nguyên nhân kinh điển: một ký tự đặc biệt chưa được thoát (dấu . khớp với mọi ký tự — muốn dấu chấm thật thì viết \\.), hoặc quên mất cờ g trong đầu — công cụ này luôn tìm hết mọi kết quả, nhưng mã của bạn sẽ chỉ tìm được kết quả đầu tiên nếu không đặt g.'
			},
			{
				q: 'Nhóm bắt đặt tên là gì?',
				a: 'Cú pháp (?<tên>...) gắn nhãn cho một nhóm để bạn đọc kết quả theo tên thay vì theo vị trí: match.groups.tên trong JavaScript. Bảng nhóm bên dưới danh sách kết quả hiển thị cả nhóm đánh số lẫn nhóm đặt tên cho từng chỗ khớp.'
			},
			{
				q: 'Một regex viết ở đây có chạy nguyên vẹn trong Python hay Go không?',
				a: 'Thường là được, nhưng không phải luôn luôn. Lớp ký tự, lượng từ và ký tự neo thì dùng chung được; còn lookbehind, cú pháp nhóm đặt tên (Python dùng (?P<tên>...)) và cờ đặt trong mẫu thì khác nhau. Bộ máy RE2 của Go còn từ chối hoàn toàn tham chiếu ngược và các dạng lookaround.'
			}
		]
	},

	'diff-checker': {
		about: [
			'Dán văn bản gốc vào bên trái, bản đã sửa vào bên phải, và nhận về một bản so sánh gộp theo từng dòng: phần xóa tô đỏ, phần thêm tô xanh, phần ngữ cảnh giữ nguyên ở giữa, kèm số dòng gốc ở cả hai bên. Đây là cách nhanh nhất để trả lời câu hỏi “rốt cuộc đã đổi cái gì?” giữa hai tệp cấu hình, hai phản hồi API, hay hai phiên bản của một đoạn mã ai đó dán trong nhóm chat.',
			'Phép so sánh dùng thuật toán dãy con chung dài nhất trên các dòng, cùng họ với thuật toán đứng sau git diff, nên các khối bị đảo chỗ và những sửa đổi nhỏ cho ra kết quả dễ đọc thay vì đánh dấu mọi thứ là đã thay đổi. Một dòng tóm tắt cộng tổng số dòng thêm và dòng bị xóa.',
			'Vì cả hai văn bản đều ở lại trong trang, việc so sánh tài liệu nhạy cảm — hợp đồng, thông tin đăng nhập nằm trong cấu hình, nội dung chưa công bố — không mang chút rủi ro nào như khi dán chúng vào một dịch vụ web bất kỳ.'
		],
		faqs: [
			{
				q: 'Công cụ so sánh theo từ hay theo dòng?',
				a: 'Theo dòng. Mỗi dòng được so sánh như một đơn vị, đúng với cách lập trình viên đọc diff của mã và cấu hình. Vì vậy một dòng bị sửa sẽ hiện thành một dòng xóa cộng một dòng thêm; việc tô sáng khác biệt ở mức ký tự nằm trong kế hoạch.'
			},
			{
				q: 'Vì sao bản so sánh của tôi hiện mọi dòng đều thay đổi?',
				a: 'Thường là do những khác biệt vô hình: một bên dùng tab còn bên kia dùng dấu cách, ký tự xuống dòng CRLF của Windows so với LF của Unix, hoặc khoảng trắng thừa ở cuối dòng. Chuẩn hóa khoảng trắng trước khi so sánh (với dữ liệu JSON thì công cụ định dạng JSON kèm sắp xếp khóa sẽ giúp) sẽ làm lộ ra những thay đổi thật.'
			},
			{
				q: 'Tôi có thể so sánh hai phản hồi JSON một cách có ý nghĩa không?',
				a: 'Được — hãy đưa cả hai qua công cụ định dạng JSON với tùy chọn sắp xếp khóa bật lên trước, để hai tài liệu tương đương được tuần tự hóa giống hệt nhau. Khi đó bản so sánh sẽ cho thấy thay đổi giá trị thật sự thay vì nhiễu do thứ tự khóa.'
			},
			{
				q: 'Có giới hạn kích thước văn bản không?',
				a: 'Thuật toán đối chiếu từng dòng của văn bản này với từng dòng của văn bản kia, nên những tệp cực lớn (hàng chục nghìn dòng ở cả hai bên) có thể mất một lúc. Các tệp mã và dữ liệu API thông thường thì so sánh xong ngay lập tức.'
			}
		]
	},

	'url-encode-decode': {
		about: [
			'Những ký tự như dấu cách, dấu và, hay chữ cái ngoài ASCII không thể xuất hiện nguyên dạng trong URL, nên chúng được mã hóa phần trăm: dấu cách thành %20, còn 你 thành %E4%BD%A0. Công cụ này mã hóa văn bản để đưa an toàn vào URL và giải mã các chuỗi thoát phần trăm trở lại thành chữ đọc được, kể cả quy ước dùng dấu + thay cho dấu cách trong chuỗi truy vấn.',
			'Có hai chế độ mã hóa vì bản thân JavaScript cũng có hai: chế độ thành phần (encodeURIComponent) thoát mọi ký tự có thể cắt ngang URL, đúng thứ bạn cần cho một giá trị đơn lẻ trong chuỗi truy vấn; chế độ URI đầy đủ (encodeURI) giữ nguyên các ký tự cấu trúc như /, ? và &, dành cho khi bạn mã hóa nguyên một URL mà nó vẫn phải bấm vào được.',
			'Việc giải mã rất nghiêm với các chuỗi % hỏng — một dấu % đứng lẻ hay %ZZ sẽ bị báo lỗi thay vì lặng lẽ cho qua, đúng như cách trình duyệt và máy chủ sẽ đối xử với nó.'
		],
		faqs: [
			{
				q: 'Khi nào dùng chế độ thành phần, khi nào dùng chế độ URI đầy đủ?',
				a: 'Mã hóa một giá trị nằm bên trong URL (từ khóa tìm kiếm, địa chỉ chuyển hướng, email trong tham số) → chế độ thành phần, để dấu & và = bên trong giá trị không phá vỡ chuỗi truy vấn. Mã hóa cả một URL hoàn chỉnh để hiển thị hoặc gửi đi → chế độ URI đầy đủ, để cấu trúc URL còn nguyên.'
			},
			{
				q: 'Vì sao đôi khi dấu + lại có nghĩa là dấu cách?',
				a: 'Định dạng application/x-www-form-urlencoded — dùng khi gửi biểu mẫu HTML và trong chuỗi truy vấn — theo truyền thống mã hóa dấu cách thành +. Còn trong phần đường dẫn của URL, + chỉ là dấu cộng. Bộ giải mã ở đây coi + là dấu cách, theo đúng ngữ nghĩa chuỗi truy vấn; riêng %20 thì lúc nào cũng đúng ở mọi nơi.'
			},
			{
				q: 'Vì sao chuỗi của tôi bị mã hóa hai lần (%2520)?',
				a: '%25 chính là mã của ký tự %, nên %2520 nghĩa là đoạn %20 đã bị mã hóa thêm một lần nữa. Chuyện này xảy ra khi hai tầng trong hệ thống cùng mã hóa. Hãy giải mã hai lần ở đây để bóc ra, rồi sửa cái tầng lẽ ra không nên mã hóa.'
			},
			{
				q: 'Ký tự Unicode có được xử lý đúng không?',
				a: 'Có — theo chuẩn URL của WHATWG, văn bản được mã hóa sang UTF-8 trước rồi từng byte mới được thoát phần trăm. Đó là lý do một ký tự CJK biến thành ba nhóm %XX.'
			}
		]
	},

	'url-parser': {
		about: [
			'Dán một URL vào và xem nó được mổ xẻ: giao thức, host, cổng, đường dẫn, fragment, cùng mọi tham số truy vấn hiện ra dưới dạng bảng khóa–giá trị đã giải mã. Công cụ dùng đúng bộ phân tích URL theo chuẩn WHATWG mà trình duyệt của bạn dùng khi điều hướng, nên cách hiểu bạn thấy chính là cách trình duyệt sẽ thực sự áp dụng — kể cả các trường hợp biên như bỏ cổng mặc định và chuẩn hóa đường dẫn.',
			'Bảng tham số truy vấn là phần bạn sẽ dùng nhiều nhất: những chuỗi chuyển hướng OAuth dài dằng dặc, các liên kết gắn thẻ đo lường và lệnh gọi API bỗng đọc được chỉ trong một cái liếc, mỗi giá trị đều đã được giải mã phần trăm sẵn. Tên miền trần không kèm giao thức cũng được chấp nhận; khi phân tích, https:// sẽ được ngầm hiểu.',
			'Nó ăn ý tự nhiên với công cụ mã hóa URL — phân tích một URL ở đây để tìm đúng tham số bạn cần, sửa giá trị, rồi mã hóa lại ở bên kia.'
		],
		faqs: [
			{
				q: 'Vì sao URL sau khi phân tích hơi khác với cái tôi đã dán?',
				a: 'Bộ phân tích theo chuẩn WHATWG có chuẩn hóa: nó đưa giao thức và host về chữ thường, bỏ cổng mặc định (:443 với https), rút gọn các đoạn ./ và ../ trong đường dẫn, và mã hóa những ký tự cần mã hóa. Thứ bạn thấy là dạng chuẩn tắc mà máy chủ và trình duyệt đều thống nhất.'
			},
			{
				q: 'Nó xử lý được URL có khóa truy vấn trùng nhau không?',
				a: 'Được — mỗi lần xuất hiện đều được liệt kê thành một hàng riêng, đúng thứ tự. Khóa trùng là hợp lệ và rất phổ biến: nhiều API đọc chúng thành mảng (?tag=a&tag=b).'
			},
			{
				q: 'host và hostname khác nhau ở chỗ nào?',
				a: 'hostname chỉ là tên miền (example.com); còn host bao gồm cả cổng được ghi rõ khi nó không phải cổng mặc định (example.com:8080). Khi cổng đúng bằng mặc định của giao thức, hai giá trị trông y hệt nhau vì phần cổng bị lược đi.'
			},
			{
				q: 'Phần fragment (#...) có được gửi tới máy chủ không?',
				a: 'Không. Mọi thứ sau dấu # ở lại trong trình duyệt — máy chủ không bao giờ thấy. Đó là lý do các ứng dụng một trang ngày trước dùng nó để định tuyến phía client, và cũng là lý do những tham số đo lường đặt sau dấu # thì backend không nhìn thấy.'
			}
		]
	},

	'uuid-generator': {
		about: [
			'Tạo định danh duy nhất toàn cục theo bốn kiểu: UUID v4 (ngẫu nhiên hoàn toàn, lựa chọn mặc định hằng ngày), UUID v7 (sắp theo thời gian, lựa chọn hiện đại cho khóa cơ sở dữ liệu), ULID (sắp theo thời gian, viết gọn bằng Crockford Base32) và Nano ID (ngắn, thân thiện với URL). Tạo một cái hoặc tới cả nghìn cái một lúc — mỗi dòng một cái, sẵn sàng dán vào script tạo dữ liệu mẫu.',
			'Tính ngẫu nhiên đến từ Web Crypto API (crypto.getRandomValues), nguồn an toàn về mặt mật mã, chứ không phải Math.random. Việc tạo diễn ra cục bộ, nghĩa là không ai khác biết các ID đó, chúng không được ghi lại ở đâu và vẫn tạo được khi ngoại tuyến.',
			'Nếu bạn đang chọn định dạng ID cho một hệ thống mới: v7 và ULID sắp xếp theo thời điểm tạo, giúp chỉ mục B-tree dễ chịu và làm các ID trong log xấp xỉ theo trình tự thời gian; còn v4 chẳng tiết lộ gì về thời điểm tạo, mà đôi khi đó lại đúng là điều bạn muốn.'
		],
		faqs: [
			{
				q: 'UUID v4 và v7 khác nhau thế nào?',
				a: 'v4 là 122 bit ngẫu nhiên. v7 (RFC 9562) mở đầu bằng dấu thời gian 48 bit tính theo mili giây Unix rồi mới tới các bit ngẫu nhiên, nên ID tạo sau sẽ sắp sau. Với khóa chính trong cơ sở dữ liệu, v7 thường cải thiện tính cục bộ khi chèn và kích thước chỉ mục; còn v4 vẫn ổn ở nơi thứ tự không quan trọng hoặc thời điểm tạo không được lộ.'
			},
			{
				q: 'Hai UUID được tạo ra có thể trùng nhau không?',
				a: 'Với 122 bit ngẫu nhiên, xác suất nhỏ tới mức không đáng phải thiết kế đề phòng: bạn sẽ phải tạo hàng tỷ ID mỗi giây suốt nhiều thập kỷ mới chạm tới một khả năng xa vời. Trùng lặp trong thực tế đến từ lỗi lập trình (dùng lại seed, sao chép hàng dữ liệu) chứ không phải từ tính ngẫu nhiên.'
			},
			{
				q: 'Khi nào nên chọn ULID thay vì UUID v7?',
				a: 'Cả hai giải quyết cùng một bài toán. ULID gồm 26 ký tự Crockford Base32 không phân biệt hoa thường — ngắn và sạch hơn khi nằm trong URL và log — trong khi v7 giữ nguyên hình dạng UUID 36 ký tự chuẩn mà mọi cơ sở dữ liệu và thư viện đều đã chấp nhận. Hãy chọn cái mà hệ sinh thái của bạn hỗ trợ tự nhiên hơn.'
			},
			{
				q: 'Dùng các ID này làm khóa bí mật hay token có an toàn không?',
				a: 'Tính ngẫu nhiên thì an toàn về mặt mật mã, nhưng ID thường được hiển thị, ghi log và lập chỉ mục — tức là được đối xử như dữ liệu công khai. Với token phiên hay khóa API, hãy tạo riêng một chuỗi bí mật ít nhất 128 bit ngẫu nhiên và đối xử với nó như mật khẩu.'
			}
		]
	},

	'hash-generator': {
		about: [
			'Tính các bản tóm lược MD5, SHA-1, SHA-256, SHA-384 và SHA-512 của bất kỳ văn bản nào, cùng chữ ký HMAC có khóa, ngay trong trình duyệt. Họ SHA và HMAC dùng Web Crypto API — chính những khối mật mã đã được kiểm định mà trình duyệt bạn dùng cho TLS — còn MD5 (thứ Web Crypto cố ý bỏ qua) đi kèm dưới dạng một bản cài đặt cục bộ nhỏ gọn để phục vụ các checksum kiểu cũ.',
			'Các giá trị hash cập nhật trực tiếp khi bạn gõ, và mọi thuật toán đều được tính cùng lúc, nên việc đối chiếu một giá trị với checksum theo bất kỳ thuật toán nào mà trang tải xuống chọn cũng chẳng cần thiết lập gì. Chế độ HMAC bổ sung ô nhập khóa bí mật để xác minh chữ ký webhook — GitHub, Stripe và hầu hết nhà cung cấp webhook đều ký dữ liệu bằng HMAC-SHA256.',
			'Vì dữ liệu bạn nhập không bao giờ rời khỏi trang, bạn có thể yên tâm băm những thứ vốn không nên dán vào dịch vụ trực tuyến: payload API, mật khẩu đang đối chiếu với danh sách hash bị rò rỉ, tài liệu nội bộ.'
		],
		faqs: [
			{
				q: 'Tôi nên dùng thuật toán băm nào?',
				a: 'Với bất cứ việc gì liên quan tới bảo mật ngày nay: SHA-256 trở lên. MD5 và SHA-1 đã bị phá về khả năng chống va chạm — người ta có thể dựng ra hai đầu vào khác nhau cho cùng một giá trị băm — nên chúng chỉ còn sống sót ở các checksum không có kẻ tấn công và trong tương thích giao thức cũ.'
			},
			{
				q: 'Vậy sao vẫn còn cung cấp MD5?',
				a: 'Vì bạn vẫn gặp nó: ETag, khóa cache, tệp kê khai, những cột cũ trong cơ sở dữ liệu. Muốn đối chiếu các giá trị ấy thì vẫn phải tính MD5, bất kể tình trạng mật mã của nó ra sao. Chỉ là đừng thiết kế thứ gì mới dựa trên nó.'
			},
			{
				q: 'HMAC là gì và khác gì hash thường?',
				a: 'HMAC trộn một khóa bí mật vào quá trình băm, nên chỉ người giữ khóa mới tạo hoặc kiểm chứng được bản tóm lược. Hash thường chứng minh tính toàn vẹn (“dữ liệu này không bị sửa”); HMAC chứng minh thêm tính xác thực (“người có khóa đã tạo ra nó”). Ứng dụng hằng ngày chính là xác minh chữ ký webhook.'
			},
			{
				q: 'Băm có giống với mã hóa mật khẩu không?',
				a: 'Không, và những hàm băm nhanh như SHA-256 là công cụ sai để lưu mật khẩu — kẻ tấn công có thể thử hàng tỷ lần mỗi giây. Việc lưu mật khẩu cần một thuật toán cố ý làm chậm và có salt: bcrypt, scrypt hoặc Argon2.'
			}
		]
	},

	'case-converter': {
		about: [
			'Các định danh liên tục đi qua lại giữa những quy ước khác nhau: API trả về snake_case, TypeScript của bạn muốn camelCase, lớp CSS cần kebab-case, còn biến môi trường thì đòi CONSTANT_CASE. Công cụ này nhận mọi kiểu đầu vào lẫn lộn — dấu cách, gạch dưới, gạch ngang, camelCase có sẵn — tách thành từ một cách thông minh, rồi ghép lại theo cả chín kiểu đích cùng lúc.',
			'Bộ tách hiểu cả những ca khó: nó cắt “getUserByID” thành get/user/by/id (giữ nguyên từ viết tắt cho tới ranh giới), coi chữ số là một phần của từ chứa nó, và xử lý từng dòng độc lập, nên bạn có thể dán nguyên một cột tên trường trong cơ sở dữ liệu và chuyển đổi một lượt.',
			'Mọi kiểu viết đều hiển thị đồng thời kèm nút sao chép cho từng hàng — không phải chọn chế độ trước, chỉ cần dán rồi lấy đúng cái bạn cần.'
		],
		faqs: [
			{
				q: 'Những từ viết tắt như “HTTPResponse” được xử lý ra sao?',
				a: 'Một chuỗi chữ hoa liền nhau theo sau bởi một chữ thường sẽ bị tách ngay trước chữ hoa cuối: HTTPResponse → http + response. Cách này khớp với kỳ vọng của phần lớn quy ước viết mã, dù không bộ tách nào đoán đúng ý người viết hoàn hảo — ca biên như “IOError” sẽ thành io + error.'
			},
			{
				q: 'Tôi có thể chuyển đổi nhiều định danh cùng lúc không?',
				a: 'Được — mỗi dòng được chuyển đổi độc lập. Hãy dán danh sách tên cột, mỗi dòng một tên, và phần kết quả sẽ giữ nguyên cấu trúc dòng theo kiểu viết mới.'
			},
			{
				q: 'Ở đây Title Case và Sentence case khác nhau thế nào?',
				a: 'Title Case viết hoa mọi từ (“User Account Id”); Sentence case chỉ viết hoa từ đầu tiên (“User account id”). Cả hai đều không áp dụng những quy tắc biên tập về mạo từ và giới từ — với định danh thì gần như bạn chẳng bao giờ muốn điều đó.'
			},
			{
				q: 'Vì sao chuyển tới rồi chuyển lui không phải lúc nào cũng ra đúng bản gốc?',
				a: 'Việc tách thành từ làm mất thông tin — “user_ID_2” và “userId2” tách ra giống hệt nhau. Chiều chuyển đổi xuôi thì luôn xác định, nhưng cách viết ranh giới từ ban đầu không phải lúc nào cũng dựng lại được theo chiều ngược.'
			}
		]
	},

	'word-counter': {
		about: [
			'Một bộ đếm từ và ký tự chạy trực tiếp, cho ra đúng những con số mà lập trình viên và người viết thực sự cần: số từ, số ký tự tính cả dấu cách và không tính dấu cách, số byte UTF-8 (thứ mà cột cơ sở dữ liệu hay giới hạn API của bạn thật sự đo), số dòng, số câu, số đoạn, cùng thời gian đọc ước tính ở mức thông thường 220 từ mỗi phút.',
			'Ký tự được đếm theo điểm mã Unicode chứ không phải đơn vị UTF-16, nên emoji và chữ CJK được đếm đúng như con người vẫn hình dung — còn con số byte tách riêng làm lộ ra khác biệt: 日本語 là 3 ký tự nhưng lại là 9 byte. Chính sự phân biệt đó khiến bạn đau đầu khi một cột VARCHAR(255) từ chối chuỗi dài 200 “ký tự”.',
			'Mọi con số cập nhật ngay khi bạn gõ, và không có gì được gửi đi đâu cả — an toàn để đếm bản nháp thông cáo, hợp đồng, hay bất cứ thứ gì chưa sẵn sàng ra mắt.'
		],
		faqs: [
			{
				q: 'Vì sao số ký tự và số byte lại khác nhau?',
				a: 'Ký tự là điểm mã Unicode; byte là dạng mã hóa UTF-8 của chúng. Chữ cái ASCII mỗi chữ 1 byte, hầu hết chữ châu Âu có dấu 2 byte, ký tự CJK 3 byte, còn emoji 4 byte (hoặc hơn nếu là chuỗi ghép). Giới hạn cơ sở dữ liệu, header HTTP và nhiều API đo bằng byte chứ không phải ký tự.'
			},
			{
				q: 'Với các ngôn ngữ không dùng dấu cách thì đếm từ thế nào?',
				a: 'Việc đếm từ tách theo khoảng trắng, nên sẽ đếm thiếu với văn bản không phân tách như tiếng Trung hay tiếng Nhật. Với những ngôn ngữ đó, số ký tự mới là chỉ số có ý nghĩa hơn — đó là lý do cả hai luôn được hiển thị.'
			},
			{
				q: 'Thế nào thì được tính là một câu?',
				a: 'Một đoạn văn bản kết thúc bằng dấu ., !, ? hoặc … rồi theo sau là khoảng trắng hoặc hết dữ liệu. Các cách viết tắt kiểu “v.d.” có thể làm con số nhích lên đôi chút — việc đếm câu vốn dĩ chỉ mang tính ước lệ.'
			},
			{
				q: 'Thời gian đọc chính xác đến đâu?',
				a: 'Nó lấy số từ chia cho 220 từ/phút, mức trung bình phổ biến khi người lớn đọc thầm văn xuôi thông thường. Tài liệu kỹ thuật có kèm mã đọc chậm hơn; các bài dạng danh sách để lướt thì đọc nhanh hơn. Hãy xem đây là ước lượng theo bậc độ lớn.'
			}
		]
	},

	'lorem-ipsum-generator': {
		about: [
			'Văn bản giữ chỗ cho bố cục, bản mockup và dữ liệu mẫu, được tạo ngay trong trình duyệt của bạn: chọn từ, câu hay đoạn, đặt số lượng, rồi sao chép. Phần kết quả lấy từ vốn từ Cicero bị xáo trộn quen thuộc, nên trông như văn xuôi tựa tiếng Latinh tự nhiên mà không tạo thành những câu đọc được gây xao nhãng.',
			'Mặc định, đoạn văn mở đầu bằng câu truyền thống “Lorem ipsum dolor sit amet” — cụm từ mà nhà thiết kế và người duyệt nhận ra ngay là chỗ giữ tạm — và bạn có thể tắt nó đi để có kết quả ngẫu nhiên hoàn toàn khi cần nhiều khối khác biệt nhau.',
			'Độ dài câu và kích thước đoạn thay đổi ngẫu nhiên trong khoảng thực tế, nên văn bản tạo ra có nhịp thị giác của nội dung thật — điều này quan trọng khi bạn đánh giá kiểu chữ hay cách ngắt dòng, vì những câu dài bằng nhau trông rất giả.'
		],
		faqs: [
			{
				q: 'Lorem ipsum bắt nguồn từ đâu?',
				a: 'Đó là những mảnh chữ bị xáo trộn từ tác phẩm “De finibus bonorum et malorum” của Cicero (năm 45 TCN), được thợ sắp chữ dùng làm văn bản chèn ít nhất từ thập niên 1960 và trở nên phổ biến nhờ các bản chữ dán Letraset rồi sau đó là phần mềm chế bản điện tử.'
			},
			{
				q: 'Vì sao dùng lorem ipsum thay cho văn bản thật?',
				a: 'Nội dung đọc được sẽ cướp mất sự chú ý — người duyệt bắt đầu sửa câu chữ thay vì đánh giá bố cục. Thứ tiếng Latinh giả có tần suất chữ cái và độ dài từ tự nhiên nhưng lại không đọc được, nhờ vậy sự tập trung vẫn nằm ở thiết kế.'
			},
			{
				q: 'Văn bản tạo ra có luôn giống nhau không?',
				a: 'Không — từ ngữ được bốc ngẫu nhiên mỗi lần, nên hai lần tạo sẽ khác nhau. Chỉ có câu mở đầu kinh điển (nếu bật) là cố định.'
			},
			{
				q: 'Tôi có tạo được đúng số từ cho giới hạn của một trường trong CMS không?',
				a: 'Được — hãy đặt đơn vị là từ và nhập chính xác số bạn cần, tối đa 1000 mỗi lần. Kết hợp với công cụ đếm từ để đối chiếu với giới hạn theo ký tự hoặc byte.'
			}
		]
	},

	'slug-generator': {
		about: [
			'Biến mọi tiêu đề thành một slug sẵn sàng cho URL: chữ thường, ngăn cách bằng gạch ngang, bỏ hết dấu câu, các chữ có dấu được chuyển tự về ASCII thuần — “Crème brûlée à Paris” trở thành “creme-brulee-a-paris”. Các tùy chọn bao quát những biến thể thường gặp: dùng gạch dưới làm dấu phân tách, giữ nguyên hoa thường, và một độ dài tối đa cắt ở ranh giới từ thay vì cắt ngang chữ.',
			'Slug quan trọng với cả con người lẫn công cụ tìm kiếm: nó đọc được ngay trên thanh địa chỉ, sống sót khi dán vào khung chat mà không bị mã hóa phần trăm, và cho kết quả tìm kiếm một URL có chứa từ khóa. Bước chuyển tự chính là thứ mà đa số hàm slugify tự viết bỏ qua — thiếu nó, những tiêu đề có dấu hoặc làm hỏng URL hoặc biến mất sạch.',
			'Mỗi dòng được chuyển thành slug độc lập, nên một danh sách tiêu đề bài viết dán vào sẽ thành danh sách slug tương ứng chỉ trong một thao tác.'
		],
		faqs: [
			{
				q: 'Vì sao dùng gạch ngang thay vì gạch dưới?',
				a: 'Công cụ tìm kiếm coi gạch ngang là dấu ngăn từ, còn gạch dưới thì trước nay bị coi là dấu nối từ; thêm nữa gạch ngang nhìn rõ hơn trong đoạn liên kết có gạch chân. Gạch dưới thì vẫn phổ biến với tên tệp và định danh, nên cả hai đều được hỗ trợ.'
			},
			{
				q: 'Các hệ chữ ngoài Latinh như tiếng Trung hay Kirin thì sao?',
				a: 'Những ký tự có tương đương ASCII (chữ Latinh có dấu, vài chữ đặc biệt như ß → ss) sẽ được chuyển tự; các hệ chữ không có ánh xạ Latinh đơn giản sẽ bị loại bỏ. Với nội dung ngoài Latinh, cách làm phổ biến là hoặc giữ nguyên chữ bản địa ở dạng mã hóa phần trăm trong URL, hoặc tự viết một slug phiên âm.'
			},
			{
				q: 'Có độ dài slug lý tưởng không?',
				a: 'Ngắn thì tiện chia sẻ và hiển thị hơn, nhưng không có ngưỡng nào làm sụt thứ hạng. Tùy chọn độ dài tối đa sẽ cắt ở ranh giới từ — hữu ích với các CMS giới hạn cột slug ở mức 50–80 ký tự.'
			},
			{
				q: 'Tiêu đề đổi thì slug có nên đổi theo không?',
				a: 'Sau khi đã xuất bản thì tốt nhất là không — URL là địa chỉ mà người khác đã trỏ liên kết tới. Phần lớn trang web giữ nguyên slug gốc hoặc thêm một chuyển hướng. Hãy tạo slug ngay lúc khởi tạo bài và coi việc đổi tên là một quyết định chuyển hướng có chủ đích.'
			}
		]
	},

	'sort-lines': {
		about: [
			'Một bàn làm việc chuyên xử lý dòng: dán bất kỳ danh sách nào vào rồi sắp xếp theo bảng chữ cái, theo chiều ngược, theo thứ tự tự nhiên (item2 trước item10), theo độ dài, hoặc xáo trộn — đồng thời có thể cắt khoảng trắng thừa, bỏ dòng trống và loại dòng trùng mà vẫn giữ nguyên thứ tự. Số dòng bị loại được báo lại để bạn thấy chính xác thao tác khử trùng đã làm gì.',
			'Sắp xếp tự nhiên là tùy chọn bạn sẽ dùng nhiều nhất: sắp xếp theo bảng chữ cái thuần túy đặt “item10” trước “item2” vì nó so sánh từng ký tự, còn sắp xếp tự nhiên so sánh các con số bên trong theo giá trị số — đúng thứ tự mà con người mong đợi với tên tệp, số phiên bản và mã định danh.',
			'Việc khử trùng giữ lại lần xuất hiện đầu tiên và bảo toàn thứ tự gốc của những dòng còn lại, điều này quan trọng khi thứ tự danh sách có ý nghĩa (danh sách import, dòng cấu hình, danh sách phát). Chế độ bỏ qua hoa thường coi “Apple” và “apple” là cùng một dòng.'
		],
		faqs: [
			{
				q: 'Sắp xếp theo bảng chữ cái và sắp xếp tự nhiên khác nhau ra sao?',
				a: 'Sắp xếp theo bảng chữ cái so sánh mã ký tự, nên “file10” < “file2” (vì ở vị trí thứ 5, “1” < “2”). Sắp xếp tự nhiên nhận ra các cụm chữ số và so sánh chúng như số, cho ra file2 < file10. Với bất cứ thứ gì có chứa số, hãy dùng kiểu tự nhiên.'
			},
			{
				q: 'Khử trùng giữ lần xuất hiện đầu hay lần cuối?',
				a: 'Lần đầu. Các dòng được quét từ trên xuống, và một dòng chỉ bị bỏ nếu trước đó đã có dòng y hệt (hoặc giống nhau nếu bỏ qua hoa thường) — nhờ vậy thứ tự của phần còn lại khớp với bản gốc.'
			},
			{
				q: 'Công cụ xử lý được danh sách lớn cỡ nào?',
				a: 'Hàng trăm nghìn dòng vẫn ổn — các thao tác chỉ là vài lượt duyệt đơn giản cộng một lần sắp xếp. Mọi thứ nằm trong bộ nhớ trình duyệt, nên giới hạn thực tế là máy của bạn chứ không phải hạn mức của máy chủ nào.'
			},
			{
				q: 'Tôi có thể kết hợp nhiều thao tác không?',
				a: 'Có, và chúng được áp dụng theo trình tự hợp lý: cắt khoảng trắng trước, rồi bỏ dòng trống, rồi khử trùng, cuối cùng mới sắp xếp — nhờ vậy khi bật cắt khoảng trắng thì “ apple ” và “apple” sẽ được gộp làm một, và bước sắp xếp luôn nhìn thấy danh sách đã được dọn sạch.'
			}
		]
	},

	'html-entities': {
		about: [
			'Thoát ký tự cho văn bản để đưa an toàn vào HTML — & thành &amp;, < thành &lt; — hoặc giải mã đoạn đầy thực thể trở lại thành ký tự đọc được, bao gồm thực thể có tên (&rarr;), tham chiếu số hệ thập phân (&#169;) và hệ thập lục phân (&#xA9;).',
			'Việc mã hóa có hai mức: năm ký tự thiết yếu vốn phá vỡ cấu trúc HTML (& < > " \'), tức là đủ để đảm bảo đúng đắn; hoặc mọi ký tự ngoài ASCII, hữu ích khi có mắt xích nào đó trong chuỗi công cụ giữa bạn và trang web làm hỏng UTF-8. Chế độ chỉ dùng dạng số bỏ qua thực thể có tên để tương thích tối đa với các trình phân tích XML nghiêm ngặt, vốn chỉ bảo đảm năm thực thể định nghĩa sẵn.',
			'Nửa dùng hằng ngày chính là phần giải mã: dán một đoạn cào về hay một phản hồi API đầy &#x27; vào và nhận lại văn bản sạch sẽ. Những tên thực thể lạ được giữ nguyên chứ không bị đoán mò.'
		],
		faqs: [
			{
				q: 'Trong HTML thì bắt buộc phải thoát những ký tự nào?',
				a: 'Trong phần nội dung văn bản: & và <. Trong giá trị thuộc tính: thêm cả dấu nháy đang bao thuộc tính đó (" hoặc \'). Thoát dấu > là thói quen phổ biến nhưng không bắt buộc. Mọi ký tự còn lại có thể xuất hiện nguyên dạng trong một tài liệu UTF-8.'
			},
			{
				q: 'Mã hóa thực thể có phải là biện pháp chống XSS không?',
				a: 'Thoát năm ký tự cấu trúc đúng là phần cốt lõi của việc mã hóa đầu ra trong ngữ cảnh HTML — nhưng chỉ với văn bản HTML và giá trị thuộc tính. URL, chuỗi JavaScript và CSS cần cách mã hóa riêng theo ngữ cảnh của chúng; chỉ thoát thực thể thôi thì không làm cho việc chèn mã tùy ý trở nên an toàn ở những chỗ đó.'
			},
			{
				q: 'Nên xuất ra thực thể có tên hay dạng số?',
				a: 'Tham chiếu dạng số (&#xE9;) chạy được trên mọi trình phân tích HTML và XML. Thực thể có tên dễ đọc hơn, nhưng XML chỉ định nghĩa sẵn năm cái, nên &eacute; sẽ làm vỡ một quy trình XML/XHTML nghiêm ngặt. Nếu phân vân, hãy chọn dạng số.'
			},
			{
				q: 'Vì sao trong dữ liệu của tôi lại thấy &amp;#39; (mã hóa hai lần)?',
				a: 'Hai tầng cùng mã hóa, mỗi tầng một lần: dấu & của lần mã hóa đầu bị lần thứ hai thoát tiếp. Hãy giải mã hai lượt ở đây để lấy lại văn bản, rồi tìm và sửa cái tầng lẽ ra không nên mã hóa.'
			}
		]
	},

	'unicode-inspector': {
		about: [
			'Dán bất kỳ văn bản nào vào và xem từng ký tự được mổ xẻ: điểm mã (U+XXXX), byte UTF-8, đơn vị UTF-16, chuỗi thoát trong JavaScript, thực thể HTML và phân loại chung — kèm tổng số điểm mã, đơn vị UTF-16, byte UTF-8 và số ký tự theo cảm nhận người dùng (cụm grapheme).',
			'Đây là công cụ dành cho những lúc “sao cái chuỗi này kỳ vậy?”: các ký tự vô hình (khoảng trắng rộng bằng không, BOM, dấu chỉ hướng) hiện ra thành từng hàng nhìn thấy được; những ký tự trông giống nhau (а Kirin và a Latinh) lộ ra điểm mã khác nhau; còn một emoji tưởng “chỉ là một ký tự” hóa ra là bảy điểm mã nối với nhau bằng ký tự ghép rộng bằng không.',
			'Bốn con số độ dài khác nhau trả lời câu hỏi muôn thuở: vì sao .length của JavaScript, giới hạn byte của cơ sở dữ liệu, và thứ người dùng nhìn thấy chẳng bao giờ đồng ý với nhau về độ dài một chuỗi.'
		],
		faqs: [
			{
				q: 'Vì sao trong JavaScript "🎉".length === 2?',
				a: 'Chuỗi trong JavaScript đếm theo đơn vị mã UTF-16. Những ký tự vượt quá U+FFFF — trong đó có phần lớn emoji — cần một cặp thay thế, tức hai đơn vị. Công cụ hiển thị cả hai đơn vị lẫn điểm mã thật, và phần tổng kết đếm chúng riêng rẽ.'
			},
			{
				q: 'Cụm grapheme là gì?',
				a: 'Là thứ mà người đọc cảm nhận như một ký tự. Chữ é có thể gồm hai điểm mã (e + dấu ghép), còn emoji gia đình có thể gồm bảy điểm mã trở lên nối bằng ký tự ghép rộng bằng không. Số grapheme được tính bằng Intl.Segmenter của trình duyệt — thứ gần nhất với “ký tự như người dùng nhìn thấy”.'
			},
			{
				q: 'Làm sao tìm ký tự vô hình trong một chuỗi?',
				a: 'Hãy dán nó vào đây — mỗi điểm mã đều có một hàng riêng, kể cả khoảng trắng rộng bằng không (U+200B), khoảng trắng không ngắt (U+00A0), BOM (U+FEFF) và các dấu chỉ hướng, mỗi thứ đều được gắn nhãn phân loại. Đây chính là những thủ phạm kinh điển đứng sau các chuỗi “giống hệt nhau” mà so sánh bằng lại không khớp.'
			},
			{
				q: 'Dãy byte UTF-8 cho tôi biết điều gì?',
				a: 'Đúng những gì sẽ được lưu hoặc truyền đi: ASCII một byte, phần lớn phần mở rộng Latinh hai byte, CJK ba byte, emoji bốn byte. Nếu một hệ thống cắt ngang giữa dãy byte, bạn sẽ nhận được ký tự thay thế (�) — khung xem byte cho thấy những nhát cắt như vậy sẽ rơi vào đâu.'
			}
		]
	},

	'cron-parser': {
		about: [
			'Dán một biểu thức cron năm trường và nhận lời giải thích bằng ngôn ngữ đời thường, kèm bảng bóc tách từng trường và — phần bắt được lỗi thật — năm mốc chạy kế tiếp được tính theo múi giờ địa phương của bạn. “0 3 * * 1” đọc thành “vào 03:00, các ngày thứ Hai”, rồi tới những ngày cụ thể mà nó sẽ chạy.',
			'Bộ phân tích hỗ trợ đầy đủ cú pháp chuẩn: danh sách (1,15), khoảng (9-17), bước nhảy (*/15), tên tháng và tên thứ (jan, mon), số 7 hiểu là Chủ nhật, cùng họ macro @daily/@hourly. Nó cũng cài đặt đúng cái quy tắc ai cũng quên: khi cả trường ngày trong tháng lẫn thứ trong tuần đều bị giới hạn, công việc sẽ chạy khi một trong hai khớp, chứ không phải cả hai.',
			'Biểu thức sáu trường (kiểu Quartz, có giây) được phát hiện và báo rõ thay vì lặng lẽ phân tích sai — đây là nguồn gốc phổ biến nhất của nỗi hoang mang “cron của tôi chạy sai giờ” khi chuyển qua lại giữa bộ lập lịch Java và crontab Unix.'
		],
		faqs: [
			{
				q: 'Năm trường đó theo thứ tự là gì?',
				a: 'Phút (0–59), giờ (0–23), ngày trong tháng (1–31), tháng (1–12), thứ trong tuần (0–6, Chủ nhật = 0, và 7 cũng được chấp nhận là Chủ nhật). Nhớ đúng thứ tự là cuộc vật lộn muôn đời — bảng bóc tách sẽ gắn nhãn cho từng trường trong biểu thức của bạn.'
			},
			{
				q: 'Vì sao “0 0 1 * 1” lại chạy nhiều hơn tôi tưởng?',
				a: 'Vì cả ngày trong tháng (ngày 1) lẫn thứ trong tuần (thứ Hai) đều bị giới hạn, nên cron chạy công việc khi MỘT TRONG HAI khớp — tức mọi ngày mùng 1 VÀ mọi thứ Hai. Muốn nói “ngày 1 chỉ khi rơi vào thứ Hai”, bạn phải tự kiểm tra ngày trong script.'
			},
			{
				q: 'Các mốc chạy kế tiếp dùng múi giờ nào?',
				a: 'Múi giờ địa phương của trình duyệt bạn, hiển thị ngay cạnh kết quả. Crontab thật chạy theo múi giờ của máy chủ (hoặc dòng TZ= ở một số bản cron) — luôn xác nhận máy đích đang dùng gì, nhất là quanh các mốc đổi giờ mùa hè.'
			},
			{
				q: 'Công cụ có hỗ trợ giây hay năm không?',
				a: 'Không — đó là phần mở rộng của Quartz (Java) với 6 hoặc 7 trường. Cron Unix chuẩn có đúng năm trường và độ phân giải một phút. Đầu vào sáu trường sẽ được phát hiện và báo là Quartz thay vì bị đọc sai.'
			}
		]
	},

	'password-generator': {
		about: [
			'Tạo mật khẩu ngẫu nhiên với độ dài và bộ ký tự bạn chọn, tạo hàng loạt nếu cần, kèm phép tính entropy trung thực — số bit ngẫu nhiên thật, chứ không phải một thanh màu trang trí. Tính ngẫu nhiên đến từ crypto.getRandomValues cùng kỹ thuật lấy mẫu loại bỏ, nên mọi ký tự đều được rút đều tay, không lệch do phép chia dư.',
			'Mỗi bộ ký tự đang bật được đảm bảo có ít nhất một đại diện (chính sách mà nhiều trang web bắt buộc), phần còn lại của mật khẩu được lấp đều, rồi toàn bộ được xáo lại — nhờ vậy những ký tự bắt buộc không dồn cục ở đầu theo kiểu đoán được.',
			'Bộ lọc ký tự dễ nhầm loại bỏ các cặp trông giống nhau (0/O, 1/l/I) cho những mật khẩu mà con người có thể phải đọc to hoặc gõ lại từ giấy. Vì việc tạo diễn ra cục bộ, các mật khẩu chỉ tồn tại trên máy bạn cho tới khi chính bạn cất chúng đi đâu đó.'
		],
		faqs: [
			{
				q: 'Số bit entropy nghĩa là gì?',
				a: 'Entropy = độ dài × log2(kích thước tập ký tự): số khả năng đồng xác suất mà kẻ tấn công phải dò. Entropy 64 bit chịu được tấn công hời hợt; từ 80 bit trở lên là mạnh trước việc bẻ khóa ngoại tuyến các hàm băm nhanh; từ 100 bit trở lên thì gần như không thể đoán. Một mật khẩu 16 ký tự gồm chữ + số + ký hiệu vào khoảng 104 bit.'
			},
			{
				q: 'Mật khẩu dài toàn chữ thường có tốt hơn mật khẩu ngắn mà phức tạp không?',
				a: 'Thường là có — độ dài nhân entropy lên, còn thêm bộ ký tự chỉ mở rộng cơ số của logarit. 20 chữ cái thường (~94 bit) thắng 10 ký tự trộn đủ loại (~65 bit). Các quy tắc bắt buộc phức tạp chủ yếu sinh ra để chống danh sách từ điển, mà việc sinh ngẫu nhiên thì vốn đã vô hiệu hóa chúng.'
			},
			{
				q: 'Tạo mật khẩu ngay trong trình duyệt có an toàn không?',
				a: 'Nguồn ngẫu nhiên (crypto.getRandomValues) chính là CSPRNG mà các trình quản lý mật khẩu gốc vẫn dùng, và trang này không gửi bất kỳ yêu cầu mạng nào với dữ liệu của bạn. Rủi ro thực tế nằm ở phần sau khi tạo: lịch sử khay nhớ tạm, chia sẻ màn hình, và nơi bạn cất mật khẩu.'
			},
			{
				q: 'Vì sao nên loại bỏ ký tự dễ nhầm?',
				a: 'Với những mật khẩu sẽ do con người đọc — mã khôi phục in ra giấy, đọc qua điện thoại, gõ lại từ một màn hình khác — thì 0/O và 1/l/I gây ra không ít phiếu hỗ trợ thật sự. Còn với mật khẩu chỉ để dán, cứ giữ chúng lại; đằng nào phần entropy mất đi khi loại bỏ cũng không đáng kể.'
			}
		]
	},

	'qr-code-generator': {
		about: [
			'Gõ hoặc dán bất kỳ nội dung nào — một URL, thông tin WiFi, danh thiếp — và nhận ngay một mã QR, kết xuất thành ảnh vector SVG sắc nét để tải về, hoặc xuất ra PNG cho chat và slide. Không watermark, không kiểu chuyển hướng “gói miễn phí” rồi hết hạn, và vì việc tạo mã diễn ra cục bộ, thứ bạn mã hóa không hề chạm tới máy chủ nào.',
			'Điểm cuối đó quan trọng hơn vẻ ngoài của nó: nhiều dịch vụ QR miễn phí cho URL của bạn đi vòng qua tên miền chuyển hướng của họ (để sau này có thể thu phí hoặc đếm lượt quét), nghĩa là mã sẽ chết theo dịch vụ. Mã tạo ở đây mã hóa thẳng nội dung của bạn và chạy được mãi mãi.',
			'Bốn mức sửa lỗi đánh đổi dung lượng lấy độ bền — mức L chịu được hư hại nhẹ, mức H chịu được tới 30% ký hiệu bị che (hữu ích khi có logo đè lên giữa mã, hoặc bản in nhỏ và dễ trầy).'
		],
		faqs: [
			{
				q: 'Tôi nên chọn mức sửa lỗi nào?',
				a: 'Mức M (15%) là lựa chọn mặc định hợp lý. Hãy dùng H (30%) cho mã in cỡ nhỏ, mã nằm sau kính hay bị lóa, hoặc khi bạn đè logo lên. Mức sửa lỗi càng cao thì mã càng dày, nên với URL rất dài hiển thị trên màn hình, mức L giữ cho các ô lớn hơn và dễ quét hơn.'
			},
			{
				q: 'Vì sao in ấn nên dùng SVG thay vì PNG?',
				a: 'SVG không phụ thuộc độ phân giải — máy in sẽ tự dựng ảnh theo DPI gốc của nó, giữ cạnh các ô sắc nét tuyệt đối ở mọi kích thước. PNG buộc phải được tạo ở một kích thước điểm ảnh cụ thể và dễ nhòe khi phóng to. Dùng SVG cho in ấn và phần mềm thiết kế, PNG cho chat và slide.'
			},
			{
				q: 'Một mã QR chứa được bao nhiêu dữ liệu?',
				a: 'Về lý thuyết tới khoảng 3 KB (phiên bản 40, mức L), nhưng mã lớn cỡ đó rất khó quét từ màn hình. Dưới 300 ký tự thì quét ổn định; với URL dài, hãy rút gọn trước — bằng dịch vụ rút gọn trên tên miền của chính bạn nếu bạn cần nó tồn tại lâu dài.'
			},
			{
				q: 'Những mã này có hết hạn hay theo dõi lượt quét không?',
				a: 'Không. Nội dung được mã hóa thẳng vào hoa văn — không có gì đi vòng qua trang này, nên chẳng có gì để hết hạn, và không ai (kể cả chúng tôi) biết mã được quét khi nào, ở đâu. Muốn theo dõi lượt quét thì buộc phải có một dịch vụ chuyển hướng.'
			}
		]
	},

	'json-to-yaml': {
		about: [
			'Chuyển đổi giữa JSON, YAML và TOML theo mọi chiều. Định dạng nguồn được tự nhận diện ngay khi bạn dán — dấu ngoặc gợi ý JSON, kiểu key: gợi ý YAML, [bảng] gợi ý TOML — và bạn vẫn có thể chọn tay khi dữ liệu mập mờ. Việc chuyển đổi đi qua một lần phân tích thật sự, nên kết quả chắc chắn hợp lệ chứ không phải phép biến đổi văn bản theo từng dòng.',
			'Mỗi định dạng có thế mạnh riêng: JSON cho API và trao đổi giữa máy với máy, YAML cho cấu hình do người biên tập (Kubernetes, pipeline CI), TOML cho các tệp cấu hình có kiểu rõ ràng (Cargo, pyproject). Chuyển dữ liệu qua lại bằng tay rất dễ sai thụt lề và dấu nháy, còn phép chuyển đổi này thì dẹp hẳn chuyện đó.',
			'Công cụ nói thẳng về giới hạn của từng định dạng: TOML không có mảng ở cấp cao nhất và không có null, nên khi chuyển những tài liệu như vậy nó sẽ báo lý do thay vì âm thầm làm rơi dữ liệu.'
		],
		faqs: [
			{
				q: 'Chú thích có còn lại sau khi chuyển đổi không?',
				a: 'Không — JSON không có cú pháp chú thích, và phép chuyển đổi đi qua cấu trúc dữ liệu đã phân tích, vốn không mang theo chú thích. Chuyển YAML → JSON → YAML sẽ mất chú thích vĩnh viễn; khi chú thích quan trọng, hãy giữ lại tệp gốc.'
			},
			{
				q: 'Vì sao chữ “no” trong YAML của tôi biến thành false?',
				a: 'YAML 1.1 coi yes/no/on/off là giá trị luận lý, và mã quốc gia NO nổi tiếng là bị biến thành false. Bộ phân tích ở đây theo YAML 1.2 (chỉ true/false), nhưng những tệp viết cho bộ phân tích cũ vẫn có thể gây bất ngờ. Hãy đặt trong dấu nháy những chuỗi trông giống giá trị luận lý, số hay ngày tháng.'
			},
			{
				q: 'Vì sao JSON của tôi không chuyển được sang TOML?',
				a: 'TOML đòi hỏi cấp cao nhất phải là một bảng (đối tượng) — mảng hay giá trị vô hướng trần không thể là một tài liệu TOML — và nó không có null. Hãy tổ chức lại dữ liệu (bọc mảng vào trong một khóa, bỏ hoặc gán mặc định cho các giá trị null) rồi nó sẽ chuyển được.'
			},
			{
				q: 'YAML có phải là tập cha của JSON không?',
				a: 'Trên thực tế thì gần như đúng — YAML 1.2 phân tích được hầu hết mọi tài liệu JSON, đó là lý do dán JSON vào một tệp cấu hình YAML thường vẫn chạy. Chiều ngược lại thì không: các neo (anchor), chuỗi nhiều dòng và thẻ tag của YAML không có thứ tương đương trong JSON, nên khi chuyển đổi chúng sẽ bị khai triển hoặc biến thành chuỗi.'
			}
		]
	}
};

export default TOOL_CONTENT_VI;
