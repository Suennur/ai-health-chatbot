const sendButton = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// Mesaj gönderme işlemi
sendButton.addEventListener("click", async () => {
  const question = userInput.value;
  if (!question.trim()) return;

  // Kullanıcı mesajını göster
  addMessage(question, "user");

  // Modelden yanıt al
  const response = await fetch("/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  const data = await response.json();
  const answer = data.answer || "Üzgünüm, şu anda yanıt veremiyorum.";

  // Bot yanıtını göster
  const botMessage = addMessage(answer, "bot");

  // Bot yanıtı sonrası geri bildirim mekanizmasını göster
  addFeedbackButtons(botMessage, question, answer);

  userInput.value = "";
});

// Mesajları ekleme fonksiyonu
function addMessage(message, sender) {
  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  messageElement.classList.add("message", sender === "user" ? "user-message" : "bot-message");
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Otomatik kaydırma
  return messageElement;
}

// Geri bildirim butonlarını ekleme fonksiyonu
function addFeedbackButtons(messageElement, question, answer) {
  const feedbackContainer = document.createElement("div");
  feedbackContainer.classList.add("feedback-container");

  const feedbackText = document.createElement("p");
  feedbackText.textContent = "Bu cevap size yardımcı oldu mu?";

  const thumbsUp = document.createElement("button");
  thumbsUp.textContent = "👍";
  thumbsUp.classList.add("feedback-btn");
  thumbsUp.addEventListener("click", () => handleFeedback("positive", feedbackContainer));

  const thumbsDown = document.createElement("button");
  thumbsDown.textContent = "👎";
  thumbsDown.classList.add("feedback-btn");
  thumbsDown.addEventListener("click", () => handleFeedback("negative", feedbackContainer));

  feedbackContainer.appendChild(feedbackText);
  feedbackContainer.appendChild(thumbsUp);
  feedbackContainer.appendChild(thumbsDown);

  messageElement.appendChild(feedbackContainer);
}

// Geri bildirim gönderme işlemi
function handleFeedback(feedbackType, feedbackContainer) {
  // Geri bildirim sunucuya gönderilir
  fetch("/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ feedback: feedbackType }),
  })
    .then(() => {
      // Geri bildirim butonlarını kaldır
      feedbackContainer.innerHTML = "";

      // Teşekkür mesajını ekle
      const thankYouMessage = document.createElement("p");
      thankYouMessage.textContent = "Teşekkürler! Geri bildiriminiz bizim için önemli.";
      thankYouMessage.style.color = "#007bff";
      thankYouMessage.style.fontSize = "13px";
      feedbackContainer.appendChild(thankYouMessage);
    })
    .catch(() => {
      // Hata durumunda bir mesaj göster
      feedbackContainer.innerHTML = "<p style='color: red;'>Geri bildirim gönderilirken bir hata oluştu.</p>";
    });
}
