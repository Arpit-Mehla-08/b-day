const audio = document.getElementById('music');
const modal = document.getElementById('password-modal');
const loader = document.getElementById('loader');
const codeInput = document.getElementById('code-input');
const loadingText = document.getElementById('loading-text');

const phrases = [
    "Searching the galaxy for the one who changed mine...",
    "Aligning the stars to the day everything started...",
    "Syncing our heartbeats across time and space...",
    "Almost there, my favorite person in the universe..."
];

codeInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkPassword(); });

function checkPassword() {
    if (codeInput.value === "0801") {
        startExperience();
    } else {
        document.getElementById('error-msg').style.opacity = '1';
        setTimeout(() => { document.getElementById('error-msg').style.opacity = '0'; }, 2000);
    }
}

function startExperience() {
    audio.play().catch(e => console.log("Audio permission required."));
    modal.style.opacity = '0';
    
    setTimeout(() => {
        modal.style.display = 'none';
        loader.style.display = 'flex'; // Show the loader first
        
        initStars();
        draw();
        
        // The Fix: Use requestAnimationFrame to ensure the loader is 
        // rendered before starting the 15s transition
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.getElementById('progress').style.width = "100%";
            });
        });

        // Cycle through phrases
        phrases.forEach((phrase, index) => {
            setTimeout(() => {
                loadingText.style.opacity = '0';
                setTimeout(() => {
                    loadingText.innerHTML = phrase;
                    loadingText.style.opacity = '1';
                }, 500);
            }, index * 3750);
        });

        // End loading and show gift
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                document.getElementById('stage1').classList.add('active');
            }, 1200);
        }, 15000);
    }, 1000);
}

// Starfield Engine
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [], speed = 0.4, isWarping = false;

function initStars() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < 400; i++) {
        stars.push({ x: Math.random() * canvas.width - canvas.width / 2, y: Math.random() * canvas.height - canvas.height / 2, z: Math.random() * canvas.width });
    }
}

function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width/2, canvas.height/2);
    for(let s of stars) {
        s.z -= speed;
        if(s.z <= 0) s.z = canvas.width;
        let x = s.x / (s.z / canvas.width), y = s.y / (s.z / canvas.width), sz = 2 * (canvas.width / s.z);
        ctx.beginPath();
        ctx.fillStyle = isWarping ? "rgba(251, 113, 133, 0.8)" : "white";
        ctx.arc(x, y, sz/2, 0, Math.PI*2);
        ctx.fill();
    }
    ctx.translate(-canvas.width/2, -canvas.height/2);
    requestAnimationFrame(draw);
}

function nextStage(num) {
    if(num === 1) {
        isWarping = true; speed = 15; 
        setTimeout(() => { speed = 0.6; isWarping = false; }, 6000); 
    }
    const current = document.getElementById(`stage${num}`);
    current.classList.remove('active');
    setTimeout(() => {
        const next = document.getElementById(`stage${num+1}`);
        if(next) {
            next.classList.add('active');
            if(num + 1 === 5) setInterval(createHeart, 300);
            else spawnHeartBurst();
        }
    }, 600);
}

function createHeart() {
    const h = document.createElement('div');
    h.className = 'heart text-xl';
    h.innerHTML = '❤️';
    h.style.left = Math.random() * 100 + 'vw';
    h.style.bottom = '-10vh';
    h.style.animationDuration = (Math.random() * 2 + 3) + 's';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 5000);
}

function spawnHeartBurst() {
    for(let i=0; i<30; i++) setTimeout(createHeart, i * 150);
}

window.addEventListener('resize', initStars);