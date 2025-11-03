// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push, get, remove } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCXvC8pjNXXwCxIFt0ClAgk8BkFotfSLSM",
  authDomain: "retiro-de-carnaval.firebaseapp.com",
  databaseURL: "https://retiro-de-carnaval-default-rtdb.firebaseio.com",
  projectId: "retiro-de-carnaval",
  storageBucket: "retiro-de-carnaval.firebasestorage.app",
  messagingSenderId: "520456806921",
  appId: "1:520456806921:web:2a099cbc67d01f1b704ed8",
  measurementId: "G-ZXTZLMB2WJ"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ----------------- FORMULÁRIO DE INSCRIÇÃO -----------------
export async function enviarInscricao(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const idade = parseInt(document.getElementById('idade').value);
  const email = document.getElementById('email').value.trim();
  const comprovante = document.getElementById('comprovante').files[0];
  const autorizacao = document.getElementById('autorizacao').files[0];
  const msg = document.getElementById('mensagem');

  if (idade < 14) {
    msg.textContent = "❌ Idade mínima é 14 anos.";
    msg.style.color = "red";
    return;
  }
  if (!comprovante) {
    msg.textContent = "❌ Envie o comprovante de pagamento.";
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

  try {
    await push(ref(db, 'inscricoes'), inscricao);
    msg.textContent = "✅ Inscrição enviada com sucesso!";
    msg.style.color = "green";
    document.getElementById('inscricaoForm').reset();
  } catch (error) {
    msg.textContent = "❌ Erro ao enviar inscrição.";
    msg.style.color = "red";
    console.error(error);
  }
}

// ----------------- LOGIN ADMIN -----------------
export function loginAdmin() {
  const user = document.getElementById('usuario').value;
  const pass = document.getElementById('senha').value;
  const loginMsg = document.getElementById('loginMsg');
  const painel = document.getElementById('painel');
  const loginDiv = document.getElementById('login');

  if(user === "admin" && pass === "1234") {
    loginDiv.style.display = "none";
    painel.style.display = "block";
    mostrarInscricoes();
  } else {
    loginMsg.textContent = "Usuário ou senha incorretos.";
    loginMsg.style.color = "red";
  }
}

// ----------------- MOSTRAR INSCRIÇÕES -----------------
export function mostrarInscricoes() {
  const div = document.getElementById('listaInscricoes');
  div.innerHTML = "";
  const pesquisa = document.getElementById('pesquisaNome') ? document.getElementById('pesquisaNome').value.toLowerCase() : "";

  get(ref(db, 'inscricoes')).then(snapshot => {
    if(!snapshot.exists()) {
      div.innerHTML = "<p>Nenhuma inscrição encontrada.</p>";
      return;
    }
    snapshot.forEach(childSnap => {
      const key = childSnap.key;
      const insc = childSnap.val();
      if(insc.nome.toLowerCase().includes(pesquisa)) {
        const card = document.createElement('div');
        card.className = "card";
        card.innerHTML = `
          <p><strong>Nome:</strong> ${insc.nome}</p>
          <p><strong>Idade:</strong> ${insc.idade} anos</p>
          <p><strong>E-mail:</strong> ${insc.email}</p>
          <p><strong>Comprovante:</strong> ${insc.comprovante}</p>
          <p><strong>Autorização:</strong> ${insc.autorizacao}</p>
          <button onclick="removerInscricao('${key}')">Remover</button>
        `;
        div.appendChild(card);
      }
    });
  }).catch(err => console.error(err));
}

// ----------------- REMOVER INSCRIÇÃO -----------------
export function removerInscricao(key) {
  if(confirm("Tem certeza que deseja remover esta inscrição?")) {
    remove(ref(db, 'inscricoes/' + key))
      .then(() => mostrarInscricoes())
      .catch(err => console.error(err));
  }
}
