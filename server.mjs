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

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options, retries = 3, delay = 710) {
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
            headers: { 'Shop-Key': '9cd6e6cf7bbeec9a8e5672243f00ac6a' }
        });

        if (!data.response || !Array.isArray(data.response)) {
            return res.status(500).json({ success: false, error: 'Invalid data structure' });
        }

        const coupon = data.response.find(coupon => coupon.code === req.params.code);
        if (coupon) {
            res.json({ success: true, coupon });
        } else {
            res.status(404).json({ success: false, error: 'Coupon not found' });
        }
    } catch (error) {
        console.error('Error fetching coupon data:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch data' });
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
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});


app.get('/api/shop/payment/create', async (req, res) => {
    try {
        const { customer, products, coupon, email } = req.query;
        if (!customer || !products || !email) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const data = await fetchWithRetry(`https://easydonate.ru/api/v3/shop/payment/create?customer=${customer}&server_id=${process.env.SERVER_ID}&products=${products}&coupon=${coupon}&email=${email}&success_url=http://localhost:3000`, {
            method: 'GET',
            headers: { 'Shop-Key': shopKey }
        });
        res.json(data);
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
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
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.post('/', (req, res) => {
    res.sendStatus(200);
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});