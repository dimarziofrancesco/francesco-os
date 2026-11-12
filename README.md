# Francesco OS

Portfolio di Francesco Di Marzio in stile sistema operativo. Sito statico: HTML, CSS e JS in un solo `index.html`, nessuna build.

## Struttura

```
index.html                     pagina completa
img/                           foto e immagini dei progetti (WebP)
assets/instagram/feed.json     foto Instagram, aggiornate dalla GitHub Action
scripts/sync-instagram.mjs     scarica i post tramite Instagram API
.github/workflows/instagram.yml  sincronizzazione giornaliera
```

## Provarlo in locale

```bash
cd ~/Desktop/francesco-os
python3 -m http.server 8080
# apri http://localhost:8080
```

## Deploy su GitHub Pages

```bash
cd ~/Desktop/francesco-os
git init && git add . && git commit -m "Prima versione"
gh repo create francesco-os --public --source=. --push
```

Poi su GitHub: Settings › Pages › Source: "Deploy from a branch" › `main` / root.

## Collegare Instagram

1. Account Instagram professionale (Creator).
2. App su developers.facebook.com con "Instagram API with Instagram Login" e token per il profilo.
3. Settings › Secrets and variables › Actions › nuovo secret `IG_TOKEN`.
4. Actions › Sync Instagram › Run workflow per la prima sincronizzazione.

Finché `feed.json` è vuoto, la galleria mostra gli scatti in `img/`.
