/**
 * Background music, shared by index.html and yes.html.
 *
 * - Picks a random song on the first visit of each day, then carries on through
 *   the playlist when a song ends.
 * - Hands the song, position and play/pause state from the question page to the
 *   celebration page so the music doesn't restart.
 * - Browsers block autoplay with sound: if play() is rejected we start on the
 *   visitor's first tap/click/key instead (unless they paused it themselves).
 */
(function () {
    'use strict';

    const { store } = window.VDay;
    const songs = window.VDAY_CONFIG.songs;
    const audio = document.getElementById('bg-music');
    const toggleBtn = document.getElementById('music-toggle');
    const tapPrompt = document.getElementById('mobile-tap-prompt');
    if (!audio || !toggleBtn || !songs.length) return;

    const KEYS = { index: 'songIndex', time: 'musicTime', playing: 'musicPlaying', day: 'lastVisitDate' };

    let index = 0;
    let wantPlaying = true;   // false once the visitor pauses on purpose
    let resumeAt = 0;

    // ----- choose the song -----
    const today = new Date().toDateString();
    const savedIndex = parseInt(store.get(KEYS.index), 10);
    const isNewDay = store.get(KEYS.day) !== today;
    if (!isNewDay && savedIndex >= 0 && savedIndex < songs.length) {
        index = savedIndex;
    } else {
        index = Math.floor(Math.random() * songs.length);
    }
    store.set(KEYS.day, today);
    store.set(KEYS.index, index);

    // ----- restore position handed over from the other page -----
    const savedTime = parseFloat(store.get(KEYS.time));
    if (savedTime > 0) resumeAt = savedTime;
    if (store.get(KEYS.playing) === 'false') wantPlaying = false;
    store.remove(KEYS.time);
    store.remove(KEYS.playing);

    audio.loop = false; // a looping <audio> never fires "ended", so the playlist would never advance
    audio.volume = 0.4;

    function load(i) {
        index = i;
        audio.src = songs[index].file;
        store.set(KEYS.index, index);
        announce();
    }

    function announce() {
        document.dispatchEvent(new CustomEvent('vday:music', {
            detail: { index, title: songs[index].title, playing: !audio.paused }
        }));
    }

    function render() {
        const on = !audio.paused;
        toggleBtn.textContent = on ? '🔊' : '🔇';
        toggleBtn.setAttribute('aria-pressed', String(on));
        toggleBtn.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
        toggleBtn.title = on ? 'Pause music' : 'Play music';
        announce();
    }

    function showPrompt(show) {
        if (!tapPrompt) return;
        tapPrompt.classList.toggle('show', show);
    }

    // ----- playback -----
    function tryPlay() {
        return audio.play().then(() => {
            showPrompt(false);
        }).catch(() => {
            // Autoplay blocked: wait for a gesture. Only nag on touch screens.
            if (window.matchMedia('(pointer: coarse)').matches) showPrompt(true);
        });
    }

    audio.addEventListener('play', render);
    audio.addEventListener('pause', render);

    audio.addEventListener('loadedmetadata', () => {
        if (resumeAt > 0 && resumeAt < audio.duration) audio.currentTime = resumeAt;
        resumeAt = 0;
    });

    audio.addEventListener('ended', () => {
        load((index + 1) % songs.length);
        if (wantPlaying) tryPlay();
    });

    let errorStreak = 0;
    audio.addEventListener('playing', () => { errorStreak = 0; });
    audio.addEventListener('error', () => {
        // Skip a broken file rather than going silent, but give up if every file is broken
        errorStreak++;
        if (errorStreak >= songs.length) return;
        console.warn('Could not load', songs[index].file, '- skipping');
        load((index + 1) % songs.length);
        if (wantPlaying) tryPlay();
    });

    toggleBtn.addEventListener('click', () => {
        if (audio.paused) {
            wantPlaying = true;
            tryPlay();
        } else {
            wantPlaying = false;
            audio.pause();
        }
    });
    window.toggleMusic = () => toggleBtn.click(); // kept for anything still calling it inline

    // Any tap/click/key starts the music if autoplay was blocked. Keep listening until it
    // actually plays (a bare Tab keypress isn't a real user activation and will be rejected).
    function onGesture(e) {
        if (toggleBtn.contains(e.target)) return; // the toggle handles its own click
        if (wantPlaying && audio.paused) tryPlay();
    }
    // Only these count as a user activation on every browser: pointerdown/touchstart do not on
    // touch screens (iOS Safari rejects play() from them), click/touchend/pointerup/keydown do.
    const GESTURES = ['click', 'touchend', 'pointerup', 'keydown'];
    GESTURES.forEach(evt => document.addEventListener(evt, onGesture, true));
    audio.addEventListener('playing', () => {
        GESTURES.forEach(evt => document.removeEventListener(evt, onGesture, true));
    }, { once: true });

    // Hand the position to the next page. pagehide is reliable on mobile; beforeunload is not.
    window.addEventListener('pagehide', () => {
        store.set(KEYS.time, audio.currentTime);
        // Save what the visitor WANTS, not audio.paused: if autoplay was merely blocked the audio is
        // paused, and saving that made the next page think she had muted it and never start.
        store.set(KEYS.playing, wantPlaying);
    });

    load(index);
    render();
    if (wantPlaying) tryPlay();
})();
