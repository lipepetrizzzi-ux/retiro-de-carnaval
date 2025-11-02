// ---- Formulário de inscrição ----
const form = document.getElementById('inscricaoForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const idade = parseInt(document.getElementById('idade').value);
    const email = document.getElementById('email').value.trim();
    const comprovante = document.getElementById('comprovante').files[0];
    const autorizacao = document.getElementById('autorizacao').files[0];
    const msg = document.getElementById('mensagem');

    if (idade < 14) {
      msg.textContent = "❌ Idade mínima para participar é 14 anos.";
      msg.style.color = "red";
      return;
    }

    if (!comprovante) {
      msg.textContent = "❌ Envie o comprovante de pagamento (R$70).";
      msg.style.color = "red";
      return;
    }

    const inscricao = {
      nome,
      idade,
      email,
      comprovante: comprovante.name,
      autorizacao: autorizacao ? autorizacao.name : "Não enviada",
      valor: 70,
      status: "Pendente"
    };

    let lista = JSON.parse(localStorage.getItem('inscricoes')) || [];
    lista.push(inscricao);
    localStorage.setItem('inscricoes', JSON.stringify(lista));

    msg.textContent = "✅ Inscrição enviada com sucesso!";
    msg.style.color = "green";
    form.reset();
  });
}

// ---- Área do administrador ----
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    const user = document.getElementById('usuario').value;
    const pass = document.getElementById('senha').value;
    const loginMsg = document.getElementById('loginMsg');
    const painel = document.getElementById('painel');
    const loginDiv = document.getElementById('login');

    if (user === "admin" && pass === "1234") {
      loginDiv.style.display = "none";
      painel.style.display = "block";
      mostrarInscricoes();
    } else {
      loginMsg.textContent = "Usuário ou senha incorretos.";
      loginMsg.style.color = "red";
    }
  });
}

function mostrarInscricoes() {
  const lista = JSON.parse(localStorage.getItem('inscricoes')) || [];
  const ul = document.getElementById('listaInscricoes');
  ul.innerHTML = "";

  if (lista.length === 0) {
    ul.innerHTML = "<li>Nenhuma inscrição enviada ainda.</li>";
    return;
  }

  lista.forEach((insc, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${insc.nome}</strong> (${insc.idade} anos) <br>
      📧 ${insc.email} <br>
      💵 Comprovante: ${insc.comprovante} <br>
      🧾 Autorização: ${insc.autorizacao} <br>
      <button class="aceitar" onclick="enviarWhatsApp(${index}, true)">Aceitar</button>
      <button class="recusar" onclick="enviarWhatsApp(${index}, false)">Recusar</button>
      <hr>
    `;
    ul.appendChild(li);
  });
}

// ---- Enviar mensagem via WhatsApp ----
function enviarWhatsApp(index, aprovado) {
  const lista = JSON.parse(localStorage.getItem('inscricoes')) || [];
  const inscricao = lista[index];
  const telefoneAdmin = "55SEUNUMEROAQUI"; // coloque seu número, ex: 5599999999999

  const mensagem = aprovado
    ? `Olá ${inscricao.nome}! 🎉 Sua inscrição no Retiro de Carnaval foi *ACEITA*!`
    : `Olá ${inscricao.nome}! 😔 Sua inscrição no Retiro de Carnaval foi *RECUSADA*.`;

  const url = `https://wa.me/${telefoneAdmin}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
}
