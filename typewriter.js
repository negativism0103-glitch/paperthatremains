const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

const runCopySequence = async () => {
  const scene = document.querySelector('.typed-scene');
  const copies = [...document.querySelectorAll('[data-typewriter]')];
  if (!scene || copies.length === 0) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  for (const [index, copy] of copies.entries()) {
    const delay = reducedMotion
      ? 0
      : index === 0
        ? Number(copy.dataset.delay || 0)
        : Number(copy.dataset.gap || 280);
    await wait(delay);
    copy.classList.add('is-typed');
    if (!reducedMotion) await wait(620);
  }

  scene.classList.add('is-copy-complete');
};

runCopySequence();
