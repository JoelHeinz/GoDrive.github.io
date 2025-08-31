// chatbot.js
// ===============================
// GoDrive AI Chatbot (Gemini API)
// ===============================

const GEMINI_API_KEY = "AIzaSyCYbrr0niUg9IvGxafMlC3bTuhx1T-M8_M"; 
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;

// --- Create Chatbox UI ---
const chatboxContainer = document.getElementById("godrive-chatbox");
chatboxContainer.innerHTML = `
  <!-- Floating button -->
  <div id="chat-toggle" style="position:fixed;bottom:20px;right:20px;
      background:linear-gradient(135deg,#4a90e2,#2563eb);
      color:#fff;padding:14px 18px;border-radius:50%;font-size:20px;
      cursor:pointer;box-shadow:0 6px 14px rgba(0,0,0,0.4);z-index:9999;
      display:flex;align-items:center;justify-content:center;">
    💬
  </div>

  <!-- Chat window -->
  <div id="chat-window" style="display:none;position:fixed;bottom:80px;right:20px;
      width:360px;max-height:520px;background:#1f2937;border-radius:16px;
      box-shadow:0 6px 18px rgba(0,0,0,0.6);overflow:hidden;z-index:9999;
      font-family:Inter,Arial,sans-serif;color:#f3f4f6;">
    <div style="background:#4a90e2;padding:12px 14px;font-weight:bold;
        color:#fff;font-size:16px;">
      🚗 GoDrive AI Assistant
    </div>
    <div id="chat-messages" style="height:380px;overflow-y:auto;padding:12px;
        font-size:14px;background:#111827;"></div>
    <div style="display:flex;border-top:1px solid #374151;background:#1f2937;">
      <input id="chat-input" type="text" placeholder="Ask about GoDrive..." 
        style="flex:1;padding:12px;border:none;outline:none;
        font-size:14px;background:#111827;color:#f3f4f6;">
      <button id="chat-send" style="background:#4a90e2;color:#fff;
        border:none;padding:12px 18px;cursor:pointer;font-weight:600;
        border-radius:0 0 16px 0;">Send</button>
    </div>
  </div>
`;

// --- Toggle chatbox ---
document.getElementById("chat-toggle").onclick = () => {
  const win = document.getElementById("chat-window");
  win.style.display = win.style.display === "none" ? "block" : "none";
};

// --- Gemini API Call ---
async function sendMessageToGemini(message) {
  const body = {
    contents: [{ role: "user", parts: [{ text: message }] }]
  };

  try {
    const res = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("Gemini response:", data);

    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      return "⚠️ API Error: " + data.error.message;
    } else {
      return "⚠️ Unexpected response format.";
    }
  } catch (err) {
    console.error("Fetch error:", err);
    return "⚠️ Failed to reach Gemini API.";
  }
}

// --- Add message to chatbox with styled bubbles ---
function addMessage(who, text) {
  const msgDiv = document.createElement("div");
  msgDiv.style.margin = "6px 0";
  msgDiv.style.display = "flex";

  if (who === "You") {
    msgDiv.style.justifyContent = "flex-end";
    msgDiv.innerHTML = `<div style="background:#2563eb;color:#fff;
        padding:10px 14px;border-radius:16px 16px 4px 16px;
        max-width:70%;font-size:14px;word-wrap:break-word;">${text}</div>`;
  } else {
    msgDiv.style.justifyContent = "flex-start";
    msgDiv.innerHTML = `<div style="background:#374151;color:#f3f4f6;
        padding:10px 14px;border-radius:16px 16px 16px 4px;
        max-width:70%;font-size:14px;word-wrap:break-word;"><b>${who}:</b> ${text}</div>`;
  }

  document.getElementById("chat-messages").appendChild(msgDiv);
  document.getElementById("chat-messages").scrollTop = document.getElementById("chat-messages").scrollHeight;
}

// --- Handle send button ---
document.getElementById("chat-send").onclick = async () => {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();
  if (!message) return;

  addMessage("You", message);
  input.value = "";

  const reply = await sendMessageToGemini(
    `You are GoDrive AI Assistant. You know everything about GoDrive: Vision, TripSync, FluxLoad, Hubs, Comparison, Contact. Always answer questions as a GoDrive expert.
     User's question: ${message}`
  );
  addMessage("GoDrive AI", reply);
};
