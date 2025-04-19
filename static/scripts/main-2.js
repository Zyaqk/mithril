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
            document.getElementById('notification').style.display = "block";
            document.getElementById('notification').innerHTML = '<span>ОШИБКА ПРИ КОПИРОВАНИЕ!</span>';
            setTimeout(function() {
                document.getElementById('notification').style.display = "none";
            }, 3000);
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