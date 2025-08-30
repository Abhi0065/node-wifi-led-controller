const micButton = document.getElementById("mic-button");
const chatSection = document.getElementById("chat-section");
const emptyState = document.getElementById("empty-state");
const conversation = document.getElementById("conversation");
const input = document.getElementById("input");
const clearChat = document.querySelector(".clear");
const closeModal = document.querySelector(".close");
const volume = document.querySelector(".speaker");
const chatBotToggle = document.querySelector(".chatbot");
const chatBotContainer = document.querySelector(".chatbot-container");
const appContainer = document.querySelector(".app-container");
const header = document.querySelector(".header");

let offsetX = 0,
  offsetY = 0,
  isDragging = false;

function centerAppContainer() {
  requestAnimationFrame(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const containerWidth = appContainer.offsetWidth;
    const containerHeight = appContainer.offsetHeight;

    if (containerWidth > 0 && containerHeight > 0) {
      const centerX = (viewportWidth - containerWidth) / 2;
      const centerY = (viewportHeight - containerHeight) / 4;

      appContainer.style.left = `${centerX}px`;
      appContainer.style.top = `${centerY}px`;
    }
  });
}

document.addEventListener("DOMContentLoaded", centerAppContainer);
window.addEventListener("resize", centerAppContainer);

header.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - appContainer.offsetLeft;
  offsetY = e.clientY - appContainer.offsetTop;

  document.addEventListener("mousemove", moveWindow);
  document.addEventListener("mouseup", stopMove);

  e.preventDefault();
});

function moveWindow(e) {
  if (!isDragging) return;

  const winWidth = appContainer.offsetWidth;
  const winHeight = appContainer.offsetHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let newLeft = e.clientX - offsetX;
  let newTop = e.clientY - offsetY;

  newLeft = Math.max(0, Math.min(viewportWidth - winWidth, newLeft));
  newTop = Math.max(0, Math.min(viewportHeight - winHeight, newTop));

  appContainer.style.left = `${newLeft}px`;
  appContainer.style.top = `${newTop}px`;
}

function stopMove() {
  isDragging = false;
  document.removeEventListener("mousemove", moveWindow);
  document.removeEventListener("mouseup", stopMove);
}

let isOpen = false;
let once = false;
function toggleChatBotModal() {
  isOpen = !isOpen;
  if (isOpen) {
    centerAppContainer();
    chatBotContainer.style.display = "block";
  } else {
    chatBotContainer.style.display = "none";
  }

  if (!once) {
    initBot();
    once = true;
  }
}

let isMute = sessionStorage.getItem("isMute") === "true";

function updateVolumeUI() {
  if (isMute) {
    volume.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
  } else {
    volume.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  }
}

function toggleVolume() {
  isMute = !isMute;
  sessionStorage.setItem("isMute", isMute);
  updateVolumeUI();
}

function clearChatData() {
  conversation.innerHTML = "";
  conversationStarted = false;
  initBot();
}

function closeModalContainer() {
  chatBotContainer.style.display = "none";
  isOpen = false;
  addScrollBody();
}

function listening(message) {
  input.placeholder = message;
  input.style.textAlign = "center";
}

function stopListening() {
  input.placeholder = "Enter message here...";
  input.style.textAlign = "";
}

chatBotToggle.addEventListener("click", toggleChatBotModal);
volume.addEventListener("click", toggleVolume);
clearChat.addEventListener("click", clearChatData);
closeModal.addEventListener("click", closeModalContainer);

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.interimResults = true;
recognition.lang = "en-IN";
recognition.maxAlternatives = 1;

let isListening = false;
let finalTranscript = "";
let conversationStarted = false;

function initBot() {
  const speech = "Hey there, I'm alexa, L,E,D blub assistant?";
  const text = "Hey there, I'm alexa LED blub assistant?";
  const iconId = addAIMessage(text);
  textToSpeech(speech, iconId);
  hideEmptyState();
}

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    finalTranscript = "";
    finalTranscript = input.value.trim();
    if (finalTranscript) {
      if (!conversationStarted) {
        hideEmptyState();
        conversationStarted = true;
      }
      addUserMessage(finalTranscript);
      sendToServer(finalTranscript);
      input.value = "";
    }
  }
});

micButton.onclick = () => {
  if (!isListening) {
    recognition.start();
  } else {
    recognition.stop();
  }
};

recognition.onstart = () => {
  isListening = true;
  micButton.classList.add("listening");
  listening("Listening...");
};

recognition.onresult = (event) => {
  finalTranscript = "";
  for (let i = event.resultIndex; i < event.results.length; i++) {
    finalTranscript += event.results[i][0].transcript;
  }
  listening("Processing...");
};

recognition.onend = () => {
  if (finalTranscript.trim()) {
    if (!conversationStarted) {
      hideEmptyState();
      conversationStarted = true;
    }
    console.log(finalTranscript);

    addUserMessage(finalTranscript.trim());
    sendToServer(finalTranscript.trim());
  }
  micButton.classList.remove("listening");
  isListening = false;
  stopListening();
};

recognition.onerror = (event) => {
  stopListening();
  micButton.classList.remove("listening");
  isListening = false;
  finalTranscript = "";
  setTimeout(() => {
    stopListening();
  }, 3000);
};

function hideEmptyState() {
  emptyState.style.display = "none";
}

function addUserMessage(text) {
  const userBox = document.createElement("div");
  userBox.className = "chat-box user";
  userBox.innerHTML = `
    <div class="profile">
      <div class="profile-icon"><i class="fas fa-user"></i></div>
      <div class="profile-name">You</div>
    </div>
    <div class="chat-bubble">${text}</div>
  `;
  conversation.appendChild(userBox);
  scrollToBottom();
}

function addAIMessage(htmlText) {
  const aiBox = document.createElement("div");
  aiBox.innerHTML = "";
  aiBox.className = "chat-box ai";
  aiBox.innerHTML = `
    <div class="profile">
      <div class="profile-icon" id="ai-icon"><i class='fas fa-robot'></i></div>
      <div class="profile-name">Alexa</div>
    </div>
    <div class="chat-bubble"></div>
  `;

  conversation.appendChild(aiBox);

  const bubble = aiBox.querySelector(".chat-bubble");
  bubble.innerHTML = "";

  const temp = document.createElement("div");
  temp.innerHTML = htmlText;

  const textNodes = [];

  for (const node of temp.childNodes) {
    const blank = cloneWithEmptyText(node);
    bubble.appendChild(blank);
    collectTextNodes(node, blank);
  }

  let nodeIndex = 0;
  let charIndex = 0;

  function typeNext() {
    if (nodeIndex >= textNodes.length) {
      return;
    }

    const { original, clone } = textNodes[nodeIndex];
    const text = original.textContent;

    if (charIndex < text.length) {
      clone.textContent += text[charIndex];
      charIndex++;
      setTimeout(typeNext, 15);
    } else {
      nodeIndex++;
      charIndex = 0;
      setTimeout(typeNext, 0);
    }
    scrollToBottom();
  }

  typeNext();

  return aiBox.querySelector(".profile-icon").id;

  function cloneWithEmptyText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode("");
    }

    const clone = node.cloneNode(false);
    for (const child of node.childNodes) {
      clone.appendChild(cloneWithEmptyText(child));
    }
    return clone;
  }

  function collectTextNodes(origNode, cloneNode) {
    if (origNode.nodeType === Node.TEXT_NODE && origNode.textContent.trim()) {
      textNodes.push({ original: origNode, clone: cloneNode });
    } else {
      for (let i = 0; i < origNode.childNodes.length; i++) {
        collectTextNodes(origNode.childNodes[i], cloneNode.childNodes[i]);
      }
    }
  }
}

function scrollToBottom() {
  setTimeout(() => {
    chatSection.scrollTop = chatSection.scrollHeight;
  }, 100);
}

async function sendToServer(prompt) {
  listening("Getting response...");

  try {
    const response = await fetch("/res", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }

    const message = result.message;
    const speech = result.speech;

    ledTriggerOnAi(message);
    const iconId = addAIMessage(message);
    textToSpeech(speech, iconId);

    finalTranscript = "";
    stopListening();
  } catch (error) {
    finalTranscript = "";
    addAIMessage(
      "I'm sorry, I couldn't process your message. Please try again."
    );
    stopListening();
  }
}

let selectedVoice = null;

function loadVoices() {
  const voices = speechSynthesis.getVoices();
  selectedVoice =
    voices.find(
      (v) =>
        v.name.includes("Google") && v.name.toLowerCase().includes("female")
    ) ||
    voices.find(
      (v) => v.lang === "en-IN" && v.name.toLowerCase().includes("female")
    ) ||
    voices.find((v) => v.lang === "en-IN") ||
    voices.find(
      (v) => v.lang.includes("en") && v.name.toLowerCase().includes("female")
    );
}

// Initial voice loading
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = loadVoices;
}
loadVoices();

// Apply initial volume UI state
updateVolumeUI();

function textToSpeech(text, iconId) {
  if (isMute) return;
  const utterance = new SpeechSynthesisUtterance(text);
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
  utterance.lang = "en-IN";
  utterance.rate = 1.5;
  utterance.pitch = 1;

  const icon = document.getElementById(iconId);
  if (icon) {
    icon.classList.add("speaking");

    utterance.onend = () => {
      icon.classList.remove("speaking");
    };
  }

  speechSynthesis.speak(utterance);
}

function ledTriggerOnAi(message) {
  const trimmedMessage = message.trim().toLowerCase();
  const splitMessage = trimmedMessage.split(/\s+/);

  if (splitMessage.length !== 3) {
    console.log("Invalid LED command format");
    return;
  }

  const ledNumber = splitMessage[1];
  const ledStatus =
    splitMessage[0] === "led" ? splitMessage[2] : `blink-${splitMessage[2]}`;

  const validNumbers = ["1", "2", "all"];
  const validStatuses = ["on", "off", "blink-on", "blink-off"];

  if (ledNumber === "all") {
    console.log(ledNumber === "all");
    console.log(ledNumber, ledStatus);
    if (splitMessage[0] === "led") {
      ledTriggerHnadler(`led1`, `status1`, ledStatus, 1);
      setTimeout(() => {
        ledTriggerHnadler(`led2`, `status2`, ledStatus, 2);
      }, 300);
    } else {
      ledTriggerHnadler(`b-led1`, `b-status1`, ledStatus, 1);
      setTimeout(() => {
        ledTriggerHnadler(`b-led2`, `b-status2`, ledStatus, 2);
      }, 300);
    }
    return;
  }

  if (!validNumbers.includes(ledNumber) || !validStatuses.includes(ledStatus)) {
    console.log("Invalid LED number or status");
    return;
  }

  const toggleId =
    splitMessage[0] === "led" ? `led${ledNumber}` : `b-led${ledNumber}`;
  const statusId =
    splitMessage[0] === "led" ? `status${ledNumber}` : `b-status${ledNumber}`;

  console.log(ledNumber, ledStatus, toggleId, statusId);

  ledTriggerHnadler(toggleId, statusId, ledStatus, ledNumber);
}

let timeOut2;
function ledTriggerHnadler(toggleId, statusId, ledStatus, ledNumber) {
  const toggle = document.getElementById(toggleId);
  const status = document.getElementById(statusId);
  clearTimeout(timeOut2);
  timeOut2 = setTimeout(async () => {
    toggle.checked = ledStatus === "on" ? true : false;
    status.innerText = ledStatus === "on" ? "State ON" : "State OFF";
    let url = `${ledStatus}${ledNumber}`;
    try {
      history.pushState(null, "", `/${url}`);
      await fetch(`/${url}`, { method: "POST" });
    } catch (error) {
      console.log("Error toggling LED", error);
    }
  }, 100);
}
