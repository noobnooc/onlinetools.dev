import type { ToolContent } from './content';

/**
 * Turkish long-form tool copy (About + FAQ). Written entry by entry against
 * the English content.ts; anything missing falls back to English.
 */
const TOOL_CONTENT_TR: Record<string, ToolContent> = {
	'json-formatter': {
		about: [
			'Herhangi bir JSON yapıştırın — bir API yanıtı, bir yapılandırma dosyası, bir log satırı — bu biçimlendirici onu seçtiğiniz girintiyle düzgünce yazar ya da gömmek için tek satıra küçültür. Ayrıştırma tarayıcının yerleşik JSON motoruyla yapılır; yani burada geçerli sayılan şey, JavaScript’in ve JSON uyumlu her ayrıştırıcının kabul edeceği şeydir.',
			'Girdi geçersizse hata, bir yerlerde beliren muğlak bir “unexpected token” yerine ayrıştırmanın tam olarak hangi satır ve sütunda takıldığıyla işaretlenir. Eşaralıklı düzenleyiciyle birleşince 500 satırlık bir yükte eksik virgül aramak on saniyelik bir işe döner. Nesne anahtarlarını alfabetik olarak da sıralayabilirsiniz; bu, iki yükü karşılaştırmadan önce çok işe yarar.',
			'Biçimlendirme tamamen tarayıcınızda çalışır. Token, müşteri kaydı veya iç ağ adresleri içeren yükler makinenizden hiç çıkmaz — onları kaydedebilecek bir sunucu yok.'
		],
		faqs: [
			{
				q: 'JSON’um gayet düzgün görünüyor, neden “Unexpected token” hatası veriyor?',
				a: 'Olağan şüpheliler: son öğeden sonra kalan virgül, çift tırnak yerine tek tırnak, tırnaksız anahtarlar veya yorum satırları. Bunların hepsi JavaScript nesne değişmezlerinde (ya da JSON5’te) sorunsuzdur ama katı JSON’da geçersizdir. Satır/sütun işareti ilk sorunlu karakteri gösterir.'
			},
			{
				q: 'Boyut sınırı var mı?',
				a: 'Katı bir sınır yok — ayrıştırma yerelde olduğu için her şey makinenize bağlı. Onlarca megabaytlık belgeler modern bir tarayıcıda sorunsuz biçimlenir; bunun ötesinde belge tümüyle bellekte tutulduğundan sekme yavaşlayabilir.'
			},
			{
				q: 'Biçimlendirme verimi değiştirir mi?',
				a: 'Anahtar sıralamayı açmadığınız sürece yalnızca boşlukları. Sayılar JavaScript motoru tarafından yeniden serileştirilir; yani 1e2 100 olur ve IEEE-754 çift duyarlığın ötesindeki tam sayılar normalleştirilir — JSON’unuzu tüketen herhangi bir JS istemcisi de tam olarak bunu yapardı.'
			},
			{
				q: 'JSON’u yeniden biçimlendirmeden yalnızca doğrulayabilir miyim?',
				a: 'Evet — girdinin üzerindeki durum rozeti siz yazdıkça güncellenir ve belgenin ayrıştırılıp ayrıştırılmadığını, boyutunu ve ilk hatanın yerini bildirir. Biçimlendir eylemine yalnızca çıktının yeniden yazılmasını istediğinizde ihtiyacınız olur.'
			}
		]
	},

	'base64-decode': {
		about: [
			'Base64, rastgele baytları JSON’a, URL’lere, HTTP başlıklarına ve e-postaya yapıştırılmaya dayanan 64 karakterlik bir alfabeye çevirir. Bu araç iki yönde de çalışır: kodlamak için metin yazın ya da yapıştırın, çözmek için kodlanmış bir bloğu yapıştırın. UTF-8 her iki yönde de doğru işlenir; böylece emoji ve Latin dışı yazılar bozulmadan gidip gelir.',
			'Çözücü bilerek hoşgörülüdür: URL güvenli alfabeyi (+ ve / yerine - ve _) kabul eder, boşlukları ve satır sonlarını temizler ve çözmeden önce eksik dolguyu tamamlar — daha katı çözücülerin kurtarılabilir girdileri reddetmesine en sık yol açan üç şey. Çözülen baytlar geçerli UTF-8 metni değilse çöp basmak yerine bunu söyler; bu genellikle yükün görsel gibi ikili veri olduğu anlamına gelir.',
			'Her şey sayfanın içinde olur. Burada bir token ya da kimlik bilgisi çözmek onu hiçbir yere iletmez.'
		],
		faqs: [
			{
				q: 'Base64 dizgem neden = işaretleriyle bitiyor?',
				a: 'Base64 her 3 baytı 4 karaktere kodlar; girdi uzunluğu 3’ün katı olmadığında gruplar hizalı kalsın diye çıktı = ile doldurulur. Dolgu veri taşımaz; bu çözücü kırpılmışsa onu kendiliğinden geri koyar.'
			},
			{
				q: 'Standart Base64 ile URL güvenli Base64 arasındaki fark ne?',
				a: 'Standart Base64, URL’lerde özel anlamı olan ve ayrıca kaçışlanması gereken + ve / kullanır. URL güvenli varyant (RFC 4648 §5) bunları - ve _ ile değiştirir ve genelde dolguyu atar. Örneğin JWT’ler URL güvenli biçimi kullanır. Buradaki kodlayıcı ikisini de sunar; çözücü ikisini de kendiliğinden kabul eder.'
			},
			{
				q: 'Base64 bir şifreleme mi?',
				a: 'Hayır. Base64, anahtarı olmayan tersine çevrilebilir bir kodlamadır — herkes çözebilir. Veriyi okunmaktan değil, aktarım sırasında bozulmaktan korur. Gizlilik gerekiyorsa önce şifreleyin, sonra şifreli metni kodlayın.'
			},
			{
				q: 'Çözme neden sonucun geçerli UTF-8 olmadığını söylüyor?',
				a: 'Dizge başarıyla çözüldü ama ortaya çıkan baytlar metin değil — çoğunlukla bir PNG, bir PDF ya da sıkıştırılmış/şifrelenmiş veri. Böyle bir içeriği metin kutusuna dökmek anlamsız karakterler gösterirdi; araç bunun yerine durumu bildirir.'
			}
		]
	},

	'timestamp-converter': {
		about: [
			'Unix zamanı 1970-01-01T00:00:00 UTC’den bu yana geçen saniyeleri sayar ve her yerde karşınıza çıkar: veritabanı satırları, JWT iddiaları, log dosyaları, API yanıtları. Bu dönüştürücü saniye ya da milisaniye cinsinden bir zaman damgasını kabul eder — hangisi olduğunu büyüklüğünden anlar — ayrıca ISO 8601 dizgelerini ve insan tarafından yazılmış çoğu tarihi de alır; sonra bütün gösterimleri tek seferde verir: ISO, UTC, kendi yerel saatiniz, göreli zaman ve iki unix hassasiyeti.',
			'Klasik tuzak birim belirsizliğidir: 1700000000 saniye cinsinden Kasım 2023, milisaniye cinsinden ise Ocak 1970’tir. Algılanan birim açıkça gösterilir ve tahmin yanlışsa tek tıkla değiştirebilirsiniz — artık zihninizde basamak saymanıza gerek yok.',
			'Dönüştürme anında ve yereldir; geçerli zaman göstergesi de saymaya devam ettiği için siz çalışırken sayfa aynı zamanda bir epoch saati işlevi görür.'
		],
		faqs: [
			{
				q: 'Araç saniye ile milisaniye arasında nasıl karar veriyor?',
				a: 'Büyüklüğe bakarak: 11 ve daha fazla basamaklı değerler milisaniye, daha kısaları saniye sayılır. Bu, saniyeleri ~5138 yılına kadar, milisaniyeleri ise ~1973’ten itibaren eşler; yani gerçekçi her modern zaman damgasını belirsizlik bırakmadan çözer. Sınır durumlar için birimi elle de değiştirebilirsiniz.'
			},
			{
				q: '2038’den sonra ne oluyor?',
				a: '2038 sorunu, unix zamanını işaretli 32 bitlik tam sayıda saklayan sistemleri etkiler. JavaScript sayıları 64 bit kayan noktalıdır; bu yüzden bu dönüştürücü 2038’in çok ötesindeki tarihleri — JavaScript Date sınırı olan 275760 yılına kadar — sorunsuz işler.'
			},
			{
				q: 'Bir tarihi zaman damgasına geri çevirebilir miyim?',
				a: 'Evet. 2026-07-20T12:00:00Z gibi bir ISO 8601 dizgesini ya da alışılmış tarih biçimlerinin çoğunu yapıştırın; unix saniye ve milisaniye değerleri diğer gösterimlerin yanında belirir.'
			},
			{
				q: 'Yerel saat satırında hangi saat dilimi kullanılıyor?',
				a: 'Tarayıcınızda ayarlı olan saat dilimi, Intl API üzerinden — uzaktan hiçbir sorgu yapılmaz. Saat dilimi adı değerin yanına yazılır, böylece ekran görüntüleri belirsiz kalmaz.'
			}
		]
	},

	'jwt-decoder': {
		about: [
			'JSON Web Token, noktalarla birleştirilmiş üç Base64URL parçasından oluşur: başlık, yük ve imza. Bu çözücü token’ı parçalarına ayırır, başlık ile yükü biçimlendirilmiş JSON olarak gösterir, kayıtlı zaman iddialarını (iat, exp, nbf) okunabilir tarihlere çevirir ve token’ın süresinin dolup dolmadığını bir bakışta söyler.',
			'Çözmek doğrulamak değildir: Base64URL bir kodlamadır, şifreleme değil; bu yüzden herhangi bir JWT’nin yükünü, token elinde olan herkes okuyabilir. Bir token’ı rastgele bir siteye yapıştırmanın neden kötü fikir olduğu da budur — bu sayfa istisnadır, çünkü çözme tamamen tarayıcınızda olur ve token hiçbir yere iletilmez. Gizli anahtar ya da açık anahtarla imza doğrulaması, çevrimdışı çözücünün kapsamı dışında bırakılmıştır.',
			'Baştaki “Bearer ” öneki kendiliğinden kırpılır; yani doğrudan bir Authorization başlığından yapıştırabilirsiniz.'
		],
		faqs: [
			{
				q: 'Buraya bir üretim token’ı yapıştırmak güvenli mi?',
				a: 'Token tarayıcınızda kalır — bu sayfa girdinizle hiçbir ağ isteği yapmaz; geliştirici araçlarının Network sekmesinden doğrulayabilirsiniz. Yine de canlı token’lara parola gibi davranmayı alışkanlık edinin: ekran görüntüsü paylaşırken süresi dolmuş ya da test token’larını tercih edin.'
			},
			{
				q: 'Token’ım neden çözülemiyor?',
				a: 'Nokta ile ayrılmış tam olarak üç parçası olduğunu ve kopyalarken araya satır sonu girmediğini denetleyin. Opak erişim token’ları (örneğin pek çok GitHub veya Google token’ı) zaten JWT değildir — içinde hiç JSON olmayan rastgele bir dizgeyi hiçbir çözme işlemi açamaz.'
			},
			{
				q: 'iat, exp ve nbf ne anlama geliyor?',
				a: 'Bunlar RFC 7519’daki kayıtlı iddialardır ve hepsi unix saniyesi cinsindendir: iat token’ın verildiği an, exp geçerliliğinin bittiği an, nbf (“not before”) ise kabul edilebileceği en erken andır. Bu araç her birini okunabilir tarihe çevirir ve exp değerini sizin saatinizle karşılaştırır.'
			},
			{
				q: 'Bu araç imzayı doğrulayabilir mi?',
				a: 'Hayır — zaten çevrimiçi bir aracın gösterdiği yeşil onay işaretine güvenlik kararlarında güvenilmemeli. İmzaları kendi arka ucunuzda, bakımı sürdürülen bir kütüphaneyle (jose, jsonwebtoken, PyJWT) ve verenin gerçek anahtarlarıyla doğrulayın.'
			}
		]
	},

	'regex-tester': {
		about: [
			'Bir desen yazın, örnek metni yapıştırın; siz yazdıkça her eşleşme vurgulanır — yakalama grupları, adlandırılmış gruplar ve eşleşme konumları da hemen altta listelenir. Test aracı JavaScript RegExp motorunu kullanır; yani davranış, geriye bakış, adlandırılmış gruplar ve Unicode özellik kaçışları dâhil olmak üzere Node.js ile tarayıcıların yapacağıyla birebir aynıdır.',
			'Bayraklar harf harf açılıp kapanır (g, i, m, s, u, y, d) ve desen her tuş vuruşunda derlenir; sözdizimi hataları bir düğmeye basmanızı beklemeden, doğrudan motorun kendi mesajıyla belirir. a* gibi boş eşleşme üreten desenler güvenle işlenir ve başıboş bir .* sekmeyi dondurmasın diye eşleşmeler 10.000 ile sınırlanır.',
			'Regex lehçeleri motordan motora değişir — burada çalışan bir desen PCRE, RE2 ya da Python’un re modülü için ayarlama gerektirebilir; farklar çoğunlukla geriye bakış desteği, sahiplenici niceleyiciler ve satır içi bayraklar etrafındadır.'
		],
		faqs: [
			{
				q: 'Bu test aracı hangi regex lehçesini kullanıyor?',
				a: 'Kendi tarayıcınızın uyguladığı biçimiyle ECMAScript (JavaScript). İleriye bakış, geriye bakış, adlandırılmış yakalama grupları, geri başvurular ve (u bayrağıyla) \\p{Letter} gibi Unicode özellik kaçışlarını destekler. Sahiplenici niceleyiciler veya özyineleme gibi yalnızca PCRE’ye özgü sözdizimini desteklemez.'
			},
			{
				q: 'Desenim neden her şeyi / hiçbir şeyi eşleştiriyor?',
				a: 'İki klasik neden: kaçışlanmamış bir üst karakter (. herhangi bir karakteri eşler — düz nokta için \\. yazın) ya da zihninizde unutulan g bayrağı. Bu test aracı her zaman tüm eşleşmeleri bulur; ama kodunuz g ayarlı değilse yalnızca ilkini bulacaktır.'
			},
			{
				q: 'Adlandırılmış yakalama grupları nedir?',
				a: '(?<ad>...) sözdizimi bir grubu etiketler; böylece eşleşmeleri konumla değil adla okursunuz: JavaScript’te match.groups.ad. Eşleşmelerin altındaki grup paneli her eşleşme için hem numaralı hem adlandırılmış yakalamaları gösterir.'
			},
			{
				q: 'Buradaki bir regex Python ya da Go’da olduğu gibi çalışır mı?',
				a: 'Çoğu zaman evet, ama her zaman değil. Karakter sınıfları, niceleyiciler ve çapalar taşınabilirdir; geriye bakış, adlandırılmış grup sözdizimi (Python (?P<ad>...) kullanır) ve satır içi bayraklar farklıdır. Go’nun RE2 motoru ayrıca geri başvuruları ve etrafa bakışı tümüyle reddeder.'
			}
		]
	},

	'diff-checker': {
		about: [
			'Solda özgün metni, sağda değiştirilmiş sürümü yapıştırın; satır satır birleşik bir karşılaştırma elde edin: silmeler kırmızı, eklemeler yeşil, aradaki bağlam korunmuş ve her iki tarafta özgün satır numaraları. İki yapılandırma, iki API yanıtı ya da birinin sohbete yapıştırdığı bir parçanın iki sürümü arasında “aslında ne değişti?” sorusunu yanıtlamanın en hızlı yolu budur.',
			'Karşılaştırma, satırlar üzerinde en uzun ortak alt dizi algoritmasını kullanır — git diff’in arkasındaki algoritma ailesinin aynısı — böylece yer değiştirmiş bloklar ve küçük düzenlemeler her şeyi değişmiş göstermek yerine okunabilir bir sonuç üretir. Bir özet satırı eklenen ve silinen satırların toplamını verir.',
			'Her iki metin de sayfada kaldığı için gizli malzemeyi — sözleşmeler, yapılandırmalardaki kimlik bilgileri, yayımlanmamış metinler — karşılaştırmak, rastgele bir web servisine yapıştırmanın risklerini hiç taşımaz.'
		],
		faqs: [
			{
				q: 'Fark kelime bazında mı yoksa satır bazında mı çalışıyor?',
				a: 'Satır bazında. Her satır tek bir birim olarak karşılaştırılır; bu, geliştiricilerin kod ve yapılandırma farklarını okuma biçimiyle örtüşür. Bu yüzden değişen bir satır, bir silme artı bir ekleme olarak görünür; karakter düzeyinde satır içi vurgulama yol haritasındadır.'
			},
			{
				q: 'Farkım neden her şeyi değişmiş gösteriyor?',
				a: 'Genelde görünmeyen farklardan: bir taraf sekme, diğeri boşluk kullanıyordur; Windows CRLF satır sonlarına karşı Unix LF vardır ya da satır sonlarında boşluk kalmıştır. Karşılaştırmadan önce boşlukları normalleştirmek (JSON yükleri için anahtarları sıralayan JSON biçimlendirici işe yarar) gerçek değişiklikleri görünür kılar.'
			},
			{
				q: 'İki JSON yanıtını anlamlı biçimde karşılaştırabilir miyim?',
				a: 'Evet — önce ikisini de anahtar sıralaması açıkken JSON biçimlendiriciden geçirin ki eşdeğer belgeler aynı şekilde serileştirilsin. O zaman fark, anahtar sırasından gelen gürültü yerine gerçek değer değişikliklerini gösterir.'
			},
			{
				q: 'Azami bir metin boyutu var mı?',
				a: 'Algoritma bir metnin her satırını diğerinin her satırıyla karşılaştırır; bu yüzden çok büyük dosyalar (her iki tarafta on binlerce satır) biraz zaman alabilir. Tipik kod dosyaları ve API yükleri anında karşılaştırılır.'
			}
		]
	},

	'url-encode-decode': {
		about: [
			'Boşluk, ve işareti ya da ASCII dışı harfler bir URL’de ham hâlleriyle bulunamaz; bu yüzden yüzde kodlanırlar: boşluk %20, 你 ise %E4%BD%A0 olur. Bu araç metni URL’ye güvenle konabilecek şekilde kodlar ve yüzde kaçışlı dizgeleri okunur metne geri çözer; sorgu dizgelerinde boşluk için kullanılan + geleneği de dâhil.',
			'İki kodlama modu sunulur, çünkü JavaScript’in kendisinde de iki tane vardır: bileşen modu (encodeURIComponent) URL’yi bölebilecek her şeyi kaçışlar — tek bir sorgu değeri için isteyeceğiniz budur; tam URI modu (encodeURI) ise /, ? ve & gibi yapısal karakterleri korur, yani gezinilebilir kalması gereken bütün bir URL’yi kodladığınız durumlar için uygundur.',
			'Çözme, bozuk % dizileri konusunda katıdır — tek başına bir % ya da %ZZ sessizce geçirilmek yerine hata olarak bildirilir; tarayıcılar ve sunucular da tam olarak böyle davranır.'
		],
		faqs: [
			{
				q: 'Ne zaman bileşen modunu, ne zaman tam URI modunu kullanmalıyım?',
				a: 'Bir URL’nin içine girecek bir değeri kodluyorsanız (arama sorgusu, yönlendirme hedefi, parametredeki e-posta adresi) → bileşen modu; böylece değerin içindeki & ve = sorgu dizgesini bozmaz. Görüntülemek veya taşımak için eksiksiz bir URL kodluyorsanız → tam URI modu; böylece URL’nin yapısı korunur.'
			},
			{
				q: '+ neden bazen boşluk anlamına geliyor?',
				a: 'HTML form gönderimlerinde ve sorgu dizgelerinde kullanılan application/x-www-form-urlencoded biçimi, tarihsel olarak boşlukları + ile kodlar. URL yollarında ise + sadece artı işaretidir. Buradaki çözücü sorgu dizgesi anlambilimine uyarak + karakterini boşluk sayar; %20 ise her yerde çalışır.'
			},
			{
				q: 'Dizgem neden çift kodlanmış görünüyor (%2520)?',
				a: '%25, % karakterinin kendi kodlamasıdır; yani %2520, %20 metninin ikinci kez kodlandığı anlamına gelir. Bu, sistemin iki katmanının da kodlama yapmasıyla olur. Açmak için burada iki kez çözün, sonra kodlamaması gereken katmanı düzeltin.'
			},
			{
				q: 'Unicode karakterler doğru işleniyor mu?',
				a: 'Evet — WHATWG URL standardına göre metin önce UTF-8 olarak kodlanır, sonra her bayt yüzde kaçışlanır. Tek bir CJK karakterinin üç %XX grubuna dönüşmesinin nedeni budur.'
			}
		]
	},

	'url-parser': {
		about: [
			'Bir URL yapıştırın ve onu parçalarına ayrılmış görün: protokol, host, port, yol, parça ve çözülmüş anahtar-değer tablosu hâlinde her sorgu parametresi. Araç, tarayıcınızın gezinme için kullandığı WHATWG URL ayrıştırıcısının aynısını kullanır; yani gördüğünüz yorum, bir tarayıcının gerçekten uygulayacağı yorumdur — varsayılan portların düşürülmesi ve yolların normalleştirilmesi gibi sınır durumlar dâhil.',
			'En çok kullanacağınız kısım sorgu parametresi tablosudur: uzun OAuth yönlendirmeleri, analitik etiketli bağlantılar ve API çağrıları bir bakışta okunur hâle gelir, üstelik her değer zaten yüzde çözülmüş olarak. Şeması olmayan çıplak alan adları da kabul edilir; ayrıştırma için https:// varsayılır.',
			'URL kodlayıcıyla doğal bir ikili oluşturur — istediğiniz parametreyi bulmak için URL’yi burada ayrıştırın, değeri düzenleyin, sonra orada yeniden kodlayın.'
		],
		faqs: [
			{
				q: 'Ayrıştırılan URL neden yapıştırdığımdan biraz farklı?',
				a: 'WHATWG ayrıştırıcısı normalleştirme yapar: şemayı ve host’u küçük harfe çevirir, varsayılan portları (https için :443) kaldırır, ./ ve ../ yol parçalarını çözer ve gerekli karakterleri kodlar. Gördüğünüz şey, sunucuların ve tarayıcıların üzerinde anlaştığı kanonik biçimdir.'
			},
			{
				q: 'Yinelenen sorgu anahtarları olan URL’leri işleyebiliyor mu?',
				a: 'Evet — her geçiş, sırasıyla kendi satırında listelenir. Yinelenen anahtarlar hem geçerli hem yaygındır: pek çok API bunları dizi olarak okur (?tag=a&tag=b).'
			},
			{
				q: 'host ile hostname arasındaki fark ne?',
				a: 'hostname yalnızca alan adıdır (example.com); host ise varsayılan olmayan açık bir portu da içerir (example.com:8080). Port, şemanın varsayılanı olduğunda port atlandığı için ikisi aynı görünür.'
			},
			{
				q: 'Parça (#...) sunucuya gönderiliyor mu?',
				a: 'Hayır. # işaretinden sonraki her şey tarayıcıda kalır — sunucular onu hiç görmez. Tek sayfalık uygulamaların tarihsel olarak istemci tarafı yönlendirmede bunu kullanmasının ve # sonrasına konan analitik parametrelerinin arka uca görünmez olmasının nedeni budur.'
			}
		]
	},

	'uuid-generator': {
		about: [
			'Evrensel benzersiz kimlikleri dört çeşitte üretin: UUID v4 (tamamen rastgele, günlük varsayılan), UUID v7 (zamana göre sıralı, veritabanı anahtarları için modern seçim), ULID (zamana göre sıralı, derli toplu Crockford Base32 yazımıyla) ve Nano ID (kısa, URL dostu). Tek seferde bir tane ya da bine kadar üretin — her satırda bir tane, bir seed betiğine yapıştırmaya hazır.',
			'Rastgelelik, Math.random’dan değil, kriptografik olarak güvenli kaynak olan Web Crypto API’sinden (crypto.getRandomValues) gelir. Üretim yereldir; yani kimlikleri başka kimse bilmez, hiçbir yere kaydedilmez ve çevrimdışıyken de üretilebilir.',
			'Yeni bir sistem için kimlik biçimi seçiyorsanız: v7 ve ULID oluşturulma zamanına göre sıralanır, bu da B-ağacı indekslerini mutlu eder ve loglarda kimlikleri kabaca kronolojik kılar; v4 ise ne zaman üretildiğine dair hiçbir şey açık etmez, ki bazen tam olarak istediğiniz şey budur.'
		],
		faqs: [
			{
				q: 'UUID v4 ile v7 arasındaki fark ne?',
				a: 'v4, 122 rastgele bittir. v7 (RFC 9562) ise başta 48 bitlik unix milisaniye zaman damgası, ardından rastgele bitler taşır; böylece sonra üretilen kimlikler sonra sıralanır. Veritabanı birincil anahtarları için v7 genelde ekleme yerelliğini ve indeks boyutunu iyileştirir; sıralamanın önemsiz olduğu ya da zamanlamanın sızmaması gereken yerlerde v4 gayet uygundur.'
			},
			{
				q: 'Üretilen iki UUID çakışabilir mi?',
				a: '122 rastgele bitle olasılık, etrafında mühendislik yapmaya değmeyecek kadar küçüktür: uzaktan bir ihtimale ulaşmak için bile onlarca yıl boyunca saniyede milyarlarca kimlik üretmeniz gerekirdi. Pratikte çakışmalar rastgelelikten değil hatalardan gelir (seed’i yeniden kullanmak, satırları kopyalamak).'
			},
			{
				q: 'Neden UUID v7 yerine ULID seçeyim?',
				a: 'İkisi de aynı sorunu çözer. ULID, büyük/küçük harf duyarsız 26 karakterlik Crockford Base32’dir — URL’lerde ve loglarda daha kısa ve temiz görünür — v7 ise her veritabanının ve kütüphanenin zaten kabul ettiği standart 36 karakterlik UUID şeklini korur. Ekosisteminizin daha doğal işlediğini seçin.'
			},
			{
				q: 'Bu kimlikleri sır ya da token olarak kullanmak güvenli mi?',
				a: 'Rastgelelik kriptografik olarak güvenlidir ama kimlikler genelde gösterilir, loglanır ve indekslenir — yani herkese açık kabul edilir. Oturum token’ları veya API anahtarları için en az 128 rastgele bitlik ayrı bir sır üretin ve ona parola gibi davranın.'
			}
		]
	},

	'hash-generator': {
		about: [
			'Herhangi bir metnin MD5, SHA-1, SHA-256, SHA-384 ve SHA-512 özetlerini, ayrıca anahtarlı HMAC imzalarını doğrudan tarayıcıda hesaplayın. SHA ailesi ve HMAC, Web Crypto API’sini kullanır — tarayıcınızın TLS için kullandığı, denetlenmiş ilkellerin aynısı — Web Crypto’nun bilerek dışarıda bıraktığı MD5 ise eski sağlama toplamı işleri için küçük bir yerel uygulamayla gelir.',
			'Özetler siz yazdıkça anlık güncellenir ve tüm algoritmalar aynı anda hesaplanır; böylece bir indirme sayfasının seçtiği hangi algoritma olursa olsun bir değeri sağlama toplamıyla karşılaştırmak hiçbir ayar gerektirmez. HMAC modu, webhook imzalarını doğrulamak için bir gizli anahtar alanı ekler — GitHub, Stripe ve çoğu webhook sağlayıcısı yükleri HMAC-SHA256 ile imzalar.',
			'Girdi sayfadan hiç çıkmadığı için, çevrimiçi bir servise yapıştıramayacağınız şeyleri hash’lemek güvenlidir: API yükleri, sızmış hash listesine karşı denetlediğiniz parolalar, iç belgeler.'
		],
		faqs: [
			{
				q: 'Hangi hash algoritmasını kullanmalıyım?',
				a: 'Bugün güvenlikle ilgili her şey için: SHA-256 ya da daha güçlüsü. MD5 ve SHA-1 çakışma direnci açısından kırılmıştır — aynı özeti veren iki farklı girdi üretilebilir — bu yüzden yalnızca düşmanca olmayan sağlama toplamlarında ve eski protokol uyumluluğunda hayatta kalırlar.'
			},
			{
				q: 'MD5 neden hâlâ sunuluyor?',
				a: 'Çünkü hâlâ karşınıza çıkıyor: ETag’ler, önbellek anahtarları, dosya manifestoları, eski veritabanı sütunları. Böyle değerleri doğrulamak, kriptografik durumundan bağımsız olarak MD5 hesaplamayı gerektirir. Yeter ki yeni hiçbir şeyi onun üzerine kurmayın.'
			},
			{
				q: 'HMAC nedir, düz bir hash’ten farkı ne?',
				a: 'HMAC, hash’lemeye gizli bir anahtar karıştırır; böylece özeti yalnızca anahtarı elinde tutanlar üretebilir ya da doğrulayabilir. Düz hash bütünlüğü kanıtlar (“bu veri değişmedi”); HMAC ayrıca özgünlüğü de kanıtlar (“bunu anahtarı olan biri üretti”). Günlük kullanımı webhook imza doğrulamasıdır.'
			},
			{
				q: 'Hash’lemek bir parolayı şifrelemekle aynı şey mi?',
				a: 'Hayır ve SHA-256 gibi hızlı hash’ler parola saklamak için yanlış araçtır — saldırganlar saniyede milyarlarcasını deneyebilir. Parola saklamak bilerek yavaşlatılmış, tuzlanmış bir algoritma ister: bcrypt, scrypt ya da Argon2.'
			}
		]
	},

	'case-converter': {
		about: [
			'Tanımlayıcılar sürekli bir gelenekten diğerine gider: API snake_case döner, TypeScript’iniz camelCase ister, CSS sınıfı kebab-case ister, ortam değişkeni ise CONSTANT_CASE dayatır. Bu dönüştürücü karışık her girdiyi — boşluklar, alt çizgiler, tireler, hâlihazırdaki camelCase — alır, akıllıca kelimelere böler ve dokuz hedef biçimde aynı anda yeniden birleştirir.',
			'Bölücü zor durumları anlar: “getUserByID” ifadesini get/user/by/id olarak ayırır (kısaltmayı sınıra kadar bütün tutar), rakamları ait oldukları kelimenin parçası sayar ve her satırı bağımsız işler; yani bir veritabanı alanları sütununun tamamını yapıştırıp tek seferde dönüştürebilirsiniz.',
			'Her biçim, satır başına kopyalama düğmesiyle aynı anda gösterilir — önce mod seçmek yok, sadece yapıştırın ve ihtiyacınız olanı alın.'
		],
		faqs: [
			{
				q: '“HTTPResponse” gibi kısaltmalar nasıl işleniyor?',
				a: 'Ardından küçük harf gelen büyük harf dizisi, son büyük harften önce bölünür: HTTPResponse → http + response. Bu, çoğu biçem kılavuzunun kısaltmalardan beklediği ayrıştırmayla örtüşür; yine de hiçbir bölücü niyeti kusursuz tahmin edemez — “IOError” gibi sınır durumlar io + error olur.'
			},
			{
				q: 'Aynı anda birçok tanımlayıcıyı dönüştürebilir miyim?',
				a: 'Evet — her satır bağımsız dönüşür. Sütun adlarından oluşan bir listeyi her satıra bir tane olacak şekilde yapıştırın; çıktı satır yapısını yeni biçimde korur.'
			},
			{
				q: 'Buradaki Title Case ile Sentence case arasındaki fark ne?',
				a: 'Title Case her kelimeyi büyük harfle başlatır (“User Account Id”); Sentence case yalnızca ilkini (“User account id”). İkisi de artikeller ve edatlarla ilgili yayıncılık kurallarını uygulamaz — zaten tanımlayıcılarda bunları neredeyse hiç istemezsiniz.'
			},
			{
				q: 'İleri geri dönüştürmek neden her zaman özgün hâlimi geri getirmiyor?',
				a: 'Kelimelere bölmek bilgi kaybettirir — “user_ID_2” ve “userId2” aynı şekilde ayrıştırılır. Dönüşümler ileri yönde belirlenimlidir ama kelime sınırlarının özgün yazımı geriye doğru her zaman yeniden kurulamaz.'
			}
		]
	},

	'word-counter': {
		about: [
			'Geliştiricilerin ve yazarların gerçekten ihtiyaç duyduğu sayıları veren canlı bir kelime ve karakter sayacı: kelimeler, boşluklu ve boşluksuz karakterler, UTF-8 baytları (veritabanı sütununuzun ya da API sınırınızın aslında ölçtüğü şey), satırlar, cümleler, paragraflar ve dakikada tipik 220 kelime üzerinden tahmini okuma süresi.',
			'Karakterler UTF-16 birimleri olarak değil, Unicode kod noktaları olarak sayılır; böylece emoji ve CJK metni bir insanın bekleyeceği gibi sayılır — ayrı bayt sayacı da farkı görünür kılar: 日本語 3 karakterdir ama 9 bayttır. VARCHAR(255) bir sütun 200 “karakterlik” bir dizgeyi reddettiğinde canınızı yakan tam olarak bu ayrımdır.',
			'Her şey siz yazdıkça güncellenir ve hiçbir yere hiçbir şey gönderilmez — duyuru taslaklarını, sözleşmeleri ya da henüz dünyaya hazır olmayan başka metinleri saymak için güvenlidir.'
		],
		faqs: [
			{
				q: 'Karakter ve bayt sayıları neden farklı?',
				a: 'Karakterler Unicode kod noktalarıdır; baytlar ise onların UTF-8 kodlamasıdır. ASCII harfleri 1 bayt, çoğu aksanlı Avrupa harfi 2 bayt, CJK karakterleri 3 bayt, emojiler 4 bayt (dizilerde daha fazla) yer kaplar. Veritabanı sınırları, HTTP başlıkları ve pek çok API karakteri değil baytı ölçer.'
			},
			{
				q: 'Boşluk kullanmayan dillerde kelimeler nasıl sayılıyor?',
				a: 'Kelime sayımı boşluklara göre bölme yapar; bu da Çince veya Japonca gibi bölütlenmemiş metinleri olduğundan az sayar. Bu diller için daha anlamlı ölçüt karakter sayısıdır — her ikisinin de her zaman gösterilmesinin nedeni budur.'
			},
			{
				q: 'Ne cümle sayılıyor?',
				a: 'Ardından boşluk ya da girdinin sonu gelen ., !, ? veya … ile biten metin dizileri. “örn.” gibi kısaltmalar sayıyı bir miktar şişirebilir — cümle sayımı doğası gereği sezgiseldir.'
			},
			{
				q: 'Okuma süresi ne kadar isabetli?',
				a: 'Kelime sayısını, yetişkinlerin genel düzyazıyı sessiz okuma hızının yaygın ortalaması olan 220 kelime/dakikaya böler. Kod içeren teknik metinler daha yavaş, göz gezdirilen listeler daha hızlı okunur. Bunu büyüklük mertebesi tahmini olarak görün.'
			}
		]
	},

	'lorem-ipsum-generator': {
		about: [
			'Yerleşimler, taslak tasarımlar ve örnek veriler için tarayıcınızda üretilen yer tutucu metin: kelime, cümle ya da paragraf seçin, bir adet belirleyin ve kopyalayın. Çıktı klasik karıştırılmış Cicero sözcük dağarcığından beslenir; böylece dikkat dağıtan okunabilir cümleler kurmadan doğal, Latince benzeri bir düzyazı görünümü verir.',
			'Varsayılan olarak metin, tasarımcıların ve gözden geçirenlerin yer tutucu olduğunu anında anladığı geleneksel “Lorem ipsum dolor sit amet” ifadesiyle başlar; birbirinden farklı birden çok blok gerektiğinde bunu kapatıp tümüyle rastgele çıktı alabilirsiniz.',
			'Cümle uzunlukları ve paragraf boyutları gerçekçi aralıklarda rastgele değişir; böylece ortaya çıkan metin gerçek bir kopyanın görsel ritmini taşır — tipografiyi ya da satır sarmayı değerlendirirken bu önemlidir, çünkü tek düze cümleler yapay görünür.'
		],
		faqs: [
			{
				q: 'Lorem ipsum nereden geliyor?',
				a: 'Cicero’nun “De finibus bonorum et malorum” (MÖ 45) eserinden karıştırılmış parçalardır; en azından 1960’lardan beri dizgiciler tarafından dolgu metni olarak kullanılmış, Letraset şablonları ve sonrasında masaüstü yayıncılık yazılımlarıyla yaygınlaşmıştır.'
			},
			{
				q: 'Gerçek metin yerine neden lorem ipsum kullanılır?',
				a: 'Okunabilir içerik dikkati kaçırır — gözden geçirenler yerleşimi değerlendirmek yerine kelimeleri düzeltmeye başlar. Sözde Latince, okunabilir olmadan doğal harf sıklıklarına ve kelime uzunluklarına sahiptir; bu da odağı tasarımda tutar.'
			},
			{
				q: 'Üretilen metin her seferinde aynı mı?',
				a: 'Hayır — kelimeler her defasında rastgele seçilir, dolayısıyla iki üretim birbirinden farklı olur. Yalnızca isteğe bağlı klasik açılış cümlesi sabittir.'
			},
			{
				q: 'Bir CMS alan sınırı için belirli bir kelime sayısı üretebilir miyim?',
				a: 'Evet — birimi kelime yapın ve sayıyı tam ihtiyacınız kadar ayarlayın, tek seferde 1000’e kadar. Karakter ya da bayt sınırlarına karşı doğrulamak için kelime sayacı aracıyla birlikte kullanın.'
			}
		]
	},

	'slug-generator': {
		about: [
			'Herhangi bir başlığı URL’ye hazır bir slug’a çevirin: küçük harf, tireyle ayrılmış, noktalama işaretlerinden arındırılmış ve aksanları düz ASCII’ye çevrilmiş — “Crème brûlée à Paris” ifadesi “creme-brulee-a-paris” olur. Seçenekler yaygın varyasyonları kapsar: alt çizgi ayırıcı, büyük/küçük harfi koruma ve kelimenin ortasından değil, kelime sınırından kesen bir azami uzunluk.',
			'Slug’lar hem insanlar hem arama motorları için önemlidir: adres çubuğunda okunurlar, sohbete yapıştırıldığında yüzde kaçışına uğramadan hayatta kalırlar ve arama sonuçlarına anahtar kelime taşıyan bir URL kazandırırlar. Ev yapımı slugify işlevlerinin çoğunun atladığı adım harf çevirisidir — o olmadan aksanlı başlıklar ya URL’leri bozar ya da tümüyle kaybolur.',
			'Her satır bağımsız olarak slug’a dönüşür; yani yapıştırılmış bir makale başlıkları listesi tek işlemde eşleşen bir slug listesine dönüşür.'
		],
		faqs: [
			{
				q: 'Neden alt çizgi yerine tire?',
				a: 'Arama motorları tireyi kelime ayırıcı sayar ama tarihsel olarak alt çizgiyi kelime birleştirici saymıştır; ayrıca altı çizili bağlantı metninde tire görsel olarak daha nettir. Alt çizgi ise dosya adları ve tanımlayıcılarda popülerliğini korur, bu yüzden ikisi de sunulur.'
			},
			{
				q: 'Çince veya Kiril gibi Latin dışı yazılara ne olur?',
				a: 'ASCII karşılığı olan karakterler (aksanlı Latin harfleri, ß → ss gibi birkaç özel harf) çevrilir; basit bir Latin eşlemesi olmayan yazılar kaldırılır. Latin dışı içerikte yaygın uygulama, ya yerel yazıyı URL’de yüzde kodlu tutmak ya da elle romanize bir slug yazmaktır.'
			},
			{
				q: 'İdeal bir slug uzunluğu var mı?',
				a: 'Paylaşım ve görüntüleme için kısa olan daha iyidir ama sıralamada bir uçurum yoktur. Azami uzunluk seçeneği kelime sınırından kırpar — slug sütunlarını 50–80 karakterle sınırlayan CMS’ler için kullanışlıdır.'
			},
			{
				q: 'Başlık değiştiğinde slug da değişmeli mi?',
				a: 'Yayımlandıktan sonra ideal olarak hayır — URL, başkalarının bağlantı verdiği bir adrestir. Çoğu site özgün slug’ı korur ya da bir yönlendirme ekler. Slug’ları oluşturma anında üretin ve yeniden adlandırmayı bilinçli bir yönlendirme kararı olarak ele alın.'
			}
		]
	},

	'sort-lines': {
		about: [
			'Bir satır işleme tezgâhı: herhangi bir listeyi yapıştırın ve alfabetik, ters, doğal (item2, item10’dan önce) ya da uzunluğa göre sıralayın veya karıştırın — bu arada isterseniz boşlukları kırpın, boş satırları atın ve sırayı bozmadan yinelenenleri kaldırın. Kaldırılan satır sayısı bildirilir; böylece yineleme temizliğinin ne yaptığını tam olarak görürsünüz.',
			'En sık uzanacağınız seçenek doğal sıralamadır: düz alfabetik sıralama karakter karakter karşılaştırdığı için “item10” değerini “item2” önüne koyar; doğal sıralama ise gömülü sayıları sayısal olarak karşılaştırır — dosya adları, sürümler ve kimlikler için insanların beklediği sıra budur.',
			'Yineleme temizliği ilk geçişi korur ve hayatta kalanların özgün sırasını bozmaz; liste sırası anlamlı olduğunda (import’lar, yapılandırma satırları, çalma listeleri) bu önemlidir. Büyük/küçük harf duyarsız mod “Apple” ile “apple” satırlarını aynı sayar.'
		],
		faqs: [
			{
				q: 'Alfabetik ve doğal sıralama arasındaki fark ne?',
				a: 'Alfabetik sıralama karakter kodlarını karşılaştırır; bu yüzden “file10” < “file2” olur (5. konumda “1” < “2” olduğu için). Doğal sıralama rakam dizilerini tanır ve onları sayı olarak karşılaştırır, yani file2 < file10. İçinde sayı geçen her şeyde doğal sıralamayı kullanın.'
			},
			{
				q: 'Yineleme temizliği ilk geçişi mi son geçişi mi tutuyor?',
				a: 'İlkini. Satırlar yukarıdan aşağıya taranır ve bir satır yalnızca daha önce özdeşi (büyük/küçük harf duyarsız modda harf farkı gözetilmeden eşiti) geçtiyse atılır — böylece hayatta kalan sıra özgün sırayla örtüşür.'
			},
			{
				q: 'Bu araç ne kadar büyük bir listeyi kaldırır?',
				a: 'Yüz binlerce satır sorun değildir — işlemler basit geçişlerden ve bir sıralamadan ibarettir. Her şey tarayıcı belleğinde kaldığı için pratik sınır bir sunucu kotası değil, kendi makinenizdir.'
			},
			{
				q: 'İşlemleri birleştirebilir miyim?',
				a: 'Evet ve mantıklı bir sırada uygulanırlar: önce kırpma, sonra boşları atma, sonra yineleme temizliği, en son sıralama — böylece kırpma açıkken “ apple ” ile “apple” birlikte temizlenir ve sıralama her zaman temizlenmiş listeyi görür.'
			}
		]
	},

	'html-entities': {
		about: [
			'Metni HTML’e güvenle koymak için kaçışlayın — & işareti &amp; olur, < işareti &lt; olur — ya da varlık dolu metni okunur karakterlere geri çözün; adlandırılmış varlıklar (&rarr;), ondalık (&#169;) ve onaltılık (&#xA9;) sayısal başvurular desteklenir.',
			'Kodlama iki düzey sunar: HTML yapısını bozan beş temel karakter (& < > " \') — doğruluk için gereken tek şey budur — ya da ASCII dışındaki her şey; ikincisi, sizinle sayfa arasındaki bir araç zinciri UTF-8’i bozduğunda işe yarar. Yalnızca sayısal mod, katı XML ayrıştırıcılarıyla azami uyum için adlandırılmış varlıkları atlar; çünkü XML yalnızca önceden tanımlı beş varlığı garanti eder.',
			'Günlük hayatta asıl kullanılan yarısı çözücüdür: kazınmış bir parçayı ya da &#x27; dolu bir API yanıtını yapıştırın, temiz metni alın. Tanınmayan varlık adları tahmin edilmeye çalışılmadan olduğu gibi geçirilir.'
		],
		faqs: [
			{
				q: 'HTML’de hangi karakterler kaçışlanmalı?',
				a: 'Metin içeriğinde: & ve <. Öznitelik değerlerinde: ayrıca özniteliği sınırlayan tırnak karakteri (" veya \'). > karakterini kaçışlamak alışılmış bir uygulamadır ama kesin olarak gerekli değildir. Geri kalan her şey UTF-8 bir belgede olduğu gibi görünebilir.'
			},
			{
				q: 'Varlık kodlaması XSS’e karşı bir savunma mı?',
				a: 'Beş yapısal karakteri kaçışlamak HTML bağlamındaki çıktı kodlamasının çekirdeğidir, evet — ama yalnızca HTML metni ve öznitelik bağlamları için. URL’ler, JavaScript dizgeleri ve CSS kendi bağlama özgü kodlamalarını ister; oralarda tek başına varlık kaçışlaması keyfî enjeksiyonu güvenli kılmaz.'
			},
			{
				q: 'Adlandırılmış mı sayısal varlık mı üretmeliyim?',
				a: 'Sayısal başvurular (&#xE9;) her HTML ve XML ayrıştırıcısında çalışır. Adlandırılmış varlıklar daha okunaklıdır ama XML yalnızca beş tanesini önceden tanımlar; yani &eacute; katı bir XML/XHTML hattını bozar. Tereddüt ediyorsanız sayısal kullanın.'
			},
			{
				q: 'Verimde neden &amp;#39; (çift kodlanmış) görüyorum?',
				a: 'İki katman birer kez kodlamış: ilk kodlamanın & işareti ikinci geçişte yeniden kaçışlanmış. Metni kurtarmak için burada iki kez çözün, sonra kodlamaması gereken katmanı bulup düzeltin.'
			}
		]
	},

	'unicode-inspector': {
		about: [
			'Herhangi bir metni yapıştırın ve her karakteri parçalarına ayrılmış görün: kod noktası (U+XXXX), UTF-8 baytları, UTF-16 birimleri, JavaScript kaçış dizisi, HTML varlığı ve genel kategori — ayrıca kod noktaları, UTF-16 birimleri, UTF-8 baytları ve kullanıcının algıladığı karakterler (grafem kümeleri) için toplamlar.',
			'Bu, “bu dizge neden tuhaf?” anlarının aracıdır: görünmez karakterler (sıfır genişlikli boşluklar, BOM’lar, yön işaretleri) görünür satırlar hâlinde ortaya çıkar; birbirine benzeyen karakterler (Kiril а ile Latin a) farklı kod noktaları olduklarını açık eder; ve “tek karakter olan” bir emoji, sıfır genişlikli birleştiricilerle bağlanmış yedi kod noktası çıkar.',
			'Dört ayrı uzunluk toplamı, JavaScript’in .length değerinin, bir veritabanı bayt sınırının ve kullanıcının gördüğünün bir dizgenin uzunluğu konusunda neden asla anlaşamadığı sorusunu yanıtlar.'
		],
		faqs: [
			{
				q: 'JavaScript’te "🎉".length neden 2?',
				a: 'JavaScript dizgeleri UTF-16 kod birimlerini sayar. U+FFFF üzerindeki karakterler — çoğu emoji dâhil — vekil çifti, yani iki birim gerektirir. İnceleyici hem birimleri hem gerçek kod noktasını gösterir, özet ise ikisini ayrı ayrı sayar.'
			},
			{
				q: 'Grafem kümesi nedir?',
				a: 'Okuyucunun tek karakter olarak algıladığı şeydir. é iki kod noktası olabilir (e + birleşen aksan) ve aile emojileri sıfır genişlikli birleştiricilerle bağlanmış yedi ya da daha fazla kod noktasından oluşabilir. Grafem sayımı tarayıcının Intl.Segmenter’ını kullanır — “kullanıcının gördüğü karakterler”e en yakın şey.'
			},
			{
				q: 'Bir dizgedeki görünmez karakterleri nasıl bulurum?',
				a: 'Buraya yapıştırın — her kod noktası bir satır alır; sıfır genişlikli boşluklar (U+200B), bölünemez boşluklar (U+00A0), BOM’lar (U+FEFF) ve yön işaretleri dâhil, her biri kategorisiyle etiketlenmiş olarak. Bunlar, eşitlik denetimlerinden geçemeyen “özdeş” dizgelerin ardındaki klasik suçlulardır.'
			},
			{
				q: 'UTF-8 bayt dizileri bana ne anlatıyor?',
				a: 'Tam olarak neyin saklanacağını ya da iletileceğini: ASCII bir bayt, çoğu Latin genişletmesi iki, CJK üç, emoji dört bayttır. Bir sistem dizinin ortasından kırparsa yerine koyma karakterleri (�) alırsınız — bayt görünümü böyle kesiklerin nereye denk geleceğini gösterir.'
			}
		]
	},

	'cron-parser': {
		about: [
			'Beş alanlı bir cron ifadesi yapıştırın; sade bir dille açıklamasını, alan alan dökümünü ve — gerçek hataları yakalayan kısım — yerel saat diliminizde hesaplanmış sonraki beş çalışma zamanını alın. “0 3 * * 1” ifadesi “Saat 03:00’te, pazartesi günleri” diye okunur, ardından tetikleneceği somut tarihler gelir.',
			'Ayrıştırıcı standart sözdiziminin tamamını destekler: listeler (1,15), aralıklar (9-17), adımlar (*/15), ay ve gün adları (jan, mon), pazar için 7 ve @daily/@hourly makro ailesi. Ayrıca herkesin unuttuğu kuralı da uygular: ayın günü ve haftanın günü aynı anda kısıtlandığında iş, ikisi birden değil, herhangi biri eşleştiğinde çalışır.',
			'Altı alanlı (saniyeli, Quartz) ifadeler sessizce yanlış ayrıştırılmak yerine tespit edilip açıkça bildirilir — Java zamanlayıcılarıyla Unix crontab arasında gidip gelirken yaşanan “cron’um yanlış çalışıyor” kafa karışıklığının en yaygın kaynağı budur.'
		],
		faqs: [
			{
				q: 'Beş alan sırasıyla nedir?',
				a: 'Dakika (0–59), saat (0–23), ayın günü (1–31), ay (1–12), haftanın günü (0–6; pazar = 0, ayrıca 7 de pazar kabul edilir). Sırayı hatırlamak ebedî bir mücadeledir — döküm paneli ifadenizdeki her alanı etiketler.'
			},
			{
				q: '“0 0 1 * 1” neden beklediğimden daha sık çalışıyor?',
				a: 'Hem ayın günü (1’i) hem haftanın günü (pazartesi) kısıtlandığı için cron, işi HERHANGİ BİRİ eşleştiğinde çalıştırır — yani her ayın 1’inde VE her pazartesi. “Yalnızca pazartesiye denk gelen 1’inde” demek için betik tarafında tarih denetimi gerekir.'
			},
			{
				q: 'Sonraki çalışma zamanları hangi saat dilimini kullanıyor?',
				a: 'Sonuçların yanında gösterilen, tarayıcınızın yerel saat dilimini. Gerçek crontab’lar sunucunun saat diliminde (ya da bazı cron’lardaki TZ= satırında) çalışır — özellikle yaz saati geçişlerinde, hedef makinenin neyi kullandığını her zaman doğrulayın.'
			},
			{
				q: 'Saniyeleri veya yılları destekliyor mu?',
				a: 'Hayır — bunlar 6 ya da 7 alanlı Quartz (Java) uzantılarıdır. Standart Unix cron’un tam olarak beş alanı ve bir dakikalık çözünürlüğü vardır. Altı alanlı girdi tespit edilir ve yanlış okunmak yerine Quartz olarak bildirilir.'
			}
		]
	},

	'password-generator': {
		about: [
			'Seçtiğiniz uzunluk ve karakter kümeleriyle, gerekirse toplu hâlde rastgele parolalar üretin — dekoratif bir renk çubuğu değil, dürüst bir entropi hesabıyla, yani rastgelelik bitleriyle. Rastgelelik, ret örneklemesiyle birlikte crypto.getRandomValues’tan gelir; böylece her karakter modülo sapması olmadan tekdüze seçilir.',
			'Etkin her karakter kümesinden en az bir temsilci garanti edilir (pek çok sitenin dayattığı bir politika), ardından parolanın geri kalanı tekdüze doldurulur ve tamamı karıştırılır — böylece garanti edilen karakterler başta öngörülebilir biçimde kümelenmez.',
			'Belirsiz karakter filtresi, bir insanın sesli okuyabileceği ya da kâğıttan tekrar yazabileceği parolalarda birbirine benzeyenleri (0/O, 1/l/I) eler. Üretim yerel olduğu için parolalar, siz bir yere koyana kadar yalnızca sizin makinenizde vardır.'
		],
		faqs: [
			{
				q: 'Entropi bitleri ne anlama geliyor?',
				a: 'Entropi = uzunluk × log2(havuz boyutu): bir saldırganın taraması gereken eşit olasılıklı ihtimallerin sayısı. 64 bit entropi gelişigüzel saldırıya dayanır; 80 bit ve üzeri hızlı hash’lerin çevrimdışı kırılmasına karşı güçlüdür; 100 bit ve üzeri pratikte tahmin edilemez. Harf+rakam+sembol üzerinden 16 karakterlik bir parola yaklaşık 104 bittir.'
			},
			{
				q: 'Uzun ve tamamı küçük harf bir parola, kısa ve karmaşık olandan daha mı iyi?',
				a: 'Çoğu zaman evet — uzunluk entropiyi çarparken ek kümeler yalnızca logaritmanın tabanını genişletir. 20 küçük harf (~94 bit), tamamen karışık 10 karakteri (~65 bit) geçer. Karmaşıklık kuralları çoğunlukla kelime listelerini boşa çıkarmak için vardır; rastgele üretim bunu zaten yapar.'
			},
			{
				q: 'Tarayıcıda parola üretmek güvenli mi?',
				a: 'Rastgelelik (crypto.getRandomValues), yerel parola yöneticilerinin kullandığı CSPRNG’nin aynısıdır ve bu sayfa verinizle hiçbir ağ isteği yapmaz. Gerçekçi riskler üretimden sonrasındadır: pano geçmişi, ekran paylaşımı ve parolayı nerede sakladığınız.'
			},
			{
				q: 'Belirsiz karakterler neden dışlanıyor?',
				a: 'İnsanlar tarafından okunacak parolalar için — basılı kurtarma kodları, telefonda söylenenler, başka bir ekrandan yazılanlar — 0/O ve 1/l/I gerçek destek talepleri doğurur. Yalnızca yapıştırılacak parolalarda onları tutun; dışlamanın entropi kaybı iki durumda da küçüktür.'
			}
		]
	},

	'qr-code-generator': {
		about: [
			'Herhangi bir metni yazın ya da yapıştırın — bir URL, WiFi bilgileri, iletişim bilgileri — ve anında bir QR kod alın; indirebileceğiniz keskin bir vektör SVG olarak işlenir, sohbetler ve sunumlar için PNG olarak dışa aktarılır. Filigran yok, süresi dolan “ücretsiz katman” yönlendirmesi yok ve üretim yerel olduğu için kodladığınız şey hiçbir sunucuya değmez.',
			'Bu son nokta göründüğünden daha önemlidir: pek çok ücretsiz QR servisi URL’nizi kendi yönlendirme alan adından geçirir (sonradan ücretlendirebilmek ya da taramaları izleyebilmek için); yani servis kapandığında kod da çalışmaz olur. Burada üretilen kodlar içeriğinizi doğrudan kodlar ve sonsuza kadar çalışır.',
			'Dört hata düzeltme düzeyi, kapasiteyi sağlamlıkla takas eder — L hafif hasara dayanır, H ise sembolün %30’unun kapanmasına dayanır (ortasını bir logo kapatacaksa ya da baskı küçük ve yıpranmış olacaksa işe yarar).'
		],
		faqs: [
			{
				q: 'Hangi hata düzeltme düzeyini seçmeliyim?',
				a: 'M (%15) makul varsayılandır. Küçük basılı kodlar, cam ya da parlama ardındaki kodlar veya üzerine logo bindireceğiniz durumlar için H (%30) kullanın. Daha yüksek düzeltme kodu yoğunlaştırır; bu yüzden ekrandaki çok uzun URL’lerde L, modülleri daha büyük ve taranması daha kolay tutar.'
			},
			{
				q: 'Baskı için SVG neden PNG’den iyi?',
				a: 'SVG çözünürlükten bağımsızdır — yazıcı onu kendi doğal DPI’sinde tarar ve modül kenarları her boyutta kusursuz keskin kalır. PNG belirli bir piksel boyutunda üretilmek zorundadır ve ölçeklenince bulanıklaşabilir. Baskı ve tasarım araçları için SVG, sohbet ve sunumlar için PNG kullanın.'
			},
			{
				q: 'Bir QR koda ne kadar veri sığar?',
				a: 'Teoride ~3 KB bayt (sürüm 40, düzey L), ama bu büyüklükteki kodları ekrandan taramak zordur. 300 karakterin altı güvenilir biçimde taranır; uzun URL’leri önce kısaltın — kalıcılık önemliyse kendi alan adınızın kısaltıcısıyla.'
			},
			{
				q: 'Bu kodların süresi doluyor mu ya da taramalar izleniyor mu?',
				a: 'Hayır. İçerik doğrudan desenin içine kodlanır — hiçbir şey bu siteden geçmez, dolayısıyla süresi dolacak bir şey yoktur ve kimse (biz dâhil) kodun ne zaman, nerede tarandığını görmez. Tarama takibi doğası gereği bir yönlendirme servisi gerektirir.'
			}
		]
	},

	'qr-code-decoder': {
		about: [
			'QR kod içeren herhangi bir görseli — ekran görüntüsü, indirilmiş bir bilet, bir afiş fotoğrafı — sürükleyin, yapıştırın ya da seçin; içerik tam burada, tarayıcınızda çıkarılır. Telefon kamerasının çözemediği durumu tam olarak kapsar: baktığınız ekranın üzerinde duran bir QR kod. Kod önünüzdeki bir kâğıttaysa kamera modu onu canlı tarar — uygulama gerekmez.',
			'Çözücü bulduğu şeyi tanır ve ona göre davranır: URL’lere bağlantıyı açma düğmesi eklenir, WiFi kodları ağ adı, parola ve güvenlik türüne ayrıştırılır; vCard, mailto:, tel:, geo: ve otpauth: yükleri etiketlenir, böylece kullanmadan önce ne yapıştırdığınızı bilirsiniz. Latin dışı metin ve emojiler UTF-8 olarak doğru çözülür, ters (koyu zemin üzerine açık) kodlar otomatik işlenir.',
			'Tarama yerel olduğundan hassas kodlar için de güvenlidir: bir WiFi parolası, bir 2FA kurulum kodu ya da özel bir bağlantı makinenizden asla çıkmaz. Şüpheli bir kodun gerçekte ne içerdiğini, herhangi bir şey onu gerçekten taramadan önce görmenin dürüst yolu da budur.'
		],
		faqs: [
			{
				q: 'Görselimde neden QR kod bulunamadı?',
				a: 'Olağan nedenler bulanıklık, düşük kontrast, güçlü perspektif bozulması ya da kodun büyük bir fotoğrafın küçücük bir bölümünü kaplamasıdır. Koda daha yakın kırpın, daha net bir kaynak kullanın ve sessiz bölgenin — sembolün çevresindeki boş kenar boşluğunun — görünür olduğundan emin olun. Ekran görüntüleri neredeyse her zaman çözülür; kavisli ya da parlak yüzeylerin açılı fotoğrafları zor durumdur.'
			},
			{
				q: 'WiFi QR kodlarını okuyabilir mi?',
				a: 'Evet. WIFI: yükleri (Android ve iOS’un ağ paylaşırken ürettiği biçim) ağ adı, parola, güvenlik türü ve gizli ağ bayrağına ayrıştırılır; kaçış kuralları da işlenir — içinde ; ya da : bulunan bir parola bozulmadan çıkar.'
			},
			{
				q: 'Kaynağı bilinmeyen bir QR kodu çözmek güvenli mi?',
				a: 'Buradaki çözme yalnızca deseni okur ve size metni gösterir — hiçbir şey ziyaret edilmez, çalıştırılmaz ya da yüklenmez. Bu da güvenmediğiniz bir kod için iyi bir ilk adımdır: açmaya karar vermeden önce gerçek URL’yi görün. Bağlantıyı açma düğmesi asla kendiliğinden tetiklenmez.'
			},
			{
				q: 'Hangi görsel biçimleri çalışır?',
				a: 'Tarayıcınızın gösterebildiği her şey: PNG, JPEG, WebP, GIF, BMP, AVIF ve SVG. Görsel bir tuvale çizilir ve birden çok ölçekte taranır; böylece dev fotoğrafların da küçük ekran görüntülerinin de şansı olur. Hareketli görseller ilk karede taranır.'
			}
		]
	},

	'json-to-yaml': {
		about: [
			'JSON, YAML ve TOML arasında her yönde dönüştürün. Kaynak biçim siz yapıştırdıkça kendiliğinden algılanır — köşeli parantezler JSON’a, key: iki noktaları YAML’a, [tablolar] TOML’a işaret eder — belirsiz girdiler için elle geçiş de vardır. Dönüştürme gerçek bir ayrıştırmadan geçer; yani çıktı satır satır bir metin dönüşümü değil, geçerliliği güvence altına alınmış bir belgedir.',
			'Her biçimin gerçek güçlü yanları vardır: API’ler ve makine arası değişim için JSON, insan tarafından düzenlenen yapılandırmalar için YAML (Kubernetes, CI hatları), iyi türlenmiş yapılandırma dosyaları için TOML (Cargo, pyproject). Veriyi bunlar arasında elle taşımak girinti ve tırnak hatalarını davet eder; bu dönüştürme onları ortadan kaldırır.',
			'Dönüştürücü biçim sınırları konusunda dürüsttür: TOML’un üst düzey dizileri ve null değeri yoktur; böyle belgeleri dönüştürmek veriyi sessizce düşürmek yerine nedenini bildirir.'
		],
		faqs: [
			{
				q: 'Yorumlar dönüşümden sağ çıkar mı?',
				a: 'Hayır — JSON’un yorum sözdizimi yoktur ve dönüştürme, yorum taşımayan ayrıştırılmış veri yapısı üzerinden ilerler. YAML → JSON → YAML dönüşümü yorumları geri dönülemez biçimde kaybeder; yorumlar önemliyse özgün dosyayı saklayın.'
			},
			{
				q: 'YAML’daki “no” değerim neden false oldu?',
				a: 'YAML 1.1, yes/no/on/off değerlerini boole sayar ve ülke kodu NO ünlü biçimde false olur. Buradaki ayrıştırıcı YAML 1.2’yi izler (yalnızca true/false), ama eski ayrıştırıcılar için yazılmış dosyalar yine de sürpriz yapabilir. Boole, sayı ya da tarih gibi görünen dizgeleri tırnak içine alın.'
			},
			{
				q: 'JSON’um neden TOML’a dönüşmüyor?',
				a: 'TOML üst düzeyde bir tablo (nesne) gerektirir — diziler ya da çıplak skalerler TOML belgesi olamaz — ve null değeri yoktur. Veriyi yeniden yapılandırın (diziyi bir anahtarın altına alın, null’ları kaldırın ya da varsayılan verin), dönüşecektir.'
			},
			{
				q: 'YAML, JSON’un bir üst kümesi mi?',
				a: 'Pratikte evet — YAML 1.2 neredeyse tüm JSON belgelerini ayrıştırır; JSON’u bir YAML yapılandırmasına yapıştırmanın genelde çalışmasının nedeni budur. Tersi doğru değildir: YAML’ın çapaları, çok satırlı skalerleri ve etiketlerinin JSON karşılığı yoktur; dönüşümde genişletilir ya da dizgeye çevrilirler.'
			}
		]
	},

	'json-to-csv': {
		about: [
			'Bir JSON nesne dizisi yapıştırın, elektronik tabloya hazır bir CSV alın: iç içe nesneler noktalı sütun adlarına düzleştirilir (user.address.city), sütunlar tüm satırların birleşimi olarak çıkarılır (eksik değerler boş hücre olur) ve tırnaklama RFC 4180’i izler; böylece değerlerin içindeki virgüller, tırnaklar ve satır sonları Excel ile Google E-Tablolar’dan sağ çıkar.',
			'Bu, bir API yanıtından birinin filtreleyip pivotlayabileceği bir tabloya giden en kısa yoldur. Sütun birleşimi, nesnelerin türdeş olmadığı gerçek dünya verisinde önemlidir — 1. satırda olmayan alanlar 40. satırda olabilir; dönüştürücü hata vermek ya da veri düşürmek yerine bunu düzgünce ele alır.',
			'Dönüştürücü ters yönde de çalışır: bir CSV dışa aktarımı yapıştırın, başlık satırına göre anahtarlanmış bir JSON nesne dizisi alın; ayırıcı otomatik algılanır (virgül, noktalı virgül, sekme, dikey çizgi) ve isteğe bağlı türlü değerlerle sayılar, boole’lar ve null gerçek JSON türlerine dönüşür. Her iki yön de tamamen tarayıcınızda çalışır; yani müşteri dışa aktarımları makinenizden hiç çıkmaz.'
		],
		faqs: [
			{
				q: 'İç içe nesneler nasıl gösteriliyor?',
				a: 'Nokta ile birleştirilmiş anahtarlara düzleştirilerek: {"user":{"name":"Ada"}} bir user.name sütunu olur. Böylece her skaler değer tek düz bir başlık satırında adreslenebilir kalır — elektronik tablo araçlarının gerçekten çalışabildiği biçim budur.'
			},
			{
				q: 'Bir satırın içindeki dizilere ne oluyor?',
				a: 'Tek bir hücreye JSON metni olarak gömülürler (["a","b"]). Dizileri sütunlara (tags.0, tags.1…) ya da fazladan satırlara açmak, verinizin şeklini iddialı biçimde değiştirir — gömme ise dönüşümü kayıpsız ve öngörülebilir tutar.'
			},
			{
				q: 'Excel neden CSV’mi tek sütunda gösteriyor?',
				a: 'Yerel ayarlar yüzünden: Avrupa’nın büyük kısmında Excel, virgül ondalık ayırıcı olduğu için noktalı virgülle ayrılmış dosyalar bekler. Ayırıcı seçeneğini noktalı virgüle alın ya da ayırıcıyı belirtmenize izin veren Veri → Metin/CSV’den seçeneğini kullanın.'
			},
			{
				q: 'Dönüştürücü tek bir nesneyi (dizi değil) işleyebiliyor mu?',
				a: 'Evet — tek başına bir nesne, tek satırlık bir CSV olur. Ancak kimlikle anahtarlanmış nesneler ({"a1":{...},"a2":{...}}) tek bir geniş satıra dönüşür; her değerin bir satır olması gerekiyorsa önce onları diziye çevirin.'
			},
			{
				q: 'CSV → JSON tırnaklı alanları ve gömülü satır sonlarını nasıl işliyor?',
				a: 'RFC 4180’e göre: çift tırnak içine alınmış alanlar ayırıcıyı, düz tırnak için ikilenmiş tırnakları ("") ve satır sonlarını içerebilir. Excel ve çoğu veritabanı tam olarak bu biçimde dışa aktarır, dolayısıyla gerçek dosyalar doğru ayrıştırılır.'
			},
			{
				q: 'CSV → JSON dönüşümünde posta kodlarımın baştaki sıfırları neden kayboluyor?',
				a: 'Türlü dönüşüm 02134 değerini 2134 sayısına çevirir. “Türlü değerler” seçeneğinin işaretini kaldırın; o zaman her hücre yazıldığı gibi dizge kalır — kimlikler, telefon numaraları ve baştaki sıfırı önemli olan her şey için doğru seçim budur.'
			}
		]
	},

	'json-to-typescript': {
		about: [
			'Bir JSON örneği yapıştırın — bir API yanıtı, bir yapılandırma dosyası — ve ondan çıkarılmış bir TypeScript arayüzü alın: iç içe nesneler iç içe türlere dönüşür, diziler eleman türü kazanır (karışık içerikte birleşimlerle) ve geçerli tanımlayıcı olmayan anahtarlar düzgün biçimde tırnaklanır.',
			'Üretilen türler bir başlangıç noktasıdır, bir sözleşme değil: çıkarım tek bir örnek görür; yani örneğinizde tesadüfen null olan bir alan null olarak türlenir ve bulunmayan isteğe bağlı alanlar onun için yok hükmündedir. Çıktı bilerek sadedir — dekoratör yok, çalışma zamanı doğrulaması yok — böylece istediğiniz yere yapıştırıp geliştirebilirsiniz.',
			'İstekten isteğe değişen alanlar için ikinci bir örneği de geçirip elle birleştirin ya da şekil oturduğunda şema öncelikli araçlara (OpenAPI, zod) terfi edin. Günlük “şu yanıt için bir tür lazım” anı içinse tek bir yapıştırma yeter.'
		],
		faqs: [
			{
				q: 'Null olabilen alanım neden sadece null olarak türlenmiş?',
				a: 'Çıkarım yalnızca yapıştırdığınız örneği görür. Alan orada null idiyse, bilebileceği tek şey null’dır. Üretimden sonra string | null (ya da gerçek tür neyse) olarak değiştirin — veya alanın dolu olduğu bir örnek yapıştırın.'
			},
			{
				q: 'İsteğe bağlı alanlar nasıl ele alınıyor?',
				a: 'Ele alınmıyor — tek bir örnek, “her zaman var” ile “bu seferlik var” arasındaki farkı ayırt edemez. Örnekte bulunmayan alanlar türde de bulunmaz. API’nin atladığını bildiğiniz alanları elle isteğe bağlı (name?:) işaretleyin.'
			},
			{
				q: 'Karışık türlü diziler ne üretir?',
				a: 'Bir birleşim: [1, "a"] için (number | string)[] çıkarılır. Boş diziler, incelenecek eleman olmadığı için unknown[] olur — gerçek eleman türünü öğrendiğinizde onunla değiştirin.'
			},
			{
				q: 'Çıkarılmış türleri mi yoksa zod gibi bir şema kütüphanesini mi kullanmalıyım?',
				a: 'Çıkarılan arayüzler yalnızca derleme zamanındadır — çalışma zamanında hiçbir şey doğrulamazlar. İç araçlar ve hızlı türleme için mükemmeldirler; çalışma zamanında güvenilmeyen girdi içinse bir zod/valibot şeması tanımlayın ve statik türü ondan türetin.'
			}
		]
	},

	'jsonpath-tester': {
		about: [
			'JSONPath ifadelerini kendi JSON’unuza karşı test edin; her eşleşmeyi hem değeriyle hem somut yoluyla görün. Günlük kullanımı kapsayan sözdizimi desteklenir: nokta ve köşeli parantez gösterimi, dizi indeksleri (negatifler dâhil), joker karakterler, birleşimler ([\'a\',\'b\']) ve özyinelemeli iniş ($..price).',
			'Eşleşme başına yol çıktısı sessizce en faydalı kısımdır: derin bir belgede $..id sorgusu çalıştırın; her sonuç size tam olarak nerede yaşadığını söyler ($.data.items[3].id) ve doğrudan koda yapıştırmaya hazırdır. “Bu yığının bir yerinde” ifadesini kesin bir adrese çevirir.',
			'Filtre ifadeleri ([?(@.price < 10)]) henüz uygulanmadı — araç yanlış sonuç döndürmek yerine bunu açıkça söyler. JSONPath kullanımının çoğunu oluşturan yapısal ayıklama içinse her şey çalışır.'
		],
		faqs: [
			{
				q: '$.a.b ile $..b arasındaki fark ne?',
				a: '$.a.b tek bir kesin rotayı izler: kökteki a anahtarı, sonra onun içindeki b anahtarı. $..b (özyinelemeli iniş) ise belgenin herhangi bir derinliğindeki her b değerini bulur. Özyinelemeli iniş güçlüdür ama şaşırtabilir — hiç düşünmediğiniz şeylerin içine gömülü b anahtarlarını da eşler.'
			},
			{
				q: 'Boşluk ya da tire içeren anahtarlara nasıl erişirim?',
				a: 'Tırnaklı köşeli parantez gösterimiyle: $[\'my key\'] veya $.data[\'content-type\']. Nokta gösterimi yalnızca geçerli tanımlayıcıya benzeyen adlarda çalışır.'
			},
			{
				q: 'Negatif dizi indeksleri çalışıyor mu?',
				a: 'Evet — [-1] son eleman, [-2] sondan ikincidir; Python’un yaygınlaştırdığı ve RFC 9535’in benimsediği gelenekle uyumludur. [0] yine ilk elemandır.'
			},
			{
				q: 'JSONPath standartlaştırıldı mı?',
				a: '2024’ten beri evet — RFC 9535 sözdizimini ve anlambilimini tanımlar. Ondan önce yazılmış uygulamalar sınır durumlarda (özellikle filtreler ve birleşimler) farklılık gösterir; yani aynı ifade kütüphaneden kütüphaneye farklı davranabilir. Dağıtımda kullandığınız uygulamaya karşı test edin.'
			}
		]
	},

	'bcrypt-generator': {
		about: [
			'Bir parolayı seçtiğiniz maliyet faktörüyle bcrypt kullanarak hash’leyin ya da düz metni mevcut bir hash ile doğrulayın — ikisi de tamamen tarayıcıda; test edilen şey bir parolaysa tam da isteyeceğiniz budur. Bir hash inceleyicisi ayrıca herhangi bir bcrypt hash’ini sürüm, maliyet ve tuz olarak parçalar.',
			'Bcrypt, parola saklamak için sağlam bir seçim olmayı sürdürüyor; çünkü bilerek yavaştır ve parola başına tuzlanır: maliyet faktörü her artışta işi ikiye katlar, yani maliyet 12, altta yatan şifre kurulumunun 4096 yinelemesi demektir. Zamanlama göstergesi seçtiğiniz maliyetin ne kadar sürdüğünü gösterir ve güvenlik/gecikme ödünleşimini somutlaştırır.',
			'Günlük hayatta daha sık gereken doğrulamadır: uygulama kodunu ayağa kaldırmadan bir veritabanındaki hash’in bilinen bir parolayla eşleştiğini teyit etmek. İkisini de yapıştırın, evet ya da hayır cevabını alın.'
		],
		faqs: [
			{
				q: 'Üretimde hangi maliyet faktörünü kullanmalıyım?',
				a: 'Klasik öneri: giriş gecikme bütçenizin izin verdiği kadar yüksek; bugün genellikle 10–13. Üretim donanımınızda hash başına 100–300 ms hedefleyin. Tarayıcıdaki JavaScript yerel koddan yavaş çalışır, dolayısıyla burada görünen süre sunucularınız için bir üst sınırdır.'
			},
			{
				q: 'Aynı parola neden her seferinde farklı bir hash veriyor?',
				a: 'Her hash için rastgele 16 baytlık bir tuz üretilir ve hash dizgesinin içinde saklanır. Bu tasarım gereğidir — özdeş parolalar farklı hash’ler alır ve önceden hesaplanmış gökkuşağı tabloları boşa çıkar. Doğrulama tuzu hash’in içinden geri okur; karşılaştırmanın çalışmasının nedeni budur.'
			},
			{
				q: 'Bir bcrypt hash’inin parçaları ne anlama geliyor?',
				a: '$2b$12$ + 53 karakter: 2b algoritma sürümü, 12 maliyet (2^12 yineleme), sonraki 22 karakter tuz ve son 31 karakter özettir — hepsi bcrypt’in kendi base64 alfabesiyle. Aracın altındaki inceleyici herhangi bir hash’i bu şekilde ayırır.'
			},
			{
				q: 'Bcrypt hâlâ Argon2 yerine önerilir mi?',
				a: 'Yeni sistemler için ilk tercih artık Argon2id’dir (bellek sertliği GPU ile kırmaya direnir). Bcrypt kabul edilebilir ve her yerde bulunur olmayı sürdürüyor — pratik öneri şudur: çalışan bir bcrypt altyapısını panikle taşımayın ama sıfırdan tasarımlarda Argon2id’yi seçin. Her ikisi de SHA-256 gibi hızlı hash’lerin kat kat ötesindedir.'
			}
		]
	},

	'user-agent-parser': {
		about: [
			'Bir log satırından, hata raporundan veya analitik dışa aktarımından bir User-Agent dizgesi yapıştırın ve çözümlenmiş hâlini alın: tarayıcı ve sürümü, işleme motoru, işletim sistemi, cihaz türü ve CPU mimarisi. Ayrıştırıcı, sayısız analitik hattının arkasındaki kütüphane olan ua-parser-js’tir ve dizgeniz üzerinde yerelde çalışır.',
			'User-Agent dizgeleri birer kazı alanıdır — hepsi hâlâ Mozilla/5.0 olduğunu iddia eder, Chrome kendine Safari der, Safari KHTML der ve gerçek kimlik sonraki belirteçlerde saklanır. Bir ayrıştırıcı gözünüzü kısarak bakmaktan iyidir: “CriOS”un iOS’taki Chrome demek olduğunu ve Edge’in “Edg/” arkasına saklandığını bilir.',
			'Gidişatı da not edin: tarayıcılar UA dizgelerini donduruyor ve kısaltıyor (Chromium bunun yerine UA Client Hints gönderiyor), dolayısıyla yalnızca UA’dan gelen sürüm ayrıntısı giderek kabalaşıyor. Log adli incelemesi ve hata ayıklama için vazgeçilmez olmayı sürdürür; özellik kararları içinse özellik algılamayı kullanın.'
		],
		faqs: [
			{
				q: 'Neden her User-Agent Mozilla/5.0 ile başlıyor?',
				a: '1990’lardan kalma, hiç bitmeyen bir uyumluluk tiyatrosu: sunucular modern sayfaları sunmak için “Mozilla” arıyordu, bu yüzden her yeni tarayıcı öyle olduğunu iddia etti ve her tarayıcı kendinden öncekileri taklit etti. Önek artık anlamsız bir gelenektir.'
			},
			{
				q: 'Bir UA dizgesindeki işletim sistemi sürümüne güvenebilir miyim?',
				a: 'Her yıl biraz daha az. macOS UA sürümünü 10_15_7’de dondurdu, Windows 11 kendini Windows NT 10.0 olarak bildiriyor ve UA’sını kısaltan tarayıcılar sürümleri bilerek kabalaştırıyor. UA’dan gelen işletim sistemi sürümlerini yaklaşık kabul edin; istemciyi siz denetliyorsanız UA Client Hints kullanın.'
			},
			{
				q: '“like Gecko” ya da “KHTML, like Gecko” ne demek?',
				a: 'Bir taklit katmanı daha: WebKit, KHTML’den türedi ve Gecko’yu (Firefox’un motorunu) özel olarak ele alan sayfaların çalışmasını istedi; bu yüzden sonuna “like Gecko” ekledi. Her WebKit/Blink tarayıcısı bu ifadeyi bugün de taşır.'
			},
			{
				q: 'Özellik algılama için UA ayrıştırma kullanmalı mıyım?',
				a: 'Hayır — yeni bir tarayıcı sürümü çıktığı anda UA ayıklaması bozulur. Özelliğin kendisini algılayın (if ("clipboard" in navigator)). UA ayrıştırma; analitik, log çözümlemesi ve kullanıcıların bildirdiği hataları yeniden üretmek içindir, ki oralarda ortamı bilmek işin ta kendisidir.'
			}
		]
	},

	'color-converter': {
		about: [
			'Bir rengi yaygın gösterimlerin herhangi biriyle girin — #hex, rgb(), hsl() ya da CSS renk adı — ve tüm biçimleri aynı anda alın: HEX, RGB, HSL ve OKLCH, yanında canlı bir örnek kareyle. Alfa kanalları biçimler arasında korunur ve çıktı, güncel stil dosyalarına temizce yapıştırılan modern CSS sözdizimini (boşlukla ayrılmış kanallar) kullanır.',
			'OKLCH dâhil edildi, çünkü CSS rengi oraya gidiyor: HSL’den farklı olarak açıklık ekseni algısal olarak tekdüzedir; yani aynı L değerine sahip iki renk gerçekten eşit parlaklıkta görünür ve tonu değiştirmek algılanan parlaklığı kazara değiştirmez. Var olan bir paleti OKLCH’ye çevirmek, tutarlı renk skalaları kurmanın ilk adımıdır.',
			'Dönüşüm matematiği yayımlanmış sRGB↔OKLab dönüşümleriyle yerelde çalışır ve değerler gidip geri döner: bir HSL girdisinden aldığınız RGB, tarayıcının hesaplayacağının tam olarak aynısıdır.'
		],
		faqs: [
			{
				q: 'HSL ile OKLCH açıklık değerleri neden birbirini tutmuyor?',
				a: 'HSL açıklığı, insan görüşünün değil RGB değerlerinin geometrik bir özelliğidir — hsl(60 100% 50%) sarısı, aynı L değerine sahip olmasına rağmen hsl(240 100% 50%) mavisinden çok daha parlak görünür. OKLCH’nin L ekseni algıyla örtüşecek şekilde tasarlanmıştır; yani eşit L, eşit görünür parlaklık demektir. Bu uyuşmazlık, OKLCH’nin var olma sebebinin ta kendisidir.'
			},
			{
				q: 'Alfa değeri ne anlama geliyor ve her biçimde nereye yazılıyor?',
				a: 'Alfa donukluktur; 0 (saydam) ile 1 (tam opak) arasındadır. 8 haneli hex’te son bayttır (#RRGGBBAA); modern işlevsel sözdiziminde bir eğik çizginin ardından gelir: rgb(76 141 255 / 0.5). Bu dönüştürücü alfayı her biçimde kendiliğinden taşır.'
			},
			{
				q: 'Her OKLCH rengi sRGB’de gösterilebilir mi?',
				a: 'Hayır — OKLCH geniş renk gamlarını kapsar ve bazı kroma/açıklık birleşimlerinin sRGB karşılığı yoktur. sRGB’den dönüştürmek (bu aracın yaptığı gibi) her zaman gösterilebilir kalır; ters yönde ise gam dışı renkler kırpılmalı ya da eşlenmelidir — canlı bir P3 yeşilinin sRGB ekranda daha donuk görünmesinin nedeni budur.'
			},
			{
				q: 'Neden virgüllü değil de boşluklu rgb(76 141 255)?',
				a: 'CSS Color Module Level 4, isteğe bağlı /alfa ile birlikte boşlukla ayrılmış kanalları standartlaştırdı ve her modern tarayıcı bunu destekliyor. Virgüllü biçim hâlâ çalışır ama yeni belirtimlerin (ve bu aracın) kullandığı boşluklu biçimdir.'
			}
		]
	},

	'image-to-base64': {
		about: [
			'Bir görseli sürükleyin, seçin ya da yapıştırın; Base64 hâlini ihtiyaç duyabileceğiniz her tatta alın: kullanıma hazır bir data URL, bir CSS background-image bildirimi, doğal boyutlarıyla eksiksiz bir <img> etiketi ve ham Base64 yükü. Ters yön de çalışır — bir data URL ya da çıplak bir Base64 bloğu yapıştırın; görsel çözülür, önizlenir ve dosya olarak indirilebilir.',
			'Biçim, dosya uzantısından ya da bildirilen mime türünden değil sihirli baytlardan belirlenir; yani .jpg olarak yeniden adlandırılmış bir PNG (ya da yanlış etiketli bir data URL) yine de doğru dönüşür. Boyut paneli maliyet konusunda dürüsttür: Base64 veriyi yaklaşık üçte bir oranında şişirir ve tam kodlanmış boyut, özgün boyutun yanında gösterilir; böylece gömmenin buna değip değmediğine karar verebilirsiniz.',
			'Çoğu görselden-Base64’e sitesinin aksine hiçbir şey karşıya yüklenmez — dosya tarayıcının FileReader API’siyle okunur ve sayfada kodlanır. Bu da onu iç panellerin ekran görüntüleri, yayımlanmamış ürün fotoğrafları ya da bir yabancının sunucusuna vermeyi tercih etmeyeceğiniz her şey için güvenli kılar.'
		],
		faqs: [
			{
				q: 'Bir görseli dosya olarak bağlamak yerine ne zaman Base64 olarak gömmeliyim?',
				a: 'Görsel küçükse (kabaca 10 KB’ın altı), nadiren değişiyorsa ve aksi hâlde fazladan bir HTTP isteğine mal olacaksa — ikonlar, e-postalardaki logolar ya da tek dosyalık HTML belgeleri gibi. Bundan büyüğünde ayrı dosya kazanır: bağımsız önbelleklenir, paralel yüklenir ve HTML’inizi ya da CSS’inizi %33 şişirmez.'
			},
			{
				q: 'Base64 sürümü neden dosyamdan yaklaşık üçte bir daha büyük?',
				a: 'Base64 her 3 baytlık ikili veriyi 4 ASCII karakteriyle temsil eder; bu yapısal olarak +%33 ek yüktür (artı en fazla iki dolgu karakteri). Sunucunuzdaki gzip ya da Brotli bunun bir kısmını geri kazandırır ama şişme kodlamanın doğasında vardır — ikili veriyi metne gömebilme yeteneğini boyutla takas eder.'
			},
			{
				q: 'Bir stil dosyasında ya da HTML’de bulduğum bir data URL’yi çözebilir miyim?',
				a: 'Evet — Base64 → görsel moduna geçin ve data: önekiyle birlikte tamamını yapıştırın. Yüzde kodlu SVG data URL’leri (;base64 içermeyen tür) de çözülür ve yükün içindeki satır sonlarıyla boşluklar kendiliğinden temizlenir. Sonuç sayfada önizlenir ve doğru uzantıyla indirilir.'
			},
			{
				q: 'Bu yalnızca PNG ve JPEG için mi, yoksa SVG, GIF ve ICO da işe yarar mı?',
				a: 'Algılayıcının tanıdığı her şey Base64’e dönüşür: PNG, JPEG, WebP, GIF, SVG, BMP, ICO ve AVIF. Özellikle SVG için şunu düşünün: XML kaynağı doğrudan satır içine alındığında çoğu zaman daha küçük ve daha okunaklıdır — SVG’yi Base64 ile kodlamak asıl olarak tırnaklama ya da kaçışlama sorun olduğunda anlamlıdır.'
			}
		]
	},

	'image-converter': {
		about: [
			'Bir görseli PNG, JPEG ve WebP arasında hiçbir şey kurmadan ve hiçbir yere yüklemeden dönüştürün: dosyayı bırakın, hedefi seçin, canlı bir kaydırıcıyla kaliteyi ayarlayın ve çıktı boyutunun gerçek zamanlı güncellendiğini izleyin. Δ karesi, dönüştürülen dosyanın tam olarak ne kadar küçüldüğünü (ya da büyüdüğünü) gösterir; böylece kalite ayarı seçmek tahmin işi olmaktan çıkar.',
			'Üç biçimin farklı görevleri vardır. PNG kayıpsızdır ve tam saydamlık sunar — ekran görüntüleri, arayüz varlıkları ve keskin kenar veya metin içeren her şey için doğrudur. JPEG fotoğrafları agresif biçimde sıkıştırır ama alfa kanalı yoktur ve sert kenarları bulanıklaştırır. WebP karşılaştırılabilir kalitede genelde JPEG’i %25–35 geçer, saydamlığı destekler ve güncel tarayıcıların hepsinde çalışır — web için genellikle cevap odur.',
			'Dönüşüm tarayıcınızdaki bir canvas üzerinde olur: görsel, tarayıcınızın sayfaları göstermek için kullandığı kodeklerle çözülür, yeniden çizilir ve yeniden kodlanır. Aracı gizli kılan da budur — ve her biri kendi kodlayıcısını taşıyan Chrome, Firefox ve Safari arasında tam bayt sayılarının hafifçe farklı çıkmasının nedeni de.'
		],
		faqs: [
			{
				q: 'JPEG ve WebP için hangi kalite ayarını kullanmalıyım?',
				a: '75 ile 90 arası neredeyse her gerçek kullanımı karşılar. 85’te çoğu fotoğraf kaynaktan gözle ayırt edilemez ve boyutun küçük bir kesrindedir; ~70’in altında degradelerde ve ten tonlarında blok artefaktları belirmeye başlar; 90’ın üzerinde ise dosya boyutu, göremeyeceğiniz kazanımlar için hızla tırmanır. Kaydırıcıyı çekin ve boyut karesini izleyin — tatlı nokta genelde kendini belli eder.'
			},
			{
				q: 'PNG’m JPEG’e dönüştürülünce neden büyüdü?',
				a: 'JPEG düz renk için değil, fotoğraf degradeleri için tasarlanmıştır. Ekran görüntüleri, diyagramlar ve arayüz grafikleri PNG olarak muhteşem sıkışır (uzun aynı piksel dizileri) ama JPEG’i her keskin kenarın etrafında gürültü saklamaya zorlar — daha büyük dosyalar ve gözle görülür halkalanma. Grafikleri PNG olarak tutun ya da kayıpsıza yakın WebP’ye dönüştürün.'
			},
			{
				q: 'JPEG’e dönüştürürken saydamlığa ne oluyor?',
				a: 'JPEG’in alfa kanalı yoktur, dolayısıyla saydam bölgeler bir şeyle doldurulmalıdır — bu araç onları web görselleri için alışılmış olan beyaz üzerine düzleştirir. Saydamlığın hayatta kalması gerekiyorsa hedef olarak PNG ya da WebP seçin.'
			},
			{
				q: 'Tarayıcım neden burada AVIF ya da HEIC dışa aktaramıyor?',
				a: 'Canvas toBlob API’si yalnızca tarayıcının kodlayıcı taşıdığı biçimleri kodlar — her yerde PNG ve JPEG, Chromium ile Firefox’ta WebP. AVIF kodlaması hâlâ nadirdir, HEIC ise patent yüklüdür; yani tarayıcılar bunları çözer ama üretmez. Tarayıcınızın yazamadığı bir biçim seçerseniz araç sessizce size PNG vermek yerine durumu söyler.'
			}
		]
	},

	'image-resizer': {
		about: [
			'Bir görseli tam bir genişliğe, tam bir yüksekliğe ya da özgün boyutun bir yüzdesine göre yeniden boyutlandırın — diğer boyut kendiliğinden izler, böylece hiçbir şey esnemez. Bir çıktı biçimi seçin (ya da kaynak biçimi koruyun), kayıplı hedefler için kaliteyi ayarlayın, sonucu önizleyin ve indirin. Önce/sonra kareleri boyutları ve dosya büyüklüğünü bir bakışta gösterir.',
			'Ölçekleme, tarayıcının yüksek kaliteli yumuşatma kipini kullanır; bu, en yakın komşu seyreltmesi yerine düzgün yeniden örnekleme uygular — küçültülen fotoğraflar takma titremesiyle kırpışmak yerine net kalır. Yeniden boyutlandırma aynı zamanda dosya boyutunu küçültmenin dürüst yoludur: iki boyutu da yarıya indirmek piksellerin dörtte üçünü kaldırır, ki hiçbir kalite kaydırıcısı buna erişemez.',
			'Dosyalar sayfadan hiç çıkmaz: çözme, yeniden örnekleme ve yeniden kodlamanın hepsi yerel bir canvas üzerinde çalışır. Yükleme ilerleme çubuğu yoktur, çünkü yükleme yoktur — 40 megapikselik bir fotoğraf, makineniz onu yeniden çizebildiği hızda boyutlanır ve ağ kablosu takılı değilken bile çalışır.'
		],
		faqs: [
			{
				q: 'Küçültüp sonra tekrar büyütmek görselimi geri getirir mi?',
				a: 'Hayır — küçültme pikselleri kalıcı olarak atar. 3000 piksellik bir fotoğrafı 300 piksele indirmek verinin %1’ini tutar; geri büyütmek eksik %99’u bulanıklık olarak aradeğerler. Elinizdeki tek kopyayı yeniden boyutlandırmak yerine özgün dosyayı saklayın ve ondan boyutlandırılmış kopyalar çıkarın.'
			},
			{
				q: 'Büyütülmüş görselim neden yumuşak görünüyor?',
				a: 'Büyütme, hiç yakalanmamış ayrıntıyı yaratamaz — tarayıcı var olan pikseller arasında aradeğerleme yapar ve bu, yaklaşık 2×’in ötesinde yumuşaklık olarak okunur. Bunun ötesinde gerçek büyütme, makul ayrıntıyı uyduran yapay zekâ tabanlı araçlar ister; bir canvas yeniden örnekleyicisi bilerek hiçbir şey uydurmaz.'
			},
			{
				q: '“200 KB altı” gibi bir hedef dosya boyutunu nasıl tutturabilirim?',
				a: 'İki kolu da kullanın: önce gerçekten ihtiyacınız olan en büyük boyutlara indirin (çoğu web düzeni için 1200 piksel genişlik fazlasıyla yeter), sonra WebP ya da JPEG seçip boyut karesi hedefin altına düşene kadar kaliteyi azaltın. İşin çoğunu boyut küçültme yapar — kalite ayarı gerisine ince ayar çeker.'
			},
			{
				q: 'Yeniden boyutlandırma GPS konumu gibi EXIF meta verisini siler mi?',
				a: 'Evet. Canvas hattı saf pikselleri yeniden kodlar — kamera modeli, zaman damgaları, GPS koordinatları ve diğer bütün EXIF etiketleri çıktıda yoktur. Kamuya açık web’e gidecek görsellerde bu genelde bir gizlilik kazancıdır; meta verinin korunması gerekiyorsa özgün dosyayı yanınızda tutun.'
			}
		]
	},

	'favicon-generator': {
		about: [
			'Tek bir görsel bırakın — tercihen 512 piksel ya da daha büyük kare bir logo — ve eksiksiz favicon setini alın: sekmeler ve yer imleri için 16, 32 ve 48 pikseli paketleyen bir favicon.ico; 180 pikselik Apple touch ikonu ve 192/512 pikselik PWA ikonları dâhil standart boyutlarda PNG’ler; başlangıç için bir site.webmanifest ve <head> içine yapıştıracağınız <link> etiketleri. Tek bir ZIP indirmesi, geleneklerin beklediği adlarla her şeyi içerir.',
			'Favicon rehberlerinin yanlış yaptığı ayrıntılar burada halledilmiştir: ICO, PNG sıkıştırmalı girdiler gömer (Windows Vista’dan beri her yerde desteklenir ve eski BMP ikonlarından çok daha küçüktür); Apple touch ikonu, iOS saydamlığı siyahla değiştirdiği için seçtiğiniz bir arka plan rengine düzleştirilir; PWA ikonları ise alfa kanalını korur. Kare olmayan kaynaklar ezilmek yerine ortadan kırpılır.',
			'Bir logoyu 16 piksele indirmek doğası gereği yıkıcıdır — ince ayrıntı basitçe hayatta kalamaz — bu yüzden önizleme satırı her boyutu gerçek ölçüsünde gösterir ve yayına almadan önce okunaklılığı değerlendirmenizi sağlar. Her şey yerel bir canvas üzerinde işlenir, ICO/ZIP kapları sayfada bayt bayt kurulur; logonuz hiçbir yere yüklenmez.'
		],
		faqs: [
			{
				q: '2026’da gerçekten hangi favicon boyutlarına ihtiyacım var?',
				a: 'Söylencelerin ima ettiğinden azına: eski istemciler ve adres çubuğu için 16/32/48 içeren bir favicon.ico, tek bir 180 piksellik apple-touch-icon.png ve web uygulama manifestosundan başvurulan 192/512 piksellik PNG’ler. Modern tarayıcılar en uygun eşleşmeyi tam olarak bu kümeden seçer — bazı üreteçlerin çıkardığı 20 dosyalık paketler kargo kültüdür.'
			},
			{
				q: 'Logom 16 pikselde neden okunmuyor?',
				a: 'On altı piksel acımasızca küçüktür — kelime logoları, ince çizgiler ve zarif degradeler orada erir. Güçlü favicon’lar markayı yüksek kontrastlı tek bir kalın simgeye ya da şekle indirger. Buradaki 16 piksel önizlemesi lapa gibi görünüyorsa markanın ayırt edici kısmına daha sıkı kırpın ya da küçük boyutlar için sadeleştirilmiş bir varyant kullanın.'
			},
			{
				q: 'Hâlâ bir .ico dosyasına ihtiyacım var mı, PNG favicon’lar yetmiyor mu?',
				a: 'Her modern tarayıcı PNG favicon kabul eder ama /favicon.ico, kullanıcı aracılarının, tarayıcı botlarının ve eski araçların körlemesine istediği yol olmayı sürdürür. Oraya gerçek bir ICO koymak birkaç kilobayta mal olur ve bütün bir 404 ile geri düşme tuhaflıkları sınıfını ortadan kaldırır — PNG bağlantılarınızın yanında tutun.'
			},
			{
				q: 'Apple touch ikonu neden bir arka plan rengi istiyor?',
				a: 'iOS ana ekran ikonlarında saydamlığı işlemez — PNG’nizdeki alfa neyse siyah üzerine bindirilir. Seçtiğiniz bir renge önceden düzleştirmek sonucun kasıtlı olmasını sağlar. İkonunuzla uyumlu arka planı seçin ve iOS’un köşeleri kendisinin yuvarladığını unutmayın; yani taşma paylı, tam kare bir görsel verin.'
			}
		]
	},

	'sql-formatter': {
		about: [
			'Bir log dosyasından, bir ORM hata ayıklama dökümünden ya da bir meslektaşınızın tek satırlık sorgusundan taze çıkmış bir sorguyu yapıştırın; bu biçimlendirici onu tutarlı girintilerle okunabilir yan tümcelere ayırır. Altı lehçe desteklenir — standart SQL, PostgreSQL, MySQL, SQLite, SQL Server ve BigQuery — böylece TOP, ters tırnaklı tanımlayıcılar ya da dizi türleri gibi lehçeye özgü sözdizimi ayrıştırıcıyı takılmak yerine doğru biçimlenir.',
			'Anahtar kelime yazımı ayarlanabilir: klasik görünüm için BÜYÜK HARF, ekibiniz tercih ediyorsa küçük harf ya da özgün hâlini olduğu gibi bırakın. Küçültme kipi tersini yapar — biçimlendirilmiş bir sorguyu tek satıra indirir, yorumları atarken dizge değişmezlerini bayt bayt korur; SQL’i bir JSON yapılandırmasına ya da bir CLI bayrağına yapıştırmadan önce isteyeceğiniz de tam budur.',
			'Sorgular sıkça tablo adları, değişmezler içindeki müşteri verisi ya da altyapı ipuçları taşır. Biçimlendirme tamamen tarayıcınızda çalışır, dolayısıyla bunların hiçbiri bir sunucuya ulaşmaz.'
		],
		faqs: [
			{
				q: 'Hangi SQL lehçesini seçmeliyim?',
				a: 'Veritabanınızın konuştuğunu — bu seçim tanımlayıcıların, dizge tırnaklamasının ve lehçeye özgü anahtar kelimelerin nasıl ayrıştırıldığını değiştirir. Yalnızca genel bir derleme toplama istiyorsanız standart SQL ortak çekirdeği karşılar. Veritabanınız için geçerli olan bir sözdiziminde ayrıştırma hatası alıyorsanız, bu genelde lehçe değiştirme işaretidir.'
			},
			{
				q: 'Biçimlendirme sorgunun yaptığı işi değiştirir mi?',
				a: 'Hayır. Biçimlendirme yalnızca boşlukları taşır ve etkinse anahtar kelime yazımını değiştirir — tanımlayıcılar ile değişmezler baytlarını korur. SQL anahtar kelimeleri desteklenen her lehçede büyük/küçük harf duyarsızdır; yani SELECT ile select aynı ifadedir.'
			},
			{
				q: 'Aynı anda birden çok ifadeyi biçimlendirebilir miyim?',
				a: 'Evet — bütün bir betiği yapıştırın; ; ile biten her ifade sırayla, aralarında birer boş satır bırakılarak biçimlendirilir.'
			},
			{
				q: 'Küçültme tam olarak neyi kaldırıyor?',
				a: 'Satır yorumları (--) ve blok yorumları (/* */) atılır, ardışık boşluklar tek boşluğa iner, virgül ve parantez etrafındaki boşluklar kaldırılır. Tek tırnak, çift tırnak ve ters tırnak içindeki metne — ikilenmiş tırnak kaçışları dâhil — asla dokunulmaz.'
			}
		]
	},

	'xml-formatter': {
		about: [
			'Bu araç XML’i seçtiğiniz girintiyle güzelce yazar, biçim doğruluğu hatalarını tam satır ve sütunuyla işaretler ve bir belgeyi tek satıra küçültebilir. Yorumlar, CDATA bölümleri ve XML prologu biçimlendirmeden sağ çıkar — şaşırtıcı sayıda biçimlendirici bunları sessizce yer.',
			'Buradaki doğrulama, biçim doğruluğu anlamındadır: düzgün iç içe geçmiş etiketler, tırnaklanmış öznitelikler, geçerli karakterler. Bu, elle düzenleme kazalarının ezici çoğunluğunu yakalar — eksik bir eğik çizgi, kapatılmamış bir öğe, başıboş bir ve işareti. XSD’ye karşı şema doğrulaması bilerek kapsam dışıdır; onun yeri, şema dosyasının hazır olduğu derleme hattınızdır.',
			'Yapılandırma dosyaları, SOAP yükleri, RSS akışları ve Android manifestoları rutin olarak iç ağ adları ve anahtarlar içerir. Buradaki her şey yerelde ayrıştırılır — hiçbir şey iletilmez.'
		],
		faqs: [
			{
				q: 'XML’im neden “char … is not expected” hatası veriyor?',
				a: 'Olağan şüpheliler: &amp; olması gereken çıplak bir &, tırnaklanmamış bir öznitelik değeri ya da yanlış sırada kapanan etiketler. Hata mesajı ilk sorunlu karakterin satır ve sütununu taşır, girdi kutusu da onu işaretler.'
			},
			{
				q: 'Biçimlendirici belgemi yeniden sıralar ya da normalleştirir mi?',
				a: 'Hayır. Öğeler, öznitelikler ve sıraları tam olarak korunur; yalnızca öğeler arası boşluk değişir. Biçimlendirmeyle aynı satırı paylaşan metin içeriği kırpılır ve içerideki ardışık boşluklar tek boşluğa iner — anlamlı boşluğa güveniyorsanız (xml:space="preserve"), o bölümleri küçültülmüş hâlde tutun.'
			},
			{
				q: 'Küçültme neyi kaldırıyor?',
				a: 'Öğeler arasındaki girintiler ile satır sonlarını ve ayrıca yorumları. CDATA bölümleri, işlem talimatları ve prolog kalır. Sonuç, yalnızca boşluktan oluşan metin düğümlerine bağımlı olmayan her tüketici için özdeş biçimde ayrıştırılır.'
			},
			{
				q: 'XSD ya da DTD’ye karşı doğrulama yapabilir mi?',
				a: 'Hayır — bu yalnızca biçim doğruluğunu denetler. Şema doğrulaması, şema dosyasını ve bir XSD motorunu gerektirir; bu iş araç zincirinizde daha iyi yapılır (xmllint --schema ya da dilinizin XML kütüphanesi).'
			}
		]
	},

	'xml-to-json': {
		about: [
			'Eski SOAP yanıtlarını, RSS akışlarını ya da Maven POM’larını JavaScript’e, jq’ya veya JSON tabanlı bir API’ye beslemek için XML’i JSON’a dönüştürün — ya da tersini yapıp JSON verisinden XML üretin. Öznitelikler korunur: "@_ad" anahtarlarına dönüşürler ve özniteliklerle birlikte var olan metin içeriği "#text" altına iner; böylece hiçbir bilgi sessizce kaybolmaz.',
			'İki biçim temel konularda anlaşmaz ve bu dönüştürücü alışılmış pragmatik seçimleri yapar: aynı adlı ardışık kardeş öğeler bir JSON dizisine toplanır, sayı gibi görünen değerler sayıya dönüşür ve ad alanları öğe adının parçası olarak taşınır. Tipik belgelerde XML → JSON → XML çevrimi yapıyı ve içeriği korur.',
			'Her iki yön de tarayıcınızda yerelde çalışır. Bir fatura akışını ya da bir API yanıtını, hiçbir yere gitmeden yapıştırın.'
		],
		faqs: [
			{
				q: 'Bazı değerler neden dizge yerine sayı olarak dönüyor?',
				a: 'Ayrıştırıcı sayısal metni tanır ve dönüştürür; çoğu tüketicinin istediği de budur. Baştaki sıfırları olan tanımlayıcılara dikkat edin (ürün kodları, telefon numaraları) — veriniz için bu önemliyse dönüşümden sonra onları tırnaklayın ya da çıktıyı bir başlangıç noktası sayın.'
			},
			{
				q: 'Yinelenen öğeler nasıl ele alınıyor?',
				a: 'Aynı ada sahip iki ya da daha fazla kardeş, o anahtar altında bir JSON dizisine dönüşür. Tek geçiş ise düz bir nesne olarak kalır — bu asimetri eşlemenin doğasında vardır; dolayısıyla JSON’u tüketen kod her iki şekle de dayanmalı ya da önce normalleştirmelidir.'
			},
			{
				q: '@_ ve #text anahtarları ne anlama geliyor?',
				a: '@_ bir XML özniteliği olan şeyi işaretler; #text ise öznitelikler de varken öğenin metnini taşır. Aynı geleneği JSON → XML yönünde geri beslemek özgün biçimlendirmeyi yeniden kurar.'
			},
			{
				q: 'JSON → XML üst düzey dizimi neden reddediyor?',
				a: 'Bir XML belgesinin tam olarak bir kök öğesi olmalıdır; çıplak bir dizinin ise hiç yoktur. Diziyi bir nesneye sarın — {"items": {"item": [...]}} — dönüştürücü biçim açısından doğru bir belge üretecektir.'
			}
		]
	},

	'markdown-to-html': {
		about: [
			'Markdown yazın ya da yapıştırın; hem işlenmiş önizlemeyi hem üretilen HTML’i yan yana görün — başlıklar, GFM tabloları, görev listesi tarzı maddeler, çitli kod blokları ve üstü çizili metin dâhil. Ters yön ise var olan HTML’i temiz Markdown’a çevirir: ATX başlıkları, tireli maddeler ve çitli kod ile — eski CMS içeriğini bir dokümantasyon deposuna taşımanın en hızlı yolu budur.',
			'Önizleme işlenmeden önce temizlenir: betikler, iframe’ler ve olay işleyici öznitelikleri sıyrılır; böylece düşmanca biçimlendirme taşıyan paylaşılmış bir bağlantı tarayıcınızda hiçbir şey çalıştıramaz. HTML çıktı kutusu ise şablonlara ya da e-postalara kopyalamanız için her zaman ham dönüşümü gösterir.',
			'Dönüştürme ve önizleme yerelde çalışır. Henüz duyurulmamış özellik adları içeren sürüm notu taslakları makinenizde kalır.'
		],
		faqs: [
			{
				q: 'Bu hangi Markdown lehçesi?',
				a: 'CommonMark artı insanların gerçekten kullandığı GitHub uzantıları: tablolar, üstü çizili metin ve kendiliğinden bağlanan URL’ler. Yumuşak satır sonları yumuşak kalır — tek bir yeni satır <br> olmaz; bu, GitHub’ın belgeleri işleme biçimiyle örtüşür.'
			},
			{
				q: 'Önizleme neden ham HTML çıktısından farklı?',
				a: 'Önizleme, işlemeden önce script etiketlerini, satır içi olay işleyicilerini ve javascript: URL’lerini kaldıran bir temizleyiciden geçer. Çıktı kutusu temizlemeyi atlar, çünkü orada işlenmiş biçimlendirme değil metin vardır — kullanıcı kaynaklı HTML’i gömüyorsanız akışın ilerisinde siz temizleyin.'
			},
			{
				q: 'HTML → Markdown ne kadar sadık?',
				a: 'Yapısal öğeler — başlıklar, listeler, bağlantılar, vurgular, kod, alıntı blokları, görseller — temiz dönüşür. Markdown karşılığı olmayan HTML (iç içe tablolar, sınıflı div’ler, satır içi stiller) ham HTML olarak geçer ya da biçemini kaybeder; bu yüzden sonrasında hızlı bir gözden geçirme yapmak değer.'
			},
			{
				q: 'Üretilen HTML’i bir e-postada kullanabilir miyim?',
				a: 'Evet — çıktı, sınıf ve dış stil dosyası içermeyen düz anlamsal HTML’dir; e-posta istemcilerinin en iyi tolere ettiği şey de tam olarak budur. İhtiyacınız olan biçemi üstüne satır içi olarak ekleyin.'
			}
		]
	},

	'html-formatter': {
		about: [
			'Bir paketleyiciden, bir kazıyıcıdan ya da bir WYSIWYG editöründen çıkmış HTML’i güzelleştirin: öğeler seçtiğiniz genişlikte girintilenir, öznitelikler kendi satırında kalır ve pre/textarea içerikleri bayt bayt olduğu gibi bırakılır. Küçültme kipi yorumları sıyırır ve etiketler arası boşlukları toplar — elle yazılmış sayfalarda tipik olarak %10–25 boyut kazancı.',
			'Buradaki küçültme bilerek tutucudur: satır içi betikler ve stiller korunur, koşullu yorumlar hayatta kalır ve satır içi öğeler arasındaki tek boşluklar saklanır; böylece “şuraya <a>tıkla</a> hemen” ifadesi birbirine yapışmaz. Azami saldırganlıkta değil, güvenli bir küçültme elde edersiniz.',
			'Her iki işlem de tarayıcınızda yerelde çalışır — yayımlanmamış sayfalar ve iç yönetim arayüzü biçimlendirmesi makinenizden hiç çıkmaz.'
		],
		faqs: [
			{
				q: 'Küçültme satır içi JavaScript’imi ya da CSS’imi bozar mı?',
				a: 'Hayır — <script>, <style>, <pre> ve <textarea> blokları boşluk toplamanın tümüyle dışında tutulur. Yalnızca etiketler arasındaki biçimlendirmeye dokunulur. Betiklerin kendisini sıkıştırmak için onları ayrıca JavaScript küçültücüsünden geçirin.'
			},
			{
				q: 'Etiketler arasındaki boşluğu kaldırmak neden güvenli?',
				a: 'Çoğunlukla öyledir: blok düzeyindeki öğeler arasındaki boşluğun görsel etkisi yoktur. Satır içi öğeler arasında ise vardır; bu yüzden küçültücü ardışık boşlukları silmek yerine tek boşluğa indirir. Satır içi blok boşluk hilelerine dayanan düzenler, göz atmaya değecek ender istisnadır.'
			},
			{
				q: 'Biçimlendirici geçersiz HTML’i düzeltir mi?',
				a: 'Verdiğinizi HTML belirtimine karşı doğrulamadan biçimlendirir — kapatılmamış etiketler kapatılmamış kalır. Tarayıcılar etiket çorbasına hoşgörülüdür; yine de biçimlendirme, sorunu fark edecek kadar yapıyı görmenize yardım eder.'
			},
			{
				q: 'Hangi girinti genişliğini kullanmalıyım?',
				a: 'Web kod tabanlarında hâkim gelenek 2 boşluktur ve çoğu çatı biçem kılavuzunun varsayılanı da odur. Ekibiniz 4’te standartlaştıysa onu seçin — bu tercih tümüyle biçimseldir.'
			}
		]
	},

	'css-formatter': {
		about: [
			'Küçültülmüş ya da kopyala-yapıştır edilmiş CSS’i satır başına tek bildirim düşecek şekilde açın veya bir stil dosyasını üretim için sıkıştırın. Güzelleştirici girintileri ve süslü parantez yerleşimini normalleştirir; küçültücü ise yorumları sıyırır, boşlukları toplar ve son noktalı virgülleri atarken dizgelere, url(...) içeriklerine ve calc() ifadelerine dokunmaz.',
			'Küçültücü, yapmadığı şeyler konusunda şeffaftır: seçicileri yeniden adlandırmaz, yinelenen kuralları birleştirmez, renkleri yeniden yazmaz. Bu da çıktıyı öngörülebilir ve her stil dosyası için güvenli kılar — hile ve üretici önekleri içerenler dâhil. Yapıştır, küçült, yayına al.',
			'Buradaki her araç gibi işlem yereldir. Yayımlanmamış tasarım sistemi kodu tarayıcınızda kalır.'
		],
		faqs: [
			{
				q: 'Küçültülmüş CSS ne kadar küçülür?',
				a: 'Elle yazılmış CSS’te tipik olarak %15–30; bunun çoğu girintiler ve yorumlardan gelir. Sunucunuzdaki gzip aynı fazlalığın büyük kısmını zaten kaldırır; yani hat üzerindeki fark ham bayt sayısının ima ettiğinden küçüktür — yine de küçültün, ayrıştırma süresini de kısaltır.'
			},
			{
				q: 'calc(), özel özellikler ve medya sorguları için güvenli mi?',
				a: 'Evet. calc() içindeki boşluklar anlamlıdır ve korunur; özel özellikler ile var() başvuruları düz bildirimlerdir ve değişmeden kalır; @media ve diğer at-kuralları yapısını korur.'
			},
			{
				q: 'Torun seçicileri neden boşluklarını korudu?',
				a: 'Çünkü “nav a” ile “nava” farklı şeyleri seçer — o boşluk biçimlendirme değil, bir birleştiricidir. Küçültücü yalnızca sözdizimsel anlamı olmayan boşlukları kaldırır.'
			},
			{
				q: 'LESS/SCSS ile CSS arasında dönüşüm yapabilir mi?',
				a: 'Hayır — ön işlemci sözdizimi biçimlendirmeyi değil derlemeyi gerektirir. Aynı zamanda geçerli CSS olan sade SCSS sorunsuz biçimlenir; iç içe kurallar ve mixin’ler biçimlenmez.'
			}
		]
	},

	'js-formatter': {
		about: [
			'JavaScript’i tutarlı girinti ve boşluklarla güzelleştirin — depoya alınmış bir paketi açıp gerçekte ne yaptığını okuyun ya da konsoldan yapıştırılmış kodu temizleyin. Küçültücü ise işin aslıdır: Terser kodunuzu bir AST’ye ayrıştırır, ölü kodu atar, yerel değişken adlarını kısaltır ve yorumları sıyırır — paketleyicilerin üretimde kullandığı motorun aynısı.',
			'Küçültme AST tabanlı olduğu için, regex temelli “sıkıştırıcıların” yapabildiği gibi çalışan kodu asla bozmaz: dizgeler, şablon değişmezleri, düzenli ifadeler ve ASI sınır durumları gerçek bir ayrıştırıcı tarafından ele alınır. Sözdizimi hataları bozuk çıktı üretmek yerine konumuyla bildirilir.',
			'Terser yalnızca ilk kez küçültme yaptığınızda yüklenir, böylece sayfa hafif kalır ve tamamen tarayıcınızda çalışır — özel mülk kaynak kodu makinenizden hiç çıkmaz.'
		],
		faqs: [
			{
				q: 'Kodum ne kadar küçülecek?',
				a: 'Elle yazılmış kod gzip’ten önce tipik olarak %30–60 düşer: boşluklar, yorumlar ve uzun yerel adlar bu kadar yer kaplar. Zaten paketlenmiş kod çok daha az küçülür — aynı dönüşümden bir kez geçmiştir.'
			},
			{
				q: 'Küçültme davranışı değiştirir mi?',
				a: 'Sıkıştırma ve ad kısaltma anlambilimi korur: yalnızca yerel adlar değiştirilir ve ölü kod eleme, kanıtlanabilir biçimde çalışamayacak dalları kaldırır. Klasik istisna, Function.prototype.name ya da kendi işlevlerinin toString() çıktısına dayanan koddur.'
			},
			{
				q: 'Bir web sitesinden alınan üretim kodunu geri açabilir mi?',
				a: 'Biçimlendirici boşlukları ve yapıyı geri getirir; bu da denetim akışını okunabilir kılar — ama özgün değişken adları ve yorumlar sonsuza dek gitmiştir; karşınızda a, b, c olacak. Ciddi hata ayıklama için site kaynak haritası yayınlıyorsa onu tercih edin.'
			},
			{
				q: 'TypeScript ya da JSX destekliyor mu?',
				a: 'Hayır — ikisi de kendi ayrıştırıcılarını ister. Önce JavaScript’e derleyin (tsc, esbuild), sonra çıktıyı burada biçimlendirin ya da küçültün.'
			}
		]
	},

	'string-escape': {
		about: [
			'Tırnak içeren çok satırlı bir dizgeyi; bir JSON değerinin, bir JavaScript değişmezinin, bir Java dizgesinin, bir XML metin düğümünün, bir SQL değişmezinin ya da bir CSV hücresinin içine yapıştırabileceğiniz hâle getirin — ve bir log dosyasında kaçışlanmış metin bulup okumak istediğinizde süreci tersine çevirin. Altı lehçe, iki yön.',
			'Her lehçe, en küçük ortak paydayı değil kendi gerçek belirtimini izler: JSON denetim karakterlerini \\uXXXX olarak kaçışlar, JavaScript ek olarak tek tırnakları ve ters tırnakları kaçışlar, Java ASCII dışını UTF-16 \\u dizileri olarak kodlar, SQL tek tırnakları ikiler, CSV RFC 4180’e göre sarar ve ikiler, XML ise önceden tanımlı beş varlığını kullanır. Kaçış çözücü \\x, \\u ve \\u{…} biçimlerini anlar ve bozuk dizileri konumuyla bildirir.',
			'Kaçışlanmış dizgeler sıklıkla bağlantı dizgeleri, token’lar ve sorgu parçalarıdır. Bu araç yerelde çalışır — gönül rahatlığıyla yapıştırın.'
		],
		faqs: [
			{
				q: 'Bir JSON yapılandırma dosyası için hangi lehçe gerekir?',
				a: 'JSON. Çift tırnakları, ters eğik çizgileri ve denetim karakterlerini tam olarak RFC 8259’un gerektirdiği gibi kaçışlar ve unicode’u okunur bırakır. Çıktı herhangi bir JSON dizge değerine düşer — etrafındaki tırnaklar hariç; onları size bırakır.'
			},
			{
				q: 'JSON ile JavaScript lehçesi arasındaki fark ne?',
				a: 'JavaScript ek olarak tek tırnakları ve ters tırnakları kaçışlar; böylece sonuç üç JS tırnaklama biçiminin hepsinde güvenlidir. JSON yalnızca çift tırnak işlemesine ihtiyaç duyar. Kaçış çözme ikisini de kabul eder, ayrıca JSON’un tanımlamadığı \\x ve \\u{…} biçimlerini de.'
			},
			{
				q: 'SQL kaçışlaması kullanıcı girdisini birleştirmeyi güvenli kılar mı?',
				a: 'Doğru bir SQL dizge değişmezi üretir (tırnaklar ikilenir) ama güvenilmeyen girdide kaçışla-sonra-birleştir hâlâ yanlış desendir — parametreli sorgular kullanın. Bu araç fikstürler, göçler ve hata ayıklama içindir; enjeksiyon savunması için değil.'
			},
			{
				q: 'Dizgemin kaçışını çözmek neden başarısız oluyor?',
				a: 'Tanımlı bir kaçış olmayan bir şeyin izlediği ters eğik çizgi (\\q, yarım kalmış bir \\u12) bozuktur ve hata, sorunlu konumu adıyla söyler. Metninizde düz Windows yolları varsa önce onu kaçışlayın — C:\\temp aslında kılık değiştirmiş bir sekmedir.'
			}
		]
	},

	'number-base-converter': {
		about: [
			'Bir sayıyı herhangi bir tabanda yazın ve onu ikili, sekizli, onlu ve onaltılı olarak aynı anda okuyun — ayrıca 36’ya kadar istediğiniz özel tabanda. Önekler anlaşılır (0x, 0o, 0b), basamak gruplama uzun değerleri göz taranabilir kılar (1111 1111 · 255 · ff) ve bit uzunluğu göstergesi bir değerin 8, 32 ya da 64 bite sığıp sığmadığını bir bakışta söyler.',
			'Aritmetik BigInt kullanır; yani duyarlık her boyutta tamdır: dosya izinleri, ARGB renkleri, IP adresleri, hash önekleri ve 64 bitlik veritabanı kimliklerinin hepsi, sıradan JavaScript sayılarında 2⁵³ üzerinde görülen sessiz yuvarlama olmadan dönüşür.',
			'Negatif sayılar tüm tabanlarda işaretini korur. Her şey siz yazdıkça yerelde ve anında hesaplanır.'
		],
		faqs: [
			{
				q: 'Otomatik algılama tabanı nasıl belirliyor?',
				a: 'Öneke göre: 0x onaltılı, 0o sekizli, 0b ikili demektir; başka her şey onlu olarak ayrıştırılır. Öneksiz “ff” gibi basamaklar belirsizdir, o yüzden HEX’i açıkça seçin — hata mesajı da size bunu hatırlatır.'
			},
			{
				q: 'Devasa sayılar gerçekten tam mı?',
				a: 'Evet — dönüşüm, keyfî duyarlıklı BigInt üzerinde çalışır. 18446744073709551615 (2⁶⁴−1) tam olarak gidip geri döner; kayan nokta tabanlı bir dönüştürücü onu …551616 diye bozardı.'
			},
			{
				q: 'Negatif sayılar ikilide nasıl gösteriliyor?',
				a: 'İkiye tümleyenle değil eksi işaretiyle (-1010); çünkü ikiye tümleyen sabit bir genişlik gerektirir. İkiye tümleyen deseni görmek için, önemsediğiniz genişliğe göre negatif değerinize 2ⁿ ekleyip onu dönüştürün.'
			},
			{
				q: '36 tabanı ne işe yarar?',
				a: 'Derli toplu kimliklere: 0-9 artı a-z, büyük/küçük harf duyarsız ve URL güvenli kalan en yoğun alfabedir. Pek çok URL kısaltıcı ve bilet sistemi sayısal kimlikleri böyle kodlar — birini yapıştırın ve altındaki sayıyı okuyun.'
			}
		]
	},

	'text-to-hex': {
		about: [
			'Metninizin tam olarak hangi baytlardan oluştuğunu görün: bu araç metni UTF-8’e kodlar ve onu onaltılık, ikili ya da onlu bayt değerleri olarak gösterir — ayırıcıyı, harf durumunu ve 0x öneklerini siz seçersiniz. Çözücü ters yönde çalışır ve bilerek hoşgörülüdür: kesintisiz diziler (48656c6c6f), boşlukla ayrılmış çiftler, iki nokta ile ayrılmış MAC tarzı gösterim ve \\x kaçış dizileri kabul edilir.',
			'Kodlama bayt düzeyinde UTF-8 olduğu için çok baytlı karakterler bellekte ve hat üzerinde gerçekte nasıl varsalar öyle gösterilir: é c3 a9’dur, 世 e4 b8 96’dır ve emojiler dört bayt tutar. Bu da onu kodlama uyuşmazlıklarını, BOM gizemlerini ve “bu dizge neden göründüğünden uzun” sorunlarını ayıklamanın en hızlı yolu yapar.',
			'Çözülen baytlar geçerli UTF-8 değilse araç, anlamsız karakterler basmak yerine bunu söyler — metin değil ikili veriye baktığınıza dair güçlü bir ipucu.'
		],
		faqs: [
			{
				q: 'Tek bir karakter neden birkaç bayta dönüşüyor?',
				a: 'UTF-8 değişken genişliklidir: ASCII tek bayt kalır, çoğu Avrupa harfi iki, CJK üç, emoji dört bayt tutar. Burada gördüğünüz şey, herhangi bir UTF-8 sisteminin — dosyalar, HTTP, veritabanları — metniniz için sakladığı tam bayt dizisidir.'
			},
			{
				q: 'Çözücü hangi girdi biçimlerini kabul ediyor?',
				a: 'Onaltılık: kesintisiz dizi, boşluklu çiftler, 0x ya da \\x önekli veya iki nokta/virgülle ayrılmış hâlde; ikili: boşluklu ya da boşluksuz 8 bitlik gruplar; onlu: ayrılmış bayt değerleri. Karışık ayırıcılar ve başıboş boşluklar kendiliğinden temizlenir.'
			},
			{
				q: 'Çözme neden baytların geçerli UTF-8 olmadığını söylüyor?',
				a: 'Bayt dizisi UTF-8 kurallarını çiğniyordur — örneğin tek başına bir ff ya da öncü baytı olmayan bir devam baytı. Veri ikili olabilir, Latin-1 gibi eski bir kodlamada olabilir ya da karakterin ortasından kesilmiş olabilir.'
			},
			{
				q: 'Bu, xxd’den alınan bir hex dökümüyle aynı şey mi?',
				a: 'Bayt değerleri özdeştir; xxd ayrıca ofsetler ve bir ASCII sütunu ekler. Bir xxd dökümünün onaltılık sütunlarını (ofset sütunu olmadan) buraya yapıştırın, sorunsuz çözülür.'
			}
		]
	},

	'json-schema-validator': {
		about: [
			'Aynı disiplinin iki yönü: örnek bir JSON yapıştırın ve ondan çıkarılmış bir draft-07 şeması alın ya da veriyle birlikte bir şema yapıştırın ve her ihlali JSON yoluyla birlikte listelenmiş görün. Doğrulama Ajv üzerinde çalışır — çoğu Node servisinin kullandığı motorun aynısı — yani burada geçen, CI’da da geçer.',
			'Çıkarım üretim odaklıdır: nesne anahtarları türlü özelliklere ve required girdilerine dönüşür, diziler tüm üyelerinin şekillerini birleştirir, tam sayılar ondalıklardan ayırt edilir ve yalnızca bazı dizi üyelerinde görünen anahtarlar doğru biçimde required dışında bırakılır. Sonuç, biçimler, aralıklar ve desenlerle sıkılaştıracağınız bir başlangıç noktasıdır.',
			'API yanıtları ve yapılandırma dosyaları, üçüncü taraf bir sunucuda en son isteyeceğiniz verilerdir. Hem çıkarım hem doğrulama tamamen tarayıcınızda çalışır.'
		],
		faqs: [
			{
				q: 'Hangi JSON Schema taslağı destekleniyor?',
				a: 'Çıkarım, editörler ve doğrulayıcılar arasında en yaygın desteklenen taslak olan draft-07 üretir. Doğrulama, draft-07’yi ve Ajv’nin katı olmayan kipte anladığı önceki taslakları kabul eder; bilinmeyen anahtar kelimeler ölümcül olmak yerine yok sayıldığından 2019-09/2020-12 anahtar kelimeleri de çoğunlukla çalışır.'
			},
			{
				q: 'İhlal yollarındaki $ ne anlama geliyor?',
				a: 'JSONPath tarzında belgenin köküdür: $.age üst düzeydeki age özelliği, $.items.2.name ise üçüncü dizi elemanının adı demektir. Boş bir yol ($) ihlalin belgenin kendisiyle ilgili olduğunu gösterir — yanlış tür ya da eksik bir zorunlu özellik.'
			},
			{
				q: 'Çıkarılan şema neden beklediğimden daha katı ya da daha gevşek?',
				a: 'Tam olarak verdiğiniz örneği betimler: her yerde bulunan alanlar required olur ve yalnızca gözlemlenen türlere izin verilir. Daha genel bir şema için daha çeşitli bir örnek verin (temsilî nesnelerden oluşan bir dizi), sonra elle ayarlayın — çıkarım niyeti bilemez.'
			},
			{
				q: 'Doğrulama format, pattern ve diğer kısıt anahtar kelimelerini destekliyor mu?',
				a: 'Yapısal anahtar kelimeler (type, required, properties, items, enum, minimum, pattern…) tümüyle uygulanır. "email" ya da "date-time" gibi format dizgeleri ise doğrulanmaz — bu, format’ın varsayılan olarak açıklama sayıldığı JSON Schema belirtimini yansıtır ve yanlış bir güven duygusundan kaçınır.'
			}
		]
	},

	'exif-viewer': {
		about: [
			'Telefonunuzun çektiği her fotoğraf gizli meta veri taşır: kamera modeli, çekim zamanı, düzenleme yazılımı — ve kapatılmadıysa nerede durduğunuzun GPS koordinatları. Bu araç bu meta veriyi JPEG, PNG ve WebP dosyalarından okur ve gruplanmış, çözülmüş hâlde gösterir: pozlama değerleri f/2.8 ve 1/250 s olarak, yönelim kelimelerle, GPS ise harita bağlantılı ondalık koordinatlar olarak.',
			'Temizleyici, meta verisi kaldırılmış bir kopya üretir — hem de kayıpsız. Görseli yeniden kodlamak (ki kaliteye mal olur) yerine meta veri bölümlerini bayt bayt kaldırır: JPEG’teki EXIF ve XMP blokları, PNG’deki metin ve zaman parçaları, WebP’deki EXIF/XMP parçaları. Pikseller, boyutlar ve kalite el değmemiş kalır; renk profilleri korunur, böylece görsel aynı şekilde görünmeyi sürdürür.',
			'“Yerelde çalışır” ifadesinin bütün mesele olduğu tek araç kategorisi budur: bir fotoğrafta GPS verisi olup olmadığını denetlemek için onu bir sunucuya yüklemek amacın kendisini boşa çıkarırdı. Dosya tarayıcınızdan hiç çıkmaz — Network sekmesinden doğrulanabilir.'
		],
		faqs: [
			{
				q: 'Meta veriyi kaldırmak görsel kalitesini değiştirir mi?',
				a: 'Hayır. Görsel veri akışı bit bit kopyalanır; yalnızca meta veri bölümleri atılır. Temizlenmiş dosya tam olarak meta veri boyutu kadar küçüktür ve piksellerin özdeşliği kanıtlanabilir.'
			},
			{
				q: 'Ekran görüntümde neden hiç meta veri yok?',
				a: 'Ekran görüntülerinde ve web için dışa aktarılmış görsellerin çoğunda zaten hiç EXIF olmamıştır — onu kameralar yazar, ekran görüntüsü araçları çoğunlukla yazmaz. Sosyal medya platformları da yüklemede meta veriyi sıyırır; yani birinden indirilen bir fotoğraf genelde çoktan temizdir.'
			},
			{
				q: 'GPS konumu kesin mi?',
				a: 'EXIF’teki telefon GPS’i tipik olarak birkaç metre hassasiyetindedir — bir binayı belirlemeye yeter. Araç, saklanan derece/dakika/saniye değerlerini ondalığa çevirir ve tam noktaya bağlantı verir; böylece dosyayı alan birinin tam olarak neyi görebileceğini siz de görürsünüz.'
			},
			{
				q: 'Temizlenmiş dosya neden bir ICC renk profili koruyor?',
				a: 'ICC profili, yazılıma renklerin nasıl yorumlanacağını söyler — onu sıyırmak renkleri gözle görülür biçimde kaydırabilir ve içinde kişisel bilgi yoktur. Temizleyici kimlik belirleyici meta veriyi (EXIF, XMP, IPTC, yorumlar, zaman damgaları) kaldırır ve görselin doğru görünmesi için gerekeni bırakır.'
			}
		]
	}
};

export default TOOL_CONTENT_TR;
