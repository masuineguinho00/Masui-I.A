const form = document.getElementById("chat-form");
const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const apiKeyInput = document.getElementById("api-key");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  const apiKey = apiKeyInput.value.trim();

  if (!userMessage || !apiKey) {
    alert("Por favor, digite uma mensagem e cole sua API Key.");
    return;
  }

  addMessage("user", userMessage);
  input.value = "";

  addMessage("bot", "Pensando...");

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();
    const botReply = data.choices?.[0]?.message?.content || "Erro ao gerar resposta.";
    updateLastBotMessage(botReply);
  } catch (err) {
    updateLastBotMessage("Erro na requisição ou API Key inválida.");
  }
});

function addMessage(sender, text) {
  const message = document.createElement("div");
  message.classList.add("message", sender);
  message.textContent = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function updateLastBotMessage(text) {
  const messages = document.querySelectorAll(".bot");
  messages[messages.length - 1].textContent = text;
}
