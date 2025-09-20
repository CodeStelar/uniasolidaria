// ===== Formulário de compra =====
document.getElementById("ticketForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Captura os valores do formulário
    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const estado = document.getElementById("estado").value.toUpperCase();
    const quantidade = parseInt(document.getElementById("quantidade").value.trim(), 10) || 0;

    // Limpa mensagens de erro
    document.querySelectorAll(".error-msg").forEach(el => {
        el.innerText = "";
    });

    let isValid = true;

    // Função para mostrar erro
    function setError(id, message) {
        document.getElementById(id).innerText = message;
        isValid = false;
    }

    // Validações
    if (nome.length < 3) setError("error-nome", "Informe um nome válido.");
    if (!/^\d{11,14}$/.test(cpf)) setError("error-cpf", "CPF/CNPJ inválido.");
    if (!/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(telefone)) setError("error-telefone", "Telefone inválido.");
    if (cidade.length < 2) setError("error-cidade", "Informe sua cidade.");
    if (!/^[A-Z]{2}$/.test(estado)) setError("error-estado", "UF inválido.");
    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 50) {
        setError("error-quantidade", "Quantidade entre 1 e 50.");
    }

    // Se houver erro, para aqui
    if (!isValid) return;

    // Calcula valor total
    const valorTotal = quantidade * 10;
    document.getElementById("valorTotal").innerText = valorTotal;

    // Gera link do WhatsApp (telefone da obra atualizado)
    const mensagem = `Olá! Quero confirmar a compra de ${quantidade} cupom(ns) físicos no valor total de R$${valorTotal}, em apoio à Obra Papa João XXIII.%0A%0A*Nome:* ${nome}%0A*CPF/CNPJ:* ${cpf}%0A*Telefone:* ${telefone}%0A*Cidade:* ${cidade} - ${estado}%0A%0ASegue o comprovante do PIX.`;
    const linkWhats = `https://wa.me/554432361231?text=${mensagem}`;
    document.getElementById("whatsappLink").href = linkWhats;

    // Mostra a etapa 2 (PIX) e oculta a etapa 1
    document.getElementById("etapa1").style.display = "none";
    const etapa2 = document.getElementById("etapa2");
    etapa2.style.display = "flex";

    const sobreObra = document.querySelector(".sobre-obra-container");
    if (sobreObra) sobreObra.style.display = "none";
});

// ===== Copiar PIX =====
const copyBtn = document.getElementById("copyPixBtn");
if (copyBtn) {
    copyBtn.addEventListener("click", function () {
        const pixKey = document.getElementById("pixKey").innerText;
        navigator.clipboard.writeText(pixKey).then(() => {
            const msg = document.getElementById("error-pix");
            msg.innerText = "Chave PIX copiada!";
            msg.style.color = "#28a745";
            msg.style.opacity = "1";

            // Mensagem some depois de 3 segundos
            setTimeout(() => {
                msg.innerText = "";
            }, 3000);
        }).catch(() => {
            const msg = document.getElementById("error-pix");
            msg.innerText = "Erro ao copiar PIX.";
            msg.style.color = "#d93025";
        });
    });
}
