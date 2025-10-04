// ===== Função de máscara =====
function aplicarMascara(input, tipo) {
  let valor = input.value.replace(/\D/g, ""); // remove tudo que não é número
  if (tipo === "cpf") {
    if (valor.length > 11) valor = valor.slice(0, 11);
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else if (tipo === "telefone") {
    if (valor.length > 11) valor = valor.slice(0, 11);
    valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
  }
  input.value = valor;
}

// ===== Formulário de compra =====
document.getElementById("ticketForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Captura os valores do formulário
  const nome = document.getElementById("nome").value.trim();
  const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
  const telefone = document.getElementById("telefone").value.replace(/\D/g, "");
  const cidade = document.getElementById("cidade").value.trim();
  const estado = document.getElementById("estado").value.toUpperCase();
  const quantidade = parseInt(document.getElementById("quantidade").value.trim(), 10) || 0;

  // Limpa mensagens e bordas
  document.querySelectorAll(".error-msg").forEach(el => el.innerText = "");
  document.querySelectorAll("#ticketForm input").forEach(input => {
    input.style.border = "";
  });

  let isValid = true;

  // Função para mostrar erro
  function setError(id, message) {
    const input = document.getElementById(id.replace("error-", ""));
    if (input) input.style.border = "2px solid #ff4d4f"; // vermelho
    document.getElementById(id).innerText = message;
    isValid = false;
  }

  // Função para marcar sucesso
  function setSuccess(id) {
    const input = document.getElementById(id);
    if (input) input.style.border = "2px solid #28a745"; // verde
  }

  // Validações
  if (nome.length < 3) setError("error-nome", "Informe um nome válido."); else setSuccess("nome");
  if (!/^\d{11,14}$/.test(cpf)) setError("error-cpf", "CPF/CNPJ inválido."); else setSuccess("cpf");
  if (!/^\d{10,11}$/.test(telefone)) setError("error-telefone", "Telefone inválido."); else setSuccess("telefone");
  if (cidade.length < 2) setError("error-cidade", "Informe sua cidade."); else setSuccess("cidade");
  if (!/^[A-Z]{2}$/.test(estado)) setError("error-estado", "UF inválido."); else setSuccess("estado");
  if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 50) {
    setError("error-quantidade", "Quantidade entre 1 e 50.");
  } else setSuccess("quantidade");

  // Se houver erro, para aqui
  if (!isValid) return;

  // Calcula valor total
  const valorTotal = quantidade * 10;
  document.getElementById("valorTotal").innerText = valorTotal.toFixed(2);

  // Gera link do WhatsApp (telefone da obra atualizado)
  const mensagem = `Olá! Quero confirmar a compra de ${quantidade} cupom(ns) físicos no valor total de R$${valorTotal.toFixed(2)}, em apoio à Obra Papa João XXIII.%0A%0A*Nome:* ${nome}%0A*CPF/CNPJ:* ${cpf}%0A*Telefone:* ${telefone}%0A*Cidade:* ${cidade} - ${estado}%0A%0ASegue o comprovante do PIX.`;
  const linkWhats = `https://wa.me/554432361231?text=${mensagem}`;
  document.getElementById("whatsappLink").href = linkWhats;

  // Mostra a etapa 2 (PIX) e oculta a etapa 1
  document.getElementById("etapa1").style.display = "none";
  const etapa2 = document.getElementById("etapa2");
  etapa2.style.display = "flex";
  const sobreObra = document.querySelector(".sobre-obra-container");
  if (sobreObra) sobreObra.style.display = "none";
});

// ===== Máscaras dinâmicas =====
document.getElementById("cpf").addEventListener("input", function() { aplicarMascara(this, "cpf"); });
document.getElementById("telefone").addEventListener("input", function() { aplicarMascara(this, "telefone"); });

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
      setTimeout(() => { msg.innerText = ""; }, 3000);
    }).catch(() => {
      const msg = document.getElementById("error-pix");
      msg.innerText = "Erro ao copiar PIX.";
      msg.style.color = "#d93025";
    });
  });
}
