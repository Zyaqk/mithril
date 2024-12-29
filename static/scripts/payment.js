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
        80543, // НАБОРЫ
        82100, // ЧАНКИ
        81852, // КОМПАНЬОНЫ КУБЫ
        82215, // КОСМЕТИКА КЛАССЫ
        82216, // КОСМЕТИКА РАЗНОЕ
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
        82216: 'images/cosmeticOther.png'
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
        82216: '#f1ddca'  // КОСМЕТИКА РАЗНОЕ
    };

    sortedCategoryIds.forEach(id => {
        const category = categories[id];
        if (category.minPrice !== Infinity) {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'itemCategorie';

            categoryItem.style.backgroundColor = categoryColors[id];

            const priceText = category.minPrice === category.maxPrice 
                ? `ДО ${category.maxPrice} руб.` 
                : `ОТ ${category.minPrice} ДО ${category.maxPrice} руб.`;
            // <span class="CategorieSales">СКИДКА 50%</span>
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
        document.getElementById('termDonate').style.display = 'block';
}


document.getElementById('closeNickname').addEventListener('click', function() {
    document.getElementById('nicknameWindown').style.display = 'none';
});


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
        82216: '#f1ddca'  // КОСМЕТИКА РАЗНОЕ
    };

    const infoTermText = {
        80286: 'Выберите срок действия:',     // ЛОРД 
        80287: 'Выберите срок действия:',     // КОРОЛЬ
        80288: 'Выберите срок действия:',     // ИМПЕРАТОР
        80289: 'Выберите сумму:',             // ФРИЛЫ 
        80543: 'Выберите набор:',             // НАБОРЫ
        82100: 'Выберите количество чанков:', // ЧАНКИ
        81852: 'Выберите компаньон куба:',    // КОМПАНЬОНЫ КУБЫ
        82215: 'Выберите косметику класса:',  // КОСМЕТИКА КЛАССЫ
        82216: 'Выберите косметику:'          // КОСМЕТИКА РАЗНОЕ
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
                itemTerm.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <button onclick="buyProduct(${product.id})">${product.price} руб.</button>
                `;

            termList.appendChild(itemTerm);
        });
    } else {
        termList.innerHTML = '<p>Нет товаров в этой категории.</p>';
    }
}

function infoProduct(productId) {
    const descriptionBlock = document.getElementById('descriptionProduct');
    const closeDescriptionBtn = document.getElementById('closeDesProduct');
    const descriptionContent = document.getElementById('descriptProduct');
    descriptionContent.innerHTML = '';
    fetch(`/api/shop/products`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const product = data.response.find(item => item.id === productId);
                if (product) {
                    if (product.description) {
                        const descriptionHtml = product.description
                            .split(/[\r\n]+/)
                            .map(line => `<p>${line.trim()}</p>`)
                            .join('');
                        descriptionContent.innerHTML = descriptionHtml;
                    } else {
                        descriptionContent.innerHTML = 'Описание отсутствует.';
                    }
                } else {
                    descriptionContent.innerHTML = 'Товар не найден.';
                }
            } else {
                console.error(data.error);
            }
        })
        .catch(error => {
            console.error('Ошибка при получении товаров:', error);
        });
    descriptionBlock.style.display = 'block';

    closeDescriptionBtn.addEventListener('click', function () {
        descriptionBlock.style.display = 'none';
    });
}


document.getElementById('closeTerm').addEventListener('click', function() {
    document.getElementById('termDonate').style.display = 'none';
    const termList = document.getElementById('termList');
    termList.innerHTML = '';
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

    fetch('/api/shop/payments')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const payments = data.response;
            const listPayment = document.getElementById("listPurchases");

            function shortenText(text, maxLength) {
                return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
            }

            function formatDateTime(dateTime) {
                const date = new Date(dateTime);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${day}/${month}/${year} ${hours}:${minutes}`;
            }

            const productNamesMap = {
                833204: "ЛОРД 1д",
                833211: "ЛОРД 1н",
                651154: "ЛОРД",
                833208: "КОРОЛЬ 1д",
                833215: "КОРОЛЬ 1н",
                651269: "КОРОЛЬ",
                651274: "ИМПЕРАТОР"
            };

            payments.forEach(payment => {
                const products = payment.products;
                products.forEach(product => {
                    const productName = productNamesMap[product.product_id] || shortenText(product.name, 10);

                    const formattedDate = formatDateTime(payment.updated_at);

                    const itemHTML = `
                        <div class="lastPurchasesItem">
                            <div class="PurchasesOne">
                                <img src="https://mineskin.eu/helm/${payment.customer}">
                            </div>
                            <div class="PurchasesTwo">
                                <ul>
                                    <li>${payment.customer}</li>
                                    <li class="purchasesdonate">${productName}</li>
                                    <li class="purchasestime">${formattedDate}</li>
                                </ul>
                            </div>
                        </div>
                    `;
                    listPayment.insertAdjacentHTML('beforeend', itemHTML);
                });
            });
        } else {
            console.error(data);
        }
    });
});


function buyProduct(id) {
    const inputNickname = document.getElementById('inputNickname').value;
    const inputMail = document.getElementById('inputMail').value;
    const nicknameWindow = document.querySelector('.nicknameWindown');
    const mailWindow = document.querySelector('.mailWindown');
    if (inputNickname == "") {
        nicknameWindow.style.display = 'block';
        requestAnimationFrame(() => {
            nicknameWindow.style.opacity = 1;
            nicknameWindow.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    } else if (inputMail == "") {
        mailWindow.style.display = 'block';
        requestAnimationFrame(() => {
            mailWindow.style.opacity = 1;
            mailWindow.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    } else {
        const nickname = document.getElementById('inputNickname').value.trim();
        const mail = document.getElementById('inputMail').value.trim();
        const coupon = document.getElementById('inputCoupon').value.trim();
        const notification = document.getElementById('notification');
    
        fetch(`/api/shop/payment/create?customer=${nickname}&server_id=82480&products={"${id}" :1}&email=${mail}&coupon=${coupon}&success_url=https://mithril.fun`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    notification.style.display = 'block';
                    notification.innerHTML = '<span>ПЕРЕХОД К ОПЛАТЕ</span>'
                    setTimeout(() => {
                        notification.style.display = 'none';
                    }, 1100)
                    window.location = data.response.url;
                } else {
                    notification.style.display = 'block';
                    notification.innerHTML = '<span>ПОКУПКИ СЕЙЧАС НЕВОЗМОЖНЫ!</span>'
                    notification.style.backgroundColor = 'red';
                    setTimeout(() => {
                        notification.style.display = 'none';
                    }, 1500)
                    setTimeout(() => {
                        notification.style.backgroundColor = '#16a34a';
                    }, 2000)
                }
            })
            .catch(error => {
                console.error(error)
            })
    }
}