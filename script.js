// ===== Formulário de compra =====
const ticketForm = document.getElementById("ticketForm");
const etapa1 = document.getElementById("etapa1");
const etapa2 = document.getElementById("etapa2");
const whatsappLink = document.getElementById("whatsappLink");
const copyBtn = document.getElementById("copyPixBtn");
const pixKey = document.getElementById("pixKey");
const sobreObra = document.querySelector(".sobre-obra-container");

ticketForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const estado = document.getElementById("estado").value.toUpperCase();
    const quantidade = parseInt(document.getElementById("quantidade").value.trim(), 10) || 0;

    document.querySelectorAll(".error-msg").forEach(el => el.innerText = "");
    let isValid = true;

    function setError(id, message) { document.getElementById(id).innerText = message; isValid = false; }

    if (nome.length < 3) setError("error-nome", "Informe um nome válido.");
    if (!/^\d{11,14}$/.test(cpf)) setError("error-cpf", "CPF/CNPJ inválido.");
    if (!/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(telefone)) setError("error-telefone", "Telefone inválido.");
    if (cidade.length < 2) setError("error-cidade", "Informe sua cidade.");
    if (!/^[A-Z]{2}$/.test(estado)) setError("error-estado", "UF inválido.");
    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 50) setError("error-quantidade", "Quantidade entre 1 e 50.");

    if (!isValid) return;

    const valorTotal = quantidade * 10;
    document.getElementById("valorTotal").innerText = valorTotal;

    const mensagem = `Olá! Quero confirmar a compra de ${quantidade} cupom(ns) físicos no valor total de R$${valorTotal}, em apoio à Obra Papa João XXIII.
Nome: ${nome}
CPF/CNPJ: ${cpf}
Telefone: ${telefone}
Cidade: ${cidade} - ${estado}

Segue o comprovante do PIX.`;

    whatsappLink.href = `https://wa.me/554432361231?text=${encodeURIComponent(mensagem)}`;

    etapa1.style.display = "none";
    if (sobreObra) sobreObra.style.display = "none";

    etapa2.style.display = "flex";
    etapa2.scrollIntoView({ behavior: 'smooth' });
});

// ===== Copiar PIX =====
if (copyBtn) {
    copyBtn.addEventListener("click", function () {
        navigator.clipboard.writeText(pixKey.innerText).then(() => {
            const msg = document.getElementById("error-pix");
            msg.innerText = "Chave PIX copiada!";
            msg.style.color = "#28a745";
            msg.style.opacity = "1";
            setTimeout(() => { msg.innerText = ""; }, 3000);
        }).catch(() => {
            const msg = document.getElementById("error-pix");
            msg.innerText = "Erro ao copiar PIX.";
            msg.style.color = "#d93025";
        });
    });
}

