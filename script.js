// ---- Formulário de inscrição ----
const form = document.getElementById('inscricaoForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const idade = parseInt(document.getElementById('idade').value);
    const comprovante = document.getElementById('comprovante').files[0];
    const msg = document.getElementById('mensagem');

    if (idade < 14) {
      msg.textContent = "❌ Inscrição não permitida: idade mínima é 14 anos.";
      msg.style.color = "red";
      return;
    }

    if (!comprovante) {
      msg.textContent = "❌ Envie o comprovante de pagamento (R$70).";
      msg.style.color = "red";
      return;
    }

    // Simula o envio salvando localmente
    const inscricao = {
      nome,
      idade,
      comprovante: comprovante.name,
      valor: 70
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

  lista.forEach(insc => {
    const li = document.createElement('li');
    li.textContent = `${insc.nome} (${insc.idade} anos) - Comprovante: ${insc.comprovante}`;
    ul.appendChild(li);
  });
}
