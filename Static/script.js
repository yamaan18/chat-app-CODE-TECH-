"use strict";

const AVATAR_COLORS = [
  { bg: "#4f8ef7", fg: "#fff" },
  { bg: "#f74f8e", fg: "#fff" },
  { bg: "#f5c518", fg: "#111" },
  { bg: "#3dbb55", fg: "#fff" },
  { bg: "#4ff7e8", fg: "#111" },
  { bg: "#a855f7", fg: "#fff" },
  { bg: "#f97316", fg: "#fff" },
  { bg: "#06b6d4", fg: "#fff" },
];
const AVATAR_EMOJIS = ["🐼","🦊","🐸","🐯","🦁","🐺","🐧","🦄","🐻","🐮","🐷","🦋"];

const avatarMap = {};
let avatarIndex = 0;

function getAvatar(username) {
  if (!avatarMap[username]) {
    avatarMap[username] = {
      color: AVATAR_COLORS[avatarIndex % AVATAR_COLORS.length],
      emoji: AVATAR_EMOJIS[avatarIndex % AVATAR_EMOJIS.length],
    };
    avatarIndex++;
  }
  return avatarMap[username];
}

function makeAvatarEl(username) {
  const av = getAvatar(username);
  const el = document.createElement("div");
  el.classList.add("avatar");
  el.textContent = av.emoji;
  el.style.background = av.color.bg;
  el.style.color = av.color.fg;
  el.title = username;
  return el;
}

// DOM refs
const splashScreen    = document.getElementById("splash-screen");
const usernameScreen  = document.getElementById("username-screen");
const chatScreen      = document.getElementById("chat-screen");
const watermelonWrap  = document.getElementById("watermelonWrap");
const burstContainer  = document.getElementById("burstContainer");
const splashContent   = document.getElementById("splashContent");
const enterBtn        = document.getElementById("enterBtn");
const usernameInput   = document.getElementById("username-input");
const usernameError   = document.getElementById("username-error");
const joinBtn         = document.getElementById("join-btn");
const messagesEl      = document.getElementById("messages");
const messageInput    = document.getElementById("message-input");
const sendBtn         = document.getElementById("send-btn");
const onlineCount     = document.getElementById("online-count");
const currentUserPill = document.getElementById("current-user-pill");
const myAvatarEl      = document.getElementById("my-avatar");
const leaveBtn        = document.getElementById("leave-btn");

let socket     = null;
let myUsername = "";

// Stars
function buildStars() {
  const container = document.getElementById("stars");
  for (let i = 0; i < 80; i++) {
    const s = document.createElement("div");
    s.classList.add("star");
    const size = Math.random() * 2.5 + 0.5;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      --d:${(Math.random()*3+2).toFixed(1)}s;
      --delay:-${(Math.random()*4).toFixed(1)}s;
    `;
    container.appendChild(s);
  }
}

// Burst splats
function spawnBurst() {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight * 0.32;
  const colors = ["#e53935","#ef5350","#ff8a80","#4CAF50","#f5c518"];
  for (let i = 0; i < 28; i++) {
    const splat = document.createElement("div");
    splat.classList.add("splat");
    const angle = Math.random() * Math.PI * 2;
    const dist  = 80 + Math.random() * 220;
    const size  = 10 + Math.random() * 30;
    splat.style.cssText = `
      left:${cx}px; top:${cy}px;
      width:${size}px; height:${size}px;
      margin-left:-${size/2}px; margin-top:-${size/2}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      --tx:${Math.cos(angle)*dist}px;
      --ty:${Math.sin(angle)*dist}px;
      --dur:${(0.4+Math.random()*0.5).toFixed(2)}s;
      --delay:${(Math.random()*0.1).toFixed(2)}s;
      border-radius:${30+Math.random()*50}% ${50+Math.random()*20}%;
    `;
    burstContainer.appendChild(splat);
  }
}

function doBurst() {
  watermelonWrap.classList.add("burst");
  spawnBurst();
  setTimeout(() => { splashContent.classList.add("visible"); }, 400);
}

watermelonWrap.addEventListener("animationend", () => {
  setTimeout(doBurst, 300);
});


buildStars();
buildRain();

/** Generate falling rain streaks across the chat screen */
function buildRain() {
  const rainContainer = document.getElementById("rain");
  const dropCount = 60;

  for (let i = 0; i < dropCount; i++) {
    const drop = document.createElement("div");
    drop.classList.add("raindrop");
    if (Math.random() > 0.6) drop.classList.add("thick");

    const left     = Math.random() * 100;
    const height   = 40 + Math.random() * 80;
    const duration = 0.6 + Math.random() * 0.9;
    const delay    = Math.random() * 5;

    drop.style.cssText = `
      left:${left}%;
      height:${height}px;
      animation-duration:${duration}s;
      animation-delay:-${delay}s;
    `;
    rainContainer.appendChild(drop);

    // Splash ripple at the bottom, synced loosely with drop timing
    const splash = document.createElement("div");
    splash.classList.add("rain-splash");
    splash.style.cssText = `
      left:${left}%;
      animation-duration:${duration}s;
      animation-delay:-${delay}s;
    `;
    rainContainer.appendChild(splash);
  }
}

enterBtn.addEventListener("click", () => {
  splashScreen.style.opacity = "0";
  splashScreen.style.transition = "opacity .4s";
  setTimeout(() => {
    splashScreen.classList.add("hidden");
    usernameScreen.classList.remove("hidden");
    usernameInput.focus();
  }, 400);
});

// Join
function joinChat() {
  const username = usernameInput.value.trim();
  if (!username) { usernameError.textContent = "Enter a username, hero."; return; }
  if (username.length < 2) { usernameError.textContent = "At least 2 characters."; return; }
  if (!/^[a-zA-Z0-9_\-. ]+$/.test(username)) { usernameError.textContent = "Letters, numbers, spaces, ._- only."; return; }
  usernameError.textContent = "";
  myUsername = username;

  const myAv = getAvatar(myUsername);
  myAvatarEl.textContent = myAv.emoji;
  myAvatarEl.style.background = myAv.color.bg;
  myAvatarEl.style.color = myAv.color.fg;
  currentUserPill.textContent = myUsername;
  currentUserPill.style.color = myAv.color.bg;
  currentUserPill.style.borderColor = myAv.color.bg + "55";
  currentUserPill.style.background = myAv.color.bg + "22";

  const protocol = location.protocol === "https:" ? "wss" : "ws";
  connectWebSocket(`${protocol}://${location.host}/ws/${encodeURIComponent(myUsername)}`);
}

joinBtn.addEventListener("click", joinChat);
usernameInput.addEventListener("keydown", e => { if (e.key === "Enter") joinChat(); });

// WebSocket
function connectWebSocket(url) {
  socket = new WebSocket(url);
  socket.onopen = () => {
    usernameScreen.classList.add("hidden");
    chatScreen.classList.remove("hidden");
    messageInput.focus();
  };
  socket.onmessage = (event) => {
    try { handleMessage(JSON.parse(event.data)); } catch(e) { console.error(e); }
  };
  socket.onclose = (e) => {
    if (!e.wasClean) appendSystem("⚠ Connection lost. Refresh to reconnect.");
  };
  socket.onerror = () => appendSystem("⚠ Could not connect to server.");
}

function handleMessage(data) {
  if (data.type === "chat")   appendChatMessage(data.username, data.text);
  if (data.type === "system") appendSystem(data.text);
  if (typeof data.users === "number") onlineCount.textContent = data.users;
}

// Render
function appendChatMessage(username, text) {
  const isMine  = username === myUsername;
  const isEmoji = false;

  const row = document.createElement("div");
  row.classList.add("msg-row", isMine ? "mine" : "theirs");
  if (isEmoji) row.classList.add("msg-emoji-reaction");

  const avEl = makeAvatarEl(username);
  avEl.style.width = "32px";
  avEl.style.height = "32px";
  avEl.style.fontSize = "15px";

  const wrap = document.createElement("div");
  wrap.classList.add("msg-bubble-wrap");

  if (!isMine && !isEmoji) {
    const author = document.createElement("div");
    author.classList.add("msg-author");
    author.textContent = username;
    author.style.color = getAvatar(username).color.bg;
    wrap.appendChild(author);
  }

  const bubble = document.createElement("div");
  bubble.classList.add("msg-bubble");
  bubble.textContent = text;
  wrap.appendChild(bubble);

  // Timestamp
  if (!isEmoji) {
    const time = document.createElement("div");
    time.classList.add("msg-time");
    const now = new Date();
    time.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    wrap.appendChild(time);
  }

  row.appendChild(avEl);
  row.appendChild(wrap);
  messagesEl.appendChild(row);
  document.querySelector(".chat-body").scrollTop = document.querySelector(".chat-body").scrollHeight;
}

// Send
function sendMessage() {
  const text = messageInput.value.trim();
  if (!text || !socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(text);
  messageInput.value = "";
  messageInput.focus();
}

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});

document.querySelectorAll(".emoji-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(btn.dataset.emoji);
  });
});

// Leave
leaveBtn.addEventListener("click", () => {
  if (socket) { socket.close(1000); socket = null; }
  messagesEl.innerHTML = "";
  myUsername = "";
  chatScreen.classList.add("hidden");
  usernameInput.value = "";
  usernameScreen.classList.remove("hidden");
  usernameInput.focus();
});