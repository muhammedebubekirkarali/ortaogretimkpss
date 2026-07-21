// 1. GERİ SAYIM MANTIĞI
const sinavTarihi = new Date("2026-10-25T10:15:00").getTime();
const kampBaslangici = new Date("2026-07-01T00:00:00").getTime(); // Motivasyon için kamp başlangıcı

function geriSayimiGuncelle() {
    const simdi = new Date().getTime();
    const kalan = sinavTarihi - simdi;

    if (kalan < 0) {
        document.querySelector(".countdown-container").innerHTML = "<h2 style='color:#10b981;'>🎉 Sınav tamamlandı! Sonuçlar 19 Kasım'da açıklanıyor.</h2>";
        clearInterval(timerInterval);
        return;
    }

    const gun = Math.floor(kalan / (1000 * 60 * 60 * 24));
    const saat = Math.floor((kalan % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const dakika = Math.floor((kalan % (1000 * 60 * 60)) / (1000 * 60));
    const saniye = Math.floor((kalan % (1000 * 60)) / 1000);

    document.getElementById("gun").innerText = gun;
    document.getElementById("saat").innerText = String(saat).padStart(2, '0');
    document.getElementById("dakika").innerText = String(dakika).padStart(2, '0');
    document.getElementById("saniye").innerText = String(saniye).padStart(2, '0');
}

const timerInterval = setInterval(geriSayimiGuncelle, 1000);
geriSayimiGuncelle(); // Sayfa açılır açılmaz çalışsın

// 2. ÇALIŞMA KAMPI İLERLEME ÇUBUĞU
function ilerlemeyiGuncelle() {
    const simdi = new Date().getTime();
    const toplamSure = sinavTarihi - kampBaslangici;
    let gecenSure = simdi - kampBaslangici;
    
    if (gecenSure < 0) gecenSure = 0;
    
    let yuzde = Math.floor((gecenSure / toplamSure) * 100);
    if (yuzde > 100) yuzde = 100;

    document.getElementById("progress-fill").style.width = yuzde + "%";
    document.getElementById("progress-percent").innerText = "%" + yuzde;
}
ilerlemeyiGuncelle();

// 3. KARANLIK / AYDINLIK MOD (Ziyaretçinin seçimi tarayıcıda hatırlanır)
const themeToggle = document.getElementById("theme-toggle");
const kayitliTema = localStorage.getItem("kpss-tema");

if (kayitliTema === "dark") {
    document.body.classList.add("dark-theme");
    themeToggle.innerText = "☀️";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    themeToggle.innerText = isDark ? "☀️" : "🌙";
    localStorage.setItem("kpss-tema", isDark ? "dark" : "light");
});

// 4. KAYDIRDIKÇA BELİREN ANİMASYONLAR (Intersection Observer)
const gozlemlenecekler = document.querySelectorAll(".reveal");

const gozlemci = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
}, { threshold: 0.1 });

gozlemlenecekler.forEach(el => gozlemci.observe(el));

// 5. DİNAMİK MOTİVASYON MESAJI (Günün saatine göre)
const saatSimdi = new Date().getHours();
const selamlama = document.getElementById("dynamic-greeting");

if (saatSimdi >= 5 && saatSimdi < 12) {
    selamlama.innerText = "Günaydın! Erken kalkan yol alır, bugün harika bir çalışma günü olacak. ☕";
} else if (saatSimdi >= 12 && saatSimdi < 18) {
    selamlama.innerText = "İyi çalışmalar! Hedef P94, odaklanmaya devam. 🎯";
} else {
    selamlama.innerText = "İyi akşamlar! Gece sessizliği en iyi ders çalışma arkadaşıdır. 🌙";
}
