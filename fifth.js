const scene = document.querySelector('.finale-design');
const artwork = scene?.querySelector('.intro-artwork');
const canvas = scene?.querySelector('.fragment-canvas');

if (scene && artwork && canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const context = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  const fragments = [
    [[62, 171], [301, 139], [385, 262], [323, 405], [104, 385]],
    [[304, 115], [575, 106], [777, 226], [650, 332], [352, 277]],
    [[1327, 3], [1599, 1], [1599, 311], [1450, 287]],
    [[22, 401], [262, 376], [318, 568], [109, 632]],
    [[251, 300], [631, 272], [777, 448], [535, 629], [250, 536]],
    [[675, 245], [1041, 211], [1088, 501], [790, 536]],
    [[536, 455], [1016, 406], [1238, 701], [952, 833], [614, 689]],
    [[1190, 298], [1599, 286], [1599, 690], [1290, 677]],
    [[0, 553], [253, 532], [298, 877], [65, 921]],
    [[529, 670], [891, 622], [993, 988], [666, 1033]],
    [[923, 602], [1468, 561], [1508, 954], [1112, 1006]],
  ];

  const active = new Map();
  let hoveredFragment = -1;
  let animationFrame = 0;

  const pointInPolygon = (x, y, polygon) => {
    let inside = false;
    for (let current = 0, previous = polygon.length - 1; current < polygon.length; previous = current++) {
      const [currentX, currentY] = polygon[current];
      const [previousX, previousY] = polygon[previous];
      const intersects = ((currentY > y) !== (previousY > y))
        && x < ((previousX - currentX) * (y - currentY)) / (previousY - currentY) + currentX;
      if (intersects) inside = !inside;
    }
    return inside;
  };

  const polygonCenter = (polygon) => polygon.reduce(
    (center, point) => [center[0] + point[0] / polygon.length, center[1] + point[1] / polygon.length],
    [0, 0],
  );

  const drawFragmentEcho = (polygon, center, offsetX, offsetY, rotation, opacity) => {
    context.save();
    context.globalAlpha = opacity;
    context.translate(center[0] + offsetX, center[1] + offsetY);
    context.rotate(rotation);
    context.translate(-center[0], -center[1]);
    context.beginPath();
    polygon.forEach(([x, y], index) => {
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.closePath();
    context.clip();
    context.drawImage(artwork, 0, 0, width, height);
    context.restore();
  };

  const render = (time) => {
    context.clearRect(0, 0, width, height);

    active.forEach((startedAt, index) => {
      const elapsed = (time - startedAt) / 1000;
      if (elapsed >= 1.15) {
        active.delete(index);
        return;
      }

      const polygon = fragments[index];
      const center = polygonCenter(polygon);
      const outwardX = (center[0] - width / 2) / (width / 2);
      const outwardY = (center[1] - height / 2) / (height / 2);
      const attack = Math.min(elapsed / 0.16, 1);
      const recovery = 1 - Math.max(0, elapsed - 0.16) / 0.99;
      const energy = Math.sin(attack * Math.PI / 2) * Math.max(0, recovery);

      for (let echo = 1; echo <= 3; echo += 1) {
        const seed = index * 1.73 + echo * 2.41;
        const distance = (18 + echo * 16) * energy;
        const offsetX = (outwardX * distance) + Math.sin(seed) * distance * 0.7;
        const offsetY = (outwardY * distance) + Math.cos(seed * 1.4) * distance * 0.55;
        const rotation = Math.sin(seed * 2.2) * 0.09 * energy;
        const opacity = (0.34 - echo * 0.055) * energy;
        drawFragmentEcho(polygon, center, offsetX, offsetY, rotation, opacity);
      }
    });

    if (active.size > 0) animationFrame = requestAnimationFrame(render);
    else animationFrame = 0;
  };

  const activateFragment = (index) => {
    active.set(index, performance.now());
    if (!animationFrame) animationFrame = requestAnimationFrame(render);
  };

  scene.addEventListener('pointermove', (event) => {
    const bounds = scene.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * width;
    const y = ((event.clientY - bounds.top) / bounds.height) * height;
    const index = fragments.findIndex((polygon) => pointInPolygon(x, y, polygon));

    if (index !== hoveredFragment) {
      hoveredFragment = index;
      if (index >= 0) activateFragment(index);
    }
  });

  scene.addEventListener('pointerleave', () => {
    hoveredFragment = -1;
  });
}
