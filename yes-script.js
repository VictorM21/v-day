let musicPlaying = false;

// ===== ADD MISSING SONGS ARRAY =====
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

window.addEventListener('load', () => {
    launchConfetti();
    
    // ===== RESTORE MUSIC STATE FROM MAIN PAGE =====
    const music = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    
    // Check if elements exist
    if (!music || !musicToggle) {
        console.error("Music elements not found");
        return;
    }
    
    // Check if mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // ===== RESTORE THE RANDOM SONG FROM MAIN PAGE =====
    const selectedSong = localStorage.getItem('selectedSong');
    const songName = localStorage.getItem('songName');
    const savedIndex = localStorage.getItem('songIndex');
    
    console.log("🎵 Loading song from storage:", selectedSong);
    
    if (selectedSong) {
        // Validate that the song exists in our list
        const validSong = songs.includes(selectedSong);
        
        if (validSong) {
            // Clear existing sources
            while (music.firstChild) {
                music.removeChild(music.firstChild);
            }
            
            // Create new source with the saved song
            const source = document.createElement('source');
            source.src = selectedSong + '?v=' + new Date().getTime();
            source.type = 'audio/mpeg';
            music.appendChild(source);
            music.load();
            
            console.log("🎵 Continuing with: " + songName);
        } else {
            console.error("❌ Invalid saved song, using random");
            // Pick random song as fallback
            const randomIndex = Math.floor(Math.random() * songs.length);
            const fallbackSong = songs[randomIndex];
            
            while (music.firstChild) {
                music.removeChild(music.firstChild);
            }
            
            const source = document.createElement('source');
            source.src = fallbackSong + '?v=' + new Date().getTime();
            source.type = 'audio/mpeg';
            music.appendChild(source);
            music.load();
            
            localStorage.setItem('selectedSong', fallbackSong);
            localStorage.setItem('songIndex', randomIndex);
            localStorage.setItem('songName', songNames[randomIndex]);
        }
    } else {
        // No saved song, pick random
        const randomIndex = Math.floor(Math.random() * songs.length);
        const fallbackSong = songs[randomIndex];
        
        while (music.firstChild) {
            music.removeChild(music.firstChild);
        }
        
        const source = document.createElement('source');
        source.src = fallbackSong + '?v=' + new Date().getTime();
        source.type = 'audio/mpeg';
        music.appendChild(source);
        music.load();
        
        localStorage.setItem('selectedSong', fallbackSong);
        localStorage.setItem('songIndex', randomIndex);
        localStorage.setItem('songName', songNames[randomIndex]);
        
        console.log("🎵 No saved song, playing random: " + songNames[randomIndex]);
    }
    
    // Set volume
    music.volume = 0.4;
    
    // Get saved time and playing state from main page
    const savedTime = localStorage.getItem('musicTime');
    const wasPlaying = localStorage.getItem('musicPlaying') === 'true';
    
    console.log("⏱️ Saved time:", savedTime, "Was playing:", wasPlaying);
    
    // Restore position if available
    if (savedTime) {
        music.currentTime = parseFloat(savedTime);
        console.log("⏱️ Restored to position:", music.currentTime);
    }
    
    if (isMobile) {
        // Mobile: Start muted, unmute on interaction
        music.muted = true;
        music.play().then(() => {
            console.log("✅ Mobile audio initialized (muted)");
        }).catch(err => {
            console.log("❌ Mobile init failed:", err);
        });
        musicToggle.textContent = '🔇';
        musicPlaying = false;
        
        // If it was playing on main page, unmute on first touch
        if (wasPlaying) {
            function enableAudio() {
                if (!music) return;
                music.muted = false;
                music.play().then(() => {
                    musicPlaying = true;
                    if (musicToggle) musicToggle.textContent = '🔊';
                    console.log("✅ Mobile audio unmuted and playing");
                }).catch(err => {
                    console.log("❌ Mobile play failed:", err);
                    alert('🎵 Tap once more to play music');
                });
                document.removeEventListener('click', enableAudio);
                document.removeEventListener('touchstart', enableAudio);
            }
            document.addEventListener('click', enableAudio, { once: true });
            document.addEventListener('touchstart', enableAudio, { once: true });
        }
    } else {
        // Desktop: Try to play if it was playing on main page
        music.muted = false;
        if (wasPlaying) {
            music.play().then(() => {
                musicPlaying = true;
                if (musicToggle) musicToggle.textContent = '🔊';
                console.log("✅ Desktop audio resumed");
            }).catch(err => {
                console.log("❌ Desktop autoplay blocked:", err);
                musicPlaying = false;
                if (musicToggle) musicToggle.textContent = '🔇';
                
                // Set up click handler for first interaction
                function playOnClick() {
                    music.play().then(() => {
                        musicPlaying = true;
                        if (musicToggle) musicToggle.textContent = '🔊';
                        console.log("✅ Desktop audio started on click");
                    }).catch(err => {
                        console.log("❌ Still failed:", err);
                    });
                    document.removeEventListener('click', playOnClick);
                }
                document.addEventListener('click', playOnClick, { once: true });
            });
        } else {
            musicPlaying = false;
            if (musicToggle) musicToggle.textContent = '🔇';
        }
    }
    
    // Clear saved state (but keep song for next visit)
    localStorage.removeItem('musicTime');
    localStorage.removeItem('musicPlaying');
});

function launchConfetti() {
    // Check if confetti function exists
    if (typeof confetti !== 'function') {
        console.error("Confetti library not loaded");
        return;
    }
    
    const colors = ['#ff69b4', '#ff1493', '#ff85a2', '#ffb3c1', '#ff0000', '#ff6347', '#fff', '#ffdf00'];
    const duration = 6000;
    const end = Date.now() + duration;

    confetti({
        particleCount: 150,
        spread: 100,
        origin: { x: 0.5, y: 0.3 },
        colors
    });

    const interval = setInterval(() => {
        if (Date.now() > end) {
            clearInterval(interval);
            return;
        }

        confetti({
            particleCount: 40,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors
        });

        confetti({
            particleCount: 40,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors
        });
    }, 300);
}

// ===== FIXED TOGGLE MUSIC FUNCTION =====
window.toggleMusic = function() {
    const music = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    
    if (!music || !musicToggle) {
        console.error("Music elements not found");
        return;
    }
    
    console.log("🎵 Toggle clicked. Current paused state:", music.paused);
    console.log("🎵 Current muted state:", music.muted);
    
    if (music.paused) {
        // If muted, unmute first
        if (music.muted) {
            music.muted = false;
            console.log("🔊 Unmuted");
        }
        music.play().then(() => {
            musicPlaying = true;
            musicToggle.textContent = '🔊';
            console.log("✅ Music playing");
        }).catch((error) => {
            console.error("❌ Playback failed:", error);
            alert('🎵 Click the page first to enable music!');
        });
    } else {
        music.pause();
        musicPlaying = false;
        musicToggle.textContent = '🔇';
        console.log("⏸️ Music paused");
    }
};
