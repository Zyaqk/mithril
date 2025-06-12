document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (event) {
        let telegramTarget = event.target.closest(".telegramHandy, .telegram");
        if (telegramTarget) {
            window.open("https://mithril.fun/tg", "_blank");
            return;
        }

        let liTarget = event.target.closest("li");
        if (liTarget) {
            let link = liTarget.querySelector("a");
            if (link && link.href) {
                window.open(link.href, link.target || "_self");
            }
        }
    });

    const elements = document.querySelectorAll(".divImgAredo");
    elements.forEach(function (el) {
        el.addEventListener("click", function () {
            const confirmMessage = "Вступи, пожалуйста, в наш телеграм… умоляю";
            if (confirm(confirmMessage)) {
                window.open("https://mithril.fun/tg", "_blank");
            }
        });
    });
});

function copyIp() {
    const ipText = "mc.mithril.fun";

    if (navigator.clipboard) {
        navigator.clipboard.writeText(ipText).then(function() {
            showNotification('АЙПИ СКОПИРОВАН В БУФЕР ОБМЕНА!', '');
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
            let current = parseInt(element.innerHTML) || 0;
            let players = data.response && data.response.players !== undefined ? data.response.players : 0;
            let maxPlayers = data.response && data.response.max_players !== undefined ? data.response.max_players : 0;
            
            let targetText = element.closest('.leftFooterTop') ? `${players} из ${maxPlayers}` : `${players}`;
            
            if (element.innerHTML !== targetText) {
                animateText(element, targetText);
            }
        });
    } catch (error) {
        document.querySelectorAll('#online').forEach(element => {
            let targetText = element.closest('.leftFooterTop') ? `0 из 0` : `0`;
            animateText(element, targetText);
        });
    }
}

function animateText(element, text) {
    element.innerHTML = text;
}

function animateNumber(element, start, end) {
    let startTime;
    let duration = 1000;
    
    function updateNumber(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = Math.min((timestamp - startTime) / duration, 1);
        let current = Math.round(start + (end - start) * easeOutQuad(progress));
        element.innerHTML = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function easeOutQuad(t) {
    return t * (2 - t);
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
    });

    close.addEventListener('click', () => {
        const listHeader = document.getElementById('listHeader');
        listHeader.style.top = '-100%';
        setTimeout(() => {
            listHeader.style.display = 'none';
        }, 500);
    });
}

toggleMenu();

function showNotification(message, bgColor = 'rgba(110, 216, 23, 0.8)') {
    const container = document.getElementById('notification-container');

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.backgroundColor = bgColor;
    notification.innerHTML = `<span>${message}</span>`;

    container.appendChild(notification);

    setTimeout(() => {
        notification.style.transition = 'opacity 0.3s ease';
        notification.style.opacity = '0';
    }, 4500);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}