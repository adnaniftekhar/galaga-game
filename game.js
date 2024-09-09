const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 30,
    width: 30,
    height: 30,
    speed: 5,
    dx: 0,
    gunType: 1
};

const bullets = [];
const enemies = [];
const powerUps = [];
let score = 0;
let level = 1;
let gameOver = false;
let missedEnemies = 0;

function drawPlayer() {
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullet(bullet) {
    ctx.fillStyle = 'red';
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
}

function drawEnemy(enemy) {
    ctx.fillStyle = 'green';
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}

function drawPowerUp(powerUp) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function drawLevel() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Level: ${level}`, canvas.width - 100, 20);
}

function drawMissedEnemies() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Missed: ${missedEnemies}`, canvas.width / 2 - 50, 20);
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newPos() {
    player.x += player.dx;

    // Detect walls
    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
            missedEnemies++;
            if (missedEnemies >= 3) {
                gameOver = true;
            }
        }
    });
}

function movePowerUps() {
    powerUps.forEach((powerUp, index) => {
        powerUp.y += powerUp.speed;
        if (powerUp.y > canvas.height) {
            powerUps.splice(index, 1);
        }
    });
}

function detectCollisions() {
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
                score += 10;
                if (enemies.length === 0) {
                    level++;
                    spawnEnemies();
                }
            }
        });
    });

    powerUps.forEach((powerUp, pIndex) => {
        if (
            player.x < powerUp.x + powerUp.width &&
            player.x + player.width > powerUp.x &&
            player.y < powerUp.y + powerUp.height &&
            player.y + player.height > powerUp.y
        ) {
            powerUps.splice(pIndex, 1);
            player.gunType = powerUp.gunType;
        }
    });
}

function spawnEnemies() {
    for (let i = 0; i < level * 5; i++) {
        enemies.push({
            x: Math.random() * (canvas.width - 30),
            y: Math.random() * -canvas.height,
            width: 30,
            height: 30,
            speed: 1 + level * 0.5
        });
    }
}

function spawnPowerUp() {
    powerUps.push({
        x: Math.random() * (canvas.width - 30),
        y: Math.random() * -canvas.height,
        width: 20,
        height: 20,
        speed: 2,
        gunType: Math.floor(Math.random() * 3) + 1 // Random gun type between 1 and 3
    });
}

function update() {
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        return;
    }

    clear();
    drawPlayer();
    bullets.forEach(drawBullet);
    enemies.forEach(drawEnemy);
    powerUps.forEach(drawPowerUp);
    drawScore();
    drawLevel();
    drawMissedEnemies();
    newPos();
    moveBullets();
    moveEnemies();
    movePowerUps();
    detectCollisions();
    requestAnimationFrame(update);
}

function moveRight() {
    player.dx = player.speed;
}

function moveLeft() {
    player.dx = -player.speed;
}

function shoot() {
    if (player.gunType === 1) {
        bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 10,
            speed: 7
        });
    } else if (player.gunType === 2) {
        bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 10,
            speed: 10
        });
    } else if (player.gunType === 3) {
        bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 10,
            speed: 7
        });
        bullets.push({
            x: player.x + player.width / 2 - 12.5,
            y: player.y,
            width: 5,
            height: 10,
            speed: 7,
            dx: -2
        });
        bullets.push({
            x: player.x + player.width / 2 + 7.5,
            y: player.y,
            width: 5,
            height: 10,
            speed: 7,
            dx: 2
        });
    }
}

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        moveRight();
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        moveLeft();
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        shoot();
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right' || e.key === 'ArrowLeft' || e.key === 'Left') {
        player.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

spawnEnemies();
setInterval(spawnPowerUp, 10000); // Spawn a power-up every 10 seconds
update();