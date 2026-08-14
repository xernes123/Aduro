# ADUR Live Dashboard & Financial Hub (NASDAQ: ADUR)

En modern, mobilanpassad och realtidsuppdaterad webbapplikation skräddarsydd för **Aduro Clean Technologies Inc. (NASDAQ: ADUR)**.

Denna applikation är en vidareutveckling av konceptet på [maktie.info](https://maktie.info/), med tillägg av realtidsuppdaterad linjär graf, live-klockor för USA och Sverige med börsstatus, full valutaväxling mellan DKK, EUR, SEK och USD, samt de senaste nyheterna och händelserna.

---

## 🌟 Funktioner

1. **Realtidsuppdaterad Linjär Graf (ADUR)**
   - Fokuserad på det linjära formatet (Linjär / Area-graf) med realtidsdata direkt från NASDAQ.
   - Möjlighet att snabbt växla mellan *Linjär Area*, *Ren Linje* och *Candlesticks*.
   - Tar upp majoriteten av skärmytan för maximal överskådlighet.

2. **Realtidsklockor (USA & Sverige)**
   - **Sverige (Stockholm):** Lokal svensk tid (CET/CEST) uppdateras sekund för sekund.
   - **USA (New York):** Wall Street-tid (EST/EDT) uppdateras sekund för sekund.
   - **Börsstatusindikator:** Visar i realtid om NASDAQ är *Öppen*, *Pre-Market*, *Efterbörs* eller *Stängd* med pulserande statusindikator.

3. **Valutaväxling & Portföljkalkylator (DKK, EUR, SEK, USD)**
   - Hämtar kontinuerligt dagsaktuella kurser mellan USD, SEK, EUR och DKK via live-API:er.
   - Visar vad 1 ADUR-aktie är värd i respektive valuta i realtid.
   - Interaktiv portföljkalkylator: skriv in antal aktier för att direkt se totalvärdet i alla fyra valutorna.
   - Fullständig tabell med alla valutakorsningar (USD/SEK, USD/EUR, USD/DKK, EUR/SEK, etc.).

4. **Senaste Nyheter & Bolagsinformation (ADUR)**
   - Sammanfattning av de senaste pressmeddelandena och milstolparna för Aduro Clean Technologies (t.ex. Uinta Basin-råoljeavtal, 2026 LIFE/Public Offerings för FOAK-anläggningen och ECOCE-samarbetet).
   - Information om bolagets patenterade Hydrochemolytic™ Technology (HCT).
   - Teknisk analys-mätare och nyckeltal direkt inbäddade.

5. **100% Mobilanpassad & Responsiv**
   - Responsiv layout som anpassar sig automatiskt för mobiltelefoner, surfplattor och stora bildskärmar.
   - Snabba touch-kontroller, optimerad teckenstorlek och inget horisontellt spill.

---

## 🚀 Hur du kör projektet

### Alternativ 1: Direkt i webbläsaren
Dubbelklicka bara på `index.html` eller högerklicka och välj **Öppna med Chrome / Firefox / Edge**.

### Alternativ 2: Lokal server (valfritt)
Om du använder Python, Node.js eller en VS Code Live Server:
```bash
# Med Python 3:
python -m http.server 8080

# Med npx serve:
npx serve .
```
Besök sedan `http://localhost:8080` i din webbläsare.

---

## 📁 Filstruktur

- `index.html` – Semantisk HTML5-struktur med alla widgets och sektioner.
- `style.css` – Mörk, modern finansiell CSS-design med full mobilresponsivitet.
- `app.js` – JavaScript-motor för realtidsklockor, börsstatus, valutakurser, kalkylator och TradingView-integration.
- `README.md` – Projektöversikt och dokumentation.
