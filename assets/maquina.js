
// Cria uma lista vazia para armazenar os produtos adicionados ao carrinho
let carrinho = [];

// Função responsável por adicionar um produto ao carrinho
function adicionarCarrinho(nome, preco) {

    // Procura se o produto já existe no carrinho
    let produtoExistente = carrinho.find(produto => produto.nome === nome);

    // Se o produto já existir, aumenta sua quantidade
    if (produtoExistente) {
        produtoExistente.quantidade++;

    // Se não existir, adiciona um novo produto ao carrinho
    } else {
        carrinho.push({
            nome: nome, // Nome do produto
            preco: preco, // Preço do produto
            quantidade: 1 // Quantidade inicial
        });
    }

    // Atualiza as informações exibidas no carrinho
    atualizarCarrinho();

    // Mostra uma mensagem confirmando a adição
    alert(nome + " foi adicionado ao carrinho!");
}


// Função que atualiza os produtos, quantidades e valores do carrinho
function atualizarCarrinho() {

    // Busca os elementos do HTML pelos seus IDs
    let lista = document.getElementById("listaCarrinho");
    let contador = document.getElementById("contador");
    let total = document.getElementById("total");

    // Limpa a lista antes de mostrar os produtos novamente
    lista.innerHTML = "";

    // Cria uma variável para calcular o valor total
    let valorTotal = 0;

    // Cria uma variável para contar os produtos
    let quantidadeTotal = 0;

    // Verifica se o carrinho está vazio
    if (carrinho.length === 0) {

        // Mostra uma mensagem caso não existam produtos
        lista.innerHTML = "<p>Seu carrinho está vazio.</p>";

    } else {

        // Percorre todos os produtos que estão no carrinho
        carrinho.forEach((produto, index) => {

            // Calcula o subtotal de cada produto
            let subtotal = produto.preco * produto.quantidade;

            // Soma o subtotal ao valor total da compra
            valorTotal += subtotal;

            // Soma a quantidade de produtos
            quantidadeTotal += produto.quantidade;

            // Cria um elemento HTML para representar o produto
            let item = document.createElement("div");

            // Adiciona uma classe CSS ao elemento
            item.classList.add("item-carrinho");

            // Insere as informações do produto dentro do elemento
            item.innerHTML = `
                <div>
                    <strong>${produto.nome}</strong>
                    <p>Quantidade: ${produto.quantidade}</p>
                    <p>R$ ${subtotal.toFixed(2).replace(".", ",")}</p>
                </div>

                <button onclick="removerProduto(${index})">
                    Remover
                </button>
            `;

            // Adiciona o produto à lista do carrinho
            lista.appendChild(item);
        });
    }

    // Atualiza o número de produtos mostrado no ícone do carrinho
    contador.textContent = quantidadeTotal;

    // Atualiza o valor total da compra, formatando as casas decimais
    total.textContent = "R$ " + valorTotal.toFixed(2).replace(".", ",");
}


// Função responsável por remover um produto do carrinho
function removerProduto(index) {

    // Remove o produto da posição indicada na lista
    carrinho.splice(index, 1);

    // Atualiza as informações do carrinho
    atualizarCarrinho();
}


// Função para abrir ou fechar o carrinho
function alternarCarrinho() {

    // Busca a janela do carrinho no HTML
    let modal = document.getElementById("modalCarrinho");

    // Alterna a classe "aberto", que controla a exibição pelo CSS
    modal.classList.toggle("aberto");
}


// Função para abrir o carrinho
function abrirCarrinho() {

    // Busca a janela do carrinho
    let modal = document.getElementById("modalCarrinho");

    // Adiciona a classe que mostra o carrinho
    modal.classList.add("aberto");
}


// Função para fechar o carrinho
function fecharCarrinho() {

    // Busca a janela do carrinho
    let modal = document.getElementById("modalCarrinho");

    // Remove a classe que mantém o carrinho aberto
    modal.classList.remove("aberto");
}


// Função responsável por finalizar a compra
function finalizarCompra() {

    // Verifica se o carrinho está vazio
    if (carrinho.length === 0) {

        // Mostra um aviso caso não existam produtos
        alert("Seu carrinho está vazio!");

        // Interrompe a função
        return;
    }

    // Mostra uma mensagem de confirmação
    alert("Compra finalizada com sucesso!");

    // Esvazia o carrinho após a compra
    carrinho = [];

    // Atualiza as informações do carrinho
    atualizarCarrinho();

    // Fecha a janela do carrinho
    fecharCarrinho();
}


// Função para abrir a barra de pesquisa
function abrirBusca() {

    // Busca a área de pesquisa no HTML
    let busca = document.getElementById("barraBusca");

    // Adiciona a classe que exibe a barra de pesquisa
    busca.classList.add("aberto");

    // Coloca o cursor automaticamente no campo de pesquisa
    document.getElementById("campoBusca").focus();
}


// Função para fechar a barra de pesquisa
function fecharBusca() {

    // Busca a área de pesquisa no HTML
    let busca = document.getElementById("barraBusca");

    // Remove a classe que deixa a pesquisa aberta
    busca.classList.remove("aberto");

    // Limpa o conteúdo digitado no campo de pesquisa
    document.getElementById("campoBusca").value = "";

    // Mostra novamente todos os produtos
    pesquisarProdutos();
}


// Função que pesquisa produtos pelo nome
function pesquisarProdutos() {

    // Pega o texto digitado no campo de pesquisa
    let texto = document.getElementById("campoBusca").value.toLowerCase().trim();

    // Busca todos os produtos que aparecem na página
    let produtos = document.querySelectorAll(".produto");

    // Busca a mensagem exibida quando nenhum produto é encontrado
    let semResultado = document.getElementById("semResultado");

    // Variável que conta quantos produtos foram encontrados
    let encontrados = 0;

    // Percorre todos os produtos da página
    produtos.forEach(produto => {

        // Pega o nome do produto armazenado no atributo data-nome
        let nome = produto.dataset.nome.toLowerCase();

        // Verifica se o nome contém o texto pesquisado
        if (nome.includes(texto)) {

            // Mostra o produto caso ele corresponda à pesquisa
            produto.style.display = "";

            // Aumenta a quantidade de resultados encontrados
            encontrados++;

        } else {

            // Esconde o produto caso ele não corresponda à pesquisa
            produto.style.display = "none";
        }
    });

    // Verifica se nenhum produto foi encontrado
    if (encontrados === 0) {

        // Mostra a mensagem de que não existem resultados
        semResultado.style.display = "block";

    } else {

        // Esconde a mensagem quando existem resultados
        semResultado.style.display = "none";
    }
}


// Função para filtrar os produtos por categoria
function filtrarCategoria(categoria) {

    // Busca todos os produtos da página
    let produtos = document.querySelectorAll(".produto");

    // Percorre todos os produtos
    produtos.forEach(produto => {

        // Verifica se o produto pertence à categoria selecionada
        if (
            categoria === "todos" ||
            produto.dataset.categoria === categoria
        ) {

            // Mostra o produto que pertence à categoria
            produto.style.display = "";

        } else {

            // Esconde os produtos de outras categorias
            produto.style.display = "none";
        }
    });

    // Leva a página suavemente até a área dos produtos
    document.getElementById("produtos").scrollIntoView({
        behavior: "smooth"
    });
}


// Função responsável pelo formulário da newsletter
function cadastrarNewsletter(event) {

    // Impede que a página seja recarregada ao enviar o formulário
    event.preventDefault();

    // Pega o e-mail digitado pelo usuário
    let email = document.getElementById("emailNewsletter").value;

    // Verifica se o campo de e-mail não está vazio
    if (email.trim() !== "") {

        // Mostra uma mensagem de confirmação
        alert("E-mail cadastrado com sucesso!");

        // Limpa o campo depois do cadastro
        document.getElementById("emailNewsletter").value = "";
    }
}


// Evento responsável por fechar o carrinho ao clicar fora dele
window.addEventListener("click", function(event) {

    // Busca a janela do carrinho
    let modal = document.getElementById("modalCarrinho");

    // Verifica se o clique aconteceu diretamente no fundo do modal
    if (event.target === modal) {

        // Fecha o carrinho
        fecharCarrinho();
    }
});


// Executa a atualização assim que o JavaScript é carregado
// Isso garante que o contador e o total comecem zerados
atualizarCarrinho();
