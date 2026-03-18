// --- 1. LOGICA GAME OF LIFE ---
const canvas = document.getElementById('gameOfLifeCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, cellSize, rows, cols, grid;

    function initGame() {
        const container = canvas.parentElement;
        width = container.offsetWidth;
        height = container.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        cellSize = 10;
        cols = Math.ceil(width / cellSize);
        rows = Math.ceil(height / cellSize);
        grid = Array.from({ length: cols }, () =>
            Array.from({ length: rows }, () => Math.random() > 0.88 ? 1 : 0)
        );
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(100, 200, 255, 0.3)'; // Blu tenue hi-tech
        let nextGrid = grid.map(arr => [...arr]);

        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                if (grid[col][row]) {
                    ctx.fillRect(col * cellSize, row * cellSize, cellSize - 1, cellSize - 1);
                }
                let neighbors = 0;
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (i === 0 && j === 0) continue;
                        const x = (col + i + cols) % cols;
                        const y = (row + j + rows) % rows;
                        neighbors += grid[x][y];
                    }
                }
                if (grid[col][row] === 1 && (neighbors < 2 || neighbors > 3)) nextGrid[col][row] = 0;
                else if (grid[col][row] === 0 && neighbors === 3) nextGrid[col][row] = 1;
            }
        }
        grid = nextGrid;
    }

    function loop() {
        draw();
        setTimeout(() => requestAnimationFrame(loop), 120);
    }

    window.addEventListener('resize', initGame);
    initGame();
    loop();
}

// --- 2. LOGICA ORIGINALE TEMPLATE (CARICAMENTO YAML) ---
async function loadContent() {
    try {
        const response = await fetch('static/data/index.yml');
        const text = await response.text();
        const data = jsyaml.load(text);

        // Popolamento dei campi
        document.getElementById('title').innerText = data.title || "Academic Page";
        document.getElementById('page-top-title').innerText = data.name || "Home";
        document.getElementById('top-section-bg-text').innerText = data.banner_text || "";
        document.getElementById('home-subtitle').innerText = data.home_subtitle || "About Me";
        document.getElementById('copyright-text').innerText = data.copyright || "";

        // Markdown rendering
        if(data.home_md) document.getElementById('home-md').innerHTML = marked.parse(data.home_md);
        if(data.projects_md) document.getElementById('projects-md').innerHTML = marked.parse(data.projects_md);
        if(data.experience_md) document.getElementById('experience-md').innerHTML = marked.parse(data.experience_md);

    } catch (e) {
        console.error("Errore nel caricamento del file YAML:", e);
    }
}

// Avvia il caricamento dei contenuti
document.addEventListener('DOMContentLoaded', loadContent);
