function copyIp() {
    const ipText = "mc.mithril.fun";

    if (navigator.clipboard) {
        navigator.clipboard.writeText(ipText).then(function() {
            document.getElementById('notification').style.display = "block";
            document.getElementById('notification').innerHTML = '<span>АЙПИ СКОПИРОВАН В БУФЕР ОБМЕНА!</span>';
            setTimeout(function() {
                document.getElementById('notification').style.display = "none";
            }, 3000);
        }).catch(function(error) {
            console.error('Ошибка при копировании:', error);
        });
    } else {
        console.error('Буфер обмена недоступен');
    }
}

async function getServerOnline() {
    try {
        const response = await fetch('https://api.trademc.org/shop.getOnline?shop=225880&v3');
        const data = await response.json();
        const statusElements = document.querySelectorAll('#online');

        statusElements.forEach(element => {
            if (data.response && data.response.players !== undefined) {
                element.innerHTML = `${data.response.players}`;
            } else {
                element.innerHTML = `0`;
            }
        });
    } catch (error) {
        const statusElements = document.querySelectorAll('#online');
        statusElements.forEach(element => {
            element.innerHTML = `0`;
        });
    }
}
getServerOnline();
setInterval(getServerOnline, 30000);



function toggleMenu() {
    const open = document.getElementById('toggleMenu');
    const close = document.getElementById('closeMenu');

    open.addEventListener('click', () => {
        const listHeader = document.getElementById('listHeader');
        listHeader.style.display = 'block';
        setTimeout(() => {
            listHeader.style.top = '0';
        }, 10);
        open.style.display = 'none';
    });

    close.addEventListener('click', () => {
        const listHeader = document.getElementById('listHeader');
        listHeader.style.top = '-100%';
        setTimeout(() => {
            listHeader.style.display = 'none';
        }, 500);
        open.style.display = 'block';
    });
}
toggleMenu();


const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const snowflakes = [];

function createSnowflake() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        speedY: Math.random() * 3 + 1,
        speedX: Math.random() * 2 - 1,
    };
}

function drawSnowflake(snowflake) {
    ctx.beginPath();
    ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
}

function updateSnowflake(snowflake) {
    snowflake.y += snowflake.speedY;
    snowflake.x += snowflake.speedX;

    if (snowflake.y > canvas.height) {
        snowflake.y = -snowflake.radius;
        snowflake.x = Math.random() * canvas.width;
    }

    if (snowflake.x > canvas.width || snowflake.x < 0) {
        snowflake.x = Math.random() * canvas.width;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snowflakes.forEach((snowflake) => {
        updateSnowflake(snowflake);
        drawSnowflake(snowflake);
    });

    requestAnimationFrame(animate);
}

for (let i = 0; i < 100; i++) {
    snowflakes.push(createSnowflake());
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});