

const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'projects', 'experience']


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }

            })
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
            }).then(() => {
                // MathJax
                MathJax.typeset();
            })
            .catch(error => console.log(error));
    })

}); 

// Game of Life Implementation
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

        cellSize = 12; // Dimensione dei quadrati
        cols = Math.ceil(width / cellSize);
        rows = Math.ceil(height / cellSize);

        // Popolamento iniziale casuale
        grid = Array.from({ length: cols }, () =>
            Array.from({ length: rows }, () => Math.random() > 0.85 ? 1 : 0)
        );
    }

    function updateAndDraw() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'; // Colore delle cellule

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
        updateAndDraw();
        setTimeout(() => requestAnimationFrame(loop), 150);
    }

    window.addEventListener('resize', initGame);
    initGame();
    loop();
}
