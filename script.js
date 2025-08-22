// Configurações globais
let carrinho = [];
let configuracoes = {
    paleta: 'original',
    fonte: 'media',
    layout: 'container'
};

// Estado de consentimento de cookies
let cookieConsent = null;

// Paletas de cores pré-definidas
const paletas = {
    original: {
        primary: '#FF4B2B',
        secondary: '#1F1F1F',
        text: '#FFFFFF',
        background: '#000000',
        accent: '#FF6B4B'
    },
    verde: {
        primary: '#28a745',
        secondary: '#1a1a1a',
        text: '#f8f9fa',
        background: '#212529',
        accent: '#20c997'
    },
    azul: {
        primary: '#007bff',
        secondary: '#1a1a1a',
        text: '#f8f9fa',
        background: '#212529',
        accent: '#0056b3'
    },
    roxo: {
        primary: '#6f42c1',
        secondary: '#1a1a1a',
        text: '#f8f9fa',
        background: '#212529',
        accent: '#5a2d91'
    },
    laranja: {
        primary: '#fd7e14',
        secondary: '#1a1a1a',
        text: '#f8f9fa',
        background: '#212529',
        accent: '#e55a00'
    },
    rosa: {
        primary: '#e83e8c',
        secondary: '#1a1a1a',
        text: '#f8f9fa',
        background: '#212529',
        accent: '#c71e6b'
    }
};

// Funções de configuração
function aplicarPaleta(paleta) {
    const cores = paletas[paleta];
    if (cores) {
        document.documentElement.style.setProperty('--primary-color', cores.primary);
        document.documentElement.style.setProperty('--secondary-color', cores.secondary);
        document.documentElement.style.setProperty('--text-color', cores.text);
        document.documentElement.style.setProperty('--background-color', cores.background);
        document.documentElement.style.setProperty('--accent-color', cores.accent);
        
        // Atualizar Bootstrap
        document.documentElement.style.setProperty('--bs-primary', cores.primary);
        document.documentElement.style.setProperty('--bs-primary-rgb', hexToRgb(cores.primary));
    }
}

function aplicarFonte(tamanho) {
    const tamanhos = {
        pequena: '0.9rem',
        media: '1rem',
        grande: '1.1rem'
    };
    
    document.documentElement.style.setProperty('--font-size-base', tamanhos[tamanho]);
    document.body.setAttribute('data-font-size', tamanho);
}

function aplicarLayout(tipo) {
    document.body.setAttribute('data-layout', tipo);
    document.body.setAttribute('data-layout-type', tipo);
}

function aplicarPaletaCustomizada() {
    const corPrimaria = document.getElementById('corPrimaria')?.value;
    const corSecundaria = document.getElementById('corSecundaria')?.value;
    const corTexto = document.getElementById('corTexto')?.value;
    const corFundo = document.getElementById('corFundo')?.value;
    
    if (corPrimaria && corSecundaria && corTexto && corFundo) {
        document.documentElement.style.setProperty('--primary-color', corPrimaria);
        document.documentElement.style.setProperty('--secondary-color', corSecundaria);
        document.documentElement.style.setProperty('--text-color', corTexto);
        document.documentElement.style.setProperty('--background-color', corFundo);
        document.documentElement.style.setProperty('--accent-color', corPrimaria);
        
        // Atualizar Bootstrap
        document.documentElement.style.setProperty('--bs-primary', corPrimaria);
        document.documentElement.style.setProperty('--bs-primary-rgb', hexToRgb(corPrimaria));
    }
}

// Funções utilitárias
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
}

// Funções de consentimento de cookies
function verificarConsentimentoCookies() {
    const consent = localStorage.getItem('brasaburger_cookie_consent');
    if (consent) {
        cookieConsent = JSON.parse(consent);
        return cookieConsent.accepted;
    }
    return false;
}

function salvarConsentimentoCookies(aceito) {
    cookieConsent = {
        accepted: aceito,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('brasaburger_cookie_consent', JSON.stringify(cookieConsent));
}

function aceitarCookies() {
    salvarConsentimentoCookies(true);
    esconderBannerCookies();
    // Carregar configurações após aceitar cookies
    carregarConfiguracoes();
}

function recusarCookies() {
    salvarConsentimentoCookies(false);
    esconderBannerCookies();
    // Limpar configurações salvas
    localStorage.removeItem('brasaburger_configuracoes');
}

function esconderBannerCookies() {
    const banner = document.getElementById('cookieBanner');
    if (banner) {
        banner.style.display = 'none';
    }
}

function mostrarBannerCookies() {
    // Remover toast antigo se existir
    const oldToast = document.getElementById('cookieToast');
    if (oldToast) {
        oldToast.remove();
    }
    
    // Criar banner de cookies conforme LGPD
    const banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <div class="cookie-content">
            <div class="cookie-text">
                <h5><i class="fas fa-cookie-bite me-2"></i>Política de Cookies</h5>
                <p>Este site utiliza cookies para melhorar sua experiência e personalizar o conteúdo. 
                Ao continuar navegando, você concorda com nossa política de privacidade.</p>
            </div>
            <div class="cookie-buttons">
                <button class="btn btn-outline-light btn-sm" onclick="recusarCookies()">
                    <i class="fas fa-times me-1"></i>Recusar
                </button>
                <button class="btn btn-primary btn-sm" onclick="aceitarCookies()">
                    <i class="fas fa-check me-1"></i>Aceitar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(banner);
    
    // Mostrar banner após um pequeno delay
    setTimeout(() => {
        banner.style.display = 'flex';
    }, 1000);
}

// Funções de persistência
function salvarConfiguracoes() {
    // Só salvar se o usuário aceitou os cookies
    if (verificarConsentimentoCookies()) {
        localStorage.setItem('brasaburger_configuracoes', JSON.stringify(configuracoes));
        mostrarNotificacao('Configurações salvas com sucesso!', 'success');
    } else {
        mostrarNotificacao('É necessário aceitar os cookies para salvar configurações!', 'warning');
    }
}

function carregarConfiguracoes() {
    // Só carregar se o usuário aceitou os cookies
    if (verificarConsentimentoCookies()) {
        const salvas = localStorage.getItem('brasaburger_configuracoes');
        if (salvas) {
            configuracoes = JSON.parse(salvas);
            aplicarConfiguracoes();
        }
    }
}

function aplicarConfiguracoes() {
    aplicarPaleta(configuracoes.paleta);
    aplicarFonte(configuracoes.fonte);
    aplicarLayout(configuracoes.layout);
    
    // Atualizar seleções visuais apenas se estiver na página de configurações
    if (document.querySelector('.paleta-option')) {
        atualizarSelecoesVisuais();
    }
}

function resetarConfiguracoes() {
    configuracoes = {
        paleta: 'original',
        fonte: 'media',
        layout: 'container'
    };
    aplicarConfiguracoes();
    salvarConfiguracoes();
    mostrarNotificacao('Configurações resetadas para o padrão!', 'info');
}

function atualizarSelecoesVisuais() {
    // Atualizar paletas
    document.querySelectorAll('.paleta-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.paleta === configuracoes.paleta) {
            option.classList.add('active');
        }
    });
    
    // Atualizar fontes
    document.querySelectorAll('.fonte-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.fonte === configuracoes.fonte) {
            option.classList.add('active');
        }
    });
    
    // Atualizar layouts
    document.querySelectorAll('.layout-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.layout === configuracoes.layout) {
            option.classList.add('active');
        }
    });
}

// Funções de notificação
function mostrarNotificacao(mensagem, tipo = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${tipo} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${mensagem}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    const container = document.querySelector('.toast-container');
    if (container) {
        container.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Remover toast após ser fechado
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
}

// Funções do carrinho
function atualizarCarrinho() {
    const itensCarrinho = document.getElementById('itens-carrinho');
    const carrinhoTotal = document.getElementById('carrinho-total');
    const carrinhoContador = document.getElementById('carrinhoContador');
    
    if (!itensCarrinho) return;
    
    itensCarrinho.innerHTML = '';
    let total = 0;

    carrinho.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item-carrinho');
        itemElement.innerHTML = `
            <div>
                <h6 class="mb-0">${item.nome}</h6>
                <small class="text-muted">R$ ${(item.preco * item.quantidade).toFixed(2)}</small>
            </div>
            <div class="d-flex align-items-center gap-2">
                <button class="btn btn-sm btn-outline-primary" onclick="alterarQuantidade('${item.nome}', -1)">-</button>
                <span class="badge bg-primary">${item.quantidade}</span>
                <button class="btn btn-sm btn-outline-primary" onclick="alterarQuantidade('${item.nome}', 1)">+</button>
            </div>
        `;
        itensCarrinho.appendChild(itemElement);
        total += item.preco * item.quantidade;
    });

    if (carrinhoTotal) carrinhoTotal.textContent = total.toFixed(2);
    if (carrinhoContador) carrinhoContador.textContent = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    
    // Atualizar resumo do pedido no modal
    const itensPedido = document.getElementById('itens-pedido');
    const totalPedido = document.getElementById('total-pedido');
    
    if (itensPedido && totalPedido) {
        itensPedido.innerHTML = carrinho.map(item => `
            <div class="d-flex justify-content-between mb-2">
                <span>${item.nome} x${item.quantidade}</span>
                <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
            </div>
        `).join('');
        
        totalPedido.textContent = total.toFixed(2);
    }
}

function alterarQuantidade(nome, delta) {
    const item = carrinho.find(i => i.nome === nome);
    if (item) {
        item.quantidade += delta;
        if (item.quantidade <= 0) {
            carrinho = carrinho.filter(i => i.nome !== nome);
        }
        atualizarCarrinho();
    }
}

function mostrarCarrinho() {
    const carrinhoLateral = document.getElementById('carrinhoLateral');
    if (carrinhoLateral) {
        carrinhoLateral.classList.add('aberto');
    }
}

function fecharCarrinho() {
    const carrinhoLateral = document.getElementById('carrinhoLateral');
    if (carrinhoLateral) {
        carrinhoLateral.classList.remove('aberto');
    }
}

function adicionarAoCarrinho(nome, preco) {
    const item = {
        nome: nome,
        preco: parseFloat(preco),
        quantidade: 1
    };
    
    const itemExistente = carrinho.find(i => i.nome === item.nome);
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push(item);
    }
    
    atualizarCarrinho();
    mostrarCarrinho();
    mostrarNotificacao(`${nome} adicionado ao carrinho!`, 'success');
}

// Funções de validação
function validarFormulario() {
    const nome = document.getElementById('nome');
    const telefone = document.getElementById('telefone');
    const rua = document.getElementById('rua');
    const numero = document.getElementById('numero');
    const bairro = document.getElementById('bairro');
    
    let isValid = true;

    // Validar nome
    if (!nome || nome.value.length < 3) {
        mostrarErro(nome, 'Nome deve ter pelo menos 3 caracteres');
        isValid = false;
    } else {
        limparErro(nome);
    }

    // Validar telefone
    if (!telefone) return isValid;
    
    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!telefoneRegex.test(telefone.value)) {
        mostrarErro(telefone, 'Telefone inválido');
        isValid = false;
    } else {
        limparErro(telefone);
    }

    // Validar endereço
    if (!rua || !numero || !bairro) return isValid;
    
    if (!rua.value || !numero.value || !bairro.value) {
        mostrarErro(rua, 'Endereço completo é obrigatório');
        isValid = false;
    } else {
        limparErro(rua);
    }

    return isValid;
}

function mostrarErro(input, mensagem) {
    if (!input) return;
    
    const formGroup = input.closest('.mb-3');
    if (formGroup) {
        formGroup.classList.add('has-error');
        
        let errorSpan = formGroup.querySelector('.error-message');
        if (!errorSpan) {
            errorSpan = document.createElement('div');
            errorSpan.className = 'error-message text-danger mt-1';
            formGroup.appendChild(errorSpan);
        }
        errorSpan.textContent = mensagem;
    }
}

function limparErro(input) {
    if (!input) return;
    
    const formGroup = input.closest('.mb-3');
    if (formGroup) {
        formGroup.classList.remove('has-error');
        const errorSpan = formGroup.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.remove();
        }
    }
}

// Funções de máscara
function aplicarMascaraTelefone(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        input.value = value;
    }
}

// Inicialização global
function inicializarSite() {
    // Verificar consentimento de cookies
    if (!verificarConsentimentoCookies()) {
        mostrarBannerCookies();
    } else {
        // Se já aceitou cookies, carregar configurações
        carregarConfiguracoes();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar site
    inicializarSite();
    
    // Event listeners para configurações (apenas na página de configurações)
    document.querySelectorAll('.paleta-option').forEach(option => {
        option.addEventListener('click', function() {
            const paleta = this.dataset.paleta;
            configuracoes.paleta = paleta;
            aplicarPaleta(paleta);
            
            // Atualizar seleções visuais
            document.querySelectorAll('.paleta-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    document.querySelectorAll('.fonte-option').forEach(option => {
        option.addEventListener('click', function() {
            const fonte = this.dataset.fonte;
            configuracoes.fonte = fonte;
            aplicarFonte(fonte);
            
            // Atualizar seleções visuais
            document.querySelectorAll('.fonte-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    document.querySelectorAll('.layout-option').forEach(option => {
        option.addEventListener('click', function() {
            const layout = this.dataset.layout;
            configuracoes.layout = layout;
            aplicarLayout(layout);
            
            // Atualizar seleções visuais
            document.querySelectorAll('.layout-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Botão de paleta customizada
    const btnAplicarCustom = document.getElementById('aplicarCustom');
    if (btnAplicarCustom) {
        btnAplicarCustom.addEventListener('click', function() {
            aplicarPaletaCustomizada();
            mostrarNotificacao('Paleta customizada aplicada!', 'success');
        });
    }
    
    // Botões de ação
    const btnSalvar = document.getElementById('salvarConfiguracoes');
    if (btnSalvar) {
        btnSalvar.addEventListener('click', salvarConfiguracoes);
    }
    
    const btnResetar = document.getElementById('resetarConfiguracoes');
    if (btnResetar) {
        btnResetar.addEventListener('click', resetarConfiguracoes);
    }
    
    // Event listeners do carrinho
    const carrinhoBtn = document.getElementById('carrinhoBtn');
    if (carrinhoBtn) {
        carrinhoBtn.addEventListener('click', mostrarCarrinho);
    }
    
    const fecharCarrinhoBtn = document.getElementById('fecharCarrinho');
    if (fecharCarrinhoBtn) {
        fecharCarrinhoBtn.addEventListener('click', fecharCarrinho);
    }
    
    // Botões de adicionar ao carrinho
    document.querySelectorAll('[data-preco]').forEach(btn => {
        btn.addEventListener('click', function() {
            const nome = this.dataset.nome || this.closest('.card').querySelector('.card-title').textContent;
            const preco = this.dataset.preco;
            adicionarAoCarrinho(nome, preco);
        });
    });
    
    // Botão finalizar pedido
    const btnFinalizar = document.getElementById('btnFinalizar');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', function() {
            if (carrinho.length === 0) {
                mostrarNotificacao('Adicione itens ao carrinho primeiro!', 'warning');
                return;
            }
            
            const modal = new bootstrap.Modal(document.getElementById('modalFormulario'));
            modal.show();
        });
    }
    
    // Botão confirmar pedido
    const btnConfirmarPedido = document.getElementById('btnConfirmarPedido');
    if (btnConfirmarPedido) {
        btnConfirmarPedido.addEventListener('click', function() {
            if (!validarFormulario()) {
                mostrarNotificacao('Por favor, corrija os erros no formulário!', 'warning');
                return;
            }
            
            mostrarNotificacao('Pedido finalizado com sucesso!', 'success');
            
            // Limpar carrinho
            carrinho = [];
            atualizarCarrinho();
            fecharCarrinho();
            
            // Fechar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalFormulario'));
            if (modal) {
                modal.hide();
            }
        });
    }
    
    // Máscara para telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function() {
            aplicarMascaraTelefone(this);
        });
    }
    
    // Fechar carrinho ao clicar fora
    document.addEventListener('click', function(e) {
        const carrinhoLateral = document.getElementById('carrinhoLateral');
        const carrinhoBtn = document.getElementById('carrinhoBtn');
        
        if (carrinhoLateral && carrinhoBtn) {
            if (!carrinhoLateral.contains(e.target) && !carrinhoBtn.contains(e.target)) {
                fecharCarrinho();
            }
        }
    });
    
    // Atualizar carrinho inicial
    atualizarCarrinho();
});

// Funções globais para uso em HTML
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.alterarQuantidade = alterarQuantidade;
window.mostrarCarrinho = mostrarCarrinho;
window.fecharCarrinho = fecharCarrinho;
window.aplicarPaleta = aplicarPaleta;
window.aplicarFonte = aplicarFonte;
window.aplicarLayout = aplicarLayout;
window.salvarConfiguracoes = salvarConfiguracoes;
window.resetarConfiguracoes = resetarConfiguracoes;
window.aceitarCookies = aceitarCookies;
window.recusarCookies = recusarCookies; 