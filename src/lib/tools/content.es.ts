import type { ToolContent } from './content';

/**
 * Traducción al español del contenido SEO por herramienta (About + FAQ).
 * Corresponde uno a uno con content.ts en inglés; las entradas que falten
 * recurren automáticamente a la versión en inglés.
 */
const TOOL_CONTENT_ES: Record<string, ToolContent> = {
	'json-formatter': {
		about: [
			'Pega cualquier JSON — una respuesta de API, un archivo de configuración, una línea de log — y este formateador lo embellece con la indentación que elijas, o lo minifica para incrustarlo. El análisis usa el motor JSON nativo del navegador, así que lo que valida aquí es exactamente lo que JavaScript y cualquier parser conforme a JSON aceptarán.',
			'Cuando la entrada es inválida, el error se anota con la línea y columna exactas donde falló el análisis, en lugar de un vago "unexpected token" en alguna parte. Combinado con el editor monoespaciado, cazar una coma faltante en un payload de 500 líneas se convierte en tarea de diez segundos. También puedes ordenar las claves de los objetos alfabéticamente, lo que ayuda antes de comparar dos payloads.',
			'El formateo se ejecuta por completo en tu navegador. Los payloads que contienen tokens, registros de clientes o URLs internas nunca salen de tu máquina — no existe ningún servidor que pueda registrarlos.'
		],
		faqs: [
			{
				q: '¿Por qué mi JSON falla con "Unexpected token" si se ve bien?',
				a: 'Los culpables habituales son comas finales después del último elemento, comillas simples en lugar de dobles, claves sin comillas o comentarios. Todo eso es válido en literales de objeto de JavaScript (o JSON5), pero no en JSON estricto. El marcador de línea/columna apunta al primer carácter problemático.'
			},
			{
				q: '¿Hay un límite de tamaño?',
				a: 'No hay límite fijo — el análisis es local, así que depende de tu máquina. Documentos de hasta decenas de megabytes se formatean sin problema en un navegador moderno; más allá de eso la pestaña puede ralentizarse porque todo el documento se mantiene en memoria.'
			},
			{
				q: '¿El formateo cambia mis datos?',
				a: 'Solo el espacio en blanco, a menos que actives el ordenamiento de claves. Los números se reserializan con el motor de JavaScript, así que 1e2 se convierte en 100 y los enteros que exceden la precisión doble IEEE-754 se normalizan — lo mismo que haría cualquier consumidor de tu JSON basado en JS.'
			},
			{
				q: '¿Puedo validar JSON sin reformatearlo?',
				a: 'Sí — la insignia de estado sobre la entrada se actualiza mientras escribes e informa si el documento se puede analizar, su tamaño y dónde está el primer error. Solo necesitas la acción de formatear cuando quieres reescribir la salida.'
			}
		]
	},

	'base64-decode': {
		about: [
			'Base64 convierte bytes arbitrarios en un alfabeto de 64 caracteres que sobrevive al pegarse en JSON, URLs, cabeceras HTTP y correo electrónico. Esta herramienta convierte en ambas direcciones: escribe o pega texto para codificarlo, o pega un blob codificado para recuperar el original. UTF-8 se maneja correctamente en ambos sentidos, así que los emoji y los alfabetos no latinos hacen el viaje de ida y vuelta sin corromperse.',
			'El decodificador es tolerante a propósito: acepta el alfabeto seguro para URLs (- y _ en lugar de + y /), elimina espacios y saltos de línea, y restaura el relleno faltante antes de decodificar — las tres cosas que con más frecuencia hacen que decodificadores más estrictos rechacen entradas perfectamente recuperables. Si los bytes decodificados no son texto UTF-8 válido, lo indica en lugar de imprimir basura, lo que suele significar que el payload era binario, como una imagen.',
			'Todo ocurre dentro de la página. Decodificar un token o una credencial aquí no lo transmite a ninguna parte.'
		],
		faqs: [
			{
				q: '¿Por qué mi cadena Base64 termina con signos =?',
				a: 'Base64 codifica 3 bytes en 4 caracteres, así que cuando la longitud de la entrada no es múltiplo de 3, la salida se rellena con = para mantener los grupos alineados. El relleno no lleva datos; este decodificador lo restaura automáticamente si fue eliminado.'
			},
			{
				q: '¿Cuál es la diferencia entre Base64 estándar y el seguro para URLs?',
				a: 'El Base64 estándar usa + y /, que tienen significado especial en las URLs y deben a su vez escaparse. La variante segura para URLs (RFC 4648 §5) los cambia por - y _ y normalmente omite el relleno. Los JWT, por ejemplo, usan la forma segura para URLs. El codificador aquí ofrece ambas; el decodificador acepta cualquiera automáticamente.'
			},
			{
				q: '¿Base64 es cifrado?',
				a: 'No. Base64 es una codificación reversible sin clave — cualquiera puede decodificarla. Protege los datos de la corrupción durante el transporte, no de ser leídos. Si necesitas confidencialidad, cifra primero y codifica el texto cifrado.'
			},
			{
				q: '¿Por qué la decodificación dice que el resultado no es UTF-8 válido?',
				a: 'La cadena se decodificó correctamente, pero los bytes resultantes no son texto — a menudo un PNG, un PDF o datos comprimidos/cifrados. Decodificar ese contenido a un cuadro de texto mostraría mojibake, así que la herramienta lo señala en su lugar.'
			}
		]
	},

	'timestamp-converter': {
		about: [
			'El tiempo Unix cuenta los segundos desde 1970-01-01T00:00:00 UTC y aparece por todas partes: filas de bases de datos, claims de JWT, archivos de log, respuestas de API. Este conversor acepta un timestamp en segundos o milisegundos — detecta cuál por su magnitud — así como cadenas ISO 8601 y la mayoría de fechas legibles, y muestra todas las representaciones a la vez: ISO, UTC, tu hora local, tiempo relativo y ambas precisiones Unix.',
			'La ambigüedad de unidades es la trampa clásica: 1700000000 es noviembre de 2023 en segundos, pero enero de 1970 en milisegundos. La unidad detectada se muestra explícitamente, y puedes cambiarla con un clic cuando la suposición es incorrecta — se acabó contar dígitos mentalmente.',
			'La conversión es instantánea y local, y el reloj de hora actual sigue avanzando, así que la página funciona también como reloj epoch mientras trabajas.'
		],
		faqs: [
			{
				q: '¿Cómo decide la herramienta entre segundos y milisegundos?',
				a: 'Por magnitud: los valores de 11 dígitos o más se tratan como milisegundos, los más cortos como segundos. Eso mapea los segundos a años hasta ~5138 y los milisegundos desde ~1973 en adelante, lo que resuelve sin ambigüedad cualquier timestamp moderno realista. Puedes cambiar la unidad manualmente para casos límite.'
			},
			{
				q: '¿Qué pasa después de 2038?',
				a: 'El problema del año 2038 afecta a sistemas que almacenan el tiempo Unix en un entero de 32 bits con signo. Los números de JavaScript son flotantes de 64 bits, así que este conversor maneja fechas mucho más allá de 2038 — bastante después del año 275760, el límite de Date en JavaScript.'
			},
			{
				q: '¿Puedo convertir una fecha de vuelta a un timestamp?',
				a: 'Sí. Pega una cadena ISO 8601 como 2026-07-20T12:00:00Z, o la mayoría de formatos de fecha convencionales, y los segundos y milisegundos Unix aparecen junto a las demás representaciones.'
			},
			{
				q: '¿Qué zona horaria se usa para la fila de hora local?',
				a: 'La zona horaria configurada en tu navegador, vía la API Intl — no se consulta nada de forma remota. El nombre de la zona horaria se imprime junto al valor para que las capturas de pantalla queden sin ambigüedad.'
			}
		]
	},

	'jwt-decoder': {
		about: [
			'Un JSON Web Token son tres segmentos Base64URL — cabecera, payload, firma — unidos por puntos. Este decodificador divide un token y muestra cabecera y payload como JSON formateado, señala los claims de tiempo registrados (iat, exp, nbf) como fechas legibles, y te dice de un vistazo si el token ha expirado.',
			'Decodificar no es verificar: el payload de cualquier JWT puede leerlo cualquiera que lo tenga, porque Base64URL es una codificación, no cifrado. Por eso pegar un token en un sitio web cualquiera suele ser mala idea — esta página es la excepción, porque la decodificación ocurre por completo en tu navegador y el token nunca se transmite. La verificación de firma contra un secreto o clave pública queda deliberadamente fuera del alcance del decodificador offline.',
			'Un prefijo "Bearer " al inicio se elimina automáticamente, así que puedes pegar directamente desde una cabecera Authorization.'
		],
		faqs: [
			{
				q: '¿Es seguro pegar aquí un token de producción?',
				a: 'El token se queda en tu navegador — esta página no realiza peticiones de red con tu entrada, lo que puedes confirmar en la pestaña de red de las herramientas de desarrollo. Aun así, por hábito trata los tokens activos como contraseñas: prefiere tokens expirados o de prueba al compartir capturas de pantalla.'
			},
			{
				q: '¿Por qué mi token no se decodifica?',
				a: 'Comprueba que tenga exactamente tres segmentos separados por puntos y ningún salto de línea por ajuste al copiar. Los tokens de acceso opacos (por ejemplo, muchos tokens de GitHub o Google) no son JWT en absoluto — ninguna decodificación abrirá una cadena aleatoria que nunca contuvo JSON.'
			},
			{
				q: '¿Qué significan iat, exp y nbf?',
				a: 'Son claims registrados del RFC 7519, todos en segundos Unix: iat es cuándo se emitió el token, exp es cuándo deja de ser válido, y nbf ("not before") es el momento más temprano en que puede aceptarse. Esta herramienta convierte cada uno a una fecha legible y compara exp contra tu reloj.'
			},
			{
				q: '¿Puede esta herramienta verificar la firma?',
				a: 'No — y de todos modos no deberías confiar en la palomita verde de una herramienta online para decisiones de seguridad. Verifica las firmas en tu backend con una librería mantenida (jose, jsonwebtoken, PyJWT) contra las claves reales del emisor.'
			}
		]
	},

	'regex-tester': {
		about: [
			'Escribe un patrón, pega texto de muestra, y cada coincidencia se resalta mientras escribes — con grupos de captura, grupos con nombre y posiciones de coincidencia listados debajo. El probador usa el motor RegExp de JavaScript, así que el comportamiento coincide exactamente con lo que harán Node.js y los navegadores, incluidos lookbehind, grupos con nombre y escapes de propiedades Unicode.',
			'Las flags se activan por letra (g, i, m, s, u, y, d) y el patrón se compila con cada pulsación; los errores de sintaxis aparecen de inmediato con el mensaje propio del motor, no después de pulsar un botón. Los patrones de coincidencia vacía como a* se manejan con seguridad, y las entradas desbocadas se limitan a 10,000 coincidencias para que un .* perdido no pueda congelar la pestaña.',
			'Los dialectos de regex difieren entre motores — un patrón que funciona aquí puede necesitar ajustes para PCRE, RE2 o el módulo re de Python, sobre todo en soporte de lookbehind, cuantificadores posesivos y flags en línea.'
		],
		faqs: [
			{
				q: '¿Qué sabor de regex usa este probador?',
				a: 'ECMAScript (JavaScript), tal como lo implementa tu propio navegador. Soporta lookahead, lookbehind, grupos de captura con nombre, retrorreferencias y escapes de propiedades Unicode como \\p{Letter} (con la flag u). No soporta sintaxis exclusiva de PCRE como cuantificadores posesivos o recursión.'
			},
			{
				q: '¿Por qué mi patrón coincide con todo / con nada?',
				a: 'Las dos causas clásicas: un metacarácter sin escapar (. coincide con cualquier carácter — escápalo como \\. para un punto literal), o una flag g olvidada mentalmente — este probador siempre encuentra todas las coincidencias, pero tu código solo encontrará la primera a menos que g esté activada.'
			},
			{
				q: '¿Qué son los grupos de captura con nombre?',
				a: 'La sintaxis (?<name>...) etiqueta un grupo para que puedas leer las coincidencias por nombre en lugar de por posición: match.groups.name en JavaScript. El panel de grupos bajo las coincidencias muestra tanto las capturas numeradas como las nombradas de cada coincidencia.'
			},
			{
				q: '¿Una regex de aquí funciona sin cambios en Python o Go?',
				a: 'A menudo, pero no siempre. Las clases de caracteres, cuantificadores y anclas son portables; el lookbehind, la sintaxis de grupos con nombre (Python usa (?P<name>...)) y las flags en línea difieren. El motor RE2 de Go además rechaza por completo las retrorreferencias y el lookaround.'
			}
		]
	},

	'diff-checker': {
		about: [
			'Pega un texto original a la izquierda y una versión modificada a la derecha, y obtén una comparación unificada línea por línea: eliminaciones marcadas en rojo, adiciones en verde, contexto preservado entre medias, con los números de línea originales a ambos lados. Es la forma más rápida de responder "¿qué cambió realmente?" entre dos configuraciones, dos respuestas de API o dos versiones de un snippet que alguien pegó en el chat.',
			'La comparación usa un algoritmo de subsecuencia común más larga sobre líneas, la misma familia de algoritmos detrás de git diff, así que los bloques reordenados y las ediciones pequeñas producen un resultado legible en lugar de marcar todo como cambiado. Una línea de resumen totaliza las líneas añadidas y eliminadas.',
			'Como ambos textos permanecen en la página, comparar material confidencial — contratos, credenciales en configuraciones, textos sin publicar — no conlleva ninguno de los riesgos de pegarlo en un servicio web cualquiera.'
		],
		faqs: [
			{
				q: '¿El diff funciona sobre palabras o sobre líneas?',
				a: 'Líneas. Cada línea se compara como una unidad, lo que coincide con cómo los desarrolladores leen diffs de código y configuración. Una línea modificada aparece por tanto como una eliminación más una adición; el resaltado en línea a nivel de carácter está en la hoja de ruta.'
			},
			{
				q: '¿Por qué mi diff muestra todo como cambiado?',
				a: 'Normalmente son diferencias invisibles: un lado usa tabuladores y el otro espacios, finales de línea CRLF de Windows frente a LF de Unix, o espacios finales. Normalizar el espacio en blanco antes de comparar (el formateador JSON con claves ordenadas ayuda con payloads JSON) hace visibles los cambios reales.'
			},
			{
				q: '¿Puedo comparar dos respuestas JSON de forma significativa?',
				a: 'Sí — pasa ambas primero por el formateador JSON con el ordenamiento de claves activado, para que los documentos equivalentes se serialicen de forma idéntica. Entonces el diff muestra cambios de valor genuinos en lugar de ruido por el orden de las claves.'
			},
			{
				q: '¿Hay un tamaño máximo de texto?',
				a: 'El algoritmo compara cada línea de un texto con cada línea del otro, así que archivos extremadamente grandes (decenas de miles de líneas en ambos lados) pueden tardar un momento. Los archivos de código y payloads de API típicos se comparan al instante.'
			}
		]
	},

	'url-encode-decode': {
		about: [
			'Caracteres como espacios, ampersands y letras no ASCII no pueden aparecer tal cual en una URL, así que se codifican con porcentaje: un espacio se convierte en %20, 你 se convierte en %E4%BD%A0. Esta herramienta codifica texto para incluirlo con seguridad en URLs y decodifica cadenas con escapes de porcentaje de vuelta a texto legible, incluida la convención del + para espacios usada en cadenas de consulta.',
			'Se ofrecen dos modos de codificación porque el propio JavaScript tiene dos: el modo componente (encodeURIComponent) escapa todo lo que podría delimitar una URL, que es lo que quieres para un valor individual de la cadena de consulta; el modo URI completo (encodeURI) preserva los caracteres estructurales como /, ? y &, para cuando codificas una URL entera que debe seguir siendo navegable.',
			'La decodificación es estricta con las secuencias % malformadas — un % suelto o %ZZ se reporta como error en lugar de dejarse pasar en silencio, que es exactamente como lo tratarán los navegadores y servidores.'
		],
		faqs: [
			{
				q: '¿Cuándo uso el modo componente frente al modo URI completo?',
				a: 'Para codificar un valor que va dentro de una URL (una búsqueda, un destino de redirección, un correo en un parámetro) → modo componente, para que & y = dentro del valor no rompan la cadena de consulta. Para codificar una URL completa para mostrarla o transportarla → modo URI completo, para que la estructura de la URL sobreviva.'
			},
			{
				q: '¿Por qué + a veces significa un espacio?',
				a: 'El formato application/x-www-form-urlencoded — usado por los envíos de formularios HTML y las cadenas de consulta — codifica históricamente los espacios como +. En las rutas de URL, + es solo un signo más. El decodificador aquí trata + como espacio, siguiendo la semántica de cadenas de consulta; %20 funciona siempre en todas partes.'
			},
			{
				q: '¿Por qué mi cadena está doblemente codificada (%2520)?',
				a: '%25 es la codificación del propio %, así que %2520 significa que el texto %20 fue codificado una segunda vez. Ocurre cuando dos capas de un sistema codifican cada una. Ejecuta la decodificación dos veces aquí para desenvolverlo, y luego arregla la capa que no debería estar codificando.'
			},
			{
				q: '¿Se manejan correctamente los caracteres Unicode?',
				a: 'Sí — el texto se codifica primero como UTF-8 y cada byte se escapa con porcentaje, según el estándar de URL de WHATWG. Por eso un carácter CJK se convierte en tres grupos %XX.'
			}
		]
	},

	'url-parser': {
		about: [
			'Pega una URL y mírala diseccionada: protocolo, host, puerto, ruta, fragmento y cada parámetro de consulta en una tabla de clave-valor decodificada. Usa el mismo parser de URL WHATWG que tu navegador usa para navegar, así que la interpretación que ves es la que un navegador aplicará realmente — incluidos casos límite como puertos por defecto que se eliminan y rutas que se normalizan.',
			'La tabla de parámetros de consulta es la parte que más usarás: las redirecciones OAuth largas, los enlaces con etiquetas de analítica y las llamadas de API se vuelven legibles de un vistazo, con cada valor ya decodificado del porcentaje. También se aceptan dominios pelados sin esquema; se asume https:// para el análisis.',
			'Se complementa de forma natural con el codificador de URLs — analiza una URL aquí para encontrar el parámetro que necesitas, edita el valor y recodifícalo allí.'
		],
		faqs: [
			{
				q: '¿Por qué la URL analizada difiere ligeramente de lo que pegué?',
				a: 'El parser WHATWG normaliza: pasa a minúsculas el esquema y el host, elimina los puertos por defecto (:443 para https), resuelve los segmentos de ruta ./ y ../, y codifica los caracteres que lo necesitan. Lo que ves es la forma canónica en la que servidores y navegadores están de acuerdo.'
			},
			{
				q: '¿Puede manejar URLs con claves de consulta duplicadas?',
				a: 'Sí — cada aparición se lista como su propia fila, en orden. Las claves duplicadas son legales y comunes: muchas APIs las leen como arrays (?tag=a&tag=b).'
			},
			{
				q: '¿Cuál es la diferencia entre host y hostname?',
				a: 'hostname es solo el dominio (example.com); host incluye un puerto explícito no predeterminado (example.com:8080). Cuando el puerto es el predeterminado del esquema, ambos se ven iguales porque el puerto se omite.'
			},
			{
				q: '¿El fragmento (#...) se envía al servidor?',
				a: 'No. Todo lo que sigue a # se queda en el navegador — los servidores nunca lo ven. Por eso las aplicaciones de página única lo usaron históricamente para el enrutamiento del lado del cliente, y por eso los parámetros de analítica colocados después de # son invisibles para el backend.'
			}
		]
	},

	'uuid-generator': {
		about: [
			'Genera identificadores únicos universales en cuatro variantes: UUID v4 (totalmente aleatorio, el estándar de cada día), UUID v7 (ordenado por tiempo, la elección moderna para claves de base de datos), ULID (ordenado por tiempo con una escritura compacta en Base32 de Crockford) y Nano ID (corto, amigable con URLs). Genera uno o hasta mil a la vez — uno por línea, listos para pegar en un script de seed.',
			'La aleatoriedad proviene de la Web Crypto API (crypto.getRandomValues), la fuente criptográficamente segura, no de Math.random. La generación es local, lo que significa que nadie más conoce los IDs, no se registran en ninguna parte y están disponibles sin conexión.',
			'Si estás eligiendo un formato de ID para un sistema nuevo: v7 y ULID se ordenan por momento de creación, lo que mantiene contentos a los índices B-tree y hace que los IDs sean aproximadamente cronológicos en los logs; v4 no revela nada sobre cuándo se creó, que a veces es exactamente lo que quieres.'
		],
		faqs: [
			{
				q: '¿Cuál es la diferencia entre UUID v4 y v7?',
				a: 'v4 son 122 bits aleatorios. v7 (RFC 9562) empieza con un timestamp de 48 bits en milisegundos Unix seguido de bits aleatorios, así que los IDs generados después se ordenan después. Para claves primarias de base de datos, v7 suele mejorar la localidad de inserción y el tamaño del índice; v4 sigue siendo válido donde el orden es irrelevante o el momento de creación no debe filtrarse.'
			},
			{
				q: '¿Pueden colisionar dos UUIDs generados?',
				a: 'Con 122 bits aleatorios, la probabilidad es tan pequeña que no merece ingeniería alguna: tendrías que generar miles de millones de IDs por segundo durante décadas para alcanzar siquiera una posibilidad remota. Las colisiones en la práctica vienen de bugs (reutilizar una semilla, copiar filas), no de la aleatoriedad.'
			},
			{
				q: '¿Por qué elegir ULID en lugar de UUID v7?',
				a: 'Resuelven el mismo problema. ULID son 26 caracteres de Base32 de Crockford insensible a mayúsculas — más corto y limpio en URLs y logs — mientras que v7 mantiene la forma estándar de UUID de 36 caracteres que toda base de datos y librería ya acepta. Elige el que tu ecosistema maneje de forma más nativa.'
			},
			{
				q: '¿Son estos IDs seguros para usar como secretos o tokens?',
				a: 'La aleatoriedad es criptográficamente segura, pero los IDs normalmente se muestran, se registran y se indexan — se tratan como públicos. Para tokens de sesión o claves de API, genera un secreto dedicado con al menos 128 bits aleatorios y trátalo como una contraseña.'
			}
		]
	},

	'hash-generator': {
		about: [
			'Calcula digests MD5, SHA-1, SHA-256, SHA-384 y SHA-512 de cualquier texto, además de firmas HMAC con clave, directamente en el navegador. La familia SHA y HMAC usan la Web Crypto API — las mismas primitivas auditadas que tu navegador usa para TLS — mientras que MD5 (que Web Crypto omite deliberadamente) se incluye como una pequeña implementación local para trabajo con checksums heredados.',
			'Los hashes se actualizan en vivo mientras escribes, y todos los algoritmos se calculan a la vez, así que comparar un valor contra un checksum en el algoritmo que haya elegido una página de descargas no requiere configuración. El modo HMAC añade un campo de clave secreta para verificar firmas de webhooks — GitHub, Stripe y la mayoría de proveedores de webhooks firman los payloads con HMAC-SHA256.',
			'Como la entrada nunca sale de la página, es seguro hashear cosas que no podrías pegar en un servicio online: payloads de API, contraseñas que estás comparando contra una lista de hashes filtrados, documentos internos.'
		],
		faqs: [
			{
				q: '¿Qué algoritmo de hash debería usar?',
				a: 'Para cualquier cosa relevante para la seguridad hoy: SHA-256 o más fuerte. MD5 y SHA-1 están rotos en resistencia a colisiones — se pueden fabricar dos entradas distintas con el mismo digest — así que solo sobreviven para checksums no adversariales y compatibilidad con protocolos heredados.'
			},
			{
				q: '¿Por qué se sigue ofreciendo MD5?',
				a: 'Porque todavía te lo encuentras: ETags, claves de caché, manifiestos de archivos, columnas antiguas de bases de datos. Verificar esos valores requiere calcular MD5 sin importar su estatus criptográfico. Simplemente no diseñes nada nuevo alrededor de él.'
			},
			{
				q: '¿Qué es HMAC y en qué se diferencia de un hash normal?',
				a: 'HMAC mezcla una clave secreta en el hasheo, de modo que solo quienes tienen la clave pueden producir o verificar el digest. Un hash normal demuestra integridad ("estos datos no han cambiado"); un HMAC además demuestra autenticidad ("alguien con la clave produjo esto"). La verificación de firmas de webhooks es el uso cotidiano.'
			},
			{
				q: '¿Hashear es lo mismo que cifrar una contraseña?',
				a: 'No, y los hashes rápidos como SHA-256 son la herramienta equivocada para almacenar contraseñas — los atacantes pueden probar miles de millones por segundo. El almacenamiento de contraseñas necesita un algoritmo deliberadamente lento y con sal: bcrypt, scrypt o Argon2.'
			}
		]
	},

	'case-converter': {
		about: [
			'Los identificadores viajan entre convenciones constantemente: la API devuelve snake_case, tu TypeScript quiere camelCase, la clase CSS necesita kebab-case y la variable de entorno exige CONSTANT_CASE. Este conversor toma cualquier entrada mixta — espacios, guiones bajos, guiones, camelCase existente — la divide en palabras de forma inteligente y la vuelve a unir en nueve estilos de destino a la vez.',
			'El divisor entiende los casos difíciles: separa "getUserByID" en get/user/by/id (manteniendo el acrónimo intacto hasta el límite), trata los dígitos como parte de su palabra y procesa cada línea de forma independiente, así que puedes pegar una columna entera de campos de base de datos y convertirlos de una vez.',
			'Todos los estilos se muestran simultáneamente con un botón de copiar por fila — sin elegir un modo primero, solo pega y toma el que necesites.'
		],
		faqs: [
			{
				q: '¿Cómo se manejan acrónimos como "HTTPResponse"?',
				a: 'Una secuencia de mayúsculas seguida de una minúscula se divide antes de la última mayúscula: HTTPResponse → http + response. Esto coincide con cómo la mayoría de guías de estilo esperan que se tokenicen los acrónimos, aunque ningún divisor puede adivinar la intención perfectamente — casos límite como "IOError" se convierten en io + error.'
			},
			{
				q: '¿Puedo convertir muchos identificadores a la vez?',
				a: 'Sí — cada línea se convierte de forma independiente. Pega una lista de nombres de columnas, uno por línea, y la salida preserva la estructura de líneas en el nuevo estilo.'
			},
			{
				q: '¿Cuál es la diferencia aquí entre Title Case y Sentence case?',
				a: 'Title Case pone en mayúscula cada palabra ("User Account Id"); Sentence case solo la primera ("User account id"). Ninguno aplica las reglas editoriales sobre artículos y preposiciones — para identificadores casi nunca las quieres.'
			},
			{
				q: '¿Por qué convertir de ida y vuelta no siempre restaura mi original?',
				a: 'Dividir en palabras descarta información — "user_ID_2" y "userId2" se tokenizan de forma idéntica. Las conversiones son deterministas hacia adelante, pero la escritura original de los límites de palabra no siempre puede reconstruirse hacia atrás.'
			}
		]
	},

	'word-counter': {
		about: [
			'Un contador de palabras y caracteres en vivo con los números que desarrolladores y escritores realmente necesitan: palabras, caracteres con y sin espacios, bytes UTF-8 (lo que tu columna de base de datos o límite de API mide realmente), líneas, oraciones, párrafos y un tiempo de lectura estimado a las típicas 220 palabras por minuto.',
			'Los caracteres se cuentan como puntos de código Unicode, no como unidades UTF-16, así que los emoji y el texto CJK se cuentan como un humano esperaría — y el recuento separado de bytes hace visible la diferencia: 日本語 son 3 caracteres pero 9 bytes. Esa distinción es exactamente la que muerde cuando una columna VARCHAR(255) rechaza una cadena de 200 "caracteres".',
			'Todo se actualiza mientras escribes, sin enviar nada a ninguna parte — seguro para contar borradores de anuncios, contratos o cualquier otra cosa que aún no esté lista para el mundo.'
		],
		faqs: [
			{
				q: '¿Por qué difieren los recuentos de caracteres y de bytes?',
				a: 'Los caracteres son puntos de código Unicode; los bytes son su codificación UTF-8. Las letras ASCII ocupan 1 byte cada una, la mayoría de letras europeas acentuadas 2, los caracteres CJK 3, y los emoji 4 (o más en secuencias). Los límites de bases de datos, las cabeceras HTTP y muchas APIs miden bytes, no caracteres.'
			},
			{
				q: '¿Cómo se cuentan las palabras en idiomas sin espacios?',
				a: 'El recuento de palabras divide por espacios en blanco, lo que subestima el texto sin segmentar en chino o japonés. Para esos idiomas, el recuento de caracteres es la métrica más significativa, y por eso ambos se muestran siempre.'
			},
			{
				q: '¿Qué cuenta como una oración?',
				a: 'Una secuencia de texto que termina en ., !, ? o … seguida de espacio en blanco o el final de la entrada. Abreviaturas como "e.g." pueden inflar ligeramente el recuento — contar oraciones es inherentemente heurístico.'
			},
			{
				q: '¿Qué tan preciso es el tiempo de lectura?',
				a: 'Divide el recuento de palabras entre 220 ppm, un promedio común para la lectura silenciosa adulta de prosa general. El material técnico con código se lee más lento; los listados hojeables se leen más rápido. Trátalo como una estimación de orden de magnitud.'
			}
		]
	},

	'lorem-ipsum-generator': {
		about: [
			'Texto de relleno para layouts, mockups y datos de prueba, generado en tu navegador: elige palabras, oraciones o párrafos, define una cantidad y copia. La salida se basa en el clásico vocabulario de Cicerón revuelto, así que parece prosa natural pseudolatina sin formar oraciones legibles que distraigan.',
			'Por defecto el texto abre con el tradicional "Lorem ipsum dolor sit amet" — la frase que diseñadores y revisores reconocen al instante como texto de relleno — y puedes desactivarlo para obtener salida totalmente aleatoria cuando necesitas varios bloques distintos.',
			'Las longitudes de las oraciones y los tamaños de los párrafos varían aleatoriamente dentro de rangos realistas, así que el texto resultante tiene el ritmo visual de un texto real — importante cuando estás evaluando tipografía o ajuste de línea, donde las oraciones uniformes se ven artificiales.'
		],
		faqs: [
			{
				q: '¿De dónde viene el lorem ipsum?',
				a: 'Son fragmentos revueltos de "De finibus bonorum et malorum" de Cicerón (45 a.C.), usados como relleno por los tipógrafos desde al menos los años 60 y popularizados por las láminas de Letraset y más tarde por el software de autoedición.'
			},
			{
				q: '¿Por qué usar lorem ipsum en lugar de texto real?',
				a: 'El contenido legible secuestra la atención — los revisores empiezan a editar las palabras en lugar de evaluar el layout. El pseudolatín tiene frecuencias de letras y longitudes de palabra naturales sin ser legible, lo que mantiene el foco en el diseño.'
			},
			{
				q: '¿El texto generado es siempre el mismo?',
				a: 'No — las palabras se eligen aleatoriamente cada vez, así que dos generaciones difieren. Solo la frase de apertura clásica opcional es fija.'
			},
			{
				q: '¿Puedo generar un número exacto de palabras para el límite de un campo de CMS?',
				a: 'Sí — pon la unidad en palabras y la cantidad en exactamente lo que necesitas, hasta 1000 a la vez. Combínalo con el contador de palabras para verificar límites de caracteres o bytes.'
			}
		]
	},

	'slug-generator': {
		about: [
			'Convierte cualquier título en un slug listo para URL: minúsculas, separado por guiones, sin puntuación, con los acentos transliterados a ASCII plano — "Crème brûlée à Paris" se convierte en "creme-brulee-a-paris". Las opciones cubren las variantes comunes: separadores de guion bajo, mayúsculas preservadas y una longitud máxima que corta en el límite de una palabra en lugar de a media palabra.',
			'Los slugs importan tanto para humanos como para motores de búsqueda: son legibles en la barra de direcciones, sobreviven al copiarse y pegarse en un chat sin escapes de porcentaje, y dan a los resultados de búsqueda una URL con palabras clave. El paso de transliteración es lo que la mayoría de funciones slugify caseras omiten — sin él, los títulos acentuados o rompen las URLs o desaparecen por completo.',
			'Cada línea se convierte en slug de forma independiente, así que una lista pegada de títulos de artículos se transforma en la lista correspondiente de slugs en una sola operación.'
		],
		faqs: [
			{
				q: '¿Por qué guiones en lugar de guiones bajos?',
				a: 'Los motores de búsqueda tratan los guiones como separadores de palabras, pero históricamente trataron los guiones bajos como uniones de palabras, y los guiones son visualmente más claros en texto de enlace subrayado. Los guiones bajos siguen siendo populares para nombres de archivo e identificadores, así que se ofrecen ambos.'
			},
			{
				q: '¿Qué pasa con alfabetos no latinos como el chino o el cirílico?',
				a: 'Los caracteres con equivalentes ASCII (latín acentuado, algunas letras especiales como ß → ss) se transliteran; los alfabetos sin un mapeo latino sencillo se eliminan. Para contenido no latino, la práctica común es o mantener el alfabeto nativo codificado con porcentaje en la URL o escribir un slug romanizado a mano.'
			},
			{
				q: '¿Existe una longitud ideal de slug?',
				a: 'Más corto es mejor para compartir y mostrar, pero no hay un precipicio de ranking. La opción de longitud máxima recorta en el límite de una palabra — útil para CMSes que limitan las columnas de slug a 50–80 caracteres.'
			},
			{
				q: '¿Debería cambiar el slug cuando cambia el título?',
				a: 'Una vez publicado, idealmente no — la URL es una dirección a la que otros han enlazado. La mayoría de sitios conservan el slug original o añaden una redirección. Genera los slugs al crear el contenido y trata los renombrados como una decisión deliberada de redirección.'
			}
		]
	},

	'sort-lines': {
		about: [
			'Un banco de trabajo para procesar líneas: pega cualquier lista y ordénala alfabéticamente, en reversa, de forma natural (item2 antes que item10), por longitud, o mézclala — mientras opcionalmente recortas espacios, descartas líneas vacías y eliminas duplicados preservando el orden. El recuento de líneas eliminadas se reporta para que veas exactamente qué hizo la deduplicación.',
			'El orden natural es la opción que más usarás: el orden alfabético simple pone "item10" antes que "item2" porque compara carácter por carácter, mientras que el orden natural compara los números incrustados numéricamente — el orden que los humanos esperan para nombres de archivo, versiones e IDs.',
			'La deduplicación conserva la primera aparición y preserva el orden original de las supervivientes, lo que importa cuando el orden de la lista es significativo (imports, líneas de configuración, playlists). Un modo insensible a mayúsculas trata "Apple" y "apple" como la misma línea.'
		],
		faqs: [
			{
				q: '¿Cuál es la diferencia entre orden alfabético y natural?',
				a: 'El alfabético compara códigos de carácter, así que "file10" < "file2" (porque "1" < "2" en la posición 5). El orden natural reconoce secuencias de dígitos y las compara como números, dando file2 < file10. Usa el natural para cualquier cosa que contenga números.'
			},
			{
				q: '¿La deduplicación conserva la primera o la última aparición?',
				a: 'La primera. Las líneas se recorren de arriba abajo y una línea se descarta solo si otra idéntica (o igual sin distinguir mayúsculas, en el modo insensible) apareció antes — así el orden superviviente coincide con el original.'
			},
			{
				q: '¿Qué tamaño de lista puede manejar?',
				a: 'Cientos de miles de líneas van bien — las operaciones son pasadas simples y un ordenamiento. Todo permanece en la memoria del navegador, así que el límite práctico es tu máquina, no una cuota de servidor.'
			},
			{
				q: '¿Puedo combinar operaciones?',
				a: 'Sí, y se aplican en un orden sensato: primero recortar, luego eliminar vacías, luego deduplicar, luego ordenar — así " apple " y "apple" se deduplican juntas cuando el recorte está activado, y el ordenamiento siempre ve la lista limpia.'
			}
		]
	},

	'html-entities': {
		about: [
			'Escapa texto para incluirlo con seguridad en HTML — & se convierte en &amp;, < se convierte en &lt; — o decodifica texto cargado de entidades de vuelta a caracteres legibles, cubriendo entidades con nombre (&rarr;), decimales (&#169;) y referencias numéricas hexadecimales (&#xA9;).',
			'La codificación ofrece dos niveles: los cinco caracteres esenciales que rompen la estructura HTML (& < > " \'), que es todo lo que necesitas para la corrección, o todo lo no ASCII, útil cuando una cadena de herramientas estropea UTF-8 en algún punto entre tú y la página. Un modo solo numérico omite las entidades con nombre para máxima compatibilidad con parsers XML estrictos, que solo garantizan las cinco predefinidas.',
			'El decodificador es la mitad de uso diario: pega un fragmento raspado o una respuesta de API llena de &#x27; y obtén texto limpio. Los nombres de entidad desconocidos pasan intactos en lugar de adivinarse.'
		],
		faqs: [
			{
				q: '¿Qué caracteres deben escaparse en HTML?',
				a: 'En contenido de texto: & y <. En valores de atributo: también el carácter de comilla que delimita el atributo (" o \'). Escapar > es convencional pero no estrictamente necesario. Todo lo demás puede aparecer literalmente en un documento UTF-8.'
			},
			{
				q: '¿La codificación de entidades es una defensa contra XSS?',
				a: 'Escapar los cinco caracteres estructurales es el núcleo de la codificación de salida en contexto HTML, sí — pero solo para contextos de texto y atributos HTML. Las URLs, las cadenas de JavaScript y el CSS necesitan sus propias codificaciones específicas de contexto; el escape de entidades por sí solo no hace segura la inyección arbitraria ahí.'
			},
			{
				q: 'Entidades con nombre o numéricas — ¿cuáles debería emitir?',
				a: 'Las referencias numéricas (&#xE9;) funcionan en todo parser HTML y XML. Las entidades con nombre son más legibles, pero XML solo predefine cinco, así que &eacute; rompe un pipeline XML/XHTML estricto. Ante la duda, numéricas.'
			},
			{
				q: '¿Por qué veo &amp;#39; (doblemente codificado) en mis datos?',
				a: 'Dos capas codificaron una vez cada una: el & de la primera codificación fue a su vez escapado por una segunda pasada. Decodifica dos veces aquí para recuperar el texto, y luego encuentra y arregla la capa que no debería estar codificando.'
			}
		]
	},

	'unicode-inspector': {
		about: [
			'Pega cualquier texto y mira cada carácter diseccionado: su punto de código (U+XXXX), bytes UTF-8, unidades UTF-16, secuencia de escape de JavaScript, entidad HTML y categoría general — más totales de puntos de código, unidades UTF-16, bytes UTF-8 y caracteres percibidos por el usuario (clústeres de grafemas).',
			'Esta es la herramienta para los momentos de "¿por qué esta cadena es rara?": los caracteres invisibles (espacios de ancho cero, BOMs, marcas direccionales) aparecen como filas visibles; los caracteres parecidos (la а cirílica frente a la a latina) revelan puntos de código distintos; y un emoji que "es un carácter" resulta ser siete puntos de código unidos por zero-width joiners.',
			'Los cuatro totales de longitud distintos responden a la eterna pregunta de por qué el .length de JavaScript, un límite de bytes de base de datos y lo que el usuario ve no se ponen de acuerdo sobre cuán larga es una cadena.'
		],
		faqs: [
			{
				q: '¿Por qué "🎉".length === 2 en JavaScript?',
				a: 'Las cadenas de JavaScript cuentan unidades de código UTF-16. Los caracteres más allá de U+FFFF — incluida la mayoría de emoji — necesitan un par sustituto, dos unidades. El inspector muestra ambas unidades y el punto de código real, y el resumen los cuenta por separado.'
			},
			{
				q: '¿Qué es un clúster de grafemas?',
				a: 'Lo que un lector percibe como un solo carácter. é puede ser dos puntos de código (e + acento combinante), y los emoji de familia pueden ser siete o más unidos por zero-width joiners. El recuento de grafemas usa el Intl.Segmenter del navegador — lo más cercano a "caracteres como los ve el usuario".'
			},
			{
				q: '¿Cómo encuentro caracteres invisibles en una cadena?',
				a: 'Pégala aquí — cada punto de código recibe una fila, incluidos los espacios de ancho cero (U+200B), los espacios de no separación (U+00A0), los BOMs (U+FEFF) y las marcas direccionales, cada uno etiquetado por categoría. Son los clásicos culpables detrás de cadenas "idénticas" que fallan las comprobaciones de igualdad.'
			},
			{
				q: '¿Qué me dicen las secuencias de bytes UTF-8?',
				a: 'Exactamente lo que se almacenará o transmitirá: ASCII es un byte, la mayoría de extensiones latinas dos, CJK tres, emoji cuatro. Si un sistema trunca a media secuencia obtienes caracteres de reemplazo (�) — la vista de bytes muestra dónde caerían esos cortes.'
			}
		]
	},

	'cron-parser': {
		about: [
			'Pega una expresión cron de cinco campos y obtén su explicación en lenguaje claro, con un desglose campo por campo y — la parte que atrapa errores reales — las próximas cinco ejecuciones concretas calculadas en tu zona horaria local. "0 3 * * 1" se lee como "A las 03:00, los lunes", seguido de las fechas concretas en que se disparará.',
			'El parser soporta la sintaxis estándar completa: listas (1,15), rangos (9-17), pasos (*/15), nombres de mes y día de la semana (jan, mon), 7 como domingo y la familia de macros @daily/@hourly. También implementa la regla que todos olvidan: cuando tanto el día del mes como el día de la semana están restringidos, el trabajo se ejecuta cuando cualquiera de los dos coincide, no ambos.',
			'Las expresiones de seis campos (Quartz, con segundos) se detectan y se señalan explícitamente en lugar de analizarse mal en silencio — la fuente más común de la confusión de "mi cron está mal" al moverse entre planificadores Java y el crontab de Unix.'
		],
		faqs: [
			{
				q: '¿Cuáles son los cinco campos, en orden?',
				a: 'Minuto (0–59), hora (0–23), día del mes (1–31), mes (1–12), día de la semana (0–6, domingo = 0, aceptando también 7 como domingo). Recordar el orden es la lucha eterna — el panel de desglose etiqueta cada campo de tu expresión.'
			},
			{
				q: '¿Por qué "0 0 1 * 1" se ejecuta más a menudo de lo que esperaba?',
				a: 'Porque tanto el día del mes (el 1) como el día de la semana (lunes) están restringidos, cron ejecuta el trabajo cuando CUALQUIERA coincide — cada día 1 del mes Y cada lunes. Para expresar "el día 1 solo cuando cae en lunes", necesitas comprobar la fecha en el script.'
			},
			{
				q: '¿Qué zona horaria usan las próximas ejecuciones?',
				a: 'La zona horaria local de tu navegador, mostrada junto a los resultados. Los crontabs reales corren en la zona horaria del servidor (o la línea TZ= en algunos crons) — confirma siempre cuál usa la máquina de destino, sobre todo con los cambios de horario de verano.'
			},
			{
				q: '¿Soporta segundos o años?',
				a: 'No — esas son extensiones de Quartz (Java) con 6 o 7 campos. El cron estándar de Unix tiene exactamente cinco campos y resolución de un minuto. La entrada de seis campos se detecta y se reporta como Quartz en lugar de malinterpretarse.'
			}
		]
	},

	'password-generator': {
		about: [
			'Genera contraseñas aleatorias con la longitud y los conjuntos de caracteres que elijas, en lote si hace falta, con un cálculo de entropía honesto — bits de aleatoriedad, no una barra de colores decorativa. La aleatoriedad proviene de crypto.getRandomValues con muestreo por rechazo, así que cada carácter se extrae de manera uniforme sin sesgo de módulo.',
			'A cada conjunto de caracteres activado se le garantiza al menos un representante (una política que muchos sitios exigen), luego el resto de la contraseña se rellena uniformemente y el conjunto entero se mezcla — así los caracteres garantizados no se agrupan de forma predecible al principio.',
			'Un filtro de caracteres ambiguos elimina los que se confunden (0/O, 1/l/I) para contraseñas que un humano pueda llegar a leer en voz alta o reteclear desde papel. Como la generación es local, las contraseñas existen solo en tu máquina hasta que las pongas en algún sitio.'
		],
		faqs: [
			{
				q: '¿Qué significan los bits de entropía?',
				a: 'Entropía = longitud × log2(tamaño del conjunto): el número de posibilidades equiprobables que un atacante debe recorrer. 64 bits de entropía resisten un ataque casual; 80+ bits es fuerte contra el crackeo offline de hashes rápidos; 100+ es efectivamente inadivinable. Una contraseña de 16 caracteres con letras+dígitos+símbolos ronda los 104 bits.'
			},
			{
				q: '¿Es mejor una contraseña larga en minúsculas que una corta y compleja?',
				a: 'A menudo sí — la longitud multiplica la entropía, mientras que los conjuntos extra solo ensanchan la base del logaritmo. 20 letras minúsculas (~94 bits) superan a 10 caracteres totalmente mezclados (~65 bits). Las reglas de complejidad existen sobre todo para derrotar listas de palabras, algo que la generación aleatoria ya derrota.'
			},
			{
				q: '¿Es seguro generar contraseñas en un navegador?',
				a: 'La aleatoriedad (crypto.getRandomValues) es el mismo CSPRNG que usan los gestores de contraseñas nativos, y esta página no realiza peticiones de red con tus datos. Los riesgos realistas están en lo que ocurre después de generar: el historial del portapapeles, compartir pantalla y dónde la guardas.'
			},
			{
				q: '¿Por qué excluir caracteres ambiguos?',
				a: 'Para contraseñas que serán leídas por humanos — códigos de recuperación impresos, dictadas por teléfono, tecleadas desde otra pantalla — 0/O y 1/l/I causan tickets de soporte reales. Para contraseñas que solo se pegan, consérvalos; la pérdida de entropía por excluirlos es menor en cualquier caso.'
			}
		]
	},

	'qr-code-generator': {
		about: [
			'Escribe o pega cualquier texto — una URL, credenciales de WiFi, información de contacto — y obtén un código QR al instante, renderizado como un SVG vectorial nítido que puedes descargar, o exportado como PNG para chats y presentaciones. Sin marca de agua, sin redirección de "plan gratuito" que expira, y como la generación es local, lo que codifiques nunca toca un servidor.',
			'Ese último punto importa más de lo que parece: muchos servicios de QR gratuitos enrutan tu URL a través de su dominio de redirección (para poder cobrarte después o rastrear escaneos), lo que significa que el código deja de funcionar cuando el servicio cierra. Los códigos generados aquí codifican tu contenido directamente y funcionan para siempre.',
			'Cuatro niveles de corrección de errores intercambian capacidad por robustez — L sobrevive daños ligeros, H sobrevive con el 30% del símbolo oculto (útil cuando un logo cubrirá el centro o la impresión será pequeña y desgastada).'
		],
		faqs: [
			{
				q: '¿Qué nivel de corrección de errores debería elegir?',
				a: 'M (15%) es el valor por defecto sensato. Usa H (30%) para códigos impresos pequeños, códigos tras un cristal o con reflejos, o al superponer un logo. Más corrección hace el código más denso, así que para URLs muy largas en pantalla, L mantiene los módulos más grandes y fáciles de escanear.'
			},
			{
				q: '¿Por qué SVG es mejor que PNG para imprimir?',
				a: 'SVG es independiente de la resolución — la impresora rasteriza a su DPI nativo, manteniendo los bordes de los módulos perfectamente nítidos a cualquier tamaño. El PNG debe generarse a un tamaño de píxeles concreto y puede verse borroso al escalarlo. Usa SVG para impresión y herramientas de diseño, PNG para chat y presentaciones.'
			},
			{
				q: '¿Cuántos datos caben en un código QR?',
				a: 'Hasta ~3 KB de bytes en teoría (versión 40, nivel L), pero códigos tan grandes son difíciles de escanear desde pantallas. Por debajo de 300 caracteres se escanea con fiabilidad; para URLs largas, acórtalas primero — con el acortador de tu propio dominio si la permanencia importa.'
			},
			{
				q: '¿Estos códigos expiran o rastrean los escaneos?',
				a: 'No. El contenido se codifica directamente en el patrón — nada pasa por este sitio, así que no hay nada que pueda expirar, y nadie (incluidos nosotros) ve cuándo o dónde se escanea. El rastreo de escaneos requiere inherentemente un servicio de redirección.'
			}
		]
	},

	'qr-code-decoder': {
		about: [
			'Suelta, pega o elige cualquier imagen que contenga un código QR — una captura de pantalla, una entrada descargada, la foto de un póster — y el contenido se extrae aquí mismo, en tu navegador. Cubre justo el caso que la cámara del móvil no puede: un código QR que ya está en la pantalla que estás mirando. Y cuando el código está en un papel frente a ti, el modo cámara lo escanea en vivo — sin instalar ninguna app.',
			'El decodificador reconoce lo que encontró y reacciona en consecuencia: las URL reciben un botón para abrir el enlace, los códigos WiFi se desglosan en nombre de red, contraseña y tipo de seguridad, y las cargas vCard, mailto:, tel:, geo: y otpauth: quedan etiquetadas para que sepas qué estás pegando antes de usarlo. El texto no latino y los emoji se decodifican correctamente como UTF-8, y los códigos invertidos (claros sobre fondo oscuro) se manejan automáticamente.',
			'Como el escaneo es local, es seguro para códigos sensibles: una contraseña WiFi, un código de configuración 2FA o un enlace privado nunca salen de tu máquina. También es la forma honesta de comprobar qué contiene realmente un código sospechoso antes de que algo lo escanee de verdad.'
		],
		faqs: [
			{
				q: '¿Por qué no se encontró ningún código QR en mi imagen?',
				a: 'Las causas habituales son desenfoque, poco contraste, mucha distorsión de perspectiva, o que el código sea una fracción diminuta de una foto grande. Recorta más cerca del código, usa una fuente más nítida y asegúrate de que la zona de silencio — el margen en blanco alrededor del símbolo — sea visible. Las capturas de pantalla se decodifican casi siempre; las fotos en ángulo de superficies curvas o brillantes son el caso difícil.'
			},
			{
				q: '¿Puede leer códigos QR de WiFi?',
				a: 'Sí. Las cargas WIFI: (el formato que generan Android e iOS al compartir una red) se analizan en nombre de red, contraseña, tipo de seguridad y el indicador de red oculta, con las reglas de escape resueltas — así que una contraseña con ; o : sale intacta.'
			},
			{
				q: '¿Es seguro decodificar un código QR de origen desconocido?',
				a: 'Decodificar aquí solo lee el patrón y te muestra el texto — no se visita, ejecuta ni sube nada. Eso lo convierte en un buen primer paso ante un código en el que no confías: mira la URL real antes de decidir abrirla. El botón de abrir enlace nunca se dispara solo.'
			},
			{
				q: '¿Qué formatos de imagen funcionan?',
				a: 'Todo lo que tu navegador pueda mostrar: PNG, JPEG, WebP, GIF, BMP, AVIF y SVG. La imagen se dibuja en un lienzo y se escanea a varias escalas, así que tanto las fotos enormes como las capturas pequeñas tienen buenas opciones. Las imágenes animadas se escanean en su primer fotograma.'
			}
		]
	},

	'json-to-yaml': {
		about: [
			'Convierte entre JSON, YAML y TOML en cualquier dirección. El formato de origen se detecta automáticamente al pegar — los corchetes sugieren JSON, los dos puntos de key: sugieren YAML, las [tablas] sugieren TOML — con anulación manual para entradas ambiguas. La conversión pasa por un análisis real, así que la salida está garantizada como válida, no es una transformación de texto línea a línea.',
			'Cada formato tiene fortalezas reales: JSON para APIs e intercambio entre máquinas, YAML para configuración editada por humanos (Kubernetes, pipelines de CI), TOML para archivos de configuración bien tipados (Cargo, pyproject). Mover datos entre ellos a mano invita a errores de indentación y comillas que esta conversión elimina.',
			'El conversor es honesto sobre los límites de formato: TOML no tiene arrays de nivel superior ni null, y al convertir tales documentos reporta el porqué en lugar de descartar datos en silencio.'
		],
		faqs: [
			{
				q: '¿Sobrevivirán los comentarios a la conversión?',
				a: 'No — JSON no tiene sintaxis de comentarios, y la conversión pasa por la estructura de datos analizada, que no transporta comentarios. Convertir YAML → JSON → YAML pierde los comentarios de forma irreversible; conserva el archivo original cuando los comentarios importen.'
			},
			{
				q: '¿Por qué mi "no" de YAML se convirtió en false?',
				a: 'YAML 1.1 trata yes/no/on/off como booleanos, y el código de país NO se convierte célebremente en false. El parser aquí sigue YAML 1.2 (solo true/false), pero los archivos escritos para parsers antiguos aún pueden sorprender. Pon comillas a las cadenas que parezcan booleanos, números o fechas.'
			},
			{
				q: '¿Por qué mi JSON no se convierte a TOML?',
				a: 'TOML requiere una tabla (objeto) en el nivel superior — los arrays o escalares sueltos no pueden ser un documento TOML — y no tiene null. Reestructura los datos (envuelve el array en una clave, elimina los null o dales un valor por defecto) y convertirá.'
			},
			{
				q: '¿YAML es un superconjunto de JSON?',
				a: 'En la práctica sí — YAML 1.2 analiza virtualmente todos los documentos JSON, y por eso pegar JSON en una configuración YAML normalmente funciona. Lo inverso no es cierto: los anclajes, escalares multilínea y etiquetas de YAML no tienen equivalente JSON y se expanden o convierten a cadena al convertir.'
			}
		]
	},

	'json-to-csv': {
		about: [
			'Pega un array de objetos JSON y obtén un CSV listo para hoja de cálculo: los objetos anidados se aplanan en nombres de columna con puntos (user.address.city), las columnas se unen a través de todas las filas (los valores faltantes se convierten en celdas vacías), y el entrecomillado sigue el RFC 4180 para que las comas, comillas y saltos de línea dentro de los valores sobrevivan a Excel y Google Sheets.',
			'Este es el camino más rápido de una respuesta de API a una hoja de cálculo que alguien pueda filtrar y pivotar. La unión de columnas importa con datos del mundo real, donde los objetos son heterogéneos — la fila 1 puede carecer de campos que la fila 40 tiene, y el conversor lo maneja en lugar de fallar o descartar datos.',
			'El conversor también funciona en sentido inverso: pega una exportación CSV y obtén un array JSON de objetos cuyas claves salen de la fila de cabecera, con detección automática de delimitador (coma, punto y coma, tabulador, barra vertical) y valores tipados opcionales — los números, los booleanos y null se convierten en tipos JSON reales. Ambas direcciones corren por completo en tu navegador, así que las exportaciones de clientes nunca salen de tu máquina.'
		],
		faqs: [
			{
				q: '¿Cómo se representan los objetos anidados?',
				a: 'Aplanados con claves unidas por puntos: {"user":{"name":"Ada"}} se convierte en una columna user.name. Esto mantiene cada valor escalar direccionable en una única fila de encabezado plana, que es con lo que las herramientas de hoja de cálculo pueden trabajar realmente.'
			},
			{
				q: '¿Qué pasa con los arrays dentro de una fila?',
				a: 'Se incrustan como texto JSON en una sola celda (["a","b"]). Explotar arrays en columnas (tags.0, tags.1…) o en filas extra cambia la forma de tus datos de maneras opinadas — incrustarlos mantiene la conversión sin pérdidas y predecible.'
			},
			{
				q: '¿Por qué Excel muestra mi CSV en una sola columna?',
				a: 'Configuración regional: en buena parte de Europa y Latinoamérica, Excel espera archivos separados por punto y coma porque la coma es el separador decimal. Cambia la opción de delimitador a punto y coma, o usa Datos → Desde texto/CSV, que te permite especificar el separador.'
			},
			{
				q: '¿El conversor maneja un objeto individual (no un array)?',
				a: 'Sí — un objeto solitario se convierte en un CSV de una fila. Eso sí, los objetos indexados por ID ({"a1":{...},"a2":{...}}) se convierten en una única fila ancha; conviértelos primero en un array si cada valor debe ser una fila.'
			},
			{
				q: '¿Cómo maneja CSV → JSON los campos entrecomillados y los saltos de línea incrustados?',
				a: 'Según el RFC 4180: los campos envueltos en comillas dobles pueden contener el delimitador, comillas duplicadas ("") para una comilla literal, y saltos de línea. Excel y la mayoría de bases de datos exportan exactamente este formato, así que los archivos del mundo real se analizan correctamente.'
			},
			{
				q: '¿Por qué mis códigos postales pierden los ceros iniciales en CSV → JSON?',
				a: 'La conversión tipada convierte 02134 en el número 2134. Desmarca «Valores tipados» y cada celda se queda como cadena, exactamente como está escrita — la elección correcta para identificadores, números de teléfono y cualquier cosa con ceros iniciales.'
			}
		]
	},

	'json-to-typescript': {
		about: [
			'Pega una muestra de JSON — una respuesta de API, un archivo de configuración — y obtén una interfaz TypeScript inferida de ella: los objetos anidados se convierten en tipos anidados, los arrays reciben tipos de elemento (con uniones para contenidos mixtos), y las claves que no son identificadores válidos se entrecomillan correctamente.',
			'Los tipos generados son un punto de partida, no un contrato: la inferencia ve una sola muestra, así que un campo que casualmente es null en tu ejemplo se tipa como null, y los campos opcionales que estaban ausentes simplemente le son desconocidos. La salida es deliberadamente simple — sin decoradores, sin validación en tiempo de ejecución — para que puedas pegarla en cualquier parte y refinarla.',
			'Para campos que varían entre peticiones, pasa una segunda muestra y fusiona a mano, o gradúate a herramientas schema-first (OpenAPI, zod) cuando la forma se estabilice. Para el momento diario de "solo necesito un tipo para esta respuesta", un pegado basta.'
		],
		faqs: [
			{
				q: '¿Por qué mi campo nullable se tipa solo como null?',
				a: 'La inferencia solo ve la muestra que pegaste. Si el campo era null ahí, null es todo lo que puede saber. Cámbialo a string | null (o al tipo real que sea) tras la generación — o pega una muestra donde el campo esté poblado.'
			},
			{
				q: '¿Cómo se manejan los campos opcionales?',
				a: 'No se detectan — una sola muestra no puede distinguir "siempre presente" de "presente esta vez". Los campos ausentes de la muestra están ausentes del tipo. Marca los campos como opcionales (name?:) manualmente donde sepas que la API los omite.'
			},
			{
				q: '¿Qué producen los arrays de tipos mixtos?',
				a: 'Una unión: [1, "a"] infiere (number | string)[]. Los arrays vacíos infieren unknown[] porque no hay elemento que inspeccionar — reemplázalo con el tipo de elemento real cuando lo conozcas.'
			},
			{
				q: '¿Debería usar tipos inferidos o una librería de esquemas como zod?',
				a: 'Las interfaces inferidas son solo de tiempo de compilación — no validan nada en tiempo de ejecución. Para herramientas internas y tipado rápido son perfectas; para entrada no confiable en tiempo de ejecución, define un esquema zod/valibot y deriva el tipo estático de él.'
			}
		]
	},

	'jsonpath-tester': {
		about: [
			'Prueba expresiones JSONPath contra tu propio JSON y mira cada coincidencia con su valor y su ruta concreta. Soporta la sintaxis que cubre el uso diario: notación de punto y corchetes, índices de array (incluidos los negativos), comodines, uniones ([\'a\',\'b\']) y descenso recursivo ($..price).',
			'La ruta por coincidencia es la parte discretamente útil: consulta $..id contra un documento profundo y cada resultado te dice exactamente dónde vive ($.data.items[3].id), listo para pegar en código. Convierte "en algún lugar de este blob" en una dirección exacta.',
			'Las expresiones de filtro ([?(@.price < 10)]) aún no están implementadas — la herramienta lo dice explícitamente en lugar de devolver resultados incorrectos. Para extracción estructural, que es la mayor parte del uso de JSONPath, todo funciona.'
		],
		faqs: [
			{
				q: '¿Cuál es la diferencia entre $.a.b y $..b?',
				a: '$.a.b sigue una ruta exacta: la clave a en la raíz, luego la clave b dentro de ella. $..b (descenso recursivo) encuentra cada b en cualquier parte del documento a cualquier profundidad. El descenso recursivo es potente pero puede sorprender — también coincide con claves b anidadas dentro de cosas que no habías considerado.'
			},
			{
				q: '¿Cómo accedo a claves con espacios o guiones?',
				a: "Notación de corchetes con comillas: $['my key'] o $.data['content-type']. La notación de punto solo funciona para claves que son nombres de tipo identificador válidos."
			},
			{
				q: '¿Funcionan los índices negativos de array?',
				a: 'Sí — [-1] es el último elemento, [-2] el penúltimo, siguiendo la convención popularizada por Python y adoptada por el RFC 9535. [0] sigue siendo el primer elemento.'
			},
			{
				q: '¿JSONPath está estandarizado?',
				a: 'Desde 2024, sí — el RFC 9535 define la sintaxis y la semántica. Las implementaciones escritas antes difieren en casos límite (especialmente filtros y uniones), así que la misma expresión puede comportarse distinto entre librerías; prueba contra la implementación con la que despliegas.'
			}
		]
	},

	'bcrypt-generator': {
		about: [
			'Hashea una contraseña con bcrypt al factor de costo que elijas, o verifica un texto plano contra un hash existente — ambos por completo en el navegador, que es exactamente lo que quieres cuando lo que se prueba es una contraseña. Un inspector de hashes además descompone cualquier hash bcrypt en su versión, costo y sal.',
			'Bcrypt sigue siendo una opción sólida para almacenar contraseñas porque es deliberadamente lento y con sal por contraseña: el factor de costo duplica el trabajo con cada incremento, así que costo 12 significa 4096 iteraciones de la configuración del cifrado subyacente. La lectura de tiempo muestra cuánto tarda el costo que elegiste, haciendo concreto el equilibrio entre seguridad y latencia.',
			'La verificación es la necesidad diaria más común: confirmar que un hash en una base de datos coincide con una contraseña conocida sin levantar código de aplicación. Pega ambos y obtén un sí o un no.'
		],
		faqs: [
			{
				q: '¿Qué factor de costo debería usar en producción?',
				a: 'La guía clásica: tan alto como permita tu presupuesto de latencia de login, comúnmente 10–13 hoy en día. Apunta a 100–300 ms por hash en tu hardware de producción. El JavaScript del navegador corre más lento que el nativo, así que el tiempo mostrado aquí es una cota superior para tus servidores.'
			},
			{
				q: '¿Por qué la misma contraseña da un hash distinto cada vez?',
				a: 'Se genera una sal aleatoria de 16 bytes por hash y se almacena dentro de la propia cadena del hash. Es así por diseño — contraseñas idénticas obtienen hashes diferentes, derrotando las tablas arcoíris precalculadas. La verificación lee la sal de vuelta desde el hash, y por eso la comparación funciona.'
			},
			{
				q: '¿Qué significan las partes de un hash bcrypt?',
				a: '$2b$12$ + 53 caracteres: 2b es la versión del algoritmo, 12 el costo (2^12 iteraciones), los siguientes 22 caracteres la sal y los últimos 31 el digest — todo en el alfabeto base64 propio de bcrypt. El inspector bajo la herramienta divide así cualquier hash.'
			},
			{
				q: '¿Bcrypt sigue recomendándose frente a Argon2?',
				a: 'Argon2id es la primera opción actual para sistemas nuevos (su dureza de memoria resiste el crackeo con GPU). Bcrypt sigue siendo aceptable y ubicuo — el consejo práctico es: no migres con pánico un almacenamiento bcrypt que funciona, pero elige Argon2id para diseños desde cero. Ambos están a años luz de los hashes rápidos como SHA-256.'
			}
		]
	},

	'user-agent-parser': {
		about: [
			'Pega una cadena User-Agent de una línea de log, un informe de bug o una exportación de analítica y obtén su decodificación: navegador y versión, motor de renderizado, sistema operativo, tipo de dispositivo y arquitectura de CPU. El parser es ua-parser-js, la misma librería detrás de incontables pipelines de analítica, ejecutándose localmente sobre tu cadena.',
			'Las cadenas User-Agent son yacimientos arqueológicos — todas siguen afirmando ser Mozilla/5.0, Chrome dice ser Safari, Safari dice ser KHTML, y la identidad real se esconde en los tokens posteriores. Un parser gana a entrecerrar los ojos: sabe que "CriOS" significa Chrome en iOS y que Edge se esconde tras "Edg/".',
			'Fíjate en la dirección del viaje: los navegadores están congelando y reduciendo las cadenas UA (y Chromium ofrece UA Client Hints en su lugar), así que el detalle de versión solo desde el UA es cada vez más grueso. Para el análisis forense de logs y el triaje de bugs sigue siendo indispensable; para decisiones de funcionalidad, usa detección de características.'
		],
		faqs: [
			{
				q: '¿Por qué todos los User-Agent empiezan con Mozilla/5.0?',
				a: 'Teatro de compatibilidad de los años 90 que nunca terminó: los servidores buscaban "Mozilla" para servir páginas modernas, así que cada navegador nuevo afirmó serlo, y cada navegador posterior imitó a sus predecesores. El prefijo es hoy una tradición sin significado.'
			},
			{
				q: '¿Puedo fiarme de la versión del SO en una cadena UA?',
				a: 'Cada año menos. macOS congeló su versión de UA en 10_15_7, Windows 11 se reporta como Windows NT 10.0, y los navegadores con UA reducido hacen las versiones más gruesas deliberadamente. Trata las versiones de SO del UA como aproximadas; usa UA Client Hints donde controles el cliente.'
			},
			{
				q: '¿Qué significa "like Gecko" o "KHTML, like Gecko"?',
				a: 'Más capas de imitación: WebKit desciende de KHTML y quería que las páginas con casos especiales para Gecko (el motor de Firefox) funcionaran, así que añadió "like Gecko". Todo navegador WebKit/Blink lleva la frase hasta el día de hoy.'
			},
			{
				q: '¿Debería usar el análisis de UA para detección de características?',
				a: 'No — el sniffing se rompe en cuanto se publica una nueva versión de navegador. Detecta la característica en sí (if ("clipboard" in navigator)). El análisis de UA es para analítica, análisis de logs y reproducir bugs reportados por usuarios, donde conocer el entorno es justamente el objetivo.'
			}
		]
	},

	'color-converter': {
		about: [
			'Introduce un color en cualquier notación común — #hex, rgb(), hsl() o un color CSS con nombre — y obtén todos los formatos a la vez: HEX, RGB, HSL y OKLCH, junto a una muestra en vivo. Los canales alfa se preservan entre formatos, y la salida usa la sintaxis CSS moderna (canales separados por espacios) que se pega limpiamente en las hojas de estilo actuales.',
			'OKLCH está incluido porque es hacia donde va el color en CSS: a diferencia de HSL, su eje de luminosidad es perceptualmente uniforme, así que dos colores con la misma L realmente se ven igual de brillantes, y ajustar el matiz no cambia accidentalmente el brillo percibido. Convertir una paleta existente a OKLCH es el primer paso para construir escalas de color consistentes.',
			'Las matemáticas de conversión corren localmente usando las transformaciones publicadas sRGB↔OKLab, y los valores hacen el viaje redondo: el RGB que obtienes de una entrada HSL es exactamente lo que el navegador computaría.'
		],
		faqs: [
			{
				q: '¿Por qué los valores de luminosidad de HSL y OKLCH no coinciden?',
				a: 'La luminosidad de HSL es una propiedad geométrica de los valores RGB, no de la visión humana — el amarillo hsl(60 100% 50%) se ve mucho más brillante que el azul hsl(240 100% 50%) pese a tener la misma L. El eje L de OKLCH está diseñado para coincidir con la percepción, así que L igual significa brillo aparente igual. Esa discrepancia es toda la razón de existir de OKLCH.'
			},
			{
				q: '¿Qué significa el valor alfa y dónde va en cada formato?',
				a: 'Alfa es la opacidad, de 0 (transparente) a 1 (opaco). En hex de 8 dígitos es el byte final (#RRGGBBAA); en la sintaxis funcional moderna sigue a una barra: rgb(76 141 255 / 0.5). Este conversor lleva el alfa a través de todos los formatos automáticamente.'
			},
			{
				q: '¿Todo color OKLCH puede mostrarse en sRGB?',
				a: 'No — OKLCH cubre gamas amplias, y algunas combinaciones de croma/luminosidad no tienen equivalente sRGB. Convertir desde sRGB (como hace esta herramienta) siempre queda representable; en el otro sentido, los colores fuera de gama deben recortarse o mapearse, y por eso un verde P3 vívido se ve más apagado en una pantalla sRGB.'
			},
			{
				q: '¿Por qué rgb(76 141 255) separado por espacios en lugar de comas?',
				a: 'El CSS Color Module Level 4 estandarizó los canales separados por espacios con un /alpha opcional, y todo navegador moderno lo soporta. La forma con comas sigue funcionando, pero la forma con espacios es la que usan las especificaciones nuevas (y esta herramienta).'
			}
		]
	},

	'image-to-base64': {
		about: [
			'Suelta, elige o pega una imagen y obtén su forma Base64 en todos los sabores que puedas necesitar: un data URL listo para usar, una declaración CSS background-image, una etiqueta <img> completa con sus dimensiones reales y el payload Base64 puro. La dirección inversa también funciona: pega un data URL o un bloque de Base64 y la imagen se decodifica, se previsualiza y se puede descargar como archivo.',
			'El formato se identifica por los bytes mágicos, no por la extensión ni el tipo MIME declarado, así que un PNG renombrado a .jpg (o un data URL mal etiquetado) se convierte correctamente igual. El panel de tamaños es honesto con el coste: Base64 infla los datos alrededor de un tercio, y el tamaño codificado exacto aparece junto al original para que decidas si compensa incrustar.',
			'A diferencia de la mayoría de sitios de imagen a Base64, aquí no se sube nada: el archivo se lee con la API FileReader del navegador y se codifica en la propia página. Eso lo hace seguro para capturas de paneles internos, imágenes de productos sin publicar o cualquier cosa que prefieras no entregar al servidor de un desconocido.'
		],
		faqs: [
			{
				q: '¿Cuándo debería incrustar una imagen como Base64 en vez de enlazar un archivo?',
				a: 'Cuando la imagen es pequeña (menos de ~10 KB), cambia rara vez y costaría una petición HTTP extra: iconos, logos en correos o documentos HTML de un solo archivo. Para cualquier cosa mayor gana el archivo aparte: se cachea de forma independiente, carga en paralelo y no engorda tu HTML o CSS un 33%.'
			},
			{
				q: '¿Por qué la versión Base64 es un tercio más grande que mi archivo?',
				a: 'Base64 representa cada 3 bytes binarios como 4 caracteres ASCII, un sobrecoste estructural del +33% (más hasta dos caracteres de relleno). Gzip o Brotli en el servidor recuperan parte, pero la inflación es inherente a la codificación: cambia tamaño por la capacidad de incrustar binario en texto.'
			},
			{
				q: '¿Puedo decodificar un data URL que encontré en una hoja de estilos o en HTML?',
				a: 'Sí — cambia a Base64 → imagen y pega todo, prefijo data: incluido. Los data URLs de SVG con percent-encoding (los que no llevan ;base64) también se decodifican, y los saltos de línea o espacios del payload se eliminan automáticamente. El resultado se previsualiza en la página y se descarga con la extensión correcta.'
			},
			{
				q: '¿Funciona con SVG, GIF e ICO, o solo con PNG y JPEG?',
				a: 'Todo lo que el detector reconoce se convierte a Base64: PNG, JPEG, WebP, GIF, SVG, BMP, ICO y AVIF. Para SVG en concreto, ten en cuenta que el código XML suele ser más pequeño y legible incrustado directamente — codificar SVG en Base64 tiene sentido sobre todo cuando las comillas o el escapado se vuelven un problema.'
			}
		]
	},

	'image-converter': {
		about: [
			'Convierte una imagen entre PNG, JPEG y WebP sin instalar nada ni subirla a ninguna parte: suelta el archivo, elige el destino, ajusta la calidad con un deslizador en vivo y observa cómo el tamaño de salida se actualiza en tiempo real. La casilla Δ muestra exactamente cuánto más pequeño (o más grande) es el archivo convertido, así que elegir la calidad deja de ser adivinar.',
			'Los tres formatos tienen oficios distintos. PNG es sin pérdida y con transparencia completa: ideal para capturas, recursos de UI y todo lo que tenga bordes nítidos o texto. JPEG comprime fotografías con agresividad pero carece de canal alfa y emborrona los bordes duros. WebP suele superar a JPEG en un 25–35% a calidad comparable, admite transparencia y funciona en todos los navegadores actuales — para la web casi siempre es la respuesta.',
			'La conversión ocurre en un canvas de tu navegador: la imagen se decodifica, se redibuja y se recodifica con los mismos códecs que tu navegador usa para mostrar páginas. Eso es lo que hace privada la herramienta — y también la razón de que los bytes exactos varíen ligeramente entre Chrome, Firefox y Safari, que traen cada uno su propio codificador.'
		],
		faqs: [
			{
				q: '¿Qué calidad debería usar para JPEG y WebP?',
				a: 'Entre 75 y 90 cubre casi todos los usos reales. A 85 la mayoría de fotos son visualmente indistinguibles del original con una fracción del tamaño; por debajo de ~70 aparecen artefactos de bloque en degradados y tonos de piel; por encima de 90 el tamaño sube en picado por mejoras que no puedes ver. Arrastra el deslizador mirando la casilla de tamaño: el punto óptimo suele ser evidente.'
			},
			{
				q: '¿Por qué mi PNG creció al convertirlo a JPEG?',
				a: 'JPEG está hecho para degradados fotográficos, no para color plano. Las capturas, diagramas y gráficos de UI se comprimen de maravilla como PNG (largas series de píxeles idénticos), pero obligan a JPEG a almacenar ruido alrededor de cada borde nítido: archivos más grandes y ringing visible. Mantén los gráficos en PNG o conviértelos a WebP.'
			},
			{
				q: '¿Qué pasa con la transparencia al convertir a JPEG?',
				a: 'JPEG no tiene canal alfa, así que las zonas transparentes deben rellenarse con algo: esta herramienta las aplana sobre blanco, la convención para imágenes web. Si necesitas que la transparencia sobreviva, elige PNG o WebP como destino.'
			},
			{
				q: '¿Por qué mi navegador no puede exportar AVIF o HEIC aquí?',
				a: 'La API toBlob del canvas solo codifica los formatos para los que el navegador trae codificador: PNG y JPEG en todas partes, WebP en Chromium y Firefox. La codificación AVIF sigue siendo rara y HEIC está lastrado por patentes, así que los navegadores los decodifican pero no los producen. Si eliges un formato que tu navegador no sabe escribir, la herramienta lo dice en vez de darte un PNG en silencio.'
			}
		]
	},

	'image-resizer': {
		about: [
			'Redimensiona una imagen a un ancho exacto, un alto exacto o un porcentaje del original: la otra dimensión sigue automáticamente, así que nada se estira. Elige un formato de salida (o conserva el de origen), fija la calidad para destinos con pérdida, previsualiza el resultado y descarga. Las casillas antes/después muestran dimensiones y tamaño de un vistazo.',
			'El escalado usa el modo de suavizado de alta calidad del navegador, que aplica un remuestreo de verdad en lugar de diezmar por vecino más cercano: las fotos reducidas se mantienen nítidas en vez de vibrar con aliasing. Redimensionar es además la forma honesta de reducir el tamaño de archivo: reducir ambas dimensiones a la mitad elimina tres cuartas partes de los píxeles, algo que ningún deslizador de calidad puede igualar.',
			'Los archivos nunca salen de la página: decodificar, remuestrear y recodificar corren en un canvas local. No hay barra de progreso de subida porque no hay subida — una foto de 40 megapíxeles se redimensiona tan rápido como tu máquina pueda redibujarla, y funciona con el cable de red desenchufado.'
		],
		faqs: [
			{
				q: '¿Si reduzco y vuelvo a ampliar, se restaura mi imagen?',
				a: 'No — reducir descarta píxeles de forma permanente. Escalar una foto de 3000px a 300px conserva el 1% de los datos; ampliarla de vuelta interpola el 99% que falta como desenfoque. Guarda el archivo original y exporta copias redimensionadas desde él, en vez de redimensionar la única copia que tienes.'
			},
			{
				q: '¿Por qué mi imagen ampliada se ve blanda?',
				a: 'Ampliar no puede crear detalle que nunca se capturó: el navegador interpola entre los píxeles existentes, lo que se percibe como suavidad más allá de ~2×. El escalado real por encima de eso requiere herramientas de ML que alucinan detalle plausible; un remuestreador de canvas deliberadamente no inventa nada.'
			},
			{
				q: '¿Cómo consigo un tamaño objetivo, tipo «menos de 200 KB»?',
				a: 'Usa las dos palancas: primero redimensiona a las mayores dimensiones que realmente necesites (1200px de ancho basta para la mayoría de diseños web) y luego elige WebP o JPEG y baja la calidad hasta que la casilla de tamaño quede por debajo del objetivo. La reducción de dimensiones hace casi todo el trabajo; la calidad afina el resto.'
			},
			{
				q: '¿Redimensionar elimina los metadatos EXIF, como la ubicación GPS?',
				a: 'Sí. La tubería de canvas recodifica píxeles puros: el modelo de cámara, las marcas de tiempo, las coordenadas GPS y el resto de etiquetas EXIF desaparecen de la salida. Para imágenes que van a la web pública suele ser una ventaja de privacidad; si necesitas conservar los metadatos, guarda el original aparte.'
			}
		]
	},

	'favicon-generator': {
		about: [
			'Suelta una imagen — idealmente un logo cuadrado de 512px o más — y obtén el kit de favicon completo: un favicon.ico que empaqueta 16, 32 y 48 px para pestañas y marcadores, PNGs en los tamaños estándar incluyendo el icono táctil de Apple de 180px y los iconos PWA de 192/512px, un site.webmanifest inicial y las etiquetas <link> para pegar en tu <head>. Un solo ZIP contiene todo, con los nombres exactos que las convenciones esperan.',
			'Los detalles que los tutoriales de favicon suelen fallar están resueltos: el ICO incrusta entradas comprimidas en PNG (soportado en todas partes desde Windows Vista, mucho más pequeño que los iconos BMP heredados); el icono táctil de Apple se aplana sobre el color de fondo que elijas, porque iOS reemplaza la transparencia con negro; y los iconos PWA conservan su canal alfa. Las fuentes no cuadradas se recortan al centro en vez de deformarse.',
			'Reducir un logo a 16px es destructivo por naturaleza — el detalle fino simplemente no sobrevive — así que la fila de vista previa muestra cada tamaño en sus dimensiones reales, para juzgar la legibilidad antes de publicar. Todo se renderiza en un canvas local y los contenedores ICO/ZIP se ensamblan byte a byte en la página; tu logo nunca se sube a ningún sitio.'
		],
		faqs: [
			{
				q: '¿Qué tamaños de favicon necesito realmente en 2026?',
				a: 'Menos de lo que dice el folclore: un favicon.ico con 16/32/48 para usos heredados y la barra de direcciones, un apple-touch-icon.png de 180px, y PNGs de 192/512px referenciados desde el manifest. Los navegadores modernos eligen la mejor opción de exactamente este conjunto — los paquetes de 20 archivos que emiten algunos generadores son culto al cargamento.'
			},
			{
				q: '¿Por qué mi logo es ilegible a 16px?',
				a: 'Dieciséis píxeles es brutalmente poco — los logotipos de texto, los trazos finos y los degradados se disuelven. Los buenos favicons reducen la marca a un solo glifo o forma con alto contraste. Si la vista previa de 16px aquí es papilla, recorta a la parte distintiva de la marca o usa una variante simplificada para tamaños pequeños.'
			},
			{
				q: '¿Sigo necesitando un .ico, o bastan los favicons PNG?',
				a: 'Todos los navegadores modernos aceptan favicons PNG, pero /favicon.ico sigue siendo la ruta que agentes, rastreadores y herramientas antiguas piden a ciegas. Servir un ICO real ahí cuesta unos pocos kilobytes y elimina toda una clase de 404 y rarezas — mantenlo junto a tus links PNG.'
			},
			{
				q: '¿Por qué el icono táctil de Apple necesita un color de fondo?',
				a: 'iOS no renderiza transparencia en los iconos de pantalla de inicio — el alfa de tu PNG se compone sobre negro. Aplanar de antemano sobre un color elegido mantiene el resultado intencional. Elige el fondo que combine con tu icono, y recuerda que iOS redondea las esquinas por su cuenta: entrega un cuadrado a sangre completa.'
			}
		]
	},

	'sql-formatter': {
		about: [
			'Pega una consulta recién salida de un archivo de log, de un volcado de depuración de un ORM o del one-liner de un colega, y este formateador la descompone en cláusulas legibles con indentación consistente. Se soportan seis dialectos — SQL estándar, PostgreSQL, MySQL, SQLite, SQL Server y BigQuery — de modo que la sintaxis específica de cada dialecto, como TOP, los identificadores con backticks o los tipos array, se formatea correctamente en lugar de hacer tropezar al parser.',
			'Las mayúsculas de las palabras clave son configurables: MAYÚSCULAS para el aspecto clásico, minúsculas si tu equipo lo prefiere, o deja el original intacto. El modo minificar hace lo contrario — colapsa una consulta formateada a una sola línea, eliminando los comentarios pero dejando los literales de cadena intactos byte a byte, que es justo lo que quieres antes de pegar SQL en una config JSON o en un flag de CLI.',
			'Las consultas suelen contener nombres de tablas, datos de clientes en los literales o pistas sobre la infraestructura. El formateo se ejecuta por completo en tu navegador, así que nada de eso llega a un servidor.'
		],
		faqs: [
			{
				q: '¿Qué dialecto SQL debería elegir?',
				a: 'El que hable tu base de datos — cambia cómo se analizan los identificadores, el entrecomillado de cadenas y las palabras clave propias del dialecto. Si solo necesitas un adecentado genérico, el SQL estándar cubre el núcleo común. Un error de análisis en sintaxis válida para tu base de datos suele ser señal de que toca cambiar de dialecto.'
			},
			{
				q: '¿El formateo cambia lo que hace la consulta?',
				a: 'No. El formateo solo mueve espacios en blanco y, si lo activas, cambia las mayúsculas de las palabras clave — los identificadores y literales conservan sus bytes exactos. Las palabras clave de SQL son insensibles a mayúsculas en todos los dialectos soportados, así que SELECT y select son la misma sentencia.'
			},
			{
				q: '¿Puedo formatear varias sentencias a la vez?',
				a: 'Sí — pega un script completo y cada sentencia terminada en ; se formatea en secuencia, con una línea en blanco entre ellas.'
			},
			{
				q: '¿Qué elimina exactamente el minificado?',
				a: 'Los comentarios de línea (--) y de bloque (/* */) se descartan, las series de espacios en blanco se colapsan a espacios simples y se quitan los espacios alrededor de comas y paréntesis. El texto entre comillas simples, comillas dobles y backticks no se toca nunca, incluidos los escapes de comillas duplicadas.'
			}
		]
	},

	'xml-formatter': {
		about: [
			'Esta herramienta embellece XML con la indentación que elijas, señala los errores de buena formación con la línea y columna exactas, y puede minificar un documento a una sola línea. Los comentarios, las secciones CDATA y el prólogo XML sobreviven al formateo — una cantidad sorprendente de formateadores se los come en silencio.',
			'Validar significa aquí buena formación: etiquetas correctamente anidadas, atributos entrecomillados, caracteres legales. Eso atrapa la inmensa mayoría de los accidentes de edición manual — una barra que falta, un elemento sin cerrar, un ampersand suelto. La validación de esquema contra un XSD queda deliberadamente fuera del alcance; eso pertenece a tu pipeline de build, con el archivo de esquema presente.',
			'Los archivos de configuración, los payloads SOAP, los feeds RSS y los manifiestos de Android contienen de forma rutinaria nombres de host internos y claves. Todo se analiza localmente — no se transmite nada.'
		],
		faqs: [
			{
				q: '¿Por qué mi XML falla con «char … is not expected»?',
				a: 'Los sospechosos habituales son un & crudo que debería ser &amp;, un valor de atributo sin comillas o etiquetas que cierran en el orden equivocado. El mensaje de error lleva la línea y columna del primer carácter problemático, y el cuadro de entrada lo marca.'
			},
			{
				q: '¿El formateador reordena o normaliza mi documento?',
				a: 'No. Los elementos, los atributos y su orden se conservan exactamente; solo cambia el espacio en blanco entre elementos. El texto que comparte línea con el marcado se recorta y las series internas de espacios se colapsan — si dependes de espacio en blanco significativo (xml:space="preserve"), mantén esas secciones minificadas.'
			},
			{
				q: '¿Qué elimina el minificado?',
				a: 'La indentación y los saltos de línea entre elementos, además de los comentarios. Las secciones CDATA, las instrucciones de procesamiento y el prólogo se quedan. El resultado se analiza de forma idéntica para cualquier consumidor que no dependa de nodos de texto compuestos solo de espacios.'
			},
			{
				q: '¿Puede validar contra un XSD o una DTD?',
				a: 'No — esto solo comprueba la buena formación. La validación de esquema necesita el archivo de esquema y un motor XSD, algo que se hace mejor en tu toolchain (xmllint --schema, o la librería XML de tu lenguaje).'
			}
		]
	},

	'xml-to-json': {
		about: [
			'Convierte XML a JSON para alimentar con respuestas SOAP heredadas, feeds RSS o POMs de Maven a JavaScript, jq o una API nativa de JSON — o ve en sentido contrario y produce XML a partir de datos JSON. Los atributos se conservan: se convierten en claves "@_nombre", y el contenido de texto que coexiste con atributos aterriza bajo "#text", de modo que ninguna información desaparece en silencio.',
			'Los dos formatos discrepan en aspectos fundamentales, y este conversor toma las decisiones pragmáticas estándar: los elementos hermanos repetidos se colapsan en un array JSON, los valores de aspecto numérico se convierten en números y los namespaces viajan como parte del nombre del elemento. El viaje de ida y vuelta XML → JSON → XML conserva estructura y contenido en los documentos típicos.',
			'Ambas direcciones corren localmente en tu navegador. Pega un feed de facturas o una respuesta de API sin que vaya a ninguna parte.'
		],
		faqs: [
			{
				q: '¿Por qué algunos valores vuelven como números en vez de cadenas?',
				a: 'El parser reconoce el texto numérico y lo convierte, que es lo que la mayoría de consumidores quiere. Cuidado con los identificadores con ceros a la izquierda (códigos de producto, números de teléfono) — si eso importa para tus datos, entrecomíllalos tras la conversión o trata la salida como un punto de partida.'
			},
			{
				q: '¿Cómo se manejan los elementos repetidos?',
				a: 'Dos o más hermanos con el mismo nombre se convierten en un array JSON bajo esa clave. Una única aparición se queda como objeto plano — esa asimetría es inherente al mapeo, así que el código que consuma el JSON debería tolerar ambas formas o normalizar primero.'
			},
			{
				q: '¿Qué significan las claves @_ y #text?',
				a: '@_ marca lo que era un atributo XML; #text lleva el texto del elemento cuando también hay atributos presentes. Alimentar la dirección JSON → XML con la misma convención reconstruye el marcado original.'
			},
			{
				q: '¿Por qué JSON → XML rechaza mi array de nivel superior?',
				a: 'Un documento XML debe tener exactamente un elemento raíz, y un array suelto no tiene ninguno. Envuelve el array en un objeto — {"items": {"item": [...]}} — y el conversor produce un documento bien formado.'
			}
		]
	},

	'markdown-to-html': {
		about: [
			'Escribe o pega Markdown y ve lado a lado la vista previa renderizada y el HTML generado — encabezados, tablas GFM, viñetas estilo lista de tareas, bloques de código delimitados y tachado incluidos. La dirección inversa convierte HTML existente en Markdown limpio con encabezados ATX, viñetas con guion y código delimitado, que es la forma más rápida de migrar contenido antiguo de un CMS a un repo de documentación.',
			'La vista previa se sanea antes de renderizarse: los scripts, los iframes y los atributos de manejadores de eventos se eliminan, así que un enlace compartido que lleve marcado hostil no puede ejecutar nada en tu navegador. El cuadro de salida HTML muestra siempre la conversión sin procesar para copiarla en plantillas o correos.',
			'La conversión y la vista previa corren localmente. Los borradores de notas de versión con nombres de funcionalidades sin anunciar se quedan en tu máquina.'
		],
		faqs: [
			{
				q: '¿Qué variante de Markdown es esta?',
				a: 'CommonMark más las extensiones de GitHub que la gente usa de verdad: tablas, tachado y URLs autoenlazadas. Los saltos de línea suaves siguen siendo suaves — un salto de línea simple no se convierte en <br>, igual que en el renderizado de documentos de GitHub.'
			},
			{
				q: '¿Por qué la vista previa difiere de la salida HTML sin procesar?',
				a: 'La vista previa pasa por un sanitizador que elimina etiquetas script, manejadores de eventos en línea y URLs javascript: antes de renderizar. El cuadro de salida se salta la sanitización porque es texto, no marcado renderizado — sanea aguas abajo si incrustas HTML aportado por usuarios.'
			},
			{
				q: '¿Qué tan fiel es HTML → Markdown?',
				a: 'Los elementos estructurales — encabezados, listas, enlaces, énfasis, código, citas, imágenes — se convierten limpiamente. El HTML sin equivalente en Markdown (tablas anidadas, divs con clases, estilos en línea) pasa como HTML crudo o pierde su estilo, así que después merece la pena una lectura rápida.'
			},
			{
				q: '¿Puedo usar el HTML generado en un correo?',
				a: 'Sí — la salida es HTML semántico plano sin clases ni hojas de estilo externas, que es exactamente lo que mejor toleran los clientes de correo. Añade encima, en línea, el estilo que necesites.'
			}
		]
	},

	'html-formatter': {
		about: [
			'Embellece HTML salido de un bundler, un scraper o un editor WYSIWYG: los elementos se indentan al ancho que elijas, los atributos se quedan en su línea y el contenido de pre/textarea se deja intacto byte a byte. El modo minificar elimina los comentarios y colapsa el espacio en blanco entre etiquetas — típicamente un recorte de tamaño del 10–25% en páginas escritas a mano.',
			'La minificación es aquí deliberadamente conservadora: los scripts y estilos en línea están protegidos, los comentarios condicionales sobreviven, y los espacios simples entre elementos en línea se conservan para que «haz clic <a>aquí</a> ahora» no se fusione en «hazclicaquíahora». Obtienes un minificado seguro, no uno agresivo al máximo.',
			'Ambas operaciones corren localmente en tu navegador — las páginas sin publicar y el marcado de paneles de administración internos nunca salen de tu máquina.'
		],
		faqs: [
			{
				q: '¿Minificar romperá mi JavaScript o CSS en línea?',
				a: 'No — los bloques <script>, <style>, <pre> y <textarea> quedan totalmente excluidos del colapso de espacios. Solo se toca el marcado entre etiquetas. Para comprimir los scripts en sí, pásalos por separado por el minificador de JavaScript.'
			},
			{
				q: '¿Por qué es seguro eliminar el espacio en blanco entre etiquetas?',
				a: 'En su mayor parte lo es: el espacio en blanco entre elementos de bloque no tiene efecto visual. Entre elementos en línea sí lo tiene, y por eso el minificador colapsa las series a un solo espacio en lugar de borrarlas. Los diseños que dependen de trucos de espacio con inline-block son la rara excepción que merece un vistazo.'
			},
			{
				q: '¿El formateador arregla HTML inválido?',
				a: 'Formatea lo que le das sin validar contra la especificación HTML — las etiquetas sin cerrar siguen sin cerrar. Los navegadores son indulgentes con el tag soup, así que el formateo aun así te ayuda a ver la estructura lo bastante bien como para detectar el problema.'
			},
			{
				q: '¿Qué ancho de indentación debería usar?',
				a: '2 espacios es la convención dominante en las bases de código web y el valor por defecto de la mayoría de guías de estilo de frameworks. Elige 4 si tu equipo lo estandarizó — la elección es cosmética.'
			}
		]
	},

	'css-formatter': {
		about: [
			'Expande CSS minificado o copiado de cualquier parte en reglas con una declaración por línea, o comprime una hoja de estilos para producción. El embellecedor normaliza la indentación y la colocación de llaves; el minificador elimina comentarios, colapsa el espacio en blanco y descarta los puntos y coma finales, dejando intactos las cadenas, el contenido de url(...) y las expresiones calc().',
			'El minificador es transparente sobre lo que no hace: no renombrará selectores, ni fusionará reglas duplicadas, ni reescribirá colores. Eso hace la salida predecible y segura para cualquier hoja de estilos, incluidas las que llevan hacks y prefijos de proveedor — pega, minifica, publica.',
			'Como todas las herramientas de aquí, el procesamiento es local. El código de un design system sin publicar se queda en tu navegador.'
		],
		faqs: [
			{
				q: '¿Cuánto se reduce el CSS al minificarlo?',
				a: 'Típicamente un 15–30% en CSS escrito a mano, sobre todo por la indentación y los comentarios. El gzip de tu servidor elimina buena parte de esa misma redundancia, así que la diferencia en el cable es menor de lo que sugiere el recuento de bytes en crudo — minifica de todos modos: también recorta el tiempo de análisis.'
			},
			{
				q: '¿Es seguro con calc(), custom properties y media queries?',
				a: 'Sí. Los espacios dentro de calc() son significativos y se conservan; las custom properties y sus referencias var() son declaraciones normales y sobreviven sin cambios; @media y el resto de at-rules mantienen su estructura.'
			},
			{
				q: '¿Por qué los selectores descendientes conservaron sus espacios?',
				a: 'Porque «nav a» y «nava» seleccionan cosas distintas — el espacio es un combinador, no formato. El minificador solo elimina el espacio en blanco sin significado sintáctico.'
			},
			{
				q: '¿Puede convertir entre LESS/SCSS y CSS?',
				a: 'No — la sintaxis de preprocesador necesita compilación, no formateo. El SCSS plano que también es CSS válido se formateará bien; las reglas anidadas y los mixins, no.'
			}
		]
	},

	'js-formatter': {
		about: [
			'Embellece JavaScript con indentación y espaciado consistentes — desminifica un bundle vendorizado para leer qué hace en realidad, o limpia código pegado desde una consola. El minificador es de los de verdad: Terser analiza tu código a un AST, descarta código muerto, acorta los nombres de las variables locales y elimina comentarios — el mismo motor que usan los bundlers en producción.',
			'Como la minificación se basa en el AST, nunca rompe código funcional como pueden hacerlo los «compresores» basados en regex: las cadenas, los template literals, las regex y los casos límite de ASI los maneja un parser real. Los errores de sintaxis se informan con su posición en lugar de producir una salida corrupta.',
			'Terser se carga solo la primera vez que minificas, para mantener la página ligera, y corre por completo en tu navegador — el código propietario nunca sale de tu máquina.'
		],
		faqs: [
			{
				q: '¿Cuánto se reducirá mi código?',
				a: 'El código escrito a mano suele caer un 30–60% antes de gzip: los espacios, los comentarios y los nombres locales largos pesan todo eso. El código ya empaquetado se encoge mucho menos — ya pasó una vez por la misma transformación.'
			},
			{
				q: '¿La minificación cambia el comportamiento?',
				a: 'La compresión y el mangling preservan la semántica: solo se renombran los nombres locales, y la eliminación de código muerto quita ramas que de forma demostrable no pueden ejecutarse. El código que depende de Function.prototype.name o del toString() de sus propias funciones es la excepción clásica.'
			},
			{
				q: '¿Puede esto desminificar el código de producción de un sitio web?',
				a: 'El formateador restaura el espacio en blanco y la estructura, lo que hace legible el flujo de control — pero los nombres de variables y los comentarios originales se perdieron para siempre; verás a, b, c. Para depuración seria, prefiere los source maps si el sitio los publica.'
			},
			{
				q: '¿Soporta TypeScript o JSX?',
				a: 'No — ambos necesitan sus propios parsers. Compila primero a JavaScript (tsc, esbuild) y luego formatea o minifica aquí la salida.'
			}
		]
	},

	'string-escape': {
		about: [
			'Convierte una cadena multilínea con comillas en algo que puedas pegar dentro de un valor JSON, un literal de JavaScript, una cadena de Java, un nodo de texto XML, un literal SQL o una celda CSV — e invierte el proceso cuando encuentres texto escapado en un log y quieras leerlo. Seis dialectos, ambas direcciones.',
			'Cada dialecto sigue su especificación real en lugar de un mínimo común denominador: JSON escapa los caracteres de control como \\uXXXX, JavaScript escapa además las comillas simples y los backticks, Java codifica lo no ASCII como secuencias \\u de UTF-16, SQL duplica las comillas simples, CSV envuelve y duplica según el RFC 4180, y XML usa sus cinco entidades predefinidas. El desescapador entiende las formas \\x, \\u y \\u{…} e informa de las secuencias malformadas con su posición.',
			'Las cadenas escapadas son con frecuencia cadenas de conexión, tokens y fragmentos de consultas. Esto corre localmente — pega con confianza.'
		],
		faqs: [
			{
				q: '¿Qué dialecto necesito para un archivo de configuración JSON?',
				a: 'JSON. Escapa las comillas dobles, las barras invertidas y los caracteres de control exactamente como exige el RFC 8259 y deja el unicode legible. La salida encaja en cualquier valor de cadena JSON — sin las comillas que lo rodean, que la herramienta te deja a ti.'
			},
			{
				q: '¿Cuál es la diferencia entre los dialectos JSON y JavaScript?',
				a: 'JavaScript escapa además las comillas simples y los backticks, de modo que el resultado es seguro en cualquiera de los tres estilos de comillas de JS. JSON solo necesita manejar las comillas dobles. El desescapado acepta ambos, más las formas \\x y \\u{…} que JSON no define.'
			},
			{
				q: '¿El escapado SQL hace que sea seguro concatenar entrada de usuario?',
				a: 'Produce un literal de cadena SQL correcto (comillas duplicadas), pero escapar y luego concatenar sigue siendo el patrón equivocado para entrada no confiable — usa consultas parametrizadas. Esta herramienta es para fixtures, migraciones y depuración, no una defensa contra inyección.'
			},
			{
				q: '¿Por qué falla el desescapado de mi cadena?',
				a: 'Una barra invertida seguida de algo que no es un escape definido (\\q, un \\u12 truncado) está malformada, y el error indica el índice problemático. Si tu texto tiene rutas de Windows literales, escápalo primero — C:\\temp es un tabulador disfrazado.'
			}
		]
	},

	'number-base-converter': {
		about: [
			'Escribe un número en cualquier base y léelo a la vez en binario, octal, decimal y hex — más cualquier base personalizada hasta 36. Los prefijos se entienden (0x, 0o, 0b), la agrupación de dígitos hace escaneables los valores largos (1111 1111 · 255 · ff) y una lectura de longitud en bits te dice de un vistazo si un valor cabe en 8, 32 o 64 bits.',
			'La aritmética usa BigInt, así que la precisión es exacta a cualquier tamaño: permisos de archivo, colores ARGB, direcciones IP, prefijos de hash e IDs de base de datos de 64 bits se convierten sin el redondeo silencioso que sufren los números normales de JavaScript por encima de 2⁵³.',
			'Los números negativos conservan su signo en todas las bases. Todo se calcula localmente, al instante, mientras escribes.'
		],
		faqs: [
			{
				q: '¿Cómo decide la base la detección automática?',
				a: 'Por el prefijo: 0x significa hex, 0o octal, 0b binario; todo lo demás se analiza como decimal. Dígitos como «ff» sin prefijo son ambiguos, así que selecciona HEX explícitamente — el mensaje de error te lo recordará.'
			},
			{
				q: '¿Los números enormes son realmente exactos?',
				a: 'Sí — la conversión corre sobre BigInt, que es de precisión arbitraria. 18446744073709551615 (2⁶⁴−1) hace el viaje de ida y vuelta exacto; un conversor basado en flotantes lo corrompería a …551616.'
			},
			{
				q: '¿Cómo se muestran los números negativos en binario?',
				a: 'Con signo menos (-1010), no en complemento a dos, ya que el complemento a dos requiere un ancho fijo. Para ver un patrón en complemento a dos, suma 2ⁿ a tu valor negativo para el ancho que te interese y convierte eso.'
			},
			{
				q: '¿Para qué sirve la base 36?',
				a: 'IDs compactos: 0-9 más a-z es el alfabeto más denso que sigue siendo insensible a mayúsculas y seguro en URLs. Muchos acortadores de URL y sistemas de tickets codifican así sus IDs numéricos — pega uno y lee el número subyacente.'
			}
		]
	},

	'text-to-hex': {
		about: [
			'Mira exactamente de qué bytes está hecho tu texto: esta herramienta codifica el texto a UTF-8 y lo muestra como valores de byte en hex, binario o decimal — con el separador, las mayúsculas y los prefijos 0x a tu elección. El decodificador va en sentido contrario y es tolerante a propósito: acepta series continuas (48656c6c6f), pares con espacios, notación estilo MAC separada por dos puntos y secuencias de escape \\x.',
			'Como la codificación es UTF-8 a nivel de byte, los caracteres multibyte se muestran tal como existen realmente en memoria y en el cable: é es c3 a9, 世 es e4 b8 96, y los emoji ocupan cuatro bytes. Eso convierte a esta herramienta en la forma más rápida de depurar desajustes de codificación, misterios de BOM y problemas de «por qué esta cadena es más larga de lo que parece».',
			'Si los bytes decodificados no son UTF-8 válido, la herramienta lo dice en lugar de imprimir mojibake — una señal clara de que estás ante datos binarios y no texto.'
		],
		faqs: [
			{
				q: '¿Por qué un carácter se convierte en varios bytes?',
				a: 'UTF-8 es de ancho variable: el ASCII se queda en un byte, la mayoría de letras europeas ocupan dos, los caracteres CJK tres y los emoji cuatro. Lo que ves aquí es la secuencia de bytes exacta que cualquier sistema UTF-8 — archivos, HTTP, bases de datos — almacena para tu texto.'
			},
			{
				q: '¿Qué formatos de entrada acepta el decodificador?',
				a: 'Hex como serie continua, en pares con espacios, con prefijos 0x o \\x, o separado por dos puntos o comas; binario en grupos de 8 bits con o sin espacios; decimal como valores de byte separados. Los separadores mezclados y los espacios sueltos se limpian automáticamente.'
			},
			{
				q: '¿Por qué la decodificación dice que los bytes no son UTF-8 válido?',
				a: 'La secuencia de bytes viola las reglas de UTF-8 — por ejemplo un ff solitario, o un byte de continuación sin byte inicial. Los datos pueden ser binarios, estar en una codificación heredada como Latin-1, o estar truncados a mitad de carácter.'
			},
			{
				q: '¿Es esto lo mismo que un volcado hex de xxd?',
				a: 'Los valores de byte son idénticos; xxd añade offsets y una columna ASCII. Pega aquí las columnas hex de un volcado de xxd (sin la columna de offset) y se decodifica sin problema.'
			}
		]
	},

	'json-schema-validator': {
		about: [
			'Dos direcciones de la misma disciplina: pega un JSON de ejemplo y obtén un esquema draft-07 inferido de él, o pega datos más un esquema y ve cada violación listada con su ruta JSON. La validación corre sobre Ajv — el mismo motor que usan la mayoría de servicios Node — así que lo que pasa aquí pasa en CI.',
			'La inferencia piensa en producción: las claves de objeto se convierten en propiedades tipadas y entradas required, los arrays fusionan las formas de todos sus miembros, los enteros se distinguen de los flotantes, y las claves que aparecen solo en algunos miembros de un array se dejan correctamente fuera de required. El resultado es un punto de partida que tú endureces con formatos, rangos y patrones.',
			'Las respuestas de API y los archivos de configuración son exactamente los datos que menos quieres en un servidor ajeno. Tanto la inferencia como la validación corren por completo en tu navegador.'
		],
		faqs: [
			{
				q: '¿Qué draft de JSON Schema se soporta?',
				a: 'La inferencia emite draft-07, el draft con más soporte entre editores y validadores. La validación acepta draft-07 y los drafts anteriores que Ajv entiende en modo no estricto; las palabras clave de 2019-09/2020-12 en su mayoría también funcionan, ya que las desconocidas se ignoran en lugar de ser fatales.'
			},
			{
				q: '¿Qué significa el $ en las rutas de violación?',
				a: 'Es la raíz del documento, al estilo JSONPath: $.age significa la propiedad age de nivel superior, $.items.2.name el name del tercer elemento del array. Una ruta vacía ($) significa que la violación afecta a la propia raíz del documento — tipo incorrecto, o una propiedad required ausente.'
			},
			{
				q: '¿Por qué el esquema inferido es más estricto o más laxo de lo que esperaba?',
				a: 'Describe exactamente la muestra que le diste: los campos presentes en todas partes se vuelven required, y solo se permiten los tipos observados. Aliméntalo con una muestra más variada (un array de objetos representativos) para obtener un esquema más general, y luego ajusta a mano — la inferencia no puede conocer la intención.'
			},
			{
				q: '¿La validación soporta format, pattern y otras palabras clave de restricción?',
				a: 'Las palabras clave estructurales (type, required, properties, items, enum, minimum, pattern…) se aplican por completo. Las cadenas de format como "email" o "date-time" no se comprueban — eso refleja la especificación de JSON Schema, donde format es una anotación por defecto, y evita una falsa confianza.'
			}
		]
	},

	'exif-viewer': {
		about: [
			'Cada foto que toma tu teléfono lleva metadatos ocultos: modelo de cámara, hora de captura, software de edición — y, salvo que lo desactives, las coordenadas GPS de donde estabas. Esta herramienta lee esos metadatos de archivos JPEG, PNG y WebP y los muestra agrupados y decodificados: los valores de exposición como f/2.8 y 1/250 s, la orientación en palabras, el GPS como coordenadas decimales con enlace a un mapa.',
			'El limpiador produce una copia con los metadatos eliminados — sin pérdida. En lugar de recodificar la imagen (lo que cuesta calidad), elimina los segmentos de metadatos byte a byte: bloques EXIF y XMP en JPEG, chunks de texto y hora en PNG, chunks EXIF/XMP en WebP. Los píxeles, las dimensiones y la calidad quedan intactos; los perfiles de color se conservan para que la imagen siga renderizándose igual.',
			'Esta es la única categoría de herramienta donde «corre localmente» es todo el sentido: comprobar si una foto lleva datos GPS subiéndola a un servidor anularía el propósito. El archivo nunca sale de tu navegador — verificable en la pestaña de red.'
		],
		faqs: [
			{
				q: '¿Eliminar los metadatos cambia la calidad de la imagen?',
				a: 'No. El flujo de datos de la imagen se copia bit a bit; solo se descartan los segmentos de metadatos. El archivo limpio es más pequeño exactamente en el tamaño de los metadatos, y los píxeles son demostrablemente idénticos.'
			},
			{
				q: '¿Por qué mi captura de pantalla no muestra metadatos?',
				a: 'Las capturas de pantalla y la mayoría de imágenes exportadas para la web nunca tuvieron EXIF — las cámaras lo escriben, las herramientas de captura casi nunca. Las redes sociales también eliminan los metadatos al subir, así que una foto descargada de una de ellas suele estar ya limpia.'
			},
			{
				q: '¿La posición GPS es exacta?',
				a: 'El GPS del teléfono en EXIF suele tener una precisión de pocos metros — suficiente para identificar un edificio. La herramienta convierte los grados/minutos/segundos almacenados a decimal y enlaza al punto exacto, para que veas con precisión lo que podría ver quien reciba el archivo.'
			},
			{
				q: '¿Por qué el archivo limpio conserva un perfil de color ICC?',
				a: 'El perfil ICC le dice al software cómo interpretar los colores — eliminarlo puede desplazarlos visiblemente, y no contiene información personal. El limpiador elimina los metadatos identificativos (EXIF, XMP, IPTC, comentarios, marcas de tiempo) y conserva lo que la imagen necesita para renderizarse correctamente.'
			}
		]
	}
};

export default TOOL_CONTENT_ES;
