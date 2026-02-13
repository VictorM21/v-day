let musicPlaying = false

window.addEventListener('load', () => {
    launchConfetti()
    
    // ===== RESTORE MUSIC STATE FROM MAIN PAGE =====
    const music = document.getElementById('bg-music')
    const musicToggle = document.getElementById('music-toggle')
    
    // Set volume
    music.volume = 0.4
    
    // Get saved time and playing state from main page
    const savedTime = localStorage.getItem('musicTime')
    const wasPlaying = localStorage.getItem('musicPlaying') === 'true'
    
    // Restore position if available
    if (savedTime) {
        music.currentTime = parseFloat(savedTime)
    }
    
    // Resume playing if it was playing on main page
    if (wasPlaying) {
        music.play().then(() => {
            musicPlaying = true
            musicToggle.textContent = '🔊'
        }).catch(() => {
            musicPlaying = false
            musicToggle.textContent = '🔇'
            // Play on first click
            document.addEventListener('click', function playOnClick() {
                music.play().then(() => {
                    musicPlaying = true
                    musicToggle.textContent = '🔊'
                })
                document.removeEventListener('click', playOnClick)
            }, { once: true })
        })
    } else {
        musicPlaying = false
        musicToggle.textContent = '🔇'
    }
    
    // Clear saved state so it doesn't interfere with future visits
    localStorage.removeItem('musicTime')
    localStorage.removeItem('musicPlaying')
})

function launchConfetti() {
    const colors = ['#ff69b4', '#ff1493', '#ff85a2', '#ffb3c1', '#ff0000', '#ff6347', '#fff', '#ffdf00']
    const duration = 6000
    const end = Date.now() + duration

    // Initial big burst
    confetti({
        particleCount: 150,
        spread: 100,
        origin: { x: 0.5, y: 0.3 },
        colors
    })

    // Continuous side cannons
    const interval = setInterval(() => {
        if (Date.now() > end) {
            clearInterval(interval)
            return
        }

        confetti({
            particleCount: 40,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors
        })

        confetti({
            particleCount: 40,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors
        })
    }, 300)
}

// ===== FIXED: TOGGLE MUSIC FUNCTION =====
window.toggleMusic = function() {
    const music = document.getElementById('bg-music')
    const musicToggle = document.getElementById('music-toggle')
    
    if (music.paused) {
        music.play().then(() => {
            musicPlaying = true
            musicToggle.textContent = '🔊'
        }).catch(() => {
            alert('🎵 Click the page first to enable music!')
        })
    } else {
        music.pause()
        musicPlaying = false
        musicToggle.textContent = '🔇'
    }
}
