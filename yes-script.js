/* Celebration page: confetti, interactive cards, countdown, theme switcher, etc. */
(function () {
    'use strict';

    const { store, parseLocalDate, reducedMotion, toast } = window.VDay;
    const cfg = window.VDAY_CONFIG;
    const $ = (id) => document.getElementById(id);

    // Every confetti call goes through here so it is skipped for reduced-motion users
    // and never throws if the CDN script didn't load.
    function burst(opts) {
        if (typeof confetti !== 'function') return;
        confetti(Object.assign({ disableForReducedMotion: true }, opts));
    }

    // ----- Name handed over from the question page -----
    $('yes-name').textContent = store.get('isimiName') || cfg.defaultName;

    // ----- Confetti on arrival -----
    function launchConfetti() {
        const colors = ['#ff69b4', '#ff1493', '#ff85a2', '#ffb3c1', '#ff0000', '#ff6347', '#fff', '#ffdf00'];
        const end = Date.now() + 6000;

        burst({ particleCount: 150, spread: 100, origin: { x: 0.5, y: 0.3 }, colors });

        const interval = setInterval(() => {
            if (Date.now() > end) { clearInterval(interval); return; }
            burst({ particleCount: 40, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors });
            burst({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors });
        }, 300);
    }
    launchConfetti();

    // ----- Photos: friendly placeholder if one is missing -----
    const placeholder = (n) => 'data:image/svg+xml,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><rect width="180" height="180" fill="#ffe4e8"/>' +
        '<text x="90" y="100" font-size="22" text-anchor="middle" fill="#d63384" font-family="sans-serif">Us ' + n + ' 💕</text></svg>');
    document.querySelectorAll('.photo-grid img').forEach((img, i) => {
        const fix = () => { img.onerror = null; img.src = placeholder(i + 1); };
        img.addEventListener('error', fix, { once: true });
        if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fix();
    });

    // ----- Flip cards (hover on desktop, tap / Enter / Space everywhere) -----
    document.querySelectorAll('.flip-card').forEach(card => {
        const flip = () => card.classList.toggle('flipped');
        card.addEventListener('click', flip);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
        });
    });

    // ----- Playlist (from config.js) + "now playing" + visualizer state -----
    const playlistEl = $('playlist');
    const numberEmoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
    if (playlistEl) {
        cfg.songs.forEach((song, i) => {
            const row = document.createElement('div');
            row.className = 'playlist-row';
            row.style.cssText = 'display:flex;align-items:center;margin:15px 0;padding:10px;background:rgba(255,255,255,0.5);border-radius:15px;';

            const num = document.createElement('span');
            num.style.cssText = 'font-size:2rem;margin-right:15px;';
            num.textContent = numberEmoji[i] || String(i + 1);

            const text = document.createElement('div');
            const title = document.createElement('p');
            title.style.cssText = 'font-weight:bold;margin:0;';
            title.textContent = song.title;
            const note = document.createElement('p');
            note.style.cssText = 'color:#666;margin:0;';
            note.textContent = song.note || '';
            text.append(title, note);

            row.append(num, text);
            playlistEl.appendChild(row);
        });
    }
    document.addEventListener('vday:music', (e) => {
        const { index, playing } = e.detail;
        document.querySelectorAll('.visualizer').forEach(v => v.classList.toggle('paused', !playing));
        if (!playlistEl) return;
        [...playlistEl.children].forEach((row, i) => {
            const note = row.querySelector('div p:last-child');
            const base = cfg.songs[i].note || '';
            note.textContent = (i === index && playing ? '▶ Now playing · ' : '') + base;
            row.style.outline = i === index ? '2px solid #ffb6c1' : 'none';
        });
    });

    // ----- Daily love note -----
    const dailyNotes = [
        "You are my sunshine ☀️",
        "Thinking of you always 💭",
        "Distance means nothing when you mean everything ❤️",
        "You're the first thing on my mind every morning 🌅",
        "Can't wait to see you again 🤗",
        "You make my world beautiful 🌎",
        "Every day I love you more 📈",
        "You're my favorite thought 💭",
        "Sending you a virtual hug 🫂",
        "You're the best part of my day 🏆",
        "My heart beats for you 💓",
        "You're my today and my tomorrow ✨",
        "Missing you extra today 💕",
        "You're the reason I smile 😊",
        "My love for you grows every day 🌱"
    ];
    $('dailyNote').textContent = dailyNotes[Math.floor(Math.random() * dailyNotes.length)];

    // ----- "Today" on the timeline: the upcoming (or current) Valentine's Day -----
    (function setValentineYear() {
        const now = new Date();
        const thisYears = new Date(now.getFullYear(), 1, 14, 23, 59, 59);
        $('valentine-year').textContent = now > thisYears ? now.getFullYear() + 1 : now.getFullYear();
    })();

    // ----- Countdown -----
    let reunionDate = parseLocalDate(store.get('reunionDate')) || parseLocalDate(cfg.reunionDefault) || new Date();
    const countdownEl = $('countdown');

    function updateCountdown() {
        const distance = reunionDate - Date.now();
        if (distance < 0) {
            countdownEl.textContent = "🎉 We're together! 🎉";
            return;
        }
        const d = Math.floor(distance / 86400000);
        const h = Math.floor((distance % 86400000) / 3600000);
        const m = Math.floor((distance % 3600000) / 60000);
        const sec = Math.floor((distance % 60000) / 1000);

        let pill = countdownEl.firstElementChild;
        if (!pill || !pill.classList.contains('countdown-pill')) {
            countdownEl.textContent = '';
            pill = document.createElement('span');
            pill.className = 'countdown-pill';
            countdownEl.appendChild(pill);
        }
        pill.textContent = d + 'd ' + h + 'h ' + m + 'm ' + sec + 's';
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    window.setReunionDate = function () {
        const picker = $('reunionDatePicker');
        const date = parseLocalDate(picker.value);
        if (!date) { toast('Pick a date first 📅'); return; }
        reunionDate = date;
        store.set('reunionDate', picker.value);
        updateCountdown();
        toast('✅ Countdown updated!');
    };

    // ----- Love meter -----
    window.checkLove = function () {
        const pct = Math.floor(Math.random() * 11) + 90; // 90-100%
        $('loveMeter').style.width = pct + '%';
        const messages = [
            "💕 Perfect Match!", "💗 Soulmates!", "💖 Made for Each Other!", "💘 True Love!",
            "💝 Forever & Always!", "👑 Royal Love!", "✨ Meant to Be!", "🌟 Written in the Stars!"
        ];
        $('loveMessage').textContent = messages[Math.floor(Math.random() * messages.length)] + ' ' + pct + '%';
        burst({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    };

    // ----- Fortune teller -----
    window.tellFortune = function () {
        const fortunes = [
            "🌹 You will be loved forever", "💕 True love is calling your name",
            "💘 Someone is thinking of you right now", "💖 A surprise date is in your future",
            "💗 Your heart will skip a beat tomorrow", "💓 You are the reason someone smiles",
            "💞 Your love story is just beginning", "✨ Magic is in the air for you two",
            "⭐ You are the star in someone's sky", "🌙 A moonlit adventure awaits",
            "🌸 Flowers will come your way soon", "🎁 A sweet surprise is coming",
            "💌 Check your messages - good news awaits", "💎 You are more precious than diamonds",
            "👑 You are royalty in someone's eyes"
        ];
        $('fortuneMessage').textContent = fortunes[Math.floor(Math.random() * fortunes.length)];
        burst({ particleCount: 30, spread: 40, origin: { y: 0.5 }, colors: ['#9933ff', '#cc66ff', '#ff99ff'] });
    };

    // ----- Bingo -----
    window.markBingo = function (cell) {
        cell.classList.toggle('marked');
        cell.setAttribute('aria-pressed', String(cell.classList.contains('marked')));
        const marked = document.querySelectorAll('.bingo-cell.marked').length;
        const msg = $('bingoMessage');
        if (marked === 5) { // celebrate once, when the 5th is ticked
            msg.textContent = '🎉 BINGO! We have so many beautiful memories! 🎉';
            burst({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
        } else if (marked < 5) {
            msg.textContent = 'Click cells to mark our memories!';
        }
    };

    // ----- Theme switcher (colours live in style.css; choice is remembered) -----
    function applyTheme(color) {
        if (color === 'pink') delete document.body.dataset.theme;
        else document.body.dataset.theme = color;
        const bg = getComputedStyle(document.body).getPropertyValue('--page-bg').trim();
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta && bg) meta.setAttribute('content', bg);
    }
    window.changeTheme = function (color) {
        applyTheme(color);
        store.set('theme', color);
        burst({ particleCount: 30, spread: 50, origin: { y: 0.5 } });
    };
    applyTheme(store.get('theme', 'pink'));

    // ----- Message in a bottle -----
    let bottleTimer;
    window.openBottle = function () {
        const box = $('bottleMessage');
        box.style.display = 'block';
        clearTimeout(bottleTimer);
        bottleTimer = setTimeout(() => { box.style.display = 'none'; }, 5000);
    };

    // ----- Timeline dates -----
    const prettyDate = (d) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    function showTimelineDate(input) {
        const date = parseLocalDate(input.value);
        const label = input.previousElementSibling;
        if (date && label && label.tagName === 'P') label.textContent = prettyDate(date);
    }
    window.saveTimelineDates = function () {
        const inputs = document.querySelectorAll('.timeline-date');
        const saved = [];
        inputs.forEach(input => { saved.push(input.value || ''); showTimelineDate(input); });
        store.setJSON('timelineDates', saved);
        toast('✅ Timeline dates saved!');
    };
    const savedTimeline = store.getJSON('timelineDates', []);
    document.querySelectorAll('.timeline-date').forEach((input, i) => {
        if (savedTimeline && savedTimeline[i]) { input.value = savedTimeline[i]; showTimelineDate(input); }
    });

    // ----- Gift box -----
    window.openGift = function () {
        $('giftMessage').style.display = 'block';
        $('giftBox').classList.add('opened');
        burst({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    };

    // ----- Love map -----
    const cityBox = $('cityContainer');
    function cityChip(text) {
        const chip = document.createElement('span');
        chip.style.cssText = 'background:#d63384;color:white;padding:8px 20px;border-radius:30px;margin:5px;display:inline-block;';
        chip.textContent = text.startsWith('📍') ? text : '📍 ' + text;
        return chip;
    }
    function saveCities() {
        store.setJSON('loveMap', [...cityBox.children].map(c => c.textContent));
    }
    const savedCities = store.getJSON('loveMap', null);
    if (Array.isArray(savedCities) && savedCities.length) {
        cityBox.textContent = '';
        savedCities.forEach(c => cityBox.appendChild(cityChip(String(c))));
    }
    window.addCity = function () {
        const input = $('newCity');
        const name = input.value.trim();
        if (!name) return;
        const exists = [...cityBox.children].some(c => c.textContent.replace('📍', '').trim().toLowerCase() === name.toLowerCase());
        if (!exists) { cityBox.appendChild(cityChip(name)); saveCities(); }
        input.value = '';
    };
    $('newCity').addEventListener('keydown', (e) => { if (e.key === 'Enter') window.addCity(); });

    // ----- Love letter modal -----
    const letterBtn = $('love-letter-btn');
    const letter = $('love-letter-modal');
    function openLetter() {
        letter.style.display = 'flex';
        $('letter-close').focus();
    }
    function closeLetter() {
        letter.style.display = 'none';
        letterBtn.focus();
    }
    letterBtn.addEventListener('click', openLetter);
    $('letter-close').addEventListener('click', closeLetter);
    letter.addEventListener('click', (e) => { if (e.target === letter) closeLetter(); });
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (letter.style.display === 'flex') closeLetter();
        $('giftMessage').style.display = 'none';
        $('bottleMessage').style.display = 'none';
    });

    // ----- Secret message -----
    $('secret-btn').addEventListener('click', () => {
        toast('I love you, Isimi. Always have, always will. You are my rest, my peace, my everything. Today, tomorrow, forever. ❤️', 7000);
    });

    // ----- Emoji rain on double click / double tap -----
    document.addEventListener('dblclick', () => {
        if (reducedMotion.matches) return;
        const emojis = ['❤️', '💕', '💗', '💖', '💘', '💝', '💞', '💓', '✨', '⭐', '🌹', '🌸', '🎉', '🎊'];
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const el = document.createElement('div');
                el.className = 'emoji-rain';
                el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                el.style.left = Math.random() * 100 + '%';
                el.style.animationDuration = (Math.random() * 2 + 2) + 's';
                el.style.fontSize = (Math.random() * 2 + 1.5) + 'rem';
                document.body.appendChild(el);
                setTimeout(() => el.remove(), 3000);
            }, i * 100);
        }
        burst({ particleCount: 50, spread: 70, origin: { y: 0.5 } });
    });

    // ----- Heart trail on click -----
    // position:fixed needs clientX/Y; pageX/Y put the hearts a whole scroll-height too low.
    document.addEventListener('click', (e) => {
        if (reducedMotion.matches) return;
        const hearts = ['❤️', '💕', '💗', '💖', '💘', '💝', '💞', '💓'];
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.cssText = 'position:fixed;font-size:1.8rem;pointer-events:none;z-index:9999;animation:floatUp 1s ease-out forwards;' +
            'left:' + e.clientX + 'px;top:' + e.clientY + 'px;';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    });
})();
