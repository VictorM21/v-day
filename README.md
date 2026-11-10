# Valentine's Day Interactive Page 💕

A small, personal Valentine's page built with plain HTML, CSS and JavaScript — no build step, no dependencies to install.

**Live demo:** https://victorm21.github.io/v-day/

## How it works

1. **`index.html`** asks the question. Every time she clicks **No**, the **Yes** button grows, the GIF gets sadder and the *No* button says something new. After a few clicks *No* starts running away, and only then does **Yes** take her to the celebration.
2. **`yes.html`** is the celebration: confetti, photos, flip-card memories, countdown, love meter, fortune teller, bingo, a love letter, a gift box, and more.
3. A playlist plays throughout. A random song is picked on the first visit of each day and carries over from page one to page two without restarting.

## Make it yours

Most of the personal content is in one file: **`config.js`**.

| What | Where |
|---|---|
| Pet names shown in the question | `names` in `config.js` |
| The messages on the *No* button, and the teasing toasts | `noMessages`, `yesTeasePokes` in `config.js` |
| Songs (files go in `music/`) | `songs` in `config.js` — also drives the playlist on the Yes page |
| GIFs for each *No* click | `gifStages` in `config.js` |
| Default reunion date for the countdown | `reunionDefault` in `config.js` |
| Photos | replace `images/photo1.jpeg`, `photo2.jpeg`, `photo3.jpeg` |
| Memory dates, love letter, proverbs, love map | `yes.html` |
| Colours, fonts, animations | `style.css` |

The page remembers a few things in the visitor's own browser (`localStorage`): the song, the theme they picked, the reunion date and timeline dates they set, and cities they add to the love map. Nothing is sent anywhere.

## Run it locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

(Opening the files directly also works, but a local server behaves like the real site.)

## Deploy with GitHub Pages

1. Fork or push this repo to your own GitHub account.
2. **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save.**
3. After a minute or two it is live at `https://<your-username>.github.io/v-day/`.

## Project structure

```
v-day/
├── index.html       # "Will you be my Valentine?"
├── yes.html         # Celebration page
├── config.js        # Names, messages, songs, GIFs, dates — edit this first
├── common.js        # Small shared helpers (safe storage, toast, date parsing)
├── music.js         # Playlist / autoplay / hand-off between pages
├── script.js        # Question page logic
├── yes-script.js    # Celebration page logic
├── style.css        # All styling, themes and animations
├── images/          # Photos for the memory wall
└── music/           # Songs
```

## Good to know

- **Autoplay:** browsers block sound until the visitor interacts with the page. If that happens the music starts on their first tap, click or key press; on phones a small "tap anywhere" prompt appears.
- **Music rights:** the songs in `music/` belong to their artists. If you make a repo public, use music you have the right to share, or link to a streaming service instead.
- **Privacy:** a public repo (and GitHub Pages site) is visible to anyone, including the photos, names and messages in it. Keep the repo private or use generic content if that matters to you.
- **Accessibility:** buttons are keyboard-reachable, animations are switched off for visitors who prefer reduced motion, and flip cards work by tap or keyboard as well as hover.

## License

Do whatever you want with it. Make someone smile.
