document.getElementById("grupoForm").addEventListener("submit", function (event) {
    event.preventDefault();
    document.getElementById("mensagem").innerText = "";

    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;

    fetch("http://127.0.0.1:8000/grupos/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: nome,
            descricao: descricao
        })
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById("mensagem").innerText =
                "Grupo criado com sucesso! ID: " + data.id;
        })
        .catch(error => {
            document.getElementById("mensagem").innerText =
                "Erro ao criar grupo.";
            console.error(error);
        });
});

document.getElementById("indicacaoForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const grupoId = document.getElementById("grupoSelect").value;
    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricaoIndicacao").value;
    const categoria = document.getElementById("categoria").value;

    fetch("http://127.0.0.1:8000/indicacoes/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            titulo: titulo,
            descricao: descricao,
            categoria:categoria,
            grupo_id: parseInt(grupoId)
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("mensagemIndicacao").innerText =
            "Indicação criada com sucesso! ID: " + data.id;
    })
    .catch(error => {
        document.getElementById("mensagemIndicacao").innerText =
            "Erro ao criar indicação: " + error.message;
        console.error(error);
    });
});


function carregarGrupos() {
    fetch("http://127.0.0.1:8000/grupos/")
        .then(response => response.json())
        .then(data => {
            const lista = document.getElementById("listaGrupos");
            lista.innerHTML = "";

            data.forEach(grupo => {
                const item = document.createElement("li");
                item.innerText = grupo.nome + " - " + (grupo.descricao || "");
                lista.appendChild(item);
            });
        })
        .catch(error => console.error(error));
}
function carregarGruposNoSelect() {
    fetch("http://127.0.0.1:8000/grupos/")
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById("grupoSelect");
            select.innerHTML = "";

            data.forEach(grupo => {
                const option = document.createElement("option");
                option.value = grupo.id;
                option.text = grupo.nome;
                select.appendChild(option);
            });
        })
        .catch(error => console.error(error));
}

carregarGrupos();
carregarGruposNoSelect();