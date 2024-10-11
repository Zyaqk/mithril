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
                80273: { name: 'ЛОРД', minPrice: Infinity, maxPrice: -Infinity },
                80274: { name: 'КОРОЛЬ', minPrice: Infinity, maxPrice: -Infinity },
                80275: { name: 'ИМПЕРАТОР', minPrice: Infinity, maxPrice: -Infinity },
                80281: { name: 'ФРИЛЫ', minPrice: Infinity, maxPrice: -Infinity },
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
        80273, // ЛОРД
        80274, // КОРОЛЬ
        80275, // ИМПЕРАТОР
        80281  // ФРИЛЫ
    ];

    // Объект с изображениями категорий
    const categoryImages = {
        80273: 'images/lord.png',
        80274: 'images/king.png',
        80275: 'images/emperor.png',
        80281: 'images/frills.png'
    };

    // Объект с цветами фона для категорий
    const categoryColors = {
        80273: '#eb7e35', // ЛОРД
        80274: '#fdc357', // КОРОЛЬ
        80275: '#fb4b42', // ИМПЕРАТОР
        80281: '#97ee7a'  // ФРИЛЫ
    };

    sortedCategoryIds.forEach(id => {
        const category = categories[id];
        if (category.minPrice !== Infinity) {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'itemCategorie';

            // Устанавливаем цвет фона для категории
            categoryItem.style.backgroundColor = categoryColors[id];

            categoryItem.innerHTML = `
                <img src="${categoryImages[id]}" alt="${category.name}"> 
                <div class="descriptionCategorie">
                    <h1>${category.name}</h1>
                </div>
                <button onclick="handleButtonClick(${id})"><i class="fa-solid fa-cart-shopping"></i>ОТ ${category.minPrice} ДО ${category.maxPrice} руб.</button>
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

    if (filteredProducts.length > 0) {
        filteredProducts.forEach(product => {
            const itemTerm = document.createElement('div');
            itemTerm.className = 'itemTerm';

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

    fetch(`/api/shop/payment/create?customer=${nickname}&server_id=92777&products={"${id}" :1}&email=${mail}&coupon=${coupon}&success_url=http://localhost:3000`)
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