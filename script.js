(() => {
  const no = document.getElementById("no");
  const yes = document.getElementById("yes");
  const hint = document.getElementById("hint");

  if (!no) return;

  // O botão NÃO é um elemento visual בלבד: ele não recebe pointer events.
  // O mouse é acompanhado pelo document, então não existe "perder o evento"
  // quando o cursor chega perto do botão.
  no.style.pointerEvents = "none";

  const REPEL_RADIUS = 235;
  const SAFE_DISTANCE = 205;
  const EDGE = 18;
  const MAX_SAMPLES = 100;

  let mouseX = -9999;
  let mouseY = -9999;
  let initialized = false;
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let raf = 0;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function buttonSize() {
    const r = no.getBoundingClientRect();
    return {
      w: Math.max(r.width, 1),
      h: Math.max(r.height, 1)
    };
  }

  function place(x, y, animate = true) {
    const { w, h } = buttonSize();
    const maxX = Math.max(EDGE, window.innerWidth - w - EDGE);
    const maxY = Math.max(EDGE, window.innerHeight - h - EDGE);

    targetX = clamp(x, EDGE, maxX);
    targetY = clamp(y, EDGE, maxY);

    if (!animate) {
      currentX = targetX;
      currentY = targetY;
      no.style.left = `${currentX}px`;
      no.style.top = `${currentY}px`;
      return;
    }

    no.classList.add("is-moving");
  }

  function center() {
    const r = no.getBoundingClientRect();
    return {
      x: r.left + r.width / 2,
      y: r.top + r.height / 2,
      w: r.width,
      h: r.height
    };
  }

  function candidateIsBetter(x, y, bestX, bestY, bestDistance) {
    const c = center();
    const d = Math.hypot((x + c.w / 2) - mouseX, (y + c.h / 2) - mouseY);
    return d > bestDistance ? { x, y, d } : { x: bestX, y: bestY, d: bestDistance };
  }

  function flee() {
    const c = center();
    const dx = c.x - mouseX;
    const dy = c.y - mouseY;
    const distance = Math.hypot(dx, dy);

    if (distance > REPEL_RADIUS) return;

    // Direção principal: exatamente para o lado oposto do cursor.
    let ux;
    let uy;

    if (distance < 1) {
      const angle = Math.random() * Math.PI * 2;
      ux = Math.cos(angle);
      uy = Math.sin(angle);
    } else {
      ux = dx / distance;
      uy = dy / distance;
    }

    const strength = Math.max(80, SAFE_DISTANCE + (REPEL_RADIUS - distance) * 1.45);

    const directX = c.x + ux * strength;
    const directY = c.y + uy * strength;

    // Converte centro -> canto superior esquerdo.
    const directLeft = directX - c.w / 2;
    const directTop = directY - c.h / 2;

    const maxX = Math.max(EDGE, window.innerWidth - c.w - EDGE);
    const maxY = Math.max(EDGE, window.innerHeight - c.h - EDGE);

    const clampedX = clamp(directLeft, EDGE, maxX);
    const clampedY = clamp(directTop, EDGE, maxY);

    const directCenterX = clampedX + c.w / 2;
    const directCenterY = clampedY + c.h / 2;
    const directDistance = Math.hypot(directCenterX - mouseX, directCenterY - mouseY);

    // Se a fuga direta bater na borda, procura a posição mais distante
    // entre vários pontos seguros do viewport.
    let best = {
      x: clampedX,
      y: clampedY,
      d: directDistance
    };

    if (directDistance < SAFE_DISTANCE) {
      const positions = [
        [EDGE, EDGE],
        [maxX, EDGE],
        [EDGE, maxY],
        [maxX, maxY],
        [maxX / 2, EDGE],
        [maxX / 2, maxY],
        [EDGE, maxY / 2],
        [maxX, maxY / 2],
        [maxX * .18, maxY * .18],
        [maxX * .82, maxY * .18],
        [maxX * .18, maxY * .82],
        [maxX * .82, maxY * .82]
      ];

      for (const [x, y] of positions) {
        best = candidateIsBetter(x, y, best.x, best.y, best.d);
      }

      for (let i = 0; i < MAX_SAMPLES; i++) {
        const x = EDGE + Math.random() * Math.max(1, maxX - EDGE);
        const y = EDGE + Math.random() * Math.max(1, maxY - EDGE);
        best = candidateIsBetter(x, y, best.x, best.y, best.d);
      }
    }

    place(best.x, best.y);

    if (hint) {
      hint.textContent = "ih, quase! 😭";
      clearTimeout(hint._timer);
      hint._timer = setTimeout(() => {
        hint.textContent = "escolha com carinho ♡";
      }, 900);
    }
  }

  function animate() {
    const ease = 0.32;

    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;

    no.style.left = `${currentX}px`;
    no.style.top = `${currentY}px`;

    // Continua verificando enquanto o cursor estiver perto.
    const c = center();
    const distance = Math.hypot(c.x - mouseX, c.y - mouseY);

    if (distance < REPEL_RADIUS + 30) {
      flee();
    }

    raf = requestAnimationFrame(animate);
  }

  function initialize() {
    if (initialized) return;
    initialized = true;

    const yesRect = yes ? yes.getBoundingClientRect() : null;
    const size = buttonSize();

    // Coloca o NÃO inicialmente ao lado do SIM, como no layout original.
    let x;
    let y;

    if (yesRect) {
      x = yesRect.right + 18;
      y = yesRect.top + (yesRect.height - size.h) / 2;
    } else {
      x = window.innerWidth / 2 - size.w / 2;
      y = window.innerHeight / 2 - size.h / 2;
    }

    const maxX = Math.max(EDGE, window.innerWidth - size.w - EDGE);
    const maxY = Math.max(EDGE, window.innerHeight - size.h - EDGE);

    x = clamp(x, EDGE, maxX);
    y = clamp(y, EDGE, maxY);

    place(x, y, false);

    // Remove a transição durante a inicialização.
    no.style.transition = "none";
    requestAnimationFrame(() => {
      no.style.transition = "";
    });

    if (!raf) raf = requestAnimationFrame(animate);
  }

  function updatePointer(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (!initialized) initialize();

    // Fuga imediata, além do loop contínuo.
    flee();
  }

  document.addEventListener("pointermove", updatePointer, { passive: true });
  document.addEventListener("mousemove", updatePointer, { passive: true });

  window.addEventListener("resize", () => {
    if (!initialized) return;

    const c = center();
    const { w, h } = buttonSize();
    const maxX = Math.max(EDGE, window.innerWidth - w - EDGE);
    const maxY = Math.max(EDGE, window.innerHeight - h - EDGE);

    place(clamp(c.x - w / 2, EDGE, maxX), clamp(c.y - h / 2, EDGE, maxY), false);
  });

  // SIM continua funcionando normalmente.
  if (yes) {
    yes.addEventListener("click", () => {
      if (hint) hint.textContent = "eu sabia 😏♡";
    });
  }

  // Inicializa mesmo antes do primeiro movimento.
  window.addEventListener("load", initialize);
  requestAnimationFrame(initialize);
})();
