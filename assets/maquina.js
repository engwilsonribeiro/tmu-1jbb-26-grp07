let carrinho = [];

function adicionarCarrinho(nome, preco) {

    const produtoExistente = carrinho.find(
        produto => produto.nome === nome
    );

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    atualizarCarrinho();

    alert(`${nome} foi adicionado ao carrinho!`);
}


function removerProduto(nome) {

    carrinho = carrinho.filter(
        produto => produto.nome !== nome
    );

    atualizarCarrinho();
}


function atualizarCarrinho() {

    const lista = document.getElementById("listaCarrinho");
    const contador = document.getElementById("contador");
    const totalElemento = document.getElementById("total");

    lista.innerHTML = "";

    let quantidadeTotal = 0;
    let valorTotal = 0;

    if (carrinho.length === 0) {

        lista.innerHTML = `
            <p class="carrinho-vazio">
                Seu carrinho está vazio.
            </p>
        `;

    } else {

        carrinho.forEach(produto => {

            quantidadeTotal += produto.quantidade;

            valorTotal +=
                produto.preco * produto.quantidade;

            const item = document.createElement("div");

            item.classList.add("item-carrinho");

            item.innerHTML = `
                <div>
                    <strong>${produto.nome}</strong>

                    <p>
                        ${produto.quantidade}x
                        R$ ${produto.preco.toFixed(2).replace(".", ",")}
                    </p>
                </div>

                <button
                    onclick="removerProduto('${produto.nome}')">
                    Remover
                </button>
            `;

            lista.appendChild(item);
        });
    }

    if (contador) {
        contador.textContent = quantidadeTotal;
    }

    totalElemento.textContent =
        `R$ ${valorTotal.toFixed(2).replace(".", ",")}`;
}


function abrirCarrinho() {

    const modal =
        document.getElementById("modalCarrinho");

    modal.style.display = "flex";
}


function fecharCarrinho() {

    const modal =
        document.getElementById("modalCarrinho");

    modal.style.display = "none";
}


function finalizarCompra() {

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio!");

        return;
    }

    alert(
        "Compra finalizada com sucesso! Obrigado pela preferência 🌴"
    );

    carrinho = [];

    atualizarCarrinho();

    fecharCarrinho();
}


window.addEventListener("click", function(event) {

    const modal =
        document.getElementById("modalCarrinho");

    if (event.target === modal) {
        fecharCarrinho();
    }

});

document.addEventListener("DOMContentLoaded", function() {
    const inputBusca = document.getElementById("inputBusca");
    const btnBusca = document.getElementById("btnBusca");
    const produtos = Array.from(document.querySelectorAll(".product-card"));
    const mensagemSemResultado = document.getElementById("nenhumResultado");
    const btnCarrinho = document.getElementById("btnCarrinho");
    const btnVerMais = document.getElementById("btnVerMais");
    const conteudoVerMais = document.getElementById("conteudoVerMais");

    btnCarrinho.addEventListener("click", abrirCarrinho);

    btnVerMais.addEventListener("click", function() {
        conteudoVerMais.hidden = false;
        btnVerMais.hidden = true;
        conteudoVerMais.scrollIntoView({ behavior: "smooth" });
    });

    document.querySelectorAll(".comprar-btn").forEach(botao => {
        botao.addEventListener("click", function() {
            const card = botao.closest(".product-card");
            const nome = card.querySelector("h3").textContent.trim();
            const precoTexto = card.querySelector(".preco-final strong").textContent;
            const preco = Number(
                precoTexto.replace("R$", "").replace(".", "").replace(",", ".").trim()
            );

            adicionarCarrinho(nome, preco);
        });
    });

    function buscarProdutos() {
        const termo = inputBusca.value.trim().toLowerCase();
        let encontrou = false;

        produtos.forEach(produto => {
            const nome = produto.querySelector("h3")?.textContent.toLowerCase() || "";
            const descricao = produto.querySelector(".descricao")?.textContent.toLowerCase() || "";

            const mostrar =
                termo === "" ||
                nome.includes(termo) ||
                descricao.includes(termo);

            produto.style.display = mostrar ? "" : "none";

            if (mostrar) {
                encontrou = true;
            }
        });

        mensagemSemResultado.hidden = encontrou;
    }

    inputBusca.addEventListener("input", buscarProdutos);
    inputBusca.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            buscarProdutos();
        }
    });
    btnBusca.addEventListener("click", buscarProdutos);

    const cards = document.querySelectorAll(".product-card");
    const paleta = {
        "cor-1": "bag-dark",
        "cor-2": "bag-ivory",
        "cor-3": "bag-taupe",
        "cor-4": "bag-sand"
    };

    cards.forEach(card => {
        const bag = card.querySelector(".bag-wrap");
        const botoes = card.querySelectorAll(".cor");

        function aplicarCor(corAtiva) {
            const novaClasse = paleta[corAtiva] || "bag-dark";

            bag.classList.remove("bag-dark", "bag-taupe", "bag-ivory", "bag-sand");
            bag.classList.add(novaClasse);

            botoes.forEach(botao => {
                botao.classList.toggle("is-active", botao.classList.contains(corAtiva));
            });
        }

        botoes.forEach(botao => {
            botao.addEventListener("click", () => aplicarCor(botao.classList[1]));
        });

        const corInicial = card.querySelector(".cor-1");
        if (corInicial) {
            corInicial.classList.add("is-active");
        }
    });
});