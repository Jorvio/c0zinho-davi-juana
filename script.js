const noButton = document.getElementById('no');
const buttons = document.querySelector('.buttons');
const yesButton = document.getElementById('yes');

let fleeing = false;
let timer = null;

function placeNoBesideYes() {
  // Volta o NÃO para o fluxo normal e deixa os dois botões centralizados como no print.
  noButton.classList.remove('runaway', 'is-hidden');
  noButton.style.left = '';
  noButton.style.top = '';
  noButton.style.transform = '';
}

function randomPositionAwayFromPointer(mouseX, mouseY) {
  const rect = noButton.getBoundingClientRect();
  const margin = 28;
  const maxX = Math.max(margin, window.innerWidth - rect.width - margin);
  const maxY = Math.max(margin, window.innerHeight - rect.height - margin);

  // Tenta vários pontos e escolhe um que fique bem longe do cursor.
  let best = null;
  let bestDistance = -1;

  for (let i = 0; i < 120; i++) {
    const x = margin + Math.random() * (maxX - margin);
    const y = margin + Math.random() * (maxY - margin);
    const cx = x + rect.width / 2;
    const cy = y + rect.height / 2;
    const distance = Math.hypot(cx - mouseX, cy - mouseY);

    if (distance > bestDistance) {
      bestDistance = distance;
      best = { x, y };
    }
  }

  return best;
}

function flee(mouseX, mouseY) {
  if (fleeing) return;
  fleeing = true;

  // Primeiro some de verdade.
  noButton.classList.add('runaway', 'is-hidden');

  clearTimeout(timer);
  timer = setTimeout(() => {
    const position = randomPositionAwayFromPointer(mouseX, mouseY);

    noButton.style.left = `${position.x}px`;
    noButton.style.top = `${position.y}px`;
    noButton.style.transform = 'none';
    noButton.classList.remove('is-hidden');

    // Depois de reaparecer, volta a poder fugir normalmente.
    fleeing = false;
  }, 180);
}

document.addEventListener('pointermove', (event) => {
  if (fleeing) return;

  const rect = noButton.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);

  // Área de fuga generosa: a pessoa não precisa encostar no botão.
  if (distance < 105) {
    flee(event.clientX, event.clientY);
  }
});

window.addEventListener('resize', () => {
  if (!noButton.classList.contains('runaway')) {
    placeNoBesideYes();
  }
});

// Garante a posição inicial exatamente no conjunto centralizado.
placeNoBesideYes();
