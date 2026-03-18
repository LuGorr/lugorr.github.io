

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

window.addEventListener('load', function() {
    const canvas = document.getElementById('golCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let screenWidth, screenHeight, rows, cols, grid;
    const cellSize = 10;

    function init() {
        screenWidth = canvas.parentElement.offsetWidth;
        screenHeight = canvas.parentElement.offsetHeight;
        canvas.width = screenWidth;
        canvas.height = screenHeight;

        cols = Math.ceil(screenWidth / cellSize);
        rows = Math.ceil(screenHeight / cellSize);

        // Inizializzazione griglia casuale
        grid = Array.from({ length: cols }, () =>
            Array.from({ length: rows }, () => Math.random() > 0.85 ? 1 : 0)
        );
    }

    function draw() {
        ctx.clearRect(0, 0, screenWidth, screenHeight);
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)"; // Colore delle cellule

        let nextGrid = grid.map(arr => [...arr]);

        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                if (grid[col][row] === 1) {
                    ctx.fillRect(col * cellSize, row * cellSize, cellSize - 1, cellSize - 1);
                }

                // Logica vicini
                let neighbors = 0;
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (i === 0 && j === 0) continue;
                        const x = (col + i + cols) % cols;
                        const y = (row + j + rows) % rows;
                        neighbors += grid[x][y];
                    }
                }

                // Regole Conway
                if (grid[col][row] === 1 && (neighbors < 2 || neighbors > 3)) {
                    nextGrid[col][row] = 0;
                } else if (grid[col][row] === 0 && neighbors === 3) {
                    nextGrid[col][row] = 1;
                }
            }
        }
        grid = nextGrid;
    }

    function animate() {
        draw();
        setTimeout(() => {
            requestAnimationFrame(animate);
        }, 100); // 10 FPS per non distrarre troppo
    }

    window.addEventListener('resize', init);
    init();
    animate();
});
