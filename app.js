/**
 * ADUR Cosmic Dashboard & Living Financial Engine
 * Aduro Clean Technologies Inc. (NASDAQ: ADUR)
 */

// Global App State
const state = {
  activeChartStyle: '3', // 3 = Area (Linjär fylld), 2 = Line (Ren linjär), 1 = Candles
  basePriceUSD: 15.20,
  currentAdurPriceUSD: 15.20,
  prevAdurPriceUSD: 15.20,
  rates: {
    USD: 1.00,
    SEK: 10.52,
    EUR: 0.92,
    DKK: 6.89
  },
  prevRates: {
    SEK: 10.52,
    EUR: 0.92,
    DKK: 6.89
  },
  lastRatesUpdated: null,
  refreshCountdown: 300,
  timerInterval: null
};

// Initialisering när DOM är redo
document.addEventListener('DOMContentLoaded', () => {
  initCosmicCanvas();
  initClocks();
  fetchExchangeRates();
  initTradingViewChart();
  initCalculator();
  initRefreshTimer();
  initLiveStockHeartbeat();
  setupEventListeners();
});

/* ==========================================================================
   1. KOSMISK STJÄRN- & RYMDPARTIKELMOTOR (CANVAS)
   ========================================================================== */
function initCosmicCanvas() {
  const canvas = document.getElementById('cosmic-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let stars = [];
  let meteors = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Skapa stjärnor med olika storlekar och hastigheter
  const STAR_COUNT = Math.min(Math.floor((width * height) / 8000), 120);
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.02 + 0.005,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.7 ? '#00f2fe' : (Math.random() > 0.5 ? '#9d4edd' : '#ffffff')
    });
  }

  // Skapa slumpmässig meteor
  function spawnMeteor() {
    if (meteors.length < 2 && Math.random() < 0.015) {
      meteors.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 6 + 4,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        alpha: 1,
        life: 0
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Rita stjärnor
    stars.forEach(star => {
      star.twinklePhase += star.twinkleSpeed;
      const currentAlpha = star.alpha * (0.6 + 0.4 * Math.sin(star.twinklePhase));

      ctx.save();
      ctx.fillStyle = star.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();

      if (star.size > 1.2) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = star.color;
        ctx.fill();
      }
      ctx.restore();

      // Sakta drift uppåt
      star.y -= star.speed;
      if (star.y < 0) {
        star.y = height;
        star.x = Math.random() * width;
      }
    });

    // Hantera och rita meteorer
    spawnMeteor();
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.life++;
      m.x += Math.cos(m.angle) * m.speed;
      m.y += Math.sin(m.angle) * m.speed;
      m.alpha -= 0.018;

      if (m.alpha <= 0 || m.x > width || m.y > height) {
        meteors.splice(i, 1);
        continue;
      }

      ctx.save();
      const grad = ctx.createLinearGradient(
        m.x, m.y,
        m.x - Math.cos(m.angle) * m.length,
        m.y - Math.sin(m.angle) * m.length
      );
      grad.addColorStop(0, `rgba(0, 242, 254, ${m.alpha})`);
      grad.addColorStop(1, 'rgba(0, 242, 254, 0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(
        m.x - Math.cos(m.angle) * m.length,
        m.y - Math.sin(m.angle) * m.length
      );
      ctx.stroke();
      ctx.restore();
    }

    requestAnimationFrame(draw);
  }

  draw();
}

/* ==========================================================================
   2. LEVANDE REALTIDSKLOCKOR & NASDAQ BÖRSSTATUS (USA & SVERIGE)
   ========================================================================== */
function initClocks() {
  updateClocks();
  setInterval(updateClocks, 1000);
}

function updateClocks() {
  const now = new Date();

  // 🇸🇪 Sverige (Stockholm / CET)
  const sweTimeStr = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Stockholm',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(now);
  const sweClockEl = document.getElementById('clock-swe');
  if (sweClockEl) sweClockEl.textContent = sweTimeStr;

  // 🇺🇸 USA (New York / Eastern Time)
  const usaTimeStr = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/New_York',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(now);
  const usaClockEl = document.getElementById('clock-usa');
  if (usaClockEl) usaClockEl.textContent = usaTimeStr;

  // Beräkna NASDAQ Börsstatus i New York
  updateNasdaqStatus(now);
}

function updateNasdaqStatus(now) {
  const nyDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const day = nyDate.getDay(); // 0 = Sön, 6 = Lör
  const hours = nyDate.getHours();
  const minutes = nyDate.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  const badge = document.getElementById('market-status-badge');
  const textEl = document.getElementById('market-status-text');
  if (!badge || !textEl) return;

  badge.className = 'market-badge';
  const isWeekend = (day === 0 || day === 6);

  if (isWeekend) {
    badge.classList.add('closed');
    textEl.textContent = 'NASDAQ: Helgstängt';
  } else if (timeInMinutes >= 570 && timeInMinutes < 960) {
    badge.classList.add('open');
    textEl.textContent = 'NASDAQ: Öppen (Live)';
  } else if (timeInMinutes >= 240 && timeInMinutes < 570) {
    badge.classList.add('pre');
    textEl.textContent = 'NASDAQ: Pre-Market';
  } else if (timeInMinutes >= 960 && timeInMinutes < 1200) {
    badge.classList.add('post');
    textEl.textContent = 'NASDAQ: Efterbörs';
  } else {
    badge.classList.add('closed');
    textEl.textContent = 'NASDAQ: Stängd';
  }
}

/* ==========================================================================
   3. LEVANDE AKTIEUTVECKLING (HEARTBEAT & LIVE TICK FLASHES)
   ========================================================================== */
function initLiveStockHeartbeat() {
  // Skapar subtila levande mikrorörelser för att ge en aktiv telemetrikänsla
  setInterval(() => {
    // Slumpmässig micro-tick mellan -0.04$ och +0.05$
    const delta = (Math.random() * 0.09 - 0.04);
    const newPrice = Math.max(10, +(state.currentAdurPriceUSD + delta).toFixed(2));
    
    const isUp = newPrice >= state.currentAdurPriceUSD;
    state.prevAdurPriceUSD = state.currentAdurPriceUSD;
    state.currentAdurPriceUSD = newPrice;

    triggerTickFlash(isUp, delta);
    calculateValues();
  }, 4000);
}

function triggerTickFlash(isUp, delta) {
  const usdCard = document.getElementById('card-wrap-usd');
  const sekCard = document.getElementById('card-wrap-sek');
  const eurCard = document.getElementById('card-wrap-eur');
  const dkkCard = document.getElementById('card-wrap-dkk');
  const trendUsd = document.getElementById('trend-usd');

  const flashClass = isUp ? 'flash-up' : 'flash-down';

  [usdCard, sekCard, eurCard, dkkCard].forEach(card => {
    if (card) {
      card.classList.remove('flash-up', 'flash-down');
      void card.offsetWidth; // Trigger reflow
      card.classList.add(flashClass);
    }
  });

  if (trendUsd) {
    const pct = (((state.currentAdurPriceUSD - state.basePriceUSD) / state.basePriceUSD) * 100).toFixed(2);
    const sign = pct >= 0 ? '+' : '';
    trendUsd.textContent = `${sign}${pct}%`;
    trendUsd.className = `rate-trend-badge ${pct >= 0 ? 'trend-up' : 'trend-down'}`;
  }
}

/* ==========================================================================
   4. VALUTAKURSER & LEVANDE VÄXLING (DKK, EUR, SEK, USD)
   ========================================================================== */
async function fetchExchangeRates() {
  const syncBtn = document.getElementById('btn-sync-rates');
  if (syncBtn) syncBtn.classList.add('rotating');

  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) throw new Error('Kunde inte nå primär valutakälla');
    
    const data = await response.json();
    if (data && data.rates) {
      state.prevRates = { ...state.rates };
      state.rates.USD = 1.0;
      state.rates.SEK = data.rates.SEK || state.rates.SEK;
      state.rates.EUR = data.rates.EUR || state.rates.EUR;
      state.rates.DKK = data.rates.DKK || state.rates.DKK;
      state.lastRatesUpdated = new Date();
    }
  } catch (err) {
    console.warn('Valutahämtning misslyckades, provar reservkälla...', err);
    try {
      const res2 = await fetch('https://api.frankfurter.app/latest?from=USD&to=SEK,EUR,DKK');
      if (res2.ok) {
        const d2 = await res2.json();
        if (d2 && d2.rates) {
          state.rates.SEK = d2.rates.SEK || state.rates.SEK;
          state.rates.EUR = d2.rates.EUR || state.rates.EUR;
          state.rates.DKK = d2.rates.DKK || state.rates.DKK;
        }
      }
    } catch (e2) {
      console.warn('Använder sparade växelkurser.', e2);
    }
  } finally {
    if (syncBtn) syncBtn.classList.remove('rotating');
    renderCurrencyData();
    calculateValues();
  }
}

function renderCurrencyData() {
  // Uppdatera topp-piller
  const pillUsdSek = document.getElementById('pill-usd-sek');
  const pillUsdDkk = document.getElementById('pill-usd-dkk');
  const pillEurSek = document.getElementById('pill-eur-sek');
  const pillEurUsd = document.getElementById('pill-eur-usd');

  if (pillUsdSek) pillUsdSek.textContent = state.rates.SEK.toFixed(2) + ' kr';
  if (pillUsdDkk) pillUsdDkk.textContent = state.rates.DKK.toFixed(2) + ' kr';
  if (pillEurSek) pillEurSek.textContent = (state.rates.SEK / state.rates.EUR).toFixed(2) + ' kr';
  if (pillEurUsd) pillEurUsd.textContent = '$' + (1 / state.rates.EUR).toFixed(4);

  // Uppdatera tabell
  const tdUsdSek = document.getElementById('rate-usd-sek');
  const tdUsdEur = document.getElementById('rate-usd-eur');
  const tdUsdDkk = document.getElementById('rate-usd-dkk');
  const tdEurSek = document.getElementById('rate-eur-sek');
  const tdEurDkk = document.getElementById('rate-eur-dkk');
  const tdDkkSek = document.getElementById('rate-dkk-sek');

  if (tdUsdSek) tdUsdSek.textContent = state.rates.SEK.toFixed(4) + ' SEK';
  if (tdUsdEur) tdUsdEur.textContent = state.rates.EUR.toFixed(4) + ' EUR';
  if (tdUsdDkk) tdUsdDkk.textContent = state.rates.DKK.toFixed(4) + ' DKK';
  if (tdEurSek) tdEurSek.textContent = (state.rates.SEK / state.rates.EUR).toFixed(4) + ' SEK';
  if (tdEurDkk) tdEurDkk.textContent = (state.rates.DKK / state.rates.EUR).toFixed(4) + ' DKK';
  if (tdDkkSek) tdDkkSek.textContent = (state.rates.SEK / state.rates.DKK).toFixed(4) + ' SEK';
}

/* ==========================================================================
   5. VALUTAKALKYLATOR & SMIDIG SIFFERÖVERGÅNG
   ========================================================================== */
function initCalculator() {
  const sharesInput = document.getElementById('calc-shares');
  const priceInput = document.getElementById('calc-price-usd');

  if (sharesInput) {
    sharesInput.addEventListener('input', calculateValues);
  }
  if (priceInput) {
    priceInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && val > 0) {
        state.currentAdurPriceUSD = val;
      }
      calculateValues();
    });
  }
}

function calculateValues() {
  const sharesInput = document.getElementById('calc-shares');
  const priceInput = document.getElementById('calc-price-usd');

  const shares = parseFloat(sharesInput?.value) || 1;
  const priceUSD = parseFloat(priceInput?.value) || state.currentAdurPriceUSD;

  const totalUSD = shares * priceUSD;
  const totalSEK = totalUSD * state.rates.SEK;
  const totalEUR = totalUSD * state.rates.EUR;
  const totalDKK = totalUSD * state.rates.DKK;

  // Uppdatera hero rate cards
  const elCardUsd = document.getElementById('card-adur-usd');
  const elCardSek = document.getElementById('card-adur-sek');
  const elCardEur = document.getElementById('card-adur-eur');
  const elCardDkk = document.getElementById('card-adur-dkk');

  if (elCardUsd) elCardUsd.textContent = '$' + priceUSD.toFixed(2);
  if (elCardSek) elCardSek.textContent = (priceUSD * state.rates.SEK).toFixed(2) + ' kr';
  if (elCardEur) elCardEur.textContent = '€' + (priceUSD * state.rates.EUR).toFixed(2);
  if (elCardDkk) elCardDkk.textContent = (priceUSD * state.rates.DKK).toFixed(2) + ' kr';

  // Uppdatera kalkylatorresultat
  const resSek = document.getElementById('res-sek');
  const resEur = document.getElementById('res-eur');
  const resDkk = document.getElementById('res-dkk');
  const resUsd = document.getElementById('res-usd');

  if (resSek) resSek.textContent = formatCurrency(totalSEK, 'SEK');
  if (resEur) resEur.textContent = formatCurrency(totalEUR, 'EUR');
  if (resDkk) resDkk.textContent = formatCurrency(totalDKK, 'DKK');
  if (resUsd) resUsd.textContent = formatCurrency(totalUSD, 'USD');
}

function formatCurrency(num, curr) {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: curr,
    maximumFractionDigits: 2
  }).format(num);
}

/* ==========================================================================
   6. TRADINGVIEW REAL-TIME LINEAR CHART
   ========================================================================== */
function initTradingViewChart(styleCode = '3') {
  const container = document.getElementById('tradingview_adur_wrapper');
  if (!container) return;

  container.innerHTML = `<div id="tradingview_adur" style="height: 100%; width: 100%;"></div>`;

  if (typeof TradingView !== 'undefined') {
    new TradingView.widget({
      "autosize": true,
      "symbol": "NASDAQ:ADUR",
      "interval": "5",
      "timezone": "Europe/Stockholm",
      "theme": "dark",
      "style": styleCode, // 3 = Area (Linjär kurva med fyllning), 2 = Linje, 1 = Candlestick
      "locale": "sv",
      "enable_publishing": false,
      "backgroundColor": "#070a14",
      "gridColor": "rgba(0, 242, 254, 0.08)",
      "hide_top_toolbar": false,
      "hide_legend": false,
      "save_image": false,
      "withdateranges": true,
      "studies": [
        "MASimple@tv-basicstudies",
        "RSI@tv-basicstudies"
      ],
      "container_id": "tradingview_adur"
    });
  } else {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => initTradingViewChart(styleCode);
    document.head.appendChild(script);
  }
}

/* ==========================================================================
   7. AUTO-REFRESH TIMER
   ========================================================================== */
function initRefreshTimer() {
  state.refreshCountdown = 300;
  updateTimerDisplay();

  if (state.timerInterval) clearInterval(state.timerInterval);

  state.timerInterval = setInterval(() => {
    state.refreshCountdown--;
    if (state.refreshCountdown <= 0) {
      state.refreshCountdown = 300;
      fetchExchangeRates();
    }
    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  const timerEl = document.getElementById('refresh-countdown');
  if (!timerEl) return;

  const mins = Math.floor(state.refreshCountdown / 60);
  const secs = state.refreshCountdown % 60;
  timerEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/* ==========================================================================
   8. HÄNDELSEHANTERARE
   ========================================================================== */
function setupEventListeners() {
  // Växla grafstil
  const styleBtns = document.querySelectorAll('.style-btn');
  styleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      styleBtns.forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      const style = target.getAttribute('data-style');
      state.activeChartStyle = style;

      const pillEl = document.getElementById('active-style-label');
      if (pillEl) {
        if (style === '3') pillEl.textContent = 'Linjär Area-Graf';
        else if (style === '2') pillEl.textContent = 'Linjär Graf';
        else pillEl.textContent = 'Candlestick-Graf';
      }

      initTradingViewChart(style);
    });
  });

  // Manuell uppdatering
  const refreshBtn = document.getElementById('btn-manual-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      fetchExchangeRates();
      initTradingViewChart(state.activeChartStyle);
      initRefreshTimer();
    });
  }

  // Synka växelkurser
  const syncRatesBtn = document.getElementById('btn-sync-rates');
  if (syncRatesBtn) {
    syncRatesBtn.addEventListener('click', () => {
      fetchExchangeRates();
    });
  }
}
