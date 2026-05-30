// AUDIO SETTINGS
const bgMusic = new Audio('kevin.mp3');
bgMusic.loop = true;     
bgMusic.volume = 0.5;      

const crashSound = new Audio('preview.mp3');
crashSound.volume = 0.7;

// musik
    crashSound.pause();
    crashSound.currentTime = 0;
    bgMusic.currentTime = 0; // Startar om låten från början (valfritt, ta bort om du vill att den fortsätter)
    bgMusic.play();

// musik 2
let musicStarted = false;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// inställningar
const tileSize = 80; 

// väg
const roadMap = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1], 
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1]  
];

const roadHeight = roadMap.length * tileSize; 
let roadYOffset = 0; 

// bilder
const playerImg = new Image();
playerImg.src = 'motorbrobro.png'; 

const coneImg = new Image();
coneImg.src = 'trafficcone.png'; 

const spikeImg = new Image();
spikeImg.src = 'trafficcone.png'; 

// inställningar
const player = {
    x: 150,            
    y: 0,              
    size: 90,         
    vy: 0,             
    speed: 16,         
    accel: 1.8,        
    friction: 0.85     
};

// hinder
let obstacles = [];
let spawnTimer = 0;
let nextSpawnTime = Math.random() * 100 + 50; 

let isGameOver = false;
let roadOffsetX = 0; 
const keys = {};

window.addEventListener("keydown", (e) => {
    // Starta bakgrundsmusik
    if (!musicStarted && !isGameOver) {
        bgMusic.play().catch(err => console.log("Musik blockerad av webbläsaren än så länge"));
        musicStarted = true;
    }

    // starta om
    if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        if (isGameOver) {
            resetGame();
            score = 0; 
        }
    }
    
    keys[e.key.toLowerCase()] = true;
    if(["w", "s", "arrowup", "arrowdown"].includes(e.key.toLowerCase())) e.preventDefault();
});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

function resetGame() {
    obstacles = [];
    spawnTimer = 0;
    nextSpawnTime = Math.random() * 40 + 30;
    player.speed = 16; 
    player.y = canvas.height / 2;
    player.vy = 0;
    roadOffsetX = 0; 
    isGameOver = false;
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    roadYOffset = (canvas.height / 2) - (roadHeight / 2);
    if (!isGameOver) {
        player.y = canvas.height / 2;
    }
}
resizeCanvas(); 
window.addEventListener('resize', resizeCanvas);

function canMoveTo(y) {
    let p = player.size / 4; 
    let relativeTop = y - p - roadYOffset;
    let relativeBottom = y + p - roadYOffset;
    
    let gridYTop = Math.floor(relativeTop / tileSize);
    let gridYBottom = Math.floor(relativeBottom / tileSize);
    
    if (gridYTop < 0 || gridYBottom >= roadMap.length) return false;
    if (roadMap[gridYTop][0] === 1 || roadMap[gridYBottom][0] === 1) return false;
    
    return true;
}

function spawnObstacle() {
    const playableRows = [1, 2, 3, 4, 5, 6];
    const randomRow = playableRows[Math.floor(Math.random() * playableRows.length)];
    const imgType = Math.random() > 0.5 ? coneImg : spikeImg;

    const newObstacle = {
        x: canvas.width + tileSize, 
        y: roadYOffset + (randomRow * tileSize) + (tileSize / 2), 
        size: 80, 
        image: imgType
    };

    obstacles.push(newObstacle);
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.size &&
           rect1.x + rect1.size > rect2.x &&
           rect1.y < rect2.y + rect2.size &&
           rect1.y + rect1.size > rect2.y;
}

function update() {
    if (isGameOver) return;

    // flytta vägposition
    roadOffsetX += player.speed;

    // styrning
    if (keys["w"]) player.vy -= player.accel;
    if (keys["s"]) player.vy += player.accel;
    player.vy *= player.friction;

    let nextY = player.y + player.vy;
    if (canMoveTo(nextY)) {
        player.y = nextY;
    } else {
        player.vy = 0; 
    }

    // spawn logik
    spawnTimer++;
    if (spawnTimer >= nextSpawnTime) {
        spawnObstacle();
        
        if (Math.random() > 0.5) {
            spawnObstacle();
        }
        
        if (Math.random() > 0.75) {
            spawnObstacle();
        }

        spawnTimer = 0;
        nextSpawnTime = Math.random() * 40 + 30; 
    }

    // krockar
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.x -= player.speed;

        let playerBox = { x: player.x - player.size/4, y: player.y - player.size/4, size: player.size/2 };
        let obstacleBox = { x: obs.x - obs.size/2, y: obs.y - obs.size/2, size: obs.size };

        if (checkCollision(playerBox, obstacleBox)) {
            player.vy = 0;
            player.speed = 0; 
            isGameOver = true; 
            return;
        }

        if (obs.x < -obs.size) {
            obstacles.splice(i, 1);
        }
    }
}

function draw() {
    // 1. Bakgrund
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. ritning
    for (let y = 0; y < roadMap.length; y++) {
        let drawY = (y * tileSize) + roadYOffset;
        if (roadMap[y][0] === 1) {
            ctx.fillStyle = "#333232"; 
        } else {
            ctx.fillStyle = "#000000"; 
        }
        ctx.fillRect(0, drawY, canvas.width, tileSize);
    }

    // 3. ritning av linjer
    let lineLength = tileSize; 
    let numLines = Math.ceil(canvas.width / lineLength) + 2;
    let lineOffsetX = roadOffsetX % (lineLength * 2);

    for (let i = -2; i < numLines; i++) {
        let drawX = i * lineLength - lineOffsetX;

        // röd vita vägkanter
        let barrierColor = (Math.abs(i) % 2 === 0) ? "#FF0000" : "#FFFFFF";
        ctx.fillStyle = barrierColor;
        
        ctx.fillRect(drawX, roadYOffset + tileSize - 10, lineLength, 10);
        ctx.fillRect(drawX, roadYOffset + (7 * tileSize), lineLength, 10);

        // vita mittlinjer
        if (Math.abs(i) % 2 === 0) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(drawX, roadYOffset + (4 * tileSize) - 3, lineLength / 1.5, 6);
        }
    }

    // 4. Rita hindren
    for (let obs of obstacles) {
        ctx.drawImage(
            obs.image,
            obs.x - obs.size / 2,
            obs.y - obs.size / 2,
            obs.size,
            obs.size
        );
    }

    // 5. rrita spelaren
    ctx.drawImage(
        playerImg, 
        player.x - player.size / 2, 
        player.y - player.size / 2, 
        player.size, 
        player.size
    );

    // 6. game over
    if (isGameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = "center";
        ctx.fillStyle = "#FF0000";
        ctx.font = "bold 50px sans-serif";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10);
        
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "24px sans-serif";
        ctx.fillText("Tryck SPACE för att försöka igen", canvas.width / 2, canvas.height / 2 + 40);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();