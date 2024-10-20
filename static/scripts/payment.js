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
        80660, // ШАРЫ ТОЧЕЧНЫЕ
        80661  // ШАРЫ ПОЛОСАТЫЕ
    ];

    const categoryImages = {
        80286: 'images/lord.png',
        80287: 'images/king.png',
        80288: 'images/emperor.png',
        80289: 'images/frills.png',
        80543: 'images/kits.png',
        80660: 'images/dotballs.png',
        80661: 'images/stripedballs.png'
    };

    const categoryColors = {
        80286: '#f1ddca', // ЛОРД
        80287: '#f1ddca', // КОРОЛЬ
        80288: '#f1ddca', // ИМПЕРАТОР
        80289: '#f1ddca', // ФРИЛЫ
        80543: '#f1ddca', // НАБОРЫ
        80660: '#f1ddca', // ШАРЫ ТОЧЕЧНЫЕ
        80661: '#f1ddca'  // ШАРЫ ПОЛОСАТЫЕ
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
    const inputNickname = document.getElementById('inputNickname').value;
    const inputMail = document.getElementById('inputMail').value;
    const notification = document.getElementById('notification');

    if (inputNickname == "") {
        notification.style.display = 'block';
        notification.style.backgroundColor = 'red';
        notification.innerHTML = '<span>ДОБАВЬТЕ СВОЙ НИКНЕЙМ!</span>'
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
        setTimeout(() => {
            notification.style.backgroundColor = '#16a34a';
        }, 3000);
    } else if (inputMail == "") {
        notification.style.display = 'block';
        notification.style.backgroundColor = 'red';
        notification.innerHTML = '<span>ДОБАВЬТЕ СВОЮ ПОЧТУ!</span>'
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
        setTimeout(() => {
            notification.style.backgroundColor = '#16a34a';
        }, 3000);
    } else {
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
        80660: '#f1ddca', // ШАРЫ ТОЧЕЧНЫЕ
        80661: '#f1ddca'  // ШАРЫ ПОЛОСАТЫЕ
    };

    const infoTermText = {
        80286: 'Выберете срок действия:', // ЛОРД 
        80287: 'Выберете срок действия:', // КОРОЛЬ
        80288: 'Выберете срок действия:', // ИМПЕРАТОР
        80289: 'Выберете сумму:',         // ФРИЛЫ 
        80543: 'Выберете набор:',         // НАБОРЫ
        80660: 'Выберете шар:',           // ШАРЫ ТОЧЕЧНЫЕ
        80661: 'Выберете шар:'            // ШАРЫ ПОЛОСАТЫЕ
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
            
            if (product.category_id === 80543) {
                itemTerm.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <button onclick="buyProduct(${product.id})">${product.price} руб.</button>
                    <button id="infoProduct" onclick="infoProduct(${product.id})">
                        <i class="fa-solid fa-circle-question"></i>
                    </button>
                `;
            } else if (product.category_id === 80288) {
                itemTerm.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <button onclick="buyProduct(${product.id})">${product.price} руб.</button>
                    <button id="infoProduct" onclick="infoProduct(${product.id})">
                        <i class="fa-solid fa-circle-question"></i>
                    </button>
                `;
            } else if (product.category_id === 80287) {
                itemTerm.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <button onclick="buyProduct(${product.id})">${product.price} руб.</button>
                    <button id="infoProduct" onclick="infoProduct(${product.id})">
                        <i class="fa-solid fa-circle-question"></i>
                    </button>
                `;
            } else if (product.category_id === 80286) {
                itemTerm.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <button onclick="buyProduct(${product.id})">${product.price} руб.</button>
                    <button id="infoProduct" onclick="infoProduct(${product.id})">
                        <i class="fa-solid fa-circle-question"></i>
                    </button>
                `;
            } else {
                itemTerm.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <button onclick="buyProduct(${product.id})">${product.price} руб.</button>
                `;
            }

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
});


function buyProduct(id) {
    const nickname = document.getElementById('inputNickname').value.trim();
    const mail = document.getElementById('inputMail').value.trim();
    const coupon = document.getElementById('inputCoupon').value.trim();
    const notification = document.getElementById('notification');

    fetch(`/api/shop/payment/create?customer=${nickname}&server_id=92777&products={"${id}" :1}&email=${mail}&coupon=${coupon}&success_url=https://mithril.fun`)
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