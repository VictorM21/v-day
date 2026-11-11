/* Question page: the "Yes" button grows, the "No" button gets sadder, then runs away. */
(function () {
    'use strict';

    const { store, toast, reducedMotion } = window.VDay;
    const cfg = window.VDAY_CONFIG;

    const catGif = document.getElementById('cat-gif');
    const gifFallback = document.getElementById('gif-fallback');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const teaseToast = document.getElementById('tease-toast');
    const nameEl = document.getElementById('her-name');
    if (!catGif || !yesBtn || !noBtn) {
        console.error('Required elements not found!');
        return;
    }

    // ----- Pick the pet name for this visit (yes.html reads it back) -----
    const pool = cfg.names.length ? cfg.names : [cfg.defaultName];
    const chosenName = pool[Math.floor(Math.random() * pool.length)];
    nameEl.textContent = chosenName;
    store.set('isimiName', chosenName);

    // ----- State -----
    let noClickCount = 0;
    let yesTeasedCount = 0;
    let runawayEnabled = false;
    let teaseTimer;

    const MAX_YES_FONT_PX = 150;    // keeps the Yes button growing without overflowing the screen
    const RUNAWAY_AFTER_CLICKS = 5;

    // Warm the cache so GIF swaps don't flash blank
    window.addEventListener('load', () => {
        cfg.gifStages.forEach(src => { new Image().src = src; });
    });

    // ----- Helpers -----
    function showTeaseMessage(msg) {
        teaseToast.textContent = msg;
        teaseToast.classList.add('show');
        clearTimeout(teaseTimer);
        teaseTimer = setTimeout(() => teaseToast.classList.remove('show'), 2500);
    }

    function showGifFailed(stage) {
        catGif.hidden = true;
        gifFallback.hidden = false;
        gifFallback.textContent = cfg.gifFallbackEmoji[stage] || '💕';
    }

    catGif.addEventListener('error', () => showGifFailed(Math.min(noClickCount, cfg.gifStages.length - 1)));

    function swapGif(stage) {
        const src = cfg.gifStages[stage];
        catGif.style.opacity = '0';
        setTimeout(() => {
            gifFallback.hidden = true;
            catGif.hidden = false;
            catGif.src = src;
            catGif.style.opacity = '1';
        }, reducedMotion.matches ? 0 : 200);
    }

    // ----- Yes -----
    yesBtn.addEventListener('click', () => {
        if (!runawayEnabled) {
            // The joke: Yes only works once she has tried No a few times
            const msg = cfg.yesTeasePokes[Math.min(yesTeasedCount, cfg.yesTeasePokes.length - 1)];
            yesTeasedCount++;
            showTeaseMessage(msg);
            return;
        }
        window.location.href = 'yes.html';
    });

    // ----- No -----
    noBtn.addEventListener('click', () => {
        noClickCount++;

        // click 1 -> message 0 ("Are you sure?"), click 2 -> message 1, ... last one repeats
        noBtn.textContent = cfg.noMessages[Math.min(noClickCount - 1, cfg.noMessages.length - 1)];

        const yesSize = parseFloat(getComputedStyle(yesBtn).fontSize);
        yesBtn.style.fontSize = Math.min(yesSize * 1.35, MAX_YES_FONT_PX) + 'px';
        const padY = Math.min(18 + noClickCount * 5, 60);
        const padX = Math.min(45 + noClickCount * 10, 120);
        yesBtn.style.padding = padY + 'px ' + padX + 'px';

        if (noClickCount >= 2) {
            const noSize = parseFloat(getComputedStyle(noBtn).fontSize);
            noBtn.style.fontSize = Math.max(noSize * 0.85, 10) + 'px';
        }

        swapGif(Math.min(noClickCount, cfg.gifStages.length - 1));

        if (noClickCount >= RUNAWAY_AFTER_CLICKS && !runawayEnabled) {
            runawayEnabled = true;
            noBtn.addEventListener('pointerenter', runAway); // covers mouse and touch
            runAway(); // the pointer is already on the button, so no "enter" would fire - bolt now
            showTeaseMessage('Okay you asked for it! Try catching me now! 🏃‍♂️');
        }
    });

    function runAway() {
        const margin = 20;
        const maxX = Math.max(window.innerWidth - noBtn.offsetWidth - margin, margin);
        const maxY = Math.max(window.innerHeight - noBtn.offsetHeight - margin, margin);
        noBtn.style.position = 'fixed';
        noBtn.style.left = (Math.random() * (maxX - margin) + margin) + 'px';
        noBtn.style.top = (Math.random() * (maxY - margin) + margin) + 'px';
        noBtn.style.zIndex = '50';
    }
})();
