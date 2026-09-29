const sampleProducts = [
    { id: 1, nome: 'Nike Air Max LTD 3 Azul-marinho', preco: 699.90, categoria: 'Nike', img: 'https://denimexchangeusa.com/cdn/shop/files/AURORA_687977-401_PHSRH001-2000.jpg?v=1744057027' },
    { id: 2, nome: 'Adidas Streetcheck', preco: 399.90, categoria: 'Adidas', img: 'https://imgcentauro-a.akamaihd.net/1366x1366/M0JSS101.jpg' },
    { id: 3, nome: 'Puma CA Pro Classic', preco: 449.90, categoria: 'Puma', img: 'https://cdn.shopify.com/s/files/1/0753/7914/7034/files/38937101_2l_600x600.jpg?v=1781872170' },
    { id: 4, nome: 'Nike Air Max LTD 3 Vermelho', preco: 749.90, categoria: 'Nike', img: 'https://images.stockx.com/images/Nike-Air-Max-LTD-3-Gym-Red.png?auto=compress&bg=FFFFFF&dpr=2&fit=fill&fm=webp&h=500&q=90&trim=color&updated_at=1626900198&w=700' },
    { id: 5, nome: 'Puma RBD Game Low', preco: 379.90, categoria: 'Puma', img: 'https://cdn.juuhu.at/dynimg/dQekSseUWb81eXKLEkEE5sOPiYZiWED_GFFZmTAtD4_J9OeU9Ptym4OOduz1S0Jaae4JQ8ZuSou2m2WZ-Y9kpY5oEHnwJU943ZU93UVazLWPQAeWW3krZI/4018377037_main.webp?h=630&w=1200' },
    { id: 6, nome: 'Adidas Grand Court', preco: 429.90, categoria: 'Adidas', img: 'https://imgcentauro-a.akamaihd.net/1366x1366/M0JSS101.jpg' }
];

const formProduto = document.getElementById('formProduto');
if (formProduto) {
    formProduto.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dados = {
            nome: document.getElementById('nomeProd').value,
            categoria: document.getElementById('categoria').value,
            preco: document.getElementById('preco').value
        };

        try {
            const res = await fetch('/api/produtos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            if (res.ok) {
                alert('Produto salvo!');
                formProduto.reset();
            } else {
                alert('Erro ao salvar produto');
            }
        } catch (err) {
            alert('Erro de rede');
        }
    });
}

const productsContainer = document.getElementById('products');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout');
const clearCartBtn = document.getElementById('clear-cart');
const openCartBtn = document.getElementById('open-cart');
const closeCartBtn = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart');
const cartCountEl = document.getElementById('cart-count');
const pixQrImg = document.getElementById('pix-qr');
const pixPayloadEl = document.getElementById('pix-payload');
const pixInstruction = document.getElementById('pix-instruction');
const copyPixBtn = document.getElementById('copy-pix');
const confirmPaymentBtn = document.getElementById('confirm-payment');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function formatBRL(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderProducts() {
    if (!productsContainer) return;
    productsContainer.innerHTML = sampleProducts.map(p => `
        <article class="card">
            <img src="${p.img}" alt="${p.nome}" onerror="this.onerror=null;this.src='https://cdn.shopify.com/s/files/1/0753/7914/7034/files/38937101_2l_600x600.jpg?v=1781872170';">
            <span class="brand-tag">${p.categoria}</span>
            <h3>${p.nome}</h3>
            <p class="price">${formatBRL(p.preco)}</p>
            <button class="add-btn" data-id="${p.id}">Adicionar ao carrinho</button>
        </article>
    `).join('');
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', () => addToCart(Number(btn.dataset.id)));
    });
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(id) {
    const prod = sampleProducts.find(p => p.id === id);
    if (!prod) return;
    const item = cart.find(i => i.id === id);
    if (item) item.qty++;
    else cart.push({ id: prod.id, nome: prod.nome, preco: prod.preco, qty: 1 });
    saveCart();
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty < 1) removeFromCart(id);
    else {
        saveCart();
        renderCart();
    }
}

function renderCart() {
    if (!cartItemsContainer) return;
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>O carrinho está vazio.</p>';
        cartTotalEl.textContent = formatBRL(0);
        if (cartCountEl) cartCountEl.textContent = '0';
        hidePix();
        return;
    }

    cartItemsContainer.innerHTML = cart.map(i => `
        <div class="cart-item">
            <div class="cart-item-info">
                <strong>${i.nome}</strong>
                <small>${formatBRL(i.preco)} cada</small>
            </div>
            <div class="cart-item-actions">
                <button class="qty" data-id="${i.id}" data-delta="-1">−</button>
                <span class="qty-num">${i.qty}</span>
                <button class="qty" data-id="${i.id}" data-delta="1">+</button>
                <button class="remove" data-id="${i.id}">Remover</button>
            </div>
        </div>
    `).join('');

    cartItemsContainer.querySelectorAll('.remove').forEach(b => b.addEventListener('click', () => removeFromCart(Number(b.dataset.id))));
    cartItemsContainer.querySelectorAll('.qty').forEach(b => b.addEventListener('click', () => changeQty(Number(b.dataset.id), Number(b.dataset.delta))));

    const total = cart.reduce((s, i) => s + i.preco * i.qty, 0);
    cartTotalEl.textContent = formatBRL(total);
    if (cartCountEl) cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0);
    renderPixSection(total);
}

function showCart() { if (cartSidebar) cartSidebar.classList.add('cart-visible'); }
function hideCart() { if (cartSidebar) cartSidebar.classList.remove('cart-visible'); }

if (openCartBtn) openCartBtn.addEventListener('click', () => showCart());
if (closeCartBtn) closeCartBtn.addEventListener('click', () => hideCart());

function formatTLV(id, value) {
    const v = String(value);
    const len = v.length.toString().padStart(2, '0');
    return `${id}${len}${v}`;
}

function computeCRC16(payload) {
    let crc = 0xffff;
    for (let i = 0; i < payload.length; i++) {
        crc ^= payload.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) crc = ((crc << 1) ^ 0x1021) & 0xffff;
            else crc = (crc << 1) & 0xffff;
        }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

function buildPixPayload({ chave, nome, cidade, valor, txid = '***' }) {
    const cleanNome = String(nome).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().slice(0, 25);
    const cleanCidade = String(cidade).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().slice(0, 15);
    const cleanChave = String(chave).trim();
    const valorStr = valor ? Number(valor).toFixed(2) : '';

    const merchantAccountInfo = formatTLV('00', 'br.gov.bcb.pix') + formatTLV('01', cleanChave);
    let payload = '';
    payload += formatTLV('00', '01');
    payload += formatTLV('26', merchantAccountInfo);
    payload += formatTLV('52', '0000');
    payload += formatTLV('53', '986');
    if (valorStr) payload += formatTLV('54', valorStr);
    payload += formatTLV('58', 'BR');
    payload += formatTLV('59', cleanNome);
    payload += formatTLV('60', cleanCidade);
    payload += formatTLV('62', formatTLV('05', txid));
    payload += '6304';

    const crc = computeCRC16(payload);
    return payload + crc;
}

function renderPixSection(total) {
    const merchant = { chave: '14999025284', nome: 'CASA DE CONSTRUÇÃO', cidade: 'Agudos' };
    if (!total || total <= 0) { hidePix(); return; }
    const payload = buildPixPayload({ chave: merchant.chave, nome: merchant.nome, cidade: merchant.cidade, valor: total });
    if (pixQrImg) {
        pixQrImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(payload);
        pixQrImg.style.display = 'block';
    }
    if (pixPayloadEl) { pixPayloadEl.value = payload; pixPayloadEl.style.display = 'block'; }
    if (copyPixBtn) { copyPixBtn.style.display = 'inline-block'; copyPixBtn.onclick = () => { navigator.clipboard.writeText(payload); alert('PIX copiado!'); }; }
    if (pixInstruction) pixInstruction.style.display = 'none';
}

function hidePix() {
    if (pixQrImg) pixQrImg.style.display = 'none';
    if (pixPayloadEl) { pixPayloadEl.style.display = 'none'; pixPayloadEl.value = ''; }
    if (copyPixBtn) copyPixBtn.style.display = 'none';
    if (pixInstruction) pixInstruction.style.display = 'block';
}

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return alert('Carrinho vazio');
        showCart();
        renderCart();
        alert('Gere o PIX abaixo (QR ou copiar). Após pagar no seu app bancário, clique em "Confirmar Pagamento" para finalizar a compra.');
    });
}

function confirmPayment(payload) {
    cart = [];
    saveCart();
    renderCart();
    hideCart();
    hidePix();
    alert('Pagamento confirmado. Compra finalizada. Obrigado!');
}

if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener('click', () => {
        confirmPayment(pixPayloadEl ? pixPayloadEl.value : null);
    });
}

if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        cart = [];
        saveCart();
        renderCart();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCart();
});
