import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import NodeCache from 'node-cache';
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;
const shopKey = process.env.SHOP_KEY;

const apiCache = new NodeCache({ stdTTL: 300 });

app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/donate', (req, res) => {
    res.sendFile(path.join(__dirname, 'donate.html'));
});

app.get('/guides', (req, res) => {
    res.sendFile(path.join(__dirname, 'guides.html'));
});

app.get('/vk', (req, res) => {
    res.redirect('https://vk.com/mithril995');
});

app.get('/dsc', (req, res) => {
    res.redirect('https://discord.gg/EHVqbmRkYf');
});

app.get('/tg', (req, res) => {
    res.redirect('https://t.me/mithril995');
})

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options, retries = 3, delayMs = 1080) {
    let attempt = 0;
    while (attempt < retries) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            attempt++;
            console.error(`Попытка ${attempt} не удалась:`, error);
            if (attempt === retries) throw error;
            await delay(delayMs);
        }
    }
}

async function fetchWithCache(url, options) {
    const cachedData = apiCache.get(url);
    if (cachedData) {
        return cachedData;
    }

    const data = await fetchWithRetry(url, options);
    apiCache.set(url, data);
    return data;
}

let lastFetchTime = 0;

app.use(async (req, res, next) => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTime;

    if (timeSinceLastFetch < 2000) {
        await delay(2000 - timeSinceLastFetch);
    }

    lastFetchTime = Date.now();
    next();
});

app.get('/api/shop/coupon/:code', async (req, res) => {
    try {
        const data = await fetchWithCache('https://easydonate.ru/api/v3/shop/coupons?where_active=true', {
            method: 'GET',
            headers: { 'Shop-Key': shopKey }
        });

        if (!data.response || !Array.isArray(data.response)) {
            return res.status(500).json({ success: false, error: 'Неверная структура данных' });
        }

        const coupon = data.response.find(coupon => coupon.code === req.params.code);
        if (coupon) {
            const { 
                id, 
                expires_at, 
                limit, 
                shop_id, 
                created_at, updated_at, products, uses, ...filteredCoupon 
            } = coupon;
            res.json({ success: true, coupon: filteredCoupon });
        } else {
            res.status(404).json({ success: false, error: 'Такого купона в магазине не существует' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Ошибка получения данных с API' });
    }
});

app.get('/api/shop/products', async (req, res) => {
    try {
        const apiResponse = await fetchWithCache('https://easydonate.ru/api/v3/shop/products', {
            method: 'GET',
            headers: { 'Shop-Key': shopKey }
        });

        if (apiResponse.success && Array.isArray(apiResponse.response)) {
            apiResponse.response = apiResponse.response.map(product => {
                const {
                    old_price,
                    type,
                    number,
                    is_hidden,
                    additional_fields,
                    description,
                    first_delete,
                    shop_id,
                    group_id,
                    created_at,
                    updated_at,
                    sort_index,
                    servers,
                    ...rest
                } = product;
                return rest;
            });
        }
        res.json(apiResponse);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения данных с API' });
    }
});

app.get('/api/shop/custommessages', async (req, res) => {
    try {
        const data = await fetchWithCache('https://easydonate.ru/api/v3/plugin/EasyDonate.CustomMessages/getSettings', {
            method: 'GET',
            headers: { 'Shop-Key': shopKey }
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения данных с API' });
    }
});

app.get('/api/shop/payments', async (req, res) => {
    try {
        const data = await fetchWithRetry('https://easydonate.ru/api/v3/plugin/EasyDonate.LastPayments/getPayments', {
            method: 'GET',
            headers: { 'Shop-Key': shopKey }
        });

        if (data.success && Array.isArray(data.response)) {
            const formatDate = (dateStr) => {
                const date = new Date(dateStr);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${month}/${day}/${year} ${hours}:${minutes}`;
            };

            const truncateName = (name) => {
                return name.length > 10 ? name.slice(0, 10) + '...' : name;
            };

            const filteredPayments = data.response.map(payment => ({
                created_at: formatDate(payment.created_at),
                customer: payment.customer,
                paid_at: formatDate(payment.updated_at),
                products: payment.products.map(product => ({
                    name: truncateName(product.name)
                }))
            }));

            res.json({ success: true, response: filteredPayments });
        } else {
            res.status(500).json({ error: 'Unexpected data format' });
        }
    } catch (error) {
        console.error('Ошибка получения данных:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/api/shop/payment/create', async (req, res) => {
    try {
        const { customer, products, coupon, email } = req.query;
        if (!customer || !products || !email) {
            return res.status(400).json({ error: 'Неверные параметры для создание оплаты.' });
        }

        const data = await fetchWithCache(`https://easydonate.ru/api/v3/shop/payment/create?customer=${customer}&server_id=${process.env.SERVER_ID}&products=${products}&coupon=${coupon}&email=${email}&success_url=https://mithril.fun`, {
            method: 'GET',
            headers: { 'Shop-Key': shopKey }
        });

        if (data.success && data.response) {
            res.json({ success: true, url: data.response.url });
        } else {
            res.status(500).json({ error: 'Ошибка создания оплаты.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения данных с API' });
    }
});

app.post('/', (req, res) => {
    res.sendStatus(200);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});