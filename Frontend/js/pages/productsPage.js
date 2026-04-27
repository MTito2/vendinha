import { getProducts } from '../api/productApi.js';
import { setStorage } from '../services/storage.js';
import { getStorage } from '../services/storage.js';

const API_URL = window.APP_CONFIG.API_URL;
const productsContainer = document.getElementById('products-container');
const listProucts = []
const btnNext = document.getElementById('btn-next');
const spinner = document.getElementById('spinner');
let counter = 0;
let qtdProducts = 0;

const alertDiv = document.createElement("div");
alertDiv.className = "alert alert-danger position-absolute text-center p-2";
alertDiv.id = "alert-div";
alertDiv.style.display = "none";
btnNext.parentElement.appendChild(alertDiv);

await activeSpinner();

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
    console.log(product);
    if (product.active) {
        const productCard = createProductCard(product, product.id);
        productsContainer.appendChild(productCard);
    }
}

totalProducts();    

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
        totalProducts();

    })};

// Adicionar evento ao botão "Continuar" para salvar os produtos selecionados no localStorage
btnNext.addEventListener('click', () => {

    if (qtdProducts === 0) {
        alertDiv.textContent = "Por favor, selecione ao menos um produto.";
        alertDiv.style.display = "block";  

        setTimeout(() => {
            alertDiv.style.display = "none";
            }, 3000); 

     }
     else { window.location.href = "../pages/payment.html"; }

    const allProducts = productsContainer.querySelectorAll('.card-produto');

    for (let product of allProducts) {
        const productName = product.querySelector('.product-name').textContent;
        const productPrice = product.querySelector('.product-price').textContent;
        const productQtd = product.querySelector('.qtd').textContent;
        const productId = product.children[0].id.split('-')[1];

        console.log(`Id: ${productId}, Produto: ${productName}, Preço: ${productPrice}, Quantidade: ${productQtd}`);

        if (productQtd > 0) {       
            const productData = {
                id: productId,
                name: productName,
                price: productPrice.replace('R$ ', '').replace(',', '.'),
                quantity: productQtd
            };
            
            listProucts.push(productData);
        }
    }
    // Salvar a lista de produtos selecionados no localStorage
    localStorage.removeItem("products");
    setStorage("products", listProucts);
    console.log(getStorage("products"))

});

function totalProducts() {
    qtdProducts = 0;
    const qtdElement = document.querySelectorAll('.qtd');
    for (let element of qtdElement) {
        qtdProducts += parseInt(element.textContent)    
    };
    btnNext.innerText = `Continuar (${qtdProducts})`;
};

// Função para criar o card do produto
function createProductCard(product, id) {
    const productsInStorage = getStorage("products") || [];
    const productInStorage = productsInStorage.find(p => p.id === id);
    const initialQtd = productInStorage ? productInStorage.quantity : 0;

    const card = document.createElement('div');
    card.className = 'card-produto border-0 card mb-3 w-100';

    card.innerHTML = `
        <div id="product-${product.id}" class="product row g-0 align-items-center">
            <div class="col-3 d-flex align-items-center flex-column">
                <img class="product-img" src="${API_URL}/${product.img}">
            </div>

            <div class="col-6">
                <div class="card-body">
                    <p class="product-name card-title text-start">${product.name}</p>
                    <p class="product-price text-start">R$ ${product.price}</p>
                </div>
            </div>
            
            <div class="col-3 d-flex align-items-start justify-content-around gap-3">
                <img class="btn-product" data-action="sub" src="../assets/icons/less.svg" alt="">
                <p class="qtd text-dark">${initialQtd}</p>
                <img class="btn-product" data-action="add" src="../assets/icons/add.svg" alt="">
            </div>
        </div>
    `;

    return card;
}

async function activeSpinner() {
    const response = await getProducts();
     spinner.classList.remove('d-none');
    let products = response;
    if (products != null) { 
        spinner.classList.add('d-none');
    }
}
