const home = document.querySelector('.home-design');

if (home) {
  const fragments = [...home.querySelectorAll('.home-fragment')];
  const status = home.querySelector('[data-home-status]');
  const words = ['paper', 'that', 'remains'];
  let clickCount = 0;

  const revealNextWord = (fragment) => {
    fragment.classList.remove('is-hit');
    window.requestAnimationFrame(() => fragment.classList.add('is-hit'));

    if (clickCount >= words.length) return;

    clickCount += 1;
    home.classList.add(`title-step-${clickCount}`);
    status.textContent = `${words[clickCount - 1]} revealed.`;

    if (clickCount === words.length) {
      window.setTimeout(() => {
        home.classList.add('start-ready');
        status.textContent = 'The full title is revealed. Start is ready.';
      }, 520);
    }
  };

  fragments.forEach((fragment) => {
    fragment.addEventListener('click', () => revealNextWord(fragment));
  });
}
