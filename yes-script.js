let musicPlaying = false;

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
    
    if (selectedSong) {
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
    }
    
    // Set volume
    music.volume = 0.4;
    
    // Get saved time and playing state from main page
    const savedTime = localStorage.getItem('musicTime');
    const wasPlaying = localStorage.getItem('musicPlaying') === 'true';
    
    // Restore position if available
    if (savedTime) {
        music.currentTime = parseFloat(savedTime);
    }
    
    if (isMobile) {
        // Mobile: Start muted, unmute on interaction
        music.muted = true;
        music.play().catch(() => {});
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
                }).catch(() => {});
                document.removeEventListener('click', enableAudio);
                document.removeEventListener('touchstart', enableAudio);
            }
            document.addEventListener('click', enableAudio, { once: true });
            document.addEventListener('touchstart', enableAudio, { once: true });
        }
    } else {
        // Desktop: Normal restoration
        music.muted = false;
        if (wasPlaying) {
            music.play().then(() => {
                musicPlaying = true;
                if (musicToggle) musicToggle.textContent = '🔊';
            }).catch(() => {
                musicPlaying = false;
                if (musicToggle) musicToggle.textContent = '🔇';
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

// ===== TOGGLE MUSIC FUNCTION =====
window.toggleMusic = function() {
    const music = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    
    if (!music || !musicToggle) {
        console.error("Music elements not found");
        return;
    }
    
    if (music.paused) {
        // If muted, unmute first
        if (music.muted) {
            music.muted = false;
        }
        music.play().then(() => {
            musicPlaying = true;
            musicToggle.textContent = '🔊';
        }).catch((error) => {
            console.error("Playback failed:", error);
            alert('🎵 Click the page first to enable music!');
        });
    } else {
        music.pause();
        musicPlaying = false;
        musicToggle.textContent = '🔇';
    }
};
