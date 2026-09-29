/* =====================================================
   FLAME & CRUST — Mini Chart Engine (pure canvas)
   Dark theme bar / line / donut charts. No libraries.
   ===================================================== */

const CH = {
  RED: '#e11d2e',
  RED_DIM: '#7f1d1d',
  GRID: '#262626',
  TEXT: '#8a8a8a',

  prep(canvas, h) {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth || canvas.parentElement.clientWidth;
    const height = h || canvas.clientHeight || 260;
    canvas.width = w * dpr;
    canvas.height = height * dpr;
    canvas.style.height = height + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, height);
    return { ctx, w, h: height };
  },

  /* --- BAR CHART --- */
  bar(canvas, labels, values, opts) {
    opts = opts || {};
    const { ctx, w, h } = this.prep(canvas, opts.height);
    const padL = 46, padR = 12, padT = 16, padB = 30;
    const iw = w - padL - padR, ih = h - padT - padB;
    const max = Math.max(...values, 1) * 1.15;
    const n = values.length;
    const slot = iw / n;
    const bw = Math.min(slot * 0.55, 38);

    /* grid + y labels */
    ctx.strokeStyle = this.GRID; ctx.fillStyle = this.TEXT;
    ctx.font = '11px sans-serif'; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + ih - (ih * i / 4);
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
      const v = Math.round(max * i / 4);
      ctx.textAlign = 'right'; ctx.fillText(v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v, padL - 8, y + 4);
    }
    /* bars */
    values.forEach((v, i) => {
      const bh = (v / max) * ih;
      const x = padL + slot * i + (slot - bw) / 2;
      const y = padT + ih - bh;
      const grad = ctx.createLinearGradient(0, y, 0, padT + ih);
      grad.addColorStop(0, opts.color || this.RED);
      grad.addColorStop(1, opts.color2 || '#8f1420');
      ctx.fillStyle = grad;
      /* rounded top */
      const r = Math.min(5, bw / 2, bh);
      ctx.beginPath();
      ctx.moveTo(x, padT + ih);
      ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
      ctx.lineTo(x + bw - r, y); ctx.arcTo(x + bw, y, x + bw, y + r, r);
      ctx.lineTo(x + bw, padT + ih); ctx.closePath(); ctx.fill();
      /* x labels */
      ctx.fillStyle = this.TEXT; ctx.textAlign = 'center';
      ctx.font = '10.5px sans-serif';
      const lb = labels[i] || '';
      ctx.fillText(lb.length > 6 ? lb.slice(0, 6) : lb, x + bw / 2, h - 10);
    });
  },

  /* --- LINE / AREA CHART --- */
  line(canvas, labels, values, opts) {
    opts = opts || {};
    const { ctx, w, h } = this.prep(canvas, opts.height);
    const padL = 46, padR = 14, padT = 16, padB = 30;
    const iw = w - padL - padR, ih = h - padT - padB;
    const max = Math.max(...values, 1) * 1.15;
    const n = values.length;
    const X = i => padL + (n === 1 ? iw / 2 : iw * i / (n - 1));
    const Y = v => padT + ih - (v / max) * ih;

    /* grid */
    ctx.strokeStyle = this.GRID; ctx.lineWidth = 1; ctx.fillStyle = this.TEXT; ctx.font = '11px sans-serif';
    for (let i = 0; i <= 4; i++) {
      const y = padT + ih - (ih * i / 4);
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
      const v = Math.round(max * i / 4);
      ctx.textAlign = 'right'; ctx.fillText(v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v, padL - 8, y + 4);
    }
    /* x labels */
    const step = Math.ceil(n / 8);
    ctx.font = '10.5px sans-serif'; ctx.textAlign = 'center';
    labels.forEach((lb, i) => { if (i % step === 0) ctx.fillText(lb, X(i), h - 10); });

    /* area */
    const grad = ctx.createLinearGradient(0, padT, 0, padT + ih);
    grad.addColorStop(0, 'rgba(225,29,46,0.28)');
    grad.addColorStop(1, 'rgba(225,29,46,0)');
    ctx.beginPath();
    values.forEach((v, i) => i === 0 ? ctx.moveTo(X(i), Y(v)) : ctx.lineTo(X(i), Y(v)));
    ctx.lineTo(X(n - 1), padT + ih); ctx.lineTo(X(0), padT + ih); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();

    /* line */
    ctx.beginPath();
    values.forEach((v, i) => i === 0 ? ctx.moveTo(X(i), Y(v)) : ctx.lineTo(X(i), Y(v)));
    ctx.strokeStyle = opts.color || this.RED; ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round'; ctx.stroke();

    /* points */
    values.forEach((v, i) => {
      ctx.beginPath(); ctx.arc(X(i), Y(v), 3.2, 0, Math.PI * 2);
      ctx.fillStyle = opts.color || this.RED; ctx.fill();
      ctx.strokeStyle = '#0a0a0a'; ctx.lineWidth = 1.5; ctx.stroke();
    });
  },

  /* --- DONUT CHART --- */
  donut(canvas, segments, opts) {
    opts = opts || {};
    const { ctx, w, h } = this.prep(canvas, opts.height);
    const total = segments.reduce((s, x) => s + x.value, 0) || 1;
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 14;
    const thick = r * 0.42;
    let start = -Math.PI / 2;

    segments.forEach(seg => {
      const angle = (seg.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r - thick / 2, start, start + angle);
      ctx.strokeStyle = seg.color;
      ctx.lineWidth = thick;
      ctx.lineCap = 'butt';
      ctx.stroke();
      start += angle;
    });

    /* center text */
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f5f5f5';
    ctx.font = '700 22px sans-serif';
    ctx.fillText(opts.centerValue != null ? opts.centerValue : total, cx, cy + 2);
    ctx.fillStyle = this.TEXT;
    ctx.font = '11px sans-serif';
    ctx.fillText(opts.centerLabel || 'Total', cx, cy + 20);
  },

  /* --- SPARKLINE (mini chart for stat cards) --- */
  spark(canvas, values, opts) {
    opts = opts || {};
    const { ctx, w, h } = this.prep(canvas, opts.height || 34);
    if (!values.length) return;
    const max = Math.max(...values, 1);
    const bw = w / values.length;
    if (opts.type === 'line') {
      ctx.beginPath();
      values.forEach((v, i) => {
        const x = i * bw + bw / 2;
        const y = h - 3 - (v / max) * (h - 8);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.strokeStyle = opts.color || this.RED; ctx.lineWidth = 1.8; ctx.lineJoin = 'round'; ctx.stroke();
      ctx.lineTo(w - 1, h); ctx.lineTo(1, h); ctx.closePath();
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, 'rgba(225,29,46,0.25)'); g.addColorStop(1, 'rgba(225,29,46,0)');
      ctx.fillStyle = g; ctx.fill();
    } else {
      values.forEach((v, i) => {
        const bh = Math.max(2, (v / max) * (h - 4));
        ctx.fillStyle = i === values.length - 1 ? (opts.color || this.RED) : 'rgba(225,29,46,0.3)';
        const x = i * bw + bw * 0.18, y = h - bh;
        const bwd = bw * 0.64, r = Math.min(2, bwd / 2);
        roundRect(ctx, x, y, bwd, bh, r); ctx.fill();
      });
    }
  },

  /* --- HORIZONTAL BARS (popular foods) --- */
  hbar(canvas, labels, values, opts) {
    opts = opts || {};
    const { ctx, w, h } = this.prep(canvas, opts.height);
    const rowH = h / labels.length;
    const labelW = Math.min(150, w * 0.38);
    const max = Math.max(...values, 1);

    labels.forEach((lb, i) => {
      const y = rowH * i + rowH / 2;
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#cfcfcf'; ctx.textAlign = 'left';
      let text = lb.length > 20 ? lb.slice(0, 19) + '…' : lb;
      ctx.fillText(text, 0, y - 6);
      const bw = (w - labelW - 48);
      const fill = (values[i] / max) * bw;
      /* track */
      ctx.fillStyle = '#1e1e1e';
      roundRect(ctx, labelW, y + 2, bw, 8, 4); ctx.fill();
      /* fill */
      const grad = ctx.createLinearGradient(labelW, 0, labelW + bw, 0);
      grad.addColorStop(0, '#8f1420'); grad.addColorStop(1, this.RED);
      ctx.fillStyle = grad;
      roundRect(ctx, labelW, y + 2, Math.max(fill, 4), 8, 4); ctx.fill();
      /* value */
      ctx.fillStyle = this.RED; ctx.textAlign = 'left';
      ctx.font = '700 11px sans-serif';
      ctx.fillText(values[i], labelW + bw + 8, y + 10);
    });
  }
};

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
