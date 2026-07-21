import type { ToolContent } from './content';

/**
 * Tradução em português (pt-BR) do conteúdo longo das ferramentas
 * (About + FAQ). Traduzido manualmente, em correspondência 1:1 com o
 * content.ts em inglês; entradas ausentes caem automaticamente no inglês.
 */
const TOOL_CONTENT_PT: Record<string, ToolContent> = {
	'json-formatter': {
		about: [
			'Cole qualquer JSON — uma resposta de API, um arquivo de configuração, uma linha de log — e este formatador o exibe com a indentação que você escolher, ou o minifica para incorporação. O parsing usa o mecanismo JSON nativo do navegador, então o que valida aqui é exatamente o que o JavaScript e qualquer parser compatível com JSON vão aceitar.',
			'Quando a entrada é inválida, o erro vem anotado com a linha e a coluna exatas onde o parsing falhou, em vez de um vago "unexpected token" em algum lugar. Combinado com o editor monoespaçado, caçar uma vírgula faltando em um payload de 500 linhas vira trabalho de dez segundos. Você também pode ordenar as chaves dos objetos alfabeticamente, o que ajuda antes de comparar dois payloads.',
			'A formatação roda inteiramente no seu navegador. Payloads contendo tokens, dados de clientes ou URLs internas nunca saem da sua máquina — não existe servidor que possa registrá-los.'
		],
		faqs: [
			{
				q: 'Por que meu JSON falha com "Unexpected token" mesmo parecendo correto?',
				a: 'Os culpados de sempre são: vírgula sobrando depois do último item, aspas simples no lugar de aspas duplas, chaves sem aspas ou comentários. Tudo isso é válido em literais de objeto JavaScript (ou JSON5), mas não em JSON estrito. O marcador de linha/coluna aponta para o primeiro caractere problemático.'
			},
			{
				q: 'Existe limite de tamanho?',
				a: 'Nenhum limite rígido — o parsing é local, então depende da sua máquina. Documentos de até dezenas de megabytes formatam bem em um navegador moderno; acima disso a aba pode ficar lenta, porque o documento inteiro fica em memória.'
			},
			{
				q: 'A formatação altera meus dados?',
				a: 'Apenas os espaços em branco, a menos que você habilite a ordenação de chaves. Números são reserializados pelo motor JavaScript, então 1e2 vira 100 e inteiros além da precisão dupla IEEE-754 são normalizados — a mesma coisa que qualquer consumidor do seu JSON baseado em JS faria.'
			},
			{
				q: 'Posso validar JSON sem reformatá-lo?',
				a: 'Sim — o selo de status acima da entrada se atualiza enquanto você digita e informa se o documento é parseável, seu tamanho e onde está o primeiro erro. Você só precisa da ação Formatar quando quiser a saída reescrita.'
			}
		]
	},

	'base64-decode': {
		about: [
			'Base64 transforma bytes arbitrários em um alfabeto de 64 caracteres que sobrevive a ser colado em JSON, URLs, cabeçalhos HTTP e e-mail. Esta ferramenta converte nas duas direções: digite ou cole texto para codificá-lo, ou cole um blob codificado para recuperar o original. UTF-8 é tratado corretamente nos dois sentidos, então emoji e alfabetos não latinos fazem a viagem de ida e volta sem se corromper.',
			'O decodificador é tolerante de propósito: aceita o alfabeto URL-safe (- e _ no lugar de + e /), remove espaços e quebras de linha e restaura o padding ausente antes de decodificar — as três coisas que mais fazem decodificadores rigorosos rejeitarem entradas perfeitamente recuperáveis. Se os bytes decodificados não forem texto UTF-8 válido, ele avisa em vez de imprimir lixo, o que geralmente significa que o payload era dado binário, como uma imagem.',
			'Tudo acontece na página. Decodificar um token ou credencial aqui não os transmite para lugar nenhum.'
		],
		faqs: [
			{
				q: 'Por que minha string Base64 termina com sinais de =?',
				a: 'Base64 codifica 3 bytes em 4 caracteres; quando o comprimento da entrada não é múltiplo de 3, a saída recebe padding com = para manter os grupos alinhados. O padding não carrega dados; este decodificador o restaura automaticamente se tiver sido removido.'
			},
			{
				q: 'Qual é a diferença entre Base64 padrão e URL-safe?',
				a: 'O Base64 padrão usa + e /, que têm significado especial em URLs e precisariam ser escapados por sua vez. A variante URL-safe (RFC 4648 §5) os troca por - e _ e geralmente dispensa o padding. JWTs, por exemplo, usam a forma URL-safe. O codificador aqui oferece as duas; o decodificador aceita qualquer uma automaticamente.'
			},
			{
				q: 'Base64 é criptografia?',
				a: 'Não. Base64 é uma codificação reversível sem chave — qualquer pessoa pode decodificar. Ele protege os dados contra corrupção no transporte, não contra leitura. Se você precisa de confidencialidade, criptografe primeiro e codifique o texto cifrado.'
			},
			{
				q: 'Por que a decodificação diz que o resultado não é UTF-8 válido?',
				a: 'A string decodificou com sucesso, mas os bytes resultantes não são texto — muitas vezes um PNG, um PDF ou dados comprimidos/criptografados. Decodificar esse conteúdo para uma caixa de texto mostraria caracteres corrompidos, então a ferramenta prefere sinalizar.'
			}
		]
	},

	'timestamp-converter': {
		about: [
			'O tempo Unix conta os segundos desde 1970-01-01T00:00:00 UTC e aparece em todo lugar: linhas de banco de dados, claims de JWT, arquivos de log, respostas de API. Este conversor aceita um timestamp em segundos ou milissegundos — detecta qual pelo tamanho — além de strings ISO 8601 e a maioria das datas legíveis por humanos, e mostra todas as representações de uma vez: ISO, UTC, seu horário local, tempo relativo e as duas precisões Unix.',
			'A ambiguidade de unidade é a armadilha clássica: 1700000000 é novembro de 2023 em segundos, mas janeiro de 1970 em milissegundos. A unidade detectada é exibida explicitamente, e você pode sobrescrevê-la com um clique quando o palpite estiver errado — chega de contar dígitos de cabeça.',
			'A conversão é instantânea e local, e o mostrador de hora atual continua avançando, então a página também serve de relógio epoch enquanto você trabalha.'
		],
		faqs: [
			{
				q: 'Como a ferramenta decide entre segundos e milissegundos?',
				a: 'Pelo tamanho: valores de 11 dígitos ou mais são tratados como milissegundos, os mais curtos como segundos. Isso mapeia segundos até por volta do ano 5138 e milissegundos a partir de ~1973, o que resolve sem ambiguidade qualquer timestamp moderno realista. Você pode inverter a unidade manualmente para os casos extremos.'
			},
			{
				q: 'O que acontece depois de 2038?',
				a: 'O problema do ano 2038 afeta sistemas que armazenam o tempo Unix em um inteiro de 32 bits com sinal. Números em JavaScript são floats de 64 bits, então este conversor lida com datas muito além de 2038 — bem depois do ano 275760, o limite do Date do JavaScript.'
			},
			{
				q: 'Posso converter uma data de volta para timestamp?',
				a: 'Sim. Cole uma string ISO 8601 como 2026-07-20T12:00:00Z, ou a maioria dos formatos convencionais de data, e os segundos e milissegundos Unix aparecem junto com as outras representações.'
			},
			{
				q: 'Qual fuso horário é usado na linha de hora local?',
				a: 'O fuso configurado no seu navegador, via API Intl — nada é consultado remotamente. O nome do fuso é impresso ao lado do valor, para que capturas de tela não fiquem ambíguas.'
			}
		]
	},

	'jwt-decoder': {
		about: [
			'Um JSON Web Token são três segmentos Base64URL — cabeçalho, payload, assinatura — unidos por pontos. Este decodificador separa o token, renderiza cabeçalho e payload como JSON formatado, destaca os claims de tempo registrados (iat, exp, nbf) como datas legíveis e mostra de relance se o token expirou.',
			'Decodificar não é verificar: o payload de qualquer JWT pode ser lido por quem o tiver em mãos, porque Base64URL é uma codificação, não criptografia. É também por isso que colar um token em um site qualquer normalmente é má ideia — esta página é a exceção, porque a decodificação acontece inteiramente no seu navegador e o token nunca é transmitido. A verificação de assinatura contra um segredo ou chave pública fica deliberadamente fora do escopo do decodificador offline.',
			'Um prefixo "Bearer " no início é removido automaticamente, então você pode colar direto de um cabeçalho Authorization.'
		],
		faqs: [
			{
				q: 'É seguro colar um token de produção aqui?',
				a: 'O token fica no seu navegador — esta página não faz nenhuma requisição de rede com a sua entrada, o que você pode confirmar na aba de rede das ferramentas de desenvolvedor. Ainda assim, por hábito, trate tokens ativos como senhas: prefira tokens expirados ou de teste ao compartilhar capturas de tela.'
			},
			{
				q: 'Por que meu token não decodifica?',
				a: 'Verifique se ele tem exatamente três segmentos separados por pontos e nenhuma quebra de linha vinda da cópia. Tokens de acesso opacos (por exemplo, muitos tokens do GitHub ou do Google) não são JWTs — nenhuma decodificação vai abrir uma string aleatória que nunca conteve JSON.'
			},
			{
				q: 'O que significam iat, exp e nbf?',
				a: 'São claims registrados do RFC 7519, todos em segundos Unix: iat é quando o token foi emitido, exp é quando ele deixa de valer, e nbf ("not before") é o primeiro momento em que ele pode ser aceito. Esta ferramenta converte cada um para uma data legível e compara exp com o seu relógio.'
			},
			{
				q: 'Esta ferramenta pode verificar a assinatura?',
				a: 'Não — e, de qualquer forma, um selo verde de uma ferramenta online não deveria ser confiável para decisões de segurança. Verifique assinaturas no seu backend com uma biblioteca mantida (jose, jsonwebtoken, PyJWT) contra as chaves reais do emissor.'
			}
		]
	},

	'regex-tester': {
		about: [
			'Escreva um padrão, cole um texto de exemplo, e cada match é destacado enquanto você digita — com grupos de captura, grupos nomeados e posições dos matches listados logo abaixo. O testador usa o motor RegExp do JavaScript, então o comportamento corresponde exatamente ao do Node.js e dos navegadores, incluindo lookbehind, grupos nomeados e escapes de propriedades Unicode.',
			'As flags são ativadas letra a letra (g, i, m, s, u, y, d) e o padrão é compilado a cada tecla; erros de sintaxe aparecem imediatamente com a mensagem do próprio motor, em vez de só depois de apertar um botão. Padrões de match vazio como a* são tratados com segurança, e entradas descontroladas são limitadas a 10.000 matches, para que um .* perdido não congele a aba.',
			'Dialetos de regex variam entre motores — um padrão que funciona aqui pode precisar de ajustes para PCRE, RE2 ou o módulo re do Python, principalmente em torno de suporte a lookbehind, quantificadores possessivos e flags inline.'
		],
		faqs: [
			{
				q: 'Qual dialeto de regex este testador usa?',
				a: 'ECMAScript (JavaScript), conforme implementado pelo seu próprio navegador. Suporta lookahead, lookbehind, grupos de captura nomeados, backreferences e escapes de propriedades Unicode como \\p{Letter} (com a flag u). Não suporta sintaxe exclusiva de PCRE, como quantificadores possessivos ou recursão.'
			},
			{
				q: 'Por que meu padrão casa com tudo / com nada?',
				a: 'As duas causas clássicas: um metacaractere sem escape (. casa com qualquer caractere — escape como \\. para um ponto literal), ou esquecer mentalmente a flag g — este testador sempre encontra todos os matches, mas o seu código só vai encontrar o primeiro se g não estiver definida.'
			},
			{
				q: 'O que são grupos de captura nomeados?',
				a: 'A sintaxe (?<name>...) rotula um grupo para você ler os matches por nome em vez de posição: match.groups.name em JavaScript. O painel de grupos abaixo dos matches mostra capturas numeradas e nomeadas de cada match.'
			},
			{
				q: 'Uma regex daqui roda sem mudanças em Python ou Go?',
				a: 'Muitas vezes, mas nem sempre. Classes de caracteres, quantificadores e âncoras são portáveis; lookbehind, a sintaxe de grupos nomeados (Python usa (?P<name>...)) e flags inline diferem. O motor RE2 do Go, além disso, rejeita completamente backreferences e lookaround.'
			}
		]
	},

	'diff-checker': {
		about: [
			'Cole o texto original à esquerda e a versão alterada à direita para obter uma comparação unificada linha a linha: remoções marcadas em vermelho, adições em verde, contexto preservado entre elas, com os números de linha originais dos dois lados. É o jeito mais rápido de responder "o que realmente mudou?" entre duas configurações, duas respostas de API ou duas versões de um trecho que alguém colou no chat.',
			'A comparação usa um algoritmo de maior subsequência comum sobre linhas, da mesma família de algoritmos por trás do git diff, então blocos reordenados e pequenas edições produzem um resultado legível em vez de marcar tudo como alterado. Uma linha de resumo totaliza as linhas adicionadas e removidas.',
			'Como os dois textos ficam na página, comparar material confidencial — contratos, credenciais em configurações, textos não publicados — não carrega nenhum dos riscos de colá-lo em um serviço web qualquer.'
		],
		faqs: [
			{
				q: 'O diff funciona por palavras ou por linhas?',
				a: 'Por linhas. Cada linha é comparada como uma unidade, o que corresponde a como desenvolvedores leem diffs de código e configuração. Uma linha alterada aparece, portanto, como uma remoção mais uma adição; o destaque inline por caractere está no roadmap.'
			},
			{
				q: 'Por que meu diff mostra tudo como alterado?',
				a: 'Geralmente são diferenças invisíveis: um lado usa tabs e o outro espaços, finais de linha CRLF do Windows contra LF do Unix, ou espaços sobrando no fim das linhas. Normalizar os espaços antes de comparar (o formatador JSON com chaves ordenadas ajuda para payloads JSON) torna as mudanças reais visíveis.'
			},
			{
				q: 'Posso comparar duas respostas JSON de forma significativa?',
				a: 'Sim — passe as duas antes pelo formatador JSON com a ordenação de chaves habilitada, para que documentos equivalentes serializem de forma idêntica. Assim o diff mostra mudanças genuínas de valor em vez de ruído de ordem de chaves.'
			},
			{
				q: 'Existe um tamanho máximo de texto?',
				a: 'O algoritmo compara cada linha de um texto com cada linha do outro, então arquivos extremamente grandes (dezenas de milhares de linhas dos dois lados) podem levar um momento. Arquivos de código e payloads de API típicos comparam instantaneamente.'
			}
		]
	},

	'url-encode-decode': {
		about: [
			'Caracteres como espaços, e-comerciais e letras não ASCII não podem aparecer crus em uma URL, então são codificados em percentual: um espaço vira %20, 你 vira %E4%BD%A0. Esta ferramenta codifica texto para inclusão segura em URLs e decodifica strings com escapes percentuais de volta para texto legível, incluindo a convenção do + para espaços usada em query strings.',
			'Dois modos de codificação são oferecidos porque o próprio JavaScript tem dois: o modo componente (encodeURIComponent) escapa tudo que poderia delimitar uma URL, que é o que você quer para um único valor de query string; o modo URI completo (encodeURI) preserva caracteres estruturais como /, ? e &, para quando você está codificando uma URL inteira que precisa continuar navegável.',
			'A decodificação é rigorosa com sequências % malformadas — um % solto ou %ZZ é reportado como erro em vez de passar silenciosamente, que é exatamente como navegadores e servidores o tratariam.'
		],
		faqs: [
			{
				q: 'Quando uso o modo componente e quando uso o modo URI completo?',
				a: 'Codificando um valor que vai dentro de uma URL (uma busca, um destino de redirecionamento, um e-mail em um parâmetro) → modo componente, para que & e = dentro do valor não quebrem a query string. Codificando uma URL completa para exibição ou transporte → modo URI completo, para que a estrutura da URL sobreviva.'
			},
			{
				q: 'Por que + às vezes significa espaço?',
				a: 'O formato application/x-www-form-urlencoded — usado por envios de formulário HTML e query strings — historicamente codifica espaços como +. Em caminhos de URL, + é só um sinal de mais. O decodificador aqui trata + como espaço, seguindo a semântica de query string; %20 sempre funciona em qualquer lugar.'
			},
			{
				q: 'Por que minha string está codificada duas vezes (%2520)?',
				a: '%25 é a codificação do próprio %, então %2520 significa que o texto %20 foi codificado uma segunda vez. Acontece quando duas camadas de um sistema codificam cada uma por conta própria. Rode a decodificação duas vezes aqui para desembrulhar, e depois corrija a camada que não deveria estar codificando.'
			},
			{
				q: 'Caracteres Unicode são tratados corretamente?',
				a: 'Sim — o texto é codificado primeiro como UTF-8 e cada byte recebe escape percentual, conforme o padrão de URL do WHATWG. É por isso que um caractere CJK vira três grupos %XX.'
			}
		]
	},

	'url-parser': {
		about: [
			'Cole uma URL e veja-a dissecada: protocolo, host, porta, caminho, fragmento e cada parâmetro de query em uma tabela de chave-valor já decodificada. Ela usa o mesmo parser de URL do WHATWG que o seu navegador usa para navegar, então a interpretação que você vê é a que um navegador realmente vai aplicar — incluindo casos de borda como portas padrão sendo omitidas e caminhos sendo normalizados.',
			'A tabela de parâmetros de query é a parte que você mais vai usar: redirecionamentos longos de OAuth, links marcados com analytics e chamadas de API ficam legíveis de relance, com cada valor já decodificado do escape percentual. Domínios sem esquema também são aceitos; https:// é assumido para o parsing.',
			'Ela combina naturalmente com o codificador de URL — parseie uma URL aqui para achar o parâmetro que precisa, edite o valor e recodifique lá.'
		],
		faqs: [
			{
				q: 'Por que a URL parseada difere ligeiramente do que colei?',
				a: 'O parser do WHATWG normaliza: converte esquema e host para minúsculas, remove portas padrão (:443 para https), resolve segmentos de caminho ./ e ../ e codifica os caracteres que precisam. O que você vê é a forma canônica com que servidores e navegadores concordam.'
			},
			{
				q: 'Ele lida com URLs com chaves de query duplicadas?',
				a: 'Sim — cada ocorrência é listada como sua própria linha, em ordem. Chaves duplicadas são legais e comuns: muitas APIs as leem como arrays (?tag=a&tag=b).'
			},
			{
				q: 'Qual é a diferença entre host e hostname?',
				a: 'hostname é só o domínio (example.com); host inclui uma porta explícita não padrão (example.com:8080). Quando a porta é a padrão do esquema, os dois ficam iguais porque a porta é omitida.'
			},
			{
				q: 'O fragmento (#...) é enviado ao servidor?',
				a: 'Não. Tudo depois do # fica no navegador — servidores nunca o veem. É por isso que aplicações de página única historicamente o usavam para roteamento no cliente, e por que parâmetros de analytics colocados depois do # são invisíveis para o backend.'
			}
		]
	},

	'uuid-generator': {
		about: [
			'Gere identificadores universalmente únicos em quatro sabores: UUID v4 (totalmente aleatório, o padrão do dia a dia), UUID v7 (ordenado por tempo, a escolha moderna para chaves de banco de dados), ULID (ordenado por tempo com uma grafia compacta em Crockford Base32) e Nano ID (curto, amigável para URLs). Gere um ou até mil de uma vez — um por linha, prontos para colar em um script de seed.',
			'A aleatoriedade vem da Web Crypto API (crypto.getRandomValues), a fonte criptograficamente segura, não do Math.random. A geração é local, o que significa que os IDs não são conhecidos por mais ninguém, não ficam registrados em lugar nenhum e estão disponíveis offline.',
			'Se você está escolhendo um formato de ID para um sistema novo: v7 e ULID ordenam por hora de criação, o que mantém os índices B-tree felizes e deixa os IDs mais ou menos cronológicos nos logs; v4 não revela nada sobre quando foi criado, o que ocasionalmente é exatamente o que você quer.'
		],
		faqs: [
			{
				q: 'Qual é a diferença entre UUID v4 e v7?',
				a: 'v4 são 122 bits aleatórios. v7 (RFC 9562) começa com um timestamp de 48 bits em milissegundos Unix seguido de bits aleatórios, então IDs gerados depois ordenam depois. Para chaves primárias de banco de dados, v7 costuma melhorar a localidade de inserção e o tamanho do índice; v4 continua ótimo onde a ordem é irrelevante ou o momento de criação não pode vazar.'
			},
			{
				q: 'Dois UUIDs gerados podem colidir?',
				a: 'Com 122 bits aleatórios, a probabilidade é tão pequena que não vale a pena projetar em torno dela: você precisaria gerar bilhões de IDs por segundo durante décadas para chegar a uma chance sequer remota. Colisões na prática vêm de bugs (reutilizar uma seed, copiar linhas), não da aleatoriedade.'
			},
			{
				q: 'Por que escolher ULID em vez de UUID v7?',
				a: 'Eles resolvem o mesmo problema. ULID são 26 caracteres de Crockford Base32 sem distinção de maiúsculas — mais curto e mais limpo em URLs e logs — enquanto v7 mantém o formato UUID padrão de 36 caracteres que todo banco de dados e biblioteca já aceita. Escolha o que o seu ecossistema trata de forma mais nativa.'
			},
			{
				q: 'Esses IDs são seguros para usar como segredos ou tokens?',
				a: 'A aleatoriedade é criptograficamente segura, mas IDs costumam ser exibidos, registrados em logs e indexados — tratados como públicos. Para tokens de sessão ou chaves de API, gere um segredo dedicado com pelo menos 128 bits aleatórios e trate-o como uma senha.'
			}
		]
	},

	'hash-generator': {
		about: [
			'Calcule digests MD5, SHA-1, SHA-256, SHA-384 e SHA-512 de qualquer texto, além de assinaturas HMAC com chave, diretamente no navegador. A família SHA e o HMAC usam a Web Crypto API — as mesmas primitivas auditadas que o seu navegador usa para TLS — enquanto o MD5 (que a Web Crypto omite deliberadamente) vem como uma pequena implementação local para trabalho legado com checksums.',
			'Os hashes se atualizam ao vivo enquanto você digita, e todos os algoritmos são calculados de uma vez, então comparar um valor com um checksum em qualquer algoritmo que uma página de download tenha escolhido não exige configuração nenhuma. O modo HMAC adiciona um campo de chave secreta para verificar assinaturas de webhook — GitHub, Stripe e a maioria dos provedores de webhook assinam payloads com HMAC-SHA256.',
			'Como a entrada nunca sai da página, é seguro fazer hash de coisas que você não poderia colar em um serviço online: payloads de API, senhas que você está conferindo contra uma lista de hashes vazados, documentos internos.'
		],
		faqs: [
			{
				q: 'Qual algoritmo de hash devo usar?',
				a: 'Para qualquer coisa relevante para segurança hoje: SHA-256 ou mais forte. MD5 e SHA-1 estão quebrados quanto à resistência a colisões — duas entradas diferentes podem ser forjadas com o mesmo digest — então sobrevivem apenas para checksums não adversariais e compatibilidade com protocolos legados.'
			},
			{
				q: 'Por que o MD5 ainda é oferecido?',
				a: 'Porque você ainda o encontra: ETags, chaves de cache, manifestos de arquivos, colunas antigas de banco de dados. Verificar esses valores exige calcular MD5, independentemente do seu status criptográfico. Só não projete nada novo em cima dele.'
			},
			{
				q: 'O que é HMAC e em que difere de um hash comum?',
				a: 'O HMAC mistura uma chave secreta no hashing, de modo que só quem tem a chave consegue produzir ou verificar o digest. Um hash comum prova integridade ("estes dados não mudaram"); um HMAC também prova autenticidade ("alguém com a chave produziu isto"). Verificar assinaturas de webhook é o uso do dia a dia.'
			},
			{
				q: 'Fazer hash é o mesmo que criptografar uma senha?',
				a: 'Não, e hashes rápidos como SHA-256 são a ferramenta errada para armazenar senhas — atacantes conseguem testar bilhões por segundo. Armazenamento de senhas exige um algoritmo deliberadamente lento e com salt: bcrypt, scrypt ou Argon2.'
			}
		]
	},

	'case-converter': {
		about: [
			'Identificadores transitam entre convenções o tempo todo: a API devolve snake_case, seu TypeScript quer camelCase, a classe CSS precisa de kebab-case e a variável de ambiente exige CONSTANT_CASE. Este conversor pega qualquer entrada mista — espaços, underscores, hífens, camelCase existente — divide em palavras de forma inteligente e reagrupa em nove estilos de destino ao mesmo tempo.',
			'O divisor entende os casos difíceis: quebra "getUserByID" em get/user/by/id (mantendo a sigla intacta até a fronteira), trata dígitos como parte da palavra e processa cada linha de forma independente, então você pode colar uma coluna inteira de campos de banco de dados e converter tudo de uma vez.',
			'Todos os estilos são mostrados simultaneamente, com um botão de copiar por linha — sem escolher um modo antes: é só colar e pegar o que você precisa.'
		],
		faqs: [
			{
				q: 'Como siglas tipo "HTTPResponse" são tratadas?',
				a: 'Uma sequência de maiúsculas seguida de uma letra minúscula é dividida antes da última maiúscula: HTTPResponse → http + response. Isso corresponde a como a maioria dos guias de estilo espera que siglas sejam tokenizadas, embora nenhum divisor consiga adivinhar a intenção perfeitamente — casos como "IOError" viram io + error.'
			},
			{
				q: 'Posso converter muitos identificadores de uma vez?',
				a: 'Sim — cada linha converte de forma independente. Cole uma lista de nomes de colunas, um por linha, e a saída preserva a estrutura de linhas no novo estilo.'
			},
			{
				q: 'Qual é a diferença entre Title Case e Sentence case aqui?',
				a: 'Title Case coloca toda palavra em maiúscula inicial ("User Account Id"); Sentence case só a primeira ("User account id"). Nenhum dos dois aplica as regras editoriais sobre artigos e preposições — para identificadores você quase nunca as quer.'
			},
			{
				q: 'Por que converter de ida e volta nem sempre restaura o original?',
				a: 'Dividir em palavras descarta informação — "user_ID_2" e "userId2" tokenizam de forma idêntica. As conversões são determinísticas para frente, mas a grafia original das fronteiras de palavra nem sempre pode ser reconstruída para trás.'
			}
		]
	},

	'word-counter': {
		about: [
			'Um contador de palavras e caracteres em tempo real com os números que desenvolvedores e escritores realmente precisam: palavras, caracteres com e sem espaços, bytes UTF-8 (o que a coluna do seu banco de dados ou o limite da API realmente medem), linhas, frases, parágrafos e um tempo de leitura estimado com típicas 220 palavras por minuto.',
			'Caracteres são contados como pontos de código Unicode, não unidades UTF-16, então emoji e texto CJK contam como um humano esperaria — e a contagem separada de bytes torna a diferença visível: 日本語 são 3 caracteres, mas 9 bytes. Essa distinção é exatamente o que morde quando uma coluna VARCHAR(255) rejeita uma string de 200 "caracteres".',
			'Tudo se atualiza enquanto você digita, sem nada ser enviado a lugar algum — seguro para contar rascunhos de anúncios, contratos ou qualquer coisa que ainda não esteja pronta para o mundo.'
		],
		faqs: [
			{
				q: 'Por que as contagens de caracteres e bytes diferem?',
				a: 'Caracteres são pontos de código Unicode; bytes são sua codificação UTF-8. Letras ASCII têm 1 byte cada, a maioria das letras europeias acentuadas 2, caracteres CJK 3 e emoji 4 (ou mais em sequências). Limites de banco de dados, cabeçalhos HTTP e muitas APIs medem bytes, não caracteres.'
			},
			{
				q: 'Como as palavras são contadas em idiomas sem espaços?',
				a: 'A contagem de palavras divide por espaços em branco, o que subconta texto não segmentado em chinês ou japonês. Para esses idiomas, a contagem de caracteres é a métrica mais significativa, e é por isso que as duas são sempre mostradas.'
			},
			{
				q: 'O que conta como uma frase?',
				a: 'Um trecho de texto terminado em ., !, ? ou … seguido de espaço em branco ou do fim da entrada. Abreviações como "e.g." podem inflar levemente a contagem — contar frases é inerentemente heurístico.'
			},
			{
				q: 'Quão preciso é o tempo de leitura?',
				a: 'Ele divide a contagem de palavras por 220 ppm, uma média comum para leitura silenciosa adulta de prosa geral. Material técnico com código é lido mais devagar; listas escaneáveis, mais rápido. Trate-o como uma estimativa de ordem de grandeza.'
			}
		]
	},

	'lorem-ipsum-generator': {
		about: [
			'Texto de preenchimento para layouts, mockups e dados de seed, gerado no seu navegador: escolha palavras, frases ou parágrafos, defina uma quantidade e copie. A saída usa o clássico vocabulário do Cícero embaralhado, então parece prosa natural em pseudo-latim sem formar frases legíveis que distraiam.',
			'Por padrão o texto abre com o tradicional "Lorem ipsum dolor sit amet" — a frase que designers e revisores reconhecem instantaneamente como texto de preenchimento — e você pode desativá-la para uma saída totalmente aleatória quando precisar de vários blocos distintos.',
			'Os comprimentos das frases e os tamanhos dos parágrafos variam aleatoriamente dentro de faixas realistas, então o texto resultante tem o ritmo visual de um texto real — importante quando você está avaliando tipografia ou quebra de linha, onde frases uniformes parecem artificiais.'
		],
		faqs: [
			{
				q: 'De onde vem o lorem ipsum?',
				a: 'São fragmentos embaralhados de "De finibus bonorum et malorum" de Cícero (45 a.C.), usados como preenchimento por tipógrafos desde pelo menos os anos 1960 e popularizados pelas folhas Letraset e, depois, pelos softwares de editoração eletrônica.'
			},
			{
				q: 'Por que usar lorem ipsum em vez de texto real?',
				a: 'Conteúdo legível sequestra a atenção — revisores começam a editar as palavras em vez de avaliar o layout. O pseudo-latim tem frequências de letras e comprimentos de palavras naturais sem ser legível, o que mantém o foco no design.'
			},
			{
				q: 'O texto gerado é sempre o mesmo?',
				a: 'Não — as palavras são sorteadas a cada vez, então duas gerações diferem. Só a frase clássica opcional de abertura é fixa.'
			},
			{
				q: 'Posso gerar uma contagem exata de palavras para um limite de campo de CMS?',
				a: 'Sim — defina a unidade como palavras e a quantidade exatamente como precisar, até 1000 por vez. Combine com o contador de palavras para verificar limites de caracteres ou bytes.'
			}
		]
	},

	'slug-generator': {
		about: [
			'Transforme qualquer título em um slug pronto para URL: minúsculas, separado por hífens, sem pontuação, com acentos transliterados para ASCII puro — "Crème brûlée à Paris" vira "creme-brulee-a-paris". As opções cobrem as variações comuns: separadores com underscore, preservação de maiúsculas e um comprimento máximo que corta em uma fronteira de palavra em vez de no meio dela.',
			'Slugs importam tanto para humanos quanto para mecanismos de busca: são legíveis na barra de endereço, sobrevivem ao copiar-e-colar no chat sem escapes percentuais e dão aos resultados de busca uma URL com palavras-chave. A etapa de transliteração é o que a maioria das funções slugify caseiras pula — sem ela, títulos acentuados quebram URLs ou desaparecem por completo.',
			'Cada linha vira slug de forma independente, então uma lista colada de títulos de artigos se torna uma lista correspondente de slugs em uma única operação.'
		],
		faqs: [
			{
				q: 'Por que hífens em vez de underscores?',
				a: 'Mecanismos de busca tratam hífens como separadores de palavras, mas historicamente trataram underscores como junções, e hífens são visualmente mais claros em textos de link sublinhados. Underscores continuam populares para nomes de arquivo e identificadores, então os dois são oferecidos.'
			},
			{
				q: 'O que acontece com alfabetos não latinos, como chinês ou cirílico?',
				a: 'Caracteres com equivalentes ASCII (latinos acentuados, algumas letras especiais como ß → ss) são transliterados; alfabetos sem um mapeamento latino simples são removidos. Para conteúdo não latino, a prática comum é manter o alfabeto nativo codificado em percentual na URL ou escrever um slug romanizado manualmente.'
			},
			{
				q: 'Existe um comprimento ideal de slug?',
				a: 'Mais curto é melhor para compartilhar e exibir, mas não há um precipício de ranqueamento. A opção de comprimento máximo corta em uma fronteira de palavra — útil para CMSs que limitam colunas de slug a 50–80 caracteres.'
			},
			{
				q: 'O slug deve mudar quando o título muda?',
				a: 'Depois de publicado, idealmente não — a URL é um endereço para o qual outros já apontaram links. A maioria dos sites mantém o slug original ou adiciona um redirecionamento. Gere slugs na criação e trate renomeações como uma decisão deliberada de redirecionamento.'
			}
		]
	},

	'sort-lines': {
		about: [
			'Uma bancada de processamento de linhas: cole qualquer lista e ordene alfabeticamente, em ordem reversa, naturalmente (item2 antes de item10), por comprimento, ou embaralhe — opcionalmente removendo espaços das pontas, descartando linhas vazias e eliminando duplicatas com a ordem preservada. A contagem de linhas removidas é reportada, para você ver exatamente o que a deduplicação fez.',
			'A ordenação natural é a opção que você mais vai usar: a ordenação alfabética pura coloca "item10" antes de "item2" porque compara caractere por caractere, enquanto a natural compara os números embutidos numericamente — a ordem que humanos esperam para nomes de arquivo, versões e IDs.',
			'A deduplicação mantém a primeira ocorrência e preserva a ordem original das sobreviventes, o que importa quando a ordem da lista tem significado (imports, linhas de configuração, playlists). Um modo sem distinção de maiúsculas trata "Apple" e "apple" como a mesma linha.'
		],
		faqs: [
			{
				q: 'Qual é a diferença entre ordenação alfabética e natural?',
				a: 'A alfabética compara códigos de caractere, então "file10" < "file2" (porque "1" < "2" na posição 5). A natural reconhece sequências de dígitos e as compara como números, resultando em file2 < file10. Use a natural para qualquer coisa que contenha números.'
			},
			{
				q: 'A deduplicação mantém a primeira ou a última ocorrência?',
				a: 'A primeira. As linhas são varridas de cima para baixo e uma linha só é descartada se uma idêntica (ou igual ignorando maiúsculas, no modo sem distinção) apareceu antes — assim a ordem sobrevivente corresponde à original.'
			},
			{
				q: 'Que tamanho de lista isso aguenta?',
				a: 'Centenas de milhares de linhas funcionam bem — as operações são passagens simples e uma ordenação. Tudo fica na memória do navegador, então o limite prático é a sua máquina, não uma cota de servidor.'
			},
			{
				q: 'Posso combinar operações?',
				a: 'Sim, e elas se aplicam em uma ordem sensata: primeiro o trim, depois a remoção de vazias, depois a deduplicação, depois a ordenação — assim " apple " e "apple" deduplicam juntas quando o trim está ligado, e a ordenação sempre vê a lista já limpa.'
			}
		]
	},

	'html-entities': {
		about: [
			'Escape texto para inclusão segura em HTML — & vira &amp;amp;, < vira &amp;lt; — ou decodifique texto cheio de entidades de volta para caracteres legíveis, cobrindo entidades nomeadas (&amp;rarr;), referências numéricas decimais (&amp;#169;) e hexadecimais (&amp;#xA9;).',
			'A codificação oferece dois níveis: os cinco caracteres essenciais que quebram a estrutura do HTML (&amp; &lt; &gt; " \'), que é tudo que você precisa para correção, ou tudo que não for ASCII, útil quando alguma etapa da toolchain corrompe UTF-8 entre você e a página. Um modo somente numérico dispensa entidades nomeadas para máxima compatibilidade com parsers XML estritos, que só garantem as cinco predefinidas.',
			'O decodificador é a metade do dia a dia: cole um trecho raspado ou uma resposta de API cheia de &amp;#x27; e receba texto limpo. Nomes de entidade desconhecidos passam intactos em vez de serem adivinhados.'
		],
		faqs: [
			{
				q: 'Quais caracteres precisam ser escapados em HTML?',
				a: 'Em conteúdo de texto: & e <. Em valores de atributo: também o caractere de aspas que delimita o atributo (" ou \'). Escapar > é convencional, mas não estritamente obrigatório. Todo o resto pode aparecer literalmente em um documento UTF-8.'
			},
			{
				q: 'Codificar entidades é uma defesa contra XSS?',
				a: 'Escapar os cinco caracteres estruturais é o núcleo da codificação de saída para contexto HTML, sim — mas apenas para contextos de texto e atributo HTML. URLs, strings JavaScript e CSS precisam de suas próprias codificações específicas de contexto; escapar entidades sozinho não torna injeção arbitrária segura nesses lugares.'
			},
			{
				q: 'Entidades nomeadas ou numéricas — quais devo emitir?',
				a: 'Referências numéricas (&amp;#xE9;) funcionam em qualquer parser HTML e XML. Entidades nomeadas são mais legíveis, mas o XML só predefine cinco, então &amp;eacute; quebra um pipeline XML/XHTML estrito. Na dúvida, numéricas.'
			},
			{
				q: 'Por que vejo &amp;amp;#39; (codificação dupla) nos meus dados?',
				a: 'Duas camadas codificaram uma vez cada: o &amp; da primeira codificação foi escapado por uma segunda passada. Decodifique duas vezes aqui para recuperar o texto, depois encontre e corrija a camada que não deveria estar codificando.'
			}
		]
	},

	'unicode-inspector': {
		about: [
			'Cole qualquer texto e veja cada caractere dissecado: seu ponto de código (U+XXXX), bytes UTF-8, unidades UTF-16, sequência de escape JavaScript, entidade HTML e categoria geral — além dos totais de pontos de código, unidades UTF-16, bytes UTF-8 e caracteres percebidos pelo usuário (grafemas).',
			'Esta é a ferramenta para os momentos de "por que essa string está estranha?": caracteres invisíveis (espaços de largura zero, BOMs, marcas direcionais) aparecem como linhas visíveis; caracteres parecidos (а cirílico vs a latino) revelam pontos de código diferentes; e um emoji que "é um caractere" acaba sendo sete pontos de código unidos por zero-width joiners.',
			'Os quatro totais diferentes de comprimento respondem à eterna pergunta de por que o .length do JavaScript, um limite de bytes de banco de dados e o que o usuário vê discordam sobre o tamanho de uma string.'
		],
		faqs: [
			{
				q: 'Por que "🎉".length === 2 em JavaScript?',
				a: 'Strings JavaScript contam unidades de código UTF-16. Caracteres além de U+FFFF — incluindo a maioria dos emoji — precisam de um par substituto, duas unidades. O inspetor mostra as duas unidades e o ponto de código real, e o resumo os conta separadamente.'
			},
			{
				q: 'O que é um grafema (grapheme cluster)?',
				a: 'O que um leitor percebe como um caractere. é pode ser dois pontos de código (e + acento combinante), e emoji de família podem ser sete ou mais unidos por zero-width joiners. A contagem de grafemas usa o Intl.Segmenter do navegador — o mais próximo que existe de "caracteres como os usuários os veem".'
			},
			{
				q: 'Como encontro caracteres invisíveis em uma string?',
				a: 'Cole-a aqui — cada ponto de código ganha uma linha, incluindo espaços de largura zero (U+200B), espaços inseparáveis (U+00A0), BOMs (U+FEFF) e marcas direcionais, cada um rotulado por categoria. Esses são os culpados clássicos por trás de strings "idênticas" que falham em comparações de igualdade.'
			},
			{
				q: 'O que as sequências de bytes UTF-8 me dizem?',
				a: 'Exatamente o que será armazenado ou transmitido: ASCII é um byte, a maioria das extensões latinas dois, CJK três, emoji quatro. Se um sistema truncar no meio de uma sequência você recebe caracteres de substituição (�) — a visão de bytes mostra onde esses cortes cairiam.'
			}
		]
	},

	'cron-parser': {
		about: [
			'Cole uma expressão cron de cinco campos e receba a explicação em linguagem clara, com um detalhamento campo a campo e — a parte que pega os erros de verdade — as próximas cinco execuções reais calculadas no seu fuso horário local. "0 3 * * 1" é lida como "Às 03:00, na segunda-feira", seguida das datas concretas em que vai disparar.',
			'O parser suporta a sintaxe padrão completa: listas (1,15), intervalos (9-17), passos (*/15), nomes de meses e dias da semana (jan, mon), 7 como domingo e a família de macros @daily/@hourly. Ele também implementa a regra que todo mundo esquece: quando tanto o dia do mês quanto o dia da semana estão restritos, o job roda quando qualquer um deles casa, não os dois.',
			'Expressões de seis campos (Quartz, com segundos) são detectadas e apontadas explicitamente em vez de mal interpretadas em silêncio — a fonte mais comum da confusão de "meu cron está errado" ao migrar entre agendadores Java e o crontab Unix.'
		],
		faqs: [
			{
				q: 'Quais são os cinco campos, em ordem?',
				a: 'Minuto (0–59), hora (0–23), dia do mês (1–31), mês (1–12), dia da semana (0–6, domingo = 0, com 7 também aceito como domingo). Lembrar a ordem é a luta eterna — o painel de detalhamento rotula cada campo da sua expressão.'
			},
			{
				q: 'Por que "0 0 1 * 1" roda com mais frequência do que eu esperava?',
				a: 'Porque tanto o dia do mês (dia 1) quanto o dia da semana (segunda-feira) estão restritos, e o cron roda o job quando QUALQUER um casa — todo dia 1 do mês E toda segunda-feira. Para significar "o dia 1 apenas quando cair numa segunda", você precisa checar a data no próprio script.'
			},
			{
				q: 'Qual fuso horário as próximas execuções usam?',
				a: 'O fuso local do seu navegador, mostrado junto aos resultados. Crontabs reais rodam no fuso do servidor (ou na linha TZ= de alguns crons) — sempre confirme o que a máquina de destino usa, especialmente através de mudanças de horário de verão.'
			},
			{
				q: 'Isso suporta segundos ou anos?',
				a: 'Não — essas são extensões do Quartz (Java) com 6 ou 7 campos. O cron Unix padrão tem exatamente cinco campos e resolução de um minuto. Entradas de seis campos são detectadas e reportadas como Quartz em vez de mal lidas.'
			}
		]
	},

	'password-generator': {
		about: [
			'Gere senhas aleatórias com comprimento e conjuntos de caracteres escolhidos, em lote se necessário, com um cálculo honesto de entropia — bits de aleatoriedade, não uma barra colorida decorativa. A aleatoriedade vem de crypto.getRandomValues com rejection sampling, então cada caractere é sorteado uniformemente, sem viés de módulo.',
			'Cada conjunto de caracteres habilitado tem pelo menos um representante garantido (uma política que muitos sites impõem); o resto da senha é preenchido uniformemente e o todo é embaralhado — assim os caracteres garantidos não se agrupam de forma previsível no início.',
			'Um filtro de caracteres ambíguos descarta os sósias (0/O, 1/l/I) para senhas que um humano possa vir a ler em voz alta ou redigitar do papel. Como a geração é local, as senhas existem apenas na sua máquina até você colocá-las em algum lugar.'
		],
		faqs: [
			{
				q: 'O que significam os bits de entropia?',
				a: 'Entropia = comprimento × log2(tamanho do conjunto): o número de possibilidades igualmente prováveis que um atacante precisa vasculhar. 64 bits de entropia resistem a um ataque casual; 80+ bits são fortes contra quebra offline de hashes rápidos; 100+ é efetivamente inadivinhável. Uma senha de 16 caracteres com letras+dígitos+símbolos tem ~104 bits.'
			},
			{
				q: 'Uma senha longa só de minúsculas é melhor que uma curta e complexa?',
				a: 'Muitas vezes sim — o comprimento multiplica a entropia, enquanto conjuntos extras só alargam a base do logaritmo. 20 letras minúsculas (~94 bits) vencem 10 caracteres totalmente misturados (~65 bits). Regras de complexidade existem principalmente para derrotar listas de palavras, que a geração aleatória já derrota.'
			},
			{
				q: 'É seguro gerar senhas em um navegador?',
				a: 'A aleatoriedade (crypto.getRandomValues) é o mesmo CSPRNG que gerenciadores de senha nativos usam, e esta página não faz nenhuma requisição de rede com seus dados. Os riscos realistas estão no que acontece depois da geração: histórico da área de transferência, compartilhamento de tela e onde você a guarda.'
			},
			{
				q: 'Por que excluir caracteres ambíguos?',
				a: 'Para senhas que serão lidas por humanos — códigos de recuperação impressos, ditados por telefone, digitados de outra tela — 0/O e 1/l/I causam chamados de suporte de verdade. Para senhas puramente coladas, mantenha-os; a perda de entropia por excluí-los é pequena de qualquer forma.'
			}
		]
	},

	'qr-code-generator': {
		about: [
			'Digite ou cole qualquer texto — uma URL, credenciais de WiFi, informações de contato — e receba um QR code na hora, renderizado como um SVG vetorial nítido para download, ou exportado como PNG para chats e slides. Sem marca-d\'água, sem redirecionamento de "plano grátis" que expira, e como a geração é local, o que você codifica nunca toca um servidor.',
			'Esse último ponto importa mais do que parece: muitos serviços gratuitos de QR roteiam sua URL pelo domínio de redirecionamento deles (para poder cobrar depois ou rastrear escaneamentos), o que significa que o código para de funcionar quando o serviço parar. Códigos gerados aqui codificam seu conteúdo diretamente e funcionam para sempre.',
			'Quatro níveis de correção de erros trocam capacidade por robustez — L sobrevive a danos leves, H sobrevive com 30% do símbolo obscurecido (útil quando um logotipo cobrirá o centro ou a impressão será pequena e desgastada).'
		],
		faqs: [
			{
				q: 'Qual nível de correção de erros devo escolher?',
				a: 'M (15%) é o padrão sensato. Use H (30%) para códigos impressos pequenos, códigos atrás de vidro ou reflexo, ou ao sobrepor um logotipo. Correção mais alta torna o código mais denso, então para URLs muito longas na tela, L mantém os módulos maiores e mais fáceis de escanear.'
			},
			{
				q: 'Por que SVG é melhor que PNG para impressão?',
				a: 'SVG é independente de resolução — a impressora rasteriza no DPI nativo dela, mantendo as bordas dos módulos perfeitamente nítidas em qualquer tamanho. PNG precisa ser gerado em algum tamanho de pixels e pode borrar ao ser escalado. Use SVG para impressão e ferramentas de design, PNG para chat e slides.'
			},
			{
				q: 'Quantos dados cabem em um QR code?',
				a: 'Até ~3 KB de bytes na teoria (versão 40, nível L), mas códigos tão grandes são difíceis de escanear a partir de telas. Menos de 300 caracteres escaneia de forma confiável; para URLs longas, encurte-as primeiro — com um encurtador no seu próprio domínio, se a permanência importar.'
			},
			{
				q: 'Esses códigos expiram ou rastreiam escaneamentos?',
				a: 'Não. O conteúdo é codificado diretamente no padrão — nada passa por este site, então não há o que expirar, e ninguém (inclusive nós) vê quando ou onde ele é escaneado. Rastrear escaneamentos exige, por natureza, um serviço de redirecionamento.'
			}
		]
	},

	'json-to-yaml': {
		about: [
			'Converta entre JSON, YAML e TOML em qualquer direção. O formato de origem é detectado automaticamente enquanto você cola — colchetes sugerem JSON, dois-pontos de chave: sugerem YAML, [tabelas] sugerem TOML — com uma sobrescrita manual para entradas ambíguas. A conversão passa por um parse de verdade, então a saída é garantidamente válida, não uma transformação textual linha a linha.',
			'Cada formato tem pontos fortes reais: JSON para APIs e intercâmbio entre máquinas, YAML para configuração editada por humanos (Kubernetes, pipelines de CI), TOML para arquivos de configuração bem tipados (Cargo, pyproject). Mover dados entre eles na mão convida erros de indentação e aspas que esta conversão elimina.',
			'O conversor é honesto sobre os limites dos formatos: TOML não tem arrays no nível superior nem null, e converter documentos assim explica o porquê em vez de descartar dados silenciosamente.'
		],
		faqs: [
			{
				q: 'Os comentários sobrevivem à conversão?',
				a: 'Não — JSON não tem sintaxe de comentário, e a conversão passa pela estrutura de dados parseada, que não carrega comentários. Converter YAML → JSON → YAML perde os comentários de forma irreversível; guarde o arquivo original quando os comentários importarem.'
			},
			{
				q: 'Por que meu "no" em YAML virou false?',
				a: 'YAML 1.1 trata yes/no/on/off como booleanos, e o código de país NO famosamente vira false. O parser aqui segue YAML 1.2 (apenas true/false), mas arquivos escritos para parsers antigos ainda podem surpreender. Coloque aspas em strings que pareçam booleanos, números ou datas.'
			},
			{
				q: 'Por que meu JSON não converte para TOML?',
				a: 'TOML exige uma tabela (objeto) no nível superior — arrays ou escalares soltos não podem ser um documento TOML — e não tem null. Reestruture os dados (embrulhe o array em uma chave, remova ou dê valor padrão aos nulls) e a conversão funciona.'
			},
			{
				q: 'YAML é um superconjunto de JSON?',
				a: 'Na prática, sim — YAML 1.2 parseia virtualmente todos os documentos JSON, e é por isso que colar JSON em uma configuração YAML geralmente funciona. O inverso não vale: âncoras, escalares multilinha e tags de YAML não têm equivalente em JSON e são expandidos ou convertidos em string na conversão.'
			}
		]
	},

	'json-to-csv': {
		about: [
			'Cole um array de objetos JSON e receba um CSV pronto para planilha: objetos aninhados são achatados em nomes de coluna com pontos (user.address.city), as colunas são unificadas entre todas as linhas (valores ausentes viram células vazias) e o uso de aspas segue o RFC 4180, então vírgulas, aspas e quebras de linha dentro dos valores sobrevivem ao Excel e ao Google Sheets.',
			'Este é o caminho mais rápido de uma resposta de API até uma planilha que alguém possa filtrar e pivotar. A união de colunas importa com dados do mundo real, onde os objetos são heterogêneos — a linha 1 pode não ter campos que a linha 40 tem, e o conversor lida com isso em vez de dar erro ou descartar dados.',
			'Arrays dentro das linhas são serializados como strings JSON em vez de explodidos em colunas — uma escolha deliberada que mantém uma linha de entrada como uma linha de saída. Uma opção de delimitador ponto-e-vírgula cobre localidades onde o Excel espera ; em vez de ,.'
		],
		faqs: [
			{
				q: 'Como objetos aninhados são representados?',
				a: 'Achatados com chaves unidas por pontos: {"user":{"name":"Ada"}} vira uma coluna user.name. Isso mantém cada valor escalar endereçável em uma única linha de cabeçalho plana, que é com o que ferramentas de planilha conseguem realmente trabalhar.'
			},
			{
				q: 'O que acontece com arrays dentro de uma linha?',
				a: 'Eles são embutidos como texto JSON em uma única célula (["a","b"]). Explodir arrays em colunas (tags.0, tags.1…) ou em linhas extras muda a forma dos seus dados de maneiras opinativas — embutir mantém a conversão sem perdas e previsível.'
			},
			{
				q: 'Por que o Excel mostra meu CSV em uma coluna só?',
				a: 'Configurações de localidade: em boa parte da Europa, o Excel espera arquivos separados por ponto-e-vírgula porque a vírgula é o separador decimal. Mude a opção de delimitador para ponto-e-vírgula, ou use Dados → De Texto/CSV, que permite especificar o separador.'
			},
			{
				q: 'O conversor lida com um único objeto (não um array)?',
				a: 'Sim — um objeto sozinho vira um CSV de uma linha. Objetos indexados por ID ({"a1":{...},"a2":{...}}) convertem como uma única linha larga, porém; transforme-os em array antes se cada valor deve ser uma linha.'
			}
		]
	},

	'json-to-typescript': {
		about: [
			'Cole uma amostra de JSON — uma resposta de API, um arquivo de configuração — e receba uma interface TypeScript inferida dela: objetos aninhados viram tipos aninhados, arrays ganham tipos de elemento (com unions para conteúdos mistos) e chaves que não são identificadores válidos recebem aspas corretamente.',
			'Tipos gerados são um ponto de partida, não um contrato: a inferência vê uma amostra, então um campo que por acaso é null no seu exemplo é tipado como null, e campos opcionais que estavam ausentes simplesmente não existem para ela. A saída é deliberadamente simples — sem decorators, sem validação em runtime — para você colar em qualquer lugar e refinar.',
			'Para campos que variam entre requisições, passe uma segunda amostra e mescle na mão, ou gradue para ferramentas schema-first (OpenAPI, zod) quando a forma estabilizar. Para o momento cotidiano de "só preciso de um tipo para esta resposta", uma colada basta.'
		],
		faqs: [
			{
				q: 'Por que meu campo anulável é tipado só como null?',
				a: 'A inferência vê apenas a amostra que você colou. Se o campo estava null ali, null é tudo que ela pode saber. Mude para string | null (ou seja lá qual for o tipo real) depois da geração — ou cole uma amostra em que o campo esteja preenchido.'
			},
			{
				q: 'Como campos opcionais são tratados?',
				a: 'Eles não são detectados — uma única amostra não distingue "sempre presente" de "presente desta vez". Campos ausentes da amostra ficam ausentes do tipo. Marque campos como opcionais (name?:) manualmente onde você sabe que a API os omite.'
			},
			{
				q: 'O que arrays de tipos mistos produzem?',
				a: 'Uma union: [1, "a"] infere (number | string)[]. Arrays vazios inferem unknown[], já que não há elemento para inspecionar — substitua pelo tipo real de elemento quando o conhecer.'
			},
			{
				q: 'Devo usar tipos inferidos ou uma biblioteca de schema como zod?',
				a: 'Interfaces inferidas são apenas de tempo de compilação — não validam nada em runtime. Para ferramentas internas e tipagem rápida elas são perfeitas; para entrada não confiável em runtime, defina um schema zod/valibot e derive o tipo estático dele.'
			}
		]
	},

	'jsonpath-tester': {
		about: [
			'Teste expressões JSONPath contra o seu próprio JSON e veja cada match com seu valor e seu caminho concreto. Suporta a sintaxe que cobre o uso do dia a dia: notação de ponto e de colchetes, índices de array (inclusive negativos), curingas, unions ([\'a\',\'b\']) e descida recursiva ($..price).',
			'A saída de caminho por match é a parte discretamente útil: consulte $..id em um documento profundo e cada resultado diz exatamente onde ele mora ($.data.items[3].id), pronto para colar no código. Ela transforma "em algum lugar deste blob" em um endereço exato.',
			'Expressões de filtro ([?(@.price < 10)]) ainda não estão implementadas — a ferramenta diz isso explicitamente em vez de devolver resultados errados. Para extração estrutural, que é a maior parte do uso de JSONPath, tudo funciona.'
		],
		faqs: [
			{
				q: 'Qual é a diferença entre $.a.b e $..b?',
				a: '$.a.b segue uma rota exata: a chave a na raiz, depois a chave b dentro dela. $..b (descida recursiva) encontra todo b em qualquer lugar do documento, em qualquer profundidade. A descida recursiva é poderosa mas pode surpreender — ela também casa chaves b aninhadas dentro de coisas que você não considerou.'
			},
			{
				q: 'Como acesso chaves com espaços ou hífens?',
				a: "Notação de colchetes com aspas: $['my key'] ou $.data['content-type']. A notação de ponto só funciona para chaves que sejam nomes válidos no estilo de identificadores."
			},
			{
				q: 'Índices negativos de array funcionam?',
				a: 'Sim — [-1] é o último elemento, [-2] o penúltimo, seguindo a convenção popularizada pelo Python e adotada pelo RFC 9535. [0] continua sendo o primeiro elemento.'
			},
			{
				q: 'JSONPath é padronizado?',
				a: 'Desde 2024, sim — o RFC 9535 define a sintaxe e a semântica. Implementações escritas antes dele divergem em casos de borda (especialmente filtros e unions), então a mesma expressão pode se comportar diferente entre bibliotecas; teste contra a implementação com que você faz o deploy.'
			}
		]
	},

	'bcrypt-generator': {
		about: [
			'Faça o hash de uma senha com bcrypt no fator de custo escolhido, ou verifique um texto puro contra um hash existente — os dois inteiramente no navegador, que é precisamente o que você quer quando a coisa sendo testada é uma senha. Um inspetor de hash também decompõe qualquer hash bcrypt em versão, custo e salt.',
			'O bcrypt continua sendo uma escolha sólida para armazenamento de senhas porque é deliberadamente lento e usa salt por senha: o fator de custo dobra o trabalho a cada incremento, então custo 12 significa 4096 iterações da preparação da cifra subjacente. O medidor de tempo mostra quanto o custo escolhido demora, tornando concreto o trade-off entre segurança e latência.',
			'A verificação é a necessidade diária mais comum: confirmar que um hash em um banco de dados corresponde a uma senha conhecida sem subir o código da aplicação. Cole os dois e receba um sim ou não.'
		],
		faqs: [
			{
				q: 'Que fator de custo devo usar em produção?',
				a: 'A orientação clássica: o mais alto que o seu orçamento de latência de login permitir, comumente 10–13 hoje. Mire em 100–300ms por hash no seu hardware de produção. O JavaScript de navegador roda mais devagar que código nativo, então o tempo mostrado aqui é um teto para os seus servidores.'
			},
			{
				q: 'Por que a mesma senha dá um hash diferente a cada vez?',
				a: 'Um salt aleatório de 16 bytes é gerado por hash e armazenado dentro da própria string do hash. É assim por design — senhas idênticas recebem hashes diferentes, derrotando rainbow tables pré-computadas. A verificação lê o salt de volta de dentro do hash, e é por isso que a comparação funciona.'
			},
			{
				q: 'O que significam as partes de um hash bcrypt?',
				a: '$2b$12$ + 53 caracteres: 2b é a versão do algoritmo, 12 o custo (2^12 iterações), os próximos 22 caracteres são o salt e os 31 finais o digest — tudo no alfabeto base64 próprio do bcrypt. O inspetor abaixo da ferramenta divide qualquer hash desse jeito.'
			},
			{
				q: 'O bcrypt ainda é recomendado em vez do Argon2?',
				a: 'Argon2id é a primeira escolha atual para sistemas novos (a exigência de memória resiste à quebra por GPU). O bcrypt continua aceitável e onipresente — o conselho prático é: não migre em pânico um armazenamento bcrypt que funciona, mas escolha Argon2id para projetos do zero. Ambos estão léguas além de hashes rápidos como SHA-256.'
			}
		]
	},

	'user-agent-parser': {
		about: [
			'Cole uma string de User-Agent de uma linha de log, de um relatório de bug ou de uma exportação de analytics e receba-a decodificada: navegador e versão, motor de renderização, sistema operacional, tipo de dispositivo e arquitetura de CPU. O parser é o ua-parser-js, a mesma biblioteca por trás de incontáveis pipelines de analytics, rodando localmente na sua string.',
			'Strings de User-Agent são sítios arqueológicos — todas ainda afirmam ser Mozilla/5.0, o Chrome afirma ser Safari, o Safari afirma ser KHTML, e a identidade real se esconde nos tokens finais. Um parser é melhor que ficar apertando os olhos: ele sabe que "CriOS" significa Chrome no iOS e que o Edge se esconde atrás de "Edg/".',
			'Note a direção do vento: navegadores estão congelando e reduzindo as strings de UA (e o Chromium envia UA Client Hints no lugar), então o detalhe de versão a partir do UA sozinho está cada vez mais grosseiro. Para forense de logs e triagem de bugs ele continua indispensável; para decisões de funcionalidade, use detecção de recursos.'
		],
		faqs: [
			{
				q: 'Por que todo User-Agent começa com Mozilla/5.0?',
				a: 'Teatro de compatibilidade dos anos 1990 que nunca acabou: servidores farejavam "Mozilla" para servir páginas modernas, então todo navegador novo afirmava ser ele, e cada navegador seguinte imitou seus antecessores. O prefixo hoje é tradição sem significado.'
			},
			{
				q: 'Posso confiar na versão do SO em uma string de UA?',
				a: 'Cada ano menos. O macOS congelou sua versão de UA em 10_15_7, o Windows 11 se reporta como Windows NT 10.0, e navegadores com UA reduzido tornam as versões deliberadamente mais grosseiras. Trate versões de SO vindas do UA como aproximadas; use UA Client Hints onde você controla o cliente.'
			},
			{
				q: 'O que significa "like Gecko" ou "KHTML, like Gecko"?',
				a: 'Mais camadas de imitação: o WebKit descende do KHTML e queria que páginas com tratamento especial para o Gecko (o motor do Firefox) funcionassem, então acrescentou "like Gecko". Todo navegador WebKit/Blink carrega a frase até hoje.'
			},
			{
				q: 'Devo usar parsing de UA para detecção de recursos?',
				a: 'Não — sniffing quebra no momento em que uma nova versão de navegador é lançada. Detecte o próprio recurso (if ("clipboard" in navigator)). Parsing de UA serve para analytics, análise de logs e reprodução de bugs relatados por usuários, onde conhecer o ambiente é exatamente o objetivo.'
			}
		]
	},

	'color-converter': {
		about: [
			'Insira uma cor em qualquer notação comum — #hex, rgb(), hsl() ou uma cor nomeada do CSS — e receba todos os formatos de uma vez: HEX, RGB, HSL e OKLCH, ao lado de uma amostra ao vivo. Canais alfa são preservados entre os formatos, e a saída usa a sintaxe CSS moderna (canais separados por espaço), que cola limpa em folhas de estilo atuais.',
			'OKLCH está incluído porque é para onde a cor no CSS está indo: ao contrário do HSL, seu eixo de luminosidade é perceptualmente uniforme, então duas cores com o mesmo L realmente parecem igualmente claras, e ajustar o matiz não muda acidentalmente o brilho percebido. Converter uma paleta existente para OKLCH é o primeiro passo para construir escalas de cor consistentes.',
			'A matemática da conversão roda localmente usando as transformações publicadas sRGB↔OKLab, e os valores fazem a viagem de ida e volta: o RGB que você recebe de uma entrada HSL é exatamente o que o navegador computaria.'
		],
		faqs: [
			{
				q: 'Por que os valores de luminosidade de HSL e OKLCH discordam?',
				a: "A luminosidade do HSL é uma propriedade geométrica dos valores RGB, não da visão humana — o amarelo hsl(60 100% 50%) parece bem mais claro que o azul hsl(240 100% 50%), apesar do L idêntico. O eixo L do OKLCH foi projetado para corresponder à percepção, então L igual significa brilho aparente igual. Essa discordância é a razão inteira de o OKLCH existir."
			},
			{
				q: 'O que significa o valor alfa e onde ele entra em cada formato?',
				a: 'Alfa é opacidade, de 0 (transparente) a 1 (opaco). Em hex de 8 dígitos é o byte final (#RRGGBBAA); na sintaxe funcional moderna vem depois de uma barra: rgb(76 141 255 / 0.5). Este conversor carrega o alfa por todos os formatos automaticamente.'
			},
			{
				q: 'Toda cor OKLCH pode ser exibida em sRGB?',
				a: 'Não — OKLCH cobre gamas amplas, e algumas combinações de croma/luminosidade não têm equivalente em sRGB. Converter a partir de sRGB (como esta ferramenta faz) sempre permanece representável; no sentido inverso, cores fora da gama precisam ser cortadas ou mapeadas, e é por isso que um verde P3 vívido parece mais apagado em uma tela sRGB.'
			},
			{
				q: 'Por que rgb(76 141 255) separado por espaços em vez de vírgulas?',
				a: 'O CSS Color Module Level 4 padronizou canais separados por espaço com um /alfa opcional, e todo navegador moderno suporta. A forma com vírgulas ainda funciona, mas a forma com espaços é a que as novas especificações (e esta ferramenta) usam.'
			}
		]
	},

	'image-to-base64': {
		about: [
			'Solte, escolha ou cole uma imagem e receba seu Base64 em todos os sabores de que possa precisar: um data URL pronto para uso, uma declaração CSS background-image, uma tag <img> completa com as dimensões reais e o payload Base64 puro. O caminho inverso também funciona — cole um data URL ou um bloco de Base64 e a imagem é decodificada, pré-visualizada e baixável como arquivo.',
			'O formato é identificado pelos bytes mágicos, não pela extensão nem pelo tipo MIME declarado, então um PNG renomeado para .jpg (ou um data URL com o rótulo errado) converte corretamente do mesmo jeito. O painel de tamanhos é honesto sobre o custo: Base64 infla os dados em cerca de um terço, e o tamanho codificado exato aparece ao lado do original para você decidir se embutir vale a pena.',
			'Diferente da maioria dos sites de imagem para Base64, nada é enviado — o arquivo é lido com a API FileReader do navegador e codificado na própria página. Isso torna a ferramenta segura para capturas de painéis internos, imagens de produtos não lançados ou qualquer coisa que você prefira não entregar ao servidor de um estranho.'
		],
		faqs: [
			{
				q: 'Quando devo embutir uma imagem como Base64 em vez de vincular um arquivo?',
				a: 'Quando a imagem é pequena (abaixo de ~10 KB), raramente muda e custaria uma requisição HTTP extra — ícones, logos em e-mails ou documentos HTML de arquivo único. Para qualquer coisa maior, o arquivo separado vence: é cacheado de forma independente, carrega em paralelo e não incha seu HTML ou CSS em 33%.'
			},
			{
				q: 'Por que a versão Base64 é cerca de um terço maior que meu arquivo?',
				a: 'Base64 representa cada 3 bytes binários como 4 caracteres ASCII, uma sobrecarga estrutural de +33% (mais até dois caracteres de preenchimento). Gzip ou Brotli no servidor recupera parte disso, mas a inflação é inerente à codificação — ela troca tamanho pela capacidade de embutir binário em texto.'
			},
			{
				q: 'Posso decodificar um data URL que encontrei em uma folha de estilos ou HTML?',
				a: 'Sim — mude para Base64 → imagem e cole tudo, prefixo data: incluído. Data URLs de SVG com percent-encoding (os sem ;base64) também decodificam, e quebras de linha ou espaços no payload são removidos automaticamente. O resultado aparece na página e baixa com a extensão correta.'
			},
			{
				q: 'Funciona com SVG, GIF e ICO, ou só com PNG e JPEG?',
				a: 'Tudo o que o detector reconhece converte para Base64: PNG, JPEG, WebP, GIF, SVG, BMP, ICO e AVIF. Para SVG em particular, considere que o código XML costuma ser menor e mais legível embutido diretamente — codificar SVG em Base64 faz sentido principalmente quando aspas ou escaping viram problema.'
			}
		]
	},

	'image-converter': {
		about: [
			'Converta uma imagem entre PNG, JPEG e WebP sem instalar nada nem enviar para lugar nenhum: solte o arquivo, escolha o destino, ajuste a qualidade com um controle deslizante ao vivo e veja o tamanho de saída atualizar em tempo real. O bloco Δ mostra exatamente quanto o arquivo convertido ficou menor (ou maior), então escolher a qualidade deixa de ser chute.',
			'Os três formatos têm funções distintas. PNG é sem perdas e com transparência completa — certo para capturas de tela, recursos de UI e tudo que tenha bordas nítidas ou texto. JPEG comprime fotografias agressivamente, mas não tem canal alfa e borra bordas duras. WebP costuma superar o JPEG em 25–35% com qualidade comparável, suporta transparência e funciona em todos os navegadores atuais — para a web, geralmente é a resposta.',
			'A conversão acontece em um canvas no seu navegador: a imagem é decodificada, redesenhada e recodificada pelos mesmos codecs que o navegador usa para exibir páginas. É isso que torna a ferramenta privada — e também o motivo de os bytes exatos variarem um pouco entre Chrome, Firefox e Safari, cada um com seu próprio codificador.'
		],
		faqs: [
			{
				q: 'Qual qualidade devo usar para JPEG e WebP?',
				a: 'Entre 75 e 90 cobre quase todo uso real. Em 85, a maioria das fotos fica visualmente indistinguível do original com uma fração do tamanho; abaixo de ~70, artefatos em bloco aparecem em degradês e tons de pele; acima de 90, o tamanho dispara por ganhos invisíveis. Arraste o controle olhando o bloco de tamanho — o ponto ideal costuma ser óbvio.'
			},
			{
				q: 'Por que meu PNG ficou maior ao converter para JPEG?',
				a: 'JPEG foi feito para degradês fotográficos, não para cor chapada. Capturas de tela, diagramas e artes de UI comprimem muito bem como PNG (longas sequências de pixels idênticos), mas forçam o JPEG a armazenar ruído em volta de cada borda nítida — arquivos maiores e ringing visível. Mantenha gráficos em PNG ou converta para WebP.'
			},
			{
				q: 'O que acontece com a transparência ao converter para JPEG?',
				a: 'JPEG não tem canal alfa, então áreas transparentes precisam ser preenchidas — esta ferramenta as achata sobre branco, a convenção para imagens web. Se a transparência precisa sobreviver, escolha PNG ou WebP como destino.'
			},
			{
				q: 'Por que meu navegador não exporta AVIF ou HEIC aqui?',
				a: 'A API toBlob do canvas só codifica formatos para os quais o navegador traz um codificador — PNG e JPEG em todo lugar, WebP no Chromium e Firefox. Codificação AVIF ainda é rara e HEIC é travado por patentes, então navegadores decodificam mas não produzem. Se você escolher um formato que o navegador não sabe gravar, a ferramenta avisa em vez de entregar um PNG em silêncio.'
			}
		]
	},

	'image-resizer': {
		about: [
			'Redimensione uma imagem para uma largura exata, uma altura exata ou uma porcentagem do original — a outra dimensão acompanha automaticamente, então nada é esticado. Escolha um formato de saída (ou mantenha o de origem), defina a qualidade para destinos com perdas, visualize o resultado e baixe. Os blocos antes/depois mostram dimensões e tamanho de arquivo num relance.',
			'O redimensionamento usa o modo de suavização de alta qualidade do navegador, que aplica reamostragem de verdade em vez de dizimação por vizinho mais próximo — fotos reduzidas continuam nítidas em vez de tremular com aliasing. Redimensionar também é o jeito honesto de encolher o arquivo: reduzir as duas dimensões pela metade remove três quartos dos pixels, algo que nenhum controle de qualidade iguala.',
			'Os arquivos nunca saem da página: decodificação, reamostragem e recodificação rodam em um canvas local. Não há barra de progresso de envio porque não há envio — uma foto de 40 megapixels redimensiona tão rápido quanto sua máquina consegue redesenhá-la, e funciona com o cabo de rede desconectado.'
		],
		faqs: [
			{
				q: 'Reduzir e ampliar de volta restaura minha imagem?',
				a: 'Não — reduzir descarta pixels permanentemente. Escalar uma foto de 3000px para 300px mantém 1% dos dados; ampliá-la de volta interpola os 99% que faltam como borrão. Guarde o arquivo original e exporte cópias redimensionadas a partir dele, em vez de redimensionar a única cópia que você tem.'
			},
			{
				q: 'Por que minha imagem ampliada parece borrada?',
				a: 'Ampliar não cria detalhes que nunca foram capturados — o navegador interpola entre os pixels existentes, o que se percebe como suavidade além de ~2×. Upscaling de verdade acima disso exige ferramentas de ML que alucinam detalhes plausíveis; um reamostrador de canvas deliberadamente não inventa nada.'
			},
			{
				q: 'Como chego a um tamanho alvo, tipo "menos de 200 KB"?',
				a: 'Use as duas alavancas: primeiro redimensione para as maiores dimensões de que realmente precisa (1200px de largura bastam para a maioria dos layouts web), depois escolha WebP ou JPEG e baixe a qualidade até o bloco de tamanho ficar abaixo da meta. A redução de dimensões faz a maior parte do trabalho — a qualidade ajusta o resto.'
			},
			{
				q: 'Redimensionar remove metadados EXIF como a localização GPS?',
				a: 'Sim. O pipeline de canvas recodifica pixels puros — modelo da câmera, timestamps, coordenadas GPS e todas as outras tags EXIF somem da saída. Para imagens que vão para a web pública, isso costuma ser um ganho de privacidade; se precisar preservar os metadados, guarde o original junto.'
			}
		]
	}
};

export default TOOL_CONTENT_PT;
