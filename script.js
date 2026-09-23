const SUPABASE_URL = 'https://knufrnocbjigarqewudp.supabase.co';

// >>> Substitua o valor abaixo pela Anon Key do projeto (Project Settings → API) <<<
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtudWZybm9jYmppZ2FycWV3dWRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NjczNzgsImV4cCI6MjEwNTE0MzM3OH0.wHJgzD40uqi9rSex8zxlGG2NWWPbVea12IpO9UZoMo4';

// Nome exato da tabela já existente no Supabase
const TABELA = 'livros';

// Cria o cliente do Supabase (o objeto global "supabase" vem do SDK carregado via CDN)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* --------------------------------------------------------------------------
   2. ESTADO DA APLICAÇÃO
   -------------------------------------------------------------------------- */
let livros = [];              // Todos os livros carregados do Supabase
let livroParaExcluir = null;  // Livro aguardando confirmação de exclusão
let temporizadorMensagem = null;

/* --------------------------------------------------------------------------
   3. REFERÊNCIAS AO DOM
   -------------------------------------------------------------------------- */
const $ = (seletor) => document.querySelector(seletor);

// Formulário de cadastro
const formLivro       = $('#form-livro');
const btnAdicionar    = $('#btn-adicionar');
const btnLimpar       = $('#btn-limpar');

// Biblioteca
const gradeLivros       = $('#grade-livros');
const contadorResultados = $('#contador-resultados');
const inputPesquisa     = $('#pesquisa');
const filtroGenero      = $('#filtro-genero');
const filtroStatus      = $('#filtro-status');
const btnLimparFiltros  = $('#btn-limpar-filtros');

// Estatísticas
const statTotal    = $('#stat-total');
const statLidos    = $('#stat-lidos');
const statLendo    = $('#stat-lendo');
const statNaoLidos = $('#stat-nao-lidos');

// Mensagens
const caixaMensagem = $('#mensagem');

// Modal de edição
const modalEditar  = $('#modal-editar');
const formEditar   = $('#form-editar');
const btnSalvar    = $('#btn-salvar');
const btnCancelar  = $('#btn-cancelar');
const modalFechar  = $('#modal-fechar');
const modalFundo   = $('#modal-fundo');

// Modal de exclusão
const modalExcluir        = $('#modal-excluir');
const excluirNomeLivro    = $('#excluir-nome-livro');
const btnConfirmarExcluir = $('#btn-confirmar-excluir');
const btnCancelarExcluir  = $('#btn-cancelar-excluir');
const excluirFechar       = $('#excluir-fechar');
const modalExcluirFundo   = $('#modal-excluir-fundo');

// Voltar ao topo
const btnTopo = $('#btn-topo');

/* --------------------------------------------------------------------------
   4. UTILITÁRIOS
   -------------------------------------------------------------------------- */

/**
 * Escapa caracteres HTML para evitar injeção de código ao renderizar
 * textos vindos do banco de dados.
 */
function escaparHTML(texto) {
    if (texto === null || texto === undefined) return '';
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Verifica se uma string é uma URL http/https válida.
 */
function urlValida(valor) {
    try {
        const url = new URL(valor);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Gera a representação em estrelas de uma nota (0 a 5).
 */
function gerarEstrelas(nota) {
    const n = Number(nota);
    if (nota === null || nota === undefined || nota === '' || Number.isNaN(n)) {
        return '<span class="nota-valor">Sem avaliação</span>';
    }
    const cheias = Math.max(0, Math.min(5, Math.round(n)));
    let html = '';
    for (let i = 1; i <= 5; i++) {
        html += i <= cheias ? '★' : '<span class="estrela-vazia">★</span>';
    }
    return `${html} <span class="nota-valor">(${cheias}/5)</span>`;
}

/**
 * Devolve a classe CSS do selo de status.
 */
function classeStatus(status) {
    switch (status) {
        case 'Lido':  return 'card-status--lido';
        case 'Lendo': return 'card-status--lendo';
        default:      return 'card-status--nao-lido';
    }
}

/**
 * Exibe uma mensagem flutuante para o usuário.
 * @param {string} texto  - Mensagem amigável
 * @param {'sucesso'|'erro'|'aviso'} tipo
 */
function mostrarMensagem(texto, tipo = 'sucesso') {
    clearTimeout(temporizadorMensagem);

    caixaMensagem.textContent = texto;
    caixaMensagem.className = `mensagem mensagem--${tipo}`;
    caixaMensagem.hidden = false;

    // Erros ficam um pouco mais tempo na tela
    const duracao = tipo === 'erro' ? 6000 : 3800;
    temporizadorMensagem = setTimeout(() => {
        caixaMensagem.hidden = true;
    }, duracao);
}

/**
 * Coloca um botão em estado "carregando" (desabilitado com texto alternativo).
 */
function definirCarregando(botao, carregando, textoOriginal) {
    if (carregando) {
        botao.dataset.textoOriginal = botao.innerHTML;
        botao.disabled = true;
        botao.textContent = textoOriginal;
    } else {
        botao.disabled = false;
        botao.innerHTML = botao.dataset.textoOriginal || botao.innerHTML;
    }
}

/* --------------------------------------------------------------------------
   5. VALIDAÇÃO DO FORMULÁRIO
   --------------------------------------------------------------------------
   Funciona tanto para o formulário de cadastro (prefixo "") quanto para o
   modal de edição (prefixo "editar-"), pois os ids seguem o mesmo padrão.
   -------------------------------------------------------------------------- */

/**
 * Lê os valores dos campos de um formulário e devolve o objeto "dados"
 * já no formato esperado pela tabela "livros".
 */
function lerCampos(prefixo = '') {
    const valor = (nome) => $(`#${prefixo}${nome}`).value.trim();

    const ano  = valor('ano_publicacao');
    const nota = valor('nota');
    const capa = valor('capa_url');
    const desc = valor('descricao');

    return {
        titulo:         valor('titulo'),
        autor:          valor('autor'),
        genero:         valor('genero'),
        ano_publicacao: ano  === '' ? null : Number(ano),
        status_leitura: valor('status_leitura') || 'Para Ler',
        nota:           nota === '' ? null : Number(nota),
        descricao:      desc === '' ? null : desc,
        capa_url:       capa === '' ? null : capa
    };
}

/**
 * Mostra uma mensagem de erro abaixo do campo indicado.
 */
function marcarErro(prefixo, nomeCampo, mensagem) {
    const input = $(`#${prefixo}${nomeCampo}`);
    const erro  = $(`#erro-${prefixo}${nomeCampo}`);
    if (input) input.closest('.campo').classList.add('invalido');
    if (erro)  erro.textContent = mensagem;
}

/**
 * Remove todas as marcações de erro de um formulário.
 */
function limparErros(formulario) {
    formulario.querySelectorAll('.campo.invalido').forEach(c => c.classList.remove('invalido'));
    formulario.querySelectorAll('.campo-erro').forEach(e => (e.textContent = ''));
}

/**
 * Valida os dados. Devolve true se estiver tudo certo; caso contrário,
 * marca os erros nos campos e devolve false.
 */
function validarDados(dados, prefixo, formulario) {
    limparErros(formulario);
    let valido = true;
    const anoAtual = new Date().getFullYear();

    if (!dados.titulo) {
        marcarErro(prefixo, 'titulo', 'O título é obrigatório.');
        valido = false;
    }

    if (!dados.autor) {
        marcarErro(prefixo, 'autor', 'O autor é obrigatório.');
        valido = false;
    }

    if (!dados.genero) {
        marcarErro(prefixo, 'genero', 'Selecione um gênero.');
        valido = false;
    }

    if (dados.ano_publicacao !== null) {
        if (!Number.isInteger(dados.ano_publicacao) || dados.ano_publicacao < 0 || dados.ano_publicacao > anoAtual + 1) {
            marcarErro(prefixo, 'ano_publicacao', `Informe um ano válido (até ${anoAtual + 1}).`);
            valido = false;
        }
    }

    if (dados.nota !== null) {
        if (Number.isNaN(dados.nota) || dados.nota < 0 || dados.nota > 5) {
            marcarErro(prefixo, 'nota', 'A nota deve estar entre 0 e 5.');
            valido = false;
        }
    }

    if (dados.capa_url !== null && !urlValida(dados.capa_url)) {
        marcarErro(prefixo, 'capa_url', 'Informe uma URL válida começando com http:// ou https://.');
        valido = false;
    }

    // Foca no primeiro campo inválido para ajudar na navegação por teclado
    if (!valido) {
        const primeiroInvalido = formulario.querySelector('.campo.invalido input, .campo.invalido select, .campo.invalido textarea');
        if (primeiroInvalido) primeiroInvalido.focus();
    }

    return valido;
}

/* --------------------------------------------------------------------------
   6. READ — CARREGAR LIVROS DO SUPABASE
   -------------------------------------------------------------------------- */
async function carregarLivros() {
    try {
        const { data, error } = await supabaseClient
            .from(TABELA)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao carregar livros:', error);
            mostrarMensagem('Não foi possível carregar sua biblioteca. Verifique a conexão com o banco de dados.', 'erro');
            gradeLivros.innerHTML = `
                <div class="estado-erro" role="alert">
                    <span class="erro-icone" aria-hidden="true">🕯</span>
                    Não foi possível abrir a biblioteca. Verifique a conexão com o banco de dados.
                </div>`;
            return;
        }

        livros = data || [];
        preencherFiltroGeneros();
        renderizarLivros();
        atualizarEstatisticas();
    } catch (erro) {
        // Erros inesperados (ex.: sem internet)
        console.error('Erro inesperado ao carregar livros:', erro);
        mostrarMensagem('Não foi possível carregar sua biblioteca. Verifique a conexão com o banco de dados.', 'erro');
        gradeLivros.innerHTML = `
            <div class="estado-erro" role="alert">
                <span class="erro-icone" aria-hidden="true">🕯</span>
                Não foi possível abrir a biblioteca. Verifique sua conexão com a internet.
            </div>`;
    }
}

/* --------------------------------------------------------------------------
   7. RENDERIZAÇÃO DOS CARDS (com pesquisa e filtros aplicados)
   -------------------------------------------------------------------------- */

/**
 * Aplica a pesquisa e os filtros sobre a lista completa de livros.
 */
function filtrarLivros() {
    const termo  = inputPesquisa.value.trim().toLowerCase();
    const genero = filtroGenero.value;
    const status = filtroStatus.value;

    return livros.filter((livro) => {
        const titulo = (livro.titulo || '').toLowerCase();
        const autor  = (livro.autor  || '').toLowerCase();

        const combinaTermo  = !termo  || titulo.includes(termo) || autor.includes(termo);
        const combinaGenero = !genero || livro.genero === genero;
        const combinaStatus = !status || livro.status_leitura === status;

        return combinaTermo && combinaGenero && combinaStatus;
    });
}

/**
 * Monta o HTML de um único card de livro.
 */
function criarCardLivro(livro) {
    const titulo = escaparHTML(livro.titulo);
    const autor  = escaparHTML(livro.autor);
    const genero = escaparHTML(livro.genero || 'Sem gênero');
    const ano    = livro.ano_publicacao ? escaparHTML(livro.ano_publicacao) : 'Ano não informado';
    const status = escaparHTML(livro.status_leitura || 'Para Ler');
    const descricao = livro.descricao
        ? `<p class="card-descricao">${escaparHTML(livro.descricao)}</p>`
        : `<p class="card-descricao card-descricao--vazia">Nenhuma descrição registrada.</p>`;

    // Capa padrão (mostrada quando não há URL ou quando a imagem falha ao carregar)
    const capaPadrao = `
        <div class="card-capa-padrao" aria-hidden="true">
            <span class="capa-icone">📚</span>
            <span class="capa-titulo">${titulo}</span>
            <span class="capa-autor">${autor}</span>
        </div>`;

    const capa = livro.capa_url && urlValida(livro.capa_url)
        ? `<img src="${escaparHTML(livro.capa_url)}" alt="Capa do livro ${titulo}" loading="lazy" data-capa-fallback>`
        : capaPadrao;

    return `
        <article class="card-livro" data-id="${escaparHTML(livro.id)}">
            <div class="card-capa">
                ${capa}
                <span class="card-status ${classeStatus(livro.status_leitura)}">${status}</span>
            </div>
            <div class="card-corpo">
                <h3 class="card-titulo">${titulo}</h3>
                <p class="card-autor">${autor}</p>
                <p class="card-meta">${genero}<span class="separador">•</span>${ano}</p>
                <div class="card-nota" aria-label="Nota: ${livro.nota ?? 'sem avaliação'}">${gerarEstrelas(livro.nota)}</div>
                ${descricao}
                <div class="card-acoes">
                    <button type="button" class="btn btn--secundario btn--pequeno" data-acao="editar" data-id="${escaparHTML(livro.id)}">
                        ✎ Editar
                    </button>
                    <button type="button" class="btn btn--perigo btn--pequeno" data-acao="excluir" data-id="${escaparHTML(livro.id)}">
                        Excluir
                    </button>
                </div>
            </div>
        </article>`;
}

/**
 * Renderiza os cards na grade, respeitando pesquisa e filtros.
 */
function renderizarLivros() {
    const lista = filtrarLivros();

    // Biblioteca completamente vazia
    if (livros.length === 0) {
        gradeLivros.innerHTML = `
            <div class="estado-vazio">
                <span class="vazio-icone" aria-hidden="true">🌹</span>
                Seu castelo ainda está sem histórias...<br>Cadastre o primeiro livro da biblioteca.
            </div>`;
        contadorResultados.textContent = '';
        return;
    }

    // Há livros, mas nenhum corresponde aos filtros
    if (lista.length === 0) {
        gradeLivros.innerHTML = `
            <div class="estado-vazio">
                <span class="vazio-icone" aria-hidden="true">🔍</span>
                Nenhuma história encontrada com esses critérios.
            </div>`;
        contadorResultados.textContent = `0 de ${livros.length} livros`;
        return;
    }

    gradeLivros.innerHTML = lista.map(criarCardLivro).join('');
    contadorResultados.textContent = lista.length === livros.length
        ? `${livros.length} ${livros.length === 1 ? 'livro' : 'livros'} na estante`
        : `${lista.length} de ${livros.length} livros`;

    // Se alguma capa falhar ao carregar, troca pela capa padrão
    gradeLivros.querySelectorAll('img[data-capa-fallback]').forEach((img) => {
        img.addEventListener('error', () => {
            const card   = img.closest('.card-livro');
            const livro  = livros.find(l => String(l.id) === card.dataset.id);
            const wrapper = document.createElement('div');
            wrapper.className = 'card-capa-padrao';
            wrapper.setAttribute('aria-hidden', 'true');
            wrapper.innerHTML = `
                <span class="capa-icone">📚</span>
                <span class="capa-titulo">${escaparHTML(livro?.titulo)}</span>
                <span class="capa-autor">${escaparHTML(livro?.autor)}</span>`;
            img.replaceWith(wrapper);
        }, { once: true });
    });
}

/**
 * Preenche o <select> de gêneros com os gêneros realmente existentes no banco.
 */
function preencherFiltroGeneros() {
    const selecionado = filtroGenero.value;
    const generos = [...new Set(livros.map(l => l.genero).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));

    filtroGenero.innerHTML = '<option value="">Todos os gêneros</option>' +
        generos.map(g => `<option value="${escaparHTML(g)}">${escaparHTML(g)}</option>`).join('');

    // Mantém o filtro escolhido, se ainda existir
    if (generos.includes(selecionado)) filtroGenero.value = selecionado;
}

/* --------------------------------------------------------------------------
   8. ESTATÍSTICAS (calculadas a partir dos registros reais)
   -------------------------------------------------------------------------- */
function atualizarEstatisticas() {
    const total    = livros.length;
    const lidos    = livros.filter(l => l.status_leitura === 'Lido').length;
    const lendo    = livros.filter(l => l.status_leitura === 'Lendo').length;
    const naoLidos = livros.filter(l => l.status_leitura !== 'Lido' && l.status_leitura !== 'Lendo').length;

    animarNumero(statTotal, total);
    animarNumero(statLidos, lidos);
    animarNumero(statLendo, lendo);
    animarNumero(statNaoLidos, naoLidos);
}

/**
 * Animação discreta de contagem para os números das estatísticas.
 */
function animarNumero(elemento, valorFinal) {
    const valorInicial = Number(elemento.textContent) || 0;
    if (valorInicial === valorFinal) {
        elemento.textContent = valorFinal;
        return;
    }
    const duracao = 400;
    const inicio = performance.now();

    function passo(agora) {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        elemento.textContent = Math.round(valorInicial + (valorFinal - valorInicial) * progresso);
        if (progresso < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
}

/* --------------------------------------------------------------------------
   9. CREATE — CADASTRAR LIVRO
   -------------------------------------------------------------------------- */
async function cadastrarLivro(evento) {
    evento.preventDefault();

    const dados = lerCampos('');
    if (!validarDados(dados, '', formLivro)) return;

    definirCarregando(btnAdicionar, true, 'Guardando na estante...');

    try {
        const { data, error } = await supabaseClient
            .from(TABELA)
            .insert([dados])
            .select();

        if (error) {
            console.error('Erro ao cadastrar livro:', error);
            mostrarMensagem('Não foi possível cadastrar o livro. Verifique a conexão com o banco de dados.', 'erro');
            return;
        }

        limparFormulario();
        mostrarMensagem('Livro cadastrado com sucesso!', 'sucesso');
        await carregarLivros();

        // Leva o usuário até a biblioteca para ver o novo livro
        $('#secao-biblioteca').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (erro) {
        console.error('Erro inesperado ao cadastrar:', erro);
        mostrarMensagem('Não foi possível cadastrar o livro.', 'erro');
    } finally {
        definirCarregando(btnAdicionar, false);
    }
}

/**
 * Limpa o formulário de cadastro e remove mensagens de erro.
 */
function limparFormulario() {
    formLivro.reset();
    limparErros(formLivro);
}

/* --------------------------------------------------------------------------
   10. UPDATE — EDITAR / ATUALIZAR LIVRO (via modal)
   -------------------------------------------------------------------------- */

/**
 * Abre o modal de edição com os dados do livro escolhido.
 */
function editarLivro(id) {
    const livro = livros.find(l => String(l.id) === String(id));
    if (!livro) {
        mostrarMensagem('Livro não encontrado.', 'erro');
        return;
    }

    limparErros(formEditar);

    $('#editar-id').value             = livro.id;
    $('#editar-titulo').value         = livro.titulo || '';
    $('#editar-autor').value          = livro.autor || '';
    $('#editar-genero').value         = livro.genero || '';
    $('#editar-ano_publicacao').value = livro.ano_publicacao ?? '';
    $('#editar-status_leitura').value = livro.status_leitura || 'Para Ler';
    $('#editar-nota').value           = livro.nota ?? '';
    $('#editar-capa_url').value       = livro.capa_url || '';
    $('#editar-descricao').value      = livro.descricao || '';

    // Caso o gênero salvo não esteja na lista de opções, adiciona-o dinamicamente
    if (livro.genero && $('#editar-genero').value !== livro.genero) {
        const opcao = document.createElement('option');
        opcao.value = opcao.textContent = livro.genero;
        $('#editar-genero').appendChild(opcao);
        $('#editar-genero').value = livro.genero;
    }

    abrirModal(modalEditar);
    $('#editar-titulo').focus();
}

/**
 * Envia as alterações do modal para o Supabase.
 */
async function atualizarLivro(evento) {
    evento.preventDefault();

    const id = $('#editar-id').value;
    const dadosAtualizados = lerCampos('editar-');

    if (!validarDados(dadosAtualizados, 'editar-', formEditar)) return;

    definirCarregando(btnSalvar, true, 'Salvando...');

    try {
        const { data, error } = await supabaseClient
            .from(TABELA)
            .update(dadosAtualizados)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Erro ao atualizar livro:', error);
            mostrarMensagem('Não foi possível atualizar o livro. Verifique a conexão com o banco de dados.', 'erro');
            return;
        }

        fecharModal(modalEditar);
        formEditar.reset();
        mostrarMensagem('Livro atualizado com sucesso!', 'sucesso');
        await carregarLivros();
    } catch (erro) {
        console.error('Erro inesperado ao atualizar:', erro);
        mostrarMensagem('Não foi possível atualizar o livro.', 'erro');
    } finally {
        definirCarregando(btnSalvar, false);
    }
}

/* --------------------------------------------------------------------------
   11. DELETE — EXCLUIR LIVRO (com confirmação)
   -------------------------------------------------------------------------- */

/**
 * Abre o modal de confirmação antes de excluir.
 */
function confirmarExclusao(id) {
    const livro = livros.find(l => String(l.id) === String(id));
    if (!livro) {
        mostrarMensagem('Livro não encontrado.', 'erro');
        return;
    }
    livroParaExcluir = livro;
    excluirNomeLivro.textContent = `“${livro.titulo}”`;
    abrirModal(modalExcluir);
    btnCancelarExcluir.focus();
}

/**
 * Executa a exclusão no Supabase após a confirmação do usuário.
 */
async function excluirLivro() {
    if (!livroParaExcluir) return;
    const id = livroParaExcluir.id;

    definirCarregando(btnConfirmarExcluir, true, 'Removendo...');

    try {
        const { data, error } = await supabaseClient
            .from(TABELA)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro ao excluir livro:', error);
            mostrarMensagem('Não foi possível remover o livro. Verifique a conexão com o banco de dados.', 'erro');
            return;
        }

        fecharModal(modalExcluir);
        livroParaExcluir = null;
        mostrarMensagem('Livro removido da biblioteca.', 'sucesso');
        await carregarLivros();
    } catch (erro) {
        console.error('Erro inesperado ao excluir:', erro);
        mostrarMensagem('Não foi possível remover o livro.', 'erro');
    } finally {
        definirCarregando(btnConfirmarExcluir, false);
    }
}

/* --------------------------------------------------------------------------
   12. MODAIS — abrir / fechar
   -------------------------------------------------------------------------- */
function abrirModal(modal) {
    modal.hidden = false;
    document.body.classList.add('modal-aberto');
}

function fecharModal(modal) {
    modal.hidden = true;
    document.body.classList.remove('modal-aberto');
}

/* --------------------------------------------------------------------------
   13. EVENTOS
   -------------------------------------------------------------------------- */

// Cadastro
formLivro.addEventListener('submit', cadastrarLivro);
btnLimpar.addEventListener('click', limparFormulario);

// Limpa a marcação de erro assim que o usuário começa a corrigir o campo
document.querySelectorAll('.form-livro input, .form-livro select, .form-livro textarea').forEach((campo) => {
    campo.addEventListener('input', () => {
        const wrapper = campo.closest('.campo');
        if (wrapper && wrapper.classList.contains('invalido')) {
            wrapper.classList.remove('invalido');
            const erro = wrapper.querySelector('.campo-erro');
            if (erro) erro.textContent = '';
        }
    });
});

// Pesquisa e filtros (atualização dinâmica, sem recarregar a página)
inputPesquisa.addEventListener('input', renderizarLivros);
filtroGenero.addEventListener('change', renderizarLivros);
filtroStatus.addEventListener('change', renderizarLivros);
btnLimparFiltros.addEventListener('click', () => {
    inputPesquisa.value = '';
    filtroGenero.value = '';
    filtroStatus.value = '';
    renderizarLivros();
    inputPesquisa.focus();
});

// Botões "Editar" e "Excluir" dos cards (delegação de eventos)
gradeLivros.addEventListener('click', (evento) => {
    const botao = evento.target.closest('button[data-acao]');
    if (!botao) return;

    const { acao, id } = botao.dataset;
    if (acao === 'editar')  editarLivro(id);
    if (acao === 'excluir') confirmarExclusao(id);
});

// Modal de edição
formEditar.addEventListener('submit', atualizarLivro);
btnCancelar.addEventListener('click', () => fecharModal(modalEditar));
modalFechar.addEventListener('click', () => fecharModal(modalEditar));
modalFundo.addEventListener('click', () => fecharModal(modalEditar));

// Modal de exclusão
btnConfirmarExcluir.addEventListener('click', excluirLivro);
btnCancelarExcluir.addEventListener('click', () => fecharModal(modalExcluir));
excluirFechar.addEventListener('click', () => fecharModal(modalExcluir));
modalExcluirFundo.addEventListener('click', () => fecharModal(modalExcluir));

// Fechar modais com a tecla Esc
document.addEventListener('keydown', (evento) => {
    if (evento.key !== 'Escape') return;
    if (!modalEditar.hidden)  fecharModal(modalEditar);
    if (!modalExcluir.hidden) fecharModal(modalExcluir);
});

// Botão "voltar ao topo"
window.addEventListener('scroll', () => {
    btnTopo.hidden = window.scrollY < 400;
});
btnTopo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* --------------------------------------------------------------------------
   14. INICIALIZAÇÃO — ao abrir o site, carrega os livros do Supabase
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', carregarLivros);
