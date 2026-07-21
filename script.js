/* ============================================================
   2026 KPSS Ortaöğretim — Premium Etkileşim Katmanı
   ============================================================ */

const EXAM_DATE = new Date('2026-10-25T10:15:00+03:00').getTime();
const CAMP_START = new Date('2026-07-01T00:00:00+03:00').getTime();

const SUBJECTS = [
  { key:'tur', label:'📖 Türkçe',          total:30, group:'GY' },
  { key:'mat', label:'🔢 Matematik',       total:30, group:'GY' },
  { key:'tar', label:'🏛️ Tarih',           total:27, group:'GK' },
  { key:'cog', label:'🗺️ Coğrafya',        total:18, group:'GK' },
  { key:'vat', label:'⚖️ Vatandaşlık',     total:9,  group:'GK' },
  { key:'gun', label:'📰 Güncel Bilgiler', total:6,  group:'GK' },
];

const $ = id => document.getElementById(id);
const clamp = (v,a,b) => Math.min(Math.max(v,a),b);

/* ---------- LUCIDE ICONS ---------- */
window.addEventListener('load', () => { if(window.lucide) lucide.createIcons(); });

/* ---------- 1. GERİ SAYIM ---------- */
function tick(){
  const d = EXAM_DATE - Date.now();
  if(d <= 0){
    $('countdown').innerHTML = '<div class="cd-done"><i data-lucide="party-popper"></i> Sınav tamamlandı! Sonuçlar 19 Kasım\'da.</div>';
    if(window.lucide) lucide.createIcons();
    clearInterval(cdInt); return;
  }
  $('gun').textContent = Math.floor(d/864e5);
  $('saat').textContent = String(Math.floor(d%864e5/36e5)).padStart(2,'0');
  $('dakika').textContent = String(Math.floor(d%36e5/6e4)).padStart(2,'0');
  $('saniye').textContent = String(Math.floor(d%6e4/1e3)).padStart(2,'0');
}
const cdInt = setInterval(tick,1000); tick();

/* ---------- 2. KAMP İLERLEMESİ ---------- */
(function(){
  const total = EXAM_DATE - CAMP_START;
  const pct = Math.floor(clamp(Date.now()-CAMP_START,0,total)/total*100);
  requestAnimationFrame(()=>{
    $('progressFill').style.width = pct+'%';
    $('progressPercent').textContent = '%'+pct;
  });
})();

/* ---------- 3. TEMA ---------- */
const tBtn = $('themeToggle');
function setTheme(dark){
  document.body.classList.toggle('dark',dark);
  tBtn.innerHTML = dark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
  localStorage.setItem('kpss26-theme', dark?'dark':'light');
  if(window.lucide) lucide.createIcons();
}
const saved = localStorage.getItem('kpss26-theme');
setTheme(saved ? saved==='dark' : matchMedia('(prefers-color-scheme:dark)').matches);
tBtn.addEventListener('click',()=>setTheme(!document.body.classList.contains('dark')));

/* ---------- 4. NAVBAR & SCROLL ---------- */
const navbar=$('navbar'), navLinks=$('navLinks'), backTop=$('backTop');
$('hamburger').addEventListener('click',()=>navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));
backTop.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

addEventListener('scroll',()=>{
  const y=scrollY;
  navbar.classList.toggle('scrolled',y>10);
  backTop.classList.toggle('show',y>600);
  const max=document.documentElement.scrollHeight-innerHeight;
  $('scrollProgress').style.width=(max>0?y/max*100:0)+'%';
},{passive:true});

/* ---------- 5. REVEAL + COUNTERS ---------- */
function animCount(el){
  const t=parseFloat(el.dataset.count), dec=+(el.dataset.decimals||0);
  const pre=el.dataset.prefix||'', suf=el.dataset.suffix||'';
  const dur=1600, st=performance.now();
  (function f(now){
    const p=clamp((now-st)/dur,0,1), e=1-Math.pow(1-p,3);
    el.textContent=pre+(t*e).toLocaleString('tr-TR',{minimumFractionDigits:dec,maximumFractionDigits:dec})+suf;
    if(p<1) requestAnimationFrame(f);
  })(st);
}
const obs=new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(!e.isIntersecting) return;
    e.target.classList.add('visible');
    e.target.querySelectorAll('.stat-num[data-count]').forEach(n=>{
      if(!n.dataset.done){n.dataset.done=1;animCount(n);}
    });
    obs.unobserve(e.target);
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

/* ---------- 6. SELAMLAMA ---------- */
(function(){
  const h=new Date().getHours(); let m;
  if(h>=5&&h<12) m='Günaydın! ☕ Erken kalkan yol alır — verimli bir gün olsun.';
  else if(h>=12&&h<18) m='İyi çalışmalar! 🎯 Küçük adımlar büyük puanlar getirir.';
  else if(h>=18&&h<23) m='İyi akşamlar! 🌙 Gece sessizliği en iyi çalışma arkadaşıdır.';
  else m='Gece kuşu modu! 🦉 Kısa ve odaklı tekrarlar tam sana göre.';
  $('greeting').textContent=m;
})();

/* ---------- 7. SEKMELER ---------- */
document.querySelectorAll('.tab-btn').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    $('panel-'+b.dataset.tab).classList.add('active');
  });
});

/* ---------- 8. SSS ---------- */
document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click',()=>{
    const item=q.parentElement, a=item.querySelector('.faq-a');
    const open=item.classList.toggle('open');
    a.style.maxHeight=open?a.scrollHeight+'px':'0';
  });
});

/* ---------- 9. HESAPLAYICI ---------- */
const calcRows=$('calcRows'), inputs={};
SUBJECTS.forEach(s=>{
  const r=document.createElement('div');
  r.className='calc-row';
  r.innerHTML=`<div class="calc-subject">${s.label} <small>(${s.total} • ${s.group})</small></div>
  <input type="number" min="0" max="${s.total}" value="0" data-k="${s.key}" data-t="d" aria-label="${s.label} doğru">
  <input type="number" min="0" max="${s.total}" value="0" data-k="${s.key}" data-t="y" aria-label="${s.label} yanlış">
  <div class="calc-net" id="net-${s.key}">0</div>`;
  calcRows.appendChild(r);
  inputs[s.key]={d:r.querySelector('[data-t="d"]'),y:r.querySelector('[data-t="y"]')};
});
const fmt=n=>n.toLocaleString('tr-TR',{maximumFractionDigits:2});
function recalc(){
  let gy=0,gk=0;
  SUBJECTS.forEach(s=>{
    const d=clamp(parseInt(inputs[s.key].d.value)||0,0,s.total);
    const y=clamp(parseInt(inputs[s.key].y.value)||0,0,s.total-d);
    const net=Math.max(0,d-y/4);
    $('net-'+s.key).textContent=fmt(net);
    s.group==='GY'?gy+=net:gk+=net;
  });
  const tot=gy+gk;
  $('resGY').textContent=fmt(gy);
  $('resGK').textContent=fmt(gk);
  $('resTotal').textContent=fmt(tot);
  const p=tot>0?Math.min(99,40+60*Math.sqrt(tot/120)):0;
  $('resScore').textContent=p>0?p.toLocaleString('tr-TR',{minimumFractionDigits:1,maximumFractionDigits:1}):'–';
}
calcRows.addEventListener('input',recalc);
$('calcReset').addEventListener('click',()=>{
  Object.values(inputs).forEach(({d,y})=>{d.value=0;y.value=0;});
  recalc();
});
recalc();
