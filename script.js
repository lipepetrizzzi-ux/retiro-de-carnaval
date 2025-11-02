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
      autorizacao: autorizacao ? autorizacao.name : "Não enviada"
    };

    let lista = JSON.parse(localStorage.getItem('inscricoes')) || [];
    lista.push(inscricao);
    localStorage.setItem('inscricoes', JSON.stringify(lista));

    msg.textContent = "✅ Inscrição enviada com sucesso!";
    msg.style.color = "green";
    form.reset();
  });
}

// ---- Admin login ----
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

// ---- Mostrar inscrições ----
function mostrarInscricoes(listaFiltrada = null) {
  const lista = listaFiltrada || JSON.parse(localStorage.getItem('inscricoes')) || [];
  const div = document.getElementById('listaInscricoes');
  div.innerHTML = "";

  if (lista.length === 0) {
    div.innerHTML = "<p>Nenhuma inscrição encontrada.</p>";
    return;
  }

  lista.forEach((insc, index) => {
    const card = document.createElement('div');
    card.className = "card";
    card.innerHTML = `
      <p><strong>Nome:</strong> ${insc.nome}</p>
      <p><strong>Idade:</strong> ${insc.idade} anos</p>
      <p><strong>E-mail:</strong> ${insc.email}</p>
      <p><strong>Comprovante:</strong> ${insc.comprovante}</p>
      <p><strong>Autorização:</strong> ${insc.autorizacao}</p>
      <button onclick="removerInscricao(${index})">Remover</button>
    `;
    div.appendChild(card);
  });
}

// ---- Remover inscrição ----
function removerInscricao(index) {
  let lista = JSON.parse(localStorage.getItem('inscricoes')) || [];
  if (confirm(`Tem certeza que deseja remover a inscrição de ${lista[index].nome}?`)) {
    lista.splice(index, 1);
    localStorage.setItem('inscricoes', JSON.stringify(lista));
    mostrarInscricoes();
  }
}

// ---- Pesquisar por nome ----
function filtrarInscricoes() {
  const filtro = document.getElementById('pesquisaNome').value.toLowerCase();
  const lista = JSON.parse(localStorage.getItem('inscricoes')) || [];

  const filtrada = lista.filter(insc => insc.nome.toLowerCase().includes(filtro));
  mostrarInscricoes(filtrada);
}
