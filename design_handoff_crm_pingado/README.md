# Handoff: CRM Marketplace Pingado (vendedor · cliente · admin)

> Esta cópia do README vive dentro do repositório (`nova-pingado/design_handoff_crm_pingado/`) e foi
> atualizada para refletir **o que já está implementado no projeto**, não só o protótipo original. A
> especificação visual completa (tokens, telas, algoritmo) continua abaixo, sem alterações de conteúdo —
> só foi adicionada a seção **"Estado da implementação"** no topo.

---

## Estado da implementação

**Escopo entregue:** front-end completo do CRM (autenticação multi-papel, painel do vendedor, painel
admin, vitrine/PDP do cliente redesenhados) com **dados e login mockados**. Por decisão explícita do
usuário, **não há backend real** (sem banco de dados, sem rotas de API) — tudo roda no cliente, com
persistência em `localStorage` simulando o backend, seguindo o mesmo padrão que o projeto já usava em
`context/auth-context.tsx` antes deste trabalho.

### Mapa: tela do handoff → código

| Tela / peça do handoff | Implementação |
| --- | --- |
| Autenticação (login/cadastro/magic link/quiz/loja) | [`app/login/page.tsx`](../app/login/page.tsx) |
| Sessão, papéis, cadastro cliente/vendedor | [`context/auth-context.tsx`](../context/auth-context.tsx) |
| Painel do vendedor (7 telas) | [`app/vendedor/`](../app/vendedor) (`layout.tsx` + `page.tsx`, `produtos/`, `cadastrar/`, `vendas/`, `selecoes/`, `avaliacoes/`, `reservas/`) |
| Painel admin (4 telas) | [`app/admin/`](../app/admin) (`layout.tsx` + `page.tsx`, `regras/`, `vendedores/`, `clientes/`) |
| Vitrine do cliente | [`app/loja/page.tsx`](../app/loja/page.tsx) |
| Detalhe do produto (PDP) | [`app/loja/[slug]/page.tsx`](../app/loja/[slug]/page.tsx) + [`components/pingado/product-detail.tsx`](../components/pingado/product-detail.tsx) |
| Motor de seleção (`matchPct`, `scoreCaixa`, `bloqueios`, `sugestao`) | [`lib/pingado/selection.ts`](../lib/pingado/selection.ts) |
| Perfis de referência, eixos sensoriais, vocabulário de chips | [`lib/pingado/profiles.ts`](../lib/pingado/profiles.ts) |
| Dados mock do CRM (clientes, pedidos, avaliações, reservas, regras) | [`lib/pingado/crm-data.ts`](../lib/pingado/crm-data.ts) |
| Estado do vendedor (produtos extras, reservas) | [`lib/pingado/vendedor-store.ts`](../lib/pingado/vendedor-store.ts) |
| Estado do admin (overrides, regras, log) | [`lib/pingado/admin-store.ts`](../lib/pingado/admin-store.ts) |
| Guard de rota por papel | [`lib/pingado/use-require-role.ts`](../lib/pingado/use-require-role.ts) |
| Tokens de cor/tipografia | `--pg-*` em [`app/globals.css`](../app/globals.css); fontes Cormorant Garamond/DM Sans em [`app/layout.tsx`](../app/layout.tsx) |
| Componentes visuais compartilhados | [`components/pingado/ui.tsx`](../components/pingado/ui.tsx), `sidebar.tsx`, `cliente-header.tsx` |

### Decisões de dados (onde o design divergia do codebase)

- **Catálogo reaproveitado, não duplicado.** Em vez de recriar o catálogo fictício do protótipo
  (`p1`–`p9`), o CRM usa o catálogo que já existia em `lib/coffees.ts` (20 cafés, 5 produtores, já com
  perfil sensorial 1–5, fotos reais, preparos recomendados). Os 5 produtores (`MOCK_PRODUTORES`) fazem o
  papel de "vendedores"; dados extras de vendedor (CNPJ, capacidade de torra, canais, nota, status de
  rotatividade) ficam em `VENDEDOR_INFO` (`lib/pingado/crm-data.ts`), sem alterar `lib/types.ts`.
- **Certificações, métodos de preparo e nº de seleções por café** são lookups explícitos em
  `crm-data.ts` (`CAFE_CERTIFICACOES`, `CAFE_METODOS`, `CAFE_SELECOES`) para os 8 cafés com produtor
  vinculado (`cafe-1`…`cafe-8`); produtos cadastrados por um vendedor novo caem no fallback do que ele
  preencheu no formulário (`cafe.moagem_opcoes`).
- **Planos de assinatura**: o projeto já usava `basico`/`premium`/`plus` internamente com os rótulos
  exibidos "Descoberta"/"Sommelier"/"Colecionador" — exatamente os nomes do handoff — então não foi
  preciso renomear nada, só mapear (`PLANO_LABEL_TO_KEY` em `auth-context.tsx`).
- **Papel do usuário** continua derivado do e-mail só como fallback de demonstração
  (`lib/pingado/auth-helpers.ts#papelDoEmail`), como o próprio protótipo definia — nunca deveria ir para
  produção assim.
- **Cliente/carrinho/checkout/perfil/onboarding não foram redesenhados.** Só herdam as novas fontes via
  classes semânticas (`font-sans`/`font-serif`); a paleta `--pg-*` foi adicionada ao lado da paleta
  existente (`--background`, `--primary` etc.) sem substituí-la, para não quebrar essas telas.

### Contas de demonstração

| Papel | E-mail | Observação |
| --- | --- | --- |
| Vendedor | `contato@sitiobomjesus.com.br` | Vinculado a "Sítio Bom Jesus" (2 cafés, dados ricos: pedidos, avaliações, reservas) |
| Cliente | `marina.prado@email.com` | Perfil sensorial "Doce & Frutado", plano Sommelier |
| Admin | `curadoria@pingado.com.br` | Acesso aos 4 paineis internos |

Qualquer senha com 4+ caracteres funciona nessas 3 contas (login mockado). Contas novas criadas pelo
fluxo "Criar conta" têm senha validada de verdade contra o que foi cadastrado. É possível criar quantas
contas de cliente/vendedor quiser pela tela de login — um vendedor novo começa com painel vazio e pode
cadastrar seu primeiro café pelo formulário (fica salvo e aparece em todas as telas, inclusive na
vitrine e na montagem de caixas do admin).

### Chaves de `localStorage` (persistência mockada)

| Chave | Conteúdo |
| --- | --- |
| `pingado_users_db` | "Tabela" de usuários (e-mail, senha, papel, dados de vendedor) |
| `pingado_active_session` | Sessão ativa (`id`, `email`, `nome`, `role`) |
| `pingado_perfis` | Perfil geral por usuário |
| `pingado_perfis_sensoriais` | Perfil sensorial (quiz) por usuário |
| `pingado_assinaturas` | Assinatura ativa por usuário |
| `pingado_produtos_extra_<produtorId>` | Cafés cadastrados pelo próprio vendedor no protótipo |
| `pingado_reservas_status` | Status (aceito/recusado) das reservas de curadoria por vendedor |
| `pingado_admin_overrides` | Overrides manuais do admin na montagem das caixas |
| `pingado_admin_regras` / `_teto` / `_intervalo` | Estado das regras do motor de seleção |
| `pingado_admin_log` | Log de decisões da curadoria |
| `pingado_cart` / `pingado_frete` / `pingado_cupom` | Carrinho (já existia antes deste trabalho) |

### Como rodar

```bash
pnpm install
pnpm dev
```

Abre em `http://localhost:3000`. Login em `/login`.

### O que ficou fora do escopo

- **Backend real** (banco de dados, rotas de API, ORM) — decisão explícita: só front-end com dados
  mockados nesta fase.
- **Responsivo mobile** — o protótipo é desktop-first (ver seção "Interações e comportamento" abaixo);
  as telas novas não têm breakpoints para telas pequenas ainda.
- **Testes automatizados** do motor de seleção (`matchPct`/`scoreCaixa`/`bloqueios`/`sugestao`).
- **Envio de e-mail real** — o magic link é só uma simulação visual da caixa de entrada.
- Header da vitrine/PDP (novo) e o header do carrinho/checkout/perfil (antigo, não tocado) ainda são
  visualmente diferentes.

---

## Sobre os arquivos de design

Os arquivos em `design/` (não copiados para esta cópia dentro do projeto — seguem apenas na pasta
original `~/Documents/design_handoff_crm_pingado/design/`) são **referências de design feitas em HTML**
— protótipos que mostram aparência e comportamento pretendidos, **não código de produção**. As telas
foram recriadas em React/Next.js seguindo os padrões já estabelecidos no repositório (ver mapa acima).

- `design/CRM Pingado.dc.html` — arquivo principal: login/cadastro + os três painéis.
- `design/Painel do Vendedor.dc.html` — versão anterior, só o painel do vendedor (referência secundária).
- `design/support.js` — runtime do protótipo. Não foi portado.

## Fidelidade

**Alta fidelidade (hifi).** Cores, tipografia, espaçamentos, estados e textos são finais. A UI foi
recriada fielmente, mapeando os valores abaixo para tokens `--pg-*` dedicados (ver `app/globals.css`).

---

## Design tokens

### Cores
| Uso | Hex |
| --- | --- |
| Fundo da aplicação | `#F3EDE3` |
| Superfície / card | `#FAF6EF` |
| Campo de formulário | `#FFFDF8` |
| Superfície alternativa (rodapé de card, faixa) | `#F4EEE3` |
| Verde escuro (sidebar, blocos de destaque, botão secundário) | `#1C2E23` |
| Verde escuro admin (sidebar interna) | `#141F19` |
| Verde de apoio (campo sobre verde, item ativo) | `#22382B` / `#2C4235` / `#26362C` / `#2E4436` |
| Terracota (ação primária, acento) | `#C0562B` |
| Terracota hover | `#9C4520` |
| Terracota texto sobre creme | `#A2542C` |
| Creme claro (texto sobre verde) | `#EDE6D9` / `#F6F1E6` |
| Verde claro (texto secundário sobre verde) | `#8FA394` / `#A9BBAA` / `#B4C4B5` / `#7A8E7C` / `#71856F` |
| Bege (texto terciário sobre verde) | `#C8A98C` |
| Texto principal | `#23231F` |
| Texto sobre creme, títulos | `#1C2E23` |
| Texto secundário | `#7C7466` |
| Texto terciário / labels | `#9C8F7D` / `#8A8175` |
| Texto de apoio esverdeado | `#5E6A5C` / `#3C4A3E` / `#4A4A42` |
| Placeholder de imagem | `#E7DFD1` (fundo) / `#A79A88` (texto) |
| Trilha de barra de progresso | `#E7DFD1` (creme) / `#E3D2C3` (sobre terracota claro) / `rgba(237,230,217,.16)` (sobre verde) |
| Sucesso (badge) | fundo `#E4EDE3`, texto `#3F6146`, gráfico `#4E7A55` |
| Atenção (badge) | fundo `#F1E5D9`, texto `#8C5227` |
| Erro (badge/alerta) | fundo `#F6E1DD` ou `#F8EDEB`, borda `rgba(155,58,44,.24)`, texto `#9B3A2C`, gráfico `#B03A2E` |
| Destaque terracota claro (cards de curadoria) | fundo `#F2E4D8` / `#F7EAE1`, borda `rgba(192,86,43,.28)`, texto `#7C6555` / `#5E4A3C` |
| Bordas | `rgba(28,46,35,.10)` (card), `.18`–`.24` (input/botão), `rgba(237,230,217,.14–.22)` (sobre verde) |
| Cores dos perfis (gráficos) | Tradicional Intenso `#1C2E23`, Doce & Frutado `#C0562B`, Clássico Equilibrado `#7C6555`, Ácido & Floral `#4E7A55` |

Links: `#C0562B`, hover `#9C4520`. Seleção de texto: fundo `#C0562B`, texto branco.

### Tipografia
- **Títulos / números destacados:** `Cormorant Garamond` (400/500/600), weight 500, `line-height: 1.05–1.25`.
  Escala: 40px (headline de login antigo), 38px (título de página da vitrine / detalhe), 36px (saudação), 34px (títulos de tela), 29px (headline do card de login), 30px (números de KPI), 26px, 24px, 23px, 21px, 20px.
- **Interface:** `DM Sans` (400/500/700).
  Escala: 15px (nome em card), 14px/13.5px (corpo, inputs, botões), 13px (item de menu, célula de tabela), 12.5px, 12px, 11.5px (legenda), 10.5px, 10px e 9.5px (labels).
- **Labels/eyebrows:** 9.5–10px, `text-transform: uppercase`, `letter-spacing: .12em–.20em`.
- Wordmark: `Cormorant Garamond` 19–26px, `letter-spacing: .34em–.42em`.
- Parágrafos usam `text-wrap: pretty` e largura máxima em `ch` (52–70ch).
- Monospace (códigos de pedido/envio): `ui-monospace, Menlo, monospace`, 11px, cor `#7C7466`.

### Espaçamento, raio, sombra
- Grid de conteúdo: `padding: 28px 38px 60px` (main), `26px 28px 28px` (card de login), `16–22px` (cards internos).
- Gaps: 6, 8, 10, 12, 14, 16, 20, 22, 24px.
- Sidebar: 238px de largura, `position: sticky`, altura 100vh.
- Card de login: 440px de largura.
- Raio: 2px (inputs, botões, badges, chips), 3px (cards), 4px (card de login), 50% (avatar/pips).
- **Sem sombras** — separação é feita por borda de 1px e mudança de fundo.
- Alturas: barra de progresso 4–5px; pip 6–9px; botão de escala sensorial 28–30px; thumb de foto 78×96px; capa na vitrine 200px; foto no detalhe 420px.

---

## Telas

### 0. Autenticação (`isLogin`)
Fundo `#1C2E23` em coluna centralizada. Wordmark **PINGADO** + linha "Plataforma de assinatura de cafés especiais". Card creme 440px com: barra de cabeçalho (seta `‹` de voltar quando aplicável + título do passo), abas **Entrar / Criar conta** (aba ativa: fundo `#FAF6EF`, borda inferior 2px `#C0562B`; inativa: texto `#7C7466`), corpo do passo.

Passos (máquina de estados `passo`):
1. **`email` (aba Entrar)** — inputs E-mail e Senha, botão primário **Entrar**; abaixo, "Entrar sem senha · link mágico" (link terracota) e "Esqueci minha senha".
2. **`metodo`** — dois cards clicáveis: *Receber link mágico por e-mail* (borda `#C0562B`, fundo `#F7EAE1`, badge "recomendado") e *Entrar com minha senha*. Rodapé: conta identificada + papel detectado.
3. **`senha`** — input de senha, botão Entrar, atalhos para link mágico e "esqueci minha senha".
4. **`enviado`** — bloco "Simulação da caixa de entrada" com o e-mail do link mágico e botão **Entrar no Pingado** (verde escuro); ações "Reenviar link" e "Usar senha em vez disso".
5. **`cadastro` (aba Criar conta)** — tipo de conta (dois cards: *Sou cliente* / *Sou vendedor*), nome (label muda para "Nome da torrefação" quando vendedor), e-mail, checkbox estilizado **Criar conta sem senha** (esconde o campo de senha) e senha (mín. 6). Botão: "Continuar · meu perfil sensorial" ou "Continuar · dados da torrefação".
6. **`quiz` (cliente)** — 5 linhas sensoriais com botões 1–5, chips de restrição, chips de plano (Descoberta/Sommelier/Colecionador), botão "Ver meu perfil sensorial".
7. **`loja` (vendedor)** — região produtora, CNPJ, capacidade mensal de torra, chips de canal (Vitrine/Assinatura), botão "Criar meu painel de vendedor".
8. **`pronto`** — card terracota claro com o perfil calculado (cliente, com os pips) ou o nome da torrefação (vendedor) e botão "Entrar na vitrine" / "Abrir meu painel". Sem seta de voltar.

**Regras de validação**
- E-mail precisa conter `@`; senha de login ≥ 4 caracteres; senha de cadastro ≥ 6.
- CNPJ: ≥ 14 dígitos numéricos após remover a máscara.
- Nome e região obrigatórios; ao menos um canal de venda.
- Erros aparecem em bloco vermelho claro acima do botão primário; qualquer digitação limpa o erro.
- Navegação de volta: `metodo→email`, `senha|enviado→metodo`, `cadastro→email`, `quiz|loja→cadastro`; oculta em `pronto`.
- Papel derivado do e-mail: domínio com `pingado.com` → admin; contém `serraalta|fazenda|cafe|sitio` → vendedor; caso contrário cliente. (Em produção, o papel vem do backend — mantenha só como fallback de demo.)

### 1. Painel do vendedor
Sidebar `#1C2E23` (wordmark + "Painel do vendedor", grupo "Operação", 7 itens com badge numérico, rodapé com avatar/nome/"Vendedor verificado" e botão Sair). Item ativo: fundo `#2C4235`, texto `#F6F1E6`.

**1.1 Visão geral** — eyebrow com o mês, saudação ("Bom dia, {nome sem prefixo}"), parágrafo com nº de reservas pendentes, botão "Cadastrar novo café". 4 KPIs (Receita do mês, Pedidos, Nota média, **Match médio do catálogo** — este último em card verde escuro). Abaixo, grid 1.55fr/1fr: tabela "Pedidos recentes" (colunas 86px/1.5fr/1fr/96px) e coluna com "Compatibilidade com os perfis de assinante" (barras por perfil) + card de curadoria terracota.

**1.2 Meus produtos** — tabela `2.1fr .8fr .7fr .6fr 1.4fr .8fr .9fr`: café (thumb 38×46 + nome + origem/altitude), torra, preço, estoque (vermelho `#B03A2E` se < 20), notas (chips), nº de seleções, match (número + barra 44px, verde ≥80, terracota ≥65, bege abaixo). Rodapé: card "Sugestão da IA".

**1.3 Cadastrar café** — duas colunas (`1fr 336px`). Blocos:
- *1 · Produto*: nome, categoria (Grãos/Moídos/Drip Coffee/Cápsulas), preço 250g, estoque, lote (kg), chips de tamanho (250g/500g/1kg), 3 slots de foto (dashed, o primeiro com "ARRASTE A FOTO"; a primeira foto é a capa).
- *2 · Origem, beneficiamento e certificações*: produtor/sítio, região, altitude, variedade, beneficiamento (Natural/Honey/Lavado/Cereja descascado/Fermentação induzida), torra (Clara→Escura), pontuação SCA, chips de certificação (Orgânico, Rainforest Alliance, Fair Trade, Denominação de Origem, Mulheres do Café, Carbono Neutro).
- *3 · Perfil sensorial* (bloco verde escuro): 5 linhas — Acidez, Doçura, Corpo, Amargor, Intensidade — cada uma com rótulo à esquerda/direita ("Muito baixa"→"Muito alta" etc.) e botões 1–5 (ativo terracota); chips de notas de sabor (máx. 4) e de métodos de preparo; textarea "Notas do produtor".
- Ações: "Publicar na vitrine e enviar para curadoria" (terracota), "Salvar rascunho" (outline), mensagem de confirmação.
- Coluna direita (sticky): **prévia na vitrine** (capa placeholder, categoria, nome, preço, chips de notas, pips sensoriais) e card **Match potencial** — % do melhor perfil, barras por perfil recalculadas ao vivo e dica da IA listando os campos faltantes.

**1.4 Vendas e receita** — abas Todas/Loja/Assinatura; tabela `90px 78px 1.3fr 1.6fr .9fr .8fr 116px` com badge de status (Entregue verde, Devolvido vermelho, demais âmbar); 3 cards: repasse previsto, café mais vendido, receita por canal.

**1.5 Seleções para caixas** — 3 KPIs (total de seleções em card verde, % de escolhas pela IA, fatia de rotatividade vs. teto) e tabela por ciclo com badge IA / Override equipe.

**1.6 Avaliações** — cabeçalho com nota média em Cormorant + estrelas; lista de cards com estrelas, cliente, data, origem (caixa/loja), texto, café + método e, à direita, perfil do cliente e match do envio.

**1.7 Reservas (curadoria)** — cards em grid `1.5fr 1fr 232px`: badge (Reserva pendente / Confirmado / Recusado), plano + fonte (IA ou override), café, quantidade e prazo de torra, motivo; coluna do meio com perfil, barra de compatibilidade e valor do lote; à direita "Confirmar reserva" / "Não consigo atender" + expiração, ou o bloco de estado resolvido. Card pendente tem borda `rgba(192,86,43,.35)`.

### 2. Vitrine e detalhe (cliente)
Faixa superior verde ("Frete grátis acima de R$ 149 no Sul e Sudeste"), header creme em 3 colunas com wordmark centralizado e nav (Assinatura, Como funciona | Nossos produtores, Loja) + Sair.

**2.1 Vitrine** — título, subtítulo citando o perfil sensorial do cliente aplicado à ordenação; layout `230px 1fr`: painel de filtros sticky (chips de **perfil sensorial**, lista de **origem**, chips de **torra**, "Limpar filtros") e grid de 3 colunas de cards (capa 200px com badge "{n}% match" no canto, produtor, nome, região/altitude/torra, chips de notas, preço + nota/nº de avaliações). Ordenação decrescente por match com o perfil do cliente.

**2.2 Detalhe do café** — breadcrumb; duas colunas: à esquerda foto 420px + bloco **Perfil sensorial** (chips de notas, 5 linhas com pips 9px e rótulo textual — "muito baixa/baixa/média/alta/muito alta" — e grade de especificações: produtor, região, altitude, variedade, beneficiamento, torra, SCA, estoque); à direita categoria, nome, descrição, estrelas + nota + badge "{n}% com o seu perfil", preço (Cormorant 34px terracota) e parcelamento em 3x, chips de tamanho, chips de "como você quer receber", botões "Adicionar ao carrinho" (verde escuro) e "Comprar agora" (outline), card do produtor com certificações.

### 3. Painel interno (admin)
Sidebar `#141F19`, 4 itens.

**3.1 Montagem das caixas** — cabeçalho com ciclo/prazo + botões "Rodar IA novamente" (outline) e "Aprovar ciclo" (terracota). 4 KPIs: caixas do ciclo, score médio de match, overrides manuais, conflitos de restrição (card fica vermelho claro quando > 0). Layout `1fr 300px`:
- Lista de caixas, cada card em grid `1.1fr 1.5fr 1fr`: (a) código, badge *Sugestão da IA* / *Override manual*, cliente, plano/nº do ciclo, perfil e chips de restrição; (b) café escolhido, vendedor, torra, barra + % de match, justificativa (texto diferente para IA e override, citando a sugestão original); (c) select de override com todas as opções `Nome · Vendedor (score%)`, alerta vermelho quando o café conflita com uma restrição do cliente, botão "Voltar à sugestão da IA".
- Coluna direita: card verde **Rotatividade entre vendedores** (barras por vendedor, % acima do teto em `#E0806A`, nota sobre redistribuição) e card terracota **Registro de decisões** (log com as últimas 6 ações).

**3.2 Regras de seleção** — lista de regras com switch (52×26, trilha terracota quando ativa; a regra "Respeitar restrições do cliente" é obrigatória e não alterna), slider de **teto de participação por vendedor** (10–60, passo 5, valor em Cormorant), chips de **intervalo mínimo de repetição** (1/2/3/6 ciclos) e card verde com **peso dos critérios no score** (Compatibilidade sensorial 45%, Variedade 20%, Rotatividade 15%, Estoque/prazo 12%, Avaliação 8%).

**3.3 Vendedores** — tabela: vendedor, região, nº de cafés, nota, seleções, rotatividade (número + barra; vermelho acima do teto) e status (Ativo / Teto atingido / Em avaliação).

**3.4 Clientes e perfis** — grid de 2 colunas: nome, plano, "assinante desde", badge do perfil, 5 linhas de pips sensoriais, chips de restrições + preferências, último envio.

---

## Interações e comportamento
- Navegação por estado (sem rotas no protótipo). **No projeto: rotas reais** — `/login`, `/vendedor/*`,
  `/loja`, `/loja/[slug]`, `/admin/*`, com guard por papel (`lib/pingado/use-require-role.ts`).
- Sidebar sticky; colunas de prévia/resumo sticky (`top: 28px`).
- Hover: linhas de tabela → `#F6F0E6`; cards da vitrine → borda `rgba(192,86,43,.5)`; botão primário → `#9C4520`; contas de demonstração → borda terracota.
- Focus de input: `border-color: #C0562B; outline: none`.
- Chips/toggles alternam entre outline e preenchimento terracota; notas de sabor têm limite de 4 (clique além do limite não faz nada).
- Cadastro de café: match potencial, dica da IA e prévia recalculam a cada alteração de escala/nota.
- Admin: trocar o select grava override + registra no log; "Voltar à sugestão da IA" remove o override; "Rodar IA novamente" limpa todos os overrides; mudar o teto reavalia as cores de rotatividade.
- Reservas do vendedor: aceitar/recusar altera badge, borda e bloco de estado; o contador do menu cai.
- Sem animações além de transições de cor no hover (120–160ms, `transition-colors` do Tailwind).
- **Responsivo: ainda não implementado** nas telas novas — protótipo é desktop-first (largura mínima
  confortável ~1280px); colapsar os grids e virar a sidebar em barra superior fica para uma próxima etapa.

## Estado
Ver `context/auth-context.tsx` (sessão/papel/perfil/assinatura), `lib/pingado/vendedor-store.ts`
(catálogo + reservas do vendedor) e `lib/pingado/admin-store.ts` (regras + overrides do admin) para como
cada pedaço de estado do protótipo original foi mapeado para hooks React + `localStorage`.

## Entidades (modelo mockado)

O projeto **não introduziu um schema de banco** — as entidades abaixo existem como tipos TypeScript
(`lib/types.ts` + `lib/pingado/types.ts`) e dados mockados (`lib/coffees.ts` + `lib/pingado/crm-data.ts`),
não como tabelas reais:

```
User            id, nome, email, role('cliente'|'vendedor'|'admin'), sellerInfo?          — DbUser em auth-context.tsx
Produtor        (existente) id, nome, regiao, estado, descricao                            — lib/types.ts
VendedorInfo    produtorId, cnpj, capacidadeTorraKg, canais[], nota, status, verificado,
                participacaoPct, selecoesTotal                                             — lib/pingado/types.ts
Cafe            (existente, rico) id, produtor_id, nome, sens (acidez..intensidade),
                notas_sensoriais[], preco, estoque, variantes[], moagem_opcoes[] etc.       — lib/types.ts
SensoryProfile  acidez, docura, corpo, amargor, intensidade (1–5)                          — SensoryValues
ClienteAssinante id, nome, email, plano, perfilNome, sens, restricoes[], tags[], ciclos     — lib/pingado/types.ts
PedidoVendedor  id, data, cliente, itens, canal, valor, status, produtorId                 — idem
AvaliacaoProduto id, cafeId, cliente, estrelas, metodo, perfilCliente, match, texto         — idem
HistoricoSelecao id, ciclo, cafeId, perfilNome, plano, pacotes, decisao, produtorId         — idem
ReservaCuradoria id, cafeId, produtorId, plano, fonte, qtd, torraAte, valor, match, status  — idem
RegraSelecao    id, titulo, desc, on, travada?                                             — idem
PesoCriterio    nome, peso                                                                 — idem
```

Se um backend real entrar em cena depois, esses tipos já servem de contrato inicial para o schema.

## Algoritmo de match (implementado em `lib/pingado/selection.ts`)
```
matchPct(sensorialProduto, alvoPerfilCliente):
    d = Σ |produto[k] - alvo[k]|  para k em {acidez, docura, corpo, amargor, intensidade}
    return round(100 - (d / 20) * 100)          # 20 = distância máxima (5 eixos × 4)

scoreCaixa(cliente, produto):
    base      = matchPct(produto.sens, perfil(cliente).alvo)
    completo  = +4 se (≥2 notas de sabor E ≥1 método E sca > 0) senão -6
    rotatividade = -5 se o vendedor já passou do teto no ciclo (status 'Teto atingido')
    return clamp(base + completo + rotatividade, 20, 99)

bloqueios(cliente, produto):   # regra rígida, a menos que a regra g1 esteja desligada no admin
    'Sem torra escura'  → produto.torra == 'Escura'
    'Sem fermentados'   → produto.processo contém 'ferment'
    'Somente moído'     → produto.formato != 'moido'

sugestao(cliente, catalogo) = maior scoreCaixa entre produtos sem bloqueio e com estoque > 20
                               (com fallback pro catálogo inteiro se nada passar no filtro)
```
Perfis de referência (alvo por eixo, `lib/pingado/profiles.ts`): **O Tradicional Intenso**
`acidez 2, doçura 3, corpo 5, amargor 4, intensidade 5`; **Doce & Frutado** `4,5,3,1,3`; **Clássico
Equilibrado** `3,3,3,3,3`; **Ácido & Floral** `5,4,2,1,2`. O perfil do cliente no onboarding é o alvo
mais próximo das respostas do quiz.

Os pesos da tela de regras (`PESOS_CRITERIOS`) e o teto/intervalo (`useAdminRegras`) ainda **não
alimentam** `scoreCaixa` numericamente — a UI é funcional (slider, chips, switches persistem), mas o
motor de seleção usa os pesos implícitos do pseudocódigo acima. Conectar os pesos configuráveis ao
score é um próximo passo natural caso vire prioridade.

## Assets
Sem assets binários novos. Placeholders (`#E7DFD1` com texto "FOTO"/"FOTO DO PRODUTO"/"PRÉVIA NA
VITRINE") aparecem apenas quando um café não tem `imagem_url` (ex.: produtos cadastrados por um vendedor
novo no protótipo) — os 20 cafés do catálogo original já têm fotos reais em `public/images/`. Fontes via
Google Fonts (`next/font/google`): `Cormorant Garamond` (400/500/600) e `DM Sans` (400/500/700). Sem
biblioteca de ícones nas telas do CRM: estrelas `★ ☆`, chevron `‹` e pips/barras em CSS puro.

## Textos
Interface em português do Brasil, moeda `R$ 0,00` (`lib/pingado/format.ts#brl`, via
`toLocaleString('pt-BR', ...)`) e datas `dd/mm`.

## Arquivos originais do protótipo (fora do projeto)
- `~/Documents/design_handoff_crm_pingado/design/CRM Pingado.dc.html` — protótipo completo (auth +
  vendedor + cliente + admin), textos e algoritmo de match originais.
- `~/Documents/design_handoff_crm_pingado/design/Painel do Vendedor.dc.html` — iteração anterior.
- `~/Documents/design_handoff_crm_pingado/design/support.js` — runtime do protótipo, não portado.
- `~/Documents/design_handoff_crm_pingado/PROMPT.md` — prompt original de implementação.
