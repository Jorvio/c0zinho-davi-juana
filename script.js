const noBtn = document.getElementById("no");
const yesBtn = document.getElementById("yes");
const hint = document.getElementById("hint");
const success = document.getElementById("success");

let attempts = 0;
let moving = false;

function runAway(event) {
  attempts++;

  const margin = 24;
  const buttonWidth = noBtn.offsetWidth || 100;
  const buttonHeight = noBtn.offsetHeight || 54;

  // Use the actual browser viewport, not the card.
  const maxLeft = window.innerWidth - buttonWidth - margin;
  const maxTop = window.innerHeight - buttonHeight - margin;

  const mouseX = event.clientX;
  const mouseY = event.clientY;

  // Pick a visible position that is genuinely far from the mouse.
  let left, top, distance;
  let tries = 0;

  do {
    left = margin + Math.random() * Math.max(1, maxLeft - margin);
    top = margin + Math.random() * Math.max(1, maxTop - margin);

    const centerX = left + buttonWidth / 2;
    const centerY = top + buttonHeight / 2;
    distance = Math.hypot(centerX - mouseX, centerY - mouseY);
    tries++;
  } while (distance < 180 && tries < 100);

  // FIXED means it stays visible in the browser viewport.
  noBtn.style.position = "fixed";
  noBtn.style.left = `${left}px`;
  noBtn.style.top = `${top}px`;
  noBtn.style.right = "auto";
  noBtn.style.bottom = "auto";
  noBtn.style.margin = "0";
  noBtn.style.zIndex = "99999";
  noBtn.style.transform =
    `rotate(${(Math.random() - 0.5) * 14}deg) scale(1.02)`;

  const messages = [
    "ih, quase! 😭",
    "não vai conseguir KKKK",
    "FOI POR POUCO 👀",
    "ele fugiu!",
    "para de perseguir o NÃO 😭",
    "desiste, eu sou mais rápido ♡",
    "NÃO É PRA CLICAR NO NÃO KKKK"
  ];

  hint.textContent = messages[Math.min(attempts - 1, messages.length - 1)];

  moving = true;
  setTimeout(() => {
    moving = false;
  }, 220);
}

// The first approach makes it run.
noBtn.addEventListener("mouseenter", runAway);

// If the cursor follows it closely, make it run again.
document.addEventListener("mousemove", (event) => {
  if (noBtn.style.position !== "fixed" || moving) return;

  const r = noBtn.getBoundingClientRect();
  const centerX = r.left + r.width / 2;
  const centerY = r.top + r.height / 2;

  if (Math.hypot(event.clientX - centerX, event.clientY - centerY) < 105) {
    runAway(event);
  }
});

// Never allow a click/touch to land on it.
noBtn.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  runAway(event);
});

yesBtn.addEventListener("click", () => {
  success.classList.add("show");

  for (let i = 0; i < 14; i++) {
    setTimeout(createHeart, i * 100);
  }
});

function createHeart() {
  const el = document.createElement("div");
  el.className = "float";
  el.textContent = Math.random() > 0.35 ? "♡" : "♥";
  el.style.left = `${Math.random() * 100}vw`;
  el.style.bottom = "-30px";
  el.style.fontSize = `${16 + Math.random() * 25}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 8000);
}
