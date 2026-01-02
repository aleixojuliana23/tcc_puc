document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = 'http://127.0.0.1:8000'; // Ajuste se seu backend estiver em outra porta/URL

    const messageArea = document.getElementById('message-area');
    const listaDeComunidades = document.getElementById('listaDeComunidades'); // <--- AQUI ESTÁ O ELEMENTO CORRETO
    // const listaGrupos = document.getElementById('listaGrupos'); // <--- ESTA LINHA DEVE SER REMOVIDA OU COMENTADA
    const codigoConviteInput = document.getElementById('codigoConvite');
    const entrarComCodigoButton = document.getElementById('entrarComCodigo');
    const criarNovaComunidadeButton = document.getElementById('criarNovaComunidade');
    const navegarParaPerfilButton = document.getElementById('navegarParaPerfil');

    function showMessage(message, type = 'success') {
        messageArea.textContent = message;
        messageArea.className = `message ${type}`;
        messageArea.style.display = 'block';
        setTimeout(() => {
            messageArea.style.display = 'none';
        }, 5000);
    }

    async function loadComunidades() {
        // Use listaDeComunidades aqui
        if (listaDeComunidades) { // Adicione uma verificação de segurança
            listaDeComunidades.innerHTML = '<p>Carregando comunidades...</p>';
        }

        try {
            const response = await fetch(`${BASE_URL}/grupos/`);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const comunidades = await response.json();

            if (listaDeComunidades) { // Adicione uma verificação de segurança
                listaDeComunidades.innerHTML = ''; // Limpa o feedback de carregamento
            }

            if (comunidades.length === 0) {
                if (listaDeComunidades) {
                    listaDeComunidades.innerHTML = '<p>Nenhuma comunidade cadastrada ainda. Crie uma nova!</p>';
                }
            } else {
                comunidades.forEach(comunidade => {
                    const communityCard = document.createElement('button');
                    communityCard.className = 'card text-left group border border-gray-100'; // Reutilizando a classe card
                    communityCard.innerHTML = `
                        <div class="flex items-start justify-between mb-4">
                            <div class="p-4 bg-gradient-primary-to-secondary rounded-2xl">
                                <!-- Ícone de usuários simplificado -->
                                👥
                            </div>
                        </div>
                        <h3 class="text-gray-900 mb-2 group-hover-text-primary transition-colors">${comunidade.nome}</h3>
                        <p class="text-gray-500 mb-3">${comunidade.descricao.split('\n')[0].replace('Tipo: ', '') || 'Tipo não especificado'}</p>
                        <p class="text-gray-600">${comunidade.descricao.split('\n').slice(1).join('\n').replace('Descrição: ', '') || 'Sem descrição detalhada'}</p>
                    `;
                    communityCard.addEventListener('click', () => {
                        window.location.href = `/static/detalhes_comunidade.html?id=${comunidade.id}`;
                    });
                    if (listaDeComunidades) { // Adicione uma verificação de segurança
                        listaDeComunidades.appendChild(communityCard);
                    }
                });
            }
        } catch (error) {
            console.error('Erro ao carregar comunidades:', error);
            if (listaDeComunidades) { // Adicione uma verificação de segurança
                listaDeComunidades.innerHTML = `<p>Erro ao carregar comunidades: ${error.message}. Verifique se o backend está rodando.</p>`;
            }
            showMessage('Erro ao carregar comunidades.', 'error');
        }
    }

    // ... (restante do código, event listeners) ...

    // Carrega as comunidades ao iniciar a página
    loadComunidades();
});