const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0 normal
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",  // 1 confused
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",             // 2 pleading
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 3 sad
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4 sadder
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5 devastated
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6 very devastated
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"  // 7 crying runaway
];

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
];

const yesTeasePokes = [
    "try saying no first... I bet you want to know what happens 😏",
    "go on, hit no... just once 👀",
    "you're missing out 😈",
    "click no, I dare you 😏",
    "Isimi, just click it once! 😂"
];

let yesTeasedCount = 0;
let noClickCount = 0;
let runawayEnabled = false;
let musicPlaying = false;

const catGif = document.getElementById('cat-gif');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const music = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');

// Check if elements exist
if (!catGif || !yesBtn || !noBtn || !music || !musicToggle) {
    console.error("Required elements not found!");
}

// ===== PLAYLIST SETUP =====
const songs = [
    "music/Mannywellz-Looking-For-God.mp3",
    "music/Tchella-Ife-In-Love.mp3",
    "music/Mannywellz-Magic-Take-It-Easy.mp3"
];

const songNames = [
    "Mannywellz - Looking For God",
    "Tchella - Ife In Love",
    "Mannywellz - Magic Take It Easy"
];

// Verify song files exist (optional, removes console errors)
songs.forEach((song, index) => {
    fetch(song, { method: 'HEAD' })
        .then(response => {
            if (!response.ok) {
                console.warn(`⚠️ Song ${index + 1} may not exist: ${song}`);
            } else {
                console.log(`✅ Song ${index + 1} found: ${song}`);
            }
        })
        .catch(() => console.warn(`⚠️ Cannot verify song: ${song}`));
});

// Function to play next song in playlist - FIXED VERSION
function playNextSong() {
    if (!music) return;
    
    // Get current index from localStorage or default to 0
    let currentIndex = parseInt(localStorage.getItem('songIndex')) || 0;
    
    // Increment index, loop back to 0 if at end
    let nextIndex = (currentIndex + 1) % songs.length;
    
    // Update source
    const nextSong = songs[nextIndex];
    music.src = nextSong + '?v=' + new Date().getTime();
    music.load();
    
    // Save new index
    localStorage.setItem('selectedSong', nextSong);
    localStorage.setItem('songIndex', nextIndex);
    localStorage.setItem('songName', songNames[nextIndex]);
    
    // Use musicPlaying variable to determine if we should auto-play
    if (musicPlaying) {
        music.play().then(() => {
            console.log("✅ Auto-playing next song: " + songNames[nextIndex]);
        }).catch(err => {
            console.log("❌ Could not auto-play next song:", err);
            // If auto-play fails, we need user interaction again
            musicPlaying = false;
            if (musicToggle) musicToggle.textContent = '🔇';
        });
    } else {
        console.log("🎵 Next song loaded (paused): " + songNames[nextIndex]);
    }
}

// Initialize playlist – random start or continue
let selectedSong = localStorage.getItem('selectedSong');
let randomIndex;

if (selectedSong) {
    // Validate that the saved song exists in our list
    const validSong = songs.includes(selectedSong);
    
    if (validSong) {
        // Continue from where we left off
        randomIndex = parseInt(localStorage.getItem('songIndex'));
        console.log("🎵 Continuing with: " + songNames[randomIndex]);
    } else {
        // Invalid saved song, pick new random
        console.warn("⚠️ Invalid saved song, picking new random");
        randomIndex = Math.floor(Math.random() * songs.length);
        selectedSong = songs[randomIndex];
        
        localStorage.setItem('selectedSong', selectedSong);
        localStorage.setItem('songIndex', randomIndex);
        localStorage.setItem('songName', songNames[randomIndex]);
        console.log("🎵 New random song: " + songNames[randomIndex]);
    }
} else {
    // First visit: pick random start
    randomIndex = Math.floor(Math.random() * songs.length);
    selectedSong = songs[randomIndex];
    
    localStorage.setItem('selectedSong', selectedSong);
    localStorage.setItem('songIndex', randomIndex);
    localStorage.setItem('songName', songNames[randomIndex]);
    console.log("🎵 Starting with: " + songNames[randomIndex]);
}

// Set the source
music.src = selectedSong + '?v=' + new Date().getTime();
music.load();

// Add ended event listener to play next song
music.addEventListener('ended', playNextSong);

// ===== MOBILE-OPTIMIZED MUSIC SETUP =====
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function setupAudio() {
    if (isMobile) {
        // Mobile: Start muted, unmute on first interaction
        music.muted = true;
        music.volume = 0.4;
        music.play().then(() => {
            console.log("✅ Mobile audio initialized (muted)");
        }).catch(err => {
            console.log("❌ Mobile audio init failed:", err);
        });
        musicPlaying = false;
        if (musicToggle) musicToggle.textContent = '🔇';
        
        function enableAudio() {
            if (music) {
                music.muted = false;
                music.play().then(() => {
                    musicPlaying = true;
                    if (musicToggle) musicToggle.textContent = '🔊';
                    console.log("✅ Mobile audio unmuted and playing");
                }).catch(err => {
                    console.log("❌ Mobile audio play failed:", err);
                    // Fallback: try again with user interaction
                    alert('🎵 Tap once more to play music');
                });
            }
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
            if (musicToggle) musicToggle.textContent = '🔊';
            console.log("✅ Desktop audio playing");
        }).catch(() => {
            musicPlaying = false;
            if (musicToggle) musicToggle.textContent = '🔇';
            console.log("ℹ️ Desktop autoplay blocked, waiting for click");
            // Play on first click
            document.addEventListener('click', function playOnFirstClick() {
                music.play().then(() => {
                    musicPlaying = true;
                    if (musicToggle) musicToggle.textContent = '🔊';
                    console.log("✅ Desktop audio started on click");
                }).catch(err => {
                    console.log("❌ Desktop audio failed:", err);
                });
                document.removeEventListener('click', playOnFirstClick);
            }, { once: true });
        });
    }
}

setupAudio();

// ===== TOGGLE MUSIC FUNCTION =====
window.toggleMusic = function() {
    if (!music) return;
    
    if (music.paused) {
        // If muted, unmute first
        if (music.muted) {
            music.muted = false;
        }
        music.play().then(() => {
            musicPlaying = true;
            if (musicToggle) musicToggle.textContent = '🔊';
            console.log("✅ Music playing (toggled on)");
        }).catch(() => {
            alert('🎵 Click anywhere on the page first to enable music!');
        });
    } else {
        music.pause();
        musicPlaying = false;
        if (musicToggle) musicToggle.textContent = '🔇';
        console.log("⏸️ Music paused (toggled off)");
    }
};

// Save music state before leaving
window.addEventListener('beforeunload', function() {
    if (music) {
        localStorage.setItem('musicTime', music.currentTime);
        localStorage.setItem('musicPlaying', musicPlaying);
        console.log("💾 Saved music state: time=" + music.currentTime + ", playing=" + musicPlaying);
    }
});

// ===== BUTTON HANDLERS =====
window.handleYesClick = function() {
    if (!runawayEnabled) {
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)];
        yesTeasedCount++;
        showTeaseMessage(msg);
        return;
    }
    window.location.href = 'yes.html';
};

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast');
    if (toast) {
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
    }
}

window.handleNoClick = function() {
    if (!noBtn || !yesBtn || !catGif) return;
    
    noClickCount++;
    
    const msgIndex = Math.min(noClickCount, noMessages.length - 1);
    noBtn.textContent = noMessages[msgIndex];
    
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
    yesBtn.style.fontSize = `${currentSize * 1.35}px`;
    const padY = Math.min(18 + noClickCount * 5, 60);
    const padX = Math.min(45 + noClickCount * 10, 120);
    yesBtn.style.padding = `${padY}px ${padX}px`;
    
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize);
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`;
    }
    
    const gifIndex = Math.min(noClickCount, gifStages.length - 1);
    swapGif(gifStages[gifIndex]);
    
    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway();
        runawayEnabled = true;
        showTeaseMessage("Okay you asked for it! Try catching me now! 🏃‍♂️");
    }
};

function swapGif(src) {
    if (!catGif) return;
    catGif.style.opacity = '0';
    setTimeout(() => {
        if (catGif) {
            catGif.src = src;
            catGif.style.opacity = '1';
        }
    }, 200);
}

function enableRunaway() {
    if (!noBtn) return;
    noBtn.addEventListener('mouseover', runAway);
    noBtn.addEventListener('touchstart', runAway, { passive: true });
}

function runAway() {
    if (!noBtn) return;
    const margin = 20;
    const btnW = noBtn.offsetWidth;
    const btnH = noBtn.offsetHeight;
    const maxX = window.innerWidth - btnW - margin;
    const maxY = window.innerHeight - btnH - margin;
    const randomX = Math.random() * maxX + margin / 2;
    const randomY = Math.random() * maxY + margin / 2;
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    noBtn.style.zIndex = '50';
}
