/* =====================================================
   CARRINHO
===================================================== */

let carrinho = [];


/* ADICIONAR PRODUTO */

function adicionarCarrinho(nome, preco) {

    let produto = carrinho.find(
        item => item.nome === nome
    );

    if (produto) {

        produto.quantidade++;

    } else {

        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });

    }

    atualizarCarrinho();

    alert(nome + " foi adicionado ao carrinho!");
}


/* ATUALIZAR CARRINHO */

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

        carrinho.forEach(function(produto, index) {

            quantidadeTotal += produto.quantidade;

            valorTotal +=
                produto.preco * produto.quantidade;


            const item = document.createElement("div");

            item.className = "item-carrinho";


            item.innerHTML = `

                <div>

                    <h3>
                        ${produto.nome}
                    </h3>

                    <p>
                        ${produto.quantidade}x
                        R$ ${produto.preco
                            .toFixed(2)
                            .replace(".", ",")}
                    </p>

                </div>

                <button
                    class="remover"
                    onclick="removerProduto(${index})"
                >
                    Remover
                </button>

            `;


            lista.appendChild(item);

        });

    }


    contador.textContent = quantidadeTotal;


    totalElemento.textContent =
        "R$ " +
        valorTotal
            .toFixed(2)
            .replace(".", ",");

}


/* REMOVER PRODUTO */

function removerProduto(index) {

    carrinho.splice(index, 1);

    atualizarCarrinho();

}


/* ABRIR CARRINHO */

function abrirCarrinho() {

    document
        .getElementById("modalCarrinho")
        .classList.add("aberto");

}


/* FECHAR CARRINHO */

function fecharCarrinho() {

    document
        .getElementById("modalCarrinho")
        .classList.remove("aberto");

}


/* FINALIZAR COMPRA */

function finalizarCompra() {

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio!");

        return;

    }


    alert(
        "Compra finalizada com sucesso! 🌴"
    );


    carrinho = [];

    atualizarCarrinho();

    fecharCarrinho();

}


/* =====================================================
   BUSCA
===================================================== */

function abrirBusca() {

    const barra =
        document.getElementById("barraBusca");

    barra.classList.add("ativa");

    document
        .getElementById("campoBusca")
        .focus();

}


function fecharBusca() {

    document
        .getElementById("barraBusca")
        .classList.remove("ativa");

}


/* BUSCAR PRODUTOS */

function buscarProdutos() {

    const texto =
        document
            .getElementById("campoBusca")
            .value
            .toLowerCase()
            .trim();


    const produtos =
        document.querySelectorAll(".produto");


    let encontrou = false;


    produtos.forEach(function(produto) {

        const nome =
            produto
                .dataset
                .nome
                .toLowerCase();


        if (nome.includes(texto)) {

            produto.style.display = "";

            encontrou = true;

        } else {

            produto.style.display = "none";

        }

    });


    document
        .getElementById("semResultado")
        .style.display =
            encontrou ? "none" : "block";

}


/* =====================================================
   FILTRO POR CATEGORIA
===================================================== */

function filtrarCategoria(categoria) {

    const produtos =
        document.querySelectorAll(".produto");


    let encontrou = false;


    produtos.forEach(function(produto) {

        if (
            produto.dataset.categoria === categoria
        ) {

            produto.style.display = "";

            encontrou = true;

        } else {

            produto.style.display = "none";

        }

    });


    document
        .getElementById("semResultado")
        .style.display =
            encontrou ? "none" : "block";


    document
        .getElementById("produtos")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* MOSTRAR TODOS */

function mostrarTodos() {

    const produtos =
        document.querySelectorAll(".produto");


    produtos.forEach(function(produto) {

        produto.style.display = "";

    });


    document
        .getElementById("semResultado")
        .style.display = "none";

}


/* =====================================================
   NEWSLETTER
===================================================== */

function inscrever(event) {

    event.preventDefault();


    const email =
        document
            .getElementById("email")
            .value;


    alert(
        "Obrigado! " +
        email +
        " foi cadastrado com sucesso. 🌊"
    );


    document
        .getElementById("email")
        .value = "";

}


/* =====================================================
   FECHAR MODAL CLICANDO FORA
===================================================== */

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "modalCarrinho"
            );


        if (event.target === modal) {

            fecharCarrinho();

        }

    }
);


/* =====================================================
   INICIAR
===================================================== */

atualizarCarrinho();