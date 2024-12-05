export default class Product {
    constructor(prod) {
        this.id = prod.id;
        this.name = prod.article.title;
        this.type = prod.article.category;
        this.size = prod.article.options.sizes.map(size => size.label);
        this.color = prod.article.options.colors.map(color => color.label);
        this.origin = prod.article.details.origin;
        this.certification = prod.article.details.certification;
        this.mainpic = prod.mainImage.src;
        this.subpic = prod.thumbnails.map(thumbnail => thumbnail.src);
        this.category = prod.article.category;
        this.age = [prod.article.details.manufactureDate, prod.article.details.expiryDate];
        this.price = {
            currency: prod.article.price.currency,
            amount: prod.article.price.amount
        };
    }

    render() {
        return `<div class="container">
            <ul class="jagsaah">
                ${this.subpic.map((src, index) => `
                    <li id="thumbnail-${this.id}-${index}">
                        <img src="${src}" alt="Thumbnail ${index + 1}">
                    </li>`).join('')}
            </ul>
            <div id="mainpicture">
                <img class="big" src="${this.mainpic}" alt="Main Product Image">
            </div>
            <article>
                <h2 id="title">${this.name}</h2>
                <pre>${this.type}</pre>
                <aside class="songolt">
                    <pre>Хэмжээ</pre>
                    <form>
                        ${this.size.map((size, index) => `
                            <input type="radio" name="choice_size" id="size${this.id}-${index}" value="${size}">
                            <label for="size${this.id}-${index}">${size}</label>
                        `).join('')}
                    </form>
                </aside>
                <aside>
                    <pre>Өнгө</pre>
                    <form>
                        ${this.color.map((color, index) => `
                            <input type="radio" name="choice_color" id="color${this.id}-${index}" value="${color}">
                            <label for="color${this.id}-${index}">${color}</label>
                        `).join('')}
                    </form>
                </aside>
                <p id="uildverlesen">Үйлдвэрлэгдсэн огноо: ${this.age[0]}</p>
                <p id="expire">Дуусах огноо: ${this.age[1]}</p>
                <p id="origin">Бүтээгдэхүүний гарал: ${this.origin}</p>
                <p id="standart">Баталгаажуулалт: ${this.certification}</p>
                <span id="currency">${this.price.currency}</span>
                <span id="total">${this.price.amount}</span>
                <br>
                <button class="cart-button" data-id="${this.id}">🛒Сагсанд нэмэх🛒</button>
            </article>
        </div>`;
    }

    setupAddToCartButton() {
        const buttons = document.querySelectorAll(`.cart-button[data-id="${this.id}"]`);
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const sizeElement = document.querySelector(`input[name="choice_size"]:checked`);
                if (!sizeElement) {
                    alert("Хэмжээг сонгоно уу.");
                    return;
                }
                const size = sizeElement.value;

                const colorElement = document.querySelector(`input[name="choice_color"]:checked`);
                if (!colorElement) {
                    alert("Өнгөө сонгоно уу.");
                    return;
                }
                const color = colorElement.value;

                // app.cart.addProduct болон app.refreshCart функцийг дуудна
                app.cart.addProduct(this.id, { size, color });
                app.refreshCart();
            });
        });
    }

    renderCompact() {
        return `<section class="product">
            <aside id="egnee">
                <h3>${this.name}</h3>
                <button class="delete-btn">❌</button>
            </aside>
            <a href="oneProduct.html">
                <img src="${this.mainpic}" alt="product">
            </a>
            <div>
                <button id="increment">➕</button>
                <span id="quantity" style="font-size: 18px; font-weight: bold;">3</span>
                <button id="decrement">➖</button>
            </div>
            <p>${this.price.currency}${this.price.amount}<span>₮</span></p>
        </section>`;
    }
}

// JSON өгөгдөл fetch хийх
fetch('products.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('JSON файлыг уншихад алдаа гарлаа.');
        }
        return response.json();
    })
    .then(data => {
        // JSON датагаас Product объектууд үүсгэх
        const products = data.map(prod => new Product(prod));
        // Render хийх
        const productContainer = document.getElementById('product-list');
        products.forEach(product => {
            productContainer.innerHTML += product.render();
        });

        // Add-to-cart товчийг идэвхжүүлэх
        products.forEach(product => {
            product.setupAddToCartButton();
        });
    })
    .catch(error => {
        console.error('Алдаа:', error);
    });

// Dummy app object
const app = {
    cart: {
        addProduct: (id, options) => {
            console.log(`Product ID: ${id} нэмэгдлээ. Сонголтууд:`, options);
        }
    },
    refreshCart: () => {
        console.log("Сагсыг шинэчиллээ.");
    }
};
