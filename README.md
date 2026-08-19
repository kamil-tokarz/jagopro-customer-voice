# JagoPro Customer Voice

Lekka, statyczna aplikacja webowa zgodna z jasnym systemem identyfikacji JagoPro.

## Strony

- `pl.html` — ankieta po polsku
- `en.html` — ankieta po angielsku
- `analytics.html` — wewnętrzny dashboard analityczny
- `index.html` — przekierowanie do wersji PL

## Co mierzymy

- Relationship NPS 0–10
- ogólny CSAT 1–5 i Top-2 Box
- 8 driverów doświadczenia klienta
- najważniejszy obszar do poprawy
- pozycję JagoPro wobec innych dostawców
- komentarz „co poprawić” i „co zachować”
- rolę respondenta i staż relacji do segmentacji B2B

Dashboard pokazuje m.in. NPS, CSAT, krytyczny feedback, driver priority (`luka × wpływ na NPS`), podział NPS według roli, komentarze i kolejkę closed-loop.

## Ważne: przechowywanie danych

W repozytorium ustawiony jest **tryb prototypowy `local`** (`assets/config.js`). To pozwala przetestować pełny UX bez backendu, ale odpowiedź jest zapisywana tylko w przeglądarce respondenta. Nie jest to docelowy sposób zbierania ankiet od klientów.

Przed uruchomieniem produkcyjnym trzeba podłączyć bezpieczny endpoint do zapisu danych oraz zabezpieczyć widok analityczny uwierzytelnieniem. Kod ma gotowy punkt integracji (`storageMode: 'api'`, `submitEndpoint`, `analyticsEndpoint`). Nie należy umieszczać sekretu administracyjnego w publicznym repozytorium ani w JavaScript strony.

## GitHub Pages

Repozytorium zawiera workflow `.github/workflows/pages.yml`. Po utworzeniu repozytorium i włączeniu GitHub Pages z `GitHub Actions` strona publikuje się automatycznie po zmianie `main`.

## SIW

Użyte wartości bazują na zaakceptowanym kierunku JagoPro LIGHT:

- turkus: `#2DB8AD`
- cyan: `#00AEC4`
- grafit: `#2A2B2E`
- szarość: `#70767A`
- linie: `#D7E2E0`, `#DDE6E5`
- jasne tło: `#EFF7F6`, `#F7FAF9`
- typografia: Aptos / Aptos Display (z systemowym fallbackiem)
- logo i motyw molecular dots pochodzą z zatwierdzonej formatki handlowej

## Test lokalny

```bash
python -m http.server 8080
```

Następnie otwórz `http://localhost:8080/pl.html`.
