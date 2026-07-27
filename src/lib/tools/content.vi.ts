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
	},

	'json-to-csv': {
		about: [
			'Dán một mảng các đối tượng JSON vào và nhận về tệp CSV sẵn sàng cho bảng tính: đối tượng lồng nhau được trải phẳng thành tên cột có dấu chấm (user.address.city), tập cột là hợp của mọi hàng (giá trị thiếu thành ô trống), và cách đặt dấu nháy tuân theo RFC 4180 nên dấu phẩy, dấu nháy và ngắt dòng nằm trong giá trị vẫn sống sót qua Excel lẫn Google Sheets.',
			'Đây là đường ngắn nhất từ một phản hồi API tới bảng tính mà ai đó có thể lọc và dựng pivot. Việc hợp cột rất quan trọng với dữ liệu thực tế, nơi các đối tượng không đồng nhất — hàng 1 có thể thiếu những trường mà hàng 40 có, và công cụ xử lý chuyện đó thay vì báo lỗi hay làm rơi dữ liệu.',
			'Công cụ cũng chạy theo chiều ngược: dán một tệp CSV xuất ra và nhận về mảng JSON các đối tượng lấy khóa từ hàng tiêu đề, có tự nhận diện ký tự phân tách (phẩy, chấm phẩy, tab, sổ đứng) và tùy chọn gán kiểu — số, giá trị luận lý và null trở thành kiểu JSON thật. Cả hai chiều đều chạy hoàn toàn trong trình duyệt của bạn, nên các bản xuất dữ liệu khách hàng không bao giờ rời khỏi máy bạn.'
		],
		faqs: [
			{
				q: 'Đối tượng lồng nhau được biểu diễn thế nào?',
				a: 'Được trải phẳng bằng khóa nối bởi dấu chấm: {"user":{"name":"Ada"}} trở thành cột user.name. Nhờ vậy mọi giá trị vô hướng đều địa chỉ hóa được trong một hàng tiêu đề phẳng duy nhất — đúng thứ mà các công cụ bảng tính làm việc được.'
			},
			{
				q: 'Mảng nằm trong một hàng thì sao?',
				a: 'Chúng được nhúng dưới dạng chuỗi JSON trong một ô duy nhất (["a","b"]). Việc bung mảng ra thành nhiều cột (tags.0, tags.1…) hay thêm hàng sẽ thay đổi hình dạng dữ liệu theo một cách khá áp đặt — còn nhúng thì giữ cho phép chuyển đổi không mất mát và dễ đoán.'
			},
			{
				q: 'Vì sao Excel dồn cả tệp CSV của tôi vào một cột?',
				a: 'Do thiết lập vùng miền: ở phần lớn châu Âu, Excel mong đợi tệp phân tách bằng dấu chấm phẩy vì dấu phẩy được dùng làm dấu thập phân. Hãy đổi tùy chọn ký tự phân tách sang chấm phẩy, hoặc dùng Data → From Text/CSV để tự chỉ định dấu phân tách.'
			},
			{
				q: 'Công cụ có xử lý được một đối tượng đơn lẻ (không phải mảng) không?',
				a: 'Có — một đối tượng đứng riêng sẽ thành CSV một hàng. Tuy nhiên các đối tượng lấy ID làm khóa ({"a1":{...},"a2":{...}}) sẽ thành một hàng rất rộng; nếu bạn muốn mỗi giá trị là một hàng thì hãy chuyển chúng thành mảng trước.'
			},
			{
				q: 'CSV → JSON xử lý trường có dấu nháy và ngắt dòng bên trong ra sao?',
				a: 'Theo RFC 4180: trường bọc trong dấu nháy kép được phép chứa ký tự phân tách, dùng hai dấu nháy liền ("") để biểu diễn một dấu nháy thật, và chứa cả ngắt dòng. Excel cùng phần lớn cơ sở dữ liệu xuất ra đúng định dạng này, nên các tệp ngoài đời phân tích chuẩn xác.'
			},
			{
				q: 'Vì sao mã bưu chính của tôi mất số 0 đứng đầu khi chuyển CSV → JSON?',
				a: 'Chế độ gán kiểu biến 02134 thành số 2134. Hãy bỏ chọn “Giá trị có kiểu”, khi đó mọi ô đều giữ nguyên dạng chuỗi đúng như đã viết — lựa chọn đúng cho mã định danh, số điện thoại và mọi thứ có số 0 ở đầu.'
			}
		]
	},

	'json-to-typescript': {
		about: [
			'Dán một mẫu JSON — phản hồi API, tệp cấu hình — và nhận về interface TypeScript được suy ra từ đó: đối tượng lồng nhau thành kiểu lồng nhau, mảng có kiểu phần tử (kèm union khi nội dung pha trộn), và những khóa không phải định danh hợp lệ sẽ được đặt trong dấu nháy đúng cách.',
			'Kiểu sinh ra là điểm khởi đầu chứ không phải bản cam kết: việc suy diễn chỉ nhìn thấy một mẫu, nên một trường tình cờ mang giá trị null trong ví dụ của bạn sẽ được gán kiểu null, còn những trường tùy chọn vắng mặt thì nó hoàn toàn không biết. Kết quả cố ý để trần trụi — không decorator, không kiểm tra lúc chạy — để bạn dán đi đâu cũng được rồi tinh chỉnh sau.',
			'Với những trường thay đổi giữa các lần gọi, hãy chạy thêm một mẫu nữa rồi gộp bằng tay, hoặc nâng cấp lên bộ công cụ ưu tiên schema (OpenAPI, zod) khi hình dạng dữ liệu đã ổn định. Còn với khoảnh khắc “tôi chỉ cần một cái kiểu cho cái phản hồi này” hằng ngày thì một lần dán là đủ.'
		],
		faqs: [
			{
				q: 'Vì sao trường có thể null của tôi lại chỉ được gán kiểu null?',
				a: 'Việc suy diễn chỉ thấy đúng cái mẫu bạn dán vào. Nếu ở đó trường ấy là null thì null là tất cả những gì nó biết được. Sau khi sinh mã, hãy sửa thành string | null (hoặc kiểu thật của nó) — hoặc dán một mẫu mà trường đó có giá trị.'
			},
			{
				q: 'Trường tùy chọn được xử lý ra sao?',
				a: 'Không được phát hiện — một mẫu đơn lẻ không thể phân biệt “luôn có mặt” với “lần này có mặt”. Trường vắng trong mẫu thì cũng vắng trong kiểu. Hãy tự đánh dấu tùy chọn (name?:) ở những chỗ bạn biết API có thể bỏ qua.'
			},
			{
				q: 'Mảng chứa nhiều kiểu sẽ cho ra gì?',
				a: 'Một union: [1, "a"] suy ra (number | string)[]. Mảng rỗng suy ra unknown[] vì chẳng có phần tử nào để xem — hãy thay bằng kiểu phần tử thật khi bạn đã biết.'
			},
			{
				q: 'Nên dùng kiểu suy diễn hay một thư viện schema như zod?',
				a: 'Interface suy diễn chỉ tồn tại lúc biên dịch — chúng không kiểm tra gì khi chạy. Với công cụ nội bộ và nhu cầu gán kiểu nhanh thì quá hoàn hảo; còn với dữ liệu không đáng tin lúc chạy, hãy định nghĩa schema zod/valibot rồi suy ra kiểu tĩnh từ đó.'
			}
		]
	},

	'jsonpath-tester': {
		about: [
			'Thử các biểu thức JSONPath trên chính JSON của bạn và xem từng kết quả khớp kèm cả giá trị lẫn đường dẫn cụ thể. Công cụ hỗ trợ phần cú pháp bao trùm nhu cầu hằng ngày: ký pháp dấu chấm và ngoặc vuông, chỉ số mảng (kể cả số âm), ký tự đại diện, phép hợp ([\'a\',\'b\']) và duyệt đệ quy ($..price).',
			'Đường dẫn hiện kèm mỗi kết quả mới là phần hữu ích một cách thầm lặng: chạy $..id trên một tài liệu lồng sâu, mỗi kết quả sẽ nói chính xác nó nằm ở đâu ($.data.items[3].id), sẵn sàng dán thẳng vào mã. Nó biến “đâu đó trong đống dữ liệu này” thành một địa chỉ chính xác.',
			'Biểu thức lọc ([?(@.price < 10)]) hiện chưa được cài đặt — công cụ nói thẳng điều đó thay vì trả về kết quả sai. Còn với việc trích xuất theo cấu trúc, tức phần lớn nhu cầu dùng JSONPath, thì mọi thứ đều chạy.'
		],
		faqs: [
			{
				q: '$.a.b và $..b khác nhau chỗ nào?',
				a: '$.a.b đi theo đúng một lộ trình: khóa a ở gốc, rồi khóa b bên trong nó. $..b (duyệt đệ quy) tìm mọi khóa b ở bất kỳ đâu trong tài liệu, ở bất kỳ độ sâu nào. Duyệt đệ quy rất mạnh nhưng cũng dễ gây bất ngờ — nó khớp cả những khóa b nằm lồng trong những chỗ bạn không nghĩ tới.'
			},
			{
				q: 'Làm sao truy cập khóa có dấu cách hoặc dấu gạch ngang?',
				a: 'Dùng ký pháp ngoặc vuông kèm dấu nháy: $[\'my key\'] hoặc $.data[\'content-type\']. Ký pháp dấu chấm chỉ dùng được với những khóa có dạng định danh hợp lệ.'
			},
			{
				q: 'Chỉ số mảng âm có dùng được không?',
				a: 'Có — [-1] là phần tử cuối, [-2] là áp chót, theo đúng quy ước mà Python phổ biến hóa và RFC 9535 tiếp nhận. [0] vẫn là phần tử đầu tiên.'
			},
			{
				q: 'JSONPath đã được chuẩn hóa chưa?',
				a: 'Từ năm 2024 thì rồi — RFC 9535 định nghĩa cú pháp và ngữ nghĩa. Những bản cài đặt viết trước đó khác nhau ở các ca biên (nhất là bộ lọc và phép hợp), nên cùng một biểu thức có thể hành xử khác nhau giữa các thư viện; hãy thử nghiệm trên đúng thư viện bạn triển khai.'
			}
		]
	},

	'bcrypt-generator': {
		about: [
			'Băm một mật khẩu bằng bcrypt với hệ số chi phí bạn chọn, hoặc đối chiếu một chuỗi thuần với chuỗi hash sẵn có — cả hai đều chạy trọn vẹn trong trình duyệt, đúng thứ bạn muốn khi cái đang bị đem ra thử chính là mật khẩu. Ngoài ra còn có phần soi hash, tách bất kỳ chuỗi bcrypt nào thành phiên bản, chi phí và salt.',
			'Bcrypt vẫn là lựa chọn vững chắc để lưu mật khẩu vì nó cố ý chậm và có salt riêng cho từng mật khẩu: hệ số chi phí nhân đôi khối lượng tính toán sau mỗi nấc, nên chi phí 12 nghĩa là 4096 vòng thiết lập của thuật toán mã bên dưới. Phần hiển thị thời gian cho thấy mức chi phí bạn chọn mất bao lâu, biến đánh đổi giữa bảo mật và độ trễ thành con số cụ thể.',
			'Nhu cầu thường gặp hơn mỗi ngày lại là kiểm chứng: xác nhận chuỗi hash trong cơ sở dữ liệu có khớp với một mật khẩu đã biết hay không mà chẳng cần khởi động mã ứng dụng. Dán cả hai vào, nhận câu trả lời có hoặc không.'
		],
		faqs: [
			{
				q: 'Trên môi trường production nên dùng hệ số chi phí bao nhiêu?',
				a: 'Lời khuyên kinh điển: cao nhất trong mức độ trễ đăng nhập mà bạn chấp nhận được, ngày nay thường là 10–13. Hãy nhắm tới 100–300 ms mỗi lần băm trên phần cứng production. JavaScript trong trình duyệt chạy chậm hơn mã gốc, nên con số hiển thị ở đây là giới hạn trên cho máy chủ của bạn.'
			},
			{
				q: 'Vì sao cùng một mật khẩu lại cho ra chuỗi hash khác nhau mỗi lần?',
				a: 'Mỗi lần băm sẽ sinh một salt ngẫu nhiên 16 byte và cất ngay trong chuỗi hash. Đó là chủ ý thiết kế — mật khẩu giống hệt nhau vẫn cho hash khác nhau, làm vô hiệu các bảng cầu vồng dựng sẵn. Khi kiểm chứng, salt được đọc ngược ra từ chính chuỗi hash, nhờ vậy việc so khớp vẫn hoạt động.'
			},
			{
				q: 'Các phần của một chuỗi hash bcrypt nghĩa là gì?',
				a: '$2b$12$ cộng 53 ký tự: 2b là phiên bản thuật toán, 12 là chi phí (2^12 vòng), 22 ký tự tiếp theo là salt, và 31 ký tự cuối là phần tóm lược — tất cả viết theo bảng base64 riêng của bcrypt. Phần soi hash bên dưới công cụ sẽ tách bất kỳ chuỗi nào theo đúng cách đó.'
			},
			{
				q: 'Bcrypt còn được khuyên dùng hơn Argon2 không?',
				a: 'Argon2id hiện là lựa chọn đầu tiên cho hệ thống mới (đòi hỏi nhiều bộ nhớ nên chống lại việc bẻ khóa bằng GPU). Bcrypt vẫn chấp nhận được và có mặt khắp nơi — lời khuyên thực tế là: đừng hoảng hốt di dời một kho bcrypt đang chạy tốt, nhưng với thiết kế mới tinh thì hãy chọn Argon2id. Cả hai đều vượt xa các hàm băm nhanh như SHA-256.'
			}
		]
	},

	'user-agent-parser': {
		about: [
			'Dán một chuỗi User-Agent lấy từ dòng log, báo cáo lỗi hay bản xuất analytics vào và nhận lại bản giải mã: trình duyệt và phiên bản, engine kết xuất, hệ điều hành, loại thiết bị và kiến trúc CPU. Bộ phân tích là ua-parser-js, chính thư viện đứng sau vô số pipeline analytics, chạy cục bộ trên chuỗi của bạn.',
			'Chuỗi User-Agent là những di chỉ khảo cổ — cái nào cũng vẫn tự xưng là Mozilla/5.0, Chrome nhận mình là Safari, Safari nhận là KHTML, còn danh tính thật thì nấp ở những token phía sau. Một bộ phân tích vẫn hơn việc nheo mắt đoán: nó biết “CriOS” nghĩa là Chrome trên iOS và Edge đang trốn sau chữ “Edg/”.',
			'Cũng nên để ý xu hướng: các trình duyệt đang đóng băng và rút gọn chuỗi UA (Chromium thay bằng UA Client Hints), nên mức chi tiết phiên bản lấy riêng từ UA ngày càng thô. Với việc điều tra log và phân loại lỗi thì nó vẫn không thể thiếu; còn khi quyết định dùng tính năng nào, hãy dùng feature detection.'
		],
		faqs: [
			{
				q: 'Vì sao mọi User-Agent đều mở đầu bằng Mozilla/5.0?',
				a: 'Một màn kịch tương thích từ thập niên 1990 mà chẳng bao giờ hạ màn: máy chủ dò chữ “Mozilla” để trả về trang bản hiện đại, nên trình duyệt mới nào cũng tự nhận là nó, rồi từng đời sau lại đóng giả đời trước. Giờ đây tiền tố ấy chỉ còn là truyền thống vô nghĩa.'
			},
			{
				q: 'Tôi có tin được phiên bản hệ điều hành trong chuỗi UA không?',
				a: 'Mỗi năm một kém tin hơn. macOS đóng băng phiên bản trong UA ở mức 10_15_7, Windows 11 tự báo là Windows NT 10.0, còn các trình duyệt rút gọn UA thì cố tình làm thô phần phiên bản. Hãy coi phiên bản hệ điều hành lấy từ UA là gần đúng; ở nơi bạn kiểm soát được client, hãy dùng UA Client Hints.'
			},
			{
				q: '“like Gecko” hay “KHTML, like Gecko” nghĩa là gì?',
				a: 'Lại thêm vài tầng đóng giả nữa: WebKit vốn thoát thai từ KHTML và muốn những trang xử lý riêng cho Gecko (engine của Firefox) vẫn chạy được, nên nó nối thêm “like Gecko”. Mọi trình duyệt WebKit/Blink đến giờ vẫn mang theo cụm từ đó.'
			},
			{
				q: 'Có nên phân tích UA để phát hiện tính năng không?',
				a: 'Không — kiểu dò chuỗi UA sẽ vỡ ngay khi một phiên bản trình duyệt mới ra mắt. Hãy kiểm tra chính tính năng đó (if ("clipboard" in navigator)). Việc phân tích UA dành cho analytics, phân tích log và tái hiện lỗi người dùng báo về, những chỗ mà biết môi trường mới là mục đích chính.'
			}
		]
	},

	'color-converter': {
		about: [
			'Nhập một màu theo bất kỳ ký pháp quen thuộc nào — #hex, rgb(), hsl(), hay tên màu CSS — và nhận lại mọi định dạng cùng lúc: HEX, RGB, HSL và OKLCH, bên cạnh một ô màu xem trực tiếp. Kênh alpha được giữ nguyên qua các định dạng, và phần kết quả dùng cú pháp CSS hiện đại (các kênh cách nhau bằng dấu cách) để dán thẳng vào stylesheet ngày nay là chạy.',
			'OKLCH có mặt ở đây vì đó là hướng đi của màu sắc trong CSS: khác với HSL, trục độ sáng của nó đồng đều theo cảm nhận thị giác, nên hai màu có cùng giá trị L thật sự trông sáng ngang nhau, và việc chỉnh tông màu không vô tình làm đổi độ sáng cảm nhận. Chuyển một bảng màu sẵn có sang OKLCH là bước đầu tiên để dựng những thang màu nhất quán.',
			'Phần tính toán chuyển đổi chạy cục bộ theo các phép biến đổi sRGB↔OKLab đã công bố, và giá trị đi vòng vẫn khớp: RGB bạn nhận lại từ một đầu vào HSL đúng bằng thứ trình duyệt sẽ tính ra.'
		],
		faqs: [
			{
				q: 'Vì sao giá trị độ sáng của HSL và OKLCH lại không khớp nhau?',
				a: 'Độ sáng trong HSL là một thuộc tính hình học của các giá trị RGB chứ không phải của thị giác con người — màu vàng hsl(60 100% 50%) trông sáng hơn hẳn màu lam hsl(240 100% 50%) dù L y hệt nhau. Trục L của OKLCH được thiết kế để bám theo cảm nhận, nên L bằng nhau nghĩa là độ sáng biểu kiến bằng nhau. Chính sự lệch pha đó là lý do OKLCH ra đời.'
			},
			{
				q: 'Giá trị alpha nghĩa là gì và nó nằm ở đâu trong mỗi định dạng?',
				a: 'Alpha là độ đục, từ 0 (trong suốt) tới 1 (đục hoàn toàn). Trong hex 8 chữ số, nó là byte cuối (#RRGGBBAA); trong cú pháp hàm hiện đại, nó đi sau dấu gạch chéo: rgb(76 141 255 / 0.5). Công cụ này tự động mang alpha qua mọi định dạng.'
			},
			{
				q: 'Mọi màu OKLCH có hiển thị được trong sRGB không?',
				a: 'Không — OKLCH bao phủ những gam màu rộng, và một số tổ hợp sắc độ/độ sáng không có tương đương trong sRGB. Chuyển từ sRGB đi (như công cụ này làm) thì luôn biểu diễn được; theo chiều ngược lại, những màu nằm ngoài gam phải bị cắt hoặc ánh xạ lại — đó là lý do một màu lục P3 rực rỡ trông xỉn hơn trên màn hình sRGB.'
			},
			{
				q: 'Vì sao là rgb(76 141 255) cách nhau bằng dấu cách chứ không phải dấu phẩy?',
				a: 'CSS Color Module Level 4 đã chuẩn hóa cách viết các kênh cách nhau bằng dấu cách kèm /alpha tùy chọn, và mọi trình duyệt hiện đại đều hỗ trợ. Dạng dùng dấu phẩy vẫn chạy, nhưng dạng dấu cách mới là thứ các đặc tả mới (và công cụ này) sử dụng.'
			}
		]
	},

	'image-to-base64': {
		about: [
			'Kéo thả, chọn hoặc dán một tấm ảnh và nhận về dạng Base64 của nó ở mọi kiểu bạn có thể cần: một data URL dùng được ngay, một khai báo background-image cho CSS, một thẻ <img> hoàn chỉnh kèm kích thước gốc, và phần Base64 thô. Chiều ngược lại cũng chạy — dán một data URL hay một khối Base64 trần vào, ảnh sẽ được giải mã, xem trước và tải về thành tệp.',
			'Định dạng được nhận ra từ các byte đặc trưng chứ không phải từ phần mở rộng tệp hay kiểu MIME khai báo, nên một tệp PNG bị đổi tên thành .jpg (hoặc một data URL gắn nhãn sai) vẫn chuyển đổi đúng. Bảng kích thước rất sòng phẳng về cái giá phải trả: Base64 làm dữ liệu phình thêm khoảng một phần ba, và kích thước sau mã hóa hiện ngay cạnh bản gốc để bạn tự quyết có đáng nhúng thẳng hay không.',
			'Khác với đa số trang chuyển ảnh sang Base64, ở đây không có gì được tải lên — tệp được đọc bằng FileReader API của trình duyệt và mã hóa ngay trong trang. Nhờ vậy nó an toàn cho ảnh chụp bảng điều khiển nội bộ, ảnh sản phẩm chưa ra mắt, hay bất cứ thứ gì bạn không muốn trao cho máy chủ của người lạ.'
		],
		faqs: [
			{
				q: 'Khi nào nên nhúng ảnh dạng Base64 thay vì liên kết tới tệp?',
				a: 'Khi ảnh nhỏ (đại khái dưới 10 KB), hiếm khi thay đổi, và nếu để riêng thì lại tốn thêm một request HTTP — chẳng hạn icon, logo trong email, hay tài liệu HTML một tệp. Với ảnh lớn hơn thì để riêng vẫn hơn: nó được lưu đệm độc lập, tải song song, và không làm HTML hay CSS của bạn phình thêm 33%.'
			},
			{
				q: 'Vì sao bản Base64 lớn hơn tệp gốc khoảng một phần ba?',
				a: 'Base64 biểu diễn mỗi 3 byte nhị phân bằng 4 ký tự ASCII, tức phần dôi ra +33% mang tính cấu trúc (cộng tối đa hai ký tự đệm). Gzip hay Brotli trên máy chủ giành lại được một phần, nhưng độ phình vốn nằm sẵn trong phép mã hóa — nó đánh đổi kích thước để lấy khả năng nhúng dữ liệu nhị phân vào văn bản.'
			},
			{
				q: 'Tôi có giải mã được một data URL nhặt từ stylesheet hay HTML không?',
				a: 'Được — hãy chuyển sang chế độ Base64 → ảnh rồi dán nguyên cả cụm, kể cả tiền tố data:. Những data URL chứa SVG mã hóa phần trăm (loại không có ;base64) cũng giải mã được, còn ngắt dòng hay khoảng trắng bên trong phần dữ liệu sẽ tự động bị loại bỏ. Kết quả hiện ra ngay trong trang và tải về với đúng phần mở rộng.'
			},
			{
				q: 'Công cụ có dùng được với SVG, GIF và ICO không, hay chỉ PNG với JPEG?',
				a: 'Mọi thứ mà bộ dò nhận ra đều chuyển được sang Base64: PNG, JPEG, WebP, GIF, SVG, BMP, ICO và AVIF. Riêng với SVG, hãy cân nhắc rằng mã XML gốc nhúng thẳng thường nhỏ hơn và dễ đọc hơn — mã hóa SVG sang Base64 chủ yếu có lý khi việc đặt dấu nháy hay thoát ký tự trở nên phiền phức.'
			}
		]
	},

	'image-converter': {
		about: [
			'Chuyển đổi ảnh giữa PNG, JPEG và WebP mà không phải cài gì và cũng chẳng tải lên đâu cả: thả tệp vào, chọn định dạng đích, chỉnh chất lượng bằng thanh trượt trực tiếp, rồi xem kích thước đầu ra cập nhật theo thời gian thực. Ô Δ cho biết chính xác tệp sau khi chuyển nhỏ đi (hay lớn thêm) bao nhiêu, nên việc chọn mức chất lượng thôi không còn là đoán mò.',
			'Ba định dạng có ba nhiệm vụ khác nhau. PNG là nén không mất dữ liệu và hỗ trợ trong suốt đầy đủ — hợp cho ảnh chụp màn hình, tài nguyên giao diện và mọi thứ có cạnh sắc hay chữ. JPEG nén ảnh chụp rất mạnh tay nhưng không có kênh alpha và làm nhòe cạnh sắc. WebP thường thắng JPEG 25–35% ở mức chất lượng tương đương, hỗ trợ trong suốt, và chạy được trên mọi trình duyệt hiện hành — với web thì nó thường là đáp án.',
			'Việc chuyển đổi diễn ra trên một canvas trong trình duyệt của bạn: ảnh được giải mã, vẽ lại rồi mã hóa lại bằng chính các codec mà trình duyệt dùng để hiển thị trang. Đó là điều làm công cụ này riêng tư — và cũng là lý do số byte chính xác chênh nhau chút ít giữa Chrome, Firefox và Safari, vì mỗi bên dùng bộ mã hóa riêng.'
		],
		faqs: [
			{
				q: 'Nên đặt mức chất lượng nào cho JPEG và WebP?',
				a: 'Khoảng 75 đến 90 bao trùm gần như mọi nhu cầu thực tế. Ở mức 85, phần lớn ảnh chụp nhìn không khác gì bản gốc mà dung lượng chỉ còn một phần nhỏ; dưới khoảng 70, các mảng chuyển sắc và tông da bắt đầu nổi khối; trên 90 thì dung lượng leo dốc để đổi lấy phần cải thiện mà mắt bạn không thấy. Cứ kéo thanh trượt và nhìn ô kích thước — điểm ngọt thường lộ ra rất rõ.'
			},
			{
				q: 'Vì sao tệp PNG của tôi lại to ra sau khi chuyển sang JPEG?',
				a: 'JPEG sinh ra cho những mảng chuyển sắc kiểu ảnh chụp, không phải cho màu phẳng. Ảnh chụp màn hình, sơ đồ và hình giao diện nén cực tốt dưới dạng PNG (những dải pixel giống hệt nhau kéo dài) nhưng lại buộc JPEG phải lưu nhiễu quanh mỗi cạnh sắc — tệp to hơn và viền gợn thấy rõ. Hãy giữ ảnh đồ họa ở PNG hoặc chuyển sang WebP thiên về không mất dữ liệu.'
			},
			{
				q: 'Phần trong suốt sẽ ra sao khi tôi chuyển sang JPEG?',
				a: 'JPEG không có kênh alpha, nên các vùng trong suốt buộc phải được lấp bằng thứ gì đó — công cụ này làm phẳng chúng trên nền trắng, đúng thông lệ của ảnh dùng cho web. Nếu bạn cần giữ độ trong suốt, hãy chọn PNG hoặc WebP làm định dạng đích.'
			},
			{
				q: 'Vì sao trình duyệt của tôi không xuất được AVIF hay HEIC ở đây?',
				a: 'API canvas toBlob chỉ mã hóa những định dạng mà trình duyệt có sẵn bộ mã hóa — PNG và JPEG thì ở đâu cũng có, WebP thì trên Chromium và Firefox. Việc mã hóa AVIF vẫn còn hiếm, còn HEIC thì vướng bằng sáng chế, nên trình duyệt giải mã được nhưng không tạo ra được. Nếu bạn chọn định dạng mà trình duyệt không ghi được, công cụ sẽ nói thẳng thay vì lặng lẽ đưa bạn một tệp PNG.'
			}
		]
	},

	'image-resizer': {
		about: [
			'Đổi kích thước ảnh về đúng một chiều rộng, đúng một chiều cao, hoặc theo phần trăm so với bản gốc — chiều còn lại tự chạy theo nên không có gì bị kéo méo. Chọn định dạng đầu ra (hoặc giữ nguyên định dạng nguồn), đặt mức chất lượng cho các đích nén mất dữ liệu, xem trước rồi tải về. Các ô trước/sau cho thấy kích thước và dung lượng tệp chỉ trong một cái liếc.',
			'Việc thu phóng dùng chế độ làm mượt chất lượng cao của trình duyệt, tức là lấy mẫu lại đàng hoàng chứ không phải cắt bớt kiểu láng giềng gần nhất — ảnh thu nhỏ vẫn sắc nét thay vì lăn tăn răng cưa. Đổi kích thước cũng là cách trung thực nhất để giảm dung lượng: giảm một nửa cả hai chiều là bỏ đi ba phần tư số điểm ảnh, điều mà không thanh trượt chất lượng nào sánh kịp.',
			'Tệp không bao giờ rời khỏi trang: việc giải mã, lấy mẫu lại và mã hóa lại đều chạy trên một canvas cục bộ. Không có thanh tiến trình tải lên vì chẳng có lần tải lên nào — một tấm ảnh 40 megapixel đổi cỡ nhanh đúng bằng tốc độ máy bạn vẽ lại được nó, và vẫn chạy ngay cả khi bạn rút dây mạng.'
		],
		faqs: [
			{
				q: 'Thu nhỏ rồi phóng to lại có khôi phục được ảnh của tôi không?',
				a: 'Không — thu nhỏ vứt bỏ điểm ảnh vĩnh viễn. Đưa một tấm ảnh 3000px về 300px là chỉ giữ lại 1% dữ liệu; phóng ngược lên chỉ là nội suy 99% còn thiếu thành vệt mờ. Hãy giữ tệp gốc và xuất các bản đã thu nhỏ từ đó, thay vì đổi cỡ ngay trên bản duy nhất bạn có.'
			},
			{
				q: 'Vì sao ảnh phóng to của tôi trông mềm nhũn?',
				a: 'Phóng to không thể tạo ra chi tiết vốn chưa bao giờ được ghi lại — trình duyệt nội suy giữa các điểm ảnh sẵn có, và vượt quá khoảng 2× thì kết quả đọc ra là mờ. Muốn phóng to thật sự vượt mức đó thì cần các công cụ dựa trên học máy, vốn bịa ra chi tiết trông có lý; còn bộ lấy mẫu lại trên canvas thì cố ý không bịa gì cả.'
			},
			{
				q: 'Làm sao chạm đúng mốc dung lượng, kiểu “dưới 200 KB”?',
				a: 'Hãy dùng cả hai đòn bẩy: trước hết thu về kích thước lớn nhất mà bạn thật sự cần (ảnh rộng 1200px là quá đủ cho hầu hết bố cục web), rồi chọn WebP hoặc JPEG và hạ chất lượng cho tới khi ô kích thước tụt xuống dưới mốc. Việc giảm kích thước làm phần lớn công việc — chỉnh chất lượng chỉ tinh chỉnh phần còn lại.'
			},
			{
				q: 'Đổi kích thước có gỡ bỏ siêu dữ liệu EXIF như vị trí GPS không?',
				a: 'Có. Quy trình canvas mã hóa lại thuần điểm ảnh — model máy ảnh, dấu thời gian, tọa độ GPS và mọi thẻ EXIF khác đều biến mất khỏi tệp kết quả. Với ảnh sắp đưa lên web công khai thì đó thường là điểm cộng cho quyền riêng tư; còn nếu bạn cần giữ siêu dữ liệu, hãy giữ lại bản gốc bên cạnh.'
			}
		]
	},

	'favicon-generator': {
		about: [
			'Thả vào một tấm ảnh — lý tưởng là logo vuông từ 512px trở lên — và nhận về trọn bộ favicon: một tệp favicon.ico gói sẵn 16, 32 và 48 px cho tab và dấu trang, các tệp PNG ở những kích thước chuẩn gồm cả icon Apple touch 180px và icon PWA 192/512px, một tệp site.webmanifest khởi đầu, cùng các thẻ <link> để dán vào <head>. Chỉ một lần tải ZIP là có đủ, tên tệp đặt đúng như thông lệ mong đợi.',
			'Những chi tiết mà các bài hướng dẫn favicon hay làm sai đều đã được xử lý: tệp ICO nhúng các mục nén theo PNG (được hỗ trợ ở khắp nơi kể từ Windows Vista và nhỏ hơn nhiều so với icon BMP kiểu cũ); icon Apple touch được làm phẳng trên nền màu bạn chọn, vì iOS thay phần trong suốt bằng màu đen; còn icon PWA thì giữ nguyên kênh alpha. Ảnh nguồn không vuông sẽ được cắt theo tâm chứ không bị bóp méo.',
			'Thu một logo xuống 16px vốn dĩ là thao tác hủy hoại — chi tiết nhỏ đơn giản là không sống nổi — nên hàng xem trước hiển thị từng kích thước đúng theo kích cỡ thật, để bạn đánh giá độ dễ đọc trước khi đưa lên. Mọi thứ được vẽ trên canvas cục bộ và các gói ICO/ZIP được ráp từng byte ngay trong trang; logo của bạn không hề được tải lên đâu cả.'
		],
		faqs: [
			{
				q: 'Năm 2026 thì tôi thật sự cần những kích thước favicon nào?',
				a: 'Ít hơn lời đồn: một tệp favicon.ico chứa 16/32/48 cho các trường hợp cũ và thanh địa chỉ, một tệp apple-touch-icon.png 180px, cùng hai tệp PNG 192/512px được khai báo trong web app manifest. Trình duyệt hiện đại chọn bản phù hợp nhất từ đúng bộ này — mấy gói 20 tệp mà một số công cụ tuôn ra chỉ là thói quen sao chép mù quáng.'
			},
			{
				q: 'Vì sao logo của tôi không đọc nổi ở 16px?',
				a: 'Mười sáu điểm ảnh là nhỏ đến tàn nhẫn — chữ trong logo, nét mảnh và các mảng chuyển sắc tinh tế đều tan hết. Những favicon mạnh rút thương hiệu về một ký tự hoặc một hình khối đậm, tương phản cao. Nếu bản xem trước 16px ở đây chỉ còn là một mảng nhòe, hãy cắt sát vào phần đặc trưng nhất của biểu tượng hoặc dùng một biến thể đơn giản hóa cho các cỡ nhỏ.'
			},
			{
				q: 'Tôi còn cần tệp .ico không, hay favicon PNG là đủ?',
				a: 'Mọi trình duyệt hiện đại đều chấp nhận favicon PNG, nhưng /favicon.ico vẫn là đường dẫn mà các tác nhân người dùng, trình thu thập dữ liệu và công cụ cũ cứ thế gọi tới. Đặt một tệp ICO thật ở đó chỉ tốn vài kilobyte mà dẹp được cả một lớp lỗi 404 lẫn những hành vi dự phòng kỳ quặc — hãy giữ nó song song với các thẻ link PNG.'
			},
			{
				q: 'Vì sao icon Apple touch lại cần màu nền?',
				a: 'iOS không kết xuất phần trong suốt cho icon trên màn hình chính — kênh alpha trong tệp PNG của bạn sẽ bị ghép lên nền đen. Làm phẳng sẵn lên một màu do bạn chọn giúp kết quả đúng ý đồ. Hãy chọn nền hợp với icon, và nhớ rằng iOS tự bo góc, nên bạn chỉ cần cấp một hình vuông tràn viền.'
			}
		]
	},

	'sql-formatter': {
		about: [
			'Dán vào một câu truy vấn vừa moi ra từ tệp log, từ bản dump gỡ lỗi của ORM hay từ dòng lệnh một hàng của đồng nghiệp, và công cụ này sẽ tách nó thành các mệnh đề dễ đọc với thụt lề nhất quán. Sáu phương ngữ được hỗ trợ — SQL chuẩn, PostgreSQL, MySQL, SQLite, SQL Server và BigQuery — nên những cú pháp riêng của từng phương ngữ như TOP, định danh trong dấu huyền hay kiểu mảng đều được định dạng đúng thay vì làm bộ phân tích vấp ngã.',
			'Cách viết hoa từ khóa có thể chỉnh: VIẾT HOA cho vẻ ngoài kinh điển, viết thường nếu nhóm bạn thích thế, hoặc giữ nguyên bản gốc. Chế độ nén làm điều ngược lại — dồn một truy vấn đã định dạng về một dòng, bỏ chú thích nhưng giữ nguyên từng byte của các chuỗi hằng, đúng thứ bạn cần trước khi dán SQL vào một tệp cấu hình JSON hay một tham số dòng lệnh.',
			'Truy vấn thường chứa tên bảng, dữ liệu khách hàng nằm trong chuỗi hằng, hoặc manh mối về hạ tầng. Việc định dạng chạy hoàn toàn trong trình duyệt của bạn, nên chẳng thứ nào trong số đó tới được máy chủ.'
		],
		faqs: [
			{
				q: 'Tôi nên chọn phương ngữ SQL nào?',
				a: 'Phương ngữ mà cơ sở dữ liệu của bạn nói — nó quyết định cách phân tích định danh, cách đặt dấu nháy cho chuỗi và các từ khóa riêng. Nếu bạn chỉ cần dọn dẹp chung chung, SQL chuẩn xử lý được phần lõi phổ biến. Gặp lỗi phân tích trên cú pháp vốn hợp lệ với cơ sở dữ liệu của bạn thường là dấu hiệu nên đổi phương ngữ.'
			},
			{
				q: 'Định dạng có làm đổi ý nghĩa truy vấn không?',
				a: 'Không. Định dạng chỉ di chuyển khoảng trắng và, nếu bạn bật, đổi cách viết hoa từ khóa — còn định danh và chuỗi hằng vẫn giữ nguyên từng byte. Từ khóa SQL không phân biệt hoa thường trong mọi phương ngữ được hỗ trợ, nên SELECT và select là cùng một câu lệnh.'
			},
			{
				q: 'Tôi có định dạng nhiều câu lệnh cùng lúc được không?',
				a: 'Được — dán cả một script vào, mỗi câu lệnh kết thúc bằng dấu chấm phẩy sẽ được định dạng lần lượt, giữa các câu có một dòng trống.'
			},
			{
				q: 'Chế độ nén bỏ đi chính xác những gì?',
				a: 'Chú thích một dòng (--) và chú thích khối (/* */) bị loại, các chuỗi khoảng trắng gom lại thành một dấu cách, còn khoảng trắng quanh dấu phẩy và dấu ngoặc bị bỏ. Phần văn bản nằm trong nháy đơn, nháy kép và dấu huyền thì không bao giờ bị đụng tới, kể cả các dấu nháy nhân đôi để thoát ký tự.'
			}
		]
	},

	'xml-formatter': {
		about: [
			'Công cụ này trình bày XML cho đẹp mắt theo mức thụt lề bạn chọn, chỉ ra lỗi sai cấu trúc kèm đúng dòng và cột, và có thể nén tài liệu về một dòng. Chú thích, phần CDATA và phần khai báo mở đầu XML đều sống sót qua việc định dạng — số công cụ âm thầm nuốt mất chúng nhiều đến mức đáng ngạc nhiên.',
			'Kiểm tra ở đây nghĩa là kiểm tra tính đúng cấu trúc: thẻ lồng nhau đúng cách, thuộc tính có dấu nháy, ký tự hợp lệ. Chừng đó bắt được tuyệt đại đa số tai nạn khi sửa tay — thiếu một dấu gạch chéo, một phần tử chưa đóng, một dấu và đi lạc. Việc kiểm tra theo lược đồ XSD được cố ý để ngoài phạm vi; chỗ của nó là trong quy trình build của bạn, nơi có sẵn tệp lược đồ.',
			'Tệp cấu hình, dữ liệu SOAP, nguồn RSS và manifest Android thường xuyên chứa tên máy chủ nội bộ và khóa bí mật. Mọi thứ ở đây được phân tích cục bộ — không có gì được truyền đi.'
		],
		faqs: [
			{
				q: 'Vì sao XML của tôi báo lỗi “char … is not expected”?',
				a: 'Những thủ phạm quen mặt là một dấu & trần lẽ ra phải là &amp;, một giá trị thuộc tính thiếu dấu nháy, hoặc các thẻ đóng sai thứ tự. Thông báo lỗi mang theo dòng và cột của ký tự sai đầu tiên, và ô nhập cũng đánh dấu vị trí đó.'
			},
			{
				q: 'Công cụ có sắp xếp lại hay chuẩn hóa tài liệu của tôi không?',
				a: 'Không. Các phần tử, thuộc tính và thứ tự của chúng được giữ nguyên chính xác; chỉ khoảng trắng giữa các phần tử thay đổi. Phần văn bản nằm chung dòng với thẻ sẽ bị cắt bớt và các chuỗi khoảng trắng bên trong bị gom lại — nếu bạn phụ thuộc vào khoảng trắng có ý nghĩa (xml:space="preserve"), hãy giữ những phần đó ở dạng đã nén.'
			},
			{
				q: 'Chế độ nén bỏ đi những gì?',
				a: 'Phần thụt lề và ngắt dòng giữa các phần tử, cộng thêm chú thích. Phần CDATA, chỉ thị xử lý và khai báo mở đầu vẫn còn nguyên. Kết quả được phân tích y hệt đối với mọi bên tiêu thụ không phụ thuộc vào các nút văn bản chỉ gồm khoảng trắng.'
			},
			{
				q: 'Nó có kiểm tra được theo XSD hay DTD không?',
				a: 'Không — công cụ chỉ kiểm tra tính đúng cấu trúc. Kiểm tra theo lược đồ cần có tệp lược đồ và một bộ máy XSD, việc đó nên làm trong chuỗi công cụ của bạn (xmllint --schema, hoặc thư viện XML của ngôn ngữ bạn dùng).'
			}
		]
	},

	'xml-to-json': {
		about: [
			'Chuyển XML sang JSON để đưa những phản hồi SOAP đời cũ, nguồn RSS hay tệp POM của Maven vào JavaScript, jq hoặc một API thuần JSON — hoặc đi chiều ngược lại và sinh XML từ dữ liệu JSON. Thuộc tính được giữ lại: chúng trở thành khóa "@_tên", còn phần văn bản đi kèm thuộc tính sẽ nằm dưới "#text", nên không thông tin nào lặng lẽ biến mất.',
			'Hai định dạng vốn bất đồng ở những điểm căn bản, và công cụ này chọn cách xử lý thực dụng đã thành chuẩn: các phần tử anh em trùng tên gộp lại thành mảng JSON, những giá trị trông như số thì thành số, còn không gian tên đi theo như một phần của tên phần tử. Với tài liệu thông thường, vòng XML → JSON → XML vẫn giữ được cấu trúc lẫn nội dung.',
			'Cả hai chiều đều chạy cục bộ trong trình duyệt của bạn. Dán một nguồn hóa đơn hay một phản hồi API vào mà chẳng có gì đi đâu cả.'
		],
		faqs: [
			{
				q: 'Vì sao một số giá trị trả về là số thay vì chuỗi?',
				a: 'Bộ phân tích nhận ra văn bản dạng số và chuyển đổi nó, đúng ý phần lớn bên tiêu thụ. Nhưng hãy coi chừng các mã có số 0 đứng đầu (mã sản phẩm, số điện thoại) — nếu điều đó quan trọng với dữ liệu của bạn, hãy thêm dấu nháy sau khi chuyển, hoặc xem kết quả chỉ như điểm khởi đầu.'
			},
			{
				q: 'Các phần tử lặp lại được xử lý thế nào?',
				a: 'Từ hai phần tử anh em cùng tên trở lên sẽ thành một mảng JSON dưới khóa đó. Nếu chỉ xuất hiện một lần thì nó vẫn là đối tượng thường — sự bất đối xứng ấy vốn nằm trong bản chất phép ánh xạ, nên mã tiêu thụ JSON nên chịu được cả hai hình dạng hoặc chuẩn hóa trước.'
			},
			{
				q: 'Khóa @_ và #text nghĩa là gì?',
				a: '@_ đánh dấu thứ vốn là thuộc tính XML, còn #text mang phần văn bản của phần tử khi nó đi kèm thuộc tính. Đưa đúng quy ước đó ngược lại theo chiều JSON → XML sẽ dựng lại được tài liệu ban đầu.'
			},
			{
				q: 'Vì sao chiều JSON → XML từ chối mảng ở cấp cao nhất của tôi?',
				a: 'Một tài liệu XML phải có đúng một phần tử gốc, mà mảng trần thì chẳng có phần tử gốc nào. Hãy bọc mảng vào một đối tượng — {"items": {"item": [...]}} — rồi công cụ sẽ sinh ra một tài liệu đúng cấu trúc.'
			}
		]
	},

	'markdown-to-html': {
		about: [
			'Viết hoặc dán Markdown vào và xem song song cả bản kết xuất lẫn phần HTML sinh ra — gồm tiêu đề, bảng kiểu GFM, gạch đầu dòng dạng danh sách việc cần làm, khối mã đóng khung và chữ gạch ngang. Chiều ngược lại chuyển HTML sẵn có thành Markdown sạch sẽ với tiêu đề ATX, gạch đầu dòng bằng dấu gạch ngang và khối mã đóng khung — đây là cách nhanh nhất để di dời nội dung CMS cũ vào một kho tài liệu.',
			'Bản xem trước được làm sạch trước khi kết xuất: script, iframe và các thuộc tính bắt sự kiện đều bị loại bỏ, nên một liên kết chia sẻ mang mã độc hại không thể chạy được gì trong trình duyệt của bạn. Ô kết quả HTML thì luôn hiển thị bản chuyển đổi thô để bạn chép vào template hay email.',
			'Việc chuyển đổi và xem trước đều chạy cục bộ. Bản nháp ghi chú phát hành có tên những tính năng chưa công bố vẫn nằm yên trên máy bạn.'
		],
		faqs: [
			{
				q: 'Đây là biến thể Markdown nào?',
				a: 'CommonMark cộng thêm những phần mở rộng của GitHub mà người ta thật sự dùng: bảng, chữ gạch ngang và tự động biến URL thành liên kết. Ngắt dòng mềm vẫn là mềm — một dòng mới đơn lẻ không biến thành <br>, khớp với cách GitHub kết xuất tài liệu.'
			},
			{
				q: 'Vì sao bản xem trước khác với phần HTML thô?',
				a: 'Bản xem trước đi qua một bộ làm sạch, loại bỏ thẻ script, các trình bắt sự kiện viết thẳng trong thẻ và những URL javascript: trước khi kết xuất. Ô kết quả thì bỏ qua bước làm sạch vì nó là văn bản chứ không phải mã đang được kết xuất — nếu bạn nhúng HTML do người dùng cung cấp, hãy tự làm sạch ở phía sau.'
			},
			{
				q: 'Chuyển HTML → Markdown trung thành đến đâu?',
				a: 'Các thành phần cấu trúc — tiêu đề, danh sách, liên kết, nhấn mạnh, mã, trích dẫn, ảnh — chuyển đổi gọn gàng. Phần HTML không có tương đương trong Markdown (bảng lồng nhau, thẻ div kèm class, style viết thẳng) sẽ đi qua ở dạng HTML thô hoặc mất phần định dạng, nên đọc soát lại một lượt sau đó là đáng.'
			},
			{
				q: 'Tôi có dùng được phần HTML sinh ra trong email không?',
				a: 'Được — kết quả là HTML ngữ nghĩa thuần túy, không có class và không tham chiếu stylesheet bên ngoài, đúng thứ mà các phần mềm email chịu được tốt nhất. Cần định dạng gì thì hãy viết thẳng vào thuộc tính style ở trên đó.'
			}
		]
	},

	'html-formatter': {
		about: [
			'Làm đẹp phần HTML vừa chui ra từ một bộ đóng gói, một trình cào dữ liệu hay một trình soạn thảo WYSIWYG: các phần tử được thụt lề theo mức bạn chọn, thuộc tính ở nguyên dòng của nó, còn nội dung trong pre và textarea được giữ nguyên từng byte. Chế độ nén loại bỏ chú thích và gom khoảng trắng giữa các thẻ — với trang viết tay thì thường giảm được 10–25% dung lượng.',
			'Phép nén ở đây cố tình dè dặt: script và style viết thẳng trong trang được bảo vệ, chú thích điều kiện vẫn sống sót, và một dấu cách giữa các phần tử nội tuyến được giữ lại để “bấm <a>vào đây</a> ngay” không dính liền thành một cục. Bạn nhận được một phép nén an toàn, chứ không phải kiểu nén tối đa bất chấp.',
			'Cả hai thao tác đều chạy cục bộ trong trình duyệt của bạn — trang chưa xuất bản và mã giao diện quản trị nội bộ không bao giờ rời khỏi máy bạn.'
		],
		faqs: [
			{
				q: 'Nén có làm hỏng JavaScript hay CSS viết thẳng trong trang không?',
				a: 'Không — các khối <script>, <style>, <pre> và <textarea> được loại hoàn toàn khỏi việc gom khoảng trắng. Chỉ phần mã nằm giữa các thẻ mới bị đụng tới. Muốn nén chính phần script thì hãy đưa chúng qua công cụ nén JavaScript riêng.'
			},
			{
				q: 'Vì sao bỏ khoảng trắng giữa các thẻ lại an toàn?',
				a: 'Phần lớn trường hợp là an toàn: khoảng trắng giữa các phần tử khối không tạo khác biệt thị giác nào. Nhưng giữa các phần tử nội tuyến thì có, nên bộ nén gom chúng về một dấu cách thay vì xóa hẳn. Những bố cục dựa vào mẹo khoảng trắng của inline-block là ngoại lệ hiếm hoi đáng liếc mắt kiểm tra.'
			},
			{
				q: 'Công cụ có sửa HTML sai chuẩn không?',
				a: 'Nó định dạng đúng thứ bạn đưa vào mà không đối chiếu với đặc tả HTML — thẻ chưa đóng thì vẫn cứ chưa đóng. Trình duyệt vốn dễ dãi với mớ thẻ lộn xộn, nên việc định dạng vẫn giúp bạn nhìn rõ cấu trúc đủ để phát hiện chỗ hỏng.'
			},
			{
				q: 'Nên dùng mức thụt lề bao nhiêu?',
				a: '2 dấu cách là quy ước thịnh hành trong các mã nguồn web và cũng là mặc định của phần lớn hướng dẫn phong cách của các framework. Chọn 4 nếu nhóm bạn đã thống nhất như vậy — đây thuần túy là chuyện hình thức.'
			}
		]
	},

	'css-formatter': {
		about: [
			'Bung phần CSS đã nén hoặc chép vội ở đâu đó về dạng mỗi dòng một khai báo, hoặc ép cả stylesheet lại cho môi trường production. Bộ làm đẹp chuẩn hóa thụt lề và vị trí dấu ngoặc nhọn; bộ nén thì bỏ chú thích, gom khoảng trắng và bỏ dấu chấm phẩy cuối cùng, trong khi vẫn để nguyên các chuỗi, phần nội dung trong url(...) và biểu thức calc().',
			'Bộ nén rất sòng phẳng về những gì nó không làm: nó không đổi tên bộ chọn, không gộp các quy tắc trùng lặp, cũng không viết lại mã màu. Nhờ vậy kết quả dễ đoán và an toàn với mọi stylesheet, kể cả những tệp đầy mẹo vặt và tiền tố nhà cung cấp — dán vào, nén, rồi đưa lên.',
			'Cũng như mọi công cụ ở đây, việc xử lý diễn ra cục bộ. Mã của một design system chưa công bố vẫn nằm trong trình duyệt của bạn.'
		],
		faqs: [
			{
				q: 'CSS sau khi nén nhỏ đi bao nhiêu?',
				a: 'Với CSS viết tay thì thường là 15–30%, phần lớn đến từ thụt lề và chú thích. Gzip trên máy chủ vốn đã loại bỏ phần lớn sự dư thừa đó, nên chênh lệch dung lượng truyền đi nhỏ hơn con số byte thô gợi ra — nhưng cứ nén, vì nó còn rút ngắn thời gian phân tích cú pháp.'
			},
			{
				q: 'Có an toàn với calc(), thuộc tính tùy chỉnh và media query không?',
				a: 'Có. Khoảng trắng bên trong calc() mang ý nghĩa và được giữ nguyên; các thuộc tính tùy chỉnh cùng những tham chiếu var() chỉ là khai báo bình thường nên còn nguyên vẹn; @media và các at-rule khác vẫn giữ cấu trúc.'
			},
			{
				q: 'Vì sao bộ chọn hậu duệ vẫn giữ khoảng trắng?',
				a: 'Vì “nav a” và “nava” chọn hai thứ khác nhau — dấu cách đó là một toán tử kết hợp chứ không phải chuyện trình bày. Bộ nén chỉ bỏ đi những khoảng trắng không mang ý nghĩa cú pháp.'
			},
			{
				q: 'Nó chuyển đổi được giữa LESS/SCSS và CSS không?',
				a: 'Không — cú pháp tiền xử lý cần được biên dịch chứ không phải định dạng. Phần SCSS thuần vốn cũng là CSS hợp lệ thì định dạng tốt; còn quy tắc lồng nhau và mixin thì không.'
			}
		]
	},

	'js-formatter': {
		about: [
			'Làm đẹp JavaScript với thụt lề và khoảng cách nhất quán — bung một bundle đi kèm ra để đọc xem nó thật sự làm gì, hoặc dọn dẹp đoạn mã vừa dán từ console. Bộ nén thì là hàng thật: Terser phân tích mã của bạn thành AST, loại bỏ mã chết, rút ngắn tên biến cục bộ và cắt chú thích — đúng bộ máy mà các bundler dùng khi lên production.',
			'Vì việc nén dựa trên AST, nó không bao giờ làm hỏng mã đang chạy theo kiểu mà các “bộ nén” dựa trên biểu thức chính quy vẫn gây ra: chuỗi, template literal, regex và những ca biên của ASI đều do một bộ phân tích thật sự xử lý. Lỗi cú pháp được báo kèm vị trí thay vì cho ra một kết quả hỏng.',
			'Terser chỉ được nạp khi bạn nén lần đầu, nhờ đó trang vẫn nhẹ, và nó chạy hoàn toàn trong trình duyệt của bạn — mã nguồn độc quyền không bao giờ rời khỏi máy bạn.'
		],
		faqs: [
			{
				q: 'Mã của tôi sẽ nhỏ đi bao nhiêu?',
				a: 'Mã viết tay thường giảm 30–60% trước khi gzip: khoảng trắng, chú thích và những cái tên cục bộ dài chiếm chừng đó. Mã vốn đã qua bundler thì co lại ít hơn nhiều — nó từng đi qua đúng phép biến đổi này một lần rồi.'
			},
			{
				q: 'Việc nén có làm đổi hành vi không?',
				a: 'Phép nén và rút gọn tên vẫn giữ nguyên ngữ nghĩa: chỉ tên cục bộ bị đổi, còn việc loại mã chết chỉ bỏ những nhánh chứng minh được là không thể chạy tới. Ngoại lệ kinh điển là loại mã dựa vào Function.prototype.name hay toString() của chính hàm nó.'
			},
			{
				q: 'Công cụ có bung ngược được mã production lấy từ một website không?',
				a: 'Bộ định dạng khôi phục khoảng trắng và cấu trúc, giúp luồng điều khiển đọc được — nhưng tên biến gốc cùng chú thích thì mất vĩnh viễn; bạn sẽ chỉ thấy a, b, c. Muốn gỡ lỗi nghiêm túc thì hãy ưu tiên source map nếu trang đó có kèm theo.'
			},
			{
				q: 'Nó có hỗ trợ TypeScript hay JSX không?',
				a: 'Không — cả hai đều cần bộ phân tích riêng. Hãy biên dịch sang JavaScript trước (tsc, esbuild), rồi mới định dạng hoặc nén phần kết quả ở đây.'
			}
		]
	},

	'string-escape': {
		about: [
			'Biến một chuỗi nhiều dòng có dấu nháy thành thứ bạn dán được vào một giá trị JSON, một literal JavaScript, một chuỗi Java, một nút văn bản XML, một literal SQL hay một ô CSV — và làm ngược lại khi bạn bắt gặp đoạn text đã thoát ký tự trong tệp log mà muốn đọc cho ra. Sáu phương ngữ, cả hai chiều.',
			'Mỗi phương ngữ bám theo đúng đặc tả của nó chứ không hạ xuống mẫu số chung: JSON thoát ký tự điều khiển thành \\uXXXX, JavaScript thoát thêm nháy đơn và dấu huyền, Java mã hóa phần ngoài ASCII thành các dãy UTF-16 \\u, SQL nhân đôi dấu nháy đơn, CSV bọc và nhân đôi theo RFC 4180, còn XML dùng năm thực thể định nghĩa sẵn của mình. Chiều bỏ thoát hiểu cả dạng \\x, \\u và \\u{…}, và báo rõ vị trí của những dãy sai định dạng.',
			'Chuỗi đã thoát ký tự thường là chuỗi kết nối, token và mảnh truy vấn. Công cụ này chạy cục bộ — cứ dán thoải mái.'
		],
		faqs: [
			{
				q: 'Với một tệp cấu hình JSON thì tôi cần phương ngữ nào?',
				a: 'JSON. Nó thoát dấu nháy kép, dấu gạch chéo ngược và các ký tự điều khiển đúng như RFC 8259 yêu cầu, đồng thời để phần unicode vẫn đọc được. Kết quả bỏ vừa vào bất kỳ giá trị chuỗi JSON nào — trừ cặp nháy bao ngoài, phần đó công cụ để bạn tự thêm.'
			},
			{
				q: 'Phương ngữ JSON và JavaScript khác nhau ra sao?',
				a: 'JavaScript thoát thêm nháy đơn và dấu huyền để kết quả an toàn với cả ba kiểu bọc chuỗi của JS. Còn JSON chỉ cần xử lý dấu nháy kép. Chiều bỏ thoát chấp nhận cả hai, cộng thêm các dạng \\x và \\u{…} mà JSON không định nghĩa.'
			},
			{
				q: 'Thoát ký tự cho SQL có làm việc ghép chuỗi dữ liệu người dùng trở nên an toàn không?',
				a: 'Nó tạo ra một literal chuỗi SQL đúng chuẩn (dấu nháy được nhân đôi), nhưng thoát-rồi-ghép vẫn là mẫu sai với dữ liệu không đáng tin — hãy dùng truy vấn tham số hóa. Công cụ này dành cho dữ liệu mẫu, migration và gỡ lỗi, chứ không phải để phòng chống injection.'
			},
			{
				q: 'Vì sao chuỗi của tôi bỏ thoát không thành công?',
				a: 'Một dấu gạch chéo ngược theo sau bởi thứ không phải chuỗi thoát hợp lệ (\\q, hay một \\u12 bị cụt) là sai định dạng, và thông báo lỗi sẽ nêu đúng vị trí. Nếu văn bản của bạn có đường dẫn Windows viết thẳng, hãy thoát nó trước — C:\\temp thực chất là một dấu tab trá hình.'
			}
		]
	},

	'number-base-converter': {
		about: [
			'Gõ một con số ở bất kỳ hệ cơ số nào và đọc nó đồng thời ở nhị phân, bát phân, thập phân và thập lục phân — cộng thêm mọi hệ cơ số tùy chọn tới 36. Công cụ hiểu các tiền tố (0x, 0o, 0b), việc nhóm chữ số giúp những giá trị dài dễ nhìn (1111 1111 · 255 · ff), còn phần hiển thị số bit cho bạn biết ngay giá trị đó có lọt vào 8, 32 hay 64 bit hay không.',
			'Phép tính dùng BigInt nên độ chính xác là tuyệt đối ở mọi kích cỡ: quyền truy cập tệp, màu ARGB, địa chỉ IP, tiền tố mã băm và ID cơ sở dữ liệu 64 bit đều chuyển đổi mà không dính kiểu làm tròn âm thầm vốn xảy ra với số JavaScript thông thường vượt quá 2⁵³.',
			'Số âm vẫn giữ dấu ở mọi hệ cơ số. Mọi thứ được tính cục bộ, tức thì, ngay khi bạn gõ.'
		],
		faqs: [
			{
				q: 'Chế độ tự nhận diện quyết định hệ cơ số bằng cách nào?',
				a: 'Dựa vào tiền tố: 0x là thập lục phân, 0o là bát phân, 0b là nhị phân; còn lại thì hiểu là thập phân. Những chuỗi như “ff” mà không có tiền tố thì mập mờ, nên hãy chọn HEX một cách tường minh — thông báo lỗi cũng sẽ nhắc bạn điều đó.'
			},
			{
				q: 'Những con số khổng lồ có thật sự chính xác không?',
				a: 'Có — phép chuyển đổi chạy trên BigInt, tức độ chính xác tùy ý. Số 18446744073709551615 (2⁶⁴−1) đi vòng vẫn khớp từng chữ số; một bộ chuyển đổi dựa trên số thực dấu phẩy động sẽ làm hỏng nó thành …551616.'
			},
			{
				q: 'Số âm được hiển thị thế nào trong hệ nhị phân?',
				a: 'Bằng dấu trừ (-1010), chứ không phải bù hai, vì bù hai đòi hỏi một độ rộng cố định. Muốn thấy mẫu bù hai, hãy cộng 2ⁿ vào giá trị âm của bạn theo độ rộng bạn quan tâm rồi chuyển đổi kết quả đó.'
			},
			{
				q: 'Hệ cơ số 36 dùng để làm gì?',
				a: 'Để tạo ID gọn: 0-9 cộng a-z là bảng ký tự dày đặc nhất mà vẫn không phân biệt hoa thường và an toàn cho URL. Nhiều dịch vụ rút gọn liên kết và hệ thống ticket mã hóa ID dạng số theo cách này — dán một cái vào và đọc ra con số nằm bên dưới.'
			}
		]
	},

	'text-to-hex': {
		about: [
			'Xem chính xác văn bản của bạn được tạo nên từ những byte nào: công cụ mã hóa văn bản sang UTF-8 rồi hiển thị dưới dạng giá trị byte thập lục phân, nhị phân hay thập phân — với ký tự phân tách, kiểu chữ hoa thường và tiền tố 0x do bạn chọn. Chiều giải mã thì cố tình dễ tính: nó nhận cả dãy liền mạch (48656c6c6f), các cặp cách nhau bằng dấu cách, kiểu viết ngăn bằng dấu hai chấm như địa chỉ MAC, lẫn các chuỗi thoát \\x.',
			'Vì phép mã hóa diễn ra ở mức byte theo UTF-8, các ký tự nhiều byte hiện ra đúng như chúng tồn tại trong bộ nhớ và trên đường truyền: é là c3 a9, 世 là e4 b8 96, còn emoji chiếm bốn byte. Nhờ vậy đây là cách nhanh nhất để mò ra lỗi lệch bảng mã, những bí ẩn quanh BOM, và mấy vụ “sao chuỗi này dài hơn vẻ ngoài của nó”.',
			'Nếu các byte giải ra không phải UTF-8 hợp lệ, công cụ sẽ nói thẳng thay vì in ra một mớ ký tự lỗi — dấu hiệu khá chắc rằng thứ bạn đang xem là dữ liệu nhị phân chứ không phải văn bản.'
		],
		faqs: [
			{
				q: 'Vì sao một ký tự lại thành mấy byte?',
				a: 'UTF-8 có độ dài thay đổi: ASCII vẫn một byte, phần lớn chữ cái châu Âu chiếm hai byte, ký tự CJK ba byte, emoji bốn byte. Thứ bạn thấy ở đây chính là dãy byte mà bất kỳ hệ thống dùng UTF-8 nào — tệp, HTTP, cơ sở dữ liệu — sẽ lưu cho đoạn văn bản của bạn.'
			},
			{
				q: 'Bộ giải mã chấp nhận những định dạng đầu vào nào?',
				a: 'Thập lục phân ở dạng dãy liền, dạng cặp cách nhau bằng dấu cách, có tiền tố 0x hoặc \\x, hoặc ngăn bằng dấu hai chấm/dấu phẩy; nhị phân ở dạng nhóm 8 bit có hoặc không có dấu cách; thập phân ở dạng các giá trị byte ngăn cách nhau. Ký tự phân tách lẫn lộn và khoảng trắng thừa sẽ được dọn tự động.'
			},
			{
				q: 'Vì sao khi giải mã lại báo các byte không phải UTF-8 hợp lệ?',
				a: 'Dãy byte đó vi phạm quy tắc UTF-8 — chẳng hạn một byte ff đứng lẻ, hay một byte tiếp nối mà không có byte dẫn đầu. Dữ liệu có thể là nhị phân, thuộc bảng mã cũ như Latin-1, hoặc bị cắt cụt giữa chừng một ký tự.'
			},
			{
				q: 'Cái này có giống bản hex dump từ xxd không?',
				a: 'Các giá trị byte thì giống hệt; xxd chỉ thêm phần offset và một cột ASCII. Hãy dán những cột thập lục phân của một bản dump xxd vào đây (bỏ cột offset) và nó sẽ giải mã ngon lành.'
			}
		]
	},

	'json-schema-validator': {
		about: [
			'Hai chiều của cùng một công việc: dán JSON mẫu vào để nhận về một schema draft-07 suy ra từ đó, hoặc dán cả dữ liệu lẫn schema để thấy mọi vi phạm được liệt kê kèm đường dẫn JSON của nó. Việc kiểm tra chạy trên Ajv — chính bộ máy mà phần lớn dịch vụ Node dùng — nên cái gì qua được ở đây thì cũng qua được trên CI.',
			'Phần suy diễn được làm với đầu óc thực chiến: khóa của đối tượng trở thành thuộc tính có kiểu và mục required, mảng gộp hình dạng của mọi phần tử, số nguyên được phân biệt với số thực, còn những khóa chỉ xuất hiện ở vài phần tử mảng sẽ được để ra ngoài required một cách đúng đắn. Kết quả là điểm khởi đầu để bạn siết chặt thêm bằng format, khoảng giá trị và mẫu.',
			'Phản hồi API và tệp cấu hình đúng là loại dữ liệu bạn ít muốn đặt trên máy chủ bên thứ ba nhất. Cả việc suy diễn lẫn việc kiểm tra đều chạy hoàn toàn trong trình duyệt của bạn.'
		],
		faqs: [
			{
				q: 'Bản draft nào của JSON Schema được hỗ trợ?',
				a: 'Phần suy diễn sinh ra draft-07, bản được hỗ trợ rộng rãi nhất trên các trình soạn thảo và trình kiểm tra. Phần kiểm tra chấp nhận draft-07 cùng những bản cũ hơn mà Ajv hiểu ở chế độ không nghiêm ngặt; các từ khóa của 2019-09/2020-12 phần lớn cũng chạy, vì từ khóa lạ chỉ bị bỏ qua chứ không gây lỗi chết.'
			},
			{
				q: 'Dấu $ trong đường dẫn vi phạm nghĩa là gì?',
				a: 'Đó là gốc của tài liệu, theo kiểu JSONPath: $.age nghĩa là thuộc tính age ở cấp cao nhất, còn $.items.2.name là trường name của phần tử mảng thứ ba. Đường dẫn rỗng ($) nghĩa là vi phạm nằm ở chính gốc tài liệu — sai kiểu, hoặc thiếu một thuộc tính bắt buộc.'
			},
			{
				q: 'Vì sao schema suy ra lại chặt hơn hoặc lỏng hơn tôi tưởng?',
				a: 'Nó mô tả đúng cái mẫu bạn đưa vào: trường nào có mặt ở mọi nơi thì thành bắt buộc, và chỉ những kiểu đã quan sát được mới được cho phép. Muốn schema tổng quát hơn, hãy đưa vào mẫu đa dạng hơn (một mảng gồm các đối tượng tiêu biểu) rồi chỉnh tay — phép suy diễn không thể đoán được ý định của bạn.'
			},
			{
				q: 'Việc kiểm tra có hỗ trợ format, pattern và các từ khóa ràng buộc khác không?',
				a: 'Các từ khóa về cấu trúc (type, required, properties, items, enum, minimum, pattern…) được áp dụng đầy đủ. Còn những chuỗi format như "email" hay "date-time" thì không bị bắt buộc kiểm chứng — điều này phản ánh đúng đặc tả JSON Schema, nơi format mặc định chỉ là chú thích, và giúp bạn tránh cảm giác an tâm giả tạo.'
			}
		]
	},

	'exif-viewer': {
		about: [
			'Mỗi tấm ảnh điện thoại bạn chụp đều mang theo siêu dữ liệu ẩn: model máy, thời điểm chụp, phần mềm chỉnh sửa — và nếu bạn không tắt đi thì có cả tọa độ GPS của chỗ bạn đứng. Công cụ này đọc phần siêu dữ liệu đó từ tệp JPEG, PNG và WebP rồi trình bày theo nhóm và đã được giải nghĩa: thông số phơi sáng thành f/2.8 và 1/250 s, hướng ảnh thành chữ, còn GPS thành tọa độ thập phân kèm liên kết bản đồ.',
			'Phần làm sạch tạo ra một bản sao đã gỡ siêu dữ liệu — và làm điều đó không mất dữ liệu. Thay vì mã hóa lại tấm ảnh (vốn đánh đổi chất lượng), nó gỡ các đoạn siêu dữ liệu theo từng byte: khối EXIF và XMP trong JPEG, các chunk văn bản và thời gian trong PNG, chunk EXIF/XMP trong WebP. Điểm ảnh, kích thước và chất lượng vẫn nguyên vẹn; hồ sơ màu được giữ lại nên ảnh vẫn hiển thị y hệt.',
			'Đây là nhóm công cụ mà chuyện “chạy cục bộ” chính là toàn bộ ý nghĩa: muốn kiểm tra xem ảnh có dữ liệu GPS hay không mà lại phải tải nó lên máy chủ thì hỏng hết mục đích. Tệp không bao giờ rời khỏi trình duyệt của bạn — bạn kiểm chứng được ngay ở tab Network.'
		],
		faqs: [
			{
				q: 'Gỡ siêu dữ liệu có làm giảm chất lượng ảnh không?',
				a: 'Không. Luồng dữ liệu ảnh được sao chép nguyên từng bit; chỉ các đoạn siêu dữ liệu bị bỏ đi. Tệp sau khi làm sạch nhỏ hơn đúng bằng dung lượng phần siêu dữ liệu, còn điểm ảnh thì giống hệt và chứng minh được điều đó.'
			},
			{
				q: 'Vì sao ảnh chụp màn hình của tôi không có siêu dữ liệu nào?',
				a: 'Ảnh chụp màn hình và hầu hết ảnh xuất ra cho web vốn chưa từng có EXIF — máy ảnh mới ghi phần đó, còn công cụ chụp màn hình thì phần lớn là không. Các nền tảng mạng xã hội cũng gỡ siêu dữ liệu khi bạn tải lên, nên ảnh tải về từ đó thường đã sạch sẵn.'
			},
			{
				q: 'Vị trí GPS có chính xác không?',
				a: 'GPS của điện thoại ghi trong EXIF thường chính xác tới vài mét — đủ để xác định một tòa nhà. Công cụ chuyển phần độ/phút/giây đã lưu sang dạng thập phân và liên kết tới đúng điểm đó, để bạn thấy chính xác thứ mà người nhận tệp có thể thấy.'
			},
			{
				q: 'Vì sao tệp đã làm sạch vẫn giữ hồ sơ màu ICC?',
				a: 'Hồ sơ ICC cho phần mềm biết phải diễn giải màu sắc ra sao — gỡ nó đi có thể làm màu lệch thấy rõ, mà bản thân nó lại không chứa thông tin cá nhân nào. Phần làm sạch chỉ gỡ những siêu dữ liệu có tính nhận dạng (EXIF, XMP, IPTC, chú thích, dấu thời gian) và giữ lại những gì tấm ảnh cần để hiển thị đúng.'
			}
		]
	}
};

export default TOOL_CONTENT_VI;
