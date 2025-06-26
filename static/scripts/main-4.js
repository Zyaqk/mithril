const urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get('id');
const payResult = document.getElementById('pay-result');
const paymentTitle = document.querySelector('.textImage h2');
const isHash = /^[a-f0-9]{64}$/.test(id);
if (!id || !isHash) {
    payResult.innerHTML = `
        <div class="pay-error">Платёж не найден или произошла ошибка.</div>
    `;
} else {
    payResult.innerHTML = `<div class="payment-title">Загрузка платежа...</div>`;
    fetch(`/api/shop/payment/by-any-id/${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.success && data.response) {
                const realId = data.response.id;
                if (paymentTitle && realId) {
                    paymentTitle.innerHTML = `ПЛАТЁЖ #${realId}`;
                }
            } else {
                payResult.innerHTML = `
                    <div class="pay-error">Платёж не найден или произошла ошибка.</div>
                `;
            }
        })
        .catch(err => {
            payResult.innerHTML = `
                <div class="pay-error">Ошибка запроса к API: ${err}</div>
            `;
        });
}

const statusText = (status) =>
    status == 2
        ? '<span style="background:#1d3321;color:#8fe382;padding:2px 12px;border-radius:5px;">Оплачен</span>'
        : '<span style="background:#2f1818;color:#ff6c6c;padding:2px 12px;border-radius:5px;">Не оплачен</span>';

const errorText = (err) =>
    (!err || err === 'Нет')
        ? '<span style="background:#1d3321;color:#8fe382;padding:2px 12px;border-radius:5px;">Нет</span>'
        : `<span style="background:#2f1818;color:#ff6c6c;padding:2px 12px;border-radius:5px;">${err}</span>`;

const yesNo = (val) =>
    val
        ? '<span style="background:#2f1818;color:#ff6c6c;padding:2px 12px;border-radius:5px;">Да</span>'
        : '<span style="background:#1d3321;color:#8fe382;padding:2px 12px;border-radius:5px;">Нет</span>';


if (!id || !isHash) {
    payResult.innerHTML = `
        <div class="pay-error">Платёж не найден или произошла ошибка.</div>
    `;
} else {
    payResult.innerHTML = `<div class="payment-title">Загрузка платежа...</div>`;
    fetch(`/api/shop/payment/by-any-id/${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.success && data.response) {
                const p = data.response;
                const commandsArr = (p.sent_commands && p.sent_commands.length) ? p.sent_commands.map(cmd => cmd.response) : [];
                const commandsCount = commandsArr.length;
                let prodHtml = '';
                if (Array.isArray(p.products) && p.products.length) {
                    const prod = p.products[0];
                    const imageUrl = prod.image 
                        ? `https://cdn.easydonate.ru/${prod.image.replace(/^\/+/, '')}` 
                        : '';
                    prodHtml = `
                        <h2 style="color:#83c916;">ТОВАР:</h2>
                        <ul class="payment-productinfo">
                            <li>Название: <span style="color: #fff">${prod.name || 'Нет'}</span>${imageUrl ? `<img src="${imageUrl}" alt="${prod.name}" style="max-width: 120px; border-radius: 5px; display:block; margin-top:6px;">` : ''}</li>
                            <li>Цена: <span style="color: #fff">${prod.price || 'Нет'} руб. за x1</span></li>
                            <li>Количество: <span style="color: #fff">${commandsCount}</span></li>
                            <li>Удален при первой покупке: ${yesNo(prod.first_delete)}</li>
                        </ul>
                    `;
                }
                payResult.innerHTML = `
                    <h2 style="color:#83c916;">ИНФОРМАЦИЯ:</h2>
                    <ul class="payment-userinfo">
                        <li>Покупатель: <span>${p.customer || 'Нет'}</span></li>
                        <li>Сумма: <span>${p.cost || 'Нет'} руб.</span></li>
                        <li>Статус: ${statusText(p.status)}</li>
                        <li>Платёжная система: <span>${p.payment_system || 'Нет'}</span></li>
                        <li>Создан: <span>${p.created_at || 'Нет'}</span></li>
                        <li>Обновлён: <span>${p.updated_at || 'Нет'}</span></li>
                        <li>Ошибки (если есть): ${errorText(p.error ? p.error : 'Нет')}</li>
                        <li style="display: flex; align-items: flex-start; flex-direction: column;">
                            Команды, отправленные после оплаты:
                            ${commandsArr.length 
                                ? commandsArr.map(cmd => `<div class="commands-block">${cmd}</div>`).join('') 
                                : '<div class="commands-block">—</div>'}
                        </li>
                    </ul>
                    ${prodHtml}
                `;
            } else {
                payResult.innerHTML = `
                    <div class="pay-error">Платёж не найден или произошла ошибка.</div>
                `;
            }
        })
        .catch(err => {
            payResult.innerHTML = `
                <div class="pay-error">Ошибка запроса к API: ${err}</div>
            `;
        });
}
