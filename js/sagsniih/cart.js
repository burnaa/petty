import Product from "./product.js";
export let count = 0;
export default class Cart {
    constructor() {
        this.cart = new Map();
    }

    render() {
        let sagsString = ``;
        if (this.cart.size > 0)
            this.cart.forEach(
                (key) =>
                sagsString += `<div>${(new Product(app.products.get(key))).renderCompact()} </div>`
            );
        return sagsString;
    }


    addProduct(id) {
        let count = 1;

        if (this.cart.has(id))
            count = Number(this.cart.get(id)) + 1;

        this.cart.set(id, count);
        count++;
    }
}



