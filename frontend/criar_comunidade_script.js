document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = 'http://127.0.0.1:8000'; // Ajuste se seu backend estiver em outra porta/URL

    // Seletores de elementos do DOM
    const messageArea = document.getElementById('message-area');
    const createCommunityForm = document.getElementById('create-community-form');

    // Função para exibir mensagens
    function showMessage(message, type = 'success') {
        messageArea.textContent = message;
        messageArea.className = `message ${type}`;
        messageArea.style.display = 'block';
        setTimeout(() => {
            messageArea.style.display = 'none';
        }, 5000); // Esconde a mensagem após 5 segundos
    }

    // Event listener para o formulário de criação de comunidade
    createCommunityForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('community-name').value;
        const type = document.getElementById('community-type').value;
        const description = document.getElementById('community-description').value;

        // Concatena tipo e descrição na descrição do grupo para o backend
        const groupDescription = `Tipo: ${type}\nDescrição: ${description}`;

        const groupData = { nome: name, descricao: groupDescription };

        try {
            const response = await fetch(`${BASE_URL}/grupos/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(groupData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Erro HTTP: ${response.status}`);
            }

            const newGroup = await response.json();
            showMessage(`Comunidade "${newGroup.nome}" criada com sucesso!`, 'success');
            createCommunityForm.reset(); // Limpa o formulário
            // Não precisamos recarregar listas aqui, pois não estão nesta página
        } catch (error) {
            console.error('Erro ao criar comunidade:', error);
            showMessage(`Erro ao criar comunidade: ${error.message}`, 'error');
        }
    });
});