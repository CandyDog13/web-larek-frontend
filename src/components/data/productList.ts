import { IProduct, IProductList } from "../../types";
import { IEvents } from "../base/events";

export class ProductList implements IProductList {
    protected _products: IProduct[];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
        this._products=[];
    }

    set products(products:IProduct[]) {
        this._products=products;
        this.events.emit('products:changed', this._products);
    }

    get products() {
        return this._products;
    }

    getProductById(productId:string) {
        return this._products.find((product)=>product.id === productId);
    }
}