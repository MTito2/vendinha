import { getProducts } from '../api/productApi.js';
const productsContainer = document.getElementById('products-container');

let response = await getProducts();
let products = response;
const formattedProducts = products.map(product => {
    return {
        ...product,
        price: product.price.toFixed(2).replace('.', ',')
    };
});

for (let product of formattedProducts) {
    const productCard = createProductCard(product);
    productsContainer.appendChild(productCard);
}

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
                <img src="../assets/icons/less.svg" alt="">
                <p class="text-dark">0</p>
                <img src="../assets/icons/add.svg" alt="">
            </div>
        </div>
    `;

    return card;
}
