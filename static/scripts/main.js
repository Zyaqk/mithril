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

setInterval(getServerOnline, 30000);
getServerOnline();

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

function addonDashboard() {
    const dashboardButton = document.getElementById('profile');
    const dashboardButtonHandy = document.getElementById('profileHandy');
    const dashboardWindow = document.querySelector('.userDashboard');
    const closeDashboardButton = document.getElementById('closeDashboard');
    const body = document.body;
    const modal = document.getElementById('userDashboard');

    dashboardButton.addEventListener('click', () => {
        dashboardWindow.style.display = 'block';
        requestAnimationFrame(() => {
            dashboardWindow.style.opacity = 1;
            dashboardWindow.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        body.style.position = "fixed";
        body.style.top = "0";
        body.style.left = "0";
        body.style.width = "100%";
        body.style.height = "100%";
        body.style.overflow = "hidden";
        body.style.pointerEvents = "none";
        modal.style.pointerEvents = "auto";
    });

    dashboardButtonHandy.addEventListener('click', () => {
        dashboardWindow.style.display = 'block';
        requestAnimationFrame(() => {
            dashboardWindow.style.opacity = 1;
            dashboardWindow.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        body.style.position = "fixed";
        body.style.top = "0";
        body.style.left = "0";
        body.style.width = "100%";
        body.style.height = "100%";
        body.style.overflow = "hidden";
        body.style.pointerEvents = "none";
        modal.style.pointerEvents = "auto";
    });

    closeDashboardButton.addEventListener('click', () => {
        dashboardWindow.style.opacity = 0;
        dashboardWindow.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            dashboardWindow.style.display = 'none';
        }, 500);
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.width = "";
        body.style.height = "";
        body.style.overflow = "";
        body.style.pointerEvents = "";
        modal.style.pointerEvents = "";
    });

    dashboardWindow.style.display = 'none';
    dashboardWindow.style.opacity = 0;
    dashboardWindow.style.transform = 'translate(-50%, -50%) scale(0.9)';
}

addonDashboard();


function processUserData() {
    const notificationAll = document.getElementById('notification');
    const notificationDashboard = document.getElementById('notificationDashboard');
    const inputNickname = document.getElementById('inputUsername');
    const img = document.getElementById('userIMGPC');
    const imgHandy = document.getElementById('userIMGHANDY');
    const skin = document.getElementById('userSkin');
    const nickname = inputNickname.value.trim();
    const inputEmail = document.getElementById('inputEmail');
    const email = inputEmail.value.trim();
    const inputCoupon = document.getElementById('inputCoupon');
    const coupon = inputCoupon.value.trim();
    let valid = true;

    if (nickname.trim() === "") {
        notificationDashboard.style.display = 'block';
        notificationDashboard.innerHTML = 'ВВЕДИТЕ СВОЙ НИКНЕЙМ!';
        valid = false;
    } else if (nickname.includes(" ")) {
        notificationDashboard.style.display = 'block';
        notificationDashboard.innerHTML = 'НИКНЕЙМ НЕ ДОЛЖЕН СОДЕРЖАТЬ ПРОБЕЛОВ!';
        valid = false;
    } else if (nickname.length > 16) {
        notificationDashboard.style.display = 'block';
        notificationDashboard.innerHTML = 'НИКНЕЙМ НЕ ДОЛЖЕН БЫТЬ ДЛИННЕЕ 16 СИМВОЛОВ!';
        valid = false;
    } else if (nickname !== nickname.trim()) {
        notificationDashboard.style.display = 'block';
        notificationDashboard.innerHTML = 'НИКНЕЙМ НЕ ДОЛЖЕН НАЧИНАТЬСЯ ИЛИ ЗАКАНЧИВАТЬСЯ ПРОБЕЛОМ!';
        valid = false;
    } else {
        localStorage.setItem('nickname', nickname);
    }    

    if (email === "") {
        notificationDashboard.style.display = 'block';
        notificationDashboard.innerHTML = 'ВВЕДИТЕ СВОЮ ПОЧТУ!';
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        notificationDashboard.style.display = 'block';
        notificationDashboard.innerHTML = 'НЕВЕРНЫЙ ФОРМАТ ПОЧТЫ!';
        valid = false;
    } else if (email.length < 5 || email.length > 254) {
        notificationDashboard.style.display = 'block';
        notificationDashboard.innerHTML = 'ПОЧТА ДОЛЖНА СОДЕРЖАТЬ ОТ 5!';
        valid = false;
    } else if (/[а-яА-Я]/.test(email)) {
        notificationDashboard.style.display = 'block';
        notificationDashboard.innerHTML = 'ПОЧТА НЕ ДОЛЖНА СОДЕРЖАТЬ РУССКИЕ БУКВЫ!';
        valid = false;
    } else if (email.startsWith(".") || email.endsWith(".")) {
        notificationDashboard.style.display = 'block';
        notificationDashboard.innerHTML = 'ПОЧТА НЕ ДОЛЖНА НАЧИНАТЬСЯ ИЛИ ЗАКАНЧИВАТЬСЯ ТОЧКОЙ!';
        valid = false;
    } else if (email.includes("..")) {
        notificationDashboard.style.display = 'block';
        notificationDashboard.innerHTML = 'ПОЧТА НЕ ДОЛЖНА СОДЕРЖАТЬ ДВЕ ТОЧКИ ПОДРЯД!';
        valid = false;
    } else if (email.includes(" ")) {
        notificationDashboard.style.display = 'block';
        notificationDashboard.innerHTML = 'ПОЧТА НЕ ДОЛЖНА СОДЕРЖАТЬ ПРОБЕЛЫ!';
        valid = false;
    } else {
        localStorage.setItem('mail', email);
    }    

    if (!valid) return;
    if (coupon !== "") {
        fetch(`/api/shop/coupon/${coupon}`)
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    notificationDashboard.style.display = 'block';
                    notificationDashboard.innerHTML = 'ВВЕДИТЕ СУЩЕСТВУЮЩИЙ КУПОН!';
                } else {
                    showSuccessMessage();
                }
            });
    } else {
        showSuccessMessage();
    }

    function showSuccessMessage() {
        img.src = `https://mc-heads.net/avatar`;
        imgHandy.src = `https://mc-heads.net/avatar`
        notificationDashboard.style.display = 'none';
        showNotification('ДАННЫЕ ОБНОВЛЕНЫ И СОХРАНЕНЫ!', '');
    }
}

function loadUserData() {
    loadNickname();
    loadMail();
}

function loadNickname() {
    const nickname = localStorage.getItem('nickname');

    if (nickname && nickname.trim() !== "") {
        const img = document.getElementById('userIMGPC');
        const imgHandy = document.getElementById('userIMGHANDY');
        const skin = document.getElementById('userSkin');
        img.src = `https://mc-heads.net/avatar`;
        imgHandy.src = `https://mc-heads.net/avatar`;
    }

    if (nickname) {
        document.getElementById('inputUsername').value = nickname;
    }
}

function loadMail() {
    const savedMail = localStorage.getItem('mail');
    if (savedMail) {
        document.getElementById('inputEmail').value = savedMail;
    }
}

window.onload = function() {
    loadUserData();
}

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
