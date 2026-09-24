(() => {
  const no = document.getElementById("no");
  const yes = document.getElementById("yes");
  const hint = document.getElementById("hint");

  if (!no) return;

  // O botão nunca recebe o mouse. O document observa o cursor.
  no.style.pointerEvents = "none";
  no.style.position = "fixed";

  const DISTANCIA_FUGA = 190;
  const MARGEM = 24;
  let mouseX = -9999;
  let mouseY = -9999;
  let mudando = false;

  function limite(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function tamanho() {
    const r = no.getBoundingClientRect();
    return { w: r.width || 122, h: r.height || 48 };
  }

  function distanciaDoMouse(x, y, w, h) {
    const cx = x + w / 2;
    const cy = y + h / 2;
    return Math.hypot(cx - mouseX, cy - mouseY);
  }

  function novaPosicao() {
    const { w, h } = tamanho();
    const maxX = Math.max(MARGEM, window.innerWidth - w - MARGEM);
    const maxY = Math.max(MARGEM, window.innerHeight - h - MARGEM);

    let melhor = null;

    // Tenta várias posições e escolhe uma bem longe do cursor.
    for (let i = 0; i < 80; i++) {
      const x = MARGEM + Math.random() * Math.max(1, maxX - MARGEM);
      const y = MARGEM + Math.random() * Math.max(1, maxY - MARGEM);
      const d = distanciaDoMouse(x, y, w, h);

      if (!melhor || d > melhor.d) {
        melhor = { x, y, d };
      }

      if (d >= DISTANCIA_FUGA * 1.8) break;
    }

    return melhor || { x: MARGEM, y: MARGEM };
  }

  function fugir() {
    if (mudando) return;

    const r = no.getBoundingClientRect();
    const centroX = r.left + r.width / 2;
    const centroY = r.top + r.height / 2;
    const distancia = Math.hypot(centroX - mouseX, centroY - mouseY);

    if (distancia > DISTANCIA_FUGA) return;

    mudando = true;

    // Some primeiro...
    no.style.opacity = "0";

    setTimeout(() => {
      const pos = novaPosicao();
      no.style.left = `${pos.x}px`;
      no.style.top = `${pos.y}px`;

      // ...e aparece em outro lugar da tela.
      requestAnimationFrame(() => {
        no.style.opacity = "1";
        mudando = false;
      });
    }, 90);

    if (hint) {
      hint.textContent = "ih, quase! 😭";
      clearTimeout(hint._timer);
      hint._timer = setTimeout(() => {
        hint.textContent = "escolha com carinho ♡";
      }, 900);
    }
  }

  function posicionarInicialmente() {
    const { w, h } = tamanho();
    const sim = yes?.getBoundingClientRect();

    let x = sim ? sim.right + 18 : window.innerWidth / 2 + 20;
    let y = sim ? sim.top + (sim.height - h) / 2 : window.innerHeight / 2;

    x = limite(x, MARGEM, Math.max(MARGEM, window.innerWidth - w - MARGEM));
    y = limite(y, MARGEM, Math.max(MARGEM, window.innerHeight - h - MARGEM));

    no.style.left = `${x}px`;
    no.style.top = `${y}px`;
    no.style.opacity = "1";
  }

  function moverMouse(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    fugir();
  }

  document.addEventListener("pointermove", moverMouse, { passive: true });
  document.addEventListener("mousemove", moverMouse, { passive: true });

  window.addEventListener("resize", () => {
    const { w, h } = tamanho();
    const r = no.getBoundingClientRect();
    no.style.left = `${limite(r.left, MARGEM, Math.max(MARGEM, window.innerWidth - w - MARGEM))}px`;
    no.style.top = `${limite(r.top, MARGEM, Math.max(MARGEM, window.innerHeight - h - MARGEM))}px`;
  });

  if (yes) {
    yes.addEventListener("click", () => {
      if (hint) hint.textContent = "eu sabia 😏♡";
    });
  }

  window.addEventListener("load", posicionarInicialmente);
  requestAnimationFrame(posicionarInicialmente);
})();
