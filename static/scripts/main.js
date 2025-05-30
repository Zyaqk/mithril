document.addEventListener("DOMContentLoaded", function () {
    const openMap = document.getElementById("openMap");
    const link = openMap.querySelector("a");
    const closeIFrame = document.getElementById("closeIFrame");
    const iframeContainer = document.getElementById("iframe-container");
    const iframe = document.getElementById("iframe");
    const body = document.body;

    iframeContainer.style.opacity = "0";
    iframeContainer.style.transition = "opacity 0.23s ease-in-out";
    iframe.style.opacity = "0";
    iframe.style.transition = "opacity 0.23s ease-in-out";
    closeIFrame.style.opacity = "0";
    closeIFrame.style.transition = "opacity 0.23s ease-in-out";

    function openMapFunction(event) {
        event.preventDefault();

        iframeContainer.style.display = "block";
        iframe.style.display = "block";
        closeIFrame.style.display = "block";

        setTimeout(() => {
            iframeContainer.style.opacity = "1";
            iframe.style.opacity = "1";
            closeIFrame.style.opacity = "1";
        }, 10);

        body.style.position = "fixed";
        body.style.top = "0";
        body.style.left = "0";
        body.style.width = "100%";
        body.style.height = "100%";
        body.style.overflow = "hidden";
        body.style.pointerEvents = "none";
        iframeContainer.style.pointerEvents = "auto";
        closeIFrame.style.pointerEvents = "auto";
    }

    function closeMapFunction() {
        iframeContainer.style.opacity = "0";
        iframe.style.opacity = "0";
        closeIFrame.style.opacity = "0";

        setTimeout(() => {
            iframeContainer.style.display = "none";
            iframe.style.display = "none";
            closeIFrame.style.display = "none";

            body.style.position = "";
            body.style.top = "";
            body.style.left = "";
            body.style.width = "";
            body.style.height = "";
            body.style.overflow = "";
            body.style.pointerEvents = "";
            iframeContainer.style.pointerEvents = "";
            closeIFrame.style.pointerEvents = "";
        }, 500);
    }

    function toggleOpenMapBehavior() {
        if (window.innerWidth <= 800) {
            openMap.removeEventListener("click", openMapFunction);
            link.setAttribute("href", "http://87.251.74.15:25738");
        } else {
            link.removeAttribute("href");
            openMap.addEventListener("click", openMapFunction);
        }
    }

    closeIFrame.addEventListener("click", closeMapFunction);

    window.addEventListener("load", toggleOpenMapBehavior);
    window.addEventListener("resize", toggleOpenMapBehavior);

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

function getServerOnline() {
    $.getJSON('https://api.trademc.org/shop.getOnline?shop=225880&v3', function (data) {
        $('#online').each(function () {
            const isFooter = $(this).closest('.leftFooterTop').length > 0;
            const players = data.response?.players ?? 0;
            const max = data.response?.max_players ?? 0;
            const text = isFooter ? `${players} из ${max}` : `${players}`;
            if ($(this).text() !== text) $(this).text(text);
        });
    }).fail(function () {
        $('#online').each(function () {
            const isFooter = $(this).closest('.leftFooterTop').length > 0;
            const text = isFooter ? '0 из 0' : '0';
            $(this).text(text);
        });
    });
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
        img.src = `https://mineskin.eu/helm/${nickname}`;
        imgHandy.src = `https://mineskin.eu/helm/${nickname}`
        skin.src = `https://mineskin.eu/armor/body/${nickname}/100.png`
        notificationDashboard.style.display = 'none';
        notificationAll.style.display = 'block';
        notificationAll.innerHTML = `<span>ДАННЫЕ ОБНОВЛЕНЫ!</span>`;
        setTimeout(() => {
            notificationAll.style.display = "none";
        }, 3000);
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
        img.src = `https://mineskin.eu/helm/${nickname}`;
        imgHandy.src = `https://mineskin.eu/helm/${nickname}`;
        skin.src = `https://mineskin.eu/armor/body/${nickname}/100.png`
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
