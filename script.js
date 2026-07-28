/* ==================================================================
    1. ALGORITHME GITHUB (Bento GRID Intelligent)
================================================================== */
const GITHUB_USERNAME = 'etsangou';
const bentoGrid = document.getElementById('bento-grid');
const loadingIndicator = document.getElementById('loading-indicator');

function timeAgo(dateString) {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " an(s)";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " mois";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " jour(s)";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " heure(s)";
    return "quelques instants";
}

function getLanguageColor(language) {
    const colors = {
        'C++': 'bg-blue-500', 'C#': 'bg-purple-500', 
        'HTML': 'bg-orange-500', 'JavaScript': 'bg-yellow-400',
        'TypeScript': 'bg-blue-400', 'Python': 'bg-green-500',
        'CSS': 'bg-blue-300'
    };
    return colors[language] || 'bg-gray-400';
}

async function fetchGitHubProjects() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=6`);
        const repos = await response.json();
        
        loadingIndicator.style.display = 'none';

        const sortedByLength = [...repos].sort((a, b) => {
            const lenA = a.description ? a.description.length : 0;
            const lenB = b.description ? b.description.length : 0;
            return lenB - lenA;
        });

        const bentoShapes = [
            { grid: "md:col-span-2 md:row-span-2", clamp: "line-clamp-8" }, 
            { grid: "md:col-span-2 md:row-span-1", clamp: "line-clamp-3" }, 
            { grid: "md:col-span-1 md:row-span-2", clamp: "line-clamp-8" }, 
            { grid: "md:col-span-1 md:row-span-1", clamp: "line-clamp-3" }, 
            { grid: "md:col-span-1 md:row-span-1", clamp: "line-clamp-3" }, 
            { grid: "md:col-span-1 md:row-span-1", clamp: "line-clamp-3" }  
        ];

        sortedByLength.forEach((repo, index) => {
            if (index < 6) {
                repo.bentoClass = bentoShapes[index].grid;
                repo.clampClass = bentoShapes[index].clamp;
            }
        });

        repos.forEach((repo, index) => {
            if (index >= 6) return; 

            const description = repo.description || 'Aucune description fournie pour ce dépôt.';
            const langColor = getLanguageColor(repo.language);
            const langDisplay = repo.language || 'Config / Autre';
            const updatedText = timeAgo(repo.pushed_at);

            const cardHTML = `
                <a href="${repo.html_url}" target="_blank" class="glass-panel rounded-xl p-5 md:p-6 hover:border-accent hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between ${repo.bentoClass}">
                    
                    <div class="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform group-hover:bg-accent/10"></div>
                    
                    <div>
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="text-xl font-bold text-white group-hover:text-accent transition-colors pr-4 truncate" title="${repo.name}">${repo.name}</h3>
                            <svg class="w-5 h-5 text-gray-500 group-hover:text-accent transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </div>
                        <p class="text-gray-400 text-sm mb-4 opacity-80 text-justify hyphens-auto ${repo.clampClass}">
                            ${description}
                        </p>
                    </div>

                    <div class="mt-auto pt-4 border-t border-gray-800/50 flex flex-wrap gap-2 justify-between items-center text-xs font-mono text-gray-400">
                        <span class="flex items-center gap-1.5 whitespace-nowrap">
                            <span class="w-2.5 h-2.5 rounded-full ${langColor} shadow-[0_0_8px_rgba(255,255,255,0.2)]"></span> 
                            ${langDisplay}
                        </span>
                        <span class="flex items-center gap-1 text-gray-500 whitespace-nowrap">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Modifié il y a ${updatedText}
                        </span>
                    </div>
                </a>
            `;
            bentoGrid.innerHTML += cardHTML;
        });

    } catch (error) {
        loadingIndicator.innerHTML = "<span class='text-red-500'>Erreur de chargement de l'API GitHub.</span>";
        console.error("Erreur Fetch GitHub:", error);
    }
}

/* ==================================================================
    2. FONCTIONS UI
================================================================== */

function copyDiscord() {
    navigator.clipboard.writeText("just_king");
    const textEl = document.getElementById("discord-text");
    const originalText = textEl.innerText;
    textEl.innerText = "Copié !";
    textEl.classList.remove("hidden"); 
    setTimeout(() => { 
        textEl.innerText = originalText;
        textEl.classList.add("hidden"); 
        textEl.classList.remove("sm:hidden"); 
    }, 2000);
}

const bootSequence = [
    "10 SYS 64738",
    "Loading modules: [C++, Web, AI, HW]",
    "Syncing repository states...",
    "Environment compiled successfully.",
    "Hello, World."
];

const bootTextElement = document.getElementById('boot-text');
const splashScreen = document.getElementById('splash-screen');
const mainContent = document.getElementById('main-content');
let currentLine = 0;

function typeLine() {
    if (currentLine < bootSequence.length) {
        const p = document.createElement('p');
        p.textContent = "> " + bootSequence[currentLine];
        p.className = "mb-1 md:mb-2 text-terminal";
        
        const cursor = document.querySelector('.typing-cursor');
        bootTextElement.insertBefore(p, cursor);
        
        currentLine++;
        setTimeout(typeLine, Math.random() * 150 + 50); 
    } else {
        setTimeout(() => {
            splashScreen.classList.add('animate-fade-out');
            setTimeout(() => {
                splashScreen.style.display = 'none';
                mainContent.classList.remove('opacity-0');
                fetchGitHubProjects();
            }, 800);
        }, 500);
    }
}

window.addEventListener('load', () => { setTimeout(typeLine, 300); });

// LOGIQUE PARTICULES
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];
const isMobile = window.innerWidth < 768;
const numberOfParticles = isMobile ? 30 : 80; 

const mouse = { x: null, y: null, radius: 150 }
window.addEventListener('mousemove', function(event) { mouse.x = event.x; mouse.y = event.y; });
window.addEventListener('mouseout', function() { mouse.x = undefined; mouse.y = undefined; });
window.addEventListener('touchstart', function() { mouse.x = undefined; mouse.y = undefined; }); 

function setCanvasSize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', setCanvasSize);
setCanvasSize();

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color;
    }
    draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        let dx = mouse.x - this.x; let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 1;
            if (mouse.x > this.x && this.x > this.size * 10) this.x -= 1;
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 1;
            if (mouse.y > this.y && this.y > this.size * 10) this.y -= 1;
        }
        this.x += this.directionX; this.y += this.directionY; this.draw();
    }
}

function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 0.5;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.8) - 0.4; let directionY = (Math.random() * 0.8) - 0.4;
        particlesArray.push(new Particle(x, y, directionX, directionY, size, 'rgba(59, 130, 246, 0.6)'));
    }
}

function connectParticles() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) 
                         + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 10) * (canvas.height / 10)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(59, 130, 246,' + opacityValue + ')';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) { particlesArray[i].update(); }
    connectParticles();
}

initParticles();
animateParticles();
