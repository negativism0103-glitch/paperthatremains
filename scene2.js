const scene = document.querySelector('.scene2-design');

if (scene) {
  const zones = [...scene.querySelectorAll('.scene2-red-zone')];
  const status = scene.querySelector('[data-scene2-status]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let revealedCount = 0;

  const preloadNextScene = () => {
    [
      './public/scene3-background.png',
      './public/scene3-cyan.png',
      './public/scene3-env-left.png',
      './public/scene3-env-middle.png',
      './public/scene3-env-right.png',
      './public/scene3-description-updated.png',
    ].forEach((source) => {
      const image = new Image();
      image.src = source;
    });
  };

  window.setTimeout(() => {
    scene.classList.add('is-interactive');
    status.textContent = 'Move across the paper areas and click each shadow.';
  }, reducedMotion ? 0 : 4050);

  zones.forEach((zone) => {
    zone.addEventListener('click', () => {
      if (!scene.classList.contains('is-interactive') || zone.classList.contains('is-revealed')) return;

      zone.classList.add('is-revealed');
      zone.setAttribute('aria-pressed', 'true');
      revealedCount += 1;
      const remaining = zones.length - revealedCount;
      status.textContent = remaining > 0
        ? `${remaining} paper area${remaining === 1 ? '' : 's'} remaining.`
        : 'All paper areas are visible. The next page is ready.';

      if (revealedCount === zones.length) {
        scene.classList.add('is-resolved');
        preloadNextScene();

        if (reducedMotion) {
          scene.classList.add('is-dissolving', 'is-objects-only', 'is-final-state', 'is-complete');
          status.textContent = 'All paper areas are visible. Continuing to the next scene.';
          window.setTimeout(() => window.location.assign('./third.html'), 900);
        } else {
          window.setTimeout(() => scene.classList.add('is-dissolving'), 1900);
          window.setTimeout(() => scene.classList.add('is-objects-only', 'is-final-state'), 5300);
          window.setTimeout(() => {
            scene.classList.add('is-complete');
            status.textContent = 'Continuing to the next scene.';
          }, 6500);
          window.setTimeout(() => window.location.assign('./third.html'), 7400);
        }
      }
    });

    zone.setAttribute('aria-pressed', 'false');
  });
}
