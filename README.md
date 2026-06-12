# Pagina personalizada

Pagina local privada feita com HTML, CSS e JavaScript.

## Como abrir

```powershell
cd C:\Users\kayky\Documents\Playground\dearyou-personalizado
python -m http.server 4173 --bind 127.0.0.1
```

Depois abra:

```text
http://127.0.0.1:4173/
```

## Como personalizar

Edite `config.js`:

- `title`: titulo principal.
- `startDate`: data usada pelo contador, no formato `AAAA-MM-DDT00:00:00`.
- `startDateLabel`: texto mostrado abaixo do titulo.
- `letter`: mensagem/carta.
- `music.spotifyUrl`: link incorporado da musica no Spotify.
- `photos`: fotos do carrossel.
- `timeline`: datas, titulos e fotos da historia.
