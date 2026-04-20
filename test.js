const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// INSTÄLLNINGAR
const tileSize = 40;
const screenWidth = 500; 
const screenHeight = 200;
canvas.width = screenWidth;
canvas.height = screenHeight;

// KARTAN (1 = Vägg, 0 = Golv)
// En 15x15 karta där 1:orna isolerar spelaren (skapar barriärer)
const map = [
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0]
];

const playerImg = new Image();
playerImg.src = 'motorbro.png'; // Här skriver du namnet på din bildfil


const player = {
    x: 150,
    y: 150,
    size: 100,
    speed: 4
};

const keys = {};

// LYSSNA PÅ TANGENTER
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
});
window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// FUNKTION FÖR ATT KOLLA VÄGGAR
function isWalkable(x, y) {
    let gridX = Math.floor(x / tileSize);
    let gridY = Math.floor(y / tileSize);
    
    // Utanför kartan = inte gåbart
    if (gridY < 0 || gridY >= map.length || gridX < 0 || gridX >= map[0].length) return false;
    // Returnera sant om det är en nolla (golv)
    return map[gridY][gridX] === 0;
}

function update() {
    let nextX = player.x;
    let nextY = player.y;

    if (keys["ArrowUp"])    nextY -= player.speed;
    if (keys["ArrowDown"])  nextY += player.speed;
    if (keys["ArrowLeft"])  nextX -= player.speed;
    if (keys["ArrowRight"]) nextX += player.speed;

    // Krockhantering (kolla alla hörn av spelaren)
    let p = player.size / 2;
    if (isWalkable(nextX - p, nextY - p) && 
        isWalkable(nextX + p, nextY - p) && 
        isWalkable(nextX - p, nextY + p) && 
        isWalkable(nextX + p, nextY + p)) {
        player.x = nextX;
        player.y = nextY;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // KAMERA (Håller spelaren i mitten)
    let camX = player.x - screenWidth / 2;
    let camY = player.y - screenHeight / 2;
    
    // Begränsa kameran till mappen
    camX = Math.max(0, Math.min(camX, map[0].length * tileSize - screenWidth));
    camY = Math.max(0, Math.min(camY, map.length * tileSize - screenHeight));

    ctx.save();
    ctx.translate(-camX, -camY);

    // RITA KARTAN
    for(let y = 0; y < map.length; y++) {
        for(let x = 0; x < map[y].length; x++) {
            if(map[y][x] === 1) {
                ctx.fillStyle = "#4a2e00"; // Vägg
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            } else {
                ctx.fillStyle = "#2d5a27"; // Gräs
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }

    // RITA SPELAREN
    ctx.drawImage(
        playerImg, 
        player.x - player.size / 2, 
        player.y - player.size / 2, 
        player.size, 
        player.size
    );

    ctx.restore();
}


function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
