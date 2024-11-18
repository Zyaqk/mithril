function copyIp() {
    const ipText = "MC.MITHRIL.FUN:25704";

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

function clickDescription() {
    document.getElementById('notification').style.display = "block";
    document.getElementById('notification').innerHTML = '<span>В РАЗРАБОТКЕ!</span>';
    setTimeout(function() {
        document.getElementById('notification').style.display = "none";
    }, 3000);
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


function addonCoupon() {
    const couponButton = document.getElementById('coupon');
    const couponWindow = document.querySelector('.couponWindown');
    const closeCouponButton = document.getElementById('closeCoupon');

    couponButton.addEventListener('click', () => {
        couponWindow.style.display = 'block';
        requestAnimationFrame(() => {
            couponWindow.style.opacity = 1;
            couponWindow.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    closeCouponButton.addEventListener('click', () => {
        couponWindow.style.opacity = 0;
        couponWindow.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            couponWindow.style.display = 'none';
        }, 500);
    });

    couponWindow.style.display = 'none';
    couponWindow.style.opacity = 0;
    couponWindow.style.transform = 'translate(-50%, -50%) scale(0.9)';   
}

function addonNickname() {
    const nicknameButton = document.getElementById('nickname');
    const nicknameWindow = document.querySelector('.nicknameWindown');
    const closeNicknameButton = document.getElementById('closeNickname');

    nicknameButton.addEventListener('click', () => {
        nicknameWindow.style.display = 'block';
        requestAnimationFrame(() => {
            nicknameWindow.style.opacity = 1;
            nicknameWindow.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    closeNicknameButton.addEventListener('click', () => {
        nicknameWindow.style.opacity = 0;
        nicknameWindow.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            nicknameWindow.style.display = 'none';
        }, 500);
    });

    nicknameWindow.style.display = 'none';
    nicknameWindow.style.opacity = 0;
    nicknameWindow.style.transform = 'translate(-50%, -50%) scale(0.9)';
}addonNickname();

function addonMail() {
    const mailButton = document.getElementById('mail');
    const mailWindow = document.querySelector('.mailWindown');
    const closeMailButton = document.getElementById('closeMail');

    mailButton.addEventListener('click', () => {
        mailWindow.style.display = 'block';
        requestAnimationFrame(() => {
            mailWindow.style.opacity = 1;
            mailWindow.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    closeMailButton.addEventListener('click', () => {
        mailWindow.style.opacity = 0;
        mailWindow.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            mailWindow.style.display = 'none';
        }, 500);
    });

    mailWindow.style.display = 'none';
    mailWindow.style.opacity = 0;
    mailWindow.style.transform = 'translate(-50%, -50%) scale(0.9)';
}

addonCoupon();
addonMail();


function addCoupon() {
    const window = document.getElementById('couponWindown');
    const notification = document.getElementById('notificationCoupon');
    const notificationAll = document.getElementById('notification');

    const input = document.getElementById('inputCoupon');
    const coupon = input.value.trim();

    if (coupon !== '') {
        fetch(`/api/shop/coupon/${coupon}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    notification.style.display = 'none';
                    window.style.display = 'none';
                    notificationAll.style.display = 'block';
                    notificationAll.innerHTML = `<span>КУПОН АКТИВИРОВАН: ${coupon}</span>`;
                    setTimeout(function() {
                        notificationAll.style.display = "none";
                    }, 3000);
                } else {
                    notification.style.display = 'block';
                    notification.innerHTML = 'Пожалуйста, введите существующий купон!';
                }
            });
    }
}

function addNickname() {
    const window = document.getElementById('nicknameWindown');
    const notification = document.getElementById('notificationNickname');
    const notificationAll = document.getElementById('notification');

    const input = document.getElementById('inputNickname');
    const nickname = input.value.trim();

    if (nickname === "") {
        notification.style.display = 'block';
        notification.innerHTML = 'Пожалуйста, введите свой никнейм!';
    } else if (nickname.includes(" ")) {
        notification.style.display = 'block';
        notification.innerHTML = 'Никнейм не должен содержать пробелы!';
    } else {
        notification.style.display = 'none';
        window.style.display = 'none';
        notificationAll.style.display = 'block';
        notificationAll.innerHTML = `<span>НИКНЕЙМ ДОБАВЛЕН: ${nickname}</span>`;
        setTimeout(function() {
            notificationAll.style.display = "none";
        }, 3000);

        const inputmail = document.getElementById('inputMail');
        const mail = inputmail.value.trim();
        const mailWindow = document.querySelector('.mailWindown');
        const notificationMail = document.getElementById('notificationMail');
        if (mail === "") {
            mailWindow.style.display = 'block';
            notificationMail.style.display = 'block';
            notificationMail.innerHTML = 'Пожалуйста, введите свою почту!';
            requestAnimationFrame(() => {
                mailWindow.style.opacity = 1;
                mailWindow.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        }
    }
}


function addMail() {
    const window = document.getElementById('mailWindown');
    const notification = document.getElementById('notificationMail');
    const notificationAll = document.getElementById('notification');

    const input = document.getElementById('inputMail');
    const mail = input.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (mail === "") {
        notification.style.display = 'block';
        notification.innerHTML = 'Пожалуйста, введите свою почту!';
        return;
    }

    if (!emailRegex.test(mail)) {
        notification.style.display = 'block';
        notification.innerHTML = 'Неверный формат почты!';
        return;
    }

    if (mail.length < 5 || mail.length > 254) {
        notification.style.display = 'block';
        notification.innerHTML = 'Почта должна содержать от 5 символов!';
        return;
    }

    if (/[а-яА-Я]/.test(mail)) {
        notification.style.display = 'block';
        notification.innerHTML = 'Почта не должна содержать русские буквы!';
        return;
    }

    notification.style.display = 'none';
    window.style.display = 'none';
    notificationAll.style.display = 'block';
    notificationAll.innerHTML = `<span>ПОЧТА ДОБАВЛЕНА! ${mail}</span>`;
    setTimeout(function() {
        notificationAll.style.display = "none";
    }, 3000);
}