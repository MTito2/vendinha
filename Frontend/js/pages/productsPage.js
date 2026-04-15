import { getProducts } from '../api/productApi.js';
const productsContainer = document.getElementById('products-container');
const btnNext = document.getElementById('btn-next');
let qtdProducts = 0;

// Formatar o preço para o formato brasileiro (R$ 10,00)
let response = await getProducts();
let products = response;
const formattedProducts = products.map(product => {
    return {
        ...product,
        price: product.price.toFixed(2).replace('.', ',')
    };
});

// Criar os cards dos produtos e adicioná-los ao container
for (let product of formattedProducts) {
    const productCard = createProductCard(product);
    productsContainer.appendChild(productCard);
}

// Adicionar eventos aos botões de adicionar e subtrair quantidade
const btnProducts = document.querySelectorAll('.btn-product'); 
for (let btn of btnProducts) {
    btn.addEventListener('click', (e) => { 
        const action = e.target.dataset.action;
        const qtdElement = e.target.parentElement.querySelector('.qtd');

        const qtd = action === 'add'
            ? parseInt(qtdElement.textContent) + 1
            : Math.max(0, parseInt(qtdElement.textContent) - 1);

        qtdElement.textContent = qtd;

        // Atualizar o texto do botão "Continuar" com a quantidade total de produtos selecionados
        let total = totalProducts();
        btnNext.innerText = `Continuar (${total})`;
    })};

function totalProducts() {
    qtdProducts = 0;
    const qtdElement = document.querySelectorAll('.qtd');
    for (let element of qtdElement) {
        qtdProducts += parseInt(element.textContent)    
    };
    return qtdProducts;
};

// Função para criar o card do produto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'border-0 card mb-3 w-100';

    card.innerHTML = `
        <div class="row g-0 align-items-center">
            <div class="col-3 d-flex align-items-center flex-column">
                <img class="product-img" src="${product.img}">
            </div>

            <div class="col-6">
                <div class="card-body">
                    <p class="product-name card-title text-start">${product.name}</p>
                    <p class="product-price text-start">R$ ${product.price}</p>
                </div>
            </div>
            
            <div class="col-3 d-flex align-items-start justify-content-around gap-3">
                <img class="btn-product" data-action="sub" src="../assets/icons/less.svg" alt="">
                <p class="qtd text-dark">0</p>
                <img class="btn-product" data-action="add" src="../assets/icons/add.svg" alt="">
            </div>
        </div>
    `;

    return card;
}

