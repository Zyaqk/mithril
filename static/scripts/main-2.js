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