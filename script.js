/* ============================================================
   2026 KPSS Ortaöğretim Rehberi — Etkileşim Katmanı
   ============================================================ */

const EXAM_DATE = new Date('2026-10-25T10:15:00+03:00').getTime();
const CAMP_START = new Date('2026-07-01T00:00:00+03:00').getTime();

const SUBJECTS = [
  { key: 'tur', label: '📖 Türkçe',          total: 30, group: 'GY' },
  { key: 'mat', label: '🔢 Matematik',       total: 30, group: 'GY' },
  { key: 'tar', label: '🏛️ Tarih',           total: 27, group: 'GK' },
  { key: 'cog', label: '🗺️ Coğrafya',        total: 18, group: 'GK' },
  { key: 'vat', label: '⚖️ Vatandaşlık',     total: 9,  group: 'GK' },
  { key: 'gun', label: '📰 Güncel Bilgiler', total: 6,  group: 'GK' },
];

const $ = (id) => document.getElementById(id);
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/* ---------- 1. GERİ SAYIM ---------- */
function tickCountdown() {
  const diff = EXAM_DATE - Date.now();
  if (diff <= 0) {
    $('countdown').innerHTML = '<h2 style="color:var(--success)">🎉 Sınav tamamlandı! Sonuçlar 19 Kasım 2026\'da açıklanıyor.</h2>';
    clearInterval(cdInterval);
    return;
  }
  const g = Math.floor(diff / 86400000);
  const s = Math.floor((diff % 86400000) / 3600000);
  const d = Math.floor((diff % 3600000) / 60000);
  const sn = Math.floor((diff % 60000) / 1000);
  $('gun').textContent = g;
  $('saat').textContent = String(s).padStart(2, '0');
  $('dakika').textContent = String(d).padStart(2, '0');
  $('saniye').textContent = String(sn).padStart(2, '0');
}
const cdInterval = setInterval(tickCountdown, 1000);
tickCountdown();

/* ---------- 2. ÇALIŞMA KAMPI İLERLEMESİ ---------- */
(function updateProgress() {
  const total = EXAM_DATE - CAMP_START;
  const elapsed = clamp(Date.now() - CAMP_START, 0, total);
  const pct = Math.floor((elapsed / total) * 100);
  requestAnimationFrame(() => {
    $('progressFill').style.width = pct + '%';
    $('progressPercent').textContent = '%' + pct;
  });
})();

/* ---------- 3. TEMA (KARANLIK / AYDINLIK) ---------- */
const themeBtn = $('themeToggle');
function applyTheme(dark) {
  document.body.classList.toggle('dark', dark);
  themeBtn.textContent = dark ? '☀️' : '🌙';
  localStorage.setItem('kpss2026-theme', dark ? 'dark' : 'light');
}
const saved = localStorage.getItem('kpss2026-theme');
applyTheme(saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
themeBtn.addEventListener('click', () => applyTheme(!document.body.classList.contains('dark')));

/* ---------- 4. NAVBAR, MOBİL MENÜ, İLERLEME ÇUBUĞU ---------- */
const navbar = $('navbar'), navLinks = $('navLinks');
$('hamburger').addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

const backTop = $('backTop');
backTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

addEventListener('scroll', () => {
  const y = scrollY;
  navbar.classList.toggle('scrolled', y > 10);
  backTop.classList.toggle('show', y > 600);
  const max = document.documentElement.scrollHeight - innerHeight;
  $('scrollProgress').style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
}, { passive: true });

/* ---------- 5. SCROLL ANİMASYONLARI + SAYAÇLAR ---------- */
function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || 0, 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const dur = 1600, start = performance.now();
  (function frame(now) {
    const p = clamp((now - start) / dur, 0, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + (target * eased).toLocaleString('tr-TR',
      { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    if (p < 1) requestAnimationFrame(frame);
  })(start);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    e.target.querySelectorAll('.stat-num[data-count]').forEach(n => {
      if (!n.dataset.done) { n.dataset.done = 1; animateCounter(n); }
    });
    observer.unobserve(e.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ---------- 6. DİNAMİK SELAMLAMA ---------- */
(function greeting() {
  const h = new Date().getHours();
  let msg;
  if (h >= 5 && h < 12)       msg = 'Günaydın! ☕ Erken kalkan yol alır — bugünü verimli değerlendir.';
  else if (h >= 12 && h < 18) msg = 'İyi çalışmalar! 🎯 Küçük adımlar, büyük puanlar getirir.';
  else if (h >= 18 && h < 23) msg = 'İyi akşamlar! 🌙 Gece sessizliği en iyi çalışma arkadaşıdır.';
  else                        msg = 'Gece kuşu modu! 🦉 Kısa ve odaklı tekrarlar tam sana göre.';
  $('greeting').textContent = msg;
})();

/* ---------- 7. KONU SEKMELERİ ---------- */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    $('panel-' + btn.dataset.tab).classList.add('active');
  });
});

/* ---------- 8. SSS (AKORDEON) ---------- */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const answer = item.querySelector('.faq-a');
    const open = item.classList.toggle('open');
    answer.style.maxHeight = open ? answer.scrollHeight + 'px' : '0';
  });
});

/* ---------- 9. NET & PUAN HESAPLAYICI ---------- */
const calcRows = $('calcRows');
const inputs = {};

SUBJECTS.forEach(s => {
  const row = document.createElement('div');
  row.className = 'calc-row';
  row.innerHTML = `
    <div class="calc-subject">${s.label} <small>(${s.total} soru • ${s.group})</small></div>
    <input type="number" min="0" max="${s.total}" value="0" data-key="${s.key}" data-type="d" aria-label="${s.label} doğru sayısı">
    <input type="number" min="0" max="${s.total}" value="0" data-key="${s.key}" data-type="y" aria-label="${s.label} yanlış sayısı">
    <div class="calc-net" id="net-${s.key}">0</div>`;
  calcRows.appendChild(row);
  inputs[s.key] = {
    d: row.querySelector('input[data-type="d"]'),
    y: row.querySelector('input[data-type="y"]'),
  };
});

const fmt = (n) => n.toLocaleString('tr-TR', { maximumFractionDigits: 2 });

function recalc() {
  let gy = 0, gk = 0;
  SUBJECTS.forEach(s => {
    const d = clamp(parseInt(inputs[s.key].d.value, 10) || 0, 0, s.total);
    const y = clamp(parseInt(inputs[s.key].y.value, 10) || 0, 0, s.total - d);
    const net = Math.max(0, d - y / 4);
    $('net-' + s.key).textContent = fmt(net);
    s.group === 'GY' ? (gy += net) : (gk += net);
  });
  const total = gy + gk;
  $('resGY').textContent = fmt(gy);
  $('resGK').textContent = fmt(gk);
  $('resTotal').textContent = fmt(total);
  const puan = total > 0 ? Math.min(99, 40 + 60 * Math.sqrt(total / 120)) : 0;
  $('resScore').textContent = puan > 0
    ? puan.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    : '–';
}

calcRows.addEventListener('input', recalc);
$('calcReset').addEventListener('click', () => {
  Object.values(inputs).forEach(({ d, y }) => { d.value = 0; y.value = 0; });
  recalc();
});
recalc();
