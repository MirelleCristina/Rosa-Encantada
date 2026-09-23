# 🌹 Rosa Encantada — Biblioteca Pessoal

> *"Toda história merece um lugar especial."*

Site de cadastro e gerenciamento de livros com estética de **biblioteca antiga e encantada** (tons terrosos, dourado envelhecido, bordô e uma rosa vermelha como símbolo). Construído com **HTML5, CSS3 e JavaScript puro**, conectado diretamente ao banco de dados **Supabase** já existente.

---

## 1. Objetivo do projeto

Permitir que o usuário mantenha uma biblioteca digital pessoal, podendo:

- ✅ **Cadastrar** livros (Create)
- ✅ **Visualizar** livros em cards (Read)
- ✅ **Pesquisar** por título ou autor e **filtrar** por gênero e status
- ✅ **Editar** livros por meio de um modal (Update)
- ✅ **Excluir** livros com confirmação (Delete)
- ✅ Acompanhar **estatísticas** (total, lidos, lendo, não lidos) calculadas em tempo real

---

## 2. Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura semântica da página |
| CSS3 | Identidade visual, animações discretas e responsividade |
| JavaScript (Vanilla) | CRUD, validações, pesquisa, filtros, modais |
| Supabase (supabase-js v2 via CDN) | Banco de dados PostgreSQL acessado pelo navegador |
| Google Fonts | *Cormorant Garamond* (títulos) e *Nunito Sans* (textos) |

Não há frameworks (React, Vue, Angular), Node.js, bundlers ou `localStorage`. Todos os dados vivem no Supabase.

---

## 3. Estrutura dos arquivos

```
/
├── index.html      → Estrutura da página, formulário, modais e importação do SDK
├── style.css       → Todo o estilo visual e a responsividade
├── script.js       → Conexão com o Supabase, CRUD, pesquisa, filtros, estatísticas e validações
├── README.md       → Esta documentação
└── docs/
    └── comando_criacao_de_site.md  → Requisitos originais do projeto
```

---

## 4. Como o projeto se conecta ao Supabase

O SDK é importado no `index.html` via CDN (antes do `script.js`):

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="script.js"></script>
```

No `script.js` o cliente é criado assim:

```js
const SUPABASE_URL      = 'https://knufrnocbjigarqewudp.supabase.co';
const SUPABASE_ANON_KEY = 'ANON_KEY_FORNECIDA_PELO_ALUNO'; // ← substitua pela sua Anon Key

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

Todas as operações usam a tabela existente:

```js
supabaseClient.from('livros')
```

| Operação | Código utilizado |
|---|---|
| READ | `.from('livros').select('*').order('created_at', { ascending: false })` |
| CREATE | `.from('livros').insert([dados])` |
| UPDATE | `.from('livros').update(dadosAtualizados).eq('id', id)` |
| DELETE | `.from('livros').delete().eq('id', id)` |

---

## 5. O que é o Project Reference ID

**Project Reference ID:** `knufrnocbjigarqewudp`

É o identificador único do projeto dentro do Supabase. Ele aparece na URL do painel (`https://supabase.com/dashboard/project/knufrnocbjigarqewudp`) e é usado para **compor** a Supabase URL.

⚠️ Ele **não** deve ser usado sozinho no `createClient()`. Não é uma URL nem uma chave.

---

## 6. Supabase URL utilizada

```
https://knufrnocbjigarqewudp.supabase.co
```

É o endereço da API REST do projeto. É formada por `https://` + Project Reference ID + `.supabase.co`.

---

## 7. Onde está configurada a Anon Key

No arquivo **`script.js`**, logo no início, na constante `SUPABASE_ANON_KEY`.

**Como obter a chave:**
1. Acesse o painel do Supabase → projeto **Rosa Encantada**.
2. Vá em **Project Settings → API** (ícone de engrenagem).
3. Em **Project API keys**, copie a chave **`anon` / `public`**.
4. Cole no lugar de `ANON_KEY_FORNECIDA_PELO_ALUNO` no `script.js`.

> Enquanto o placeholder não for substituído, o site exibe um aviso amigável na área da biblioteca indicando que a chave precisa ser configurada.

Resumo das três informações (não confunda!):

| Informação | Valor | Onde é usada |
|---|---|---|
| Project Reference ID | `knufrnocbjigarqewudp` | Apenas identificação (não vai no código de conexão) |
| Supabase URL | `https://knufrnocbjigarqewudp.supabase.co` | 1º parâmetro do `createClient()` |
| Anon Key | `eyJ...` ou `sb_publishable_...` (fornecida pelo aluno) | 2º parâmetro do `createClient()` |

---

## 8. Estrutura da tabela `livros`

A tabela **já existe** no Supabase e **não deve ser recriada**.

| Coluna | Tipo sugerido | Descrição |
|---|---|---|
| `id` | `uuid` ou `bigint` (PK) | Identificador único (gerado automaticamente) |
| `titulo` | `text` | Título do livro *(obrigatório no site)* |
| `autor` | `text` | Autor *(obrigatório no site)* |
| `genero` | `text` | Gênero literário *(obrigatório no site)* |
| `ano_publicacao` | `integer` | Ano de publicação |
| `status_leitura` | `text` | `Não lido`, `Lendo` ou `Lido` |
| `nota` | `integer` / `numeric` | Avaliação de 0 a 5 |
| `descricao` | `text` | Breve descrição |
| `capa_url` | `text` | URL opcional da capa |
| `created_at` | `timestamptz` | Data de cadastro (padrão `now()`) |

O `script.js` utiliza **exatamente** esses nomes de colunas.

---

## 9. Como verificar as configurações do Supabase

1. **Table Editor** → confirme que a tabela `livros` existe e possui as colunas acima.
2. **Project Settings → API** → confira a *Project URL* e a *anon key*.
3. **Authentication → Policies** (ou *Table Editor → livros → RLS*) → verifique se existem políticas que permitem `SELECT`, `INSERT`, `UPDATE` e `DELETE` para o papel `anon` (veja a seção 10).
4. Abra o site, pressione **F12 → Console**. Se aparecer algum erro do Supabase, ele indicará se o problema é de chave (`Invalid API key`), de tabela (`relation "livros" does not exist`) ou de permissão (`new row violates row-level security policy`).

---

## 10. Como configurar as políticas RLS (Row Level Security)

Como o site acessa o banco diretamente pelo navegador usando a Anon Key, a tabela `livros` precisa de políticas RLS que permitam as quatro operações. **Nada disso é feito automaticamente pelo JavaScript** — configure manualmente no painel.

### Opção A — pelo painel (sem SQL)

1. Table Editor → tabela `livros` → clique em **"RLS"** / **"Add RLS policy"**.
2. Crie **quatro políticas** (uma para cada operação) com o papel **`anon`** (ou `public`) e a expressão `true`:

| Política | Operação | USING | WITH CHECK |
|---|---|---|---|
| Permitir leitura pública | SELECT | `true` | — |
| Permitir cadastro público | INSERT | — | `true` |
| Permitir edição pública | UPDATE | `true` | `true` |
| Permitir exclusão pública | DELETE | `true` | — |

### Opção B — pelo SQL Editor

Cole e execute no **SQL Editor** do painel:

```sql
-- Garante que o RLS esteja habilitado
alter table public.livros enable row level security;

create policy "Permitir leitura pública"
  on public.livros for select
  to anon using (true);

create policy "Permitir cadastro público"
  on public.livros for insert
  to anon with check (true);

create policy "Permitir edição pública"
  on public.livros for update
  to anon using (true) with check (true);

create policy "Permitir exclusão pública"
  on public.livros for delete
  to anon using (true);
```

> ℹ️ Estas políticas deixam a tabela **aberta para qualquer visitante**, o que é aceitável para um projeto escolar. Em um sistema real, você combinaria RLS com autenticação (Supabase Auth) para que cada usuário veja apenas seus próprios livros.

---

## 11. Como executar o projeto

**Localmente:** basta abrir o arquivo `index.html` em qualquer navegador moderno (duplo clique). Não é preciso instalar nada.

> Dica: se preferir um servidor local, use a extensão *Live Server* do VS Code ou `python -m http.server`.

**Checklist para funcionar:**
- [ ] A Anon Key foi colada no `script.js`
- [ ] As políticas RLS estão configuradas (seção 10)
- [ ] Há conexão com a internet (SDK via CDN + Supabase)

---

## 12. Como publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `rosa-encantada`).
2. Envie os arquivos `index.html`, `style.css`, `script.js` e `README.md` para a branch `main`.
3. No repositório, vá em **Settings → Pages**.
4. Em **Source**, escolha **Deploy from a branch**, branch **`main`**, pasta **`/ (root)`**, e salve.
5. Aguarde alguns instantes; o site ficará disponível em:
   `https://SEU-USUARIO.github.io/rosa-encantada/`

Como o projeto usa apenas caminhos relativos (`style.css`, `script.js`), funciona em qualquer subpasta do GitHub Pages sem ajustes.

---

## 13. Por que a `service_role key` NUNCA deve ser usada no front-end

- A `service_role key` **ignora todas as políticas RLS** e tem acesso total ao banco (ler, alterar e apagar qualquer tabela).
- Todo código de um site estático é **público**: qualquer pessoa pode abrir o *DevTools* ou o repositório e copiar a chave.
- Com ela em mãos, um invasor poderia **apagar toda a biblioteca** ou acessar dados de outras tabelas.
- A **Anon Key** foi feita justamente para o navegador: ela é pública por design e só faz o que as políticas RLS permitem.

**Regra de ouro:** `service_role` só em servidores seguros (backend). No navegador, sempre `anon`.

---

## Funcionalidades implementadas

- [x] Header com rosa em SVG, título "Rosa Encantada" e subtítulo
- [x] Seção **"Adicionar uma nova história"** em card com aparência de papel antigo
- [x] Formulário com validações (título/autor/gênero obrigatórios, ano numérico, nota 0–5, URL válida) e mensagens junto aos campos
- [x] Seção **"Minha Biblioteca"** com estatísticas dinâmicas (total, lidos, lendo, não lidos)
- [x] Barra de pesquisa (título/autor) + filtros (gênero — preenchido com os gêneros reais do banco — e status)
- [x] Cards com capa (ou capa padrão elegante), título, autor, gênero • ano, estrelas, status, descrição, botões Editar/Excluir
- [x] Modal de edição (salvar, cancelar, fechar, Esc, clique no fundo)
- [x] Modal de confirmação de exclusão
- [x] Mensagens de sucesso/erro amigáveis (erros técnicos só no console)
- [x] Estado vazio: *"Seu castelo ainda está sem histórias... Cadastre o primeiro livro da biblioteca."*
- [x] Botão "voltar ao topo"
- [x] Responsivo (desktop, tablet, celular — cards em coluna única no celular)
- [x] Acessibilidade: labels, `alt`, `aria-live`, foco visível, navegação por teclado, HTML semântico, `prefers-reduced-motion`

## Ainda não implementado / próximos passos

- Autenticação de usuários (Supabase Auth) para bibliotecas individuais
- Upload da capa para o Supabase Storage (hoje aceita apenas URL)
- Ordenação personalizada (por título, nota, ano)
- Paginação para bibliotecas muito grandes

---

## Verificação final

- [x] SDK do Supabase importado via CDN
- [x] `createClient(SUPABASE_URL, SUPABASE_ANON_KEY)` com a URL correta (Project Reference ID **não** usado como URL)
- [x] Tabela `livros` utilizada com os nomes exatos das colunas
- [x] CREATE, READ, UPDATE, DELETE, pesquisa, filtros e estatísticas implementados
- [x] Tratamento de `error` em todas as chamadas
- [x] Sem frameworks, sem `localStorage`, sem `service_role key`
- [x] Instruções de RLS e GitHub Pages documentadas
