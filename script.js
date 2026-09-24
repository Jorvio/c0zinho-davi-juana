const noBtn = document.getElementById("no");
const yesBtn = document.getElementById("yes");
const hint = document.getElementById("hint");
const success = document.getElementById("success");

let tries = 0;
let fleeing = false;

function moveAwayFromPointer(event) {
  tries++;

  const btn = noBtn.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const padding = 18;

  // Pointer position. mouseenter gives clientX/clientY.
  const px = event.clientX;
  const py = event.clientY;

  // Current center of the button.
  const bx = btn.left + btn.width / 2;
  const by = btn.top + btn.height / 2;

  // Direction from cursor -> button.
  let dx = bx - px;
  let dy = by - py;
  const distance = Math.hypot(dx, dy) || 1;

  dx /= distance;
  dy /= distance;

  // Add a little randomness so it doesn't follow a predictable path.
  const angle = (Math.random() - 0.5) * 0.8;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const nx = dx * cos - dy * sin;
  const ny = dx * sin + dy * cos;

  // Move a substantial distance away, so it visibly "runs".
  const jump = 180 + Math.random() * 120;

  let left = bx + nx * jump - btn.width / 2;
  let top = by + ny * jump - btn.height / 2;

  // Keep it fully visible on screen.
  left = Math.max(padding, Math.min(vw - btn.width - padding, left));
  top = Math.max(padding, Math.min(vh - btn.height - padding, top));

  noBtn.style.position = "fixed";
  noBtn.style.left = `${left}px`;
  noBtn.style.top = `${top}px`;
  noBtn.style.zIndex = "9999";
  noBtn.style.transition = "left .18s cubic-bezier(.2,.8,.2,1), top .18s cubic-bezier(.2,.8,.2,1), transform .18s ease";
  noBtn.style.transform = `rotate(${(Math.random() - 0.5) * 12}deg)`;

  const messages = [
    "ih, quase! 😭",
    "não vai conseguir não KKKK",
    "FOI POR POUCO 👀",
    "ele tá fugindo de você!",
    "para de tentar o NÃO 😭",
    "não adianta correr atrás ♡"
  ];
  hint.textContent = messages[Math.min(tries - 1, messages.length - 1)];

  // After a short pause, allow another chase.
  fleeing = true;
  setTimeout(() => fleeing = false, 120);
}

// mouseenter fires before the cursor can click the button.
noBtn.addEventListener("mouseenter", moveAwayFromPointer);

// Also protect touch/click attempts.
noBtn.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  moveAwayFromPointer(event);
});

// If the cursor gets very close after the first move, run again.
document.addEventListener("mousemove", (event) => {
  if (noBtn.style.position !== "fixed") return;

  const r = noBtn.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const d = Math.hypot(event.clientX - cx, event.clientY - cy);

  if (d < 75 && !fleeing) {
    moveAwayFromPointer(event);
  }
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
  el.style.animationDuration = `${4.5 + Math.random() * 3}s`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 8000);
}
