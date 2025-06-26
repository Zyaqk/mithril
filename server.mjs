import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import nodemailer from 'nodemailer';
import * as fs from 'fs/promises';
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

const HASH_DB_PATH = path.join(__dirname, 'payment-hashes.json');

async function getHashMappings() {
    try {
        const content = await fs.readFile(HASH_DB_PATH, 'utf8');
        return JSON.parse(content);
    } catch {
        return {};
    }
}

async function saveHashMappings(mappings) {
    await fs.writeFile(HASH_DB_PATH, JSON.stringify(mappings, null, 2), 'utf8');
}

async function addPaymentHash(id, hash) {
    const mappings = await getHashMappings();
    mappings[id] = hash;
    mappings[hash] = id;
    await saveHashMappings(mappings);
}

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

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'payment.html'));
});

app.get('/payment-hashes.json', (req, res) => {
    res.status(403).send('Access denied');
});

app.use((req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/payment')) {
        return next();
    } else {
        res.status(404).sendFile(path.join(__dirname, '404.html'));
    }
});

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
                if (!dateStr) return '-';
                const date = new Date(dateStr);
                if (isNaN(date)) return '-';
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${month}/${day}/${year} ${hours}:${minutes}`;
            };

            const truncateName = (name) => {
                if (typeof name !== 'string') return '';
                return name.length > 10 ? name.slice(0, 10) + '...' : name;
            };

            const filteredPayments = data.response.map(payment => ({
                id: payment.id,
                created_at: formatDate(payment.created_at),
                customer: payment.customer || '-',
                paid_at: formatDate(payment.updated_at),
                products: Array.isArray(payment.products)
                    ? payment.products.map(product => ({
                        name: truncateName(product.name || '')
                    }))
                    : [],
                sent_commands: Array.isArray(payment.sent_commands) ? payment.sent_commands : []
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
      return res.status(400).json({ error: 'Неверные параметры для создания оплаты.' });
    }

    const apiUrl = `https://easydonate.ru/api/v3/shop/payment/create?customer=${customer}&server_id=${process.env.SERVER_ID}&products=${products}&coupon=${coupon}&email=a.bcdf@gmail.com&success_url=https://mithril.fun`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Shop-Key': shopKey }
    });

    const data = await response.json();

    if (data.success && data.response?.payment?.id) {
      const payment = data.response.payment;
      const paymentId = payment.id;
      const productId = payment.products?.[0]?.product_id;
      const paymentUrl = data.response.url;
      const hash = data.response.payment.hash;

      await fs.mkdir('./payment_hashes', { recursive: true });
      await fs.writeFile(`./payment_hashes/${paymentId}.txt`, hash);

      await sendPaymentEmail(email, paymentId, productId, hash);

      fetch(`https://mithril.fun/api/shop/payment/by-any-id/${paymentId}?force=true`).catch(console.error);

      return res.json({ success: true, url: paymentUrl });
    } else {
      return res.status(500).json({ error: 'Ошибка создания оплаты.' });
    }
  } catch (error) {
    console.error('Ошибка при создании оплаты:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера.' });
  }
});

const sendPaymentEmail = async (toEmail, paymentId, productId, hash) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const hashUrl = `https://mithril.fun/payment?id=${hash}`;

  const mailOptions = {
    from: {
      name: 'MITHRIL.FUN',
      address: process.env.EMAIL_USER
    },
    to: toEmail,
    subject: `Детали платежа #${paymentId}`,
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 40px auto; background-color: #f9f9f9; color: #222222; border-radius: 8px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);">
        <div style="padding: 20px 20px 10px 20px; position: relative;">
        <img src="https://mithril.fun/images/icon.png" alt="Mithril Icon" width="48" height="48" style="position: absolute; top: 12px; right: 12px; border-radius: 6px;" />
        <div style="position: absolute; top: 12px; right: 70px; font-size: 12px; color: #888;">#${paymentId}</div>
        <h2 style="color: #222222; font-size: 22px; margin: 0 0 10px;">Здравствуйте!</h2>
        <p style="font-size: 15px; color: #333333; margin: 0 0 8px;">Вы создали платёж на нашем сайте <strong style="color: #000000;">MITHRIL.FUN</strong>.</p>
        <p style="font-size: 15px; color: #333333; margin: 0 0 14px;">Для просмотра деталей платежа перейдите по ссылке ниже:</p>
        <a href="${hashUrl}" target="_blank" style="color: #83c916; word-break: break-word; font-size: 14px;">${hashUrl}</a>
        <p style="font-size: 14px; color: #666666; margin-top: 20px;">Если ссылка больше не действительна, нажмите на кнопку ниже для разблокировки доступа:</p>
        <div style="text-align: center; margin-top: 12px; margin-bottom: 12px;">
            <a href="https://mithril.fun/api/shop/payment/unlock/${paymentId}" target="_blank" style="background-color: #83c916; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-size: 14px;">РАЗБЛОКИРОВАТЬ ПЛАТЁЖ</a>
        </div>
        </div>
        <div style="background-color: #eeeeee; padding: 16px; text-align: center; font-size: 13px; color: #666666; border-top: 1px solid #dddddd;">
        <p style="margin-bottom: 10px;">Наши социальные сети:</p>
        <a href="https://mithril.fun/tg" style="margin: 0 8px; color: #83c916;">Телеграм канал</a>
        |
        <a href="https://mithril.fun//dsc" style="margin: 0 8px; color: #83c916;">Дискорд</a>
        |
        <a href="https://mithril.fun/vk" style="margin: 0 8px; color: #83c916;">ВКонтакте</a>
        </div>
    </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Письмо отправленно!')
  } catch (err) {
    console.error('Ошибка отправки письма:', err);
  }
};


app.get('/api/shop/payment/:id', async (req, res) => {
    const paymentId = req.params.id;
    if (!paymentId) {
        return res.status(400).json({ error: 'Не указан ID платежа' });
    }
    try {
        const data = await fetchWithRetry(
            `https://easydonate.ru/api/v3/shop/payment/${paymentId}`,
            {
                method: 'GET',
                headers: { 'Shop-Key': shopKey }
            }
        );
        if (data?.success && data?.response?.hash) {
            await addPaymentHash(paymentId, data.response.hash);
        }
        res.json(data);
    } catch (error) {
        console.error('Ошибка получения данных о платеже:', error);
        res.status(500).json({ error: 'Ошибка получения информации о платеже' });
    }
});

app.get('/api/shop/payment/unlock/:id', async (req, res) => {
  const paymentId = req.params.id;
  try {
    const data = await fetchWithRetry(`https://easydonate.ru/api/v3/shop/payment/${paymentId}`, {
      method: 'GET',
      headers: { 'Shop-Key': shopKey }
    });

    if (data?.success && data?.response?.hash) {
      await addPaymentHash(paymentId, data.response.hash);
      return res.send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Разблокировано</title>
            <style>
              body {
                background-color: #f9f9f9;
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
              }
              .message {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                text-align: center;
              }
              .message h1 {
                color: #4caf50;
                font-size: 20px;
                margin-bottom: 10px;
              }
              .message p {
                color: #555;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="message">
              <h1>Ссылка успешно разблокирована</h1>
              <p>Вы можете закрыть эту вкладку.</p>
            </div>
          </body>
        </html>
      `);
    } else {
      return res.status(404).send(`<h2>Не удалось разблокировать ссылку.</h2>`);
    }
  } catch (err) {
    console.error('Ошибка при восстановлении связи:', err);
    return res.status(500).send(`<h2>Внутренняя ошибка сервера.</h2>`);
  }
});

app.get('/api/shop/payment/by-any-id/:any', async (req, res) => {
    const any = req.params.any;
    let id = any;

    if (/^[a-f0-9]{64}$/.test(any)) {
        const mappings = await getHashMappings();
        if (mappings[any]) {
            id = mappings[any];
        } else {
            return res.status(404).json({ error: 'Платёж не найден (hash)' });
        }
    }

    try {
        let data;
        if (req.query.force) {
            data = await fetchWithRetry(
                `https://easydonate.ru/api/v3/shop/payment/${id}`,
                {
                    method: 'GET',
                    headers: { 'Shop-Key': shopKey }
                }
            );
        } else {
            data = await fetchWithCache(
                `https://easydonate.ru/api/v3/shop/payment/${id}`,
                {
                    method: 'GET',
                    headers: { 'Shop-Key': shopKey }
                }
            );
        }
        if (data?.success && data?.response?.hash) {
            await addPaymentHash(id, data.response.hash);
        }
        res.json(data);
    } catch (error) {
        console.error('Ошибка получения данных о платеже:', error);
        res.status(500).json({ error: 'Ошибка получения информации о платеже' });
    }
});


app.post('/', (req, res) => {
    res.sendStatus(200);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});