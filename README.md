# Word Match Game

A playful, single-page word matching game for early readers.

## Live Demo

**Play the game:** [https://paialex.github.io/word-match/](https://paialex.github.io/word-match/)

The app is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

## Run locally

Use any static server from the project root so the browser can find `index.html`:

```bash
cd /workspace/word-match
python -m http.server 8000
```

Then open:

- `http://127.0.0.1:8000/` (loads `index.html` automatically)
- or `http://127.0.0.1:8000/index.html`

If you see a **Not Found** page, confirm the server is started from this folder and
that `index.html` is present.

## How to play

1. Read the big word.
2. Tap the card that matches the same word.
3. Use **Hear the word** to listen.
4. Press **New Word** to reshuffle the round or **Reset Score** to start over.
5. Add your own words in **Word List Settings** or choose **Load Random Words** to fetch a new list from the internet.
