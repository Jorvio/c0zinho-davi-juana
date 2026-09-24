const noButton = document.getElementById('no');
const yesButton = document.getElementById('yes');

let fleeing = false;
let timer = null;
const GAP = 18;
const MARGIN = 24;
const TRIGGER_DISTANCE = 110;

function positionNoBesideYes() {
  if (!noButton || !yesButton) return;

  noButton.classList.remove('is-hidden');
  noButton.style.opacity = '1';
  noButton.style.position = 'fixed';
  noButton.style.transform = 'none';

  const yes = yesButton.getBoundingClientRect();
  const no = noButton.getBoundingClientRect();

  // O espaço reservado pelo .no-slot faz o conjunto dos dois botões
  // ficar centralizado. O botão real é colocado exatamente sobre esse slot.
  noButton.style.left = `${yes.right + GAP}px`;
  noButton.style.top = `${yes.top + (yes.height - no.height) / 2}px`;
}

function randomPositionAwayFromPointer(mouseX, mouseY) {
  const rect = noButton.getBoundingClientRect();
  const maxX = Math.max(MARGIN, window.innerWidth - rect.width - MARGIN);
  const maxY = Math.max(MARGIN, window.innerHeight - rect.height - MARGIN);

  let best = { x: MARGIN, y: MARGIN, distance: -1 };

  for (let i = 0; i < 160; i++) {
    const x = MARGIN + Math.random() * Math.max(1, maxX - MARGIN);
    const y = MARGIN + Math.random() * Math.max(1, maxY - MARGIN);
    const cx = x + rect.width / 2;
    const cy = y + rect.height / 2;
    const distance = Math.hypot(cx - mouseX, cy - mouseY);
    if (distance > best.distance) best = { x, y, distance };
  }

  return best;
}

function flee(mouseX, mouseY) {
  if (fleeing) return;
  fleeing = true;
  noButton.classList.add('is-hidden');
  noButton.dataset.moved = 'true';

  clearTimeout(timer);
  timer = setTimeout(() => {
    const pos = randomPositionAwayFromPointer(mouseX, mouseY);
    noButton.style.left = `${pos.x}px`;
    noButton.style.top = `${pos.y}px`;
    noButton.style.transform = 'none';
    noButton.classList.remove('is-hidden');
    noButton.style.opacity = '1';
    fleeing = false;
  }, 140);
}


if (yesButton) {
  yesButton.addEventListener('click', () => {
    const card = document.querySelector('.card');
    if (!card) return;

    card.innerHTML = `
      <p class="eyebrow">RESPOSTA CONFIRMADA ♡</p>
      <div class="heart">♡</div>
      <h1 class="confirmed-title">Confirmado!</h1>
      <div class="confirmed-subtitle">cuzinho hoje então 😏</div>
    `;
  });
}

document.addEventListener('pointermove', (event) => {
  if (fleeing) return;

  const rect = noButton.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);

  if (distance <= TRIGGER_DISTANCE) {
    flee(event.clientX, event.clientY);
  }
}, { passive: true });

window.addEventListener('resize', () => {
  // O NÃO só volta para o conjunto centralizado se ainda estiver no lugar inicial.
  if (!noButton.dataset.moved) positionNoBesideYes();
});

window.addEventListener('load', positionNoBesideYes);
requestAnimationFrame(positionNoBesideYes);
