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
    vx: 0,          // Velocity X
    vy: 0,          // Velocity Y
    maxSpeed: 6,    // Max speed limit
    accel: 0.2,     // How fast you speed up
    friction: 0.95  // 0.95 means it keeps 95% of speed every frame (slows down)
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
    // acceleration
    if (keys["ArrowUp"])    player.vy -= player.accel;
    if (keys["ArrowDown"])  player.vy += player.accel;
    if (keys["ArrowLeft"])  player.vx -= player.accel;
    if (keys["ArrowRight"]) player.vx += player.accel;

    // 2. friction
    player.vx *= player.friction;
    player.vy *= player.friction;

    // 3. CLAMP SPEED (Don't go faster than maxSpeed)
    const currentTotalSpeed = Math.sqrt(player.vx**2 + player.vy**2);
    if (currentTotalSpeed > player.maxSpeed) {
        let ratio = player.maxSpeed / currentTotalSpeed;
        player.vx *= ratio;
        player.vy *= ratio;
    }

    // 4. PREDICT NEXT POSITION
    let nextX = player.x + player.vx;
    let nextY = player.y + player.vy;

    // 5. COLLISION HANDLING
    let p = player.size / 4; // Using a smaller collision box (p) often feels better
    if (isWalkable(nextX - p, nextY - p) && 
        isWalkable(nextX + p, nextY - p) && 
        isWalkable(nextX - p, nextY + p) && 
        isWalkable(nextX + p, nextY + p)) {
        player.x = nextX;
        player.y = nextY;
    } else {
        // Optional: Stop movement if you hit a wall
        player.vx = 0;
        player.vy = 0;
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
                ctx.fillStyle = "#ff0000"; // Vägg
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            } else {
                ctx.fillStyle = "#000000"; // Gräs
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
