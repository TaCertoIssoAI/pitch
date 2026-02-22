const DEFAULTS = {
  pointColor: "rgba(32, 198, 89, 0.65)",
  lineColor: "rgba(0, 230, 118, 0.12)",
  lineWidth: 0.5,
  pointRadius: 1.2,
  speed: 0.003,
  spacing: 32,
  bandsTop: 3,
  bandsBottom: 3,
};

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function createBandPoints({ width, height, ratio, spacing }) {
  const cols = Math.ceil(width / spacing) + 2;
  const rows = Math.ceil(height / spacing) + 2;
  const points = [];
  const originY = height * ratio;

  for (let r = 0; r < rows; r += 1) {
    const row = [];
    for (let c = 0; c < cols; c += 1) {
      const x = c * spacing - spacing;
      const y0 = originY + (r - rows / 2) * (spacing * 0.6);
      row.push({
        x,
        y0,
        phase: rand(0, Math.PI * 2),
        amp: rand(6, 12),
        speed: rand(0.6, 1.2),
        freq: rand(0.008, 0.014),
      });
    }
    points.push(row);
  }

  return { ratio, originY, rows, cols, points };
}

function createBands({ width, height, spacing, topCount, bottomCount }) {
  const bands = [];

  for (let i = 0; i < topCount; i += 1) {
    bands.push(
      createBandPoints({
        width,
        height,
        ratio: rand(0.08, 0.28),
        spacing,
      })
    );
  }

  for (let i = 0; i < bottomCount; i += 1) {
    bands.push(
      createBandPoints({
        width,
        height,
        ratio: rand(0.72, 0.92),
        spacing,
      })
    );
  }

  return bands;
}

export function initWaves(options = {}) {
  const config = { ...DEFAULTS, ...options };
  const canvas = document.getElementById("wave-background");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  let width = 0;
  let height = 0;
  let dpr = 1;
  let t = 0;
  let bands = [];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.max(window.devicePixelRatio || 1, 1);
    width = Math.floor(rect.width * dpr);
    height = Math.floor(rect.height * dpr);
    canvas.width = width;
    canvas.height = height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    bands = createBands({
      width: width / dpr,
      height: height / dpr,
      spacing: config.spacing,
      topCount: config.bandsTop,
      bottomCount: config.bandsBottom,
    });
  }

  function updatePoint(point) {
    const wave =
      Math.sin(t * config.speed * point.speed + point.phase + point.x * point.freq) *
      point.amp;
    return point.y0 + wave;
  }

  function drawBand(band) {
    const rows = band.rows;
    const cols = band.cols;

    ctx.beginPath();
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const point = band.points[r][c];
        const y = updatePoint(point);
        point.y = y;

        if (c + 1 < cols) {
          const next = band.points[r][c + 1];
          ctx.moveTo(point.x, y);
          ctx.lineTo(next.x, updatePoint(next));
        }

        if (r + 1 < rows) {
          const next = band.points[r + 1][c];
          ctx.moveTo(point.x, y);
          ctx.lineTo(next.x, updatePoint(next));
        }
      }
    }
    ctx.strokeStyle = config.lineColor;
    ctx.stroke();

    ctx.fillStyle = config.pointColor;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const point = band.points[r][c];
        const y = point.y ?? updatePoint(point);
        ctx.beginPath();
        ctx.arc(point.x, y, config.pointRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function render() {
    const w = width / dpr;
    const h = height / dpr;
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = config.lineWidth;
    ctx.globalCompositeOperation = "lighter";

    bands.forEach(drawBand);

    ctx.globalCompositeOperation = "source-over";
    t += 1;
    requestAnimationFrame(render);
  }

  resize();
  window.addEventListener("resize", resize);
  render();
}
