document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = 'http://127.0.0.1:8000'; // Ajuste se seu backend estiver em outra porta/URL

    // Extrair o ID da comunidade da URL
    const urlParams = new URLSearchParams(window.location.search);
    const comunidadeId = urlParams.get('id');

    // Seletores de elementos do DOM
    const messageArea = document.getElementById('message-area');
    const nomeComunidadeDetalhes = document.getElementById('nomeComunidadeDetalhes');
    const tipoComunidadeDetalhes = document.getElementById('tipoComunidadeDetalhes');
    const descricaoComunidadeDetalhes = document.getElementById('descricaoComunidadeDetalhes');
    const indicacaoForm = document.getElementById('indicacaoForm');
    const grupoSelect = document.getElementById('grupoSelect'); // Select para criar indicação
    const listaIndicacoes = document.getElementById('listaIndicacoes');

    // Se não houver ID na URL, redireciona ou mostra erro
    if (!comunidadeId) {
        showMessage('ID da comunidade não fornecido na URL. Redirecionando...', 'error');
        setTimeout(() => {
            window.location.href = '/static/pagina_inicial_comunidades.html'; // Redireciona para a página inicial
        }, 3000);
        return; // Sai da função para evitar execução de código com ID inválido
    }

    // Função para exibir mensagens
    function showMessage(message, type = 'success') {
        messageArea.textContent = message;
        messageArea.className = `message ${type}`;
        messageArea.style.display = 'block';
        setTimeout(() => {
            messageArea.style.display = 'none';
        }, 5000);
    }

    // Função para carregar os detalhes da comunidade e preencher o select de criação
    async function loadComunidadeDetalhes() {
        try {
            // Busca apenas o grupo específico pelo ID
            const response = await fetch(`${BASE_URL}/grupos/${comunidadeId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Comunidade com ID ${comunidadeId} não encontrada.`);
                }
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const comunidadeAtual = await response.json();

            if (comunidadeAtual) {
                nomeComunidadeDetalhes.textContent = comunidadeAtual.nome;
                // Divide a descrição para extrair tipo e descrição detalhada
                // Assumindo que a descrição está no formato "Tipo: [tipo]\nDescrição: [descrição]"
                const descSplit = comunidadeAtual.descricao.split('\n');
                let tipo = 'Não especificado';
                let descricaoDetalhada = 'Sem descrição detalhada';

                if (descSplit.length > 0 && descSplit[0].startsWith('Tipo: ')) {
                    tipo = descSplit[0].replace('Tipo: ', '');
                    descricaoDetalhada = descSplit.slice(1).join('\n').replace('Descrição: ', '');
                } else {
                    // Caso a descrição não siga o formato esperado, usa a descrição completa como detalhada
                    descricaoDetalhada = comunidadeAtual.descricao;
                }

                tipoComunidadeDetalhes.textContent = `Tipo: ${tipo}`;
                descricaoComunidadeDetalhes.textContent = `Descrição: ${descricaoDetalhada}`;

                // Preenche e desabilita o select de grupo no formulário de indicação
                if (grupoSelect) { // Garante que o elemento existe
                    grupoSelect.innerHTML = `<option value="${comunidadeAtual.id}">${comunidadeAtual.nome} (ID: ${comunidadeAtual.id})</option>`;
                    grupoSelect.value = comunidadeAtual.id; // Garante que o valor está setado
                }
            } else {
                nomeComunidadeDetalhes.textContent = 'Comunidade não encontrada';
                tipoComunidadeDetalhes.textContent = '';
                descricaoComunidadeDetalhes.textContent = '';
                showMessage('Comunidade não encontrada.', 'error');
            }
        } catch (error) {
            console.error('Erro ao carregar detalhes da comunidade:', error);
            showMessage(`Erro ao carregar detalhes da comunidade: ${error.message}`, 'error');
            // Redireciona se a comunidade não for encontrada
            setTimeout(() => {
                window.location.href = '/static/pagina_inicial_comunidades.html';
            }, 3000);
        }
    }

    // Função para carregar e exibir as indicações para esta comunidade
    async function loadIndicacoesParaComunidade() {
        listaIndicacoes.innerHTML = '<li>Carregando indicações...</li>';
        try {
            const response = await fetch(`${BASE_URL}/indicacoes/grupo/${comunidadeId}`); // Usa o endpoint de filtro por grupo
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const indicacoes = await response.json();
            listaIndicacoes.innerHTML = '';

            if (indicacoes.length === 0) {
                listaIndicacoes.innerHTML = '<li>Nenhuma indicação cadastrada ainda para esta comunidade.</li>';
            } else {
                indicacoes.forEach(indicacao => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong>ID: ${indicacao.id}</strong> - ${indicacao.titulo} <br>
                        <strong>Categoria:</strong> ${indicacao.categoria} <br>
                        <strong>Descrição:</strong> ${indicacao.descricao || 'Sem descrição'}
                    `;
                    listaIndicacoes.appendChild(li);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar indicações:', error);
            listaIndicacoes.innerHTML = `<li>Erro ao carregar indicações: ${error.message}. Verifique se o backend está rodando.</li>`;
            showMessage('Erro ao carregar indicações.', 'error');
        }
    }

    // Event listener para o formulário de criação de indicação
    if (indicacaoForm) { // <--- VERIFICAÇÃO ADICIONADA AQUI
        indicacaoForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const titulo = document.getElementById("titulo").value;
            const descricao = document.getElementById("descricaoIndicacao").value;
            const categoria = document.getElementById("categoria").value;

            if (!comunidadeId) { // Garante que temos um ID de comunidade
                showMessage('Erro: ID da comunidade não encontrado.', 'error');
                return;
            }
            if (!categoria || categoria === "") {
                showMessage('Por favor, selecione uma categoria para a indicação.', 'error');
                return;
            }

            const indicacaoData = {
                titulo: titulo,
                descricao: descricao,
                categoria: categoria,
                grupo_id: parseInt(comunidadeId) // Usa o ID da URL
            };

            try {
                const response = await fetch(`${BASE_URL}/indicacoes/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(indicacaoData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || `Erro HTTP: ${response.status}`);
                }

                const newIndicacao = await response.json();
                showMessage(`Indicação "${newIndicacao.titulo}" criada com sucesso!`, 'success');
                indicacaoForm.reset(); // Limpa o formulário
                await loadIndicacoesParaComunidade(); // Recarrega a lista de indicações para esta comunidade
            } catch (error) {
                console.error('Erro ao criar indicação:', error);
                showMessage(`Erro ao criar indicação: ${error.message}`, 'error');
            }
        });
    } else {
        console.warn("Elemento 'indicacaoForm' não encontrado no DOM. O formulário de indicação não será funcional.");
    }


    // Carrega os detalhes da comunidade e suas indicações ao iniciar a página
    loadComunidadeDetalhes();
    loadIndicacoesParaComunidade();
});