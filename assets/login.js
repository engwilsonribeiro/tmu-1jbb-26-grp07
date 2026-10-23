document.addEventListener('DOMContentLoaded', function() {
    const campoNome = document.getElementById('nome');
    const tituloNome = document.getElementById('titulo-nome');
    const avatarInicial = document.getElementById('avatar-inicial');
    const loginPanel = document.getElementById('login-panel');
    const cadastroPanel = document.getElementById('cadastro-panel');
    const recuperacaoPanel = document.getElementById('recuperacao-panel');
    const perfilPanel = document.getElementById('perfil-panel');
    let emailAtivo = '';

    function obterUsuario() {
        return JSON.parse(localStorage.getItem('dadosUsuario')) || {
            nome: '',
            email: '',
            telefone: ''
        };
    }

    function chaveEmail(email) {
        return email.trim().toLowerCase();
    }

    function obterPerfis() {
        const perfis = JSON.parse(localStorage.getItem('perfisUsuarios') || '{}');
        if (!perfis || typeof perfis !== 'object' || Array.isArray(perfis)) {
            throw new Error('Os perfis salvos estão inválidos.');
        }
        return perfis;
    }

    function mostrarPainel(painel) {
        [loginPanel, cadastroPanel, recuperacaoPanel, perfilPanel].forEach(function(item) {
            item.hidden = item !== painel;
        });
    }

    function atualizarIdentificacao(nome) {
        tituloNome.textContent = nome || 'Meu Perfil';
        avatarInicial.textContent = nome
            ? nome.trim().split(/\s+/).map(function(parte) {
                return parte[0];
            }).join('').slice(0, 2).toUpperCase()
            : 'U';
    }

    function mostrarPerfil(usuario) {
        emailAtivo = chaveEmail(usuario.email);
        campoNome.value = usuario.nome || '';
        document.getElementById('email').value = usuario.email || '';
        document.getElementById('telefone').value = usuario.telefone || '';
        atualizarIdentificacao(usuario.nome);
        mostrarPainel(perfilPanel);
    }

    function limparMensagens() {
        ['mensagem-login', 'mensagem-cadastro', 'mensagem-recuperacao'].forEach(function(id) {
            document.getElementById(id).textContent = '';
        });
    }

    if (localStorage.getItem('usuarioLogado') === 'true') {
        mostrarPerfil(obterUsuario());
    } else {
        mostrarPainel(loginPanel);
    }

    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const chave = chaveEmail(email);
        const senha = document.getElementById('login-senha').value;

        try {
            const usuario = obterPerfis()[chave];
            if (!usuario || !usuario.senha || usuario.senha !== senha) {
                document.getElementById('mensagem-login').textContent =
                    'E-mail ou senha incorretos. Confira os dados ou crie uma conta.';
                return;
            }

            const dadosUsuario = {
                nome: usuario.nome || '',
                email: usuario.email || email,
                telefone: usuario.telefone || ''
            };
            localStorage.setItem('dadosUsuario', JSON.stringify(dadosUsuario));
            localStorage.setItem('usuarioLogado', 'true');
            limparMensagens();
            mostrarPerfil(dadosUsuario);
        } catch (error) {
            document.getElementById('mensagem-login').textContent =
                'Não foi possível validar o login. Tente novamente.';
            console.error('Falha ao iniciar sessão:', error);
        }
    });

    document.getElementById('abrir-cadastro').addEventListener('click', function() {
        limparMensagens();
        mostrarPainel(cadastroPanel);
    });

    document.getElementById('abrir-recuperacao').addEventListener('click', function() {
        limparMensagens();
        mostrarPainel(recuperacaoPanel);
    });

    document.querySelectorAll('[data-voltar-login]').forEach(function(botao) {
        botao.addEventListener('click', function() {
            limparMensagens();
            mostrarPainel(loginPanel);
        });
    });

    document.getElementById('cadastro-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('cadastro-email').value.trim();
        const chave = chaveEmail(email);
        const usuario = {
            nome: document.getElementById('cadastro-nome').value.trim(),
            email: email,
            telefone: '',
            senha: document.getElementById('cadastro-senha').value
        };

        try {
            const perfis = obterPerfis();
            if (perfis[chave]) {
                document.getElementById('mensagem-cadastro').textContent =
                    'Já existe uma conta com este e-mail. Tente entrar ou redefinir a senha.';
                return;
            }

            perfis[chave] = usuario;
            localStorage.setItem('perfisUsuarios', JSON.stringify(perfis));
            localStorage.setItem('dadosUsuario', JSON.stringify({
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone
            }));
            localStorage.setItem('usuarioLogado', 'true');
            limparMensagens();
            mostrarPerfil(usuario);
        } catch (error) {
            document.getElementById('mensagem-cadastro').textContent =
                'Não foi possível criar a conta. Tente novamente.';
            console.error('Falha ao criar conta:', error);
        }
    });

    document.getElementById('recuperacao-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('recuperacao-email').value.trim();
        const chave = chaveEmail(email);

        try {
            const perfis = obterPerfis();
            const usuario = perfis[chave];
            if (!usuario) {
                document.getElementById('mensagem-recuperacao').textContent =
                    'Não encontramos uma conta com esse e-mail.';
                return;
            }

            usuario.senha = document.getElementById('recuperacao-senha').value;
            localStorage.setItem('perfisUsuarios', JSON.stringify(perfis));
            document.getElementById('login-email').value = email;
            document.getElementById('login-senha').value = '';
            limparMensagens();
            document.getElementById('mensagem-login').textContent =
                'Senha redefinida. Entre com a nova senha.';
            mostrarPainel(loginPanel);
        } catch (error) {
            document.getElementById('mensagem-recuperacao').textContent =
                'Não foi possível redefinir a senha. Tente novamente.';
            console.error('Falha ao redefinir senha:', error);
        }
    });

    document.getElementById('perfil-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const dadosAtualizados = {
            nome: campoNome.value.trim(),
            email: document.getElementById('email').value.trim(),
            telefone: document.getElementById('telefone').value.trim()
        };
        const novaChaveEmail = chaveEmail(dadosAtualizados.email);

        try {
            const perfis = obterPerfis();
            const usuarioSalvo = perfis[emailAtivo];
            if (novaChaveEmail !== emailAtivo && perfis[novaChaveEmail]) {
                document.getElementById('mensagem-salvo').textContent =
                    'Este e-mail já está associado a outro perfil.';
                return;
            }

            if (emailAtivo && novaChaveEmail !== emailAtivo) {
                delete perfis[emailAtivo];
            }
            perfis[novaChaveEmail] = Object.assign({}, dadosAtualizados, {
                senha: usuarioSalvo && usuarioSalvo.senha
            });
            localStorage.setItem('perfisUsuarios', JSON.stringify(perfis));
            localStorage.setItem('dadosUsuario', JSON.stringify(dadosAtualizados));
            emailAtivo = novaChaveEmail;
            atualizarIdentificacao(dadosAtualizados.nome);
            document.getElementById('mensagem-salvo').textContent = 'Alterações salvas.';
        } catch (error) {
            document.getElementById('mensagem-salvo').textContent =
                'Não foi possível salvar as alterações.';
            console.error('Falha ao salvar os dados do perfil:', error);
        }
    });

    document.getElementById('btn-logout').addEventListener('click', function() {
        localStorage.removeItem('usuarioLogado');
        limparMensagens();
        mostrarPainel(loginPanel);
    });
});
