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
	}
};

export default TOOL_CONTENT_TR;
