import express, { response } from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;
const shopKey = process.env.SHOP_KEY;

app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/donate', (req, res) => {
    res.sendFile(path.join(__dirname, 'donate.html'));
});

app.get('/vk', (req, res) => {
    res.redirect('https://vk.com/mithril995');
});

app.get('/dsc', (req, res) => {
    res.redirect('https://discord.gg/EHVqbmRkYf');
});


async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options, retries = 3, delay = 680) {
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
            await new Promise(res => setTimeout(res, delay));
        }
    }
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
        const data = await fetchWithRetry(`https://easydonate.ru/api/v3/shop/coupons?where_active=true`, {
            method: 'GET',
            headers: { 'Shop-Key': shopKey }
        });

        if (!data.response || !Array.isArray(data.response)) {
            return res.status(500).json({ success: false, error: 'Неверная структура данных' });
        }

        const coupon = data.response.find(coupon => coupon.code === req.params.code);
        if (coupon) {
            res.json({ success: true, coupon });
        } else {
            res.status(404).json({ success: false, error: 'Такого купона в магазине не существует' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Ошибка получение данных с API' });
    }
});


app.get('/api/shop/products', async (req, res) => {
    try {
        const data = await fetchWithRetry('https://easydonate.ru/api/v3/shop/products', {
            method: 'GET',
            headers: { 'Shop-Key': shopKey }
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получение данных с API' });
    }
});


app.get('/api/shop/custommessages', async (req, res) => {
    try {
        const data = await fetchWithRetry('https://easydonate.ru/api/v3/plugin/EasyDonate.CustomMessages/getSettings', {
            method: 'GET',
            headers: { 'Shop-Key': shopKey }
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получение данных с API' });
    }
});


app.get('/api/shop/payments', async (req, res) => {
    try {
        const data = await fetchWithRetry('https://easydonate.ru/api/v3/shop/payments', {
            method: 'GET',
            headers: { 'Shop-Key': shopKey }
        });
        if (data.success && Array.isArray(data.response)) {
            const lastTenPayments = data.response.slice(-6);
            res.json({ success: true, response: lastTenPayments });
        } else {
            res.status(500).json({ error: 'Ошибка получение данных с API' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получение данных с API' });
    }
});


app.get('/api/shop/payment/create', async (req, res) => {
    try {
        const { customer, products, coupon, email } = req.query;
        if (!customer || !products || !email) {
            return res.status(400).json({ error: 'Неверные параметры для создание оплаты.' });
        }

        const data = await fetchWithRetry(`https://easydonate.ru/api/v3/shop/payment/create?customer=${customer}&server_id=${process.env.SERVER_ID}&products=${products}&coupon=${coupon}&email=${email}&success_url=https://mithril.fun`, {
            method: 'GET',
            headers: { 'Shop-Key': shopKey }
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получение данных с API' });
    }
});


app.get('/api/shop/payment/:id', async (req, res) => {
    try {
        const { customer, products, coupon } = req.query;
        if (!customer || !products) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }
        const data = await fetchWithRetry(`https://easydonate.ru/api/v3/shop/payment/{id}`, {
            method: 'GET',
            headers: { 'Shop-Key': shopKey }
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получение данных с API' });
    }
});


app.get('/api/shop/massSales', async (req, res) => {
    try {
        const whereActive = req.query.where_active || 'true';
        const url = `https://easydonate.ru/api/v3/shop/massSales?where_active=${whereActive}`;
        console.log('Fetching data from:', url);
        const data = await fetchWithRetry(url, {
            method: 'GET',
            headers: { 'Shop-Key': shopKey }
        });
        console.log('Fetched data:', data);
        const allProducts = data.response.flatMap(sale => sale.products);
        console.log('All products:', allProducts);
        res.json(allProducts);
    } catch (error) {
        console.error('Error fetching mass sales data:', error);
        res.status(500).json({ error: 'Ошибка получения данных с API' });
    }
});


app.post('/', (req, res) => {
    res.sendStatus(200);
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});