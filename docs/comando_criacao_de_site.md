Crie um site completo, funcional e responsivo de cadastro e gerenciamento de livros chamado “Rosa Encantada”, seguindo rigorosamente os requisitos técnicos descritos abaixo.

1. TEMA E IDENTIDADE VISUAL

O tema visual do site deve ser inspirado artisticamente no conceito de “A Bela e a Fera”, com uma estética literária, romântica, elegante, aconchegante e levemente vintage, remetendo a uma biblioteca antiga e encantada.

A inspiração deve ser sutil e sofisticada, evitando deixar o site infantil ou excessivamente temático.

Paleta de cores

Utilize principalmente tons terrosos e quentes, como:

- Marrom café
- Marrom chocolate
- Bege / creme
- Caramelo
- Terracota
- Dourado envelhecido
- Vermelho vinho/bordô em pequenos detalhes
- Verde musgo de forma pontual

O fundo pode utilizar tons de creme, bege ou papel envelhecido.

Elementos visuais desejados

Incorpore de maneira elegante:

- Livros
- Páginas de livros
- Estantes
- Pequenas ilustrações ou silhuetas de rosas
- Rosa vermelha como detalhe visual
- Molduras ornamentais discretas
- Texturas que lembrem papel
- Detalhes dourados
- Ornamentos inspirados em bibliotecas antigas
- Ícones relacionados à leitura
- Efeitos suaves de sombra e iluminação

A estética deve transmitir a sensação de:

“Uma biblioteca encantada dentro de um castelo.”

Não utilize imagens protegidas ou copie diretamente elementos de uma adaptação específica. A referência à Bela e à Fera deve ser interpretada artisticamente através de elementos como rosa, biblioteca, castelo, livros e atmosfera romântica.

Tipografia

Utilize uma combinação de fontes:

- Uma fonte serifada elegante para títulos, remetendo a livros clássicos.
- Uma fonte simples e legível para textos, formulários e informações.

As fontes podem ser importadas do Google Fonts.

---

2. OBJETIVO DO SISTEMA

O site deve permitir que o usuário mantenha uma biblioteca digital pessoal, podendo:

- Cadastrar livros
- Visualizar os livros cadastrados
- Pesquisar livros
- Editar livros
- Excluir livros

O sistema deve utilizar CRUD completo integrado ao banco de dados Supabase já existente.

IMPORTANTE: o banco de dados NÃO precisa ser criado. Ele já foi criado pelo aluno no Supabase.

O código deve se conectar diretamente ao banco existente.

---

3. TECNOLOGIAS OBRIGATÓRIAS

Utilize exclusivamente:

- HTML5
- CSS3
- JavaScript puro (Vanilla JavaScript)
- Supabase

Não utilize React, Vue, Angular, Node.js ou outros frameworks para o front-end.

O projeto deve funcionar abrindo o "index.html" e também deve estar preparado para hospedagem no GitHub Pages.

---

4. ESTRUTURA DOS ARQUIVOS

Organize o projeto da seguinte maneira:

/
├── index.html
├── style.css
├── script.js
└── README.md

Todo o código deve estar organizado e comentado de forma que um estudante consiga compreender sua estrutura.

---

5. BANCO DE DADOS EXISTENTE — SUPABASE

ATENÇÃO: o banco de dados já foi criado. NÃO crie outro banco e NÃO crie outra tabela.

O projeto Supabase utilizado pelo aluno possui:

Nome do projeto/banco

Rosa Encantada

Project Reference ID

knufrnocbjigarqewudp

IMPORTANTE: "knufrnocbjigarqewudp" é o Project Reference ID.

Ele NÃO deve ser utilizado sozinho como URL de conexão.

Supabase URL

A URL de conexão do projeto é:

https://knufrnocbjigarqewudp.supabase.co

Utilize essa URL no "supabase.createClient()".

Supabase Anon Key

A Anon Key fornecida pelo aluno deve ser utilizada como a chave pública do projeto.

Use a Anon Key fornecida pelo aluno neste prompt exatamente como credencial pública do Supabase.

IMPORTANTE:

- A Anon Key é diferente do Project Reference ID.
- A Anon Key é diferente da Supabase URL.
- Não confunda esses três valores.
- NÃO utilize uma "service_role key".
- NÃO tente gerar uma nova chave.
- NÃO substitua a chave por uma chave fictícia.
- NÃO coloque o Project Reference ID no lugar da URL.

---

6. TABELA EXISTENTE

A tabela já existente no Supabase se chama:

livros

NÃO crie essa tabela novamente.

O código deve utilizar exatamente essa tabela.

A tabela possui os seguintes campos:

- "id" — identificador único
- "titulo" — título do livro
- "autor" — autor
- "genero" — gênero literário
- "ano_publicacao" — ano de publicação
- "status_leitura" — status da leitura
- "nota" — avaliação do usuário
- "descricao" — breve descrição
- "capa_url" — URL opcional da capa
- "created_at" — data de cadastro

Utilize exatamente esses nomes de colunas nas operações do Supabase.

---

7. CONEXÃO COM O SUPABASE

O site deve ser entregue já preparado para se conectar ao projeto Supabase existente.

No HTML, importe o SDK do Supabase utilizando CDN:

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

No "script.js", configure a conexão desta forma:

const SUPABASE_URL = 'https://knufrnocbjigarqewudp.supabase.co';

const SUPABASE_ANON_KEY = 'ANON_KEY_FORNECIDA_PELO_ALUNO';

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

Substitua "ANON_KEY_FORNECIDA_PELO_ALUNO" pela Anon Key fornecida pelo aluno.

IMPORTANTE SOBRE AS CREDENCIAIS

Não confundir:

Project Reference ID
knufrnocbjigarqewudp

com:

Supabase URL
https://knufrnocbjigarqewudp.supabase.co

e com:

Supabase Anon Key
[Anon Key fornecida pelo aluno]

São três informações diferentes.

A aplicação deve utilizar:

supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

e a tabela:

.from('livros')

Não utilize o Project Reference ID diretamente no "createClient()".

Não utilize a "service_role key" no front-end.

---

8. NÃO CRIAR UM NOVO BANCO

Não faça nenhuma das seguintes coisas:

- Não criar outro projeto Supabase.
- Não criar outra tabela chamada "livros".
- Não alterar o nome da tabela.
- Não criar uma tabela alternativa.
- Não utilizar arrays como banco de dados.
- Não utilizar "localStorage" como substituto do Supabase.
- Não criar dados fictícios permanentes.

O objetivo é conectar o site ao banco Rosa Encantada que já existe.

---

9. CRUD COMPLETO

O sistema deve obrigatoriamente possuir as quatro operações:

CREATE — Cadastrar

Criar um formulário para cadastro de livros contendo:

- Título
- Autor
- Gênero
- Ano de publicação
- Status da leitura
- Nota
- Descrição
- URL da capa

Ao clicar em “Adicionar à biblioteca”, os dados devem:

1. Ser capturados pelo JavaScript.
2. Ser validados.
3. Ser enviados ao Supabase usando "insert()".
4. Limpar o formulário após o cadastro.
5. Atualizar automaticamente a lista de livros.
6. Mostrar uma mensagem de sucesso.

Utilize a tabela existente:

const { data, error } = await supabaseClient
    .from('livros')
    .insert([dados]);

---

10. READ — CONSULTAR

Ao abrir o site, o JavaScript deve consultar automaticamente os livros cadastrados no Supabase.

Utilize:

const { data, error } = await supabaseClient
    .from('livros')
    .select('*');

Os livros devem ser exibidos dinamicamente em cards, e não apenas em uma tabela.

Cada card deve apresentar:

- Capa do livro
- Título
- Autor
- Gênero
- Ano
- Status
- Nota
- Descrição
- Botão “Editar”
- Botão “Excluir”

Se não houver livros cadastrados, mostrar uma mensagem amigável, por exemplo:

“Seu castelo ainda está sem histórias... Cadastre o primeiro livro da biblioteca.”

---

11. PESQUISA E FILTROS

Adicione uma barra de pesquisa elegante no topo da biblioteca.

O usuário deve conseguir pesquisar pelo:

- título
- autor

Adicione também filtros por:

- gênero
- status de leitura

Os resultados devem ser atualizados dinamicamente sem recarregar a página.

---

12. UPDATE — ALTERAR

Cada card deve possuir um botão “Editar”.

Ao clicar nele, o formulário deve ser preenchido com os dados do livro selecionado.

O usuário poderá modificar as informações.

Ao salvar:

const { data, error } = await supabaseClient
    .from('livros')
    .update(dadosAtualizados)
    .eq('id', id);

O registro correspondente deve ser atualizado no Supabase.

Depois da alteração:

- Atualizar a lista automaticamente.
- Limpar o formulário.
- Alterar o botão para voltar ao modo “Adicionar”.
- Mostrar uma mensagem de sucesso.

---

13. DELETE — EXCLUIR

Cada livro deve possuir um botão “Excluir”.

Ao clicar:

1. Mostrar uma confirmação antes da exclusão.
2. Identificar o livro pelo "id".
3. Executar:

const { data, error } = await supabaseClient
    .from('livros')
    .delete()
    .eq('id', id);

4. Atualizar a lista automaticamente.
5. Mostrar uma mensagem de confirmação.

Nunca excluir um livro sem confirmação do usuário.

---

14. JAVASCRIPT

Utilize obrigatoriamente:

- "addEventListener"
- "async/await"
- funções assíncronas
- manipulação do DOM
- tratamento de erros
- atualização dinâmica da interface

Crie funções organizadas, como:

carregarLivros()
cadastrarLivro()
editarLivro()
atualizarLivro()
excluirLivro()
renderizarLivros()
limparFormulario()
mostrarMensagem()
atualizarEstatisticas()

Os nomes podem ser adaptados, mas a lógica deve permanecer organizada.

---

15. TRATAMENTO DE ERROS

Em todas as operações do Supabase, verifique a propriedade "error".

Exemplo:

const { data, error } = await supabaseClient
    .from('livros')
    .select('*');

if (error) {
    console.error(error);
    mostrarMensagem(
        'Não foi possível carregar os livros.',
        'erro'
    );
    return;
}

Não deixar erros técnicos do sistema aparecerem diretamente para o usuário.

Utilize mensagens amigáveis, como:

- “Livro cadastrado com sucesso!”
- “Livro atualizado com sucesso!”
- “Livro removido da biblioteca.”
- “Não foi possível cadastrar o livro.”
- “Não foi possível carregar sua biblioteca.”
- “Verifique a conexão com o banco de dados.”

---

16. INTERFACE

A página deve possuir uma estrutura semelhante a:

HEADER

Nome da biblioteca:

“Rosa Encantada”

Subtítulo:

“Toda história merece um lugar especial.”

Adicionar uma pequena referência visual à rosa.

---

17. SEÇÃO DE CADASTRO

Título:

“Adicionar uma nova história”

Criar um formulário elegante em um card com aparência de papel antigo.

---

18. SEÇÃO DA BIBLIOTECA

Título:

“Minha Biblioteca”

Mostrar:

- quantidade total de livros
- quantidade de livros lidos
- quantidade de livros que estão sendo lidos
- quantidade de livros ainda não lidos

Esses números devem ser calculados dinamicamente com base nos registros reais da tabela "livros" no Supabase.

Não utilizar números fixos.

---

19. DESIGN DOS CARDS

Cada livro deve aparecer em um card visualmente bonito.

Estrutura aproximada:

┌──────────────────────────────┐
│          CAPA DO LIVRO       │
│                              │
│       Título do Livro        │
│       Autor                  │
│                              │
│       Romance • 2024         │
│       ★★★★★                 │
│                              │
│       Status: Lido           │
│                              │
│   [ Editar ] [ Excluir ]     │
└──────────────────────────────┘

Os cards devem ter:

- bordas suaves
- sombras discretas
- cantos levemente arredondados
- detalhes dourados
- efeito hover elegante
- boa hierarquia visual

---

20. RESPONSIVIDADE

O site deve funcionar perfeitamente em:

- computador
- tablet
- celular

No celular, os cards devem passar para uma única coluna.

O formulário também deve se adaptar à tela.

---

21. EXPERIÊNCIA DO USUÁRIO

Adicionar pequenos detalhes de interação:

- animações suaves
- hover nos botões
- transições
- feedback visual após ações
- mensagens de sucesso/erro
- botão de voltar ao topo, se necessário

As animações devem ser discretas e elegantes.

Não exagerar nos efeitos.

---

22. ACESSIBILIDADE

Utilizar:

- labels associados aos inputs
- textos alternativos nas imagens
- contraste adequado
- botões claramente identificáveis
- navegação possível pelo teclado
- HTML semântico

---

23. VALIDAÇÕES

O formulário deve impedir cadastros inválidos.

Por exemplo:

- Título obrigatório
- Autor obrigatório
- Gênero obrigatório
- Ano deve ser numérico
- Nota deve estar entre 0 e 5
- URL da capa deve ser válida quando preenchida

Mostrar mensagens de erro próximas aos campos quando necessário.

---

24. MODAL DE EDIÇÃO

Para deixar a interface mais bonita, pode utilizar um modal para edição.

Ao clicar em “Editar”, abrir um modal com os dados do livro.

O modal deve possuir:

- formulário preenchido
- botão salvar alterações
- botão cancelar
- botão fechar

O modal deve funcionar somente com HTML, CSS e JavaScript.

---

25. EXPERIÊNCIA VISUAL ESPECIAL

Quero que o site tenha personalidade própria.

Imagine uma biblioteca antiga e encantada, com uma grande estante de livros, luz quente, madeira, páginas antigas e uma rosa vermelha como pequeno símbolo.

A estética deve lembrar:

romance + biblioteca + conto de fadas + aconchego + elegância.

Evite:

- excesso de vermelho
- excesso de elementos de conto de fadas
- visual infantil
- excesso de animações
- visual genérico de dashboard
- aparência de template pronto

O resultado deve parecer um site de biblioteca literária premium, mas continuar simples e funcional para um projeto escolar.

---

26. ENTREGA DO CÓDIGO

Forneça o projeto completo separado nos seguintes arquivos:

"index.html"

Estrutura completa da página e importação do SDK do Supabase.

"style.css"

Todo o estilo visual e responsividade.

"script.js"

Toda a lógica do CRUD, conexão com Supabase, pesquisa, filtros, estatísticas, validações e interações.

"README.md"

Explique:

1. Objetivo do projeto.
2. Tecnologias utilizadas.
3. Estrutura dos arquivos.
4. Como o projeto se conecta ao Supabase.
5. O que é o Project Reference ID.
6. Qual é a Supabase URL utilizada.
7. Onde está configurada a Anon Key.
8. Estrutura da tabela "livros".
9. Como verificar as configurações do Supabase.
10. Como configurar as políticas RLS, caso necessário.
11. Como executar o projeto.
12. Como publicar no GitHub Pages.
13. Por que a "service_role key" nunca deve ser utilizada no front-end.

---

27. IMPORTANTE SOBRE RLS

Como o projeto utiliza o Supabase diretamente pelo navegador através da Anon Key, verifique se a tabela "livros" possui políticas RLS que permitam as operações necessárias.

O projeto precisa conseguir:

- SELECT
- INSERT
- UPDATE
- DELETE

Se as políticas ainda não estiverem configuradas, explique no "README.md" exatamente como configurá-las no painel do Supabase.

Não tente executar SQL automaticamente pelo JavaScript.

Não desative a segurança do banco de dados de forma automática.

---

28. IMPORTANTE — DADOS REAIS

O código precisa ser realmente funcional, e não apenas uma demonstração visual.

Não utilize dados fictícios armazenados apenas em arrays ou "localStorage".

Os livros cadastrados devem ser efetivamente armazenados no Supabase e permanecer disponíveis após atualizar a página.

Todas as operações CRUD devem conversar diretamente com:

Supabase
    ↓
Projeto: Rosa Encantada
    ↓
Tabela: livros

---

29. VERIFICAÇÃO FINAL

Antes de apresentar o código final, verifique se:

- [ ] HTML funciona.
- [ ] CSS funciona.
- [ ] JavaScript funciona.
- [ ] SDK do Supabase está importado corretamente.
- [ ] Project Reference ID está identificado corretamente.
- [ ] Supabase URL está configurada corretamente.
- [ ] Anon Key está configurada corretamente.
- [ ] Project Reference ID NÃO está sendo utilizado como URL.
- [ ] A tabela utilizada é exatamente "livros".
- [ ] CREATE funciona.
- [ ] READ funciona.
- [ ] UPDATE funciona.
- [ ] DELETE funciona.
- [ ] Pesquisa funciona.
- [ ] Filtros funcionam.
- [ ] Estatísticas são atualizadas.
- [ ] Tratamento de erros está implementado.
- [ ] Site é responsivo.
- [ ] Não existe dependência de frameworks.
- [ ] Não existe dependência de "localStorage".
- [ ] O projeto está pronto para ser colocado em um repositório GitHub.
- [ ] As instruções de RLS estão documentadas.
- [ ] Nenhuma "service_role key" está sendo utilizada no front-end.

---

30. FORMATO DA RESPOSTA

Entregue primeiro uma breve explicação da arquitetura do projeto.

Em seguida, apresente cada arquivo completo em seu próprio bloco de código:

1. "index.html"
2. "style.css"
3. "script.js"
4. "README.md"

Não omita nenhuma parte necessária para o funcionamento.

IMPORTANTE: Não entregue apenas uma demonstração visual.

O JavaScript deve estar efetivamente conectado ao projeto Supabase existente, utilizando:

Project Reference ID:
knufrnocbjigarqewudp

Supabase URL:
https://knufrnocbjigarqewudp.supabase.co

Supabase Anon Key:
[usar a Anon Key fornecida pelo aluno]

Tabela:
livros

Nome do projeto:
Rosa Encantada

O site deve realizar as operações CRUD diretamente nessa tabela.

Antes de finalizar, verifique se a implementação está coerente com a estrutura real do banco fornecida neste prompt.