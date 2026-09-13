// ===== CONFIGURATION =====
const CORRECT_PASSWORD = "2909"; // CHANGE THIS to her birthday (DDMM)
const YOUR_NAME = "TIASH";
const MUSIC_VOLUME = 0.5;
const TRANSITION_DURATION = 1.1;

// ⏱️ HOW LONG EACH SLIDE SHOWS (in seconds)
const SLIDE_DURATION = 5;

// ===== TIMED SLIDESHOW WITH LYRICS =====
// ALL slides (photos & videos) = 5 seconds each
const slideshowTimeline = [
    { 
        media: { type: 'image', src: 'photos/photos/pic5.jpeg' }, 
        lyric: '🎵 Every moment with you...'
    },
    { 
        media: { type: 'image', src: 'photos/photos/pic1.jpeg' }, 
        lyric: '...is a memory I treasure ❤️'
    },
    { 
        media: { type: 'video', src: 'photos/videoos2/video1.mp4' }, 
        lyric: '🎶 You make my heart smile...'
    },
    { 
        media: { type: 'image', src: 'photos/photos/pic2.jpeg' }, 
        lyric: '...in ways I never knew possible 💕'
    },
    { 
        media: { type: 'video', src: 'photos/videoos2/video2.mp4' }, 
        lyric: '🎵 Together, we are unstoppable...'
    },
    { 
        media: { type: 'image', src: 'photos/photos/pic3.jpeg' }, 
        lyric: '...and I love you more each day 🐱❤️'
    },
    {
         media: { type: 'image', src: 'photos/photos/pic4.jpeg' }, 
        lyric: '...Happy Birthday 🐱❤️'
    }
    // Add more entries as needed - each will show for 5 seconds
];

// ============================================================
// 1. PASSWORD CHECK
// ============================================================
function checkPassword() {
    const input = document.getElementById('passwordInput').value;
    const error = document.getElementById('errorMsg');

    if (input === CORRECT_PASSWORD) {
        document.getElementById('passwordScreen').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        
        launchConfetti();
        setTimeout(launchConfetti, 1500);
        setTimeout(launchConfetti, 3000);
        initializeSite();
    } else {
        error.textContent = '❌ Wrong birthday! Try again ❤️';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
    }
}

document.getElementById('passwordInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkPassword();
});

// ============================================================
// 🎵 MUSIC
// ============================================================
function playBackgroundMusic() {
    const music = document.getElementById('bgMusic');
    if (!music) return;
    
    music.volume = MUSIC_VOLUME;
    music.currentTime = 10;
    
    const playPromise = music.play();
    if (playPromise !== undefined) {
        playPromise
            .then(() => console.log('🎵 Music started'))
            .catch((error) => {
                console.log('⚠️ Autoplay blocked:', error);
                document.addEventListener('click', function retry() {
                    music.play().catch(() => {});
                    document.removeEventListener('click', retry);
                }, { once: true });
            });
    }
}

function toggleMusic() {
    const music = document.getElementById('bgMusic');
    const btn = document.getElementById('musicToggle');
    
    if (!music || !btn) return;
    
    if (music.paused) {
        music.play().catch(() => {});
        btn.textContent = '🎵';
        btn.classList.remove('muted');
    } else {
        music.pause();
        btn.textContent = '🔇';
        btn.classList.add('muted');
    }
}

// ============================================================
// 2. INITIALIZE
// ============================================================
function initializeSite() {
    createFloatingElements();
    setupRevealButton();
}

// ============================================================
// 3. FLOATING ELEMENTS
// ============================================================
function createFloatingElements() {
    const container = document.getElementById('floatingElements');
    const elements = ['❤️', '🐱', '🐈', '💕', '✨'];
    
    for (let i = 0; i < 30; i++) {
        const el = document.createElement('div');
        el.textContent = elements[Math.floor(Math.random() * elements.length)];
        const size = 20 + Math.random() * 40;
        el.style.cssText = `
            position: fixed;
            left: ${Math.random() * 95}%;
            top: ${Math.random() * 95}%;
            font-size: ${size}px;
            opacity: ${0.2 + Math.random() * 0.3};
            pointer-events: none;
            z-index: 0;
            animation: floatElement ${15 + Math.random() * 20}s infinite alternate ease-in-out;
            animation-delay: ${Math.random() * 15}s;
            transform: rotate(${Math.random() * 360}deg);
            user-select: none;
        `;
        container.appendChild(el);
    }
}

const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes floatElement {
        0% { transform: translate(0, 0) rotate(0deg) scale(1); }
        100% { transform: translate(${20 + Math.random() * 50}px, ${-20 - Math.random() * 50}px) rotate(20deg) scale(1.2); }
    }
`;
document.head.appendChild(floatStyle);

// ============================================================
// 4. REVEAL BUTTON → Start Cinematic Slideshow
// ============================================================
function setupRevealButton() {
    const btn = document.getElementById('revealBtn');
    btn.addEventListener('click', () => {
        btn.style.display = 'none';
        
        document.getElementById('mainContent').style.display = 'none';
        document.getElementById('slideshowSection').style.display = 'block';
        
        const music = document.getElementById('bgMusic');
        if (music) {
            music.currentTime = 10;
            music.play().catch(() => {});
        }
        
        startCinematicSlideshow();
    });
}

// ============================================================
// 5. CINEMATIC SLIDESHOW WITH SLIDE TRANSITION
// ============================================================
let currentSlideIndex = 0;
let slideshowTimer = null;
let totalDuration = 0;
let elapsedTime = 0;

function startCinematicSlideshow() {
    currentSlideIndex = 0;
    elapsedTime = 0;
    
    // Total duration = number of slides × SLIDE_DURATION
    totalDuration = slideshowTimeline.length * SLIDE_DURATION +
        (slideshowTimeline.length - 1) * TRANSITION_DURATION;
    
    createSlideElement(0);
    updateProgressBar();
}

function createSlideElement(index) {
    const slide = slideshowTimeline[index];
    const mediaContainer = document.getElementById('cinemaMedia');
    const lyricText = document.getElementById('lyricText');
    
    mediaContainer.innerHTML = '';
    
    if (slide.media.type === 'image') {
        const img = document.createElement('img');
        img.src = slide.media.src;
        img.alt = `Memory ${index + 1}`;
        mediaContainer.appendChild(img);
    } else if (slide.media.type === 'video') {
        const video = document.createElement('video');
        video.src = slide.media.src;
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        mediaContainer.appendChild(video);
    }
    
    if (slide.lyric) {
        lyricText.textContent = slide.lyric;
        lyricText.style.animation = 'none';
        setTimeout(() => {
            lyricText.style.animation = 'lyricAppear 0.8s ease';
        }, 10);
    } else {
        lyricText.textContent = '';
    }
    
    // Each slide shows for SLIDE_DURATION seconds
    slideshowTimer = setTimeout(() => {
        nextSlideWithTransition();
    }, SLIDE_DURATION * 1000);
}

function nextSlideWithTransition() {
    currentSlideIndex++;
    
    if (currentSlideIndex >= slideshowTimeline.length) {
        showFinale();
        return;
    }
    
    const mediaContainer = document.getElementById('cinemaMedia');
    const slide = slideshowTimeline[currentSlideIndex];
    const lyricText = document.getElementById('lyricText');
    
    // Create the new slide element
    const newSlide = document.createElement('div');
    newSlide.className = 'cinema-media slide-next';
    newSlide.id = 'newSlide';
    
    if (slide.media.type === 'image') {
        const img = document.createElement('img');
        img.src = slide.media.src;
        img.alt = `Memory ${currentSlideIndex + 1}`;
        newSlide.appendChild(img);
    } else if (slide.media.type === 'video') {
        const video = document.createElement('video');
        video.src = slide.media.src;
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        newSlide.appendChild(video);
    }
    
    mediaContainer.parentNode.appendChild(newSlide);
    newSlide.offsetHeight; // Force reflow
    
    // Slide current out to left, new one in from right
    mediaContainer.classList.add('slide-exit-left');
    
    setTimeout(() => {
        newSlide.classList.remove('slide-next');
        newSlide.classList.add('slide-current');
    }, 50);
    
    // Update lyric after transition starts
    setTimeout(() => {
        if (slide.lyric) {
            lyricText.textContent = slide.lyric;
            lyricText.style.animation = 'none';
            setTimeout(() => {
                lyricText.style.animation = 'lyricAppear 0.8s ease';
            }, 10);
        } else {
            lyricText.textContent = '';
        }
    }, 400);
    
    // Clean up after transition completes
    setTimeout(() => {
        if (mediaContainer.parentNode) {
            mediaContainer.parentNode.removeChild(mediaContainer);
        }
        
        newSlide.id = 'cinemaMedia';
        newSlide.classList.remove('slide-current');
        newSlide.classList.add('cinema-media');
        
        // Each slide shows for SLIDE_DURATION seconds
        slideshowTimer = setTimeout(() => {
            nextSlideWithTransition();
        }, SLIDE_DURATION * 1000);
        
    }, TRANSITION_DURATION * 1000);
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const startTime = Date.now();
    
    function update() {
        elapsedTime = (Date.now() - startTime) / 1000;
        const progress = Math.min((elapsedTime / totalDuration) * 100, 100);
        
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        
        if (progress < 100) {
            requestAnimationFrame(update);
        }
    }
    
    update();
}

function showFinale() {
    const finale = document.getElementById('finalQuote');
    const signatureName = document.getElementById('signatureName');

    if (signatureName) {
        signatureName.textContent = YOUR_NAME;
    }

    if (finale) {
        finale.style.display = 'flex';
    }
}

// ============================================================
// 6. CONFETTI (FIXED - no syntax errors)
// ============================================================
function launchConfetti() {
    const colors = ['#f06292', '#880e4f', '#ffffff', '#d81b60', '#f8bbd0'];
    
    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        
        // Calculate values FIRST (avoid template literal issues)
        const leftPos = Math.random() * 100;
        const widthVal = 6 + Math.random() * 10;
        const heightVal = 6 + Math.random() * 10;
        const bgColor = colors[Math.floor(Math.random() * colors.length)];
        const borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        const durationVal = 2 + Math.random() * 3;
        const delayVal = Math.random() * 1.5;
        
        confetti.style.cssText = 
            'position: fixed;' +
            'left: ' + leftPos + 'vw;' +
            'top: -20px;' +
            'width: ' + widthVal + 'px;' +
            'height: ' + heightVal + 'px;' +
            'background: ' + bgColor + ';' +
            'border-radius: ' + borderRadius + ';' +
            'animation: confettiFall ' + durationVal + 's linear forwards;' +
            'animation-delay: ' + delayVal + 's;' +
            'pointer-events: none;' +
            'z-index: 99999;';
        
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Add confetti keyframes
const confettiStyle = document.createElement('style');
confettiStyle.textContent = 
    '@keyframes confettiFall {' +
    '  0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }' +
    '  100% { transform: translateY(100vh) rotate(720deg) scale(0.3); opacity: 0; }' +
    '}';
document.head.appendChild(confettiStyle);