const noBtn = document.getElementById("no");
const yesBtn = document.getElementById("yes");
const hint = document.getElementById("hint");
const success = document.getElementById("success");

let mouse = { x: -9999, y: -9999 };
let lastMove = 0;
let attempts = 0;

const ESCAPE_RADIUS = 155;   // distância mínima do cursor
const MIN_POSITION = 30;

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  keepAway();
});

document.addEventListener("pointermove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  keepAway();
});

function keepAway() {
  if (success.classList.contains("show")) return;

  const rect = noBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const distance = Math.hypot(mouse.x - cx, mouse.y - cy);

  // O cursor não consegue sequer chegar perto do botão.
  if (distance < ESCAPE_RADIUS) {
    moveButtonAway();
  }
}

function moveButtonAway() {
  const now = performance.now();

  // Evita várias mudanças no mesmo frame.
  if (now - lastMove < 90) return;
  lastMove = now;

  attempts++;

  const width = noBtn.offsetWidth;
  const height = noBtn.offsetHeight;

  const maxX = window.innerWidth - width - MIN_POSITION;
  const maxY = window.innerHeight - height - MIN_POSITION;

  let bestX = MIN_POSITION;
  let bestY = MIN_POSITION;
  let bestDistance = 0;

  // Procura a posição mais distante possível do mouse.
  for (let i = 0; i < 80; i++) {
    const x = MIN_POSITION + Math.random() * Math.max(1, maxX - MIN_POSITION);
    const y = MIN_POSITION + Math.random() * Math.max(1, maxY - MIN_POSITION);

    const d = Math.hypot(
      mouse.x - (x + width / 2),
      mouse.y - (y + height / 2)
    );

    if (d > bestDistance) {
      bestDistance = d;
      bestX = x;
      bestY = y;
    }

    // Se já achou uma posição muito segura, pode parar.
    if (d > ESCAPE_RADIUS + 180) break;
  }

  // FIXED + !important no CSS garante que o botão não seja cortado
  // pelo cartão nem desapareça por causa do layout.
  noBtn.style.setProperty("position", "fixed", "important");
  noBtn.style.setProperty("left", `${bestX}px`, "important");
  noBtn.style.setProperty("top", `${bestY}px`, "important");
  noBtn.style.setProperty("right", "auto", "important");
  noBtn.style.setProperty("bottom", "auto", "important");
  noBtn.style.setProperty("z-index", "999999", "important");

  const rotation = (Math.random() - 0.5) * 10;
  noBtn.style.transform = `rotate(${rotation}deg)`;

  const messages = [
    "ih, quase! 😭",
    "nem chegou perto KKKK",
    "o NÃO fugiu!",
    "tenta de novo 👀",
    "não encosta em mim 😭",
    "você não vai conseguir ♡",
    "esse botão é impossível KKKK"
  ];

  hint.textContent = messages[Math.min(attempts - 1, messages.length - 1)];
}

// Também impede qualquer tentativa de clique/toque.
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  moveButtonAway();
});

noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  moveButtonAway();
});

// Se a janela mudar de tamanho, reposiciona o botão.
window.addEventListener("resize", () => {
  moveButtonAway();
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

// Coloca o NÃO inicialmente em uma posição confortável,
// mas já sob controle do sistema de "repulsão".
window.addEventListener("load", () => {
  noBtn.style.setProperty("position", "fixed", "important");
  noBtn.style.setProperty("z-index", "999999", "important");
});
