import type { Messages } from '$lib/i18n';

const pt: Messages = {
	code: 'pt',
	name: 'Português',
	ui: {
		search: 'Buscar',
		overview: 'Início',
		toggleTheme: 'Alternar tema',
		themeSystem: 'Seguir o sistema',
		themeDark: 'Escuro',
		themeLight: 'Claro',
		themeTitle: 'Tema: {mode} — clique para alternar',
		footerPrivacy: 'Roda no seu navegador — nada do que você cola é enviado',
		allTools: 'Todas as ferramentas',
		changelog: 'Novidades',
		releaseDate: 'Data da versão',
		language: 'Idioma',
		openNav: 'Abrir navegação',
		searchTools: 'Buscar ferramentas',
		homeTitle: 'onlinetools.dev — Ferramentas de desenvolvimento que rodam no seu navegador',
		homeMetaDescription:
			'Ferramentas de desenvolvimento rápidas e centradas no teclado que rodam inteiramente no seu navegador. Formate JSON, decodifique JWT e Base64, converta timestamps, teste regex — sem upload, sem cadastro, funciona offline.',
		homeEyebrow: '{n} ferramentas · local primeiro',
		homeHeading: 'Ferramentas de desenvolvimento que rodam no seu navegador',
		homeSub: 'Sem upload, sem cadastro, sem espera.',
		pasteToDetect: 'cole para detectar',
		worksOffline: 'funciona offline',
		shortcuts: 'atalhos',
		searchPlaceholder: 'Busque entre {n} ferramentas ou cole qualquer coisa…',
		startHere: 'Comece aqui',
		smartPaste: 'Colagem inteligente',
		smartPasteDesc:
			'Cole qualquer coisa, em qualquer lugar — o tipo de conteúdo é detectado e a ferramenta certa fica a uma tecla.',
		keyboardFirst: 'Teclado em primeiro lugar, do início ao fim',
		keyboardFirstDesc: 'Encontre, execute, copie e compartilhe sem tocar no mouse.',
		kbdAnyTool: 'qualquer ferramenta',
		kbdCopyResult: 'copiar resultado',
		kbdConfirm: 'confirmar',
		kbdAllShortcuts: 'todos os atalhos',
		toolsTitle: 'Todas as ferramentas de desenvolvimento — onlinetools.dev',
		toolsMetaDescription:
			'Veja todas as ferramentas do onlinetools.dev: JSON, YAML, Base64, JWT, timestamps, cron, regex, diff, UUID, hashes, códigos QR e mais — tudo rodando localmente no seu navegador.',
		toolsBlurb: '{n} ferramentas, todas calculadas no seu navegador. Sempre chegam mais — veja o',
		toolTitle: '{name} — Grátis e privado | onlinetools.dev',
		toolMetaSuffix: 'Roda inteiramente no seu navegador — sem upload, sem cadastro, funciona offline.',
		runsLocally: 'Roda localmente',
		runsLocallyTitle:
			'Esta ferramenta calcula tudo no seu navegador. O que você digita nunca é enviado.',
		aboutTool: 'Sobre esta ferramenta',
		faqHeading: 'Perguntas frequentes',
		relatedTools: 'Ferramentas relacionadas',
		breadcrumbTools: 'ferramentas',
		sample: 'Exemplo',
		line: 'linha',
		output: 'Resultado',
		copy: 'Copiar',
		copied: 'Copiado',
		download: 'Baixar',
		share: 'Compartilhar',
		linkCopied: 'Link copiado',
		continueWith: 'Continuar com',
		suggested: 'sugerido',
		shareTooLarge:
			'Conteúdo grande demais para uma URL — links de compartilhamento têm limite para continuarem portáteis. O conteúdo nunca sai desta máquina.',
		emptyHint: 'O resultado aparece aqui enquanto você digita',
		palettePlaceholder: 'Busque ferramentas ou cole conteúdo para processar…',
		noMatch: 'Nenhuma ferramenta corresponde',
		navigate: 'navegar',
		open: 'abrir',
		close: 'fechar',
		detected: 'Detectado',
		chars: 'caracteres',
		shortcutsTitle: 'Atalhos de teclado',
		scPalette: 'Abrir a paleta de comandos',
		scCopy: 'Copiar resultado',
		scEsc: 'Fechar painel / dispensar sugestão',
		scHelp: 'Esta referência de atalhos',
		scPaste: 'Colagem inteligente — detecta o conteúdo e sugere ferramentas',
		scNav: 'Navegar e confirmar nos painéis'
	},
	categories: {
		encoding: 'Codificação',
		json: 'JSON e dados',
		text: 'Texto',
		time: 'Data e hora',
		generators: 'Geradores',
		crypto: 'Hashes e cripto',
		web: 'Web'
	},
	tools: {
		'json-formatter': {
			name: 'Formatador e validador de JSON',
			description: 'Formate, valide e minifique JSON com erros localizados em linha:coluna'
		},
		'base64-decode': {
			name: 'Codificar / decodificar Base64',
			description: 'Converta texto para Base64 e vice-versa, com variante URL-safe'
		},
		'timestamp-converter': {
			name: 'Conversor de timestamp Unix',
			description: 'Converta timestamps Unix em datas legíveis e de volta, com tempo relativo'
		},
		'jwt-decoder': {
			name: 'Decodificador de JWT',
			description: 'Decodifique cabeçalho e payload do JWT e confira a expiração — totalmente offline'
		},
		'regex-tester': {
			name: 'Testador de regex',
			description: 'Teste expressões regulares com destaque ao vivo de matches e grupos'
		},
		'diff-checker': {
			name: 'Comparador de textos (diff)',
			description: 'Compare dois textos linha a linha e veja adições e remoções'
		},
		'url-encode-decode': {
			name: 'Codificar / decodificar URL',
			description: 'Codifique ou decodifique componentes de URL e query strings'
		},
		'url-parser': {
			name: 'Analisador de URL',
			description: 'Divida uma URL em protocolo, host, caminho e parâmetros'
		},
		'uuid-generator': {
			name: 'Gerador de UUID',
			description: 'Gere UUID v4/v7, ULID e Nano ID — um por vez ou em lote'
		},
		'hash-generator': {
			name: 'Gerador de hashes',
			description: 'MD5, SHA-1, SHA-256, SHA-512 e HMAC — calculados no seu navegador'
		},
		'color-converter': {
			name: 'Conversor de cores',
			description: 'Converta cores entre HEX, RGB, HSL e OKLCH com prévia ao vivo'
		},
		'case-converter': {
			name: 'Conversor de caixa',
			description: 'Alterne entre camelCase, snake_case, kebab-case, PascalCase e mais'
		},
		'word-counter': {
			name: 'Contador de palavras',
			description: 'Conte palavras, caracteres, frases, bytes e tempo de leitura em tempo real'
		},
		'lorem-ipsum-generator': {
			name: 'Gerador de Lorem Ipsum',
			description: 'Gere palavras, frases ou parágrafos de preenchimento para mockups'
		},
		'slug-generator': {
			name: 'Gerador de slugs',
			description: 'Transforme títulos em slugs de URL limpos, com separador e comprimento opcionais'
		},
		'sort-lines': {
			name: 'Ordenar e deduplicar linhas',
			description: 'Ordene linhas alfabética ou naturalmente, remova duplicatas e vazias'
		},
		'html-entities': {
			name: 'Codificar / decodificar entidades HTML',
			description: 'Escape texto para HTML ou converta entidades &amp; de volta em caracteres'
		},
		'unicode-inspector': {
			name: 'Inspetor de caracteres Unicode',
			description: 'Veja code points, bytes UTF-8/UTF-16 e escapes de cada caractere'
		},
		'cron-parser': {
			name: 'Analisador de expressões cron',
			description: 'Explique qualquer agendamento cron em linguagem simples com as próximas execuções'
		},
		'password-generator': {
			name: 'Gerador de senhas',
			description: 'Senhas aleatórias com opções de caracteres e um medidor de entropia honesto'
		},
		'qr-code-generator': {
			name: 'Gerador de códigos QR',
			description: 'Gere códigos QR nítidos em SVG ou PNG — sem marca d’água, sem upload'
		},
		'json-to-yaml': {
			name: 'Conversor JSON ↔ YAML ↔ TOML',
			description: 'Converta entre JSON, YAML e TOML com detecção automática de formato'
		},
		'json-to-csv': {
			name: 'Conversor JSON → CSV',
			description: 'Achate arrays de objetos JSON em CSV com o escape correto'
		},
		'json-to-typescript': {
			name: 'JSON → tipos TypeScript',
			description: 'Infira interfaces TypeScript de um exemplo JSON instantaneamente'
		},
		'jsonpath-tester': {
			name: 'Testador de JSONPath',
			description: 'Consulte JSON com expressões JSONPath e veja cada match com seu caminho'
		},
		'bcrypt-generator': {
			name: 'Hash e verificação bcrypt',
			description: 'Gere hashes bcrypt de senhas e verifique hashes contra texto puro'
		},
		'user-agent-parser': {
			name: 'Analisador de User-Agent',
			description: 'Identifique navegador, engine, SO e dispositivo a partir de uma string User-Agent'
		}
	}
};

export default pt;
