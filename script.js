const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0 normal
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",  // 1 confused
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",             // 2 pleading
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 3 sad
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4 sadder
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5 devastated
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6 very devastated
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"  // 7 crying runaway
]

// Personal messages for Isimi - with Yoruba love! ❤️🇳🇬
const noMessages = [
    "Are you sure, Isimi? 🥺",
    "Mo nifẹ rẹ o! ❤️",           // I love you
    "But I added our song! 🎵",
    "Jowo, ronu daradara! 🙏",    // Please, think well
    "Isimi, you are my rest 💕",  // Meaning of her name
    "What if I bring you food? 🍜",
    "O l'ewa ju! ✨",             // You're beautiful
    "But I coded this for you! 💻",
    "Okan mi 💘",                 // My heart
    "Oluwadarasimi o! 😭",       // God is good to me
    "Last chance, Ife mi! 💔",
    "I'll let you pick the movie! 🎬",
    "Okay this is the LAST last chance! 😂"
]

const yesTeasePokes = [
    "try saying no first... I bet you want to know what happens 😏",
    "go on, hit no... just once 👀",
    "you're missing out 😈",
    "click no, I dare you 😏",
    "Isimi, just click it once! 😂"
]

let yesTeasedCount = 0
let noClickCount = 0
let runawayEnabled = false
let musicPlaying = false

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')
const musicToggle = document.getElementById('music-toggle')

// ===== RANDOM SONG SELECTION - NEW! =====
const songs = [
    "music/Mannywellz-Looking-For-God.mp3",
    "music/Tchella-Ife-In-Love.mp3",
    "music/Mannywellz-Magic-Take-It-Easy.mp3"
];

// Pick a random song
const randomSong = songs[Math.floor(Math.random() * songs.length)];

// Update the audio source
const source = music.querySelector('source');
if (source) {
    source.src = randomSong;
    music.load(); // Reload with new source
}

console.log("🎵 Today's song: " + randomSong.split('/').pop());

// ===== MOBILE-OPTIMIZED MUSIC SETUP =====
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
    // Mobile: Start muted, unmute on first interaction
    music.muted = true;
    music.volume = 0.4;
    music.play().catch(() => {});
    musicPlaying = false;
    musicToggle.textContent = '🔇';
    
    // Unmute on first click/touch
    function enableAudio() {
        music.muted = false;
        music.play().then(() => {
            musicPlaying = true;
            musicToggle.textContent = '🔊';
        }).catch(() => {});
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('touchstart', enableAudio);
    }
    
    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('touchstart', enableAudio, { once: true });
} else {
    // Desktop: Try normal autoplay
    music.muted = false;
    music.volume = 0.4;
    music.play().then(() => {
        musicPlaying = true;
        musicToggle.textContent = '🔊';
    }).catch(() => {
        musicPlaying = false;
        musicToggle.textContent = '🔇';
        // Play on first click
        document.addEventListener('click', function playOnFirstClick() {
            music.play().then(() => {
                musicPlaying = true;
                musicToggle.textContent = '🔊';
            }).catch(() => {});
            document.removeEventListener('click', playOnFirstClick);
        }, { once: true });
    });
}

// ===== TOGGLE MUSIC FUNCTION =====
window.toggleMusic = function() {
    if (music.paused) {
        music.play().then(() => {
            musicPlaying = true;
            musicToggle.textContent = '🔊';
        }).catch(() => {
            alert('🎵 Click anywhere on the page first to enable music!');
        });
    } else {
        music.pause();
        musicPlaying = false;
        musicToggle.textContent = '🔇';
    }
}

function handleYesClick() {
    if (!runawayEnabled) {
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }
    window.location.href = 'yes.html'
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function handleNoClick() {
    noClickCount++
    
    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]
    
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    yesBtn.style.fontSize = `${currentSize * 1.35}px`
    const padY = Math.min(18 + noClickCount * 5, 60)
    const padX = Math.min(45 + noClickCount * 10, 120)
    yesBtn.style.padding = `${padY}px ${padX}px`
    
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }
    
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])
    
    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
        showTeaseMessage("Okay you asked for it! Try catching me now! 🏃‍♂️")
    }
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function enableRunaway() {
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    const margin = 20
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin
    const randomX = Math.random() * maxX + margin / 2
    const randomY = Math.random() * maxY + margin / 2
    noBtn.style.position = 'fixed'
    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
    noBtn.style.zIndex = '50'
}
