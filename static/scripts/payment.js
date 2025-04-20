let categories = {};

async function fetchProducts() {
    try {
        const response = await fetch('/api/shop/products');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.success) {
            categories = {
                80286: { name: 'ЛОРД', minPrice: Infinity, maxPrice: -Infinity },
                80287: { name: 'КОРОЛЬ', minPrice: Infinity, maxPrice: -Infinity },
                80288: { name: 'ИМПЕРАТОР', minPrice: Infinity, maxPrice: -Infinity },
                80289: { name: 'ФРИЛЫ', minPrice: Infinity, maxPrice: -Infinity },
                80543: { name: 'НАБОРЫ', minPrice: Infinity, maxPrice: -Infinity },
                82100: { name: 'ЧАНКИ', minPrice: Infinity, maxPrice: -Infinity },
                81852: { name: 'КОМПАНЬОНЫ КУБЫ', minPrice: Infinity, maxPrice: -Infinity },
                82215: { name: 'КОСМЕТИКА КЛАССЫ', minPrice: Infinity, maxPrice: -Infinity },
                82216: { name: 'КОСМЕТИКА РАЗНОЕ', minPrice: Infinity, maxPrice: -Infinity },
                84359: { name: 'МАУНТЫ', minPrice: Infinity, maxPrice: -Infinity },
                83845: { name: 'КЛЮЧИ', minPrice: Infinity, maxPrice: -Infinity },
            };

            data.response.forEach(product => {
                const categoryId = product.category_id;
            
                if (categories[categoryId]) {
                    if (product.price < categories[categoryId].minPrice) {
                        categories[categoryId].minPrice = product.price;
                    }
                    if (product.price > categories[categoryId].maxPrice) {
                        categories[categoryId].maxPrice = product.price;
                    }
                }
            });
            displayCategories(categories);
        } else {
            console.error(data.error);
        }
    } catch (error) {
        console.error(error);
    }
}
function displayCategories(categories) {
    const listProducts = document.getElementById('listProducts');
    listProducts.innerHTML = '';

    const sortedCategoryIds = [
        80286, // ЛОРД
        80287, // КОРОЛЬ
        80288, // ИМПЕРАТОР
        80289, // ФРИЛЫ
        83845, // КЛЮЧИ
        80543, // НАБОРЫ
        82100, // ЧАНКИ
        81852, // КОМПАНЬОНЫ КУБЫ
        82215, // КОСМЕТИКА КЛАССЫ
        82216, // КОСМЕТИКА РАЗНОЕ
        84359, // МАУНТЫ
    ];

    const categoryImages = {
        80286: 'images/lord.png',
        80287: 'images/king.png',
        80288: 'images/emperor.png',
        80289: 'images/frills.png',
        80543: 'images/kits.png',
        82100: 'images/chunks.png',
        81852: 'images/companionCube.png',
        82215: 'images/cosmeticClass.png',
        82216: 'images/cosmeticOther.png',
        83845: 'images/cases.png',
        84359: 'images/mounts.png'
    };

    const categoryColors = {
        80286: '#f1ddca', // ЛОРД
        80287: '#f1ddca', // КОРОЛЬ
        80288: '#f1ddca', // ИМПЕРАТОР
        80289: '#f1ddca', // ФРИЛЫ
        80543: '#f1ddca', // НАБОРЫ
        82100: '#f1ddca', // ЧАНКИ
        81852: '#f1ddca', // КОМПАНЬОНЫ КУБЫ
        82215: '#f1ddca', // КОСМЕТИКА КЛАССЫ
        82216: '#f1ddca', // КОСМЕТИКА РАЗНОЕ
        83845: '#f1ddca', // КЛЮЧИ
        84359: '#f1ddca'  // МАУНТЫ
    };

    sortedCategoryIds.forEach(id => {
        const category = categories[id];
        if (category.minPrice !== Infinity) {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'itemCategorie animate__animated animate__fadeInDown';
    
            categoryItem.style.backgroundColor = categoryColors[id];
    
            let priceText;
    
            if (id === 83845) {
                priceText = `ОТ ${category.maxPrice} руб.`;
            } else {
                priceText = category.minPrice === category.maxPrice 
                    ? `ДО ${category.maxPrice} руб.` 
                    : `ОТ ${category.minPrice} ДО ${category.maxPrice} руб.`;
            }
    
            categoryItem.innerHTML = `
                <img src="${categoryImages[id]}" alt="${category.name}"> 
                <div class="descriptionCategorie">
                    <center>
                        <h1>${category.name}</h1>
                    </center>
                </div>
                <button onclick="handleButtonClick(${id})"><i class="fa-solid fa-cart-shopping"></i>${priceText}</button>
            `;
    
            listProducts.appendChild(categoryItem);
        }
    });    
}

function handleButtonClick(categoryId) {
    const categoryName = categories[categoryId].name;
    const categoryDisplay = document.getElementById('categoryName');
    const termDonate = document.getElementById('termDonate');
    const body = document.body;

    if (categoryDisplay) {
        categoryDisplay.innerText = categoryName;
    } else {
        console.error('Элемент для отображения имени категории не найден.');
    }

    fetch(`/api/shop/products`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                displayProducts(data.response, categoryId);
            } else {
                console.error(data.error);
            }
        })
        .catch(error => {
            console.error('Ошибка при получении товаров:', error);
        });

    termDonate.style.opacity = "0";
    termDonate.style.display = "block";
    termDonate.style.transition = "opacity 0.23s ease-in-out";
    termDonate.style.pointerEvents = "auto";
    body.style.top = "0";
    body.style.left = "0";
    body.style.width = "100%";
    body.style.height = "100%";
    body.style.overflow = "hidden";
    body.style.pointerEvents = "none";
    setTimeout(() => {
        termDonate.style.opacity = "1";
    }, 10);
}

let productCounters = {};

function itemProductsPlus(p, pr, b) {
    let n = productCounters;
    n[p] = (n[p] || 0) + 1;
    b.closest('.buttonsItemTerm')
     .querySelector('.buyItemProductButton')
     .innerText = `${n[p]} шт. (${pr * n[p]} руб.)`;
}

function itemProductsMinus(p, pr, b) {
    let n = productCounters;
    n[p] = (n[p] || 1) - 1 < 1 ? 1 : n[p] - 1;
    b.closest('.buttonsItemTerm')
     .querySelector('.buyItemProductButton')
     .innerText = `${n[p]} шт. (${pr * n[p]} руб.)`;
}

function displayProducts(products, selectedCategoryId) {
    const termList = document.getElementById('termList');
    termList.innerHTML = '';
    const filteredProducts = products.filter(product => product.category_id === selectedCategoryId);
    const categoryColors = {
        80286: '#f1ddca', // ЛОРД
        80287: '#f1ddca', // КОРОЛЬ
        80288: '#f1ddca', // ИМПЕРАТОР
        80289: '#f1ddca', // ФРИЛЫ
        80543: '#f1ddca', // НАБОРЫ
        82100: '#f1ddca', // ЧАНКИ
        81852: '#f1ddca', // КОМПАНЬОНЫ КУБЫ
        82215: '#f1ddca', // КОСМЕТИКА КЛАССЫ
        82216: '#f1ddca', // КОСМЕТИКА РАЗНОЕ
        83845: '#f1ddca', // КЛЮЧИ
        84359: '#f1ddca'  // МАУНТЫ
    };

    const infoTermText = {
        80286: 'Выберите срок действия:',         // ЛОРД 
        80287: 'Выберите срок действия:',         // КОРОЛЬ
        80288: 'Выберите срок действия:',         // ИМПЕРАТОР
        80289: 'Выберите сумму:',                 // ФРИЛЫ 
        80543: 'Выберите набор:',                 // НАБОРЫ
        82100: 'Выберите количество чанков:',     // ЧАНКИ
        81852: 'Выберите компаньон куба:',        // КОМПАНЬОНЫ КУБЫ
        82215: 'Выберите косметику класса:',      // КОСМЕТИКА КЛАССЫ
        82216: 'Выберите косметику:',             // КОСМЕТИКА РАЗНОЕ
        83845: 'Выберите ключ и его количество:', // КЛЮЧИ
        84359: 'Выберите маунта:'                 // МАУНТЫ
    };

    const infoTermParagraph = document.querySelector('.infoTerm p');
    if (infoTermText[selectedCategoryId]) {
        infoTermParagraph.innerText = infoTermText[selectedCategoryId];
    }

    if (filteredProducts.length > 0) {
        filteredProducts.forEach(product => {
            const itemTerm = document.createElement('div');
            itemTerm.className = 'itemTerm';
            itemTerm.style.backgroundColor = categoryColors[product.category_id];

            if (!productCounters[product.id]) {
                productCounters[product.id] = 1;
            }

            if (selectedCategoryId === 83845) {
                itemTerm.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <div class="buttonsItemTerm">
                        <button class="buyItemProductButtonToggle" onclick="itemProductsMinus(${product.id}, ${product.price}, this)">-</button>
                        <button class="buyItemProductButton" onclick="buyProduct(${product.id})">${productCounters[product.id]} шт. (${product.price * productCounters[product.id]} руб.)</button>
                        <button class="buyItemProductButtonToggle" onclick="itemProductsPlus(${product.id}, ${product.price}, this)">+</button>
                    </div>
                `;
            } else {
                itemTerm.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <div class="buttonsItemTerm">
                        <button class="buyItemProductButton" onclick="buyProduct(${product.id})">${product.price} руб.</button>
                    </div>
                `;
            }

            termList.appendChild(itemTerm);
        });
    } else {
        termList.innerHTML = '<p>Нет товаров в этой категории.</p>';
    }
}

document.getElementById('closeTerm').addEventListener('click', function() {
    const termDonate = document.getElementById('termDonate');
    const termList = document.getElementById('termList');
    const body = document.body;

    termDonate.style.opacity = "1";
    termDonate.style.transition = "opacity 0.23s ease-in-out";
    termDonate.style.opacity = "0";
    termDonate.style.pointerEvents = "none";
    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.width = "";
    body.style.height = "";
    body.style.overflow = "";
    body.style.pointerEvents = "";

    setTimeout(() => {
        termDonate.style.display = "none";
        termList.innerHTML = '';
    }, 230);
});

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();

    fetch('/api/shop/custommessages')
    .then(response => response.json())
    .then(data => {
        if (data.success && data.response.enabled) {
            const notificationHTML = `
                    <div id="message">
                        <div class="container">
                            <p>${data.response.message}</p>
                            <button id="messagebtn">${data.response.buttonCaption}</button>
                        </div>
                    </div>
            `;

            document.body.insertAdjacentHTML('beforeend', notificationHTML);

            const notification = document.getElementById('message');
            const button = document.getElementById('messagebtn');

            button.addEventListener('click', () => {
                if (data.response.buttonUrl) {
                    window.open(`${data.response.buttonUrl}`, '_blank');
                    notification.style.display = 'none';
                }
            });
        }
    });

    const purchasesContainer = document.getElementById('listPurchases');
    const placeholderCount = 6;
    const createPlaceholders = () => {
        purchasesContainer.innerHTML = '';
        for (let i = 0; i < placeholderCount; i++) {
            const itemHTML = `
                <div class="lastPurchasesItem" id="purchase-${i}">
                    <div class="PurchasesOne">
                        <img src="https://mineskin.eu/helm/Ar" alt="Avatar">
                    </div>
                    <div class="PurchasesTwo">
                        <ul>
                            <li>???????????...</li>
                            <li class="purchasesdonate">?????????????...</li>
                            <li class="purchasestime">??/??/???? ??:??</li>
                        </ul>
                    </div>
                </div>
            `;
            purchasesContainer.innerHTML += itemHTML;
        }
    };
    const fetchPayments = async () => {
        try {
            const response = await fetch('/api/shop/payments');
            const data = await response.json();

            if (data.success && Array.isArray(data.response)) {
                data.response.forEach((payment, index) => {
                    if (index >= placeholderCount) return;

                    payment.products.forEach(product => {
                        const formatDate = (dateStr) => {
                            const date = new Date(dateStr);
                            return date.toLocaleString('ru-RU', {
                                day: '2-digit', month: '2-digit', year: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                            }).replace(',', '');
                        };

                        const formattedDate = formatDate(payment.paid_at);
                        const productName = product.name.length > 10 ? product.name.slice(0, 10) + '...' : product.name;
                        const purchaseElement = document.getElementById(`purchase-${index}`);

                        if (purchaseElement) {
                            purchaseElement.querySelector('img').src = `https://mineskin.eu/helm/${payment.customer}`;
                            purchaseElement.querySelector('ul li:nth-child(1)').textContent = payment.customer;
                            purchaseElement.querySelector('ul li:nth-child(2)').textContent = productName;
                            purchaseElement.querySelector('ul li:nth-child(3)').textContent = formattedDate;
                        }
                    });
                });
            }
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    };

    createPlaceholders();
    fetchPayments();
    setInterval(fetchPayments, 300000);


});

function buyProduct(id) {
    const blockedIds = [899641, 900505, 928805, 899640];
    if (blockedIds.includes(id)) {
        showNotification('ЭТОТ ТОВАР ВРЕМЕННО ЗАБЛОКИРОВАН', 'orange');
        return;
    }

    const inputNickname = document.getElementById('inputUsername').value.trim();
    const inputMail = document.getElementById('inputEmail').value.trim();
    const userDashboard = document.getElementById('userDashboard');
    const notification = document.getElementById('notification');
    const termDonate = document.getElementById('termDonate');
    const termList = document.getElementById('termList');

    if (inputNickname === "") {
        userDashboard.style.display = 'block';
        userDashboard.style.pointerEvents = 'auto'
        termDonate.style.opacity = "1";
        termDonate.style.transition = "opacity 0.23s ease-in-out";
        termDonate.style.opacity = "0";
        termDonate.style.pointerEvents = "none";

        setTimeout(() => {
            termDonate.style.display = "none";
            termList.innerHTML = '';
        }, 230);

        requestAnimationFrame(() => {
            userDashboard.style.opacity = 1;
            userDashboard.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        return;
    }

    if (inputMail === "") {
        userDashboard.style.display = 'block';
        userDashboard.style.pointerEvents = 'auto'
        termDonate.style.opacity = "1";
        termDonate.style.transition = "opacity 0.23s ease-in-out";
        termDonate.style.opacity = "0";
        termDonate.style.pointerEvents = "none";

        setTimeout(() => {
            termDonate.style.display = "none";
            termList.innerHTML = '';
        }, 230);

        requestAnimationFrame(() => {
            userDashboard.style.opacity = 1;
            userDashboard.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        return;
    }

    const coupon = document.getElementById('inputCoupon').value.trim();

    let quantity = 1;
    if ([899640, 899641, 900505, 928805].includes(id)) {
        quantity = productCounters[id] || 1;
    }

    const products = `{"${id}":${quantity}}`;

    fetch(`/api/shop/payment/create?customer=${inputNickname}&server_id=82480&products=${products}&email=${inputMail}&coupon=${coupon}&success_url=https://mithril.fun`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.url) {
                showNotification('ПЕРЕХОД К ОПЛАТЕ', 'rgba(110, 216, 23, 0.8)');
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 1100);
                window.location = data.url;
            } else {
                showNotification(data.error || 'ПОКУПКИ СЕЙЧАС НЕВОЗМОЖНЫ!', 'red');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            showNotification(`ОШИБКА СЕРВЕРА: ${error.message}`, 'red');
        });
}

function showNotification(message, bgColor) {
    const notification = document.getElementById('notification');
    notification.style.display = 'block';
    notification.innerHTML = `<span>${message}</span>`;
    notification.style.backgroundColor = bgColor;
    notification.style.backdropFilter = 'blur(10px)';

    setTimeout(() => {
        notification.style.backgroundColor = 'rgba(110, 216, 23, 0.5)';
    }, 5000);

    setTimeout(() => {
        notification.style.display = 'none';
    }, 4999);
}

