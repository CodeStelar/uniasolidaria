document.addEventListener("DOMContentLoaded", function() {
  // ===== Formulário de compra =====
  const ticketForm = document.getElementById("ticketForm");
  if (ticketForm) {
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
      if (!/^(\d{3}\.?\d{3}\.?\d{3}-?\d{2}|\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2})$/.test(cpf)) setError("error-cpf", "CPF/CNPJ inválido.");
      if (!/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(telefone)) setError("error-telefone", "Telefone inválido.");
      if (cidade.length < 2) setError("error-cidade", "Informe sua cidade.");
      if (!/^[A-Z]{2}$/.test(estado)) setError("error-estado", "UF inválido.");
      if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 50) setError("error-quantidade", "Quantidade entre 1 e 50.");

      if (!isValid) return;

      const valorTotal = quantidade * 10;
      document.getElementById("valorTotal").innerText = valorTotal;

      const mensagem = `Olá! Quero confirmar a compra de ${quantidade} cupom(ns) físicos no valor total de R$${valorTotal}, em apoio à Obra Papa João XXIII.%0A%0A*Nome:* ${nome}%0A*CPF/CNPJ:* ${cpf}%0A*Telefone:* ${telefone}%0A*Cidade:* ${cidade} - ${estado}%0A%0ASegue o comprovante do PIX.`;
      const linkWhats = `https://wa.me/554432361231?text=${mensagem}`;
      document.getElementById("whatsappLink").href = linkWhats;

      document.getElementById("etapa1").style.display = "none";
      const etapa2 = document.getElementById("etapa2");
      etapa2.style.display = "flex";

      const sobreObra = document.querySelector(".sobre-obra-container");
      if (sobreObra) sobreObra.style.display = "none";
    });
  }

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

  // ===== Stepper de Quantidade (AGORA dentro do DOMContentLoaded) =====
  const input = document.getElementById('quantidade');
  const decBtn = document.getElementById('qtyDec');
  const incBtn = document.getElementById('qtyInc');

  if (input && decBtn && incBtn) {
    const min = parseInt(input.getAttribute('min') || '1', 10);
    const max = parseInt(input.getAttribute('max') || '50', 10);

    const clamp = (n) => Math.min(max, Math.max(min, n));

    const updateUI = () => {
      const val = parseInt(input.value || '0', 10);
      const atMin = val <= min;
      const atMax = val >= max;
      decBtn.classList.toggle('is-disabled', atMin);
      incBtn.classList.toggle('is-disabled', atMax);
      decBtn.disabled = atMin;
      incBtn.disabled = atMax;
    };

    const setVal = (n) => { input.value = clamp(n); updateUI(); };

    decBtn.addEventListener('click', () => setVal(parseInt(input.value||'0',10) - 1));
    incBtn.addEventListener('click', () => setVal(parseInt(input.value||'0',10) + 1));

    input.addEventListener('input', () => {
      const num = parseInt(input.value.replace(/\D+/g,''),10);
      input.value = isNaN(num) ? min : clamp(num);
      updateUI();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown'){ e.preventDefault(); setVal(parseInt(input.value||'0',10)-1); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp'){ e.preventDefault(); setVal(parseInt(input.value||'0',10)+1); }
    });

    updateUI();
  }
});
