// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCXvC8pjNXXwCxIFt0ClAgk8BkFotfSLSM",
  authDomain: "retiro-de-carnaval.firebaseapp.com",
  databaseURL: "https://retiro-de-carnaval-default-rtdb.firebaseio.com",
  projectId: "retiro-de-carnaval",
  storageBucket: "retiro-de-carnaval.firebasestorage.app",
  messagingSenderId: "520456806921",
  appId: "1:520456806921:web:2a099cbc67d01f1b704ed8",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

// FORMULÁRIO
const form = document.getElementById("inscricaoForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const idade = document.getElementById("idade").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const comprovante = document.getElementById("comprovante").files[0];
    const autorizacao = document.getElementById("autorizacao").files[0];

    if (!comprovante) {
      alert("Envie o comprovante de pagamento (R$70).");
      return;
    }

    // Verificação básica de valor no nome do arquivo
    if (!comprovante.name.includes("70")) {
      alert("⚠️ O nome do comprovante não contém o valor 70. Verifique o arquivo!");
    }

    try {
      // Envia comprovante
      const compRef = sRef(storage, "comprovantes/" + comprovante.name);
      await uploadBytes(compRef, comprovante);
      const compURL = await getDownloadURL(compRef);

      let autURL = "";
      if (autorizacao) {
        const autRef = sRef(storage, "autorizacoes/" + autorizacao.name);
        await uploadBytes(autRef, autorizacao);
        autURL = await getDownloadURL(autRef);
      }

      await push(ref(db, "inscricoes"), {
        nome,
        idade,
        telefone,
        comprovante: compURL,
        autorizacao: autURL,
      });

      form.reset();
      document.getElementById("mensagem").textContent = "✅ Inscrição enviada com sucesso!";
    } catch (error) {
      console.error(error);
      document.getElementById("mensagem").textContent = "❌ Erro ao enviar.";
    }
  });
}

// ADMIN LOGIN E PAINEL
const ADM_USER = "admin";
const ADM_PASS = "1234";

if (window.location.pathname.includes("admin.html")) {
  const loginDiv = document.getElementById("login");
  const painel = document.getElementById("painel");
  const lista = document.getElementById("listaInscricoes");

  window.loginAdmin = () => {
    const u = document.getElementById("usuario").value;
    const s = document.getElementById("senha").value;
    if (u === ADM_USER && s === ADM_PASS) {
      loginDiv.style.display = "none";
      painel.style.display = "block";
      mostrarInscricoes();
    } else {
      document.getElementById("loginMsg").textContent = "Usuário ou senha incorretos.";
    }
  };

  window.mostrarInscricoes = () => {
    onValue(ref(db, "inscricoes"), (snapshot) => {
      lista.innerHTML = "";
      const termo = (document.getElementById("pesquisaNome")?.value || "").toLowerCase();
      snapshot.forEach((child) => {
        const data = child.val();
        if (!data.nome.toLowerCase().includes(termo)) return;

        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
          <p><strong>Nome:</strong> ${data.nome}</p>
          <p><strong>Idade:</strong> ${data.idade}</p>
          <p><strong>Telefone:</strong> ${data.telefone}</p>
          <p><a href="${data.comprovante}" target="_blank">📎 Baixar comprovante</a></p>
          ${data.autorizacao ? `<p><a href="${data.autorizacao}" target="_blank">📎 Autorização</a></p>` : ""}
          <button onclick="removerInscricao('${child.key}')">Remover inscrição</button>
        `;
        lista.appendChild(div);
      });
    });
  };

  window.removerInscricao = async (id) => {
    if (confirm("Deseja realmente remover esta inscrição?")) {
      await remove(ref(db, "inscricoes/" + id));
      alert("Inscrição removida.");
    }
  };
}
