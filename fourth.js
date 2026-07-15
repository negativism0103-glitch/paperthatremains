const scene = document.querySelector('.scene4-design');

if (scene) {
  const fragments = [...scene.querySelectorAll('.scene4-red-fragment')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let revealedCount = 0;

  const preloadNextScene = () => {
    [
      './public/scene5-background.png',
      './public/scene5-circle.png',
      './public/scene5-cyan.png',
      './public/scene5-env-left.png',
      './public/scene5-env-middle.png',
      './public/scene5-env-right.png',
      './public/scene5-red-fragments.png',
      './public/scene5-copy.png',
    ].forEach((source) => {
      const image = new Image();
      image.src = source;
    });
  };

  const revealFragment = (fragment) => {
    if (!scene.classList.contains('is-fragment-interactive') || fragment.classList.contains('is-red')) return;
    fragment.classList.add('is-red');
    fragment.setAttribute('aria-pressed', 'true');
    revealedCount += 1;

    if (revealedCount === fragments.length) {
      scene.classList.add('is-all-red');
      preloadNextScene();

      window.setTimeout(() => {
        scene.classList.add('is-final-copy');
      }, reducedMotion ? 0 : 1150);

      window.setTimeout(
        () => window.location.assign('./fifth.html'),
        reducedMotion ? 700 : 2200,
      );
    }
  };

  fragments.forEach((fragment) => {
    fragment.setAttribute('aria-pressed', 'false');
    fragment.addEventListener('pointerenter', () => revealFragment(fragment));
    fragment.addEventListener('focus', () => revealFragment(fragment));
    fragment.addEventListener('click', () => revealFragment(fragment));
  });

  window.setTimeout(() => {
    scene.classList.add('is-fragment-interactive');
    if (reducedMotion) fragments.forEach(revealFragment);
  }, reducedMotion ? 0 : 4450);
}
